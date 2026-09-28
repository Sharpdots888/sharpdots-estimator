# Opportunity Client and Contact Selection

Follow-up to the deployed v42 pilot. User confirmed opportunity saving works and
requested removal of duplicate customer fields.

- The top Client / account and Contact / decision-maker controls are the actual
  database lookups. The bottom duplicate pair is removed.
- Contact options are scoped to the selected company; selecting a contact fills
  the opportunity contact email. Changing company clears contact and email.
- Each dropdown includes an Add new action. New client requires a name. New
  contact requires a selected saved client, first name and last name; email is
  optional and validated when present.
- Add client/contact saves the shared master record immediately, then selects it
  in the opportunity form. Cancelling the opportunity afterward does not delete
  the newly created customer/contact.
- Existing unlinked opportunity names remain visible as unlinked choices when
  editing. They are not silently converted or duplicated in the customer tables.

## Persistence and Safety

POST /api/crm/companies writes sfvc_companies with company_type=customer (the
existing default is vendor, so it must be overridden). POST /api/crm/contacts
writes sfvc_people and sfvc_company_people together in one transaction. No schema
or permission migration is required. Existing runtime INSERT privileges verified
read-only; no production customer records were created during development.

Both endpoints use the existing active-admin authorization, feature flag and
same-origin JSON/custom-header requirement, with a 10KB body limit. UUID creation
keys become master-record IDs for safe retry reconciliation. Exact normalized
company-name duplicates, existing contact emails, and same-name contacts within
one company are rejected instead of merged. Existing contacts belonging to other
companies must be explicitly linked through the customer system, not auto-merged.

## Verification

16 Node tests pass with added creation, retry, duplicate, authorization and
validation assertions. Real local PostgreSQL restored reference-schema browser
test covers new client/contact creation, top-only selectors, dependent clearing,
cancel, opportunity save/reload and all six calculator record saves. Dialog
screenshots checked at 390, 1188 and 1601px; no horizontal clipping. Synthetic
records only; no emails, production writes or external integration calls.

ClickUp: https://app.clickup.com/t/868jnxdp7
Merge/deployment approval for this follow-up is separate from the earlier v42
release approval.
