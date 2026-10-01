const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { PGlite } = require('@electric-sql/pglite');
const { sourceFixture } = require('../services/ce-fixture.cjs');
const { createOpportunityStore } = require('./opportunity-store');
const { createCrmAccess } = require('./crm-access');
const { createServiceCatalogEndpoint } = require('./service-catalog-endpoint');
const { SOURCE_URL, SOURCE_WORKSPACE, catalogConnectionConfig, createCatalogTransport } = require('./ce-catalog-transport');
const key = randomBytes(32).toString('hex');
const config = catalogConnectionConfig({ ESTIMATOR_CE_CATALOG_ENABLED: 'true', ESTIMATOR_CE_CATALOG_READ_KEY: key });
const input = () => ({ actor: { id: 45 }, workspace: SOURCE_WORKSPACE });
const request = () => ({ method: 'GET', url: new URL('http://estimator.test/api/services/catalog'), session: { user: { id: 45, isAdmin: true } } });
const response = (body = sourceFixture()) => new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
const endpoint = (extra = {}) => createServiceCatalogEndpoint({ config, crmEnabled: true, authorizeActor: async u => ({ id: u.id }), fetchImpl: async () => response(), ...extra });

test('catalog transport is opt-in and requires a dedicated well-formed key', async () => {
  for (const flag of [undefined, '', 'false', 'TRUE']) assert.deepEqual(catalogConnectionConfig({ ESTIMATOR_CE_CATALOG_ENABLED: flag }), { enabled: false });
  for (const bad of [undefined, '', 'short', key.toUpperCase(), 'x'.repeat(64)]) {
    assert.throws(() => catalogConnectionConfig({ ESTIMATOR_CE_CATALOG_ENABLED: 'true', ESTIMATOR_CE_CATALOG_READ_KEY: bad }), /READ_KEY/);
  }
  let calls = 0;
  const read = createCatalogTransport({ config: { enabled: false }, fetchImpl: () => { calls++; } });
  await assert.rejects(read(input()), e => e.statusCode === 503);
  assert.equal(calls, 0);
});

test('catalog transport sends only fixed scope, service credential and verified actor to one HTTPS endpoint', async () => {
  const read = createCatalogTransport({ config, fetchImpl: async (url, options) => {
    assert.equal(url, SOURCE_URL);
    assert.equal(new URL(url).protocol, 'https:');
    assert.equal(options.method, 'GET');
    assert.equal(options.redirect, 'error');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.cache, 'no-store');
    assert.deepEqual(options.headers, { Accept: 'application/json', Authorization: `Bearer ${key}`, 'X-Estimator-Actor-Id': '45', 'X-Estimator-Workspace-Id': '3', 'X-Estimator-Workspace-Slug': 'sharpdots' });
    return response();
  } });
  assert.deepEqual(await read(input()), sourceFixture());
});

test('catalog transport refuses invalid actors and alternate workspace before any network call', async () => {
  let calls = 0;
  const read = createCatalogTransport({ config, fetchImpl: async () => { calls++; return response(); } });
  for (const id of [null, undefined, 0, -1, '045', '45\r\nX: forged', '1.5', '9007199254740992']) {
    await assert.rejects(read({ ...input(), actor: { id } }), e => e.statusCode === 401);
  }
  for (const workspace of [null, { id: 1, slug: 'sharpdots' }, { id: 3, slug: 'other' }]) {
    await assert.rejects(read({ ...input(), workspace }), e => e.statusCode === 403);
  }
  assert.equal(calls, 0);
});

test('catalog transport fails closed on provider denial, redirect, wrong type and malformed data', async () => {
  for (const status of [301, 302, 307, 308, 401, 403, 404, 429, 500, 503]) {
    const read = createCatalogTransport({ config, fetchImpl: async () => new Response(`secret: ${key}`, { status, headers: { Location: 'https://untrusted.invalid/' } }) });
    await assert.rejects(read(input()), e => e.statusCode === (status === 403 ? 403 : [401, 404, 503].includes(status) ? 503 : 502) && !e.message.includes(key));
  }
  for (const make of [
    () => new Response('{}', { headers: { 'Content-Type': 'text/html' } }),
    () => new Response('not json', { headers: { 'Content-Type': 'application/json' } })
  ]) {
    await assert.rejects(createCatalogTransport({ config, fetchImpl: async () => make() })(input()), e => e.statusCode === 502);
  }
  for (const property of ['redirected', 'url']) {
    const r = response(); Object.defineProperty(r, property, { value: property === 'url' ? 'https://untrusted.invalid/' : true });
    await assert.rejects(createCatalogTransport({ config, fetchImpl: async () => r })(input()), e => e.statusCode === 502);
  }
});

test('catalog response byte limit is enforced before and during streaming', async () => {
  for (const r of [
    new Response('{}', { headers: { 'Content-Type': 'application/json', 'Content-Length': '21' } }),
    new Response('x'.repeat(21), { headers: { 'Content-Type': 'application/json' } }),
    new Response('{}', { headers: { 'Content-Type': 'application/json', 'Content-Length': 'unknown' } })
  ]) {
    await assert.rejects(createCatalogTransport({ config, maxBytes: 20, fetchImpl: async () => r })(input()), e => e.statusCode === 502 && /size/.test(e.message));
  }
});

test('catalog deadline covers both connection and response body; network errors are redacted', async () => {
  let signal;
  const read = createCatalogTransport({ config, timeoutMs: 15, fetchImpl: async (_, opts) => { signal = opts.signal; return new Promise(() => {}); } });
  await assert.rejects(read(input()), e => e.statusCode === 504);
  assert.equal(signal.aborted, true);
  let cancelled = false;
  const stream = new ReadableStream({ cancel() { cancelled = true; } });
  await assert.rejects(createCatalogTransport({ config, timeoutMs: 15, fetchImpl: async () => new Response(stream, { headers: { 'Content-Type': 'application/json' } }) })(input()), e => e.statusCode === 504);
  assert.equal(cancelled, true);
  await assert.rejects(createCatalogTransport({ config, fetchImpl: async () => { throw Error(key); } })(input()), e => !e.message.includes(key) && e.statusCode === 502);
});

test('catalog endpoint requires session even in local mode, rejects writes and browser scope overrides', async () => {
  let authorizationCalls = 0, networkCalls = 0;
  const read = endpoint({ authorizeActor: async u => { authorizationCalls++; return u; }, fetchImpl: async () => { networkCalls++; return response(); } });
  assert.equal((await read({ ...request(), session: null })).status, 401);
  for (const method of ['POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']) assert.equal((await read({ ...request(), method })).status, 405);
  for (const query of ['actor=46', 'workspace=1', 'refresh=1']) {
    assert.equal((await read({ ...request(), url: new URL(`http://estimator.test/api/services/catalog?${query}`) })).status, 400);
  }
  assert.equal(authorizationCalls, 0); assert.equal(networkCalls, 0);
  assert.equal((await endpoint({ config: { enabled: false } })(request())).status, 503);
  assert.equal((await endpoint({ crmEnabled: false })(request())).status, 503);
  assert.equal((await endpoint({ authorizeActor: null })(request())).status, 503);
});

test('operator denial and database failure prevent source reads without leaking errors', async () => {
  let networkCalls = 0;
  for (const statusCode of [401, 403, 500, undefined]) {
    const read = endpoint({ authorizeActor: async () => { throw Object.assign(Error(key), { statusCode }); }, fetchImpl: async () => { networkCalls++; return response(); } });
    const r = await read(request());
    assert.equal(r.status, [401, 403].includes(statusCode) ? statusCode : 503);
    assert.ok(!JSON.stringify(r).includes(key));
  }
  assert.equal((await endpoint({ authorizeActor: async () => ({ id: 46 }) })(request())).status, 403);
  assert.equal(networkCalls, 0);
});

test('endpoint refresh reads latest source; output retains draft status and omits metadata and credentials', async () => {
  let calls = 0;
  const read = endpoint({ fetchImpl: async () => {
    const s = sourceFixture(); s.version = s.catalog.version = 7 + calls++;
    return response(s);
  } });
  const first = await read(request()), next = await read(request());
  assert.equal(first.status, 200); assert.equal(next.status, 200);
  assert.equal(first.body.source.revision, 7); assert.equal(next.body.source.revision, 8);
  assert.equal(first.body.products[0].enabledForSending, false);
  for (const secret of [key, 'knownPeople', 'lastEdited', 'must not be returned']) assert.ok(!JSON.stringify(first.body).includes(secret));
});

test('invalid shared source contract, scope or revision cannot become a fallback catalog', async () => {
  for (const mutate of [s => s.storage = 'local', s => s.contractVersion = 'other', s => s.workspace.id = 1, s => s.workspace.slug = 'other', s => s.version = 0, s => s.catalog.version = 6, s => s.catalog = null]) {
    const source = sourceFixture(); mutate(source);
    const r = await endpoint({ fetchImpl: async () => response(source) })(request());
    assert.equal(r.status, 502); assert.deepEqual(Object.keys(r.body), ['error']);
  }
});

test('catalog uses current CRM authorization on every read, including allowlist removal and user deactivation', async () => {
  const db = new PGlite();
  let calls = 0;
  try {
    await db.exec(`CREATE TABLE users(id integer PRIMARY KEY,username text,is_admin boolean,is_active boolean);
      INSERT INTO users VALUES(45,'admin',true,true),(46,'operator',false,true),(47,'outsider',false,true);`);
    const store = createOpportunityStore({ query: (sql, params) => db.query(sql, params) }, createCrmAccess('46'));
    const read = endpoint({ authorizeActor: store.authorizeActor, fetchImpl: async () => { calls++; return response(); } });
    const operatorRequest = { ...request(), session: { user: { id: 46, isAdmin: false } } };
    assert.equal((await read(operatorRequest)).status, 200);
    assert.equal((await read({ ...request(), session: { user: { id: 47, isAdmin: true } } })).status, 403);
    await db.exec('UPDATE users SET is_active=false WHERE id=46');
    assert.equal((await read(operatorRequest)).status, 403);
    await db.exec('UPDATE users SET is_active=true WHERE id=46');
    const revoked = createOpportunityStore({ query: (sql, params) => db.query(sql, params) }, createCrmAccess(''));
    assert.equal((await endpoint({ authorizeActor: revoked.authorizeActor })(operatorRequest)).status, 403);
    assert.equal(calls, 1);
  } finally { await db.close(); }
});
