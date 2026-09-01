const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createHmac, randomBytes, timingSafeEqual } = require("crypto");
const { Pool } = require("pg");

const port = process.env.PORT || 3000;
const host = process.env.HOST || (process.env.PORT ? "0.0.0.0" : "127.0.0.1");
const root = __dirname;
const portalBaseUrl = (process.env.SPACEFOLD_PORTAL_URL || "https://portal.space-fold.com").replace(/\/+$/, "");
const configuredAuthMode = process.env.ESTIMATOR_AUTH_MODE || "portal-token-preferred";
const authMode = ["disabled", "portal-token-preferred", "portal-token-required"].includes(configuredAuthMode)
  ? configuredAuthMode
  : "portal-token-required";
const sessionCookieName = process.env.ESTIMATOR_SESSION_COOKIE || "sfpq_estimator_session";
const sessionTtlMs = Math.max(Number(process.env.ESTIMATOR_SESSION_TTL_HOURS || 8), 1) * 60 * 60 * 1000;
const sessionSecret = process.env.ESTIMATOR_SESSION_SECRET || process.env.SESSION_SECRET || randomBytes(32).toString("hex");
const secureCookies = process.env.ESTIMATOR_SECURE_COOKIES !== "false";

if (!process.env.ESTIMATOR_SESSION_SECRET && !process.env.SESSION_SECRET) {
  console.warn("Estimator portal SSO is using an ephemeral session secret. Set ESTIMATOR_SESSION_SECRET before production enforcement.");
}

if (authMode !== configuredAuthMode) {
  console.warn(`Unknown ESTIMATOR_AUTH_MODE "${configuredAuthMode}". Falling back to portal-token-required.`);
}

const docusealApiUrl = String(process.env.DOCUSEAL_API_URL || "https://api.docuseal.com").replace(/\/$/, "");
const docusealApiKey = String(process.env.DOCUSEAL_API_KEY || "").trim();
const docusealWebhookSecret = String(process.env.DOCUSEAL_WEBHOOK_SECRET || "").trim();
const docusealSendEnabled = /^(1|true|yes)$/i.test(String(process.env.DOCUSEAL_SEND_ENABLED || ""));
const maxSigningHtmlBytes = 1_500_000;
const maxArtifactBytes = 15_000_000;

// Strip sslmode from connection string — pg Pool's ssl config handles this explicitly
const pool = new Pool({
  connectionString: (process.env.DATABASE_URL || "").replace(/[?&]sslmode=[^&]*/i, "").replace(/[?&]uselibpqcompat=[^&]*/i, "").replace(/[?&]$/, ""),
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

function normalizeEstimateNumber(projectNumber) {
  const match = String(projectNumber || "").trim().match(/^P-(\d{6})$/);
  return match ? `E-${match[1]}` : String(projectNumber || "").trim();
}

function legacyEstimateNumber(projectNumber) {
  const match = String(projectNumber || "").trim().match(/^E-(\d{6})$/);
  return match ? `P-${match[1]}` : String(projectNumber || "").trim();
}

const migrations = [
  // sfpq_projects — estimator fields
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS project_number VARCHAR(20) UNIQUE`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS workspace_number VARCHAR(20)`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS workspace_name TEXT DEFAULT ''`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS estimate_version INTEGER DEFAULT 1`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS client_name TEXT DEFAULT ''`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS active_package VARCHAR(255) DEFAULT 'All'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS active_types JSONB DEFAULT '["M","VF","FP","MP"]'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS expanded JSONB DEFAULT '[]'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS lookups JSONB DEFAULT '{}'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS payment_dates JSONB DEFAULT '{}'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS payment_settings JSONB DEFAULT '{}'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS proposal JSONB DEFAULT '{}'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS sourcing JSONB DEFAULT '{}'`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS tariff_rate NUMERIC DEFAULT 0.30`,
  `ALTER TABLE sfpq_projects ADD COLUMN IF NOT EXISTS global_markup NUMERIC DEFAULT 0.40`,
  // sfpq_project_packages — per-estimate package data
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS row_id TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS sfpq_project_packages_row_id_idx ON sfpq_project_packages (row_id) WHERE row_id IS NOT NULL`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS source_order NUMERIC DEFAULT 0`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS description TEXT`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS source TEXT DEFAULT ''`,
  `ALTER TABLE sfpq_project_packages ADD COLUMN IF NOT EXISTS moq NUMERIC DEFAULT 0`,
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
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS source TEXT DEFAULT ''`,
  `ALTER TABLE sfpq_package_products ADD COLUMN IF NOT EXISTS moq NUMERIC DEFAULT 0`,
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
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS source TEXT DEFAULT ''`,
  `ALTER TABLE sfpq_product_elements ADD COLUMN IF NOT EXISTS moq NUMERIC DEFAULT 0`,
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

const documentMigrations = [
  `CREATE TABLE IF NOT EXISTS sfpq_document_transactions (
    transaction_id UUID PRIMARY KEY,
    workspace_number VARCHAR(20),
    proposal_number VARCHAR(20) NOT NULL,
    proposal_version INTEGER NOT NULL DEFAULT 1,
    provider VARCHAR(30) NOT NULL DEFAULT 'docuseal',
    provider_submission_id VARCHAR(100),
    recipient_name TEXT NOT NULL DEFAULT '',
    recipient_email TEXT NOT NULL,
    document_name TEXT NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'creating',
    email_delivery_requested BOOLEAN NOT NULL DEFAULT FALSE,
    email_delivery_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    proposal_snapshot JSONB NOT NULL DEFAULT '{}',
    provider_payload JSONB NOT NULL DEFAULT '{}',
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS sfpq_document_transactions_provider_submission_idx
    ON sfpq_document_transactions (provider, provider_submission_id)
    WHERE provider_submission_id IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS sfpq_document_transactions_proposal_idx
    ON sfpq_document_transactions (proposal_number, proposal_version, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS sfpq_document_events (
    id BIGSERIAL PRIMARY KEY,
    transaction_id UUID NOT NULL REFERENCES sfpq_document_transactions(transaction_id) ON DELETE CASCADE,
    provider VARCHAR(30) NOT NULL DEFAULT 'docuseal',
    provider_event_key TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_timestamp TIMESTAMPTZ,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_event_key)
  )`,
  `CREATE TABLE IF NOT EXISTS sfpq_document_artifacts (
    id BIGSERIAL PRIMARY KEY,
    transaction_id UUID NOT NULL REFERENCES sfpq_document_transactions(transaction_id) ON DELETE CASCADE,
    provider_artifact_key TEXT NOT NULL,
    artifact_type VARCHAR(30) NOT NULL,
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'application/pdf',
    byte_size INTEGER NOT NULL,
    sha256 CHAR(64) NOT NULL,
    content BYTEA NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (transaction_id, provider_artifact_key)
  )`
];

async function runMigrations() {
  for (const sql of migrations) {
    await pool.query(sql);
  }
  console.log("Migrations complete.");
}

async function runDocumentMigrations() {
  for (const sql of documentMigrations) {
    await pool.query(sql);
  }
  console.log("Document workflow migrations complete.");
}

let schemaColumnsCache = null;

async function tableColumns(client, tableName) {
  if (!schemaColumnsCache) schemaColumnsCache = {};
  if (!schemaColumnsCache[tableName]) {
    const result = await client.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = current_schema()
         AND table_name = $1`,
      [tableName]
    );
    schemaColumnsCache[tableName] = new Set(result.rows.map((row) => row.column_name));
  }
  return schemaColumnsCache[tableName];
}

function optionalSelect(tableAlias, columns, columnName, aliasName, fallbackSql = "''") {
  return columns.has(columnName)
    ? `${tableAlias}.${columnName} AS "${aliasName}"`
    : `${fallbackSql} AS "${aliasName}"`;
}

function insertRowSql(tableName, fields, conflict = "") {
  const columns = fields.map(([column]) => column);
  const values = fields.map(([, value]) => value);
  const placeholders = values.map((_, index) => `$${index + 1}`).join(",");
  return {
    sql: `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})${conflict}`,
    values
  };
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

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function signSessionPayload(encodedPayload) {
  return createHmac("sha256", sessionSecret).update(encodedPayload).digest("base64url");
}

function parseCookies(req) {
  return String(req.headers.cookie || "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((cookies, entry) => {
      const splitAt = entry.indexOf("=");
      if (splitAt === -1) return cookies;
      const key = decodeURIComponent(entry.slice(0, splitAt));
      const value = entry.slice(splitAt + 1);
      cookies[key] = value;
      return cookies;
    }, {});
}

function sanitizePortalUser(user) {
  return {
    id: user?.id ?? null,
    username: String(user?.username || ""),
    email: String(user?.email || ""),
    isAdmin: Boolean(user?.is_admin ?? user?.isAdmin)
  };
}

function createSessionCookie(req, user) {
  const payload = base64UrlEncode(JSON.stringify({
    user: sanitizePortalUser(user),
    issuedAt: Date.now(),
    expiresAt: Date.now() + sessionTtlMs
  }));
  const signature = signSessionPayload(payload);
  const maxAge = Math.floor(sessionTtlMs / 1000);
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "");
  const secure = secureCookies && (forwardedProto.includes("https") || process.env.NODE_ENV === "production");
  return [
    `${sessionCookieName}=${payload}.${signature}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    secure ? "Secure" : ""
  ].filter(Boolean).join("; ");
}

function clearSessionCookie() {
  return `${sessionCookieName}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

function readSession(req) {
  const raw = parseCookies(req)[sessionCookieName];
  if (!raw || !raw.includes(".")) return null;
  const [payload, signature] = raw.split(".");
  const expected = signSessionPayload(payload);
  const signatureBuffer = Buffer.from(signature || "");
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }
  try {
    const session = JSON.parse(base64UrlDecode(payload));
    if (!session.expiresAt || Date.now() > Number(session.expiresAt)) return null;
    return session;
  } catch {
    return null;
  }
}

async function validatePortalToken(token) {
  const response = await fetch(`${portalBaseUrl}/api/auth/validate-token/${encodeURIComponent(token)}`, {
    headers: { Accept: "application/json" }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.valid || !data.user) {
    const message = data.message || `Portal token validation failed with HTTP ${response.status}`;
    throw new Error(message);
  }
  return data.user;
}

function cleanUrlWithoutSsoToken(reqUrl) {
  const parsed = new URL(`http://estimator.local${reqUrl || "/"}`);
  parsed.searchParams.delete("sso_token");
  const query = parsed.searchParams.toString();
  return `${parsed.pathname}${query ? `?${query}` : ""}`;
}

async function handlePortalSso(req, res, token) {
  try {
    const user = await validatePortalToken(token);
    res.writeHead(302, {
      "Set-Cookie": createSessionCookie(req, user),
      "Location": cleanUrlWithoutSsoToken(req.url || "/"),
      "Cache-Control": "no-store"
    });
    res.end();
  } catch (error) {
    console.error("Portal SSO error:", error.message);
    res.writeHead(401, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    });
    res.end(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Estimator access unavailable</title></head>
<body>
  <h1>Estimator access unavailable</h1>
  <p>The portal sign-in link could not be validated. Return to Space-Fold Portal and launch Estimator again.</p>
</body>
</html>`);
  }
}

function authRequiredFor(url) {
  if (authMode === "disabled" || authMode === "portal-token-preferred") return false;
  if (url === "/api/auth/me" || url === "/api/auth/logout" || url === "/favicon.ico") return false;
  return authMode === "portal-token-required";
}

function sendUnauthorized(res) {
  sendJson(res, 401, {
    error: "Authentication required",
    message: "Launch Estimator from Space-Fold Portal to continue."
  });
}

function sendAuthPage(res) {
  res.writeHead(401, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Estimator sign-in required</title></head>
<body>
  <h1>Estimator sign-in required</h1>
  <p>Launch Estimator from Space-Fold Portal to start an internal session.</p>
</body>
</html>`);
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function safeExportFilename(value) {
  const base = String(value || "estimate-export.csv")
    .replace(/[^\w.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return base.toLowerCase().endsWith(".csv") ? base : `${base || "estimate-export"}.csv`;
}

async function handleExportCsv(body, res) {
  const payload = JSON.parse(body || "{}");
  const csv = typeof payload.csv === "string" ? payload.csv : "";
  if (!csv.trim()) {
    sendJson(res, 400, { error: "No CSV content provided" });
    return;
  }
  const downloadsDir = path.join(os.homedir(), "Downloads");
  const filename = safeExportFilename(payload.filename);
  const filePath = path.join(downloadsDir, filename);
  await fs.promises.mkdir(downloadsDir, { recursive: true });
  await fs.promises.writeFile(filePath, csv, "utf8");
  sendJson(res, 200, { filename, path: filePath });
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
  sendJson(res, 200, result.rows.map((row) => ({
    ...row,
    projectNumber: normalizeEstimateNumber(row.projectNumber)
  })));
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
  const priorYear = parseInt(params.get("year") || "") || (new Date().getFullYear() - 1);
  if (q.length < 2) { sendJson(res, 200, []); return; }
  const result = await pool.query(
    `SELECT i.item_id   AS "itemId",
            i.sku,
            i.name,
            COALESCE(s.warehouse_qty, 0) AS "warehouseQty",
            s.year,
            COALESCE(mq.quoted_price, 0) AS "priorPpp"
     FROM sfinv_items i
     LEFT JOIN LATERAL (
       SELECT warehouse_qty, year
       FROM sfinv_stock
       WHERE item_id = i.item_id
       ORDER BY snapshot_date DESC LIMIT 1
     ) s ON true
     LEFT JOIN LATERAL (
       SELECT quoted_price
       FROM sfpq_manufacturer_quotes
       WHERE element_id = i.sfpq_element_id AND year = $3
       ORDER BY is_active DESC, quote_date DESC LIMIT 1
     ) mq ON i.sfpq_element_id IS NOT NULL
     LEFT JOIN sfvc_companies c ON c.company_id = i.client_id
     WHERE i.level IN ('element', 'product')
       AND i.is_active = true
       AND (i.name ILIKE $1 OR i.sku ILIKE $1)
       AND ($2 = '' OR i.client_id IS NULL OR LOWER(COALESCE(c.display_name, c.legal_name)) ILIKE $2)
       AND NOT EXISTS (
         SELECT 1 FROM sfinv_bom b
         JOIN sfinv_items child ON child.item_id = b.component_item_id AND child.is_active = true
         WHERE b.assembly_item_id = i.item_id
       )
     ORDER BY i.name
     LIMIT 20`,
    [`%${q}%`, clientName ? `%${clientName.toLowerCase()}%` : "", priorYear]
  );
  sendJson(res, 200, result.rows);
}

async function handleGetSeed(reqUrl, res) {
  const params = new URL(`http://localhost${reqUrl}`).searchParams;
  const priorYear = parseInt(params.get("year") || "") || (new Date().getFullYear() - 1);

  const result = await pool.query(
    `-- Branch 1: 3-level items (package → product → element)
     SELECT
       pkg.name  AS "packageName",
       pkg.sku   AS "packageSku",
       pr.name   AS product,
       pr.sku    AS "productSku",
       e.name    AS element,
       e.sku,
       'M'       AS type,
       COALESCE(s.warehouse_qty, 0) AS "inventoryQty",
       0         AS "clientQoh",
       0         AS "neededQty",
       0         AS qty,
       0         AS cost,
       0.4       AS markup,
       0.4       AS "marginAdj",
       COALESCE(mq.quoted_price, 0) AS "priorPpp"
     FROM sfinv_items e
     JOIN sfinv_bom bom_ep ON bom_ep.component_item_id = e.item_id
     JOIN sfinv_items pr    ON pr.item_id = bom_ep.assembly_item_id AND pr.level = 'product'
     JOIN sfinv_bom bom_pp  ON bom_pp.component_item_id = pr.item_id
     JOIN sfinv_items pkg   ON pkg.item_id = bom_pp.assembly_item_id AND pkg.level = 'package'
     LEFT JOIN LATERAL (
       SELECT warehouse_qty FROM sfinv_stock
       WHERE item_id = e.item_id ORDER BY snapshot_date DESC LIMIT 1
     ) s ON true
     LEFT JOIN LATERAL (
       SELECT quoted_price FROM sfpq_manufacturer_quotes
       WHERE element_id = e.sfpq_element_id AND year = $1
       ORDER BY is_active DESC, quote_date DESC LIMIT 1
     ) mq ON e.sfpq_element_id IS NOT NULL
     WHERE e.level = 'element' AND e.is_active = true

     UNION ALL

     -- Branch 2: 2-level items (package → product, no element children)
     SELECT
       pkg.name   AS "packageName",
       pkg.sku    AS "packageSku",
       pr.name    AS product,
       pr.sku     AS "productSku",
       NULL::text AS element,
       pr.sku     AS sku,
       'M'        AS type,
       COALESCE(s.warehouse_qty, 0) AS "inventoryQty",
       0          AS "clientQoh",
       0          AS "neededQty",
       0          AS qty,
       0          AS cost,
       0.4        AS markup,
       0.4        AS "marginAdj",
       COALESCE(mq.quoted_price, 0) AS "priorPpp"
     FROM sfinv_items pr
     JOIN sfinv_bom bom_pp ON bom_pp.component_item_id = pr.item_id
     JOIN sfinv_items pkg  ON pkg.item_id = bom_pp.assembly_item_id AND pkg.level = 'package'
     LEFT JOIN LATERAL (
       SELECT warehouse_qty FROM sfinv_stock
       WHERE item_id = pr.item_id ORDER BY snapshot_date DESC LIMIT 1
     ) s ON true
     LEFT JOIN LATERAL (
       SELECT quoted_price FROM sfpq_manufacturer_quotes
       WHERE element_id = pr.sfpq_element_id AND year = $1
       ORDER BY is_active DESC, quote_date DESC LIMIT 1
     ) mq ON pr.sfpq_element_id IS NOT NULL
     WHERE pr.level = 'product' AND pr.is_active = true
       AND NOT EXISTS (
         SELECT 1 FROM sfinv_bom b2
         JOIN sfinv_items child ON child.item_id = b2.component_item_id
           AND child.level = 'element' AND child.is_active = true
         WHERE b2.assembly_item_id = pr.item_id
       )

     ORDER BY "packageName", product, element`,
    [priorYear]
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
  const normalizedKey = normalizeEstimateNumber(key);
  const legacyKey = legacyEstimateNumber(normalizedKey);
  const lookupKeys = Array.from(new Set([normalizedKey, legacyKey]));
  const projectResult = await pool.query(
    `SELECT *
     FROM sfpq_projects
     WHERE project_number = ANY($1::text[]) OR name = $2
     ORDER BY CASE WHEN project_number = $2 THEN 0 ELSE 1 END
     LIMIT 1`,
    [lookupKeys, key]
  );
  if (!projectResult.rows.length) {
    sendJson(res, 404, { error: "Not found" });
    return;
  }
  const p = projectResult.rows[0];
  const [packageColumns, productColumns, elementColumns] = await Promise.all([
    tableColumns(pool, "sfpq_project_packages"),
    tableColumns(pool, "sfpq_package_products"),
    tableColumns(pool, "sfpq_product_elements")
  ]);

  const [pkgRes, prodRes, elRes] = await Promise.all([
    pool.query(
      `SELECT pp.row_id AS id, 'package' AS level, NULL::text AS "parentId",
              pkg.name AS "packageName", '' AS product, '' AS element,
              COALESCE(pp.sku, '') AS sku, pp.description, '' AS type,
              ${optionalSelect("pp", packageColumns, "source", "source")},
              ${optionalSelect("pp", packageColumns, "moq", "moq", "0")},
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
              ${optionalSelect("bpp", productColumns, "source", "source")},
              ${optionalSelect("bpp", productColumns, "moq", "moq", "0")},
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
              ${optionalSelect("pe", elementColumns, "source", "source")},
              ${optionalSelect("pe", elementColumns, "moq", "moq", "0")},
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
    projectNumber: normalizeEstimateNumber(p.project_number),
    projectName: p.name,
    workspaceNumber: p.workspace_number || "",
    workspaceName: p.workspace_name || "",
    estimateVersion: p.estimate_version || 1,
    clientName: p.client_name || "",
    estimateYear: p.season || "",
    activePackage: p.active_package || "All",
    activeTypes: p.active_types || ["M", "VF", "FP", "MP"],
    expanded: p.expanded || [],
    lookups: p.lookups || {},
    paymentDates: p.payment_dates || {},
    paymentSettings: p.payment_settings || {},
    proposal: p.proposal || {},
    sourcing: p.sourcing || {},
    rows: [...pkgRes.rows, ...prodRes.rows, ...elRes.rows]
  });
}

async function handlePostEstimate(body, res) {
  const estimate = JSON.parse(body);
  estimate.projectNumber = normalizeEstimateNumber(estimate.projectNumber);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const legacyProjectNumber = legacyEstimateNumber(estimate.projectNumber);
    if (legacyProjectNumber !== estimate.projectNumber) {
      await client.query(
        `UPDATE sfpq_projects
         SET project_number = $1
         WHERE project_number = $2
           AND NOT EXISTS (SELECT 1 FROM sfpq_projects WHERE project_number = $1)`,
        [estimate.projectNumber, legacyProjectNumber]
      );
    }

    const projectColumns = await tableColumns(client, "sfpq_projects");
    const projectFields = [
      ["project_number", estimate.projectNumber],
      ["name", estimate.projectName],
      ["workspace_number", estimate.workspaceNumber || ""],
      ["workspace_name", estimate.workspaceName || ""],
      ["estimate_version", estimate.estimateVersion || 1],
      ["client_name", estimate.clientName || ""],
      ["season", estimate.estimateYear || null],
      ["status", "draft"],
      ["active_package", estimate.activePackage || "All"],
      ["active_types", JSON.stringify(estimate.activeTypes || ["M", "VF", "FP", "MP"])],
      ["expanded", JSON.stringify(estimate.expanded || [])],
      ["lookups", JSON.stringify(estimate.lookups || {})],
      ["payment_dates", JSON.stringify(estimate.paymentDates || {})],
      ["payment_settings", JSON.stringify(estimate.paymentSettings || {})],
      ["proposal", JSON.stringify(estimate.proposal || {})],
      ["sourcing", JSON.stringify(estimate.sourcing || {})],
      ["tariff_rate", estimate.tariffRate ?? 0.30],
      ["global_markup", estimate.globalMarkup ?? 0.40],
      ["updated_at", new Date()]
    ].filter(([column]) => projectColumns.has(column));

    const projectFieldNames = projectFields.map(([column]) => column);
    const projectValues = projectFields.map(([, value]) => value);
    const projectPlaceholders = projectValues.map((_, index) => `$${index + 1}`).join(",");
    const projectUpdates = projectFieldNames
      .filter((column) => column !== "project_number")
      .map((column) => `${column} = EXCLUDED.${column}`)
      .join(",\n         ");

    const projResult = await client.query(
      `INSERT INTO sfpq_projects
         (${projectFieldNames.join(", ")})
       VALUES (${projectPlaceholders})
       ON CONFLICT (project_number) DO UPDATE SET
         ${projectUpdates}
       RETURNING id`,
      projectValues
    );
    const projectId = projResult.rows[0].id;

    // Replace all estimate rows in correct dependency order
    await client.query(`DELETE FROM sfpq_product_elements WHERE project_id = $1`, [projectId]);
    await client.query(`DELETE FROM sfpq_package_products WHERE project_id = $1`, [projectId]);
    await client.query(`DELETE FROM sfpq_project_packages WHERE project_id = $1`, [projectId]);

    const packageIds = new Map(); // packageName → sfpq_packages.id
    const productIds = new Map(); // product name → sfpq_products.id
    const [packageColumns, productColumns, elementColumns] = await Promise.all([
      tableColumns(client, "sfpq_project_packages"),
      tableColumns(client, "sfpq_package_products"),
      tableColumns(client, "sfpq_product_elements")
    ]);

    for (const row of estimate.rows.filter(r => r.level === "package")) {
      const pkgId = await findOrCreate(client, "sfpq_packages", row.packageName, { markup_pct: row.markup || 0 });
      packageIds.set(row.packageName, pkgId);
      const fields = [
        ["project_id", projectId], ["package_id", pkgId], ["quantity", Math.max(row.neededQty || 0, 1)],
        ["row_id", row.id], ["active", row.active !== false], ["source_order", row.sourceOrder || 0],
        ["sku", row.sku || ""], ["description", row.description || ""],
        ["source", row.source || ""], ["moq", row.moq || 0],
        ["needed_qty", row.neededQty || 0], ["inventory_qty", row.inventoryQty || 0], ["client_qoh", row.clientQoh || 0],
        ["cost", row.cost || 0], ["markup", row.markup || 0.4], ["margin_adj", row.marginAdj || 0.4], ["prior_ppp", row.priorPpp || 0]
      ].filter(([column]) => packageColumns.has(column));
      const insert = insertRowSql("sfpq_project_packages", fields);
      await client.query(insert.sql, insert.values);
    }

    for (const row of estimate.rows.filter(r => r.level === "product")) {
      const prId = await findOrCreate(client, "sfpq_products", row.product || "Product", { markup_pct: row.markup || 0 });
      productIds.set(row.product, prId);
      const pkgId = packageIds.get(row.packageName);
      const fields = [
        ["package_id", pkgId], ["product_id", prId], ["quantity", Math.max(row.neededQty || 0, 1)],
        ["project_id", projectId], ["row_id", row.id], ["active", row.active !== false], ["source_order", row.sourceOrder || 0],
        ["sku", row.sku || ""], ["description", row.description || ""], ["type", row.type || ""],
        ["source", row.source || ""], ["moq", row.moq || 0],
        ["needed_qty", row.neededQty || 0], ["inventory_qty", row.inventoryQty || 0], ["client_qoh", row.clientQoh || 0],
        ["cost", row.cost || 0], ["markup", row.markup || 0.4], ["margin_adj", row.marginAdj || 0.4], ["prior_ppp", row.priorPpp || 0]
      ].filter(([column]) => productColumns.has(column));
      const insert = insertRowSql("sfpq_package_products", fields);
      await client.query(insert.sql, insert.values);
    }

    for (const row of estimate.rows.filter(r => r.level === "element")) {
      const elId = await findOrCreate(client, "sfpq_elements",
        row.element || row.description || "Element",
        { base_cost: row.cost || 0, markup_pct: row.markup || 0, cost_year: parseInt(estimate.estimateYear) || 2025 }
      );
      const pkgId = packageIds.get(row.packageName);
      const prId = productIds.get(row.product);
      const fields = [
        ["product_id", prId], ["element_id", elId], ["quantity", Math.max(row.neededQty || 0, 1)],
        ["project_id", projectId], ["package_id", pkgId], ["row_id", row.id], ["active", row.active !== false], ["source_order", row.sourceOrder || 0],
        ["sku", row.sku || ""], ["description", row.description || ""], ["type", row.type || ""],
        ["source", row.source || ""], ["moq", row.moq || 0],
        ["needed_qty", row.neededQty || 0], ["inventory_qty", row.inventoryQty || 0], ["client_qoh", row.clientQoh || 0],
        ["cost", row.cost || 0], ["markup", row.markup || 0.4], ["margin_adj", row.marginAdj || 0.4], ["prior_ppp", row.priorPpp || 0]
      ].filter(([column]) => elementColumns.has(column));
      const insert = insertRowSql("sfpq_product_elements", fields);
      await client.query(insert.sql, insert.values);
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

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function validRecordNumber(value, prefix) {
  return new RegExp(`^${prefix}-\\d{6}$`).test(String(value || "").trim());
}

function publicDocumentTransaction(row) {
  return {
    transactionId: row.transaction_id,
    workspaceNumber: row.workspace_number || "",
    proposalNumber: row.proposal_number,
    proposalVersion: Number(row.proposal_version || 1),
    provider: row.provider,
    providerSubmissionId: row.provider_submission_id || "",
    recipientName: row.recipient_name || "",
    recipientEmail: row.recipient_email,
    documentName: row.document_name,
    status: row.status,
    emailDeliveryRequested: Boolean(row.email_delivery_requested),
    emailDeliveryEnabled: Boolean(row.email_delivery_enabled),
    lastError: row.last_error || "",
    artifactCount: Number(row.artifact_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at
  };
}

async function docusealRequest(apiPath, options = {}) {
  if (!docusealApiKey) throw new Error("DocuSeal is not configured");
  const response = await fetch(`${docusealApiUrl}${apiPath}`, {
    ...options,
    headers: {
      "X-Auth-Token": docusealApiKey,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { message: text };
  }
  if (!response.ok) {
    const detail = payload.error || payload.message || `DocuSeal request failed (${response.status})`;
    throw new Error(String(detail).slice(0, 500));
  }
  return payload;
}

async function handleDocumentSigningStatus(res) {
  let databaseReady = false;
  try {
    const result = await pool.query(`SELECT to_regclass('sfpq_document_transactions') IS NOT NULL AS ready`);
    databaseReady = Boolean(result.rows[0]?.ready);
  } catch {
    databaseReady = false;
  }
  sendJson(res, 200, {
    provider: "docuseal",
    configured: Boolean(docusealApiKey) && databaseReady,
    apiConfigured: Boolean(docusealApiKey),
    databaseReady,
    emailDeliveryEnabled: docusealSendEnabled,
    webhookVerificationConfigured: Boolean(docusealWebhookSecret),
    mode: docusealSendEnabled ? "send" : "prepare-only"
  });
}

async function handleCreateDocumentTransaction(body, res) {
  if (!docusealApiKey) {
    sendJson(res, 503, { error: "DocuSeal is not configured on this server" });
    return;
  }

  const payload = JSON.parse(body || "{}");
  const proposalNumber = String(payload.proposalNumber || "").trim();
  const workspaceNumber = String(payload.workspaceNumber || "").trim();
  const recipientEmail = String(payload.recipientEmail || "").trim().toLowerCase();
  const recipientName = String(payload.recipientName || "").trim().slice(0, 200);
  const documentName = String(payload.documentName || `${proposalNumber} proposal`).trim().slice(0, 200);
  const documentHtml = String(payload.documentHtml || "");
  const proposalVersion = Math.max(1, Math.round(Number(payload.proposalVersion) || 1));
  const emailDeliveryRequested = Boolean(payload.sendEmail);
  const emailDeliveryEnabled = emailDeliveryRequested && docusealSendEnabled;

  if (!validRecordNumber(proposalNumber, "P")) {
    sendJson(res, 400, { error: "A saved proposal number is required" });
    return;
  }
  if (workspaceNumber && !validRecordNumber(workspaceNumber, "W")) {
    sendJson(res, 400, { error: "Workspace number is invalid" });
    return;
  }
  if (!validEmail(recipientEmail)) {
    sendJson(res, 400, { error: "A valid recipient email is required" });
    return;
  }
  if (!documentHtml.includes("<signature-field") || Buffer.byteLength(documentHtml, "utf8") > maxSigningHtmlBytes) {
    sendJson(res, 400, { error: "The frozen proposal document is missing a signature field or is too large" });
    return;
  }
  if (emailDeliveryRequested && !docusealSendEnabled) {
    sendJson(res, 403, { error: "Email delivery is locked on this server; prepare the request without sending" });
    return;
  }

  const transactionId = crypto.randomUUID();
  const snapshot = payload.proposalSnapshot && typeof payload.proposalSnapshot === "object"
    ? payload.proposalSnapshot
    : {};
  await pool.query(
    `INSERT INTO sfpq_document_transactions (
      transaction_id, workspace_number, proposal_number, proposal_version,
      recipient_name, recipient_email, document_name, status,
      email_delivery_requested, email_delivery_enabled, proposal_snapshot
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,'creating',$8,$9,$10::jsonb)`,
    [
      transactionId,
      workspaceNumber || null,
      proposalNumber,
      proposalVersion,
      recipientName,
      recipientEmail,
      documentName,
      emailDeliveryRequested,
      emailDeliveryEnabled,
      JSON.stringify(snapshot)
    ]
  );

  try {
    const submissionPayload = {
      name: documentName,
      send_email: emailDeliveryEnabled,
      order: "preserved",
      documents: [{
        name: documentName.replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 100) || "proposal",
        html: documentHtml,
        size: "Letter"
      }],
      submitters: [{
        role: "Client",
        name: recipientName || undefined,
        email: recipientEmail,
        external_id: transactionId,
        metadata: {
          transactionId,
          workspaceNumber,
          proposalNumber,
          proposalVersion
        }
      }]
    };
    if (payload.messageSubject || payload.messageBody) {
      submissionPayload.message = {
        subject: String(payload.messageSubject || `Please review and sign ${documentName}`).slice(0, 200),
        body: String(payload.messageBody || "Please review and sign this proposal. {{submitter.link}}").slice(0, 4000)
      };
    }

    const providerResult = await docusealRequest("/submissions/html", {
      method: "POST",
      body: JSON.stringify(submissionPayload)
    });
    const submission = Array.isArray(providerResult) ? providerResult[0] || {} : providerResult;
    const submissionId = submission.id || submission.submission_id;
    if (!submissionId) throw new Error("DocuSeal did not return a submission identifier");
    const status = emailDeliveryEnabled ? "sent" : "prepared";
    const result = await pool.query(
      `UPDATE sfpq_document_transactions
       SET provider_submission_id = $2, provider_payload = $3::jsonb, status = $4,
           updated_at = NOW(), last_error = NULL
       WHERE transaction_id = $1
       RETURNING *`,
      [transactionId, String(submissionId), JSON.stringify(submission), status]
    );
    sendJson(res, 201, publicDocumentTransaction(result.rows[0]));
  } catch (error) {
    await pool.query(
      `UPDATE sfpq_document_transactions
       SET status = 'failed', last_error = $2, updated_at = NOW()
       WHERE transaction_id = $1`,
      [transactionId, String(error.message || error).slice(0, 1000)]
    );
    sendJson(res, 502, { error: error.message || "DocuSeal request failed", transactionId });
  }
}

async function handleGetDocumentTransactions(reqUrl, res) {
  const requestUrl = new URL(reqUrl, "http://localhost");
  const proposalNumber = String(requestUrl.searchParams.get("proposalNumber") || "").trim();
  if (!validRecordNumber(proposalNumber, "P")) {
    sendJson(res, 400, { error: "A valid proposal number is required" });
    return;
  }
  const result = await pool.query(
    `SELECT t.*, COUNT(a.id) AS artifact_count
     FROM sfpq_document_transactions t
     LEFT JOIN sfpq_document_artifacts a ON a.transaction_id = t.transaction_id
     WHERE t.proposal_number = $1
     GROUP BY t.transaction_id
     ORDER BY t.created_at DESC
     LIMIT 25`,
    [proposalNumber]
  );
  sendJson(res, 200, result.rows.map(publicDocumentTransaction));
}

function verifyDocusealWebhook(rawBody, signatureHeader) {
  if (!docusealWebhookSecret || !signatureHeader) return false;
  const [timestamp, signature] = String(signatureHeader).split(".", 2);
  if (!timestamp || !signature || !/^\d+$/.test(timestamp) || !/^[a-f0-9]+$/i.test(signature)) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = crypto
    .createHmac("sha256", docusealWebhookSecret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(signature, "utf8"));
}

function docusealWebhookStatus(eventType) {
  return ({
    "form.viewed": "viewed",
    "form.started": "started",
    "form.completed": "partially-signed",
    "form.declined": "declined",
    "submission.created": "prepared",
    "submission.completed": "completed",
    "submission.expired": "expired",
    "submission.archived": "archived"
  })[eventType] || "updated";
}

function trustedDocusealArtifactUrl(rawUrl) {
  try {
    const artifact = new URL(rawUrl);
    const api = new URL(docusealApiUrl);
    if (artifact.protocol !== "https:") return false;
    if (api.hostname === "api.docuseal.com") {
      return artifact.hostname === "docuseal.com" || artifact.hostname.endsWith(".docuseal.com");
    }
    return artifact.host === api.host;
  } catch {
    return false;
  }
}

async function storeDocusealArtifact(transactionId, artifactKey, artifactType, filename, rawUrl) {
  if (!rawUrl || !trustedDocusealArtifactUrl(rawUrl)) return;
  const existing = await pool.query(
    `SELECT 1 FROM sfpq_document_artifacts WHERE transaction_id = $1 AND provider_artifact_key = $2`,
    [transactionId, artifactKey]
  );
  if (existing.rows.length) return;
  const response = await fetch(rawUrl);
  if (!response.ok) throw new Error(`Unable to archive ${artifactType} (${response.status})`);
  const announcedSize = Number(response.headers.get("content-length") || 0);
  if (announcedSize > maxArtifactBytes) throw new Error(`${artifactType} exceeds the artifact size limit`);
  const content = Buffer.from(await response.arrayBuffer());
  if (content.length > maxArtifactBytes) throw new Error(`${artifactType} exceeds the artifact size limit`);
  const sha256 = crypto.createHash("sha256").update(content).digest("hex");
  await pool.query(
    `INSERT INTO sfpq_document_artifacts (
       transaction_id, provider_artifact_key, artifact_type, filename,
       content_type, byte_size, sha256, content
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (transaction_id, provider_artifact_key) DO NOTHING`,
    [
      transactionId,
      artifactKey,
      artifactType,
      filename,
      response.headers.get("content-type") || "application/pdf",
      content.length,
      sha256,
      content
    ]
  );
}

async function archiveCompletedDocusealSubmission(transactionId, submissionId) {
  const submission = await docusealRequest(`/submissions/${encodeURIComponent(submissionId)}`, { method: "GET" });
  const documents = Array.isArray(submission.documents) ? submission.documents : [];
  for (let index = 0; index < documents.length; index += 1) {
    const document = documents[index] || {};
    await storeDocusealArtifact(
      transactionId,
      `document:${index}`,
      "signed-document",
      `${String(document.name || `signed-document-${index + 1}`).replace(/[^a-z0-9_.-]+/gi, "-")}.pdf`,
      document.url
    );
  }
  await storeDocusealArtifact(transactionId, "audit-log", "audit-certificate", "signature-audit-log.pdf", submission.audit_log_url);
}

async function resolveDocusealTransaction(webhookData) {
  const submitters = Array.isArray(webhookData.submitters) ? webhookData.submitters : [];
  const externalId = webhookData.external_id
    || webhookData.metadata?.transactionId
    || submitters.find((submitter) => submitter.external_id)?.external_id
    || submitters.find((submitter) => submitter.metadata?.transactionId)?.metadata?.transactionId;
  if (externalId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(externalId))) {
    const result = await pool.query(
      `SELECT * FROM sfpq_document_transactions WHERE transaction_id = $1`,
      [String(externalId)]
    );
    if (result.rows[0]) return result.rows[0];
  }
  const submissionId = webhookData.submission_id || webhookData.id;
  if (!submissionId) return null;
  const result = await pool.query(
    `SELECT * FROM sfpq_document_transactions
     WHERE provider = 'docuseal' AND provider_submission_id = $1`,
    [String(submissionId)]
  );
  return result.rows[0] || null;
}

async function handleDocusealWebhook(rawBody, req, res) {
  if (!verifyDocusealWebhook(rawBody, req.headers["x-docuseal-signature"])) {
    sendJson(res, 401, { error: "Invalid webhook signature" });
    return;
  }
  const payload = JSON.parse(rawBody || "{}");
  const eventType = String(payload.event_type || "unknown");
  const webhookData = payload.data && typeof payload.data === "object" ? payload.data : {};
  const transaction = await resolveDocusealTransaction(webhookData);
  if (!transaction) {
    sendJson(res, 202, { accepted: true, matched: false });
    return;
  }
  const submissionId = webhookData.submission_id || webhookData.id || transaction.provider_submission_id;
  if (eventType === "submission.completed" && submissionId) {
    await archiveCompletedDocusealSubmission(transaction.transaction_id, String(submissionId));
  }
  const providerEventKey = crypto.createHash("sha256").update(rawBody).digest("hex");
  await pool.query(
    `INSERT INTO sfpq_document_events (
       transaction_id, provider_event_key, event_type, event_timestamp, verified, payload
     ) VALUES ($1,$2,$3,$4,TRUE,$5::jsonb)
     ON CONFLICT (provider, provider_event_key) DO NOTHING`,
    [
      transaction.transaction_id,
      providerEventKey,
      eventType,
      payload.timestamp || webhookData.event_timestamp || null,
      JSON.stringify(payload)
    ]
  );
  const status = docusealWebhookStatus(eventType);
  await pool.query(
    `UPDATE sfpq_document_transactions
     SET status = $2, updated_at = NOW(),
         completed_at = CASE WHEN $2 = 'completed' THEN COALESCE(completed_at, NOW()) ELSE completed_at END,
         provider_payload = provider_payload || $3::jsonb
     WHERE transaction_id = $1`,
    [transaction.transaction_id, status, JSON.stringify({ lastWebhook: payload })]
  );
  sendJson(res, 200, { accepted: true, matched: true });
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
  const reqUrl = new URL(`http://estimator.local${req.url || "/"}`);
  const ssoToken = reqUrl.searchParams.get("sso_token");
  const session = readSession(req);

  try {
    if (ssoToken) {
      await handlePortalSso(req, res, ssoToken);
    } else if (url === "/api/auth/me" && method === "GET") {
      if (!session) {
        sendJson(res, 401, { authenticated: false });
      } else {
        sendJson(res, 200, {
          authenticated: true,
          user: session.user,
          authMode
        });
      }
    } else if (url === "/api/auth/logout" && (method === "GET" || method === "POST")) {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Set-Cookie": clearSessionCookie(),
        "Cache-Control": "no-store"
      });
      res.end(JSON.stringify({ success: true }));
    } else if (url.startsWith("/api/") && authRequiredFor(url) && !session) {
      sendUnauthorized(res);
    } else if (authRequiredFor(url) && !session) {
      sendAuthPage(res);
    } else if (url === "/api/estimates" && method === "GET") {
      await handleGetEstimates(res);
    } else if (url === "/api/estimates" && method === "POST") {
      const body = await collectBody(req);
      await handlePostEstimate(body, res);
    } else if (url === "/api/export-csv" && method === "POST") {
      const body = await collectBody(req);
      await handleExportCsv(body, res);
    } else if (url.startsWith("/api/estimates/") && method === "GET") {
      const key = decodeURIComponent(url.slice("/api/estimates/".length));
      await handleGetEstimate(key, res);
    } else if (url === "/api/seed" && method === "GET") {
      await handleGetSeed(req.url, res);
    } else if (url === "/api/clients" && method === "GET") {
      await handleGetClients(res);
    } else if (url === "/api/manufacturers" && method === "GET") {
      await handleGetManufacturers(res);
    } else if (url.startsWith("/api/inventory/search") && method === "GET") {
      await handleInventorySearch(req.url, res);
    } else if (url === "/api/document-signing/status" && method === "GET") {
      await handleDocumentSigningStatus(res);
    } else if (url === "/api/document-transactions" && method === "GET") {
      await handleGetDocumentTransactions(req.url, res);
    } else if (url === "/api/document-transactions" && method === "POST") {
      const body = await collectBody(req);
      await handleCreateDocumentTransaction(body, res);
    } else if (url === "/api/webhooks/docuseal" && method === "POST") {
      const body = await collectBody(req);
      await handleDocusealWebhook(body, req, res);
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
  .then(() => runDocumentMigrations())
  .catch(err => console.warn("Document workflow migrations skipped (already applied or insufficient permissions):", err.message))
  .finally(() => server.listen(port, host, () => console.log(`Estimator running on http://${host}:${port}`)));
