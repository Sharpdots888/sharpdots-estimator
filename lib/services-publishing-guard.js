const { isCatalog, blockedMessage } = require('../services/ce-engagement');
const fail = message => Object.assign(new Error(message), { statusCode: 409 });
const proposalOf = snapshot => snapshot?.proposal || snapshot || {};
function assertSnapshot(snapshot) {
  const activeCatalog = value => isCatalog(value?.serviceEngagement) && (!value.serviceScenario || value.serviceScenario === 'livingOps');
  if (activeCatalog(snapshot) || activeCatalog(snapshot?.servicesPricing)) throw fail(blockedMessage);
}

// Check immutable database versions, not browser-supplied readiness flags.
async function assertServicesPublishable({ snapshot, proposalNumber, proposalVersion, readSnapshot }) {
  assertSnapshot(snapshot);
  const proposals = [proposalOf(snapshot)];
  if (readSnapshot) {
    const saved = await readSnapshot('proposals', proposalNumber, proposalVersion);
    if (!saved) throw fail('Save the proposal version before preparing a signing request.');
    proposals.push(proposalOf(saved));
  }
  for (const proposal of proposals) {
    assertSnapshot(proposal);
    if (!proposal.includedSections?.includes('services')) continue;
    const ref = proposal.sourceRecords?.services;
    if (!readSnapshot) continue; // Legacy records have no CRM version store.
    if (!/^S-\d{6}$/.test(ref?.number || '') || !Number.isSafeInteger(ref.version) || ref.version < 1) throw fail('Save and select the Services source version before signing.');
    const services = await readSnapshot('services', ref.number, ref.version);
    if (!services) throw fail('The selected Services source version is unavailable.');
    assertSnapshot(services);
  }
}
module.exports = { assertServicesPublishable };
