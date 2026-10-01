// Explicit cross-repo rehearsal. No env files, production URLs, persistent DBs or
// Portal accounts are used. Supply the CE application directory as the sole arg.
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { once } = require('node:events');
const { randomBytes } = require('node:crypto');
const { PGlite } = require('@electric-sql/pglite');
const { sourceFixture } = require('../services/ce-fixture.cjs');
const { createServiceCatalogEndpoint } = require('../lib/service-catalog-endpoint');
const { SOURCE_URL } = require('../lib/ce-catalog-transport');
const { createOpportunityStore } = require('../lib/opportunity-store');
const { createCrmAccess } = require('../lib/crm-access');
const A = require('../services/ce-catalog');

async function main() {
  if (process.argv.length !== 3) throw Error('Usage: node scripts/verify-ce-catalog-connection.cjs /absolute/ce/app');
  const appRoot = path.resolve(process.argv[2]);
  const fromSource = name => import(pathToFileURL(path.join(appRoot, 'server', name)).href);
  const { createAppServer } = await fromSource('index.js');
  const { loadConfig } = await fromSource('config.js');
  const { catalogBaseRevision } = await fromSource('catalog-store.mjs');
  const { readEstimatorCatalog } = await fromSource('estimator-catalog.mjs');
  const key = randomBytes(32).toString('hex');
  const db = new PGlite();
  const dbQueries = [];
  const client = { release() {}, async query(sql, params) {
    dbQueries.push(sql);
    if (sql.startsWith('SELECT') && (sql.includes('ce_catalog') || sql.includes('ce_delivery'))) {
      assert.equal((await db.query('SHOW transaction_read_only')).rows[0].transaction_read_only, 'on');
    }
    return db.query(sql, params);
  } };
  const pool = { deliveryTarget: null, connect: async () => client };
  const config = loadConfig({ NODE_ENV: 'test', PORTAL_D4_ENABLED: 'true', PORTAL_BASE_URL: 'http://127.0.0.1:1', PORTAL_WORKSPACE_SLUG: 'sharpdots',
    CE_DELIVERY_ENABLED: 'true', CE_DELIVERY_LOCAL: '1', CE_CATALOG_ENABLED: 'true', CE_ESTIMATOR_CATALOG_READ_ENABLED: 'true', CE_ESTIMATOR_CATALOG_READ_KEY: key });
  const server = createAppServer({ config, deliveryPool: pool, fetchImpl: () => assert.fail('Portal/provider calls are forbidden in this rehearsal') });
  try {
    await db.exec(`CREATE SCHEMA ce_delivery; CREATE SCHEMA ce_catalog;
      CREATE TABLE ce_delivery.profiles(workspace_id text,workspace_slug text,member_id text,active boolean,PRIMARY KEY(workspace_id,workspace_slug,member_id));
      CREATE TABLE ce_catalog.drafts(workspace_id text,workspace_slug text,version integer,base_revision text,body jsonb,PRIMARY KEY(workspace_id,workspace_slug));
      CREATE TABLE public.users(id integer PRIMARY KEY,username text,is_admin boolean,is_active boolean);
      INSERT INTO ce_delivery.profiles VALUES('3','sharpdots','9001',true),('1','sharpdots','9002',true);
      INSERT INTO public.users VALUES(9001,'synthetic-operator',false,true),(9002,'synthetic-other-workspace',false,true);`);
    let saved = sourceFixture().catalog;
    const save = () => db.query(`INSERT INTO ce_catalog.drafts VALUES('3','sharpdots',$1,$2,$3)
      ON CONFLICT(workspace_id,workspace_slug) DO UPDATE SET version=EXCLUDED.version,body=EXCLUDED.body`, [saved.version, catalogBaseRevision, saved]);
    await save();
    const snapshot = async () => (await db.query('SELECT * FROM ce_catalog.drafts')).rows;
    const before = await snapshot();
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    const base = `http://127.0.0.1:${server.address().port}`;
    let calls = 0;
    const localFetch = async (sourceUrl, options) => {
      assert.equal(sourceUrl, SOURCE_URL); assert.equal(options.redirect, 'error');
      assert.equal(options.headers.Cookie, undefined); calls++;
      const result = await fetch(base + new URL(sourceUrl).pathname, options);
      // Only the injected test transport substitutes the loopback address. The
      // production transport cannot take a URL override or follow a redirect.
      Object.defineProperty(result, 'url', { value: sourceUrl });
      return result;
    };
    const store = createOpportunityStore({ query: (sql, params) => db.query(sql, params) }, createCrmAccess('9001,9002'));
    const makeEndpoint = (connection = { enabled: true, key }) => createServiceCatalogEndpoint({ config: connection, crmEnabled: true, authorizeActor: store.authorizeActor, fetchImpl: localFetch });
    const request = (id = 9001) => ({ method: 'GET', url: new URL('http://estimator.test/api/services/catalog'), session: { user: { id, isAdmin: false } } });
    const read = makeEndpoint();
    const first = await read(request()); assert.equal(first.status, 200);
    assert.equal(first.body.source.revision, 7);
    const pinned = A.selectProducts(first.body, ['service-a']);
    assert.equal(A.calculate(pinned).termPrice, 4125); assert.equal(A.calculate(pinned).publishable, false);
    assert.deepEqual(await snapshot(), before);
    assert.ok(dbQueries.every(sql => !/^(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)/i.test(sql)));
    for (const forbidden of ['knownPeople', 'lastEdited', key]) assert.ok(!JSON.stringify(first).includes(forbidden));
    assert.equal((await read(request(9002))).status, 403);
    await db.exec("UPDATE ce_delivery.profiles SET active=false WHERE member_id='9001'");
    const catalogReads = dbQueries.filter(sql => sql.includes('FROM ce_catalog')).length;
    assert.equal((await read(request())).status, 403);
    assert.equal(dbQueries.filter(sql => sql.includes('FROM ce_catalog')).length, catalogReads);
    await db.exec("UPDATE ce_delivery.profiles SET active=true WHERE member_id='9001'");
    saved.version = 8; saved.products[0].recipe[0].quantity = 3; await save();
    const next = await read(request()); assert.equal(next.status, 200); assert.equal(next.body.source.revision, 8);
    assert.notEqual(A.calculate(A.selectProducts(next.body, ['service-a'])).termPrice, A.calculate(pinned).termPrice);
    assert.equal(pinned.source.revision, 7); assert.equal(A.calculate(pinned).termPrice, 4125);
    saved.version = 9; saved.components[1].cost.nonLaborAllowance = null; await save();
    const unknown = await read(request()); assert.equal(unknown.status, 200);
    assert.equal(A.calculate(A.selectProducts(unknown.body, ['service-a'])).termPrice, null);
    assert.equal((await makeEndpoint({ enabled: true, key: randomBytes(32).toString('hex') })(request())).status, 503);
    const beforeDisable = calls; assert.equal((await makeEndpoint({ enabled: false })(request())).status, 503); assert.equal(calls, beforeDisable);
    await db.exec('UPDATE public.users SET is_active=false WHERE id=9001');
    assert.equal((await read(request())).status, 403); assert.equal(calls, beforeDisable);
    await db.exec('UPDATE public.users SET is_active=true WHERE id=9001');
    await db.exec('DELETE FROM ce_catalog.drafts');
    assert.equal((await read(request())).status, 502);
    assert.equal((await snapshot()).length, 0);
    saved.version = 0; await save(); assert.equal((await read(request())).status, 502);
    saved.version = 10; await save();
    await db.exec("UPDATE ce_catalog.drafts SET base_revision='incompatible'");
    assert.equal((await read(request())).status, 502);
    await db.query('UPDATE ce_catalog.drafts SET base_revision=$1', [catalogBaseRevision]);
    const preFailure = await snapshot();
    let released = false;
    const writeProbe = { deliveryTarget: null, connect: async () => ({
      release() { released = true; }, async query(sql, params) {
        if (sql.includes('FROM ce_catalog.drafts')) await db.query("UPDATE ce_catalog.drafts SET version=999");
        return db.query(sql, params);
      }
    }) };
    await assert.rejects(readEstimatorCatalog(writeProbe, '9001'), /read-only/);
    assert.equal(released, true); assert.deepEqual(await snapshot(), preFailure);
    console.log(JSON.stringify({ result: 'pass', source: 'disposable synthetic database only', sourceContract: first.body.source,
      checks: ['live-source HTTP contract', 'read-only SQL enforced', 'no source mutation or seed fallback', 'current membership and CRM revocation',
        'fixed workspace', 'key revocation', 'fresh saved revisions', 'pinned snapshot isolation', 'unknown costs preserved', 'incompatible revisions denied'],
      productionCalls: 0, sends: 0 }, null, 2));
  } finally {
    if (server.listening) { const closed = once(server, 'close'); server.closeAllConnections(); server.close(); await closed; }
    await db.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
