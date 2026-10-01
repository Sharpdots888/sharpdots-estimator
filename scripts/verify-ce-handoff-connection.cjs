// Paired local rehearsal only: real handlers, synthetic Portal, disposable SQL.
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { once } = require('node:events');
const { randomBytes, randomUUID } = require('node:crypto');
const { PGlite } = require('@electric-sql/pglite');
const { createOpportunityStore } = require('../lib/opportunity-store');
const { createHandoffTransport, INTAKE_URL } = require('../lib/ce-handoff-transport');
const { digest } = require('../lib/ce-handoff');
const adapter = require('../services/ce-catalog');
const M = require('../crm/model');

async function main() {
  if (process.argv.length !== 3) throw Error('Usage: node scripts/verify-ce-handoff-connection.cjs /absolute/ce/app');
  const appRoot = path.resolve(process.argv[2]);
  const source = file => import(pathToFileURL(path.join(appRoot, file)).href);
  const { createAppServer } = await source('server/index.js');
  const { loadConfig } = await source('server/config.js');
  const { startPortal } = await source('test/support/portal.mjs');
  const estimatorDb = new PGlite(), ceDb = new PGlite();
  const query = async (sql, values) => {
    const r = await estimatorDb.query(sql, values);
    return { ...r, rowCount: r.rows.length || r.affectedRows || 0 };
  };
  const estimatorClient = { query, release() {} };
  const ceClient = { query: (sql, values) => ceDb.query(sql, values), release() {} };
  const cePool = { deliveryTarget: null, ...ceClient, connect: async () => ceClient };
  let portal, server;
  try {
    await estimatorDb.exec(`CREATE ROLE db_admin;
      CREATE TABLE users(id integer PRIMARY KEY,username text,is_admin boolean,is_active boolean);
      INSERT INTO users VALUES(9001,'Synthetic sender',true,true),(9002,'Synthetic owner',true,true),(9003,'Synthetic retry lead',true,true);
      CREATE TABLE sfvc_companies(company_id uuid PRIMARY KEY);CREATE TABLE sfvc_people(person_id uuid PRIMARY KEY);
      CREATE TABLE sfvc_company_people(company_id uuid,person_id uuid);`);
    for (const name of ['001_sfpq_opportunities.sql', '002_opportunity_persistence.sql']) {
      await estimatorDb.exec(readFileSync(path.join(__dirname, '../migrations', name), 'utf8'));
    }
    await ceDb.exec(readFileSync(path.join(appRoot, 'db/schema.sql'), 'utf8'));
    for (const id of [9001, 9002, 9003]) {
      await ceDb.query("INSERT INTO ce_delivery.profiles VALUES('3','sharpdots',$1,$2,'lead',true)", [String(id), 'Synthetic lead ' + id]);
    }
    const accountRef = randomUUID(), contactRef = randomUUID();
    await query('INSERT INTO sfvc_companies VALUES($1)', [accountRef]);
    await query('INSERT INTO sfvc_people VALUES($1)', [contactRef]);
    await query('INSERT INTO sfvc_company_people VALUES($1,$2)', [accountRef, contactRef]);
    portal = await startPortal();
    const key = randomBytes(32).toString('hex');
    const config = loadConfig({ NODE_ENV: 'test', PORTAL_D4_ENABLED: 'true', PORTAL_BASE_URL: portal.url,
      PORTAL_WORKSPACE_SLUGS: 'sharpdots', CE_DELIVERY_ENABLED: 'true', CE_DELIVERY_LOCAL: '1',
      CE_ESTIMATOR_INTAKE_ENABLED: 'true', CE_ESTIMATOR_INTAKE_KEY: key });
    // CE owns its build directory. Exercise current source assets without
    // rebuilding or modifying that parallel checkout's generated files.
    server = createAppServer({ config, staticRoot: path.join(appRoot, 'public'), deliveryPool: cePool, fetchImpl: (url, options) => {
      assert.equal(new URL(url).origin, portal.url, 'Only the synthetic local Portal may be called');
      return fetch(url, options);
    } });
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    const base = `http://127.0.0.1:${server.address().port}`, sent = [], replies = [];
    let loseFirstResponse = true;
    const transport = createHandoffTransport({ config: { enabled: true, key }, fetchImpl: async (url, options) => {
      assert.equal(url, INTAKE_URL); assert.equal(options.redirect, 'error');
      assert.equal(options.credentials, 'omit'); assert.equal(options.headers.Cookie, undefined);
      sent.push({ packet: JSON.parse(options.body), key: options.headers['Idempotency-Key'], actor: options.headers['X-Estimator-Actor-Id'] });
      const response = await fetch(base + new URL(url).pathname, options);
      replies.push({ status: response.status, error: response.ok ? null : (await response.clone().json()).error });
      if (response.status === 201 && loseFirstResponse) {
        loseFirstResponse = false; await response.json(); throw Error('Simulated receipt lost after CE commit');
      }
      Object.defineProperty(response, 'url', { value: url });
      return response;
    } });
    const store = createOpportunityStore({ ...estimatorClient, connect: async () => estimatorClient }, undefined, transport);
    const sender = { id: 9001, isAdmin: true }, retryLead = { id: 9003, isAdmin: true };
    const configuration = () => adapter.selectProducts(adapter.adaptCatalog(require('../services/ce-fixture.cjs').sourceFixture(), { id: 3, slug: 'sharpdots' }), ['service-a']);
    async function createClosed(unknown = false) {
      let cfg = configuration();
      if (unknown) cfg = adapter.configureProduct(cfg, 'service-a', 'setup:once', { unitCost: null });
      const services = await store.saveRecord(sender, null, { collection: 'services', name: 'Synthetic scope', creationKey: randomUUID(), snapshot: { serviceEngagement: { catalogConfiguration: cfg } } });
      const proposal = await store.saveRecord(sender, null, { collection: 'proposals', name: 'Synthetic offer', creationKey: randomUUID(), snapshot: { proposal: { title: 'Synthetic offer', includedSections: ['services'], sourceRecords: { services: { number: services.number, version: 1 } } } } });
      let o = await store.save(sender, null, M.make({ title: 'Paired handoff rehearsal', kind: 'Services', account: 'Synthetic client', contact: 'Synthetic buyer', email: 'buyer@example.invalid', accountRef, contactRef,
        owner: 'Synthetic sender', ownerId: 9001, oneTime: 1000, monthly: 2000, term: 3, creationKey: randomUUID(), records: [{ ...proposal, role: 'Primary offer' }],
        handoffs: { production: { status: 'not-required' }, engagement: { status: 'draft', owner: 'Synthetic owner', target: '2026-10-15', scope: 'Saved product scope', assets: false } } }));
      o = await store.save(sender, o.id, { ...o, approval: { method: 'Written approval', reference: 'LOCAL REHEARSAL ONLY' } });
      o = await store.save(sender, o.id, { ...o, status: 'won', stage: 'won' });
      await store.saveRecord(sender, services.id, { collection: 'services', name: 'Later working scope', version: 1,
        snapshot: { serviceEngagement: { catalogConfiguration: adapter.configureProduct(cfg, 'service-a', 'media:monthly', { included: false }) } } });
      return store.prepareCeHandoff(sender, o.id, { rowVersion: o.rowVersion });
    }
    const count = async table => Number((await ceDb.query(`SELECT count(*) FROM ce_delivery.${table}`)).rows[0].count);
    const context = id => ({ user: { id: String(id), email: `synthetic-${id}@example.invalid`, displayName: `Synthetic ${id}` }, workspace: { id: '3', slug: 'sharpdots', name: 'Synthetic workspace' },
      application: { id: 'sharpdots-client-engagement' }, role: 'editor', grants: ['sharpdots.client-engagement.read'], expiresAt: new Date(Date.now() + 900000).toISOString() });
    async function cookie(id) {
      const r = await fetch(base + '/delivery/?sso_token=' + portal.launch(context(id)), { redirect: 'manual' });
      assert.ok(r.headers.get('set-cookie'), 'Synthetic Portal launch must issue a local session');
      return r.headers.get('set-cookie').split(';')[0];
    }
    async function read(route, cookieValue, expected = 200) {
      const r = await fetch(base + route, { headers: cookieValue ? { Cookie: cookieValue } : {} });
      assert.equal(r.status, expected, route); if (expected !== 200) return;
      assert.match(r.headers.get('cache-control'), /no-store/); return r.json();
    }
    async function post(packet, idempotencyKey, actor = '9001', extraHeaders = {}) {
      const r = await fetch(base + new URL(INTAKE_URL).pathname, { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey,
        'X-Estimator-Actor-Id': actor, 'X-Estimator-Workspace-Id': '3', 'X-Estimator-Workspace-Slug': 'sharpdots', ...extraHeaders }, body: JSON.stringify(packet) });
      return { status: r.status, body: await r.json() };
    }
    let o = await createClosed();
    o = await store.sendCeHandoff(sender, o.id, { rowVersion: o.rowVersion });
    assert.equal(o.ceHandoff.status, 'failed'); assert.equal(await count('engagements'), 1, JSON.stringify(replies));
    o = await store.sendCeHandoff(retryLead, o.id, { rowVersion: o.rowVersion });
    assert.equal(o.ceHandoff.status, 'received'); assert.equal(await count('engagements'), 1);
    assert.deepEqual(sent[0].packet, sent[1].packet); assert.equal(sent[0].key, sent[1].key);
    assert.deepEqual(sent.slice(0, 2).map(s => s.actor), ['9001', '9003']);
    const packet = sent[0].packet, receipt = o.ceHandoff.receipt;
    assert.equal(packet.intake.preparedBy, 9001); assert.equal(packet.source.services.version, 1);
    assert.equal(packet.components.length, 3); assert.equal(packet.servicePricing.termPriceCents, 412500);
    const ownerCookie = await cookie(9002), retryCookie = await cookie(9003), detail = '/api/delivery/intakes/' + receipt.engagementId;
    const received = await read(detail, ownerCookie);
    assert.deepEqual(received.components, packet.components); assert.deepEqual(received.source, packet.source);
    assert.deepEqual(received.admission, { workTrackingAllowed: false, externalExecution: false, invoicing: false });
    assert.match(received.acceptanceCaveat, /operator/);
    await read(detail, undefined, 401); await read(detail, retryCookie, 404);
    assert.equal((await read('/api/delivery/intakes', ownerCookie)).length, 1);
    assert.deepEqual(await read('/api/delivery/intakes', retryCookie), []);
    assert.deepEqual(await read('/api/delivery/engagements', ownerCookie), []);
    assert.equal((await ceDb.query('SELECT command FROM ce_delivery.activity WHERE engagement_id=$1', [receipt.engagementId])).rows[0].command.preparedBy, 9001);
    assert.deepEqual((await ceDb.query('SELECT member_id FROM ce_delivery.memberships WHERE engagement_id=$1 ORDER BY member_id', [receipt.engagementId])).rows.map(r => r.member_id), ['9001', '9002']);
    const replay = await post(packet, randomUUID(), '9003');
    assert.equal(replay.status, 200); assert.equal(replay.body.engagementId, receipt.engagementId);
    const changed = structuredClone(packet); changed.intake.scope = 'Changed scope'; const { sha256, ...changedBody } = changed; changed.sha256 = digest(changedBody);
    assert.equal((await post(changed, sent[0].key)).status, 409);
    assert.equal((await post(changed, randomUUID())).status, 409);
    assert.equal((await post(packet, randomUUID(), '9004')).status, 403);
    assert.equal((await post(packet, randomUUID(), '9001', { Origin: base })).status, 403);
    assert.equal((await post(packet, randomUUID(), '9001', { Authorization: 'Bearer ' + randomBytes(32).toString('hex') })).status, 401);
    await ceDb.query("UPDATE ce_delivery.profiles SET active=false WHERE member_id='9002'");
    assert.equal((await post(packet, sent[0].key)).status, 403); await read(detail, ownerCookie, 403);
    await ceDb.query("UPDATE ce_delivery.profiles SET active=true,delivery_role='contributor' WHERE member_id='9002'");
    assert.equal((await post(packet, sent[0].key)).status, 403);
    await ceDb.query("UPDATE ce_delivery.profiles SET delivery_role='lead' WHERE member_id='9002'");
    assert.equal(await count('engagements'), 1); assert.equal(await count('activity'), 1); assert.equal(await count('profiles'), 3);
    let unknown = await createClosed(true);
    unknown = await store.sendCeHandoff(sender, unknown.id, { rowVersion: unknown.rowVersion });
    assert.equal(unknown.ceHandoff.status, 'received');
    const unknownView = await read('/api/delivery/intakes/' + unknown.ceHandoff.receipt.engagementId, ownerCookie);
    assert.equal(unknownView.servicePricing.termCostCents, null); assert.equal(unknownView.servicePricing.termPriceCents, null);
    assert.equal(unknownView.components.find(c => c.componentId === 'setup').unitCostCents, null);
    assert.ok(unknownView.review.issues.includes('Resolve unknown component costs'));
    if (process.env.CE_INTAKE_BROWSER === '1') {
      const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/private/tmp/sharpdots-migration-tools/node_modules/playwright');
      const browser = await chromium.launch();
      try {
        const page = await browser.newPage(), errors = [], external = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.route('**/*', route => {
          if (new URL(route.request().url()).origin !== base) { external.push(new URL(route.request().url()).origin); return route.abort(); }
          return route.continue();
        });
        // Loopback HTTP cannot set CE's Secure-prefixed browser cookie. Send only
        // this test Portal's valid session; the real server still introspects it.
        await page.setExtraHTTPHeaders({ Cookie: ownerCookie });
        await page.goto(base + '/delivery/intakes/?engagement=' + encodeURIComponent(receipt.engagementId));
        await page.locator('#detail h2').filter({ hasText: packet.intake.title }).waitFor();
        await page.locator('#detail details').first().locator('summary').first().click();
        assert.ok((await page.locator('#detail').innerText()).includes(packet.source.services.number));
        for (const [width, height] of [[1440, 1000], [1188, 915], [390, 844]]) {
          await page.setViewportSize({ width, height });
          await page.screenshot({ path: `/private/tmp/ce-received-intake-${width}.png`, fullPage: true });
          const overflow = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth,
            elements: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('.table-scroll')).slice(0, 12).map(e => ({ tag: e.tagName, id: e.id, class: e.className, right: e.getBoundingClientRect().right })) }));
          assert.ok(overflow.scroll <= width + 1, 'CE page overflow ' + JSON.stringify(overflow));
        }
        await page.reload(); await page.locator('#detail h2').waitFor();
        await page.goto(base + '/delivery/intakes/?engagement=' + encodeURIComponent(unknown.ceHandoff.receipt.engagementId));
        await page.getByText('Needs costing', { exact: true }).first().waitFor();
        assert.deepEqual(errors, []); assert.deepEqual(external, []);
      } finally { await browser.close(); }
    }
    portal.revokeMember('9002'); await read(detail, ownerCookie, 401);
    assert.equal((await store.list(sender)).opportunities.find(item => item.id === o.id).ceHandoff.receipt.engagementId, receipt.engagementId);
    console.log(JSON.stringify({ result: 'pass', source: 'disposable synthetic databases and local Portal only',
      checks: ['actual Estimator store to CE HTTP receiver', 'pinned source survives newer Services version', 'lost response and different authorized retry actor',
        'commercial-source and request-key deduplication', 'current CE membership and lead role', 'no automatic profile or retry membership grant',
        'protected intake list/detail and Portal revocation', 'intakes excluded from actionable Team work', 'unknown costs remain null', 'receipt survives reload'],
      browser: process.env.CE_INTAKE_BROWSER === '1' ? '3 viewports, direct receipt link, reload and unknown-cost display passed' : 'not requested',
      productionCalls: 0, emails: 0, invoices: 0 }, null, 2));
  } finally {
    if (server?.listening) { const closed = once(server, 'close'); server.closeAllConnections(); server.close(); await closed; }
    if (portal) await portal.close();
    await estimatorDb.close(); await ceDb.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
