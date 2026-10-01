(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./ce-catalog'));
  else root.CeEngagement = factory(root.CeServiceCatalog);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (C) {
  const clone = value => JSON.parse(JSON.stringify(value));
  const assert = (ok, message) => { if (!ok) throw Error(message); };
  const isCatalog = state => Boolean(state && Object.hasOwn(state, 'catalogConfiguration'));
  const blockedMessage = 'CE catalog pricing is draft-only. Client PDF, CSV and DocuSeal are unavailable; use Internal review.';
  function validateCatalog(catalog) {
    assert(catalog?.schema === 'ce-estimator-catalog-v1' && catalog.source?.system === 'client-engagement'
      && String(catalog.source.workspace?.id) === '3' && catalog.source.workspace?.slug === 'sharpdots'
      && Number.isSafeInteger(catalog.source.revision) && catalog.source.revision > 0
      && typeof catalog.source.baseRevision === 'string' && catalog.source.baseRevision
      && /^[a-f0-9]{64}$/.test(catalog.fingerprint) && Array.isArray(catalog.products)
      && catalog.products.length <= 200, 'Invalid saved CE catalog');
    assert(new Set(catalog.products.map(p => p.id)).size === catalog.products.length, 'Duplicate CE product');
    for (const p of catalog.products) {
      assert(p && typeof p.name === 'string' && ['active', 'under_review'].includes(p.sourceStatus)
        && p.pricingPolicy?.method === 'ce-contribution-margin-v1'
        && /^[a-f0-9]{64}$/.test(p.fingerprint) && Array.isArray(p.recipe) && p.recipe.length > 0,
      'Invalid CE product snapshot');
      C.calculate(C.selectProducts(catalog, [p.id]));
    }
    return clone(catalog);
  }
  function totals(state) {
    const config = state.catalogConfiguration;
    try {
      assert(!state.products?.length && !state.customLines?.length, 'CE and imported pricing cannot be combined in one Services record');
      const result = C.calculate(config);
      return { ...result, count: result.lines.length, sample: false, catalog: true,
        termMonths: config.termMonths, initialTermMonths: config.termMonths, ongoingTermMonths: 1, appointments: 0 };
    } catch {
      return { complete: false, publishable: false, reviewRequired: true, catalog: true, invalid: true, count: 0,
        issues: ['Invalid CE configuration snapshot. Restore a saved version or create a new Services record.'],
        products: [], lines: [], capacity: [], activationPrice: null, monthlyPrice: null,
        activationCost: null, monthlyCost: null, termPrice: null, termCost: null,
        termMonths: 0, initialTermMonths: 0, ongoingTermMonths: 1, appointments: 0 };
    }
  }
  function addProduct(state, catalog, id) {
    assert(!state.products.length && !state.customLines.length, 'Create a new Services record for CE products. Existing imported lines are unchanged.');
    const next = C.selectProducts(catalog, [id]);
    if (!isCatalog(state)) { state.catalogConfiguration = next; return; }
    const current = state.catalogConfiguration;
    assert(current?.catalogFingerprint === catalog.fingerprint, 'This record uses a different catalog revision. Create a new Services record to use the refreshed catalog.');
    if (current.products.some(p => p.id === id)) return;
    const product = next.products[0];
    current.products.push(product);
    if (product.productDefinition.termMonths !== current.termMonths) current.termConfirmed = false;
  }
  function removeProduct(state, id) {
    const c = state.catalogConfiguration;
    c.products = c.products.filter(p => p.id !== id);
    delete c.rowOverrides[id]; delete c.pricingOverrides[id];
    // Removing a product changes shared pricing ownership; require a fresh decision.
    c.sharedResolutions = {};
    if (!c.products.length) delete state.catalogConfiguration;
  }
  function requirements(config) {
    const grouped = new Map();
    for (const p of config.products) for (const original of p.recipe) {
      const row = { ...original, ...config.rowOverrides?.[p.id]?.[original.key] };
      if (row.included === false || row.quantity === 0) continue;
      const key = C.keyOf(row);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push({ ...row, productId: p.id, productName: p.name });
    }
    return [...grouped].filter(([, uses]) => uses.length > 1).map(([key, uses]) => ({ key, uses }));
  }
  function outputRows(state) {
    const t = totals(state);
    if (!t.complete) return [];
    return t.products.map(p => ({ id: p.productId, name: p.name, description: 'CE draft pricing', rows: [],
      calc: { activationPrice: p.once.totalBudget, monthlyPrice: p.monthly.totalBudget,
        activationCost: p.once.costWithReserve + p.once.passThroughAllowance,
        monthlyCost: p.monthly.costWithReserve + p.monthly.passThroughAllowance, complete: true } }));
  }
  return { isCatalog, blockedMessage, validateCatalog, totals, addProduct, removeProduct, requirements, outputRows };
});
