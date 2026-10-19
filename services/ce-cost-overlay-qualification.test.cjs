'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const A = require('./ce-catalog');
const Q = require('./ce-cost-overlay-qualification.cjs');
const directory = '/private/tmp/ce31-estimator-cost-handoff';
const engine = 'b573cbc0d01e783db82d2e9bd62372cb28d710b606f389959781f53210358f22';
const baseRevision = '800a36a53d797b604a3a9406a40d590d25d320075693202694493ef706d1569c';
const scope = { id: '3', slug: 'sharpdots' };
const hashes = {
  source: ['d4632fdbf6458719042a67411c9bd3bb12276d686ec50bda01c2502c27edf9fc', '5487748b9443b1972ea147a1052e2689147977028e8b00a6163ac74a723d9f92'],
  shared: ['e768059f664ba266de1f0c746fed23bcaae736be0ed8888efc9908481c0fe41c', 'a0c6a053363a154a195bee824d65ce80c8f0cd1197613c217b8a2358d1119071'],
  'different-rates': ['e768059f664ba266de1f0c746fed23bcaae736be0ed8888efc9908481c0fe41c', 'a3ec4f5a3eaeb654f6d44d909414d7f6fca3aaa7418a8609787b9c37ac830f3f'],
  missing: ['e768059f664ba266de1f0c746fed23bcaae736be0ed8888efc9908481c0fe41c', 'e33a619cea4efeb8becfc882ae5ada50ab5669882162d33ffbd217953848e3aa']
};
const pins = name => ({ structuralHash: hashes[name][0], sourceHash: hashes[name][1], calculationEngineHash: engine,
  catalogId: name === 'source' ? 'sd-launch-2026-09-21' : 'ce31-fictional-shared-provider', revision: name === 'source' ? 144 : 1, baseRevision });
// Required private fixtures: absence is an error, not a skipped/false-green test.
const fixtures = Object.fromEntries(Object.keys(hashes).map(name => [name, {
  structure: JSON.parse(fs.readFileSync(path.join(directory, `${name}-v1.json`))),
  overlay: JSON.parse(fs.readFileSync(path.join(directory, `${name}-v2.json`)))
}]));
const originalHashes = Object.fromEntries(Object.entries(fixtures).map(([name, f]) => [name, Q.digest(f)]));
const adapt = (name = 'source') => Q.adaptOverlay(fixtures[name].structure, fixtures[name].overlay, pins(name));
const select = (catalog, ids) => A.selectProducts(catalog, ids);
const money = value => Math.round((value + Number.EPSILON) * 100) / 100;
const defaults = [
  ['sm-pipeline', 3, 7600, 9925, 37375, 24260.77, 34700],
  ['sm-omnimail', 1, 15025, 3700, 18725, 12630.72, 18600],
  ['sm-capture', 3, 2950, 2925, 11725, 6995.69, null],
  ['sm-audience', 3, 1750, 4250, 14500, 8667.66, null],
  ['sm-reactivation', 3, 5025, 4825, 19500, 11655.7, 19300],
  ['svc-ad-service', 3, 6450, 5250, 22200, 16881.1, 22100],
  ['ops-landing', 3, 11725, 850, 14275, 8520.18, 14175],
  ['ops-systems', 3, 16250, 2925, 25025, 14993.76, 25150]
];

for (const [id, term, once, monthly, budget, cost, legacyBudget] of defaults) {
  test(`CE31 unchanged ${id}: source pricing, scope, provenance and review state reconcile`, () => {
    const catalog = adapt(), configuration = select(catalog, [id]);
    const proof = Q.qualifyDefault(catalog, configuration), total = proof.result;
    const old = A.adaptCatalog(fixtures.source.structure, scope), legacy = old.products.find(p => p.id === id);
    const product = configuration.products[0], source = fixtures.source.overlay.products.find(p => p.id === id);
    assert.equal(proof.disposition, 'qualified_with_constraints');
    assert.ok(total?.complete);
    assert.deepEqual([configuration.termMonths, total.activationPrice, total.monthlyPrice, total.termPrice, total.termCost], [term, once, monthly, budget, cost]);
    assert.deepEqual(total.products[0].once, source.pricing.once);
    assert.deepEqual(total.products[0].monthly, source.pricing.monthly);
    for (const field of ['productDefinition', 'components', 'workflows', 'roles', 'platforms', 'policy', 'pricingPolicy']) assert.deepEqual(product[field], legacy[field]);
    assert.equal(total.lines.length, source.recipe.length);
    for (const row of product.recipe) {
      const original = legacy.recipe.find(r => r.key === row.key), rate = source.recipe.find(r => A.keyOf(r) === row.key);
      const { unitCost, extendedBaseCost, costAssessment, ...unchanged } = row;
      const { unitCost: oldRate, extendedBaseCost: oldExtension, ...oldFields } = original;
      assert.deepEqual(unchanged, oldFields);
      assert.deepEqual(costAssessment, rate);
      assert.equal(unitCost, rate.unitCost);
      assert.equal(extendedBaseCost, rate.extendedBaseCost);
    }
    assert.equal(product.sourceStatus, 'under_review');
    assert.equal(product.reviewRequired, true);
    assert.equal(product.enabledForSending, false);
    assert.equal(total.reviewRequired, true);
    assert.equal(total.publishable, false);
    assert.ok(total.capacity.every(r => r.availableHours === null && r.reservedHours === null));
    assert.equal(product.costAssessment.binding.sourceHash, pins('source').sourceHash);
    assert.notEqual(product.fingerprint, legacy.fingerprint);
    assert.notEqual(configuration.catalogFingerprint, old.fingerprint);
    assert.equal(A.calculate(select(old, [id])).termPrice, legacyBudget);
  });
}

test('CE31 all 120 recipe rows preserve fractional rates and explicit pass-through treatment', () => {
  const catalog = adapt();
  assert.equal(catalog.products.reduce((n, p) => n + p.recipe.length, 0), 120);
  let passRows = 0;
  for (const p of catalog.products) {
    const total = A.calculate(select(catalog, [p.id]));
    for (const cadence of ['once', 'monthly']) {
      const rows = p.recipe.filter(r => r.cadence === cadence);
      const pass = money(rows.filter(r => r.passThrough).reduce((n, r) => n + r.extendedBaseCost, 0));
      const base = money(rows.filter(r => !r.passThrough).reduce((n, r) => n + r.extendedBaseCost, 0));
      assert.equal(total.products[0][cadence].passThroughAllowance, pass);
      assert.equal(total.products[0][cadence].baseDeliveryCost, base);
      passRows += rows.filter(r => r.passThrough).length;
    }
  }
  assert.ok(passRows > 0);
  const p = catalog.products.find(p => p.id === 'sm-omnimail');
  const configuration = select(catalog, [p.id]);
  const row = p.recipe.find(r => r.passThrough && r.cadence === 'once');
  const before = A.calculate(configuration), after = A.calculate(A.configureProduct(configuration, p.id, row.key, { included: false }));
  assert.equal(money(before.activationPrice - after.activationPrice), row.extendedBaseCost);
  assert.equal(before.products[0].once.proposedServiceFee, after.products[0].once.proposedServiceFee);
});

for (const [name, capture, audience] of [['shared', 62.5, 187.5], ['different-rates', 125, 125]]) {
  test(`CE31 ${name}: fictional provider pool reconciles without adding platform or legacy costs`, () => {
    const catalog = adapt(name);
    const totals = ['sm-capture', 'sm-audience'].map(id => Q.qualifyDefault(catalog, select(catalog, [id])).result);
    assert.deepEqual(totals.map(t => t.monthlyCost), [capture, audience]);
    assert.equal(totals.reduce((sum, t) => sum + t.monthlyCost, 0), 250);
    assert.equal(totals.reduce((sum, t) => sum + t.termCost, 0), 750);
    assert.ok(catalog.products.every(p => p.recipe.length === 1));
    assert.ok(totals.every(t => t.lines.length === 1));
    // The copied platform reference is retained as context, never charged again.
    const changedReference = select(catalog, ['sm-audience']);
    changedReference.products[0].platforms.forEach(p => p.referenceMonthlyCost = 999999);
    changedReference.products[0].components[0].cost.nonLaborAllowance = 999999;
    assert.equal(A.calculate(changedReference).monthlyCost, audience);
    assert.equal(Q.qualifyDefault(catalog, changedReference).disposition, 'blocked');
  });
}

test('CE31 product-local rates and six-decimal precision prevent a one-cent extension error', () => {
  const catalog = adapt('different-rates');
  const capture = catalog.products.find(p => p.id === 'sm-capture').recipe[0];
  const audience = catalog.products.find(p => p.id === 'sm-audience').recipe[0];
  assert.equal(capture.componentId, audience.componentId);
  assert.equal(capture.unitCost, 125);
  assert.equal(audience.unitCost, 41.666667);
  assert.equal(money(audience.unitCost * 3), 125);
  assert.equal(money(money(audience.unitCost) * 3), 125.01);
  assert.equal(audience.costAssessment.providerPerUnit, 41.67);
  assert.notEqual(money(audience.costAssessment.providerPerUnit * 3), audience.extendedBaseCost);
});

test('CE31 allocated provider references remain distinct from the unchanged operational map', () => {
  const catalog = adapt(), product = catalog.products.find(p => p.id === 'sm-audience');
  assert.ok(!product.platforms.some(p => p.id === 'hostinger'));
  assert.ok(product.costAssessment.platforms.some(p => p.id === 'hostinger'));
  for (const p of catalog.products) for (const row of p.recipe) for (const resource of row.costAssessment.resources) {
    assert.ok(p.costAssessment.platforms.some(platform => platform.id === resource.platformId));
  }
});

test('CE31 cent-rounded unit rates reproduce the receiving-side precision gate, not an Estimator failure', () => {
  const catalog = adapt();
  for (const [id, componentId, sourceExtension, centExtension, termDrift] of [
    ['sm-pipeline', 'copy_sequence', 744.49, 744.50, 0.01],
    ['ops-systems', 'automation_run', 906.54, 906.56, 0.06]
  ]) {
    const configuration = select(catalog, [id]), correct = A.calculate(configuration);
    const line = correct.lines.find(l => l.componentId === componentId);
    assert.equal(line.extendedCost, sourceExtension);
    assert.equal(money(money(line.unitCost) * line.quantity), centExtension);
    const rounded = structuredClone(configuration);
    rounded.products[0].recipe.forEach(row => row.unitCost = money(row.unitCost));
    assert.equal(money(A.calculate(rounded).termCost - correct.termCost), termDrift);
    assert.equal(Q.qualifyDefault(catalog, configuration).disposition, 'qualified_with_constraints');
    assert.equal(Q.qualifyDefault(catalog, rounded).disposition, 'blocked');
  }
});

test('CE31 null provider costs never fall back to a legacy zero or grant approval', () => {
  const catalog = adapt('missing');
  for (const p of catalog.products) {
    const configuration = select(catalog, [p.id]), total = A.calculate(configuration);
    assert.equal(p.components[0].cost.unitCost, 0);
    assert.equal(p.recipe[0].unitCost, null);
    assert.equal(total.complete, false);
    assert.equal(total.termPrice, null);
    assert.equal(total.termCost, null);
    const proof = Q.qualifyDefault(catalog, configuration);
    assert.equal(proof.disposition, 'blocked');
    assert.equal(proof.result, null);
    assert.match(proof.issues.join(' '), /currency/);
    for (const edit of [{ included: false }, { quantity: 0 }, { unitCost: 0 }]) {
      const changed = A.configureProduct(configuration, p.id, p.recipe[0].key, edit);
      assert.equal(A.calculate(changed).complete, true);
      assert.equal(Q.qualifyDefault(catalog, changed).disposition, 'blocked');
    }
  }
});

test('CE31 workspace, contract, snapshot, revision and engine mismatches fail closed', () => {
  const mutations = [
    f => f.structure.workspace.id = '1', f => f.structure.workspace.slug = 'other',
    f => f.structure.storage = 'local', f => f.structure.contractVersion = 'other',
    f => f.structure.version++, f => f.structure.catalog.version++, f => f.structure.baseRevision = 'other',
    f => f.structure.catalog.catalogId = 'other', f => f.structure.catalog.products[0].recipe[0].quantity++,
    f => f.overlay.revision++, f => f.overlay.catalogId = 'other', f => f.overlay.baseRevision = 'other',
    f => f.overlay.calculationEngineHash = '0'.repeat(64), f => f.overlay.calculationVersion = 'other',
    f => f.overlay.contractVersion = 'other', f => f.overlay.sourceHash = '0'.repeat(64),
    f => f.overlay.products[0].recipe[0].unitCost++,
    f => { f.overlay.products[0].recipe[0].unitCost++; const {sourceHash, activation, ...body} = f.overlay; f.overlay.sourceHash = Q.digest(body); }
  ];
  for (const mutate of mutations) {
    const f = structuredClone(fixtures.source); mutate(f);
    assert.throws(() => Q.adaptOverlay(f.structure, f.overlay, pins('source')));
  }
  assert.throws(() => Q.adaptOverlay(fixtures.source.structure, fixtures.source.overlay));
  assert.throws(() => Q.adaptOverlay(fixtures.shared.structure, fixtures['different-rates'].overlay, pins('shared')));
});

test('CE31 even newly hashed local fixtures must satisfy structural and row consistency checks', () => {
  const mutations = [
    f => f.overlay.products.pop(), f => f.overlay.products.push(f.overlay.products[0]),
    f => f.overlay.products[0].id = 'unknown', f => f.overlay.products[0].status = 'active',
    f => f.overlay.products[0].termMonths++, f => f.overlay.products[0].recipe.pop(),
    f => f.overlay.products[0].recipe.push(f.overlay.products[0].recipe[0]),
    f => f.overlay.products[0].recipe[0].quantity++,
    f => f.overlay.products[0].recipe[0].configuration = 'changed',
    f => f.overlay.products[0].recipe[0].cadence = 'monthly',
    f => f.overlay.products[0].recipe[0].unit = 'different unit',
    f => delete f.overlay.products[0].recipe[0].unitCost,
    f => f.overlay.products[0].recipe[0].unitCost = -1,
    f => f.overlay.products[0].recipe[0].unitCost = '0',
    f => f.overlay.products[0].recipe[0].extendedBaseCost++,
    f => f.overlay.products[0].recipe[0].resources[0].platformId = 'unknown',
    f => f.overlay.revision++, f => f.overlay.catalogId = 'other', f => f.overlay.baseRevision = 'other'
  ];
  for (const mutate of mutations) {
    const f = structuredClone(fixtures.source); mutate(f);
    const { sourceHash, activation, ...body } = f.overlay;
    f.overlay.sourceHash = Q.digest(body);
    const testPins = { ...pins('source'), sourceHash: f.overlay.sourceHash,
      revision: f.overlay.revision, catalogId: f.overlay.catalogId, baseRevision: f.overlay.baseRevision };
    assert.throws(() => Q.adaptOverlay(f.structure, f.overlay, testPins));
  }
});

test('CE31 v1 structure alone cannot distinguish allocation scenarios; an independent v2 pin is required', () => {
  assert.deepEqual(fixtures.shared.structure, fixtures['different-rates'].structure);
  assert.deepEqual(fixtures.shared.structure, fixtures.missing.structure);
  assert.notEqual(pins('shared').sourceHash, pins('different-rates').sourceHash);
  assert.notEqual(pins('shared').sourceHash, pins('missing').sourceHash);
  assert.equal(fixtures.source.overlay.workspace, undefined);
  assert.equal(fixtures.source.overlay.structuralHash, undefined);
  assert.equal(fixtures.source.structure.catalog.products[0].costPlan, undefined);
});

test('CE31 source issues or inconsistent reported totals cannot pass on numeric completeness alone', () => {
  for (const mutate of [
    o => o.products[0].recipe[0].issues.push('Source assessment requires reconciliation'),
    o => o.products[0].pricing.known = false,
    o => o.products[0].pricing.termTotalCost++,
    o => o.products[0].pricing.monthly.totalBudget++
  ]) {
    const overlay = structuredClone(fixtures.shared.overlay); mutate(overlay);
    const { sourceHash, activation, ...body } = overlay;
    overlay.sourceHash = Q.digest(body);
    const catalog = Q.adaptOverlay(fixtures.shared.structure, overlay, { ...pins('shared'), sourceHash: overlay.sourceHash });
    const configuration = select(catalog, [overlay.products[0].id]);
    assert.equal(A.calculate(configuration).complete, true);
    assert.equal(Q.qualifyDefault(catalog, configuration).disposition, 'blocked');
    assert.equal(Q.qualifyDefault(catalog, configuration).result, null);
  }
});

test('CE31 loss or mutation of saved cost pins and selection fingerprints invalidates the proof', () => {
  const catalog = adapt('shared'), original = select(catalog, ['sm-audience']);
  for (const mutate of [
    c => delete c.source.costOverlay,
    c => c.source.costOverlay.sourceHash = '0'.repeat(64),
    c => c.source.costOverlay.calculationEngineHash = '0'.repeat(64),
    c => c.source.revision++, c => c.catalogFingerprint = '0'.repeat(64),
    c => c.products[0].fingerprint = '0'.repeat(64)
  ]) {
    const configuration = structuredClone(original); mutate(configuration);
    assert.equal(Q.qualifyDefault(catalog, configuration).disposition, 'blocked');
  }
});

test('CE31 subtraction, quantity, cadence, term and explicit edits are arithmetic only, not qualified reallocations', () => {
  const catalog = adapt('shared'), configuration = select(catalog, ['sm-audience']);
  const id = 'sm-audience', key = 'audience_batch:monthly';
  for (const [change, expectedCost] of [[{ included: false }, 0], [{ quantity: 0 }, 0], [{ quantity: 6 }, 1125], [{ cadence: 'once' }, 187.5], [{ unitCost: 10 }, 90]]) {
    const edited = A.configureProduct(configuration, id, key, change);
    assert.equal(A.calculate(edited).termCost, expectedCost);
    assert.equal(Q.qualifyDefault(catalog, edited).result, null);
  }
  const longer = structuredClone(configuration); longer.termMonths = 6;
  assert.equal(A.calculate(longer).termCost, 1125);
  assert.equal(Q.qualifyDefault(catalog, longer).disposition, 'blocked');
  const fee = structuredClone(configuration);
  fee.pricingOverrides[id] = { feeOverrides: { once: 0, monthly: 1000 } };
  assert.equal(A.calculate(fee).termPrice, 3000);
  assert.equal(A.calculate(fee).termCost, 562.5);
  assert.equal(Q.qualifyDefault(catalog, fee).disposition, 'blocked');
  // Frozen shares no longer reconcile to the fixed250 pool after quantity edits.
  const doubled = A.configureProduct(configuration, id, key, { quantity: 6 });
  assert.equal(A.calculate(doubled).monthlyCost + 62.5, 437.5);
  assert.equal(A.calculate(configuration).monthlyCost, 187.5);
});

for (const name of ['shared', 'different-rates']) {
  test(`CE31 ${name}: bundle resolution is explicit and does not certify provider reallocation`, () => {
    const catalog = adapt(name), configuration = select(catalog, ['sm-capture', 'sm-audience']);
    const incomplete = A.calculate(configuration);
    assert.equal(incomplete.complete, false);
    assert.match(incomplete.issues.join(' '), /shared defaults/);
    assert.equal(incomplete.termCost, null);
    const row = catalog.products.find(p => p.id === 'sm-audience').recipe[0];
    configuration.sharedResolutions[row.key] = { pricingProductId: 'sm-audience', quantity: row.quantity, unitCost: row.unitCost };
    const resolved = A.calculate(configuration);
    assert.equal(resolved.complete, true);
    assert.equal(resolved.lines.length, 1);
    assert.equal(resolved.monthlyCost, name === 'shared' ? 187.5 : 125);
    assert.notEqual(resolved.monthlyCost, 250);
    assert.equal(resolved.publishable, false);
    assert.equal(Q.qualifyDefault(catalog, configuration).disposition, 'blocked');
    assert.equal(Q.qualifyDefault(catalog, configuration).result, null);
  });
}

test('CE31 saved-like snapshots round-trip, preserve pins and never mutate v1 or prepared inputs', () => {
  const catalog = adapt(), configuration = select(catalog, ['sm-audience']);
  const saved = JSON.stringify(configuration), localProposal = { servicesVersion: 1, servicesSnapshotHash: Q.digest(configuration) };
  const receiptBefore = JSON.stringify(localProposal), total = A.calculate(configuration);
  const refreshed = adapt();
  refreshed.products[0].recipe[0].unitCost = 999;
  refreshed.source.costOverlay.sourceHash = '0'.repeat(64);
  assert.equal(Q.qualifyDefault(refreshed, select(refreshed, ['sm-pipeline'])).disposition, 'blocked');
  const restored = JSON.parse(saved);
  assert.deepEqual(A.calculate(restored), total);
  assert.equal(Q.qualifyDefault(catalog, restored).disposition, 'qualified_with_constraints');
  assert.equal(Q.digest(restored), localProposal.servicesSnapshotHash);
  assert.equal(JSON.stringify(localProposal), receiptBefore);
  assert.equal(JSON.stringify(configuration), saved);
  assert.equal(restored.source.costOverlay.calculationEngineHash, engine);
  assert.equal(restored.source.costOverlay.sourceHash, pins('source').sourceHash);
  assert.equal(restored.source.costOverlay.structuralHash, pins('source').structuralHash);
  for (const [name, fixture] of Object.entries(fixtures)) {
    assert.equal(Q.digest(fixture), originalHashes[name]);
    for (const [suffix, member] of [['v1', 'structure'], ['v2', 'overlay']]) {
      assert.deepEqual(JSON.parse(fs.readFileSync(path.join(directory, `${name}-${suffix}.json`))), fixture[member]);
    }
  }
});

test('CE31 reordered serialization exposes a persistence gate, not a changed financial result', () => {
  const reorder = value => Array.isArray(value) ? value.map(reorder) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, reorder(value[key])])) : value;
  const catalog = adapt('shared'), configuration = select(catalog, ['sm-audience']);
  const reorderedCatalog = reorder(catalog), reorderedConfiguration = reorder(configuration);
  assert.deepEqual(reorderedConfiguration, configuration);
  assert.deepEqual(A.calculate(reorderedConfiguration), A.calculate(configuration));
  assert.notEqual(Q.digest(reorderedConfiguration), Q.digest(configuration));
  assert.equal(Q.qualifyDefault(reorderedCatalog, reorderedConfiguration).disposition, 'blocked');
});
