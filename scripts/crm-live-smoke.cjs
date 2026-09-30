const {spawn}=require('node:child_process');
const {once}=require('node:events');
const {createHmac}=require('node:crypto');
const assert=require('node:assert/strict');
const path=require('node:path');

module.exports=async function smoke(socket){
  const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/private/tmp/sharpdots-migration-tools/node_modules/playwright');
  const secret='local-test-only-'+Date.now();
  const child=spawn(process.execPath,['server.js'],{cwd:path.join(__dirname,'..'),env:{PATH:process.env.PATH,HOME:process.env.HOME,NODE_ENV:'test',PORT:'0',HOST:'127.0.0.1',
    DATABASE_URL:`postgres://db_admin@localhost/postgres?host=${encodeURIComponent(socket)}`,
    ESTIMATOR_SESSION_SECRET:secret,ESTIMATOR_SECURE_COOKIES:'false',ESTIMATOR_AUTH_MODE:'portal-token-required',ESTIMATOR_CRM_ENABLED:'true',DOCUSEAL_SEND_ENABLED:'false'},stdio:['ignore','pipe','pipe']});
  let browser;
  try{
    const url=await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('Local server startup timeout')),20000);
      child.stdout.on('data',b=>{const m=b.toString().match(/Estimator running on (http:\/\/[^\s]+)/);if(m){clearTimeout(timer);resolve(m[1]);}});
      child.once('exit',code=>{clearTimeout(timer);reject(new Error('Local server exited '+code));});
    });
    assert.equal((await fetch(url+'/api/crm/opportunities')).status,401);
    const payload=Buffer.from(JSON.stringify({user:{id:45,username:'local_test',email:'test@example.invalid',isAdmin:true},expiresAt:Date.now()+3600000})).toString('base64url');
    const cookie=payload+'.'+createHmac('sha256',secret).update(payload).digest('base64url');
    assert.equal((await fetch(url+'/api/crm/opportunities',{method:'POST',headers:{cookie:'sfpq_estimator_session='+cookie,'content-type':'application/json'},body:'{}'})).status,403);
    browser=await chromium.launch();const context=await browser.newContext({viewport:{width:1440,height:1000}});
    context.setDefaultTimeout(10000);
    await context.addCookies([{name:'sfpq_estimator_session',value:cookie,url}]);
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('Browser error:',e.message);});
    page.on('response',async r=>{if(r.url().includes('/api/crm/')&&!r.ok())console.error('CRM response:',r.status(),await r.text());});
    await page.route('**/*',route=>{
      const u=new URL(route.request().url());
      if(u.origin!==url)return route.abort();
      if(['/api/seed','/api/estimates','/api/clients','/api/manufacturers'].includes(u.pathname)&&route.request().method()==='GET')return route.fulfill({json:[]});
      return route.continue();
    });
    await page.goto(url);await page.waitForSelector('#crmShell');
    await page.getByRole('radio',{name:'Print / Production',exact:true}).click();
    await page.locator('[data-action=new]').first().click();
    await page.locator('#crmEditForm [name=title]').fill('Live DB browser test');
    const form=page.locator('#crmEditForm');
    assert.equal(await form.locator('[name=pipeline]').inputValue(),'quotes');
    assert.equal(await form.locator('[name=kind]').inputValue(),'Print');
    assert.equal(await form.locator('select[name=accountRef]').count(),1);
    assert.equal(await form.locator('input[name=account]:visible').count(),0);
    assert.equal(await form.locator('input[name=contact]:visible').count(),0);
    await form.locator('[name=accountRef]').selectOption('__new__');
    await form.locator('[name=newClientName]').fill('Synthetic browser client');
    await form.locator('[data-action=add-company]').click();
    await form.locator('[data-create-fields=company]').waitFor({state:'hidden'});
    const newCompany=await form.locator('[name=accountRef]').inputValue();
    await form.locator('[name=contactRef]').selectOption('__new__');
    await form.locator('[name=newContactFirst]').fill('Synthetic');
    await form.locator('[name=newContactLast]').fill('Buyer');
    await form.locator('[name=newContactEmail]').fill('browser-buyer@example.invalid');
    await form.locator('[data-action=add-contact]').click();
    await form.locator('[data-create-fields=contact]').waitFor({state:'hidden'});
    const newContact=await form.locator('[name=contactRef]').inputValue();
    assert.equal(await form.locator('[name=email]').inputValue(),'browser-buyer@example.invalid');
    await form.locator('[name=accountRef]').selectOption('');
    assert.equal(await form.locator('[name=email]').inputValue(),'');
    assert.equal(await form.locator('[name=contact]').inputValue(),'');
    assert.equal(await form.locator('[name=contactRef]').isDisabled(),true);
    await form.locator('[name=accountRef]').selectOption(newCompany);
    await form.locator('[name=contactRef]').selectOption(newContact);
    await form.locator('[name=accountRef]').selectOption('__new__');
    await form.locator('[data-action=cancel-lookup][data-kind=company]').click();
    assert.equal(await form.locator('[name=accountRef]').inputValue(),newCompany);
    await form.locator('[name=contactRef]').selectOption('__new__');
    await form.locator('[name=newContactEmail]').fill('invalid-email');
    await form.locator('[data-action=cancel-lookup][data-kind=contact]').click();
    assert.equal(await form.locator('[name=contactRef]').inputValue(),newContact);
    assert.equal(await form.evaluate(f=>f.checkValidity()),true);
    for(const width of [390,1188,1601]){
      await page.setViewportSize({width,height:969});
      await page.screenshot({path:`/private/tmp/crm-client-form-${width}.png`});
      assert.ok(await page.evaluate(()=>document.querySelector('#crmDialog').scrollWidth<=document.querySelector('#crmDialog').clientWidth+2));
    }
    await page.setViewportSize({width:1440,height:1000});
    await page.locator('#crmEditForm [name=oneTime]').fill('1250');
    await page.locator('#crmEditForm [type=submit]').click();
    await page.waitForFunction(()=>!document.body.classList.contains('crm-saving'));
    await page.reload();await page.waitForSelector('.crm-deal');
    await page.getByRole('button',{name:'Open Live DB browser test',exact:true}).click();
    await page.locator('[data-action=edit]').first().click();
    assert.equal(await page.locator('#crmEditForm [name=accountRef]').inputValue(),newCompany);
    assert.equal(await page.locator('#crmEditForm [name=contactRef]').inputValue(),newContact);
    await page.locator('#crmEditForm [data-action=close-modal]').click();
    await page.locator('[data-tab=records]').first().click();
    await page.locator('[data-action=record-new][data-collection=proposals]').click();
    await page.locator('#proposalView [data-record-action=save]').click();
    await page.waitForFunction(()=>document.querySelector('#estimateSaveStatus')?.textContent.includes('to database'));
    await page.waitForFunction(()=>!document.body.classList.contains('crm-saving'));
    await page.reload();await page.waitForSelector('.crm-deal');
    await page.getByRole('button',{name:'Open Live DB browser test',exact:true}).click();
    await page.locator('[data-tab=records]').first().click();
    assert.equal(await page.locator('.crm-record-list article').count(),1);
    for(const [collection,view] of [['estimates','estimateView'],['services','servicesView'],['sourcing','sourcingView'],['printQuotes','printQuoteView'],['ecomm','ecommView']]){
      await page.locator(`[data-action=record-new][data-collection=${collection}]`).click();
      await page.locator(`#${view} [data-record-action=save]`).click();
      await page.waitForFunction(()=>document.querySelector('#estimateSaveStatus')?.textContent.includes('to database'));
      await page.waitForFunction(()=>!document.body.classList.contains('crm-saving'));
      await page.reload();await page.waitForSelector('.crm-deal');
      await page.getByRole('button',{name:'Open Live DB browser test',exact:true}).click();
      await page.locator('[data-tab=records]').first().click();
    }
    assert.equal(await page.locator('.crm-record-list article').count(),6);
    await page.locator('[data-record-role]').first().selectOption('Primary offer');
    await page.waitForFunction(()=>!document.body.classList.contains('crm-saving'));
    await page.locator('[data-tab=documents]').click();
    assert.equal(await page.locator('[data-action=document-event]').count(),0);
    await page.locator('#crmApprovalForm [name=method]').selectOption('Purchase order');
    await page.locator('#crmApprovalForm [name=reference]').fill('SYNTHETIC-PO');
    await page.locator('#crmApprovalForm [type=submit]').click();
    await page.waitForFunction(()=>!document.body.classList.contains('crm-saving'));
    await page.locator('[data-action=win]').click();await page.locator('[data-action=confirm-win]').click();
    await page.waitForFunction(()=>!document.body.classList.contains('crm-saving'));
    await page.locator('[data-tab=handoff]').click();
    const handoff=page.locator('[data-handoff-form=production]');
    await handoff.locator('[name=owner]').selectOption('local_test');
    await handoff.locator('[name=target]').fill('2026-11-01');
    await handoff.locator('[name=scope]').fill('Synthetic production handoff');
    await handoff.locator('[name=assets]').check();
    await handoff.locator('[type=submit]').click();
    await page.waitForFunction(()=>!document.body.classList.contains('crm-saving'));
    await page.locator('[data-action=queue-handoff][data-lane=production]').click();
    await page.waitForFunction(()=>!document.body.classList.contains('crm-saving'));
    await page.locator('[data-action=accept-handoff][data-lane=production]').click();
    await page.waitForFunction(()=>!document.body.classList.contains('crm-saving'));
    await page.locator('[data-action=move-pipeline]').click();
    await page.locator('#crmPipelineForm [name=pipeline]').selectOption('services');
    await page.locator('#crmPipelineForm [type=submit]').click();
    await page.waitForFunction(()=>!document.body.classList.contains('crm-saving'));
    await page.reload();
    await page.getByRole('button',{name:'Open Live DB browser test',exact:true}).click();
    for(const width of [390,1188,1440,2560]){
      await page.setViewportSize({width,height:1000});
      await page.screenshot({path:`/private/tmp/crm-live-${width}.png`});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
    }
    assert.deepEqual(errors,[]);
    const result=await (await context.request.get(url+'/api/crm/opportunities')).json();
    assert.equal(result.opportunities.find(o=>o.title==='Live DB browser test').accountRef,newCompany);
    assert.equal(result.opportunities.find(o=>o.title==='Live DB browser test').contactRef,newContact);
    assert.equal(result.opportunities.find(o=>o.title==='Live DB browser test').status,'won');
    assert.equal(result.opportunities.find(o=>o.title==='Live DB browser test').pipeline,'services');
    assert.equal(result.opportunities.find(o=>o.title==='Live DB browser test').handoffs.production.status,'accepted');
    console.log('PASS: authenticated live HTTP/browser create, reload, proposal save/link, approval/close and responsive checks; no external network or sends.');
  }finally{
    if(browser)await browser.close();
    if(child.exitCode===null){const ended=once(child,'exit');child.kill('SIGTERM');await ended;}
  }
};
