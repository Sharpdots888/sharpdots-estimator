# Standard products import receipt

Imported on 2026-09-17 into local sharpdots_estimator_local only.
Source package: F:/Codex/client-data-platform/outputs/epower-standard-products/20260915T235731Z.

## Approved rules

- USD selling prices, without additional markup.
- Only explicitly priced integer quantities; no interpolation.
- Exclude invalid Flyers quantity-zero/infinite-price tier.
- Hold other flagged tiers and inactive products out of quoting.
- Optional services deferred; existing pilot services retained as drafts.
- Ecomm price-list feature development remains paused.

## Results

- 32 products stored; 31 active and one inactive (66588).
- 477 configurations stored; 393 active configurations available.
- 3,577 valid tiers stored; 2,723 available for quoting.
- 17 flagged tiers held, including three on the inactive product.
- Inactive product has 840 tiers; total unavailable tiers: 854.
- One invalid Flyers tier excluded, retained in the import batch report.
- Original 50 postcard SKUs preserved. New SKUs are provisional and stable.
- Original product metadata and source price rows retained in database JSON metadata.
- All manifest hashes and byte counts verified before import.

Backup: F:/Codex/scratch-workspaces/sdsp-backups/before-export-1789660423045.dump.
The import committed atomically. Repeating the identical manifest is a no-op.
No production database changes. Backups stay outside Git.

## Verification and use

From the estimator repository:

```powershell
node scripts/import-sdsp-export.js F:/Codex/client-data-platform/outputs/epower-standard-products/20260915T235731Z
node scripts/verify-sdsp-export.js
npm test
```

The import command defaults to validation only. Add --apply to back up and import
into the named local database. The verifier reconciles all 3,577 prices and quantities,
prices all 393 published configurations, checks retained postcard SKUs, and confirms
unsupported quantities and deferred services are rejected. All seven existing tests passed.
Browser checks confirmed categories, postcard configurations and selling totals.

Open http://127.0.0.1:4330/ and choose Print Quote > Add Standard Product.
This is an initial migration, not an ongoing source-system synchronization.
Future batches require review. Do not rerun the old bootstrap importer to refresh prices.
