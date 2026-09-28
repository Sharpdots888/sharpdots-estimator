# Operating Map

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
