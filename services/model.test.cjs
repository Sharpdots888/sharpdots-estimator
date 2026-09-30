const { test } = require('node:test');
const assert = require('node:assert/strict');
const M = require('./model.js');
const variable = (id = 'team-1', changes = {}) => ({ definitionRef: id, definitionType: 'teams', name: 'Delivery', rate: 100, quantity: 2,
  unit: 'hour', rateBasis: 'per_hour', currency: 'USD', costStatus: 'active', ...changes });
const product = (id, vars = [variable()]) => ({ localProductServiceId: id, name: id, catalogStatus: 'reviewed_template', enabledForSelection: true,
  sourceValid: true, sourceRevision: 'v1', templateVariables: vars,
  cascadePaths: [{ productId: id, itemId: 'item-1', platformId: 'platform-1', capabilityId: 'cap-1', teamId: 'team-1' }] });
const catalog = (...products) => M.normalizeCatalog({ contractVersion: 'living-ops-estimator-services-v1', messageType: 'catalog_snapshot',
  sourceRevision: 'r1', payload: { catalogId: 'catalog', products } });
const engagement = (...products) => { const s = M.empty(), c = catalog(...products); c.products.forEach(p => M.addProduct(s, c, p.id)); return s; };

test('shared requirements count once and preserve product relationships', () => {
  const s = engagement(product('a'), product('b'));
  assert.equal(M.lines(s).length, 1);
  assert.deepEqual(M.lines(s)[0].productIds, ['a','b']);
  assert.equal(M.totals(s).monthlyCost, 200);
  assert.equal(M.totals(s).monthlyPrice, 280);
  assert.equal(M.outputRows(s)[0].id, 'shared');
  assert.equal(M.capacity(s)[0].demand, 2);
});
test('conflicting shared defaults require an explicit resolution', () => {
  const s = engagement(product('a'), product('b', [variable('team-1', { quantity: 3 })]));
  assert.equal(M.totals(s).complete, false);
  s.overrides['teams:team-1'] = { quantity: 4, resolveShared: true };
  assert.equal(M.totals(s).complete, true);
  assert.equal(M.totals(s).monthlyCost, 400);
});
test('annual, hourly-minute, and one-time costs normalize without multiplying twice', () => {
  const s = engagement(product('a', [
    variable('annual', { rate: 1200, quantity: 1, rateBasis: 'per_year', unit: 'year' }),
    variable('minutes', { rate: 100, quantity: 90, unit: 'minute' }),
    variable('setup', { rate: 500, quantity: 1, rateBasis: 'one_time', unit: 'setup' })
  ]));
  assert.equal(M.totals(s).monthlyCost, 250);
  assert.equal(M.totals(s).activationCost, 500);
  assert.equal(M.totals(s).termCost, 1250);
  assert.equal(M.totals(s).termPrice, 1750);
});
test('cost-only, reference and excluded lines do not add a charge', () => {
  for (const treatment of ['cost_only', 'reference', 'excluded']) {
    const s = engagement(product('a'));
    s.overrides['teams:team-1'] = { treatment };
    assert.equal(M.totals(s).monthlyPrice, 0);
    assert.equal(M.totals(s).monthlyCost, treatment === 'cost_only' ? 200 : 0);
  }
});
test('unknown costs and invalid terms never appear as complete pricing', () => {
  const s = M.empty();
  s.customLines.push({ ...variable('custom', { rate: null }), key: 'custom:1' });
  assert.equal(M.totals(s).complete, false);
  assert.equal(M.calculate({ ...s.customLines[0], markup: 40, treatment: 'priced' }).complete, false);
  s.overrides['custom:1'] = { rate: 0, treatment: 'priced' };
  assert.equal(M.totals(s).complete, true);
  s.termMonths = 0;
  assert.equal(M.totals(s).complete, false);
});
test('draft, incompatible, missing path and composite pricing cannot be selected', () => {
  for (const changes of [{ catalogStatus: 'draft' }, { estimatorCompatible: false }, { cascadePaths: [] },
    { templateVariables: [variable('x', { pricingModel: { components: [{ rate: 599, quantity: 30000 }] } })] }]) {
    const c = catalog({ ...product('a'), ...changes });
    assert.throws(() => M.addProduct(M.empty(), c, 'a'));
  }
});
test('invalid and duplicate catalogs are rejected', () => {
  assert.throws(() => M.normalizeCatalog({}));
  assert.throws(() => catalog(product('a'), product('a')));
  assert.throws(() => catalog(product('a', [variable(), variable()])));
  assert.throws(() => catalog({ ...product('a'), catalogStatus: null }));
  assert.throws(() => catalog({ ...product('a'), templateVariables: [null] }));
});
test('snapshots isolate source changes and survive save/version restore', () => {
  const s = M.empty(), c = catalog(product('a'));
  c.snapshotHash = 'digest';
  M.addProduct(s,c,'a');
  c.products[0].templateVariables[0].rate = 999;
  s.overrides['teams:team-1'] = { quantity: 4, markup: 50 };
  const copy = M.restore(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(copy, s);
  assert.equal(copy.products[0].catalogSnapshotHash, 'digest');
  assert.equal(copy.products[0].revision, 'v1');
  assert.equal(M.totals(copy).monthlyPrice, 600);
  assert.equal(M.addProduct(s,c,'a'), false);
});
test('capacity retains unknown availability and reports over-allocation', () => {
  const s = engagement(product('a'));
  assert.equal(M.capacity(s)[0].gap, null);
  s.capacity['teams:team-1'] = 1;
  assert.equal(M.capacity(s)[0].gap, -1);
  s.capacity['teams:team-1'] = 0;
  assert.equal(M.capacity(s)[0].available, 0);
});
test('product output and component ledger reconcile exactly', () => {
  const s = engagement(product('a', [variable(), variable('exclusive', { definitionType:'items', rate:7.23 })]), product('b'));
  s.customLines.push({ ...variable('custom', { quantity:3 }), key:'custom:1' });
  const total = M.totals(s);
  for (const k of ['monthlyPrice','monthlyCost','activationPrice','activationCost']) {
    assert.equal(Math.round(M.outputRows(s).reduce((a,b)=>a+b.calc[k],0)*100)/100, total[k]);
    assert.equal(Math.round(M.serviceRows(s).reduce((a,b)=>a+b.engagementCalc[k],0)*100)/100, total[k]);
  }
});
test('synthetic source provenance remains flagged through serialization', () => {
  const c = catalog(product('a')); c.sample = true;
  const s = M.empty(); M.addProduct(s,c,'a');
  assert.equal(M.totals(M.restore(JSON.parse(JSON.stringify(s)))).sample, true);
});
