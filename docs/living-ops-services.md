# Living Ops Services Builder

## Ownership and scope

User direction: Living Ops in Client Engagement defines reusable engagement
products through their execution components. Estimator selects those products,
costs an engagement, and packages the result into a proposal. It must not become
a competing product-authoring catalog.

The original import builder shipped with PR39. Its cost-plus model is documented
below. The new `codex/services-catalog-connection` branch adds a separate CE
recipe/pricing path, locally verified but not deployed; see
[CE catalog connection](ce-catalog-connection.md) for its current boundaries.

## Domain structure

| Term | Meaning here |
| --- | --- |
| Engagement | Client-specific selection of product snapshots, term, pricing overrides, and estimated capacity demand; saved as an S record |
| Product | Reviewed reusable Living Ops template with its ID, revision, and delivery paths; a package, not another cost on top of its components |
| Item / service | First delivery-definition level inside the product |
| Platform | Tools and infrastructure required by an item |
| Workflow / capability | Execution requirements supported by platforms |
| Team / role | Responsibility and labor requirements; not a staff assignment |
| Capacity | Estimated monthly role-hours compared with manually entered availability; not a reservation or organization-wide utilization measure |

Source path: Product -> Item/service -> Platform -> Workflow/capability ->
Ops Area/Team. The Components view follows this order; component costing exposes
its full source relationships. Product cards roll up exclusively owned components.
Shared requirements appear in a separate bucket and count once across products.
Conflicting defaults require an explicit engagement-level resolution.

## Interface and calculations

- Services opens in Living Ops engagement mode for new records. Prior SalesMachine,
  Fractional, Cold Email, and Start from scratch scenarios remain available and
  retain their existing calculations and saved data.
- Products, Components, and Team/Capacity are separate views. Use Import catalog
  for source data or View example catalog for explicitly synthetic review data.
  No example product is loaded into an engagement automatically.
- Edit a component's quantity, unit rate, rate basis, markup, and cost center.
  These are engagement overrides, not writes to Living Ops definitions.
- Cost treatments: cost plus markup; cost only (no extra client charge);
  reference only; excluded. Cancelled source components default to excluded,
  zero-rate structural components to reference. Source cost centers are not
  inferred from company/vendor names.
- Price = cost * (1 + markup / 100). Annual costs become monthly equivalents;
  hourly-minute demand divides by 60. Per-run and hourly inputs describe monthly
  usage. One-time amounts stay separate. Initial term = one-time + monthly * term.
- Unknown costs remain incomplete, not silently zero. USD scalar rates only.
  Composite vendor `pricingModel.components` are preserved in the catalog but
  blocked from selection pending an adapter; included capacity is not flattened
  into another charge.
- Use in proposal saves the current S record, pins its source number/version, and
  includes Services. Client output contains product/shared/custom package prices;
  internal role costs and capacity are not copied into client output. PDF and CSV
  use the same complete row set, without the old eight-row preview truncation.
- Missing costs, invalid terms, or example products fail publishing preflight and
  prevent DocuSeal preparation through the UI. PDF remains a flagged draft preview.
  This is an application readiness check, not a new server authorization policy.

## Import and persistence contract

Accepted source message: `living-ops-estimator-services-v1` / `catalog_snapshot`.
`payload.catalogId` and `payload.products` are required. Product fields include
`localProductServiceId`, `catalogStatus`, `enabledForSelection`, `sourceValid`,
`estimatorCompatible`, `templateVariables`, `cascadePaths`, and `sourceRevision`.
Only reviewed, enabled, compatible products are selectable. Draft/unsupported
products remain visible with their blocker.

The imported catalog is cached in this browser under
`sharpdots-living-ops-catalog-v1`. It is not the authoritative catalog. Every
selected product is deep-copied into the engagement, including source definition
IDs, paths, product/catalog revisions, and a local SHA-256 import fingerprint.
The fingerprint identifies the imported JSON snapshot, not a source attestation.
Reimporting a catalog does not change saved or currently selected product copies.

`workspaceRecordSnapshot(services)` now includes `serviceEngagement` schema v1
alongside legacy `serviceScenario`, `serviceRows`, and `serviceExpanded`. Existing
`sfpq_crm_record_versions.snapshot` JSONB stores it without a new table or migration.
Local CRM opportunity editor caches also preserve this state. Save/version/load,
copy, and proposal source restoration use the existing record mechanism.

## Verified sources

- [Estimator ClickUp task](https://app.clickup.com/t/868jnxdp7)
- [Living Ops cascade reference](https://docs.google.com/document/d/1OnuU7ds4fXXwJxTzSv2K_hd-mcn-g83kuM6BsVHsR_g/edit)
- [Product Build Revision context](https://app.clickup.com/t/868krw7gp): candidate
  revision, not evidence of a sealed/live catalog.
- Local `jt-control-room/control-room-records/spacefold-os/prototypes/living-operational-stack-map/`:
  `prototype-room/build-plan/LIVING_OPS_MAP_UNIFIED_DATA_MODEL_W052.md`,
  `prototype-room/registry/CLIENT_ENGAGEMENT_REGISTRY_MODEL.md`, and
  `prototype-room/registry/client-engagement-surface/{README.md,index.html}`.
  The last file defines `productCatalogRelayContract()` and the adjacent cascade.
- Reviewed Client Engagement app in `sharpdots-apps-p005-w007a/apps/client-engagement`.
  That checkout has synthetic workspace routes, not an authenticated product
  catalog endpoint for Estimator. No relevant Zoom-derived decision was found.

## CE connection boundary

The eight-service CE draft has a local read-only backend connection, CE-aware
Browse products UI and draft publishing safeguards. See
[catalog connection](ce-catalog-connection.md). It preserves contribution-margin
pricing without changing the older import calculator. Production remains off;
source revisions are never silently converted, mixed or refreshed into saved work.

Confirm the current deployed Client Engagement/Living Ops catalog endpoint,
authentication, revision semantics, and rates before implementing live sync.
The separate import option remains available. No successful live catalog read is
claimed; the builder does not reserve people, create CER engagements, schedule execution, or
relay to Xero. Such integrations require a reviewed contract and separate release.
Complex subscription pricing requires a capable adapter before those products can
be selected. Approved engagement handoff should reuse the frozen S snapshot.

## Verification

- `npm test`: 28 passing tests, including shared/default conflict calculation,
  annual/hourly/one-time normalization, incomplete pricing, catalog gates,
  snapshot isolation, capacity, proposal-ledger parity, and sample provenance.
- PGlite tests exercise the existing CRM store with two immutable Services
  versions and verify cost, override, and capacity JSON round-trips.
- `node services/smoke.cjs`: localhost-only Playwright checks for import, product
  selection, edits, capacity, save/version/restore, proposal and CSV rollups,
  sample send guard, and legacy scratch compatibility. Desktop/mobile screenshots
  and overflow/edit checks at 1440, 1188, 768, and 390 pixels; no page errors.
- All writes during verification use synthetic browser state or local disposable
  test databases. No live customer, signing, billing, or capacity data is changed.
