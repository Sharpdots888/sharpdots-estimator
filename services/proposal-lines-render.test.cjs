const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const A=require('./proposal-lines');
const source=fs.readFileSync(require.resolve('../app.js'),'utf8');
function fn(name){const start=source.indexOf('function '+name+'('),end=source.indexOf('\nfunction ',start+1);assert.ok(start>=0);return source.slice(start,end<0?source.length:end);}
function fixture(){
 const nodes={},get=name=>nodes[name]||(nodes[name]={hidden:false,textContent:'',innerHTML:'',toggleAttribute(_,hidden){this.hidden=hidden;}});
 const c={proposal:{additionalLines:[{id:'fictional-added',name:'Fictional audience option',description:'Fictional scope',quantity:1,unitPrice:1200,cadence:'once',months:1}],outputScope:'schedule',outputAudience:'internal',pricingMode:'detail'},ProposalLines:A,
 CeEngagement:{isCatalog:()=>false},serviceScenario:'livingOps',serviceEngagement:{name:'Fictional base',products:[{}]},serviceScenarioNames:{},
 proposalHasSection:s=>['services','estimate'].includes(s),catalogClientOutputBlocked:()=>false,proposalIsClientOutput:()=>false,
 proposalServicesState:()=>({}),serviceTermMode:()=> 'activation',proposalServiceTotals:()=>({activationPrice:0,monthlyPrice:800,termMonths:1,complete:true}),
 proposalBaseServicesRows:()=>[{row:{item:'Fictional management',platform:'Scope'},calc:{activationPrice:0,monthlyPrice:800}}],
 proposalRecordSourceLabel:()=> 'Saved source',money:(x)=>'$'+Number(x).toFixed(2),escapeHtml:x=>String(x),decimal:x=>String(x),
 document:{querySelector:()=>get('estimateSection')},els:new Proxy({},{get:(_,key)=>get(key)}),proposalBasePricingRows:()=>[],proposalTotals:()=>({client:1200,qty:1,weightedPpp:1200,packageCount:0})};
 vm.createContext(c);for(const name of ['proposalAdditionalTarget','proposalAddedPricingRows','proposalPricingRows','proposalServiceOutputTotals','proposalServicesRows','renderProposalServicesOutput','renderProposalPricing'])vm.runInContext(fn(name),c);return {c,nodes};
}
test('saved extras render inside existing Services table once with combined total and no empty estimate pricing',()=>{
 const {c,nodes}=fixture();c.renderProposalServicesOutput();c.renderProposalPricing();
 assert.equal(nodes.proposalServicesSection.hidden,false);assert.equal(nodes.proposalServicesTotal.textContent,'$2000.00');
 assert.match(nodes.proposalServicesLines.innerHTML,/Fictional management/);assert.equal(nodes.proposalServicesLines.innerHTML.split('Fictional audience option').length-1,1);
 assert.match(nodes.proposalServicesLines.innerHTML,/\$1200.00/);assert.equal(nodes.estimateSection.hidden,true);
 assert.doesNotMatch(fs.readFileSync(require.resolve('../index.html'),'utf8'),/proposalAdditionalSection/);
});
test('standalone additions join estimate pricing and client catalog restrictions cannot be bypassed',()=>{
 const {c,nodes}=fixture();c.proposalHasSection=s=>s==='estimate';c.proposal.outputScope='costs';c.renderProposalPricing();assert.equal(nodes.estimateSection.hidden,false);assert.match(nodes.proposalPricingLines.innerHTML,/Fictional audience option/);
 c.proposalHasSection=s=>s==='services';c.catalogClientOutputBlocked=()=>true;c.renderProposalServicesOutput();assert.equal(nodes.proposalServicesSection.hidden,true);assert.equal(c.proposalServicesRows().length,0);
});

test('CSV keeps added service rows in the same section once and uses the combined table total',()=>{
 const {c}=fixture();c.proposalHasSection=s=>s==='services';c.renderProposalPreview=()=>{};c.proposalPublishingManifest=()=>({});c.proposalManifestExportRows=()=>[];
 c.proposalExportRecord=(section,source,name,context,qty,unit,total,note)=>({section,source,name,context,qty,unit,total,note});
 vm.runInContext(fn('proposalPublishingExportRows'),c);const rows=c.proposalPublishingExportRows();
 assert.equal(rows.length,3);assert.ok(rows.every(r=>r.section==='Services calculator'));assert.equal(rows[0].total,'$2000.00');
 assert.equal(rows.filter(r=>r.name==='Fictional audience option').length,1);assert.equal(rows[2].total,'$1200.00');
});
