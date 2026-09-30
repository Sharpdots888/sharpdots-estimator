const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/private/tmp/sharpdots-migration-tools/node_modules/playwright');
const assert=require('node:assert/strict');
const M=require('./model');
const url=process.env.CRM_PREVIEW_URL||'http://127.0.0.1:4198/index.html?crm=1&pipelines=1';
if(!['localhost','127.0.0.1'].includes(new URL(url).hostname))throw Error('Use a localhost preview only.');

(async()=>{
  const browser=await chromium.launch();
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(url).origin?route.continue():route.abort());
    await page.goto(url);
    const radio=id=>page.locator(`[data-action=pipeline][data-pipeline=${id}]`);
    const data=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('sharpdots-crm-draft-v1')).opportunities);
    const switchTo=async id=>{await radio(id).click();assert.equal(await radio(id).getAttribute('aria-checked'),'true');};
    const all=await data();
    assert.equal(await radio('services').getAttribute('aria-checked'),'true');
    for(const pipeline of ['services','quotes']){
      await switchTo(pipeline);
      const expected=M.inPipeline(all,pipeline);
      assert.equal(await page.locator('.crm-deal').count(),expected.length);
      await page.screenshot({path:`/private/tmp/pipeline-${pipeline}-initial.png`});
      const cash=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
      assert.equal(await page.locator('.crm-metrics > div').first().locator('strong').innerText(),cash(expected.filter(o=>o.status==='open').reduce((n,o)=>n+M.value(o),0)));
      for(const view of ['list','activities','handoffs','board']){
        await page.locator(`[data-action=view][data-view=${view}]`).click();
        const ids=await page.locator('#crmResults [data-id]').evaluateAll(els=>[...new Set(els.map(e=>e.dataset.id))]);
        assert.ok(ids.length>0,`${pipeline} ${view} should contain sample records`);
        assert.ok(ids.every(id=>expected.some(o=>o.id===id)),`${pipeline} ${view} leaked another pipeline`);
      }
      await page.locator('#crmScope').selectOption('all');
    }
    await radio('quotes').focus();
    await page.keyboard.press('ArrowLeft');
    assert.equal(await radio('services').getAttribute('aria-checked'),'true');
    await page.locator('#crmSearch').fill('unmatched opportunity');
    assert.equal(await page.locator('.crm-deal').count(),0);
    assert.match(await page.locator('#crmResultCount').innerText(),/^0 opportunities/);
    assert.equal(await page.locator('.crm-metrics > div').first().locator('strong').innerText(),'$0');
    await switchTo('quotes');
    assert.equal(await page.locator('#crmSearch').inputValue(),'');

    await page.locator('.crm-page-heading [data-action=new]').click();
    const form=page.locator('#crmEditForm');
    assert.equal(await form.locator('[name=pipeline]').inputValue(),'quotes');
    assert.equal(await form.locator('[name=kind]').inputValue(),'Print');
    await form.locator('[name=pipeline]').selectOption('services');
    assert.equal(await form.locator('[name=kind]').inputValue(),'Services');
    await form.locator('[name=title]').fill('Pipeline QA opportunity');
    await form.locator('[name=account]').fill('Synthetic account');
    await form.locator('[name=contact]').fill('Synthetic buyer');
    await form.locator('[type=submit]').click();
    assert.equal(await radio('services').getAttribute('aria-checked'),'true');
    const created=(await data()).find(o=>o.title==='Pipeline QA opportunity');
    assert.equal(created.pipeline,'services');assert.equal(created.number,'O-000013');
    await page.locator('[data-action=move-pipeline]').click();
    await page.locator('#crmPipelineForm [name=pipeline]').selectOption('quotes');
    await page.locator('#crmPipelineForm [type=submit]').click();
    const moved=(await data()).find(o=>o.id===created.id);
    assert.equal(moved.pipeline,'quotes');assert.equal(moved.number,created.number);
    assert.equal(moved.kind,'Services');
    assert.match(await page.locator('.crm-drawer-header').innerText(),/Print \/ Production/);
    await page.locator('[data-action=close-detail]').click();
    await page.reload();
    assert.equal(await radio('quotes').getAttribute('aria-checked'),'true');
    assert.equal(await page.getByRole('button',{name:'Open Pipeline QA opportunity',exact:true}).count(),1);

    await switchTo('services');
    await page.getByRole('button',{name:'Open New location rollout',exact:true}).click();
    const wonBefore=(await data()).find(o=>o.title==='New location rollout');
    await page.locator('[data-action=move-pipeline]').click();
    await page.locator('#crmPipelineForm [name=pipeline]').selectOption('quotes');
    await page.locator('#crmPipelineForm [type=submit]').click();
    const wonAfter=(await data()).find(o=>o.id===wonBefore.id);
    for(const key of ['number','stage','status','records','documents','billing','handoffs','approval'])assert.deepEqual(wonAfter[key],wonBefore[key],key);
    await page.locator('[data-action=close-detail]').click();
    await switchTo('services');
    assert.equal(await page.getByRole('button',{name:'Open New location rollout',exact:true}).count(),0);
    await switchTo('quotes');
    assert.equal(await page.getByRole('button',{name:'Open New location rollout',exact:true}).count(),1);

    for(const width of [1440,1188,768,390]){
      await page.setViewportSize({width,height:969});
      for(const pipeline of ['services','quotes']){
        await switchTo(pipeline);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`page overflow at ${width}`);
        assert.ok(await page.locator('.crm-pipeline-toggle').evaluate(e=>e.scrollWidth<=e.clientWidth+1),`toggle overflow at ${width}`);
        await page.screenshot({path:`/private/tmp/pipeline-${pipeline}-${width}.png`});
      }
      await page.locator('.crm-page-heading [data-action=new]').click();
      assert.equal(await page.locator('#crmEditForm [name=pipeline]').inputValue(),'quotes');
      assert.ok(await page.locator('#crmDialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
      await page.screenshot({path:`/private/tmp/pipeline-form-${width}.png`});
      await page.locator('#crmEditForm [data-action=close-modal]').click();
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: pipeline separation across all views, scoped totals/search, creation defaults, reassignment, won-record preservation, selection persistence, keyboard and four responsive widths.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
