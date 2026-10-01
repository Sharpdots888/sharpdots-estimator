# Client Engagement Catalog Connection

## Current Status

Released and activated September30: Estimator v52 / PR41 main6119417 and CE v28 /
PR98 application subtree d428e363. Live read verified workspace3/sharpdots,
revision136, eight products / 120 rows; John has now confirmed seeing the real
products in Estimator. Existing catalog draft/publishing restrictions remain.
The older implementation and activation notes below are historical and do not
mean this reader still needs deployment or a new key. The separate closed-proposal
return path is tracked in [CE proposal handoff](ce-proposal-handoff.md); it is not
enabled by the read credential.

## Approved release - September 30, 2026

John approved proceeding with release and activation after the distinction between
the synthetic preview and the live connection was explained. This supersedes the
local-only release restriction in the implementation history below. Scope is both
reviewed apps, a new dedicated read credential, and read access to workspace
`3 / sharpdots`. Existing Portal authorization, CRM access, source membership,
database credentials, data and draft-publishing restrictions remain unchanged.
No source edits, grants, migration, sending or price approval are authorized.

Release baseline: Estimator v50 / PR40 dd6f7a6 (v49-v50 updated database URLs;
preserve them), CE v26 / application subtree 4ec2058. CE's deployed catalog is on
`codex/client-engagement-catalog-editor` at 9bb0bff, not monorepo main. The narrow
reader PR targets that branch; deploy only `apps/client-engagement`, not the
monorepo root or unrelated stacked PRs. Deploy code disabled first, then configure
only the four catalog settings below. Never record the key in Git or logs.

Release verification on official Node v22.23.2: Estimator 59/59; CE 180 pass,
3 explicitly gated database tests skipped; CE build/check, 376 pricing-parity
cases and the read-only cross-app HTTP/PGlite rehearsal pass. Earlier browser
checks cover CE and legacy flows, revision pins, client guards and mobile layouts.
Hosted read, release IDs and signed-in browser verification must be recorded after
deployment; local success is not evidence of a live catalog read.

Revocation: disable either catalog feature flag. Code rollback baselines are
Estimator v50 and CE v26; preserve current unrelated config, especially the
Estimator database URLs. Source drafts and saved S records are never reversed.

## Implementation history (before release approval)

Local implementation, not a live integration. John approved the dedicated
server-to-server, read-only connection restricted to workspace `3 / sharpdots`,
with operator membership checks. This approval does not permit deployment,
source edits, sending, new memberships, database changes or final price approval.

The Estimator transport/read route and CE source endpoint are implemented locally,
disabled by default. The user explicitly approved publication of the required
[source planning issue97](https://github.com/Sharpdots888/sharpdots-apps/issues/97).
The source implementation is isolated on `codex/estimator-catalog-read` from
9bb0bff; the active Living Ops checkout and catalog edits remain untouched.
Both sides passed a local HTTP/disposable-database integration rehearsal.

Browse products is now connected to the same-origin reader in the local build.
The live connection remains disabled. Import is a separate, explicit alternative;
neither an imported catalog nor a cached response silently replaces a failed CE
read. No production source database was read or written, and no production
credentials or configuration were changed. Existing calculations remain on their
original pricing model. CE configurations are restricted to internal review.

Source evidence: sharpdots-apps PR87, commit
`9bb0bff3e1b47dc90ff88252bbab48e7984949af`,
`catalogs/eight-services-2026-09-30/`. Its saved projection is revision 136,
**not a fresh production read**. Read the current saved revision through the
approved connection before offering products; later edits take precedence.

Tracking: https://app.clickup.com/t/868jnxdp7
Decision: [Sharpdots AI OS Decision Log](https://docs.google.com/document/d/1Jy-VrcoUpYANr1uGC1oNJbxJDiQFTbulx3511LZffpo/edit),
"CE catalog: approved read-only Estimator connection".

## Implemented flow

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
- `lib/service-catalog-reader.js`: dependency-injected source validation and adapter.
- `lib/ce-catalog-transport.js`: server-only, fixed HTTPS source, dedicated read
  key, fixed workspace, verified actor header, no cookies, no redirects, no cache,
  10-second deadline, 5 MB streamed byte limit, and redacted failure responses.
- `lib/service-catalog-endpoint.js` and `server.js`: `GET /api/services/catalog`
  requires a valid Portal session even when general app authentication is in local
  disabled mode. It rechecks current CRM access through `authorizeActor`, rejects
  other methods and query parameters, and returns no-store draft projections.
  Only the actor ID is forwarded; browser headers, customer information and
  session credentials are not relayed to CE.
- `services/ce-fixture.cjs`: synthetic contract fixture, not an authoritative
  product library. Actual source data is supplied to the verifier by local path.
- Existing JSONB persistence tests save two review configurations, reload both,
  and verify the first S version, pinned proposal and old Services estimate stay
  unchanged. `catalogConfiguration` explicitly selects the CE calculator and UI;
  malformed configuration metadata fails closed instead of falling into the
  legacy zero-price calculator.
- `services/ce-engagement.js` and `services/ce-builder.js`: browser configuration,
  revision-pinned selections, unknown-cost display, component exclusions and
  overrides, contribution-margin/reserve/fixed-fee controls, explicit shared
  pricing owner, term confirmation, and derived role hours.
- `lib/services-publishing-guard.js`: rejects CE draft configurations before
  DocuSeal transaction insertion or provider calls. With CRM enabled, it reads
  the saved proposal and referenced immutable S version, not browser readiness
  flags. Missing proposal/source versions fail closed. Dormant CE editor state
  in a record using a legacy scenario does not alter that scenario's pricing.

The adapter does **not** rename a candidate export to the older
`living-ops-estimator-services-v1` contract. That would falsely imply compatibility
with the scalar markup calculator. The two configuration models cannot be mixed
within one Services record. Use a new S record to switch source models or adopt
a newer catalog revision; refreshing never rewrites selected products.

### Publishing and review

Use in internal proposal saves the S record, pins its version, includes Services,
and selects Internal audience. It does not remove other proposal sections.
Client PDF/CSV buttons and direct export functions reject included CE draft
pricing. Client previews omit the draft Services block, and the print guard hides
the blocked proposal for browser printing. The publishing panel shows the reason.
Internal previews/CSV remain available with draft warnings; unknown totals are
shown as Unknown, not zero. DocuSeal preparation is blocked for every CE draft,
even if numerically complete. No approval checkbox bypasses source review.

The server guard verifies stored pricing provenance; it does not replace the
app's existing browser-supplied document HTML with a server-rendered document or
claim protection against arbitrary manually forged document content.

### Local preview

The existing localhost preview keeps all document sends disabled. To review CE
screens without credentials or a source database:

```sh
PORT=4201 CE_CATALOG_PREVIEW=true node crm/preview-server.cjs
```

Open `http://127.0.0.1:4201/index.html?crm=1&cePreview=1`, then Proposals, Services,
Browse products. This server exposes only a clearly labeled synthetic catalog.
It never loads local environment credentials or connects to a database. The
preview option is not used by the production server. No product auto-loads.

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

Implemented locally, not deployed or activated:
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

### Approved authorization design

The current CE route uses its own app-bound Portal session plus delivery
membership. Estimator currently stores a legacy Portal user session without CE
workspace/application grants. Neither is a valid cross-app service credential.
Same user IDs do not by themselves authorize a catalog read.

Approved design for the first connection: a **dedicated server-to-server read-only
credential**, restricted by the CE server to this endpoint and workspace
`3 / sharpdots`. Estimator obtains the actor from its verified session and checks
current CRM access; CE also verifies that actor's active workspace membership.
Do not accept an actor/workspace chosen by the browser. Keep secrets server-side,
require HTTPS, limit response size/time, refuse redirects, avoid logging tokens,
and provide independent revocation. An eventual Portal-issued delegated token may
replace this transport; do not share session cookies or add warehouse credentials.

Both sides are implemented. CE validates the service credential, checks active
workspace membership and reads one compatible saved revision in a read-only
transaction. No blanket CE access or automatic membership creation is authorized.
Existing CE browser/other API routes still require their own Portal/D4 session;
the service key cannot open them. The legacy workspace-1 routing issue stays separate.

### Configuration and activation gate

Do not set these values in production as part of local implementation:

| App | Setting | Purpose |
| --- | --- | --- |
| Estimator | `ESTIMATOR_CE_CATALOG_ENABLED` | Exactly `true` enables the backend; omitted/false disables it |
| Estimator | `ESTIMATOR_CE_CATALOG_READ_KEY` | Dedicated 32-byte secret encoded as 64 lowercase hex characters |
| CE | `CE_ESTIMATOR_CATALOG_READ_ENABLED` | Independent source-side revocation switch |
| CE | `CE_ESTIMATOR_CATALOG_READ_KEY` | Matching dedicated read credential, never a Portal or warehouse key |

Estimator still requires CRM enabled and a live current-user authorization check.
The URL and workspace are constants, not browser or environment overrides. The
intended source is `sharpdots-client-engagement-f985e9fee403.herokuapp.com`, path
`/api/integrations/estimator/catalog`. No secret has been generated for production;
tests use random ephemeral synthetic keys. Activation requires separate approval
for production configuration and both app deployments after source implementation
and end-to-end verification. Disabling either side must prevent future reads;
previously saved record snapshots are not retroactively deleted or altered.

## Remaining activation work

Review and reconcile the CE implementation with newer Living Ops source work.
Review the integrated Services screens and publishing guards. Verify the Node22
deployment runtime and real signed-in current-revision reads. Production release
of both apps and provisioning the dedicated credential remain separately approved
actions. Catalog price/delivery approval is also outstanding; activating a read
connection alone does not make draft products publishable.

## Verification

`npm test`: 59 passing tests on Node v26.7.0, including old Services, CRM,
signing/auth invariants, adapter validation and snapshot isolation. New tests cover
transport scope, byte/deadline limits, redaction, current-user deactivation,
allowlist removal, wrong actor, malformed source, and fresh revision reads.
The real server route was exercised over loopback with forged/expired/missing
sessions in all three auth modes, method/query rejection and disabled status.
HTTP tests disable local env loading, replace PostgreSQL with a rejecting fake
pool, disallow outbound fetch inside the server, and stop all listeners. They
also verify CE signing rejection before any database insert or provider call.
Node22 deployment-runtime verification remains outstanding.

```sh
node scripts/verify-ce-catalog.cjs /absolute/catalog.json /absolute/catalog-model.mjs
```

Using source commit 9bb0bff / revision-136 local projection: exact eight products
and 120 recipe rows; **376 parity cases** against CE's actual `recalculate` function
passed (base, every-row subtraction, doubled quantity, cadence swap, six-month
term). Source files unchanged. No production API calls, data imports or sends.
```sh
node scripts/verify-ce-catalog-connection.cjs /absolute/path/to/apps/client-engagement
```

The cross-repo verifier uses the real CE HTTP endpoint and Estimator consumer with
synthetic saved data in disposable PGlite. It verifies scoped membership and CRM
revocation, key failure, current revisions, null costs, pinned snapshot isolation,
missing/seed/incompatible revision denial, no source mutation and SQL-enforced
read-only transactions. Its only URL substitution is in the injected test fetch;
runtime does not support configurable destinations. All servers close on completion.

CE `npm test`: 180 pass / 3 unrelated explicit-database skips, plus static/build
checks. Its response projection and this adapter also accept all eight products
from the saved revision-136 local file, leaving that input unchanged.

- `node services/ce-smoke.cjs`: synthetic intercepted reader; selection,
  save/version/restore, shared scope, terms, pricing edits, null costs, refreshed
  revision isolation, authorization/error states, capacity, client PDF/CSV/print
  and DocuSeal guards; layouts at 1440, 1188, 768 and 390 pixels.
- `node services/smoke.cjs`: existing imported catalog, example, saved records,
  capacity, proposal rollups and Start from scratch regressions.
- `node services/ce-source-smoke.cjs /absolute/catalog.json`: local eight-product
  projection UI, all recipe rows, complete/incomplete totals and source lineage.

No successful production read or actual end-user acceptance is claimed. No live
connection, deployment, sends, schema changes or catalog edits occurred.
