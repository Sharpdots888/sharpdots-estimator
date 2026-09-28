const { randomUUID } = require('node:crypto');
const M = require('../crm/model');
const { createCrmAccess } = require('./crm-access');
const collections = Object.keys(M.collectionMeta);
const fail = (statusCode, message) => Object.assign(new Error(message), { statusCode });
const object = x => x && typeof x === 'object' && !Array.isArray(x);
const text = (x, max = 1000) => String(x ?? '').trim().slice(0, max);
const positiveId = x => /^\d+$/.test(String(x)) && Number(x) > 0;
const uuid = x => /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(String(x));

function normalize(input) {
  if (!object(input) || !text(input.title, 500)) throw fail(400, 'Opportunity name is required');
  const o = M.make();
  for (const k of ['title','account','contact','email','owner','kind','source','stage','status','close','notes','lostReason']) o[k] = text(input[k], k === 'notes' ? 10000 : 500);
  for (const k of ['oneTime','monthly','term']) o[k] = Number(input[k]);
  if (![o.oneTime,o.monthly].every(v => Number.isFinite(v) && v >= 0 && v < 1e12) || !Number.isInteger(o.term) || o.term < 1 || o.term > 1200) throw fail(400, 'Invalid commercial amounts or term');
  if (!['Print','Services','Mixed'].includes(o.kind) || !M.stages.some(s => s.id === o.stage) || !['open','won','lost'].includes(o.status)) throw fail(400, 'Invalid opportunity state');
  if (o.close && !/^\d{4}-\d{2}-\d{2}$/.test(o.close)) throw fail(400, 'Invalid close date');
  if (o.status === 'lost' && !o.lostReason) throw fail(400, 'Lost reason is required');
  if ((o.stage === 'won') !== (o.status === 'won')) throw fail(400, 'Won stage and status must agree');
  for (const k of Object.keys(o.qualification)) o.qualification[k] = input.qualification?.[k] === true;
  o.accountRef = input.accountRef || null; o.contactRef = input.contactRef || null;
  o.ownerId = input.ownerId;
  if ([o.accountRef,o.contactRef].some(v => v && !uuid(v)) || !positiveId(o.ownerId)) throw fail(400, 'Invalid customer or owner reference');
  o.approval = { method:text(input.approval?.method), reference:text(input.approval?.reference, 4000) };
  if(!['','Purchase order','Written approval','No signature required'].includes(o.approval.method))throw fail(400,'Invalid approval method');
  o.activities = (Array.isArray(input.activities) ? input.activities : []).slice(0, 500).map(a => ({id:uuid(a.id)?a.id:randomUUID(),title:text(a.title),kind:text(a.kind),due:text(a.due),owner:text(a.owner),done:a.done===true}));
  if(input.activities?.length>500 || input.records?.length>200)throw fail(400,'Too many activities or record links');
  if (o.activities.some(a => !a.title || !/^\d{4}-\d{2}-\d{2}$/.test(a.due))) throw fail(400,'Activity title and due date are required');
  for (const lane of ['production','engagement']) {
    const h = input.handoffs?.[lane] || {};
    o.handoffs[lane] = {status:text(h.status),owner:text(h.owner),target:text(h.target),scope:text(h.scope,10000),assets:h.assets===true};
    if (!['not-required','draft','queued','accepted'].includes(h.status)) throw fail(400,'Invalid handoff status');
  }
  const b = input.billing || {};
  for (const k of Object.keys(o.billing)) o.billing[k] = k === 'deposit' ? Number(b[k] || 0) : text(b[k]);
  if (!['not-ready','ready'].includes(o.billing.status) || !Number.isFinite(o.billing.deposit) || o.billing.deposit < 0 || o.billing.deposit > 100) throw fail(400,'Invalid billing readiness');
  return o;
}

function createOpportunityStore(pool, crmAccess = createCrmAccess()) {
  async function actor(user, c = pool) {
    if (!positiveId(user?.id)) throw fail(401,'Portal authentication required');
    const r = (await c.query('SELECT id,username,is_admin,is_active FROM public.users WHERE id=$1',[user.id])).rows[0];
    if (!crmAccess.allowsUser(user, r)) throw fail(403,'CRM access is not enabled for this Portal user');
    return r;
  }
  async function transaction(fn) {
    const c = await pool.connect();
    try { await c.query('BEGIN'); const result=await fn(c); await c.query('COMMIT'); return result; }
    catch(e) { await c.query('ROLLBACK'); throw e; } finally { c.release(); }
  }
  async function recordList(c = pool) {
    // Return each immutable version; UI chooses which one to attach.
    return (await c.query(`SELECT r.id::text,r.collection,r.number,v.name,v.version,v.snapshot,v.created_at AS "updatedAt"
      FROM public.sfpq_crm_records r JOIN public.sfpq_crm_record_versions v ON v.record_id=r.id ORDER BY r.id,v.version`)).rows;
  }
  async function documents(c, links) {
    const offers = links.filter(r => r.collection === 'proposals');
    if (!offers.length) return [];
    const ready = (await c.query("SELECT to_regclass('public.sfpq_document_transactions') AS t")).rows[0].t;
    if (!ready) return [];
    const rows = (await c.query(`SELECT t.transaction_id::text AS id,t.proposal_number AS number,t.proposal_version AS version,
      t.status,t.recipient_email AS recipient,t.provider_submission_id AS reference,t.updated_at AS "updatedAt"
      FROM public.sfpq_document_transactions t WHERE t.proposal_number=ANY($1::text[])`,[offers.map(r=>r.number)])).rows;
    return rows.map(d=>({...d,primary:offers.some(r=>r.number===d.number && r.version===d.version && r.role==='Primary offer')}));
  }
  async function get(id,c=pool) {
    const row=(await c.query(`SELECT o.*,s.state,u.username FROM public.sfpq_opportunities o
      LEFT JOIN public.sfpq_opportunity_state s ON s.opportunity_id=o.id
      LEFT JOIN public.users u ON u.id=o.owner_operator_ref WHERE o.id=$1`,[id])).rows[0];
    if (!row) throw fail(404,'Opportunity not found');
    const records=(await c.query(`SELECT r.id::text,r.collection,r.number,v.name,l.version,l.role,v.snapshot
      FROM public.sfpq_opportunity_records l JOIN public.sfpq_crm_records r ON r.id=l.record_id
      JOIN public.sfpq_crm_record_versions v ON v.record_id=l.record_id AND v.version=l.version WHERE l.opportunity_id=$1`,[id])).rows;
    const history=(await c.query(`SELECT a.id::text,a.action AS text,a.created_at AS at,u.username AS operator
      FROM public.sfpq_opportunity_audit a JOIN public.users u ON u.id=a.operator_id WHERE opportunity_id=$1 ORDER BY a.id DESC LIMIT 100`,[id])).rows;
    return M.make({...row.state,id:String(row.id),creationKey:row.creation_key,number:row.opportunity_number,rowVersion:Number(row.row_version),title:row.name,
      account:row.account_name,contact:row.contact_name,email:row.contact_email,accountRef:row.account_ref,contactRef:row.contact_ref,
      owner:row.username||'Unassigned',ownerId:row.owner_operator_ref,kind:row.offering,source:row.lead_source,notes:row.brief,
      stage:row.stage,status:row.status,oneTime:Number(row.one_time_amount),monthly:Number(row.monthly_amount),term:row.initial_term_months,
      close:row.expected_close_date ? new Date(row.expected_close_date).toISOString().slice(0,10) : '',
      qualification:{need:row.qualified_need,budget:row.qualified_budget,authority:row.qualified_authority,timing:row.qualified_timing},
      createdAt:row.created_at,stageSince:row.stage_entered_at,closedAt:row.closed_at,
      lostReason:row.lost_reason||'',records,documents:(await documents(c,records)).map(d=>({...d,superseded:(row.state?.invalidatedDocuments||[]).includes(d.id)})),history,containerId:`crm-${row.id}`});
  }
  async function lookups(user) {
    await actor(user);
    return {user,users:(await pool.query('SELECT id,username FROM public.users WHERE is_active=true ORDER BY username')).rows,
      companies:(await pool.query('SELECT company_id AS id,legal_name AS name FROM public.sfvc_companies ORDER BY legal_name')).rows,
      contacts:(await pool.query(`SELECT p.person_id AS id,p.first_name || ' ' || p.last_name AS name,p.email,cp.company_id AS "companyId"
        FROM public.sfvc_people p JOIN public.sfvc_company_people cp ON cp.person_id=p.person_id ORDER BY p.last_name`)).rows};
  }
  async function createCompany(user,input) {
    return transaction(async c=>{
      await actor(user,c);
      if(!object(input))throw fail(400,'Client details are required');
      const name=text(input.name,500),id=input.creationKey;
      if(!name||!uuid(id))throw fail(400,'Client name and creation key are required');
      await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',['crm-company:'+name.toLowerCase()]);
      const prior=(await c.query('SELECT company_id AS id,legal_name AS name FROM public.sfvc_companies WHERE company_id=$1',[id])).rows[0];
      if(prior){if(prior.name!==name)throw fail(409,'Client creation key already used');return prior;}
      if((await c.query('SELECT 1 FROM public.sfvc_companies WHERE lower(btrim(legal_name))=lower($1)',[name])).rowCount)throw fail(409,'A client with this name already exists. Select the existing client.');
      return (await c.query("INSERT INTO public.sfvc_companies(company_id,legal_name,company_type) VALUES($1,$2,'customer') RETURNING company_id AS id,legal_name AS name",[id,name])).rows[0];
    });
  }
  async function createContact(user,input) {
    return transaction(async c=>{
      await actor(user,c);
      if(!object(input))throw fail(400,'Contact details are required');
      const id=input.creationKey,companyId=input.companyId,first=text(input.firstName,200),last=text(input.lastName,200),email=text(input.email,320).toLowerCase();
      if(!uuid(id)||!uuid(companyId)||!first||!last)throw fail(400,'Select a client and enter the contact first and last name');
      if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw fail(400,'Enter a valid contact email');
      if(!(await c.query('SELECT 1 FROM public.sfvc_companies WHERE company_id=$1',[companyId])).rowCount)throw fail(400,'Selected client no longer exists');
      await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',['crm-contact:'+(email||companyId+':'+first.toLowerCase()+':'+last.toLowerCase())]);
      const prior=(await c.query(`SELECT p.person_id AS id,p.first_name,p.last_name,p.email,cp.company_id AS "companyId" FROM public.sfvc_people p JOIN public.sfvc_company_people cp ON cp.person_id=p.person_id WHERE p.person_id=$1 AND cp.company_id=$2`,[id,companyId])).rows[0];
      if(prior){if(prior.first_name!==first||prior.last_name!==last||(prior.email||'')!==email)throw fail(409,'Contact creation key already used');return {id,name:first+' '+last,email,companyId};}
      if(email&&(await c.query('SELECT 1 FROM public.sfvc_people WHERE lower(email)=$1',[email])).rowCount)throw fail(409,'This email already belongs to a contact. Select that contact or link them to this client in the customer database.');
      if((await c.query('SELECT 1 FROM public.sfvc_people p JOIN public.sfvc_company_people cp ON cp.person_id=p.person_id WHERE cp.company_id=$1 AND lower(btrim(p.first_name))=lower($2) AND lower(btrim(p.last_name))=lower($3)',[companyId,first,last])).rowCount)throw fail(409,'This client already has a contact with that name. Select the existing contact.');
      await c.query('INSERT INTO public.sfvc_people(person_id,first_name,last_name,email) VALUES($1,$2,$3,$4)',[id,first,last,email||null]);
      await c.query('INSERT INTO public.sfvc_company_people(company_id,person_id) VALUES($1,$2)',[companyId,id]);
      return {id,name:first+' '+last,email,companyId};
    });
  }
  async function list(user) {
    await actor(user);
    const ids=(await pool.query('SELECT id FROM public.sfpq_opportunities WHERE archived_at IS NULL ORDER BY id DESC')).rows;
    const opportunities=[]; for(const r of ids) opportunities.push(await get(r.id));
    return {opportunities,records:await recordList()};
  }
  async function save(user,id,input) {
    return transaction(async c=>{
      const who=await actor(user,c),o=normalize(input);
      if (!(await c.query('SELECT id FROM public.users WHERE id=$1 AND is_active=true',[o.ownerId])).rowCount) throw fail(400,'Select an active owner');
      if (o.contactRef && (!o.accountRef || !(await c.query('SELECT 1 FROM public.sfvc_company_people WHERE company_id=$1 AND person_id=$2',[o.accountRef,o.contactRef])).rowCount)) throw fail(400,'Contact does not belong to selected company');
      let old=null;
      if (id) {
        await c.query('SELECT id FROM public.sfpq_opportunities WHERE id=$1 FOR UPDATE',[id]); old=await get(id,c);
        if (old.rowVersion!==Number(input.rowVersion)) throw fail(409,'This opportunity changed. Reload before saving.');
      } else {
        if (!uuid(input.creationKey)) throw fail(400,'Creation retry key required');
        await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',[input.creationKey]);
        const prior=(await c.query('SELECT id FROM public.sfpq_opportunities WHERE creation_key=$1',[input.creationKey])).rows[0];
        if(prior) return get(prior.id,c);
      }
      const links=[];
      for(const link of (Array.isArray(input.records)?input.records:[]).slice(0,200)) {
        if(!positiveId(link.id)||!Number.isInteger(Number(link.version))||!['Primary offer','Component','Cost basis','Alternative'].includes(link.role)) throw fail(400,'Invalid record link');
        const r=(await c.query(`SELECT r.id::text,r.number,r.collection,v.version FROM public.sfpq_crm_records r
          JOIN public.sfpq_crm_record_versions v ON v.record_id=r.id WHERE r.id=$1 AND v.version=$2`,[link.id,link.version])).rows[0];
        if(!r)throw fail(400,'Save the record version before attaching it');
        if(link.role==='Primary offer'&&!['proposals','printQuotes'].includes(r.collection))throw fail(400,'Primary offer must be a proposal or print quote');
        links.push({...r,role:link.role});
      }
      if(new Set(links.map(r=>r.id)).size!==links.length||links.filter(r=>r.role==='Primary offer').length>1)throw fail(400,'Duplicate record or primary offer');
      o.records=links; o.documents=await documents(c,links);
      const changed=old&&(['oneTime','monthly','term','account','accountRef','contact','contactRef','email'].some(k=>old[k]!==o[k])||JSON.stringify(old.records.map(r=>[r.id,r.version,r.role]).sort())!==JSON.stringify(links.map(r=>[r.id,r.version,r.role]).sort()));
      if(changed) {o.approval={method:'',reference:''};o.documents=o.documents.map(d=>({...d,superseded:true})); if(o.status==='won')throw fail(409,'Reopen before changing agreed terms or linked versions');}
      const invalidatedDocuments=[...new Set([...(old?.invalidatedDocuments||[]),...(changed?o.documents.map(d=>d.id):[])])];
      o.documents=o.documents.map(d=>({...d,superseded:invalidatedDocuments.includes(d.id)}));
      if(old?.status==='won'&&o.status==='open') {Object.values(o.handoffs).forEach(h=>{if(h.status!=='not-required')h.status='draft';});o.billing.status='not-ready';}
      // Client-supplied signing status is never used for acceptance.
      if(o.status==='won'&&M.closeIssues(o).length)throw fail(400,M.closeIssues(o).join(' '));
      for(const lane of ['production','engagement']) if(['queued','accepted'].includes(o.handoffs[lane].status)&&M.handoffIssues(o,lane).length)throw fail(400,M.handoffIssues(o,lane).join(' '));
      for(const lane of ['production','engagement']) if(o.handoffs[lane].status==='accepted'&&!['queued','accepted'].includes(old?.handoffs[lane]?.status))throw fail(400,'Queue the handoff before acknowledging receipt');
      if(o.billing.status==='ready'&&M.billingIssues(o).length)throw fail(400,M.billingIssues(o).join(' '));
      const values=[o.title,o.account,o.contact,o.email,o.accountRef,o.contactRef,o.ownerId,o.kind,o.source,o.notes,o.stage,o.status,o.close||null,
        o.oneTime,o.monthly,o.term,o.qualification.need,o.qualification.budget,o.qualification.authority,o.qualification.timing,
        o.status==='open'?null:(old?.status===o.status&&old.closedAt?old.closedAt:new Date()),o.lostReason||null,who.id];
      const columns=['name','account_name','contact_name','contact_email','account_ref','contact_ref','owner_operator_ref','offering','lead_source','brief','stage','status','expected_close_date','one_time_amount','monthly_amount','initial_term_months','qualified_need','qualified_budget','qualified_authority','qualified_timing','closed_at','lost_reason','updated_by_operator_ref'];
      if(id) await c.query(`UPDATE public.sfpq_opportunities SET ${columns.map((k,i)=>`${k}=$${i+1}`).join(',')} WHERE id=$${values.length+1}`,[...values,id]);
      else id=(await c.query(`INSERT INTO public.sfpq_opportunities (${columns.join(',')},creation_key,created_by_operator_ref) VALUES (${values.map((_,i)=>`$${i+1}`).join(',')},$24,$25) RETURNING id`,[...values,input.creationKey,who.id])).rows[0].id;
      const state={approval:o.approval,activities:o.activities,handoffs:o.handoffs,billing:o.billing,invalidatedDocuments};
      await c.query(`INSERT INTO public.sfpq_opportunity_state VALUES ($1,$2) ON CONFLICT (opportunity_id) DO UPDATE SET state=EXCLUDED.state`,[id,state]);
      await c.query('DELETE FROM public.sfpq_opportunity_records WHERE opportunity_id=$1',[id]);
      for(const r of links)await c.query('INSERT INTO public.sfpq_opportunity_records VALUES ($1,$2,$3,$4)',[id,r.id,r.version,r.role]);
      const note=text(input.note,4000);
      const auditShape=x=>x?{title:x.title,account:x.account,contact:x.contact,ownerId:x.ownerId,stage:x.stage,status:x.status,oneTime:x.oneTime,monthly:x.monthly,term:x.term,qualification:x.qualification,approval:x.approval,handoffs:x.handoffs,billing:x.billing,activities:x.activities,records:x.records.map(r=>({id:r.id,version:r.version,role:r.role}))}:null;
      await c.query('INSERT INTO public.sfpq_opportunity_audit (opportunity_id,operator_id,action,detail) VALUES ($1,$2,$3,$4)',[id,who.id,note?`Note: ${note}`:old?'Opportunity updated':'Opportunity created',{before:auditShape(old),after:auditShape(o)}]);
      return get(id,c);
    });
  }
  async function saveRecord(user,id,input) {
    return transaction(async c=>{
      const who=await actor(user,c);
      if(!collections.includes(input.collection)||!object(input.snapshot)||!text(input.name)||JSON.stringify(input.snapshot).length>2000000)throw fail(400,'Invalid record snapshot');
      let row;
      if(id) {
        row=(await c.query('SELECT * FROM public.sfpq_crm_records WHERE id=$1 FOR UPDATE',[id])).rows[0];
        if(!row)throw fail(404,'Record not found');
        if(row.collection!==input.collection||row.version!==Number(input.version))throw fail(409,'Record has changed; load latest version');
        row=(await c.query('UPDATE public.sfpq_crm_records SET version=version+1,name=$2 WHERE id=$1 RETURNING *',[id,text(input.name)])).rows[0];
      } else {
        if(!uuid(input.creationKey))throw fail(400,'Record creation retry key required');
        await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',[input.creationKey]);
        row=(await c.query('SELECT * FROM public.sfpq_crm_records WHERE creation_key=$1',[input.creationKey])).rows[0];
        if(row)return (await recordList(c)).find(r=>r.id===String(row.id)&&r.version===row.version);
        // Shared DB allocation, not a browser counter. Reserve a separate CRM range
        // to avoid unimported browser-local record identities in the pilot.
        const n=(await c.query("SELECT nextval('public.sfpq_crm_records_id_seq') AS n")).rows[0].n;
        const number=M.collectionMeta[input.collection][1]+'-'+String(Number(n)+100000).padStart(6,'0');
        row=(await c.query(`INSERT INTO public.sfpq_crm_records (id,creation_key,collection,number,name,version,created_by)
          OVERRIDING SYSTEM VALUE VALUES ($1,$2,$3,$4,$5,1,$6) RETURNING *`,[n,input.creationKey,input.collection,number,text(input.name),who.id])).rows[0];
      }
      await c.query('INSERT INTO public.sfpq_crm_record_versions (record_id,version,name,snapshot,created_by) VALUES ($1,$2,$3,$4,$5)',[row.id,row.version,row.name,input.snapshot,who.id]);
      return {id:String(row.id),number:row.number,collection:row.collection,name:row.name,version:row.version,snapshot:input.snapshot};
    });
  }
  return {lookups,list,save,saveRecord,createCompany,createContact};
}
module.exports={createOpportunityStore,normalize};
