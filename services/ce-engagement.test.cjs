const { test } = require('node:test');
const assert = require('node:assert/strict');
const C = require('./ce-catalog');
const E = require('./ce-engagement');
const M = require('./model');
const { sourceFixture } = require('./ce-fixture.cjs');
const catalog = () => C.adaptCatalog(sourceFixture(), { id: 3, slug: 'sharpdots' });

test('CE UI accepts only scoped projections and preserves immutable selections and legacy records', () => {
  const c = E.validateCatalog(catalog()), state = M.empty();
  E.addProduct(state, c, 'service-a');
  assert.equal(M.totals(state).termPrice, 4125);
  assert.equal(M.totals(state).publishable, false);
  const saved = structuredClone(state);
  c.products[0].name = 'Changed in fresh read';
  assert.equal(state.catalogConfiguration.products[0].name, 'Example service');
  assert.deepEqual(M.restore(saved), saved);
  assert.equal(M.serviceRows(state)[0].engagementCalc.monthlyPrice, 1250);
  const legacy = M.empty();
  legacy.customLines.push({ key: 'custom:1', definitionRef: '1', definitionType: 'items', name: 'Legacy', quantity: 1, rate: 100, rateBasis: 'one_time', unit: 'unit', currency: 'USD' });
  assert.equal(M.totals(legacy).activationPrice, 140);
  assert.throws(() => E.addProduct(legacy, c, 'service-a'), /new Services record/);
  assert.throws(() => M.addProduct(state, {}, 'legacy'), /new Services record/);
  const other = catalog(); other.fingerprint = 'a'.repeat(64);
  assert.throws(() => E.addProduct(state, other, 'service-a'), /different catalog revision/);
  for (const alter of [x => x.source.workspace.id = 2, x => x.source.revision = 0, x => x.schema = 'old', x => x.fingerprint = 'missing']) {
    const broken = catalog(); alter(broken); assert.throws(() => E.validateCatalog(broken));
  }
});

test('unknown CE costs and malformed configurations never fall through to legacy zero totals', () => {
  const state = M.empty(); E.addProduct(state, catalog(), 'service-a');
  state.catalogConfiguration = C.configureProduct(state.catalogConfiguration, 'service-a', 'setup:once', { unitCost: null });
  assert.equal(M.totals(state).termPrice, null);
  assert.equal(M.totals(state).complete, false);
  assert.deepEqual(M.outputRows(state), []);
  for (const broken of [null, {}, { schema: 'future' }]) {
    state.catalogConfiguration = broken;
    assert.equal(M.totals(M.restore(state)).activationPrice, null);
    assert.equal(M.totals(M.restore(state)).publishable, false);
  }
});

test('shared scope, distinct terms and source policies survive configuration and removal', () => {
  const s = sourceFixture();
  const second = structuredClone(s.catalog.products[0]); second.id = 'service-b'; second.name = 'Second'; second.termMonths = 6;
  s.catalog.products.push(second);
  const c = C.adaptCatalog(s, { id: 3, slug: 'sharpdots' }), state = M.empty();
  E.addProduct(state, c, 'service-a'); E.addProduct(state, c, 'service-b');
  assert.equal(state.catalogConfiguration.termConfirmed, false);
  assert.equal(E.requirements(state.catalogConfiguration).length, 3);
  assert.equal(M.totals(state).complete, false);
  state.catalogConfiguration.termConfirmed = true;
  for (const { key, uses } of E.requirements(state.catalogConfiguration)) state.catalogConfiguration.sharedResolutions[key] = { quantity: uses[0].quantity, unitCost: uses[0].unitCost, pricingProductId: 'service-a' };
  assert.equal(M.totals(state).termPrice, 4125);
  E.removeProduct(state, 'service-b');
  assert.deepEqual(state.catalogConfiguration.sharedResolutions, {});
  assert.equal(M.totals(state).termPrice, 4125);
  E.removeProduct(state, 'service-a');
  assert.equal(E.isCatalog(state), false);
});
