# Closed Proposal To Client Engagement

## Current State

User request, September 30: complete the downstream handoff so a closed proposal
does not stop in Estimator. The catalog reader is already live and the user has
confirmed the real products appear. This change is a separate, **local producer
implementation**, not an activated integration.

Estimator has durable preparation, source pins, transport, receipt and retry
controls. CE's current [PR100](https://github.com/Sharpdots888/sharpdots-apps/pull/100)
is a **draft rehearsal only**, not a production receiver. Its head a2b8423 and
`domain/estimator-handoff.mjs` preserve exact S versions and configured delivery
scope; they do not accept the intake contract below. The receiver must be agreed,
implemented and tested with the CE owner before enabling this transport. No CE
files, credentials, production data, grants, schemas or releases were changed.

Tracking: [Estimator task](https://app.clickup.com/t/868jnxdp7). External status
and cross-chat coordination are pending permission; this document is the local
execution record, not a claim that ClickUp or the CE task has been updated.

## Operator Flow

1. Save a proposal with Services included and pinned to its exact saved version.
   Attach the proposal as the opportunity's primary offer. Record current
   commercial acceptance and complete the existing close review.
2. Closing a Services/Mixed opportunity as won creates **CE intake needed** in
   server-owned opportunity state. Older won opportunities surface the same need
   when read. It is visible in Handoffs and Needs attention.
3. In Handoff & billing, assign a receiving owner, target start and delivery
   scope. Save intake details, then **Prepare CE intake**. Missing customer links,
   source records or required details become persistent review issues.
4. Preparation reads the immutable P version and the S version that P references,
   even if a newer S version exists. The browser cannot provide the package or
   claim signature/receipt status. The original opportunity total remains separate
   from configured Services totals; Print/other sections are not repriced as CE work.
5. Once both sides are qualified and activated, **Send to CE** confirms the saved
   P/S versions. A valid receipt means **received for intake review**, not permission
   to start delivery, reserve capacity, execute agents or invoice.
6. A lost response remains visible and retry sends the same identity and frozen
   package. Reopening/changing the source or delivery/terms after an attempt requires
   amendment reconciliation; it never creates an automatic replacement engagement.

There is no background sender or auto-resume after process restart. Closing
creates a durable next action; an operator explicitly reviews and sends it.
Expired attempt leases permit that same explicit retry. Production's existing
manual coordination and Xero fields remain separate. CE receipt cannot be set by
the old manual "Confirm received" action.

## Producer Contract Candidate

`ce-estimator-intake-v1` / `accepted_proposal_intake` contains:

- O identity, frozen P/S numbers and versions, SHA-256 snapshot hashes, CE catalog
  identity/revision/fingerprint and original configured product definitions.
- Existing company/contact IDs, recipient details, receiving owner ID, requested
  start, agreed delivery scope and asset-readiness flag.
- Server-observed completed DocuSeal transaction/submission identity, or a clearly
  distinguished operator-attested PO/written-approval/rationale. No forged browser
  completion is accepted. DocuSeal acceptance is rechecked before each attempt.
- Agreed opportunity values separately from Services prices/costs, in integer
  cents. Unknown costs/prices remain null. No allocation of mixed-project totals
  to service components is invented.
- Selected component rows, exclusions, quantities, cadence, source workflows,
  role/platform references, shared-scope decisions, price overrides, term and
  capacity demand. These are configured scope, not assigned people or reservations.
- Billing coordination fields marked `relay: not-connected`.
- Mandatory `workTrackingAllowed:false`, `externalExecution:false`,
  `invoicing:false`, and `review.status:intake-review`.

The payload digest is SHA-256 over recursively key-sorted JSON excluding `sha256`.
The packet is server-owned JSONB in the existing `sfpq_opportunity_state`, not a
new table. Browser responses return a summary only. Normal/older client saves
preserve the full ledger; attempt and receipt events append to the existing audit.
Every ledger mutation also advances the opportunity concurrency version.

Acceptance caveat: the current DocuSeal workflow stores browser-supplied document
HTML/snapshot. A completed matching P version is **not** proof of a cryptographic
binding between signed PDF bytes and the immutable CRM snapshot. The receiving
intake must keep agreement/source reconciliation explicit; this slice does not
silently promote the existing signing model into stronger acceptance authority.
The current CE client-publishing guard remains unchanged.

## Receiver Review Requirements

Proposed fixed route on the existing CE app:
`POST /api/integrations/estimator/intakes`.

- A new narrowly scoped service write credential, never the catalog read key,
  Portal cookie or warehouse credential. HTTPS, fixed host, no redirects, no
  browser cookies/origin, bounded JSON request, exact workspace `3 / sharpdots`.
- Validate current sender and receiver membership and permitted receiving role;
  an Estimator user ID is not sufficient authority to grant CE access. Do not
  create profiles, general grants, CER records or agent identities.
- Validate schema, source refs, snapshot digests, disabled execution flags and
  acceptance provenance. Preserve unknown cost/price review blockers. No claiming
  draft CE rehearsal records are accepted customer work.
- Deduplicate at the commercial-source identity as well as `Idempotency-Key`.
  Same P/S/opportunity and same digest returns the original engagement; changed
  content/version for existing work requires explicit amendment review. Reject
  key reuse for different content. Do not rely only on Estimator's retry behavior.
- Persist intake snapshot, existing-authorized membership and activity atomically.
  Use a supported intake read model in the real CE UI, not an incompatible mapping
  version that fails when a person opens the engagement. A receipt is issued only
  after the receiving commit succeeds.
- Return `ce-estimator-intake-receipt-v1` with exact `idempotencyKey`, `sha256`,
  saved `engagementId`, `receivedAt`, and `status:intake-review`. Estimator accepts
  no provider-supplied navigation URL; the UI opens the known CE origin.
- Keep delivery-admission approval and later status synchronization separate.
  This candidate does not yet implement CE acceptance/progress callbacks.

These receiver rules are a coordination proposal, **not** a verified production
contract or approval to change CE authentication, memberships or data ownership.

## Transport And Activation

Estimator's proposed transport is disabled unless
`ESTIMATOR_CE_HANDOFF_ENABLED=true` and a new `ESTIMATOR_CE_HANDOFF_KEY` is present.
The key must be 64 lowercase hex characters and differ from the catalog read key.
No credentials were generated or configured. Do not enable it against the current
CE release, which does not have this receiver.

`POST /api/crm/opportunities/:id/ce-handoff/prepare` and `/send` accept only the
current `rowVersion`. Existing Portal session/current CRM actor checks apply,
including when general app auth is disabled. Writes retain the same-origin
request marker and JSON requirement. Responses are no-store.

The HTTP attempt occurs outside the DB transaction after persisting a 60-second
lease. Transport has a 15-second deadline and 16 KB receipt limit. Timeouts,
unexpected statuses, invalid hashes and redirects never claim receipt. Provider
errors/bodies and secrets are not reflected. A concurrent reopen can retain the
real receipt without changing its amendment-review state.

Release gates: coordinate/approve the receiver contract; implement CE intake and
membership/read-model checks; rehearse both real services against disposable
storage; review paired changes; then obtain explicit production deployment and
write-credential/activation approval. Preserve the existing catalog reader and
DocuSeal setting. Disable the new flag to halt new sends without deleting records.
Never clear a failed/attempted ledger as a retry mechanism.

## Verification

- Node22 full suite: **66 passing**, including real-server anonymous/expired
  session denial in all auth modes, CRM request-marker and browser-payload rejection.
- Seven focused disposable-SQL/transport tests cover version pins, null costs,
  missing sources, permission/stale-version failures, forged receipts, lost
  responses, lease recovery, immutable retry and concurrent reopening.
- Browser rehearsal passed at 1440, 1188 and 390 pixels, including receipt readback,
  reload and reopened-opportunity amendment lock. `node scripts/ce-handoff-browser.cjs` uses loopback static
  assets and the real opportunity store in disposable PGlite. API interception
  and a simulated CE receipt are explicit. It is **not** cross-app delivery proof.
- Required remaining proof: the actual CE receiver, duplicate/conflict behavior,
  current membership rejection, protected intake readback and visible review UI.

No production/customer sends, invoices, Xero calls, schema migration, CE engagement
creation, Portal change or catalog edit was performed during implementation.
