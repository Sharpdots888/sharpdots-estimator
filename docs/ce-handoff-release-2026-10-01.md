# CE Handoff Code Release - October 1, 2026

## Latest State: Connection Activated

After the code release, John explicitly approved configuring the dedicated
credential, enabling the connection and verifying one controlled transfer. CE
was enabled first as **v30**, then Estimator as **v54**. Both retain the code
slugs recorded below; no code deployment or database migration was added.

- CE activation release: 3a5daf71-8d93-495a-8fe3-e5deff2df91e.
- Estimator activation release: 521e8777-0fe9-4d83-95ec-31716754f8f5.
- Both new flags are true. One freshly generated 32-byte random write key is
  installed only in each app's protected configuration. Private readback verifies
  equality and independence from both existing catalog read keys. No secret was
  printed, committed, stored in an operational script or sent through chat.
- Historical-release configuration comparison confirms only the two scoped
  handoff variables per app changed, plus Heroku's automatic release metadata.
  An initial strict comparison paused on that metadata; the already-installed CE
  key was reconciled and reused without rotation before completing Estimator.
- Both web processes and health/authentication checks pass. CE returns 405 for
  GET on the now-enabled service endpoint, while browser intake and catalog
  requests still require authorization. A deliberately operator-less POST with
  the configured key stops at the expected 403 operator gate before database
  writes. No privileged actor was substituted for a real Portal session.
- Read-only eligibility confirms current user45 is active/admin in Estimator
  and already an active CE lead. This grants no new profile, role or membership.
- CE has zero received intakes after activation. No customer record, signing
  email, invoice, Xero action or delivery execution was created.

**Controlled signed-in receipt verification remains pending.** Browser control
timed out again. John was asked to designate a test O-number. The services example
O-000001, TEST Opp, is still open with no linked client/contact; it was not altered
or treated as commercially accepted. Do not manufacture acceptance to finish a test.

Credential custody remains the two existing apps' protected Heroku configuration.
Maintenance is an app-owner-approved operation: disable sender and receiver,
rotate the separate key on both, privately verify equality/independence, then
enable receiver before sender. Never reuse catalog, Portal or warehouse secrets.
For containment, turn off the new sender/receiver flags without changing existing
catalog access. Once received intakes exist, retain intake-aware read/backup code.
The user-facing send is explicit; enabling the flags does not send old proposals.

The rest of this document preserves the preceding code-only release evidence.

John approved: "proceed with merge and deployment". This releases the reviewed
code with the new transfer connection disabled. Credential setup, activation and
a bounded signed-in production transfer remain a separate approval.

## Release Record

| Application | Release | Deployed commit | Previous release |
| --- | --- | --- | --- |
| Estimator / quoting-proposals | v53 | 84d4f56d7784d86741ad866a207e94ab19f72089 | v52 |
| Client Engagement / sharpdots-client-engagement | v29 | 078287afac2dc70f589379df6564085f698f7705 | v28 |

- Estimator [PR42](https://github.com/Sharpdots888/sharpdots-estimator/pull/42)
  merged through GitHub into main. Its merged tree exactly matches reviewed head
  006743883520cc021af6045a932bc790414bf956.
- CE [PR100](https://github.com/Sharpdots888/sharpdots-apps/pull/100) merged into
  the existing catalog feature branch. [PR102](https://github.com/Sharpdots888/sharpdots-apps/pull/102)
  was retargeted there and merged as 02d43bf1a89d1cbc80c58a3301872c30f411a140.
  The merged tree exactly matches reviewed receiver d77711a. The released app
  subtree is 07e4fac100a0dcaba3647829ef0103fcc7b7ea52; its app-only release commit
  retains predecessor 1d0cb163. Unrelated monorepo main was not deployed.
- Estimator release ID: c1226bca-02f3-47f3-8ed8-2c9104927ee8;
  slug: 7c28b322-f28e-457c-9324-7e5ee7bf7829.
- CE release ID: 725f2f8c-5879-49b8-a502-abb3840e6deb;
  slug: e28df3a2-9c9d-44c3-9c1a-37ece1afaa98.

## Verification

- Fresh Node 22: Estimator 68 passed; CE 188 passed, 3 existing database-gated
  checks skipped. CE build, static, syntax and boundary checks passed. The first
  sandboxed CE run could not open loopback listeners; the allowed rerun passed.
- Paired actual Estimator store/transport and CE HTTP receiver passed against
  separate disposable databases. Version pins, retries, duplicate protection,
  current access, receipt persistence and unknown costs were retained. No
  production requests, customer records, emails or invoices were created by it.
- Both Heroku releases succeeded and both web processes are up. Post-release
  startup logs contain zero Error/FATAL/unhandled-rejection markers. Estimator
  reports its existing document workflow migrations complete and a listening
  server; this release adds no migration.
- CE health reports the exact release commit and Portal D4. Protected intake
  API/page requests return 401 anonymously. The new service route returns 404,
  "Proposal intake connection is not enabled". Existing catalog route remains
  enabled and requires its credential.
- Estimator page, identity and CRM requests require authentication (401 without
  a Portal session).
- Signed-in production browser inspection timed out. It is not claimed as
  verified, and no production transfer acceptance has been performed.

## Preserved Boundaries

`ESTIMATOR_CE_HANDOFF_ENABLED` and `CE_ESTIMATOR_INTAKE_ENABLED` are still unset.
No write key was provisioned and no configuration was changed. Existing catalog
reader flags remain true. Estimator retains `portal-token-required` and live
DocuSeal email sending; CE retains existing delivery enablement. No Portal
release, schema/grant change, customer intake, billing or Xero action occurred.

Next: approve independent handoff credential setup/maintenance and activation;
confirm current authorized sender/receiving lead; then perform one explicitly
designated signed-in transfer and verify its saved CE receipt. Receipt means
intake review, not automatic delivery admission, work execution or invoicing.
After activation, retain intake-aware read/backup support if containing a fault;
do not blindly roll back to a validator that cannot read received intakes.

Tracking: [Estimating App - Project Calculation](https://app.clickup.com/t/868jnxdp7).
