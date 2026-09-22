# Opportunity Database and PR 33 Merge Runbook

## Agreed Direction

`public.sfpq_opportunities` is the CRM opportunity table, not a table of unused
numbers. PostgreSQL owns its identity sequence. Inserting one opportunity returns
the assigned `O-000001` identifier. Never use browser counters or `MAX(id) + 1`
for real records. Concurrent inserts use PostgreSQL sequence allocation.

This change prepares an operator-run migration. It does NOT execute it, replace
production W links, enable production CRM, merge PR 33, or deploy to Heroku.

## Table Detail

| Area | Columns / behavior |
| --- | --- |
| Identity | `id` bigint identity PK; `opportunity_number` generated unique O number; immutable `creation_key` UUID for retries |
| Opportunity | `name`, `brief`, `offering`, `lead_source` |
| Customer | Account/contact display snapshots plus nullable `account_ref`, `contact_ref` |
| Ownership | `owner_operator_ref`, created/updated operator references; verified foreign keys still required |
| Sales | `stage`, `status`, probability, expected close, stage-entered/closed timestamps, lost reason |
| Qualification | Four booleans: need, budget, authority, timing |
| Commercial | USD, decimal one-time and monthly amounts, initial term, generated initial contract amount |
| Migration | Unique nullable `legacy_workspace_key` for a reviewed canonical container mapping |
| Audit/concurrency | Created/updated timestamps, incrementing `row_version`, soft archive timestamp |

No foreign-key targets are invented. Warren must confirm exact customer, contact,
operator and estimating-record table keys/types before adding constraints and APIs.
References without those constraints are staging fields, not proven associations.

The sequence begins at 1 in a new database, never cycles, and stops at 999999.
Failed/rolled-back inserts may leave gaps. Do not reset the sequence to fill gaps;
do not reuse numbers from archived opportunities. Expand the format in a reviewed
migration before capacity is reached. Local sample O numbers are not production
identities and must not be imported as authoritative allocations.

## Relationships Needed Before CRM Cutover

- Add a version-pinned opportunity-record link table covering P, E, S, SRC, PQ, EPL.
  Permit many records/versions per opportunity, shared library records across
  opportunities, and a single primary offer. Standalone PQ/EPL records remain valid.
- Add activities, authenticated append-only events, engagement/production handoffs,
  and billing relay records as separate child tables; do not store this entire
  operational history in the opportunity header.
- Link existing DocuSeal transactions to the opportunity AND frozen offer version.
  Keep historical workspace fields and artifact hashes intact. A signature alone
  must not close a deal, start production or issue an invoice.
- Stage Xero/workbench relays with idempotency keys, retry/error state and external
  references. Xero remains authoritative for invoices; Authorize.net stays the
  payment path. No live relay is part of PR 33.

## Migration Procedure for Warren

1. Identify the intended database, PostgreSQL version (12+), schema owner and app
   role. Confirm `sfpq_opportunities` does not already exist. If it exists, STOP and
   compare its definition; the script intentionally refuses to silently reuse it.
2. Take the normal backup/snapshot. First execute the migration on a disposable or
   staging database using the schema-owner role. This repo has previously hit
   ownership errors, so do not run it from ordinary server startup.
3. Run `psql "$MIGRATION_DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/001_sfpq_opportunities.sql`.
   Do not paste credentials in chat, commit them, or use a production URL for tests.
4. Review columns, indexes, generated number, identity sequence ownership and trigger.
   Grant only needed privileges to the verified runtime role: table SELECT/INSERT,
   column-scoped UPDATE (excluding identity, generated fields and creation fields),
   and USAGE on the owned identity sequence. Do not grant DELETE or sequence UPDATE.
5. Verify allocation/retries, simultaneous creates, optimistic update conflicts and
   authenticated operator attribution in staging. The database trigger supplies
   timestamps and row versions; the future API must enforce authorization and use
   `WHERE id = $id AND row_version = $version`, returning 409 on stale edits.
6. Obtain explicit production execution approval before running the same reviewed
   SQL against production. No production rows or sample opportunities are seeded.

The SQL is transactional and fails if objects already exist. Re-running is not a
repair strategy. If it fails, investigate and retry only after confirming rollback.
Rollback after deployment should disable the CRM path and leave this additive table
intact; do not drop records or recycle identifiers once real opportunities exist.

## W-to-O Backfill

Inventory durable Workspace containers and their record/version links first.
Browser-only W numbers can collide across users, and the draft uses opaque UUID
container keys. Do NOT map `W-000010` mechanically to `O-000010`, or group records
solely by an unqualified W number. Resolve canonical origin/identity with Warren.

For each verified container, insert one opportunity with a stable creation UUID and
canonical `legacy_workspace_key`, let PostgreSQL allocate O, then backfill reviewed
record links in the same migration batch. Reconcile counts, versions, shared
libraries and signing history. Keep an auditable mapping and legacy fields until
all callers are updated. Browser-only work needs an explicit export/import step.

## Steps to Merge PR 33

1. Reconcile current `origin/main` into `codex/opportunity-crm-draft`. The two
   `index.html` conflicts are resolved by retaining main's newer catalog asset
   versions and the opt-in CRM scripts. New Quote Builder/catalog code is preserved.
2. Review this migration and agree table ownership/reference targets with Warren.
3. Pass model/security/catalog tests, the isolated SQL test and CRM browser smoke
   tests against the combined branch. Review the newer Quote Builder in both normal
   and CRM preview modes. No production database is used for these checks.
4. Review the PR diff and confirm the scope: local opt-in draft plus dormant schema
   migration, NOT production CRM activation. Mark ready, obtain required review and
   status checks, then merge through GitHub after explicit merge approval.
5. Production deployment and owner-run SQL execution are separate approvals. Merging
   PR 33 does not apply SQL; deploying it does not enable the localhost-only CRM.
6. Build authenticated opportunity CRUD/link APIs, server-issued numbers, durable
   activities and handoffs, then backfill and switch the UI behind a rollout flag.
   Only after that cutover is the W sequence fully replaced in production.

## Verification Command

`npm ci` then `npm test` (includes the migration test). PGlite is a development-only
dependency. To run only SQL checks: `node scripts/test-opportunity-migration.cjs`.

This test executes SQL in an ephemeral PostgreSQL-compatible PGlite instance and
never reads DATABASE_URL. It is not a substitute for staging PostgreSQL role,
concurrent-client, backup or real-schema migration verification.

Coordination: https://app.clickup.com/t/868jnxdp7
PR: https://github.com/Sharpdots888/sharpdots-estimator/pull/33
