# Proposal and Quote Interface

Review build, September 29, 2026. ClickUp: [Estimating App](https://app.clickup.com/t/868jnxdp7).

## Layout

- Shared record headers put the document name and saved state first, with one
  primary Save action. Open/Find, version history and a secondary action menu
  replace the full row of selectors and equally weighted buttons.
- Version history contains the saved versions and Save new version. New,
  Duplicate, and library Attach/Detach are in the secondary menu. Estimate
  version labels reflect the version actually loaded, including older versions.
- Proposal setup is divided into Details, Content and Send. Details holds the
  three main fields; company templates are collapsed. Content holds section
  selection, pricing view and source review; output settings are collapsed.
  Send holds readiness, existing output actions and signature status.
- Quote prioritizes the item editor and totals. Customer/quote information sits
  beside it; Delivery, Message & terms, and Source & internal notes expand when
  needed. Customer preview hides item-editing and internal-source controls.
- The six estimating tabs share the record header treatment. The Estimate,
  Services, Sourcing and Ecomm detail interfaces are otherwise unchanged.

## Implementation Boundaries

`editor-ui.js` moves existing controls, preserving their IDs and event handlers;
`editor-ui.css` supplies scoped layout overrides. Load them after the existing
app and CRM assets, as in `index.html`. Shared headers and quote row rendering
remain in `app.js`.

Quote fields update state and totals without replacing their own DOM while
typing. This prevents adjacent edits from being lost when moving between fields.
Estimate Browse opens the finder even with an estimate already selected.

No schema, authentication, pricing formula, record identity, template catalog,
DocuSeal delivery policy, or downstream integration changes. Configuration is
reorganized, not removed. Proposal editor and preview controls are excluded
from print; screen-specific preview sizing does not change print typography.

## Verification

- `npm test`: all 17 tests pass.
- `node --check app.js`, `node --check editor-ui.js`, `git diff --check` pass.
- Local Playwright checks: proposal edit/save/new version/restore, template
  loading, content selection, keyboard tabs and Escape, quote edit and totals,
  quote save/version and customer preview.
- Shared header checks: Estimate name/version and finder, Services and Sourcing
  save/version, Quote/Ecomm find/duplicate/new, print control exclusion.
- Screenshots and overflow checks at 1440, 1188, 768 and 390 pixels; no page errors.
- Testing used `crm/preview-server.cjs` on localhost with synthetic/local records.
  No production records were written or signature emails sent.

Review Proposal Details/Content/Send, Quote editing/preview, and the shared
record header before merge/deployment. Production remains unchanged by this
review build.
