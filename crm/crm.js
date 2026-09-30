/* Opportunity shell for local review; existing calculators remain the record editors. */
(async () => {
  const live=await window.crmLiveReady;
  if (!window.CRM_PREVIEW && !live) return;
  const M=CrmModel, $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];
  const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon=(name)=>`<i data-lucide="${name}" aria-hidden="true"></i>`;
  const money=(v)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v||0);
  const shortDate=(v)=>v?new Date(v+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}):'Not set';
  const people=live?live.lookups.users.map(u=>u.username):['John Tan','Amanda Tan','Warren Corrales'];
  let db;
  try {if(!live)db=JSON.parse(localStorage.getItem('sharpdots-crm-draft-v1'));} catch {}
  if(live)db={schema:2,opportunities:live.opportunities,selected:null};
  if(!db || !Array.isArray(db.opportunities))db={schema:1,opportunities:M.samples(),selected:null};
  let page='pipeline',view='board',detailTab='overview',selected=null,search='',owner='all',kind='all',scope='all',attention=false;
  let pipeline='services';
  try { const saved=localStorage.getItem('sharpdots-crm-pipeline-v1');if(M.pipelines.some(p=>p.id===saved))pipeline=saved; } catch {}
  function selectPipeline(next){
    if(!M.pipelines.some(p=>p.id===next))return;
    pipeline=next;
    try{localStorage.setItem('sharpdots-crm-pipeline-v1',pipeline);}catch{}
  }
  let lastFocus=null,dragId=null,toastTimer;
  const current=()=>db.opportunities.find(o=>o.id===selected);
  let saving=false,recordSaving=false,saveError='';
  let resetLiveContact,addLiveLookup;
  function lookupFields(f,kind,open){const fields=f.querySelector(`[data-create-fields=${kind}]`);fields.hidden=!open;fields.disabled=!open;return fields;}
  const fingerprint=o=>JSON.stringify({...o,history:[],documents:[],editor:undefined});
  const baseline=new Map(db.opportunities.map(o=>[o.id,fingerprint(o)]));
  function persist(){
    if(!live){try{localStorage.setItem('sharpdots-crm-draft-v1',JSON.stringify(db));}catch{toast('Storage is full. Export your draft before continuing.');}return;}
    if(saving||saveError)return;
    const changed=db.opportunities.filter(o=>baseline.get(o.id)!==fingerprint(o));
    if(!changed.length)return;
    saving=true;document.body.classList.add('crm-saving');
    return (async()=>{
      try {
        for(const o of changed){
          const saved=await live.request('opportunities'+(o.rowVersion?'/'+o.id:''),o.rowVersion?'PUT':'POST',o);
          const oldId=o.id;Object.assign(o,saved);delete o.note;
          if(selected===oldId)selected=o.id;if(db.selected===oldId)db.selected=o.id;
          baseline.delete(oldId);baseline.set(o.id,fingerprint(o));
        }
        toast('Saved to database');
      } catch(e){saveError=e.message;toast('Not saved: '+e.message);}
      finally{saving=false;document.body.classList.remove('crm-saving');render();if($('#crmDrawer').open)renderDetail();}
    })();
  }
  const label=(status)=>({'not-ready':'Not ready','ready':'Ready for Xero','not-invoiced':'Not invoiced','paid':'Paid','deposit-paid':'Deposit paid','completed':'Signed','viewed':'Viewed','sent':'Sent','prepared':'Prepared','declined':'Declined','expired':'Expired','failed':'Failed','draft':'Draft','queued':'Queued','accepted':'Accepted','not-required':'Not required','invoiced':'Invoiced','error':'Needs attention'}[status]||status);
  function pill(text,tone='neutral'){return `<span class="crm-pill ${tone}">${esc(text)}</span>`;}
  const tone=(s)=>['completed','accepted','paid','won'].includes(s)?'green':['declined','failed','error','lost'].includes(s)?'red':['viewed','expired','ready','queued'].includes(s)?'amber':'neutral';
  const btn=(action,text,ico='',attrs='',cls='')=>`<button type="button" data-action="${action}" ${attrs} class="crm-btn ${cls}">${ico?icon(ico):''}${text}</button>`;
  const opts=(list,value)=>list.map(x=>{const [v,l]=Array.isArray(x)?x:[x,x];return `<option value="${esc(v)}" ${String(v)===String(value)?'selected':''}>${esc(l)}</option>`;}).join('');
  const input=(text,name,value,type='text',extra='')=>`<label class="crm-field">${text}<input name="${name}" type="${type}" value="${esc(value)}" ${extra}></label>`;
  const select=(text,name,list,value)=>`<label class="crm-field">${text}<select name="${name}">${opts(list,value)}</select></label>`;
  function initials(n){return String(n||'Unassigned').split(' ').map(x=>x[0]).slice(0,2).join('');}
  const pending=(o)=>o.activities.filter(a=>!a.done).sort((a,b)=>a.due.localeCompare(b.due));
  const next=(o)=>pending(o)[0];
  function overdue(o){return pending(o).some(a=>a.due<M.date(0));}
  function needs(o){return overdue(o)||!next(o)||o.documents.some(d=>['expired','declined','failed'].includes(d.status))||!!M.acceptedDoc(o)&&o.status==='open';}
  function filtered(){return M.inPipeline(db.opportunities,pipeline).filter(o=>(scope==='all'||o.status===scope)&&(owner==='all'||o.owner===owner)&&(kind==='all'||o.kind===kind)&&(!attention||needs(o))&&`${o.title} ${o.account} ${o.number} ${o.contact}`.toLowerCase().includes(search.toLowerCase()));}
  function pipelineToggle(){return `<div class="crm-pipeline-toggle" role="radiogroup" aria-label="Sales pipeline">${M.pipelines.map(p=>`<button type="button" data-action="pipeline" data-pipeline="${p.id}" role="radio" aria-checked="${p.id===pipeline}" tabindex="${p.id===pipeline?0:-1}" aria-label="${p.name}">${icon(p.icon)}<span>${p.name}</span><span class="crm-pipeline-count" aria-label="Open opportunities">${M.inPipeline(db.opportunities,p.id).filter(o=>o.status==='open').length}</span></button>`).join('')}</div>`;}
  function refreshResults(){
    $('#crmResults').innerHTML=results();
    $('#crmPipelineMetrics').innerHTML=metrics(filtered());
    $('#crmResultCount').textContent=filtered().length+' opportunities · USD · Initial-term contract value';
    icons();
  }
  function icons(){lucide.createIcons({attrs:{'stroke-width':1.7}});}
  function toast(text){$('#crmToast').textContent=text;$('#crmToast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#crmToast').hidden=true,5000);}
  document.body.insertAdjacentHTML('afterbegin',`<div id="crmShell">
    <header class="crm-header"><a href="?crm=1" class="crm-brand" aria-label="Sharpdots Pipeline"><span class="crm-brand-mark">${icon('orbit')}</span>sharpdots<span class="crm-brand-product">Sales desk</span></a>
      <nav aria-label="Primary navigation">${['pipeline','proposals','quote'].map((p,i)=>btn('nav',['Pipeline','Proposals','Quote'][i],['columns-3','files','printer'][i],`data-page="${p}"`)).join('')}</nav>
      <div class="crm-header-end">${pill(live?'Shared CRM · Admin pilot':'Local draft · Sample data','draft')}${live?btn('refresh','Reload','refresh-cw'):''}${btn('export','', 'download','title="Export opportunity backup" aria-label="Export opportunity backup"','icon-only')}<span class="crm-avatar">${esc(initials(live?.lookups.user.username||'John Tan'))}</span></div>
    </header>
    <div id="crmContext"></div><section id="crmContent"></section>
    <div id="crmToast" role="status" aria-live="polite" hidden></div>
    <dialog id="crmDrawer" aria-labelledby="crmDetailTitle"></dialog>
    <dialog id="crmDialog" aria-labelledby="crmDialogTitle"></dialog>
  </div>`);
  function metrics(list){const open=list.filter(o=>o.status==='open'),won=list.filter(o=>o.status==='won');return `<div class="crm-metrics">
    <div><span>Open pipeline</span><strong>${money(open.reduce((s,o)=>s+M.value(o),0))}</strong><small>${open.length} opportunities</small></div>
    <div><span>Weighted forecast</span><strong>${money(open.reduce((s,o)=>s+M.value(o)*M.probability(o)/100,0))}</strong><small>Based on stage probability</small></div>
    <div><span>Won value</span><strong>${money(won.reduce((s,o)=>s+M.value(o),0))}</strong><small>${won.length} ready for delivery review</small></div>
    <button data-action="attention" class="crm-metric-alert ${attention?'chosen':''}"><span>Needs attention</span><strong>${list.filter(needs).length} ${icon('arrow-up-right')}</strong><small>Follow-ups & acceptance</small></button>
  </div>`;}
  function render(){
    persist();
    document.body.classList.toggle('crm-save-error',!!saveError);
    document.body.dataset.crmPage=page;
    document.body.dataset.crmPipeline=pipeline;
    $$('.crm-header [data-page]').forEach(b=>{b.classList.toggle('selected',b.dataset.page===page);b.setAttribute('aria-current',b.dataset.page===page?'page':'false');});
    if(page==='pipeline'){
      $('#crmContext').innerHTML='';
      $('#crmContent').innerHTML=`<div class="crm-page-heading"><div class="crm-pipeline-heading"><div><div class="crm-eyebrow">SALES / OPPORTUNITIES</div><h1>Pipeline</h1></div>${pipelineToggle()}</div>${btn('new','Opportunity','plus','','primary')}</div>
      <div id="crmPipelineMetrics">${metrics(filtered())}</div>
      <div class="crm-toolbar"><div class="crm-view-tabs" role="group" aria-label="Pipeline view">${[['board','Board','columns-3'],['list','List','list'],['activities','Activities','calendar-days'],['handoffs','Handoffs','arrow-right-left']].map(([v,l,i])=>btn('view',l,i,`data-view="${v}"`,view===v?'selected':'')).join('')}</div>
      <div class="crm-filters"><label class="crm-search">${icon('search')}<input id="crmSearch" aria-label="Search opportunities" placeholder="Search opportunities" value="${esc(search)}"></label><select id="crmOwner" aria-label="Owner">${opts([['all','All owners'],...people],owner)}</select><select id="crmKind" aria-label="Offering">${opts([['all','All offerings'],'Print','Services','Mixed'],kind)}</select><select id="crmScope" aria-label="Opportunity status">${opts([['open','Open'],['all','All statuses'],['won','Won'],['lost','Lost']],scope)}</select>${attention?btn('attention','Attention only','x','','chosen'):''}</div></div>
      <div id="crmResults">${results()}</div><footer class="crm-board-footer"><span id="crmResultCount">${filtered().length} opportunities · USD · Initial-term contract value</span><span role="status">${icon('check')}${live?(saveError?'NOT SAVED: '+esc(saveError)+' · Export a backup, then reload.':saving?'Saving to database…':'Saved to database'):'Draft saved on this browser'}</span></footer>`;
    }else{
      $('#crmContent').innerHTML=''; renderContext();
    }
    icons();
  }
  function results(){const list=filtered();return view==='board'?board(list):view==='list'?listView(list):view==='activities'?activitiesView(list):handoffView(list);}
  function card(o){const a=next(o),d=o.documents.find(d=>d.primary&&!d.superseded);const status=d?pill(label(d.status),tone(d.status)):pill(o.kind,o.kind==='Print'?'purple':o.kind==='Services'?'teal':'neutral');
    return `<article class="crm-deal" draggable="true" data-id="${o.id}" style="--stage-color:${M.stages.find(s=>s.id===o.stage)?.color}" tabindex="0" role="button" aria-label="Open ${esc(o.title)}">
      <div class="crm-card-top"><span>${esc(o.number)}</span>${status}</div><h3>${esc(o.title)}</h3><p>${esc(o.account)}</p><strong class="crm-card-value">${money(M.value(o))}${o.monthly?`<small>${money(o.monthly)}/mo · ${o.term} mo</small>`:''}</strong>
      <div class="crm-card-records">${o.records.slice(0,3).map(r=>`<span>${icon(r.collection==='proposals'?'file-text':r.collection==='printQuotes'?'printer':'calculator')}${esc(r.number)}</span>`).join('')||'<span>Scope not yet estimated</span>'}</div>
      <div class="crm-card-bottom"><span class="crm-avatar small" title="${esc(o.owner)}">${initials(o.owner)}</span><span>${shortDate(o.close)}</span>${icon('calendar-days')}</div>
      <div class="crm-next ${a&&a.due<M.date(0)?'overdue':!a?'missing':''}">${icon(a?'clock-3':'circle-alert')}<span>${a?esc(a.title):'No next activity'}<small>${a?(a.due<M.date(0)?'Overdue · ':a.due===M.date(0)?'Today · ':'')+shortDate(a.due):'Schedule a follow-up'}</small></span></div>
      ${M.acceptedDoc(o)&&o.status==='open'?'<div class="crm-accepted">Signed · Ready for close review</div>':''}</article>`;
  }
  function board(list){const lost={id:'lost',name:'Lost',color:'#b95858'};const stages=scope==='lost'?[lost]:[...M.stages,...(scope==='all'&&list.some(o=>o.status==='lost')?[lost]:[])];return `<div class="crm-board" style="grid-template-columns:repeat(${stages.length},minmax(225px,1fr))">${stages.map(s=>{const deals=list.filter(o=>s.id==='lost'?o.status==='lost':o.stage===s.id&&o.status!=='lost');return `<section class="crm-stage" data-stage="${s.id}" style="--stage-color:${s.color}" aria-label="${s.name}"><header><div><h2>${s.name}</h2><span>${deals.length}</span>${s.id==='lost'?'':btn('new','', 'plus',`data-stage="${s.id}" title="Add opportunity to ${s.name}" aria-label="Add opportunity to ${s.name}"`,'icon-only')}</div><p>${money(deals.reduce((sum,o)=>sum+M.value(o),0))}<small>${s.probability===undefined?'':s.probability+'% probability'}</small></p></header><div class="crm-stage-cards">${deals.map(card).join('')||'<div class="crm-stage-empty">No opportunities</div>'}</div></section>`;}).join('')}</div>`;}
  function listView(list){return `<div class="crm-table-wrap"><table class="crm-table"><thead><tr><th>Opportunity</th><th>Account</th><th>Stage</th><th>Value</th><th>Owner</th><th>Expected close</th><th>Next activity</th></tr></thead><tbody>${list.map(o=>`<tr><td>${btn('open',esc(o.title),'',`data-id="${o.id}"`,'text-link')}<small>${o.number}</small></td><td>${esc(o.account)}</td><td>${pill(o.status==='lost'?'Lost':M.stages.find(s=>s.id===o.stage)?.name,tone(o.status))}</td><td>${money(M.value(o))}</td><td>${esc(o.owner)}</td><td>${shortDate(o.close)}</td><td>${esc(next(o)?.title||'None scheduled')}</td></tr>`).join('')}</tbody></table>${!list.length?empty():''}</div>`;}
  function empty(){return `<div class="crm-empty">${icon('search')}<h3>No matches</h3><p>Adjust the filters or add an opportunity.</p>${btn('clear-filters','Clear filters','filter-x')}</div>`;}
  function activitiesView(list){const acts=list.flatMap(o=>o.activities.filter(a=>!a.done).map(a=>({...a,o}))).sort((a,b)=>a.due.localeCompare(b.due));return `<div class="crm-activity-board">${[['Overdue',a=>a.due<M.date(0)],['Today',a=>a.due===M.date(0)],['Upcoming',a=>a.due>M.date(0)]].map(([label,filter])=>`<section><h2>${label} <span>${acts.filter(filter).length}</span></h2>${acts.filter(filter).map(a=>`<article class="crm-activity"><button class="crm-check" data-action="complete-activity" data-id="${a.o.id}" data-activity="${a.id}" aria-label="Complete ${esc(a.title)}">${icon('circle')}</button><div>${btn('open',esc(a.title),'',`data-id="${a.o.id}"`,'text-link')}<p>${esc(a.o.account)} · ${a.o.number}</p><small>${shortDate(a.due)} · ${esc(a.owner)}</small></div>${pill(a.kind)}</article>`).join('')||'<p class="crm-muted">Nothing scheduled</p>'}</section>`).join('')}</div>`;}
  function handoffView(list){const won=list.filter(o=>o.status==='won');return `<div class="crm-handoff-board">${[['engagement','Client engagement','handshake'],['production','Production','package-check'],['billing','Billing coordination','receipt']].map(([lane,title,ico])=>`<section><h2>${icon(ico)}${title}</h2>${won.filter(o=>lane==='billing'||o.handoffs[lane].status!=='not-required').map(o=>{const h=lane==='billing'?o.billing:o.handoffs[lane];return `<article><div class="crm-card-top">${pill(label(h.status),tone(h.status))}<span>${o.number}</span></div>${btn('handoff-open',esc(o.title),'',`data-id="${o.id}"`,'text-link')}<p>${esc(o.account)}</p><small>${lane==='billing'?money(M.value(o))+' · '+h.terms:esc(h.owner||'Owner needed')+' · '+shortDate(h.target)}</small></article>`;}).join('')||'<p class="crm-muted">No won opportunities in this filter</p>'}</section>`).join('')}</div>`;}
  function renderContext(){const o=db.opportunities.find(o=>o.id===db.selected);$('#crmContext').innerHTML=`<div class="crm-record-context"><div><span class="crm-eyebrow">${page==='quote'?'QUOTE / PRINT & ECOMM':'PROPOSALS / ASSEMBLY'}</span><h1>${page==='quote'?'Quote':'Proposals'}</h1></div><label class="crm-field">Opportunity<select id="crmOpportunity"><option value="">Standalone / no opportunity</option>${db.opportunities.map(o=>`<option value="${o.id}" ${o.id===db.selected?'selected':''}>${o.number} · ${esc(o.title)}</option>`).join('')}</select></label>${o?`<div class="crm-context-client"><span>${esc(o.account)}</span><small>${esc(o.contact)} · ${esc(o.owner)}</small></div>${btn('open','Opportunity details','arrow-up-right',`data-id="${o.id}"`)}`:''}<span id="crmSaveFeedback" role="status"></span></div>`;}
  function details(id,tab='overview'){
    selected=id;detailTab=tab;lastFocus=document.activeElement;
    renderDetail();if(!$('#crmDrawer').open)$('#crmDrawer').showModal();
  }
  function renderDetail(){const o=current();if(!o)return;const d=M.acceptedDoc(o);
    $('#crmDrawer').innerHTML=`<header class="crm-drawer-header"><div><span class="crm-eyebrow">${o.number} ${pill(M.pipelineName(o),M.pipelineFor(o)==='quotes'?'purple':'teal')}</span><h2 id="crmDetailTitle">${esc(o.title)}</h2><p>${esc(o.account)} · ${esc(o.contact)}</p></div>${btn('close-detail','','x','aria-label="Close opportunity"','icon-only')}</header>
    <div class="crm-detail-commercial"><div><strong>${money(M.value(o))}</strong><span>Initial contract</span></div><div><strong>${o.monthly?money(o.monthly)+'/mo':'One-time'}</strong><span>${o.monthly?o.term+' month initial term':'Print / project'}</span></div><div><strong>${shortDate(o.close)}</strong><span>Expected close</span></div><span class="crm-avatar" title="${esc(o.owner)}">${initials(o.owner)}</span></div>
    <div class="crm-stage-path" aria-label="Opportunity stage">${M.stages.map(s=>`<button data-action="stage" data-stage="${s.id}" class="${o.stage===s.id?'current':''}" aria-pressed="${o.stage===s.id}">${s.name}</button>`).join('')}</div>
    <div class="crm-detail-actions">${o.status==='open'?`${btn('win','Mark won','check','','success')}${btn('lost','Mark lost','x')}`:`${pill(o.status==='won'?'Won':'Lost',tone(o.status))}${btn('reopen','Reopen','undo-2')}`}<span>${d?'Primary offer signed':o.status==='lost'?esc(o.lostReason||'Closed lost'):o.approval.method&&o.approval.reference?esc(o.approval.method+' recorded'):'Awaiting commercial acceptance'}</span>${btn('edit','Edit opportunity','pencil')}</div>
    <nav class="crm-detail-tabs" aria-label="Opportunity detail tabs">${[['overview','Overview'],['records','Records'],['documents','Documents'],['handoff','Handoff & billing'],['activity','Activity']].map(([t,l])=>btn('detail-tab',l,'',`data-tab="${t}"`,detailTab===t?'selected':'')).join('')}</nav>
    <div class="crm-detail-body">${detailTab==='overview'?overview(o):detailTab==='records'?records(o):detailTab==='documents'?documents(o):detailTab==='handoff'?handoff(o):activity(o)}</div>`;
    $('.crm-detail-actions').insertAdjacentHTML('beforeend',btn('move-pipeline','Move pipeline','arrow-right-left'));
    if(live){
      $('#crmDrawer').querySelectorAll('[data-record-role]').forEach(select=>{
        const record=o.records.find(r=>String(r.id)===select.dataset.recordRole);
        if(!['proposals','printQuotes'].includes(record?.collection))select.querySelector('option[value="Primary offer"]')?.remove();
      });
      $('#crmDrawer').querySelectorAll('small.crm-muted').forEach(el=>{
        if(el.textContent==='Local coordination record · Workbench relay pending')el.textContent='Shared coordination record · Workbench relay pending';
      });
    }
    icons();
  }
  function overview(o){const q=[['need','Business need'],['budget','Budget confirmed'],['authority','Decision-maker'],['timing','Timing agreed']];return `<div class="crm-detail-columns"><section><h3>Qualification <span>${Object.values(o.qualification).filter(Boolean).length}/4</span></h3><div class="crm-checklist">${q.map(([key,l])=>`<label><input type="checkbox" data-qualification="${key}" ${o.qualification[key]?'checked':''}>${l}</label>`).join('')}</div><h3>Opportunity brief</h3><p class="crm-prose">${esc(o.notes||'No brief yet.')}</p><dl class="crm-facts"><dt>Contact</dt><dd>${esc(o.contact)}</dd><dt>Email</dt><dd>${esc(o.email||'Not provided')}</dd><dt>Source</dt><dd>${esc(o.source)}</dd><dt>Owner</dt><dd>${esc(o.owner)}</dd><dt>Stage probability</dt><dd>${M.probability(o)}%</dd></dl>${btn('edit','Edit brief','pencil')}</section><section><div class="crm-section-title"><h3>Next activities</h3>${btn('add-activity','','plus','aria-label="Schedule activity"','icon-only')}</div>${pending(o).map(a=>`<article class="crm-mini-activity"><button class="crm-check" data-action="complete-activity" data-id="${o.id}" data-activity="${a.id}" aria-label="Complete ${esc(a.title)}">${icon('circle')}</button><div><strong>${esc(a.title)}</strong><small class="${a.due<M.date(0)?'crm-overdue':''}">${shortDate(a.due)} · ${esc(a.owner)}</small></div></article>`).join('')||'<p class="crm-muted">No next activity</p>'}<h3>Commercial readiness</h3><ul class="crm-readiness">${[['Records attached',o.records.length>0],['Primary offer accepted',!!M.acceptedDoc(o)||!!o.approval.reference],['Billing details ready',M.billingIssues(o).length===0]].map(([l,yes])=>`<li>${icon(yes?'circle-check':'circle')}<span>${l}</span></li>`).join('')}</ul>${M.acceptedDoc(o)&&o.status==='open'?`<div class="crm-callout">${icon('file-check')}<div><strong>Signed offer received</strong><p>Review scope and value, then mark won.</p></div></div>`:''}<h3>Records</h3><div class="crm-record-chips">${o.records.map(r=>pill(r.number)).join('')||'<span class="crm-muted">No records attached</span>'}</div>${btn('detail-tab','Manage records','arrow-right','data-tab="records"','text-link')}</section></div>`;}
  function records(o){return `<div class="crm-section-title"><div><h3>Linked calculations & offers</h3><p>${o.number} · ${esc(o.account)}</p></div>${btn('attach','Attach record','link')}</div><div class="crm-record-list">${o.records.map(r=>`<article><span class="crm-record-icon ${r.collection==='printQuotes'||r.collection==='ecomm'?'print':''}">${icon(r.collection==='printQuotes'?'printer':r.collection==='proposals'?'file-text':'calculator')}</span><div><strong>${esc(r.name)}</strong><small>${r.number} · v${r.version} · ${M.collectionMeta[r.collection][0]}</small></div><select aria-label="Role for ${r.number}" data-record-role="${r.id}">${opts(['Primary offer','Component','Cost basis','Alternative'],r.role)}</select>${btn('record-open','Open','arrow-up-right',`data-record="${r.id}"`)}${btn('detach','','unlink',`data-record="${r.id}" aria-label="Detach ${r.number}"`,'icon-only')}</article>`).join('')||'<div class="crm-stage-empty">No records attached yet</div>'}</div><h3>Create a linked record</h3><div class="crm-create-records">${Object.entries(M.collectionMeta).map(([key,[name]])=>btn('record-new',name,'plus',`data-collection="${key}"`)).join('')}</div><div class="crm-callout"><div>${icon('layers')}</div><p>One primary offer sets the acceptance basis. Estimates, services, sourcing and price lists support that offer; their values are not added again to the opportunity.</p></div>`;}
  function documents(o){return `<div class="crm-section-title"><div><h3>Document requests</h3><p>Sample lifecycle tracking · No email delivery</p></div>${btn('document-new','Prepare sample request','file-plus-2')}</div>${o.documents.map(d=>`<article class="crm-document"><div class="crm-section-title"><div><strong>${d.number} <small>v${d.version}</small></strong><p>${esc(d.recipient)}</p></div>${pill(label(d.status),tone(d.status))}</div><div class="crm-document-meta"><span>${esc(d.reference)}</span><label><input type="checkbox" data-document-primary="${d.id}" ${d.primary?'checked':''}> Primary acceptance</label></div><div class="crm-document-progress">${['prepared','sent','viewed','completed'].map((s,i)=>`<span class="${['prepared','sent','viewed','completed'].indexOf(d.status)>=i?'done':''}">${icon('circle-check')}${label(s)}</span>`).join('')}</div>${d.status==='completed'?`<div class="crm-callout">${icon('file-check')}<p>Sample signed PDF and certificate recorded. Production files remain in the authenticated document archive.</p></div>`:''}<div class="crm-document-actions">${!['completed','declined','expired'].includes(d.status)?`${btn('document-event','Sent','','data-doc="'+d.id+'" data-status="sent"')}${btn('document-event','Viewed','','data-doc="'+d.id+'" data-status="viewed"')}${btn('document-event','Signed','','data-doc="'+d.id+'" data-status="completed"')}${btn('document-event','Declined','','data-doc="'+d.id+'" data-status="declined"')}${btn('document-event','Expired','','data-doc="'+d.id+'" data-status="expired"')}`:''}</div></article>`).join('')||'<div class="crm-stage-empty">No signature requests yet</div>'}<h3>Other approval</h3><form id="crmApprovalForm" class="crm-form"><div class="crm-form-grid">${select('Approval method','method',[['','No alternative approval'],'Purchase order','Written approval','No signature required'],o.approval.method)}${input('Approval reference / rationale','reference',o.approval.reference)}</div><button class="crm-btn" type="submit">Save approval reference</button></form>`;}
  function handoff(o){return `<div class="crm-section-title"><div><h3>Delivery & billing coordination</h3><p>${o.status==='won'?'Won · Review each receiving team':'Close review required before release'}</p></div>${btn('export-handoff','Export handoff','download')}</div>
    ${['engagement','production'].map(lane=>{const h=o.handoffs[lane],issues=M.handoffIssues(o,lane);return `<section class="crm-delivery-section"><div class="crm-section-title"><h3>${icon(lane==='engagement'?'handshake':'package-check')}${lane==='engagement'?'Client engagement':'Production workbench'}</h3>${pill(label(h.status),tone(h.status))}</div><form data-handoff-form="${lane}" class="crm-form"><label class="crm-checkbox"><input name="required" type="checkbox" ${h.status!=='not-required'?'checked':''}> Required for this opportunity</label><div class="crm-form-grid">${select('Receiving owner','owner',[['','Assign owner'],...people],h.owner)}${input('Target start','target',h.target,'date')}</div><label class="crm-field">Agreed delivery scope<textarea name="scope" rows="2">${esc(h.scope)}</textarea></label><label class="crm-checkbox"><input name="assets" type="checkbox" ${h.assets?'checked':''}> Assets and dependencies confirmed</label><div class="crm-section-title"><button type="submit" class="crm-btn">Save handoff</button>${btn('queue-handoff','Queue handoff','send',`data-lane="${lane}" ${issues.length||h.status!=='draft'?'disabled':''}`)}${btn('accept-handoff','Confirm received','check',`data-lane="${lane}" ${h.status!=='queued'?'disabled':''}`)}</div></form>${h.status!=='not-required'&&issues.length?`<p class="crm-hint">${esc(issues.join(' '))}</p>`:''}<small class="crm-muted">Local coordination record · Workbench relay pending</small></section>`;}).join('')}
    <section class="crm-delivery-section"><div class="crm-section-title"><h3>${icon('receipt')}Xero billing handoff</h3>${pill(label(o.billing.status),tone(o.billing.status))}</div><form id="crmBillingForm" class="crm-form"><div class="crm-form-grid">${input('Billing email','contact',o.billing.contact,'email')}${select('Payment terms','terms',['Due on receipt','Net 15','Net 30','Net 60'],o.billing.terms)}${input('First invoice date','start',o.billing.start,'date')}${input('Deposit %','deposit',o.billing.deposit,'number','min="0" max="100"')}${input('Client PO / reference','po',o.billing.po)}${select('Payment status','payment',[['not-invoiced','Not invoiced'],['awaiting','Awaiting payment'],['deposit-paid','Deposit paid'],['paid','Paid'],['overdue','Overdue']],o.billing.payment)}</div><div class="crm-billing-summary"><span>One-time <strong>${money(o.oneTime)}</strong></span><span>Monthly <strong>${money(o.monthly)}</strong></span><span>Initial term <strong>${o.term} months</strong></span></div><button type="submit" class="crm-btn">Save billing details</button>${btn('billing-ready','Mark ready for Xero','check',M.billingIssues(o).length?'disabled':'')}</form><p class="crm-hint">${esc(M.billingIssues(o).join(' '))}</p><small class="crm-muted">Xero relay not connected · Payment status recorded manually · Authorize.net retained</small></section>`;}
  function activity(o){return `<div class="crm-section-title"><h3>Activity & audit trail</h3>${btn('add-activity','Schedule activity','plus')}</div><form id="crmNoteForm" class="crm-form"><label class="crm-field">Internal note<textarea name="note" rows="2" required placeholder="Capture a decision or conversation"></textarea></label><button class="crm-btn" type="submit">Add note</button></form><div class="crm-timeline">${o.history.map(h=>`<article><span>${icon(h.type==='document'?'file-text':h.type==='note'?'message-square':'circle-check')}</span><div><p>${esc(h.text)}</p><small>${new Date(h.at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}</small></div></article>`).join('')}</div>`;}
  function modal(title,body){$('#crmDialog').innerHTML=`<header><h2 id="crmDialogTitle">${title}</h2>${btn('close-modal','','x','aria-label="Close dialog"','icon-only')}</header>${body}`;$('#crmDialog').showModal();icons();}
  function editModal(o=null,stage='intake'){const x=o||M.make({stage,pipeline,kind:pipeline==='quotes'?'Print':'Services'});modal(o?'Edit opportunity':'New opportunity',`<form id="crmEditForm" data-id="${o?.id||''}" class="crm-form">${input('Opportunity name','title',x.title,'text','required placeholder="e.g. Fall customer reactivation"')}<div class="crm-form-grid">${select('Pipeline','pipeline',M.pipelines.map(p=>[p.id,p.name]),M.pipelineFor(x))}${select('Offering','kind',['Print','Services','Mixed'],x.kind)}${input('Client / account','account',x.account,'text','required list="crmAccounts"')}${input('Contact / decision-maker','contact',x.contact)}${input('Contact email','email',x.email,'email')}${select('Owner','owner',people,x.owner)}${select('Source','source',['Existing client','Referral','Inbound','Outbound','Partner'],x.source)}${input('One-time value ($)','oneTime',x.oneTime,'number','min="0" step="0.01"')}${input('Monthly value ($)','monthly',x.monthly,'number','min="0" step="0.01"')}${input('Initial term (months)','term',x.term,'number','min="1" step="1"')}${input('Expected close','close',x.close,'date','required')}</div><label class="crm-field">Opportunity brief<textarea name="notes" rows="3">${esc(x.notes)}</textarea></label><input type="hidden" name="stage" value="${stage==='won'?'intake':stage}"><datalist id="crmAccounts">${[...new Set(db.opportunities.map(o=>o.account))].map(a=>`<option value="${esc(a)}">`).join('')}</datalist><footer>${btn('close-modal','Cancel')}<button type="submit" class="crm-btn primary">${o?'Save changes':'Create opportunity'}</button></footer></form>`);}
  function closeReview(o){const issues=M.closeIssues(o);modal('Close opportunity as won',`<div class="crm-form"><p><strong>${esc(o.title)}</strong><br>${o.number} · ${esc(o.account)}</p><div class="crm-close-value">${money(M.value(o))}<small>Agreed initial contract value</small></div><p>${M.acceptedDoc(o)?'Signed primary offer: '+M.acceptedDoc(o).number:'Approval: '+esc(o.approval.reference||'Not recorded')}</p>${issues.length?`<ul class="crm-issues">${issues.map(x=>`<li>${x}</li>`).join('')}</ul>`:'<p>Delivery and billing handoffs will remain pending until reviewed.</p>'}<footer>${btn('close-modal','Back')}${btn('confirm-win','Confirm won','check',issues.length?'disabled':'','success')}</footer></div>`);}
  function download(name,content,type='application/json'){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Download requested: '+name);}
  function recordCatalog(){const found=new Map();db.opportunities.forEach(o=>o.records.forEach(r=>found.set(r.collection+':'+r.number,{...r,account:o.account})));workspaces.forEach(w=>Object.entries(w.records||{}).forEach(([c,rs])=>rs.forEach(r=>{if(!M.collectionMeta[c])return;const n=r[M.collectionMeta[c][2]];found.set(c+':'+n,{collection:c,number:n,name:r.name||n,version:r.version||1,account:w.clientName||'',role:'Component'});})));Object.entries(libraryRecords).forEach(([c,rs])=>rs.forEach(r=>{const n=r[M.collectionMeta[c][2]];found.set(c+':'+n,{collection:c,number:n,name:r.name||n,version:r.version||1,account:'Standalone',role:'Component'});}));return [...found.values()];}
  function attachModal(){modal('Attach a saved record',`<label class="crm-search">${icon('search')}<input id="crmRecordSearch" placeholder="Find by number, title or account" aria-label="Search saved records"></label><div id="crmAttachList">${attachList('')}</div>`);}
  function attachList(q){const o=current();return recordCatalog().filter(r=>!o.records.some(x=>x.number===r.number&&x.collection===r.collection)&&`${r.number} ${r.name} ${r.account}`.toLowerCase().includes(q.toLowerCase())).map(r=>`<button class="crm-attach-result" data-action="attach-record" data-number="${r.number}" data-collection="${r.collection}"><span><strong>${r.number} · ${esc(r.name)}</strong><small>${esc(r.account)} · v${r.version}</small></span>${icon('plus')}</button>`).join('')||'<p class="crm-muted">No matching records. Create one from the opportunity.</p>';}
  function saveEditor(){
    if(live)return;
    if(!db.selected)return;
    const o=db.opportunities.find(o=>o.id===db.selected);
    if(!o)return;
    const recordMap={};
    for(const t of workspaceRecordTypes){const n=activeWorkspaceRecords[t.collection];if(n)recordMap[t.collection]=n;}
    o.editor={rows:structuredClone(rows),proposal:structuredClone(proposal),serviceRows:structuredClone(serviceRows),serviceScenario,serviceExpanded:[...serviceExpanded],sourcing:structuredClone(sourcing),printQuote:structuredClone(printQuote),ecommPriceList:structuredClone(ecommPriceList),active:structuredClone(activeWorkspaceRecords),projectName:els.projectName.value,projectNumber:currentEstimateNumber(),estimateYear:els.estimateYear.value,paymentSettings:structuredClone(paymentSettings),paymentDates:structuredClone(paymentDates)};
    const w=workspaceByNumber(o.containerId);
    o.editor.serviceEngagement=structuredClone(serviceEngagement);
    for(const [collection,n]of Object.entries(recordMap)){
      const t=recordTypeFor(collection),pool=isLibraryRecordCollection(collection)?libraryRecordsFor(collection):(w?.records[collection]||[]),r=pool.find(r=>r[t.numberKey]===n);
      if(r&&isLibraryRecordCollection(collection)&&db.pendingLink?.opportunity===o.id&&db.pendingLink.collection===collection){
        r.attachedWorkspaces=[...new Set([...libraryRecordAttachmentList(r),o.containerId])];setLibraryRecordsFor(collection,pool);delete db.pendingLink;
      }
      if(r&&isLibraryRecordCollection(collection)&&!libraryRecordAttachmentList(r).includes(o.containerId)){
        o.records=o.records.filter(x=>!(x.number===n&&x.collection===collection));continue;
      }
      if(r){
        const linked=o.records.find(x=>x.number===n&&x.collection===collection);
        if(linked){linked.name=r.name||n;linked.snapshot=structuredClone(r.snapshot||{});if(linked.version!==(r.version||1)){linked.version=r.version||1;M.stamp(o,n+' updated to v'+linked.version);}}
        else o.records.push({id:crypto.randomUUID(),collection,number:n,name:r.name||n,version:r.version||1,role:'Component',snapshot:structuredClone(r.snapshot||{})});
      }
    }
    persist();
  }
  function seedRecordEditors(o,w){
    if(live){hydrateLiveRecords(o,w);return;}
    const estimateRows=buildSeedRows([
      {packageName:o.title,product:'Printed materials',element:'Printed materials',type:'FP',neededQty:5000,qty:5000,clientQoh:0,inventoryQty:0,cost:o.oneTime*.42,markup:.4,marginAdj:.4,priorPpp:0,notes:'Sample production scope'},
      {packageName:o.title,product:'Production preparation',element:'Production preparation',type:'M',neededQty:5000,qty:5000,clientQoh:0,inventoryQty:0,cost:o.oneTime*.12,markup:.4,marginAdj:.4,priorPpp:0,notes:'Sample creative and prepress'},
      {packageName:o.title,product:'Fulfillment',element:'Fulfillment',type:'VF',neededQty:5000,qty:5000,clientQoh:0,inventoryQty:0,cost:o.oneTime*.06,markup:.4,marginAdj:.4,priorPpp:0,notes:'Sample fulfillment'}
    ]);
    if(!o.editor){rows=estimateRows;expanded=new Set(rows.map(r=>r.id));activePackage='All';}
    for(const r of o.records){
      const t=recordTypeFor(r.collection),savedAt=new Date().toISOString();
      const sampleProposal={...defaultProposal(),title:o.title,preparedFor:o.contact,campaign:o.title,overview:o.notes,deliverables:'Printed materials, production preparation and fulfillment. Final scope and quantities subject to approval.'};
      const sampleQuote={...defaultPrintQuote(),name:r.name,customerCompany:o.account,customerName:o.contact,notes:'Sample quote for CRM review',customerNote:'Please review quantities and delivery requirements.',lineItems:[{id:crypto.randomUUID(),name:o.title,description:'Production and fulfillment package',quantity:5000,customerTotal:o.oneTime,sourceLabel:'Sample costing'}]};
      const snapshot=r.snapshot|| (r.collection==='proposals'?{proposal:sampleProposal}:r.collection==='printQuotes'?{printQuote:sampleQuote}:r.collection==='services'?{serviceRows:structuredClone(serviceSeedRows),serviceScenario:'salesmachine',serviceExpanded:[...serviceExpanded]}:r.collection==='sourcing'?{sourcing:{quotes:{},selected:{}}}:r.collection==='ecomm'?{ecommPriceList:{...defaultEcommPriceList(),name:r.name}}:{rows:estimateRows});
      r.snapshot=structuredClone(snapshot);
      const native={[t.numberKey]:r.number,name:r.name,version:r.version,status:'draft',snapshot,updatedAt:savedAt,versions:[{version:r.version,name:r.name,snapshot,updatedAt:savedAt}]};
      if(isLibraryRecordCollection(r.collection)){
        const pool=libraryRecordsFor(r.collection);
        const existing=pool.find(x=>x[t.numberKey]===r.number);
        if(!existing)setLibraryRecordsFor(r.collection,[...pool,{...native,attachedWorkspaces:[o.containerId]}]);
        else if(!libraryRecordAttachmentList(existing).includes(o.containerId))setLibraryRecordsFor(r.collection,pool.map(x=>x===existing?{...x,attachedWorkspaces:[...libraryRecordAttachmentList(x),o.containerId]}:x));
      }else if(!w.records[r.collection].some(x=>x[t.numberKey]===r.number))w.records[r.collection].push(native);
      if(!o.editor)activeWorkspaceRecords[r.collection]=r.number;
      if(!o.editor&&r.collection==='proposals')proposal=structuredClone(snapshot.proposal);
      if(!o.editor&&r.collection==='printQuotes')printQuote=structuredClone(snapshot.printQuote);
      if(r.collection==='estimates'){
        if(!o.editor)setProjectNumber(r.number);
        const store=JSON.parse(localStorage.getItem('crm-preview-estimates')||'[]');
        if(!store.some(x=>x.projectNumber===r.number))store.push({projectNumber:r.number,projectName:r.name,clientName:o.account,workspaceNumber:o.containerId,rows:estimateRows,estimateYear:String(new Date().getFullYear())});
        localStorage.setItem('crm-preview-estimates',JSON.stringify(store));
      }
    }
    w.activeRecords=structuredClone(activeWorkspaceRecords);saveWorkspaces();refreshRecordNumbers();
  }
  function bindOpportunity(id){
    if(db.selected===id)return;
    saveEditor();startBlankEstimate();
    db.selected=id||null;const o=db.opportunities.find(o=>o.id===id);
    if(o){
      if(!o.containerId)o.containerId=crypto.randomUUID();
      currentWorkspaceNumber=o.containerId;
      els.workspaceName.value=o.title;els.clientName.value=o.account;
      const e=o.editor;
      if(e){rows=structuredClone(e.rows);proposal=structuredClone(e.proposal);serviceRows=structuredClone(e.serviceRows);serviceScenario=e.serviceScenario;serviceExpanded=new Set(e.serviceExpanded);sourcing=structuredClone(e.sourcing);printQuote=structuredClone(e.printQuote);ecommPriceList=structuredClone(e.ecommPriceList);activeWorkspaceRecords=structuredClone(e.active);els.projectName.value=e.projectName;els.estimateYear.value=e.estimateYear;paymentSettings=structuredClone(e.paymentSettings);paymentDates=structuredClone(e.paymentDates);setProjectNumber(e.projectNumber);}
      else {els.projectName.value=o.title;els.estimateYear.value=String(new Date().getFullYear());proposal={...defaultProposal(),title:o.title,preparedFor:o.contact,campaign:o.title};printQuote={...defaultPrintQuote(),name:o.title,customerCompany:o.account,customerName:o.contact};}
      serviceEngagement=ServiceEngagement.restore(e?.serviceEngagement);
      els.serviceScenario.value=serviceScenario;
      const w=ensureWorkspace();seedRecordEditors(o,w);
    } else {printQuote={...defaultPrintQuote(),customerCompany:'',customerName:''};}
    window.render();persist();
  }
  function navigate(p){saveEditor();page=p;$('#crmDrawer').close();document.body.dataset.crmPage=page;
    if(p!=='pipeline'){
      workspaceMode='full';setActiveView(p==='quote'?'printQuoteView':'proposalView');
      $$('.app-tab').forEach(t=>t.hidden=p==='quote'?!['printQuoteView','ecommView'].includes(t.dataset.view):!['proposalView','estimateView','servicesView','sourcingView'].includes(t.dataset.view));
    }
    render();
  }
  function openRecord(o,r){bindOpportunity(o.id);navigate(['printQuotes','ecomm'].includes(r.collection)?'quote':'proposals');
    const t=recordTypeFor(r.collection);
    if(r.collection==='estimates'){
      els.projectName.value=r.name;setProjectNumber(r.number);activeWorkspaceRecords.estimates=r.number;
      if(r.snapshot?.rows){rows=structuredClone(r.snapshot.rows);expanded=new Set(rows.map(x=>x.id));if(live)restoreLiveEstimate(r);}
    } else {
      let native=workspaces.flatMap(w=>w.records?.[r.collection]||[]).find(x=>x[t.numberKey]===r.number)||libraryRecordsFor(r.collection).find(x=>x[t.numberKey]===r.number);
      if(native) isLibraryRecordCollection(r.collection)?applyLibraryRecord(r.collection,native):applyWorkspaceRecord(r.collection,native);
      else{if(r.collection==='proposals')proposal={...defaultProposal(),title:r.name,preparedFor:o.contact};if(r.collection==='printQuotes')printQuote={...defaultPrintQuote(),name:r.name,customerCompany:o.account,customerName:o.contact};activeWorkspaceRecords[r.collection]=r.number;}
    }
    setActiveView(t.viewId);window.render();renderContext();icons();
  }
  function restoreLiveEstimate(r){
    const s=r.snapshot;rows=structuredClone(s.rows||[]);expanded=new Set(s.expanded||rows.map(x=>x.id));
    lookups=structuredClone(s.lookups||seedLookups);paymentSettings=structuredClone(s.paymentSettings||defaultPaymentSettings());paymentDates=structuredClone(s.paymentDates||{});
    els.estimateYear.value=s.estimateYear||'';els.projectName.value=r.name;els.estimateVersion.value=String(r.version);
    els.globalMarkup.value=s.globalMarkup??.4;els.tariffRate.value=s.tariffRate??.3;
    activePackage=s.activePackage||'All';activeTypes=new Set(s.activeTypes||Object.keys(typeLabels));setProjectNumber(r.number);
  }
  function hydrateLiveRecords(o,w){
    for(const t of workspaceRecordTypes){
      const groups=new Map();
      for(const r of live.records.filter(r=>r.collection===t.collection)){
        const g=groups.get(r.number)||[];g.push(r);groups.set(r.number,g);
      }
      const natives=[...groups.values()].map(versions=>{
        const newest=versions.at(-1),linked=o?.records.find(r=>r.number===newest.number),r=linked||newest;
        return {[t.numberKey]:r.number,name:r.name,version:r.version,snapshot:structuredClone(r.snapshot),versions:structuredClone(versions),
          updatedAt:r.updatedAt,attachedWorkspaces:db.opportunities.filter(o=>o.records.some(x=>x.number===r.number)).map(o=>o.containerId)};
      });
      if(isLibraryRecordCollection(t.collection))libraryRecords[t.collection]=natives;
      else if(w)w.records[t.collection]=o?natives.filter(r=>o.records.some(link=>link.number===r[t.numberKey])):natives;
    }
  }
  async function saveLiveRecord(collection,copy=false){
    if(saving||saveError)throw new Error(saveError||'Wait for opportunity save');
    const t=recordTypeFor(collection),o=db.opportunities.find(o=>o.id===db.selected);
    if(o?.status==='won')throw new Error('Reopen the opportunity before saving linked record changes');
    const number=collection==='estimates'?currentEstimateNumber():activeWorkspaceRecords[collection];
    const native=(isLibraryRecordCollection(collection)?libraryRecordsFor(collection):ensureWorkspace().records[collection]).find(r=>r[t.numberKey]===number);
    const existing=copy?null:live.records.find(r=>r.collection===collection&&r.number===number&&r.version===(native?.version||currentEstimateVersion()));
    const snapshot=collection==='estimates'?{rows:structuredClone(rows),lookups:structuredClone(lookups),paymentSettings:structuredClone(paymentSettings),paymentDates:structuredClone(paymentDates),estimateYear:els.estimateYear.value,expanded:[...expanded],activeTypes:[...activeTypes],activePackage,globalMarkup:asNumber(els.globalMarkup.value),tariffRate:asNumber(els.tariffRate.value)}:workspaceRecordSnapshot(t);
    const key=collection+':'+(copy?'copy:':'')+number;
    live.pendingCreates ||= new Map();
    if(!live.pendingCreates.has(key))live.pendingCreates.set(key,crypto.randomUUID());
    const saved=await live.request('records'+(existing?'/'+existing.id:''),existing?'PUT':'POST',{
      collection,snapshot,name:(workspaceRecordDisplayName(t)||'Untitled')+(copy?' Copy':''),version:existing?.version,creationKey:live.pendingCreates.get(key)});
    live.pendingCreates.delete(key);live.records.push(saved);
    if(o){const r=o.records.find(r=>r.id===saved.id);if(r)Object.assign(r,saved);else o.records.push({...saved,role:'Component'});}
    activeWorkspaceRecords[collection]=saved.number;
    if(collection==='estimates'){setProjectNumber(saved.number);els.estimateVersion.value=String(saved.version);}
    hydrateLiveRecords(o,ensureWorkspace());clearWorkspaceRecordDirty(collection);window.render();await persist();
    if(saveError)throw new Error(`${saved.number} v${saved.version} was saved, but opportunity attachment failed: ${saveError}`);
    setSaveStatus(`Saved ${saved.number} v${saved.version} to database`);return saved.number;
  }
  if(live){
    const companyOptions=()=>[['','Select client'],['__new__','+ Add new client...'],...live.lookups.companies.map(c=>[c.id,c.name])];
    const contactOptions=id=>[['','Select contact'],['__new__','+ Add new contact...'],...live.lookups.contacts.filter(c=>c.companyId===id).map(c=>[c.id,c.name])];
    function resetContact(f){
      f.elements.contactRef.innerHTML=opts(contactOptions(f.elements.accountRef.value),'');
      f.elements.contactRef.disabled=!live.lookups.companies.some(c=>c.id===f.elements.accountRef.value);
      f.elements.contact.value='';f.elements.email.value='';f.dataset.contactRef='';
      lookupFields(f,'contact',false);
    }
    resetLiveContact=resetContact;
    async function addLookup(f,kind){
      const fields=f.querySelector(`[data-create-fields=${kind}]`),status=fields.querySelector('[role=status]');
      const payload=kind==='company'?{name:f.elements.newClientName.value}:{companyId:f.elements.accountRef.value,firstName:f.elements.newContactFirst.value,lastName:f.elements.newContactLast.value,email:f.elements.newContactEmail.value};
      fields.dataset.creationKey ||= crypto.randomUUID();payload.creationKey=fields.dataset.creationKey;
      const controls=[...f.querySelectorAll('input,select,textarea,button')].map(el=>[el,el.disabled]);
      controls.forEach(([el])=>el.disabled=true);f.dataset.lookupSaving='true';status.textContent='Saving...';
      try{
        const saved=await live.request(kind==='company'?'companies':'contacts','POST',payload);
        if(kind==='company'){
          live.lookups.companies.push(saved);live.lookups.companies.sort((a,b)=>a.name.localeCompare(b.name));
          f.elements.accountRef.innerHTML=opts(companyOptions(),saved.id);f.elements.account.value=saved.name;f.dataset.accountRef=saved.id;
        }else{
          live.lookups.contacts.push(saved);f.elements.contactRef.innerHTML=opts(contactOptions(saved.companyId),saved.id);
          f.elements.contact.value=saved.name;f.elements.email.value=saved.email||'';f.dataset.contactRef=saved.id;
        }
        lookupFields(f,kind,false);delete fields.dataset.creationKey;fields.querySelectorAll('input').forEach(el=>el.value='');status.textContent='';toast(kind==='company'?'Client added':'Contact added');
      }catch(e){status.textContent=e.message;}
      finally{controls.forEach(([el,disabled])=>el.disabled=disabled);delete f.dataset.lookupSaving;}
      if(kind==='company'&&fields.hidden)resetContact(f);
    }
    addLiveLookup=addLookup;
    const oldEdit=editModal;
    editModal=(o=null,stage='intake')=>{
      oldEdit(o,stage);
      const f=$('#crmEditForm');
      const accountValue=o?.accountRef||(o?.account?'__legacy__':''),contactValue=o?.contactRef||(o?.contact?'__legacy__':'');
      const companies=companyOptions(),contacts=contactOptions(o?.accountRef);
      if(accountValue==='__legacy__')companies.push(['__legacy__',o.account+' (unlinked)']);
      if(contactValue==='__legacy__')contacts.push(['__legacy__',o.contact+' (unlinked)']);
      f.elements.account.closest('label').outerHTML=`<div class="crm-lookup-field">${select('Client / account','accountRef',companies,accountValue)}<input type="hidden" name="account" value="${esc(o?.account||'')}"><fieldset data-create-fields="company" hidden><legend>New client</legend>${input('Client name','newClientName','')}<p role="status"></p><div>${btn('add-company','Add client','plus')}${btn('cancel-lookup','Cancel','','data-kind="company"')}</div></fieldset></div>`;
      f.elements.contact.closest('label').outerHTML=`<div class="crm-lookup-field">${select('Contact / decision-maker','contactRef',contacts,contactValue)}<input type="hidden" name="contact" value="${esc(o?.contact||'')}"><fieldset data-create-fields="contact" hidden><legend>New contact</legend>${input('First name','newContactFirst','')}${input('Last name','newContactLast','')}${input('Email','newContactEmail','','email')}<p role="status"></p><div>${btn('add-contact','Add contact','plus')}${btn('cancel-lookup','Cancel','','data-kind="contact"')}</div></fieldset></div>`;
      f.elements.accountRef.required=true;f.elements.contactRef.disabled=!accountValue;
      lookupFields(f,'company',false);lookupFields(f,'contact',false);
      f.dataset.accountRef=accountValue;f.dataset.contactRef=contactValue;
      f.querySelector('#crmAccounts')?.remove();
    };
    // Legacy browser stores remain untouched; DB snapshots hydrate editor caches.
    workspaces=[];libraryRecords={printQuotes:[],ecomm:[]};saveWorkspaces=()=>{};saveLibraryRecords=()=>{};
    hydrateLiveRecords(null,ensureWorkspace());
    const save=async(c,copy=false)=>{if(recordSaving){toast('Saving record; please wait');return '';}
      recordSaving=true;
      try{return await saveLiveRecord(c,copy);}catch(e){toast('Save needs attention: '+e.message);setSaveStatus('Save needs attention: '+e.message);return '';}
      finally{recordSaving=false;}};
    saveRecordFromManager=c=>save(c);saveWorkspaceRecordCollection=c=>save(c);
    newVersionFromManager=c=>save(c);duplicateRecordFromManager=c=>save(c,true);
    saveCurrentEstimate=async()=>Boolean(await save('estimates'));duplicateCurrentEstimate=()=>save('estimates',true);
    attachLibraryRecordToWorkspace=async c=>{
      const o=db.opportunities.find(o=>o.id===db.selected);if(!o){toast('Select an opportunity first');return;}
      const r=live.records.filter(r=>r.collection===c&&r.number===activeWorkspaceRecords[c]).at(-1);
      if(!r){toast('Save the record first');return;}if(!o.records.some(x=>x.id===r.id))o.records.push({...r,role:'Component'});
      hydrateLiveRecords(o,ensureWorkspace());persist();window.render();
    };
    detachLibraryRecordFromWorkspace=async c=>{const o=db.opportunities.find(o=>o.id===db.selected);if(!o)return;o.records=o.records.filter(r=>!(r.collection===c&&r.number===activeWorkspaceRecords[c]));hydrateLiveRecords(o,ensureWorkspace());persist();window.render();};
    const oldLoad=loadWorkspaceRecord;
    loadWorkspaceRecord=async(c,...args)=>{
      if(c!=='estimates')return oldLoad(c,...args);
      const r=live.records.filter(r=>r.collection===c&&r.number===(args[0]||activeWorkspaceRecords[c])&&(!args[1]||r.version===Number(args[1]))).at(-1);
      if(r){restoreLiveEstimate(r);window.render();}else toast('Attach and open a saved estimate from opportunity Records.');
    };
    recordCatalog=()=>live.records.filter(r=>!live.records.some(n=>n.id===r.id&&n.version>r.version)).map(r=>({...r,account:'Shared record'}));
    const sampleDocuments=documents;
    documents=o=>{
      const host=document.createElement('div');host.innerHTML=sampleDocuments(o);
      host.querySelectorAll('[data-action="document-event"],[data-document-primary]').forEach(e=>e.remove());
      const button=host.querySelector('[data-action="document-new"]');if(button)button.textContent='Open proposal to send';
      host.querySelectorAll('p').forEach(p=>{if(p.textContent.includes('Sample lifecycle'))p.textContent='DocuSeal status from saved transactions';if(p.textContent.includes('Sample signed'))p.textContent='Signed transaction recorded. Review archived documents in the proposal.';});
      return host.innerHTML;
    };
  }
  document.addEventListener('click',async e=>{
    const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,o=current();
    if(a==='refresh'){location.reload();return;}
    if(live&&(saving||recordSaving||saveError)&&!['export','close-detail','close-modal'].includes(a)){toast(saveError||'Saving; please wait');return;}
    if(live&&['add-company','add-contact'].includes(a)){await addLiveLookup(b.closest('form'),a==='add-company'?'company':'contact');return;}
    if(live&&a==='cancel-lookup'){
      const f=b.closest('form'),company=b.dataset.kind==='company';
      lookupFields(f,b.dataset.kind,false);
      f.elements[company?'accountRef':'contactRef'].value=f.dataset[company?'accountRef':'contactRef']||'';return;
    }
    if(a==='nav')navigate(b.dataset.page);
    if(a==='pipeline'){selectPipeline(b.dataset.pipeline);search='';kind='all';attention=false;render();$(`[data-action=pipeline][data-pipeline=${pipeline}]`).focus();}
    if(a==='view'){view=b.dataset.view;if(view==='handoffs')scope='won';else if(scope==='won')scope='open';render();}
    if(a==='new')editModal(null,b.dataset.stage||'intake');
    if(a==='edit'){if(o.status==='won')toast('Reopen the opportunity before changing agreed commercial details.');else editModal(o);}
    if(a==='move-pipeline')modal('Move opportunity',`<form id="crmPipelineForm" class="crm-form"><p><strong>${esc(o.title)}</strong><br>${esc(o.number)}</p>${select('Destination pipeline','pipeline',M.pipelines.map(p=>[p.id,p.name]),M.pipelineFor(o))}<footer>${btn('close-modal','Cancel')}<button type="submit" class="crm-btn primary">Move opportunity</button></footer></form>`);
    if(a==='open')details(b.dataset.id);
    if(a==='handoff-open')details(b.dataset.id,'handoff');
    if(a==='close-detail'){$('#crmDrawer').close();lastFocus?.focus();}
    if(a==='close-modal')$('#crmDialog').close();
    if(a==='detail-tab'){detailTab=b.dataset.tab;renderDetail();}
    if(a==='attention'){attention=!attention;render();}
    if(a==='clear-filters'){search='';owner=kind='all';scope='open';attention=false;render();}
    if(a==='stage'){if(b.dataset.stage==='won')closeReview(o);else{M.move(o,b.dataset.stage);persist();render();renderDetail();}}
    if(a==='win')closeReview(o);
    if(a==='confirm-win'){const issues=M.move(o,'won');if(!issues.length){$('#crmDialog').close();toast(o.number+' closed won');render();renderDetail();}}
    if(a==='lost')modal('Close opportunity as lost',`<form id="crmLostForm" class="crm-form">${select('Reason','reason',['Timing / deferred','Budget','Competitor','No decision','Not a fit'],'Timing / deferred')}<label class="crm-field">Notes<textarea name="note" rows="3"></textarea></label><footer>${btn('close-modal','Cancel')}<button class="crm-btn danger" type="submit">Confirm lost</button></footer></form>`);
    if(a==='reopen'){M.move(o,'qualified');render();renderDetail();}
    if(a==='complete-activity'){const target=db.opportunities.find(x=>x.id===b.dataset.id);const act=target.activities.find(x=>x.id===b.dataset.activity);act.done=true;M.stamp(target,'Completed: '+act.title,'activity');render();if($('#crmDrawer').open)renderDetail();toast('Activity completed');}
    if(a==='add-activity')modal('Schedule activity',`<form id="crmActivityForm" class="crm-form">${input('Activity','title','','text','required') }<div class="crm-form-grid">${select('Type','kind',['Call','Meeting','Email','Task'],'Task')}${input('Due date','due',M.date(1),'date','required')}${select('Owner','owner',people,o.owner)}</div><footer>${btn('close-modal','Cancel')}<button type="submit" class="crm-btn primary">Schedule</button></footer></form>`);
    if(a==='attach')attachModal();
    if(a==='attach-record'){const r=recordCatalog().find(x=>x.number===b.dataset.number&&x.collection===b.dataset.collection);bindOpportunity(o.id);o.records.push({...structuredClone(r),id:live?r.id:crypto.randomUUID(),role:'Component'});seedRecordEditors(o,ensureWorkspace());M.stamp(o,'Attached '+r.number);$('#crmDialog').close();render();renderDetail();}
    if(a==='detach'){const r=o.records.find(r=>r.id===b.dataset.record);o.records=o.records.filter(r=>r.id!==b.dataset.record);if(isLibraryRecordCollection(r.collection)){const t=recordTypeFor(r.collection);setLibraryRecordsFor(r.collection,libraryRecordsFor(r.collection).map(x=>x[t.numberKey]===r.number?{...x,attachedWorkspaces:libraryRecordAttachmentList(x).filter(n=>n!==o.containerId),attachedToWorkspace:''}:x));}M.stamp(o,'Detached '+r.number);render();renderDetail();}
    if(a==='record-open')openRecord(o,o.records.find(r=>r.id===b.dataset.record));
    if(a==='record-new'){bindOpportunity(o.id);navigate(['printQuotes','ecomm'].includes(b.dataset.collection)?'quote':'proposals');const previous=activeWorkspaceRecords[b.dataset.collection];await newWorkspaceRecord(b.dataset.collection);if(isLibraryRecordCollection(b.dataset.collection)&&activeWorkspaceRecords[b.dataset.collection]!==previous)db.pendingLink={opportunity:o.id,collection:b.dataset.collection};renderContext();icons();}
    if(a==='document-new'){
      if(live){const proposal=o.records.find(r=>r.collection==='proposals'&&r.role==='Primary offer')||o.records.find(r=>r.collection==='proposals');
        if(proposal)openRecord(o,proposal);else toast('Attach a saved proposal first.');return;}
      const rs=o.records.filter(r=>['proposals','printQuotes'].includes(r.collection));
      modal('Prepare sample signature request',`<form id="crmDocumentForm" class="crm-form">${select('Offer version','record',rs.map(r=>[r.id,r.number+' v'+r.version+' · '+r.name]),rs[0]?.id)}${input('Recipient email','recipient',o.email,'email','required')}<p class="crm-muted">Local sample only. This action does not contact DocuSeal.</p><footer>${btn('close-modal','Cancel')}<button type="submit" class="crm-btn primary" ${!rs.length?'disabled':''}>Prepare sample</button></footer></form>`);
    }
    if(a==='document-event'&&!live){M.receive(o,b.dataset.doc,b.dataset.status);render();renderDetail();}
    if(a==='queue-handoff'){const h=o.handoffs[b.dataset.lane];if(!M.handoffIssues(o,b.dataset.lane).length){h.status='queued';M.stamp(o,b.dataset.lane+' handoff queued locally');render();renderDetail();}}
    if(a==='accept-handoff'){o.handoffs[b.dataset.lane].status='accepted';M.stamp(o,b.dataset.lane+' handoff receipt recorded locally');render();renderDetail();}
    if(a==='billing-ready'&&!M.billingIssues(o).length){o.billing.status='ready';M.stamp(o,'Billing details marked ready for future Xero relay');render();renderDetail();}
    if(a==='export-handoff')download(o.number+'-handoff.json',JSON.stringify({opportunity:o.number,account:o.account,contact:o.contact,value:M.value(o),records:o.records,acceptance:o.documents.filter(d=>d.primary),handoffs:o.handoffs,billing:o.billing},null,2));
    if(a==='export')download('sharpdots-opportunities-draft.json',JSON.stringify(db,null,2));
  });
  document.addEventListener('submit',e=>{
    const f=e.target;if(!f.closest('#crmShell'))return;e.preventDefault();const data=Object.fromEntries(new FormData(f));const o=current();
    if(live&&(saving||recordSaving||saveError)){toast(saveError||'Saving; please wait');return;}
    if(f.id==='crmEditForm'){
      if(live&&(f.dataset.lookupSaving||f.elements.accountRef.value==='__new__'||f.elements.contactRef.value==='__new__')){toast('Finish adding the client or contact, or cancel that addition.');return;}
      if(live){if(data.accountRef==='__legacy__')data.accountRef='';if(data.contactRef==='__legacy__')data.contactRef='';for(const key of ['newClientName','newContactFirst','newContactLast','newContactEmail'])delete data[key];}
      const existing=db.opportunities.find(o=>o.id===f.dataset.id);const patch={...data,oneTime:Number(data.oneTime),monthly:Number(data.monthly),term:Number(data.term)};
      if(live)patch.ownerId=live.lookups.users.find(u=>u.username===patch.owner)?.id;
      if(existing){delete patch.stage;if(['oneTime','monthly','term','account'].some(k=>existing[k]!==patch[k])){existing.approval={method:'',reference:''};existing.documents.forEach(d=>d.superseded=true);M.stamp(existing,'Commercial terms changed; acceptance requires review');}M.assignPipeline(existing,patch.pipeline);Object.assign(existing,patch);M.stamp(existing,'Opportunity details updated');}
      else{const created=M.make({...patch,creationKey:crypto.randomUUID(),number:live?'Assigning…':M.nextNumber(db.opportunities)});created.handoffs.production.status=created.kind==='Services'?'not-required':'draft';created.handoffs.engagement.status=created.kind==='Print'?'not-required':'draft';M.stamp(created,'Opportunity created','created');db.opportunities.push(created);selected=created.id;}
      selectPipeline(patch.pipeline);$('#crmDialog').close();render();details(selected);toast(live?'Saving opportunity…':'Opportunity saved');
    }
    if(f.id==='crmPipelineForm'){
      M.assignPipeline(o,data.pipeline);selectPipeline(data.pipeline);search='';kind='all';attention=false;
      $('#crmDialog').close();render();renderDetail();toast(live?'Saving pipeline…':'Moved to '+M.pipelineName(o));
    }
    if(f.id==='crmLostForm'){o.status='lost';o.lostReason=data.reason;o.closedAt=new Date().toISOString();M.stamp(o,'Closed lost: '+data.reason+(data.note?' · '+data.note:''));$('#crmDialog').close();render();renderDetail();}
    if(f.id==='crmActivityForm'){o.activities.push({...data,id:crypto.randomUUID(),done:false});M.stamp(o,'Scheduled: '+data.title,'activity');$('#crmDialog').close();render();renderDetail();}
    if(f.id==='crmNoteForm'){M.stamp(o,data.note,'note');if(live)o.note=data.note;render();renderDetail();}
    if(f.id==='crmApprovalForm'){o.approval=data;M.stamp(o,'Approval reference updated');render();renderDetail();toast('Approval saved');}
    if(f.id==='crmDocumentForm'){const r=o.records.find(r=>r.id===data.record);o.documents.forEach(d=>d.primary=false);o.documents.push({id:crypto.randomUUID(),number:r.number,version:r.version,status:'prepared',primary:true,recipient:data.recipient,reference:'SAMPLE-'+(o.documents.length+1),updatedAt:new Date().toISOString()});M.stamp(o,'Prepared sample request for '+r.number,'document');$('#crmDialog').close();render();renderDetail();}
    if(f.dataset.handoffForm){const h=o.handoffs[f.dataset.handoffForm];Object.assign(h,{owner:data.owner,target:data.target,scope:data.scope,assets:!!data.assets,status:data.required?'draft':'not-required'});M.stamp(o,f.dataset.handoffForm+' handoff details updated');render();renderDetail();toast('Handoff saved');}
    if(f.id==='crmBillingForm'){Object.assign(o.billing,data,{deposit:Number(data.deposit),status:'not-ready'});M.stamp(o,'Billing details updated');render();renderDetail();toast('Billing details saved');}
  });
  document.addEventListener('change',e=>{
    const t=e.target,o=current();
    if(live&&(saving||recordSaving||saveError))return;
    if(t.name==='pipeline'&&t.form?.id==='crmEditForm'&&!t.form.dataset.id&&t.form.elements.kind.value!=='Mixed')t.form.elements.kind.value=t.value==='quotes'?'Print':'Services';
    if(live&&t.name==='accountRef'){
      if(t.value==='__new__'){lookupFields(t.form,'company',true);t.form.elements.newClientName.focus();return;}
      const f=t.form,c=live.lookups.companies.find(c=>c.id===t.value);
      lookupFields(f,'company',false);
      if(c)f.elements.account.value=c.name;else if(t.value!=='__legacy__')f.elements.account.value='';
      f.dataset.accountRef=t.value;resetLiveContact(f);
    }
    if(live&&t.name==='contactRef'){
      if(t.value==='__new__'){if(!live.lookups.companies.some(c=>c.id===t.form.elements.accountRef.value)){t.value='';toast('Select a saved client before adding a contact');return;}lookupFields(t.form,'contact',true);t.form.elements.newContactFirst.focus();return;}
      const c=live.lookups.contacts.find(c=>c.id===t.value&&c.companyId===t.form.elements.accountRef.value);
      lookupFields(t.form,'contact',false);t.form.dataset.contactRef=t.value;
      if(c){t.form.elements.contact.value=c.name;t.form.elements.email.value=c.email||'';}else if(t.value!=='__legacy__'){t.form.elements.contact.value='';t.form.elements.email.value='';}
    }
    if(t.id==='crmOwner'){owner=t.value;render();}if(t.id==='crmKind'){kind=t.value;render();}if(t.id==='crmScope'){scope=t.value;render();}
    if(t.id==='crmOpportunity'){bindOpportunity(t.value);navigate(page);}
    if(t.dataset.qualification){o.qualification[t.dataset.qualification]=t.checked;M.stamp(o,'Qualification updated');render();renderDetail();}
    if(t.dataset.recordRole){if(t.value==='Primary offer')o.records.forEach(r=>{if(r.role==='Primary offer')r.role='Alternative';});o.records.find(r=>r.id===t.dataset.recordRole).role=t.value;persist();renderDetail();}
    if(t.dataset.documentPrimary){o.documents.forEach(d=>d.primary=d.id===t.dataset.documentPrimary&&t.checked);persist();renderDetail();}
  });
  document.addEventListener('input',e=>{if(e.target.id==='crmSearch'){search=e.target.value;refreshResults();}if(e.target.id==='crmRecordSearch'){$('#crmAttachList').innerHTML=attachList(e.target.value);icons();}});
  document.addEventListener('keydown',e=>{
    const b=e.target.closest('[data-action=pipeline]');
    if(!b||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    e.preventDefault();
    const index=M.pipelines.findIndex(p=>p.id===pipeline),next=e.key==='Home'?0:e.key==='End'?M.pipelines.length-1:(index+(e.key==='ArrowRight'?1:-1)+M.pipelines.length)%M.pipelines.length;
    $(`[data-action=pipeline][data-pipeline=${M.pipelines[next].id}]`).click();
  });
  document.addEventListener('click',e=>{const c=e.target.closest('.crm-deal');if(c&&!e.target.closest('[data-action]'))details(c.dataset.id);});
  document.addEventListener('keydown',e=>{const c=e.target.closest('.crm-deal');if(c&&['Enter',' '].includes(e.key)){e.preventDefault();details(c.dataset.id);}});
  document.addEventListener('dragstart',e=>{const c=e.target.closest('.crm-deal');if(c){dragId=c.dataset.id;e.dataTransfer.setData('text/plain',dragId);e.dataTransfer.effectAllowed='move';c.classList.add('dragging');}});
  document.addEventListener('dragover',e=>{if(e.target.closest('.crm-stage')){e.preventDefault();e.dataTransfer.dropEffect='move';}});
  document.addEventListener('drop',e=>{const s=e.target.closest('.crm-stage');if(!s||!dragId)return;e.preventDefault();const o=db.opportunities.find(o=>o.id===dragId);dragId=null;if(s.dataset.stage==='won'){selected=o.id;closeReview(o);}else if(s.dataset.stage!=='lost'){M.move(o,s.dataset.stage);render();toast(o.number+' moved to '+M.stages.find(x=>x.id===o.stage).name);}});
  document.addEventListener('dragend',()=>{$$('.dragging').forEach(x=>x.classList.remove('dragging'));dragId=null;});
  $('#crmDrawer').addEventListener('click',e=>{if(e.target===$('#crmDrawer'))$('#crmDrawer').close();});
  $('#crmDialog').addEventListener('click',e=>{if(e.target===$('#crmDialog'))$('#crmDialog').close();});
  window.addEventListener('beforeunload',e=>{if(!live)saveEditor();else if(saving||recordSaving||saveError){e.preventDefault();e.returnValue='';}});
  // Reflect legacy save feedback in the opportunity shell without changing the calculators.
  new MutationObserver(()=>{const text=els.estimateSaveStatus.textContent;if(text){saveEditor();const target=$('#crmSaveFeedback');if(target)target.textContent=text.replace(/Workspace/g,'Opportunity').replace(/workspace/g,'opportunity').replace(/W-\d{6}/g,'');}}).observe(els.estimateSaveStatus,{childList:true,subtree:true,characterData:true});
  // Preserve the old container key internally; opportunity is the only visible parent identity.
  for(const config of Object.values(libraryRecordUi)){config.attachedLabel=config.attachedLabel.replace('Workspace','Opportunity');config.attachedTitle=config.attachedTitle.replace('workspace','opportunity');config.detachedTitle=config.detachedTitle.replace('workspace','opportunity');}
  function updateLegacyLabels(){
    const targets=$$('.tab-record-controls, .placeholder-grid, .placeholder-panel > .section-head, #libraryRecordPickerDialog');
    for(const root of targets){
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      let n;
      while((n=walker.nextNode())){
        if(n.parentElement.closest('input,textarea,script,style'))continue;
        let text=n.nodeValue.replace(/Workspace/g,'Opportunity').replace(/workspace/g,'opportunity');
        for(const o of db.opportunities)if(o.containerId)text=text.replaceAll(o.containerId,o.number);
        if(text!==n.nodeValue)n.nodeValue=text;
      }
    }
    if(!db.selected)$$('[data-record-action="attach"]').forEach(b=>{b.disabled=true;b.title='Choose an opportunity before attaching';});
  }
  new MutationObserver(updateLegacyLabels).observe($('.app-shell'),{subtree:true,childList:true,characterData:true});
  updateLegacyLabels();
  db.selected=null;
  render();
})();
