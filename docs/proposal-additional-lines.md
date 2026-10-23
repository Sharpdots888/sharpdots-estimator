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

Added items are rows in the proposal's existing Services pricing table, with a
combined table total. With no Services section selected, they join estimate pricing.
There is no separate Additional items output table. An empty estimate-pricing
placeholder is suppressed when Services provides the pricing. PDF/print uses the
same preview table and CSV keeps the added rows in the corresponding section once.
Existing saved additionalLines are projected automatically without rewriting them.

The editor flags adjustments from the saved service. Selling price is not delivery
cost. Catalog, source Services, opportunity value and payment schedule remain
unchanged. One-time additions and monthly additions with explicit terms count once;
unknown original service pricing remains unknown.
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

Deployment and the specific private backup were explicitly authorized by John.
The automatic-review backup block was resolved by that additional approval.

## Live result — October 22, 2026

- Estimator **v56**, release `525303b8-e2a5-45ad-ac9a-b49e7d83a086`,
  slug `257c7c67-4716-4c78-9cf6-0ab562643f94`.
- Exact runtime source `3d208a6a5d13d4641921c36fcdc3522237fb67a7`;
  archive SHA256 `0723bb229455aedbd2e801258a3e2e620e917ad149d71035332ed9d4ff854bc3`.
  All 141 deployed source files match. This subsequent documentation update is
  not part of the frozen runtime. Draft PR44 remains unmerged.
- Fresh private settings/source/slug and app-only database backup was retained
  outside Git with directory0700/file0600. The native PostgreSQL16 isolated
  restore reproduced 36 app-owned tables, 7,047 full rows, 71 saved record
  versions, eight stored document artifacts and 30 sequence states. Only key
  stubs from owned references were used for shared identities, not shared rows.
- Complete restored rowsets and sequence states match. Three documented legacy
  CHECK renderings were qualified through equal parser trees (source character
  offsets excluded) plus allowed/rejected/NULL-value tests. All other schema
  definitions match exactly. Local restore server was stopped.
- Fresh pre- and post-release reads confirm unchanged complete app rowsets,
  schema and sequence states. Settings are unchanged. Web process is up;
  unauthenticated CRM/catalog/estimate/signing routes still reject with401.
- Normal Portal launch and P-100052 → Content → Add line item were verified
  on the deployed app. The empty form was cancelled. Ray's P-100052 v1,
  P-100051 v6 and S-100050 v8 were not edited or saved; no hosted test charge,
  signing request, CE handoff, invoice or workflow execution was created.
- Private recovery archive:
  `/Volumes/JTMMX/Users/JT/.codex/private-backups/estimator/2026-10-22-proposal-line/`.
  These private files are not Git or PR attachments. No main merge, auth,
  schema, settings, CE or vNext change was performed.

Execution tracking: [Estimating App - Project Calculation](https://app.clickup.com/t/868jnxdp7).
Reference model: docs/living-ops-services.md and its linked Drive cascade source.
No new relevant Zoom-derived decision was supplied for this narrow change.

## October 23 correction — one pricing table

John clarified the added line must join the existing pricing table rather than
create another table. This narrow correction continues the originally approved
Estimator feature and publication scope. Optional saved additionalLines remain
compatible with v56; no schema or data rewrite. The Services table adds one-time
amounts to Activation and recurring amounts to Monthly, retaining each manual
line's explicit term in scope text. Its overall price adds each line's extended
term total once. Standalone lines join the existing estimate-pricing table.

123 tests cover combined totals, differing monthly terms, unknown pricing,
existing saved-version preservation, same-table rendering/CSV and client catalog
publication restrictions. Local browser verifies the appended row. A fictional
review rendered by the actual table function shows one table and a combined total.
The supplied private client capture remains outside Git. No real proposal is edited.


## Correction published — October 23, 2026

- Estimator **v57**, release `91d63e74-2398-4c20-a43c-d228dc45a28d`,
  slug `1134e677-1a90-4bd1-9ab4-a1aeef6c009c`.
- Frozen runtime source `3d0dbcd68425589279a9ceadb8a510ce3efe5c35`;
  archive SHA256 `5c195b72044498d98924cfb55f25401bce92bc033a6ce9497a079b864b7f6932`.
  All 142 deployed source files match. This later documentation commit is not
  part of the runtime. Draft PR44 remains unmerged.
- Fresh private settings/source/slug and app-only database backup retained
  outside Git with directory0700/file0600. Isolated native PostgreSQL16 restore
  qualified 36 app-owned tables, 7,055 rows, 75 record versions, eight stored
  artifacts and 30 sequence states. Legacy CHECK parser equivalence and value
  tests pass. Restore server stopped.
- Full pre/post-release app rowsets, schema and sequences match; settings are
  unchanged. Web is up; anonymous private API requests still return401.
- Normal Portal launch and the existing saved proposal were inspected read-only.
  Its saved additional line appears beside the source service in the existing
  Services table, and the combined total is correct. No duplicate table or empty
  estimate table is shown. No client record was edited or saved for verification.
- Ray can refresh, reopen his saved proposal, and use Content → Proposal line
  items → Add line item → Apply → Save. Existing saved lines need no re-entry.
- Private recovery archive:
  `/Volumes/JTMMX/Users/JT/.codex/private-backups/estimator/2026-10-23-proposal-table/`.
  No main merge, schema, auth, settings, CE or vNext changes.
