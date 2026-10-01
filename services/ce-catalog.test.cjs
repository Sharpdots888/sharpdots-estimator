const { test } = require('node:test');
const assert = require('node:assert/strict');
const A = require('./ce-catalog');
const { sourceFixture } = require('./ce-fixture.cjs');
const { createServiceCatalogReader } = require('../lib/service-catalog-reader');
const scope = { id: 3, slug: 'sharpdots' };
const adapted = (source = sourceFixture()) => A.adaptCatalog(source, scope);
const select = (source = sourceFixture(), ids = ['service-a']) => A.selectProducts(adapted(source), ids);

test('CE adapter preserves maps, nulls, revisions and draft status without history or people', () => {
  const response = sourceFixture(), before = JSON.stringify(response), c = adapted(response), p = c.products[0];
  assert.equal(JSON.stringify(response), before);
  assert.equal(p.sourceStatus, 'under_review');
  assert.equal(p.enabledForSending, false);
  assert.equal(c.source.revision, 7);
  assert.equal(c.source.baseRevision, 'synthetic-seed-v1');
  assert.deepEqual(p.productDefinition.map, response.catalog.products[0].map);
  assert.deepEqual(p.productDefinition.workSequence, response.catalog.products[0].workSequence);
  assert.equal(p.platforms[0].referenceMonthlyCost, 900);
  assert.equal(p.roles[0].availableHoursPerWeek, null);
  assert.ok(!JSON.stringify(c).includes('knownPeople'));
  assert.ok(!JSON.stringify(c).includes('lastEdited'));
  assert.ok(!JSON.stringify(c).includes('must not be returned'));
  assert.equal(adapted(response).fingerprint, c.fingerprint);
});
test('source margin, reserve, rounding and pass-through are not cost-plus markup', () => {
  const t = A.calculate(select());
  assert.equal(t.complete, true);
  assert.equal(t.publishable, false);
  assert.equal(t.activationCost, 220);
  assert.equal(t.activationPrice, 375);
  assert.equal(t.monthlyCost, 1137.5);
  assert.equal(t.monthlyPrice, 1250);
  assert.equal(t.termPrice, 4125);
  assert.equal(t.termCost, 3632.5);
  assert.equal(t.capacity[0].onceHours, 2);
  assert.equal(t.capacity[0].monthlyHours, 1);
  assert.equal(t.capacity[0].reservedHours, null);
});
test('subtraction, quantity, cadence, term and explicit fee overrides recalculate', () => {
  let s = A.configureProduct(select(), 'service-a', 'media:monthly', { included: false });
  assert.equal(A.calculate(s).monthlyPrice, 250);
  s = A.configureProduct(s, 'service-a', 'setup:once', { quantity: 3, cadence: 'monthly' });
  s.termMonths = 6;
  assert.equal(A.calculate(s).activationPrice, 0);
  assert.equal(A.calculate(s).monthlyPrice, 800);
  assert.equal(A.calculate(s).termPrice, 4800);
  s.pricingOverrides['service-a'] = { feeOverrides: { once: 50, monthly: 700 } };
  assert.equal(A.calculate(s).termPrice, 4250);
  assert.equal(A.calculate(s).publishable, false);
});
test('unknown costs block numeric totals, but removal or explicit zero are valid', () => {
  const source = sourceFixture();
  source.catalog.components[1].cost.unitCost = null;
  source.catalog.components[1].cost.nonLaborAllowance = null;
  const s = select(source), t = A.calculate(s);
  assert.equal(t.complete, false);
  assert.equal(t.termPrice, null);
  assert.equal(t.activationPrice, null);
  assert.equal(t.products[0].monthly.totalBudget, null);
  assert.equal(s.products[0].components[1].cost.nonLaborAllowance, null);
  assert.equal(A.calculate(A.configureProduct(s, 'service-a', 'delivery:monthly', { included: false })).complete, true);
  assert.equal(A.calculate(A.configureProduct(s, 'service-a', 'delivery:monthly', { unitCost: 0 })).complete, true);
  assert.equal(A.calculate(A.configureProduct(s, 'service-a', 'delivery:monthly', { quantity: 0 })).complete, true);
});
test('shared rows require an explicit quantity/cost/pricing owner and count once', () => {
  const source = sourceFixture(), second = structuredClone(source.catalog.products[0]);
  second.id = 'service-b'; second.name = 'Second'; second.recipe[0].quantity = 9; second.targetContributionMargin = .35;
  source.catalog.products.push(second);
  const s = select(source, ['service-a', 'service-b']);
  assert.equal(A.calculate(s).complete, false);
  assert.match(A.calculate(s).issues.join(' '), /conflicting shared defaults/);
  for (const row of s.products[0].recipe) s.sharedResolutions[row.key] = { pricingProductId: 'service-a', quantity: row.quantity, unitCost: row.unitCost };
  const t = A.calculate(s);
  assert.equal(t.complete, true);
  assert.equal(t.termPrice, A.calculate(select()).termPrice);
  assert.equal(t.lines.length, 3);
  assert.equal(t.capacity[0].monthlyHours, 1);
  assert.deepEqual(t.lines[0].productIds, ['service-a', 'service-b']);
  s.sharedResolutions['setup:once'].pricingProductId = 'unknown';
  assert.equal(A.calculate(s).complete, false);
});
test('snapshot save/reload is independent of future catalog edits and removals', () => {
  const source = sourceFixture(), s = select(source), saved = JSON.stringify(s);
  source.catalog.products[0].name = 'Renamed'; source.version = source.catalog.version = 8;
  source.catalog.products[0].recipe[0].quantity = 7;
  const next = adapted(source);
  assert.notEqual(next.fingerprint, s.catalogFingerprint);
  assert.equal(JSON.stringify(s), saved);
  assert.deepEqual(A.calculate(JSON.parse(saved)), A.calculate(s));
  source.catalog.products[0].lifecycleStatus = 'decommissioned';
  assert.equal(adapted(source).products.length, 0);
  assert.equal(A.calculate(s).termPrice, 4125);
});
test('malformed identities, pricing, relationships, workspace and revisions fail closed', () => {
  for (const mutate of [s => s.workspace.id = 1, s => s.workspace.slug = 'legacy-sharpdots', s => s.version = 0,
    s => s.catalog.version = 6, s => s.baseRevision = null, s => s.catalog.policy.currency = 'EUR',
    s => s.catalog.components[0].cost.unitCost = 999, s => s.catalog.products[0].recipe[0].quantity = -1,
    s => s.catalog.products[0].targetContributionMargin = 1, s => s.catalog.products[0].recipe.push(s.catalog.products[0].recipe[0]),
    s => s.catalog.roles = [], s => s.catalog.products[0].map = []]) {
    const source = sourceFixture(); mutate(source); assert.throws(() => adapted(source));
  }
  const s = select();
  s.termMonths = 0; assert.equal(A.calculate(s).termPrice, null);
  assert.throws(() => A.configureProduct(select(), 'service-a', 'setup:once', { unitCost: '0' }));
  assert.throws(() => A.configureProduct(select(), 'service-a', 'setup:once', { quantity: -1 }));
});
test('same component in two cadences remains independent; cadence collision blocks', () => {
  const source = sourceFixture();
  source.catalog.products[0].recipe.push({ componentId: 'setup', cadence: 'monthly', quantity: 1 });
  let s = select(source);
  assert.equal(A.calculate(s).lines.length, 4);
  s = A.configureProduct(s, 'service-a', 'setup:once', { cadence: 'monthly' });
  assert.equal(A.calculate(s).complete, false);
  assert.match(A.calculate(s).issues.join(' '), /cadence edit duplicates/);
});
test('mixed source terms require confirmation without rewriting source defaults', () => {
  const source = sourceFixture(), second = structuredClone(source.catalog.products[0]);
  second.id = 'service-b'; second.termMonths = 1;
  source.catalog.products.push(second);
  const s = select(source, ['service-a', 'service-b']);
  assert.equal(s.termConfirmed, false);
  assert.match(A.calculate(s).issues.join(' '), /Confirm one engagement term/);
  for (const row of s.products[0].recipe) s.sharedResolutions[row.key] = { pricingProductId: 'service-a', quantity: row.quantity, unitCost: row.unitCost };
  s.termMonths = 6; s.termConfirmed = true;
  assert.equal(A.calculate(s).termPrice, 7875);
  assert.deepEqual(s.products.map(p => p.productDefinition.termMonths), [3, 1]);
});
test('unknown role rates remain unknown and resource references are not extra charges', () => {
  const source = sourceFixture();
  source.workspace.id = '3';
  source.catalog.roles[0].planningCostPerHour = null;
  source.catalog.components[0].cost.unitCost = null;
  source.catalog.components[1].cost.unitCost = null;
  const s = select(source);
  assert.equal(A.calculate(s).termPrice, null);
  assert.equal(s.products[0].roles[0].planningCostPerHour, null);
  assert.equal(s.products[0].platforms[0].referenceMonthlyCost, 900);
  assert.equal(s.products[0].recipe.length, 3);
});
test('reader fetches current saved revisions, never caches/falls back or writes', async () => {
  let reads = 0; const source = sourceFixture();
  const reader = createServiceCatalogReader({ workspace: scope, readAuthorizedSnapshot: async ({actor, workspace}) => {
    reads++; assert.equal(actor.id, 45); assert.deepEqual(workspace, scope); return structuredClone(source);
  } });
  const first = await reader({ id: 45 });
  source.version = source.catalog.version = 8;
  const second = await reader({ id: 45 });
  assert.equal(reads, 2); assert.equal(first.source.revision, 7); assert.equal(second.source.revision, 8);
  await assert.rejects(reader(null), /Authenticated/);
  source.workspace.id = 1; await assert.rejects(reader({ id: 45 }), /workspace/);
  source.storage = 'local'; await assert.rejects(reader({ id: 45 }), /shared/);
  const denied = createServiceCatalogReader({ workspace: scope, readAuthorizedSnapshot: async () => { throw Error('Forbidden'); } });
  await assert.rejects(denied({ id: 45 }), /Forbidden/);
});
