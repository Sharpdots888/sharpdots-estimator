(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./ce-catalog'), require('node:crypto').createHash);
  else root.CePricing = factory(root.CeServiceCatalog);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Legacy, createHash) {
  'use strict';
  const CONTRACT = 'ce-estimator-paired-v2', CATALOG = 'ce-estimator-catalog-v2', CONFIG = 'ce-services-configuration-v2';
  const ENGINES = ['b573cbc0d01e783db82d2e9bd62372cb28d710b606f389959781f53210358f22'];
  const clone = value => JSON.parse(JSON.stringify(value));
  const assert = (value, message) => { if (!value) throw Error(message); };
  const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
  const sha = text => { assert(createHash, 'Source verification runs on the server'); return createHash('sha256').update(text).digest('hex'); };
  const digest = value => sha(canonical(value));
  const money = value => Math.round((value + Number.EPSILON) * 100) / 100;
  const numeric = n => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1e9;
  const amount = n => n === null || numeric(n);
  const same = (a, b) => canonical(a) === canonical(b);
  const isAssessed = c => c?.schema === CONFIG;
  const reason = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 2000;
  const hashOf = value => { const { fingerprint, ...body } = value; return digest(body); };
  const seal = value => ({ ...value, fingerprint: hashOf(value) });

  function adaptPaired(pair, workspace) {
    assert(pair?.contractVersion === CONTRACT && pair.storage === 'shared' && pair.hashAlgorithm === 'sha256-canonical-json-v1', 'A saved paired CE catalog is required');
    assert(String(workspace?.id) === '3' && workspace.slug === 'sharpdots'
      && String(pair.workspace?.id) === '3' && pair.workspace.slug === 'sharpdots', 'Paired workspace mismatch');
    const { pairHash, ...body } = pair;
    assert(digest(body) === pairHash, 'Paired catalog hash mismatch');
    const s = pair.structure, c = pair.costs;
    assert(s?.contractVersion === 'ce-estimator-source-v1' && s.storage === 'shared' && same(s.workspace, pair.workspace), 'Paired structure scope mismatch');
    assert(digest(s) === pair.structuralHash, 'Paired structural hash mismatch');
    assert(c?.contractVersion === 'ce-estimator-costs-v2' && c.calculationVersion === 'ce-platform-costing-v1', 'Unsupported assessed cost contract');
    assert(ENGINES.includes(c.calculationEngineHash), 'Assessed calculation engine has not been qualified');
    for (const key of ['catalogId', 'revision', 'baseRevision', 'calculationVersion', 'calculationEngineHash', 'sourceHash']) assert(pair[key] === c[key], `Paired ${key} mismatch`);
    assert(s.catalog?.catalogId === pair.catalogId && s.version === pair.revision && s.baseRevision === pair.baseRevision, 'Paired revision mismatch');
    const { sourceHash, activation, ...costSource } = c, costSourceJson = JSON.stringify(costSource);
    assert(sha(costSourceJson) === sourceHash, 'Assessed source hash mismatch');
    const legacy = Legacy.adaptCatalog(s, workspace), costs = new Map(c.products.map(p => [p.id, p]));
    assert(costs.size === c.products.length && same([...costs.keys()].sort(), legacy.products.map(p => p.id).sort()), 'Assessed product coverage mismatch');
    const products = legacy.products.map(p => {
      const cost = costs.get(p.id), rates = new Map(cost.recipe.map(r => [Legacy.keyOf(r), r]));
      assert(cost.name === p.name && cost.status === p.sourceStatus && cost.termMonths === p.productDefinition.termMonths, 'Assessed product baseline mismatch');
      assert(rates.size === cost.recipe.length && same([...rates.keys()].sort(), p.recipe.map(r => r.key).sort()), 'Assessed recipe coverage mismatch');
      const recipe = p.recipe.map(row => {
        const rate = rates.get(row.key), component = p.components.find(x => x.id === row.componentId);
        assert(rate.quantity === row.quantity && rate.configuration === row.configuration && rate.unit === component.unit, 'Assessed row baseline mismatch');
        assert(amount(rate.unitCost) && Array.isArray(rate.issues) && Array.isArray(rate.resources), 'Invalid assessed rate');
        assert(rate.extendedBaseCost === (rate.unitCost === null && rate.quantity > 0 ? null : money((rate.unitCost ?? 0) * rate.quantity)), 'Assessed extension mismatch');
        for (const r of rate.resources) assert(s.catalog.platforms.some(x => x.id === r.platformId), 'Unknown assessed provider');
        return { ...row, unitCost: rate.unitCost, extendedBaseCost: rate.extendedBaseCost, costAssessment: clone(rate) };
      });
      const resourceIds = new Set(cost.recipe.flatMap(r => r.resources.map(x => x.platformId)));
      return seal({ ...p, recipe, costAssessment: { basis: cost.basis, pricing: clone(cost.pricing),
        platforms: clone(s.catalog.platforms.filter(x => resourceIds.has(x.id))) } });
    });
    const catalog = seal({ schema: CATALOG, catalogId: pair.catalogId, source: { ...legacy.source,
      costBasis: 'ce-assessed-frozen-rates-v1', contractVersion: CONTRACT, hashAlgorithm: pair.hashAlgorithm,
      structuralHash: pair.structuralHash, calculationVersion: pair.calculationVersion,
      calculationEngineHash: pair.calculationEngineHash, sourceHash, pairHash }, costSourceJson, products });
    for (const product of products) {
      const calculated = calculate(selectProducts(catalog, [product.id])), assessed = product.costAssessment.pricing;
      assert(calculated.complete === assessed.known, 'Assessed completeness mismatch');
      if (calculated.complete) {
        assert(calculated.termPrice === assessed.termTotalBudget && calculated.termCost === assessed.termTotalCost, 'Assessed default totals mismatch');
        for (const cadence of ['once', 'monthly']) assert(same(calculated.products[0][cadence], assessed[cadence]), 'Assessed default pricing mismatch');
      }
    }
    return catalog;
  }

  function selectProducts(catalog, ids) {
    if (catalog?.schema !== CATALOG) return Legacy.selectProducts(catalog, ids);
    const selected = Legacy.selectProducts({ ...catalog, schema: 'ce-estimator-catalog-v1' }, ids);
    return { ...selected, schema: CONFIG, costSourceJson: catalog.costSourceJson, termReason: '' };
  }
  function validate(config) {
    assert(isAssessed(config), 'Expected assessed Services configuration');
    assert(config.source?.costBasis === 'ce-assessed-frozen-rates-v1' && config.source.contractVersion === CONTRACT
      && String(config.source.workspace?.id) === '3' && config.source.workspace.slug === 'sharpdots', 'Invalid assessed source scope');
    assert(typeof config.costSourceJson === 'string' && config.costSourceJson.length < 5000000, 'Assessed source evidence is missing');
    const evidence = JSON.parse(config.costSourceJson);
    assert(evidence.contractVersion === 'ce-estimator-costs-v2' && evidence.catalogId === config.catalogId
      && evidence.revision === config.source.revision && evidence.baseRevision === config.source.baseRevision
      && evidence.calculationVersion === config.source.calculationVersion
      && evidence.calculationEngineHash === config.source.calculationEngineHash
      && ENGINES.includes(evidence.calculationEngineHash), 'Assessed source identity mismatch');
    for (const key of ['structuralHash', 'pairHash', 'sourceHash']) assert(/^[a-f0-9]{64}$/.test(config.source[key] || ''), 'Assessed source pin is missing');
    assert(Array.isArray(config.products) && config.products.length && new Set(config.products.map(p => p.id)).size === config.products.length, 'Invalid assessed product selection');
    if (createHash) assert(sha(config.costSourceJson) === config.source.sourceHash, 'Stored assessed source evidence changed');
    for (const p of config.products) {
      const origin = evidence.products.find(x => x.id === p.id);
      assert(origin && p.sourceStatus === origin.status && p.reviewRequired === true && p.enabledForSending === false, 'Assessed source review state changed');
      if (createHash) assert(p.fingerprint === hashOf(p), 'Immutable product baseline changed');
      assert(same(p.recipe.map(r => r.costAssessment), origin.recipe), 'Immutable assessed rates changed');
      assert(p.recipe.every(r => r.unitCost === r.costAssessment.unitCost && r.quantity === r.costAssessment.quantity && r.cadence === r.costAssessment.cadence), 'Immutable source recipe changed');
      assert(same(p.costAssessment.pricing, origin.pricing) && p.costAssessment.basis === origin.basis, 'Original assessed pricing changed');
      assert(p.pricingPolicy.margin === p.productDefinition.targetContributionMargin && p.pricingPolicy.reserve === p.productDefinition.contingencyRate
        && same(p.pricingPolicy.feeOverrides, p.productDefinition.priceOverrides ?? { once: null, monthly: null }), 'Original product pricing changed');
    }
    for (const name of ['rowOverrides', 'pricingOverrides', 'sharedResolutions']) assert(config[name] && typeof config[name] === 'object' && !Array.isArray(config[name]), 'Missing configured override state');
    for (const [id, rows] of Object.entries(config.rowOverrides)) {
      assert(config.products.some(p => p.id === id) && rows && typeof rows === 'object' && !Array.isArray(rows), 'Unknown override product');
      for (const key of Object.keys(rows)) rowFor(config, id, key);
    }
    assert(Object.keys(config.pricingOverrides).every(id => config.products.some(p => p.id === id)), 'Unknown pricing product');
    return config;
  }
  function rowFor(config, productId, key) {
    const p = config.products.find(p => p.id === productId), row = p?.recipe.find(r => r.key === key);
    assert(row, 'Unknown assessed component'); return { p, row };
  }
  function configureProduct(config, productId, key, changes) {
    if (!isAssessed(config)) return Legacy.configureProduct(config, productId, key, changes);
    const { row } = rowFor(config, productId, key);
    assert(changes && Object.keys(changes).every(k => ['included', 'quantity', 'cadence', 'unitCost', 'sellRate', 'reason'].includes(k)), 'Unsupported assessed edit');
    for (const field of ['unitCost', 'sellRate']) if (field in changes) assert(amount(changes[field]), `Invalid ${field}`);
    if ('quantity' in changes) assert(numeric(changes.quantity), 'Invalid quantity');
    if ('included' in changes) assert(typeof changes.included === 'boolean', 'Invalid inclusion');
    if ('cadence' in changes) assert(['once', 'monthly'].includes(changes.cadence), 'Invalid cadence');
    assert(!row.passThrough || changes.sellRate == null, 'Pass-through amounts are not marked up');
    const next = clone(config), current = { ...next.rowOverrides[productId]?.[key], ...clone(changes) };
    assert(reason(current.reason), 'Add a reason for the product adjustment');
    next.rowOverrides[productId] ??= {}; next.rowOverrides[productId][key] = current; next.sharedResolutions = {};
    return next;
  }
  function configureTerm(config, months, note) {
    assert(isAssessed(config) && Number.isInteger(months) && months >= 1 && months <= 120, 'Use a term of 1 to 120 months');
    assert(reason(note), 'Add a reason for the term adjustment');
    return { ...clone(config), termMonths: months, termConfirmed: true, termReason: note.trim() };
  }
  function configurePricing(config, id, policy) {
    assert(isAssessed(config) && config.products.some(p => p.id === id), 'Unknown assessed product');
    assert(Object.keys(policy).every(k => ['method', 'markup', 'margin', 'reserve', 'feeOverrides', 'reason'].includes(k)), 'Unsupported pricing edit');
    assert(reason(policy.reason), 'Add a reason for the pricing adjustment');
    assert(['markup', 'margin'].includes(policy.method), 'Choose markup or contribution margin');
    assert(numeric(policy.reserve) && policy.reserve <= 1, 'Invalid reserve');
    assert(policy.method === 'markup' ? numeric(policy.markup) : numeric(policy.margin) && policy.margin < 1, 'Invalid pricing percentage');
    assert(policy.feeOverrides && ['once', 'monthly'].every(c => amount(policy.feeOverrides[c])), 'Invalid fixed service fee');
    const next = clone(config); next.pricingOverrides[id] = clone(policy); return next;
  }
  function deviations(config) {
    if (!isAssessed(config)) return [];
    const rows = [];
    for (const p of config.products) {
      for (const row of p.recipe) {
        const o = config.rowOverrides?.[p.id]?.[row.key] || {};
        for (const field of ['included', 'quantity', 'cadence', 'unitCost', 'sellRate']) {
          const original = field === 'included' ? true : field === 'sellRate' ? null : row[field];
          if (Object.hasOwn(o, field) && o[field] !== original) rows.push({ productId: p.id, rowKey: row.key, name: p.components.find(x => x.id === row.componentId).name, field, original, effective: o[field], reason: o.reason || '' });
        }
      }
      const o = config.pricingOverrides?.[p.id];
      if (o) {
        const effectiveMarkup = o.method === 'markup' ? o.markup : o.margin / (1 - o.margin);
        for (const [field, original, effective] of [['markup', p.pricingPolicy.margin / (1 - p.pricingPolicy.margin), effectiveMarkup], ['reserve', p.pricingPolicy.reserve, o.reserve], ['onceFee', p.pricingPolicy.feeOverrides.once, o.feeOverrides?.once], ['monthlyFee', p.pricingPolicy.feeOverrides.monthly, o.feeOverrides?.monthly]]) {
          if (original !== effective) rows.push({ productId: p.id, name: p.name, field, original, effective, reason: o.reason || '' });
        }
      }
      if (p.productDefinition.termMonths !== config.termMonths) rows.push({ productId: p.id, name: p.name, field: 'termMonths', original: p.productDefinition.termMonths, effective: config.termMonths, reason: config.termReason || '' });
    }
    return rows;
  }
  function calculate(config) {
    if (!isAssessed(config)) return Legacy.calculate(config);
    validate(config);
    const copy = clone(config), issues = [], changes = deviations(config);
    copy.schema = 'ce-services-configuration-v1';
    if (copy.products.length !== 1) issues.push('Assessed-cost bundles are not qualified. Use one service per estimate; provider shares cannot be deduplicated.');
    if (Object.keys(copy.sharedResolutions).length) issues.push('Shared provider cost allocation requires a reviewed bundle policy');
    if (changes.some(d => !reason(d.reason))) issues.push('Every product adjustment needs a reason');
    for (const p of copy.products) {
      const o = copy.pricingOverrides[p.id];
      if (o) {
        configurePricing(config, p.id, o);
        copy.pricingOverrides[p.id] = { ...o, margin: o.method === 'markup' ? o.markup / (1 + o.markup) : o.margin };
      }
      for (const row of p.recipe) {
        const edit = copy.rowOverrides[p.id]?.[row.key], effective = { ...row, ...edit };
        if (edit) configureProduct(config, p.id, row.key, edit);
        if (effective.included !== false && effective.quantity > 0 && row.costAssessment.issues.length && !Object.hasOwn(edit || {}, 'unitCost')) issues.push(...row.costAssessment.issues);
      }
    }
    const result = Legacy.calculate(copy);
    // JSONB may reorder labor-map keys; derived arrays must not depend on that order.
    result.capacity.sort((a, b) => a.roleId.localeCompare(b.roleId));
    if (result.complete && !issues.length) {
      for (const p of copy.products) {
        const policy = { ...p.pricingPolicy, ...copy.pricingOverrides[p.id] }, total = result.products.find(x => x.productId === p.id);
        for (const cadence of ['once', 'monthly']) {
          const lines = result.lines.filter(l => l.productId === p.id && l.cadence === cadence && !l.passThrough);
          const fixed = lines.filter(l => l.sellRate != null);
          if (!fixed.length) continue;
          if (policy.feeOverrides[cadence] !== null) { issues.push('Choose either fixed component selling rates or a fixed product fee for each cadence'); continue; }
          const base = lines.filter(l => l.sellRate == null).reduce((n, l) => n + l.extendedCost, 0);
          const reserved = money(base + money(base * policy.reserve));
          total[cadence].proposedServiceFee = money((reserved ? Math.ceil((reserved / (1 - policy.margin) - 1e-9) / 25) * 25 : 0)
            + fixed.reduce((n, l) => n + money(l.sellRate * l.quantity), 0));
          total[cadence].totalBudget = money(total[cadence].proposedServiceFee + total[cadence].passThroughAllowance);
        }
      }
      result.activationPrice = money(result.products.reduce((n, p) => n + p.once.totalBudget, 0));
      result.monthlyPrice = money(result.products.reduce((n, p) => n + p.monthly.totalBudget, 0));
      result.termPrice = money(result.activationPrice + result.monthlyPrice * copy.termMonths);
    }
    result.issues.push(...issues); result.complete = result.issues.length === 0;
    if (!result.complete) {
      for (const field of ['activationPrice', 'monthlyPrice', 'termPrice', 'activationCost', 'monthlyCost', 'termCost']) result[field] = null;
      for (const p of result.products) for (const c of ['once', 'monthly']) for (const field of Object.keys(p[c])) p[c][field] = null;
    }
    return { ...result, deviations: changes, adjustedFromProduct: changes.length > 0, costBasis: 'Assessed delivery cost', publishable: false, reviewRequired: true };
  }
  function proof(config) {
    const totals = calculate(config);
    return { schema: 'ce-configured-pricing-proof-v1', configurationHash: digest(config), overrideHash: digest({ rows: config.rowOverrides, pricing: config.pricingOverrides, term: config.termMonths, termReason: config.termReason }),
      source: clone(config.source), totals, deviations: deviations(config) };
  }
  function proposalConfiguration(proposal, services) {
    const base = services.snapshot?.serviceEngagement?.catalogConfiguration || services.serviceEngagement?.catalogConfiguration;
    const adjustment = proposal?.servicesPricingOverride;
    if (!adjustment) return base;
    assert(adjustment.schema === 'ce-proposal-pricing-v1' && isAssessed(base), 'Invalid proposal pricing adjustment');
    assert(adjustment.sourceRecord?.number === services.number && adjustment.sourceRecord.version === services.version, 'Proposal pricing pins a different Services version');
    assert(/^[a-f0-9]{64}$/.test(adjustment.baseConfigurationHash || ''), 'Proposal pricing baseline hash is missing');
    if (createHash) assert(adjustment.baseConfigurationHash === digest(base), 'Proposal pricing baseline differs from saved Services');
    const effective = adjustment.configuration;
    validate(effective);
    for (const key of ['source', 'costSourceJson', 'catalogId', 'catalogFingerprint', 'products']) assert(same(effective[key], base[key]), 'Proposal adjustment cannot replace its product baseline');
    calculate(effective);
    return clone(effective);
  }
  return { ...Legacy, CONTRACT, CATALOG, CONFIG, ENGINES, canonical, digest, adaptPaired, selectProducts, configureProduct,
    configureTerm, configurePricing, calculate, validate, deviations, isAssessed, proof, proposalConfiguration };
});
