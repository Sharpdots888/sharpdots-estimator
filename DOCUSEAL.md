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

The estimator does not expose archived signed documents through a public download endpoint. An authenticated document viewer and retention policy should be added before production sending is enabled.

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

## Production gate

Do not set `DOCUSEAL_SEND_ENABLED=true` until all of the following are complete:

- Users authenticate to the estimator.
- Roles identify who may send client documents.
- The send action records the authenticated operator.
- Archived-document access is authenticated and logged.
- Retention and deletion rules are approved.
- Sandbox signing, decline, expiration, duplicate webhook, and completed-artifact tests pass.

## Later payment handoff

`submission.completed` should enqueue, not directly execute, the Xero billing action. The future billing worker will create or activate the appropriate Xero invoice schedule, and the invoice/payment experience will use the existing Authorize.net form. Signing and payment remain separate transaction states.
