function isDocusealWebhookPath(url) {
  return url === "/api/webhooks/docuseal";
}

function isDocumentArtifactPath(url) {
  return url.startsWith("/api/document-artifacts/");
}

function isDocumentTransactionPath(url) {
  return url === "/api/document-transactions" || url.startsWith("/api/document-transactions/");
}

function requiresPortalSession(authMode, url) {
  if (isDocusealWebhookPath(url)) return false;
  if (url === "/api/auth/me" || url === "/api/auth/logout" || url === "/favicon.ico") return false;
  if (authMode === "disabled") return false;
  if (isDocumentArtifactPath(url) || isDocumentTransactionPath(url)) return true;
  return authMode === "portal-token-required";
}

function canSendClientDocuments(session) {
  return Boolean(session?.user?.isAdmin);
}

module.exports = {
  canSendClientDocuments,
  isDocusealWebhookPath,
  isDocumentArtifactPath,
  isDocumentTransactionPath,
  requiresPortalSession
};
