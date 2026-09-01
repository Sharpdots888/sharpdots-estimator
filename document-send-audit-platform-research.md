# Document Send, Audit, and Payment Research

Updated: 2026-08-27

## Current recommendation

Decision update, 2026-08-31: proceed with DocuSeal Pro as the first signing provider. Keep the estimator integration provider-shaped so Documenso or another provider can be added without changing proposal and billing records.

Use the estimator as the system that coordinates the commercial workflow while keeping each specialist system responsible for its own records:

- Estimator/Postgres: proposal version, recipients, send status, provider IDs, payment schedule, audit-event mirror, and downstream handoff status.
- DocuSeal Pro or Documenso: signature request, reminders, signer events, completed document, and signing evidence.
- Xero: contact, project accounting, invoices/repeating invoices, invoice status, and accounting payment record.
- Authorize.net: payment data capture, customer payment profiles, authorization/capture, settlement, refund, and payment webhooks.

This avoids adding another payment gateway. Signature completion should authorize the billing workflow, but signing and payment must remain separate states.

## Compatibility

Both DocuSeal Pro and Documenso can support this design. Neither needs to process payment directly. Their APIs create the signature request, and a completed-signature webhook returns control to the estimator. The estimator can then create or activate the appropriate Xero invoice workflow and present the existing Authorize.net payment experience.

DocuSeal Pro exposes submission APIs, completion webhooks, signed-document URLs, an audit-log URL, application-specific external IDs, and metadata. These are sufficient to correlate a signature transaction with a workspace, proposal version, Xero contact/project/invoice, and Authorize.net payment record. [DocuSeal API reference](https://www.docuseal.com/docs/api)

Documenso exposes REST APIs and full-lifecycle webhooks, including document sent, opened, signed, completed, rejected, cancelled, reminder, and recipient events. Its webhook documentation explicitly recommends signature verification and idempotent processing. [Documenso developer guide](https://docs.documenso.com/docs/developers), [Documenso webhooks](https://docs.documenso.com/docs/developers/webhooks/events)

## Xero and Authorize.net boundary

Xero Projects tracks time, costs, tasks, expenses, estimates, amounts invoiced, and profitability. Recurring billing is an accounting/invoicing capability, not a responsibility of the Projects API itself. The implementation should therefore associate the estimator workspace with a Xero Project while creating and managing invoices through Xero's Accounting API. [Xero Projects API](https://developer.xero.com/documentation/api/projects/projects), [Xero Invoices API](https://developer.xero.com/documentation/api/accounting/invoices)

Authorize.net Accept Hosted can redirect to or embed a hosted payment form and supports customer profiles. Authorize.net webhooks can notify the estimator of payment events, after which the estimator should retrieve authoritative transaction details and apply the payment to the corresponding approved Xero invoice. [Authorize.net Accept Hosted](https://developer.authorize.net/api/reference/features/accept-hosted.html), [Authorize.net webhooks](https://developer.authorize.net/api/reference/features/webhooks.html), [Xero Payments API](https://developer.xero.com/documentation/api/accounting/payments)

Xero supports custom payment-service URLs with invoice placeholders, but its API documentation says payment-service access is limited to specifically certified payment-service partners. Do not assume the existing Authorize.net form can be registered through that API without Xero approval. The low-risk first version is a payment link controlled by the estimator, plus payment reconciliation into Xero. [Xero Payment Services API](https://developer.xero.com/documentation/api/accounting/paymentservices)

## Signing certificates

"Signing certificate" can refer to two different artifacts:

1. The Certificate of Signature or audit log, which records the parties and signing events.
2. The X.509 digital certificate used to cryptographically seal the completed PDF.

DocuSeal automatically generates a Certificate of Signature audit log for every completed document. It includes event timestamps, parties, IP and session details, authentication evidence when used, and other signing metadata. [DocuSeal Certificate of Signature](https://www.docuseal.com/faq/what-is-the-certificate-of-signature-audit-log)

DocuSeal Cloud provides a built-in PDF signing certificate trusted by Adobe. Cloud and On-Premises can also use an uploaded `.p12`, `.pfx`, or `.der` certificate. On-Premises generates a signing certificate by default, but an organization can replace it when its trust or compliance requirements demand a specific certificate. [DocuSeal signing certificate configuration](https://www.docuseal.com/resources/add-own-signing-certificate)

Self-hosted Documenso is different: it does not ship with a signing certificate, and signing fails until the operator supplies a `.p12` certificate. A self-signed certificate preserves integrity but may display a trust warning; a suitable CA-issued certificate or HSM-based setup is required when recognized trust is important. [Documenso self-hosting requirements](https://docs.documenso.com/docs/self-hosting/getting-started/requirements), [Documenso signing certificates](https://docs.documenso.com/docs/concepts/signing-certificates)

## Proposed event flow

1. Freeze and save a proposal version in the estimator.
2. Create a signing transaction using a provider adapter. Store the provider submission/envelope ID and estimator transaction ID.
3. Receive and verify provider webhooks. Record events idempotently and return quickly.
4. On completed signature, fetch and archive the signed PDF and audit certificate. Do not rely only on a temporary download URL.
5. Create or activate the Xero invoice/repeating-invoice plan and associate it with the Xero contact and project.
6. Send the customer to the existing Authorize.net form using a server-generated, opaque invoice/payment token. Do not trust amount or invoice values supplied by the browser.
7. Receive Authorize.net payment events, retrieve authoritative transaction details, and apply the payment to the corresponding Xero invoice.
8. Relay the closed transaction to downstream systems through an outbox/queue, with retries and a visible exception state.

## Required estimator records

- `document_transactions`: workspace, proposal version, provider, provider submission ID, status, sent/opened/completed timestamps.
- `document_recipients`: contact reference, role, delivery channel, signer status, authentication method.
- `document_events`: provider event ID or deduplication key, type, timestamp, verified status, normalized payload, raw payload reference.
- `document_artifacts`: frozen source PDF, completed PDF, audit certificate, hashes, immutable storage references.
- `billing_plans`: Xero contact/project IDs, invoice strategy, schedule, variable calculation snapshot, status.
- `payment_transactions`: Xero invoice ID, Authorize.net customer/transaction IDs, amount, settlement/refund status.
- `integration_outbox`: pending Xero, Authorize.net, and downstream actions with attempt count and last error.

## Decision still needed

For a managed first release, DocuSeal Pro Cloud is the lower-operations choice and includes the audit certificate and a built-in Adobe-trusted PDF certificate. Documenso remains a strong option when open-source control outweighs the work of certificate, email, storage, upgrades, monitoring, and security operations. A sandbox proof should test both against the same estimator adapter before committing the production schema to provider-specific fields.
