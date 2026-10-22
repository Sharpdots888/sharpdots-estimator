# Additional proposal line items

October 22, 2026. Scope authorized by John: Ray needs to add a single line to
an existing Generic Events proposal with a loaded service. User requested
implementation and deployment before returning to CE planning.

## Behavior

In Proposal → Content → Additional proposal items, choose Add line item.
Enter name, description, quantity and unit selling price. Select one-time or
monthly, with an explicit term for monthly items. Apply, then Save the proposal.
Edit and Remove apply to this proposal only. Standard record versions retain
prior proposals and the loaded Services source remains pinned and unchanged.

Additional items appear as their own priced section and subtotal in the document
preview/print/PDF surface and CSV export. The editor flags these as adjustments
from the saved service. A selling price is not treated as a delivery cost.
These items do not change catalog pricing, source Services, opportunity value,
payment schedule or any original service subtotal.

CE handoff explicitly refuses proposals containing additional items until their
scope and pricing are reconciled with the delivery plan. The current receiving
contract cannot represent these new items; silently omitting them is prohibited.
Existing client-publication restrictions on draft catalog pricing still apply.
This release does not expand the CE handoff contract or vNext execution scope.

## Storage and validation

Optional `proposal.additionalLines` lives in the existing proposal snapshot.
No migration, grant, credential, provider, auth or deployment-setting change.
Validation covers text length, unique IDs, finite quantities/prices, explicit
zero-price items, one-time/monthly cadence, 1–120 monthly terms and safe totals.
Normal server save validates again; stale record saves retain version conflicts.

## Verification

118 tests pass, including isolated PGlite versioned save/read, unchanged previous
versions and Services, rejection of malformed prices, monthly totals and explicit
CE handoff rejection. Browser checks used fictional local content to verify add,
edit, monthly term, save and preview. The local CRM preview does not retain its
in-memory workspace-record list across page reloads; database roundtrip tests
exercise the real persisted snapshot path. No real client record was edited.

## Publication checkpoint

Prepared on `codex/proposal-single-line` from a03bfa5 (runtime baseline91fac0e6).
Fresh read-only release check: quoting-proposals v55, release
1fb39f46-6ba2-4a88-b04c-529988b1c501, slug79254111-f877-4ef7-89b0-cc4c5210922e.
Publish only this Estimator delta through an exact frozen source archive, without
merging main or changing CE/shared vNext. Recheck baseline before publication.

Deployment was explicitly authorized. The separate recovery preparation is
pending a specific sensitive-data approval: automatic approval review rejected
reading and privately backing up full Heroku config-vars because they may contain
credentials. That rejected operation was not executed. Do not reuse old secrets
as a workaround. Before release, obtain authorized fresh app-only backup and
isolated restore verification, then verify source hashes and preserved records.

Execution tracking: [Estimating App - Project Calculation](https://app.clickup.com/t/868jnxdp7).
Reference model: docs/living-ops-services.md and its linked Drive cascade source.
No new relevant Zoom-derived decision was supplied for this narrow change.
