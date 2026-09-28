(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CrmModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const stages = [
    {id:'intake', name:'Intake', probability:10, color:'#8a939d'},
    {id:'qualified', name:'Qualified', probability:25, color:'#369e8a'},
    {id:'costing', name:'Scope & cost', probability:45, color:'#4b85c5'},
    {id:'ready', name:'Ready to send', probability:65, color:'#8b72bb'},
    {id:'review', name:'Client review', probability:80, color:'#c59336'},
    {id:'won', name:'Won', probability:100, color:'#32845f'}
  ];
  const collectionMeta = {
    proposals:['Proposal','P','proposalNumber','proposalView'],
    estimates:['Estimate','E','projectNumber','estimateView'],
    services:['Services','S','serviceNumber','servicesView'],
    sourcing:['Sourcing','SRC','sourcingNumber','sourcingView'],
    printQuotes:['Print quote','PQ','printQuoteNumber','printQuoteView'],
    ecomm:['Price list','EPL','ecommNumber','ecommView']
  };
  function nextNumber(list) { return 'O-' + String(Math.max(0, ...list.map(o=>Number(o.number?.split('-')[1])||0))+1).padStart(6,'0'); }
  function value(o) { return Number(o.oneTime||0) + Number(o.monthly||0)*Number(o.term||0); }
  function probability(o) { return o.status==='lost'?0:o.status==='won'?100:(stages.find(s=>s.id===o.stage)?.probability||0); }
  function acceptedDoc(o) {
    const offer=o.records.find(r=>r.role==='Primary offer');
    return o.documents.find(d=>d.status==='completed' && d.primary && !d.superseded && offer && d.number===offer.number && Number(d.version)===Number(offer.version));
  }
  function closeIssues(o) {
    const issues=[];
    if(!o.account.trim() || !o.contact.trim()) issues.push('Add an account and decision-maker.');
    if(!acceptedDoc(o) && !(o.approval?.method && o.approval?.reference?.trim())) issues.push('Select a signed primary document or record an approval reference.');
    if(value(o)<=0) issues.push('Enter an agreed commercial value.');
    return issues;
  }
  function handoffIssues(o, lane) {
    const h=o.handoffs[lane];
    const issues=[];
    if(o.status!=='won') issues.push('Close the opportunity as won.');
    if(closeIssues(o).length) issues.push('Review current commercial acceptance.');
    if(h.status==='not-required') issues.push('Enable this delivery handoff.');
    if(!h.owner) issues.push('Assign a receiving owner.');
    if(!h.target) issues.push('Set a target start date.');
    if(!h.scope?.trim()) issues.push('Confirm the delivery scope.');
    if(!h.assets) issues.push('Confirm assets and dependencies.');
    return issues;
  }
  function billingIssues(o) {
    const issues=[];
    if(o.status!=='won') issues.push('Close the opportunity as won.');
    if(closeIssues(o).length) issues.push('Review current commercial acceptance.');
    if(!o.billing.contact.trim()) issues.push('Add a billing contact.');
    if(!o.billing.terms) issues.push('Set payment terms.');
    if(!o.billing.start) issues.push('Set the first invoice date.');
    return issues;
  }
  function stamp(o, text, type='change') { o.history.unshift({id:crypto.randomUUID(),text,type,at:new Date().toISOString()}); }
  function move(o, stage) {
    if(!stages.some(s=>s.id===stage)) return ['Unknown stage.'];
    if(stage==='won') { const issues=closeIssues(o); if(issues.length)return issues; }
    o.stage=stage; o.status=stage==='won'?'won':'open';
    o.stageSince=new Date().toISOString();
    if(stage==='won') o.closedAt=new Date().toISOString();
    else {o.closedAt=null; Object.values(o.handoffs).forEach(h=>{if(h.status!=='not-required')h.status='draft';}); o.billing.status='not-ready';}
    stamp(o, 'Stage changed to '+stages.find(s=>s.id===stage).name);
    return [];
  }
  function receive(o, docId, status) {
    const d=o.documents.find(d=>d.id===docId);
    if(!d)return;
    // Terminal provider states cannot be overwritten by late viewed/sent events.
    if(['completed','declined','expired'].includes(d.status))return;
    const ranks={prepared:0,sent:1,viewed:2,completed:3,declined:3,expired:3,failed:3};
    if(!(status in ranks) || ranks[status]<ranks[d.status] || status===d.status)return;
    d.status=status; d.updatedAt=new Date().toISOString();
    if(status==='completed') { d.signedPdf=true; d.certificate=true; }
    stamp(o, `${d.number} v${d.version}: ${status} (sample DocuSeal event)`, 'document');
  }
  const date = (offset) => {const d=new Date();d.setDate(d.getDate()+offset);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  function make(data={}) {
    return {id:crypto.randomUUID(),number:'',title:'',account:'',contact:'',email:'',owner:'John Tan',kind:'Print',source:'Existing client',stage:'intake',status:'open',oneTime:0,monthly:0,term:3,close:date(14),createdAt:new Date().toISOString(),stageSince:new Date().toISOString(),notes:'',qualification:{need:false,budget:false,authority:false,timing:false},records:[],documents:[],activities:[],history:[],approval:{method:'',reference:''},billing:{status:'not-ready',contact:'',terms:'Net 30',start:'',deposit:50,po:'',invoiceRef:'',payment:'not-invoiced'},handoffs:{production:{status:'draft',owner:'',target:'',scope:'',assets:false},engagement:{status:'not-required',owner:'',target:'',scope:'',assets:false}},...data};
  }
  function samples() {
    const inputs=[
      ['Seasonal welcome kits','Evergreen Retail','intake','Print',18500,0,'Maya Chen','John Tan',3],
      ['Regional partner campaign','Luma Health','intake','Mixed',12000,2500,'Nora Patel','Amanda Tan',1],
      ['Member renewal program','Westhaven Association','qualified','Services',3500,4200,'Sam Rivera','John Tan',2],
      ['Fall product catalog','Cedar & Co.','qualified','Print',14750,0,'Alex Morgan','Warren Corrales',-1],
      ['Multi-location launch','Marlow Dental','costing','Mixed',8200,1800,'Taylor Reed','Amanda Tan',2],
      ['2027 donor appeal','Harbor Foundation','costing','Print',28600,0,'Jamie Park','Warren Corrales',0],
      ['Outbound appointment program','Summit Industrial','ready','Services',6800,5100,'Casey Lee','John Tan',1],
      ['Quarterly postcard series','Juniper Veterinary','ready','Print',9650,0,'Riley Brooks','Amanda Tan',0],
      ['Customer reactivation','Atlas Pet Care','review','Mixed',4800,1200,'Jordan Wells','John Tan',-2],
      ['Event kits & fulfillment','Northstar Events','review','Print',22400,0,'Avery Kim','Warren Corrales',1],
      ['New location rollout','Oakline Fitness','won','Mixed',16000,2400,'Drew Ellis','Amanda Tan',2],
      ['Distributor sample packs','Kestrel Supply','won','Print',12800,0,'Morgan Lane','Warren Corrales',0]
    ];
    return inputs.map((a,i)=>{
      const [title,account,stage,kind,oneTime,monthly,contact,owner,offset]=a;
      const o=make({number:'O-'+String(i+1).padStart(6,'0'),title,account,stage,kind,oneTime,monthly,contact,owner,email:'review@'+account.toLowerCase().replace(/[^a-z]/g,'')+'.example',status:stage==='won'?'won':'open',close:date(8+i),stageSince:date(-i%5),notes:'Confirm scope, audience, timing and approval responsibilities before release.'});
      o.qualification={need:i>1,budget:i>3,authority:i>2,timing:i>1};
      o.activities=[{id:crypto.randomUUID(),kind:i%2?'Call':'Task',title:['Discovery call','Confirm campaign scope','Review pricing with client','Request print specifications'][i%4],due:date(offset),owner,done:false}];
      o.history=[{id:crypto.randomUUID(),text:'Sample opportunity created',type:'created',at:date(-7)}];
      const prefix=kind==='Print'?'PQ':'P';
      const number=prefix+'-'+String(101+i).padStart(6,'0');
      if(i>1)o.records=[{id:crypto.randomUUID(),collection:prefix==='P'?'proposals':'printQuotes',number,name:title,version:1,role:'Primary offer',value:value(o)}];
      if(i>3)o.records.push({id:crypto.randomUUID(),collection:'estimates',number:'E-'+String(101+i).padStart(6,'0'),name:title+' costing',version:1,role:'Cost basis',value:value(o)});
      if(monthly&&i>3)o.records.push({id:crypto.randomUUID(),collection:'services',number:'S-'+String(101+i).padStart(6,'0'),name:'Campaign services',version:1,role:'Component',value:monthly});
      if(i>=8)o.documents=[{id:crypto.randomUUID(),number,version:1,status:i>=10?'completed':i===8?'viewed':'sent',primary:true,signedPdf:i>=10,certificate:i>=10,recipient:o.email,updatedAt:date(-1),reference:'SAMPLE-'+String(i+1)}];
      o.billing.contact=o.email; o.billing.start=stage==='won'?date(1):'';
      for(const [lane,h]of Object.entries(o.handoffs)){
        const required=lane==='production'?kind!=='Services':kind!=='Print';
        h.status=required?'draft':'not-required';h.scope=required?title:'';
        if(stage==='won'&&required){h.owner=lane==='production'?'Warren Corrales':'Amanda Tan';h.target=date(5);h.assets=i===11;}
      }
      return o;
    });
  }
  return {stages,collectionMeta,nextNumber,value,probability,acceptedDoc,closeIssues,handoffIssues,billingIssues,stamp,move,receive,make,samples,date};
});
