const CE_ORIGIN = 'https://sharpdots-client-engagement-f985e9fee403.herokuapp.com';
const INTAKE_URL = CE_ORIGIN + '/api/integrations/estimator/intakes';
const fail = (message, code = 502) => Object.assign(new Error(message), { safeMessage: message, statusCode: code });

function handoffConnectionConfig(env = process.env) {
  if (env.ESTIMATOR_CE_HANDOFF_ENABLED !== 'true') return { enabled: false };
  const key = env.ESTIMATOR_CE_HANDOFF_KEY;
  if (!/^[a-f0-9]{64}$/.test(key || '') || key === env.ESTIMATOR_CE_CATALOG_READ_KEY) {
    throw Error('CE handoff requires a dedicated write key, separate from catalog reads');
  }
  return { enabled: true, key };
}

function validateReceipt(receipt, packet, idempotencyKey) {
  if (receipt?.schema !== 'ce-estimator-intake-receipt-v1' || receipt.idempotencyKey !== idempotencyKey ||
      receipt.sha256 !== packet.sha256 || receipt.status !== 'intake-review' ||
      !/^[a-zA-Z0-9_-]{1,100}$/.test(receipt.engagementId || '') ||
      !Number.isFinite(Date.parse(receipt.receivedAt))) throw fail('CE returned an unverified receipt; retry the same handoff');
  return { schema: receipt.schema, idempotencyKey, sha256: receipt.sha256, status: receipt.status,
    engagementId: receipt.engagementId, receivedAt: receipt.receivedAt };
}

function createHandoffTransport({ config, fetchImpl = globalThis.fetch, timeoutMs = 15000 }) {
  return { enabled: config.enabled, async send({ packet, idempotencyKey, actor }) {
    if (!config.enabled) throw fail('CE intake connection is not enabled', 503);
    if (!/^[1-9]\d*$/.test(String(actor?.id))) throw fail('Authenticated operator required', 401);
    const controller = new AbortController();
    let reader, timer;
    const operation = async () => {
      const response = await fetchImpl(INTAKE_URL, { method: 'POST', redirect: 'error', credentials: 'omit', cache: 'no-store', signal: controller.signal,
        headers: { Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json', Accept: 'application/json',
          'Idempotency-Key': idempotencyKey, 'X-Estimator-Actor-Id': String(actor.id),
          'X-Estimator-Workspace-Id': '3', 'X-Estimator-Workspace-Slug': 'sharpdots' }, body: JSON.stringify(packet) });
      reader = response.body?.getReader();
      if (response.status === 409) throw fail('CE requires reconciliation with an existing intake before an amendment', 409);
      if ([401,403].includes(response.status)) throw fail('CE intake access was denied. Check the connection and receiving membership', 403);
      if (![200,201].includes(response.status) || response.redirected || response.url && response.url !== INTAKE_URL ||
          !/^application\/json(?:\s*;|$)/i.test(response.headers.get('content-type') || '') || !reader) {
        throw fail('CE receipt was not confirmed. Retry uses the same handoff identity');
      }
      let size = 0;
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 16000) throw fail('CE returned an invalid receipt');
        chunks.push(Buffer.from(value));
      }
      return validateReceipt(JSON.parse(Buffer.concat(chunks).toString('utf8')), packet, idempotencyKey);
    };
    try {
      return await Promise.race([operation(), new Promise((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(fail('CE receipt timed out. Retry uses the same handoff identity', 504)); }, timeoutMs);
      })]);
    } catch (error) {
      if (error.safeMessage) throw error;
      throw fail('CE receipt was not confirmed. Retry uses the same handoff identity');
    } finally {
      clearTimeout(timer); controller.abort();
      if (reader) void reader.cancel().catch(() => {});
    }
  } };
}

module.exports = { CE_ORIGIN, INTAKE_URL, handoffConnectionConfig, validateReceipt, createHandoffTransport };
