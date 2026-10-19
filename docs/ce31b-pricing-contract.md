# CE31B configured pricing contract

Local implementation contract, October 19, 2026. No deployment or live intake
authorization. Existing v1 records and packet shape remain unchanged.

## Configuration

`services/ce-pricing.js` is the executable serializer/calculator. New assessed
configurations use `schema: ce-services-configuration-v2`. Existing configuration
fields remain; `costSourceJson` preserves the exact JSON.stringify serialization
of the received costs object excluding `sourceHash` and `activation`. It remains
a string through JSONB. Hash its UTF-8 bytes for the existing cost sourceHash.

Source adds `costBasis: ce-assessed-frozen-rates-v1`, paired contractVersion,
hashAlgorithm, structuralHash, calculationVersion, calculationEngineHash,
sourceHash and pairHash. Product and catalog fingerprints use recursively
key-sorted canonical JSON, excluding their own fingerprint. Product recipes keep
immutable assessed unitCost and extendedBaseCost plus full `costAssessment` rows.
Product `costAssessment` retains source basis, pricing, and provider references;
it does not modify operational component/platform maps.

Row overrides are `rowOverrides[productId][originalComponentId:cadence]` with
included, quantity, cadence, unitCost, sellRate (nullable), and reason. Only these
fields are allowed. Baseline sellRate is null (calculated product policy).
Pricing overrides are `pricingOverrides[productId]` with method `markup` or
`margin`, corresponding decimal markup/margin, decimal reserve, feeOverrides
{once, monthly} (nullable), and reason. Markup converts to margin m/(1+m).
Term changes retain termMonths/termConfirmed plus termReason. Every actual
deviation requires a reason. Pass-through cannot have a selling-rate markup.
Single-service configurations only; assessed bundles are blocked.

Explicit component selling rates replace that row's calculated fee contribution.
Remaining delivery cost plus reserve is contribution-margin priced and rounded
up to25; fixed row extensions are added. A fixed product fee and fixed row selling
rate in the same cadence conflict and block calculation. Provider pools are never
reallocated. Unknown costs do not become zero. Draft sending guards remain.

## Proposal-only pricing

Saved `proposal.servicesPricingOverride`:

```json
{
  "schema": "ce-proposal-pricing-v1",
  "sourceRecord": {"number": "S-100001", "version": 1},
  "baseConfigurationHash": "canonical-sha256-of-exact-saved-Services-config",
  "configuration": "full effective ce-services-configuration-v2 object"
}
```

The configuration field above is an object, not a string placeholder in actual
payloads. Its source, costSourceJson, catalogId, catalogFingerprint and products
must exactly match the saved Services baseline. Only override/term fields may
differ. Changes save a new proposal version, never overwrite Services. Reset
restores that saved Services baseline and is also a new proposal version.

## Intake packet

Outer schema stays `ce-estimator-intake-v1`. For assessed configurations only:

- `configuration` is effective proposal configuration, or exact saved Services
  configuration when there is no proposal-specific adjustment.
- `snapshots.services` remains the exact saved Services snapshot; its digest and
  source number/version remain unchanged. `snapshots.proposal` is the exact saved
  proposal snapshot including the optional servicesPricingOverride.
- Existing source.catalog, components, capacity and servicePricing are derived
  from the effective configuration. Precise unit/extended rates remain in the
  configuration; integer cents fields remain the existing display representation.
- New `pricingEvidence` contains `schema: ce-intake-pricing-evidence-v1`,
  `basis: services | proposal`, `baselineConfigurationHash`,
  `effectiveConfigurationHash`, and `proof`.
- `proof` is `ce-configured-pricing-proof-v1`: canonical configurationHash,
  overrideHash of {rows, pricing, term, termReason}, source, calculated totals,
  and deviations. Each deviation has productId, optional rowKey, name, field,
  original, effective and reason. Same proof is persisted internally with the
  corresponding Services/proposal snapshot as `cePricingProof`.

Receiver must first validate both snapshot digests and proposal Services pin,
then validate the proposal override's baseline hash and immutable fields. For
v2, effective equality to saved Services is required only without an override;
with one, effective equality is to the proposal's configuration. Recalculate
proof/totals and compare, rather than trusting caller totals. Reject mismatches,
unsupported engines, incomplete costing and multiple assessed products. V1 keeps
its old equality and calculation behavior. All admission booleans remain false.

Current actual fixture: `/private/tmp/ce31-estimator-cost-handoff/paired-source.json`.
Revision144, pairHash af72e2aaee778057496c93ec94b39d362d34251658df84618cc47206b210ab44,
engine b573cbc0d01e783db82d2e9bd62372cb28d710b606f389959781f53210358f22.
Not a production freshness claim. CE receiving owner reads this file directly;
no cross-chat message or external publication is implied.

## Local validation progress

- Actual JSONB save/reload now passes through Estimator's authorized record store
  and CE's current `validateIntake`, using fresh fictional records only.
- Generated fixtures: `ce31b-baseline-packet.json` and
  `ce31b-proposal-packet.json` in the private directory above. Both now include
  the fictional closed timestamp. The proposal-only fixture records agreement
  at its actual adjusted prices, preserving CE's agreement-reconciliation gate.
- First adoption or deliberate baseline replacement is compared to an authorized
  fresh paired catalog read on the existing path. Ordinary Services versions
  compare inherited fields against their prior saved baseline and do not reprice
  from current catalog. Caller-resealed pricing+definition edits and component
  replacement fail the actual save boundary. No new credential, table or grant.
- Proof: `scripts/test-ce31b-persistence.cjs`; fixture generation is opt-in with
  CE31B_WRITE_FIXTURES=true. CE31B_RECEIVER_PATH optionally runs the actual CE
  validator before producing fixtures. Browser qualification now passes both
  v2 and legacy v1 paths; final source hashes and evidence are in
  [local review](ce31b-local-review.md).
