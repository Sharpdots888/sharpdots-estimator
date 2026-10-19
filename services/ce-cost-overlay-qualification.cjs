'use strict';

// Local CE31 qualification only. Do not import from application or browser code.
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { isDeepStrictEqual } = require('node:util');
const A = require('./ce-catalog');
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const money = value => Math.round((value + Number.EPSILON) * 100) / 100;
const amount = value => value === null || (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1e9);
const fingerprint = value => { const { fingerprint: ignored, ...body } = value; return digest(body); };
const seal = value => ({ ...value, fingerprint: fingerprint(value) });
const scope = { id: '3', slug: 'sharpdots' };

function adaptOverlay(structure, overlay, pins) {
  assert.equal(structure?.contractVersion, 'ce-estimator-source-v1', 'Unsupported structural contract');
  assert.equal(structure.storage, 'shared', 'A shared structural snapshot is required');
  assert.equal(String(structure.workspace?.id), scope.id, 'Source workspace mismatch');
  assert.equal(structure.workspace?.slug, scope.slug, 'Source workspace mismatch');
  assert.equal(overlay?.contractVersion, 'ce-estimator-costs-v2', 'Unsupported cost contract');
  assert.equal(overlay.calculationVersion, 'ce-platform-costing-v1', 'Unsupported calculation version');
  assert.ok(pins, 'Independent qualification pins are required');
  for (const key of ['structuralHash', 'sourceHash', 'calculationEngineHash']) {
    assert.match(pins[key] || '', /^[a-f0-9]{64}$/, `Missing ${key} pin`);
  }
  assert.equal(digest(structure), pins.structuralHash, 'Structural snapshot hash mismatch');
  assert.equal(overlay.calculationEngineHash, pins.calculationEngineHash, 'Calculation engine mismatch');
  assert.equal(overlay.sourceHash, pins.sourceHash, 'Unrecognized cost snapshot hash');
  // CE hashes the insertion-ordered source object, excluding these two fields.
  const { sourceHash, activation, ...source } = overlay;
  assert.equal(digest(source), sourceHash, 'Cost snapshot integrity mismatch');
  for (const key of ['catalogId', 'revision', 'baseRevision']) {
    assert.equal(overlay[key], pins[key], `Unexpected ${key}`);
  }
  assert.equal(structure.catalog?.catalogId, overlay.catalogId, 'Catalog identity mismatch');
  assert.equal(structure.version, overlay.revision, 'Catalog revision mismatch');
  assert.equal(structure.baseRevision, overlay.baseRevision, 'Base revision mismatch');

  const legacy = A.adaptCatalog(structure, scope);
  assert.ok(Array.isArray(overlay.products), 'Cost products are required');
  const costs = new Map(overlay.products.map(p => [p.id, p]));
  assert.equal(costs.size, overlay.products.length, 'Duplicate cost product');
  assert.deepEqual([...costs.keys()].sort(), legacy.products.map(p => p.id).sort(), 'Cost product coverage mismatch');
  const binding = { contractVersion: overlay.contractVersion, calculationVersion: overlay.calculationVersion,
    calculationEngineHash: overlay.calculationEngineHash, sourceHash, structuralHash: pins.structuralHash,
    structuralFingerprint: legacy.fingerprint, activation, qualificationOnly: true };
  const products = legacy.products.map(product => {
    const cost = costs.get(product.id);
    assert.equal(cost.name, product.name, 'Product name mismatch');
    assert.equal(cost.status, product.sourceStatus, 'Product lifecycle mismatch');
    assert.equal(cost.termMonths, product.productDefinition.termMonths, 'Source term mismatch');
    assert.equal(typeof cost.basis, 'string', 'Missing cost basis');
    assert.equal(typeof cost.pricing?.known, 'boolean', 'Missing cost completeness');
    assert.ok(Array.isArray(cost.recipe), 'Missing cost recipe');
    const rows = new Map(cost.recipe.map(row => [A.keyOf(row), row]));
    assert.equal(rows.size, cost.recipe.length, 'Duplicate cost row');
    assert.deepEqual([...rows.keys()].sort(), product.recipe.map(row => row.key).sort(), 'Cost row coverage mismatch');
    const recipe = product.recipe.map(row => {
      const rate = rows.get(row.key), component = product.components.find(c => c.id === row.componentId);
      assert.equal(rate.quantity, row.quantity, 'Source quantity mismatch');
      assert.equal(rate.configuration, row.configuration, 'Source configuration mismatch');
      assert.equal(rate.name, component.name, 'Component name mismatch');
      assert.equal(rate.unit, component.unit, 'Component unit mismatch');
      for (const key of ['unitCost', 'extendedBaseCost', 'laborPerUnit', 'incidentalPerUnit', 'providerPerUnit']) {
        assert.ok(amount(rate[key]), `Missing or invalid ${key}`);
      }
      assert.equal(rate.extendedBaseCost, rate.unitCost === null && rate.quantity > 0 ? null : money((rate.unitCost ?? 0) * rate.quantity), 'Row extension mismatch');
      assert.ok(Array.isArray(rate.issues) && rate.issues.every(i => typeof i === 'string'), 'Missing cost issues');
      assert.ok(Array.isArray(rate.resources), 'Missing resource assessment');
      for (const resource of rate.resources) {
        assert.ok(structure.catalog.platforms.some(p => p.id === resource.platformId), 'Unknown assessed platform');
        assert.ok(typeof resource.chargeId === 'string' && resource.chargeId, 'Missing assessed charge');
        assert.ok(['assessed', 'reference', 'confirmed'].includes(resource.basis), 'Unknown assessment basis');
        assert.ok(['once', 'month', 'year'].includes(resource.period), 'Unknown assessment period');
        assert.ok(resource.allocatedPerUnit !== null && amount(resource.allocatedPerUnit), 'Invalid resource allocation');
        assert.ok(resource.usagePerUnit !== null && amount(resource.usagePerUnit), 'Invalid assessed usage');
      }
      // Replace the legacy recipe rate, never add a provider amount to it.
      return { ...row, unitCost: rate.unitCost, extendedBaseCost: rate.extendedBaseCost, costAssessment: structuredClone(rate) };
    });
    const assessedPlatformIds = new Set(cost.recipe.flatMap(row => row.resources.map(r => r.platformId)));
    return seal({ ...product, recipe, costAssessment: {
      basis: cost.basis, pricing: structuredClone(cost.pricing), binding: structuredClone(binding),
      // Cost references are not additions to the operational product/workflow map.
      platforms: structuredClone(structure.catalog.platforms.filter(p => assessedPlatformIds.has(p.id)))
    } });
  });
  return seal({ ...legacy, source: { ...legacy.source, costOverlay: binding }, products });
}

// This is an evidence gate, not a new pricing policy or a publishing permission.
function qualifyDefault(catalog, configuration) {
  const blocked = issues => ({ disposition: 'blocked', issues, result: null });
  if (catalog?.source?.costOverlay?.qualificationOnly !== true || catalog.fingerprint !== fingerprint(catalog)
    || catalog.products.some(p => p.fingerprint !== fingerprint(p))) return blocked(['Qualification snapshot integrity mismatch']);
  if (configuration?.products?.length !== 1) return blocked(['Bundle provider allocation and shared-scope policy is unresolved']);
  const productId = configuration.products[0].id;
  if (!catalog.products.some(p => p.id === productId)) return blocked(['Unknown selected product']);
  const baseline = A.selectProducts(catalog, [productId]);
  if (!isDeepStrictEqual(configuration, baseline)) {
    return blocked(['Only unchanged source defaults are qualified; edits, overrides and term changes require an explicit cost-allocation contract']);
  }
  const product = baseline.products[0], result = A.calculate(baseline);
  const issues = [...result.issues, ...product.recipe.flatMap(row => row.costAssessment.issues)];
  if (!result.complete || issues.length || product.costAssessment.pricing.known !== true) {
    return { disposition: 'blocked', issues: issues.length ? issues : ['Source costs are not qualified'], result: null };
  }
  const pricing = product.costAssessment.pricing, actual = result.products[0];
  if (!isDeepStrictEqual(actual.once, pricing.once) || !isDeepStrictEqual(actual.monthly, pricing.monthly)
    || result.termPrice !== pricing.termTotalBudget || result.termCost !== pricing.termTotalCost) {
    return blocked(['Prepared source pricing does not reconcile with the structural pricing policy']);
  }
  return { disposition: 'qualified_with_constraints', issues: ['Unchanged draft arithmetic only; no delivery, capacity, vendor-price or sending authority'], result };
}

module.exports = { adaptOverlay, qualifyDefault, digest };
