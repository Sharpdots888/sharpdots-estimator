const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { randomBytes, createHmac } = require('node:crypto');
const path = require('node:path');

test('real server catalog route requires a valid session in every auth mode and remains disabled by default', { timeout: 15000 }, async () => {
  const root = path.resolve(__dirname, '..');
  const secret = randomBytes(32).toString('hex');
  const cookie = (expiresAt = Date.now() + 60000) => {
    const payload = Buffer.from(JSON.stringify({ user: { id: 45, isAdmin: true }, expiresAt })).toString('base64url');
    return `sfpq_estimator_session=${payload}.${createHmac('sha256', secret).update(payload).digest('base64url')}`;
  };
  for (const mode of ['disabled', 'portal-token-preferred', 'portal-token-required']) {
    // Prevent local credentials, databases, migrations and outbound calls from
    // entering this real-server test. Only the loopback listener is enabled.
    const child = spawn(process.execPath, ['-e', `
      require('./lib/local-env').loadLocalEnv = () => {};
      require('pg').Pool = class { async connect() { throw Error('Synthetic DB refuses connections'); } async query() { throw Error('Synthetic DB refuses queries'); } };
      globalThis.fetch = async () => { throw new Error('Outbound calls forbidden in route test'); };
      require('./server');
    `], { cwd: root, env: { PATH: process.env.PATH, PORT: '0', HOST: '127.0.0.1', ESTIMATOR_AUTH_MODE: mode, ESTIMATOR_SESSION_SECRET: secret, DOCUSEAL_API_KEY: 'synthetic-never-sent', DATABASE_URL: 'postgres://synthetic:synthetic@127.0.0.1/unused' }, stdio: ['ignore', 'pipe', 'pipe'] });
    const exit = once(child, 'exit');
    let startupTimer;
    try {
      const base = await new Promise((resolve, reject) => {
        let output = '';
        startupTimer = setTimeout(() => reject(Error('Test server startup timed out')), 3000);
        child.once('error', reject);
        child.stderr.on('data', chunk => { output += chunk.toString(); });
        child.once('exit', () => reject(Error(`Test server exited before startup: ${output}`)));
        child.stdout.on('data', chunk => {
          output += chunk.toString();
          const match = output.match(/Estimator running on (http:\/\/127\.0\.0\.1:\d+)/);
          if (match) resolve(match[1]);
        });
      });
      clearTimeout(startupTimer);
      for (const headers of [{}, { Cookie: 'sfpq_estimator_session=forged.signature' }, { Cookie: cookie(1) }]) {
        const r = await fetch(`${base}/api/services/catalog`, { headers });
        assert.equal(r.status, 401, mode);
        assert.equal(r.headers.get('cache-control'), 'no-store');
        await r.text();
      }
      const headers = { Cookie: cookie() };
      let r = await fetch(`${base}/api/services/catalog`, { headers });
      assert.equal(r.status, 503); assert.match((await r.json()).error, /not enabled/);
      r = await fetch(`${base}/api/services/catalog?actor=46&workspace=1`, { headers });
      assert.equal(r.status, 400); await r.text();
      r = await fetch(`${base}/api/services/catalog`, { method: 'POST', headers });
      assert.equal(r.status, 405); assert.equal(r.headers.get('allow'), 'GET'); await r.text();
      r = await fetch(`${base}/api/document-transactions`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({
        proposalNumber: 'P-000001', recipientEmail: 'test@example.invalid', documentHtml: '<signature-field></signature-field>',
        proposalSnapshot: { includedSections: ['services'], servicesPricing: { serviceScenario: 'livingOps', serviceEngagement: { catalogConfiguration: {} } } }
      }) });
      // The fake pool and outbound fetch both throw: 409 proves the guard ran first.
      assert.equal(r.status, 409, mode); assert.match((await r.json()).error, /draft-only/);
    } finally {
      clearTimeout(startupTimer);
      child.kill('SIGTERM');
      await exit;
    }
  }
});
