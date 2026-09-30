# Services and Print Pipelines

User direction: keep service-proposal opportunities separate from print quotes
and production opportunities, with a toggle in Pipeline. This is a local review
build; production deployment requires separate approval.

## Behavior

- Pipeline has two persistent views: **Services** and **Print / Production**.
  Toggle counts show open opportunities in each pipeline, independent of filters.
- Services uses green column headers and a very light green canvas; Print /
  Production uses purple headers and a very light purple canvas. Cards keep
  white backgrounds and neutral borders/text. Signed/overdue status colors keep
  their existing meaning. Pipeline styling does not affect document output.
- Board, List, Activities, Handoffs, search, totals, and the visible result count
  all use the selected pipeline. Metrics also follow the current filters.
- New opportunities inherit the selected pipeline and default to the corresponding
  offering. Offering can still be Mixed. The selected pipeline is remembered in
  the current browser; switching clears search, offering and attention filters,
  while retaining owner, status and view.
- Each opportunity has one pipeline home. It keeps its existing O number and all
  record links, versions, acceptance, activity, handoff and billing state.
- Edit opportunity includes Pipeline. **Move pipeline** in opportunity details
  also works for won opportunities without reopening or changing commercial terms.
  Reassignment is audited with the previous and next pipeline.
- Proposals and Quote retain access to all linked opportunities and standalone
  records; pipeline membership is sales organization, not a permissions boundary
  or a restriction on which components an opportunity can include.

## Data Compatibility

The optional `pipeline` field is `services` or `quotes`. It is stored in the
existing `sfpq_opportunity_state.state` JSONB, validated by the existing opportunity
save API, and included in audit snapshots. No SQL migration or new sequence.

Older opportunities without an explicit assignment resolve from Offering:
Print -> Print / Production; Services or Mixed -> Services. This fallback does
not write or backfill production data. An explicit choice overrides Offering.
An older browser client that omits Pipeline on save preserves the existing
assignment. Invalid values fail validation; optimistic concurrency is unchanged.

Mixed engagements start in Services because they can combine a comprehensive
service proposal with print components. Operators can move production-led mixed
opportunities explicitly, without duplicating an opportunity in both forecasts.

## Verification

- `npm test`: 31 tests, including classification, immutable identity and document
  preservation, database round-trips, legacy reads/writes, validation, audit, and
  optimistic concurrency.
- `node crm/pipelines-smoke.cjs`: both pipelines and all four views, totals,
  search, defaults, moves, won-record preservation, browser preference, keyboard
  controls, and 1440/1188/768/390-pixel layouts.
- Disposable real PostgreSQL plus authenticated HTTP/browser workflow: create
  and reload an opportunity, save all six record types, approve/close, accept a
  production handoff, move pipeline, and verify the closed state and records.
- Broader CRM lifecycle and Services catalog-to-Proposal regressions also pass.
  Synthetic local data only;
  no production data writes, auth changes, sends, invoices or workbench dispatch.

Tracking: https://app.clickup.com/t/868jnxdp7
