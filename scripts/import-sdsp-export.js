const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { parse } = require('csv-parse/sync');
const { Pool } = require('pg');
const { loadLocalEnv } = require('../lib/local-env');
const root = path.resolve(__dirname, '..');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function main() {
  const directory = path.resolve(process.argv[2] || '.');
  const read = file => fs.readFileSync(path.join(directory, file), 'utf8');
  const manifest = JSON.parse(read('manifest.json'));
  for (const file of manifest.files) {
    const buffer = fs.readFileSync(path.join(directory, file.relative_path));
    if (buffer.length !== file.byte_size || hash(buffer) !== file.sha256) throw new Error(`Manifest mismatch: ${file.relative_path}`);
  }
  const products = parse(read('products.csv'), { columns: true, bom: true, skip_empty_lines: true }).map(row => ({
    row, product: JSON.parse(read(`${row.product_folder}/product.json`)),
    configurations: JSON.parse(read(`${row.product_folder}/configurations.json`)),
    tiers: parse(read(`${row.product_folder}/price-tiers.csv`), { columns: true, bom: true, skip_empty_lines: true })
  }));
  const report = { batch: manifest.batch_id, currency: 'USD', priceBasis: 'selling', exactQuantitiesOnly: true, optionsDeferred: true, products: products.length, activeProducts: 0, configurations: 0, importedTiers: 0, publishedTiers: 0, heldTiers: [], excludedTiers: [] };
  for (const item of products) {
    if (item.product.active_status === 'active') report.activeProducts++;
    report.configurations += item.configurations.length;
    const keys = new Set(item.configurations.map(c => c.configuration_key));
    const seen = new Set();
    for (const tier of item.tiers) {
      if (!keys.has(tier.configuration_key)) throw new Error('Unknown configuration');
      const key = `${tier.configuration_key}:${tier.quantity}`;
      if (seen.has(key)) throw new Error(`Duplicate tier ${key}`);
      seen.add(key);
      if (!Number.isInteger(Number(tier.quantity)) || Number(tier.quantity) <= 0 || !Number.isFinite(Number(tier.unit_price)) || Number(tier.unit_price) < 0) {
        if (tier.source_product_id !== '65967' || tier.quantity !== '0') throw new Error(`Unexpected invalid tier ${key}`);
        report.excludedTiers.push(tier);
        continue;
      }
      report.importedTiers++;
      if (tier.review_notes) report.heldTiers.push(tier);
      if (!tier.review_notes && item.product.active_status === 'active') report.publishedTiers++;
    }
  }
  if (!process.argv.includes('--apply')) { console.log(JSON.stringify(report, null, 2)); return; }
  loadLocalEnv(root);
  const url = new URL(process.env.SDSP_DATABASE_URL);
  const isLocalTarget = ['localhost', '127.0.0.1'].includes(url.hostname) && url.pathname === '/sharpdots_estimator_local';
  const productionRequested = process.argv.includes('--apply-production');
  const productionConfirmed = process.env.SDSP_PRODUCTION_IMPORT_CONFIRM === manifest.batch_id;
  if (!isLocalTarget && (!productionRequested || !productionConfirmed)) {
    throw new Error(`Production import requires --apply-production and SDSP_PRODUCTION_IMPORT_CONFIRM=${manifest.batch_id}`);
  }
  const configuredBackupDir = isLocalTarget
    ? path.join(process.env.SDSP_PG_DATA, '..', 'sdsp-backups')
    : process.env.SDSP_BACKUP_DIR;
  if (!configuredBackupDir) throw new Error('SDSP_BACKUP_DIR is required for a production import');
  const backupDir = path.resolve(configuredBackupDir);
  fs.mkdirSync(backupDir, { recursive: true });
  const backup = path.join(backupDir, `before-export-${Date.now()}.dump`);
  const backupArgs = ['-Fc', '-f', backup];
  if (!isLocalTarget) backupArgs.push('--table=public.sdsp_*');
  execFileSync(path.join(process.env.SDSP_PG_BIN, 'pg_dump.exe'), backupArgs, { env: { ...process.env, PGHOST: url.hostname, PGPORT: url.port, PGUSER: decodeURIComponent(url.username), PGPASSWORD: decodeURIComponent(url.password), PGDATABASE: url.pathname.slice(1), PGSSLMODE: isLocalTarget ? 'disable' : 'require' }, windowsHide: true });
  const pool = new Pool({ connectionString: url.href, ssl: isLocalTarget ? false : { rejectUnauthorized: false } });
  const db = await pool.connect();
  const id = async (sql, args) => (await db.query(sql, args)).rows[0].id;
  try {
    await db.query('BEGIN');
    await db.query("SELECT pg_advisory_xact_lock(277265969)");
    await db.query(fs.readFileSync(path.join(root, 'db/sdsp/002_selling_prices.sql'), 'utf8'));
    const checksum = hash(read('manifest.json'));
    const prior = await db.query("SELECT id FROM sdsp_import_batches WHERE source_checksum=$1 AND status='completed'", [checksum]);
    if (prior.rowCount) { await db.query('ROLLBACK'); console.log('Already imported; no changes.'); return; }
    const version = await id("INSERT INTO sdsp_catalog_versions(version_code,name,status,published_at) VALUES($1,$2,'published',NOW()) RETURNING id", [`epower-${manifest.batch_id}`, 'Approved USD selling prices']);
    const batch = await id("INSERT INTO sdsp_import_batches(catalog_version_id,source_type,source_name,source_checksum,report) VALUES($1,'csv',$2,$3,$4) RETURNING id", [version, directory, checksum, JSON.stringify(report)]);
    for (const { row, product, configurations, tiers } of products) {
      const category = product.categories[0];
      const cat = await id("INSERT INTO sdsp_categories(category_code,name,description) VALUES($1,$2,$3) ON CONFLICT(category_code) DO UPDATE SET name=EXCLUDED.name RETURNING id", [slug(category.source_category_id), category.source_category_name, category.source_category_path]);
      const existing = await db.query('SELECT id FROM sdsp_products WHERE source_external_id=$1', [row.source_product_id]);
      if (existing.rowCount > 1) throw new Error('Ambiguous existing product');
      const status = product.active_status === 'active' ? 'published' : 'draft';
      const productId = existing.rows[0]?.id || await id("INSERT INTO sdsp_products(catalog_version_id,category_id,product_code,name,source_external_id) VALUES($1,$2,$3,$4,$5) RETURNING id", [version, cat, `epower-${row.source_product_id}`, product.product_name, row.source_product_id]);
      await db.query("UPDATE sdsp_products SET catalog_version_id=$2,category_id=$3,name=$4,description='',status=$5,default_markup_percent=0,price_basis='selling',source_metadata=$6 WHERE id=$1", [productId, version, cat, product.product_name, status, JSON.stringify(product)]);
      await db.query("UPDATE sdsp_configurations SET status='retired' WHERE product_id=$1", [productId]);
      for (const configuration of configurations) {
        const configId = await id("INSERT INTO sdsp_configurations(product_id,sku,source_price_key,status) VALUES($1,$2,$3,$4) ON CONFLICT(product_id,source_price_key) DO UPDATE SET status=EXCLUDED.status RETURNING id", [productId, `SDSP-${row.source_product_id}-${hash(configuration.configuration_key).slice(0,12).toUpperCase()}`, configuration.source_price_key, status]);
        await db.query('DELETE FROM sdsp_configuration_values WHERE configuration_id=$1', [configId]);
        for (const [order, selection] of configuration.selections.entries()) {
          const code = selection.option_name === 'Color' ? 'printing' : slug(selection.option_name);
          const group = await id('INSERT INTO sdsp_option_groups(product_id,group_code,label,display_order) VALUES($1,$2,$3,$4) ON CONFLICT(product_id,group_code) DO UPDATE SET label=EXCLUDED.label,display_order=EXCLUDED.display_order RETURNING id', [productId, code, selection.option_name, order]);
          const value = await id('INSERT INTO sdsp_option_values(option_group_id,value_code,label,source_node_key) VALUES($1,$2,$3,$4) ON CONFLICT(option_group_id,value_code) DO UPDATE SET active=TRUE RETURNING id', [group, hash(selection.selected_value_label).slice(0,20), selection.selected_value_label, selection.selected_value_id]);
          await db.query('INSERT INTO sdsp_configuration_values VALUES($1,$2)', [configId, value]);
        }
        await db.query("UPDATE sdsp_price_tiers SET status='retired' WHERE configuration_id=$1", [configId]);
        for (const tier of tiers.filter(t => t.configuration_key === configuration.configuration_key && Number(t.quantity) > 0 && Number.isFinite(Number(t.unit_price)))) {
          await db.query("INSERT INTO sdsp_price_tiers(configuration_id,quantity_break,unit_price,currency,status,source_import_batch_id,source_metadata) VALUES($1,$2,$3,'USD',$4,$5,$6) ON CONFLICT(configuration_id,quantity_break) DO UPDATE SET unit_price=EXCLUDED.unit_price,currency='USD',status=EXCLUDED.status,source_import_batch_id=EXCLUDED.source_import_batch_id,source_metadata=EXCLUDED.source_metadata,effective_to=NULL", [configId, tier.quantity, tier.unit_price, tier.review_notes ? 'draft' : status, batch, JSON.stringify(tier)]);
        }
      }
    }
    await db.query("UPDATE sdsp_optionals SET status='draft' WHERE status='published'");
    await db.query("UPDATE sdsp_import_batches SET status='completed',record_count=$2,completed_at=NOW() WHERE id=$1", [batch, report.importedTiers]);
    await db.query('COMMIT');
    console.log(JSON.stringify({ ...report, backup }, null, 2));
  } catch (error) { await db.query('ROLLBACK'); throw error; }
  finally { db.release(); await pool.end(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
