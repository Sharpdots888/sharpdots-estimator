const { adaptCatalog } = require('../services/ce-catalog');

// The injected transport must authenticate the actor and authorize the source
// workspace. No route, token, warehouse credential or fallback is installed here.
function createServiceCatalogReader({ workspace, readAuthorizedSnapshot }) {
  if (!workspace?.id || !workspace.slug || typeof readAuthorizedSnapshot !== 'function') throw Error('An authorized catalog transport and fixed source workspace are required');
  const target = Object.freeze({ id: workspace.id, slug: workspace.slug });
  return async function readForActor(actor) {
    if (!actor?.id) throw Error('Authenticated operator required');
    const response = await readAuthorizedSnapshot({ actor, workspace: target });
    if (response?.contractVersion !== 'ce-estimator-source-v1' || response.storage !== 'shared') throw Error('A saved shared catalog response is required');
    // Fetch on every explicit refresh. An unavailable source is an error, not a
    // reason to serve a seed or silently substitute a browser-cached catalog.
    return adaptCatalog(response, target);
  };
}

module.exports = { createServiceCatalogReader };
