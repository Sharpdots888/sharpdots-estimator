const { Pool } = require("pg");

function isLocalConnection(connectionString) {
  return /@(127\.0\.0\.1|localhost)(:\d+)?\//i.test(connectionString || "");
}

function createPool() {
  const connectionString = String(process.env.SDSP_DATABASE_URL || "").trim();
  if (!connectionString) return null;
  return new Pool({
    connectionString,
    ssl: isLocalConnection(connectionString) ? false : { rejectUnauthorized: false },
    max: 8
  });
}

const pool = createPool();

function requirePool() {
  if (!pool) throw new Error("SDSP_DATABASE_URL is not configured");
  return pool;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function selectTier(tiers, quantity) {
  const sorted = [...tiers].sort((a, b) => a.quantity - b.quantity);
  return sorted.find((tier) => tier.quantity >= quantity) || sorted[sorted.length - 1] || null;
}

function optionalPricing(optional) {
  const tiers = optional.tiers.map((tier) => ({
    quantity: toNumber(tier.quantity_break),
    amount: toNumber(tier.amount),
    displayQuantity: tier.display_quantity || String(tier.quantity_break)
  }));
  return {
    method: optional.pricing_method,
    unitLabel: optional.unit_label,
    tiers
  };
}

function optionalCharge(optional, quantity) {
  const pricing = optionalPricing(optional);
  const tier = selectTier(pricing.tiers, quantity);
  if (!tier || pricing.method === "no_charge") return 0;
  if (pricing.method === "per_unit" || pricing.method === "per_unit_tier") return tier.amount * quantity;
  if (pricing.method === "per_bundle") {
    const bundleSize = Math.max(tier.quantity, 1);
    return Math.ceil(quantity / bundleSize) * tier.amount;
  }
  return tier.amount;
}

async function catalogStatus() {
  if (!pool) return { configured: false, connected: false, message: "SDSP_DATABASE_URL is not configured" };
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM sdsp_products) AS products,
        (SELECT COUNT(*)::int FROM sdsp_configurations) AS configurations,
        (SELECT COUNT(*)::int FROM sdsp_price_tiers) AS price_tiers,
        (SELECT COUNT(*)::int FROM sdsp_optionals) AS optionals,
        (SELECT COUNT(*)::int FROM sdsp_optional_price_tiers) AS optional_price_tiers
    `);
    return { configured: true, connected: true, ...result.rows[0] };
  } catch (error) {
    return { configured: true, connected: false, message: error.message };
  }
}

async function getCatalog({ includeDraft = false } = {}) {
  const db = requirePool();
  const statusFilter = includeDraft ? "<> 'retired'" : "= 'published'";
  const [versionsResult, categoriesResult, productsResult, groupsResult, valuesResult, configurationsResult, tiersResult, configurationValuesResult, optionalsResult, optionalTiersResult, applicabilityResult] = await Promise.all([
    db.query(`SELECT id, version_code, name, status, effective_from, published_at FROM sdsp_catalog_versions WHERE status <> 'retired' ORDER BY id DESC LIMIT 1`),
    db.query(`SELECT id, category_code, name, description, display_order, active FROM sdsp_categories WHERE active = TRUE ORDER BY display_order, name`),
    db.query(`SELECT id, category_id, product_code, name, description, default_markup_percent, price_basis, source_external_id, status FROM sdsp_products WHERE status ${statusFilter} ORDER BY name`),
    db.query(`SELECT id, product_id, group_code, label, display_order FROM sdsp_option_groups ORDER BY product_id, display_order, id`),
    db.query(`SELECT id, option_group_id, value_code, label, source_node_key, display_order, active FROM sdsp_option_values WHERE active = TRUE ORDER BY option_group_id, display_order, id`),
    db.query(`SELECT id, product_id, sku, sku_status, source_price_key, status FROM sdsp_configurations WHERE status ${statusFilter} ORDER BY product_id, sku`),
    db.query(`SELECT id, configuration_id, quantity_break, unit_price, currency, status, effective_from FROM sdsp_price_tiers WHERE status ${statusFilter} ORDER BY configuration_id, quantity_break`),
    db.query(`SELECT cv.configuration_id, ov.option_group_id, ov.value_code FROM sdsp_configuration_values cv JOIN sdsp_option_values ov ON ov.id = cv.option_value_id`),
    db.query(`SELECT id, option_code, name, source_label, description, pricing_method, unit_label, source_price_id, status FROM sdsp_optionals WHERE status ${statusFilter} ORDER BY name`),
    db.query(`SELECT id, optional_id, quantity_break, display_quantity, amount, currency, status FROM sdsp_optional_price_tiers WHERE status ${statusFilter} ORDER BY optional_id, quantity_break`),
    db.query(`SELECT product_id, optional_id, display_order, applicability_status FROM sdsp_product_optionals ORDER BY product_id, display_order`)
  ]);

  const optionValuesByGroup = new Map();
  valuesResult.rows.forEach((row) => {
    if (!optionValuesByGroup.has(row.option_group_id)) optionValuesByGroup.set(row.option_group_id, []);
    optionValuesByGroup.get(row.option_group_id).push({
      id: String(row.id),
      value: row.value_code,
      label: row.label,
      sourceNodeKey: row.source_node_key
    });
  });

  const groupsByProduct = new Map();
  groupsResult.rows.forEach((row) => {
    if (!groupsByProduct.has(row.product_id)) groupsByProduct.set(row.product_id, []);
    groupsByProduct.get(row.product_id).push({
      id: row.group_code,
      label: row.label,
      choices: optionValuesByGroup.get(row.id) || []
    });
  });

  const selectionByConfiguration = new Map();
  const groupCodeById = new Map(groupsResult.rows.map((row) => [row.id, row.group_code]));
  configurationValuesResult.rows.forEach((row) => {
    if (!selectionByConfiguration.has(row.configuration_id)) selectionByConfiguration.set(row.configuration_id, {});
    selectionByConfiguration.get(row.configuration_id)[groupCodeById.get(row.option_group_id)] = row.value_code;
  });

  const tiersByConfiguration = new Map();
  tiersResult.rows.forEach((row) => {
    if (!tiersByConfiguration.has(row.configuration_id)) tiersByConfiguration.set(row.configuration_id, []);
    tiersByConfiguration.get(row.configuration_id).push({
      id: String(row.id),
      quantity: toNumber(row.quantity_break),
      unitPrice: toNumber(row.unit_price),
      currency: row.currency,
      status: row.status
    });
  });

  const configurationsByProduct = new Map();
  configurationsResult.rows.forEach((row) => {
    if (!includeDraft && !tiersByConfiguration.get(row.id)?.length) return;
    if (!configurationsByProduct.has(row.product_id)) configurationsByProduct.set(row.product_id, []);
    configurationsByProduct.get(row.product_id).push({
      id: String(row.id),
      sku: row.sku,
      skuStatus: row.sku_status,
      sourcePriceKey: row.source_price_key,
      status: row.status,
      selections: selectionByConfiguration.get(row.id) || {},
      priceTiers: tiersByConfiguration.get(row.id) || []
    });
  });

  const optionalTiersByOptional = new Map();
  optionalTiersResult.rows.forEach((row) => {
    if (!optionalTiersByOptional.has(row.optional_id)) optionalTiersByOptional.set(row.optional_id, []);
    optionalTiersByOptional.get(row.optional_id).push(row);
  });
  const optionalById = new Map(optionalsResult.rows.map((row) => [row.id, { ...row, tiers: optionalTiersByOptional.get(row.id) || [] }]));
  const optionalsByProduct = new Map();
  applicabilityResult.rows.forEach((row) => {
    const optional = optionalById.get(row.optional_id);
    if (!optional) return;
    if (!optionalsByProduct.has(row.product_id)) optionalsByProduct.set(row.product_id, []);
    const pricing = optionalPricing(optional);
    optionalsByProduct.get(row.product_id).push({
      id: optional.option_code,
      label: optional.name,
      description: optional.description,
      pricingMethod: optional.pricing_method,
      unitLabel: optional.unit_label,
      status: optional.status,
      sourcePriceId: optional.source_price_id,
      applicabilityStatus: row.applicability_status,
      choices: [
        { value: "none", label: `No ${optional.name.toLowerCase()}`, pricing: { type: "flat", amount: 0 } },
        { value: "include", label: `Include ${optional.name}`, pricing: { type: optional.pricing_method, tiers: pricing.tiers } }
      ]
    });
  });

  const productsByCategory = new Map();
  productsResult.rows.forEach((row) => {
    const configurations = configurationsByProduct.get(row.id) || [];
    const quantities = [...new Set(configurations.flatMap((configuration) => configuration.priceTiers.map((tier) => tier.quantity)))].sort((a, b) => a - b);
    if (!productsByCategory.has(row.category_id)) productsByCategory.set(row.category_id, []);
    productsByCategory.get(row.category_id).push({
      id: row.product_code,
      databaseId: String(row.id),
      name: row.name,
      description: row.description,
      defaultMarkup: toNumber(row.default_markup_percent),
      priceBasis: row.price_basis,
      sourceExternalId: row.source_external_id,
      status: row.status,
      pricingSource: "sdsp",
      quantities,
      options: groupsByProduct.get(row.id) || [],
      configurations,
      optionals: optionalsByProduct.get(row.id) || []
    });
  });

  const allOptionals = optionalsResult.rows.map((row) => ({
    id: row.option_code,
    databaseId: String(row.id),
    name: row.name,
    sourceLabel: row.source_label,
    description: row.description,
    pricingMethod: row.pricing_method,
    unitLabel: row.unit_label,
    sourcePriceId: row.source_price_id,
    status: row.status,
    tiers: (optionalTiersByOptional.get(row.id) || []).map((tier) => ({
      id: String(tier.id),
      quantity: toNumber(tier.quantity_break),
      displayQuantity: tier.display_quantity,
      amount: toNumber(tier.amount),
      status: tier.status
    }))
  }));

  return {
    source: "sdsp-local-postgres",
    version: versionsResult.rows[0] || null,
    categories: categoriesResult.rows
      .map((row) => ({
        id: row.category_code,
        databaseId: String(row.id),
        name: row.name,
        description: row.description,
        products: productsByCategory.get(row.id) || []
      }))
      .filter((category) => category.products.length),
    optionals: allOptionals
  };
}

async function calculatePrice(payload) {
  const catalog = await getCatalog();
  const products = catalog.categories.flatMap((category) => category.products);
  const product = products.find((candidate) => candidate.id === payload.productId);
  if (!product) throw Object.assign(new Error("Product not found"), { statusCode: 404 });

  const selections = payload.selections || {};
  const configuration = product.configurations.find((candidate) => (
    product.options.every((option) => candidate.selections[option.id] === selections[option.id])
  ));
  if (!configuration) throw Object.assign(new Error("That product combination is not available"), { statusCode: 422 });

  const quantity = Number(payload.quantity);
  if (!Number.isInteger(quantity) || quantity <= 0) throw Object.assign(new Error("Choose an explicitly priced whole quantity"), { statusCode: 422 });
  const tier = configuration.priceTiers.find((candidate) => candidate.quantity === quantity);
  if (!tier) throw Object.assign(new Error("That quantity is not priced for this configuration"), { statusCode: 422 });

  const selectedOptionCodes = Array.isArray(payload.optionalCodes) ? payload.optionalCodes : [];
  const selectedOptionals = product.optionals.filter((optional) => selectedOptionCodes.includes(optional.id));
  if (selectedOptionCodes.some(code => !selectedOptionals.some(optional => optional.id === code))) throw Object.assign(new Error("That optional service is not available"), { statusCode: 422 });
  const optionalLines = selectedOptionals.map((optional) => {
    const source = {
      pricing_method: optional.pricingMethod,
      unit_label: optional.unitLabel,
      tiers: optional.choices[1].pricing.tiers.map((optionTier) => ({
        quantity_break: optionTier.quantity,
        amount: optionTier.amount,
        display_quantity: optionTier.displayQuantity
      }))
    };
    return { code: optional.id, name: optional.label, amount: optionalCharge(source, quantity) };
  });
  const baseCost = tier.unitPrice * quantity;
  const optionalsTotal = optionalLines.reduce((sum, line) => sum + line.amount, 0);
  const costTotal = baseCost + optionalsTotal;
  const markupPercent = product.priceBasis === 'selling' ? 0 : Math.min(Math.max(toNumber(payload.markupPercent), 0), 200);
  const customerTotal = Math.round((costTotal * (1 + markupPercent / 100) + Number.EPSILON) * 100) / 100;

  return {
    productId: product.id,
    productName: product.name,
    configurationId: configuration.id,
    sku: configuration.sku,
    skuStatus: configuration.skuStatus,
    selections,
    quantity,
    currency: tier.currency,
    priceBasis: product.priceBasis,
    productionUnitCost: tier.unitPrice,
    baseCost,
    optionalLines,
    optionalsTotal,
    costTotal,
    markupPercent,
    customerUnitPrice: customerTotal / quantity,
    customerTotal,
    catalogVersion: catalog.version?.version_code || null,
    source: catalog.source
  };
}

async function updateConfigurationPrices(configurationId, tiers) {
  const db = requirePool();
  const normalized = tiers
    .map((tier) => ({ quantity: Math.round(toNumber(tier.quantity)), unitPrice: toNumber(tier.unitPrice) }))
    .filter((tier) => tier.quantity > 0 && tier.unitPrice >= 0);
  if (!normalized.length) throw Object.assign(new Error("At least one valid price tier is required"), { statusCode: 422 });
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const configuration = await client.query("SELECT id FROM sdsp_configurations WHERE id = $1 FOR UPDATE", [configurationId]);
    if (!configuration.rowCount) throw Object.assign(new Error("Configuration not found"), { statusCode: 404 });
    const quantities = normalized.map((tier) => tier.quantity);
    await client.query("UPDATE sdsp_price_tiers SET status = 'retired', effective_to = NOW(), updated_at = NOW() WHERE configuration_id = $1 AND NOT (quantity_break = ANY($2::int[]))", [configurationId, quantities]);
    for (const tier of normalized) {
      await client.query(`
        INSERT INTO sdsp_price_tiers (configuration_id, quantity_break, unit_price, status, effective_from, effective_to)
        VALUES ($1, $2, $3, 'published', NOW(), NULL)
        ON CONFLICT (configuration_id, quantity_break) DO UPDATE
        SET unit_price = EXCLUDED.unit_price, status = 'published', effective_from = NOW(), effective_to = NULL, updated_at = NOW()
      `, [configurationId, tier.quantity, tier.unitPrice]);
    }
    await client.query("COMMIT");
    return getCatalog({ includeDraft: true });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function updateOptionalPrices(optionalId, tiers) {
  const db = requirePool();
  const normalized = tiers
    .map((tier) => ({
      quantity: Math.max(Math.round(toNumber(tier.quantity)), 0),
      displayQuantity: String(tier.displayQuantity || tier.quantity || ""),
      amount: toNumber(tier.amount)
    }))
    .filter((tier) => tier.amount >= 0);
  if (!normalized.length) throw Object.assign(new Error("At least one valid optional price tier is required"), { statusCode: 422 });
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const optional = await client.query("SELECT id FROM sdsp_optionals WHERE id = $1 FOR UPDATE", [optionalId]);
    if (!optional.rowCount) throw Object.assign(new Error("Optional not found"), { statusCode: 404 });
    const quantities = normalized.map((tier) => tier.quantity);
    await client.query("UPDATE sdsp_optional_price_tiers SET status = 'retired', effective_to = NOW(), updated_at = NOW() WHERE optional_id = $1 AND NOT (quantity_break = ANY($2::int[]))", [optionalId, quantities]);
    for (const tier of normalized) {
      await client.query(`
        INSERT INTO sdsp_optional_price_tiers (optional_id, quantity_break, display_quantity, amount, status, effective_from, effective_to)
        VALUES ($1, $2, $3, $4, 'published', NOW(), NULL)
        ON CONFLICT (optional_id, quantity_break) DO UPDATE
        SET display_quantity = EXCLUDED.display_quantity, amount = EXCLUDED.amount, status = 'published', effective_from = NOW(), effective_to = NULL, updated_at = NOW()
      `, [optionalId, tier.quantity, tier.displayQuantity, tier.amount]);
    }
    await client.query("COMMIT");
    return getCatalog({ includeDraft: true });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  calculatePrice,
  catalogStatus,
  getCatalog,
  updateConfigurationPrices,
  updateOptionalPrices
};
