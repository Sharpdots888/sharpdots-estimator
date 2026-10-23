const {test}=require('node:test'),assert=require('node:assert/strict'),A=require('./proposal-lines'),{validatePricingSnapshot}=require('../lib/ce-record-validation');
const line=(x={})=>({id:'fictional-line',name:'Additional service',description:'Fictional scope',quantity:2,unitPrice:12.345,cadence:'once',months:1,...x});
test('additional items calculate one-time and explicit monthly terms without changing input',()=>{const input=[line(),line({id:'monthly',quantity:3,unitPrice:20,cadence:'monthly',months:4})],before=JSON.stringify(input);assert.deepEqual(A.totals(input),{once:24.69,monthly:60,total:264.69});assert.equal(JSON.stringify(input),before);});
test('unknown prices, duplicate IDs, invalid terms and overflow cannot become zero-priced items',()=>{for(const edit of [{quantity:0},{unitPrice:null},{unitPrice:NaN},{unitPrice:-1},{name:' '},{cadence:'daily'},{months:0},{months:1.5},{quantity:1e6,unitPrice:1e9,months:120}])assert.throws(()=>A.normalize([line(edit)]));assert.throws(()=>A.normalize([line(),line()]));assert.deepEqual(A.normalize(),[]);assert.throws(()=>A.normalize({}));});
test('zero is an explicit valid free item and one-time months are normalized',()=>{assert.equal(A.rows([line({unitPrice:0})])[0].total,0);assert.equal(A.normalize([line({months:12})])[0].months,1);});
test('server save validates new lines and preserves all legacy proposal and source fields',async()=>{const input={proposal:{title:'Fictional',sourceRecords:{services:{number:'S-100001',version:1}},additionalLines:[line()]},other:{saved:true}},prior=structuredClone(input);const output=await validatePricingSnapshot('proposals',input,async()=>null);assert.deepEqual(input,prior);assert.deepEqual(output.proposal.sourceRecords,input.proposal.sourceRecords);assert.deepEqual(output.other,input.other);assert.equal(output.proposal.additionalLines[0].unitPrice,12.345);await assert.rejects(validatePricingSnapshot('proposals',{proposal:{additionalLines:[line({quantity:-1})]}},async()=>null));const legacy={proposal:{title:'Old'}};assert.deepEqual(await validatePricingSnapshot('proposals',legacy,async()=>null),legacy);});
test('proposal extras never enter saved Services or catalog configuration',async()=>{const services={serviceScenario:'scratch',serviceRows:[{item:'Original'}]};assert.deepEqual(await validatePricingSnapshot('services',services,async()=>null),services);const p=await validatePricingSnapshot('proposals',{proposal:{additionalLines:[line()]}},async()=>null);assert.equal(p.serviceEngagement,undefined);assert.equal(p.cePricingProof,undefined);});

test('one service table combines original recurring price and a one-time added row without changing the service',()=>{
 const base={activationPrice:0,monthlyPrice:800,termMonths:1,complete:true},original=structuredClone(base);
 const result=A.serviceTotals(base,[line({quantity:1,unitPrice:1200})]);
 assert.equal(result.termPrice,2000);assert.equal(result.activationPrice,1200);assert.equal(result.monthlyPrice,800);assert.deepEqual(base,original);
});
test('monthly additions retain their own terms and cannot be multiplied again by the base term',()=>{
 const result=A.serviceTotals({activationPrice:100,monthlyPrice:800,termMonths:3,complete:true},[line({quantity:2,unitPrice:25,cadence:'monthly',months:6})]);
 assert.equal(result.termPrice,2800);assert.equal(result.monthlyPrice,850);
 const monthlyOnly=A.serviceTotals({activationPrice:100,monthlyPrice:800,termMonths:3},[line({quantity:1,unitPrice:1200})],true);
 assert.equal(monthlyOnly.termPrice,3600);assert.equal(monthlyOnly.activationPrice,1200);
 assert.equal(A.serviceTotals({activationPrice:0,monthlyPrice:0,termMonths:1,complete:false},[line()]).termPrice,null);
});
