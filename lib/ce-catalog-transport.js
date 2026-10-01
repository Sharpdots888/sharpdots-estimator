const SOURCE_URL = 'https://sharpdots-client-engagement-f985e9fee403.herokuapp.com/api/integrations/estimator/catalog';
const SOURCE_WORKSPACE = Object.freeze({ id: 3, slug: 'sharpdots' });
const MAX_BYTES = 5_000_000;
const TIMEOUT_MS = 10_000;

class CatalogReadError extends Error {
  constructor(statusCode, message) { super(message); this.statusCode = statusCode; }
}

function catalogConnectionConfig(env = process.env) {
  if (env.ESTIMATOR_CE_CATALOG_ENABLED !== 'true') return Object.freeze({ enabled: false });
  const key = env.ESTIMATOR_CE_CATALOG_READ_KEY;
  if (!/^[a-f0-9]{64}$/.test(key || '')) throw new Error('ESTIMATOR_CE_CATALOG_READ_KEY must be a dedicated 64-character lowercase hex key');
  return Object.freeze({ enabled: true, key });
}

function actorId(value) {
  const id = String(value ?? '');
  return /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id)) ? id : null;
}

function createCatalogTransport({ config, fetchImpl = globalThis.fetch, timeoutMs = TIMEOUT_MS, maxBytes = MAX_BYTES }) {
  if (config.enabled && !/^[a-f0-9]{64}$/.test(config.key || '')) throw new Error('Invalid catalog read credential');
  return async function readAuthorizedSnapshot({ actor, workspace }) {
    if (!config.enabled) throw new CatalogReadError(503, 'Product library connection is not enabled');
    const id = actorId(actor?.id);
    if (!id) throw new CatalogReadError(401, 'Authenticated operator required');
    if (String(workspace?.id) !== String(SOURCE_WORKSPACE.id) || workspace?.slug !== SOURCE_WORKSPACE.slug) {
      throw new CatalogReadError(403, 'Product library workspace is not allowed');
    }
    const controller = new AbortController();
    let timer;
    let reader;
    const operation = async () => {
      const response = await fetchImpl(SOURCE_URL, {
        method: 'GET', redirect: 'error', credentials: 'omit', cache: 'no-store', signal: controller.signal,
        headers: {
          Accept: 'application/json', Authorization: `Bearer ${config.key}`,
          'X-Estimator-Actor-Id': id,
          'X-Estimator-Workspace-Id': String(SOURCE_WORKSPACE.id),
          'X-Estimator-Workspace-Slug': SOURCE_WORKSPACE.slug
        }
      });
      if (response.body) reader = response.body.getReader();
      if (response.status === 403) throw new CatalogReadError(403, 'Product library access is not enabled for this operator');
      if (response.status === 401 || response.status === 404 || response.status === 503) {
        throw new CatalogReadError(503, 'Product library connection is unavailable');
      }
      if (response.status !== 200 || response.redirected || (response.url && response.url !== SOURCE_URL)) {
        throw new CatalogReadError(502, 'Product library returned an unexpected response');
      }
      if (!/^application\/json(?:\s*;|$)/i.test(response.headers.get('content-type') || '')) {
        throw new CatalogReadError(502, 'Product library returned an invalid response');
      }
      const declaredSize = response.headers.get('content-length');
      if (declaredSize !== null && (!/^\d+$/.test(declaredSize) || Number(declaredSize) > maxBytes)) {
        throw new CatalogReadError(502, 'Product library response exceeds the allowed size');
      }
      if (!reader) throw new CatalogReadError(502, 'Product library returned an empty response');
      let size = 0;
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maxBytes) throw new CatalogReadError(502, 'Product library response exceeds the allowed size');
        chunks.push(Buffer.from(value));
      }
      return JSON.parse(Buffer.concat(chunks).toString('utf8'));
    };
    try {
      return await Promise.race([
        operation(),
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(new CatalogReadError(504, 'Product library request timed out'));
          }, timeoutMs);
        })
      ]);
    } catch (error) {
      if (error instanceof CatalogReadError) throw error;
      // Provider bodies, URLs and transport errors can contain credentials.
      throw new CatalogReadError(502, 'Product library could not be read');
    } finally {
      clearTimeout(timer);
      controller.abort();
      if (reader) void reader.cancel().catch(() => {});
    }
  };
}

module.exports = { SOURCE_URL, SOURCE_WORKSPACE, CatalogReadError, catalogConnectionConfig, createCatalogTransport, actorId };
