const P = require('../services/ce-pricing');

// Validate inside the existing authorized record transaction. Proofs are derived,
// never accepted from browser input; old v1 snapshots retain their original shape.
async function validatePricingSnapshot(collection, input, readServices, { previous, readCatalog } = {}) {
  const snapshot = structuredClone(input);
  const config = snapshot.serviceEngagement?.catalogConfiguration;
  if (collection === 'services' && P.isAssessed(config)) {
    const old = previous?.serviceEngagement?.catalogConfiguration;
    const keys = ['source', 'costSourceJson', 'catalogId', 'catalogFingerprint', 'products'];
    const unchanged = P.isAssessed(old) && keys.every(k => P.canonical(old[k]) === P.canonical(config[k]));
    if (!unchanged) {
      if (!readCatalog) throw Error('Saved paired catalog verification is unavailable');
      const catalog = await readCatalog();
      const expected = P.selectProducts(catalog, config.products.map(p => p.id));
      if (!keys.every(k => P.canonical(expected[k]) === P.canonical(config[k]))) throw Error('Product baseline differs from the saved CE catalog. Refresh products or retain the previous Services baseline.');
    }
    snapshot.cePricingProof = P.proof(config);
  }
  if (collection === 'proposals') {
    const proposal = snapshot.proposal;
    const ref = proposal?.sourceRecords?.services;
    const saved = ref?.number ? await readServices(ref.number, Number(ref.version)) : null;
    const base = saved?.snapshot?.serviceEngagement?.catalogConfiguration;
    if (proposal?.servicesPricingOverride || P.isAssessed(base)) {
      if (!saved || !proposal.includedSections?.includes('services')) throw Error('Proposal pricing requires an included saved Services version');
      const effective = P.proposalConfiguration(proposal, saved);
      snapshot.cePricingProof = P.proof(effective);
      // Embedded publishing state must agree with the pinned Services baseline.
      if (proposal.servicesPricing) proposal.servicesPricing = { serviceScenario: 'livingOps', serviceEngagement: structuredClone(saved.snapshot.serviceEngagement) };
    }
  }
  return snapshot;
}

module.exports = { validatePricingSnapshot };
