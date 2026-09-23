# Operating Map

## Opportunity CRM Draft Lane

- Owner: Codex, current opportunity CRM task.
- State: Warren review response prepared; confirmed UUID FKs and default-ACL hardening
  tested on disposable local PostgreSQL. Portal identity mapping and designated
  remote staging/owner credentials remain blockers before production migration.
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
