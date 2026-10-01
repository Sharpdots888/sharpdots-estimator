const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/private/tmp/sharpdots-migration-tools/node_modules/playwright');
const assert = require('node:assert/strict');
const C = require('./ce-catalog');
const { sourceFixture } = require('./ce-fixture.cjs');
const url = process.env.SERVICES_PREVIEW_URL || 'http://127.0.0.1:4198/index.html?crm=1&cePreview=1';
if (!['localhost', '127.0.0.1'].includes(new URL(url).hostname)) throw Error('Local preview only');
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [], requests = [];
    let status = 200;
    const source = sourceFixture();
    const second = structuredClone(source.catalog.products[0]);
    second.id = 'service-b'; second.name = 'Second example'; second.termMonths = 6;
    source.catalog.products.push(second);
    let catalog = C.adaptCatalog(source, { id: 3, slug: 'sharpdots' });
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', async route => {
      const u = new URL(route.request().url());
      if (!['localhost', '127.0.0.1'].includes(u.hostname)) return route.abort();
      if (u.pathname === '/api/services/catalog') {
        requests.push({ method: route.request().method(), search: u.search });
        return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(status === 200 ? catalog : { error: 'Fixture denial' }) });
      }
      return route.continue();
    });
    await page.goto(url);
    await page.locator('[data-action=nav][data-page=proposals]').click();
    await page.locator('#crmOpportunity').selectOption({ index: 1 });
    await page.evaluate(() => newWorkspaceRecord('services'));
    const action = a => page.locator(`[data-service-action="${a}"]`);
    const ceTotal = () => page.evaluate(() => ServiceEngagement.totals(serviceEngagement));
    await action('catalog').first().click();
    await page.locator('.eng-dialog [data-id=service-a]').waitFor({ timeout: 5000 }).catch(async e => {
      console.error({ errors, requests, dialog: await page.locator('.eng-dialog').innerText() }); throw e;
    });
    await page.locator('.eng-dialog [data-id=service-a]').click();
    await page.locator('.eng-dialog footer [data-service-action=close]').click();
    assert.equal((await ceTotal()).termPrice, 4125);
    assert.equal(await page.locator('[name=engMarkup]').count(), 0);
    await page.locator('#servicesView [data-record-action=save]').click();
    const snapshot = await page.evaluate(() => structuredClone(savedRecordForCollection('services').snapshot));
    await page.locator('[name=ceTerm]').fill('6'); await page.locator('[name=ceTerm]').press('Tab');
    await page.evaluate(() => newVersionFromManager('services'));
    await page.evaluate(() => applyWorkspaceRecord('services', savedRecordForCollection('services'), 1));
    assert.equal(await page.locator('[name=ceTerm]').inputValue(), '3');
    assert.deepEqual(await page.evaluate(() => serviceEngagement.catalogConfiguration), snapshot.serviceEngagement.catalogConfiguration);
    await action('proposal').click();
    assert.equal(await page.evaluate(() => proposal.outputAudience), 'internal');
    assert.match(await page.locator('#proposalServicesLines').innerText(), /Example service/);
    await page.evaluate(() => { proposal.outputAudience = 'client'; renderProposal(); });
    assert.equal(await page.locator('#proposalPublishPdfBtn').isDisabled(), true);
    assert.equal(await page.locator('#proposalPublishCsvBtn').isDisabled(), true);
    assert.equal(await page.locator('#proposalSignatureBtn').isDisabled(), true);
    assert.equal(await page.locator('#proposalServicesSection').isVisible(), false);
    assert.match(await page.evaluate(() => { try { proposalPublishingCsvPayload(); return ''; } catch (e) { return e.message; } }), /draft-only/);
    assert.match(await page.evaluate(() => { try { frozenProposalHtml(); return ''; } catch (e) { return e.message; } }), /draft-only/);
    assert.equal(await page.evaluate(() => { let printed = false; window.print = () => { printed = true; }; printProposalPublishingOutput(); return printed; }), false);
    await page.evaluate(() => prepareReportPrint());
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('#proposalView').isVisible(), false);
    await page.emulateMedia({ media: 'screen' }); await page.evaluate(() => restoreReportPrint());
    await page.evaluate(() => { proposal.outputAudience = 'internal'; renderProposal(); });
    assert.ok(await page.evaluate(() => proposalPublishingCsvPayload().rowsForCsv.some(r => r.item === 'Example service')));
    await page.evaluate(() => setActiveView('servicesView'));
    await page.locator('[data-service-action=ce-view][data-view=components]').click();
    await action('ce-component').first().click();
    await page.locator('#ceComponentForm [name=unitCost]').fill('');
    await page.locator('#ceComponentForm [type=submit]').click();
    assert.equal((await ceTotal()).termPrice, null);
    assert.match(await page.locator('.eng-metrics').innerText(), /Unknown/);
    await action('ce-component').first().click(); await action('ce-reset-row').click();
    assert.equal((await ceTotal()).termPrice, 4125);
    await page.locator('[data-ce-include]').first().uncheck();
    assert.equal((await ceTotal()).activationPrice, 0);
    await page.locator('[data-ce-include]').first().check();
    await page.locator('[data-service-action=ce-view][data-view=products]').click();
    await action('ce-pricing').click();
    await page.locator('#cePricingForm [name=once]').fill('500');
    await page.locator('#cePricingForm [type=submit]').click();
    assert.equal((await ceTotal()).activationPrice, 500);
    await action('ce-pricing').click(); await action('ce-reset-pricing').click();
    assert.equal((await ceTotal()).activationPrice, 375);
    await action('catalog').click(); await page.locator('.eng-dialog [data-id=service-b]').click();
    await page.locator('.eng-dialog footer [data-service-action=close]').click();
    assert.equal((await ceTotal()).complete, false);
    await action('ce-confirm-term').click();
    await page.locator('[data-service-action=ce-view][data-view=components]').click();
    for (const [key, quantity, unitCost] of [['setup:once', '2', '100'], ['delivery:monthly', '1', '125'], ['media:monthly', '1', '1000']]) {
      await page.locator(`[data-service-action=ce-shared][data-key="${key}"]`).click();
      await page.locator('#ceSharedForm [name=pricingProductId]').selectOption('service-a');
      await page.locator('#ceSharedForm [name=quantity]').fill(quantity);
      await page.locator('#ceSharedForm [name=unitCost]').fill(unitCost);
      await page.locator('#ceSharedForm [type=submit]').click();
    }
    assert.equal((await ceTotal()).termPrice, 4125);
    for (const width of [1440, 1188, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const view of ['products', 'components', 'capacity']) {
        await page.locator(`[data-service-action=ce-view][data-view=${view}]`).click();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${view} overflow at ${width}`);
        await page.screenshot({ path: `/private/tmp/ce-services-${view}-${width}.png`, fullPage: true });
      }
      await page.locator('[data-service-action=ce-view][data-view=products]').click();
      await action('ce-pricing').first().click();
      assert.ok(await page.locator('.eng-dialog').evaluate(el => el.scrollWidth <= el.clientWidth + 1));
      await page.screenshot({ path: `/private/tmp/ce-services-pricing-${width}.png`, fullPage: true });
      await page.keyboard.press('Escape');
    }
    const pinned = await page.evaluate(() => JSON.stringify(serviceEngagement.catalogConfiguration));
    for (const code of [401, 403, 503]) {
      status = code; await action('catalog').click();
      await page.locator('.eng-dialog [role=alert]').waitFor();
      assert.equal(await page.locator('.eng-dialog [data-service-action=ce-add]').count(), 0);
      await page.keyboard.press('Escape');
    }
    status = 200;
    source.version = source.catalog.version = 8;
    const third = structuredClone(second); third.id = 'service-c'; third.name = 'New revision product'; source.catalog.products.push(third);
    catalog = C.adaptCatalog(source, { id: 3, slug: 'sharpdots' });
    await action('catalog').click();
    await page.locator('.eng-dialog [data-id=service-c]').click();
    assert.match(await page.locator('.eng-dialog .eng-notice').innerText(), /different catalog revision/);
    assert.equal(await page.evaluate(() => JSON.stringify(serviceEngagement.catalogConfiguration)), pinned);
    await page.screenshot({ path: '/private/tmp/ce-services-catalog-390.png', fullPage: true });
    await page.keyboard.press('Escape');
    assert.ok(requests.length > 3 && requests.every(r => r.method === 'GET' && r.search === ''));
    assert.deepEqual(errors, []);
    console.log('PASS: CE catalog read, scoped errors, immutable snapshots, save/version restore, null costs, exclusion, pricing overrides, shared scopes, terms, capacity, publishing guards and 1440/1188/768/390 layouts. No external requests or credentials.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
