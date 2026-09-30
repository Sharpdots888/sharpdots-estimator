# Field Registry

This registry tracks estimator fields that exist in the prototype, need a database home, need a lookup source, or need a decision before production use.

## Living Ops Services Review Build

The Services builder adds JSON snapshot fields, not database columns. They use
the existing shared S-record persistence when CRM is live; this build has not
been deployed. See `docs/living-ops-services.md` for source ownership and limits.

| Field | Home | Purpose / boundary |
| --- | --- | --- |
| serviceScenario = livingOps | S snapshot | Selects engagement model; legacy scenarios remain readable |
| serviceEngagement.schemaVersion/name/termMonths/markup | S snapshot JSONB | Versioned engagement name, initial term, default markup |
| serviceEngagement.products | S snapshot JSONB | Immutable imported product copies, catalog/product IDs and revisions, import hash, cascade paths, component definitions, sample marker |
| serviceEngagement.customLines | S snapshot JSONB | Engagement-specific cost items; not company catalog definitions |
| serviceEngagement.overrides | S snapshot JSONB | Quantities, rates, markup, cost treatment, cost center and shared-default resolution, keyed by definition type/reference |
| serviceEngagement.capacity | S snapshot JSONB | Manual monthly available hours by team requirement; no staff reservation |
| proposal.sourceRecords.services | Proposal snapshot JSONB | Pins S number/version used in output; no new execution or billing identity |
| Cached imported catalog | Browser localStorage | Import convenience only; Living Ops owns definitions; live lookup remains to be connected |

## Shared CRM Pilot: Authored, Awaiting Production Approval

The following supersedes the browser-only homes below for the feature-flagged
admin pilot, not for legacy data. Neither opportunity migration is applied to
production yet. See `docs/opportunity-live-release.md` for rollout boundaries.

| Field group | Proposed persistence / source | Remaining boundary |
| --- | --- | --- |
| O identity, sales state, qualification, forecast | sfpq_opportunities; bigint identity, generated O number, optimistic row version | Legacy W-to-O mapping remains explicit future migration |
| Account/contact/operator references | sfvc_companies, sfvc_people, sfvc_company_people, users; validated on server | Portal shared IDs confirmed by John; runtime admin pilot only |
| Activities, alternative approval, handoff and billing readiness | sfpq_opportunity_state JSONB child, audited changes | Dedicated activity/relay tables before automated downstream work |
| Shared calculator identity and immutable versions | sfpq_crm_records and sfpq_crm_record_versions | Separate 100001+ record range requires reservation/approval; legacy records untouched |
| Opportunity record role and pinned version | sfpq_opportunity_records | Shared records may serve multiple opportunities; one primary offer each |
| Signing state | Existing sfpq_document_transactions matched by primary proposal number/version | No historical W-field rewrite; no automatic close/invoice/production release |
| Actor-attributed change history | Append-only sfpq_opportunity_audit | Audit is runtime-immutable, not a defense against schema administrators |

Forecast remains operator-entered, not automatically reconciled to signed totals.
Manual close therefore requires commercial review. Workbench and Xero states are
coordination indicators only, not confirmation that external work was created.

## Opportunity CRM Draft

These entries describe the local draft in `CRM_DRAFT.md`, not applied database migrations.

The first durable header migration is now authored in
`migrations/001_sfpq_opportunities.sql` (not executed). It defines the database-owned
O identity, customer/owner reference placeholders, sales state, qualification,
commercial values, legacy mapping and optimistic concurrency. Activities, versioned
record links, document associations, handoffs and billing relays remain separate
follow-up migrations; see `docs/opportunity-migration.md`.

| Field | Purpose | Current Home | Production Resolution |
| --- | --- | --- | --- |
| Opportunity ID / O number | Stable parent identity replacing user-facing Workspace numbers | Browser UUID + local sequential O number | Needs DB Home: server-assigned UUID and unique number allocation; migration mapping from Workspace |
| Account, contact, owner | Customer and operator responsibility | Local text and sample owner list | Needs Lookup: customer/contact tables and authenticated operator IDs |
| Stage / status / expected close | Sales progression and won/lost outcome | Browser opportunity | Needs DB Home: separate stage and outcome, timestamps, lost reason |
| Qualification and next activity | Need, budget, authority, timing and follow-up accountability | Browser opportunity / activities | Needs DB Home: activities with due date, owner, completion, event history |
| One-time / monthly / initial term | Single forecast value without component double-counting | Browser opportunity | Needs Decision: manual forecast vs approved offer reconciliation, recurring and variable billing rules |
| Record links / role / version | Multiple calculator records, one primary acceptance basis | Local links plus legacy container adapter | Needs DB Home: opportunity-record-version relation; component, alternative, cost basis, primary offer |
| Document transaction link | Acceptance of the exact offer/version | Local simulated document events | Needs DB Home: link existing sfpq document transaction to opportunity and frozen offer version |
| Engagement / production handoff | Owner, target date, scope, dependencies, queued/received state | Browser opportunity | Needs DB Home: approved workbench outbox, idempotency key, external work-item reference, retry state |
| Billing readiness / payment status | Prepare future Xero coordination without issuing invoices | Browser opportunity | Needs DB Home: contact, terms, deposit, first date, PO, invoice reference; Xero authoritative, Authorize.net retained |
| Opportunity event history | Reviewable local change timeline | Browser opportunity | Needs DB Home: authenticated append-only audit events; browser history is not compliance evidence |

## Estimator and Document Fields

Status values:

- `Prototype`: Exists in the app UI or proposed UI, but may not be final.
- `Needs DB Home`: Needs a confirmed Postgres column/table relationship.
- `Needs Lookup`: Should connect to a lookup table instead of free entry.
- `Needs Decision`: Requires business/process decision before implementation.
- `Ready`: Field purpose and persistence path are known.

| Field | Current / Planned Surface | Purpose | Type | Expected Source / Home | Saves Today? | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Source | Estimate Structure row | Identifies production path: Sharpdots, vendor, or Manufacturer | enum | Estimate item row now; later may normalize to sourcing/vendor workflow | Conditional | Needs DB Home | Added to prototype. Requires DB column migration or owner-applied schema update to persist everywhere. |
| MOQ | Estimate Structure row | Minimum order quantity for purchased/manufactured item | number | Estimate item row; may later inherit from selected quote | Conditional | Needs DB Home | Manual field for now. Later should come from selected vendor/manufacturer quote quantity break. |
| Selected Quote | Estimate Structure row / Sourcing tab | Points estimate row to winning manufacturer/vendor quote | foreign key | Future quote table | No | Needs DB Home | Should drive landed unit cost and PO draft. |
| Selected Vendor / Manufacturer | Estimate Structure row / Sourcing tab | Shows chosen supplier for the item | foreign key | Existing vendor table | No | Needs Lookup | Vendor table exists in Postgres and should become lookup source. |
| Landed Unit Cost | Estimate Structure row / Sourcing tab | Final selected unit cost after product, freight, customs, duties, and related import costs | money/decimal | Calculated from selected quote detail | No | Needs DB Home | Should feed Per Piece Cost for manufactured/imported items. |
| Quote Status | Estimate Structure row / Sourcing tab | Tracks sourcing state for an item | enum | Future quote or quote-award table | No | Needs Decision | Suggested values: Needs Quote, Requested, Received, Clarifying, Selected, Rejected, Expired, PO Ready. |
| Manufacturer Quote | Sourcing / Import Quotes tab | Header record for supplier response on a sourced item | record | Future quote table | No | Needs DB Home | One item can have multiple manufacturer quotes. |
| Quote Quantity Break | Sourcing / Import Quotes tab | Stores price and landed-cost assumptions at each quoted quantity | record | Future quote quantity break table | No | Needs DB Home | Necessary when quoting multiple quantities for the same supplier/item. |
| Incoterm | Sourcing / Import Quotes tab | Defines buyer/seller responsibility for cost, risk, freight, and clearance | enum | Future quote detail table | No | Needs Lookup | Use Incoterms 2020 values such as EXW, FOB, CIF, DDP. |
| Country of Origin | Sourcing / Import Quotes tab | Required import classification/compliance context | text/lookup | Future quote detail table | No | Needs DB Home | Important for tariff and duty assumptions. |
| HTS Code | Sourcing / Import Quotes tab | U.S. tariff classification for imported product | text | Future quote detail table | No | Needs DB Home | Should be reviewed/owned by customs broker or qualified importer resource. |
| Duty Rate | Sourcing / Import Quotes tab | Duty percentage applied to customs value | percent | Future quote detail table | No | Needs DB Home | May derive from HTS code but should remain editable with audit trail. |
| Additional Tariff Rate | Sourcing / Import Quotes tab | Additional tariff layer when applicable | percent | Future quote detail table | No | Needs DB Home | Covers special tariff programs or trade remedies when applicable. |
| Freight Estimate | Sourcing / Import Quotes tab | Estimated freight cost for landed cost calculation | money | Future quote cost table | No | Needs DB Home | May come from freight forwarder quote. |
| Customs / Broker / Entry Fees | Sourcing / Import Quotes tab | Estimated customs brokerage and entry-related charges | money | Future quote cost table | No | Needs DB Home | Should support multiple fee lines. |
| Selected Award | Sourcing / Import Quotes tab | Captures winning quote/quantity selected for project | record | Future quote award table | No | Needs DB Home | Should lock the quote basis used by estimate cost and future PO draft. |
| PO Draft | Future purchasing / Xero relay | Structured purchase order candidate from selected quote | record | Future PO staging table; Xero relay | No | Needs Decision | Should not create live Xero PO until explicitly approved. |
| Document Transaction | Proposal publishing / DocuSeal | Tracks each frozen proposal signature request and its lifecycle | record | `sfpq_document_transactions` | Yes, when migration is applied | Ready | Provider-neutral transaction record; current provider is DocuSeal. |
| Document Event | DocuSeal webhook / audit history | Stores verified, deduplicated signing events | record | `sfpq_document_events` | Yes, when migration is applied | Ready | HMAC verification is required before an event is accepted. |
| Signed Document Artifact | Completed DocuSeal submission | Preserves the final signed PDF before the provider URL expires | binary record | `sfpq_document_artifacts` | Yes, when migration is applied | Needs Decision | Requires authenticated retrieval plus approved retention/deletion policy before production. |
| Signature Audit Certificate | Completed DocuSeal submission | Preserves DocuSeal's Certificate of Signature | binary record | `sfpq_document_artifacts` | Yes, when migration is applied | Ready | Stored as an audit-certificate artifact with SHA-256 hash. |
| Signing Recipient | Proposal publishing | Identifies the person asked to sign | name/email | Document transaction now; future client/contact lookup | Yes, when migration is applied | Needs Lookup | Email is entered manually in the first slice; should come from the selected client contact. |
| DocuSeal Delivery Mode | Proposal publishing | Separates prepare-only requests from actual email sends | enum/boolean | Server configuration and document transaction | Yes, when migration is applied | Needs Decision | Email delivery remains server-locked until estimator authentication and operator authorization exist. |

## Immediate Issues To Track

- Add Postgres persistence for `Source` and `MOQ`.
- Define sourcing/import quote schema.
- Connect selected quote to estimator cost and per-piece cost.
- Connect vendor lookup table to estimate and sourcing screens.
- Define Xero purchase order staging fields before any live relay.
- Retain the print quote / ecomm app merge plan for coordination with Warren Corrales:
  - Treat this app as the destination workspace/proposal shell.
  - Merge the other Heroku app through Git, schema comparison, and module import rather than trying to merge Heroku apps directly.
  - Bring the print quote and ecomm calculators into feature branches, map their data into workspace records, then connect their outputs to Proposal publishing.
  - Skip deep print/ecomm implementation in this prototype until that coordination window.
- Add workspace interface modes when the unified app structure settles:
  - `Proposal Mode`: default to Proposal; emphasize Proposal and Services Calculator; keep Estimate/Print Quote available as reference.
  - `Print / Ecomm Mode`: default to Print Quote; emphasize Print Quote and Ecomm Pricing; keep Estimate available as read-only/reference.
  - `Full Workspace`: show all tabs and restore the last active tab.
  - Keep the same workspace records underneath; mode should change navigation and emphasis, not split data.

## Opportunity Pipeline Assignment

- `pipeline`: `services` or `quotes`, stored in the existing opportunity state
  JSONB and audit snapshots; no new sequence or relational table.
- Missing assignment: Print offerings resolve to quotes; Services/Mixed resolve
  to services. Reading legacy records does not backfill them.
- Explicit assignment overrides Offering and is preserved by saves from older
  clients that omit the field. Moves retain identity, linked versions, approvals,
  close state and handoffs. See `docs/sales-pipelines.md`.
