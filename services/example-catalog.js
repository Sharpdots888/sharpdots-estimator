// Synthetic rates and definitions from the Living Ops cascade prototype, not a live catalog.
window.ServiceExampleCatalog = (() => {
  const definitions = [
    ["items", "item-outbound", "Outbound program", 2250, "month", "per_month"],
    ["items", "item-data", "Data stream", 1.25, "record", "per_month"],
    ["items", "item-reporting", "Reporting and review", 850, "month", "per_month"],
    ["platforms", "platform-crm", "CRM / CER reference", 95, "seat", "per_month"],
    ["platforms", "platform-ai", "AI platforms and agents", 625, "month", "per_month"],
    ["platforms", "platform-portal", "Protected portal surface", 220, "month", "per_month"],
    ["capabilities", "cap-reporting", "Reporting dashboard", 240, "cycle", "per_month"],
    ["capabilities", "cap-enrichment", "Data enrichment workflow", 180, "run", "per_run"],
    ["capabilities", "cap-orchestration", "AI agent orchestration", 280, "month", "per_month"],
    ["teams", "team-revops", "Revenue Ops", 165, "hour", "per_hour"],
    ["teams", "team-engagement", "Client Engagement", 145, "hour", "per_hour"],
    ["teams", "team-engineering", "Engineering", 195, "hour", "per_hour"]
  ].map(([definitionType, definitionRef, name, rate, unit, rateBasis]) => ({ definitionType, definitionRef, name, rate, unit, rateBasis,
    quantity: 1, currency: "USD", costStatus: "active", estimatorMappingSupported: true }));
  const links = [
    ["item-outbound", "platform-crm", "cap-reporting", "team-engagement"],
    ["item-outbound", "platform-crm", "cap-reporting", "team-revops"],
    ["item-outbound", "platform-ai", "cap-enrichment", "team-revops"],
    ["item-outbound", "platform-ai", "cap-orchestration", "team-engineering"],
    ["item-data", "platform-ai", "cap-enrichment", "team-revops"],
    ["item-data", "platform-ai", "cap-orchestration", "team-engineering"],
    ["item-reporting", "platform-portal", "cap-reporting", "team-engagement"],
    ["item-reporting", "platform-portal", "cap-reporting", "team-revops"]
  ];
  function product(id, name, items, status, description) {
    const cascadePaths = links.filter(path => items.includes(path[0])).map(([itemId, platformId, capabilityId, teamId]) => ({ productId: id, itemId, platformId, capabilityId, teamId }));
    const refs = new Set(cascadePaths.flatMap(p => [p.itemId, p.platformId, p.capabilityId, p.teamId]));
    return { localProductServiceId: id, name, description, itemIds: items, catalogStatus: status, enabledForSelection: status === "reviewed_template",
      sourceValid: true, sourceRevision: "prototype-example-v1", cascadePaths, templateVariables: definitions.filter(v => refs.has(v.definitionRef)) };
  }
  return { contractVersion: "living-ops-estimator-services-v1", messageType: "catalog_snapshot", sourceSystem: "living_ops_local", sample: true,
    sourceRevision: "prototype-example-v1", payload: { catalogId: "living-ops-example", products: [
      product("product-outbound", "AI Outbound", ["item-outbound", "item-data", "item-reporting"], "reviewed_template", "Outbound, data preparation, and reporting."),
      product("product-data", "Managed Data Stream", ["item-data"], "draft", "Data enrichment and delivery.")
    ] } };
})();
