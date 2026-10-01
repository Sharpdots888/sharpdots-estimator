// Isolated UI rehearsal: loopback assets, disposable SQL, intercepted APIs only.
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {randomUUID}=require('node:crypto');
const path=require('node:path');
const {PGlite}=require('@electric-sql/pglite');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/private/tmp/sharpdots-migration-tools/node_modules/playwright');
const {createOpportunityStore}=require('../lib/opportunity-store');
const M=require('../crm/model');
const adapter=require('../services/ce-catalog');

(async()=>{
  const base=process.env.CRM_PREVIEW_URL||'http://127.0.0.1:4201/index.html?ceHandoffReview=1';
  assert.ok(['127.0.0.1','localhost'].includes(new URL(base).hostname));
  assert.notEqual(new URL(base).searchParams.get('crm'),'1','Exercise shared CRM UI using intercepted local APIs');
  const db=new PGlite(),browser=await chromium.launch();
  try{
    const query=async(sql,values)=>{const r=await db.query(sql,values);return {...r,rowCount:r.rows.length||r.affectedRows||0};};
    const client={query,release(){}};
    await db.exec(`CREATE ROLE db_admin;CREATE TABLE users(id integer PRIMARY KEY,username text,is_admin boolean,is_active boolean);
      INSERT INTO users VALUES(45,'Synthetic account lead',true,true);
      CREATE TABLE sfvc_companies(company_id uuid PRIMARY KEY);CREATE TABLE sfvc_people(person_id uuid PRIMARY KEY);
      CREATE TABLE sfvc_company_people(company_id uuid,person_id uuid);`);
    for(const name of ['001_sfpq_opportunities.sql','002_opportunity_persistence.sql'])await db.exec(readFileSync(path.join(__dirname,'../migrations',name),'utf8'));
    const accountRef=randomUUID(),contactRef=randomUUID(),user={id:45,isAdmin:true,username:'Synthetic account lead'};
    await query('INSERT INTO sfvc_companies VALUES($1)',[accountRef]);await query('INSERT INTO sfvc_people VALUES($1)',[contactRef]);
    await query('INSERT INTO sfvc_company_people VALUES($1,$2)',[accountRef,contactRef]);
    const calls=[];
    const store=createOpportunityStore({...client,connect:async()=>client},undefined,{enabled:true,send:async({packet,idempotencyKey})=>{
      calls.push(idempotencyKey);
      return {schema:'ce-estimator-intake-receipt-v1',idempotencyKey,sha256:packet.sha256,status:'intake-review',engagementId:randomUUID(),receivedAt:new Date().toISOString()};
    }});
    const config=adapter.selectProducts(adapter.adaptCatalog(require('../services/ce-fixture.cjs').sourceFixture(),{id:3,slug:'sharpdots'}),['service-a']);
    const services=await store.saveRecord(user,null,{collection:'services',name:'Synthetic service',creationKey:randomUUID(),snapshot:{serviceEngagement:{catalogConfiguration:config}}});
    const proposal=await store.saveRecord(user,null,{collection:'proposals',name:'Synthetic accepted proposal',creationKey:randomUUID(),snapshot:{proposal:{title:'Synthetic proposal',includedSections:['services'],sourceRecords:{services:{number:services.number,version:1}}}}});
    let o=await store.save(user,null,M.make({title:'Local CE handoff rehearsal',account:'Synthetic account',contact:'Synthetic buyer',email:'buyer@example.invalid',accountRef,contactRef,ownerId:45,owner:user.username,kind:'Services',oneTime:1000,creationKey:randomUUID(),records:[{...proposal,role:'Primary offer'}],handoffs:{production:{status:'not-required'},engagement:{status:'draft',owner:user.username,target:'2026-10-15',scope:'Selected service scope only',assets:false}}}));
    o=await store.save(user,o.id,{...o,approval:{method:'Written approval',reference:'LOCAL TEST ONLY'}});
    o=await store.save(user,o.id,{...o,status:'won',stage:'won'});
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/api/**',async route=>{
      const req=route.request(),pathname=new URL(req.url()).pathname;
      assert.equal(new URL(req.url()).origin,new URL(base).origin,'No external API is allowed');
      let result={};
      try{
        if(pathname==='/api/crm/status')result={enabled:true,access:true};
        else if(pathname==='/api/crm/lookups')result={user,users:[user],companies:[{id:accountRef,name:'Synthetic account'}],contacts:[{id:contactRef,companyId:accountRef,name:'Synthetic buyer',email:'buyer@example.invalid'}]};
        else if(pathname==='/api/crm/opportunities')result=await store.list(user);
        else if(pathname.endsWith('/ce-handoff/prepare'))result=await store.prepareCeHandoff(user,o.id,req.postDataJSON());
        else if(pathname.endsWith('/ce-handoff/send'))result=await store.sendCeHandoff(user,o.id,req.postDataJSON());
        else if(pathname===`/api/crm/opportunities/${o.id}`&&req.method()==='PUT')result=await store.save(user,o.id,req.postDataJSON());
        else if(pathname==='/api/auth/me')result={authenticated:true,user};
        else if(pathname==='/api/document-transactions')result={transactions:[]};
        await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(result)});
      }catch(e){await route.fulfill({status:e.statusCode||500,contentType:'application/json',body:JSON.stringify({error:e.message})});}
    });
    await page.goto(base);await page.waitForSelector('.crm-deal');
    await page.locator('.crm-deal').click();await page.locator('[data-tab=handoff]').click();
    assert.equal(await page.locator('[data-action=accept-handoff][data-lane=engagement]').count(),0);
    await page.locator('[data-action=ce-prepare]').click();
    await page.getByText('Ready for CE intake',{exact:true}).waitFor();
    assert.equal(await page.locator('.crm-ce-intake').filter({hasText:services.number}).count(),1);
    await page.locator('.crm-ce-review summary').click();
    for(const [width,height]of [[1440,1000],[1188,915],[390,844]]){
      await page.setViewportSize({width,height});
      await page.screenshot({path:`/private/tmp/ce-intake-${width}.png`});
      assert.ok(await page.locator('#crmDrawer').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'Drawer overflow '+width);
    }
    await page.locator('[data-action=ce-review-send]').click();
    await page.locator('#crmDialog').getByText('CE will receive',{exact:false}).waitFor();
    await page.locator('[data-action=ce-send]').click();
    await page.getByText('Received by CE',{exact:true}).waitFor();
    assert.equal(calls.length,1);assert.equal(await page.locator('[data-action=ce-review-send]').count(),0);
    await page.reload();await page.waitForSelector('.crm-deal');
    await page.locator('.crm-deal').click();await page.locator('[data-tab=handoff]').click();
    await page.getByText('Received by CE',{exact:true}).waitFor();
    const received=(await store.list(user)).opportunities.find(item=>item.id===o.id);
    assert.equal(await page.getByRole('link',{name:'Open Client Engagement'}).getAttribute('href'),
      'https://sharpdots-client-engagement-f985e9fee403.herokuapp.com/delivery/intakes/?engagement='+encodeURIComponent(received.ceHandoff.receipt.engagementId));
    assert.equal(await page.locator('.crm-ce-fields [name=owner]').isDisabled(),true);
    await page.locator('[data-action=reopen]').click();
    await page.getByText('Amendment review',{exact:true}).waitFor();
    assert.equal(calls.length,1);assert.deepEqual(errors,[]);
    console.log('PASS: real store preparation, simulated CE receipt, source versions, reload, amendment lock, 3 viewport bounds; no external API calls.');
  }finally{await browser.close();await db.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
