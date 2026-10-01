// Browser review against a supplied local projection, never a live catalog read.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/private/tmp/sharpdots-migration-tools/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const C = require('./ce-catalog');
const file = process.argv[2];
if (!file) throw Error('Supply a local catalog projection JSON path');
const bytes = fs.readFileSync(file, 'utf8'), raw = JSON.parse(bytes);
const catalog = C.adaptCatalog({ catalog: raw, version: raw.version, baseRevision: 'local-projection-review', workspace: { id: 3, slug: 'sharpdots' } }, { id: 3, slug: 'sharpdots' });
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } }), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => {
      const u = new URL(route.request().url());
      if (u.hostname !== '127.0.0.1') return route.abort();
      if (u.pathname === '/api/services/catalog') return route.fulfill({ contentType: 'application/json', body: JSON.stringify(catalog) });
      return route.continue();
    });
    await page.goto('http://127.0.0.1:4198/index.html?crm=1&cePreview=1');
    await page.locator('[data-action=nav][data-page=proposals]').click();
    await page.locator('#crmOpportunity').selectOption({ index: 1 });
    for (const p of catalog.products) {
      await page.evaluate(() => newWorkspaceRecord('services'));
      await page.locator('[data-service-action=catalog]').first().click();
      await page.locator('.eng-catalog-product').first().waitFor();
      assert.equal(await page.locator('.eng-catalog-product').count(), catalog.products.length);
      await page.locator(`[data-service-action=ce-add][data-id="${p.id}"]`).click();
      await page.locator('.eng-dialog footer [data-service-action=close]').click();
      assert.equal(await page.evaluate(() => ServiceEngagement.totals(serviceEngagement).termPrice), C.calculate(C.selectProducts(catalog, [p.id])).termPrice);
      await page.locator('[data-service-action=ce-view][data-view=components]').click();
      assert.equal(await page.locator('[data-ce-include]').count(), p.recipe.length);
      if (p.id === 'sm-pipeline') await page.screenshot({ path: '/private/tmp/ce-source-salesmachine-desktop.png', fullPage: true });
      await page.locator('[data-service-action=ce-component]').first().click();
      await page.locator('.eng-lineage summary').click();
      assert.ok(await page.locator('.eng-lineage').innerText());
      await page.keyboard.press('Escape');
      await page.locator('[data-service-action=ce-view][data-view=capacity]').click();
      await page.locator('#servicesView [data-record-action=save]').click();
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('[data-service-action=ce-view][data-view=components]').click();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.locator('[data-service-action=ce-component]').first().click();
    assert.ok(await page.locator('.eng-dialog').evaluate(el => el.scrollWidth <= el.clientWidth + 1));
    await page.screenshot({ path: '/private/tmp/ce-source-component-mobile.png' });
    assert.deepEqual(errors, []);
    assert.equal(fs.readFileSync(file, 'utf8'), bytes);
    console.log(`PASS: local revision ${raw.version}, ${catalog.products.length} products, complete/incomplete totals, all recipe rows, source relationships, capacity and mobile. Source unchanged; no live read.`);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
