# CRM Access For Named Portal Users

ClickUp: https://app.clickup.com/t/868jnxdp7

The shared Pipeline initially appeared only for Portal administrators. Ray's
active Portal account is `rvillasenor@sharpdots.com`, user ID `46`, and is not an
administrator. He therefore saw the older estimator even on the current Heroku
release.

`ESTIMATOR_CRM_USER_IDS` accepts a comma-separated list of Portal user IDs. An
active user on that list receives the same CRM read/write pilot access as an
administrator: opportunities, saved records, and client/contact lookups and
creation. The application checks the signed Portal session for UI visibility and
checks the matching active database user on every CRM data request. Other Portal
users continue to see the previous estimator. The CRM feature flag still controls
the entire feature.

For this rollout, set `ESTIMATOR_CRM_USER_IDS=46` on `quoting-proposals` after the
matching code is deployed. If future users are added, use their confirmed Portal
IDs; do not change `users.is_admin`. Removing 46 from the setting revokes Ray's
CRM access on the next request/new session without affecting CRM data.

This setting does not grant Portal administration, DocuSeal email-send authority,
database role changes, or access to other admin APIs. The shared CRM currently
allows pilot users to view and edit all opportunities; per-opportunity permissions
are a separate future feature. Existing non-admin DocuSeal send checks remain.

Verification: tests cover Ray's read/write access, another non-admin's denial,
inactive user's denial, and non-admin document-send denial. After deployment,
check Ray's `/api/crm/status` through a fresh Portal launch and confirm Pipeline
appears after Reload. Also check an administrator and an unrelated non-admin.
