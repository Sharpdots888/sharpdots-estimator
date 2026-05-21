const http = require("http");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const port = process.env.PORT || 3000;
const root = __dirname;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const migrations = [
  // sfpq_projects — estimator fields
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS project_number VARCHAR(20) UNIQUE`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS client_name TEXT DEFAULT ''`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS active_package VARCHAR(255) DEFAULT 'All'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS active_types JSONB DEFAULT '["M","VF","FP","MP"]'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS expanded JSONB DEFAULT '[]'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS lookups JSONB DEFAULT '{}'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS payment_dates JSONB DEFAULT '{}'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS payment_settings JSONB DEFAULT '{}'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS tariff_rate NUMERIC DEFAULT 0.30`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS global_markup NUMERIC DEFAULT 0.40`,
  // sfpq_project_packages — per-estimate package data
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS row_id TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS sfpq_project_packages_row_id_idx ON sfpq_project_packages (row_id) WHERE row_id IS NOT NULL`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS source_order NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS description TEXT`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS needed_qty NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS inventory_qty NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS client_qoh NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS cost NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS markup NUMERIC DEFAULT 0.4`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS margin_adj NUMERIC DEFAULT 0.4`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS prior_ppp NUMERIC DEFAULT 0`,
  // sfpq_package_products — per-estimate product data
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS row_id TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS sfpq_package_products_row_id_idx ON sfpq_package_products (row_id) WHERE row_id IS NOT NULL`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS project_id INTEGER REFERENCES sfpq_projects(id) ON DELETE CASCADE`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS source_order NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS description TEXT`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS type VARCHAR(10)`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS needed_qty NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS inventory_qty NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS client_qoh NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS cost NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS markup NUMERIC DEFAULT 0.4`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS margin_adj NUMERIC DEFAULT 0.4`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS prior_ppp NUMERIC DEFAULT 0`,
  // drop catalog-only unique constraints that block multi-package/multi-project rows
  `ALTER TABLE sfpq_product_elements DROP CONSTRAINT IF EXISTS sfpq_product_elements_product_id_element_id_key`,
  `ALTER TABLE sfpq_package_products DROP CONSTRAINT IF EXISTS sfpq_package_products_package_id_product_id_key`,
  // sfpq_product_elements — per-estimate element data
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS row_id TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS sfpq_product_elements_row_id_idx ON sfpq_product_elements (row_id) WHERE row_id IS NOT NULL`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS project_id INTEGER REFERENCES sfpq_projects(id) ON DELETE CASCADE`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS package_id INTEGER REFERENCES sfpq_packages(id)`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS source_order NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS description TEXT`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS type VARCHAR(10)`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS needed_qty NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS inventory_qty NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS client_qoh NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS cost NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS markup NUMERIC DEFAULT 0.4`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS margin_adj NUMERIC DEFAULT 0.4`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS prior_ppp NUMERIC DEFAULT 0`,
  // sku column on all three per-estimate tables
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS sku VARCHAR(100)`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS sku VARCHAR(100)`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS sku VARCHAR(100)`,
  // sfpq_manufacturers — link to sfvc_companies contact record
  `ALTER TABLE sfpq_manufacturers ADD COLUMN IF NOT EXISTS sfvc_company_id UUID REFERENCES sfvc_companies(company_id)`
];

async function runMigrations() {
  for (const sql of migrations) {
    await pool.query(sql);
  }
  console.log("Migrations complete.");
}

// Find existing catalog entry by name (case-insensitive) or insert a new one
async function findOrCreate(client, table, name, extras = {}) {
  if (!name) name = "Unknown";
  const existing = await client.query(
    `SELECT id FROM ${table} WHERE LOWER(name) = LOWER($1) LIMIT 1`,
    [name]
  );
  if (existing.rows.length) return existing.rows[0].id;
  const cols = ["name", ...Object.keys(extras)];
  const vals = [name, ...Object.values(extras)];
  const placeholders = vals.map((_, i) => `$${i + 1}`).join(", ");
  const result = await client.query(
    `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders}) RETURNING id`,
    vals
  );
  return result.rows[0].id;
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

async function handleGetEstimates(res) {
  const result = await pool.query(
    `SELECT project_number AS "projectNumber",
            name AS "projectName",
            COALESCE(client_name, '') AS "clientName",
            COALESCE(season, '') AS "estimateYear",
            updated_at AS "savedAt"
     FROM sfpq_projects
     WHERE project_number IS NOT NULL
     ORDER BY updated_at DESC`
  );
  sendJson(res, 200, result.rows);
}

async function handleGetClients(res) {
  // Pull from sfvc_companies (full contact DB) rather than the sparse sfpq_customers table
  const result = await pool.query(
    `SELECT COALESCE(display_name, legal_name) AS name
     FROM sfvc_companies
     WHERE status = 'Active'
     ORDER BY COALESCE(display_name, legal_name)`
  );
  sendJson(res, 200, result.rows.map(r => r.name));
}

async function handleInventorySearch(reqUrl, res) {
  const params = new URL(`http://localhost${reqUrl}`).searchParams;
  const q = (params.get("q") || "").trim();
  const clientName = (params.get("client") || "").trim();
  if (q.length < 2) { sendJson(res, 200, []); return; }
  const result = await pool.query(
    `SELECT i.item_id   AS "itemId",
            i.sku,
            i.name,
            COALESCE(s.warehouse_qty, 0) AS "warehouseQty",
            s.year
     FROM sfinv_items i
     LEFT JOIN LATERAL (
       SELECT warehouse_qty, year
       FROM sfinv_stock
       WHERE item_id = i.item_id
       ORDER BY snapshot_date DESC LIMIT 1
     ) s ON true
     LEFT JOIN sfvc_companies c ON c.company_id = i.client_id
     WHERE i.level = 'element'
       AND i.is_active = true
       AND (i.name ILIKE $1 OR i.sku ILIKE $1)
       AND ($2 = '' OR LOWER(COALESCE(c.display_name, c.legal_name)) ILIKE $2)
     ORDER BY i.name
     LIMIT 20`,
    [`%${q}%`, clientName ? `%${clientName.toLowerCase()}%` : ""]
  );
  sendJson(res, 200, result.rows);
}

async function handleGetManufacturers(res) {
  // Return all manufacturers with contact info joined from sfvc_companies / sfvc_people where available
  const result = await pool.query(
    `SELECT m.id, m.name,
            COALESCE(m.contact_name,
                     p.first_name || ' ' || p.last_name) AS contact_name,
            COALESCE(m.email, p.email)   AS email,
            COALESCE(m.phone, p.phone)   AS phone,
            c.company_id                 AS sfvc_company_id,
            c.website
     FROM sfpq_manufacturers m
     LEFT JOIN sfvc_companies c
            ON LOWER(c.legal_name) = LOWER(m.name)
           AND c.status = 'Active'
     LEFT JOIN sfvc_company_people cp
            ON cp.company_id = c.company_id
           AND cp.is_primary = true
     LEFT JOIN sfvc_people p
            ON p.person_id = cp.person_id
     ORDER BY m.name`
  );
  sendJson(res, 200, result.rows);
}

async function handleGetEstimate(key, res) {
  const projectResult = await pool.query(
    `SELECT * FROM sfpq_projects WHERE project_number = $1 OR name = $1 LIMIT 1`,
    [key]
  );
  if (!projectResult.rows.length) {
    sendJson(res, 404, { error: "Not found" });
    return;
  }
  const p = projectResult.rows[0];

  const [pkgRes, prodRes, elRes] = await Promise.all([
    pool.query(
      `SELECT pp.row_id AS id, 'package' AS level, NULL::text AS "parentId",
              pkg.name AS "packageName", '' AS product, '' AS element,
              COALESCE(pp.sku, '') AS sku, pp.description, '' AS type,
              pp.active, pp.source_order AS "sourceOrder",
              pp.needed_qty AS "neededQty", pp.needed_qty AS qty,
              pp.inventory_qty AS "inventoryQty", pp.client_qoh AS "clientQoh",
              pp.cost, pp.markup, pp.margin_adj AS "marginAdj", pp.prior_ppp AS "priorPpp"
       FROM sfpq_project_packages pp
       JOIN sfpq_packages pkg ON pkg.id = pp.package_id
       WHERE pp.project_id = $1 AND pp.row_id IS NOT NULL
       ORDER BY pp.source_order`,
      [p.id]
    ),
    pool.query(
      `SELECT bpp.row_id AS id, 'product' AS level, ppp.row_id AS "parentId",
              pkg.name AS "packageName", pr.name AS product, '' AS element,
              COALESCE(bpp.sku, '') AS sku, bpp.description, bpp.type,
              bpp.active, bpp.source_order AS "sourceOrder",
              bpp.needed_qty AS "neededQty", bpp.needed_qty AS qty,
              bpp.inventory_qty AS "inventoryQty", bpp.client_qoh AS "clientQoh",
              bpp.cost, bpp.markup, bpp.margin_adj AS "marginAdj", bpp.prior_ppp AS "priorPpp"
       FROM sfpq_package_products bpp
       JOIN sfpq_project_packages ppp ON ppp.project_id = bpp.project_id
                                     AND ppp.package_id = bpp.package_id
       JOIN sfpq_packages pkg ON pkg.id = bpp.package_id
       JOIN sfpq_products pr ON pr.id = bpp.product_id
       WHERE bpp.project_id = $1 AND bpp.row_id IS NOT NULL
       ORDER BY bpp.source_order`,
      [p.id]
    ),
    pool.query(
      `SELECT pe.row_id AS id, 'element' AS level, bpp.row_id AS "parentId",
              pkg.name AS "packageName", pr.name AS product, e.name AS element,
              COALESCE(pe.sku, '') AS sku, pe.description, pe.type,
              pe.active, pe.source_order AS "sourceOrder",
              pe.needed_qty AS "neededQty", pe.needed_qty AS qty,
              pe.inventory_qty AS "inventoryQty", pe.client_qoh AS "clientQoh",
              pe.cost, pe.markup, pe.margin_adj AS "marginAdj", pe.prior_ppp AS "priorPpp"
       FROM sfpq_product_elements pe
       JOIN sfpq_package_products bpp ON bpp.project_id = pe.project_id
                                     AND bpp.package_id = pe.package_id
                                     AND bpp.product_id = pe.product_id
       JOIN sfpq_packages pkg ON pkg.id = pe.package_id
       JOIN sfpq_products pr ON pr.id = pe.product_id
       JOIN sfpq_elements e ON e.id = pe.element_id
       WHERE pe.project_id = $1 AND pe.row_id IS NOT NULL
       ORDER BY pe.source_order`,
      [p.id]
    )
  ]);

  sendJson(res, 200, {
    projectNumber: p.project_number,
    projectName: p.name,
    clientName: p.client_name || "",
    estimateYear: p.season || "",
    activePackage: p.active_package || "All",
    activeTypes: p.active_types || ["M", "VF", "FP", "MP"],
    expanded: p.expanded || [],
    lookups: p.lookups || {},
    paymentDates: p.payment_dates || {},
    paymentSettings: p.payment_settings || {},
    rows: [...pkgRes.rows, ...prodRes.rows, ...elRes.rows]
  });
}

async function handlePostEstimate(body, res) {
  const estimate = JSON.parse(body);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const projResult = await client.query(
      `INSERT INTO sfpq_projects
         (project_number, name, client_name, season, status,
          active_package, active_types, expanded, lookups,
          payment_dates, payment_settings, tariff_rate, global_markup, updated_at)
       VALUES ($1,$2,$3,$4,'draft',$5,$6,$7,$8,$9,$10,$11,$12,NOW())
       ON CONFLICT (project_number) DO UPDATE SET
         name              = EXCLUDED.name,
         client_name       = EXCLUDED.client_name,
         season            = EXCLUDED.season,
         active_package    = EXCLUDED.active_package,
         active_types      = EXCLUDED.active_types,
         expanded          = EXCLUDED.expanded,
         lookups           = EXCLUDED.lookups,
         payment_dates     = EXCLUDED.payment_dates,
         payment_settings  = EXCLUDED.payment_settings,
         tariff_rate       = EXCLUDED.tariff_rate,
         global_markup     = EXCLUDED.global_markup,
         updated_at        = NOW()
       RETURNING id`,
      [
        estimate.projectNumber, estimate.projectName, estimate.clientName || "",
        estimate.estimateYear || null,
        estimate.activePackage || "All",
        JSON.stringify(estimate.activeTypes || ["M", "VF", "FP", "MP"]),
        JSON.stringify(estimate.expanded || []),
        JSON.stringify(estimate.lookups || {}),
        JSON.stringify(estimate.paymentDates || {}),
        JSON.stringify(estimate.paymentSettings || {}),
        estimate.tariffRate ?? 0.30,
        estimate.globalMarkup ?? 0.40
      ]
    );
    const projectId = projResult.rows[0].id;

    // Replace all estimate rows in correct dependency order
    await client.query(`DELETE FROM sfpq_product_elements WHERE project_id = $1`, [projectId]);
    await client.query(`DELETE FROM sfpq_package_products WHERE project_id = $1`, [projectId]);
    await client.query(`DELETE FROM sfpq_project_packages WHERE project_id = $1`, [projectId]);

    const packageIds = new Map(); // packageName → sfpq_packages.id
    const productIds = new Map(); // product name → sfpq_products.id

    for (const row of estimate.rows.filter(r => r.level === "package")) {
      const pkgId = await findOrCreate(client, "sfpq_packages", row.packageName, { markup_pct: row.markup || 0 });
      packageIds.set(row.packageName, pkgId);
      await client.query(
        `INSERT INTO sfpq_project_packages
           (project_id, package_id, quantity, row_id, active, source_order, sku, description,
            needed_qty, inventory_qty, client_qoh, cost, markup, margin_adj, prior_ppp)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
        [projectId, pkgId, Math.max(row.neededQty || 0, 1),
         row.id, row.active !== false, row.sourceOrder || 0, row.sku || "", row.description || "",
         row.neededQty || 0, row.inventoryQty || 0, row.clientQoh || 0,
         row.cost || 0, row.markup || 0.4, row.marginAdj || 0.4, row.priorPpp || 0]
      );
    }

    for (const row of estimate.rows.filter(r => r.level === "product")) {
      const prId = await findOrCreate(client, "sfpq_products", row.product || "Product", { markup_pct: row.markup || 0 });
      productIds.set(row.product, prId);
      const pkgId = packageIds.get(row.packageName);
      await client.query(
        `INSERT INTO sfpq_package_products
           (package_id, product_id, quantity, project_id, row_id, active, source_order,
            sku, description, type, needed_qty, inventory_qty, client_qoh,
            cost, markup, margin_adj, prior_ppp)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [pkgId, prId, Math.max(row.neededQty || 0, 1),
         projectId, row.id, row.active !== false, row.sourceOrder || 0,
         row.sku || "", row.description || "", row.type || "",
         row.neededQty || 0, row.inventoryQty || 0, row.clientQoh || 0,
         row.cost || 0, row.markup || 0.4, row.marginAdj || 0.4, row.priorPpp || 0]
      );
    }

    for (const row of estimate.rows.filter(r => r.level === "element")) {
      const elId = await findOrCreate(client, "sfpq_elements",
        row.element || row.description || "Element",
        { base_cost: row.cost || 0, markup_pct: row.markup || 0, cost_year: parseInt(estimate.estimateYear) || 2025 }
      );
      const pkgId = packageIds.get(row.packageName);
      const prId = productIds.get(row.product);
      await client.query(
        `INSERT INTO sfpq_product_elements
           (product_id, element_id, quantity, project_id, package_id, row_id, active, source_order,
            sku, description, type, needed_qty, inventory_qty, client_qoh,
            cost, markup, margin_adj, prior_ppp)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
        [prId, elId, Math.max(row.neededQty || 0, 1),
         projectId, pkgId, row.id, row.active !== false, row.sourceOrder || 0,
         row.sku || "", row.description || "", row.type || "",
         row.neededQty || 0, row.inventoryQty || 0, row.clientQoh || 0,
         row.cost || 0, row.markup || 0.4, row.marginAdj || 0.4, row.priorPpp || 0]
      );
    }

    await client.query("COMMIT");
    sendJson(res, 200, { id: projectId, projectNumber: estimate.projectNumber });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Save error:", err);
    sendJson(res, 500, { error: err.message });
  } finally {
    client.release();
  }
}

function safePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const target = cleanPath === "/" ? "/index.html" : cleanPath;
  const resolved = path.join(root, target);
  return resolved.startsWith(root) ? resolved : path.join(root, "index.html");
}

const server = http.createServer(async (req, res) => {
  const url = (req.url || "/").split("?")[0];
  const method = req.method || "GET";

  try {
    if (url === "/api/estimates" && method === "GET") {
      await handleGetEstimates(res);
    } else if (url === "/api/estimates" && method === "POST") {
      const body = await collectBody(req);
      await handlePostEstimate(body, res);
    } else if (url.startsWith("/api/estimates/") && method === "GET") {
      const key = decodeURIComponent(url.slice("/api/estimates/".length));
      await handleGetEstimate(key, res);
    } else if (url === "/api/clients" && method === "GET") {
      await handleGetClients(res);
    } else if (url === "/api/manufacturers" && method === "GET") {
      await handleGetManufacturers(res);
    } else if (url.startsWith("/api/inventory/search") && method === "GET") {
      await handleInventorySearch(req.url, res);
    } else {
      const filePath = safePath(req.url || "/");
      fs.readFile(filePath, (error, content) => {
        if (error) {
          fs.readFile(path.join(root, "index.html"), (indexError, indexContent) => {
            if (indexError) {
              res.writeHead(500);
              res.end("Estimator unavailable");
              return;
            }
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(indexContent);
          });
          return;
        }
        res.writeHead(200, {
          "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
          "Cache-Control": "no-store"
        });
        res.end(content);
      });
    }
  } catch (err) {
    console.error("Request error:", err);
    if (!res.headersSent) sendJson(res, 500, { error: "Internal server error" });
  }
});

runMigrations()
  .catch(err => console.warn("Schema migrations skipped (already applied or insufficient permissions):", err.message))
  .finally(() => server.listen(port, () => console.log(`Estimator running on port ${port}`)));
