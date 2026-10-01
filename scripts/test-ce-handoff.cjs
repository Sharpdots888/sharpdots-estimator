const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { PGlite } = require('@electric-sql/pglite');
const { createOpportunityStore } = require('../lib/opportunity-store');
const { digest, afterSave } = require('../lib/ce-handoff');
const { handoffConnectionConfig, createHandoffTransport, INTAKE_URL } = require('../lib/ce-handoff-transport');
const adapter = require('../services/ce-catalog');
const M = require('../crm/model');
const admin = { id: 45, isAdmin: true };
const configuration = () => adapter.selectProducts(adapter.adaptCatalog(require('../services/ce-fixture.cjs').sourceFixture(), {id:3,slug:'sharpdots'}), ['service-a']);
const receipt = (key, packet) => ({ schema:'ce-estimator-intake-receipt-v1', idempotencyKey:key, sha256:packet.sha256,
  engagementId: 'a76465a1-cef7-4279-819c-75f6a712c0f1', status:'intake-review', receivedAt:'2026-09-30T12:00:00.000Z' });

async function fixture(transport={enabled:false}) {
  const db = new PGlite();
  const query = async(sql, values) => { const r=await db.query(sql,values);return {...r,rowCount:r.rows.length||r.affectedRows||0}; };
  const client = {query,release(){}};
  await db.exec(`CREATE ROLE db_admin;CREATE TABLE users(id integer PRIMARY KEY,username text,is_admin boolean,is_active boolean);
    INSERT INTO users VALUES(45,'account-lead',true,true),(46,'denied',false,true);
    CREATE TABLE sfvc_companies(company_id uuid PRIMARY KEY);CREATE TABLE sfvc_people(person_id uuid PRIMARY KEY);
    CREATE TABLE sfvc_company_people(company_id uuid,person_id uuid);`);
  for(const name of ['001_sfpq_opportunities.sql','002_opportunity_persistence.sql'])await db.exec(readFileSync(path.join(__dirname,'../migrations',name),'utf8'));
  const accountRef=randomUUID(),contactRef=randomUUID();
  await query('INSERT INTO sfvc_companies VALUES($1)',[accountRef]);
  await query('INSERT INTO sfvc_people VALUES($1)',[contactRef]);
  await query('INSERT INTO sfvc_company_people VALUES($1,$2)',[accountRef,contactRef]);
  const store=createOpportunityStore({...client,connect:async()=>client},undefined,transport);
  const services=await store.saveRecord(admin,null,{collection:'services',name:'Pinned service',creationKey:randomUUID(),snapshot:{serviceEngagement:{catalogConfiguration:configuration()}}});
  const proposal=await store.saveRecord(admin,null,{collection:'proposals',name:'Accepted offer',creationKey:randomUUID(),snapshot:{proposal:{title:'Accepted offer',includedSections:['services'],sourceRecords:{services:{number:services.number,version:1}}}}});
  let o=await store.save(admin,null,M.make({title:'CE intake test',kind:'Services',ownerId:45,owner:'account-lead',account:'Synthetic client',contact:'Synthetic buyer',accountRef,contactRef,
    email:'buyer@example.invalid',oneTime:1000,monthly:2000,term:3,creationKey:randomUUID(),records:[{...proposal,role:'Primary offer'}],
    handoffs:{production:{status:'not-required'},engagement:{status:'draft',owner:'account-lead',target:'2026-10-01',scope:'Saved scope',assets:false}}}));
  o=await store.save(admin,o.id,{...o,approval:{method:'Purchase order',reference:'SYNTHETIC-PO'}});
  o=await store.save(admin,o.id,{...o,status:'won',stage:'won'});
  return { db,query,store,o,services,proposal,load:async()=>(await store.list(admin)).opportunities[0],
    ledger:async()=>(await query('SELECT state FROM sfpq_opportunity_state WHERE opportunity_id=$1',[o.id])).rows[0].state.ceHandoff };
}

test('close creates intake; preparation pins saved versions and cannot claim delivery authority',async()=>{
  const f=await fixture();
  try{
    let o=f.o;
    assert.equal(o.ceHandoff.status,'needs-review');
    await f.store.saveRecord(admin,f.services.id,{collection:'services',name:'New service version',version:1,snapshot:{serviceEngagement:{catalogConfiguration:adapter.configureProduct(configuration(),'service-a','media:monthly',{included:false})}}});
    o=await f.store.prepareCeHandoff(admin,o.id,{rowVersion:o.rowVersion});
    const h=await f.ledger();
    assert.equal(o.ceHandoff.status,'ready');assert.equal(o.ceHandoffEnabled,false);
    assert.equal(o.ceHandoff.services.version,1);assert.equal(h.packet.servicePricing.termPriceCents,412500);
    assert.equal(h.packet.agreedOpportunity.monthlyCents,200000);
    assert.equal(h.packet.acceptance.method,'operator-attested');
    assert.deepEqual(h.packet.admission,{workTrackingAllowed:false,externalExecution:false,invoicing:false});
    assert.equal(o.ceHandoff.packet,undefined);assert.equal(o.ceHandoff.configuration,undefined);
    assert.ok(h.packet.review.issues.includes('Confirm assets and dependencies'));
    const {sha256,...body}=h.packet;assert.equal(sha256,digest(body));
    assert.equal(h.packet.source.services.sha256,digest(h.packet.snapshots.services));
    const legacy={...o,note:'Unrelated note',ceHandoff:{status:'received',receipt:{engagementId:'forged'}}};
    o=await f.store.save(admin,o.id,legacy);assert.deepEqual(await f.ledger(),h);
    await assert.rejects(f.store.sendCeHandoff(admin,o.id,{rowVersion:o.rowVersion}),e=>e.statusCode===503);
    assert.equal((await f.ledger()).attempts,0);
    await assert.rejects(f.store.prepareCeHandoff({id:46,isAdmin:true},o.id,{rowVersion:o.rowVersion}),e=>e.statusCode===403);
    await assert.rejects(f.store.prepareCeHandoff(null,o.id,{rowVersion:o.rowVersion}),e=>e.statusCode===401);
    await assert.rejects(f.store.prepareCeHandoff(admin,o.id,{rowVersion:1}),e=>e.statusCode===409);
    await assert.rejects(f.store.save(admin,o.id,{...o,handoffs:{...o.handoffs,engagement:{...o.handoffs.engagement,status:'accepted',assets:true}}}),/not manually/);
    o=await f.store.save(admin,o.id,{...o,handoffs:{...o.handoffs,engagement:{...o.handoffs.engagement,scope:'Changed scope'}}});
    assert.equal(o.ceHandoff.status,'needs-review');
  }finally{await f.db.close();}
});

test('lost response retries the identical packet and receipt survives reload and reopening',async()=>{
  const seen=[],received=new Map();
  const transport={enabled:true,send:async({packet,idempotencyKey})=>{
    seen.push({packet:structuredClone(packet),idempotencyKey});
    if(!received.has(idempotencyKey)){received.set(idempotencyKey,receipt(idempotencyKey,packet));throw Error('Simulated lost response with private upstream content');}
    return received.get(idempotencyKey);
  }};
  const f=await fixture(transport);
  try{
    let o=await f.store.prepareCeHandoff(admin,f.o.id,{rowVersion:f.o.rowVersion});
    o=await f.store.sendCeHandoff(admin,o.id,{rowVersion:o.rowVersion});
    assert.equal(o.ceHandoff.status,'failed');assert.doesNotMatch(o.ceHandoff.lastError,/private/);
    await assert.rejects(f.store.prepareCeHandoff(admin,o.id,{rowVersion:o.rowVersion}),/already attempted/);
    o=await f.store.sendCeHandoff(admin,o.id,{rowVersion:o.rowVersion});
    assert.equal(o.ceHandoff.status,'received');assert.equal(o.ceHandoff.attempts,2);assert.equal(received.size,1);
    assert.deepEqual(seen[0],seen[1]);assert.equal((await f.load()).ceHandoff.receipt.engagementId,o.ceHandoff.receipt.engagementId);
    await f.store.sendCeHandoff(admin,o.id,{rowVersion:o.rowVersion});assert.equal(seen.length,2);
    o=await f.store.save(admin,o.id,{...o,status:'open',stage:'qualified'});
    assert.equal(o.ceHandoff.status,'amendment-review');assert.ok(o.ceHandoff.receipt);
    await assert.rejects(f.store.sendCeHandoff(admin,o.id,{rowVersion:o.rowVersion}),e=>e.statusCode===409);
    assert.ok(o.history.some(h=>/receipt recorded/.test(h.text)));
  }finally{await f.db.close();}
});

test('authorized retry uses the current Portal actor while preserving the original preparer',async()=>{
  const seen=[];
  const f=await fixture({enabled:true,send:async({packet,idempotencyKey,actor})=>{
    seen.push({packet:structuredClone(packet),idempotencyKey,actorId:actor.id});
    if(seen.length===1)throw Error('Simulated lost response');
    return receipt(idempotencyKey,packet);
  }});
  try{
    await f.query("INSERT INTO users VALUES(47,'second-lead',true,true)");
    let o=await f.store.save(admin,f.o.id,{...f.o,handoffs:{...f.o.handoffs,engagement:{...f.o.handoffs.engagement,owner:'second-lead'}}});
    o=await f.store.prepareCeHandoff(admin,o.id,{rowVersion:o.rowVersion});
    o=await f.store.sendCeHandoff(admin,o.id,{rowVersion:o.rowVersion});
    await f.query('UPDATE users SET is_active=false WHERE id=45');
    await assert.rejects(f.store.sendCeHandoff(admin,o.id,{rowVersion:o.rowVersion}),e=>e.statusCode===403);
    assert.equal(seen.length,1);
    o=await f.store.sendCeHandoff({id:47,isAdmin:true},o.id,{rowVersion:o.rowVersion});
    assert.equal(o.ceHandoff.status,'received');
    assert.deepEqual(seen.map(s=>s.actorId),[45,47]);
    assert.deepEqual(seen[0].packet,seen[1].packet);
    assert.equal(seen[0].idempotencyKey,seen[1].idempotencyKey);
    assert.equal(seen[1].packet.intake.preparedBy,45);
    assert.equal(seen[1].packet.intake.ownerId,47);
  }finally{await f.db.close();}
});

test('source changes while awaiting CE preserve the receipt but require amendment review',async()=>{
  let release,entered;
  const waiting=new Promise(r=>entered=r);
  const transport={enabled:true,send:async({packet,idempotencyKey})=>{entered();await new Promise(r=>release=r);return receipt(idempotencyKey,packet);}};
  const f=await fixture(transport);
  try{
    let o=await f.store.prepareCeHandoff(admin,f.o.id,{rowVersion:f.o.rowVersion});
    const pending=f.store.sendCeHandoff(admin,o.id,{rowVersion:o.rowVersion});
    await waiting;o=await f.load();
    await assert.rejects(f.store.sendCeHandoff(admin,o.id,{rowVersion:o.rowVersion}),/in progress/);
    o=await f.store.save(admin,o.id,{...o,status:'open',stage:'qualified'});
    release();o=await pending;
    assert.equal(o.ceHandoff.status,'amendment-review');assert.ok(o.ceHandoff.receipt);
  }finally{await f.db.close();}
});

test('incomplete source stays a visible review issue; unknown cost is never converted to zero',async()=>{
  const f=await fixture();
  try{
    let o=await f.store.save(admin,f.o.id,{...f.o,handoffs:{...f.o.handoffs,engagement:{...f.o.handoffs.engagement,owner:''}}});
    o=await f.store.prepareCeHandoff(admin,o.id,{rowVersion:o.rowVersion});
    assert.equal(o.ceHandoff.status,'needs-review');assert.match(o.ceHandoff.issues.join(' '),/receiving owner/);
    assert.deepEqual((await f.load()).ceHandoff.issues,o.ceHandoff.issues);
    const {preparePacket}=require('../lib/ce-handoff');
    const config=configuration();config.products[0].recipe[0].unitCost=null;
    const packet=await preparePacket({opportunity:f.o,receivingOwnerId:45,operatorId:45,readRecord:async(collection)=>collection==='proposals'?f.proposal:
      {...f.services,snapshot:{serviceEngagement:{catalogConfiguration:config}}}});
    assert.equal(packet.servicePricing.complete,false);assert.equal(packet.servicePricing.termCostCents,null);
    assert.equal(packet.servicePricing.termPriceCents,null);assert.ok(packet.review.issues.includes('Resolve unknown component costs'));
    await assert.rejects(preparePacket({opportunity:f.o,receivingOwnerId:45,operatorId:45,readRecord:async(collection)=>collection==='proposals'?f.proposal:undefined}),/saved Services version/);
  }finally{await f.db.close();}
});

test('expired delivery lease can recover with the same identity; tampered receipt is not accepted',async()=>{
  const seen=[];
  const f=await fixture({enabled:true,send:async({packet,idempotencyKey})=>{seen.push(idempotencyKey);return {...receipt(idempotencyKey,packet),sha256:'forged'};}});
  try{
    let o=await f.store.prepareCeHandoff(admin,f.o.id,{rowVersion:f.o.rowVersion});
    const h=await f.ledger();h.status='sending';h.attempts=1;h.leaseUntil='2020-01-01T00:00:00.000Z';
    await f.query("UPDATE sfpq_opportunity_state SET state=jsonb_set(state,'{ceHandoff}',$2) WHERE opportunity_id=$1",[o.id,h]);
    o=await f.store.sendCeHandoff(admin,o.id,{rowVersion:o.rowVersion});
    assert.equal(o.ceHandoff.status,'failed');assert.equal(o.ceHandoff.receipt,null);
    assert.equal(o.ceHandoff.attempts,2);assert.equal(seen[0],h.id);
  }finally{await f.db.close();}
});

test('DocuSeal acceptance is server-observed and is rechecked before the HTTP attempt',async()=>{
  let calls=0;
  const f=await fixture({enabled:true,send:async({packet,idempotencyKey})=>{calls++;return receipt(idempotencyKey,packet);}});
  try{
    await f.db.exec('CREATE TABLE sfpq_document_transactions(transaction_id uuid,proposal_number text,proposal_version integer,status text,recipient_email text,provider_submission_id text,updated_at timestamptz)');
    const id=randomUUID();
    await f.query('INSERT INTO sfpq_document_transactions VALUES($1,$2,1,$3,$4,$5,now())',[id,f.proposal.number,'completed','buyer@example.invalid','synthetic-submission']);
    let o=await f.load();o=await f.store.save(admin,o.id,{...o,approval:{method:'',reference:''}});
    o=await f.store.prepareCeHandoff(admin,o.id,{rowVersion:o.rowVersion});
    assert.equal((await f.ledger()).packet.acceptance.transactionId,id);
    await f.query("UPDATE sfpq_document_transactions SET status='declined' WHERE transaction_id=$1",[id]);
    await assert.rejects(f.store.sendCeHandoff(admin,o.id,{rowVersion:o.rowVersion}),/acceptance is no longer current/);
    assert.equal(calls,0);assert.equal((await f.ledger()).attempts,0);
  }finally{await f.db.close();}
});

test('transport is opt-in, uses a separate key, rejects bad receipts, redirects and private errors',async()=>{
  assert.equal(handoffConnectionConfig({}).enabled,false);
  assert.throws(()=>handoffConnectionConfig({ESTIMATOR_CE_HANDOFF_ENABLED:'true',ESTIMATOR_CE_HANDOFF_KEY:'a'.repeat(64),ESTIMATOR_CE_CATALOG_READ_KEY:'a'.repeat(64)}),/dedicated/);
  const config=handoffConnectionConfig({ESTIMATOR_CE_HANDOFF_ENABLED:'true',ESTIMATOR_CE_HANDOFF_KEY:'b'.repeat(64)});
  const packet={sha256:'a'.repeat(64)},idempotencyKey=randomUUID();
  const transport=createHandoffTransport({config,fetchImpl:async(url,options)=>{
    assert.equal(url,INTAKE_URL);assert.equal(options.redirect,'error');assert.equal(options.headers['Idempotency-Key'],idempotencyKey);
    assert.equal(options.headers['X-Estimator-Actor-Id'],'45');assert.equal(options.credentials,'omit');
    return Response.json(receipt(idempotencyKey,packet),{status:201});
  }});
  assert.equal((await transport.send({packet,idempotencyKey,actor:admin})).status,'intake-review');
  for(const response of [Response.json({...receipt(idempotencyKey,packet),sha256:'wrong'}),new Response('',{status:302}),Response.json({secret:'do not reveal'},{status:403}),Response.json({data:'x'.repeat(16001)})]){
    const t=createHandoffTransport({config,fetchImpl:async()=>response});
    await assert.rejects(t.send({packet,idempotencyKey,actor:admin}),e=>e.safeMessage&&!/secret|do not reveal/.test(e.message));
  }
  const timeout=createHandoffTransport({config,timeoutMs:5,fetchImpl:()=>new Promise(()=>{})});
  await assert.rejects(timeout.send({packet,idempotencyKey,actor:admin}),e=>e.statusCode===504);
  assert.equal(afterSave(null,M.make({kind:'Print',status:'won'})),null);
});
