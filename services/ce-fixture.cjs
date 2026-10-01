// Synthetic source-contract fixture; no customer or production catalog data.
function sourceFixture() {
  const product = { id: 'service-a', name: 'Example service', lifecycleStatus: 'under_review', termMonths: 3,
    targetContributionMargin: .4, contingencyRate: .1, priceOverrides: { once: null, monthly: null },
    recipe: [{ componentId: 'setup', quantity: 2, cadence: 'once', configuration: 'One setup' }, { componentId: 'delivery', quantity: 1, cadence: 'monthly', configuration: 'Monthly work' }, { componentId: 'media', quantity: 1, cadence: 'monthly', configuration: 'Pass-through' }],
    map: ['setup', 'delivery', 'media'].map(componentId => ({ componentId, workflowId: 'workflow', platformIds: ['tool'], ownerRoleId: 'operator', supportRoleIds: ['operator'], proposedAgentSupportRoleIds: [] })),
    workSequence: [{ workflowId: 'workflow', ownerRoleId: 'operator', reviewRoleId: 'operator', dependsOn: [], reviewRequired: true }],
    lastEdited: { by: 'Not included in the estimator projection' } };
  const component = (id, unitCost, laborHours, allowance, authority = 'planning_allowance') => ({ id, name: id, unit: 'unit', lifecycleStatus: 'under_review', workflowId: 'workflow', ownerRoleId: 'operator', platformIds: ['tool'], cost: { unitCost, laborHours, nonLaborAllowance: allowance, authority } });
  return { contractVersion: 'ce-estimator-source-v1', storage: 'shared', workspace: { id: 3, slug: 'sharpdots' }, version: 7, baseRevision: 'synthetic-seed-v1', history: ['must not be returned'],
    catalog: { schema: 'sharpdots.launch-catalog.v1', catalogId: 'test-catalog', version: 7, policy: { currency: 'USD' }, products: [product],
      components: [component('setup', 100, { operator: 1 }, 0), component('delivery', 125, { operator: 1 }, 25), component('media', 1000, {}, 1000, 'pass_through_allowance')],
      roles: [{ id: 'operator', name: 'Operator', planningCostPerHour: 100, executorType: 'person', knownPeople: ['Private reference'], availableHoursPerWeek: null }],
      workflows: [{ id: 'workflow', name: 'Delivery workflow', ownerRole: 'operator', platformIds: ['tool'], supportAgentRoleIds: [] }],
      platforms: [{ id: 'tool', name: 'Reference platform', referenceMonthlyCost: 900 }] } };
}
module.exports = { sourceFixture };
