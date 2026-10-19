const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const P = require('./ce-pricing');
const pair = JSON.parse(fs.readFileSync(process.env.CE_PAIRED_FIXTURE || '/private/tmp/ce31-estimator-cost-handoff/paired-source.json', 'utf8'));
const catalog = P.adaptPaired(pair, { id: 3, slug: 'sharpdots' });
const make = (id = 'sm-pipeline') => P.selectProducts(catalog, [id]);
const money = n => Math.round((n + Number.EPSILON) * 100) / 100;
for (const origin of pair.costs.products) test(`assessed ${origin.id}: exact default cost and budget`, () => {
  const c = make(origin.id), t = P.calculate(c);
  assert.equal(t.complete, true); assert.equal(t.termCost, origin.pricing.termTotalCost);
  assert.equal(t.termPrice, origin.pricing.termTotalBudget); assert.equal(t.publishable, false);
  assert.deepEqual(P.deviations(c), []);
  assert.deepEqual(P.proof(JSON.parse(P.canonical(c))), P.proof(c));
});
test('paired hashes, identity and engine fail closed', () => {
  for (const change of [p => p.structure.version++, p => p.costs.products[0].recipe[0].unitCost++, p => p.workspace.id = '4', p => p.calculationEngineHash = 'a'.repeat(64)]) {
    const p = structuredClone(pair); change(p); p.pairHash = P.digest(Object.fromEntries(Object.entries(p).filter(([k]) => k !== 'pairHash')));
    assert.throws(() => P.adaptPaired(p, { id: 3, slug: 'sharpdots' }));
  }
});
test('frozen assessed rates permit reasoned scope, quantity, cadence and term changes', () => {
  const c = make(), row = c.products[0].recipe[2], baseline = JSON.stringify(c);
  let next = P.configureProduct(c, 'sm-pipeline', row.key, { quantity: 4, cadence: 'monthly', reason: 'Fictional expanded test scope' });
  next = P.configureTerm(next, 6, 'Fictional six-month term');
  const t = P.calculate(next), line = t.lines.find(l => l.componentId === row.componentId);
  assert.equal(line.unitCost, row.unitCost); assert.equal(line.extendedCost, money(row.unitCost * 4));
  assert.equal(t.complete, true); assert.equal(t.termPrice, money(t.activationPrice + t.monthlyPrice * 6));
  assert.equal(JSON.stringify(c), baseline); assert.equal(t.adjustedFromProduct, true);
  next = P.configureProduct(next, 'sm-pipeline', row.key, { included: false, reason: 'Not required' });
  assert.equal(P.calculate(next).lines.some(l => l.componentId === row.componentId), false);
});
test('unit cost and selling rate override retain baseline and reconcile', () => {
  const c = make(), row = c.products[0].recipe[0];
  const next = P.configureProduct(c, 'sm-pipeline', row.key, { unitCost: 123.456, sellRate: 300, reason: 'Fictional negotiated rate' });
  const t = P.calculate(next);
  assert.equal(t.complete, true); assert.equal(t.lines[0].extendedCost, 123.46);
  assert.equal(next.products[0].recipe[0].unitCost, row.unitCost);
  const remaining = t.products[0].once.baseDeliveryCost - 123.46;
  const reserved = money(remaining + money(remaining * .1));
  assert.equal(t.activationPrice, Math.ceil((reserved / .65 - 1e-9) / 25) * 25 + 300);
  assert.deepEqual(t.deviations.map(d => d.field), ['unitCost', 'sellRate']);
});
test('markup is not margin; reset restores product policy', () => {
  const c = make();
  const next = P.configurePricing(c, 'sm-pipeline', { method: 'markup', markup: .5, reserve: .1, feeOverrides: { once: null, monthly: null }, reason: 'Fictional 50 percent cost uplift' });
  const t = P.calculate(next);
  assert.equal(t.activationPrice, Math.ceil((t.products[0].once.costWithReserve * 1.5 - 1e-9) / 25) * 25);
  assert.equal(t.deviations.find(d => d.field === 'markup').effective, .5);
  delete next.pricingOverrides['sm-pipeline']; assert.deepEqual(P.calculate(next), P.calculate(c));
});
test('missing reasons, unknown keys, incompatible fixed fees and bundles blocked', () => {
  const c = make(), key = c.products[0].recipe[0].key;
  assert.throws(() => P.configureProduct(c, 'sm-pipeline', key, { quantity: 2 }), /reason/);
  const forged = structuredClone(c); forged.rowOverrides.unknown = {}; assert.throws(() => P.calculate(forged));
  const bundle = P.selectProducts(catalog, ['sm-capture', 'sm-audience']); assert.equal(P.calculate(bundle).complete, false);
  let conflict = P.configureProduct(c, 'sm-pipeline', key, { sellRate: 100, reason: 'Fictional rate' });
  conflict = P.configurePricing(conflict, 'sm-pipeline', { method: 'markup', markup: .5, reserve: .1, feeOverrides: { once: 1000, monthly: null }, reason: 'Fictional fee' });
  assert.equal(P.calculate(conflict).termPrice, null);
});
test('proposal-only override binds exact saved Services baseline', () => {
  const base = make(), service = { number: 'S-LOCAL-31B', version: 1, snapshot: { serviceEngagement: { catalogConfiguration: base } } };
  const effective = P.configureTerm(base, 6, 'Fictional proposal term');
  const proposal = { servicesPricingOverride: { schema: 'ce-proposal-pricing-v1', sourceRecord: { number: service.number, version: 1 }, baseConfigurationHash: P.digest(base), configuration: effective } };
  assert.deepEqual(P.proposalConfiguration(proposal, service), effective);
  assert.equal(base.termMonths, 3);
  assert.throws(() => P.proposalConfiguration(proposal, { ...service, version: 2 }), /different Services/);
  proposal.servicesPricingOverride.configuration.products[0].name = 'Changed baseline';
  assert.throws(() => P.proposalConfiguration(proposal, service));
});
test('inconsistent assessed defaults are rejected even with fresh fixture hashes', () => {
  const p = structuredClone(pair); p.costs.products[0].pricing.termTotalBudget++;
  const { sourceHash, activation, ...body } = p.costs;
  p.sourceHash = p.costs.sourceHash = require('node:crypto').createHash('sha256').update(JSON.stringify(body)).digest('hex');
  const { pairHash, ...envelope } = p; p.pairHash = P.digest(envelope);
  assert.throws(() => P.adaptPaired(p, { id: 3, slug: 'sharpdots' }), /totals mismatch/);
});
function fictionalPair(name) {
  const dir = '/private/tmp/ce31-estimator-cost-handoff/';
  const structure = JSON.parse(fs.readFileSync(`${dir}${name}-v1.json`)), costs = JSON.parse(fs.readFileSync(`${dir}${name}-v2.json`));
  const body = { contractVersion: P.CONTRACT, storage: 'shared', workspace: structure.workspace, hashAlgorithm: 'sha256-canonical-json-v1', structuralHash: P.digest(structure), structure, costs };
  for (const key of ['catalogId', 'revision', 'baseRevision', 'calculationVersion', 'calculationEngineHash', 'sourceHash']) body[key] = costs[key];
  return { ...body, pairHash: P.digest(body) };
}
test('unknown assessed rates stay unknown; fractional product-local rates do not coalesce', () => {
  const missing = P.adaptPaired(fictionalPair('missing'), { id: 3, slug: 'sharpdots' });
  for (const product of missing.products) {
    const c = P.selectProducts(missing, [product.id]);
    if (product.recipe.some(r => r.unitCost === null)) assert.equal(P.calculate(c).termPrice, null);
  }
  const distinct = P.adaptPaired(fictionalPair('different-rates'), { id: 3, slug: 'sharpdots' });
  const capture = P.calculate(P.selectProducts(distinct, ['sm-capture']));
  const audience = P.calculate(P.selectProducts(distinct, ['sm-audience']));
  const fractional = audience.lines.find(r => r.unitCost === 41.666667);
  assert.ok(fractional); assert.equal(fractional.extendedCost, 125);
  assert.ok(capture.lines.some(r => r.unitCost === 125 && r.extendedCost === 125));
});
