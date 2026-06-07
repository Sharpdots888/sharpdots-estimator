# Field Registry

This registry tracks estimator fields that exist in the prototype, need a database home, need a lookup source, or need a decision before production use.

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
