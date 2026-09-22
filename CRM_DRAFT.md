# Opportunity CRM Draft

## Review Surface

Branch: `codex/opportunity-crm-draft`, based on `origin/main` at `8faa789`.

Update: current main through `07b75f0` is reconciled into this branch. PR 33 now
also includes an explicit, dormant `sfpq_opportunities` migration. See
`docs/opportunity-migration.md` for schema detail, W-to-O backfill boundaries and
the review/merge/deployment order. No production SQL has been executed.

Run `PORT=4187 node crm/preview-server.cjs`, then open
`http://127.0.0.1:4187/index.html?crm=1`.

This is a local, opt-in interface draft with fictional sample accounts. No Heroku
release, schema migration, credential change, client email, invoice, or workbench
API call is performed. A fresh browser starts with twelve sample opportunities.
Edits persist in that browser and origin. The download icon exports a JSON backup;
it is not shared/team persistence. Clearing site storage removes the draft data.

## Navigation and Ownership

- **Pipeline** owns opportunity identity (`O-000001`), account/contact, owner,
  qualification, sales stage, activities, commercial forecast, acceptance, and handoffs.
- **Proposals** contains the proposal editor and its estimate, services and sourcing
  component editors. Existing record numbers and version controls remain intact.
- **Quote** contains print quotes and ecomm price lists. They remain standalone
  library records unless explicitly attached to an opportunity.
- An opportunity links multiple records and versions. One linked proposal or print
  quote is the primary acceptance basis; other records are components, alternatives
  or cost bases. Do not add their totals together and double-count revenue.
- Opportunity one-time value plus monthly value times initial-term months is the
  forecast amount. It is explicitly edited, not automatically inferred from every
  attached calculator. Pricing reconciliation belongs in close review.

## Complete Draft Flow

1. Create an opportunity with account, decision-maker, owner, offering, value and close date.
2. Record business need, budget, authority and timing; schedule the next activity.
3. Move cards through Intake, Qualified, Scope & cost, Ready to send, Client review.
   Stage buttons provide a keyboard/touch alternative to drag and drop.
4. Open linked editors, save versions, attach/detach library records, and select the
   primary offer. Sample records open populated calculator/quote content.
5. In Documents, simulate prepare/send/view/sign/decline/expire. These are local
   sample events, not production requests. The audit timeline records changes.
6. Signed primary acceptance enables a deliberate close-won review. An approval
   reference supports PO/written-approval workflows. Lost requires a reason.
7. Prepare engagement and/or production handoffs with receiving owner, target date,
   scope and dependency confirmation. Queue and acknowledge receipt independently.
8. Capture billing contact, terms, start date, deposit, client PO and manual payment
   status. Mark ready for future Xero relay; export a handoff packet if needed.

## Safety and State Rules

Sales stage, document lifecycle, fulfillment readiness, and billing readiness are
separate states. Signing does not mark won, start delivery, or create an invoice.
Acceptance must match the linked primary offer number AND version. Superseded or
declined/expired documents cannot satisfy close review. Commercial edits invalidate
previous acceptance; won commercial fields require reopening before editing.
Late document events cannot regress lifecycle state. Reopening resets handoffs and
billing readiness. Sample signed PDF/certificate flags are not real stored artifacts.

`crm/preview.js` intercepts app API requests only for localhost with `crm=1`.
The dedicated static server also refuses API routes and never loads `.env`, `pg`,
or `server.js`. Existing production behavior is unchanged without the opt-in flag.

## Compatibility Boundary and Production Follow-up

The existing calculators still use their legacy Workspace container internally.
The draft adapter gives that container an opaque UUID and presents only opportunity
numbers to users. This is not a production data migration. Existing shared data is
neither renamed nor converted. Native calculator snapshots and versions continue to
use existing mechanisms, backed by browser storage in this preview.

After review, implement durable opportunity IDs/unique number allocation, account and
contact foreign keys, owner/permission scopes, optimistic concurrency, version-pinned
record links, and authenticated audit events. Define migration/backfill of existing
Workspace links with the team before changing schemas or deployment.

Connect verified DocuSeal transaction events to opportunity + exact record version;
reuse the signed-document archive and certificate hashes. Add an idempotent outbox for
approved workbench and Xero handoffs with retry/error states and external references.
Xero remains the invoice source of truth; retain Authorize.net as the payment path.
Recurring/variable charge schedules, taxes, currency policy, and ongoing-term billing
must be defined before a real billing payload is emitted. None of these relays is live
in this draft. The draft audit trail is editable browser data, not a compliance log.

## Verification

`node --test crm/model.test.cjs` exercises identifiers, value arithmetic, won gates,
exact-version acceptance, terminal event handling, decline/expiration, alternative
approval, handoff gates and reopening.

`PLAYWRIGHT_PATH=/path/to/playwright node crm/smoke.cjs` exercises the local server
on port 4187: sample sign/close, production handoff acknowledgment, billing readiness,
linked editor navigation, quote versioning, attachment/detachment, standalone mode,
intake/loss, reload persistence, search and page bounds at 390, 1188, 1440 and 2560px.
It fails on browser errors or any actual `/api/` network request. Screenshots go to
`/private/tmp/crm-*.png`. The Playwright dependency is external to the production app.

## Sources and Coordination

- ClickUp: [Estimating App - Project Calculation](https://app.clickup.com/t/868jnxdp7)
- [Apps Migration Strategy](https://docs.google.com/document/d/1dfZJAHnp1cMalpcT2xqMMtEJOt3ULPie98jYM6sH230)
- [Decision Log](https://docs.google.com/document/d/1Jy-VrcoUpYANr1uGC1oNJbxJDiQFTbulx3511LZffpo): opportunity CRM draft direction recorded.
- Pipedrive's [pipeline view](https://support.pipedrive.com/en/article/pipeline-view),
  [deal detail](https://support.pipedrive.com/en/article/deal-detail-view) and
  [activities](https://support.pipedrive.com/en/article/activities) informed the
  stage/card/next-action interaction pattern. This is a Sharpdots-specific design,
  not a copied Pipedrive implementation.
- No relevant Zoom meeting was returned by the estimator search; the user's current
  instruction is the decision source. Shared checkout edits were left untouched.
