// Read-only parity check against a locally supplied CE projection and calculator.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const A = require('../services/ce-catalog');

async function main() {
  const [file, sourceModel] = process.argv.slice(2);
  if (!file || !sourceModel) throw Error('Usage: node scripts/verify-ce-catalog.cjs /absolute/catalog.json /absolute/catalog-model.mjs');
  const catalog = JSON.parse(fs.readFileSync(file, 'utf8'));
  const original = JSON.stringify(catalog);
  const { recalculate } = await import(pathToFileURL(path.resolve(sourceModel)).href);
  const scope = { id: 3, slug: 'sharpdots' };
  // This is projection provenance, never a claim that a live revision was fetched.
  const response = { catalog, version: catalog.version, baseRevision: 'local-projection-validation', workspace: scope };
  const adapted = A.adaptCatalog(response, scope);
  const expected = [
    ['sm-pipeline', 'Salesmachine', 22], ['sm-omnimail', 'OmniMail', 24],
    ['sm-capture', 'Capture Pixel', 8], ['sm-audience', 'Data Service / Intent Data Stream', 10],
    ['sm-reactivation', 'Marketing Engagement', 13], ['svc-ad-service', 'Ad Service', 16],
    ['ops-landing', 'Web Design', 12], ['ops-systems', 'Automate Business', 15]
  ];
  assert.deepEqual(adapted.products.map(p => [p.id, p.name, p.recipe.length]), expected);
  const compare = (config, raw) => {
    const source = recalculate(structuredClone(raw)).products.find(p => p.id === config.products[0].id);
    const actual = A.calculate(config);
    assert.equal(actual.complete, source.pricing.known, source.id);
    assert.equal(actual.termPrice, source.pricing.termTotalBudget, `${source.id}: price`);
    assert.equal(actual.termCost, source.pricing.termTotalCost, `${source.id}: cost`);
    assert.equal(actual.publishable, false);
    for (const cadence of ['once', 'monthly']) {
      for (const field of ['baseDeliveryCost', 'contingency', 'costWithReserve', 'proposedServiceFee', 'totalBudget']) {
        assert.equal(actual.products[0][cadence][field], source.pricing[cadence][field], `${source.id}: ${cadence}.${field}`);
      }
    }
    for (const [roleId, demand] of Object.entries(source.capacityDemand)) {
      const actualRole = actual.capacity.find(r => r.roleId === roleId);
      assert.ok(Math.abs((actualRole?.onceHours ?? 0) - demand.onceHours) < 1e-8);
      assert.ok(Math.abs((actualRole?.monthlyHours ?? 0) - demand.monthlyHours) < 1e-8);
    }
  };
  let cases = 0;
  for (const p of adapted.products) {
    assert.equal(p.sourceStatus, 'under_review');
    const configuration = A.selectProducts(adapted, [p.id]);
    compare(configuration, catalog); cases++;
    const snapshot = JSON.stringify(configuration);
    assert.deepEqual(A.calculate(JSON.parse(snapshot)), A.calculate(configuration));
    for (const row of p.recipe) {
      for (const change of [{ included: false }, { quantity: row.quantity * 2 }, { cadence: row.cadence === 'once' ? 'monthly' : 'once' }]) {
        const native = structuredClone(catalog), product = native.products.find(product => product.id === p.id);
        if (change.included === false) product.recipe = product.recipe.filter(r => A.keyOf(r) !== row.key);
        else Object.assign(product.recipe.find(r => A.keyOf(r) === row.key), change);
        compare(A.configureProduct(configuration, p.id, row.key, change), native); cases++;
      }
    }
    const next = structuredClone(catalog), termConfig = structuredClone(configuration);
    termConfig.termMonths = 6; next.products.find(product => product.id === p.id).termMonths = 6;
    compare(termConfig, next); cases++;
    assert.equal(JSON.stringify(configuration), snapshot);
  }
  assert.equal(JSON.stringify(catalog), original);
  console.log(JSON.stringify({ source: 'local projection only', revision: catalog.version, products: adapted.products.length,
    recipeRows: adapted.products.reduce((n, p) => n + p.recipe.length, 0), parityCases: cases,
    completePlanningProducts: adapted.products.filter(p => A.calculate(A.selectProducts(adapted, [p.id])).complete).map(p => p.id),
    sendsEnabled: false, sourceChanged: false }, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
