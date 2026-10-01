# Client Engagement Catalog Connection

## Current boundary

Local implementation, not a live integration. Source-session handoff reports that
John accepted the eight-service library as a draft and authorized Estimator-side
integration planning/local work. Final prices, source publication, new credentials
or grants, schema changes and production deployment are not approved.

This first slice is deliberately not included in `index.html` or `server.js`.
Browse products still uses the existing import bridge in production. No new
catalog has been imported, no source database was read or written, and no login,
grant or client document behavior changed. The local adapter is a separate module;
the legacy Services model and existing saved calculations remain unchanged.

Source evidence: sharpdots-apps PR87, commit
`9bb0bff3e1b47dc90ff88252bbab48e7984949af`,
`catalogs/eight-services-2026-09-30/`. Its saved projection is revision 136,
**not a fresh production read**. Read the current saved revision through the
approved connection before offering products; later edits take precedence.

Tracking: https://app.clickup.com/t/868jnxdp7

## Proposed flow

1. Services opens the shared Product library through an authenticated, same-origin
   Estimator route. The server obtains a narrowly authorized CE catalog snapshot.
2. Refresh reads the saved source revision. It does not use a seed or silently
   fall back to localStorage if access is denied or the source is unavailable.
3. Choosing a product creates a client configuration containing immutable source
   definitions, recipe, maps, pricing rules, source revision and fingerprint.
4. Users remove component rows, change quantities/cadence/term, and set explicit
   client-specific price overrides. Definition edits remain in Client Engagement.
5. Save/version uses the existing S-record snapshot store; proposals pin that S
   version. Catalog refresh never mutates any selected or saved configuration.

No engagement creation, staff reservation, agent execution, media purchase,
DocuSeal send or invoice is implied by selection.

## Local implementation

- `services/ce-catalog.js`: scoped source validation, complete recipe snapshots,
  subtractive configuration and CE pricing rules. It does not turn source drafts
  into `reviewed_template` or enable sending.
- `lib/service-catalog-reader.js`: dependency-injected read contract. The transport
  must authenticate the operator and authorize workspace access; this module does
  not supply a credential, implement authorization or register an HTTP route.
- `services/ce-fixture.cjs`: synthetic contract fixture, not an authoritative
  product library. Actual source data is supplied to the verifier by local path.
- Existing JSONB persistence tests save two review configurations, reload both,
  and verify the first S version, pinned proposal and old Services estimate stay
  unchanged. `catalogConfiguration` is reserved draft metadata in that test;
  the current renderer must not be used to price it before integration activation.

The adapter does **not** rename a candidate export to the older
`living-ops-estimator-services-v1` contract. That would falsely imply compatibility
with the scalar markup calculator. It retains the CE configuration separately
until a reviewed renderer/calculator dispatch handles this pricing method.

## Mapping and pricing

| Source | Estimator draft representation |
| --- | --- |
| Catalog ID, saved version, seed baseRevision, workspace | Immutable source identity and catalog fingerprint |
| Product ID, exact name, order, lifecycle | Product snapshot; retired products excluded from future selection |
| recipe component + cadence | Independently removable row; once/monthly remain distinct |
| Components, scoped map, work sequence, workflows, roles, resources | Full referenced definitions and relationships in the snapshot |
| Labor hours and role planning rates + provider allowance | One component unit cost; resource reference prices are not charged again |
| Null provider allowance or role rate | Unknown cost, never zero; blocks numeric totals unless the row is removed or explicitly costed |
| Reserve and contribution margin | Separate per-cadence calculation, not markup conversion |
| Pass-through allowance | No reserve or margin; separately tracked in cadence totals |
| Price overrides | Explicit once/monthly service fee overrides; pass-through added separately |
| Capacity demand | Derived hours after subtraction; unknown availability, no assignment/reservation |

For each product and cadence: round each extended component cost to cents; sum
service costs; round reserve to cents; divide cost plus reserve by
`1 - contribution margin`; round the fee up to the next $25 (matching CE); then
add pass-through. Term value is once plus monthly times the chosen term. Fixed
source price overrides remain fixed until explicitly changed, even after removal.

Bundling never blindly sums standalone selling prices. A common component/cadence
counts once after the user confirms quantity, cost and the product whose pricing
policy owns it. Different defaults remain a blocking conflict. Selecting products
with different default terms requires explicit confirmation of one engagement term.

All current products remain `under_review`. Numeric completeness is distinct from
approval: Salesmachine and Ad Service can produce planning totals, but this draft
adapter always returns `publishable: false`. The six incomplete products retain
all component definitions despite the old candidate exports having null numeric
snapshots. No local checkbox may convert source draft acceptance into final price
or delivery approval.

## Exact source-side requirement

Proposed endpoint (not existing or activated):
`GET /api/integrations/estimator/catalog` on Client Engagement.

Proposed response, only after source authorization:

```json
{
  "contractVersion": "ce-estimator-source-v1",
  "storage": "shared",
  "workspace": { "id": 3, "slug": "sharpdots" },
  "version": 136,
  "baseRevision": "source seed fingerprint",
  "catalog": {
    "schema": "sharpdots.launch-catalog.v1",
    "catalogId": "source catalog ID",
    "version": 136,
    "policy": { "currency": "USD" },
    "products": [],
    "components": [],
    "workflows": [],
    "roles": [],
    "platforms": []
  }
}
```

Arrays contain the actual complete source definitions, not this schematic empty
example. Preserve source order and IDs. Read one consistent saved revision from
`ce_catalog.drafts`; fail rather than initialize/reseed a missing source. Send
`Cache-Control: no-store`. Reject writes and unsupported scopes. Omit edit history,
field-editor metadata, member profiles, `knownPeople`, `lastEdited`, preserved
client baselines and customer records. Keep source maps, null costs and policies.

### Authorization decision required

The current CE route uses its own app-bound Portal session plus delivery
membership. Estimator currently stores a legacy Portal user session without CE
workspace/application grants. Neither is a valid cross-app service credential.
Same user IDs do not by themselves authorize a catalog read.

Recommendation for the first connection: a **dedicated server-to-server read-only
credential**, restricted by the CE server to this endpoint and workspace
`3 / sharpdots`. Estimator obtains the actor from its verified session and checks
current CRM access; CE also verifies that actor's active workspace membership.
Do not accept an actor/workspace chosen by the browser. Keep secrets server-side,
require HTTPS, limit response size/time, refuse redirects, avoid logging tokens,
and provide independent revocation. An eventual Portal-issued delegated token may
replace this transport; do not share session cookies or add warehouse credentials.

Approval is needed before creating that credential/grant or modifying either
app's authorization. No blanket CE access or automatic membership creation is
proposed. The legacy workspace-1 Portal routing issue stays separate.

## Remaining activation work

After authorization design is approved: implement/test the restricted source
endpoint and transport; add same-origin Estimator read route; connect Browse
products with loading/error/revision states; add CE-aware draft pricing rendering,
subtractive controls and shared-resolution UI; preserve old model dispatch; make
draft/unknown-cost restrictions cover proposal PDF/CSV/DocuSeal preflight. Test
real current-revision reads and old-record compatibility. Review and deployment
are separate gates. This document does not claim those screens are complete.

## Verification

`npm test`: 42 passing tests, including old Services, CRM, signing/auth invariants,
adapter validation, conflicts, nulls, revisions and durable snapshot isolation.

```sh
node scripts/verify-ce-catalog.cjs /absolute/catalog.json /absolute/catalog-model.mjs
```

Using source commit 9bb0bff / revision-136 local projection: exact eight products
and 120 recipe rows; **376 parity cases** against CE's actual `recalculate` function
passed (base, every-row subtraction, doubled quantity, cadence swap, six-month
term). Source files unchanged. No production API calls, data imports or sends.
No browser test is claimed for this slice: it adds no active UI or runtime route.
