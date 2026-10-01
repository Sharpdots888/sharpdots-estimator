const { createServiceCatalogReader } = require('./service-catalog-reader');
const { createCatalogTransport, SOURCE_WORKSPACE, CatalogReadError, actorId } = require('./ce-catalog-transport');

function createServiceCatalogEndpoint({ config, crmEnabled, authorizeActor, fetchImpl }) {
  const read = createServiceCatalogReader({
    workspace: SOURCE_WORKSPACE,
    readAuthorizedSnapshot: createCatalogTransport({ config, fetchImpl })
  });
  return async function catalogEndpoint({ method, url, session }) {
    const result = (status, body) => ({ status, body });
    if (!session?.user || !actorId(session.user.id)) return result(401, { error: 'Portal authentication required' });
    if (method !== 'GET') return result(405, { error: 'Method not allowed' });
    if (url.search) return result(400, { error: 'Product library does not accept query parameters' });
    if (!config.enabled || !crmEnabled || !authorizeActor) return result(503, { error: 'Product library connection is not enabled' });
    let actor;
    try {
      actor = await authorizeActor(session.user);
    } catch (error) {
      const status = [401, 403].includes(error.statusCode) ? error.statusCode : 503;
      return result(status, { error: status === 503 ? 'Operator access could not be verified' : 'Product library access is not enabled for this operator' });
    }
    if (!actorId(actor?.id) || String(actor.id) !== String(session.user.id)) return result(403, { error: 'Product library operator could not be verified' });
    try {
      return result(200, await read({ id: actor.id }));
    } catch (error) {
      return result(error instanceof CatalogReadError ? error.statusCode : 502, {
        error: error instanceof CatalogReadError ? error.message : 'Product library returned an invalid saved catalog'
      });
    }
  };
}

module.exports = { createServiceCatalogEndpoint };
