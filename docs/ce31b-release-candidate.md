# CE31B Estimator Release Candidate

October 19, 2026. Local preparation only. Nothing pushed, merged or deployed;
no live calls by this Estimator lane. CE supplied its separately authorized,
read-only release metadata check below. No configuration, credential, grant,
schema or data changes.
CE's release owner assembles the paired release and asks John once for approval.

## Exact Source

- Repository: `https://github.com/Sharpdots888/sharpdots-estimator.git`.
- Candidate: `91fac0e6ea9967984647817114b3640a99a9284a`.
- Git tree: `7eb0cb80ccad6b7f2d24585c0bfbcfa7032ea4e8`.
- Source branch: `codex/ce-engagement-handoff`; subsequent documentation does
  not change this frozen candidate. Do not package a moving branch tip.
- 134 tracked files, 5,457,920-byte uncompressed Git archive. This is source,
  not a built Heroku slug. Existing tracked documentation, evidence and bootstrap
  assets are retained. No ignored/untracked files, private recovery fixtures,
  new test packets, dependencies, database files, credentials or Git history.
- Node `22.x`, unchanged lockfile and `Procfile`: `web: node server.js`.
  No package, migration, grant or authentication change is part of this slice.

Local read-only packet directory, ignored by Git:

`/Volumes/JTMMX/Users/JT/Documents/estimator-crm-draft/.local/releases/ce31b-estimator-91fac0e6ea99-20261019/`

| Artifact | SHA-256 |
| --- | --- |
| `source.tar` | `1e050151ceceb7fe0f63519a09c706f784cc4505c64e6391d859025f9743ad10` |
| `files.sha256.json` | `3d9b00f04cb7b3f12d362a08e8269a700c143f626ed497d7fd7b52a76ff9e685` |
| `recorded-base-delta.json` | `9fa8e9cfe5783927b93155dec794165e5b26208e118d8cd641551454b1cf63e6` |
| `candidate.json` | `dfb100cbd0012749acf5e981558ba65aa50a499babe51360a37c4881c6a857d1` |
| `verification.json` | `2f27fd2089fe4bf6db34e49e2eab313ad9a4007937ecf5c8810db79b40dd048d` |
| `SHA256SUMS` | `aaa2fbf7dd0e4cc0505c773633db246a1b36d4d03d45e03cff6f0a30eaaf4d08` |

The manifest records every path, Git blob/mode, byte count and SHA-256. Archive
reproduction and extracted-file comparisons passed for all 134 files. Files are
read-only; hashes detect modification, but local permissions are not WORM storage.
A limited path/private-key/token scan found no markers; it is not a comprehensive
secret audit. Existing tracked evidence remains internal source material.

Pure-module pins for CE's reviewed server-only copies:

- `services/ce-catalog.js`:
  `c21ba29a4f5885dd1f0b7bee89e0ee6b08c70c3ace640dd9d356640b7d54fd60`.
- `services/ce-pricing.js`:
  `def9c0d314c5d6579027a68b98cd7da8ffedf3609ba4ba2596429844b709c32d`.
- CE reports reconciliation to the final pricing source, with only its documented
  CJS require suffix difference. CE must record its own exact copy/package hashes;
  the Estimator source hash is not the hash of the adapted CE file.

## Target And Base Relationship

Target: **Heroku `quoting-proposals`** at
`https://quoting-proposals-1bd7339045ad.herokuapp.com/`.
The local Heroku remote names that app. Historical v54 activation release:
`521e8777-0fe9-4d83-95ec-31716754f8f5`, retaining v53 code
`84d4f56d7784d86741ad866a207e94ab19f72089` and slug
`7c28b322-f28e-457c-9324-7e5ee7bf7829`.
Sources: [release](ce-handoff-release-2026-10-01.md) and
[acceptance](ce-handoff-acceptance-2026-10-02.md) records.

**CE's authorized read-only preflight confirms the current Estimator release is
v54 with that exact source, release and slug**, at `2026-10-19T17:53:36.109Z`.
The CE release owner reports the existing signed-in Heroku CLI was used for
release metadata only, with no config/data read or new authentication. Its
sanitized receipt was read and hash-checked here, not independently re-queried.
The same receipt records CE v44, release
`24b88f80-54e0-425a-a724-8e3e1434a3de`, slug
`01d4a1f2-d713-443b-85be-399dd4e5cd39`, source `ce30-78843c8c88a66fa1`;
both releases succeeded.

Original receipt: `/private/tmp/ce31-release-preparation/current-release-metadata.json`.
Retained read-only copy:
`/Volumes/JTMMX/Users/JT/Documents/estimator-crm-draft/.local/releases/ce31b-estimator-91fac0e6ea99-preflight.json`.
SHA-256: `c0a07057e006cbd56a609c69299746c7467673e6a0e7b58709a84c64ee6be3ae`.
Attribution: CE owner chat `01a07874-3db6-7e00-8465-bdfeaa84a2e9`.
This clears the missing current-code baseline relationship, **not** current
database-backup, hosted-rehearsal or data-persistence evidence. The frozen
archive's `candidate.json` predates this receipt and remains unchanged; use this
supplement for live-release attribution. No network calls were made here.

The subsequent read-only GitHub check below also confirms current remote `main`
equals that verified release source; no Git fetch or branch write was performed.
The deployed merge commit is not an ancestor of this feature branch. Their
common commit is `006743883520cc021af6045a932bc790414bf956`; its tree exactly
matches the recorded deployed tree `49aea6e0fc598364c177e9155f449fe755cac267`.
This explains the branch history without assuming a fast-forward. The frozen
candidate changes 33 files relative to the recorded base; the delta is packaged.

The earlier bootstrap instructions in `DEPLOY.md` are not this release procedure:
do not initialize/recreate the app, push directly to protected main, force-push,
or release unrelated changes from a shared checkout.

## GitHub Source Publication Safety Check

October 19, read-only GitHub API inspection under CE's conditional source-review
request. **No push or draft PR was performed**, because its no-deployment-effect
condition is not established:

- Repository is public, default branch `main`; current remote main is
  `84d4f56d7784d86741ad866a207e94ab19f72089`. Automatic PR merge is disabled.
- Active ruleset `16656355`, **Protect main**, applies to the default branch,
  requires pull requests, and blocks deletion/non-fast-forward updates with no
  bypass actors. Its required approving-review count is zero; protection is not
  a substitute for John's release approval.
- Remote `codex/ce-engagement-handoff` is
  `d9c810303edfb4831a7a9daba49b3db345de8ef2`; it is an ancestor of the local head.
  No force push would be needed. There is no open PR for this head/base pair.
- GitHub Actions workflow count is zero. However, active repository webhook
  **627556589** targets **`kolkrabbi.heroku.com`** and subscribes to **`*` events**.
  Full callback URLs/secrets were not displayed or retained. A feature push and
  PR creation both fall within those subscribed events.
- GitHub's webhook metadata does **not** reveal Heroku's auto-deploy branch filters
  or review-app behavior. This does not prove either action would deploy, but it
  prevents claiming that source publication is effect-free. No Heroku settings,
  credentials, integrations or hooks were changed to bypass this uncertainty.

The CE release owner must establish the applicable Heroku integration rules before
resuming this conditional source-only push/PR. The exact local source archive and
hashes above remain valid and unchanged. A complete
[draft PR description](ce31b-draft-pr.md) is saved locally for that review.
There is no PR URL or attachment to report yet.

## Coordinated Publication Checklist

1. CE owner completes its separately pinned v44-based support package, reconciles
   both pure modules and records exact candidate/hash/target/base evidence. The
   reported 138-file CE package is not claimed verified by this Estimator packet.
   Assemble the two candidates and obtain John's explicit coordinated publication
   and deployment approval. No additional product-pricing decision is requested.
2. Under that approval, use the CE-owned release preflight above, confirm it has
   not been superseded, and verify current remote branches for both apps. Confirm
   recoverable pre-release backups/checkpoints. Reconcile any changes beyond the
   verified bases before merging or deploying.
   Use the approved PR process. Compare the final merged source to the frozen
   candidate; identify and re-hash any docs-only additions. A runtime change
   requires affected qualification and a revised candidate, not reuse of this hash.
3. **Release CE support first**, to its existing `sharpdots-client-engagement`
   target using the CE owner's approved package. Confirm health/auth gates,
   unchanged no-header v1 catalog behavior, explicit paired-v2 projection, and
   receiver support for saved v2 plus proposal-effective pricing proofs. If these
   checks fail, stop before releasing the Estimator consumer. Keep source product
   assessment/promotion and existing credentials/configuration unchanged.
4. **Release Estimator second**, to `quoting-proposals`. Record the approved final
   source identity, release, slug and preceding release. Confirm health, Portal
   access, paired catalog validation, existing v1 readability and draft publishing
   guards. No new flags or credentials are required by this candidate. Deployment
   alone does not approve client sends, billing or delivery execution.
5. Only with approval for the controlled hosted rehearsal, use a **new fictional
   opportunity** through saved Services, a proposal-only adjusted version and CE
   intake/review/internal acceptance. Verify unchanged baseline/old records,
   precise totals and one receipt. Do not replay O-000001/TEST Opp, send a customer
   proposal, create an invoice or trigger external execution. Record outcome and
   limitations in both release records and the approved tracker surface.

## Rollback And Preservation

- If CE support fails before the Estimator release, leave Estimator untouched.
  The CE owner chooses its data-compatible code containment using its own packet.
- If the Estimator fails, pause new paired configuration/intake activity. Preserve
  saved Services/proposal v2 versions, source cost evidence, adjustment reasons,
  proofs, frozen handoff packets, receipts and all accepted CE work. Do not delete,
  convert to v1, replace with the latest catalog, or reprice any saved record.
- Neither recorded Estimator v54 nor local pre-change `65a4a44` is certified to
  handle new v2 records. Do not blindly roll code back once v2 data exists. Prefer
  a compatible corrective release or separately approved containment that retains
  v2-aware reads/storage. Keep CE support while any dependent consumer/data remains.
- A code rollback never implies restoring an old shared database over newer work.
  Recovery must preserve post-release records and receipts. Any temporary flag or
  access change requires explicit authority and must be recorded separately.

## Evidence And Next Gate

Reuse the existing [local review](ce31b-local-review.md): 112 Node22 tests passed,
zero failures/skips; paired/legacy desktop/mobile browser checks passed. CE-owned
native PostgreSQL evidence accepted both fictional packets into 52 work items
each with immutable source preserved. These tests were **not rerun** for packaging.
Only archive/content/mode/hash/delta checks ran, without network or live access.

Next gate: CE owner resolves the source-publication hook uncertainty, finalizes
both exact review packages and requests John's one coordinated publication/
deployment approval. Current live code is attributed to CE's verified receipt;
GitHub main matches it, while current recovery readiness remains a pre-release
check. No push/merge/deploy or external tracker/chat/Drive
update was performed here. Tracking remains ClickUp868jnxdp7, CE issue124/PR116.
