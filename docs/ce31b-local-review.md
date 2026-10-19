# CE31B local review

October19,2026. Approved local implementation only. No push, merge, deployment,
production read/write, credentials, grants, schema changes or customer sends.
Prior commits65a4a44/e1c8971 are preserved. Shared New project checkout and
completed O-000001/TEST Opp were not changed or replayed.

## What is ready

- Existing read route negotiates paired structure/assessed costs explicitly.
  Authenticated actor, fixed workspace3, HTTPS destination, timeout and full
  response limit remain intact. V1 without the header remains unchanged; v2
  does not fall back to legacy rates on failure.
- Eight single-service defaults match source144 exactly. Configured scope,
  quantity, cadence and term use frozen allocated rates. Provider bills and
  company allocations are not recalculated here. Unknowns and bundles block.
- Services unit cost, component selling rate and product markup can be adjusted
  with a reason. Original/effective values appear under Adjusted from product.
  Markup is uplift on cost, not contribution margin. Pass-through stays unmarked.
- Proposal Content > Services pricing > Adjust pricing opens the same controls
  on a proposal-only copy. Save proposal version preserves the saved Services
  baseline and every previous proposal. Reset creates another proposal version.
  Another open Services draft cannot replace pinned proposal pricing.
- Server-generated proofs and immutable source evidence survive JSONB storage.
  First use/replacement compares to the authorized fresh paired source; ordinary
  edits compare to the prior saved baseline without automatically refreshing.
  A caller cannot reseal edited inherited pricing or definitions and suppress
  the adjustment indicator. No new trust in a browser fingerprint is introduced.
- Existing client PDF/CSV/DocuSeal draft guards remain. Comparison details stay
  in internal controls, not client documents. CE intake contains both saved
  baseline and effective proposal configuration, with recalculable proof.

## Verification

Node22.23.3 full `node --test`:112 pass, zero failures/skips. Includes actual
isolated PGlite JSONB version round-trips and optional invocation of CE's current
`domain/estimator-intake.mjs` validator. Private source fixtures are intentionally
required; absent fixtures fail qualification rather than count as a green skip.

Playwright Chromium:
- `services/ce31b-smoke.cjs`: paired read, Services cost/selling rate/markup,
  proposal-only cost/selling rate/markup, new versions, restore/reset, unchanged
  Services, independent open draft, client guards;1440/1188/390 widths.
- `services/ce-smoke.cjs`: legacy v1 read/configuration/versioning/shared scopes,
  unknowns, publishing guards and1440/1188/768/390 layouts.
- Screenshots inspected: `/private/tmp/ce31b-proposal-{1440,390}.png`.
  All browser traffic is restricted to localhost; no credentials are loaded.

CE-owned native PostgreSQL proof was read from
`/private/tmp/ce31-estimator-cost-handoff/ce31b-native-store-check.json`:
- Baseline packet `8c9f25568f03f28fe41e2047c88557f8e7c72c79ff64e57f2d2fcb7d34cc9c55`:
  term cost2426077cents, zero deviations, accepted into52 local work items.
- Proposal packet `8dcf9da81fa72bbe1012953a4b162f27a92021f21a8611a4f0efcd6686bfbd0f`:
  term cost2467975cents, four deviations, accepted into52 local work items.
- Both preserve immutable source. Existing amendment protection rejects changed
  packets after acceptance. CE reports its two owned databases were dropped.
  This is local evidence, not a live acceptance or financial authorization.

## Pure source freeze

For CE's reviewed server-only copies; no runtime cross-repo import:
- `services/ce-catalog.js` SHA256
  `c21ba29a4f5885dd1f0b7bee89e0ee6b08c70c3ace640dd9d356640b7d54fd60`
- `services/ce-pricing.js` SHA256
  `def9c0d314c5d6579027a68b98cd7da8ffedf3609ba4ba2596429844b709c32d`

The final pricing module additionally checks reported default totals during
paired adaptation. CE must reconcile its pinned copy to this final hash (apart
from the documented CJS require suffix) before claiming an exact paired freeze.
Definitive wire fields: [pricing contract](ce31b-pricing-contract.md).

## Review and release gates

Local preview: http://127.0.0.1:4213/index.html?crm=1&cePreview=1
Browse Products uses the validated saved144 recovery fixture, not live CE data
and not a new synthetic price catalog. Preview edits are browser-local only.

Confirm the final CE source/copy hashes and paired release candidates, then ask
John for separate publication/deployment approval. Source CE support must precede
the new Estimator consumer. No configuration change is included here. Shared-work
bundles and commercial sending approval remain gated. Any later hosted rehearsal
must use a new fictional opportunity, not the completed original rehearsal.

Rollback planning must retain saved v2 records and accepted work; never rewrite
them to v1 or silently reprice from a newer catalog. Previous v1 data is untouched.
The local pre-change code point is65a4a44, but deploying that version over new v2
data would require review of its unsupported-record behavior first.

Tracking remains ClickUp868jnxdp7 / CE issue124 and PR116. No tracker, Drive or
cross-chat message was posted under this local-only authorization. CE reads the
contract/review directly; its release owner controls receiving-side changes.
