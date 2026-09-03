# DocuSeal Integration

The estimator can prepare client proposal signature requests through DocuSeal Pro. The integration is intentionally prepare-only until application authentication is in place.

## Current workflow

1. Save the proposal and every source selected in its publishing manifest.
2. Select a client publishing audience.
3. Use `Prepare DocuSeal` in the Proposal tab.
4. Enter the recipient name and email.
5. The server freezes the rendered proposal as HTML, adds client signature and signed-date fields, and creates a one-off DocuSeal submission.
6. DocuSeal events update the transaction status through a verified webhook.
7. On `submission.completed`, the server immediately archives the signed PDF and Certificate of Signature in Postgres.

Archived signed documents are available only through authenticated artifact endpoints. Each artifact access is written to the document event audit trail. The Proposal interface does not yet surface those endpoints as a document viewer.

## Server configuration

Set these as Heroku config variables or local environment variables. Never place their values in the repo or browser code.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DOCUSEAL_API_KEY` | Yes | DocuSeal Pro or Developer Sandbox API key. |
| `DOCUSEAL_API_URL` | No | Defaults to `https://api.docuseal.com`; set this for DocuSeal On-Premises. |
| `DOCUSEAL_WEBHOOK_SECRET` | Yes for events | HMAC secret shown in the DocuSeal webhook Security panel. |
| `DOCUSEAL_SEND_ENABLED` | No | Defaults to false. Set to `true` only after estimator authentication and an operator authorization policy are in place. |

With only `DOCUSEAL_API_KEY` configured, the app operates in prepare-only mode and sends no email.

## DocuSeal Console setup

1. Use the DocuSeal Developer Sandbox for initial testing.
2. Create a webhook pointing to `https://YOUR-ESTIMATOR-HOST/api/webhooks/docuseal`.
3. Subscribe to form and submission events, especially `form.viewed`, `form.started`, `form.completed`, `form.declined`, and `submission.completed`.
4. Open the webhook Security panel, copy its `whsec_...` HMAC secret, and store it as `DOCUSEAL_WEBHOOK_SECRET` in Heroku.
5. Leave `DOCUSEAL_SEND_ENABLED` unset during sandbox and internal review.

Webhook signatures are checked against the exact request body with a five-minute timestamp tolerance. Unverified events are rejected.

## Database records

The server creates these tables when its database role has schema privileges:

- `sfpq_document_transactions`: proposal, workspace, recipient, provider submission ID, delivery mode, and lifecycle status.
- `sfpq_document_events`: verified, deduplicated provider events and their payloads.
- `sfpq_document_artifacts`: signed PDF and audit-certificate bytes, hashes, type, name, and size.

If startup reports that document workflow migrations were skipped, the database owner must apply the `documentMigrations` statements from `server.js` before the feature can create requests.

## Pilot retention policy

Approved September 3, 2026 for the DocuSeal pilot:

- Retain completed signed PDFs, Certificates of Signature, transaction metadata, and audit events indefinitely during the pilot.
- Do not automatically delete document-workflow records or artifacts.
- Delete records or artifacts only through a documented action approved by an administrator.
- Preserve transaction metadata and audit events for declined, expired, and failed requests. These states do not produce signed-document artifacts.
- A legal hold overrides any future deletion schedule or deletion approval.
- Review the long-term retention period and migration of document artifacts to external object storage by December 2, 2026.

This policy is the pilot operating rule, not the final company records schedule. Any automated deletion, shortened retention period, or storage migration requires a separately reviewed implementation and approval.

## Production gate

Do not set `DOCUSEAL_SEND_ENABLED=true` until all of the following are complete:

- Users authenticate to the estimator.
- Portal administrators are the only users authorized to send client documents.
- The send action records the authenticated operator ID, username, email, and admin status.
- Archived-document access is authenticated and logged through `artifact.accessed` events.
- The approved pilot retention policy above is in effect.
- Sandbox signing, decline, expiration, duplicate webhook, and completed-artifact tests pass.

`portal-token-preferred` still allows general estimator use without a portal session, but document transactions and archived artifacts require one. The signed DocuSeal webhook is the sole document-workflow exception because it uses HMAC verification instead of a browser session. Before switching the entire app to `portal-token-required`, verify the Portal launcher and `/api/auth/me` response for each operator role.

## Later payment handoff

`submission.completed` should enqueue, not directly execute, the Xero billing action. The future billing worker will create or activate the appropriate Xero invoice schedule, and the invoice/payment experience will use the existing Authorize.net form. Signing and payment remain separate transaction states.
