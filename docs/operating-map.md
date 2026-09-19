# Operating Map

## Opportunity CRM Draft Lane

- Owner: Codex, current opportunity CRM task.
- State: local draft built; verification and user review.
- Branch: `codex/opportunity-crm-draft` from `origin/main` (`8faa789`).
- Worktree: `/Volumes/JTMMX/Users/JT/Documents/estimator-crm-draft`.
- Files owned: `crm/`, opt-in script/style inclusions in `index.html`,
  `CRM_DRAFT.md`, opportunity additions to `FIELD_REGISTRY.md`, this map.
- ClickUp: https://app.clickup.com/t/868jnxdp7
- Preview: localhost:4187, static only; no database or production API calls.
- Scope: Pipeline / Proposals / Quote shell and local opportunity lifecycle draft.
- Production/DocuSeal/Xero schema changes, deployment, and live sends: excluded.

## Parallel Work Boundary

The original `New project` checkout has preexisting UI changes in `app.js`,
`index.html`, and `styles.css`, plus reference files. This lane does not modify,
stash, commit, or revert those changes. `fulfillmate-pricing-review.md` is excluded.
Do not replace the shared checkout with this worktree or merge without coordinating
the `index.html` entrypoint. Main production runtime remains unchanged unless the
local `crm=1` preview is explicitly used. See `CRM_DRAFT.md` for integration gates.
