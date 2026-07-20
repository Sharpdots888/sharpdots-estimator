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
const sourceIds = new Set(catalog.map((entry) => entry.id));
const narrativeFields = evalLiteral(extractConst("proposalNarrativeFields", "[", "]"));

assert(catalog.length === 30, `Expected 30 catalog entries, found ${catalog.length}`);
assert(new Set(catalog.map((entry) => entry.id)).size === 30, "Catalog IDs must be unique");
assert(starterIds.length === 3, `Expected 3 starter templates, found ${starterIds.length}`);
assert(starterCatalogEntries.length === 3, `Expected 3 catalog entries marked starter, found ${starterCatalogEntries.length}`);
starterIds.forEach((id) => {
  assert(sourceIds.has(id), `Starter ${id} is missing from catalog`);
  assert(catalog.find((entry) => entry.id === id).status === "starter", `Starter ${id} is not marked starter in catalog`);
  ["title", "subtitle", "overview", "audience", "deliverables", "valueNarrative", "nextSteps", "terms"].forEach((field) => {
    assert(typeof starters[id].fields[field] === "string" && starters[id].fields[field].trim(), `Starter ${id} missing ${field}`);
  });
});

assert(app.includes("sourceTemplateId: source.id"), "Template metadata must preserve sourceTemplateId");
assert(app.includes("sourceChecksum: source.checksum"), "Template metadata must preserve source checksum");
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
  editableNarrativeFields: narrativeFields.length,
  checks: "passed"
}, null, 2));
