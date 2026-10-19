# Draft PR Text

Proposed title: **Consume assessed CE pricing with versioned Services and proposal overrides**

Repository: `Sharpdots888/sharpdots-estimator`.
Head: `codex/ce-engagement-handoff`. Base: `main`. Create as **draft** only.
No open PR for this head/base existed at the October 19 safety check.
John approved coordinated source publication and exact archive deployment;
main merge is excluded. Heroku auto-deploy and review apps are disabled. CE v45
released first. Estimator is now **v55/source91fac0e**, with all134 deployed hashes
matching. Recovery, preservation and fictional hosted handoff passed. PR43 stays
draft and unmerged. Full [release and rehearsal evidence](ce31b-live-release-2026-10-19.md).

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

John approved coordinated source publication and exact archive deployment, not
main merge. CE v45 support released first and passed verification. Estimator's
private native backup passed fresh isolated PostgreSQL restore: all 7,004 rows,
58 saved versions, 30 sequence states and eight signed artifacts. Three named
legacy CHECK definitions required explicitly tested cast/deparser equivalence;
all other schema fields and all complete rowsets match exactly. No shared user or
customer rowsets were exported. Source owner/ACL metadata is retained privately,
not reapplied. This is scoped app recovery, not whole-warehouse recovery.

Fresh preflight confirmed unchanged Estimator v54/source84d4f56, settings, schema,
data and sequences. The exact frozen91fac0e archive then released as v55; all134
deployed file hashes match. Heroku auto-deploy/review apps remain disabled.
Existing Portal, credentials, flags, schema, grants and lockfile remain unchanged.
This PR stays draft; no main merge or unrelated activation is authorized.

Hosted rehearsal O-000034 preserves S-100053 v1/v2 and P-100054 v1/v2. Four
proposal-only adjustments survive save/reload; Services/product source remains
unchanged. Draft catalog pricing blocks client PDF/CSV/DocuSeal. CE acknowledged
the frozen packet once, engagement a8f75582-bd26-4d4a-828c-4be1120a0642. CE's owner
verified its comparison and accepted the clearly fictional internal plan into52
ready Team cards without execution/billing. All7,004 pre-existing Estimator rows,
58 versions and eight signed artifacts remain unchanged after the rehearsal.
See the release evidence for exact hashes and CE-owned verification limits.

Preserve saved v2 records, source evidence, overrides, proofs, receipts and accepted
work during containment or rollback. Never down-convert to v1 or silently reprice.
Old code is not a certified rollback after v2 saves. Any approved hosted rehearsal
must use a new fictional opportunity, not completed O-000001/TEST Opp, and must not
send customer proposals, execute delivery, create invoices or invoke Xero.

References: `docs/ce31b-pricing-contract.md`, `docs/ce31b-local-review.md`,
`docs/ce31b-release-candidate.md`; ClickUp868jnxdp7 and CE issue124/PR116.
