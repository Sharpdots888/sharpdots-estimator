# Draft PR Text - Not Published

Proposed title: **Consume assessed CE pricing with versioned Services and proposal overrides**

Repository: `Sharpdots888/sharpdots-estimator`.
Head: `codex/ce-engagement-handoff`. Base: `main`. Create as **draft** only.
No open PR for this head/base existed at the October 19 safety check.
Publication is held by the active Heroku webhook described in the
[release review](ce31b-release-candidate.md#github-source-publication-safety-check).
The text below is prepared locally; it is not a GitHub PR or release approval.

---

## Summary

- Consume CE's explicitly negotiated paired structure/assessed-cost catalog.
  Validate workspace, revision, engine and source hashes together, with no legacy
  pricing fallback when paired validation fails. Preserve no-header v1 behavior.
- Configure the eight individual services using frozen product-specific assessed
  rates. Quantity, cadence and term changes do not reallocate CE's provider pool.
  Unknown costs remain unknown; shared-work bundles remain gated.
- Allow Services unit-cost, selling-rate and product-markup adjustments with
  reasons. Show original/effective values and **Adjusted from product**. Markup
  is cost uplift, not contribution margin; pass-through remains unmarked.
- Allow proposal-only adjustments in **Content > Services pricing > Adjust
  pricing**. Save and reset create new proposal versions, preserving the pinned
  saved Services baseline, every prior version and unrelated open drafts.
- Validate immutable source evidence at the actual server save boundary. Preserve
  exact cost-source evidence and server-generated calculation/deviation proofs
  through JSONB storage and CE intake. Browser fingerprints are not authority.
- Carry both saved baseline and effective proposal configuration into CE's existing
  intake envelope. Preserve receipts, amendment protections and accepted work.
  Internal comparisons do not appear in client documents; draft publishing guards
  still apply to client PDF/CSV and DocuSeal preparation.

## Source Identity

- Frozen runtime candidate: `91fac0e6ea9967984647817114b3640a99a9284a`.
- Candidate Git tree: `7eb0cb80ccad6b7f2d24585c0bfbcfa7032ea4e8`.
- Source archive SHA-256:
  `1e050151ceceb7fe0f63519a09c706f784cc4505c64e6391d859025f9743ad10`.
- `services/ce-pricing.js` SHA-256:
  `def9c0d314c5d6579027a68b98cd7da8ffedf3609ba4ba2596429844b709c32d`.
- `services/ce-catalog.js` SHA-256:
  `c21ba29a4f5885dd1f0b7bee89e0ee6b08c70c3ace640dd9d356640b7d54fd60`.
- Later commits contain review documentation only. The archive remains frozen to
  the tested application candidate. Private source fixtures, local DBs, credentials
  and ignored release archives are not published with this branch.

## Verification

- Existing Node22 result: **112 passed, zero failures/skips**. Includes isolated
  PGlite/JSONB record versioning and the CE receiver validator.
- Paired and legacy browser rehearsals passed across desktop/mobile sizes,
  including save/reload, version restore/reset, proposal-only adjustments,
  independent Services drafts and client publishing safeguards.
- CE-owned isolated native PostgreSQL evidence accepted the baseline and adjusted
  fictional packets into 52 internal work items each. Four adjusted-proposal
  deviations are retained without changing the saved Services baseline; accepted
  baseline amendment rejection remains intact.
- Archive extraction verified all 134 committed files and reproduced identical
  archive bytes. Earlier passing application tests were not rerun just to package
  this review. This is not hosted rehearsal or current database-backup evidence.

## Coordinated Release Gate

This draft source review does **not** approve merge, deployment or live activation.
CE's exact support package must be reviewed and deployed **first**, including the
paired projection, final pure-module copies, v2 receiver and new-review precision.
Only after CE support verification may Estimator deploy to `quoting-proposals`.
John's coordinated publication/deployment approval and recovery readiness remain
required. Existing Portal, credentials, flags, schema, grants and package lockfile
are unchanged by this candidate.

Preserve saved v2 records, source evidence, overrides, proofs, receipts and accepted
work during containment or rollback. Never down-convert to v1 or silently reprice.
Old code is not a certified rollback after v2 saves. Any approved hosted rehearsal
must use a new fictional opportunity, not completed O-000001/TEST Opp, and must not
send customer proposals, execute delivery, create invoices or invoke Xero.

References: `docs/ce31b-pricing-contract.md`, `docs/ce31b-local-review.md`,
`docs/ce31b-release-candidate.md`; ClickUp868jnxdp7 and CE issue124/PR116.
