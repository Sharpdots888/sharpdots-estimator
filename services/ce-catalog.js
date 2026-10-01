(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('node:crypto').createHash);
  else root.CeServiceCatalog = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function (createHash) {
const clone = value => JSON.parse(JSON.stringify(value));
const money = value => Math.round((value + Number.EPSILON) * 100) / 100;
const numeric = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1e9;
const id = value => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,149}$/.test(value) && !['constructor', 'prototype'].includes(value);
const assert = (condition, message) => { if (!condition) throw Error(message); };
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
function definition(value) {
  if (Array.isArray(value)) return value.map(definition);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => !['lastEdited', 'knownPeople'].includes(key)).map(([key, item]) => [key, definition(item)]));
}
const mapOf = (rows, label) => {
  assert(Array.isArray(rows) && rows.length <= 2000, `Invalid ${label} collection`);
  const map = new Map();
  for (const row of rows) {
    assert(row && id(row.id) && typeof row.name === 'string' && !map.has(row.id), `Invalid or duplicate ${label} identity`);
    map.set(row.id, row);
  }
  return map;
};
function reference(map, key, label) {
  assert(map.has(key), `Missing ${label}: ${key}`);
  return map.get(key);
}
function numbers(policy) {
  return numeric(policy?.margin) && policy.margin < 1 && numeric(policy.reserve) && policy.reserve <= 1
    && ['once', 'monthly'].every(c => policy.feeOverrides?.[c] === null || numeric(policy.feeOverrides?.[c]));
}
function keyOf(row) { return `${row.componentId}:${row.cadence}`; }

function adaptCatalog(response, expectedWorkspace) {
  assert(expectedWorkspace?.id && expectedWorkspace.slug, 'Expected source workspace is required');
  assert(String(response?.workspace?.id) === String(expectedWorkspace.id) && response.workspace.slug === expectedWorkspace.slug, 'Source workspace mismatch');
  const source = response.catalog;
  assert(source?.schema === 'sharpdots.launch-catalog.v1' && id(source.catalogId), 'Unsupported source catalog');
  assert(source.policy?.currency === 'USD', 'Unsupported catalog currency');
  assert(Number.isSafeInteger(response.version) && response.version > 0 && source.version === response.version, 'Saved catalog revision is missing or inconsistent');
  assert(typeof response.baseRevision === 'string' && response.baseRevision.length > 0, 'Source base revision is required');
  const products = mapOf(source.products, 'product');
  const components = mapOf(source.components, 'component');
  const workflows = mapOf(source.workflows, 'workflow');
  const platforms = mapOf(source.platforms, 'platform');
  const roles = mapOf(source.roles, 'role');
  const adapted = [];
  for (const product of products.values()) {
    if (product.lifecycleStatus === 'decommissioned') continue;
    assert(['under_review', 'active'].includes(product.lifecycleStatus), 'Unknown product lifecycle');
    assert(Array.isArray(product.recipe) && product.recipe.length > 0 && product.recipe.length <= 200, 'Invalid product recipe');
    assert(Number.isInteger(product.termMonths) && product.termMonths >= 1 && product.termMonths <= 120, 'Invalid source term');
    const pricingPolicy = { method: 'ce-contribution-margin-v1', margin: product.targetContributionMargin,
      reserve: product.contingencyRate, roundFeeTo: 25, feeOverrides: clone(product.priceOverrides ?? { once: null, monthly: null }) };
    assert(numbers(pricingPolicy), 'Invalid source pricing policy');
    const usedComponents = new Map(), usedWorkflows = new Map(), usedRoles = new Map(), usedPlatforms = new Map();
    const seen = new Set();
    const recipe = product.recipe.map(row => {
      assert(row && ['once', 'monthly'].includes(row.cadence) && numeric(row.quantity) && !seen.has(keyOf(row)), 'Invalid or duplicate recipe row');
      seen.add(keyOf(row));
      const component = reference(components, row.componentId, 'component');
      const workflow = reference(workflows, component.workflowId, 'workflow');
      assert(component.cost && typeof component.cost.laborHours === 'object' && component.cost.laborHours !== null && !Array.isArray(component.cost.laborHours), 'Missing labor map');
      assert(component.cost.nonLaborAllowance === null || numeric(component.cost.nonLaborAllowance), 'Invalid provider allowance');
      assert(Array.isArray(component.platformIds) && Array.isArray(workflow.platformIds) && Array.isArray(workflow.supportAgentRoleIds), 'Missing resource relationships');
      let labor = 0, known = true;
      const roleIds = new Set([component.ownerRoleId, workflow.ownerRole, ...Object.keys(component.cost.laborHours), ...workflow.supportAgentRoleIds]);
      for (const roleId of roleIds) {
        const role = reference(roles, roleId, 'role');
        assert(role.planningCostPerHour === null || numeric(role.planningCostPerHour), 'Invalid role cost');
        // Named people are not needed for estimation and do not grant assignments.
        usedRoles.set(roleId, definition(role));
      }
      for (const [roleId, hours] of Object.entries(component.cost.laborHours)) {
        assert(numeric(hours), 'Invalid role hours');
        const rate = roles.get(roleId).planningCostPerHour;
        if (rate === null && hours > 0) known = false;
        else labor += (rate ?? 0) * hours;
      }
      for (const platformId of new Set([...component.platformIds, ...workflow.platformIds])) usedPlatforms.set(platformId, definition(reference(platforms, platformId, 'platform')));
      const unitCost = known && component.cost.nonLaborAllowance !== null ? money(labor + component.cost.nonLaborAllowance) : null;
      assert(component.cost.unitCost === unitCost, `Stale calculated component cost: ${component.id}`);
      usedComponents.set(component.id, definition(component));
      usedWorkflows.set(workflow.id, definition(workflow));
      return { ...clone(row), key: keyOf(row), unitCost, passThrough: component.cost.authority === 'pass_through_allowance' };
    });
    assert(Array.isArray(product.map) && Array.isArray(product.workSequence), 'Missing scoped delivery map');
    for (const row of product.map) {
      const component = reference(usedComponents, row.componentId, 'mapped component');
      assert(row.workflowId === component.workflowId, 'Inconsistent scoped workflow');
      for (const platformId of row.platformIds || []) reference(platforms, platformId, 'mapped platform');
      for (const roleId of [row.ownerRoleId, ...(row.supportRoleIds || []), ...(row.proposedAgentSupportRoleIds || [])]) reference(roles, roleId, 'mapped role');
    }
    assert(recipe.every(row => product.map.some(link => link.componentId === row.componentId)), 'Incomplete scoped delivery map');
    for (const step of product.workSequence) {
      const workflow = reference(workflows, step.workflowId, 'sequence workflow');
      usedWorkflows.set(workflow.id, definition(workflow));
      for (const roleId of [step.ownerRoleId, step.reviewRoleId].filter(Boolean)) {
        usedRoles.set(roleId, definition(reference(roles, roleId, 'sequence role')));
      }
    }
    for (const workflow of usedWorkflows.values()) {
      for (const platformId of workflow.platformIds) usedPlatforms.set(platformId, definition(reference(platforms, platformId, 'workflow platform')));
      for (const roleId of [workflow.ownerRole, ...workflow.supportAgentRoleIds]) usedRoles.set(roleId, definition(reference(roles, roleId, 'workflow role')));
    }
    if (product.ownerRoleId) usedRoles.set(product.ownerRoleId, definition(reference(roles, product.ownerRoleId, 'product owner')));
    const snapshot = { id: product.id, name: product.name, sourceStatus: product.lifecycleStatus,
      reviewRequired: true, enabledForSending: false, recipe, pricingPolicy,
      productDefinition: definition(product), components: [...usedComponents.values()], workflows: [...usedWorkflows.values()],
      roles: [...usedRoles.values()], platforms: [...usedPlatforms.values()], policy: clone(source.policy) };
    adapted.push({ ...snapshot, fingerprint: hash(snapshot) });
  }
  assert(adapted.length <= 200, 'Oversized product library');
  const catalog = { schema: 'ce-estimator-catalog-v1', catalogId: source.catalogId,
    source: { system: 'client-engagement', workspace: clone(expectedWorkspace), revision: response.version, baseRevision: response.baseRevision },
    products: adapted };
  return { ...catalog, fingerprint: hash(catalog) };
}

function selectProducts(catalog, productIds) {
  assert(catalog?.schema === 'ce-estimator-catalog-v1', 'Choose an adapted CE catalog');
  assert(Array.isArray(productIds) && productIds.length > 0 && new Set(productIds).size === productIds.length, 'Choose distinct products');
  const selected = productIds.map(id => {
    const p = catalog.products.find(product => product.id === id);
    assert(p, `Unknown product: ${id}`);
    return clone(p);
  });
  return { schema: 'ce-services-configuration-v1', source: clone(catalog.source), catalogId: catalog.catalogId,
    catalogFingerprint: catalog.fingerprint, products: selected, termMonths: selected[0].productDefinition.termMonths,
    termConfirmed: selected.every(p => p.productDefinition.termMonths === selected[0].productDefinition.termMonths),
    rowOverrides: {}, sharedResolutions: {}, pricingOverrides: {} };
}

function configureProduct(configuration, productId, rowKey, changes) {
  const product = configuration.products.find(p => p.id === productId);
  assert(product?.recipe.some(row => row.key === rowKey), 'Unknown recipe row');
  assert(changes && Object.keys(changes).every(k => ['included', 'quantity', 'cadence', 'unitCost'].includes(k)), 'Unsupported row edit');
  if ('included' in changes) assert(typeof changes.included === 'boolean', 'Invalid inclusion');
  if ('quantity' in changes) assert(numeric(changes.quantity), 'Invalid quantity');
  if ('unitCost' in changes) assert(changes.unitCost === null || numeric(changes.unitCost), 'Invalid unit cost');
  if ('cadence' in changes) assert(['once', 'monthly'].includes(changes.cadence), 'Invalid cadence');
  const next = clone(configuration);
  next.rowOverrides[productId] ??= {};
  next.rowOverrides[productId][rowKey] = { ...next.rowOverrides[productId][rowKey], ...clone(changes) };
  return next;
}

function calculate(configuration) {
  assert(configuration?.schema === 'ce-services-configuration-v1' && Array.isArray(configuration.products), 'Invalid configuration snapshot');
  const issues = [], entries = new Map(), capacity = new Map();
  const policyFor = product => ({ ...product.pricingPolicy, ...configuration.pricingOverrides?.[product.id] });
  if (!Number.isInteger(configuration.termMonths) || configuration.termMonths < 1 || configuration.termMonths > 120) issues.push('Term must be 1 to 120 whole months');
  if (configuration.termConfirmed !== true) issues.push('Confirm one engagement term for products with different source terms');
  const buckets = new Map(configuration.products.map(p => [p.id, { productId: p.id, name: p.name, once: { base: 0, pass: 0 }, monthly: { base: 0, pass: 0 } }]));
  for (const product of configuration.products) {
    if (!numbers(policyFor(product))) issues.push(`${product.name}: invalid pricing policy`);
    for (const original of product.recipe) {
      const row = { ...original, ...configuration.rowOverrides?.[product.id]?.[original.key] };
      if (row.included === false || row.quantity === 0) continue;
      if (!numeric(row.quantity) || !(row.unitCost === null || numeric(row.unitCost)) || !['once', 'monthly'].includes(row.cadence)) { issues.push(`${product.name}: invalid component override`); continue; }
      const key = keyOf(row), entry = entries.get(key);
      const component = product.components.find(c => c.id === row.componentId);
      assert(component, 'Snapshot is missing its component definition');
      const item = { ...row, key, component, name: component.name, productId: product.id };
      if (entry) {
        if (entry.uses.some(use => use.productId === product.id)) issues.push(`${product.name}: cadence edit duplicates a component; remove or combine its rows explicitly`);
        entry.uses.push(item);
      }
      else entries.set(key, { key, uses: [item] });
    }
  }
  const lines = [];
  for (const entry of entries.values()) {
    let line = entry.uses[0];
    if (entry.uses.length > 1) {
      const resolution = configuration.sharedResolutions?.[entry.key];
      const defaults = new Set(entry.uses.map(l => JSON.stringify([l.quantity, l.unitCost, l.passThrough, l.configuration, l.component])));
      // Bundles need an explicit cost owner even when defaults agree: fee rounding is per product.
      const owner = entry.uses.find(l => l.productId === resolution?.pricingProductId);
      if (!owner || !numeric(resolution.quantity) || !(resolution.unitCost === null || numeric(resolution.unitCost))) {
        issues.push(`${line.name}: ${defaults.size > 1 ? 'conflicting shared defaults' : 'shared scope'} needs quantity, cost and pricing owner`);
        continue;
      }
      line = { ...owner, quantity: resolution.quantity, unitCost: resolution.unitCost };
    }
    if (line.unitCost === null && line.quantity > 0) issues.push(`${line.name}: unit cost is unknown`);
    const extended = line.unitCost === null ? null : money(line.unitCost * line.quantity);
    buckets.get(line.productId)[line.cadence][line.passThrough ? 'pass' : 'base'] += extended ?? 0;
    lines.push({ ...clone(line), productIds: entry.uses.map(l => l.productId), extendedCost: extended });
    for (const [roleId, hours] of Object.entries(line.component.cost.laborHours)) {
      const role = configuration.products.find(p => p.id === line.productId).roles.find(r => r.id === roleId);
      const value = capacity.get(roleId) || { roleId, name: role.name, onceHours: 0, monthlyHours: 0, availableHours: null, reservedHours: null };
      value[line.cadence === 'once' ? 'onceHours' : 'monthlyHours'] += hours * line.quantity;
      capacity.set(roleId, value);
    }
  }
  const complete = issues.length === 0;
  const products = configuration.products.map(p => {
    const b = buckets.get(p.id), policy = policyFor(p), result = { productId: p.id, name: p.name };
    for (const cadence of ['once', 'monthly']) {
      const s = b[cadence], reserve = money(s.base * policy.reserve), cost = money(s.base + reserve);
      const fee = policy.feeOverrides?.[cadence] ?? (cost ? Math.ceil((cost / (1 - policy.margin) - 1e-9) / 25) * 25 : 0);
      result[cadence] = { baseDeliveryCost: complete ? money(s.base) : null, contingency: complete ? reserve : null,
        costWithReserve: complete ? cost : null, proposedServiceFee: complete ? fee : null,
        passThroughAllowance: complete ? money(s.pass) : null, totalBudget: complete ? money(fee + s.pass) : null };
    }
    return result;
  });
  const sum = (cadence, field) => complete ? money(products.reduce((n, p) => n + p[cadence][field], 0)) : null;
  const once = sum('once', 'totalBudget'), monthly = sum('monthly', 'totalBudget');
  const cost = cadence => complete ? money(sum(cadence, 'costWithReserve') + sum(cadence, 'passThroughAllowance')) : null;
  return { complete, publishable: false, reviewRequired: true, issues, products, lines, capacity: [...capacity.values()],
    activationPrice: once, monthlyPrice: monthly, activationCost: cost('once'), monthlyCost: cost('monthly'),
    termPrice: complete ? money(once + monthly * configuration.termMonths) : null,
    termCost: complete ? money(cost('once') + cost('monthly') * configuration.termMonths) : null };
}

return { adaptCatalog, selectProducts, configureProduct, calculate, keyOf };
});
