const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const { PGlite } = require('@electric-sql/pglite');
const { createOpportunityStore } = require('../lib/opportunity-store');
const { preparePacket } = require('../lib/ce-handoff');
const P = require('../services/ce-pricing');
const M = require('../crm/model');
const admin = { id: 45, isAdmin: true };
const fixturePath = process.env.CE_PAIRED_FIXTURE || '/private/tmp/ce31-estimator-cost-handoff/paired-source.json';

test('actual JSONB versions preserve baseline and proposal-only pricing, then freeze fictional packets', async () => {
  const db = new PGlite();
  const query = async (sql, values) => { const r = await db.query(sql, values); return { ...r, rowCount: r.rows.length || r.affectedRows || 0 }; };
  const client = { query, release() {} };
  try {
    await db.exec(`CREATE ROLE db_admin;CREATE TABLE users(id integer PRIMARY KEY,username text,is_admin boolean,is_active boolean);
      INSERT INTO users VALUES(45,'fictional-lead',true,true),(46,'denied',false,true);
      CREATE TABLE sfvc_companies(company_id uuid PRIMARY KEY);CREATE TABLE sfvc_people(person_id uuid PRIMARY KEY);
      CREATE TABLE sfvc_company_people(company_id uuid,person_id uuid);`);
    for (const file of ['001_sfpq_opportunities.sql', '002_opportunity_persistence.sql']) await db.exec(readFileSync(path.join(__dirname, '../migrations', file), 'utf8'));
    const catalog = P.adaptPaired(JSON.parse(readFileSync(fixturePath, 'utf8')), { id: 3, slug: 'sharpdots' });
    let reads = 0;
    const store = createOpportunityStore({ ...client, connect: async () => client }, undefined, undefined, async () => { reads++; return catalog; });
    const readRecord = async (collection, number, version) => (await query(`SELECT r.number,v.version,v.snapshot FROM sfpq_crm_records r JOIN sfpq_crm_record_versions v ON v.record_id=r.id WHERE r.collection=$1 AND r.number=$2 AND v.version=$3`, [collection, number, version])).rows[0];
    const save = (collection, name, snapshot, old) => store.saveRecord(admin, old?.id || null, { collection, name, snapshot, version: old?.version, creationKey: randomUUID() });
    const legacy = P.selectProducts(P.adaptCatalog(require('../services/ce-fixture.cjs').sourceFixture(), { id: 3, slug: 'sharpdots' }), ['service-a']);
    const oldS = await save('services', 'Fictional legacy preservation', { serviceEngagement: { catalogConfiguration: legacy } });
    const oldP = await save('proposals', 'Fictional legacy accepted baseline', { proposal: { includedSections: ['services'], sourceRecords: { services: { number: oldS.number, version: 1 } } } });
    const oldBefore = P.digest([await readRecord('services', oldS.number, 1), await readRecord('proposals', oldP.number, 1)]);
    const baseline = P.selectProducts(catalog, ['sm-pipeline']);
    const services = await save('services', 'CE31B fictional Services', { serviceScenario: 'livingOps', serviceEngagement: { name: 'CE31B fictional Services', products: [], customLines: [], catalogConfiguration: baseline } });
    const storedS = await readRecord('services', services.number, 1);
    assert.equal(reads, 1);
    const forged = structuredClone(services.snapshot);
    const product = forged.serviceEngagement.catalogConfiguration.products[0];
    product.pricingPolicy.margin = .1; product.productDefinition.targetContributionMargin = .1;
    const { fingerprint, ...body } = product; product.fingerprint = P.digest(body);
    await assert.rejects(save('services', 'Reject caller-resealed baseline', forged, services), /baseline differs/);
    const changedDefinition = structuredClone(services.snapshot);
    const changedProduct = changedDefinition.serviceEngagement.catalogConfiguration.products[0];
    changedProduct.components[0].name = 'Replaced inherited definition';
    const { fingerprint: ignored, ...changedBody } = changedProduct; changedProduct.fingerprint = P.digest(changedBody);
    await assert.rejects(save('services', 'Reject inherited definition', changedDefinition), /baseline differs/);
    assert.equal(P.digest(storedS.snapshot.serviceEngagement.catalogConfiguration), P.digest(baseline));
    assert.equal(P.digest(storedS.snapshot.cePricingProof), P.digest(P.proof(baseline)));
    let proposal = await save('proposals', 'CE31B fictional baseline proposal', { proposal: { title: 'CE31B local qualification only', includedSections: ['services'], sourceRecords: { services: { number: services.number, version: 1 } } } });
    const p1Before = P.digest(await readRecord('proposals', proposal.number, 1));
    const makeOpportunity = version => M.make({ id: 'local-ce31b-only', number: 'O-LOCAL-31B', closedAt: '2026-10-19T12:00:00.000Z', title: 'CE31B fictional qualification - no delivery or invoicing', kind: 'Services', status: 'won', stage: 'won',
      account: 'Fictional CE31B account', accountRef: '11111111-1111-4111-8111-111111111111', contact: 'Fictional buyer', contactRef: '22222222-2222-4222-8222-222222222222', email: 'ce31b@example.invalid',
      term: 3, oneTime: 7600, monthly: 9925, approval: { method: 'Purchase order', reference: 'FICTIONAL-LOCAL-ONLY' }, records: [{ collection: 'proposals', number: proposal.number, version, role: 'Primary offer' }],
      handoffs: { production: { status: 'not-required' }, engagement: { status: 'draft', owner: 'fictional-lead', target: '2026-11-01', scope: 'Local verification only. Do not execute, invoice or send.', assets: true } } });
    const baselinePacket = await preparePacket({ opportunity: makeOpportunity(1), readRecord, receivingOwnerId: 45, operatorId: 45 });
    let effective = P.configureProduct(baseline, 'sm-pipeline', baseline.products[0].recipe[2].key, { quantity: 3, unitCost: 375.125, sellRate: 600, reason: 'Fictional proposal-specific test rate' });
    effective = P.configurePricing(effective, 'sm-pipeline', { method: 'markup', markup: .6, reserve: .1, feeOverrides: { once: null, monthly: null }, reason: 'Fictional proposal-specific markup' });
    const override = { schema: 'ce-proposal-pricing-v1', sourceRecord: { number: services.number, version: 1 }, baseConfigurationHash: P.digest(baseline), configuration: effective };
    proposal = await save('proposals', 'CE31B fictional proposal adjustment', { proposal: { ...proposal.snapshot.proposal, servicesPricingOverride: override } }, proposal);
    const acceptedTotals = P.calculate(effective);
    const packet = await preparePacket({ opportunity: { ...makeOpportunity(2), oneTime: acceptedTotals.activationPrice, monthly: acceptedTotals.monthlyPrice }, readRecord, receivingOwnerId: 45, operatorId: 45 });
    assert.equal(packet.pricingEvidence.basis, 'proposal');
    assert.equal(packet.pricingEvidence.effectiveConfigurationHash, P.digest(effective));
    assert.equal(packet.source.services.sha256, P.digest(storedS.snapshot));
    assert.equal(packet.servicePricing.termPriceCents, Math.round(P.calculate(effective).termPrice * 100));
    assert.equal(packet.configuration.products[0].recipe[2].unitCost, baseline.products[0].recipe[2].unitCost);
    assert.equal(P.digest(await readRecord('proposals', proposal.number, 1)), p1Before);
    assert.equal(P.digest(await readRecord('services', services.number, 1)), P.digest(storedS));
    assert.equal(P.digest([await readRecord('services', oldS.number, 1), await readRecord('proposals', oldP.number, 1)]), oldBefore);
    const bad = structuredClone(proposal.snapshot); bad.proposal.servicesPricingOverride.baseConfigurationHash = 'f'.repeat(64);
    await assert.rejects(save('proposals', 'Reject wrong baseline', bad, proposal), /baseline/);
    await assert.rejects(store.saveRecord({ id: 46 }, null, { collection: 'services', name: 'Denied', creationKey: randomUUID(), snapshot: services.snapshot }), e => e.statusCode === 403);
    const reset = structuredClone(proposal.snapshot); delete reset.proposal.servicesPricingOverride;
    proposal = await save('proposals', 'CE31B fictional reset', reset, proposal);
    assert.equal(proposal.snapshot.cePricingProof.configurationHash, P.digest(baseline));
    assert.equal(P.digest((await readRecord('proposals', proposal.number, 2)).snapshot), packet.source.proposal.sha256);
    const readsBeforeVersion = reads;
    const serviceVersion = structuredClone(services.snapshot);
    serviceVersion.serviceEngagement.catalogConfiguration = P.configureTerm(baseline, 6, 'Fictional later estimate, not accepted proposal');
    await save('services', 'CE31B fictional later Services version', serviceVersion, services);
    assert.equal(reads, readsBeforeVersion);
    assert.equal(P.digest(await readRecord('services', services.number, 1)), P.digest(storedS));
    if (process.env.CE31B_RECEIVER_PATH) {
      const { validateIntake } = await import(require('node:url').pathToFileURL(process.env.CE31B_RECEIVER_PATH));
      validateIntake(baselinePacket); validateIntake(packet);
    }
    if (process.env.CE31B_WRITE_FIXTURES === 'true') {
      const directory = path.dirname(fixturePath);
      writeFileSync(path.join(directory, 'ce31b-baseline-packet.json'), JSON.stringify(baselinePacket, null, 2));
      writeFileSync(path.join(directory, 'ce31b-proposal-packet.json'), JSON.stringify(packet, null, 2));
    }
  } finally { await db.close(); }
});
