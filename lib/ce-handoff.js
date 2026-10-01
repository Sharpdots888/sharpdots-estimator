const { createHash, randomUUID } = require('node:crypto');
const M = require('../crm/model');
const catalog = require('../services/ce-catalog');
const { validateReceipt } = require('./ce-handoff-transport');

const SCHEMA = 'ce-estimator-intake-v1';
const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const digest = value => createHash('sha256').update(canonical(value)).digest('hex');
const fail = (code, message) => Object.assign(new Error(message), { statusCode: code });
const cents = amount => {
  if (amount === null || amount === undefined) return null;
  const value = Math.round(Number(amount) * 100);
  if (!Number.isSafeInteger(value) || value < 0) throw fail(409, 'Review the saved service amounts before handoff');
  return value;
};
const requiresCE = o => o.kind !== 'Print' || o.handoffs.engagement.status !== 'not-required';
const sourceIdentity = o => digest({ status: o.status, account: o.account, accountRef: o.accountRef,
  contact: o.contact, contactRef: o.contactRef, email: o.email, approval: o.approval,
  offer: o.records.filter(r => r.role === 'Primary offer').map(r => [r.collection, r.number, r.version]),
  oneTime: o.oneTime, monthly: o.monthly, term: o.term, billing: {
    contact: o.billing.contact, terms: o.billing.terms, start: o.billing.start, deposit: o.billing.deposit, po: o.billing.po
  }, handoff: {
    owner: o.handoffs.engagement.owner, target: o.handoffs.engagement.target,
    scope: o.handoffs.engagement.scope, assets: o.handoffs.engagement.assets
  } });

function summary(h) {
  if (!h) return null;
  return { status: h.status, id: h.id, attempts: h.attempts || 0, updatedAt: h.updatedAt,
    issues: h.issues || [], lastError: h.lastError || '', receipt: h.receipt || null,
    proposal: h.packet?.source.proposal || null, services: h.packet?.source.services || null,
    catalog: h.packet?.source.catalog || null, review: h.packet?.review || null };
}

function afterSave(oldHandoff, opportunity, now = new Date().toISOString()) {
  if (!oldHandoff) return opportunity.status === 'won' && requiresCE(opportunity)
    ? { status: 'needs-review', attempts: 0, updatedAt: now, issues: [] } : null;
  const h = structuredClone(oldHandoff);
  if (h.sourceIdentity && h.sourceIdentity !== sourceIdentity(opportunity)) {
    // A timed-out request may already exist in CE. Never replace that packet.
    h.status = h.attempts ? 'amendment-review' : 'needs-review';
    h.issues = [h.attempts ? 'Source or handoff details changed. Reconcile with CE before an amendment.' : 'Review the changed opportunity before preparing the handoff.'];
    h.updatedAt = now;
  }
  return h;
}

async function preparePacket({ opportunity: o, readRecord, receivingOwnerId, operatorId }) {
  if (o.status !== 'won') throw fail(409, 'Close the opportunity as won before preparing CE intake');
  const issues = M.closeIssues(o);
  if (!requiresCE(o)) issues.push('This opportunity does not require Client Engagement');
  if (!o.accountRef || !o.contactRef) issues.push('Link the existing client and contact');
  if (!o.email?.trim()) issues.push('Add the client contact email');
  if (!receivingOwnerId) issues.push('Assign an active receiving owner');
  const target = o.handoffs.engagement.target;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(target) || !Number.isFinite(Date.parse(target)) ||
      new Date(target).toISOString().slice(0, 10) !== target) issues.push('Set a valid target start date');
  if (!o.handoffs.engagement.scope.trim()) issues.push('Confirm the delivery scope');
  const offer = o.records.find(r => r.role === 'Primary offer' && r.collection === 'proposals');
  if (!offer) issues.push('Attach a saved proposal as the primary offer');
  if (issues.length) throw fail(409, issues.join('. '));
  const proposal = await readRecord('proposals', offer.number, offer.version);
  const p = proposal?.snapshot?.proposal;
  const ref = p?.sourceRecords?.services;
  if (!p?.includedSections?.includes('services') || !ref?.number || !Number.isSafeInteger(Number(ref.version))) {
    throw fail(409, 'The accepted proposal must include a pinned Services record');
  }
  const services = await readRecord('services', ref.number, Number(ref.version));
  const config = services?.snapshot?.serviceEngagement?.catalogConfiguration;
  if (config?.schema !== 'ce-services-configuration-v1' || Number(config.source?.workspace?.id) !== 3 || config.source?.workspace?.slug !== 'sharpdots') {
    throw fail(409, 'The saved Services version must use the Client Engagement catalog');
  }
  if (!config.catalogFingerprint || !config.source.revision || !config.products?.length) throw fail(409, 'The saved catalog source is incomplete');
  if (!Number.isInteger(config.termMonths) || config.termMonths < 1 || config.termMonths > 120 || config.termConfirmed !== true) {
    throw fail(409, 'Confirm the Services engagement term and save the proposal source version before handoff');
  }
  const calculated = catalog.calculate(config);
  if (!calculated.lines.length) throw fail(409, 'The saved Services version has no included components');
  const doc = M.acceptedDoc(o);
  const acceptance = doc ? { method: 'docuseal', transactionId: doc.id, submissionId: doc.reference,
    recipient: doc.recipient, status: doc.status, proposalVersion: Number(doc.version) }
    : { method: 'operator-attested', approvalMethod: o.approval.method, reference: o.approval.reference };
  const reviewIssues = ['Confirm agreed scope and pricing against the accepted offer', 'Assign delivery owners and reviewers', 'Approve delivery admission in Client Engagement'];
  if (!calculated.complete) reviewIssues.push('Resolve unknown component costs');
  if (!o.handoffs.engagement.assets) reviewIssues.push('Confirm assets and dependencies');
  if (Number(config.termMonths) !== o.term) reviewIssues.push('Reconcile Services term with the opportunity term');
  // Intake carries catalog review requirements even when commercial acceptance exists.
  reviewIssues.push('Review catalog product definitions before delivery');
  const body = { schema: SCHEMA, kind: 'accepted_proposal_intake',
    admission: { workTrackingAllowed: false, externalExecution: false, invoicing: false },
    source: { system: 'sharpdots-estimator', workspace: { id: 3, slug: 'sharpdots' },
      opportunity: { id: o.id, number: o.number, closedAt: o.closedAt },
      proposal: { number: offer.number, version: Number(offer.version), sha256: digest(proposal.snapshot) },
      services: { number: services.number, version: Number(services.version), sha256: digest(services.snapshot) },
      catalog: { ...structuredClone(config.source), catalogId: config.catalogId, fingerprint: config.catalogFingerprint } },
    client: { accountId: o.accountRef, contactId: o.contactRef, name: o.account, contact: o.contact, email: o.email },
    intake: { title: o.title, ownerId: Number(receivingOwnerId), targetStart: o.handoffs.engagement.target,
      scope: o.handoffs.engagement.scope, assetsConfirmed: o.handoffs.engagement.assets, preparedBy: Number(operatorId) },
    acceptance,
    agreedOpportunity: { currency: 'USD', oneTimeCents: cents(o.oneTime), monthlyCents: cents(o.monthly), termMonths: o.term },
    servicePricing: { currency: 'USD', termMonths: config.termMonths,
      oneTimePriceCents: cents(calculated.activationPrice), monthlyPriceCents: cents(calculated.monthlyPrice),
      termPriceCents: cents(calculated.termPrice), oneTimeCostCents: cents(calculated.activationCost),
      monthlyCostCents: cents(calculated.monthlyCost), termCostCents: cents(calculated.termCost), complete: calculated.complete },
    configuration: structuredClone(config),
    components: calculated.lines.map(({ component, unitCost, extendedCost, ...line }) => ({ ...line,
      unitCostCents: cents(unitCost), extendedCostCents: cents(extendedCost), component: structuredClone(component) })),
    capacity: structuredClone(calculated.capacity),
    snapshots: { proposal: proposal.snapshot, services: services.snapshot },
    review: { status: 'intake-review', issues: reviewIssues },
    billing: { status: o.billing.status, contact: o.billing.contact, terms: o.billing.terms,
      start: o.billing.start, depositPercent: o.billing.deposit, purchaseOrder: o.billing.po, relay: 'not-connected' } };
  if (Buffer.byteLength(JSON.stringify(body)) > 2_000_000) throw fail(409, 'Handoff exceeds the supported size; review the saved source records');
  return { ...body, sha256: digest(body) };
}

function createHandoffStore({ transaction, actor, get, transport, now = () => new Date().toISOString() }) {
  async function lock(c, id, user, rowVersion) {
    const who = await actor(user, c);
    await c.query('SELECT id FROM public.sfpq_opportunities WHERE id=$1 FOR UPDATE', [id]);
    const o = await get(id, c);
    if (o.rowVersion !== Number(rowVersion)) throw fail(409, 'This opportunity changed. Reload before handing off');
    const state = (await c.query('SELECT state FROM public.sfpq_opportunity_state WHERE opportunity_id=$1', [id])).rows[0].state;
    return { who, o, state };
  }
  async function write(c, id, who, state, action) {
    await c.query('UPDATE public.sfpq_opportunity_state SET state=$2 WHERE opportunity_id=$1', [id, state]);
    await c.query('UPDATE public.sfpq_opportunities SET updated_by_operator_ref=$2 WHERE id=$1', [id, who.id]);
    await c.query('INSERT INTO public.sfpq_opportunity_audit(opportunity_id,operator_id,action,detail) VALUES($1,$2,$3,$4)',
      [id, who.id, action, { handoffId: state.ceHandoff.id, status: state.ceHandoff.status, attempt: state.ceHandoff.attempts,
        sha256: state.ceHandoff.packet?.sha256, receipt: state.ceHandoff.receipt || null }]);
  }
  async function prepare(user, id, input) {
    return transaction(async c => {
      const { who, o, state } = await lock(c, id, user, input.rowVersion);
      if (state.ceHandoff?.attempts) throw fail(409, 'A CE delivery was already attempted. Retry the frozen handoff or reconcile its receipt');
      const owner = (await c.query('SELECT id FROM public.users WHERE username=$1 AND is_active=true', [o.handoffs.engagement.owner])).rows[0];
      let packet;
      try {
        packet = await preparePacket({ opportunity: o, operatorId: who.id, receivingOwnerId: owner?.id,
          readRecord: async (collection, number, version) => (await c.query(`SELECT r.number,v.version,v.snapshot FROM public.sfpq_crm_records r
            JOIN public.sfpq_crm_record_versions v ON v.record_id=r.id WHERE r.collection=$1 AND r.number=$2 AND v.version=$3`, [collection, number, version])).rows[0] });
      } catch (error) {
        if (error.statusCode !== 409) throw error;
        state.ceHandoff = { ...state.ceHandoff, status: 'needs-review', attempts: 0, updatedAt: now(), issues: [error.message] };
        await write(c, id, who, state, 'CE intake requires source review');
        return get(id, c);
      }
      state.ceHandoff = { id: randomUUID(), status: 'ready', packet, sourceIdentity: sourceIdentity(o), attempts: 0, updatedAt: now(), issues: [] };
      await write(c, id, who, state, 'CE intake prepared from saved proposal and Services versions');
      return get(id, c);
    });
  }
  async function send(user, id, input) {
    const attempt = await transaction(async c => {
      const { who, o, state } = await lock(c, id, user, input.rowVersion);
      const h = state.ceHandoff;
      if (h?.status === 'received') return { done: true, result: o };
      if (!h?.packet || !['ready', 'failed', 'sending'].includes(h.status)) throw fail(409, 'Prepare and review the CE intake first');
      if (o.status !== 'won' || h.sourceIdentity !== sourceIdentity(o)) throw fail(409, 'Opportunity changed; reconcile the handoff before sending');
      const accepted=M.acceptedDoc(o);
      if (M.closeIssues(o).length || h.packet.acceptance.method==='docuseal' &&
          (!accepted || accepted.id!==h.packet.acceptance.transactionId || accepted.reference!==h.packet.acceptance.submissionId)) {
        throw fail(409, 'The recorded acceptance is no longer current. Reconcile before sending to CE');
      }
      if (h.status === 'sending' && Date.parse(h.leaseUntil) > Date.parse(now())) throw fail(409, 'CE handoff is in progress. Reload to check its receipt');
      if (!transport.enabled) throw fail(503, 'CE intake connection is not enabled. The prepared handoff remains saved');
      h.status = 'sending'; h.attempts += 1; h.attemptId = randomUUID(); h.updatedAt = now(); h.lastError = '';
      h.leaseUntil = new Date(Date.parse(now()) + 60000).toISOString();
      await write(c, id, who, state, 'CE intake delivery attempted');
      return { who, handoff: structuredClone(h) };
    });
    if (attempt.done) return attempt.result;
    let receipt, error;
    try {
      receipt = validateReceipt(await transport.send({ packet: attempt.handoff.packet, idempotencyKey: attempt.handoff.id, actor: attempt.who }), attempt.handoff.packet, attempt.handoff.id);
    }
    catch (e) { error = e.safeMessage || 'CE receipt was not confirmed. Retry uses the same handoff identity'; }
    return transaction(async c => {
      await c.query('SELECT id FROM public.sfpq_opportunities WHERE id=$1 FOR UPDATE', [id]);
      const state = (await c.query('SELECT state FROM public.sfpq_opportunity_state WHERE opportunity_id=$1', [id])).rows[0].state;
      const h = state.ceHandoff;
      if (h?.attemptId !== attempt.handoff.attemptId) return get(id, c);
      h.updatedAt = now(); delete h.leaseUntil;
      h.lastError = error || '';
      if (receipt) h.receipt = receipt;
      // Reopening or changing the opportunity during the HTTP request cannot release new scope.
      if (h.status !== 'amendment-review') h.status = error ? 'failed' : 'received';
      await write(c, id, attempt.who, state, error ? 'CE intake receipt not confirmed' : 'CE intake receipt recorded; delivery admission pending');
      return get(id, c);
    });
  }
  return { prepare, send };
}

module.exports = { SCHEMA, canonical, digest, summary, afterSave, preparePacket, createHandoffStore };
