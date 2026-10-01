const { test } = require('node:test');
const assert = require('node:assert/strict');
const { assertServicesPublishable } = require('./services-publishing-guard');
const proposal = { includedSections: ['copy', 'services'], sourceRecords: { services: { number: 'S-000001', version: 2 } } };

test('signing gate checks saved proposal and immutable Services even if browser strips flags', async () => {
  const calls = [];
  const readSnapshot = async (...args) => {
    calls.push(args);
    return args[0] === 'proposals' ? { proposal } : { serviceScenario: 'livingOps', serviceEngagement: { catalogConfiguration: { schema: 'ce-services-configuration-v1' } } };
  };
  await assert.rejects(assertServicesPublishable({ snapshot: { includedSections: ['copy'] }, proposalNumber: 'P-000001', proposalVersion: 1, readSnapshot }), /draft-only/);
  assert.deepEqual(calls, [['proposals', 'P-000001', 1], ['services', 'S-000001', 2]]);
});

test('signing gate preserves legacy Services and rejects missing versions or explicit CE metadata', async () => {
  const args = { snapshot: proposal, proposalNumber: 'P-000001', proposalVersion: 1,
    readSnapshot: async collection => collection === 'proposals' ? { proposal } : { serviceScenario: 'scratch' } };
  await assert.doesNotReject(assertServicesPublishable(args));
  await assert.doesNotReject(assertServicesPublishable({ ...args, readSnapshot: async c => c === 'proposals' ? { proposal } : { serviceScenario: 'scratch', serviceEngagement: { catalogConfiguration: {} } } }));
  await assert.rejects(assertServicesPublishable({ ...args, readSnapshot: async () => null }), /Save the proposal/);
  await assert.rejects(assertServicesPublishable({ ...args, readSnapshot: async c => c === 'proposals' ? { proposal } : null }), /unavailable/);
  await assert.rejects(assertServicesPublishable({ snapshot: { ...proposal, servicesPricing: { serviceEngagement: { catalogConfiguration: null } } } }), /draft-only/);
  await assert.doesNotReject(assertServicesPublishable({ snapshot: { includedSections: ['copy'] } }));
});
