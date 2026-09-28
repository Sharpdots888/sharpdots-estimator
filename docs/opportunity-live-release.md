# Database-Connected CRM Pilot Release

Status: prepared for review, not activated in production.
ClickUp: https://app.clickup.com/t/868jnxdp7

## Baseline

PR 33 merged at db0f69a and deployed to quoting-proposals as v40. That release
contains the localhost draft, not the shared CRM. No opportunity migration was
executed. This follow-up adds authenticated persistence behind
`ESTIMATOR_CRM_ENABLED=true`. The default is disabled.

## Pilot Boundaries Requiring Release Approval

- Initial access is restricted to active Portal administrators, checked against
  the existing users table. Non-admin users retain the existing estimator.
- PostgreSQL assigns new O-000001 opportunity identities. Browser draft numbers
  are not imported. Existing W records and historic document references remain.
- Shared calculator records are versioned separately from legacy browser records.
  New P/E/S/SRC/PQ/EPL numbers use a shared sequence plus 100000: for example,
  P-100001 followed by E-100002. This deliberately separate pilot range must be
  approved/reserved and checked against existing identities before activation.
  This is not a claim that all old workspaces or estimates have been migrated.
- Each Save creates an immutable record version. Opportunity links pin a version;
  updating one opportunity does not silently update another opportunity's link.
  Copy creates a new identity. Detach preserves the shared record and its history.
- Record save and opportunity attachment are separate transactions. If attachment
  fails, the saved record remains in the shared library for recovery/reattachment.
- Operational state (activities, approvals, handoffs, billing readiness) is kept
  in a per-opportunity JSONB child row for the pilot, with a separate append-only
  actor-attributed audit. Dedicated integration/activity tables remain a later
  refinement before automated downstream processing.
- DocuSeal status is read from existing server transactions by exact proposal
  number/version. Client-supplied signing events are ignored. Signing does not
  automatically close, invoice, or release production. Alternative approval
  requires a recorded method and reference. Changing agreed terms, recipient or
  linked versions requires reopening and invalidates existing acceptance.
- Handoff and Xero controls record readiness/receipt only. No workbench relay,
  invoice, charge, payment gateway change or new email send is introduced.
- The shared library currently loads all version snapshots. Pagination and
  non-admin permissions are required before a broad/high-volume rollout.
- Legacy API reads and production Portal/DocuSeal behavior still require the
  post-deployment checks below. Local tests do not prove those remote services.

## Schema

Run the existing 001 migration and grants, then 002. They are operator-run only,
not application startup migrations. Both migrations are additive and transactional
individually; they are not idempotent. Stop if any named target already exists.

002 adds five tables: sfpq_opportunity_state, sfpq_crm_records,
sfpq_crm_record_versions, sfpq_opportunity_records, sfpq_opportunity_audit.
Runtime grants exclude version/audit UPDATE or DELETE, table DDL and sequence
reset. Broad default privileges are stripped from only these new objects.

## Production Procedure: Approval Required

1. Review the PR and pilot boundaries above. Confirm a current recoverable
   database backup with the actual database provider; this database is not an
   attached Heroku PostgreSQL add-on. Do not assume Heroku rollback restores DB.
2. Supply the existing schema-owner connection securely as MIGRATION_DATABASE_URL.
   It must authenticate as u1plkuc8dacl0j, separate from db_admin. The runtime URL
   alone cannot execute these migrations. Do not paste credentials into chat or
   put the owner URL in the application runtime.
3. Verify database identity/version, owner/runtime memberships, reference tables,
   absence of the six new tables, and absence of conflicting calculator/document
   identifiers in the reserved pilot range. Check durable legacy identifiers as
   well as browser exports intended for later migration. Stop on conflict.
4. As the existing users owner (db_admin), grant only the required reference:

   GRANT REFERENCES (id) ON public.users TO u1plkuc8dacl0j;

5. As the schema owner, with psql ON_ERROR_STOP=1, execute in order:
   migrations/001_sfpq_opportunities.sql;
   migrations/opportunity-runtime-grants.sql;
   migrations/002_opportunity_persistence.sql.
   Verify table ownership and effective grants after each. Do not seed sample rows
   into production or retry blindly if a script stops.
6. Merge the reviewed PR through GitHub. Deploy its merged main commit to
   quoting-proposals, initially with ESTIMATOR_CRM_ENABLED false/unset. Confirm
   release SHA, startup health and legacy app. Preserve auth and sending settings.
7. Set ESTIMATOR_CRM_ENABLED=true only after schema and deployment checks. Through
   the Portal, verify admin access and non-admin behavior. Create one clearly
   labeled pilot opportunity; verify assigned O number, customer/contact lookup,
   save/reload from a second authenticated browser, all six record types and
   optimistic edit conflict handling. Keep the pilot record for audit.
8. Verify a saved proposal opens the existing authenticated DocuSeal flow and
   existing transaction statuses can be read. Do NOT send a client document as
   part of this smoke test without separate explicit approval.
9. Verify close/handoff/billing readiness controls with a clearly labeled pilot
   approval reference. Confirm they do not issue invoices or start production.
   Record release, evidence and any limitations in ClickUp.

## Rollback

Set ESTIMATOR_CRM_ENABLED=false to return administrators to the previous interface.
If needed, roll back the application release. Retain new tables, rows, version
snapshots and audit. Never drop data or reset O/record sequences as rollback.
Existing browser work and old W references remain untouched.

## Verification

`npm test`: 16 passing tests, including persistence, shared identities, retry
keys, company/contact membership, stale updates, immutable versions, exact-version
signing, ignored forged signing status, acceptance invalidation and audit actors.

Real local PostgreSQL 16 verification restores the actual reference-table schema
with synthetic rows and separate owner/runtime roles. No production rows copied.
It covers concurrent numbering, FKs, effective grants and denied audit/version
mutation, plus the actual HTTP app and Playwright create/save/reload of all six
record types, manual close, production handoff and 390/1188/1440/2560 layouts.
Legacy seed/customer API reads in that browser test are mocked; CRM APIs use the
actual isolated local database. All external browser requests are blocked.

```bash
OPPORTUNITY_REFERENCE_SCHEMA=/private/tmp/opportunity-reference-schema.sql \
OPPORTUNITY_REFERENCE_ENUM=/private/tmp/opportunity-user-role.json \
OPPORTUNITY_LIVE_SMOKE=1 \
PLAYWRIGHT_PATH=/private/tmp/sharpdots-migration-tools/node_modules/playwright \
node scripts/verify-opportunity-postgres.cjs
```

The PostgreSQL verifier uses a private Unix socket and PORT=0 for HTTP, then stops
its own processes. It never reads the production DATABASE_URL. Reference schema
files are temporary operator-provided schema-only exports, not committed secrets.
