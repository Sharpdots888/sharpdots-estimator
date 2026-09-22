const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { parseOptionalCsv, parsePostcardXml } = require("./scripts/import-sdsp-bootstrap");

const bootstrapDirectory = path.join(__dirname, "data", "bootstrap");

test("postcard XML exposes only complete sellable configurations", () => {
  const source = fs.readFileSync(path.join(bootstrapDirectory, "postcard-65969.xml"), "utf8");
  const parsed = parsePostcardXml(source);

  assert.deepEqual(parsed.quantities, [100, 250, 500, 1000, 2500]);
  assert.equal(parsed.configurations.length, 50);
  assert.equal(parsed.priceRowCount, 250);
  assert.ok(parsed.configurations.every((configuration) => configuration.tiers.length === 5));
});

test("option CSV preserves pricing methods and source lineage", () => {
  const source = fs.readFileSync(path.join(bootstrapDirectory, "optional-prices.csv"), "utf8");
  const optionals = parseOptionalCsv(source);
  const roundCorners = optionals.find((optional) => optional.code === "OPT-ROUND-CORNERS");
  const mailFulfillment = optionals.find((optional) => optional.code === "OPT-MAIL-FULFILLMENT");
  const postage = optionals.find((optional) => optional.code === "OPT-POSTAGE");

  assert.equal(optionals.length, 15);
  assert.equal(optionals.reduce((sum, optional) => sum + optional.tiers.length, 0), 59);
  assert.equal(roundCorners.pricingMethod, "flat_tier");
  assert.equal(mailFulfillment.pricingMethod, "per_unit_tier");
  assert.equal(postage.name, "Postage");
  assert.equal(postage.sourceLabel, "Postge");
});
