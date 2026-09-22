const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const { XMLParser } = require("fast-xml-parser");
const { parse: parseCsv } = require("csv-parse/sync");
const { loadLocalEnv } = require("../lib/local-env");

const root = path.resolve(__dirname, "..");
loadLocalEnv(root);

const sourceDirectory = path.join(root, "data", "bootstrap");
const xmlPath = path.join(sourceDirectory, "postcard-65969.xml");
const csvPath = path.join(sourceDirectory, "optional-prices.csv");
const expectedQuantities = [100, 250, 500, 1000, 2500];

function slug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/#/g, "-lb-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function checksum(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function parsePostcardXml(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    textNodeName: "text",
    trimValues: true
  });
  const document = parser.parse(xml);
  const priceRows = Array.isArray(document?.Product?.Prices?.Price)
    ? document.Product.Prices.Price
    : [document?.Product?.Prices?.Price].filter(Boolean);
  const quantities = String(document?.Product?.Fields?.Quantities || "")
    .split(",")
    .map((value) => Number(value.trim()))
    .filter(Number.isFinite);
  const tiersByKey = new Map();
  priceRows.forEach((row) => {
    if (!tiersByKey.has(row.Name)) tiersByKey.set(row.Name, []);
    tiersByKey.get(row.Name).push({ quantity: Number(row.Break), unitPrice: Number(row.UnitPrice) });
  });
  const configurations = [...tiersByKey.entries()]
    .map(([sourcePriceKey, tiers]) => {
      const [prefix, stock, size, printing] = sourcePriceKey.split("_");
      return {
        sourcePriceKey,
        validKey: prefix === "Color" && Boolean(stock && size && printing),
        selections: { stock, size, printing },
        tiers: tiers.sort((a, b) => a.quantity - b.quantity)
      };
    })
    .filter((configuration) => (
      configuration.validKey
      && quantities.every((quantity) => configuration.tiers.some((tier) => tier.quantity === quantity && Number.isFinite(tier.unitPrice)))
    ))
    .sort((a, b) => a.sourcePriceKey.localeCompare(b.sourcePriceKey));
  return { quantities, priceRowCount: priceRows.length, configurations };
}

const optionalOverrides = {
  "12540": { code: "OPT-UV-COATING", method: "flat_tier", unit: "job", status: "published", description: "UV coating priced as a quantity-tiered job charge." },
  "12541": { code: "OPT-ROUND-CORNERS", method: "flat_tier", unit: "job", status: "published", description: "Round-corner finishing priced by the selected product quantity." },
  "12542": { code: "OPT-HARD-PROOF", method: "flat", unit: "proof", status: "published", description: "Physical proof service. Current source price is zero and remains visible for review." },
  "12558": { code: "OPT-NO-CHARGE", method: "no_charge", unit: "job", status: "draft", description: "Source-system no-charge placeholder." },
  "12561": { code: "OPT-MAIL-FULFILLMENT", method: "per_unit_tier", unit: "piece", status: "published", description: "Mail fulfillment using the source per-piece rate for the selected quantity tier." },
  "12562": { code: "OPT-PERFORATION-1", method: "flat", unit: "job", status: "draft", description: "Single perforation service pending source-price review." },
  "12563": { code: "OPT-SCORE", method: "flat_tier", unit: "score", status: "draft", description: "Scoring service priced by score count rather than product quantity; held for review." },
  "12566": { code: "OPT-RIGID-GROMMETS", method: "flat", unit: "job", status: "draft", description: "Rigid-sign grommets pending source-price review." },
  "12569": { code: "OPT-BROCHURE-TABBING", method: "per_unit_tier", unit: "piece", status: "draft", description: "Brochure tabbing using source per-piece quantity tiers." },
  "12571": { code: "OPT-TYPESETTING", method: "hourly", unit: "hour", status: "draft", description: "Typesetting priced by time; held for review because the source break is hours, not product quantity." },
  "13643": { code: "OPT-BUNDLING-100", method: "per_unit_tier", unit: "piece", status: "draft", description: "Bundling in groups of 100 using source quantity tiers." },
  "14175": { code: "OPT-SOFT-TOUCH", method: "flat", unit: "job", status: "draft", description: "Soft-touch lamination pending source-price review." },
  "14178": { code: "OPT-SHRINK-WRAP-50", method: "per_unit_tier", unit: "piece", status: "draft", description: "Shrink wrapping in groups of 50 using source per-piece tiers." },
  "14283": { code: "OPT-GREETING-CARD-SCORE", method: "flat", unit: "job", status: "draft", description: "Greeting-card scoring pending source-price review." },
  "14520": { code: "OPT-POSTAGE", method: "flat", unit: "job", status: "draft", name: "Postage", description: "Postage placeholder; source label is retained and corrected for display." }
};

function parseOptionalCsv(csv) {
  const rows = parseCsv(csv, { columns: true, skip_empty_lines: true, trim: true });
  const groups = new Map();
  rows.forEach((row) => {
    const sourceId = String(row.PriceID);
    if (!groups.has(sourceId)) groups.set(sourceId, []);
    groups.get(sourceId).push({
      quantity: Number(row.Quantity),
      amount: Number(row.Value),
      displayQuantity: row["Display Quantity"]
    });
  });
  return [...groups.entries()].map(([sourceId, tiers]) => {
    const sourceRow = rows.find((row) => String(row.PriceID) === sourceId);
    const override = optionalOverrides[sourceId] || {
      code: `OPT-${sourceId}`,
      method: "flat_tier",
      unit: "job",
      status: "draft",
      description: "Imported optional pending pricing-method review."
    };
    return {
      sourceId,
      sourceLabel: sourceRow["Price Description"],
      name: override.name || sourceRow["Price Description"],
      code: override.code,
      pricingMethod: override.method,
      unitLabel: override.unit,
      status: override.status,
      description: override.description,
      tiers: tiers.sort((a, b) => a.quantity - b.quantity)
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

async function upsertImportBatch(client, versionId, type, name, externalId, sourceChecksum) {
  const result = await client.query(`
    INSERT INTO sdsp_import_batches (catalog_version_id, source_type, source_name, source_external_id, source_checksum, status)
    VALUES ($1, $2, $3, $4, $5, 'started')
    ON CONFLICT (catalog_version_id, source_checksum) DO UPDATE
    SET status = 'started', started_at = NOW(), completed_at = NULL
    RETURNING id
  `, [versionId, type, name, externalId, sourceChecksum]);
  return result.rows[0].id;
}

async function importBootstrap({ xmlBuffer, csvBuffer, connectionString }) {
  const xmlData = parsePostcardXml(xmlBuffer.toString("utf8"));
  const optionalData = parseOptionalCsv(csvBuffer.toString("utf8"));
  if (xmlData.configurations.length !== 50 || xmlData.priceRowCount !== 250) {
    throw new Error(`Postcard source validation failed: ${xmlData.configurations.length} configurations and ${xmlData.priceRowCount} price rows found`);
  }
  if (expectedQuantities.some((quantity) => !xmlData.quantities.includes(quantity))) {
    throw new Error("Postcard source validation failed: expected quantity breaks are missing");
  }

  const pool = new Pool({
    connectionString,
    ssl: /@(127\.0\.0\.1|localhost)(:\d+)?\//i.test(connectionString) ? false : { rejectUnauthorized: false }
  });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const versionResult = await client.query(`
      INSERT INTO sdsp_catalog_versions (version_code, name, status, effective_from, published_at)
      VALUES ('bootstrap-2026-09', 'Initial Sharpdots Standard Products bootstrap', 'published', NOW(), NOW())
      ON CONFLICT (version_code) DO UPDATE SET name = EXCLUDED.name, status = 'published', updated_at = NOW()
      RETURNING id
    `);
    const versionId = versionResult.rows[0].id;
    const xmlBatchId = await upsertImportBatch(client, versionId, "xml", path.basename(xmlPath), "65969", checksum(xmlBuffer));
    const csvBatchId = await upsertImportBatch(client, versionId, "csv", path.basename(csvPath), "optional-price-export", checksum(csvBuffer));

    const categoryResult = await client.query(`
      INSERT INTO sdsp_categories (category_code, name, description, display_order)
      VALUES ('cards', 'Cards', 'Postcards, business cards, and folded cards', 10)
      ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, updated_at = NOW()
      RETURNING id
    `);
    const productResult = await client.query(`
      INSERT INTO sdsp_products (catalog_version_id, category_id, product_code, name, description, default_markup_percent, source_external_id, status)
      VALUES ($1, $2, 'postcard', 'Postcard', 'Commercial postcard printing imported from the current Sharpdots source price grid.', 40, '65969', 'published')
      ON CONFLICT (catalog_version_id, product_code) DO UPDATE
      SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, source_external_id = EXCLUDED.source_external_id, status = 'published', updated_at = NOW()
      RETURNING id
    `, [versionId, categoryResult.rows[0].id]);
    const productId = productResult.rows[0].id;

    const groupDefinitions = [
      { code: "stock", label: "Paper stock", order: 10 },
      { code: "size", label: "Finished size", order: 20 },
      { code: "printing", label: "Printing", order: 30 }
    ];
    const groupIds = new Map();
    for (const group of groupDefinitions) {
      const result = await client.query(`
        INSERT INTO sdsp_option_groups (product_id, group_code, label, display_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (product_id, group_code) DO UPDATE SET label = EXCLUDED.label, display_order = EXCLUDED.display_order
        RETURNING id
      `, [productId, group.code, group.label, group.order]);
      groupIds.set(group.code, result.rows[0].id);
    }

    const optionValueIds = new Map();
    for (const group of groupDefinitions) {
      const labels = [...new Set(xmlData.configurations.map((configuration) => configuration.selections[group.code]))].sort();
      for (let index = 0; index < labels.length; index += 1) {
        const label = labels[index];
        const valueCode = slug(label);
        const result = await client.query(`
          INSERT INTO sdsp_option_values (option_group_id, value_code, label, source_node_key, display_order)
          VALUES ($1, $2, $3, $3, $4)
          ON CONFLICT (option_group_id, value_code) DO UPDATE SET label = EXCLUDED.label, source_node_key = EXCLUDED.source_node_key, display_order = EXCLUDED.display_order, active = TRUE
          RETURNING id
        `, [groupIds.get(group.code), valueCode, label, index + 1]);
        optionValueIds.set(`${group.code}:${label}`, result.rows[0].id);
      }
    }

    for (let index = 0; index < xmlData.configurations.length; index += 1) {
      const configuration = xmlData.configurations[index];
      const existing = await client.query("SELECT id, sku FROM sdsp_configurations WHERE product_id = $1 AND source_price_key = $2", [productId, configuration.sourcePriceKey]);
      const provisionalSku = existing.rows[0]?.sku || `SDSP-PC-${String(index + 1).padStart(6, "0")}`;
      const configurationResult = await client.query(`
        INSERT INTO sdsp_configurations (product_id, sku, sku_status, source_price_key, status)
        VALUES ($1, $2, 'provisional', $3, 'published')
        ON CONFLICT (product_id, source_price_key) DO UPDATE SET status = 'published', updated_at = NOW()
        RETURNING id
      `, [productId, provisionalSku, configuration.sourcePriceKey]);
      const configurationId = configurationResult.rows[0].id;
      await client.query("DELETE FROM sdsp_configuration_values WHERE configuration_id = $1", [configurationId]);
      for (const group of groupDefinitions) {
        await client.query(`
          INSERT INTO sdsp_configuration_values (configuration_id, option_value_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [configurationId, optionValueIds.get(`${group.code}:${configuration.selections[group.code]}`)]);
      }
      for (const tier of configuration.tiers) {
        await client.query(`
          INSERT INTO sdsp_price_tiers (configuration_id, quantity_break, unit_price, status, source_import_batch_id)
          VALUES ($1, $2, $3, 'published', $4)
          ON CONFLICT (configuration_id, quantity_break) DO UPDATE
          SET unit_price = EXCLUDED.unit_price, status = 'published', source_import_batch_id = EXCLUDED.source_import_batch_id, effective_to = NULL, updated_at = NOW()
        `, [configurationId, tier.quantity, tier.unitPrice, xmlBatchId]);
      }
    }

    const publishedPostcardOptionIds = new Set(["12540", "12541", "12542", "12561"]);
    for (let index = 0; index < optionalData.length; index += 1) {
      const optional = optionalData[index];
      const optionalResult = await client.query(`
        INSERT INTO sdsp_optionals (catalog_version_id, option_code, name, source_label, description, pricing_method, unit_label, source_price_id, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (option_code) DO UPDATE
        SET name = EXCLUDED.name, source_label = EXCLUDED.source_label, description = EXCLUDED.description, pricing_method = EXCLUDED.pricing_method, unit_label = EXCLUDED.unit_label, source_price_id = EXCLUDED.source_price_id, status = EXCLUDED.status, updated_at = NOW()
        RETURNING id
      `, [versionId, optional.code, optional.name, optional.sourceLabel, optional.description, optional.pricingMethod, optional.unitLabel, optional.sourceId, optional.status]);
      const optionalId = optionalResult.rows[0].id;
      for (const tier of optional.tiers) {
        await client.query(`
          INSERT INTO sdsp_optional_price_tiers (optional_id, quantity_break, display_quantity, amount, status, source_import_batch_id)
          VALUES ($1, $2, $3, $4, 'published', $5)
          ON CONFLICT (optional_id, quantity_break) DO UPDATE
          SET display_quantity = EXCLUDED.display_quantity, amount = EXCLUDED.amount, status = 'published', source_import_batch_id = EXCLUDED.source_import_batch_id, effective_to = NULL, updated_at = NOW()
        `, [optionalId, tier.quantity, tier.displayQuantity, tier.amount, csvBatchId]);
      }
      if (publishedPostcardOptionIds.has(optional.sourceId)) {
        await client.query(`
          INSERT INTO sdsp_product_optionals (product_id, optional_id, display_order, applicability_status)
          VALUES ($1, $2, $3, 'reviewed')
          ON CONFLICT (product_id, optional_id) DO UPDATE SET display_order = EXCLUDED.display_order, applicability_status = 'reviewed'
        `, [productId, optionalId, index + 1]);
      }
    }

    const xmlReport = { configurations: xmlData.configurations.length, priceTiers: xmlData.priceRowCount, quantities: xmlData.quantities };
    const csvTierCount = optionalData.reduce((sum, optional) => sum + optional.tiers.length, 0);
    const csvReport = { optionals: optionalData.length, priceTiers: csvTierCount, publishedForPostcard: publishedPostcardOptionIds.size };
    await client.query("UPDATE sdsp_import_batches SET status = 'completed', record_count = $2, report = $3::jsonb, completed_at = NOW() WHERE id = $1", [xmlBatchId, xmlData.priceRowCount, JSON.stringify(xmlReport)]);
    await client.query("UPDATE sdsp_import_batches SET status = 'completed', record_count = $2, report = $3::jsonb, completed_at = NOW() WHERE id = $1", [csvBatchId, csvTierCount, JSON.stringify(csvReport)]);
    await client.query("COMMIT");
    return { xml: xmlReport, csv: csvReport };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function main() {
  const connectionString = String(process.env.SDSP_DATABASE_URL || "").trim();
  if (!connectionString) throw new Error("SDSP_DATABASE_URL is not configured");
  const result = await importBootstrap({
    xmlBuffer: fs.readFileSync(xmlPath),
    csvBuffer: fs.readFileSync(csvPath),
    connectionString
  });
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}

module.exports = { importBootstrap, parseOptionalCsv, parsePostcardXml, slug };
