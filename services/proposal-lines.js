(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ProposalLines=api;})(typeof window==='object'?window:globalThis,function(){
 const fail=message=>{throw Error(message);};
 const round=n=>Math.round((n+Number.EPSILON)*100)/100;
 function normalize(value=[]){
  if(!Array.isArray(value)||value.length>100)fail('Use up to 100 additional proposal items.');
  const ids=new Set();return value.map(line=>{
   if(!line||typeof line!=='object'||Array.isArray(line)||Object.keys(line).some(k=>!['id','name','description','quantity','unitPrice','cadence','months'].includes(k)))fail('Review the additional item fields.');
   if(typeof line.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(line.id)||ids.has(line.id))fail('Each additional item needs a unique reference.');ids.add(line.id);
   if(typeof line.name!=='string'||!line.name.trim()||line.name.length>150||typeof line.description!=='string'||line.description.length>2000)fail('Give each additional item a name (up to 150 characters) and a short description.');
   if(typeof line.quantity!=='number'||!Number.isFinite(line.quantity)||line.quantity<=0||line.quantity>1e6||typeof line.unitPrice!=='number'||!Number.isFinite(line.unitPrice)||line.unitPrice<0||line.unitPrice>1e9)fail('Enter a positive quantity and a non-negative unit price.');
   if(!['once','monthly'].includes(line.cadence)||!Number.isInteger(line.months)||line.months<1||line.months>120)fail('Choose one-time or monthly and a term from 1 to 120 months.');
   if(!Number.isSafeInteger(Math.round(line.quantity*line.unitPrice*line.months*100)))fail('The additional item amount is too large.');
   return {...line,name:line.name.trim(),months:line.cadence==='once'?1:line.months};
  });
 }
 function rows(value){return normalize(value).map(line=>{const amount=round(line.quantity*line.unitPrice);return {...line,amount,total:round(amount*(line.cadence==='monthly'?line.months:1))};});}
 function totals(value){return rows(value).reduce((sum,line)=>({once:round(sum.once+(line.cadence==='once'?line.amount:0)),monthly:round(sum.monthly+(line.cadence==='monthly'?line.amount:0)),total:round(sum.total+line.total)}),{once:0,monthly:0,total:0});}
 return {normalize,rows,totals};
});
