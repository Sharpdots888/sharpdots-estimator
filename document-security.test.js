const test = require("node:test");
const assert = require("node:assert/strict");
const {
  canSendClientDocuments,
  requiresPortalSession
} = require("./document-security");

test("DocuSeal webhook remains public for HMAC verification", () => {
  assert.equal(requiresPortalSession("portal-token-required", "/api/webhooks/docuseal"), false);
});

test("similar webhook paths are not exempted", () => {
  assert.equal(requiresPortalSession("portal-token-required", "/api/webhooks/docuseal-extra"), true);
});

test("artifact access requires a session in preferred and required modes", () => {
  assert.equal(requiresPortalSession("portal-token-preferred", "/api/document-artifacts/42"), true);
  assert.equal(requiresPortalSession("portal-token-required", "/api/document-artifacts/42"), true);
  assert.equal(requiresPortalSession("disabled", "/api/document-artifacts/42"), false);
});

test("document transaction access requires a session in preferred mode", () => {
  assert.equal(requiresPortalSession("portal-token-preferred", "/api/document-transactions"), true);
  assert.equal(requiresPortalSession("portal-token-preferred", "/api/document-transactions/abc/artifacts"), true);
});

test("only authenticated portal admins may send client documents", () => {
  assert.equal(canSendClientDocuments(null), false);
  assert.equal(canSendClientDocuments({ user: { isAdmin: false } }), false);
  assert.equal(canSendClientDocuments({ user: { isAdmin: true } }), true);
});
