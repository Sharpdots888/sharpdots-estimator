const fs = require("fs");
const vm = require("vm");

const app = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");

function extractConst(name, openChar, closeChar) {
  const marker = `const ${name} = `;
  const start = app.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${name}`);
  const valueStart = app.indexOf(openChar, start);
  let depth = 0;
  let inString = "";
  let escape = false;
  for (let index = valueStart; index < app.length; index += 1) {
    const char = app[index];
    if (inString) {
      if (escape) escape = false;
      else if (char === "\\") escape = true;
      else if (char === inString) inString = "";
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      inString = char;
      continue;
    }
    if (char === openChar) depth += 1;
    if (char === closeChar) depth -= 1;
    if (depth === 0) return app.slice(valueStart, index + 1);
  }
  throw new Error(`Unterminated ${name}`);
}

function evalLiteral(source) {
  return vm.runInNewContext(`(${source})`, {}, { timeout: 1000 });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const catalog = evalLiteral(extractConst("proposalTemplateCatalog", "[", "]"));
const starters = evalLiteral(extractConst("proposalStarterTemplates", "{", "}"));
const starterIds = Object.keys(starters);
const starterCatalogEntries = catalog.filter((entry) => entry.status === "starter");
const sanitizedStarterCatalogEntries = catalog.filter((entry) => entry.status === "sanitized-starter");
const proposalCatalogEntries = catalog.filter((entry) => entry.category === "proposal");
const proposalStarterIds = proposalCatalogEntries.filter((entry) => starters[entry.id]).map((entry) => entry.id);
const collateralCatalogEntries = catalog.filter((entry) => entry.category === "addendum" || entry.category === "brochure");
const collateralStarterIds = collateralCatalogEntries.filter((entry) => starters[entry.id]).map((entry) => entry.id);
const agreementCatalogEntries = catalog.filter((entry) => entry.category === "agreement");
const agreementStarterIds = agreementCatalogEntries.filter((entry) => starters[entry.id]).map((entry) => entry.id);
const sowCatalogEntries = catalog.filter((entry) => entry.category === "statement-of-work");
const sowStarterIds = sowCatalogEntries.filter((entry) => starters[entry.id]).map((entry) => entry.id);
const sourceIds = new Set(catalog.map((entry) => entry.id));
const narrativeFields = evalLiteral(extractConst("proposalNarrativeFields", "[", "]"));

assert(catalog.length === 30, `Expected 30 catalog entries, found ${catalog.length}`);
assert(new Set(catalog.map((entry) => entry.id)).size === 30, "Catalog IDs must be unique");
assert(proposalCatalogEntries.length === 14, `Expected 14 proposal catalog entries, found ${proposalCatalogEntries.length}`);
assert(starterIds.length === 30, `Expected all 30 starter templates after W044, found ${starterIds.length}`);
assert(starterCatalogEntries.length === 0, "Deprecated starter status should not be used");
assert(sanitizedStarterCatalogEntries.length === 30, `Expected 30 catalog entries marked sanitized-starter, found ${sanitizedStarterCatalogEntries.length}`);
assert(proposalStarterIds.length === 14, `Expected all 14 proposal entries to be loadable, found ${proposalStarterIds.length}`);
assert(collateralCatalogEntries.length === 8, `Expected 8 addendum/brochure catalog entries, found ${collateralCatalogEntries.length}`);
assert(collateralStarterIds.length === 8, `Expected all 8 addendum/brochure entries to be loadable, found ${collateralStarterIds.length}`);
assert(agreementCatalogEntries.length === 3, `Expected 3 agreement catalog entries, found ${agreementCatalogEntries.length}`);
assert(agreementStarterIds.length === 3, `Expected all 3 agreement entries to be loadable, found ${agreementStarterIds.length}`);
assert(sowCatalogEntries.length === 5, `Expected 5 statement-of-work catalog entries, found ${sowCatalogEntries.length}`);
assert(sowStarterIds.length === 5, `Expected all 5 statement-of-work entries to be loadable, found ${sowStarterIds.length}`);
assert(!catalog.some((entry) => entry.status === "source-cataloged"), "No metadata-only source-cataloged entries should remain after W044");
assert(!catalog.some((entry) => entry.status === "review-held"), "No review-held entries should remain after W044");
starterIds.forEach((id) => {
  assert(sourceIds.has(id), `Starter ${id} is missing from catalog`);
  assert(catalog.find((entry) => entry.id === id).status === "sanitized-starter", `Starter ${id} is not marked sanitized-starter in catalog`);
  assert(catalog.find((entry) => entry.id === id).checksum, `Starter ${id} is missing source checksum traceability`);
  ["title", "subtitle", "overview", "audience", "deliverables", "valueNarrative", "nextSteps", "terms"].forEach((field) => {
    assert(typeof starters[id].fields[field] === "string" && starters[id].fields[field].trim(), `Starter ${id} missing ${field}`);
  });
});
collateralStarterIds.forEach((id) => {
  assert(/review/i.test(catalog.find((entry) => entry.id === id).qualityNotes || ""), `Collateral starter ${id} is missing a catalog review warning`);
  const text = Object.values(starters[id].fields || {}).join(" ");
  assert(/review/i.test(text), `Collateral starter ${id} must carry review-required language`);
});
agreementStarterIds.forEach((id) => {
  assert(/review/i.test(catalog.find((entry) => entry.id === id).qualityNotes || ""), `Agreement starter ${id} is missing a catalog review warning`);
  const text = Object.values(starters[id].fields || {}).join(" ");
  assert(/legal/i.test(text) && /commercial|tax/i.test(text), `Agreement starter ${id} must carry legal/commercial review-required language`);
});
sowStarterIds.forEach((id) => {
  assert(/review/i.test(catalog.find((entry) => entry.id === id).qualityNotes || ""), `SOW starter ${id} is missing a catalog review warning`);
  const text = Object.values(starters[id].fields || {}).join(" ");
  assert(/legal\/commercial review required|legal\/commercial\/security review required/i.test(text), `SOW starter ${id} must carry legal/commercial review-required language`);
});

assert(app.includes("sourceTemplateId: source.id"), "Template metadata must preserve sourceTemplateId");
assert(app.includes("sourceChecksum: source.checksum"), "Template metadata must preserve source checksum");
assert(app.includes("proposalTemplateStatusLabels"), "Template status labels must be explicit");
assert(html.includes("publishing-template-workflow"), "Source template workflow must live inside Publishing");
assert(html.includes("30 catalog entries / 30 sanitized starters"), "Static source-template count must match W044 starter count");
assert(!html.includes("Proposal template library"), "Standalone Template Library landmark must be removed");
assert(!html.includes("<h2>Template Library</h2>"), "Standalone Template Library heading must be removed");
assert(/function renameProposalTemplateCopy\(\)[\s\S]*displayName: nextName/.test(app), "Rename must update displayName");
assert(!/function renameProposalTemplateCopy\(\)[\s\S]*sourceTemplateId: nextName/.test(app), "Rename must not overwrite sourceTemplateId");
assert(/function resetProposalStarterToSource\(\)[\s\S]*applyProposalStarter\(sourceId\)/.test(app), "Reset must reload the selected source starter");
assert(app.includes("proposalSnapshotWithSources") && app.includes("...structuredClone(proposal)"), "Proposal snapshot must preserve proposal JSON fields");
assert(app.includes("normalizeProposalTemplateMeta(next.templateMeta)"), "Save/load normalization must preserve template metadata");

["title", "subtitle", "preparedFor", "overview", "audience", "deliverables", "valueNarrative", "nextSteps", "terms"].forEach((field) => {
  assert(narrativeFields.includes(field), `Narrative field ${field} missing from editable allow-list`);
});
["pricing", "schedule", "services", "sourcing", "printQuote", "ecomm"].forEach((section) => {
  assert(!narrativeFields.includes(section), `Computed section ${section} must not be editable narrative`);
});
assert(!/proposalPricingLines[\s\S]{0,80}contenteditable/.test(html + app), "Pricing lines must not be contenteditable");
assert(!/proposalScheduleLines[\s\S]{0,80}contenteditable/.test(html + app), "Schedule lines must not be contenteditable");
assert(!/proposalServicesLines[\s\S]{0,80}contenteditable/.test(html + app), "Services lines must not be contenteditable");
assert(!/proposalSourcingLines[\s\S]{0,80}contenteditable/.test(html + app), "Sourcing lines must not be contenteditable");

const starterText = JSON.stringify(starters);
["North Pole", "Portofino", "Santa Direct", "http://", "https://", "@", "LLC", "Inc."].forEach((token) => {
  assert(!starterText.includes(token), `Starter copy contains blocked private/source token: ${token}`);
});

console.log(JSON.stringify({
  catalogEntries: catalog.length,
  starterTemplates: starterIds.length,
  starterIds,
  proposalCatalogEntries: proposalCatalogEntries.length,
  proposalStarterIds,
  collateralCatalogEntries: collateralCatalogEntries.length,
  collateralStarterIds,
  agreementCatalogEntries: agreementCatalogEntries.length,
  agreementStarterIds,
  statementOfWorkCatalogEntries: sowCatalogEntries.length,
  statementOfWorkStarterIds: sowStarterIds,
  sourceCataloged: catalog.filter((entry) => entry.status === "source-cataloged").length,
  reviewHeld: catalog.filter((entry) => entry.status === "review-held").length,
  sanitizedStarters: sanitizedStarterCatalogEntries.length,
  editableNarrativeFields: narrativeFields.length,
  checks: "passed"
}, null, 2));
