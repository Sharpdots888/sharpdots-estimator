# CE31B Live Release And Rehearsal

October 19, 2026. John approved coordinated CE and Estimator publication,
backup/restore and verification, retaining all vNext boundaries. This release
does not authorize customer sends, external execution, invoicing or main merge.

## Source And Deployment

- Source review: [draft PR43](https://github.com/Sharpdots888/sharpdots-estimator/pull/43),
  `codex/ce-engagement-handoff` to `main`. Open, draft, unmerged. Protected main
  remains `84d4f56d7784d86741ad866a207e94ab19f72089`.
- CE deployed first as v45 / `ce31-27bf561d5d6b7226`, verified by its release owner.
- Estimator: **quoting-proposals v55**, release
  `1fb39f46-6ba2-4a88-b04c-529988b1c501`, slug
  `79254111-f877-4ef7-89b0-cc4c5210922e`.
- Exact application source: `91fac0e6ea9967984647817114b3640a99a9284a`.
  Documentation commits after this source were not included in the frozen release.
- Uncompressed source archive SHA-256:
  `1e050151ceceb7fe0f63519a09c706f784cc4505c64e6391d859025f9743ad10`.
- Uploaded gzip archive SHA-256:
  `7fba7faba1abcf6eff029446dcb60eff4c9948cb02190753672017f8fc61ce0f`.
- All **134 deployed source files** match the frozen manifest; web process is up.
  Unauthenticated document/catalog/CRM routes return 401. Normal John Portal
  launch succeeded. Settings, schema and grants were not changed.
- Heroku automatic deployment and review-app creation remain disabled. The
  feature push and draft PR did not perform this deployment; the approved exact
  source archive was released through the existing Heroku Build API.

## Recovery And Preservation

Fresh private backup and isolated native PostgreSQL16.14 restore covered all
36 Estimator-owned tables, 7,004 full rows, 58 saved versions, 30 sequence states,
eight stored signed artifacts, settings and baseline source. No whole-warehouse
or shared users/company/contact rowsets were exported. Complete rowsets, sequence
states and artifact bytes matched. Three specifically named legacy CHECK
definitions passed parser-equivalence and allowed/rejected-value tests; every
other schema field matched exactly. Original dump/DDL is retained. See the
[precise restore qualification](ce31b-release-candidate.md#approved-recovery-and-publication-checkpoint).

The post-deployment comparison matched all pre-release owned rows and sequences
before the rehearsal. The post-rehearsal check matched all pre-existing full rows
as an unchanged subset, including all 58 prior versions and eight artifacts.
Only the new fictional records below and their audit history were added.
Expected sequence increments: opportunities33->34, records52->54, audit88->101.
The completed O-000001/TEST Opp was not replayed or changed.

## Hosted Fictional Rehearsal

- New **O-000034**, `CE31B Automated Rehearsal - Fictional - 2026-10-19`.
  Existing internal test account, actual John Portal operator45, normal UI and
  server save paths. No manufactured credentials or direct database writes.
- **S-100053 v1 and v2** are retained and have identical snapshot hashes:
  `570228bb154258cb7a0aeeb169d09b1c4bf7fda072569caf1ca7c0d5bfcf424e`.
  The normal Use in internal proposal action saved v2; it is the pinned baseline.
- **P-100054 v1** preserves baseline pricing. **v2** adds four proposal-only
  differences with explicit automated-test reasons: brief quantity1->2,
  unit cost366.29->400, selling rate750, markup53.846154%->60%.
- Effective budget: $8,750 one-time + $10,325/month for three months = $39,725.
  Assessed delivery cost with reserve: $24,737.85. CE product and saved Services
  baseline are unchanged. Reloading saved P v2 restores all four comparisons.
- Both source and effective configurations retain paired CE revision144, pair hash
  `af72e2aaee778057496c93ec94b39d362d34251658df84618cc47206b210ab44`,
  and exact cost-source evidence hash
  `5487748b9443b1972ea147a1052e2689147977028e8b00a6163ac74a723d9f92`.
- Live client-audience check shows PDF, CSV and DocuSeal disabled with the explicit
  draft-only catalog warning. The temporary output selection was discarded by
  loading saved P v2; no extra version or document transaction was created.
- Internal test close used No signature required with an explicit rationale:
  automated release verification, **not customer acceptance or a real sale**.
  All scope notes prohibit customer sending, execution, invoices and payments.
- Handoff `e5ec9f08-40ee-4b9a-8a70-8b4c1865a041`, one send attempt.
  Packet/receipt SHA-256:
  `7a09f0612ea28d9ab24253629e45806d2f6edf65d4825555c4e6097f44688ca0`.
- CE acknowledged **a8f75582-bd26-4d4a-828c-4be1120a0642** at 18:31:30 UTC.
  Intake contains exact S v2/P v2 snapshots, baseline/effective hashes and verified
  pricing proof. All three admission permissions remain false in the sent packet;
  billing relay is not connected.
- CE's release owner subsequently verified the four comparison rows and exact
  price39725/cost24737.85 through normal John UI, saved and reloaded the review,
  then accepted only the explicitly labeled automated internal rehearsal.
  Team displayed **52 work cards / 52 ready**, including quantity2 for the brief
  and separate monthly1/2/3 checkpoints. No Start work, task completion, provider,
  campaign, invoice or membership-grant action was taken. This is automated
  internal-plan verification under release approval, not human client acceptance.
  CE's receiving post-rehearsal proof subsequently passed: all pre-existing full
  rows, catalog, settings and schema marker remain unchanged. Its fresh isolated
  PostgreSQL restore also reproduced the newly accepted v2 rehearsal, including
  the exact $24,737.85 cost. Evidence is separate from the Estimator receipt:
  `/private/tmp/ce31-release-preparation/live/hosted-rehearsal.json` and
  `after-restore-proof.json`. This is scoped CE recovery, not a shared-runtime
  recovery claim; the accepted v2 plan requires a compatible reader.

## Evidence And Limits

Sanitized local evidence: `/private/tmp/ce31b-estimator-pre-release/`:
`restore-proof.json`, `fresh-preflight.json`, `published-verification.json`,
`hosted-rehearsal.json`, and the saved comparison/client-block/intake screenshots.
Private dumps, settings, slug and full snapshots stay outside Git and are not PR
attachments. Prior 112-test and responsive local qualifications are reused;
no unrelated broad test rerun was needed for this frozen publication.

This qualifies internal assessed-rate planning and the reviewed handoff, not
commercial price publication, real customer acceptance, Xero, external delivery,
shared-work bundles or vNext promotion. Preserve all v2 records/proofs on rollback;
never silently down-convert or reprice them. No rollback was performed.

Coordination: ClickUp868jnxdp7; CE issue124/PR116. No independent ClickUp/Drive
message was posted by this Estimator lane.
