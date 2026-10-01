# Operating Map

## Latest Release - October 1

- John approved the paired merge and code-only deployment. Estimator PR42 is
  merged into main and live as v53; CE PR100/102 are merged into its existing
  catalog release branch and live as v29. Exact release pins and verification:
  [release record](ce-handoff-release-2026-10-01.md).
- John subsequently approved dedicated credential setup and activation. CE is
  now v30 and Estimator v54 with both handoff flags enabled; exact code slugs are
  unchanged. Private key readback, current lead eligibility and protected-route
  checks pass. Existing catalog, Portal and DocuSeal settings are preserved.
- Controlled signed-in transfer/receipt verification is pending: browser control
  timed out and John was asked to designate a test O-number. O-000001, TEST Opp,
  is open and has no client/contact links. No intake/customer records were made.
- The pending release statements below describe the pre-release work. They are
  superseded by this record for deployment and the approved connection activation,
  not automatic delivery admission, execution or billing authority.

## Closed Proposal To CE Lane

- Owner: Build estimating app, `codex/ce-engagement-handoff`, from deployed
  PR41/main 6119417 in the isolated estimator-crm-draft checkout.
- User confirmed the real CE products appear, then requested completing the
  downstream handoff for closed proposals. Catalog connection is verified live
  (Estimator v52 / CE v28); older pending catalog notes below are historical.
- Scope: authoritative pinned proposal/Services package, durable server-owned
  handoff state, duplicate prevention, receiving acknowledgement and retry UI.
  Reuse existing opportunity state/audit storage; no schema changes required.
- CE session owns the receiver and draft delivery mapping in
  `/private/tmp/ce-pilot-readiness`. Do not modify its in-progress files. Current
  source contract is a local draft rehearsal, not live admission authority.
- No catalog-read-key reuse for writes, source price promotion, client sends,
  Xero calls, CER/n8n/Hermes execution, production configuration or deployment.
  New transport activation and release need explicit review/approval.
- State: 68 Node22 tests and three-width Estimator browser rehearsal passed.
  Actual Estimator-to-CE HTTP delivery/readback now passes with disposable SQL
  and a synthetic Portal, including duplicate protection and current access
  rejection. CE fixed receiving mobile overflow and repeated review wording;
  the real receiving page passes at 1440/1188/390. CE reports runtime-grant,
  rollback and backup/restore checks passed. CE is pinned at `d77711a` in draft
  PR102 (stacked on readiness PR100), Estimator implementation at `cf9ecf2`.
  The paired HTTP/three-width browser run passed again against the committed CE
  source. CE final Node22 suite: 188 pass / 3 existing DB-gated skips. Await paired
  review and explicit release/activation approval; no production delivery claimed.
  Contract/remaining gates:
  `docs/ce-proposal-handoff.md`.
- CE supplied PR100/head a2b8423 confirming the exact-version draft rehearsal;
  it explicitly has no production receiver or live accepted-proposal UI flow.
  John explicitly approved direct CE-chat coordination on September30; the
  producer commit4f62991 and receiving-side implementation request have now been
  sent to CE chat01a07874-3db6-7e00-8465-bdfeaa84a2e9. Estimator owns producer/
  receipt tracking; CE owns receiver/intake UI. Reconcile the contract and verify
  both handlers against disposable storage before requesting release approval.
  CE accepted the receiver/intake UI slice on
  `codex/client-engagement-estimator-intake` from readiness commit2d65ef6.
  Canonical Portal ID mapping is confirmed; the frozen preparer and current
  retrying actor may differ. Both remain attributed. The verified receipt opens
  CE's protected `/delivery/intakes/` screen at the encoded engagement ID.
  This approval does not authorize deployment or production credential/data changes.
  Existing drafts, saved versions, source catalog and parallel checkouts remain intact.
- Tracking: https://app.clickup.com/t/868jnxdp7

## Catalog Connection Lane

- September 30 release approval: user explicitly said proceed with the real CE
  connection after the synthetic preview was distinguished. Supersedes the older
  local-only boundary below for the two app releases and dedicated read key only.
- Pre-release production: Estimator v50, same dd6f7a6 code as v48, with newer DB
  config preserved; CE v26, subtree 4ec2058 from catalog branch 9bb0bff. Source PR
  must target that deployed feature branch; do not release unrelated main changes.
- Node22 verification: Estimator 59 pass, CE 180 pass / 3 gated skips, check/build,
  376 pricing cases and cross-repo read-only rehearsal pass. Hosted verification
  pending. Source writes, grants, schema, Portal auth and sends remain out of scope.

- Owner: current estimator session, `codex/services-catalog-connection`, from
  deployed PR40/main dd6f7a6 (Heroku v48).
- State: source and Estimator backends plus Services UI locally verified. User approved the scoped
  read-only connection, operator checks and publication of source planning
  [issue97](https://github.com/Sharpdots888/sharpdots-apps/issues/97).
- Scope: lossless recipe mapping, source pricing parity, subtractive configuration,
  snapshot tests, fixed-scope HTTPS reader and opt-in same-origin catalog route.
- Boundary: no deployment, source data edits, schemas/grants, live catalog imports,
  credentials provisioning or sends. CE source implementation is isolated.
  No cross-chat reply authorized. Services UI and client-output safeguards are
  locally implemented for review. Production connection remains disabled.
- Source: sharpdots-apps PR87, commit 9bb0bff and the eight-service projection at
  revision 136. Projection is test evidence, not a fresh production read.
- Integration needs an approved source endpoint/workspace authorization before
  the production Browse products path can be connected.
- Verified: 59 automated tests on Node 26 and 376 parity cases covering all eight
  products / 120 rows. Loopback route tests, current-user revocation, redaction,
  fixed workspace and deadline/byte limits passed. CE: 180 pass / 3 unrelated DB
  skips, static/build checks pass. Cross-repo HTTP/PGlite integration passed,
  including source SQL read-only enforcement. Node22 and actual signed-in
  production verification remain outstanding. Durable versions/old records preserved.
- Plan and source requirement: `docs/ce-catalog-connection.md`. The source worktree
  `/private/tmp/estimator-ce-catalog-read` on `codex/estimator-catalog-read` starts at
  9bb0bff and does not disturb the active Living Ops source branch. Source guide:
  `apps/client-engagement/docs/estimator-catalog-read.md` in that checkout.
  Backend disabled by default; no successful live read claimed. CE and legacy
  browser flows pass at desktop/mobile widths. Preview uses only synthetic data:
  http://127.0.0.1:4201/index.html?crm=1&cePreview=1.
- UI behavior: revision-pinned CE selection, component exclusions/overrides,
  contribution-margin pricing, shared-scope owner and term confirmation, capacity
  planning. Client PDF/CSV/print/DocuSeal blocked for draft catalog configurations;
  saved legacy calculations and imports preserved. No source approval shortcut.
- ClickUp: https://app.clickup.com/t/868jnxdp7
- Decision Log updated: "CE catalog: approved read-only Estimator connection".

## Release Baseline

- PR40 is merged and deployed as quoting-proposals v48. The older review/pending
  entries below describe historical implementation stages, not current release state.

## Separate Sales Pipelines Lane

- Owner: current estimator Codex session, `codex/separate-sales-pipelines` from
  deployed main b47d7a3. Local implementation verified and ready for user review.
- Scope: Services / Print-Production selector, scoped pipeline views and totals,
  creation defaults and explicit reassignment with audit. Existing opportunity
  state JSON stores membership; no new tables or migration.
- Older Print opportunities default to Print / Production; Services and Mixed
  default to Services. Explicit assignments override offering type.
- Owns `crm/`, narrow opportunity-store persistence/tests, and related docs.
  No auth, signing, billing, production writes or deployment in this request.
- Verification: 31 automated tests, pipeline and broader CRM/Services browser
  regressions, responsive checks, and disposable real PostgreSQL workflow passed.
- Preview: http://127.0.0.1:4198/index.html?crm=1&pipelines=1.
  Behavior and compatibility: `docs/sales-pipelines.md`. Not deployed.
- ClickUp: https://app.clickup.com/t/868jnxdp7. Prior interface and Services lanes
  below are now merged and deployed in v47; their earlier pending notes are historical.

## Living Ops Services Lane

- September 29: `codex/living-ops-services`, based on PR38's unmerged interface
  branch, in the same isolated estimator-crm-draft checkout.
- Scope: source-catalog import, product assembly, component costing, team-capacity
  planning, immutable S snapshots, and proposal rollups. Existing scenarios kept.
- Living Ops remains product definition owner. No live catalog endpoint assumed;
  no schema/auth/deployment/execution relay changes.
- Files: `services/`, narrow `app.js`, `index.html`, `crm/crm.js`, persistence tests,
  field registry and `docs/living-ops-services.md`.
- ClickUp: https://app.clickup.com/t/868jnxdp7. Review and release approval pending.

## Proposal and Quote Interface Lane

- September 29: branch `codex/proposal-quote-interface` from current main after
  PR37, in the isolated estimator-crm-draft checkout.
- Scope: shared save/version headers, Proposal Details/Content/Send, Quote
  item-first layout and collapsible details. No schema/auth/delivery changes.
- Files: app.js, index.html, editor-ui.js, editor-ui.css and interface docs.
- Review build and verification: `docs/proposal-quote-interface.md`.
- ClickUp: https://app.clickup.com/t/868jnxdp7. Production deployment awaits review.
- Shared New project checkout and its preexisting edits remain untouched.

## Named CRM Access Follow-up

- Ray's active Portal user ID 46 is non-admin; the v43 CRM pilot only accepted
  administrators, explaining the older interface on the current deployment.
- This branch adds `ESTIMATOR_CRM_USER_IDS` for active, named Portal users.
  CRM visibility and data operations share the same policy; DocuSeal sending
  remains under its separate administrator check.
- Release and validation: `docs/crm-user-access.md`.

## CRM Client/Contact Follow-up

- September 28: PR34 merged, migrations applied and CRM admin pilot deployed in
  v42; user confirms opportunity saves. Earlier pending-deployment notes below
  are historical.
- Branch: codex/crm-client-contact, isolated estimator-crm-draft checkout.
- Scope: replace duplicate text/lookups with top-level company/contact selectors;
  add new shared client/contact inline, using existing reference tables.
- Files: crm/crm.js, crm/crm.css, lib/opportunity-store.js, narrow server routes,
  persistence/browser tests, docs/crm-client-contact.md.
- No production customer writes or schema/auth changes. New release approval
  required for this follow-up. Shared New project checkout remains untouched.

## Database-Connected CRM Lane

- September 27: PR33 merged and deployed as quoting-proposals v40 (db0f69a),
  without production opportunity SQL. This supersedes the older draft status below.
- Current branch: codex/opportunity-persistence, based on db0f69a.
- Same isolated worktree; shared New project checkout remains untouched.
- Scope: authenticated admin pilot, opportunity CRUD, shared immutable calculator
  versions, pinned links, server signing status, handoffs/readiness and audit.
- Owned additions: lib/opportunity-store.js, crm/live.js, migration002, tests and
  release docs; narrow integrations in server.js, app.js, index.html and crm/.
- Local real-schema PostgreSQL and HTTP/browser tests passed. No production SQL,
  feature activation, credentials changes or sends in this implementation phase.
- Review and deployment gates: docs/opportunity-live-release.md. Separate owner
  credential remains required; user approval alone does not provide DB ownership.
- ClickUp: https://app.clickup.com/t/868jnxdp7

## Opportunity CRM Draft Lane

- Owner: Codex, current opportunity CRM task.
- State: September 27 local staging passed against production reference-table
  definitions with synthetic rows. Shared Portal IDs confirmed by John. No hosted
  staging required. Production owner credential verification and merge/execution
  approvals remain separate; no production writes or deployment.
- Branch: `codex/opportunity-crm-draft` from `origin/main` (`8faa789`).
- Worktree: `/Volumes/JTMMX/Users/JT/Documents/estimator-crm-draft`.
- Files owned: `crm/`, opt-in script/style inclusions in `index.html`,
  `CRM_DRAFT.md`, opportunity additions to `FIELD_REGISTRY.md`, this map.
- ClickUp: https://app.clickup.com/t/868jnxdp7
- Preview: localhost:4187, static only; no database or production API calls.
- Scope: Pipeline / Proposals / Quote shell and local opportunity lifecycle draft.
- Migration authoring approved: `migrations/001_sfpq_opportunities.sql` and
  `docs/opportunity-migration.md`; production execution, deployment, live sends and
  PR merge are not approved by this preparation request.
- Current main merged into this branch at `481dfb2`; catalog entrypoint versions
  retained. Only the CRM's opt-in includes differ in `index.html`.
- September 23: read-only production catalog inspection; no production writes.
  Exact proposed grants in `migrations/opportunity-runtime-grants.sql`; evidence
  and outstanding review gates in `docs/opportunity-migration.md`.

## Parallel Work Boundary

The original `New project` checkout has preexisting UI changes in `app.js`,
`index.html`, and `styles.css`, plus reference files. This lane does not modify,
stash, commit, or revert those changes. `fulfillmate-pricing-review.md` is excluded.
Do not replace the shared checkout with this worktree or merge without coordinating
the `index.html` entrypoint. Main production runtime remains unchanged unless the
local `crm=1` preview is explicitly used. See `CRM_DRAFT.md` for integration gates.
