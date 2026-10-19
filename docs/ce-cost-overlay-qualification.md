# CE31 Cost Overlay Qualification

Date: October 19, 2026. Disposition: **qualified_with_constraints**.

The eight unchanged, single-product defaults from prepared catalog144 reproduce
CE's once, monthly and term budgets and term costs exactly in the existing
Estimator calculator. This qualifies local draft arithmetic, not a live consumer,
commercial approval, a configurable bundle, vendor pricing, available capacity,
delivery or invoicing. Runtime cutover remains blocked by the decisions below.

## Scope And Evidence

- Authority: CE31 local qualification handoff, CE commit
  `61537f8a44b746e3ebd64f85512d1ff9e0c5f960`,
  `docs/client-engagement/31-estimator-cost-qualification-handoff.md`.
- Estimator checkout: `estimator-crm-draft`, branch
  `codex/ce-engagement-handoff`, baseline
  `e1c8971fc84ef4ae1d1c5c66d3676f8f5bedfcd5`. The existing local acceptance
  documentation commit is preserved; no rebase, reset or push was performed.
- CE reports livev44/catalog144. That context was not freshly checked against
  production. V2 is prepared, not served; the existing v1 connection is unchanged.
- Evidence: private projected pairs in
  `/private/tmp/ce31-estimator-cost-handoff/`: `source`, `shared`,
  `different-rates`, `missing`, each with `-v1.json` and `-v2.json`.
  No backup, credentials, customer records or production database was opened.
- Source calculations and preparation evidence were read from CE's checkout.
  The engine hash was independently reproduced from the three source files at
  commit61537f8, not by importing its server or executing its preparation scripts.
- Tracking reference: [Estimating App - Project Calculation](https://app.clickup.com/t/868jnxdp7).
  No ClickUp, Drive, Buzz or cross-chat write was made for this bounded task.

Only these new files belong to this qualification:

- `services/ce-cost-overlay-qualification.cjs`: pure, test-only overlay adapter
  and unchanged-default evidence gate; no runtime/browser import or I/O.
- `services/ce-cost-overlay-qualification.test.cjs`: private-fixture conformance
  and negative tests; fails explicitly when the required fixtures are missing.
- `docs/ce-cost-overlay-qualification.md`: this report.

The original O-000001 rehearsal, accepted snapshots and all existing runtime files
remain untouched. No service send, deployment, configuration, schema, credential,
provider, vNext, Hermes or n8n change occurred.

## Exact Source Pins

Workspace `3 / sharpdots`; catalog `sd-launch-2026-09-21`; revision `144`.
Contract `ce-estimator-costs-v2`; calculation `ce-platform-costing-v1`.

| Pin | SHA-256 |
| --- | --- |
| Base revision | `800a36a53d797b604a3a9406a40d590d25d320075693202694493ef706d1569c` |
| Calculation engine | `b573cbc0d01e783db82d2e9bd62372cb28d710b606f389959781f53210358f22` |
| V2 source hash | `5487748b9443b1972ea147a1052e2689147977028e8b00a6163ac74a723d9f92` |
| V1 structural hash, local fixture pin | `d4632fdbf6458719042a67411c9bd3bb12276d686ec50bda01c2502c27edf9fc` |

The engine covers `platform-costing.mjs`, `catalog-model.mjs` and
`estimator-costs.mjs` in that order, separated by newlines. The source hash is
CE's insertion-ordered `JSON.stringify` of the source object without `sourceHash`
and `activation`. The structural hash is this harness's hash of the parsed v1
envelope; it is not a newly adopted CE contract field. Exact synthetic-pair hashes
are pinned separately in the test. Hashes detect mismatches, not authorization.

## Default Results

USD, using unchanged source term, quantity, cadence and pricing policy:

| Product | Months | Once budget | Monthly budget | Term budget | Term cost |
| --- | ---: | ---: | ---: | ---: | ---: |
| Salesmachine | 3 | 7,600 | 9,925 | 37,375 | 24,260.77 |
| OmniMail | 1 | 15,025 | 3,700 | 18,725 | 12,630.72 |
| Capture Pixel | 3 | 2,950 | 2,925 | 11,725 | 6,995.69 |
| Data Service / Intent Data Stream | 3 | 1,750 | 4,250 | 14,500 | 8,667.66 |
| Marketing Engagement | 3 | 5,025 | 4,825 | 19,500 | 11,655.70 |
| Ad Service | 3 | 6,450 | 5,250 | 22,200 | 16,881.10 |
| Web Design | 3 | 11,725 | 850 | 14,275 | 8,520.18 |
| Automate Business | 3 | 16,250 | 2,925 | 25,025 | 14,993.76 |

All 120 recipe rows, component/workflow definitions, scoped delivery maps, work
sequences, roles, policies and pass-through classifications are retained. The
adapter replaces product-local recipe rates and extended amounts; it never adds
an assessed provider cost to the old allowance. V1 definitions, including their
legacy calculated metadata, are preserved as structural evidence; they are not
the authoritative v2 totals. New assessment/pricing metadata is separate.

All eight remain `under_review`, `reviewRequired: true`,
`enabledForSending: false`; results remain `publishable: false`. Capacity demand
is still an hours calculation with availability and reservations unknown.

## Shared Costs And Precision

- Fictional250 fixed pool: standalone product allocations187.50 +62.50 =250
  monthly,750 for the three-month term. Each product has one costed row; resource
  references create no second charge. This is allocation reconciliation across
  source products, not a bundle quote or a provider invoice.
- Different-rate fixture: the same component costs125 per unit in one product
  and41.666667 in another. At quantities1 and3, each extends to125. Rounding
  41.666667 to41.67 first produces125.01 and is incorrect for this source.
- `providerPerUnit` can be a rounded display breakdown. Do not reconstruct
  authoritative unit cost from it. Preserve `unitCost` precision and round each
  extension only, then reserve, fee rounding and pass-through per existing rules.
- Five actual products reference Hostinger in v2 cost assessments without a
  Hostinger reference in their legacy product-level operational maps. Hostinger
  exists in the full matching v1 catalog. The proof preserves these separately
  under `costAssessment.platforms`; it does not invent delivery map membership.
- Missing-currency fixture rates stay null despite a legacy unit cost of zero.
  Missing rows/rates, identity/revision/hash mismatches, duplicate rows, source
  issues and inconsistent source totals fail closed. An explicit zero/removal
  can complete ordinary arithmetic but cannot silently qualify missing v2 costs.

## Unresolved Contract Decisions

| Area | Observed behavior and required decision |
| --- | --- |
| Subtraction and quantity | Frozen rates remove/scale a previously allocated share. Doubling the fictional audience quantity makes its cost375 plus the other share62.50 =437.50, not the original fixed250 pool. Decide whether rates are fixed planning benchmarks or require a new CE scenario allocation. No automatic reallocation is qualified. |
| Cadence and term | CE's allocation weights depend on source cadence, term and configurations-per-month. Local cadence/term edits recalculate prices using frozen rates only. The returned pair omits the source cost-plan/pool inputs needed to reproduce a changed scenario. Decide source recalculation versus explicit frozen-rate semantics. |
| Bundles | Existing calculator requires explicit shared quantity, unit cost and pricing owner. Resolving to the audience default yields187.50 in the shared fixture or125 in the different-rate fixture, dropping the other allocated share. Choosing a manual250 would be a policy invention. Define deduplication, retained provider shares, labor scope and pricing ownership first. |
| Overrides | Explicit unit-cost and fee overrides calculate correctly in the ordinary engine; a fee-only override changes selling price, not cost. Define separate authority/provenance for fee versus cost overrides. This harness does not promote either to source-assessed pricing. |
| Atomic source pairing | Prepared v2 lacks its own workspace and structural digest. V1 strips cost plans and provider pricing models; all three fictional variants have identical v1 structure but different v2 hashes. The proof relies on independent fixture pins. Production needs an authenticated, atomic or explicitly bound v1/v2 pair with workspace, revision, base, engine and source identities; never mix two independent latest reads or fall back to legacy costs. |
| Snapshot and storage | Pure JSON stringify/parse preserves new pins and calculation results, without mutating prior configurations. Reordering object keys keeps arithmetic identical but changes insertion-ordered hashes. Define canonical consumer snapshot hashing separately from CE's source hash, then qualify real JSONB save/version/restore and exact S/P pins. This local test is not a persistence or intake compatibility certification. |
| Resource lineage | Distinguish provider-allocation references from operational platform maps. V1 does not expose the provider charge model, so the proof verifies supplied rate arithmetic and identities, not independent recalculation of the full provider bill. |

The test-only `qualifyDefault` gate refuses edited configurations, bundles,
unknown costs and invalid pins rather than manufacturing a configuration policy.
This is a bounded qualification rule, not an approved production product policy.

## CE Receiving-Side Gate

CE supplied `/private/tmp/ce31-estimator-cost-handoff/review-precision.json` and
its reproducer. Its `seedReview`/`reviewTotals` path rounds incoming unit costs
to cents and re-extends them. Reported drift is +1 cent for Salesmachine and
+6 cents for Automate Business. This harness independently reproduces the
round-before-extension cause from the prepared fixture; it did not execute CE's
receiver or write a review. The unmodified Estimator calculator matches v2 exactly.

Estimator's existing packet retains fractional configuration rates and exact
extended cents, while also emitting rounded `unitCostCents`. CE must preserve
untouched source extensions under an explicitly versioned new-review cost basis
and define edited-row semantics. Existing accepted review calculations and the
completed TEST Opp must remain pinned. CE owns that fix and its tests.

## Verification

Node **v22.23.3**, local executable:
`/Volumes/JTMMX/Users/JT/.npm/_npx/52027bd8fc0022aa/node_modules/node/bin/node`.

```sh
node --test services/ce-cost-overlay-qualification.test.cjs services/ce-catalog.test.cjs lib/ce-catalog-transport.test.cjs
git diff --check
git status --short
```

Use the Node22 executable above for `node`. Required fixtures remain private and
are not committed. A checkout without them cannot claim this proof; tests fail
instead of skipping. Do not merge this private-fixture suite into general CI
without a separately reviewed fixture distribution/gating plan.

Focused result: **47 passed, 0 failed, 0 skipped**:25 new qualification tests,
11 existing calculator/reader tests and11 existing transport/authorization tests.
The latter use injected responses and disposable in-memory PGlite, not live
services. Baseline before changes:22/22 passed. Whitespace and bounded-file
checks also pass. No application server, production connection or browser was
started; no full-app, new JSONB persistence, authenticated v2 transport, send or
receiving-review integration test is claimed.

## Exact Next Safe Change

Review this disposition with CE, then agree a versioned contract for frozen versus
recomputed allocation, bundle ownership, overrides, atomic pairing and canonical
consumer snapshot lineage. A narrowly default-only internal preview is an option,
not approved activation. CE should complete its versioned receiving-review
precision work independently, preserving existing accepted records.

Only after those contracts are settled should a separately approved implementation
add the protected paired projection, consumer/save handling and paired local
JSONB/intake round-trip tests. Keep v1 and old saved S/P records on their original
calculation basis. Preserve draft publishing guards. Deployment, credentials,
activation, customer sends, delivery and invoicing remain separate gates. Nothing
in this qualification authorizes replaying the completed handoff.
