const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/private/tmp/sharpdots-migration-tools/node_modules/playwright');
const assert=require('node:assert/strict');
const url=process.env.CRM_PREVIEW_URL||'http://127.0.0.1:4198/index.html?crm=1&proposalTabColors=1';
if(!['localhost','127.0.0.1'].includes(new URL(url).hostname))throw Error('Use a localhost preview only.');

(async()=>{
  const browser=await chromium.launch();
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(url).origin?route.continue():route.abort());
    await page.goto(url);
    await page.locator('[data-action=nav][data-page=proposals]').click();
    const colors=[];
    for(const width of [1440,1188,768,390]){
      await page.setViewportSize({width,height:1000});
      for(const view of ['proposalView','estimateView','servicesView','sourcingView']){
        await page.locator(`.app-tab[data-view=${view}]`).click();
        const state=await page.evaluate(view=>{
          const tab=document.querySelector(`.app-tab[data-view=${view}]`),panel=document.getElementById(view);
          const style=getComputedStyle(tab),header=getComputedStyle(panel.querySelector('.document-record-header'));
          return {visible:!panel.hidden,active:tab.classList.contains('active'),tab:style.backgroundColor,header:header.backgroundColor,
            color:style.color,tint:getComputedStyle(panel).backgroundColor,height:tab.getBoundingClientRect().height,
            tabOverflow:tab.scrollWidth>tab.clientWidth+1,pageOverflow:document.documentElement.scrollWidth>innerWidth+1};
        },view);
        assert.ok(state.visible&&state.active,`${view} active at ${width}`);
        assert.equal(state.tab,state.header,`${view} tab/header color at ${width}`);
        assert.notEqual(state.tint,'rgb(255, 255, 255)');
        assert.equal(state.tabOverflow,false,`${view} tab text overflow at ${width}`);
        assert.equal(state.pageOverflow,false,`${view} page overflow at ${width}`);
        if(width===1440)colors.push(state.color);
        await page.screenshot({path:`/private/tmp/proposal-tabs-${view}-${width}.png`});
      }
      await page.locator('.app-tab[data-view=proposalView]').click();
      if(width===390){
        const tops=await page.locator('.app-tab:visible').evaluateAll(tabs=>tabs.map(t=>t.getBoundingClientRect().top));
        assert.equal(new Set(tops).size,1,'Mobile tool tabs stay on one row');
      }
      for(const name of ['details','content','send']){
        await page.locator(`#proposal-${name}-tab`).click();
        assert.equal(await page.locator(`#proposal-${name}-tab`).getAttribute('aria-selected'),'true');
        assert.ok(await page.locator(`#proposal-${name}-panel`).isVisible());
      }
      await page.locator('#proposal-details-tab').click();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('#proposal-content-tab').getAttribute('aria-selected'),'true');
      await page.locator('#proposal-details-tab').click();
      assert.equal(await page.locator('.proposal-page').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');
    }
    assert.equal(new Set(colors).size,4,'Tools have individual blue-green accents');
    const hero=await page.locator('.proposal-hero').evaluate(e=>getComputedStyle(e).backgroundColor);
    await page.emulateMedia({media:'print'});
    assert.equal(await page.locator('.proposal-page').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');
    assert.equal(await page.locator('.proposal-hero').evaluate(e=>getComputedStyle(e).backgroundColor),hero);
    assert.equal(await page.locator('.editor-section-tabs').isVisible(),false);
    await page.emulateMedia({media:'screen'});
    await page.locator('[data-action=nav][data-page=quote]').click();
    assert.equal(await page.locator('#printQuoteView').evaluate(e=>getComputedStyle(e).getPropertyValue('--tool-accent')),'');
    assert.deepEqual(errors,[]);
    console.log('PASS: four Proposal tool themes, tab/header matching, inner tab navigation, keyboard, neutral document and print output, Quote isolation, and four responsive widths.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
