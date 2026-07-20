const typeLabels = {
  M: "Materials",
  VF: "Variable Fulfillment",
  FP: "Fixed Print",
  MP: "Manufactured Product"
};

const metricStyles = {
  cost: { label: "Cost", color: "#428bca" },
  margin: { label: "Margin $", color: "#b84048" },
  client: { label: "Client Price", color: "#fe7300" }
};

const sourceProducts = [
  { packageName: "Eve Kit Package", product: "Bell", element: "Bell", notes: "SKU NPO-XX-01-002-01", type: "M", inventoryQty: 2905, clientQoh: 1500, neededQty: 5455, qty: 3955, year: "2025", sku: "NPO-XX-01-002-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Eve Kit Package", product: "Carton eFlute 10x10x6", element: "Carton eFlute 10x10x6", notes: "SKU NPO-XX-01-001-01", type: "M", inventoryQty: 3030, clientQoh: 1500, neededQty: 5455, qty: 3955, year: "2025", sku: "NPO-XX-01-001-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Eve Kit Package", product: "Mug", element: "Mug", notes: "SKU NPO-XX-01-003-01", type: "M", inventoryQty: 1961, clientQoh: 1500, neededQty: 5455, qty: 3955, year: "2025", sku: "NPO-XX-01-003-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Eve Kit Package", product: "Plate 9\"\" (2024)", element: "Plate 9", notes: "SKU NPO-XX-01-004-01", type: "M", inventoryQty: 1960, clientQoh: 1500, neededQty: 5455, qty: 3955, year: "2025", sku: "NPO-XX-01-004-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Gold Kit Package", product: "Reindeer Food", element: "Burlap Sack", notes: "SKU NPO-XX-02-002-01", type: "M", inventoryQty: 1250, clientQoh: 5970, neededQty: 15993, qty: 10023, year: "2024", sku: "NPO-XX-02-002-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Gold Kit Package", product: "Reindeer Food", element: "Reindeer Food Label", notes: "SKU NPO-XX-02-002-02", type: "M", inventoryQty: 1250, clientQoh: 5970, neededQty: 15993, qty: 10023, year: "2024", sku: "NPO-XX-02-002-02", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Gold Kit Package", product: "Reindeer Food (2024) v1 Non-Printed", element: "Windowed Pouch (2024) v1 Non-Printed", notes: "SKU NPO-XX-02-004-01", type: "M", inventoryQty: 3000, clientQoh: 5970, neededQty: 15993, qty: 10023, year: "2024", sku: "NPO-XX-02-004-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Gold Kit Package", product: "Carton Eflute 11x5x4", element: "Carton Eflute 11x5x4", notes: "SKU NPO-XX-02-001-01", type: "M", inventoryQty: 8460, clientQoh: 5970, neededQty: 15993, qty: 10023, year: "2025", sku: "NPO-XX-02-001-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Gold Kit Package", product: "Door Hangers", element: "Door Hangers", notes: "SKU NPO-XX-02-005-01", type: "M", inventoryQty: 7802, clientQoh: 5970, neededQty: 15993, qty: 10023, year: "2025", sku: "NPO-XX-02-005-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Gold Kit Package", product: "Fake Snow", element: "Fake Snow", notes: "SKU NPO-XX-02-006-01", type: "M", inventoryQty: 5115, clientQoh: 5970, neededQty: 15993, qty: 10023, year: "2025", sku: "NPO-XX-02-006-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Gold Kit Package", product: "Fake Snow", element: "Fake Snow Labels", notes: "SKU NPO-XX-02-006-02", type: "M", inventoryQty: 1296, clientQoh: 5970, neededQty: 15993, qty: 10023, year: "2025", sku: "NPO-XX-02-006-02", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Gold Kit Package", product: "Magnet 5\"", element: "Magnet 5\"", notes: "SKU NPO-XX-02-007-01", type: "M", inventoryQty: 7820, clientQoh: 5970, neededQty: 15993, qty: 10023, year: "2025", sku: "NPO-XX-02-007-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Gold Kit Package", product: "Window Sticker 5\"", element: "Window Sticker 5\"", notes: "SKU NPO-XX-02-007-01", type: "M", inventoryQty: 7810, clientQoh: 5970, neededQty: 15993, qty: 10023, year: "2025", sku: "NPO-XX-02-007-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Gold Kit Package", product: "Reindeer Food v2 Printed", element: "Windowed Pouch v2 Printed", notes: "SKU NPO-XX-02-003-01", type: "M", inventoryQty: 6428, clientQoh: 5970, neededQty: 15993, qty: 10023, year: "2025", sku: "NPO-XX-02-003-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Letter Package", product: "Envelopes", element: "Envelopes", notes: "SKU NPO-XX-03-001-01", type: "M", inventoryQty: 43000, clientQoh: 21000, neededQty: 63486, qty: 42486, year: "2025", sku: "NPO-XX-03-001-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Letter Package", product: "Linen Paper", element: "Linen Paper (Letter Sets)", notes: "SKU NPO-XX-03-002-01", type: "M", inventoryQty: 19800, clientQoh: 21000, neededQty: 63486, qty: 42486, year: "2025", sku: "NPO-XX-03-002-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Letter Package", product: "Ornaments", element: "Ornaments", notes: "SKU NPO-XX-03-003-01", type: "M", inventoryQty: 28176, clientQoh: 21000, neededQty: 63486, qty: 42486, year: "2025", sku: "NPO-XX-03-003-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Letter Package", product: "Sticker Seals", element: "Sticker Seals", notes: "SKU NPO-XX-03-004-01", type: "M", inventoryQty: 43800, clientQoh: 21000, neededQty: 63486, qty: 42486, year: "2025", sku: "NPO-XX-03-004-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Multi-Letter Package", product: "FedEx Envelopes", element: "FedEx Enelopes", notes: "SKU NPO-XX-03-006-01", type: "M", inventoryQty: 3750, clientQoh: 0, neededQty: 0, qty: 0, year: "2023", sku: "NPO-XX-03-006-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 },
  { packageName: "Multi-Letter Package", product: "Multi Letter Envelopes", element: "Multi Letter Envelopes", notes: "SKU NPO-XX-03-005-01", type: "M", inventoryQty: 6300, clientQoh: 7000, neededQty: 9272, qty: 2272, year: "2025", sku: "NPO-XX-03-005-01", cost: 0, markup: 0.4, marginAdj: 0.4, priorPpp: 0 }
];

function uid(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function cloneRowsForNewProject(sourceRows) {
  const idMap = new Map(sourceRows.map((row) => [row.id, uid(row.level)]));
  return {
    rows: sourceRows.map((row) => ({
      ...row,
      id: idMap.get(row.id),
      parentId: row.parentId ? idMap.get(row.parentId) : row.parentId
    })),
    idMap
  };
}

function uniqueValues(values) {
  return Array.from(new Set(values.map((value) => String(value || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function normalizeEstimateRow(row) {
  return {
    ...row,
    source: row.source || "",
    moq: asNumber(row.moq)
  };
}

function buildSeedRows(sourceData) {
  const packageIds = new Map();
  const productIds = new Map();
  const rows = [];
  const packageNames = uniqueValues(sourceData.map((row) => row.packageName));

  packageNames.forEach((packageName, index) => {
    const id = uid("package");
    packageIds.set(packageName, id);
    const firstSource = sourceData.find((s) => s.packageName === packageName);
    rows.push({
      id,
      level: "package",
      active: true,
      sourceOrder: (index + 1) * 100,
      packageName,
      product: "",
      element: "",
      sku: firstSource?.packageSku || "",
      description: `${packageName} package`,
      type: "",
      source: "",
      moq: 0,
      qty: 0,
      neededQty: 0,
      inventoryQty: 0,
      clientQoh: 0,
      cost: 0,
      markup: 0.4,
      marginAdj: 0.4,
      priorPpp: 0
    });
  });

  sourceData.forEach((source, index) => {
    const parentPackageId = packageIds.get(source.packageName);
    const packageIndex = packageNames.indexOf(source.packageName);
    const productKey = `${source.packageName}::${source.product}`;
    // Leaf-product: product sits directly under package with no element children
    const isLeafProduct = !source.element;
    let productId = productIds.get(productKey);

    if (!productId) {
      productId = uid("product");
      productIds.set(productKey, productId);
      rows.push({
        id: productId,
        level: "product",
        parentId: parentPackageId,
        active: true,
        sourceOrder: (packageIndex + 1) * 100 + productIds.size,
        packageName: source.packageName,
        product: source.product,
        element: "",
        sku: source.productSku || source.sku || "",
        description: "",
        type: source.type,
        source: "",
        moq: 0,
        // For leaf products the product row itself carries the inventory/cost data
        qty: isLeafProduct ? source.qty : 0,
        neededQty: isLeafProduct ? source.neededQty : 0,
        inventoryQty: isLeafProduct ? source.inventoryQty : 0,
        clientQoh: isLeafProduct ? source.clientQoh : 0,
        cost: isLeafProduct ? source.cost : 0,
        markup: source.markup,
        marginAdj: source.marginAdj,
        priorPpp: isLeafProduct ? source.priorPpp : 0
      });
    }

    // Leaf-product rows have no element child — skip element creation
    if (!isLeafProduct) {
      rows.push({
        id: uid("element"),
        level: "element",
        parentId: productId,
        active: true,
        sourceOrder: (packageIndex + 1) * 100 + index + 1.1,
        packageName: source.packageName,
        product: source.product,
        element: source.element || source.product,
        sku: source.sku || "",
        description: "",
        type: source.type,
        source: "",
        moq: 0,
        qty: source.qty,
        neededQty: source.neededQty,
        inventoryQty: source.inventoryQty,
        clientQoh: source.clientQoh,
        cost: source.cost,
        markup: source.markup,
        marginAdj: source.marginAdj,
        priorPpp: source.priorPpp
      });
    }
  });

  return rows;
}

function buildSeedLookups(theRows, sourceData) {
  return {
    packages: uniqueValues(theRows.map((row) => row.packageName)),
    products: uniqueValues(theRows.map((row) => row.product)),
    elements: uniqueValues(theRows.map((row) => row.element).filter(Boolean)),
    clients: ["North Pole Post Office", "Portofino", "Santa Direct"],
    years: uniqueValues(["2026", ...(sourceData || []).map((row) => row.year).filter(Boolean)])
  };
}

let seedRows = buildSeedRows(sourceProducts);
let seedLookups = buildSeedLookups(seedRows, sourceProducts);

let rows = [];
let lookups = structuredClone(seedLookups);
let activePackage = "All";
let activeTypes = new Set(Object.keys(typeLabels));
let expanded = new Set();
let previewBaseRows = null;
let draggedRowId = null;
let paymentDates = {};
function defaultPaymentSettings() {
  return Object.fromEntries(Object.keys(typeLabels).map((type) => [type, { depositCount: 1, depositPct: 0.25, paymentCount: 3 }]));
}

function paymentSettingFor(type) {
  const settings = paymentSettings[type] || {};
  return {
    depositCount: Math.min(Math.max(Math.round(asNumber(settings.depositCount ?? 1)), 0), 1),
    depositPct: Math.min(Math.max(asNumber(settings.depositPct ?? 0.25), 0), 1),
    paymentCount: Math.min(Math.max(Math.round(asNumber(settings.paymentCount ?? 3)), 0), 12)
  };
}

let paymentSettings = defaultPaymentSettings();
let estimatesList = [];
let clientsList = [];
let activeView = "proposalView";

function defaultProposal() {
  return {
    title: "Proposal for Client",
    subtitle: "Direct Mail Campaign",
    preparedFor: "",
    pricingMode: "package",
    publishingTemplate: "directMail",
    outputAudience: "client",
    outputScope: "both",
    includedSections: ["copy", "estimate", "schedule", "services", "sourcing"],
    templateMeta: null,
    sourceRecords: {},
    overview: "This campaign is designed to replace guesswork with a clear, trackable plan. The estimate below turns the selected package structure into proposal-ready pricing.",
    audience: "Target audience, geography, quantity assumptions, and campaign scope can be summarized here before final production counts are locked.",
    deliverables: "Included deliverables are generated from the active estimating grid. Use the pricing section to review package rollups, detailed line items, or production type summaries.",
    valueNarrative: "The meaningful cost is the investment required to acquire and serve the right lead, customer, or recipient. Pricing should be evaluated against the expected return from each successful response.",
    nextSteps: "1. Review the campaign scope and pricing.\n2. Confirm any list, artwork, quantity, and schedule details.\n3. Approve the proposal so final numbers and production timing can be completed.",
    terms: "This proposal is based on the current project scope and may be refined as details are confirmed. Changes outside the approved scope may affect pricing, schedule, or required approvals."
  };
}

let proposal = defaultProposal();

function defaultPrintQuoteValidUntil() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
}

function defaultPrintQuote() {
  return {
    name: "Print Quote Draft",
    source: "In-house / vendor print source",
    externalRef: "",
    sourceUrl: "",
    notes: "Use this draft to hold print-specific scope, pricing source, and assumptions before the print quote calculator is built.",
    validUntil: defaultPrintQuoteValidUntil(),
    customerName: "",
    customerCompany: "North Pole Post Office",
    shipMethod: "",
    shippingAmount: 0,
    customerNote: "",
    customerTerms: "All pricing is draft pending internal review and approval.",
    internalNotes: "Classify any notes before relying on customer output. Do not include source/vendor/cost/markup/pricing-basis details in customer preview.",
    outputMode: "builder",
    lineItems: []
  };
}

function defaultEcommPriceList() {
  return {
    name: "Ecomm Price List Draft",
    channel: "Catalog / storefront",
    externalRef: "",
    sourceUrl: "",
    notes: "Use this draft to hold ecommerce list scope, channel assumptions, and selected products before the ecomm price list calculator is built."
  };
}

let printQuote = defaultPrintQuote();
let ecommPriceList = defaultEcommPriceList();

const serviceScenarioNames = {
  salesmachine: "SalesMachine base + channels",
  fractional: "Fractional sales focus",
  coldEmail: "Cold email + fractional sales"
};

const serviceSeedRows = [
  { id: "base", level: "product", active: true, scenario: "salesmachine", group: "Base Product", item: "SalesMachine base product", platform: "SalesMachine", costCenter: "Sharpdots", costType: "Services", startup: 0, recurring: 0, variable: 0, quantity: 1, variableModel: "monthly", startupMarkup: 50, monthlyMarkup: 50, notes: "Rollup of strategy, copywriting, cold email execution, and campaign management." },
  { id: "base-strategy", parentId: "base", level: "element", active: true, scenario: "salesmachine", group: "Base Product", item: "Strategy and offer architecture", platform: "SalesMachine", costCenter: "Sharpdots", costType: "Services", startup: 600, recurring: 350, variable: 0, quantity: 1, variableModel: "monthly", startupMarkup: 50, monthlyMarkup: 50, notes: "ICP, offer, sequence strategy, and testing plan." },
  { id: "base-copy", parentId: "base", level: "element", active: true, scenario: "salesmachine", group: "Base Product", item: "Copywriting and campaign creative", platform: "SalesMachine", costCenter: "Sharpdots", costType: "Assets", startup: 650, recurring: 250, variable: 0, quantity: 1, variableModel: "asset", startupMarkup: 50, monthlyMarkup: 50, notes: "Email copy, LinkedIn variants, voicemail scripts, and landing/message assets." },
  { id: "base-email", parentId: "base", level: "element", active: true, scenario: "salesmachine", group: "Base Product", item: "Cold email execution", platform: "Smartlead / ThorsHammer / Bison", costCenter: "Sharpdots", costType: "Services", startup: 250, recurring: 700, variable: 0.0012, quantity: 30000, variableModel: "metered", startupMarkup: 50, monthlyMarkup: 50, notes: "Execution labor plus metered sending/list tier model from Apollo/Smartlead examples." },
  { id: "base-management", parentId: "base", level: "element", active: true, scenario: "salesmachine", group: "Base Product", item: "Campaign management and optimization", platform: "HighLevel / HubSpot", costCenter: "Sharpdots", costType: "Services", startup: 0, recurring: 600, variable: 0, quantity: 1, variableModel: "monthly", startupMarkup: 50, monthlyMarkup: 50, notes: "Ongoing reporting, optimization, and coordination." },
  { id: "data-standard", level: "product", active: true, scenario: "salesmachine", group: "Data Streams", item: "Standard intent topic datastream", platform: "ZoomInfo", costCenter: "SalesArmy", costType: "Platforms", startup: 1000, recurring: 625, variable: 0.5, quantity: 1, variableModel: "seat/account", startupMarkup: 50, monthlyMarkup: 50, notes: "Sheet model: $625/mo shared account plus per-contact/direct dial style fees." },
  { id: "data-custom", level: "product", active: true, scenario: "salesmachine", group: "Data Streams", item: "Custom intent topic datastream", platform: "Apollo / Leadpipe / Audience Lab", costCenter: "Sharpdots", costType: "Assets", startup: 1200, recurring: 129, variable: 0.0012, quantity: 30000, variableModel: "metered", startupMarkup: 50, monthlyMarkup: 50, notes: "Use quantity as records, credits, enrichment calls, or cleaned leads depending on source." },
  { id: "platform-email", level: "product", active: true, scenario: "salesmachine", group: "Platforms", item: "Cold email domains and inbox infrastructure", platform: "Spaceship / Smartlead / Email warmup", costCenter: "SalesArmy", costType: "Platforms", startup: 50, recurring: 250, variable: 0, quantity: 1, variableModel: "monthly", startupMarkup: 50, monthlyMarkup: 50, notes: "Domains, sending platform, and warmup." },
  { id: "platform-crm", level: "product", active: true, scenario: "salesmachine", group: "Platforms", item: "CRM, scheduling, workflow, and reporting stack", platform: "HighLevel / HubSpot / Calendly / RevReply", costCenter: "Sharpdots", costType: "Platforms", startup: 300, recurring: 279, variable: 0, quantity: 1, variableModel: "monthly", startupMarkup: 50, monthlyMarkup: 50, notes: "CRM, calendar, automation, dashboard, and workflow tools." },
  { id: "channel-bdr", level: "product", active: false, scenario: "salesmachine", group: "Channels", item: "Fractional business development rep", platform: "LATAM BPO / Deel", costCenter: "SalesArmy", costType: "Fractional Representatives", startup: 2850, recurring: 3260, variable: 0, quantity: 1, variableModel: "rep/month", startupMarkup: 50, monthlyMarkup: 50, notes: "Rep, assessment, recruiting, onboarding, training, coaching." },
  { id: "channel-dialer", level: "product", active: false, scenario: "salesmachine", group: "Channels", item: "Automated dialing / virtual sales floor", platform: "Koncert / CallBlitz / Aloware / Kixie", costCenter: "SalesArmy", costType: "Platforms", startup: 1220, recurring: 470, variable: 0.06, quantity: 2500, variableModel: "metered", startupMarkup: 50, monthlyMarkup: 50, notes: "Use quantity as dials, call minutes, or metered voice events." },
  { id: "channel-linkedin", level: "product", active: false, scenario: "salesmachine", group: "Channels", item: "Cold LinkedIn", platform: "HeyReach / GetLia", costCenter: "SalesArmy", costType: "Platforms", startup: 0, recurring: 650, variable: 0, quantity: 1, variableModel: "profiles", startupMarkup: 50, monthlyMarkup: 50, notes: "User licenses, extra profiles, and LinkedIn execution." },
  { id: "channel-dsp", level: "product", active: false, scenario: "salesmachine", group: "Channels", item: "Programmatic ads for intent stream", platform: "Sharpdots DSP", costCenter: "Sharpdots", costType: "Platforms", startup: 1000, recurring: 1500, variable: 0, quantity: 1, variableModel: "budget", startupMarkup: 50, monthlyMarkup: 50, notes: "Prototype DSP channel tied to intent-stream audiences." },
  { id: "channel-voicemail", level: "product", active: false, scenario: "salesmachine", group: "Channels", item: "Ringless voicemail", platform: "Drop.co", costCenter: "SalesArmy", costType: "Platforms", startup: 0, recurring: 0, variable: 0.06, quantity: 1000, variableModel: "each", startupMarkup: 50, monthlyMarkup: 50, notes: "Use quantity as voicemail drops." },
  { id: "setup-workflow", level: "product", active: true, scenario: "salesmachine", group: "Setup / Activation", item: "Campaign build, workflows, integrations, and admin", platform: "SalesMachine / HighLevel / Tableau", costCenter: "Sharpdots", costType: "Setup/Activation", startup: 1500, recurring: 100, variable: 0, quantity: 1, variableModel: "monthly", startupMarkup: 50, monthlyMarkup: 50, notes: "Workflow build, pipeline, integration, data, admin, and dashboard." },
  { id: "setup-close", level: "product", active: true, scenario: "salesmachine", group: "Setup / Activation", item: "SalesMachine activation package", platform: "SalesArmy", costCenter: "SalesArmy", costType: "Setup/Activation", startup: 1480, recurring: 0, variable: 0, quantity: 1, variableModel: "activation", startupMarkup: 0, monthlyMarkup: 0, notes: "SalesArmy close / activation component." },
  { id: "frac-rep", level: "product", active: true, scenario: "fractional", group: "Fractional Representatives", item: "Outsourced Sales Rep LATAM (Base +)", platform: "LATAM BPO / Deel", costCenter: "SalesArmy", costType: "Fractional Representatives", startup: 0, recurring: 2500, variable: 0, quantity: 1, variableModel: "rep/month", startupMarkup: 50, monthlyMarkup: 50, notes: "Prorated rep base." },
  { id: "frac-coach", level: "product", active: true, scenario: "fractional", group: "Fractional Representatives", item: "Sales rep coaching, accountability, onboarding, and training", platform: "SalesArmy", costCenter: "SalesArmy", costType: "Services", startup: 2550, recurring: 1085, variable: 0, quantity: 1, variableModel: "monthly", startupMarkup: 50, monthlyMarkup: 50, notes: "Assessments, onboarding, training, Deel, coaching, recruiting." },
  { id: "cold-platform", level: "product", active: true, scenario: "coldEmail", group: "Cold Email", item: "Cold email platform and domain stack", platform: "ThorsHammer / Bison / Superwave / Smartlead", costCenter: "SalesArmy", costType: "Platforms", startup: 50, recurring: 350, variable: 0, quantity: 1, variableModel: "monthly", startupMarkup: 50, monthlyMarkup: 50, notes: "Sending infrastructure from sheet examples." },
  { id: "cold-fulfillment", level: "product", active: true, scenario: "coldEmail", group: "Cold Email", item: "Cold email fulfillment and conversion support", platform: "SalesMachine", costCenter: "Sharpdots", costType: "Services", startup: 500, recurring: 500, variable: 0, quantity: 1, variableModel: "monthly", startupMarkup: 50, monthlyMarkup: 50, notes: "External source rows reassigned to Sharpdots." }
];

let serviceScenario = "salesmachine";
let serviceRows = structuredClone(serviceSeedRows);
let serviceExpanded = new Set(serviceSeedRows.filter((row) => row.level === "product").map((row) => row.id));
let sourcing = { quotes: {}, selected: {} };
let sourcingViewMode = "summary";
let sourcingExpandedRows = new Set();
let selectedSourcingRows = new Set();
let pendingSourcingImport = null;
let workspaces = loadWorkspaces();
let libraryRecords = loadLibraryRecords();
let currentWorkspaceNumber = "";
let workspaceMode = "full";
let libraryPickerCollection = "";
let libraryPickerScope = "all";
let activeWorkspaceRecords = {
  estimates: "",
  proposals: "",
  services: "",
  sourcing: "",
  printQuotes: "",
  ecomm: ""
};
let dirtyWorkspaceRecords = new Set();
let dirtyRecordsResolve = null;

const workspaceRecordTypes = [
  { collection: "proposals", label: "Proposal", prefix: "P", start: 10, numberKey: "proposalNumber", viewId: "proposalView" },
  { collection: "estimates", label: "Estimate", prefix: "E", start: 1, numberKey: "projectNumber", viewId: "estimateView" },
  { collection: "services", label: "Service Calc", prefix: "S", start: 1, numberKey: "serviceNumber", viewId: "servicesView" },
  { collection: "sourcing", label: "Sourcing Set", prefix: "SRC", start: 1, numberKey: "sourcingNumber", viewId: "sourcingView" },
  { collection: "printQuotes", label: "Print Quote", prefix: "PQ", start: 1, numberKey: "printQuoteNumber", viewId: "printQuoteView" },
  { collection: "ecomm", label: "Ecomm Price List", prefix: "EPL", start: 1, numberKey: "ecommNumber", viewId: "ecommView" }
];

migrateLegacyLibraryRecords();

const libraryRecordUi = {
  printQuotes: {
    identityLabel: "Quote #",
    emptyLabel: "No saved print quotes",
    savedLabel: "Saved Print Quotes",
    newLabel: "New Quote",
    saveLabel: "Save Quote",
    versionLabel: "New Version",
    duplicateLabel: "Copy Quote",
    loadLabel: "Open Quote",
    browseLabel: "Find Quote",
    attachLabel: "Attach",
    detachLabel: "Detach",
    standaloneLabel: "Standalone quote draft",
    standaloneSavedLabel: "Standalone saved quote",
    attachedLabel: "Workspace quote",
    attachedTitle: "Use this print quote in the current workspace",
    detachedTitle: "Remove this print quote from the current workspace"
  },
  ecomm: {
    identityLabel: "List #",
    emptyLabel: "No saved price lists",
    savedLabel: "Saved Ecomm Price Lists",
    newLabel: "New List",
    saveLabel: "Save List",
    versionLabel: "New Version",
    duplicateLabel: "Copy List",
    loadLabel: "Open List",
    browseLabel: "Find Price List",
    attachLabel: "Attach",
    detachLabel: "Detach",
    standaloneLabel: "Standalone list draft",
    standaloneSavedLabel: "Standalone saved list",
    attachedLabel: "Workspace list",
    attachedTitle: "Use this ecomm price list in the current workspace",
    detachedTitle: "Remove this ecomm price list from the current workspace"
  }
};

const workspaceModes = {
  full: {
    label: "All Tools",
    buttonLabel: "All",
    scopeLabel: "All tools workspace",
    templateDefault: "directMail",
    defaultView: "proposalView",
    views: ["proposalView", "estimateView", "servicesView", "sourcingView", "printQuoteView", "ecommView"]
  },
  proposal: {
    label: "Proposal / Services",
    buttonLabel: "Proposal",
    scopeLabel: "Proposal and services workspace",
    templateDefault: "services",
    defaultView: "proposalView",
    views: ["proposalView", "servicesView", "estimateView", "printQuoteView"]
  },
  printEcomm: {
    label: "Print / Ecomm",
    buttonLabel: "Print / Ecomm",
    scopeLabel: "Print estimating workspace",
    templateDefault: "printQuote",
    defaultView: "printQuoteView",
    views: ["printQuoteView", "ecommView", "estimateView"]
  }
};

const els = {
  appTabs: document.querySelectorAll(".app-tab"),
  estimateView: document.querySelector("#estimateView"),
  proposalView: document.querySelector("#proposalView"),
  printQuoteView: document.querySelector("#printQuoteView"),
  ecommView: document.querySelector("#ecommView"),
  projectNumber: document.querySelector("#projectNumber"),
  workspaceNumber: document.querySelector("#workspaceNumber"),
  workspaceName: document.querySelector("#workspaceName"),
  workspaceMode: document.querySelector("#workspaceMode"),
  workspaceModeButtons: document.querySelectorAll(".workspace-mode-option[data-workspace-mode]"),
  workspaceModeScope: document.querySelector("#workspaceModeScope"),
  workspaceLookup: document.querySelector("#workspaceLookup"),
  estimateRecordNumber: document.querySelector("#estimateRecordNumber"),
  proposalRecordNumber: document.querySelector("#proposalRecordNumber"),
  serviceRecordNumber: document.querySelector("#serviceRecordNumber"),
  sourcingRecordNumber: document.querySelector("#sourcingRecordNumber"),
  printQuoteRecordNumber: document.querySelector("#printQuoteRecordNumber"),
  ecommRecordNumber: document.querySelector("#ecommRecordNumber"),
  printQuotePlaceholderNumber: document.querySelector("#printQuotePlaceholderNumber"),
  printQuoteAttachmentStatus: document.querySelector("#printQuoteAttachmentStatus"),
  printQuoteSourceSummary: document.querySelector("#printQuoteSourceSummary"),
  ecommPlaceholderNumber: document.querySelector("#ecommPlaceholderNumber"),
  ecommAttachmentStatus: document.querySelector("#ecommAttachmentStatus"),
  ecommSourceSummary: document.querySelector("#ecommSourceSummary"),
  printQuoteName: document.querySelector("#printQuoteName"),
  printQuoteSource: document.querySelector("#printQuoteSource"),
  printQuoteExternalRef: document.querySelector("#printQuoteExternalRef"),
  printQuoteSourceUrl: document.querySelector("#printQuoteSourceUrl"),
  printQuoteNotes: document.querySelector("#printQuoteNotes"),
  printQuoteValidUntil: document.querySelector("#printQuoteValidUntil"),
  printQuoteCustomerName: document.querySelector("#printQuoteCustomerName"),
  printQuoteCustomerCompany: document.querySelector("#printQuoteCustomerCompany"),
  printQuoteShipMethod: document.querySelector("#printQuoteShipMethod"),
  printQuoteShippingAmount: document.querySelector("#printQuoteShippingAmount"),
  printQuoteCustomerNote: document.querySelector("#printQuoteCustomerNote"),
  printQuoteCustomerTerms: document.querySelector("#printQuoteCustomerTerms"),
  printQuoteInternalNotes: document.querySelector("#printQuoteInternalNotes"),
  addPrintQuoteLineBtn: document.querySelector("#addPrintQuoteLineBtn"),
  refreshPrintQuoteLinesBtn: document.querySelector("#refreshPrintQuoteLinesBtn"),
  printQuoteOutputModeButtons: document.querySelectorAll("[data-print-quote-mode]"),
  printQuoteOutputTitle: document.querySelector("#printQuoteOutputTitle"),
  printQuoteOutputSubtitle: document.querySelector("#printQuoteOutputSubtitle"),
  printQuotePreparedFor: document.querySelector("#printQuotePreparedFor"),
  printQuotePreviewName: document.querySelector("#printQuotePreviewName"),
  printQuotePreviewStatus: document.querySelector("#printQuotePreviewStatus"),
  printQuoteLines: document.querySelector("#printQuoteLines"),
  printQuoteTotals: document.querySelector("#printQuoteTotals"),
  printQuoteMessage: document.querySelector("#printQuoteMessage"),
  ecommListName: document.querySelector("#ecommListName"),
  ecommChannel: document.querySelector("#ecommChannel"),
  ecommExternalRef: document.querySelector("#ecommExternalRef"),
  ecommSourceUrl: document.querySelector("#ecommSourceUrl"),
  ecommNotes: document.querySelector("#ecommNotes"),
  tabRecordControls: document.querySelectorAll(".tab-record-controls"),
  estimateVersion: document.querySelector("#estimateVersion"),
  newWorkspaceBtn: document.querySelector("#newWorkspaceBtn"),
  saveWorkspaceBtn: document.querySelector("#saveWorkspaceBtn"),
  duplicateWorkspaceBtn: document.querySelector("#duplicateWorkspaceBtn"),
  loadWorkspaceBtn: document.querySelector("#loadWorkspaceBtn"),
  loadWorkspaceModal: document.querySelector("#loadWorkspaceModal"),
  closeLoadWorkspaceBtn: document.querySelector("#closeLoadWorkspaceBtn"),
  loadWorkspaceSearch: document.querySelector("#loadWorkspaceSearch"),
  loadWorkspaceList: document.querySelector("#loadWorkspaceList"),
  libraryRecordModal: document.querySelector("#libraryRecordModal"),
  libraryRecordTitle: document.querySelector("#libraryRecordTitle"),
  closeLibraryRecordBtn: document.querySelector("#closeLibraryRecordBtn"),
  libraryRecordSearch: document.querySelector("#libraryRecordSearch"),
  libraryRecordScopeButtons: document.querySelectorAll("[data-library-scope]"),
  libraryRecordSummary: document.querySelector("#libraryRecordSummary"),
  libraryRecordList: document.querySelector("#libraryRecordList"),
  dirtyRecordsModal: document.querySelector("#dirtyRecordsModal"),
  dirtyRecordsMessage: document.querySelector("#dirtyRecordsMessage"),
  dirtyRecordsList: document.querySelector("#dirtyRecordsList"),
  dirtySaveContinueBtn: document.querySelector("#dirtySaveContinueBtn"),
  dirtyDiscardContinueBtn: document.querySelector("#dirtyDiscardContinueBtn"),
  dirtyCancelBtn: document.querySelector("#dirtyCancelBtn"),
  dirtyCancelActionBtn: document.querySelector("#dirtyCancelActionBtn"),
  reportProjectTitle: document.querySelector("#reportProjectTitle"),
  reportProjectNumber: document.querySelector("#reportProjectNumber"),
  projectName: document.querySelector("#projectName"),
  projectNameLookup: document.querySelector("#projectNameLookup"),
  clientName: document.querySelector("#clientName"),
  estimateYear: document.querySelector("#estimateYear"),
  lineItems: document.querySelector("#lineItems"),
  rowTemplate: document.querySelector("#rowTemplate"),
  estimateViewMode: document.querySelector("#estimateViewMode"),
  estimateViewModeButtons: document.querySelectorAll("[data-view-mode]"),
  searchInput: document.querySelector("#searchInput"),
  packageFilters: document.querySelector("#packageFilters"),
  typeFilters: document.querySelector("#typeFilters"),
  includeInactive: document.querySelector("#includeInactive"),
  globalMarkup: document.querySelector("#globalMarkup"),
  applyMarkupBtn: document.querySelector("#applyMarkupBtn"),
  tariffRate: document.querySelector("#tariffRate"),
  simulationMode: document.querySelector("#simulationMode"),
  simulationBasis: document.querySelector("#simulationBasis"),
  simulationPercent: document.querySelector("#simulationPercent"),
  simulationValueLabel: document.querySelector("#simulationValueLabel"),
  simulationPreview: document.querySelector("#simulationPreview"),
  simulationSummary: document.querySelector("#simulationSummary"),
  applySimulationBtn: document.querySelector("#applySimulationBtn"),
  addPackageBtn: document.querySelector("#addPackageBtn"),
  addProductBtn: document.querySelector("#addProductBtn"),
  addElementBtn: document.querySelector("#addElementBtn"),
  estimateSaveStatus: document.querySelector("#estimateSaveStatus"),
  loadEstimateModal: document.querySelector("#loadEstimateModal"),
  closeLoadEstimateBtn: document.querySelector("#closeLoadEstimateBtn"),
  loadEstimateSearch: document.querySelector("#loadEstimateSearch"),
  loadEstimateList: document.querySelector("#loadEstimateList"),
  resetBtn: document.querySelector("#resetBtn"),
  exportBtn: document.querySelector("#exportBtn"),
  pdfBtn: document.querySelector("#pdfBtn"),
  pdfScope: document.querySelector("#pdfScope"),
  estimateDate: document.querySelector("#estimateDate"),
  clientTotal: document.querySelector("#clientTotal"),
  costTotal: document.querySelector("#costTotal"),
  marginTotal: document.querySelector("#marginTotal"),
  weightedPpp: document.querySelector("#weightedPpp"),
  visibleCount: document.querySelector("#visibleCount"),
  packageRollup: document.querySelector("#packageRollup"),
  paymentSchedule: document.querySelector("#paymentSchedule"),
  promoteDropZone: document.querySelector("#promoteDropZone"),
  printTypeSubtotals: document.querySelector("#printTypeSubtotals"),
  neededQtyHead: document.querySelector("#neededQtyHead"),
  footerInventoryQty: document.querySelector("#footerInventoryQty"),
  footerNeededQty: document.querySelector("#footerNeededQty"),
  footerQtyToOrder: document.querySelector("#footerQtyToOrder"),
  footerPerPieceCost: document.querySelector("#footerPerPieceCost"),
  footerClientQoh: document.querySelector("#footerClientQoh"),
  footerQty: document.querySelector("#footerQty"),
  footerCost: document.querySelector("#footerCost"),
  footerStdMarkup: document.querySelector("#footerStdMarkup"),
  footerMargin: document.querySelector("#footerMargin"),
  footerClient: document.querySelector("#footerClient"),
  footerPpp: document.querySelector("#footerPpp"),
  footerDiff: document.querySelector("#footerDiff"),
  priorPppHead: document.querySelector("#priorPppHead"),
  trackingLevel: document.querySelector("#trackingLevel"),
  trackingMode: document.querySelector("#trackingMode"),
  trackingItem: document.querySelector("#trackingItem"),
  expandChartBtn: document.querySelector("#expandChartBtn"),
  yearPanel: document.querySelector(".year-panel"),
  yearTracking: document.querySelector("#yearTracking"),
  lookupTable: document.querySelector("#lookupTable"),
  lookupValue: document.querySelector("#lookupValue"),
  saveLookupBtn: document.querySelector("#saveLookupBtn"),
  lookupList: document.querySelector("#lookupList"),
  packageLookup: document.querySelector("#packageLookup"),
  productLookup: document.querySelector("#productLookup"),
  elementLookup: document.querySelector("#elementLookup"),
  clientLookup: document.querySelector("#clientLookup"),
  yearLookup: document.querySelector("#yearLookup"),
  proposalTitle: document.querySelector("#proposalTitle"),
  proposalSubtitle: document.querySelector("#proposalSubtitle"),
  proposalPreparedFor: document.querySelector("#proposalPreparedFor"),
  proposalPricingMode: document.querySelector("#proposalPricingMode"),
  proposalTemplateSearch: document.querySelector("#proposalTemplateSearch"),
  proposalTemplateCategory: document.querySelector("#proposalTemplateCategory"),
  proposalTemplateSelect: document.querySelector("#proposalTemplateSelect"),
  proposalTemplateLibraryCount: document.querySelector("#proposalTemplateLibraryCount"),
  proposalTemplateSourceSummary: document.querySelector("#proposalTemplateSourceSummary"),
  loadProposalTemplateBtn: document.querySelector("#loadProposalTemplateBtn"),
  resetProposalSourceBtn: document.querySelector("#resetProposalSourceBtn"),
  proposalTemplateDisplayName: document.querySelector("#proposalTemplateDisplayName"),
  renameProposalTemplateCopyBtn: document.querySelector("#renameProposalTemplateCopyBtn"),
  proposalTemplateWorkingStatus: document.querySelector("#proposalTemplateWorkingStatus"),
  proposalPublishingTemplate: document.querySelector("#proposalPublishingTemplate"),
  proposalOutputAudience: document.querySelector("#proposalOutputAudience"),
  proposalOutputScope: document.querySelector("#proposalOutputScope"),
  proposalSectionToggles: Array.from(document.querySelectorAll(".proposal-section-toggle")),
  proposalPublishPdfBtn: document.querySelector("#proposalPublishPdfBtn"),
  proposalPublishCsvBtn: document.querySelector("#proposalPublishCsvBtn"),
  proposalSignatureBtn: document.querySelector("#proposalSignatureBtn"),
  proposalPublishSummary: document.querySelector("#proposalPublishSummary"),
  proposalPublishReadiness: document.querySelector("#proposalPublishReadiness"),
  proposalPublishManifest: document.querySelector("#proposalPublishManifest"),
  proposalTemplateStatus: document.querySelector("#proposalTemplateStatus"),
  resetProposalTemplateBtn: document.querySelector("#resetProposalTemplateBtn"),
  proposalPublishNote: document.querySelector("#proposalPublishNote"),
  proposalOverview: document.querySelector("#proposalOverview"),
  proposalAudience: document.querySelector("#proposalAudience"),
  proposalDeliverables: document.querySelector("#proposalDeliverables"),
  proposalValueNarrative: document.querySelector("#proposalValueNarrative"),
  proposalNextSteps: document.querySelector("#proposalNextSteps"),
  proposalTerms: document.querySelector("#proposalTerms"),
  proposalPreviewTitle: document.querySelector("#proposalPreviewTitle"),
  proposalPreviewSubtitle: document.querySelector("#proposalPreviewSubtitle"),
  proposalPreviewPreparedFor: document.querySelector("#proposalPreviewPreparedFor"),
  proposalPreviewProject: document.querySelector("#proposalPreviewProject"),
  proposalPreviewDate: document.querySelector("#proposalPreviewDate"),
  proposalPreviewEditStatus: document.querySelector("#proposalPreviewEditStatus"),
  proposalEditPreviewBtn: document.querySelector("#proposalEditPreviewBtn"),
  proposalDraftBanner: document.querySelector("#proposalDraftBanner"),
  proposalSourceSnapshot: document.querySelector("#proposalSourceSnapshot"),
  proposalPublishFooter: document.querySelector("#proposalPublishFooter"),
  proposalPreviewOverview: document.querySelector("#proposalPreviewOverview"),
  proposalPreviewAudience: document.querySelector("#proposalPreviewAudience"),
  proposalPreviewDeliverables: document.querySelector("#proposalPreviewDeliverables"),
  proposalPreviewValueNarrative: document.querySelector("#proposalPreviewValueNarrative"),
  proposalPreviewNextSteps: document.querySelector("#proposalPreviewNextSteps"),
  proposalPreviewTerms: document.querySelector("#proposalPreviewTerms"),
  proposalPricingNote: document.querySelector("#proposalPricingNote"),
  proposalPricingTotal: document.querySelector("#proposalPricingTotal"),
  proposalPricingSummary: document.querySelector("#proposalPricingSummary"),
  proposalPricingLines: document.querySelector("#proposalPricingLines"),
  proposalScheduleSection: document.querySelector("#proposalScheduleSection"),
  proposalScheduleNote: document.querySelector("#proposalScheduleNote"),
  proposalScheduleTotal: document.querySelector("#proposalScheduleTotal"),
  proposalScheduleLines: document.querySelector("#proposalScheduleLines"),
  proposalServicesSection: document.querySelector("#proposalServicesSection"),
  proposalServicesNote: document.querySelector("#proposalServicesNote"),
  proposalServicesTotal: document.querySelector("#proposalServicesTotal"),
  proposalServicesSummary: document.querySelector("#proposalServicesSummary"),
  proposalServicesLines: document.querySelector("#proposalServicesLines"),
  proposalSourcingSection: document.querySelector("#proposalSourcingSection"),
  proposalSourcingNote: document.querySelector("#proposalSourcingNote"),
  proposalSourcingTotal: document.querySelector("#proposalSourcingTotal"),
  proposalSourcingLines: document.querySelector("#proposalSourcingLines"),
  proposalPrintQuoteSection: document.querySelector("#proposalPrintQuoteSection"),
  proposalPrintQuoteNote: document.querySelector("#proposalPrintQuoteNote"),
  proposalPrintQuoteLines: document.querySelector("#proposalPrintQuoteLines"),
  proposalEcommSection: document.querySelector("#proposalEcommSection"),
  proposalEcommNote: document.querySelector("#proposalEcommNote"),
  proposalEcommLines: document.querySelector("#proposalEcommLines"),
  servicesView: document.querySelector("#servicesView"),
  sourcingView: document.querySelector("#sourcingView"),
  serviceScenario: document.querySelector("#serviceScenario"),
  serviceTermMonths: document.querySelector("#serviceTermMonths"),
  serviceOngoingMonths: document.querySelector("#serviceOngoingMonths"),
  serviceAppointments: document.querySelector("#serviceAppointments"),
  serviceStartupMarkup: document.querySelector("#serviceStartupMarkup"),
  serviceMonthlyMarkup: document.querySelector("#serviceMonthlyMarkup"),
  serviceRows: document.querySelector("#serviceRows"),
  servicePlatformLookup: document.querySelector("#servicePlatformLookup"),
  serviceActivationPrice: document.querySelector("#serviceActivationPrice"),
  serviceMonthlyPrice: document.querySelector("#serviceMonthlyPrice"),
  serviceTermPrice: document.querySelector("#serviceTermPrice"),
  serviceAppointmentPrice: document.querySelector("#serviceAppointmentPrice"),
  serviceCostCenters: document.querySelector("#serviceCostCenters"),
  serviceAssumptions: document.querySelector("#serviceAssumptions"),
  serviceTermModes: document.querySelectorAll("input[name='serviceTermMode']"),
  execDialsPerDay: document.querySelector("#execDialsPerDay"),
  execDaysPerWeek: document.querySelector("#execDaysPerWeek"),
  execConversationsPerDay: document.querySelector("#execConversationsPerDay"),
  execSetsPerWeek: document.querySelector("#execSetsPerWeek"),
  execShowRate: document.querySelector("#execShowRate"),
  execWinRate: document.querySelector("#execWinRate"),
  executionSummary: document.querySelector("#executionSummary"),
  sourcingSearch: document.querySelector("#sourcingSearch"),
  sourcingSourceFilter: document.querySelector("#sourcingSourceFilter"),
  sourcingStatusFilter: document.querySelector("#sourcingStatusFilter"),
  sourcingGroupBy: document.querySelector("#sourcingGroupBy"),
  sourcingShowAll: document.querySelector("#sourcingShowAll"),
  populateSourcingSampleBtn: document.querySelector("#populateSourcingSampleBtn"),
  selectVisibleSourcingBtn: document.querySelector("#selectVisibleSourcingBtn"),
  exportSourcingTemplateBtn: document.querySelector("#exportSourcingTemplateBtn"),
  importSourcingQuotesBtn: document.querySelector("#importSourcingQuotesBtn"),
  sourcingImportFile: document.querySelector("#sourcingImportFile"),
  sourcingImportStatus: document.querySelector("#sourcingImportStatus"),
  sourcingImportMapper: document.querySelector("#sourcingImportMapper"),
  sourcingViewModeButtons: document.querySelectorAll("[data-sourcing-view-mode]"),
  sourcingBoardContext: document.querySelector("#sourcingBoardContext"),
  sourcingItems: document.querySelector("#sourcingItems"),
  sourcingProjectScope: document.querySelector("#sourcingProjectScope"),
  sourcingItemCount: document.querySelector("#sourcingItemCount"),
  sourcingQuoteCount: document.querySelector("#sourcingQuoteCount"),
  sourcingSelectedCount: document.querySelector("#sourcingSelectedCount"),
  sourcingSelectedCost: document.querySelector("#sourcingSelectedCost"),
  sourcingLatestRefresh: document.querySelector("#sourcingLatestRefresh")
};

function money(value, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(Number.isFinite(value) ? value : 0);
}

function decimal(value, digits = 3) {
  return (Number.isFinite(value) ? value : 0).toFixed(digits);
}

function formatNumberForReport(value, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(asNumber(value));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function textWithBreaks(value) {
  return escapeHtml(value || "").replace(/\n/g, "<br>");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function loadWorkspaces() {
  try {
    const parsed = JSON.parse(localStorage.getItem("sharpdots-workspaces") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveWorkspaces() {
  localStorage.setItem("sharpdots-workspaces", JSON.stringify(workspaces));
}

function loadLibraryRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem("sharpdots-standalone-libraries") || "{}");
    return {
      printQuotes: Array.isArray(parsed.printQuotes) ? parsed.printQuotes : [],
      ecomm: Array.isArray(parsed.ecomm) ? parsed.ecomm : []
    };
  } catch {
    return { printQuotes: [], ecomm: [] };
  }
}

function saveLibraryRecords() {
  localStorage.setItem("sharpdots-standalone-libraries", JSON.stringify(libraryRecords));
}

function libraryRecordsFor(collection) {
  return Array.isArray(libraryRecords?.[collection]) ? libraryRecords[collection] : [];
}

function setLibraryRecordsFor(collection, records) {
  libraryRecords[collection] = Array.isArray(records) ? records : [];
  saveLibraryRecords();
}

function migrateLegacyLibraryRecords() {
  if (!Array.isArray(workspaces) || !libraryRecords) return false;
  let changed = false;
  ["printQuotes", "ecomm"].forEach((collection) => {
    const type = recordTypeFor(collection);
    if (!type) return;
    const existingNumbers = new Set(libraryRecordsFor(collection).map((record) => record[type.numberKey]));
    workspaces.forEach((workspace) => {
      (workspace.records?.[collection] || []).forEach((record) => {
        const number = record[type.numberKey];
        if (!number || existingNumbers.has(number)) return;
        libraryRecords[collection].push({
          ...structuredClone(record),
          attachedWorkspaces: uniqueValues([...(record.attachedWorkspaces || []), record.attachedToWorkspace, workspace.workspaceNumber].filter(Boolean)),
          status: record.status === "attached" ? "attached" : "standalone"
        });
        existingNumbers.add(number);
        changed = true;
      });
    });
    libraryRecords[collection].sort((a, b) => prefixedNumberSortValue(a[type.numberKey], type.prefix) - prefixedNumberSortValue(b[type.numberKey], type.prefix));
  });
  if (changed) saveLibraryRecords();
  return changed;
}

function prefixedNumberSortValue(value, prefix) {
  const match = String(value || "").match(new RegExp(`^${escapeRegExp(prefix)}-(\\d{6})$`));
  return match ? Number(match[1]) : 0;
}

function nextPrefixedNumber(values, prefix, start = 1) {
  const highest = values.reduce((max, value) => Math.max(max, prefixedNumberSortValue(value, prefix)), 0);
  return `${prefix}-${String(Math.max(highest + 1, start)).padStart(6, "0")}`;
}

function nextWorkspaceNumber() {
  return nextPrefixedNumber(workspaces.map((workspace) => workspace.workspaceNumber), "W");
}

function defaultRecordNumber(prefix, start = 1) {
  return `${prefix}-${String(start).padStart(6, "0")}`;
}

function setRecordOutput(output, value, prefix, start = 1) {
  if (!output) return;
  const displayValue = value || defaultRecordNumber(prefix, start);
  output.value = displayValue;
  output.textContent = displayValue;
  output.title = displayValue;
}

function workspaceRecordNumbers(workspace, collection, key) {
  return (workspace?.records?.[collection] || [])
    .map((record) => record[key] || record.recordNumber || record.number)
    .filter(Boolean);
}

function recordTypeFor(collection) {
  return workspaceRecordTypes.find((type) => type.collection === collection);
}

function libraryUiFor(collection) {
  return libraryRecordUi[collection] || null;
}

function isLibraryRecordCollection(collection) {
  return Boolean(libraryUiFor(collection));
}

function libraryRecordAttachmentList(record) {
  return uniqueValues([...(record?.attachedWorkspaces || []), record?.attachedToWorkspace].filter(Boolean));
}

function libraryRecordAttachedToWorkspace(record, workspaceNumber = currentWorkspaceNumber) {
  return Boolean(workspaceNumber && libraryRecordAttachmentList(record).includes(workspaceNumber));
}

function activeRecordsForWorkspaceSave(workspace) {
  const active = { ...(workspace?.activeRecords || {}) };
  Object.entries(activeWorkspaceRecords).forEach(([collection, recordNumber]) => {
    if (!recordNumber) return;
    if (!isLibraryRecordCollection(collection)) {
      active[collection] = recordNumber;
      return;
    }
    const type = recordTypeFor(collection);
    const record = libraryRecordsFor(collection).find((candidate) => candidate[type.numberKey] === recordNumber);
    if (libraryRecordAttachedToWorkspace(record, workspace.workspaceNumber)) active[collection] = recordNumber;
    else if (active[collection] === recordNumber) delete active[collection];
  });
  return active;
}

function recordTypeForView(viewId = activeView) {
  return workspaceRecordTypes.find((type) => type.viewId === viewId) || workspaceRecordTypes.find((type) => type.collection === "estimates");
}

function activeRecordNumber(collection) {
  if (collection === "estimates") return normalizeEstimateNumber(currentEstimateNumber()) || activeWorkspaceRecords.estimates || nextProjectNumber();
  return activeWorkspaceRecords[collection] || "";
}

function setActiveRecordNumber(collection, recordNumber) {
  const type = recordTypeFor(collection);
  if (!type) return;
  const value = recordNumber || nextWorkspaceRecordNumber(collection, type.prefix, type.numberKey, type.start);
  if (collection === "estimates") setProjectNumber(value);
  else activeWorkspaceRecords[collection] = value;
  refreshRecordNumbers();
}

function updateWorkspaceRecordDirtyUi(collection = "") {
  const dirtyCount = dirtyWorkspaceRecords.size;
  if (els.saveWorkspaceBtn) {
    els.saveWorkspaceBtn.textContent = dirtyCount ? `Save ${dirtyCount} Tab${dirtyCount === 1 ? "" : "s"}` : "Save Workspace";
    els.saveWorkspaceBtn.title = dirtyCount
      ? `Save ${dirtyCount} changed workspace tab${dirtyCount === 1 ? "" : "s"}`
      : "Save current workspace";
  }
  els.tabRecordControls?.forEach((control) => {
    if (collection && control.dataset.recordType !== collection) return;
    const isDirty = dirtyWorkspaceRecords.has(control.dataset.recordType);
    control.classList.toggle("has-record-changes", isDirty);
    const type = recordTypeFor(control.dataset.recordType);
    const workspace = workspaceByNumber(currentWorkspaceNumber);
    const records = type
      ? isLibraryRecordCollection(type.collection)
        ? libraryRecordsFor(type.collection)
        : workspace?.records?.[type.collection] || []
      : [];
    const activeNumber = type ? activeRecordNumber(type.collection) : "";
    const activeRecord = type
      ? type.collection === "estimates"
        ? latestEstimateRecord(records, activeNumber)
        : records.find((record) => record[type.numberKey] === activeNumber)
      : null;
    const badge = control.querySelector(".record-dirty-badge");
    if (badge) badge.hidden = !(isDirty && activeRecord);
    const status = control.querySelector(".record-status");
    if (status) {
      status.classList.toggle("dirty", isDirty);
      if (isDirty && !activeRecord) status.textContent = "Unsaved draft";
    }
  });
  els.appTabs?.forEach((tab) => {
    const type = recordTypeForView(tab.dataset.view);
    if (!type) return;
    if (collection && type.collection !== collection) return;
    tab.classList.toggle("has-unsaved-record", dirtyWorkspaceRecords.has(type.collection));
  });
}

function markWorkspaceRecordDirty(collection) {
  if (!recordTypeFor(collection)) return;
  dirtyWorkspaceRecords.add(collection);
  updateWorkspaceRecordDirtyUi(collection);
}

function clearWorkspaceRecordDirty(collection) {
  dirtyWorkspaceRecords.delete(collection);
  updateWorkspaceRecordDirtyUi(collection);
}

function clearAllWorkspaceRecordDirty() {
  dirtyWorkspaceRecords = new Set();
  updateWorkspaceRecordDirtyUi();
}

function touchWorkspaceRecord(collection) {
  markWorkspaceRecordDirty(collection);
}

function dirtyCollectionsIn(collections = []) {
  const scoped = collections.length ? collections : Array.from(dirtyWorkspaceRecords);
  return uniqueValues(scoped).filter((collection) => dirtyWorkspaceRecords.has(collection));
}

function dirtyCollectionDetails(collections = []) {
  return dirtyCollectionsIn(collections).map((collection) => {
    const type = recordTypeFor(collection);
    const number = activeRecordNumber(collection)
      || nextWorkspaceRecordNumber(collection, type?.prefix || "", type?.numberKey || "", type?.start || 1);
    const version = collection === "estimates" ? ` v${currentEstimateVersion()}` : "";
    return {
      collection,
      label: type?.label || collection,
      number,
      version
    };
  });
}

function closeDirtyRecordsModal(action = "cancel") {
  if (els.dirtyRecordsModal) els.dirtyRecordsModal.hidden = true;
  if (dirtyRecordsResolve) dirtyRecordsResolve(action);
  dirtyRecordsResolve = null;
}

function requestDirtyRecordChoice(collections = [], actionLabel = "This action") {
  const dirtyCollections = dirtyCollectionsIn(collections);
  if (!dirtyCollections.length) return Promise.resolve("continue");
  if (!els.dirtyRecordsModal) return Promise.resolve(window.confirm(`${actionLabel} will replace unsaved changes. Continue without saving?`) ? "discard" : "cancel");
  if (dirtyRecordsResolve) closeDirtyRecordsModal("cancel");
  const details = dirtyCollectionDetails(dirtyCollections);
  if (els.dirtyRecordsMessage) {
    els.dirtyRecordsMessage.textContent = `${actionLabel} will replace unsaved changes in ${details.length} tab${details.length === 1 ? "" : "s"}.`;
  }
  if (els.dirtyRecordsList) {
    els.dirtyRecordsList.innerHTML = details.map((detail) => `
      <li>
        <strong>${escapeHtml(detail.label)}</strong>
        <span>${escapeHtml([detail.number, detail.version].filter(Boolean).join(""))}</span>
      </li>
    `).join("");
  }
  els.dirtyRecordsModal.hidden = false;
  els.dirtySaveContinueBtn?.focus();
  return new Promise((resolve) => {
    dirtyRecordsResolve = resolve;
  });
}

async function resolveDirtyRecordsBefore(collections = [], actionLabel = "This action") {
  const dirtyCollections = dirtyCollectionsIn(collections);
  if (!dirtyCollections.length) return true;
  const choice = await requestDirtyRecordChoice(dirtyCollections, actionLabel);
  if (choice === "cancel") return false;
  if (choice === "discard") return true;
  if (choice !== "save") return true;
  const savedRecordNumbers = [];
  for (const collection of dirtyCollections) {
    let savedRecordNumber = "";
    try {
      savedRecordNumber = await saveWorkspaceRecordCollection(collection);
    } catch (err) {
      console.error("Save before continue failed:", err);
    }
    if (!savedRecordNumber) {
      const label = recordTypeFor(collection)?.label || collection;
      setSaveStatus(`${label} save failed; action cancelled`);
      return false;
    }
    if (savedRecordNumber) savedRecordNumbers.push(savedRecordNumber);
  }
  if (savedRecordNumbers.length) setSaveStatus(`Saved ${savedRecordNumbers.length} changed record${savedRecordNumbers.length === 1 ? "" : "s"}`);
  return true;
}

function estimateLoadDirtyCollections() {
  return ["estimates", "proposals", "sourcing"];
}

function nextWorkspaceRecordNumber(collection, prefix, key, start = 1) {
  const workspace = workspaceByNumber(currentWorkspaceNumber);
  return nextPrefixedNumber(workspaceRecordNumbers(workspace, collection, key), prefix, start);
}

function nextLibraryRecordNumber(collection) {
  const type = recordTypeFor(collection);
  if (!type) return "";
  return nextPrefixedNumber(libraryRecordsFor(collection).map((record) => record[type.numberKey]), type.prefix, type.start);
}

function currentEstimateNumber() {
  return String(els.projectNumber?.value || els.projectNumber?.textContent || "").trim();
}

function normalizeEstimateNumber(projectNumber) {
  const match = String(projectNumber || "").trim().match(/^P-(\d{6})$/);
  return match ? `E-${match[1]}` : String(projectNumber || "").trim();
}

function legacyEstimateNumber(projectNumber) {
  const match = String(projectNumber || "").trim().match(/^E-(\d{6})$/);
  return match ? `P-${match[1]}` : String(projectNumber || "").trim();
}

function refreshRecordNumbers() {
  const estimateNumber = normalizeEstimateNumber(currentEstimateNumber()) || nextProjectNumber();
  setRecordOutput(els.proposalRecordNumber, activeRecordNumber("proposals") || nextWorkspaceRecordNumber("proposals", "P", "proposalNumber", 10), "P", 10);
  setRecordOutput(els.estimateRecordNumber, estimateNumber, "E");
  setRecordOutput(els.serviceRecordNumber, activeRecordNumber("services") || nextWorkspaceRecordNumber("services", "S", "serviceNumber"), "S");
  setRecordOutput(els.sourcingRecordNumber, activeRecordNumber("sourcing") || nextWorkspaceRecordNumber("sourcing", "SRC", "sourcingNumber"), "SRC");
  setRecordOutput(els.printQuoteRecordNumber, activeRecordNumber("printQuotes") || nextLibraryRecordNumber("printQuotes"), "PQ");
  setRecordOutput(els.ecommRecordNumber, activeRecordNumber("ecomm") || nextLibraryRecordNumber("ecomm"), "EPL");
  setRecordOutput(els.printQuotePlaceholderNumber, els.printQuoteRecordNumber?.value, "PQ");
  setRecordOutput(els.ecommPlaceholderNumber, els.ecommRecordNumber?.value, "EPL");
}

function setWorkspaceNumber(workspaceNumber) {
  currentWorkspaceNumber = workspaceNumber || nextWorkspaceNumber();
  const workspace = workspaceByNumber(currentWorkspaceNumber);
  workspaceMode = workspace?.workspaceMode || workspaceMode || "full";
  if (els.workspaceMode) els.workspaceMode.value = workspaceMode;
  renderWorkspaceModeButtons();
  activeWorkspaceRecords = {
    estimates: "",
    proposals: "",
    services: "",
    sourcing: "",
    printQuotes: "",
    ecomm: "",
    ...(workspace?.activeRecords || {})
  };
  if (els.workspaceNumber) {
    els.workspaceNumber.value = currentWorkspaceNumber;
    els.workspaceNumber.textContent = currentWorkspaceNumber;
    els.workspaceNumber.title = currentWorkspaceNumber;
  }
  refreshRecordNumbers();
}

function visibleWorkspaceViews(mode = workspaceMode) {
  return workspaceModes[mode]?.views || workspaceModes.full.views;
}

function defaultWorkspaceView(mode = workspaceMode) {
  return workspaceModes[mode]?.defaultView || workspaceModes.full.defaultView;
}

function isViewVisibleInMode(viewId, mode = workspaceMode) {
  return visibleWorkspaceViews(mode).includes(viewId);
}

function workspaceModeTabLabels(mode = workspaceMode) {
  return visibleWorkspaceViews(mode)
    .map((viewId) => {
      const tab = Array.from(els.appTabs || []).find((button) => button.dataset.view === viewId);
      return tab?.textContent.trim() || workspaceRecordTypes.find((type) => type.viewId === viewId)?.label;
    })
    .filter(Boolean);
}

function renderWorkspaceModeButtons() {
  const activeTabLabels = workspaceModeTabLabels();
  const activeConfig = workspaceModes[workspaceMode] || workspaceModes.full;
  els.workspaceModeButtons?.forEach((button) => {
    const mode = button.dataset.workspaceMode;
    const config = workspaceModes[mode];
    const isActive = mode === workspaceMode;
    const tabLabels = workspaceModeTabLabels(mode);
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
    if (config?.buttonLabel) button.textContent = config.buttonLabel;
    button.title = config ? `${config.label}: ${tabLabels.join(", ")}` : "";
  });
  if (els.workspaceModeScope) {
    els.workspaceModeScope.textContent = `${activeConfig.scopeLabel} · ${activeTabLabels.join(", ")}`;
    els.workspaceModeScope.title = `${activeConfig.label}: ${activeTabLabels.join(", ")}`;
  }
}

function applyPublishingTemplateDefaultForMode(mode, previousMode = workspaceMode, force = false) {
  const nextDefault = workspaceModes[mode]?.templateDefault || "directMail";
  const previousDefault = workspaceModes[previousMode]?.templateDefault || "";
  if (force || !proposal.publishingTemplate || proposal.publishingTemplate === previousDefault) {
    applyProposalTemplatePreset(nextDefault);
    if (els.proposalPublishingTemplate && document.activeElement !== els.proposalPublishingTemplate) {
      els.proposalPublishingTemplate.value = nextDefault;
    }
  }
}

function setWorkspaceMode(mode, options = {}) {
  const previousMode = workspaceMode;
  workspaceMode = workspaceModes[mode] ? mode : "full";
  if (els.workspaceMode) els.workspaceMode.value = workspaceMode;
  document.body.dataset.workspaceMode = workspaceMode;
  renderWorkspaceModeButtons();
  applyPublishingTemplateDefaultForMode(workspaceMode, previousMode, options.forceTemplateDefault);
  const workspace = workspaceByNumber(currentWorkspaceNumber);
  if (workspace) {
    workspace.workspaceMode = workspaceMode;
    workspace.updatedAt = new Date().toISOString();
    saveWorkspaces();
  }
  const targetView = options.preferredView && isViewVisibleInMode(options.preferredView)
    ? options.preferredView
    : isViewVisibleInMode(activeView) ? activeView : defaultWorkspaceView();
  setActiveView(targetView);
}

function workspaceByNumber(workspaceNumber) {
  return workspaces.find((workspace) => workspace.workspaceNumber === workspaceNumber);
}

function workspaceByName(name) {
  const normalized = String(name || "").trim().toLowerCase();
  return workspaces.find((workspace) => String(workspace.workspaceName || "").trim().toLowerCase() === normalized);
}

function workspaceNameFallback() {
  return els.workspaceName?.value.trim()
    || els.projectName.value.trim()
    || [els.clientName.value.trim(), els.estimateYear.value].filter(Boolean).join(" ")
    || "Untitled Workspace";
}

function ensureWorkspace() {
  const existingByNumber = workspaceByNumber(currentWorkspaceNumber);
  const existingByName = workspaceByName(els.workspaceName?.value);
  const workspace = existingByNumber || existingByName || {
    workspaceNumber: currentWorkspaceNumber || nextWorkspaceNumber(),
    workspaceName: workspaceNameFallback(),
    clientName: els.clientName.value.trim(),
    status: "draft",
    workspaceMode,
    activeView,
    activeRecords: structuredClone(activeWorkspaceRecords),
    records: { estimates: [], proposals: [], services: [], sourcing: [], printQuotes: [], ecomm: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  workspace.workspaceName = workspaceNameFallback();
  workspace.clientName = els.clientName.value.trim();
  workspace.workspaceMode = workspaceMode;
  workspace.activeView = activeView;
  workspace.activeRecords = activeRecordsForWorkspaceSave(workspace);
  workspace.updatedAt = new Date().toISOString();
  workspace.records = {
    estimates: [],
    proposals: [],
    services: [],
    sourcing: [],
    printQuotes: [],
    ecomm: [],
    ...(workspace.records || {})
  };
  if (!workspaceByNumber(workspace.workspaceNumber)) workspaces.push(workspace);
  const standaloneLibraryActive = Object.fromEntries(
    Object.entries(activeWorkspaceRecords).filter(([collection, recordNumber]) => (
      recordNumber && isLibraryRecordCollection(collection) && !workspace.activeRecords?.[collection]
    ))
  );
  setWorkspaceNumber(workspace.workspaceNumber);
  Object.assign(activeWorkspaceRecords, standaloneLibraryActive);
  refreshRecordNumbers();
  return workspace;
}

function currentEstimateVersion() {
  return Math.max(Math.round(asNumber(els.estimateVersion?.value || 1)), 1);
}

function setEstimateRecordNumber(projectNumber) {
  const value = normalizeEstimateNumber(projectNumber);
  setRecordOutput(els.estimateRecordNumber, value, "E");
}

function saveWorkspaceEstimateRecord(projectNumber) {
  const workspace = ensureWorkspace();
  const version = currentEstimateVersion();
  const estimateNumber = normalizeEstimateNumber(projectNumber);
  const record = {
    projectNumber: estimateNumber,
    projectName: els.projectName.value.trim() || "Untitled Estimate",
    version,
    clientName: els.clientName.value.trim(),
    estimateYear: String(els.estimateYear.value || ""),
    sourceTabs: ["Estimate", "Sourcing", "Proposal"],
    savedAt: new Date().toISOString()
  };
  activeWorkspaceRecords.estimates = estimateNumber;
  workspace.activeRecords = { ...(workspace.activeRecords || {}), ...activeWorkspaceRecords };
  workspace.records.estimates = [
    ...workspace.records.estimates.filter((candidate) => !(normalizeEstimateNumber(candidate.projectNumber) === estimateNumber && candidate.version === version)),
    record
  ].sort((a, b) => projectNumberSortValue(a.projectNumber) - projectNumberSortValue(b.projectNumber) || asNumber(a.version) - asNumber(b.version));
  saveWorkspaces();
  renderWorkspaceDatalists();
  return workspace;
}

function workspaceForEstimate(projectNumber) {
  const estimateNumber = normalizeEstimateNumber(projectNumber);
  return workspaces.find((workspace) => (workspace.records?.estimates || []).some((estimate) => normalizeEstimateNumber(estimate.projectNumber) === estimateNumber));
}

function renderWorkspaceDatalists() {
  if (els.workspaceLookup) {
    els.workspaceLookup.innerHTML = workspaces.map((workspace) => (
      `<option value="${escapeHtml(workspace.workspaceName || workspace.workspaceNumber)}"></option>`
    )).join("");
  }
}

async function syncWorkspaceFromName() {
  const workspace = workspaceByName(els.workspaceName?.value);
  if (!workspace) return;
  if (!(await resolveDirtyRecordsBefore([], "Switching workspace"))) {
    const current = workspaceByNumber(currentWorkspaceNumber);
    if (els.workspaceName && current) els.workspaceName.value = current.workspaceName || "";
    return;
  }
  clearAllWorkspaceRecordDirty();
  setWorkspaceNumber(workspace.workspaceNumber);
  if (!els.clientName.value && workspace.clientName) els.clientName.value = workspace.clientName;
  renderWorkspaceDatalists();
  renderSourcing();
}

async function newWorkspace() {
  if (!(await resolveDirtyRecordsBefore([], "Starting a new workspace"))) return;
  startBlankEstimate();
  setWorkspaceMode("full", { preferredView: "proposalView" });
  setActiveView("proposalView");
  renderWorkspaceDatalists();
  render();
  setSaveStatus(`Workspace ${currentWorkspaceNumber} ready`);
}

async function saveWorkspaceRecordCollection(collection) {
  const type = recordTypeFor(collection);
  if (!type) return "";
  if (collection === "estimates") {
    const saved = await saveCurrentEstimate();
    return saved ? currentEstimateNumber() : "";
  }
  if (isLibraryRecordCollection(collection)) {
    const record = upsertLibraryRecord(collection);
    return record?.[type.numberKey] || "";
  }
  const record = upsertWorkspaceRecord(collection);
  return record?.[type.numberKey] || "";
}

async function saveCurrentWorkspaceOnly() {
  const workspace = ensureWorkspace();
  const dirtyCollections = workspaceRecordTypes
    .map((type) => type.collection)
    .filter((collection) => dirtyWorkspaceRecords.has(collection));
  const activeType = recordTypeForView(activeView);
  const collectionsToSave = dirtyCollections.length
    ? dirtyCollections
    : activeType ? [activeType.collection] : [];
  const savedRecordNumbers = [];

  for (const collection of collectionsToSave) {
    const savedRecordNumber = await saveWorkspaceRecordCollection(collection);
    if (!savedRecordNumber && collection === "estimates") return;
    if (savedRecordNumber) savedRecordNumbers.push(savedRecordNumber);
  }

  if (!collectionsToSave.length) saveWorkspaces();
  render();
  const changedLabel = dirtyCollections.length
    ? `${savedRecordNumbers.length} changed record${savedRecordNumbers.length === 1 ? "" : "s"}`
    : savedRecordNumbers[0] || "";
  setSaveStatus(changedLabel ? `Saved ${workspace.workspaceNumber} / ${changedLabel}` : `Saved ${workspace.workspaceNumber}`);
}

async function duplicateCurrentWorkspace() {
  const source = ensureWorkspace();
  const hadUnsavedChanges = dirtyWorkspaceRecords.size > 0;
  if (!(await resolveDirtyRecordsBefore([], "Duplicating this workspace"))) return;
  const unsavedChangesRemain = dirtyWorkspaceRecords.size > 0;
  const workspaceNumber = nextWorkspaceNumber();
  const copy = structuredClone(source);
  copy.workspaceNumber = workspaceNumber;
  copy.workspaceName = `${source.workspaceName || "Untitled Workspace"} Copy`;
  copy.workspaceMode = workspaceMode;
  copy.activeView = activeView;
  copy.status = "draft";
  copy.createdAt = new Date().toISOString();
  copy.updatedAt = copy.createdAt;
  workspaces.push(copy);
  saveWorkspaces();
  setWorkspaceNumber(workspaceNumber);
  if (els.workspaceName) els.workspaceName.value = copy.workspaceName;
  setWorkspaceMode(copy.workspaceMode || "full", { preferredView: copy.activeView });
  renderWorkspaceDatalists();
  render();
  setSaveStatus(
    hadUnsavedChanges && unsavedChangesRemain
      ? `Duplicated as ${workspaceNumber}; unsaved changes remain on this copy`
      : `Duplicated as ${workspaceNumber}`
  );
}

function workspaceRecordCount(workspace) {
  return workspaceRecordTypes.reduce((sum, type) => {
    if (isLibraryRecordCollection(type.collection)) return sum + (workspace.activeRecords?.[type.collection] ? 1 : 0);
    return sum + (workspace.records?.[type.collection] || []).length;
  }, 0);
}

function workspaceSearchText(workspace) {
  const recordText = workspaceRecordTypes.flatMap((type) => (
    (workspace.records?.[type.collection] || []).flatMap((record) => [
      record[type.numberKey],
      record.name,
      record.linkedEstimateNumber
    ])
  ));
  return [
    workspace.workspaceNumber,
    workspace.workspaceName,
    workspace.clientName,
    workspace.workspaceMode,
    ...Object.values(workspace.activeRecords || {}),
    ...recordText
  ].map((value) => String(value || "").toLowerCase()).join(" ");
}

function activeWorkspaceRecordLabels(workspace) {
  return workspaceRecordTypes
    .map((type) => workspace.activeRecords?.[type.collection])
    .filter(Boolean)
    .join(" · ");
}

function workspaceActiveTabLabel(workspace) {
  return workspaceRecordTypes.find((type) => type.viewId === workspace.activeView)?.label || "Proposal";
}

function workspaceRecordChips(workspace) {
  return workspaceRecordTypes
    .map((type) => {
      const count = isLibraryRecordCollection(type.collection)
        ? workspace.activeRecords?.[type.collection] ? 1 : 0
        : (workspace.records?.[type.collection] || []).length;
      if (!count) return "";
      return `<span class="workspace-record-chip">${escapeHtml(type.label)} ${count}</span>`;
    })
    .filter(Boolean)
    .join("");
}

function renderLoadWorkspaceList() {
  if (!els.loadWorkspaceList) return;
  const query = els.loadWorkspaceSearch.value.trim().toLowerCase();
  const filtered = [...workspaces]
    .filter((workspace) => !query || workspaceSearchText(workspace).includes(query))
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
  els.loadWorkspaceList.innerHTML = "";

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "load-estimate-empty";
    empty.textContent = query ? "No saved workspaces match that search." : "No saved workspaces yet.";
    els.loadWorkspaceList.append(empty);
    return;
  }

  filtered.forEach((workspace) => {
    const row = document.createElement("div");
    row.className = "load-estimate-row load-workspace-row";
    const savedDate = workspace.updatedAt ? new Date(workspace.updatedAt).toLocaleDateString() : "";
    const recordCount = workspaceRecordCount(workspace);
    row.innerHTML = `
      <span class="load-project-number">${escapeHtml(workspace.workspaceNumber || "")}</span>
      <span class="load-project-main">
        <strong>${escapeHtml(workspace.workspaceName || "Untitled Workspace")}</strong>
        <small>${escapeHtml([workspace.clientName, workspaceModes[workspace.workspaceMode]?.label || "Full Workspace", `${recordCount} saved record${recordCount === 1 ? "" : "s"}`, `Opens to ${workspaceActiveTabLabel(workspace)}`, savedDate && `Saved ${savedDate}`].filter(Boolean).join(" · "))}</small>
        <span class="workspace-record-chips">${workspaceRecordChips(workspace) || `<span class="workspace-record-chip muted">No saved records</span>`}</span>
      </span>
      <button class="ghost-btn compact-btn" type="button">Load</button>
    `;
    row.querySelector("button").addEventListener("click", () => loadWorkspace(workspace.workspaceNumber));
    els.loadWorkspaceList.append(row);
  });
}

function openLoadWorkspaceDialog() {
  if (!workspaces.length) {
    setSaveStatus("No saved workspaces");
    return;
  }
  els.loadWorkspaceModal.hidden = false;
  els.loadWorkspaceSearch.value = "";
  renderLoadWorkspaceList();
  els.loadWorkspaceSearch.focus();
}

function closeLoadWorkspaceDialog() {
  els.loadWorkspaceModal.hidden = true;
}

function libraryRecordPrimaryDetail(collection, snapshot) {
  if (collection === "printQuotes") return snapshot?.printQuote?.source || "Print source pending";
  if (collection === "ecomm") return snapshot?.ecommPriceList?.channel || "Channel pending";
  return "";
}

function libraryRecordSecondaryDetail(collection, snapshot) {
  if (collection === "printQuotes") return snapshot?.printQuote?.notes || "";
  if (collection === "ecomm") return snapshot?.ecommPriceList?.notes || "";
  return "";
}

function libraryRecordSearchText(record, type) {
  return [
    record[type.numberKey],
    record.attachedToWorkspace,
    ...(record.attachedWorkspaces || [])
  ].map((value) => String(value || "").toLowerCase()).join(" ");
}

function renderLibraryRecordList() {
  if (!els.libraryRecordList || !libraryPickerCollection) return;
  const type = recordTypeFor(libraryPickerCollection);
  const libraryUi = libraryUiFor(libraryPickerCollection);
  if (!type || !libraryUi) return;
  const query = els.libraryRecordSearch?.value.trim().toLowerCase() || "";
  const allRecords = [...libraryRecordsFor(libraryPickerCollection)]
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
  const attachedCount = allRecords.filter((record) => libraryRecordAttachedToWorkspace(record, currentWorkspaceNumber)).length;
  const standaloneCount = allRecords.filter((record) => !libraryRecordAttachmentList(record).length).length;
  const scopeCounts = {
    all: allRecords.length,
    attached: attachedCount,
    standalone: standaloneCount
  };
  const scopeLabels = {
    all: "All",
    attached: "Workspace",
    standalone: "Standalone"
  };
  const scopedRecords = allRecords.filter((record) => {
    if (libraryPickerScope === "attached") return libraryRecordAttachedToWorkspace(record, currentWorkspaceNumber);
    if (libraryPickerScope === "standalone") return !libraryRecordAttachmentList(record).length;
    return true;
  });
  const records = scopedRecords.filter((record) => !query || libraryRecordSearchText(record, type).includes(query));
  const shown = records.slice(0, 100);
  const hiddenCount = Math.max(records.length - shown.length, 0);
  els.libraryRecordList.innerHTML = "";

  if (els.libraryRecordTitle) {
    els.libraryRecordTitle.textContent = `Open ${type.label} Library`;
  }
  const activeScopeLabel = scopeLabels[libraryPickerScope] || scopeLabels.all;
  els.libraryRecordScopeButtons?.forEach((button) => {
    const scope = button.dataset.libraryScope || "all";
    const isActive = scope === libraryPickerScope;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
    button.textContent = `${scopeLabels[scope] || scopeLabels.all} ${(scopeCounts[scope] || 0).toLocaleString()}`;
  });
  if (els.libraryRecordSummary) {
    const totalText = `${allRecords.length.toLocaleString()} saved ${type.label.toLowerCase()} records`;
    if (libraryPickerScope === "attached") {
      els.libraryRecordSummary.textContent = query
        ? `Showing ${records.length.toLocaleString()} workspace matches from ${totalText}`
        : `Showing ${records.length.toLocaleString()} records attached to ${currentWorkspaceNumber || "this workspace"} from ${totalText}`;
    } else if (libraryPickerScope === "standalone") {
      els.libraryRecordSummary.textContent = query
        ? `Showing ${records.length.toLocaleString()} standalone matches from ${totalText}`
        : `Showing ${records.length.toLocaleString()} standalone records from ${totalText}`;
    } else {
      els.libraryRecordSummary.textContent = query
        ? `Showing ${records.length.toLocaleString()} matches from ${totalText}`
        : `Showing ${records.length.toLocaleString()} of ${totalText}`;
    }
  }

  if (!records.length) {
    const empty = document.createElement("div");
    empty.className = "load-estimate-empty";
    if (query) {
      empty.textContent = `No ${activeScopeLabel.toLowerCase()} records match that search.`;
    } else if (libraryPickerScope === "attached") {
      empty.textContent = `No ${type.label.toLowerCase()} records are attached to ${currentWorkspaceNumber || "this workspace"} yet.`;
    } else if (libraryPickerScope === "standalone") {
      empty.textContent = `No standalone ${type.label.toLowerCase()} records are available.`;
    } else {
      empty.textContent = `No saved ${type.label} library records yet.`;
    }
    els.libraryRecordList.append(empty);
    return;
  }

  shown.forEach((record) => {
    const row = document.createElement("div");
    const recordNumber = record[type.numberKey];
    const attachedWorkspaces = libraryRecordAttachmentList(record);
    const isCurrent = recordNumber === activeRecordNumber(libraryPickerCollection);
    const workspaceValue = attachedWorkspaces.length ? attachedWorkspaces.join(", ") : "Standalone";
    row.className = `load-estimate-row library-record-row${isCurrent ? " active-library-row" : ""}`;
    row.innerHTML = `
      <span class="load-project-number">${escapeHtml(recordNumber)}</span>
      <span class="load-project-main">
        <strong>${escapeHtml(workspaceValue)}</strong>
      </span>
      <button class="ghost-btn compact-btn" type="button">${isCurrent ? "Current" : "Open"}</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      const collection = libraryPickerCollection;
      closeLibraryRecordDialog();
      loadWorkspaceRecord(collection, recordNumber);
    });
    els.libraryRecordList.append(row);
  });

  if (hiddenCount) {
    const more = document.createElement("div");
    more.className = "load-estimate-empty library-record-more";
    more.textContent = `Showing first 100 of ${records.length.toLocaleString()} matches. Keep typing to narrow the library.`;
    els.libraryRecordList.append(more);
  }
}

function openLibraryRecordDialog(collection) {
  const type = recordTypeFor(collection);
  if (!type || !isLibraryRecordCollection(collection)) return;
  libraryPickerCollection = collection;
  libraryPickerScope = "all";
  if (els.libraryRecordModal) {
    els.libraryRecordModal.hidden = false;
    els.libraryRecordModal.dataset.libraryCollection = collection;
  }
  if (els.libraryRecordSearch) {
    els.libraryRecordSearch.value = "";
    els.libraryRecordSearch.placeholder = `${type.prefix} or workspace number`;
  }
  renderLibraryRecordList();
  els.libraryRecordSearch?.focus();
}

function closeLibraryRecordDialog() {
  if (els.libraryRecordModal) {
    els.libraryRecordModal.hidden = true;
    els.libraryRecordModal.dataset.libraryCollection = "";
  }
  libraryPickerCollection = "";
  libraryPickerScope = "all";
}

async function loadWorkspace(workspaceNumber) {
  const workspace = workspaceByNumber(workspaceNumber);
  if (!workspace) {
    setSaveStatus("Workspace not found");
    return;
  }
  if (!(await resolveDirtyRecordsBefore([], "Opening another workspace"))) return;
  clearAllWorkspaceRecordDirty();
  setWorkspaceNumber(workspace.workspaceNumber);
  if (els.workspaceName) els.workspaceName.value = workspace.workspaceName || "";
  setWorkspaceMode(workspace.workspaceMode || "full", { preferredView: workspace.activeView });
  if (workspace.clientName && !els.clientName.value) els.clientName.value = workspace.clientName;
  closeLoadWorkspaceDialog();
  const targetView = isViewVisibleInMode(workspace.activeView) ? workspace.activeView : defaultWorkspaceView();
  const estimateNumber = workspace.activeRecords?.estimates
    || (workspace.records?.estimates || [])
      .slice()
      .sort((a, b) => asNumber(b.savedAt ? new Date(b.savedAt).getTime() : 0) - asNumber(a.savedAt ? new Date(a.savedAt).getTime() : 0))[0]?.projectNumber;
  if (estimateNumber) {
    await fetchEstimatesList();
    const summary = estimatesList.find((estimate) => normalizeEstimateNumber(estimate.projectNumber) === normalizeEstimateNumber(estimateNumber))
      || { projectNumber: estimateNumber };
    await loadEstimate(summary, { skipDirtyCheck: true });
  }
  workspaceRecordTypes
    .filter((type) => type.collection !== "estimates")
    .forEach((type) => {
      const activeNumber = workspace.activeRecords?.[type.collection];
      const records = isLibraryRecordCollection(type.collection) ? libraryRecordsFor(type.collection) : workspace.records?.[type.collection] || [];
      const record = records.find((candidate) => candidate[type.numberKey] === activeNumber);
      if (!record) return;
      if (isLibraryRecordCollection(type.collection)) applyLibraryRecord(type.collection, record, null, { activate: false, render: false });
      else applyWorkspaceRecord(type.collection, record, null, { activate: false, render: false });
    });
  setActiveView(targetView);
  render();
  setSaveStatus(`Loaded ${workspace.workspaceNumber}`);
}

function workspaceRecordDisplayName(type) {
  if (type.collection === "proposals") return proposal.title || "Untitled Proposal";
  if (type.collection === "estimates") return els.projectName.value.trim() || "Untitled Estimate";
  if (type.collection === "services") return serviceScenarioNames[serviceScenario] || "Service Calculation";
  if (type.collection === "sourcing") return `Sourcing for ${currentEstimateNumber() || "draft estimate"}`;
  if (type.collection === "printQuotes") {
    syncPlaceholderDraftsFromInputs();
    return printQuote.name || "Print Quote Draft";
  }
  if (type.collection === "ecomm") {
    syncPlaceholderDraftsFromInputs();
    return ecommPriceList.name || "Ecomm Price List Draft";
  }
  return "Untitled Record";
}

function syncPlaceholderDraftsFromInputs() {
  if (els.printQuoteName) printQuote.name = els.printQuoteName.value.trim() || "Print Quote Draft";
  if (els.printQuoteSource) printQuote.source = els.printQuoteSource.value.trim();
  if (els.printQuoteExternalRef) printQuote.externalRef = els.printQuoteExternalRef.value.trim();
  if (els.printQuoteSourceUrl) printQuote.sourceUrl = els.printQuoteSourceUrl.value.trim();
  if (els.printQuoteNotes) printQuote.notes = els.printQuoteNotes.value;
  if (els.printQuoteValidUntil) printQuote.validUntil = els.printQuoteValidUntil.value || defaultPrintQuoteValidUntil();
  if (els.printQuoteCustomerName) printQuote.customerName = els.printQuoteCustomerName.value.trim();
  if (els.printQuoteCustomerCompany) printQuote.customerCompany = els.printQuoteCustomerCompany.value.trim();
  if (els.printQuoteShipMethod) printQuote.shipMethod = els.printQuoteShipMethod.value.trim();
  if (els.printQuoteShippingAmount) printQuote.shippingAmount = asNumber(els.printQuoteShippingAmount.value);
  if (els.printQuoteCustomerNote) printQuote.customerNote = els.printQuoteCustomerNote.value.trim();
  if (els.printQuoteCustomerTerms) printQuote.customerTerms = els.printQuoteCustomerTerms.value.trim();
  if (els.printQuoteInternalNotes) printQuote.internalNotes = els.printQuoteInternalNotes.value.trim();
  if (els.ecommListName) ecommPriceList.name = els.ecommListName.value.trim() || "Ecomm Price List Draft";
  if (els.ecommChannel) ecommPriceList.channel = els.ecommChannel.value.trim();
  if (els.ecommExternalRef) ecommPriceList.externalRef = els.ecommExternalRef.value.trim();
  if (els.ecommSourceUrl) ecommPriceList.sourceUrl = els.ecommSourceUrl.value.trim();
  if (els.ecommNotes) ecommPriceList.notes = els.ecommNotes.value;
}

function renderPlaceholderDrafts() {
  if (els.printQuoteName) els.printQuoteName.value = printQuote.name || "";
  if (els.printQuoteSource) els.printQuoteSource.value = printQuote.source || "";
  if (els.printQuoteExternalRef) els.printQuoteExternalRef.value = printQuote.externalRef || "";
  if (els.printQuoteSourceUrl) els.printQuoteSourceUrl.value = printQuote.sourceUrl || "";
  if (els.printQuoteNotes) els.printQuoteNotes.value = printQuote.notes || "";
  if (els.printQuoteValidUntil) els.printQuoteValidUntil.value = printQuote.validUntil || defaultPrintQuoteValidUntil();
  if (els.printQuoteCustomerName) els.printQuoteCustomerName.value = printQuote.customerName || "";
  if (els.printQuoteCustomerCompany) els.printQuoteCustomerCompany.value = printQuote.customerCompany || "";
  if (els.printQuoteShipMethod) els.printQuoteShipMethod.value = printQuote.shipMethod || "";
  if (els.printQuoteShippingAmount) els.printQuoteShippingAmount.value = printQuote.shippingAmount || "";
  if (els.printQuoteCustomerNote) els.printQuoteCustomerNote.value = printQuote.customerNote || "";
  if (els.printQuoteCustomerTerms) els.printQuoteCustomerTerms.value = printQuote.customerTerms || "";
  if (els.printQuoteInternalNotes) els.printQuoteInternalNotes.value = printQuote.internalNotes || "";
  if (els.ecommListName) els.ecommListName.value = ecommPriceList.name || "";
  if (els.ecommChannel) els.ecommChannel.value = ecommPriceList.channel || "";
  if (els.ecommExternalRef) els.ecommExternalRef.value = ecommPriceList.externalRef || "";
  if (els.ecommSourceUrl) els.ecommSourceUrl.value = ecommPriceList.sourceUrl || "";
  if (els.ecommNotes) els.ecommNotes.value = ecommPriceList.notes || "";
}

function placeholderAttachmentSummary(collection) {
  const type = recordTypeFor(collection);
  if (!type) return "Standalone";
  const activeNumber = activeRecordNumber(collection);
  const record = libraryRecordsFor(collection).find((candidate) => candidate[type.numberKey] === activeNumber);
  if (!record) return "Unsaved draft";
  const attachments = libraryRecordAttachmentList(record);
  if (!attachments.length) return "Standalone";
  if (libraryRecordAttachedToWorkspace(record, currentWorkspaceNumber)) return `Attached to ${currentWorkspaceNumber}`;
  return `Attached to ${attachments.join(", ")}`;
}

function placeholderSourceSummary(draft) {
  return [draft.externalRef && `Ref ${draft.externalRef}`, draft.sourceUrl && "URL linked"].filter(Boolean).join(" / ") || "Not linked";
}

function renderPlaceholderSummaries() {
  syncPlaceholderDraftsFromInputs();
  if (els.printQuoteAttachmentStatus) els.printQuoteAttachmentStatus.textContent = placeholderAttachmentSummary("printQuotes");
  if (els.printQuoteSourceSummary) els.printQuoteSourceSummary.textContent = placeholderSourceSummary(printQuote);
  if (els.ecommAttachmentStatus) els.ecommAttachmentStatus.textContent = placeholderAttachmentSummary("ecomm");
  if (els.ecommSourceSummary) els.ecommSourceSummary.textContent = placeholderSourceSummary(ecommPriceList);
}

function printQuoteCustomerLabel() {
  return [printQuote.customerName, printQuote.customerCompany || els.clientName.value.trim()]
    .filter(Boolean)
    .join(" / ") || "Customer pending";
}

function printQuoteLineRows() {
  return Array.isArray(printQuote.lineItems) ? printQuote.lineItems : [];
}

function printQuoteSubtotal() {
  return printQuoteLineRows().reduce((sum, line) => sum + asNumber(line.customerTotal), 0);
}

function nextPrintQuoteLineId() {
  return `quote-line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function addPrintQuoteLine() {
  printQuote.lineItems = [
    ...printQuoteLineRows(),
    {
      id: nextPrintQuoteLineId(),
      name: "New print quote line",
      description: "",
      quantity: 1,
      customerTotal: 0,
      sourceLabel: "Manual quote line"
    }
  ];
  printQuote.outputMode = "builder";
  touchWorkspaceRecord("printQuotes");
  renderPrintQuoteDraft();
  renderTabRecordControls();
  setSaveStatus("Quote line added");
}

function updatePrintQuoteLine(lineId, field, value) {
  const numericFields = new Set(["quantity", "customerTotal"]);
  printQuote.lineItems = printQuoteLineRows().map((line) => {
    if (line.id !== lineId) return line;
    return {
      ...line,
      [field]: numericFields.has(field) ? Math.max(asNumber(value), 0) : String(value || "")
    };
  });
  touchWorkspaceRecord("printQuotes");
  renderPrintQuoteDraft();
  renderTabRecordControls();
  renderProposalPreview();
}

function removePrintQuoteLine(lineId) {
  printQuote.lineItems = printQuoteLineRows().filter((line) => line.id !== lineId);
  touchWorkspaceRecord("printQuotes");
  renderPrintQuoteDraft();
  renderTabRecordControls();
  renderProposalPreview();
  setSaveStatus("Quote line removed");
}

function refreshPrintQuoteLinesFromEstimate() {
  printQuote.lineItems = visiblePackageRows()
    .map((row) => {
      const calc = calculate(row);
      const quantity = Math.max(Math.round(calc.qty || calc.qtyToOrder || 1), 1);
      return {
        id: row.id,
        name: row.packageName || rowName(row) || "Package",
        description: `${row.packageName || "Package"} estimate total`,
        quantity,
        customerTotal: calc.clientPrice,
        sourceLabel: "Visible active package total"
      };
    })
    .filter((line) => line.customerTotal > 0);
  touchWorkspaceRecord("printQuotes");
  renderPrintQuoteDraft();
  renderTabRecordControls();
  setSaveStatus("Print quote draft refreshed");
}

function renderPrintQuoteLines(isCustomerOutput) {
  const lines = printQuoteLineRows();
  if (!lines.length) {
    return `<div class="print-quote-empty">No draft quote lines yet. Add a quote line or refresh lines from the active estimate.</div>`;
  }

  const header = isCustomerOutput
    ? ["Item", "Description", "Qty", "Total"]
    : ["Item", "Description", "Qty", "Customer total", ""];

  return `
    <div class="print-quote-line header${isCustomerOutput ? "" : " builder-line"}">
      ${header.map((label) => `<span>${label}</span>`).join("")}
    </div>
    ${lines.map((line) => isCustomerOutput ? `
      <div class="print-quote-line">
        <strong>${escapeHtml(line.name)}</strong>
        <span>${escapeHtml(line.description)}</span>
        <span>${Math.round(asNumber(line.quantity)).toLocaleString()}</span>
        <span>${money(line.customerTotal, 2)}</span>
      </div>
    ` : `
      <div class="print-quote-line builder-line" data-print-quote-line-id="${escapeHtml(line.id)}">
        <label>
          Item
          <input class="print-quote-line-input" type="text" data-print-quote-line-field="name" value="${escapeHtml(line.name)}" />
        </label>
        <label>
          Description
          <input class="print-quote-line-input" type="text" data-print-quote-line-field="description" value="${escapeHtml(line.description)}" />
        </label>
        <label>
          Qty
          <input class="print-quote-line-input" type="number" min="0" step="1" data-print-quote-line-field="quantity" value="${escapeHtml(line.quantity)}" />
        </label>
        <label>
          Customer total
          <input class="print-quote-line-input" type="number" min="0" step="0.01" data-print-quote-line-field="customerTotal" value="${escapeHtml(line.customerTotal)}" />
        </label>
        <button class="ghost-btn compact-btn" type="button" data-print-quote-line-remove>Remove</button>
      </div>
    `).join("")}
  `;
}

function renderPrintQuoteTotals() {
  const subtotal = printQuoteSubtotal();
  const shipping = Math.max(asNumber(printQuote.shippingAmount), 0);
  const shippingLabel = printQuote.shipMethod ? `Shipping (${escapeHtml(printQuote.shipMethod)})` : "Shipping";
  return `
    <div><span>Subtotal</span><strong>${money(subtotal, 2)}</strong></div>
    <div><span>${shippingLabel}</span><strong>${money(shipping, 2)}</strong></div>
    <div class="grand-total"><span>Draft total</span><strong>${money(subtotal + shipping, 2)}</strong></div>
  `;
}

function renderPrintQuoteMessage(isCustomerOutput) {
  if (!els.printQuoteMessage) return;
  const blocks = isCustomerOutput
    ? [
        ["Message", printQuote.customerNote],
        ["Terms", printQuote.customerTerms]
      ].filter(([, value]) => value)
    : [
        ["Internal notes", printQuote.internalNotes || "No internal notes."],
        ["Boundary", "Internal notes, source/vendor, cost, markup, margin, and pricing-basis details are intentionally excluded from customer preview."]
      ];
  els.printQuoteMessage.hidden = !blocks.length;
  els.printQuoteMessage.innerHTML = blocks.map(([title, value]) => `
    <div>
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(value)}</p>
    </div>
  `).join("");
}

function renderPrintQuoteDraft() {
  if (!els.printQuoteView || !els.printQuoteLines) return;
  syncPlaceholderDraftsFromInputs();
  const isCustomerOutput = printQuote.outputMode === "customer";
  els.printQuoteView.dataset.outputMode = printQuote.outputMode;
  els.printQuoteOutputTitle.textContent = isCustomerOutput ? "Customer Preview" : "Quote Builder";
  els.printQuoteOutputSubtitle.textContent = isCustomerOutput
    ? "Customer-safe draft view. Manual QA required before sending."
    : "Internal draft built from customer-safe estimate totals.";
  els.printQuoteOutputModeButtons.forEach((button) => {
    const isActive = button.dataset.printQuoteMode === printQuote.outputMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  els.printQuotePreparedFor.textContent = printQuoteCustomerLabel();
  els.printQuotePreviewName.textContent = printQuote.name || "Print Quote Draft";
  els.printQuotePreviewStatus.textContent = isCustomerOutput ? "Customer draft / QA gated" : "Internal draft";
  els.printQuoteLines.innerHTML = renderPrintQuoteLines(isCustomerOutput);
  els.printQuoteTotals.innerHTML = renderPrintQuoteTotals();
  renderPrintQuoteMessage(isCustomerOutput);
}

function workspaceRecordSnapshot(type) {
  if (type.collection === "proposals") {
    const publishManifest = proposalPublishingManifest({ savedCollections: ["proposals"] });
    return {
      proposal: proposalSnapshotWithSources(publishManifest, { persist: true }),
      publishManifest
    };
  }
  if (type.collection === "services") {
    return {
      serviceScenario,
      serviceRows: structuredClone(serviceRows),
      serviceExpanded: Array.from(serviceExpanded)
    };
  }
  if (type.collection === "sourcing") return { sourcing: sourcingDataSnapshot() };
  if (type.collection === "printQuotes") {
    syncPlaceholderDraftsFromInputs();
    return { printQuote: structuredClone(printQuote) };
  }
  if (type.collection === "ecomm") {
    syncPlaceholderDraftsFromInputs();
    return { ecommPriceList: structuredClone(ecommPriceList) };
  }
  return {};
}

function upsertWorkspaceRecord(collection, options = {}) {
  const type = recordTypeFor(collection);
  if (!type) return null;
  const workspace = ensureWorkspace();
  const records = workspace.records[collection] || [];
  const currentNumber = activeRecordNumber(collection) || nextWorkspaceRecordNumber(collection, type.prefix, type.numberKey, type.start);
  const recordNumber = options.duplicate
    ? nextPrefixedNumber(records.map((record) => record[type.numberKey]), type.prefix, type.start)
    : currentNumber;
  const existing = records.find((record) => record[type.numberKey] === recordNumber);
  const existingVersions = Array.isArray(existing?.versions) ? existing.versions : [];
  const nextVersion = options.newVersion
    ? Math.max(existing?.version || 1, ...existingVersions.map((version) => asNumber(version.version))) + 1
    : options.version || existing?.version || 1;
  const snapshot = workspaceRecordSnapshot(type);
  const savedAt = new Date().toISOString();
  const versionRecord = {
    version: nextVersion,
    name: options.name || workspaceRecordDisplayName(type),
    snapshot,
    updatedAt: savedAt
  };
  const record = {
    ...(existing || {}),
    [type.numberKey]: recordNumber,
    name: versionRecord.name,
    version: nextVersion,
    linkedEstimateNumber: currentEstimateNumber(),
    status: "draft",
    viewId: type.viewId,
    updatedAt: savedAt,
    snapshot,
    versions: [
      ...existingVersions.filter((version) => asNumber(version.version) !== nextVersion),
      versionRecord
    ].sort((a, b) => asNumber(a.version) - asNumber(b.version))
  };
  workspace.records[collection] = [
    ...records.filter((candidate) => candidate[type.numberKey] !== recordNumber),
    record
  ].sort((a, b) => prefixedNumberSortValue(a[type.numberKey], type.prefix) - prefixedNumberSortValue(b[type.numberKey], type.prefix));
  activeWorkspaceRecords[collection] = recordNumber;
  workspace.activeRecords = { ...(workspace.activeRecords || {}), ...activeWorkspaceRecords };
  saveWorkspaces();
  clearWorkspaceRecordDirty(collection);
  refreshRecordNumbers();
  renderTabRecordControls();
  renderTabRecordIndicators();
  return record;
}

function upsertLibraryRecord(collection, options = {}) {
  const type = recordTypeFor(collection);
  if (!type || !isLibraryRecordCollection(collection)) return null;
  const records = libraryRecordsFor(collection);
  const currentNumber = activeRecordNumber(collection) || nextLibraryRecordNumber(collection);
  const recordNumber = options.duplicate
    ? nextPrefixedNumber(records.map((record) => record[type.numberKey]), type.prefix, type.start)
    : currentNumber;
  const existing = records.find((record) => record[type.numberKey] === recordNumber);
  const existingVersions = Array.isArray(existing?.versions) ? existing.versions : [];
  const nextVersion = options.newVersion
    ? Math.max(existing?.version || 1, ...existingVersions.map((version) => asNumber(version.version))) + 1
    : options.version || existing?.version || 1;
  const snapshot = workspaceRecordSnapshot(type);
  const savedAt = new Date().toISOString();
  const versionRecord = {
    version: nextVersion,
    name: options.name || workspaceRecordDisplayName(type),
    snapshot,
    updatedAt: savedAt
  };
  const attachedWorkspaces = options.duplicate ? [] : libraryRecordAttachmentList(existing);
  const record = {
    ...(existing || {}),
    [type.numberKey]: recordNumber,
    name: versionRecord.name,
    version: nextVersion,
    linkedEstimateNumber: currentEstimateNumber(),
    status: attachedWorkspaces.length ? "attached" : "standalone",
    attachedWorkspaces,
    attachedToWorkspace: attachedWorkspaces[0] || "",
    viewId: type.viewId,
    updatedAt: savedAt,
    snapshot,
    versions: [
      ...existingVersions.filter((version) => asNumber(version.version) !== nextVersion),
      versionRecord
    ].sort((a, b) => asNumber(a.version) - asNumber(b.version))
  };
  setLibraryRecordsFor(collection, [
    ...records.filter((candidate) => candidate[type.numberKey] !== recordNumber),
    record
  ].sort((a, b) => prefixedNumberSortValue(a[type.numberKey], type.prefix) - prefixedNumberSortValue(b[type.numberKey], type.prefix)));
  activeWorkspaceRecords[collection] = recordNumber;
  clearWorkspaceRecordDirty(collection);
  refreshRecordNumbers();
  renderTabRecordControls();
  renderTabRecordIndicators();
  return record;
}

async function newWorkspaceRecord(collection) {
  const type = recordTypeFor(collection);
  if (!type) return;
  const impactedCollections = collection === "estimates" ? estimateLoadDirtyCollections() : [collection];
  if (!(await resolveDirtyRecordsBefore(impactedCollections, `Starting a new ${type.label}`))) return;
  if (collection === "estimates") {
    rows = [];
    lookups = structuredClone(seedLookups);
    expanded = new Set();
    activePackage = "All";
    activeTypes = new Set(Object.keys(typeLabels));
    els.projectName.value = "";
    els.clientName.value = "";
    els.estimateYear.value = "";
    els.searchInput.value = "";
    els.includeInactive.checked = false;
    els.globalMarkup.value = "0.40";
    els.tariffRate.value = "0.30";
    paymentDates = {};
    paymentSettings = defaultPaymentSettings();
    proposal = defaultProposal();
    sourcing = { quotes: {}, selected: {} };
    resetSourcingUiState();
    clearWorkspaceRecordDirty("estimates");
    clearWorkspaceRecordDirty("proposals");
    clearWorkspaceRecordDirty("sourcing");
    if (els.estimateVersion) els.estimateVersion.value = "1";
    setProjectNumber(nextProjectNumber());
    els.estimateViewMode.value = "detail";
    setActiveView("estimateView");
    setSaveStatus(`New estimate ${currentEstimateNumber()} ready`);
    render();
    return;
  }
  activeWorkspaceRecords[collection] = isLibraryRecordCollection(collection)
    ? nextLibraryRecordNumber(collection)
    : nextWorkspaceRecordNumber(collection, type.prefix, type.numberKey, type.start);
  if (collection === "proposals") proposal = defaultProposal();
  if (collection === "services") {
    serviceScenario = "salesmachine";
    serviceRows = structuredClone(serviceSeedRows);
    serviceExpanded = new Set(serviceSeedRows.filter((row) => row.level === "product").map((row) => row.id));
  }
  if (collection === "sourcing") {
    sourcing = { quotes: {}, selected: {} };
    resetSourcingUiState();
  }
  if (collection === "printQuotes") printQuote = defaultPrintQuote();
  if (collection === "ecomm") ecommPriceList = defaultEcommPriceList();
  setActiveView(type.viewId);
  clearWorkspaceRecordDirty(collection);
  render();
  setSaveStatus(`New ${type.label} ${activeWorkspaceRecords[collection]} ready`);
}

function workspaceRecordVersion(record, versionNumber) {
  const versions = Array.isArray(record?.versions) ? record.versions : [];
  if (!versions.length) return null;
  const requested = asNumber(versionNumber || record.version);
  return versions.find((version) => asNumber(version.version) === requested) || versions.at(-1);
}

function applyWorkspaceRecord(collection, record, versionNumber = null, options = {}) {
  const type = recordTypeFor(collection);
  if (!type || !record) return;
  const shouldActivate = options.activate !== false;
  const shouldRender = options.render !== false;
  const selectedVersion = workspaceRecordVersion(record, versionNumber);
  const snapshot = selectedVersion?.snapshot || record.snapshot || {};
  if (collection === "proposals" && snapshot.proposal) {
    proposal = normalizeProposalRecord(snapshot.proposal);
    restoreProposalSourceReferences(proposal.sourceRecords || snapshot.publishManifest?.sources || {}, { skipCollections: ["proposals"] });
  }
  if (collection === "services" && snapshot.serviceRows) {
    serviceScenario = snapshot.serviceScenario || "salesmachine";
    serviceRows = structuredClone(snapshot.serviceRows);
    serviceExpanded = new Set(snapshot.serviceExpanded || serviceRows.filter((row) => row.level === "product").map((row) => row.id));
  }
  if (collection === "sourcing" && snapshot.sourcing) {
    sourcing = normalizeSourcing(structuredClone(snapshot.sourcing));
    applySourcingUiSnapshot(snapshot.sourcing.ui || defaultSourcingUi());
  }
  if (collection === "printQuotes" && snapshot.printQuote) printQuote = { ...defaultPrintQuote(), ...structuredClone(snapshot.printQuote) };
  if (collection === "ecomm" && snapshot.ecommPriceList) ecommPriceList = { ...defaultEcommPriceList(), ...structuredClone(snapshot.ecommPriceList) };
  activeWorkspaceRecords[collection] = record[type.numberKey];
  if (selectedVersion) {
    record.version = asNumber(selectedVersion.version) || record.version;
    record.name = selectedVersion.name || record.name;
    record.snapshot = selectedVersion.snapshot || record.snapshot;
    record.updatedAt = selectedVersion.updatedAt || record.updatedAt;
    saveWorkspaces();
  }
  clearWorkspaceRecordDirty(collection);
  if (shouldActivate) setActiveView(type.viewId);
  if (shouldRender) render();
  if (shouldActivate) setSaveStatus(`Loaded ${record[type.numberKey]} v${record.version || 1}`);
}

function applyLibraryRecord(collection, record, versionNumber = null, options = {}) {
  const type = recordTypeFor(collection);
  if (!type || !record || !isLibraryRecordCollection(collection)) return;
  const shouldActivate = options.activate !== false;
  const shouldRender = options.render !== false;
  const selectedVersion = workspaceRecordVersion(record, versionNumber);
  const snapshot = selectedVersion?.snapshot || record.snapshot || {};
  if (collection === "printQuotes" && snapshot.printQuote) printQuote = { ...defaultPrintQuote(), ...structuredClone(snapshot.printQuote) };
  if (collection === "ecomm" && snapshot.ecommPriceList) ecommPriceList = { ...defaultEcommPriceList(), ...structuredClone(snapshot.ecommPriceList) };
  activeWorkspaceRecords[collection] = record[type.numberKey];
  if (selectedVersion) {
    record.version = asNumber(selectedVersion.version) || record.version;
    record.name = selectedVersion.name || record.name;
    record.snapshot = selectedVersion.snapshot || record.snapshot;
    record.updatedAt = selectedVersion.updatedAt || record.updatedAt;
    saveLibraryRecords();
  }
  clearWorkspaceRecordDirty(collection);
  if (shouldActivate) setActiveView(type.viewId);
  if (shouldRender) render();
  if (shouldActivate) setSaveStatus(`Opened ${record[type.numberKey]} v${record.version || 1}`);
}

async function loadWorkspaceRecord(collection, recordNumber, versionNumber = null) {
  const type = recordTypeFor(collection);
  if (isLibraryRecordCollection(collection)) {
    const records = libraryRecordsFor(collection);
    const record = records.find((candidate) => candidate[type.numberKey] === recordNumber) || records.at(-1);
    if (!record) {
      setSaveStatus(`No saved ${type.label}`);
      return;
    }
    if (!(await resolveDirtyRecordsBefore([collection], `Opening ${type.label}`))) {
      renderTabRecordControls();
      return;
    }
    applyLibraryRecord(collection, record, versionNumber);
    return;
  }
  const workspace = ensureWorkspace();
  const records = workspace.records?.[collection] || [];
  const record = collection === "estimates"
    ? estimateRecordsForNumber(records, recordNumber).find((candidate) => asNumber(candidate.version) === asNumber(versionNumber))
      || latestEstimateRecord(records, recordNumber)
      || records.at(-1)
    : records.find((candidate) => candidate[type.numberKey] === recordNumber) || records.at(-1);
  if (!record) {
    setSaveStatus(`No saved ${type.label}`);
    return;
  }
  if (collection === "estimates") {
    if (!(await resolveDirtyRecordsBefore(estimateLoadDirtyCollections(), `Loading ${type.label}`))) {
      renderTabRecordControls();
      return;
    }
    await loadEstimate(record, { skipDirtyCheck: true });
    if (els.estimateVersion) els.estimateVersion.value = String(asNumber(versionNumber || record.version) || 1);
    renderTabRecordControls();
    renderTabRecordIndicators();
    return;
  }
  if (!(await resolveDirtyRecordsBefore([collection], `Loading ${type.label}`))) {
    renderTabRecordControls();
    return;
  }
  applyWorkspaceRecord(collection, record, versionNumber);
}

async function saveRecordFromManager(collection) {
  if (collection === "estimates") {
    await saveCurrentEstimate();
    return;
  }
  const type = recordTypeFor(collection);
  if (isLibraryRecordCollection(collection)) {
    const record = upsertLibraryRecord(collection);
    render();
    if (record) setSaveStatus(`Saved ${record[type.numberKey]} to library`);
    return;
  }
  const record = upsertWorkspaceRecord(collection);
  render();
  if (record) setSaveStatus(`Saved ${record[type.numberKey]}`);
}

async function duplicateRecordFromManager(collection) {
  if (collection === "estimates") {
    await duplicateCurrentEstimate();
    return;
  }
  const type = recordTypeFor(collection);
  if (isLibraryRecordCollection(collection)) {
    const record = upsertLibraryRecord(collection, { duplicate: true, name: `${workspaceRecordDisplayName(type)} Copy` });
    render();
    if (record) setSaveStatus(`Copied to ${record[type.numberKey]}`);
    return;
  }
  const record = upsertWorkspaceRecord(collection, { duplicate: true, name: `${workspaceRecordDisplayName(type)} Copy` });
  render();
  if (record) setSaveStatus(`Duplicated as ${record[type.numberKey]}`);
}

async function newVersionFromManager(collection) {
  if (collection === "estimates") {
    const nextVersion = currentEstimateVersion() + 1;
    if (els.estimateVersion) els.estimateVersion.value = String(nextVersion);
    const saved = await saveCurrentEstimate();
    if (saved) setSaveStatus(`Saved ${currentEstimateNumber()} v${nextVersion}`);
    return;
  }
  const type = recordTypeFor(collection);
  if (isLibraryRecordCollection(collection)) {
    const record = upsertLibraryRecord(collection, { newVersion: true });
    render();
    if (record) setSaveStatus(`Saved ${record[type.numberKey]} v${record.version}`);
    return;
  }
  const record = upsertWorkspaceRecord(collection, { newVersion: true });
  render();
  if (record) setSaveStatus(`Saved ${record[type.numberKey]} v${record.version}`);
}

async function attachLibraryRecordToWorkspace(collection) {
  const type = recordTypeFor(collection);
  const libraryUi = libraryUiFor(collection);
  if (!type || !libraryUi) return;
  const record = upsertLibraryRecord(collection);
  if (!record) {
    setSaveStatus("Save failed");
    return;
  }
  const workspace = ensureWorkspace();
  const recordNumber = record[type.numberKey];
  record.attachedWorkspaces = uniqueValues([...libraryRecordAttachmentList(record), workspace.workspaceNumber]);
  record.attachedToWorkspace = record.attachedWorkspaces[0] || workspace.workspaceNumber;
  record.status = "attached";
  activeWorkspaceRecords[collection] = recordNumber;
  workspace.activeRecords = { ...(workspace.activeRecords || {}), [collection]: recordNumber };
  workspace.updatedAt = new Date().toISOString();
  saveLibraryRecords();
  saveWorkspaces();
  clearWorkspaceRecordDirty(collection);
  render();
  setSaveStatus(`${recordNumber} attached to ${workspace.workspaceNumber}`);
}

async function detachLibraryRecordFromWorkspace(collection) {
  const type = recordTypeFor(collection);
  const libraryUi = libraryUiFor(collection);
  if (!type || !libraryUi) return;
  const workspace = ensureWorkspace();
  const recordNumber = activeRecordNumber(collection);
  const record = libraryRecordsFor(collection).find((candidate) => candidate[type.numberKey] === recordNumber);
  if (!record) {
    setSaveStatus("No saved record to detach");
    return;
  }
  record.attachedWorkspaces = libraryRecordAttachmentList(record).filter((workspaceNumber) => workspaceNumber !== workspace.workspaceNumber);
  record.attachedToWorkspace = record.attachedWorkspaces[0] || "";
  record.status = record.attachedWorkspaces.length ? "attached" : "standalone";
  if (workspace.activeRecords?.[collection] === recordNumber) delete workspace.activeRecords[collection];
  workspace.updatedAt = new Date().toISOString();
  saveLibraryRecords();
  saveWorkspaces();
  clearWorkspaceRecordDirty(collection);
  render();
  setSaveStatus(`${recordNumber} detached from ${workspace.workspaceNumber}`);
}

function recordStatusText(record) {
  if (!record) return "Not saved yet";
  const date = record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : "";
  return [`v${record.version || 1}`, date && `Saved ${date}`].filter(Boolean).join(" · ");
}

function recordVersionOptions(record) {
  if (!record) return `<option value="">No versions</option>`;
  const versions = Array.isArray(record.versions) && record.versions.length
    ? record.versions
    : [{ version: record.version || 1, name: record.name, updatedAt: record.updatedAt }];
  return versions
    .slice()
    .sort((a, b) => asNumber(b.version) - asNumber(a.version))
    .map((version) => {
      const versionNumber = asNumber(version.version) || 1;
      const date = version.updatedAt ? new Date(version.updatedAt).toLocaleDateString() : "";
      const selected = versionNumber === asNumber(record.version || 1) ? "selected" : "";
      return `<option value="${versionNumber}" ${selected}>v${versionNumber}${date ? ` · ${escapeHtml(date)}` : ""}</option>`;
    })
    .join("");
}

function estimateRecordsForNumber(records, projectNumber) {
  const estimateNumber = normalizeEstimateNumber(projectNumber);
  return records
    .filter((record) => normalizeEstimateNumber(record.projectNumber) === estimateNumber)
    .sort((a, b) => asNumber(b.version) - asNumber(a.version));
}

function latestEstimateRecord(records, projectNumber) {
  return estimateRecordsForNumber(records, projectNumber)[0] || null;
}

function estimateRecordSelectOptions(records, activeNumber) {
  if (!records.length) return `<option value="">No saved Estimate records</option>`;
  const grouped = new Map();
  records.forEach((record) => {
    const number = normalizeEstimateNumber(record.projectNumber);
    const existing = grouped.get(number);
    if (!existing || asNumber(record.version) > asNumber(existing.version)) grouped.set(number, record);
  });
  return Array.from(grouped.values())
    .sort((a, b) => projectNumberSortValue(a.projectNumber) - projectNumberSortValue(b.projectNumber))
    .map((record) => {
      const number = normalizeEstimateNumber(record.projectNumber);
      return `<option value="${escapeHtml(number)}" ${number === activeNumber ? "selected" : ""}>${escapeHtml(number)} · ${escapeHtml(record.projectName || "Untitled Estimate")}</option>`;
    })
    .join("");
}

function estimateVersionOptions(records, projectNumber) {
  const versions = estimateRecordsForNumber(records, projectNumber);
  if (!versions.length) return `<option value="">No versions</option>`;
  const currentVersion = currentEstimateVersion();
  return versions
    .map((record) => {
      const versionNumber = asNumber(record.version) || 1;
      const date = record.savedAt ? new Date(record.savedAt).toLocaleDateString() : "";
      return `<option value="${versionNumber}" ${versionNumber === currentVersion ? "selected" : ""}>v${versionNumber}${date ? ` · ${escapeHtml(date)}` : ""}</option>`;
    })
    .join("");
}

function renderTabRecordControls() {
  if (!els.tabRecordControls?.length) return;
  const workspace = ensureWorkspace();
  els.tabRecordControls.forEach((control) => {
    const collection = control.dataset.recordType;
    const type = recordTypeFor(collection);
    if (!type) return;
    const libraryUi = libraryUiFor(collection);
    const isLibraryRecord = Boolean(libraryUi);
    control.classList.toggle("estimate-record-controls", collection === "estimates");
    control.classList.toggle("library-record-controls", isLibraryRecord);
    control.classList.toggle("print-mode-record-controls", isLibraryRecord && workspaceMode === "printEcomm");
    const records = isLibraryRecord ? libraryRecordsFor(collection) : workspace.records?.[collection] || [];
    const activeNumber = activeRecordNumber(collection)
      || (isLibraryRecord ? nextLibraryRecordNumber(collection) : nextWorkspaceRecordNumber(collection, type.prefix, type.numberKey, type.start));
    const activeRecord = collection === "estimates"
      ? latestEstimateRecord(records, activeNumber)
      : records.find((record) => record[type.numberKey] === activeNumber);
    const hasUnsavedChanges = dirtyWorkspaceRecords.has(collection);
    control.classList.toggle("has-record-changes", hasUnsavedChanges);
    const selectOptions = isLibraryRecord
      ? ""
      : collection === "estimates"
        ? estimateRecordSelectOptions(records, activeNumber)
        : records.length
          ? records.map((record) => {
          const number = record[type.numberKey];
          return `<option value="${escapeHtml(number)}" ${number === activeNumber ? "selected" : ""}>${escapeHtml(number)} · ${escapeHtml(record.name || type.label)}</option>`;
        }).join("")
          : `<option value="">${escapeHtml(`No saved ${type.label} records`)}</option>`;
    const lookupControl = isLibraryRecord
      ? `
        <div class="library-lookup-summary">
          <button class="ghost-btn compact-btn library-browse-btn" type="button" data-record-action="browse" title="Search the full ${escapeHtml(type.label)} library">${escapeHtml(libraryUi.browseLabel)}</button>
          <span>${records.length.toLocaleString()} library · ${records.filter((record) => libraryRecordAttachedToWorkspace(record, currentWorkspaceNumber)).length.toLocaleString()} attached</span>
        </div>
      `
      : `
        <select class="record-load-select" aria-label="${escapeHtml(libraryUi?.savedLabel || `Saved ${type.label} records`)}">
          ${selectOptions}
        </select>
      `;
    const identityLabel = libraryUi?.identityLabel || `${type.label} #`;
    const actionLabels = libraryUi || {
      newLabel: "New",
      saveLabel: "Save",
      versionLabel: "Version",
      duplicateLabel: "Copy",
      loadLabel: "Load"
    };
    const libraryRecordIsAttached = isLibraryRecord && libraryRecordAttachedToWorkspace(activeRecord, currentWorkspaceNumber);
    const associationLabel = isLibraryRecord
      ? activeRecord
        ? libraryRecordIsAttached
          ? `Attached to ${currentWorkspaceNumber}`
          : "Standalone"
        : ""
      : "";
    const associationClass = isLibraryRecord
      ? activeRecord
        ? libraryRecordIsAttached ? "attached" : "standalone"
        : "draft"
      : "";
    const associationTitle = isLibraryRecord
      ? libraryRecordIsAttached
        ? libraryUi.detachedTitle
        : libraryUi.attachedTitle
      : "";
    const libraryAttachAction = libraryRecordIsAttached ? "detach" : "attach";
    const libraryAttachLabel = isLibraryRecord ? libraryRecordIsAttached ? libraryUi.detachLabel : libraryUi.attachLabel : "";
    const libraryAttachTitle = isLibraryRecord ? libraryRecordIsAttached ? libraryUi.detachedTitle : libraryUi.attachedTitle : "";
    const statusText = activeRecord
      ? recordStatusText(activeRecord)
      : hasUnsavedChanges ? "Unsaved draft" : "Not saved yet";
    const showDirtyBadge = Boolean(activeRecord && hasUnsavedChanges);
    const estimateMeta = collection === "estimates"
      ? `
        <label class="inline-record-field estimate-name-field">
          Name
          <input id="projectName" list="projectNameLookup" type="text" placeholder="New estimate" value="${escapeHtml(els.projectName?.value || "")}" />
          <datalist id="projectNameLookup"></datalist>
        </label>
        <label class="inline-record-field estimate-version-field">
          Version
          <input id="estimateVersion" type="number" min="1" step="1" value="${escapeHtml(els.estimateVersion?.value || "1")}" />
        </label>
      `
      : "";
    control.innerHTML = `
      <div class="tab-record-identity">
        <span>${escapeHtml(identityLabel)}</span>
        <strong>${escapeHtml(activeNumber)}</strong>
        <small>${escapeHtml(activeRecord?.name || workspaceRecordDisplayName(type))}</small>
      </div>
      ${estimateMeta}
      ${lookupControl}
      <select class="record-version-select" aria-label="${escapeHtml(type.label)} version" ${activeRecord ? "" : "disabled"}>
        ${collection === "estimates" ? estimateVersionOptions(records, activeNumber) : recordVersionOptions(activeRecord)}
      </select>
      <div class="record-state">
        <span class="record-status ${hasUnsavedChanges ? "dirty" : ""}">${escapeHtml(statusText)}</span>
        ${associationLabel ? `<span class="record-association-badge ${escapeHtml(associationClass)}" title="${escapeHtml(associationTitle)}">${escapeHtml(associationLabel)}</span>` : ""}
        ${showDirtyBadge ? `<span class="record-dirty-badge">Unsaved changes</span>` : ""}
      </div>
      <div class="record-actions">
        <button class="ghost-btn compact-btn" type="button" data-record-action="new" title="Start a new ${escapeHtml(type.label)} record">${escapeHtml(actionLabels.newLabel)}</button>
        <button class="ghost-btn compact-btn" type="button" data-record-action="save" title="Save this ${escapeHtml(type.label)} record">${escapeHtml(actionLabels.saveLabel)}</button>
        <button class="ghost-btn compact-btn" type="button" data-record-action="version" title="Save as a new version">${escapeHtml(actionLabels.versionLabel)}</button>
        <button class="ghost-btn compact-btn" type="button" data-record-action="duplicate" title="Duplicate this ${escapeHtml(type.label)} record">${escapeHtml(actionLabels.duplicateLabel)}</button>
        ${isLibraryRecord ? "" : `<button class="ghost-btn compact-btn" type="button" data-record-action="load" title="Load ${escapeHtml(type.label)} records" ${records.length ? "" : "disabled"}>${escapeHtml(actionLabels.loadLabel)}</button>`}
        ${isLibraryRecord ? `<button class="ghost-btn compact-btn attach-record-btn" type="button" data-record-action="${escapeHtml(libraryAttachAction)}" title="${escapeHtml(libraryAttachTitle)}">${escapeHtml(libraryAttachLabel)}</button>` : ""}
      </div>
    `;
    if (collection === "estimates") {
      els.projectName = document.querySelector("#projectName");
      els.projectNameLookup = document.querySelector("#projectNameLookup");
      els.estimateVersion = document.querySelector("#estimateVersion");
      bindEstimateMetaInputs();
    }
  });
}

function renderTabRecordIndicators() {
  const workspace = ensureWorkspace();
  workspaceRecordTypes.forEach((type) => {
    const tab = Array.from(els.appTabs).find((button) => button.dataset.view === type.viewId);
    if (!tab) return;
    const isLibraryRecord = isLibraryRecordCollection(type.collection);
    const records = isLibraryRecord ? libraryRecordsFor(type.collection) : workspace.records?.[type.collection] || [];
    const indicatorCount = isLibraryRecord
      ? records.filter((record) => libraryRecordAttachedToWorkspace(record, currentWorkspaceNumber)).length
      : records.length;
    tab.classList.toggle("library-tab", isLibraryRecordCollection(type.collection));
    tab.classList.toggle("has-saved-records", indicatorCount > 0);
    tab.classList.toggle("has-unsaved-record", dirtyWorkspaceRecords.has(type.collection));
    tab.dataset.recordCount = indicatorCount ? String(indicatorCount) : "";
    tab.dataset.recordBadge = indicatorCount
      ? `${indicatorCount} ${isLibraryRecord ? "linked" : "saved"}`
      : "";
    const activeNumber = activeRecordNumber(type.collection)
      || (isLibraryRecord ? nextLibraryRecordNumber(type.collection) : nextWorkspaceRecordNumber(type.collection, type.prefix, type.numberKey, type.start));
    const tabState = [
      isLibraryRecord
        ? indicatorCount
          ? `${indicatorCount} linked to this workspace`
          : "none linked to this workspace"
        : records.length
          ? `${records.length} saved in this workspace`
          : "no saved records",
      dirtyWorkspaceRecords.has(type.collection) ? "unsaved changes" : "",
      `active ${activeNumber}`
    ].filter(Boolean).join(" · ");
    tab.title = `${type.label}: ${tabState}`;
    tab.setAttribute("aria-label", `${type.label}, ${tabState}`);
  });
}

async function workspaceRecordAction(event) {
  const row = event.target.closest(".tab-record-controls");
  if (!row) return;
  const collection = row.dataset.recordType;
  const type = recordTypeFor(collection);
  if (!type) return;

  if (event.type === "change" && event.target.classList.contains("record-load-select")) {
    if (event.target.value) await loadWorkspaceRecord(collection, event.target.value);
    return;
  }
  if (event.type === "change" && event.target.classList.contains("record-version-select")) {
    const selectedRecord = row.querySelector(".record-load-select")?.value || activeRecordNumber(collection);
    if (selectedRecord && event.target.value) await loadWorkspaceRecord(collection, selectedRecord, event.target.value);
    return;
  }

  const button = event.target.closest("[data-record-action]");
  if (!button) return;
  const action = button.dataset.recordAction;
  const selectedRecord = row.querySelector(".record-load-select")?.value;
  const selectedVersion = row.querySelector(".record-version-select")?.value;
  if (action === "open") setActiveView(type.viewId);
  if (action === "browse") openLibraryRecordDialog(collection);
  if (action === "new") await newWorkspaceRecord(collection);
  if (action === "save") await saveRecordFromManager(collection);
  if (action === "version") await newVersionFromManager(collection);
  if (action === "duplicate") await duplicateRecordFromManager(collection);
  if (action === "attach") await attachLibraryRecordToWorkspace(collection);
  if (action === "detach") await detachLibraryRecordFromWorkspace(collection);
  if (action === "load") {
    if (isLibraryRecordCollection(collection)) openLibraryRecordDialog(collection);
    if (collection === "estimates" && selectedRecord) await loadWorkspaceRecord(collection, selectedRecord, selectedVersion);
    else if (collection === "estimates") openLoadEstimateDialog();
    else if (!isLibraryRecordCollection(collection)) await loadWorkspaceRecord(collection, selectedRecord, selectedVersion);
  }
}

async function fetchEstimatesList() {
  try {
    const res = await fetch("/api/estimates");
    estimatesList = res.ok
      ? (await res.json()).map((estimate) => ({ ...estimate, projectNumber: normalizeEstimateNumber(estimate.projectNumber) }))
      : [];
  } catch {
    estimatesList = [];
  }
}

async function fetchAndApplySeed() {
  try {
    const priorYear = Math.max(asNumber(els.estimateYear.value) - 1, 2024);
    const res = await fetch(`/api/seed?year=${priorYear}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        seedRows = buildSeedRows(data);
        seedLookups = buildSeedLookups(seedRows, data);
      }
    }
  } catch {
    // network error — keep hardcoded sourceProducts as fallback
  }
}

function projectNumberSortValue(projectNumber) {
  const match = normalizeEstimateNumber(projectNumber).match(/^E-(\d{6})$/);
  return match ? Number(match[1]) : 0;
}

function sortEstimatesList(estimates) {
  return [...estimates].sort((a, b) => projectNumberSortValue(a.projectNumber) - projectNumberSortValue(b.projectNumber));
}

function nextProjectNumber() {
  const highest = estimatesList.reduce((max, estimate) => Math.max(max, projectNumberSortValue(estimate.projectNumber)), 0);
  return `E-${String(highest + 1).padStart(6, "0")}`;
}

function estimateMatchesName(estimate, projectName) {
  return String(estimate.projectName || "").trim().toLowerCase() === String(projectName || "").trim().toLowerCase();
}

function findEstimateByProjectName(projectName) {
  const matches = sortEstimatesList(estimatesList).filter((estimate) => estimateMatchesName(estimate, projectName));
  return matches.at(-1);
}

let saveStatusTimer;

function setSaveStatus(message) {
  els.estimateSaveStatus.textContent = message;
  const isError = ["Not found", "No saved estimates", "No saved workspaces", "Workspace not found", "Save failed"].includes(message);
  els.estimateSaveStatus.classList.toggle("error", isError);
  els.estimateSaveStatus.classList.toggle("success", !isError);
  clearTimeout(saveStatusTimer);
  saveStatusTimer = setTimeout(() => {
    els.estimateSaveStatus.textContent = "";
    els.estimateSaveStatus.classList.remove("error", "success");
  }, 5000);
}

function updateProjectHeader() {
  els.reportProjectTitle.textContent = els.projectName.value || "Estimate";
  els.reportProjectNumber.textContent = els.projectNumber.value || els.projectNumber.textContent || "Unassigned";
  setEstimateRecordNumber(els.projectNumber.value || els.projectNumber.textContent || "");
  refreshRecordNumbers();
}

function setProjectNumber(projectNumber) {
  const assigned = normalizeEstimateNumber(projectNumber) || nextProjectNumber();
  els.projectNumber.value = assigned;
  els.projectNumber.textContent = assigned;
  els.projectNumber.title = assigned;
  updateProjectHeader();
}

function clearProjectNumber() {
  els.projectNumber.value = "";
  els.projectNumber.textContent = "";
  els.projectNumber.title = nextProjectNumber();
  updateProjectHeader();
}

function startBlankEstimate() {
  clearAllWorkspaceRecordDirty();
  activeWorkspaceRecords = { estimates: "", proposals: "", services: "", sourcing: "", printQuotes: "", ecomm: "" };
  rows = [];
  lookups = structuredClone(seedLookups);
  expanded = new Set();
  activePackage = "All";
  activeTypes = new Set(Object.keys(typeLabels));
  els.projectName.value = "";
  els.clientName.value = "";
  els.estimateYear.value = "";
  els.searchInput.value = "";
  els.includeInactive.checked = false;
  els.globalMarkup.value = "0.40";
  els.tariffRate.value = "0.30";
  paymentDates = {};
  paymentSettings = defaultPaymentSettings();
  proposal = defaultProposal();
  serviceScenario = "salesmachine";
  serviceRows = structuredClone(serviceSeedRows);
  serviceExpanded = new Set(serviceSeedRows.filter((row) => row.level === "product").map((row) => row.id));
  sourcing = { quotes: {}, selected: {} };
  resetSourcingUiState();
  printQuote = defaultPrintQuote();
  ecommPriceList = defaultEcommPriceList();
  if (els.workspaceName) els.workspaceName.value = "";
  if (els.estimateVersion) els.estimateVersion.value = "1";
  setWorkspaceNumber(nextWorkspaceNumber());
  setProjectNumber(nextProjectNumber());
  els.estimateViewMode.value = "detail";
}

function rowNeededQty(row) {
  return Math.max(asNumber(row.neededQty ?? row.qty), 0);
}

function average(values) {
  const numbers = values.map(asNumber).filter(Number.isFinite);
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : 0;
}

function minValue(values) {
  const numbers = values.map(asNumber).filter((value) => Number.isFinite(value) && value > 0);
  return numbers.length ? Math.min(...numbers) : 0;
}

function childrenOf(row) {
  return rows.filter((candidate) => candidate.parentId === row.id);
}

function descendantsOf(row) {
  const direct = childrenOf(row);
  return direct.flatMap((child) => [child, ...descendantsOf(child)]);
}

function packageRows() {
  return rows.filter((row) => row.level === "package");
}

function baseCalculate(row) {
  const neededQty = rowNeededQty(row);
  const inventoryQty = Math.max(asNumber(row.inventoryQty), 0);
  const qtyToOrder = neededQty - inventoryQty;
  const clientQoh = Math.max(asNumber(row.clientQoh), 0);
  const qty = neededQty - clientQoh;
  const cost = Math.max(asNumber(row.cost), 0);
  const markup = Math.min(Math.max(asNumber(row.markup), 0), 0.95);
  const marginAdj = Math.min(Math.max(asNumber(row.marginAdj), -0.95), 0.95);
  const perPieceCost = qty ? cost / qty : 0;
  const priceFromMarkup = markup >= 0.95 ? 0 : cost / (1 - markup);
  const clientPrice = marginAdj >= 0.95 ? priceFromMarkup : cost / (1 - marginAdj);
  const ppp = qty > 0 ? clientPrice / qty : 0;
  const priorPpp = asNumber(row.priorPpp);

  return {
    qty,
    neededQty,
    inventoryQty,
    qtyToOrder,
    clientQoh,
    cost,
    perPieceCost,
    markup,
    marginAdj,
    priceFromMarkup,
    clientPrice,
    ppp,
    costPpp: qty > 0 ? cost / qty : 0,
    priorPpp,
    diff: ppp - priorPpp,
    marginDollars: clientPrice - cost,
    marginPct: clientPrice ? (clientPrice - cost) / clientPrice : 0,
    standardPrice: priceFromMarkup
  };
}

function rollupCalculate(row) {
  const childRows = childrenOf(row).filter((child) => child.active);
  if (!childRows.length) return baseCalculate(row);
  const childCalcs = childRows.map(calculate);
  const inventoryQty = minValue(childCalcs.map((calc) => calc.inventoryQty));
  const neededQty    = minValue(childCalcs.map((calc) => calc.neededQty));
  const clientQoh    = minValue(childCalcs.map((calc) => calc.clientQoh));

  // Helper: build a summed-totals rollup object used by both package and product levels
  function summedRollup(qtys, totalClientPrice, totalCost, totalNeededQty, totalQtyToOrder, totalPriorValue, totalPriorQty) {
    const qty          = qtys;
    const avgMarkup    = average(childCalcs.map((c) => c.markup));
    const priorPpp     = totalPriorQty > 0 ? totalPriorValue / totalPriorQty : 0;
    const marginDollars = totalClientPrice - totalCost;
    const effectiveMarginAdj = totalClientPrice > 0 ? marginDollars / totalClientPrice : 0;
    const ppp          = qty > 0 ? totalClientPrice / qty : 0;
    const perPieceCost = qty > 0 ? totalCost / qty : 0;
    // standardPrice uses the averaged markup applied to total cost (same logic as baseCalculate)
    const standardPrice = avgMarkup >= 0.95 ? 0 : (totalCost / (1 - avgMarkup));
    return {
      qty,
      neededQty: totalNeededQty,
      inventoryQty,
      qtyToOrder: totalQtyToOrder,
      clientQoh,
      cost: totalCost,
      perPieceCost,
      markup: avgMarkup,
      marginAdj: effectiveMarginAdj,
      priceFromMarkup: standardPrice,
      clientPrice: totalClientPrice,
      ppp,
      costPpp: qty > 0 ? totalCost / qty : 0,
      priorPpp,
      diff: ppp - priorPpp,
      marginDollars,
      marginPct: totalClientPrice ? marginDollars / totalClientPrice : 0,
      standardPrice
    };
  }

  // Package rows: sum all child totals — PPP = sum of child PPPs (additive, like elements→product)
  if (row.level === "package") {
    const result = summedRollup(
      childCalcs.reduce((s, c) => s + c.qty, 0),
      childCalcs.reduce((s, c) => s + c.clientPrice, 0),
      childCalcs.reduce((s, c) => s + c.cost, 0),
      neededQty,
      childCalcs.reduce((s, c) => s + c.qtyToOrder, 0),
      childCalcs.reduce((s, c) => s + c.priorPpp * c.qty, 0),
      childCalcs.reduce((s, c) => s + c.qty, 0)
    );
    // PPP rolls up additively: package PPP = sum of child PPPs
    result.ppp = childCalcs.reduce((s, c) => s + c.ppp, 0);
    result.priorPpp = childCalcs.reduce((s, c) => s + c.priorPpp, 0);
    result.diff = result.ppp - result.priorPpp;
    return result;
  }

  // Product rows with children: sum child prices — elements price themselves
  const qty         = minValue(childCalcs.map((c) => c.qty));
  const qtyToOrder  = minValue(childCalcs.map((c) => c.qtyToOrder));
  return summedRollup(
    qty,
    childCalcs.reduce((s, c) => s + c.clientPrice, 0),
    childCalcs.reduce((s, c) => s + c.cost, 0),
    neededQty,
    qtyToOrder,
    childCalcs.reduce((s, c) => s + c.priorPpp * c.qty, 0),
    childCalcs.reduce((s, c) => s + c.qty, 0)
  );
}

function calculate(row) {
  return row.level === "element" ? baseCalculate(row) : rollupCalculate(row);
}

function rowMatchesQuery(row, query) {
  if (!query) return true;
  const haystack = [row.packageName, row.product, row.element, row.sku, row.description, row.type, typeLabels[row.type]].join(" ").toLowerCase();
  return haystack.includes(query) || descendantsOf(row).some((child) => rowMatchesQuery(child, query));
}

function rowMatchesType(row) {
  if (row.level === "element") return activeTypes.has(row.type);
  // Check typed descendants at element OR product level (leaf products carry type directly)
  const typedDescendants = descendantsOf(row).filter(
    (child) => (child.level === "element" || child.level === "product") && child.type
  );
  return typedDescendants.length
    ? typedDescendants.some((child) => activeTypes.has(child.type))
    : activeTypes.has(row.type);
}

function rowPassesBaseFilters(row) {
  const query = els.searchInput.value.trim().toLowerCase();
  if (!els.includeInactive.checked && !row.active) return false;
  if (activePackage !== "All" && row.packageName !== activePackage) return false;
  return rowMatchesType(row) && rowMatchesQuery(row, query);
}

function visibleRows() {
  const visible = [];
  packageRows()
    .filter(rowPassesBaseFilters)
    .sort((a, b) => a.sourceOrder - b.sourceOrder)
    .forEach((packageRow) => {
      visible.push(packageRow);
      if (!expanded.has(packageRow.id)) return;
      childrenOf(packageRow)
        .filter(rowPassesBaseFilters)
        .sort((a, b) => a.sourceOrder - b.sourceOrder)
        .forEach((productRow) => {
          visible.push(productRow);
          if (!expanded.has(productRow.id)) return;
          childrenOf(productRow)
            .filter(rowPassesBaseFilters)
            .sort((a, b) => a.sourceOrder - b.sourceOrder)
            .forEach((elementRow) => visible.push(elementRow));
        });
    });
  return visible;
}

function visiblePackageRows() {
  return visibleRows().filter((row) => row.level === "package" && row.active);
}

function totalFor(sourceRows) {
  return sourceRows.reduce(
    (memo, row) => {
      const calc = calculate(row);
      memo.qty += calc.qty;
      memo.neededQty += calc.neededQty;
      memo.inventoryQty += calc.inventoryQty;
      memo.qtyToOrder += calc.qtyToOrder;
      memo.clientQoh += calc.clientQoh;
      memo.cost += calc.cost;
      memo.perPieceCostValue += calc.perPieceCost * calc.qtyToOrder;
      memo.client += calc.clientPrice;
      memo.margin += calc.marginDollars;
      memo.standardPrice += calc.standardPrice;
      memo.diffValue += calc.diff * calc.qty;
      return memo;
    },
    { cost: 0, client: 0, margin: 0, standardPrice: 0, qty: 0, neededQty: 0, inventoryQty: 0, qtyToOrder: 0, clientQoh: 0, perPieceCostValue: 0, diffValue: 0 }
  );
}

function activeElementsForVisiblePackages() {
  const packageIds = new Set(visiblePackageRows().map((row) => row.id));
  return rows.filter((row) => {
    if (!row.active || row.level !== "element" || !activeTypes.has(row.type)) return false;
    const product = rows.find((candidate) => candidate.id === row.parentId);
    return product?.parentId ? packageIds.has(product.parentId) : false;
  });
}

// Returns all leaf pricing nodes for visible packages:
// - element rows (deepest level), OR
// - leaf product rows (products with no active element children)
// Used for payment schedule and production-type subtotals.
function activeLeafRowsForVisiblePackages() {
  const packageIds = new Set(visiblePackageRows().map((row) => row.id));
  const activeElementParentIds = new Set(
    rows.filter((r) => r.level === "element" && r.active).map((r) => r.parentId)
  );
  return rows.filter((row) => {
    if (!row.active || !activeTypes.has(row.type)) return false;
    if (row.level === "element") {
      const product = rows.find((r) => r.id === row.parentId);
      return product?.parentId ? packageIds.has(product.parentId) : false;
    }
    if (row.level === "product") {
      // Leaf product: belongs to a visible package and has no active element children
      if (!packageIds.has(row.parentId)) return false;
      return !activeElementParentIds.has(row.id);
    }
    return false;
  });
}

function activeLeafRowsForProposal() {
  const activeElementParentIds = new Set(
    rows.filter((row) => row.level === "element" && row.active).map((row) => row.parentId)
  );
  return rows.filter((row) => {
    if (!row.active || !row.type) return false;
    if (row.level === "element") return true;
    return row.level === "product" && !activeElementParentIds.has(row.id);
  });
}

function activeLeafDescendantsFor(row) {
  if (!row.active) return [];
  if (row.level === "element") return [row];
  const activeElementParentIds = new Set(
    rows.filter((candidate) => candidate.level === "element" && candidate.active).map((candidate) => candidate.parentId)
  );
  return descendantsOf(row).filter((candidate) => {
    if (!candidate.active || !activeTypes.has(candidate.type)) return false;
    if (candidate.level === "element") return true;
    return candidate.level === "product" && !activeElementParentIds.has(candidate.id);
  });
}

function activeLeafRowsForSimulation() {
  const targets = new Map();
  visibleRows()
    .filter((row) => row.active)
    .forEach((row) => {
      activeLeafDescendantsFor(row).forEach((leaf) => targets.set(leaf.id, leaf));
    });
  return Array.from(targets.values());
}

function proposalTotals() {
  const activePackages = packageRows().filter((row) => row.active);
  const totals = totalFor(activePackages);
  return {
    ...totals,
    packageCount: activePackages.length,
    lineCount: activeLeafRowsForProposal().length,
    weightedPpp: totals.qty ? totals.client / totals.qty : 0
  };
}

const proposalSectionLabels = {
  copy: "Proposal copy",
  estimate: "Estimate pricing",
  schedule: "Payment schedule",
  services: "Services calculator",
  sourcing: "Sourcing summary",
  printQuote: "Print quote",
  ecomm: "Ecomm price list"
};

const proposalSectionCollections = {
  estimate: "estimates",
  schedule: "estimates",
  services: "services",
  sourcing: "sourcing",
  printQuote: "printQuotes",
  ecomm: "ecomm"
};

const proposalTemplatePresets = {
  directMail: {
    pricingMode: "package",
    outputAudience: "client",
    outputScope: "both",
    includedSections: ["copy", "estimate", "schedule", "sourcing"]
  },
  services: {
    pricingMode: "package",
    outputAudience: "client",
    outputScope: "both",
    includedSections: ["copy", "services", "schedule"]
  },
  printQuote: {
    pricingMode: "detail",
    outputAudience: "client",
    outputScope: "costs",
    includedSections: ["copy", "printQuote", "estimate"]
  },
  ecommPriceList: {
    pricingMode: "package",
    outputAudience: "client",
    outputScope: "costs",
    includedSections: ["copy", "ecomm", "estimate"]
  },
  internalReview: {
    pricingMode: "detail",
    outputAudience: "internal",
    outputScope: "both",
    includedSections: ["copy", "estimate", "schedule", "services", "sourcing", "printQuote", "ecomm"]
  }
};

const proposalTemplateLabels = {
  directMail: "Direct Mail Proposal",
  services: "Services Proposal",
  printQuote: "Print Quote Only",
  ecommPriceList: "Ecomm Price List",
  internalReview: "Internal Cost Review"
};

const proposalOutputScopeLabels = {
  both: "Costs + schedule",
  costs: "Costs only",
  schedule: "Schedule only"
};

const proposalAudienceLabels = {
  client: "Client output",
  internal: "Internal output"
};

const proposalTemplateCatalog = [
  { id: "122606", category: "addendum", name: "Marketing Automation Platform Addendum", file: "001-122606-addendum-marketing-automation-platform-native.pdf", pages: 10, checksum: "13db671853149f3ca4121cc479ae959625cc326dbcd0a92dd2d3b164871fbc75", status: "cataloged", qualityNotes: "Source metadata only; not loadable in this run." },
  { id: "158076", category: "agreement", name: "Agency Services Agreement", file: "002-158076-agreement-agency-services.pdf", pages: 10, checksum: "18ec090ee41ae07bd8713c7d537919810199b006d39bd4542791cc12b6a5adfc", status: "cataloged", qualityNotes: "Legal-first source; requires separate review before reuse." },
  { id: "190931", category: "agreement", name: "Mutual Non-Disclosure Agreement", file: "003-190931-agreement-mutual-non-disclosure.pdf", pages: 6, checksum: "984d3f6f1cb8c8b1d5283b0ed4e1f221cad9a15bae310c199cfbb64b4a33cedb", status: "cataloged", qualityNotes: "Legal-first source; requires separate review before reuse." },
  { id: "236848", category: "agreement", name: "Regulation 1541.5 Printed Sales Messages Agreement", file: "004-236848-agreement-regulation-1541-5-printed-sales-messages.pdf", pages: 10, checksum: "4e0ba9f805d18e2476a4974c1788d74fea644af34a26e071d3e5916e1c77fed2", status: "cataloged", qualityNotes: "Legal/tax-oriented source; metadata only." },
  { id: "268059", category: "brochure", name: "AWV Reverse Append Brochure", file: "005-268059-brochure-awv-reverse-append.pdf", pages: 3, checksum: "bb3cb4098464ca7667557500a35c043b516845c74a7e1292ce8f5b7cfa7ff589", status: "cataloged", qualityNotes: "Marketing-module source; metadata only." },
  { id: "400100", category: "brochure", name: "Granular Advertising Agencies V2 Brochure", file: "006-400100-brochure-granular-advertising-agencies-v2.pdf", pages: 19, checksum: "e22426a6edb09f31298d01e351e05bb461da6c5950f640ca59a0457aab2f0605", status: "cataloged", qualityNotes: "Marketing-module source; metadata only." },
  { id: "167688", category: "brochure", name: "Granular Advertising Aggregated Audience Brochure", file: "007-167688-brochure-granular-advertising-aggregated-audience.pdf", pages: 5, checksum: "bb88dbef9877df94de81bfb7f92fde23cc2fcd9d64ae704cf923e722bb6dea66", status: "cataloged", qualityNotes: "Marketing-module source; metadata only." },
  { id: "268077", category: "brochure", name: "OTT Brochure", file: "008-268077-brochure-ott.pdf", pages: 5, checksum: "85856589efe124d6494bf3e1ea2c6e23d25fdf85eebddccd35f14fd833732113", status: "cataloged", qualityNotes: "Marketing-module source; metadata only." },
  { id: "420259", category: "brochure", name: "Audience Targeting Technologies Brochure", file: "009-420259-brochure-audience-targeting-technologies.pdf", pages: 19, checksum: "157d92edcae0cad2ba2b438c076451e3e1587ab1c57ec4b096ab51ac73adde27", status: "cataloged", qualityNotes: "Marketing-module source; metadata only." },
  { id: "151844", category: "brochure", name: "Experiential Agencies Brochure", file: "010-151844-brochure-experiential-agencies.pdf", pages: 8, checksum: "d50435331bf9a608b269a4e99fe0592edc5e866f5b30e07d3a9dd09ab6cd2c32", status: "cataloged", qualityNotes: "Marketing-module source; metadata only." },
  { id: "603333", category: "brochure", name: "Sharpdots Services Brochure", file: "011-603333-brochure-sharpdots-services.pdf", pages: 18, checksum: "60b1385ec1e8a82e570497f4cede088f587f794febba1d115859a70894ab96c3", status: "starter", qualityNotes: "Sanitized services starter available." },
  { id: "734472", category: "proposal", name: "Capture Audience Proposal", file: "012-734472-proposals-capture-audience.pdf", pages: 13, checksum: "9a428c8366743fe8869d9733c6984a49087d6538c7491fb0ac975f06c8825369", status: "cataloged", qualityNotes: "Proposal source; metadata only." },
  { id: "131263", category: "proposal", name: "Aggregated Audience Proposal", file: "013-131263-proposals-aggregated-audience.pdf", pages: 16, checksum: "f9e9e32216ea6922a0f8a6461f1b1da05e55df1267fab661fdfd50ecc123d8d6", status: "cataloged", qualityNotes: "Proposal source; metadata only." },
  { id: "314145", category: "proposal", name: "Capture Pixel Proposal", file: "014-314145-proposals-capture-pixel.pdf", pages: 14, checksum: "66c2f09930caf02a9012a602b1ba157fb37abddda4619db7e4ca554d89c2f585", status: "cataloged", qualityNotes: "Proposal source; metadata only." },
  { id: "272773", category: "proposal", name: "Data Services Proposal", file: "015-272773-proposals-data-services.pdf", pages: 12, checksum: "284d2b1a306d1b8e56f8c1ec2a283b285e0cd1c77e6caf04c52887d1f35db713", status: "cataloged", qualityNotes: "Proposal source; metadata only." },
  { id: "487336", category: "proposal", name: "Facebook Ad Campaign Proposal", file: "016-487336-proposals-facebook-ad-campaign.pdf", pages: 9, checksum: "8427255b7a3e5d5d68b4372a0d356ea5cb4ae8acf458df8d4dd487f136cf7dab", status: "cataloged", qualityNotes: "Proposal source; metadata only." },
  { id: "140631", category: "proposal", name: "Location-Based Ads Proposal", file: "017-140631-proposals-location-based-ads.pdf", pages: 17, checksum: "915cb903f27402a4cf6a216766a449889b0d67ee30ba47451ce80576b00c916b", status: "cataloged", qualityNotes: "Proposal source; metadata only." },
  { id: "556333", category: "proposal", name: "Machine Learning Project Proposal", file: "018-556333-proposals-machine-learning-project.pdf", pages: 14, checksum: "ee4dbc657c08019f718b2889710cc252dfa5acc0fa8c7e3eb306f0bb9ff7574b", status: "cataloged", qualityNotes: "Proposal source; metadata only." },
  { id: "182333", category: "proposal", name: "Marketing Automation Tier 1 Proposal", file: "019-182333-proposals-marketing-automation-tier-1.pdf", pages: 18, checksum: "ab744411923a67d0e8e5771b775cce8e9adbb568471ff69ff9f15a3f35c9dddd", status: "cataloged", qualityNotes: "Proposal source; metadata only." },
  { id: "155858", category: "proposal", name: "Marketing Automation Tier 2 Proposal", file: "020-155858-proposals-marketing-automation-tier-2.pdf", pages: 20, checksum: "fcb42ecd2b7d114ef7138d937d353229cc99288b689de24f14a013845d182fc9", status: "cataloged", qualityNotes: "Proposal source; metadata only." },
  { id: "170605", category: "proposal", name: "Neighbor Targeting Proposal", file: "021-170605-proposals-neighbor-targeting.pdf", pages: 16, checksum: "644643f12cea693fee419eddd99fd1b2f1589d34cff4d7d12fd7bbf416776a21", status: "cataloged", qualityNotes: "Known clipped-heading defect; not a visual baseline." },
  { id: "329536", category: "proposal", name: "Omni Mail Proposal", file: "022-329536-proposals-omni-mail.pdf", pages: 16, checksum: "1039028b5b6df32c936245cc4a3384bd3aa4ef53aa798ef2c6d033849299df03", status: "starter", qualityNotes: "Sanitized direct-mail starter available." },
  { id: "169895", category: "proposal", name: "RTM Proposal", file: "023-169895-proposals-rtm.pdf", pages: 16, checksum: "75ceacae97b6f3d08edc70b25692532ea30e5b3e0f614b6654e07ff7d3f09e27", status: "cataloged", qualityNotes: "Proposal source; metadata only." },
  { id: "314224", category: "proposal", name: "Sales Machine Proposal", file: "024-314224-proposals-sales-machine.pdf", pages: 12, checksum: "5c279311b326969c21fc58896c85e1b896420d46deda73ef6fdc9ab09872c2df", status: "starter", qualityNotes: "Sanitized sales/services starter available." },
  { id: "138958", category: "proposal", name: "Virtual Venue Proposal", file: "025-138958-proposals-virtual-venue.pdf", pages: 17, checksum: "5135fbb8cc36a2bfc156eb716a4e6173a0864fd368d9639c39c2990d879bb6ad", status: "cataloged", qualityNotes: "Proposal source; metadata only." },
  { id: "509122", category: "statement-of-work", name: "Development Statement of Work", file: "026-509122-statement-of-work-development.pdf", pages: 16, checksum: "5273338ae8df6ac579124ef9cb454e31a86e8c2b4779e062e417e80bf1a5ed33", status: "cataloged", qualityNotes: "Statement-of-work source; metadata only." },
  { id: "154100", category: "statement-of-work", name: "E-Commerce Website Statement of Work", file: "027-154100-statement-of-work-e-commerce-website.pdf", pages: 20, checksum: "46ac4bb82b07ba91b43e927d7b1c1badd666e14fe73a8ed4e71c22a1e4893e59", status: "cataloged", qualityNotes: "Statement-of-work source; metadata only." },
  { id: "171207", category: "statement-of-work", name: "Informational Website Statement of Work", file: "028-171207-statement-of-work-informational-website.pdf", pages: 17, checksum: "87a860740c5d3e663913b29e1489fc55cfe36c0fb8191901efabe9002b51ce60", status: "cataloged", qualityNotes: "Statement-of-work source; metadata only." },
  { id: "573546", category: "statement-of-work", name: "IT Services Statement of Work", file: "029-573546-statement-of-work-it-services.pdf", pages: 8, checksum: "0f1425317cb5e2f3ace1e101233461d5cdc767c32a22228aea02f6d58d4ec7c2", status: "cataloged", qualityNotes: "Statement-of-work source; metadata only." },
  { id: "406423", category: "statement-of-work", name: "Print Editing and Marketing Platform Statement of Work", file: "030-406423-statement-of-work-print-editing-and-marketing-platform.pdf", pages: 10, checksum: "66b8011fe8c9be49b0c171c081f5f3b3e8239b50d90265e75da801f9de00ca61", status: "cataloged", qualityNotes: "Statement-of-work source; metadata only." }
];

const proposalStarterTemplates = {
  "329536": {
    basePreset: "directMail",
    displayName: "Omni Mail Campaign Starter",
    fields: {
      title: "Omni Mail Campaign Proposal",
      subtitle: "Audience, print, mail, and follow-up activation",
      overview: "This proposal frames a direct-mail campaign as a coordinated acquisition program: audience definition, production-ready print, mailing logistics, and measurable next steps. It is intentionally generic and should be tailored to the current workspace before client use.",
      audience: "Use this section to define the intended recipients, geography, quantity assumptions, segmentation criteria, and suppression requirements. Replace these placeholders with the current estimate and approved campaign scope.",
      deliverables: "Audience planning, print-ready production coordination, mail preparation, campaign launch support, and reporting handoff are included as narrative modules. Pricing and quantities remain sourced from the current Estimator records.",
      valueNarrative: "The useful comparison is not only piece cost; it is the cost to reach the right recipient with a clear offer and a trackable response path.",
      nextSteps: "1. Confirm audience and mail quantity assumptions.\n2. Review estimate pricing, schedule, and selected services.\n3. Approve the working proposal so production details can be finalized.",
      terms: "Final pricing, schedule, and deliverables depend on the approved scope, current estimate records, and any production changes requested after review."
    }
  },
  "314224": {
    basePreset: "services",
    displayName: "Sales Machine Services Starter",
    fields: {
      title: "Sales Machine Services Proposal",
      subtitle: "Outreach operations and execution support",
      overview: "This proposal outlines a services-led growth program that combines strategy, campaign assets, outbound execution, and operating review. It is sanitized starter copy and does not include historical customers, prices, or legal terms.",
      audience: "Describe the target account profile, buying committee, market segment, channel mix, and qualification criteria for the current project.",
      deliverables: "Program setup, message development, campaign operations, platform coordination, reporting, and review cadence can be described here. Calculated service pricing remains read-only from the Services Calculator.",
      valueNarrative: "The program should be evaluated by the quality and repeatability of sales conversations created, not by activity volume alone.",
      nextSteps: "1. Confirm target profile and channel assumptions.\n2. Review services calculator outputs and any connected estimate records.\n3. Approve the services scope for launch planning.",
      terms: "Service scope, activation timing, and recurring support are subject to current workspace records and separate approval of any material changes."
    }
  },
  "603333": {
    basePreset: "internalReview",
    displayName: "Sharpdots Services Overview Starter",
    fields: {
      title: "Sharpdots Services Overview",
      subtitle: "Internal review draft for connected proposal output",
      overview: "This starter gives the team a neutral overview format for reviewing how Sharpdots services, estimate pricing, sourcing, and operational sections fit together before external use.",
      audience: "Summarize the internal review audience, intended decision, open assumptions, and any sections that should remain internal-only.",
      deliverables: "Use this area to describe the proposed service modules and connected operational records that need review. It should point reviewers to current calculated sections instead of restating prices manually.",
      valueNarrative: "Internal review should test whether the proposal tells a coherent business story and whether each computed section is sourced from the right current record.",
      nextSteps: "1. Review source record readiness.\n2. Resolve missing estimates, services, sourcing, print quote, or ecomm records.\n3. Decide whether the draft is ready for a client-facing template.",
      terms: "This internal starter is not client-ready legal language. Replace it with reviewed terms before any external reliance."
    }
  }
};

const proposalNarrativeFields = ["title", "subtitle", "preparedFor", "overview", "audience", "deliverables", "valueNarrative", "nextSteps", "terms"];
let proposalPreviewEditMode = false;

function proposalCatalogEntry(id) {
  return proposalTemplateCatalog.find((entry) => entry.id === String(id || "")) || null;
}

function proposalStarterEntry(id) {
  return proposalStarterTemplates[String(id || "")] || null;
}

function proposalTemplateCategories() {
  return uniqueValues(proposalTemplateCatalog.map((entry) => entry.category));
}

function proposalFilteredTemplateCatalog() {
  const query = String(els.proposalTemplateSearch?.value || "").trim().toLowerCase();
  const category = els.proposalTemplateCategory?.value || "all";
  return proposalTemplateCatalog.filter((entry) => {
    if (category !== "all" && entry.category !== category) return false;
    if (!query) return true;
    return [entry.id, entry.name, entry.category, entry.file, entry.status]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

function proposalTemplateMetaFor(sourceId, displayName) {
  const source = proposalCatalogEntry(sourceId);
  const starter = proposalStarterEntry(sourceId);
  if (!source || !starter) return null;
  return {
    sourceTemplateId: source.id,
    sourceName: source.name,
    sourceFile: source.file,
    sourceChecksum: source.checksum,
    displayName: String(displayName || starter.displayName || source.name).trim() || source.name,
    category: source.category,
    basePreset: starter.basePreset,
    sourceRevision: 1,
    starterStatus: "sanitized-starter"
  };
}

function applyProposalStarter(sourceId, options = {}) {
  const source = proposalCatalogEntry(sourceId);
  const starter = proposalStarterEntry(sourceId);
  if (!source || !starter) return false;
  const displayName = options.displayName || starter.displayName || source.name;
  applyProposalTemplatePreset(starter.basePreset || "directMail");
  proposal.templateMeta = proposalTemplateMetaFor(source.id, displayName);
  Object.entries(starter.fields || {}).forEach(([key, value]) => {
    if (proposalNarrativeFields.includes(key)) proposal[key] = value;
  });
  return true;
}

function loadSelectedProposalTemplate() {
  const sourceId = els.proposalTemplateSelect?.value || "";
  if (!applyProposalStarter(sourceId)) {
    setSaveStatus("Selected catalog entry is metadata-only in this run");
    renderProposalTemplateLibrary();
    return;
  }
  setProposalEditorValues();
  touchWorkspaceRecord("proposals");
  renderProposalPreview();
  setSaveStatus(`Loaded starter: ${proposal.templateMeta.displayName}`);
}

function renameProposalTemplateCopy() {
  if (!proposal.templateMeta?.sourceTemplateId) return;
  const nextName = String(els.proposalTemplateDisplayName?.value || "").trim();
  if (!nextName) {
    setSaveStatus("Enter a working copy name");
    return;
  }
  proposal.templateMeta = {
    ...proposal.templateMeta,
    displayName: nextName
  };
  touchWorkspaceRecord("proposals");
  renderProposalTemplateLibrary();
  renderProposalPreview();
  setSaveStatus(`Renamed working copy: ${nextName}`);
}

function resetProposalStarterToSource() {
  const sourceId = proposal.templateMeta?.sourceTemplateId || els.proposalTemplateSelect?.value || "";
  if (!applyProposalStarter(sourceId)) {
    setSaveStatus("No loadable starter selected");
    renderProposalTemplateLibrary();
    return;
  }
  setProposalEditorValues();
  touchWorkspaceRecord("proposals");
  renderProposalPreview();
  setSaveStatus(`Reset to source starter: ${proposal.templateMeta.sourceName}`);
}

function renderProposalTemplateLibrary() {
  if (!els.proposalTemplateSelect) return;
  const starterCount = Object.keys(proposalStarterTemplates).length;
  if (els.proposalTemplateLibraryCount) {
    els.proposalTemplateLibraryCount.textContent = `${proposalTemplateCatalog.length} catalog entries / ${starterCount} sanitized starters`;
  }
  if (els.proposalTemplateCategory && !els.proposalTemplateCategory.dataset.loaded) {
    proposalTemplateCategories().forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.replaceAll("-", " ");
      els.proposalTemplateCategory.append(option);
    });
    els.proposalTemplateCategory.dataset.loaded = "true";
  }

  const previous = els.proposalTemplateSelect.value || proposal.templateMeta?.sourceTemplateId || "329536";
  const entries = proposalFilteredTemplateCatalog();
  els.proposalTemplateSelect.innerHTML = "";
  entries.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.id;
    option.textContent = `${entry.id} - ${entry.name}${proposalStarterEntry(entry.id) ? " (starter)" : " (metadata)"}`;
    els.proposalTemplateSelect.append(option);
  });
  if (entries.some((entry) => entry.id === previous)) els.proposalTemplateSelect.value = previous;

  const selected = proposalCatalogEntry(els.proposalTemplateSelect.value);
  const selectedStarter = proposalStarterEntry(selected?.id);
  if (els.proposalTemplateSourceSummary) {
    els.proposalTemplateSourceSummary.innerHTML = selected
      ? `
        <strong>${escapeHtml(selected.status === "starter" ? "Sanitized starter" : "Metadata only")}</strong>
        <span>${escapeHtml(selected.category)} / ${selected.pages} pages / source ${selected.id}</span>
        <small>${escapeHtml(selected.qualityNotes)}</small>
      `
      : "<span>No catalog entries match the current filter.</span>";
  }
  if (els.loadProposalTemplateBtn) els.loadProposalTemplateBtn.disabled = !selectedStarter;
  if (els.resetProposalSourceBtn) els.resetProposalSourceBtn.disabled = !proposal.templateMeta?.sourceTemplateId || !proposalStarterEntry(proposal.templateMeta.sourceTemplateId);
  if (els.renameProposalTemplateCopyBtn) els.renameProposalTemplateCopyBtn.disabled = !proposal.templateMeta?.sourceTemplateId;
  if (els.proposalTemplateDisplayName && document.activeElement !== els.proposalTemplateDisplayName) {
    els.proposalTemplateDisplayName.value = proposal.templateMeta?.displayName || "";
  }
  if (els.proposalTemplateWorkingStatus) {
    els.proposalTemplateWorkingStatus.textContent = proposal.templateMeta?.sourceTemplateId
      ? `Working copy from ${proposal.templateMeta.sourceTemplateId}; source identity preserved`
      : "No starter loaded";
  }
}

function proposalIncludedSections() {
  const sections = Array.isArray(proposal.includedSections) ? proposal.includedSections : [];
  return new Set(sections.length ? sections : defaultProposal().includedSections);
}

function proposalHasSection(section) {
  return proposalIncludedSections().has(section);
}

function applyProposalTemplatePreset(templateKey) {
  const preset = proposalTemplatePresets[templateKey];
  if (!preset) return;
  proposal.publishingTemplate = templateKey;
  proposal.pricingMode = preset.pricingMode;
  proposal.outputAudience = preset.outputAudience;
  proposal.outputScope = preset.outputScope;
  proposal.includedSections = [...preset.includedSections];
}

function sameSectionSet(left = [], right = []) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  if (leftSet.size !== rightSet.size) return false;
  return Array.from(leftSet).every((section) => rightSet.has(section));
}

function proposalMatchesTemplatePreset() {
  const preset = proposalTemplatePresets[proposal.publishingTemplate];
  if (!preset) return false;
  return proposal.pricingMode === preset.pricingMode
    && proposal.outputAudience === preset.outputAudience
    && proposal.outputScope === preset.outputScope
    && sameSectionSet(Array.from(proposalIncludedSections()), preset.includedSections);
}

function savedRecordForCollection(collection) {
  const type = recordTypeFor(collection);
  if (!type) return null;
  const activeNumber = activeRecordNumber(collection);
  if (!activeNumber) return null;
  if (isLibraryRecordCollection(collection)) {
    return libraryRecordsFor(collection).find((record) => record[type.numberKey] === activeNumber) || null;
  }
  const workspace = workspaceByNumber(currentWorkspaceNumber);
  const records = workspace?.records?.[collection] || [];
  return collection === "estimates"
    ? latestEstimateRecord(records, activeNumber)
    : records.find((record) => record[type.numberKey] === activeNumber) || null;
}

function proposalPublishingCollections() {
  const collections = new Set(["proposals"]);
  proposalIncludedSections().forEach((section) => {
    const collection = proposalSectionCollections[section];
    if (collection) collections.add(collection);
  });
  return Array.from(collections);
}

function publishingRecordLabel(collection) {
  const type = recordTypeFor(collection);
  const number = activeRecordNumber(collection)
    || (isLibraryRecordCollection(collection)
      ? nextLibraryRecordNumber(collection)
      : nextWorkspaceRecordNumber(collection, type?.prefix || "", type?.numberKey || "", type?.start || 1));
  return [type?.label || collection, number].filter(Boolean).join(" ");
}

function proposalPublishingSourceState(collection, options = {}) {
  const savedCollections = new Set(options.savedCollections || []);
  const type = recordTypeFor(collection);
  const record = savedRecordForCollection(collection);
  const number = activeRecordNumber(collection)
    || (isLibraryRecordCollection(collection)
      ? nextLibraryRecordNumber(collection)
      : nextWorkspaceRecordNumber(collection, type?.prefix || "", type?.numberKey || "", type?.start || 1));
  const isDirty = dirtyWorkspaceRecords.has(collection) && !savedCollections.has(collection);
  const isSaved = Boolean(record) || savedCollections.has(collection);
  const isLibrary = isLibraryRecordCollection(collection);
  const isAttached = isLibrary ? libraryRecordAttachedToWorkspace(record, currentWorkspaceNumber) : true;
  const status = !isSaved || isDirty
    ? "needs-save"
    : isLibrary && !isAttached
      ? "needs-attach"
      : "ready";
  const statusLabel = status === "needs-save"
    ? isDirty && isSaved
      ? "Unsaved changes"
      : "Not saved yet"
    : status === "needs-attach"
      ? "Attach to workspace"
      : "Ready";

  return {
    collection,
    label: type?.label || collection,
    number: number || "",
    version: record?.version || (collection === "estimates" ? currentEstimateVersion() : 1),
    name: record?.name || workspaceRecordDisplayName(type || {}),
    status,
    statusLabel,
    saved: isSaved && !isDirty,
    dirty: isDirty,
    attached: isLibrary ? isAttached : null,
    library: isLibrary,
    display: [type?.label || collection, number].filter(Boolean).join(" ")
  };
}

function proposalPublishingManifest(options = {}) {
  const includedSections = Array.from(proposalIncludedSections());
  const sources = proposalPublishingCollections().map((collection) => proposalPublishingSourceState(collection, options));
  const warnings = sources
    .filter((source) => source.status !== "ready")
    .map((source) => ({
      collection: source.collection,
      label: source.label,
      number: source.number,
      status: source.status,
      message: `${source.statusLabel}: ${source.display || source.label}`
    }));

  return {
    workspaceNumber: currentWorkspaceNumber || "",
    workspaceName: els.workspaceName?.value || "",
    proposalNumber: proposalTraceRecordValue("proposals"),
    generatedAt: new Date().toISOString(),
    template: proposal.publishingTemplate,
    templateLabel: proposalTemplateLabels[proposal.publishingTemplate] || "Company template",
    audience: proposal.outputAudience,
    audienceLabel: proposalAudienceLabels[proposal.outputAudience] || "Client output",
    outputScope: proposal.outputScope,
    outputScopeLabel: proposalOutputScopeLabels[proposal.outputScope] || "Costs + schedule",
    includedSections,
    includedSectionLabels: includedSections.map((section) => proposalSectionLabels[section] || section),
    sources,
    warnings,
    ready: warnings.length === 0
  };
}

function proposalSourceRecordsFromManifest(manifest = proposalPublishingManifest()) {
  return (manifest.sources || []).reduce((memo, source) => {
    if (!source.collection || !source.number) return memo;
    memo[source.collection] = {
      number: source.collection === "estimates" ? normalizeEstimateNumber(source.number) : source.number,
      version: source.version || 1,
      label: source.label || "",
      status: source.status || "ready",
      statusLabel: source.statusLabel || ""
    };
    return memo;
  }, {});
}

function proposalSnapshotWithSources(manifest = proposalPublishingManifest(), options = {}) {
  const sourceRecords = proposalSourceRecordsFromManifest(manifest);
  if (options.persist) proposal.sourceRecords = structuredClone(sourceRecords);
  return {
    ...structuredClone(proposal),
    sourceRecords
  };
}

function normalizeProposalRecord(value = {}) {
  const next = {
    ...defaultProposal(),
    ...structuredClone(value || {})
  };
  const sections = Array.isArray(next.includedSections) ? next.includedSections : defaultProposal().includedSections;
  next.includedSections = uniqueValues(sections.filter((section) => proposalSectionLabels[section]));
  if (!next.includedSections.length) next.includedSections = [...defaultProposal().includedSections];
  if (!proposalTemplatePresets[next.publishingTemplate]) next.publishingTemplate = "directMail";
  if (!proposalAudienceLabels[next.outputAudience]) next.outputAudience = "client";
  if (!proposalOutputScopeLabels[next.outputScope]) next.outputScope = "both";
  if (!["package", "detail", "type"].includes(next.pricingMode)) next.pricingMode = "package";
  next.templateMeta = normalizeProposalTemplateMeta(next.templateMeta);
  next.sourceRecords = normalizeProposalSourceRecords(next.sourceRecords);
  return next;
}

function normalizeProposalTemplateMeta(value = null) {
  if (!value || typeof value !== "object") return null;
  const source = proposalCatalogEntry(value.sourceTemplateId);
  if (!source) return null;
  return {
    sourceTemplateId: source.id,
    sourceName: source.name,
    sourceFile: source.file,
    sourceChecksum: source.checksum,
    displayName: String(value.displayName || source.name).trim() || source.name,
    category: source.category,
    basePreset: value.basePreset || proposalStarterEntry(source.id)?.basePreset || "directMail",
    sourceRevision: asNumber(value.sourceRevision || 1) || 1,
    starterStatus: value.starterStatus || (proposalStarterEntry(source.id) ? "sanitized-starter" : "catalog-metadata")
  };
}

function normalizeProposalSourceRecords(value = {}) {
  const sourceArray = Array.isArray(value)
    ? value
    : Object.entries(value || {}).map(([collection, source]) => ({ collection, ...(source || {}) }));
  return sourceArray.reduce((memo, source) => {
    const type = recordTypeFor(source.collection);
    if (!type || !source.number || String(source.number).toLowerCase() === "draft") return memo;
    memo[source.collection] = {
      number: source.collection === "estimates" ? normalizeEstimateNumber(source.number) : String(source.number || ""),
      version: asNumber(source.version || 1) || 1,
      label: source.label || type.label,
      status: source.status || "",
      statusLabel: source.statusLabel || ""
    };
    return memo;
  }, {});
}

function restoreProposalSourceReferences(sourceRecords = proposal.sourceRecords, options = {}) {
  const skipCollections = new Set(options.skipCollections || []);
  const normalized = normalizeProposalSourceRecords(sourceRecords);
  Object.entries(normalized).forEach(([collection, source]) => {
    if (skipCollections.has(collection) || !Object.prototype.hasOwnProperty.call(activeWorkspaceRecords, collection)) return;
    activeWorkspaceRecords[collection] = source.number;
  });
  const workspace = workspaceByNumber(currentWorkspaceNumber);
  if (workspace) {
    workspace.activeRecords = { ...(workspace.activeRecords || {}), ...activeWorkspaceRecords };
    saveWorkspaces();
  }
  refreshRecordNumbers();
  renderTabRecordIndicators();
}

function proposalSourceMemoryLabel(source) {
  const stored = normalizeProposalSourceRecords(proposal.sourceRecords)[source.collection];
  const currentNumber = source.collection === "estimates" ? normalizeEstimateNumber(source.number) : source.number;
  if (!stored) return "Pointer saves with proposal";
  const versionText = stored.version ? ` v${stored.version}` : "";
  if (stored.number === currentNumber) return `Saved pointer ${stored.number}${versionText}`;
  return `Saved pointer ${stored.number}${versionText}; current ${currentNumber || "draft"}`;
}

function proposalPublishingReadiness() {
  const manifest = proposalPublishingManifest();
  return manifest.sources.reduce((result, source) => {
    if (source.status === "needs-save") result.needsSave.push(source.display || source.label);
    if (source.status === "needs-attach") result.needsAttach.push(source.display || source.label);
    return result;
  }, {
    needsSave: [],
    needsAttach: []
  });
}

function summarizeSourceList(items, maxVisible = 3) {
  const visible = items.slice(0, maxVisible).join(", ");
  const hiddenCount = items.length - maxVisible;
  return hiddenCount > 0 ? `${visible} + ${hiddenCount} more` : visible;
}

function proposalPublishingReadinessItems() {
  const { needsSave, needsAttach } = proposalPublishingReadiness();
  const items = [];
  if (needsSave.length) {
    items.push({
      tone: "warning",
      label: "Preflight: save drafts",
      text: "Preflight: save drafts",
      detail: `Save current tab records so the final output uses stored versions: ${summarizeSourceList(needsSave)}.`,
      action: "save-sources",
      actionLabel: "Save sources",
      bannerText: "Save source records before final PDF/CSV."
    });
  }
  if (needsAttach.length) {
    items.push({
      tone: "warning",
      label: "Preflight: attach library records",
      text: "Preflight: attach library records",
      detail: `Attach library records to this workspace before final output: ${summarizeSourceList(needsAttach)}.`,
      action: "attach-sources",
      actionLabel: "Attach sources",
      bannerText: "Attach selected source records to the workspace."
    });
  }
  if (!items.length) {
    items.push({
      tone: "good",
      label: "Preflight ready",
      text: "Ready: selected sections use saved records",
      detail: "Selected sections use saved records."
    });
  }
  return { items, needsSave, needsAttach };
}

function renderProposalPublishingReadiness() {
  if (!els.proposalPublishReadiness) return;
  const { items, needsSave, needsAttach } = proposalPublishingReadinessItems();
  const hasWarnings = Boolean(needsSave.length || needsAttach.length);
  const warningCount = needsSave.length + needsAttach.length;
  const summaryText = hasWarnings
    ? `${warningCount} source record${warningCount === 1 ? "" : "s"} need attention before final output`
    : "Selected sections use saved records";

  els.proposalPublishReadiness.classList.toggle("is-ready", !needsSave.length && !needsAttach.length);
  els.proposalPublishReadiness.classList.toggle("has-warning", hasWarnings);
  els.proposalPublishReadiness.innerHTML = `
    <div class="readiness-pill ${hasWarnings ? "warning" : "good"}" title="${escapeHtml(summaryText)}">
      <details class="readiness-details">
        <summary>
          <strong>Preflight</strong>
          <small>${escapeHtml(summaryText)}</small>
        </summary>
        <div class="readiness-detail-list">
          ${items.map((item) => `
            <span>
              <strong>${escapeHtml(item.label || item.text)}</strong>
              ${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ""}
            </span>
          `).join("")}
        </div>
      </details>
      ${hasWarnings ? `
        <div class="readiness-actions">
          ${items.filter((item) => item.action).map((item) => `
            <button class="ghost-btn compact-btn readiness-action-btn" type="button" data-readiness-action="${escapeHtml(item.action)}">${escapeHtml(item.actionLabel || "Resolve")}</button>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function renderProposalPublishingManifestReadout() {
  if (!els.proposalPublishManifest) return;
  const manifest = proposalPublishingManifest();
  els.proposalPublishManifest.classList.toggle("is-ready", manifest.ready);
  els.proposalPublishManifest.classList.toggle("has-warning", !manifest.ready);
  els.proposalPublishManifest.innerHTML = `
    <details class="manifest-source-details">
      <summary>
        <strong>Source records</strong>
        <span>${escapeHtml(manifest.ready ? `${manifest.sources.length} ready` : `${manifest.sources.length} sources / ${manifest.warnings.length} issue${manifest.warnings.length === 1 ? "" : "s"}`)}</span>
      </summary>
      <div class="manifest-source-list">
        ${manifest.sources.map((source) => `
          <button class="manifest-source ${escapeHtml(source.status)}" type="button" data-manifest-source="${escapeHtml(source.collection)}" title="${escapeHtml(`Open ${source.display || source.label}`)}">
            <strong>${escapeHtml(source.label)}</strong>
            <em>${escapeHtml(source.number || "Draft")}</em>
            <small>${escapeHtml(source.statusLabel)}</small>
            <small class="manifest-source-memory">${escapeHtml(proposalSourceMemoryLabel(source))}</small>
          </button>
        `).join("")}
      </div>
    </details>
  `;
}

async function saveProposalManifestSources() {
  const manifest = proposalPublishingManifest();
  const collections = uniqueValues(manifest.sources
    .filter((source) => source.status === "needs-save")
    .map((source) => source.collection));
  if (!collections.length) {
    setSaveStatus("No manifest sources need saving");
    return;
  }

  const orderedCollections = [
    // Save proposal last so its saved publish manifest captures resolved source states.
    ...collections.filter((collection) => collection !== "proposals"),
    ...collections.filter((collection) => collection === "proposals")
  ];
  const saved = [];
  for (const collection of orderedCollections) {
    const savedRecordNumber = await saveWorkspaceRecordCollection(collection);
    if (!savedRecordNumber && collection === "estimates") {
      setSaveStatus("Estimate save failed; source manifest not complete");
      renderProposalPreview();
      return;
    }
    if (savedRecordNumber) saved.push(savedRecordNumber);
  }

  render();
  setActiveView("proposalView");
  setSaveStatus(saved.length
    ? `Saved ${saved.length} manifest source${saved.length === 1 ? "" : "s"}`
    : "No manifest sources saved");
}

async function attachProposalManifestSources() {
  const manifest = proposalPublishingManifest();
  const collections = uniqueValues(manifest.sources
    .filter((source) => source.status === "needs-attach")
    .map((source) => source.collection));
  if (!collections.length) {
    setSaveStatus("No manifest sources need attaching");
    return;
  }

  for (const collection of collections) {
    await attachLibraryRecordToWorkspace(collection);
  }

  render();
  setActiveView("proposalView");
  setSaveStatus(`Attached ${collections.length} manifest source${collections.length === 1 ? "" : "s"}`);
}

function renderProposalDraftBanner() {
  if (!els.proposalDraftBanner) return;
  const { items, needsSave, needsAttach } = proposalPublishingReadinessItems();
  const hasWarnings = Boolean(needsSave.length || needsAttach.length);
  els.proposalDraftBanner.hidden = !hasWarnings;
  els.proposalDraftBanner.innerHTML = hasWarnings
    ? `
      <strong>Draft preview</strong>
      <span>${escapeHtml(items.map((item) => item.bannerText || item.text).join(" / "))}</span>
    `
    : "";
}

function proposalTraceRecordValue(collection) {
  const type = recordTypeFor(collection);
  const number = activeRecordNumber(collection);
  if (number) return number;
  if (!type) return "Draft";
  return isLibraryRecordCollection(collection)
    ? nextLibraryRecordNumber(collection) || "Draft"
    : nextWorkspaceRecordNumber(collection, type.prefix, type.numberKey, type.start) || "Draft";
}

function proposalSourceSnapshotItems() {
  const manifest = proposalPublishingManifest();
  if (proposal.outputAudience !== "internal") {
    return [{ label: "Reference", value: manifest.proposalNumber }];
  }

  return [
    { label: "Workspace", value: manifest.workspaceNumber || "Unassigned" },
    ...manifest.sources.map((source) => ({
      label: source.label,
      value: source.number || "Draft"
    }))
  ];
}

function renderProposalSourceSnapshot() {
  if (!els.proposalSourceSnapshot) return;
  const items = proposalSourceSnapshotItems().filter((item) => item.value);
  els.proposalSourceSnapshot.classList.toggle("internal", proposal.outputAudience === "internal");
  els.proposalSourceSnapshot.innerHTML = items
    .map((item) => `
      <span>
        <strong>${escapeHtml(item.label)}</strong>
        ${escapeHtml(item.value)}
      </span>
    `)
    .join("");
}

function renderProposalPublishFooter() {
  if (!els.proposalPublishFooter) return;
  const manifest = proposalPublishingManifest();
  const date = els.estimateDate?.textContent || new Date().toLocaleDateString();
  const traceItems = proposalSourceSnapshotItems();
  const traceText = proposal.outputAudience === "internal"
    ? traceItems.map((item) => `${item.label} ${item.value}`).join(" / ")
    : `Reference ${manifest.proposalNumber}`;

  els.proposalPublishFooter.innerHTML = `
    <div>
      <strong>Sharpdots</strong>
      <span>${escapeHtml([manifest.templateLabel, manifest.audienceLabel, manifest.outputScopeLabel].join(" / "))}</span>
    </div>
    <div>
      <strong>${escapeHtml(date)}</strong>
      <span>${escapeHtml(traceText)}</span>
    </div>
  `;
}

function ensureProposalDefaults() {
  const client = els.clientName.value.trim();
  const projectName = els.projectName.value.trim();
  if (!proposal.preparedFor && client) proposal.preparedFor = client;
  if ((!proposal.title || proposal.title === "Proposal for Client") && client) proposal.title = `Proposal for ${client}`;
  if (!proposal.subtitle && projectName) proposal.subtitle = projectName;
}

function setProposalEditorValues() {
  ensureProposalDefaults();
  [
    [els.proposalTitle, "title"],
    [els.proposalSubtitle, "subtitle"],
    [els.proposalPreparedFor, "preparedFor"],
    [els.proposalPricingMode, "pricingMode"],
    [els.proposalPublishingTemplate, "publishingTemplate"],
    [els.proposalOutputAudience, "outputAudience"],
    [els.proposalOutputScope, "outputScope"],
    [els.proposalOverview, "overview"],
    [els.proposalAudience, "audience"],
    [els.proposalDeliverables, "deliverables"],
    [els.proposalValueNarrative, "valueNarrative"],
    [els.proposalNextSteps, "nextSteps"],
    [els.proposalTerms, "terms"]
  ].forEach(([input, key]) => {
    if (input && document.activeElement !== input) input.value = proposal[key] || "";
  });
  const included = proposalIncludedSections();
  els.proposalSectionToggles.forEach((input) => {
    input.checked = included.has(input.value);
  });
  renderProposalTemplateLibrary();
  renderProposalPublishingActions();
}

function renderProposalPublishingActions() {
  const included = [...proposalIncludedSections()];
  const matchesTemplate = proposalMatchesTemplatePreset();
  const readiness = proposalPublishingReadinessItems();
  const hasPublishWarnings = readiness.needsSave.length || readiness.needsAttach.length;
  const manifest = proposalPublishingManifest();
  const audienceName = proposalIsClientOutput() ? "Client" : "Internal";
  const audienceLower = audienceName.toLowerCase();
  const includedSources = included.map((section) => {
    const collection = proposalSectionCollections[section] || "proposals";
    const source = manifest.sources.find((candidate) => candidate.collection === collection);
    const hiddenForClient = proposalIsClientOutput() && !proposalSectionHasClientContent(section);
    return {
      section,
      collection,
      source,
      label: proposalSectionLabels[section] || section,
      hiddenForClient
    };
  });
  if (els.proposalPublishSummary) {
    els.proposalPublishSummary.innerHTML = `
      <div class="publishing-summary-head">
        <span>${escapeHtml(proposalTemplateLabels[proposal.publishingTemplate] || "Company template")}</span>
        <span>${escapeHtml(proposalAudienceLabels[proposal.outputAudience] || "Client output")}</span>
        <span>${escapeHtml(proposalOutputScopeLabels[proposal.outputScope] || "Costs + schedule")}</span>
        <span>${included.length.toLocaleString()} section${included.length === 1 ? "" : "s"}</span>
      </div>
      <details class="publishing-source-details">
        <summary>Review included sources</summary>
        <div class="publishing-source-strip" aria-label="Included output source tabs">
          ${includedSources.map((item) => `
            <button class="publishing-source-chip ${escapeHtml(item.hiddenForClient ? "client-hidden" : item.source?.status || "ready")}" type="button" data-publishing-source="${escapeHtml(item.collection)}" title="${escapeHtml(item.hiddenForClient ? `${item.label} is selected but hidden from client output until it has content.` : `Open ${item.source?.display || item.label}`)}">
              <strong>${escapeHtml(item.label)}</strong>
              <small>${escapeHtml(item.hiddenForClient ? "Hidden until content" : [item.source?.number || item.source?.display || "Draft", item.source?.statusLabel || "Ready"].filter(Boolean).join(" · "))}</small>
            </button>
          `).join("")}
        </div>
      </details>
    `;
  }
  renderProposalPublishingReadiness();
  renderProposalPublishingManifestReadout();
  if (els.proposalTemplateStatus) {
    els.proposalTemplateStatus.textContent = matchesTemplate ? "Matches fixed template" : "Modified from fixed template";
    els.proposalTemplateStatus.classList.toggle("modified", !matchesTemplate);
  }
  if (els.resetProposalTemplateBtn) {
    els.resetProposalTemplateBtn.disabled = matchesTemplate;
    els.resetProposalTemplateBtn.title = matchesTemplate
      ? "Current publishing setup already matches the selected fixed template."
      : "Restore the selected fixed template's pricing view, audience, output, and included sections.";
  }
  if (els.proposalPublishPdfBtn) {
    els.proposalPublishPdfBtn.classList.remove("ghost-btn");
    els.proposalPublishPdfBtn.textContent = hasPublishWarnings ? `Preview ${audienceName} PDF` : `${audienceName} PDF`;
    els.proposalPublishPdfBtn.title = hasPublishWarnings
      ? `Preview ${audienceLower} PDF is available, but save or attach the flagged records before final output.`
      : `Prepare a ${audienceLower} PDF from the selected publishing sections.`;
  }
  if (els.proposalPublishCsvBtn) {
    els.proposalPublishCsvBtn.classList.add("ghost-btn");
    els.proposalPublishCsvBtn.textContent = hasPublishWarnings ? `Preview ${audienceName} CSV` : `${audienceName} CSV`;
    els.proposalPublishCsvBtn.title = hasPublishWarnings
      ? `Preview ${audienceLower} CSV is available, but save or attach the flagged records before final output.`
      : `Export a ${audienceLower} CSV from the selected publishing sections.`;
  }
  if (els.proposalSignatureBtn) {
    els.proposalSignatureBtn.disabled = true;
    els.proposalSignatureBtn.textContent = "Handoff later";
    els.proposalSignatureBtn.title = "Document signing and payment platform handoff will be connected later.";
  }
  if (els.proposalPublishNote) {
    els.proposalPublishNote.textContent = hasPublishWarnings
      ? `${audienceName} preview output is available; save or attach flagged records before final output.`
      : `Ready for ${audienceLower} PDF or CSV output. Document signing/payment handoff will be connected later.`;
  }
}

function proposalLineName(row) {
  if (row.level === "package") return row.packageName;
  if (row.level === "product") return row.product;
  return row.element || row.product;
}

function proposalPricingRows() {
  if (proposal.pricingMode === "detail") {
    return activeLeafRowsForProposal()
      .sort((a, b) => a.packageName.localeCompare(b.packageName) || proposalLineName(a).localeCompare(proposalLineName(b)))
      .map((row) => {
        const calc = calculate(row);
        return {
          name: proposalLineName(row),
          context: [row.packageName, row.sku, row.type && typeLabels[row.type]].filter(Boolean).join(" / "),
          qty: calc.qty,
          unit: calc.qty ? calc.clientPrice / calc.qty : calc.clientPrice,
          total: calc.clientPrice
        };
      });
  }

  if (proposal.pricingMode === "type") {
    const totals = activeLeafRowsForProposal().reduce((memo, row) => {
      const type = row.type || "MP";
      if (!memo[type]) memo[type] = { qty: 0, total: 0, count: 0 };
      const calc = calculate(row);
      memo[type].qty += calc.qty;
      memo[type].total += calc.clientPrice;
      memo[type].count += 1;
      return memo;
    }, {});
    return Object.entries(totals)
      .filter(([, total]) => total.total)
      .map(([type, total]) => ({
        name: `${type} - ${typeLabels[type] || "Production"}`,
        context: `${total.count} active line item${total.count === 1 ? "" : "s"}`,
        qty: total.qty,
        unit: total.qty ? total.total / total.qty : total.total,
        total: total.total
      }));
  }

  return packageRows()
    .filter((row) => row.active)
    .sort((a, b) => a.sourceOrder - b.sourceOrder)
    .map((row) => {
      const calc = calculate(row);
      const childCount = descendantsOf(row).filter((child) => child.active && (child.level === "element" || child.level === "product")).length;
      return {
        name: row.packageName,
        context: row.description || `${childCount} active component${childCount === 1 ? "" : "s"}`,
        qty: calc.qty,
        unit: calc.qty ? calc.clientPrice / calc.qty : calc.clientPrice,
        total: calc.clientPrice
      };
    });
}

function renderProposalPricing() {
  const totals = proposalTotals();
  const rowsForPricing = proposalPricingRows();
  document.querySelector(".proposal-pricing-section")?.toggleAttribute("hidden", proposalIsClientOutput() && !rowsForPricing.length);
  if (proposalIsClientOutput() && !rowsForPricing.length) return;
  const internalOutput = proposal.outputAudience === "internal";
  const modeLabels = internalOutput ? {
    package: "Active package rows from the estimate grid",
    detail: "Active product and element rows from the estimate grid",
    type: "Active line items grouped by production type"
  } : {
    package: "Selected project pricing",
    detail: "Detailed project line items",
    type: "Project pricing grouped by production type"
  };
  els.proposalPricingNote.textContent = modeLabels[proposal.pricingMode] || modeLabels.package;
  els.proposalPricingTotal.textContent = money(totals.client, 0);
  els.proposalPricingSummary.innerHTML = `
    <div><span>Total</span><strong>${money(totals.client, 2)}</strong></div>
    <div><span>Quantity</span><strong>${Math.round(totals.qty).toLocaleString()}</strong></div>
    <div><span>Weighted PPP</span><strong>${money(totals.weightedPpp, 3)}</strong></div>
    <div><span>Packages</span><strong>${totals.packageCount}</strong></div>
  `;

  if (!rowsForPricing.length) {
    els.proposalPricingLines.innerHTML = `<div class="proposal-empty">No active pricing rows yet.</div>`;
    return;
  }

  els.proposalPricingLines.innerHTML = `
    <div class="proposal-line header">
      <span>Item</span>
      <span>Qty</span>
      <span>Unit</span>
      <span>Total</span>
    </div>
    ${rowsForPricing.map((row) => `
      <div class="proposal-line">
        <span><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(row.context)}</small></span>
        <span>${Math.round(row.qty).toLocaleString()}</span>
        <span>${money(row.unit, 3)}</span>
        <span>${money(row.total, 2)}</span>
      </div>
    `).join("")}
  `;
}

function proposalRecordSourceLabel(collection, fallback) {
  return activeRecordNumber(collection) || document.querySelector(`[data-record-type="${collection}"] .tab-record-identity strong`)?.textContent || fallback;
}

function proposalIsClientOutput() {
  return proposal.outputAudience !== "internal";
}

function printQuoteHasClientContent() {
  const defaults = defaultPrintQuote();
  return Boolean(
    (printQuote.name && printQuote.name !== defaults.name)
    || (printQuote.source && printQuote.source !== defaults.source)
    || printQuote.externalRef
    || printQuote.sourceUrl
    || (printQuote.notes && printQuote.notes !== defaults.notes)
  );
}

function ecommPriceListHasClientContent() {
  const defaults = defaultEcommPriceList();
  return Boolean(
    (ecommPriceList.name && ecommPriceList.name !== defaults.name)
    || (ecommPriceList.channel && ecommPriceList.channel !== defaults.channel)
    || ecommPriceList.externalRef
    || ecommPriceList.sourceUrl
    || (ecommPriceList.notes && ecommPriceList.notes !== defaults.notes)
  );
}

function proposalSectionHasClientContent(section) {
  if (section === "copy") return true;
  if (section === "estimate") return proposal.outputScope === "schedule" || proposalPricingRows().length > 0;
  if (section === "schedule") return proposal.outputScope === "costs" || proposalPaymentRows().length > 0;
  if (section === "services") {
    return serviceActiveCalcRows()
      .map((row) => serviceCalc(row))
      .some((calc) => calc.activationPrice || calc.monthlyPrice);
  }
  if (section === "sourcing") return sourcingHasQuotes(sourcing);
  if (section === "printQuote") return printQuoteHasClientContent();
  if (section === "ecomm") return ecommPriceListHasClientContent();
  return true;
}

function renderProposalServicesOutput() {
  if (!els.proposalServicesSection) return;
  const visible = proposalHasSection("services");
  els.proposalServicesSection.toggleAttribute("hidden", !visible);
  if (!visible) return;

  const totals = serviceTotals();
  const isMonthlyMode = serviceTermMode() === "monthly";
  const termPrice = (isMonthlyMode ? 0 : totals.activationPrice) + totals.monthlyPrice * totals.termMonths;
  const sourceLabel = proposalRecordSourceLabel("services", "Current services draft");
  const rowsForOutput = serviceActiveCalcRows()
    .map((row) => ({ row, calc: serviceCalc(row) }))
    .filter(({ calc }) => calc.activationPrice || calc.monthlyPrice)
    .sort((a, b) => b.calc.monthlyPrice - a.calc.monthlyPrice)
    .slice(0, 8);
  if (proposalIsClientOutput() && !rowsForOutput.length) {
    els.proposalServicesSection.hidden = true;
    return;
  }

  els.proposalServicesNote.textContent = !proposalIsClientOutput()
    ? `From ${sourceLabel} / ${serviceScenarioNames[serviceScenario] || "Service calculation"}`
    : `${serviceScenarioNames[serviceScenario] || "Services package"} execution plan`;
  els.proposalServicesTotal.textContent = money(termPrice, 2);
  els.proposalServicesSummary.innerHTML = `
    <div><span>Activation</span><strong>${isMonthlyMode ? "$0.00" : money(totals.activationPrice, 2)}</strong></div>
    <div><span>Monthly</span><strong>${money(totals.monthlyPrice, 2)}</strong></div>
    <div><span>Term</span><strong>${totals.termMonths} mo</strong></div>
    <div><span>Appointments / Mo</span><strong>${decimal(totals.appointments, 1)}</strong></div>
  `;
  els.proposalServicesLines.innerHTML = rowsForOutput.length ? `
    <div class="proposal-output-line header">
      <span>Component</span>
      <span>Platform</span>
      <span>Activation</span>
      <span>Monthly</span>
    </div>
    ${rowsForOutput.map(({ row, calc }) => `
      <div class="proposal-output-line">
        <span><strong>${escapeHtml(row.item)}</strong><small>${escapeHtml(row.costType || "")}</small></span>
        <span>${escapeHtml(row.platform || "")}</span>
        <span>${money(calc.activationPrice, 2)}</span>
        <span>${money(calc.monthlyPrice, 2)}</span>
      </div>
    `).join("")}
  ` : `<div class="proposal-empty">No active service calculator rows yet.</div>`;
}

function proposalPaymentRows() {
  const totalsByType = paymentTotalsByType();
  return Object.entries(totalsByType).flatMap(([type, total]) => {
    if (!total) return [];
    const settings = paymentSettingFor(type);
    const depositCount = settings.depositCount;
    const depositPct = settings.depositPct;
    const paymentCount = settings.paymentCount;
    const balancePct = depositCount ? 1 - depositPct : 1;
    let typeBalance = total;
    const entries = [
      ...Array.from({ length: depositCount }, () => ["Deposit", total * depositPct, `${decimal(depositPct * 100, 0)}%`]),
      ...Array.from({ length: paymentCount }, (_, index) => [`Balance ${index + 1}`, paymentCount ? (balancePct * total) / paymentCount : 0, paymentCount ? `${decimal((balancePct * 100) / paymentCount, 1)}%` : "0%"])
    ];
    return entries.map(([label, amount, note], index) => {
      const key = `${type}-${label.toLowerCase().replace(/\s+/g, "-")}`;
      const legacyDate = depositCount ? paymentDates[`${type}-${index}`] : "";
      const date = paymentDates[key] || legacyDate || "";
      typeBalance = Math.max(typeBalance - amount, 0);
      return { date, type, typeLabel: typeLabels[type], label, note, amount, typeBalance };
    });
  }).sort((a, b) => {
    if (!a.date && !b.date) return a.type.localeCompare(b.type) || a.label.localeCompare(b.label);
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date) || a.type.localeCompare(b.type) || a.label.localeCompare(b.label);
  });
}

function renderProposalScheduleOutput() {
  if (!els.proposalScheduleSection) return;
  const visible = proposalHasSection("schedule") && proposal.outputScope !== "costs";
  els.proposalScheduleSection.toggleAttribute("hidden", !visible);
  if (!visible) return;
  const rowsForSchedule = proposalPaymentRows();
  if (proposalIsClientOutput() && !rowsForSchedule.length) {
    els.proposalScheduleSection.hidden = true;
    return;
  }
  const total = rowsForSchedule.reduce((sum, row) => sum + row.amount, 0);
  els.proposalScheduleNote.textContent = !proposalIsClientOutput()
    ? `From ${proposalRecordSourceLabel("estimates", "current estimate")} payment settings`
    : "Payment timing by production type";
  els.proposalScheduleTotal.textContent = money(total, 2);
  els.proposalScheduleLines.innerHTML = rowsForSchedule.length ? `
    <div class="proposal-output-line schedule-line header">
      <span>Date</span>
      <span>Type</span>
      <span>Payment</span>
      <span>Amount</span>
    </div>
    ${rowsForSchedule.map((row) => `
      <div class="proposal-output-line schedule-line">
        <span>${escapeHtml(row.date || "TBD")}</span>
        <span>${escapeHtml(`${row.type} - ${row.typeLabel}`)}<small>${money(row.typeBalance, 2)} balance</small></span>
        <span>${escapeHtml(row.label)}<small>${escapeHtml(row.note)}</small></span>
        <span>${money(row.amount, 2)}</span>
      </div>
    `).join("")}
  ` : `<div class="proposal-empty">No payment schedule rows yet.</div>`;
}

function proposalSourcingPreviewRows(options = {}) {
  const source = sourcingHasQuotes(sourcing) ? sourcing : (rows.length ? buildSampleSourcingForRows(rows) : { quotes: {}, selected: {} });
  const entries = sourcingLeafRows().flatMap((row) => (source.quotes[row.id] || []).map((quote) => {
    const selected = source.selected[row.id] || {};
    const priceBreak = quote.breaks?.find((candidate) => candidate.id === selected.breakId && quote.id === selected.quoteId)
      || quote.breaks?.[0]
      || { qty: 0, unitCost: 0 };
    return { row, quote, priceBreak, calc: quoteBreakCalc(quote, priceBreak), isSelected: selected.quoteId === quote.id };
  })).filter((entry) => entry.isSelected || !source.selected[entry.row.id]);

  if (entries.length) return entries.slice(0, 8);

  if (!options.includeSamples) return [];

  return [
    { sample: true, item: "Carton Elite 10x10x6", vendor: "Shenzhen Packaging Co.", forwarder: "Pacific Bridge Logistics", qty: 5000, landedUnitCost: 1.84, landedTotal: 9200, status: "Sample" },
    { sample: true, item: "Door Hanger 4.25x11", vendor: "Hangzhou Print Works", forwarder: "Pacific Bridge Logistics", qty: 11000, landedUnitCost: 0.21, landedTotal: 2310, status: "Sample" },
    { sample: true, item: "Window Sticker 5in", vendor: "Ningbo Label Group", forwarder: "CFS Forwarding", qty: 11000, landedUnitCost: 0.17, landedTotal: 1870, status: "Sample" }
  ];
}

function renderProposalSourcingOutput() {
  if (!els.proposalSourcingSection) return;
  const visible = proposalHasSection("sourcing");
  els.proposalSourcingSection.toggleAttribute("hidden", !visible);
  if (!visible) return;

  const sourceLabel = proposalRecordSourceLabel("sourcing", "Current sourcing draft");
  const hasRealQuotes = sourcingHasQuotes(sourcing);
  if (proposalIsClientOutput() && !hasRealQuotes) {
    els.proposalSourcingSection.hidden = true;
    return;
  }
  const includeSamples = !proposalIsClientOutput();
  const entries = proposalSourcingPreviewRows({ includeSamples });
  const selectedTotal = entries.reduce((sum, entry) => sum + (entry.sample ? entry.landedTotal : entry.calc.landedTotal), 0);
  els.proposalSourcingNote.textContent = !proposalIsClientOutput()
    ? hasRealQuotes
      ? `From ${sourceLabel} / selected supplier quotes`
      : `Sample sourcing output / replace with selected ${sourceLabel} quotes`
    : hasRealQuotes
      ? "Selected supplier pricing summary"
      : "Sourcing details will be added when selected quotes are available";
  els.proposalSourcingTotal.textContent = money(selectedTotal, 2);
  els.proposalSourcingLines.innerHTML = `
    <div class="proposal-output-line header">
      <span>Item</span>
      <span>Manufacturer</span>
      <span>Forwarder</span>
      <span>Landed</span>
    </div>
    ${entries.map((entry) => {
      if (entry.sample) {
        return `
          <div class="proposal-output-line sample-line">
            <span><strong>${escapeHtml(entry.item)}</strong><small>${escapeHtml(entry.status)}</small></span>
            <span>${escapeHtml(entry.vendor)}</span>
            <span>${escapeHtml(entry.forwarder)}</span>
            <span>${money(entry.landedUnitCost, 3)}<small>${money(entry.landedTotal, 2)} total</small></span>
          </div>
        `;
      }
      return `
        <div class="proposal-output-line">
          <span><strong>${escapeHtml(rowDisplayName(entry.row))}</strong><small>${escapeHtml(sourcingItemCode(entry.row))}</small></span>
          <span>${escapeHtml(entry.quote.vendorName || "Unassigned")}</span>
          <span>${escapeHtml(entry.quote.forwarderName || "Unassigned")}</span>
          <span>${money(entry.calc.landedUnitCost, 3)}<small>${money(entry.calc.landedTotal, 2)} total</small></span>
        </div>
      `;
    }).join("")}
  `;
}

function renderProposalPlaceholderOutput() {
  if (els.proposalPrintQuoteSection) {
    const visible = proposalHasSection("printQuote");
    els.proposalPrintQuoteSection.toggleAttribute("hidden", !visible);
    if (visible) {
      syncPlaceholderDraftsFromInputs();
      if (proposalIsClientOutput() && !printQuoteHasClientContent()) {
        els.proposalPrintQuoteSection.hidden = true;
        return;
      }
      const printRef = !proposalIsClientOutput() ? [printQuote.externalRef && `Ref ${printQuote.externalRef}`, printQuote.sourceUrl].filter(Boolean).join(" / ") : "";
      const printMeta = !proposalIsClientOutput()
        ? [printQuote.source || "Print source pending", printRef].filter(Boolean).join(" / ")
        : "Print details pending";
      els.proposalPrintQuoteNote.textContent = !proposalIsClientOutput()
        ? `From ${proposalRecordSourceLabel("printQuotes", "Current print quote draft")}`
        : "Print quote summary";
      els.proposalPrintQuoteLines.innerHTML = `
        <div class="proposal-output-line compact">
          <span><strong>${escapeHtml(printQuote.name || "Print Quote Draft")}</strong><small>${escapeHtml(printMeta)}</small></span>
          <span>${escapeHtml(printQuote.notes || (!proposalIsClientOutput() ? "Print quote details will appear here after the print quote app is merged." : "Print quote details will be included when available."))}</span>
        </div>
      `;
    }
  }
  if (els.proposalEcommSection) {
    const visible = proposalHasSection("ecomm");
    els.proposalEcommSection.toggleAttribute("hidden", !visible);
    if (visible) {
      syncPlaceholderDraftsFromInputs();
      if (proposalIsClientOutput() && !ecommPriceListHasClientContent()) {
        els.proposalEcommSection.hidden = true;
        return;
      }
      const ecommRef = !proposalIsClientOutput() ? [ecommPriceList.externalRef && `Ref ${ecommPriceList.externalRef}`, ecommPriceList.sourceUrl].filter(Boolean).join(" / ") : "";
      const ecommMeta = !proposalIsClientOutput()
        ? [ecommPriceList.channel || "Channel pending", ecommRef].filter(Boolean).join(" / ")
        : ecommPriceList.channel || "Ecomm details pending";
      els.proposalEcommNote.textContent = !proposalIsClientOutput()
        ? `From ${proposalRecordSourceLabel("ecomm", "Current ecomm price list draft")}`
        : "Ecomm price list summary";
      els.proposalEcommLines.innerHTML = `
        <div class="proposal-output-line compact">
          <span><strong>${escapeHtml(ecommPriceList.name || "Ecomm Price List Draft")}</strong><small>${escapeHtml(ecommMeta)}</small></span>
          <span>${escapeHtml(ecommPriceList.notes || (!proposalIsClientOutput() ? "Ecomm price list details will appear here after the ecomm app is merged." : "Ecomm price list details will be included when available."))}</span>
        </div>
      `;
    }
  }
}

function renderProposalOutputs() {
  renderProposalScheduleOutput();
  renderProposalServicesOutput();
  renderProposalSourcingOutput();
  renderProposalPlaceholderOutput();
}

function proposalPreviewEditableMap() {
  return [
    [els.proposalPreviewTitle, "title"],
    [els.proposalPreviewSubtitle, "subtitle"],
    [els.proposalPreviewPreparedFor, "preparedFor"],
    [els.proposalPreviewOverview, "overview"],
    [els.proposalPreviewAudience, "audience"],
    [els.proposalPreviewDeliverables, "deliverables"],
    [els.proposalPreviewValueNarrative, "valueNarrative"],
    [els.proposalPreviewNextSteps, "nextSteps"],
    [els.proposalPreviewTerms, "terms"]
  ].filter(([element]) => element);
}

function syncProposalPreviewEditableState() {
  proposalPreviewEditableMap().forEach(([element, key]) => {
    element.toggleAttribute("contenteditable", proposalPreviewEditMode);
    element.classList.toggle("editable-copy-field", proposalPreviewEditMode);
    element.dataset.proposalField = key;
    element.setAttribute("spellcheck", "true");
    element.setAttribute("aria-label", `Edit ${key}`);
  });
  document.querySelector(".proposal-page")?.classList.toggle("editing-copy", proposalPreviewEditMode);
  if (els.proposalEditPreviewBtn) {
    els.proposalEditPreviewBtn.setAttribute("aria-pressed", String(proposalPreviewEditMode));
    els.proposalEditPreviewBtn.textContent = proposalPreviewEditMode ? "Lock Copy" : "Edit Copy";
  }
  if (els.proposalPreviewEditStatus) {
    els.proposalPreviewEditStatus.textContent = proposalPreviewEditMode
      ? "Narrative fields editable"
      : "Pricing and operational sections locked";
  }
}

function setProposalPreviewText(element, key, value) {
  if (!element || document.activeElement === element) return;
  if (["overview", "audience", "deliverables", "valueNarrative", "nextSteps", "terms"].includes(key)) {
    element.innerHTML = textWithBreaks(value);
  } else {
    element.textContent = value || "";
  }
}

function updateProposalFromPreviewField(element) {
  const key = element?.dataset?.proposalField;
  if (!proposalNarrativeFields.includes(key)) return;
  proposal[key] = String(element.innerText || element.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
  setProposalEditorValues();
  touchWorkspaceRecord("proposals");
  renderProposalPublishingActions();
  renderProposalPublishFooter();
}

function renderProposalPreview() {
  if (!els.proposalView) return;
  ensureProposalDefaults();
  renderProposalPublishingActions();
  setProposalPreviewText(els.proposalPreviewTitle, "title", proposal.title || "Proposal");
  setProposalPreviewText(els.proposalPreviewSubtitle, "subtitle", proposal.subtitle || els.projectName.value || "");
  setProposalPreviewText(els.proposalPreviewPreparedFor, "preparedFor", proposal.preparedFor || els.clientName.value || "Client");
  els.proposalPreviewProject.textContent = els.projectName.value || "Untitled Project";
  els.proposalPreviewDate.textContent = els.estimateDate.textContent || new Date().toLocaleDateString();
  setProposalPreviewText(els.proposalPreviewOverview, "overview", proposal.overview);
  setProposalPreviewText(els.proposalPreviewAudience, "audience", proposal.audience);
  setProposalPreviewText(els.proposalPreviewDeliverables, "deliverables", proposal.deliverables);
  setProposalPreviewText(els.proposalPreviewValueNarrative, "valueNarrative", proposal.valueNarrative);
  setProposalPreviewText(els.proposalPreviewNextSteps, "nextSteps", proposal.nextSteps);
  setProposalPreviewText(els.proposalPreviewTerms, "terms", proposal.terms);
  syncProposalPreviewEditableState();
  renderProposalDraftBanner();
  renderProposalSourceSnapshot();
  renderProposalPublishFooter();
  const showCopy = proposalHasSection("copy");
  document.querySelectorAll(".proposal-copy-grid").forEach((section) => section.toggleAttribute("hidden", !showCopy));
  document.querySelector(".proposal-pricing-section")?.toggleAttribute("hidden", !(proposalHasSection("estimate") && proposal.outputScope !== "schedule"));
  renderProposalPricing();
  renderProposalOutputs();
}

function renderProposal() {
  setProposalEditorValues();
  renderProposalPreview();
}

function serviceNormalizeCostCenter(value) {
  return String(value || "").toLowerCase() === "salesarmy" ? "SalesArmy" : "Sharpdots";
}

function serviceVisibleRows() {
  return serviceRows.filter((row) => row.scenario === serviceScenario || row.scenario === "salesmachine");
}

function serviceChildren(row) {
  return serviceVisibleRows().filter((candidate) => candidate.parentId === row.id);
}

function serviceActiveCalcRows() {
  return serviceVisibleRows().filter((row) => row.active && !serviceChildren(row).some((child) => child.active));
}

function servicePlatformValues() {
  return uniqueValues([
    "SalesMachine",
    "ZoomInfo",
    "Apollo",
    "Leadpipe",
    "Audience Lab",
    "Smartlead",
    "ThorsHammer",
    "Bison",
    "Spaceship",
    "Email warmup",
    "HighLevel",
    "HubSpot",
    "Calendly",
    "RevReply",
    "LATAM BPO / Deel",
    "Koncert",
    "CallBlitz",
    "Aloware",
    "Kixie",
    "HeyReach",
    "GetLia",
    "Sharpdots DSP",
    "Drop.co",
    ...serviceRows.map((row) => row.platform)
  ]);
}

function serviceCalc(row) {
  const children = serviceChildren(row).filter((child) => child.active);
  if (children.length) {
    return children.reduce(
      (memo, child) => {
        const calc = serviceCalc(child);
        memo.activationCost += calc.activationCost;
        memo.monthlyCost += calc.monthlyCost;
        memo.activationPrice += calc.activationPrice;
        memo.monthlyPrice += calc.monthlyPrice;
        return memo;
      },
      { activationCost: 0, monthlyCost: 0, activationPrice: 0, monthlyPrice: 0 }
    );
  }
  const quantity = Math.max(asNumber(row.quantity), 0);
  const startup = asNumber(row.startup);
  const recurring = asNumber(row.recurring);
  const variable = asNumber(row.variable) * quantity;
  const startupMarkup = Math.max(asNumber(row.startupMarkup ?? row.markup), 0) / 100;
  const monthlyMarkup = Math.max(asNumber(row.monthlyMarkup ?? row.markup), 0) / 100;
  const activationCost = startup;
  const monthlyCost = recurring + variable;
  return {
    activationCost,
    monthlyCost,
    activationPrice: activationCost * (1 + startupMarkup),
    monthlyPrice: monthlyCost * (1 + monthlyMarkup)
  };
}

function serviceTermMode() {
  return document.querySelector("input[name='serviceTermMode']:checked")?.value || "initial";
}

function executionMetrics() {
  const dialsPerDay = asNumber(els.execDialsPerDay?.value);
  const daysPerWeek = asNumber(els.execDaysPerWeek?.value);
  const conversationsPerDay = asNumber(els.execConversationsPerDay?.value);
  const setsPerWeek = asNumber(els.execSetsPerWeek?.value);
  const showRate = asNumber(els.execShowRate?.value) / 100;
  const winRate = asNumber(els.execWinRate?.value) / 100;
  const dialsPerWeek = dialsPerDay * daysPerWeek;
  const conversationsPerWeek = conversationsPerDay * daysPerWeek;
  const setsPerMonth = setsPerWeek * 4;
  const meetingsPerMonth = setsPerMonth * showRate;
  const winsPerMonth = meetingsPerMonth * winRate;
  return { dialsPerDay, daysPerWeek, conversationsPerDay, dialsPerWeek, conversationsPerWeek, setsPerWeek, setsPerMonth, showRate, meetingsPerMonth, winRate, winsPerMonth };
}

function updateServiceAppointmentsFromExecution() {
  if (!els.serviceAppointments) return;
  els.serviceAppointments.value = decimal(executionMetrics().meetingsPerMonth, 1);
}

function serviceTotals() {
  const initialTermMonths = Math.max(Math.round(asNumber(els.serviceTermMonths?.value || 3)), 1);
  const ongoingTermMonths = Math.max(Math.round(asNumber(els.serviceOngoingMonths?.value || 1)), 1);
  const termMonths = serviceTermMode() === "monthly" ? ongoingTermMonths : initialTermMonths;
  const appointments = Math.max(asNumber(els.serviceAppointments?.value || 0), 0);
  return serviceActiveCalcRows().reduce(
    (memo, row) => {
      const calc = serviceCalc(row);
      const center = serviceNormalizeCostCenter(row.costCenter);
      memo.activationCost += calc.activationCost;
      memo.monthlyCost += calc.monthlyCost;
      memo.activationPrice += calc.activationPrice;
      memo.monthlyPrice += calc.monthlyPrice;
      memo.byCenter[center].activationCost += calc.activationCost;
      memo.byCenter[center].monthlyCost += calc.monthlyCost;
      memo.byCenter[center].activationPrice += calc.activationPrice;
      memo.byCenter[center].monthlyPrice += calc.monthlyPrice;
      memo.byType[row.costType] = memo.byType[row.costType] || { activationCost: 0, monthlyCost: 0, activationPrice: 0, monthlyPrice: 0 };
      memo.byType[row.costType].activationCost += calc.activationCost;
      memo.byType[row.costType].monthlyCost += calc.monthlyCost;
      memo.byType[row.costType].activationPrice += calc.activationPrice;
      memo.byType[row.costType].monthlyPrice += calc.monthlyPrice;
      return memo;
    },
    {
      termMonths,
      initialTermMonths,
      ongoingTermMonths,
      appointments,
      activationCost: 0,
      monthlyCost: 0,
      activationPrice: 0,
      monthlyPrice: 0,
      byCenter: {
        SalesArmy: { activationCost: 0, monthlyCost: 0, activationPrice: 0, monthlyPrice: 0 },
        Sharpdots: { activationCost: 0, monthlyCost: 0, activationPrice: 0, monthlyPrice: 0 }
      },
      byType: {}
    }
  );
}

function renderServiceRows() {
  const rowsForScenario = serviceVisibleRows();
  if (els.servicePlatformLookup) {
    els.servicePlatformLookup.innerHTML = servicePlatformValues().map((value) => `<option value="${escapeHtml(value)}"></option>`).join("");
  }
  const grouped = rowsForScenario.reduce((memo, row) => {
    memo[row.group] = memo[row.group] || [];
    memo[row.group].push(row);
    return memo;
  }, {});
  els.serviceRows.innerHTML = Object.entries(grouped).map(([group, groupRows]) => `
    <section class="service-group">
      <h3>
        <span>${escapeHtml(group)}</span>
        <small>${money(groupRows.filter((row) => row.active && !serviceChildren(row).some((child) => child.active)).reduce((sum, row) => sum + serviceCalc(row).activationPrice, 0), 2)} startup / ${money(groupRows.filter((row) => row.active && !serviceChildren(row).some((child) => child.active)).reduce((sum, row) => sum + serviceCalc(row).monthlyPrice, 0), 2)} monthly</small>
      </h3>
      <div class="service-row service-row-head">
        <span>Use</span>
        <span>Component</span>
        <span>Platform / Driver</span>
        <span>Cost Type</span>
        <span>Center</span>
        <span>Startup</span>
        <span>Monthly</span>
        <span>Unit Cost</span>
        <span>Qty</span>
        <span>Model</span>
        <span>Startup %</span>
        <span>Monthly %</span>
        <span>Monthly Price</span>
      </div>
      ${groupRows.filter((row) => row.level !== "element" || serviceExpanded.has(row.parentId)).map((row) => {
        const index = serviceRows.indexOf(row);
        const calc = serviceCalc(row);
        const children = serviceChildren(row);
        return `
          <div class="service-row ${row.level === "element" ? "service-element-row" : "service-product-row"}" data-index="${index}">
            <span class="service-use-cell">
              <input class="service-active" type="checkbox" ${row.active ? "checked" : ""} />
              ${children.length ? `<button class="service-chevron ghost-btn" type="button" title="Show or hide elements">${serviceExpanded.has(row.id) ? "⌄" : "›"}</button>` : ""}
            </span>
            <span><strong>${escapeHtml(row.item)}</strong><small>${escapeHtml(row.notes || "")}</small></span>
            <input class="service-platform" list="servicePlatformLookup" type="text" value="${escapeHtml(row.platform || "")}" />
            <select class="service-cost-type">
              ${["Services", "Platforms", "Assets", "Fractional Representatives", "Setup/Activation"].map((type) => `<option value="${type}" ${row.costType === type ? "selected" : ""}>${type}</option>`).join("")}
            </select>
            <select class="service-cost-center">
              ${["SalesArmy", "Sharpdots"].map((center) => `<option value="${center}" ${serviceNormalizeCostCenter(row.costCenter) === center ? "selected" : ""}>${center}</option>`).join("")}
            </select>
            <input class="service-startup" type="number" step="1" value="${decimal(row.startup, 0)}" />
            <input class="service-recurring" type="number" step="1" value="${decimal(row.recurring, 0)}" />
            <input class="service-variable" type="number" step="0.0001" value="${decimal(row.variable, 4)}" />
            <input class="service-quantity" type="number" step="1" value="${decimal(row.quantity, 0)}" />
            <select class="service-variable-model">
              ${["monthly", "each", "metered", "seat/account", "rep/month", "profiles", "asset", "budget", "activation"].map((model) => `<option value="${model}" ${row.variableModel === model ? "selected" : ""}>${model}</option>`).join("")}
            </select>
            <input class="service-startup-markup" type="number" step="5" value="${decimal(row.startupMarkup ?? row.markup, 0)}" />
            <input class="service-monthly-markup" type="number" step="5" value="${decimal(row.monthlyMarkup ?? row.markup, 0)}" />
            <strong>${money(calc.monthlyPrice, 2)}</strong>
          </div>
        `;
      }).join("")}
    </section>
  `).join("");
}

function renderServiceSummary() {
  const totals = serviceTotals();
  const isMonthlyMode = serviceTermMode() === "monthly";
  const termPrice = (isMonthlyMode ? 0 : totals.activationPrice) + totals.monthlyPrice * totals.termMonths;
  const appointmentCount = totals.appointments * totals.termMonths;
  els.serviceActivationPrice.textContent = isMonthlyMode ? "$0.00" : money(totals.activationPrice, 2);
  els.serviceMonthlyPrice.textContent = money(totals.monthlyPrice, 2);
  els.serviceTermPrice.textContent = money(termPrice, 2);
  els.serviceAppointmentPrice.textContent = money(appointmentCount ? termPrice / appointmentCount : 0, 2);
  els.serviceCostCenters.innerHTML = Object.entries(totals.byCenter).map(([center, total]) => `
    <div class="service-center-row">
      <strong>${center}</strong>
      <span>Activation cost ${money(total.activationCost, 2)}</span>
      <span>Monthly cost ${money(total.monthlyCost, 2)}</span>
      <span>Activation price ${money(total.activationPrice, 2)}</span>
      <span>Monthly price ${money(total.monthlyPrice, 2)}</span>
    </div>
  `).join("");
  els.serviceAssumptions.innerHTML = `
    <p><strong>${serviceScenarioNames[serviceScenario]}</strong></p>
    <p>Base SalesMachine includes cold email, strategy, copywriting, and standard/custom intent topic datastreams.</p>
    <p>Optional channels can be layered in for the client use case: fractional BDR, automated dialing, Cold LinkedIn, intent DSP ads, ringless voicemail, and other outbound surfaces.</p>
    <p>Costing types are separated as services, platforms, assets, fractional representatives, and setup/activation.</p>
  `;
  const metrics = executionMetrics();
  els.executionSummary.innerHTML = `
    <div><span>Dials / Week</span><strong>${Math.round(metrics.dialsPerWeek).toLocaleString()}</strong></div>
    <div><span>Conversations / Week</span><strong>${Math.round(metrics.conversationsPerWeek).toLocaleString()}</strong></div>
    <div><span>SETS / Month</span><strong>${Math.round(metrics.setsPerMonth).toLocaleString()}</strong></div>
    <div><span>Meetings / Month</span><strong>${decimal(metrics.meetingsPerMonth, 1)}</strong></div>
    <div><span>Wins / Month</span><strong>${decimal(metrics.winsPerMonth, 1)}</strong></div>
  `;
}

function renderServicesCalculator() {
  if (!els.servicesView) return;
  serviceScenario = els.serviceScenario.value || "salesmachine";
  updateServiceAppointmentsFromExecution();
  renderServiceRows();
  renderServiceSummary();
}

function normalizeSourcing(value = {}) {
  return {
    quotes: value.quotes && typeof value.quotes === "object" ? value.quotes : {},
    selected: value.selected && typeof value.selected === "object" ? value.selected : {}
  };
}

function defaultSourcingUi() {
  return {
    viewMode: "summary",
    search: "",
    sourceFilter: "all",
    statusFilter: "all",
    groupBy: "item",
    showAll: false,
    selectedRows: [],
    expandedRows: []
  };
}

function validSourcingViewModes() {
  return Array.from(els.sourcingViewModeButtons || [])
    .map((button) => button.dataset.sourcingViewMode)
    .filter(Boolean);
}

function sourcingUiSnapshot() {
  return {
    viewMode: sourcingViewMode,
    search: els.sourcingSearch?.value || "",
    sourceFilter: els.sourcingSourceFilter?.value || "all",
    statusFilter: els.sourcingStatusFilter?.value || "all",
    groupBy: els.sourcingGroupBy?.value || "item",
    showAll: Boolean(els.sourcingShowAll?.checked),
    selectedRows: Array.from(selectedSourcingRows),
    expandedRows: Array.from(sourcingExpandedRows)
  };
}

function sourcingDataSnapshot() {
  return {
    ...structuredClone(sourcing),
    ui: sourcingUiSnapshot()
  };
}

function applySourcingUiSnapshot(value = {}) {
  const ui = { ...defaultSourcingUi(), ...(value || {}) };
  const validModes = validSourcingViewModes();
  sourcingViewMode = validModes.includes(ui.viewMode) ? ui.viewMode : "summary";
  if (els.sourcingSearch) els.sourcingSearch.value = ui.search || "";
  if (els.sourcingSourceFilter) els.sourcingSourceFilter.value = ui.sourceFilter || "all";
  if (els.sourcingStatusFilter) els.sourcingStatusFilter.value = ui.statusFilter || "all";
  if (els.sourcingGroupBy) els.sourcingGroupBy.value = ui.groupBy || "item";
  if (els.sourcingShowAll) els.sourcingShowAll.checked = Boolean(ui.showAll);
  selectedSourcingRows = new Set(Array.isArray(ui.selectedRows) ? ui.selectedRows : []);
  sourcingExpandedRows = new Set(Array.isArray(ui.expandedRows) ? ui.expandedRows : []);
}

function resetSourcingUiState() {
  applySourcingUiSnapshot(defaultSourcingUi());
}

function sourcingHasQuotes(value = sourcing) {
  return Object.values(value.quotes || {}).some((quotes) => Array.isArray(quotes) && quotes.length);
}

function quoteIdFrom(row, suffix) {
  return `quote-${row.id}-${suffix}`;
}

function breakIdFrom(row, suffix) {
  return `break-${row.id}-${suffix}`;
}

function buildSampleQuote(row, suffix, overrides = {}) {
  const calc = calculate(row);
  const qty = Math.max(
    Math.round([overrides.qty, calc.qtyToOrder, calc.qty, row.neededQty, row.moq]
      .map(asNumber)
      .find((value) => value > 0) || 1),
    1
  );
  const quote = {
    id: quoteIdFrom(row, suffix),
    rowId: row.id,
    reusableItemId: overrides.reusableItemId || reusableSourcingItemCode(row),
    vendorName: overrides.vendorName || "Sample Manufacturer",
    quoteVersion: asNumber(overrides.quoteVersion ?? 1),
    status: overrides.status || "Received",
    quoteDate: overrides.quoteDate || "2026-05-18",
    refreshDate: overrides.refreshDate || overrides.quoteDate || "2026-05-18",
    expirationDate: overrides.expirationDate || "2026-06-30",
    assignedProjects: overrides.assignedProjects || currentProjectNumber(),
    currency: "USD",
    incoterm: overrides.incoterm || "FOB",
    countryOrigin: overrides.countryOrigin || "China",
    shipFrom: overrides.shipFrom || "Ningbo, CN",
    freightMode: overrides.freightMode || "Ocean",
    forwarderName: overrides.forwarderName || "Pacific Bridge Logistics",
    forwarderContact: overrides.forwarderContact || "Mia Chen",
    brokerName: overrides.brokerName || "ABC Customs Brokerage",
    htsCode: overrides.htsCode || "9505.10.2500",
    dutyRate: asNumber(overrides.dutyRate ?? 0.04),
    tariffRate: asNumber(overrides.tariffRate ?? 0.30),
    freightEstimate: asNumber(overrides.freightEstimate ?? 950),
    customsFees: asNumber(overrides.customsFees ?? 220),
    leadTimeDays: asNumber(overrides.leadTimeDays ?? 58),
    notes: overrides.notes || "Sample sourcing quote for prototype review.",
    selectedBreakId: breakIdFrom(row, `${suffix}-base`),
    breaks: [
      {
        id: breakIdFrom(row, `${suffix}-base`),
        qty,
        unitCost: asNumber(overrides.unitCost ?? 1.25),
        toolingCost: asNumber(overrides.toolingCost ?? 0),
        sampleCost: asNumber(overrides.sampleCost ?? 85),
        packagingCost: asNumber(overrides.packagingCost ?? 120)
      },
      {
        id: breakIdFrom(row, `${suffix}-high`),
        qty: Math.max(Math.round(qty * 1.5), qty + 1),
        unitCost: asNumber(overrides.highUnitCost ?? Math.max(asNumber(overrides.unitCost ?? 1.25) * 0.92, 0.01)),
        toolingCost: asNumber(overrides.toolingCost ?? 0),
        sampleCost: 0,
        packagingCost: asNumber(overrides.packagingCost ?? 120)
      }
    ]
  };
  return quote;
}

function buildSampleSourcingForRows(sourceRows) {
  const samples = [
    { match: "Bell", vendorName: "Ningbo Holiday Manufacturing", forwarderName: "Pacific Bridge Logistics", forwarderContact: "Mia Chen", shipFrom: "Ningbo, CN", unitCost: 1.18, freightEstimate: 980, htsCode: "8306.10.0000", notes: "Metal bell sample quote. Shares ocean consolidation with mug and plate supplier." },
    { match: "Mug", vendorName: "Shenzhen Ceramic Works", forwarderName: "Pacific Bridge Logistics", forwarderContact: "Mia Chen", shipFrom: "Shenzhen, CN", unitCost: 2.42, freightEstimate: 1320, htsCode: "6912.00.4500", notes: "Ceramic mug quote with export carton included." },
    { match: "Plate", vendorName: "Shenzhen Ceramic Works", forwarderName: "Pacific Bridge Logistics", forwarderContact: "Mia Chen", shipFrom: "Shenzhen, CN", unitCost: 1.64, freightEstimate: 1180, htsCode: "6912.00.4500", notes: "Plate quote from same ceramic factory; can consolidate with mugs." },
    { match: "Carton eFlute 10x10x6", vendorName: "Xiamen Print & Pack", forwarderName: "Pacific Bridge Logistics", forwarderContact: "Mia Chen", shipFrom: "Xiamen, CN", unitCost: 0.72, freightEstimate: 760, htsCode: "4819.10.0040", notes: "Eve kit carton quote. Can combine with paperboard items." },
    { match: "Window Sticker", vendorName: "Guangzhou Label House", forwarderName: "Meridian Freight Group", forwarderContact: "Alex Rivera", shipFrom: "Guangzhou, CN", unitCost: 0.19, freightEstimate: 420, htsCode: "3919.90.5060", leadTimeDays: 42, notes: "Window sticker quote with laminated finish." },
    { match: "Door Hangers", vendorName: "Guangzhou Label House", forwarderName: "Meridian Freight Group", forwarderContact: "Alex Rivera", shipFrom: "Guangzhou, CN", unitCost: 0.26, freightEstimate: 470, htsCode: "4911.99.8000", leadTimeDays: 40, notes: "Door hanger quote from same print source as window stickers." },
    { match: "Magnet", vendorName: "Dongguan Magnetics", forwarderName: "Meridian Freight Group", forwarderContact: "Alex Rivera", shipFrom: "Dongguan, CN", unitCost: 0.31, freightEstimate: 690, htsCode: "8505.19.3000", dutyRate: 0.02, notes: "Flexible magnet quote with bulk pack cartons." },
    { match: "Reindeer Food", vendorName: "Qingdao Gift Pack Co.", forwarderName: "Meridian Freight Group", forwarderContact: "Alex Rivera", shipFrom: "Qingdao, CN", unitCost: 0.58, freightEstimate: 880, htsCode: "6305.20.0000", notes: "Pouch/printed food component quote; sample needs artwork approval." },
    { match: "Carton Eflute 11x5x4", vendorName: "Xiamen Print & Pack", forwarderName: "Pacific Bridge Logistics", forwarderContact: "Mia Chen", shipFrom: "Xiamen, CN", unitCost: 0.61, freightEstimate: 820, htsCode: "4819.10.0040", notes: "Gold kit carton quote from same carton supplier as Eve kit." }
  ];
  const next = { quotes: {}, selected: {} };
  sourceRows.forEach((row) => {
    const name = rowDisplayName(row).toLowerCase();
    const product = String(row.product || "").toLowerCase();
    const sample = samples.find((candidate) => name.includes(candidate.match.toLowerCase()) || product.includes(candidate.match.toLowerCase()));
    if (!sample) return;
    const primary = buildSampleQuote(row, "sample-a", sample);
    const alternate = buildSampleQuote(row, "sample-b", {
      ...sample,
      vendorName: sample.vendorName.includes("Shenzhen") ? "Foshan Tabletop Products" : `${sample.vendorName} Alternate`,
      forwarderName: sample.forwarderName === "Pacific Bridge Logistics" ? "Meridian Freight Group" : "Pacific Bridge Logistics",
      forwarderContact: sample.forwarderName === "Pacific Bridge Logistics" ? "Alex Rivera" : "Mia Chen",
      unitCost: asNumber(sample.unitCost) * 1.08,
      freightEstimate: asNumber(sample.freightEstimate) * 0.9,
      leadTimeDays: asNumber(sample.leadTimeDays || 58) + 7,
      notes: "Alternate sample quote for comparison."
    });
    next.quotes[row.id] = [primary, alternate];
    next.selected[row.id] = { quoteId: primary.id, breakId: primary.breaks[0].id };
  });
  return next;
}

function seedRowsForSourcingReview() {
  rows = structuredClone(seedRows).map(normalizeEstimateRow);
  lookups = structuredClone(seedLookups);
  activePackage = "All";
  activeTypes = new Set(Object.keys(typeLabels));
  expanded = new Set(rows.filter((row) => row.level !== "element").map((row) => row.id));
  if (!currentProjectNumber()) setProjectNumber("E-000008");
  if (!els.projectName.value.trim()) els.projectName.value = "Sourcing Review Sample";
  if (!els.workspaceName.value.trim()) els.workspaceName.value = "Sourcing Review Workspace";
  if (!els.clientName.value.trim()) els.clientName.value = "North Pole Post Office";
  if (!els.estimateYear.value) els.estimateYear.value = "2026";
}

function populateSourcingReviewData() {
  if (!rows.length) seedRowsForSourcingReview();
  const sample = buildSampleSourcingForRows(rows);
  const quotedRowIds = new Set(Object.keys(sample.quotes));
  rows = rows.map((row) => (
    quotedRowIds.has(row.id)
      ? { ...row, source: "Manufacturer", moq: row.moq || Math.max(Math.round(asNumber(calculate(row).qtyToOrder || calculate(row).qty || row.neededQty)), 1) }
      : row
  ));
  sourcing = sample;
  resetSourcingUiState();
  touchSourcingRecord();
  setActiveView("sourcingView");
  render();
  setSaveStatus("Sample sourcing quotes populated");
}

function sourcingStorageKey(projectNumber = "") {
  return `sharpdots-sourcing-${projectNumber || "draft"}`;
}

function loadSourcingLocal(projectNumber = "") {
  try {
    return JSON.parse(localStorage.getItem(sourcingStorageKey(projectNumber)) || "{}");
  } catch {
    return {};
  }
}

function saveSourcingLocal() {
  try {
    const key = String(els.projectNumber.value || els.projectNumber.textContent || "").trim();
    localStorage.setItem(sourcingStorageKey(key), JSON.stringify(sourcingDataSnapshot()));
  } catch {
    // Local persistence is a prototype convenience only.
  }
}

function touchSourcingRecord() {
  saveSourcingLocal();
  touchWorkspaceRecord("sourcing");
}

const sourcingQuoteSheetColumns = [
  "sourcing_id",
  "reusable_item_id",
  "package",
  "item",
  "description",
  "target_qty",
  "manufacturer_vendor",
  "quote_version",
  "quote_date",
  "refresh_date",
  "expiration_date",
  "assigned_projects",
  "currency",
  "incoterm",
  "country_origin",
  "ship_from",
  "freight_mode",
  "freight_forwarder",
  "forwarder_contact",
  "customs_broker",
  "hts_code",
  "duty_rate",
  "tariff_rate",
  "freight_estimate",
  "customs_broker_fees",
  "lead_time_days",
  "quantity_break",
  "unit_cost",
  "tooling_cost",
  "sample_cost",
  "packaging_cost",
  "notes"
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function csvLine(values) {
  return values.map(csvEscape).join(",");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  row.push(cell);
  rows.push(row);
  return rows.filter((candidate) => candidate.some((value) => String(value || "").trim()));
}

function parseCsvObjects(text) {
  const parsed = parseCsv(text);
  if (!parsed.length) return [];
  const headers = parsed[0].map((header) => String(header || "").trim().toLowerCase());
  return parsed.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
}

function normalizeColumnName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[%$#]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function filenameToken(value, fallback = "export") {
  const token = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return token || fallback;
}

const sourcingColumnAliases = {
  sourcing_id: ["sourcing id", "sourcing_id", "sq id", "quote id", "item quote id"],
  reusable_item_id: ["reusable item id", "reusable_item_id", "item id", "internal item id"],
  package: ["package", "kit", "program"],
  item: ["item", "item name", "product", "component", "description short"],
  description: ["description", "spec", "specification", "specs", "item description"],
  target_qty: ["target qty", "target quantity", "needed", "qty needed", "quantity needed", "project qty"],
  manufacturer_vendor: ["manufacturer vendor", "manufacturer/vendor", "manufacturer", "vendor", "factory", "supplier"],
  quote_version: ["quote version", "version", "rev", "revision"],
  quote_date: ["quote date", "date quoted", "date"],
  refresh_date: ["refresh date", "updated", "last updated", "quote refresh"],
  expiration_date: ["expiration date", "expires", "valid until", "expiry"],
  assigned_projects: ["assigned projects", "project", "project number", "estimate"],
  currency: ["currency", "curr"],
  incoterm: ["incoterm", "terms", "shipping terms"],
  country_origin: ["country origin", "country of origin", "origin"],
  ship_from: ["ship from", "port", "origin port", "city"],
  freight_mode: ["freight mode", "mode", "shipping mode"],
  freight_forwarder: ["freight forwarder", "forwarder", "logistics provider"],
  forwarder_contact: ["forwarder contact", "logistics contact"],
  customs_broker: ["customs broker", "broker"],
  hts_code: ["hts code", "hts", "tariff code", "hs code"],
  duty_rate: ["duty rate", "duty", "duty pct", "duty percent"],
  tariff_rate: ["tariff rate", "tariff", "tariff pct", "tariff percent"],
  freight_estimate: ["freight estimate", "freight", "shipping cost", "freight cost"],
  customs_broker_fees: ["customs broker fees", "customs fees", "broker fees", "entry fees"],
  lead_time_days: ["lead time days", "lead time", "production days", "days"],
  quantity_break: ["quantity break", "qty break", "quote qty", "moq", "qty", "quantity"],
  unit_cost: ["unit cost", "price", "unit price", "cost each", "each cost", "quoted unit cost"],
  tooling_cost: ["tooling cost", "tooling", "mold", "mould"],
  sample_cost: ["sample cost", "sample"],
  packaging_cost: ["packaging cost", "packaging", "pack"],
  notes: ["notes", "comments", "remarks"]
};

function bestColumnMatch(targetColumn, headers) {
  const aliases = [targetColumn, ...(sourcingColumnAliases[targetColumn] || [])].map(normalizeColumnName);
  const normalizedHeaders = headers.map((header) => normalizeColumnName(header));
  const exactIndex = normalizedHeaders.findIndex((header) => aliases.includes(header));
  if (exactIndex >= 0) return headers[exactIndex];
  const containsIndex = normalizedHeaders.findIndex((header) => aliases.some((alias) => header.includes(alias) || alias.includes(header)));
  return containsIndex >= 0 ? headers[containsIndex] : "";
}

function setSourcingImportStatus(message, isError = false) {
  if (!els.sourcingImportStatus) return;
  els.sourcingImportStatus.textContent = message;
  els.sourcingImportStatus.classList.toggle("error", isError);
}

function rowDisplayName(row) {
  return row.element || row.product || row.packageName || "Untitled item";
}

function currentProjectNumber() {
  return String(els.projectNumber.value || els.projectNumber.textContent || "").trim();
}

function sourcingItemCode(row) {
  const project = currentProjectNumber().replace(/[^A-Z0-9]/gi, "") || "DRAFT";
  const index = Math.max(sourcingLeafRows().findIndex((candidate) => candidate.id === row.id) + 1, 1);
  return `SQ-${project}-${String(index).padStart(3, "0")}`;
}

function reusableSourcingItemCode(row) {
  const seed = [row.packageName, row.product, row.element || row.product, row.sku]
    .join("-")
    .replace(/[^A-Z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toUpperCase()
    .slice(0, 34);
  return `SRC-${seed || row.id.slice(-8).toUpperCase()}`;
}

function sourcingLeafRows() {
  const elementParentIds = new Set(rows.filter((row) => row.level === "element").map((row) => row.parentId));
  return rows.filter((row) => {
    if (row.level === "package") return false;
    if (row.level === "product" && elementParentIds.has(row.id)) return false;
    return true;
  });
}

function sourcingCandidates() {
  const query = (els.sourcingSearch?.value || "").trim().toLowerCase();
  const sourceFilter = els.sourcingSourceFilter?.value || "all";
  const statusFilter = els.sourcingStatusFilter?.value || "all";
  const showAll = Boolean(els.sourcingShowAll?.checked);
  return sourcingLeafRows().filter((row) => {
    const rowSource = String(row.source || "").trim();
    const selected = sourcing.selected[row.id];
    const quotes = sourcing.quotes[row.id] || [];
    const selectedQuote = quotes.find((quote) => quote.id === selected?.quoteId);
    const status = selectedQuote?.status || quotes[0]?.status || "Needs Quote";
    const isSourced = showAll || rowSource === "Manufacturer" || rowSource === "vendor" || row.type === "MP" || quotes.length;
    if (!isSourced) return false;
    if (sourceFilter === "blank" && rowSource) return false;
    if (sourceFilter !== "all" && sourceFilter !== "blank" && rowSource !== sourceFilter) return false;
    if (statusFilter !== "all" && status !== statusFilter) return false;
    const haystack = [
      row.packageName,
      row.product,
      row.element,
      row.sku,
      row.description,
      rowSource,
      status,
      sourcingItemCode(row),
      ...quotes.flatMap((quote) => [quote.vendorName, quote.forwarderName, quote.forwarderContact, quote.brokerName, quote.htsCode, quote.countryOrigin, quote.incoterm, quote.assignedProjects, quote.refreshDate])
    ].join(" ").toLowerCase();
    return !query || haystack.includes(query);
  });
}

function sourcingRowsForTemplate() {
  const candidates = sourcingCandidates();
  if (!selectedSourcingRows.size) return candidates;
  const selected = candidates.filter((row) => selectedSourcingRows.has(row.id));
  return selected.length ? selected : candidates;
}

function selectedOrDefaultQuote(row) {
  const selected = selectedQuoteForRow(row);
  if (selected) return selected;
  const quote = (sourcing.quotes[row.id] || [])[0];
  const priceBreak = quote?.breaks?.[0];
  return quote && priceBreak ? { quote, priceBreak, calc: quoteBreakCalc(quote, priceBreak) } : null;
}

function sourcingQuoteSheetRow(row) {
  const existing = selectedOrDefaultQuote(row);
  const quote = existing?.quote || {};
  const priceBreak = existing?.priceBreak || {};
  const calc = calculate(row);
  const targetQty = Math.max(Math.round(calc.qtyToOrder || calc.qty || row.neededQty || row.moq || 0), 0);
  return {
    sourcing_id: sourcingItemCode(row),
    reusable_item_id: quote.reusableItemId || reusableSourcingItemCode(row),
    package: row.packageName,
    item: rowDisplayName(row),
    description: row.description,
    target_qty: targetQty,
    manufacturer_vendor: quote.vendorName || "",
    quote_version: quote.quoteVersion || "1",
    quote_date: quote.quoteDate || "",
    refresh_date: quote.refreshDate || "",
    expiration_date: quote.expirationDate || "",
    assigned_projects: quote.assignedProjects || currentProjectNumber(),
    currency: quote.currency || "USD",
    incoterm: quote.incoterm || "FOB",
    country_origin: quote.countryOrigin || "",
    ship_from: quote.shipFrom || "",
    freight_mode: quote.freightMode || "Ocean",
    freight_forwarder: quote.forwarderName || "",
    forwarder_contact: quote.forwarderContact || "",
    customs_broker: quote.brokerName || "",
    hts_code: quote.htsCode || "",
    duty_rate: quote.dutyRate ?? "",
    tariff_rate: quote.tariffRate ?? asNumber(els.tariffRate?.value || 0.30),
    freight_estimate: quote.freightEstimate ?? "",
    customs_broker_fees: quote.customsFees ?? "",
    lead_time_days: quote.leadTimeDays ?? "",
    quantity_break: priceBreak.qty || Math.max(targetQty || Math.round(row.moq || 1), 1),
    unit_cost: priceBreak.unitCost ?? "",
    tooling_cost: priceBreak.toolingCost ?? "",
    sample_cost: priceBreak.sampleCost ?? "",
    packaging_cost: priceBreak.packagingCost ?? "",
    notes: quote.notes || ""
  };
}

async function exportSourcingQuoteSheet() {
  const exportRows = sourcingRowsForTemplate();
  if (!exportRows.length) {
    setSourcingImportStatus("No sourcing rows to export", true);
    return;
  }
  const csv = [
    csvLine(sourcingQuoteSheetColumns),
    ...exportRows.map((row) => {
      const values = sourcingQuoteSheetRow(row);
      return csvLine(sourcingQuoteSheetColumns.map((column) => values[column]));
    })
  ].join("\n");
  const filename = `${(currentProjectNumber() || "sourcing").toLowerCase()}-supplier-quote-template.csv`;
  try {
    const result = await saveCsvToDownloads(csv, filename);
    setSourcingImportStatus(`Exported ${exportRows.length} row${exportRows.length === 1 ? "" : "s"} to ${result.path || `Downloads/${result.filename}`}`);
    setSaveStatus(`Saved to Downloads: ${result.filename}`);
  } catch (err) {
    console.warn("Sourcing export server save failed, using browser download:", err);
    downloadCsvInBrowser(csv, filename);
    setSourcingImportStatus(`Browser download started as ${filename}`);
  }
}

function findSourcingRowFromImport(importRow, manualRowId = "") {
  const candidates = sourcingLeafRows();
  const manualId = String(manualRowId || importRow._matchedRowId || "").trim();
  if (manualId) return candidates.find((row) => row.id === manualId) || null;
  const sourcingId = String(importRow.sourcing_id || "").trim();
  const reusableId = String(importRow.reusable_item_id || "").trim().toLowerCase();
  const itemName = String(importRow.item || "").trim().toLowerCase();
  return candidates.find((row) => sourcingItemCode(row) === sourcingId)
    || candidates.find((row) => reusableSourcingItemCode(row).toLowerCase() === reusableId)
    || candidates.find((row) => rowDisplayName(row).trim().toLowerCase() === itemName);
}

function quoteKeyFromImport(importRow) {
  return [
    importRow.manufacturer_vendor,
    importRow.quote_version || "1",
    importRow.quote_date,
    importRow.refresh_date
  ].map((value) => String(value || "").trim().toLowerCase()).join("|");
}

function nextQuoteVersionFromQuotes(quotes, vendorName = "") {
  const vendorKey = String(vendorName || "").trim().toLowerCase();
  const versions = (quotes || [])
    .filter((quote) => !vendorKey || String(quote.vendorName || "").trim().toLowerCase() === vendorKey)
    .map((quote) => Math.round(asNumber(quote.quoteVersion)))
    .filter((version) => version > 0);
  return Math.max(0, ...versions) + 1;
}

function nextQuoteVersionForRow(row, vendorName = "") {
  return nextQuoteVersionFromQuotes(sourcing.quotes[row.id] || [], vendorName);
}

function applyImportedSourcingRows(importRows) {
  const today = new Date().toISOString().slice(0, 10);
  const result = {
    matched: 0,
    importedBreaks: 0,
    addedQuotes: 0,
    updatedQuotes: 0,
    newVersions: 0,
    skipped: 0,
    warnings: asNumber(importRows._warningCount || 0),
    selected: importRows.length
  };
  importRows.forEach((importRow) => {
    const row = findSourcingRowFromImport(importRow);
    if (!row) {
      result.skipped += 1;
      return;
    }
    result.matched += 1;
    const key = quoteKeyFromImport(importRow);
    const existingQuotes = sourcing.quotes[row.id] || [];
    const forceNewVersion = importRow._importAction === "newVersion";
    const forcedQuoteVersion = forceNewVersion
      ? nextQuoteVersionFromQuotes(existingQuotes, importRow.manufacturer_vendor)
      : 0;
    let quote = forceNewVersion ? null : existingQuotes.find((candidate) => quoteKeyFromImport({
      manufacturer_vendor: candidate.vendorName,
      quote_version: candidate.quoteVersion,
      quote_date: candidate.quoteDate,
      refresh_date: candidate.refreshDate
    }) === key);
    const quoteAction = forceNewVersion ? "newVersion" : quote ? "update" : "add";
    if (!quote) {
      quote = {
        ...defaultQuote(row),
        id: uid("quote"),
        breaks: []
      };
      sourcing.quotes[row.id] = [...existingQuotes, quote];
    }
    quote.reusableItemId = importRow.reusable_item_id || quote.reusableItemId || reusableSourcingItemCode(row);
    quote.vendorName = importRow.manufacturer_vendor || quote.vendorName;
    quote.quoteVersion = forceNewVersion
      ? forcedQuoteVersion
      : Math.max(Math.round(asNumber(importRow.quote_version || quote.quoteVersion || 1)), 1);
    if (quoteAction === "newVersion") result.newVersions += 1;
    else if (quoteAction === "update") result.updatedQuotes += 1;
    else result.addedQuotes += 1;
    quote.status = "Received";
    quote.quoteDate = importRow.quote_date || quote.quoteDate || today;
    quote.refreshDate = importRow.refresh_date || today;
    quote.expirationDate = importRow.expiration_date || quote.expirationDate || "";
    quote.assignedProjects = importRow.assigned_projects || quote.assignedProjects || currentProjectNumber();
    quote.currency = importRow.currency || quote.currency || "USD";
    quote.incoterm = importRow.incoterm || quote.incoterm || "FOB";
    quote.countryOrigin = importRow.country_origin || quote.countryOrigin || "";
    quote.shipFrom = importRow.ship_from || quote.shipFrom || "";
    quote.freightMode = importRow.freight_mode || quote.freightMode || "Ocean";
    quote.forwarderName = importRow.freight_forwarder || quote.forwarderName || "";
    quote.forwarderContact = importRow.forwarder_contact || quote.forwarderContact || "";
    quote.brokerName = importRow.customs_broker || quote.brokerName || "";
    quote.htsCode = importRow.hts_code || quote.htsCode || "";
    quote.dutyRate = asNumber(importRow.duty_rate || quote.dutyRate);
    quote.tariffRate = asNumber(importRow.tariff_rate || quote.tariffRate);
    quote.freightEstimate = asNumber(importRow.freight_estimate || quote.freightEstimate);
    quote.customsFees = asNumber(importRow.customs_broker_fees || quote.customsFees);
    quote.leadTimeDays = asNumber(importRow.lead_time_days || quote.leadTimeDays);
    quote.notes = importRow.notes || quote.notes || "";
    const qty = asNumber(importRow.quantity_break || importRow.target_qty);
    const unitCost = asNumber(importRow.unit_cost);
    if (qty > 0 || unitCost > 0) {
      const priceBreak = {
        id: uid("break"),
        qty: Math.max(Math.round(qty), 1),
        unitCost,
        toolingCost: asNumber(importRow.tooling_cost),
        sampleCost: asNumber(importRow.sample_cost),
        packagingCost: asNumber(importRow.packaging_cost)
      };
      quote.breaks = [...(quote.breaks || []), priceBreak];
      quote.selectedBreakId = quote.selectedBreakId || priceBreak.id;
      if (!sourcing.selected[row.id]) sourcing.selected[row.id] = { quoteId: quote.id, breakId: priceBreak.id };
      result.importedBreaks += 1;
    }
    row.source = row.source || "Manufacturer";
  });
  touchSourcingRecord();
  render();
  const detail = [
    `${result.matched} row${result.matched === 1 ? "" : "s"}`,
    `${result.addedQuotes} new quote${result.addedQuotes === 1 ? "" : "s"}`,
    `${result.newVersions} new version${result.newVersions === 1 ? "" : "s"}`,
    `${result.updatedQuotes} update${result.updatedQuotes === 1 ? "" : "s"}`,
    `${result.importedBreaks} qty break${result.importedBreaks === 1 ? "" : "s"}`
  ];
  if (result.warnings) detail.push(`${result.warnings} warning${result.warnings === 1 ? "" : "s"} reviewed`);
  if (result.skipped) detail.push(`${result.skipped} skipped`);
  setSourcingImportStatus(`Imported ${detail.join(" / ")}`, result.matched === 0);
  setSaveStatus(result.matched ? "Supplier quote sheet imported" : "No matching sourcing rows");
  return result;
}

function mappedImportRowsFromPending() {
  if (!pendingSourcingImport) return [];
  const map = {};
  els.sourcingImportMapper?.querySelectorAll(".sourcing-map-select").forEach((select) => {
    if (select.value) map[select.dataset.targetColumn] = select.value;
  });
  return pendingSourcingImport.rows.map((row) => Object.fromEntries(
    sourcingQuoteSheetColumns.map((column) => [column, map[column] ? row[map[column]] ?? "" : ""])
  ));
}

function sourcingImportResolution(importRow, index = 0) {
  const manualRowId = pendingSourcingImport?.manualMatches?.[String(index)] || "";
  const row = findSourcingRowFromImport(importRow, manualRowId);
  if (!row) return { status: "unmatched", row: null, quote: null, action: "No match", importRow };
  const importAction = pendingSourcingImport?.rowActions?.[String(index)] || "auto";
  const key = quoteKeyFromImport(importRow);
  const quote = importAction === "newVersion" ? null : (sourcing.quotes[row.id] || []).find((candidate) => quoteKeyFromImport({
    manufacturer_vendor: candidate.vendorName,
    quote_version: candidate.quoteVersion,
    quote_date: candidate.quoteDate,
    refresh_date: candidate.refreshDate
  }) === key);
  const hasBreak = asNumber(importRow.quantity_break || importRow.target_qty) > 0 || asNumber(importRow.unit_cost) > 0;
  return {
    status: "matched",
    row,
    quote,
    action: importAction === "newVersion" ? "Add new version" : quote ? "Update quote" : "Add quote",
    breakAction: hasBreak ? "Add quantity break" : "No quantity break",
    matchType: manualRowId ? "manual" : "auto",
    importAction,
    importRow
  };
}

function sourcingImportPreviewRows() {
  return mappedImportRowsFromPending().map((row, index) => sourcingImportResolution(row, index));
}

function sourcingImportWarnings(entry) {
  const warnings = [];
  if (!entry || entry.status === "unmatched") {
    warnings.push("Choose a sourcing item match");
    return warnings;
  }
  if (!importFieldValue(entry, "manufacturer_vendor")) warnings.push("Missing supplier");
  if (!importFieldValue(entry, "quantity_break", importFieldValue(entry, "target_qty", ""))) warnings.push("Missing quantity");
  if (!importFieldValue(entry, "unit_cost")) warnings.push("Missing unit cost");
  if (!importFieldValue(entry, "quote_date")) warnings.push("Missing quote date");
  if (!importFieldValue(entry, "refresh_date")) warnings.push("Missing refresh date");
  return warnings;
}

function importWarningText(entry) {
  return sourcingImportWarnings(entry).join(" · ");
}

function mostPopulatedImportEntry(previewRows) {
  return previewRows
    .map((entry) => ({
      entry,
      score: Object.values(entry.importRow || {}).filter((value) => String(value || "").trim()).length
    }))
    .sort((a, b) => b.score - a.score)[0]?.entry || previewRows[0];
}

function selectedImportPreviewEntry(previewRows) {
  if (!previewRows.length) return null;
  const storedIndex = Number(pendingSourcingImport?.selectedPreviewIndex ?? 0);
  const index = Math.min(Math.max(Number.isFinite(storedIndex) ? storedIndex : 0, 0), previewRows.length - 1);
  if (pendingSourcingImport) pendingSourcingImport.selectedPreviewIndex = index;
  return previewRows[index] || mostPopulatedImportEntry(previewRows);
}

function importRowIncluded(entry, index) {
  if (!pendingSourcingImport) return entry?.status === "matched";
  pendingSourcingImport.includedPreviewRows ||= {};
  const key = String(index);
  if (entry?.status !== "matched") {
    pendingSourcingImport.includedPreviewRows[key] = false;
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(pendingSourcingImport.includedPreviewRows, key)) {
    pendingSourcingImport.includedPreviewRows[key] = true;
  }
  return !!pendingSourcingImport.includedPreviewRows[key];
}

function setImportRowIncluded(index, included) {
  if (!pendingSourcingImport) return;
  pendingSourcingImport.includedPreviewRows ||= {};
  pendingSourcingImport.includedPreviewRows[String(index)] = !!included;
}

function setAllImportRowsIncluded(previewRows, included) {
  if (!pendingSourcingImport) return;
  pendingSourcingImport.includedPreviewRows = {};
  previewRows.forEach((entry, index) => {
    pendingSourcingImport.includedPreviewRows[String(index)] = included && entry.status === "matched";
  });
}

function setImportRowManualMatch(index, rowId) {
  if (!pendingSourcingImport) return;
  const key = String(index);
  pendingSourcingImport.manualMatches ||= {};
  if (rowId) pendingSourcingImport.manualMatches[key] = rowId;
  else delete pendingSourcingImport.manualMatches[key];
  if (pendingSourcingImport.includedPreviewRows) delete pendingSourcingImport.includedPreviewRows[key];
}

function setImportRowAction(index, action) {
  if (!pendingSourcingImport) return;
  const key = String(index);
  pendingSourcingImport.rowActions ||= {};
  if (action && action !== "auto") pendingSourcingImport.rowActions[key] = action;
  else delete pendingSourcingImport.rowActions[key];
}

function renderImportMatchSelect(entry, index) {
  const currentId = entry?.row?.id || "";
  const rows = sourcingLeafRows().sort((a, b) => rowDisplayName(a).localeCompare(rowDisplayName(b)));
  return `
    <label class="sourcing-import-match">
      <span>Match</span>
      <select data-import-match-index="${index}">
        <option value="" ${currentId ? "" : "selected"}>${currentId ? "Auto match" : "Choose item"}</option>
        ${rows.map((row) => {
          const label = `${rowDisplayName(row)}${row.packageName ? ` · ${row.packageName}` : ""}`;
          return `<option value="${escapeHtml(row.id)}" ${row.id === currentId ? "selected" : ""}>${escapeHtml(label)}</option>`;
        }).join("")}
      </select>
    </label>
  `;
}

function renderImportActionSelect(entry, index) {
  const action = pendingSourcingImport?.rowActions?.[String(index)] || "auto";
  return `
    <label class="sourcing-import-action">
      <span>Action</span>
      <select data-import-action-index="${index}" ${entry?.status === "unmatched" ? "disabled" : ""}>
        <option value="auto" ${action === "auto" ? "selected" : ""}>Auto</option>
        <option value="newVersion" ${action === "newVersion" ? "selected" : ""}>New version</option>
      </select>
    </label>
  `;
}

function importPreviewRowLabel(entry) {
  return entry?.row
    ? rowDisplayName(entry.row)
    : importFieldValue(entry, "item", importFieldValue(entry, "sourcing_id", "Unmatched row"));
}

function importPreviewRowSubhead(entry) {
  if (!entry) return "";
  const vendor = importFieldValue(entry, "manufacturer_vendor", entry.quote?.vendorName || "No supplier");
  const qty = importFieldValue(entry, "quantity_break", importFieldValue(entry, "target_qty", ""));
  const unit = importFieldValue(entry, "unit_cost", "");
  const qtyText = qty ? `${Number(qty).toLocaleString()} qty` : "No qty";
  const unitText = unit ? `${money(asNumber(unit), 3)} / pc` : "No unit cost";
  return `${vendor} · ${qtyText} · ${unitText}`;
}

function importPreviewActionText(entry) {
  if (entry?.status === "unmatched") return "No matching sourcing item found";
  const match = entry.matchType === "manual" ? "Manual match" : "Auto match";
  return `${match} · ${entry.action} · ${entry.breakAction}`;
}

function importFieldValue(entry, key, fallback = "") {
  const value = entry?.importRow?.[key];
  return String(value ?? "").trim() || fallback;
}

function importFieldTile(entry, key, label, fallback = "") {
  const rawValue = entry?.importRow?.[key];
  const hasImport = String(rawValue ?? "").trim() !== "";
  const value = hasImport ? rawValue : fallback;
  return `
    <div class="${hasImport ? "import-active" : ""}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || "Default / blank")}</strong>
    </div>
  `;
}

function importFieldHasValue(entry, key) {
  return String(entry?.importRow?.[key] ?? "").trim() !== "";
}

function importFieldClass(entry, key) {
  return importFieldHasValue(entry, key) ? " import-active" : "";
}

function renderImportSampleControl(entry, key, label, fallback = "", type = "text", selectOptions = null) {
  const value = importFieldValue(entry, key, fallback);
  const activeClass = importFieldClass(entry, key);
  const control = selectOptions
    ? `<select disabled>${selectOptions.map((option) => `<option ${String(option) === String(value) ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>`
    : `<input type="${type}" value="${escapeHtml(value)}" disabled />`;
  return `<label class="import-sample-field${activeClass}">${escapeHtml(label)}${control}</label>`;
}

function renderImportSampleBreak(entry, quote) {
  const quoteBreak = quote?.breaks?.[0] || {};
  const qty = importFieldValue(entry, "quantity_break", importFieldValue(entry, "target_qty", quoteBreak.qty || ""));
  const unitCost = importFieldValue(entry, "unit_cost", quoteBreak.unitCost || "");
  const tooling = importFieldValue(entry, "tooling_cost", quoteBreak.toolingCost || 0);
  const sample = importFieldValue(entry, "sample_cost", quoteBreak.sampleCost || 0);
  const packaging = importFieldValue(entry, "packaging_cost", quoteBreak.packagingCost || 0);
  const calc = quoteBreakCalc({
    dutyRate: asNumber(importFieldValue(entry, "duty_rate", quote?.dutyRate || 0)),
    tariffRate: asNumber(importFieldValue(entry, "tariff_rate", quote?.tariffRate || 0)),
    freightEstimate: asNumber(importFieldValue(entry, "freight_estimate", quote?.freightEstimate || 0)),
    customsFees: asNumber(importFieldValue(entry, "customs_broker_fees", quote?.customsFees || 0))
  }, {
    qty: asNumber(qty),
    unitCost: asNumber(unitCost),
    toolingCost: asNumber(tooling),
    sampleCost: asNumber(sample),
    packagingCost: asNumber(packaging)
  });
  const cell = (key, value) => `<span class="${importFieldHasValue(entry, key) ? "import-active" : ""}">${escapeHtml(value)}</span>`;
  return `
    <div class="sourcing-break sourcing-break-head">
      <span>Select</span><span>Qty</span><span>Unit Cost</span><span>Tooling</span><span>Sample</span><span>Packaging</span><span>Landed Total</span><span>Landed / pc</span>
    </div>
    <div class="sourcing-break selected-break import-sample-break">
      <button class="ghost-btn" type="button" disabled>Selected</button>
      ${cell("quantity_break", qty || "0")}
      ${cell("unit_cost", decimal(asNumber(unitCost), 3))}
      ${cell("tooling_cost", decimal(asNumber(tooling), 0))}
      ${cell("sample_cost", decimal(asNumber(sample), 0))}
      ${cell("packaging_cost", decimal(asNumber(packaging), 0))}
      <strong>${money(calc.landedTotal, 2)}</strong>
      <strong>${money(calc.landedUnitCost, 3)}</strong>
    </div>
  `;
}

function renderSourcingImportQuoteSample(entry) {
  const sampleRow = entry?.row;
  const quote = entry?.quote || {};
  const sampleTitle = sampleRow ? rowDisplayName(sampleRow) : importFieldValue(entry, "item", "Unmatched supplier row");
  const sampleSubhead = sampleRow
    ? `${sourcingItemCode(sampleRow)} · ${sampleRow.packageName || "Current package"}${sampleRow.product ? ` / ${sampleRow.product}` : ""}`
    : "No matching sourcing item found";
  const sourceLabel = sampleRow?.source || "Manufacturer";
  const calc = sampleRow ? calculate(sampleRow) : { qtyToOrder: asNumber(importFieldValue(entry, "target_qty", 0)), perPieceCost: 0 };
  const selectedUnit = asNumber(importFieldValue(entry, "unit_cost", quote.breaks?.[0]?.unitCost || 0));
  return `
    <section class="sourcing-import-detail-card ${entry?.status === "unmatched" ? "unmatched" : ""}">
      <header class="sourcing-item-head import-sample-head">
        <div>
          <strong>${escapeHtml(sampleTitle)}</strong>
          <span>${escapeHtml(sampleSubhead)}</span>
        </div>
        <div class="sourcing-item-meta">
          <span>${escapeHtml(sourceLabel)}</span>
          <span>Qty to order ${Math.round(calc.qtyToOrder || 0).toLocaleString()}</span>
          <span>Current ${money(calc.perPieceCost || 0, 3)} / pc</span>
          <span class="selected-pill">Import ${money(selectedUnit, 3)} / pc</span>
        </div>
      </header>
      <article class="sourcing-quote import-sample-quote">
        <div class="sourcing-quote-grid">
          ${renderImportSampleControl(entry, "reusable_item_id", "Reusable Item ID", quote.reusableItemId || (sampleRow ? reusableSourcingItemCode(sampleRow) : "Unmatched"))}
          ${renderImportSampleControl(entry, "manufacturer_vendor", "Manufacturer / Vendor", quote.vendorName || "New supplier")}
          ${renderImportSampleControl(entry, "quote_version", "Version", quote.quoteVersion || "1", "number")}
          ${renderImportSampleControl(entry, "status", "Status", quote.status || "Received", "text", ["Needs Quote", "Requested", "Received", "Clarifying", "Selected", "Rejected", "Expired", "PO Ready", "PO Exported"])}
          ${renderImportSampleControl(entry, "quote_date", "Quote Date", quote.quoteDate || new Date().toISOString().slice(0, 10), "date")}
          ${renderImportSampleControl(entry, "refresh_date", "Refresh Date", quote.refreshDate || new Date().toISOString().slice(0, 10), "date")}
          ${renderImportSampleControl(entry, "expiration_date", "Expires", quote.expirationDate || "", "date")}
          ${renderImportSampleControl(entry, "assigned_projects", "Assigned Projects", quote.assignedProjects || currentProjectNumber())}
          ${renderImportSampleControl(entry, "incoterm", "Incoterm", quote.incoterm || "FOB", "text", ["EXW", "FOB", "CIF", "DDP", "DAP"])}
          ${renderImportSampleControl(entry, "country_origin", "Country of Origin", quote.countryOrigin || "")}
          ${renderImportSampleControl(entry, "ship_from", "Ship From", quote.shipFrom || "")}
          ${renderImportSampleControl(entry, "freight_mode", "Freight Mode", quote.freightMode || "Ocean", "text", ["Ocean", "Air", "Express", "Truck", "Mixed"])}
          ${renderImportSampleControl(entry, "freight_forwarder", "Freight Forwarder", quote.forwarderName || "")}
          ${renderImportSampleControl(entry, "forwarder_contact", "Forwarder Contact", quote.forwarderContact || "")}
          ${renderImportSampleControl(entry, "customs_broker", "Customs Broker", quote.brokerName || "")}
          ${renderImportSampleControl(entry, "hts_code", "HTS Code", quote.htsCode || "")}
          ${renderImportSampleControl(entry, "duty_rate", "Duty Rate", quote.dutyRate || 0, "number")}
          ${renderImportSampleControl(entry, "tariff_rate", "Tariff Rate", quote.tariffRate || 0, "number")}
          ${renderImportSampleControl(entry, "freight_estimate", "Freight", quote.freightEstimate || 0, "number")}
          ${renderImportSampleControl(entry, "customs_broker_fees", "Customs / Broker", quote.customsFees || 0, "number")}
          ${renderImportSampleControl(entry, "lead_time_days", "Lead Days", quote.leadTimeDays || 0, "number")}
        </div>
        <label class="sourcing-notes import-sample-field${importFieldClass(entry, "notes")}">Notes<textarea disabled rows="2">${escapeHtml(importFieldValue(entry, "notes", quote.notes || ""))}</textarea></label>
        <div class="sourcing-breaks">${renderImportSampleBreak(entry, quote)}</div>
      </article>
    </section>
  `;
}

function renderSourcingImportPreview() {
  if (!els.sourcingImportMapper || !pendingSourcingImport) return;
  const previewEl = els.sourcingImportMapper.querySelector("#sourcingImportPreview");
  if (!previewEl) return;
  const previewRows = sourcingImportPreviewRows();
  const matched = previewRows.filter((row) => row.status === "matched");
  const unmatched = previewRows.filter((row) => row.status === "unmatched");
  const updates = matched.filter((row) => row.action === "Update quote").length;
  const newVersions = matched.filter((row) => row.action === "Add new version").length;
  const adds = matched.filter((row) => row.action === "Add quote").length;
  const breakAdds = matched.filter((row) => row.breakAction === "Add quantity break").length;
  const selectedWarnings = previewRows
    .filter((entry, index) => importRowIncluded(entry, index))
    .reduce((total, entry) => total + sourcingImportWarnings(entry).length, 0);
  const sampleEntry = selectedImportPreviewEntry(previewRows);
  const sampleRow = sampleEntry?.row;
  const sampleSubhead = sampleRow
    ? `${sourcingItemCode(sampleRow)} · ${importPreviewActionText(sampleEntry)}`
    : "No matching sourcing item found";
  const activeIndex = Number(pendingSourcingImport?.selectedPreviewIndex ?? 0);
  const includedCount = previewRows.filter((entry, index) => importRowIncluded(entry, index)).length;
  previewEl.innerHTML = `
    <div class="sourcing-import-preview-summary">
      <span><strong>${matched.length}</strong> matched</span>
      <span><strong>${unmatched.length}</strong> unmatched</span>
      <span><strong>${adds}</strong> new quotes</span>
      <span><strong>${newVersions}</strong> versions</span>
      <span><strong>${updates}</strong> updates</span>
      <span><strong>${includedCount}</strong> selected</span>
      <span><strong>${selectedWarnings}</strong> warnings</span>
    </div>
    <div class="sourcing-import-sample-note">
      <strong>Representative detailed view</strong>
      <span>${escapeHtml(sampleSubhead)}. Highlighted fields are coming from the import.</span>
    </div>
    ${renderSourcingImportQuoteSample(sampleEntry)}
    <div class="sourcing-import-preview-list">
      <div class="sourcing-import-list-head">
        <strong>Import Rows</strong>
        <span>${breakAdds} qty break${breakAdds === 1 ? "" : "s"} detected</span>
        <button class="ghost-btn" type="button" data-import-include-all="true">Select Matched</button>
        <button class="ghost-btn" type="button" data-import-include-all="false">Clear</button>
      </div>
      ${previewRows.map((entry, index) => `
        <div class="sourcing-import-row-wrap ${index === activeIndex ? "active" : ""} ${entry.status === "unmatched" ? "unmatched" : ""} ${sourcingImportWarnings(entry).length ? "has-warning" : ""}">
          <label class="sourcing-import-include">
            <input type="checkbox" data-import-include-index="${index}" ${importRowIncluded(entry, index) ? "checked" : ""} ${entry.status === "unmatched" ? "disabled" : ""} />
            <span>Use</span>
          </label>
          <button class="sourcing-import-row ${entry.status === "unmatched" ? "unmatched" : ""}" type="button" data-import-preview-index="${index}">
            <strong>${escapeHtml(importPreviewRowLabel(entry))}</strong>
            <span>${escapeHtml(importPreviewActionText(entry))}</span>
            <small>${escapeHtml(importPreviewRowSubhead(entry))}</small>
            ${sourcingImportWarnings(entry).length ? `<em>${escapeHtml(importWarningText(entry))}</em>` : ""}
          </button>
          ${renderImportMatchSelect(entry, index)}
          ${renderImportActionSelect(entry, index)}
        </div>
      `).join("") || `<small>No import rows found.</small>`}
    </div>
  `;
}

function clearSourcingImportMapper() {
  pendingSourcingImport = null;
  if (els.sourcingImportMapper) {
    els.sourcingImportMapper.hidden = true;
    els.sourcingImportMapper.innerHTML = "";
  }
}

function renderSourcingImportMapper(headers, rowsForMapping, fileName) {
  pendingSourcingImport = { headers, rows: rowsForMapping, fileName, selectedPreviewIndex: 0, includedPreviewRows: {}, manualMatches: {}, rowActions: {} };
  if (!els.sourcingImportMapper) return;
  const optionHtml = (selected) => `
    <option value="">Skip</option>
    ${headers.map((header) => `<option value="${escapeHtml(header)}" ${header === selected ? "selected" : ""}>${escapeHtml(header)}</option>`).join("")}
  `;
  const required = new Set(["sourcing_id", "item", "manufacturer_vendor", "quantity_break", "unit_cost"]);
  const rowsHtml = sourcingQuoteSheetColumns.map((column) => {
    const selected = bestColumnMatch(column, headers);
    return `
      <label class="${required.has(column) ? "required-map" : ""}">
        <span>${escapeHtml(column.replace(/_/g, " "))}</span>
        <select class="sourcing-map-select" data-target-column="${escapeHtml(column)}">
          ${optionHtml(selected)}
        </select>
      </label>
    `;
  }).join("");
  const sample = rowsForMapping[0] || {};
  els.sourcingImportMapper.hidden = false;
  els.sourcingImportMapper.innerHTML = `
    <div class="sourcing-import-backdrop" aria-hidden="true"></div>
    <div class="sourcing-import-modal" role="dialog" aria-modal="true" aria-label="Map supplier quote import">
      <div class="sourcing-mapper-head">
        <div>
          <strong>Map Supplier Quote Sheet</strong>
          <small>${escapeHtml(fileName || "Selected file")} · ${rowsForMapping.length} row${rowsForMapping.length === 1 ? "" : "s"} detected</small>
        </div>
        <button id="cancelSourcingImportMapBtn" class="ghost-btn" type="button" aria-label="Close import mapping">Close</button>
      </div>
      <div class="sourcing-import-modal-body">
        <div id="sourcingImportPreview" class="sourcing-import-preview"></div>
        <aside class="sourcing-import-map-panel">
          <details class="sourcing-mapper-advanced" open>
            <summary>Column mapping</summary>
            <div class="sourcing-mapper-grid">${rowsHtml}</div>
          </details>
          <div class="sourcing-mapper-sample">
            <strong>First row preview</strong>
            <span>${escapeHtml(headers.slice(0, 8).map((header) => `${header}: ${sample[header] || ""}`).join(" · "))}</span>
          </div>
          <div class="sourcing-mapper-actions">
            <button id="applySourcingImportMapBtn" type="button">Apply Import</button>
            <button class="ghost-btn cancel-sourcing-import-map" type="button">Cancel</button>
          </div>
        </aside>
      </div>
    </div>
  `;
  renderSourcingImportPreview();
  setSourcingImportStatus("Review mapping, then Apply Import");
}

function prepareSourcingImportMapping(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = parseCsv(String(reader.result || ""));
      if (!parsed.length) {
        setSourcingImportStatus("No rows found in file", true);
        return;
      }
      const headers = parsed[0].map((header, index) => String(header || `Column ${index + 1}`).trim());
      const rowsForMapping = parsed.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
      renderSourcingImportMapper(headers, rowsForMapping, file.name);
    } catch (err) {
      console.error("Sourcing import mapping failed:", err);
      setSourcingImportStatus("Import mapping failed", true);
    } finally {
      if (els.sourcingImportFile) els.sourcingImportFile.value = "";
    }
  };
  reader.onerror = () => setSourcingImportStatus("Could not read file", true);
  reader.readAsText(file);
}

function importSourcingQuoteSheet(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const importRows = parseCsvObjects(String(reader.result || ""));
      applyImportedSourcingRows(importRows);
    } catch (err) {
      console.error("Sourcing import failed:", err);
      setSourcingImportStatus("Import failed", true);
    } finally {
      if (els.sourcingImportFile) els.sourcingImportFile.value = "";
    }
  };
  reader.onerror = () => setSourcingImportStatus("Could not read file", true);
  reader.readAsText(file);
}

function defaultQuote(row) {
  const calc = calculate(row);
  return {
    id: uid("quote"),
    rowId: row.id,
    reusableItemId: reusableSourcingItemCode(row),
    vendorName: "",
    quoteVersion: 1,
    status: "Requested",
    quoteDate: new Date().toISOString().slice(0, 10),
    refreshDate: new Date().toISOString().slice(0, 10),
    expirationDate: "",
    assignedProjects: currentProjectNumber(),
    currency: "USD",
    incoterm: "FOB",
    countryOrigin: "",
    shipFrom: "",
    freightMode: "Ocean",
    forwarderName: "",
    forwarderContact: "",
    brokerName: "",
    htsCode: "",
    dutyRate: 0,
    tariffRate: asNumber(els.tariffRate?.value || 0.30),
    freightEstimate: 0,
    customsFees: 0,
    leadTimeDays: 45,
    notes: "",
    selectedBreakId: "",
    breaks: [{
      id: uid("break"),
      qty: Math.max(Math.round(calc.qtyToOrder || calc.qty || row.moq || 1), 1),
      unitCost: Math.max(calc.perPieceCost, 0),
      toolingCost: 0,
      sampleCost: 0,
      packagingCost: 0
    }]
  };
}

function quoteBreakCalc(quote, priceBreak) {
  const qty = Math.max(asNumber(priceBreak.qty), 0);
  const merchandise = qty * Math.max(asNumber(priceBreak.unitCost), 0);
  const fixed = asNumber(priceBreak.toolingCost) + asNumber(priceBreak.sampleCost) + asNumber(priceBreak.packagingCost);
  const dutiable = merchandise + fixed;
  const duty = dutiable * Math.max(asNumber(quote.dutyRate), 0);
  const tariff = dutiable * Math.max(asNumber(quote.tariffRate), 0);
  const landedTotal = dutiable + duty + tariff + Math.max(asNumber(quote.freightEstimate), 0) + Math.max(asNumber(quote.customsFees), 0);
  return {
    qty,
    merchandise,
    duty,
    tariff,
    landedTotal,
    landedUnitCost: qty > 0 ? landedTotal / qty : 0
  };
}

function selectedQuoteForRow(row) {
  const selected = sourcing.selected[row.id];
  const quote = (sourcing.quotes[row.id] || []).find((candidate) => candidate.id === selected?.quoteId);
  const priceBreak = quote?.breaks?.find((candidate) => candidate.id === selected?.breakId);
  return quote && priceBreak ? { quote, priceBreak, calc: quoteBreakCalc(quote, priceBreak) } : null;
}

function quoteCoverageRows(candidates) {
  return candidates.flatMap((row) => (sourcing.quotes[row.id] || []).map((quote) => {
    const selected = sourcing.selected[row.id] || {};
    const selectedBreak = quote.breaks?.find((priceBreak) => priceBreak.id === selected.breakId && quote.id === selected.quoteId)
      || quote.breaks?.[0]
      || { qty: 0, unitCost: 0 };
    const calc = quoteBreakCalc(quote, selectedBreak);
    return {
      row,
      quote,
      priceBreak: selectedBreak,
      calc,
      isSelected: selected.quoteId === quote.id && selected.breakId === selectedBreak.id
    };
  }));
}

function quoteDecisionCandidates(row) {
  const selected = sourcing.selected[row.id] || {};
  return (sourcing.quotes[row.id] || [])
    .flatMap((quote) => (quote.breaks || []).map((priceBreak) => ({
      row,
      quote,
      priceBreak,
      calc: quoteBreakCalc(quote, priceBreak),
      isSelected: selected.quoteId === quote.id && selected.breakId === priceBreak.id
    })))
    .sort((a, b) => a.calc.landedUnitCost - b.calc.landedUnitCost);
}

function renderSourcingDecisionBoard(candidates) {
  const rowsNeedingSelection = candidates.filter((row) => quoteDecisionCandidates(row).length && !selectedQuoteForRow(row)).length;
  const rowsWithoutQuotes = candidates.filter((row) => !quoteDecisionCandidates(row).length).length;
  return `
    <div class="sourcing-decision-board">
      <header class="sourcing-decision-overview">
        <article>
          <span>Need Winner</span>
          <strong>${rowsNeedingSelection}</strong>
        </article>
        <article>
          <span>No Quotes</span>
          <strong>${rowsWithoutQuotes}</strong>
        </article>
        <article>
          <span>Selected</span>
          <strong>${candidates.filter((row) => selectedQuoteForRow(row)).length}</strong>
        </article>
      </header>
      ${candidates.map((row) => renderSourcingDecisionItem(row)).join("")}
    </div>
  `;
}

function renderSourcingDecisionItem(row) {
  const candidates = quoteDecisionCandidates(row);
  const selected = selectedQuoteForRow(row);
  const best = candidates[0];
  const estimateCalc = calculate(row);
  const selectedUnit = selected?.calc.landedUnitCost || 0;
  const bestUnit = best?.calc.landedUnitCost || 0;
  const selectedVsBest = selected && best && selectedUnit > 0
    ? selectedUnit - bestUnit
    : 0;
  return `
    <section class="sourcing-decision-item ${selected ? "has-selection" : ""} ${!candidates.length ? "no-quotes" : ""}" data-row-id="${row.id}">
      <header>
        <div>
          <strong>${escapeHtml(rowDisplayName(row))}</strong>
          <span>${escapeHtml(sourcingItemCode(row))} · ${escapeHtml(row.packageName)}${row.product ? ` / ${escapeHtml(row.product)}` : ""}</span>
        </div>
        <div class="sourcing-decision-meta">
          <span>Qty ${Math.round(estimateCalc.qtyToOrder || estimateCalc.qty || 0).toLocaleString()}</span>
          <span>${candidates.length} candidate${candidates.length === 1 ? "" : "s"}</span>
          ${selected ? `<span class="selected-pill">Selected ${money(selected.calc.landedUnitCost, 3)} / pc</span>` : `<span class="needs-pill">Needs winner</span>`}
          ${selected && best && selectedVsBest > 0.0004 ? `<span class="decision-delta">+${money(selectedVsBest, 3)} / pc vs low</span>` : ""}
        </div>
      </header>
      ${candidates.length ? `
        <div class="sourcing-decision-grid">
          <div class="sourcing-decision-row sourcing-decision-head">
            <span>Pick</span>
            <span>Supplier</span>
            <span>Version</span>
            <span>Qty</span>
            <span>Landed / pc</span>
            <span>Landed Total</span>
            <span>Forwarder</span>
            <span>Refresh</span>
            <span>Status</span>
          </div>
          ${candidates.map((entry, index) => renderSourcingDecisionCandidate(entry, index)).join("")}
        </div>
        <div class="sourcing-decision-actions">
          <button class="ghost-btn apply-sourcing-quote" type="button" ${selected ? "" : "disabled"}>Apply Selected to Estimate</button>
        </div>
      ` : `<div class="sourcing-no-quotes">No quotes yet. Import supplier quotes or add a quote in Detailed view.</div>`}
    </section>
  `;
}

function renderSourcingDecisionCandidate(entry, index) {
  const rank = index + 1;
  return `
    <div class="sourcing-decision-row ${entry.isSelected ? "selected-decision-row" : ""} ${index === 0 ? "lowest-decision-row" : ""}">
      <span>
        <button class="ghost-btn select-sourcing-decision" type="button" data-row-id="${entry.row.id}" data-quote-id="${entry.quote.id}" data-break-id="${entry.priceBreak.id}">
          ${entry.isSelected ? "Selected" : "Select"}
        </button>
      </span>
      <span><strong>${escapeHtml(entry.quote.vendorName || "Unassigned")}</strong><small>${rank === 1 ? "Lowest landed / pc" : ""}</small></span>
      <span>v${escapeHtml(entry.quote.quoteVersion || "1")}</span>
      <span>${Math.round(entry.calc.qty).toLocaleString()}</span>
      <span>${money(entry.calc.landedUnitCost, 3)}</span>
      <span>${money(entry.calc.landedTotal, 2)}</span>
      <span>${escapeHtml(entry.quote.forwarderName || "Unassigned")}</span>
      <span>${escapeHtml(entry.quote.refreshDate || entry.quote.quoteDate || "")}</span>
      <span>${entry.isSelected ? "Selected" : escapeHtml(entry.quote.status || "Received")}</span>
    </div>
  `;
}

function assignedProjectList(value) {
  return uniqueValues(String(value || "")
    .split(/[,\n]/)
    .map((project) => project.trim())
    .filter(Boolean));
}

function quoteAssignedToProject(quote, project = currentProjectNumber()) {
  return Boolean(project) && assignedProjectList(quote.assignedProjects).includes(project);
}

function sourcingAssignmentRows(candidates = sourcingCandidates()) {
  const currentProject = currentProjectNumber();
  return quoteCoverageRows(candidates).map((entry) => {
    const projects = assignedProjectList(entry.quote.assignedProjects);
    return {
      ...entry,
      assignedProjects: projects,
      assignedToCurrent: quoteAssignedToProject(entry.quote, currentProject)
    };
  }).sort((a, b) => (
    Number(b.assignedToCurrent) - Number(a.assignedToCurrent)
    || Number(b.isSelected) - Number(a.isSelected)
    || rowDisplayName(a.row).localeCompare(rowDisplayName(b.row))
    || String(a.quote.vendorName || "").localeCompare(String(b.quote.vendorName || ""))
  ));
}

function renderSourcingAssignmentBoard(candidates) {
  const entries = sourcingAssignmentRows(candidates);
  const hasCurrentProject = Boolean(currentProjectNumber());
  const currentProject = currentProjectNumber() || "Draft";
  const currentName = els.projectName?.value.trim() || "Untitled Estimate";
  const assignedEntries = entries.filter((entry) => entry.assignedToCurrent);
  const selectedEntries = entries.filter((entry) => entry.isSelected);
  const selectedUnassigned = selectedEntries.filter((entry) => !entry.assignedToCurrent);
  const projectCount = uniqueValues(entries.flatMap((entry) => entry.assignedProjects)).length;
  return `
    <div class="sourcing-project-board">
      <header class="sourcing-project-overview">
        <article>
          <span>Current Estimate</span>
          <strong>${escapeHtml(currentProject)}</strong>
        </article>
        <article>
          <span>Assigned Quotes</span>
          <strong>${assignedEntries.length}</strong>
        </article>
        <article>
          <span>Selected Winners</span>
          <strong>${selectedEntries.length}</strong>
        </article>
        <article>
          <span>Selected Not Assigned</span>
          <strong>${selectedUnassigned.length}</strong>
        </article>
        <article>
          <span>Referenced Projects</span>
          <strong>${projectCount}</strong>
        </article>
      </header>
      <div class="sourcing-project-note">
        <div>
          <strong>${escapeHtml(currentName)}</strong>
          <span>Quote assignments are reusable. A quote can be assigned to more than one estimate project without changing the original sourcing item.</span>
        </div>
        <div class="sourcing-project-actions">
          <button class="ghost-btn assign-selected-winners" type="button" ${hasCurrentProject && selectedUnassigned.length ? "" : "disabled"}>Assign Selected Winners</button>
          <button class="ghost-btn unassign-selected-winners" type="button" ${hasCurrentProject && selectedEntries.some((entry) => entry.assignedToCurrent) ? "" : "disabled"}>Unassign Selected Winners</button>
        </div>
      </div>
      ${entries.length ? `
        ${renderSourcingAssignmentGroup("Assigned to Current Estimate", entries.filter((entry) => entry.assignedToCurrent))}
        ${renderSourcingAssignmentGroup("Selected Winners Not Assigned", entries.filter((entry) => entry.isSelected && !entry.assignedToCurrent))}
        ${renderSourcingAssignmentGroup("Other Quotes", entries.filter((entry) => !entry.isSelected && !entry.assignedToCurrent))}
      ` : `<div class="sourcing-empty">No quotes yet. Import supplier quotes or add quotes in Detailed view before assigning them to projects.</div>`}
    </div>
  `;
}

function renderSourcingAssignmentGroup(title, entries) {
  if (!entries.length) return "";
  return `
    <section class="sourcing-project-group">
      <header>
        <div>
          <strong>${escapeHtml(title)}</strong>
          <span>${entries.length} quote${entries.length === 1 ? "" : "s"}</span>
        </div>
      </header>
      <div class="sourcing-project-row sourcing-project-head">
        <span>Assignment</span>
        <span>Item</span>
        <span>Supplier</span>
        <span>Selected</span>
        <span>Version</span>
        <span>Landed / pc</span>
        <span>Assigned Projects</span>
        <span>Actions</span>
      </div>
      ${entries.map((entry) => renderSourcingAssignmentRow(entry)).join("")}
    </section>
  `;
}

function renderSourcingAssignmentRow(entry) {
  const currentProject = currentProjectNumber();
  const hasCurrentProject = Boolean(currentProject);
  const assignedLabel = entry.assignedToCurrent ? "Current" : "Not Current";
  return `
    <div class="sourcing-project-row ${entry.assignedToCurrent ? "project-assigned" : ""} ${entry.isSelected ? "project-selected" : ""}" data-row-id="${escapeHtml(entry.row.id)}" data-quote-id="${escapeHtml(entry.quote.id)}">
      <span><b>${assignedLabel}</b><small>${escapeHtml(currentProject || "Draft")}</small></span>
      <span><strong>${escapeHtml(rowDisplayName(entry.row))}</strong><small>${escapeHtml(entry.quote.reusableItemId || reusableSourcingItemCode(entry.row))}</small></span>
      <span>${escapeHtml(entry.quote.vendorName || "Unassigned")}<small>${escapeHtml(entry.quote.status || "Needs Quote")}</small></span>
      <span>${entry.isSelected ? "Winner" : "Bid"}</span>
      <span>v${escapeHtml(entry.quote.quoteVersion || "1")}</span>
      <span>${money(entry.calc.landedUnitCost, 3)}</span>
      <span>${escapeHtml(entry.assignedProjects.join(", ") || "None")}</span>
      <span>
        <button class="ghost-btn assign-current-project-row" type="button" ${hasCurrentProject && !entry.assignedToCurrent ? "" : "disabled"}>Assign</button>
        <button class="ghost-btn unassign-current-project-row" type="button" ${hasCurrentProject && entry.assignedToCurrent ? "" : "disabled"}>Unassign</button>
      </span>
    </div>
  `;
}

function sourcingReadinessRows(candidates = sourcingCandidates()) {
  return candidates.map((row) => {
    const quotes = sourcing.quotes[row.id] || [];
    const selected = selectedQuoteForRow(row);
    const syncEntry = selected ? sourcingEstimateSyncEntry({ row, ...selected }) : null;
    const refreshState = selected ? quoteRefreshState(selected.quote) : null;
    const assignedToCurrent = selected ? quoteAssignedToProject(selected.quote) : false;
    const poReady = selected ? ["PO Ready", "PO Exported"].includes(selected.quote.status) : false;
    const hasForwarder = selected ? Boolean(String(selected.quote.forwarderName || "").trim()) : false;
    const issues = [];
    if (!quotes.length) issues.push("Needs quote");
    if (quotes.length && !selected) issues.push("Select winner");
    if (selected && !assignedToCurrent) issues.push("Assign to estimate");
    if (selected && refreshState?.key !== "current") issues.push("Refresh quote");
    if (selected && !syncEntry?.isSynced) issues.push("Sync estimate");
    if (selected && !hasForwarder) issues.push("Forwarder missing");
    if (selected && !poReady) issues.push("PO not ready");
    return {
      row,
      quotes,
      selected,
      syncEntry,
      refreshState,
      assignedToCurrent,
      poReady,
      hasForwarder,
      issues,
      isReady: issues.length === 0
    };
  }).sort((a, b) => (
    Number(a.isReady) - Number(b.isReady)
    || b.issues.length - a.issues.length
    || rowDisplayName(a.row).localeCompare(rowDisplayName(b.row))
  ));
}

function readinessBadge(label, state = "neutral") {
  return `<b class="readiness-badge readiness-${state}">${escapeHtml(label)}</b>`;
}

function renderSourcingReadinessBoard(candidates) {
  const entries = sourcingReadinessRows(candidates);
  const readyCount = entries.filter((entry) => entry.isReady).length;
  const withQuotes = entries.filter((entry) => entry.quotes.length).length;
  const selectedCount = entries.filter((entry) => entry.selected).length;
  const assignedCount = entries.filter((entry) => entry.assignedToCurrent).length;
  const syncedCount = entries.filter((entry) => entry.syncEntry?.isSynced).length;
  const poCount = entries.filter((entry) => entry.poReady).length;
  return `
    <div class="sourcing-readiness-board">
      <header class="sourcing-readiness-overview">
        <article>
          <span>Items</span>
          <strong>${entries.length}</strong>
        </article>
        <article>
          <span>Ready</span>
          <strong>${readyCount}</strong>
        </article>
        <article>
          <span>Quoted</span>
          <strong>${withQuotes}</strong>
        </article>
        <article>
          <span>Winners</span>
          <strong>${selectedCount}</strong>
        </article>
        <article>
          <span>Assigned</span>
          <strong>${assignedCount}</strong>
        </article>
        <article>
          <span>Synced / PO</span>
          <strong>${syncedCount} / ${poCount}</strong>
        </article>
      </header>
      <div class="sourcing-readiness-actions">
        <button class="ghost-btn export-readiness-csv" type="button" ${entries.length ? "" : "disabled"}>Export Readiness CSV</button>
      </div>
      <section class="sourcing-readiness-table">
        <div class="sourcing-readiness-row sourcing-readiness-head">
          <span>Item</span>
          <span>Quotes</span>
          <span>Winner</span>
          <span>Project</span>
          <span>Refresh</span>
          <span>Sync</span>
          <span>Forwarder</span>
          <span>PO</span>
          <span>Issues</span>
          <span>Actions</span>
        </div>
        ${entries.map((entry) => renderSourcingReadinessRow(entry)).join("")}
      </section>
    </div>
  `;
}

function renderSourcingReadinessRow(entry) {
  const selectedQuote = entry.selected?.quote;
  const issueText = entry.issues.join(", ");
  return `
    <div class="sourcing-readiness-row ${entry.isReady ? "readiness-ready-row" : "readiness-work-row"}" data-row-id="${escapeHtml(entry.row.id)}" data-quote-id="${escapeHtml(selectedQuote?.id || "")}">
      <span><strong>${escapeHtml(rowDisplayName(entry.row))}</strong><small>${escapeHtml(sourcingItemCode(entry.row))}</small></span>
      <span>${entry.quotes.length ? readinessBadge(`${entry.quotes.length}`, "good") : readinessBadge("None", "danger")}</span>
      <span>${selectedQuote ? `${readinessBadge("Winner", "good")}<small>${escapeHtml(selectedQuote.vendorName || "Unassigned")}</small>` : readinessBadge("Needed", entry.quotes.length ? "warning" : "neutral")}</span>
      <span>${entry.assignedToCurrent ? readinessBadge("Assigned", "good") : readinessBadge("Open", selectedQuote ? "warning" : "neutral")}</span>
      <span>${selectedQuote ? readinessBadge(entry.refreshState?.label || "Current", entry.refreshState?.key === "current" ? "good" : "warning") : readinessBadge("N/A", "neutral")}</span>
      <span>${entry.syncEntry?.isSynced ? readinessBadge("Synced", "good") : readinessBadge(selectedQuote ? "Apply" : "N/A", selectedQuote ? "warning" : "neutral")}</span>
      <span>${entry.hasForwarder ? readinessBadge("Set", "good") : readinessBadge(selectedQuote ? "Missing" : "N/A", selectedQuote ? "warning" : "neutral")}</span>
      <span>${entry.poReady ? readinessBadge(selectedQuote.status, "good") : readinessBadge(selectedQuote ? "Needed" : "N/A", selectedQuote ? "warning" : "neutral")}</span>
      <span>${issueText ? escapeHtml(issueText) : "Ready"}</span>
      <span>
        ${selectedQuote && !entry.assignedToCurrent ? `<button class="ghost-btn readiness-assign" type="button">Assign</button>` : ""}
        ${selectedQuote && !entry.syncEntry?.isSynced ? `<button class="ghost-btn readiness-sync" type="button">Sync</button>` : ""}
        ${selectedQuote && entry.refreshState?.key !== "current" ? `<button class="ghost-btn readiness-version" type="button">New Version</button>` : ""}
        ${selectedQuote && !entry.poReady ? `<button class="ghost-btn readiness-po-ready" type="button">PO Ready</button>` : ""}
      </span>
    </div>
  `;
}

const readinessExportColumns = [
  "workspace_number",
  "estimate_number",
  "estimate_name",
  "item",
  "sourcing_id",
  "reusable_item_id",
  "package",
  "product",
  "sku",
  "source",
  "is_ready",
  "issues",
  "quote_count",
  "selected_vendor",
  "selected_version",
  "selected_status",
  "selected_landed_unit_cost",
  "selected_quote_landed_total",
  "assigned_to_current_estimate",
  "assigned_projects",
  "refresh_status",
  "refresh_date",
  "expiration_date",
  "estimate_synced",
  "estimate_current_cost",
  "estimate_selected_landed_cost",
  "estimate_cost_difference",
  "freight_forwarder",
  "po_status"
];

function readinessExportRows(candidates = sourcingCandidates()) {
  return sourcingReadinessRows(candidates).map((entry) => {
    const quote = entry.selected?.quote || null;
    const assignedProjects = quote ? assignedProjectList(quote.assignedProjects) : [];
    return {
      workspace_number: currentWorkspaceNumber || "",
      estimate_number: currentProjectNumber(),
      estimate_name: els.projectName?.value || "",
      item: rowDisplayName(entry.row),
      sourcing_id: sourcingItemCode(entry.row),
      reusable_item_id: quote?.reusableItemId || reusableSourcingItemCode(entry.row),
      package: entry.row.packageName || "",
      product: entry.row.product || "",
      sku: entry.row.sku || "",
      source: entry.row.source || "",
      is_ready: entry.isReady ? "Yes" : "No",
      issues: entry.issues.join("; "),
      quote_count: entry.quotes.length,
      selected_vendor: quote?.vendorName || "",
      selected_version: quote?.quoteVersion || "",
      selected_status: quote?.status || "",
      selected_landed_unit_cost: entry.selected ? decimal(entry.selected.calc.landedUnitCost, 3) : "",
      selected_quote_landed_total: entry.selected ? decimal(entry.selected.calc.landedTotal, 2) : "",
      assigned_to_current_estimate: entry.assignedToCurrent ? "Yes" : "No",
      assigned_projects: assignedProjects.join(", "),
      refresh_status: entry.refreshState?.label || "",
      refresh_date: quote?.refreshDate || quote?.quoteDate || "",
      expiration_date: quote?.expirationDate || "",
      estimate_synced: entry.syncEntry?.isSynced ? "Yes" : entry.selected ? "No" : "",
      estimate_current_cost: entry.syncEntry ? decimal(entry.syncEntry.currentCost, 2) : "",
      estimate_selected_landed_cost: entry.syncEntry ? decimal(entry.syncEntry.nextCost, 2) : "",
      estimate_cost_difference: entry.syncEntry ? decimal(entry.syncEntry.costDelta, 2) : "",
      freight_forwarder: quote?.forwarderName || "",
      po_status: entry.poReady ? quote.status : ""
    };
  });
}

async function exportSourcingReadiness() {
  const exportRows = readinessExportRows(sourcingCandidates());
  if (!exportRows.length) {
    setSourcingImportStatus("No readiness rows to export", true);
    return;
  }
  const csv = [
    csvLine(readinessExportColumns),
    ...exportRows.map((row) => csvLine(readinessExportColumns.map((column) => row[column])))
  ].join("\n");
  const projectToken = filenameToken(currentProjectNumber() || "sourcing", "sourcing");
  const filename = `${projectToken}-sourcing-readiness.csv`;
  try {
    const result = await saveCsvToDownloads(csv, filename);
    setSourcingImportStatus(`Exported ${exportRows.length} readiness row${exportRows.length === 1 ? "" : "s"} to ${result.path || `Downloads/${result.filename}`}`);
    setSaveStatus(`Saved to Downloads: ${result.filename}`);
  } catch (err) {
    console.warn("Readiness export server save failed, using browser download:", err);
    downloadCsvInBrowser(csv, filename);
    setSourcingImportStatus(`Browser download started as ${filename}`);
  }
}

function daysFromToday(dateValue) {
  if (!dateValue) return null;
  const parsed = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil((parsed.getTime() - todayStart.getTime()) / 86400000);
}

function quoteRefreshState(quote) {
  const refreshDate = quote.refreshDate || quote.quoteDate || "";
  const refreshDays = daysFromToday(refreshDate);
  const ageDays = refreshDays === null ? null : Math.max(0, -refreshDays);
  const expirationDays = daysFromToday(quote.expirationDate);
  if (quote.status === "Expired" || (expirationDays !== null && expirationDays <= 0)) {
    return { key: "expired", label: "Expired", detail: quote.expirationDate || "No valid-through date", sort: 0, ageDays, expirationDays };
  }
  if (expirationDays !== null && expirationDays <= 14) {
    return { key: "expiring", label: "Expiring", detail: `${expirationDays}d left`, sort: 1, ageDays, expirationDays };
  }
  if (!refreshDate) {
    return { key: "missing", label: "Missing Date", detail: "No refresh date", sort: 2, ageDays, expirationDays };
  }
  if (ageDays >= 30) {
    return { key: "stale", label: "Refresh Due", detail: `${ageDays}d old`, sort: 3, ageDays, expirationDays };
  }
  return { key: "current", label: "Current", detail: ageDays === null ? "" : `${ageDays}d old`, sort: 4, ageDays, expirationDays };
}

function quoteDateSortValue(value) {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const parsed = new Date(`${value}T00:00:00`).getTime();
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

function quoteRefreshRows(candidates = sourcingCandidates()) {
  return candidates.flatMap((row) => (sourcing.quotes[row.id] || []).map((quote) => {
    const selected = sourcing.selected[row.id] || {};
    const priceBreak = quote.breaks?.find((candidate) => candidate.id === selected.breakId && quote.id === selected.quoteId)
      || quote.breaks?.[0]
      || { qty: 0, unitCost: 0 };
    const calc = quoteBreakCalc(quote, priceBreak);
    return {
      row,
      quote,
      priceBreak,
      calc,
      isSelected: selected.quoteId === quote.id && selected.breakId === priceBreak.id,
      state: quoteRefreshState(quote)
    };
  })).sort((a, b) => (
    a.state.sort - b.state.sort
    || quoteDateSortValue(a.quote.expirationDate) - quoteDateSortValue(b.quote.expirationDate)
    || quoteDateSortValue(a.quote.refreshDate || a.quote.quoteDate) - quoteDateSortValue(b.quote.refreshDate || b.quote.quoteDate)
    || rowDisplayName(a.row).localeCompare(rowDisplayName(b.row))
  ));
}

function renderSourcingRefreshBoard(candidates) {
  const entries = quoteRefreshRows(candidates);
  const needsRefresh = entries.filter((entry) => entry.state.key !== "current").length;
  const expiring = entries.filter((entry) => entry.state.key === "expired" || entry.state.key === "expiring").length;
  const stale = entries.filter((entry) => entry.state.key === "stale" || entry.state.key === "missing").length;
  const selectedNeedsRefresh = entries.filter((entry) => entry.isSelected && entry.state.key !== "current").length;
  const oldestAge = entries.reduce((max, entry) => Math.max(max, entry.state.ageDays || 0), 0);
  return `
    <div class="sourcing-refresh-board">
      <header class="sourcing-refresh-overview">
        <article>
          <span>Tracked Quotes</span>
          <strong>${entries.length}</strong>
        </article>
        <article>
          <span>Needs Refresh</span>
          <strong>${needsRefresh}</strong>
        </article>
        <article>
          <span>Expired / Expiring</span>
          <strong>${expiring}</strong>
        </article>
        <article>
          <span>Stale / Missing</span>
          <strong>${stale}</strong>
        </article>
        <article>
          <span>Selected At Risk</span>
          <strong>${selectedNeedsRefresh}</strong>
        </article>
        <article>
          <span>Oldest Refresh</span>
          <strong>${oldestAge ? `${oldestAge}d` : "Current"}</strong>
        </article>
      </header>
      ${entries.length ? `
        <section class="sourcing-refresh-table">
          <div class="sourcing-refresh-row sourcing-refresh-head">
            <span>Status</span>
            <span>Item</span>
            <span>Supplier</span>
            <span>Version</span>
            <span>Refresh</span>
            <span>Expires</span>
            <span>Qty</span>
            <span>Landed / pc</span>
            <span>Assigned</span>
            <span>Actions</span>
          </div>
          ${entries.map((entry) => renderSourcingRefreshRow(entry)).join("")}
        </section>
      ` : `<div class="sourcing-empty">No quotes yet. Import supplier quotes or add quotes in Detailed view.</div>`}
    </div>
  `;
}

function renderSourcingRefreshRow(entry) {
  const statusClass = `refresh-${entry.state.key}`;
  return `
    <div class="sourcing-refresh-row ${statusClass}" data-row-id="${escapeHtml(entry.row.id)}" data-quote-id="${escapeHtml(entry.quote.id)}">
      <span><b>${escapeHtml(entry.state.label)}</b><small>${escapeHtml(entry.state.detail)}</small></span>
      <span><strong>${escapeHtml(rowDisplayName(entry.row))}</strong><small>${escapeHtml(sourcingItemCode(entry.row))}</small></span>
      <span>${escapeHtml(entry.quote.vendorName || "Unassigned")}<small>${escapeHtml(entry.quote.status || "Needs Quote")}</small></span>
      <span>v${escapeHtml(entry.quote.quoteVersion || "1")}</span>
      <span>${escapeHtml(entry.quote.refreshDate || entry.quote.quoteDate || "")}</span>
      <span>${escapeHtml(entry.quote.expirationDate || "")}</span>
      <span>${Math.round(entry.calc.qty).toLocaleString()}</span>
      <span>${money(entry.calc.landedUnitCost, 3)}</span>
      <span>${escapeHtml(entry.quote.assignedProjects || currentProjectNumber() || "")}${entry.isSelected ? "<small>Selected</small>" : ""}</span>
      <span>
        <button class="ghost-btn refresh-new-version" type="button">New Version</button>
        <button class="ghost-btn refresh-quote-status" type="button" data-status="Clarifying">Clarify</button>
        <button class="ghost-btn refresh-quote-status" type="button" data-status="Expired">Expire</button>
      </span>
    </div>
  `;
}

function sourcingAwardRows(candidates) {
  return candidates
    .map((row) => {
      const selected = selectedQuoteForRow(row);
      return selected ? { row, ...selected } : null;
    })
    .filter(Boolean)
    .sort((a, b) => {
      const vendorSort = String(a.quote.vendorName || "").localeCompare(String(b.quote.vendorName || ""));
      return vendorSort || rowDisplayName(a.row).localeCompare(rowDisplayName(b.row));
    });
}

function renderSourcingAwardBoard(candidates) {
  const awards = sourcingAwardRows(candidates);
  const groups = awards.reduce((memo, award) => {
    const key = award.quote.vendorName || "Unassigned Manufacturer";
    memo[key] = memo[key] || [];
    memo[key].push(award);
    return memo;
  }, {});
  const readyCount = awards.filter((award) => award.quote.status === "PO Ready").length;
  const total = awards.reduce((sum, award) => sum + award.calc.landedTotal, 0);
  return `
    <div class="sourcing-award-board">
      <header class="sourcing-award-overview">
        <article>
          <span>Selected Awards</span>
          <strong>${awards.length}</strong>
        </article>
        <article>
          <span>Suppliers</span>
          <strong>${Object.keys(groups).length}</strong>
        </article>
        <article>
          <span>PO Ready</span>
          <strong>${readyCount}</strong>
        </article>
        <article>
          <span>Awarded Landed</span>
          <strong>${money(total, 2)}</strong>
        </article>
      </header>
      ${awards.length ? Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([vendor, entries]) => renderSourcingAwardGroup(vendor, entries))
        .join("") : `<div class="sourcing-empty">No selected winners yet. Use Decisions to choose quote winners, then return here for award and PO prep.</div>`}
    </div>
  `;
}

function renderSourcingAwardGroup(vendor, awards) {
  const groupTotal = awards.reduce((sum, award) => sum + award.calc.landedTotal, 0);
  const rowIds = awards.map((award) => award.row.id).join(",");
  const readyCount = awards.filter((award) => award.quote.status === "PO Ready").length;
  const forwarders = uniqueValues(awards.map((award) => award.quote.forwarderName || "Unassigned Forwarder")).join(", ");
  return `
    <section class="sourcing-award-group">
      <header>
        <div>
          <strong>${escapeHtml(vendor)}</strong>
          <span>${awards.length} item${awards.length === 1 ? "" : "s"} / ${readyCount} PO ready / ${escapeHtml(forwarders)}</span>
        </div>
        <div class="sourcing-award-group-actions">
          <span>${money(groupTotal, 2)}</span>
          <button class="ghost-btn mark-award-po-ready" type="button" data-row-ids="${escapeHtml(rowIds)}">Mark Group PO Ready</button>
        </div>
      </header>
      <div class="sourcing-award-row sourcing-award-head">
        <span>Item</span>
        <span>Sourcing ID</span>
        <span>Qty</span>
        <span>Landed / pc</span>
        <span>Landed Total</span>
        <span>Forwarder</span>
        <span>Ship From</span>
        <span>Terms</span>
        <span>Lead</span>
        <span>Status</span>
        <span></span>
      </div>
      ${awards.map((award) => renderSourcingAwardRow(award)).join("")}
    </section>
  `;
}

function renderSourcingAwardRow(award) {
  return `
    <div class="sourcing-award-row ${award.quote.status === "PO Ready" ? "po-ready" : ""}">
      <span><strong>${escapeHtml(rowDisplayName(award.row))}</strong><small>${escapeHtml(award.row.packageName)}</small></span>
      <span>${escapeHtml(sourcingItemCode(award.row))}</span>
      <span>${Math.round(award.calc.qty).toLocaleString()}</span>
      <span>${money(award.calc.landedUnitCost, 3)}</span>
      <span>${money(award.calc.landedTotal, 2)}</span>
      <span>${escapeHtml(award.quote.forwarderName || "Unassigned")}</span>
      <span>${escapeHtml(award.quote.shipFrom || "")}</span>
      <span>${escapeHtml(award.quote.incoterm || "")}</span>
      <span>${award.quote.leadTimeDays ? `${Math.round(asNumber(award.quote.leadTimeDays))}d` : ""}</span>
      <span>${escapeHtml(award.quote.status || "Selected")}</span>
      <span>
        <button class="ghost-btn apply-award-estimate" type="button" data-row-id="${escapeHtml(award.row.id)}">Apply</button>
        <button class="ghost-btn mark-award-po-ready" type="button" data-row-ids="${escapeHtml(award.row.id)}">PO Ready</button>
      </span>
    </div>
  `;
}

function sourcingEstimateSyncEntry(award) {
  const estimateCalc = calculate(award.row);
  const qtyToOrder = Math.max(estimateCalc.qtyToOrder, 0);
  const clientQty = Math.max(estimateCalc.qty, 0);
  const currentCost = Math.max(estimateCalc.cost, 0);
  const nextCost = qtyToOrder * award.calc.landedUnitCost;
  const targetClientPrice = clientQty * estimateCalc.ppp;
  const nextMarginAdj = marginAdjForPpp(nextCost, targetClientPrice, award.row.marginAdj);
  const currentUnit = qtyToOrder > 0 ? currentCost / qtyToOrder : estimateCalc.perPieceCost;
  return {
    ...award,
    estimateCalc,
    qtyToOrder,
    clientQty,
    currentCost,
    currentUnit,
    nextCost,
    targetClientPrice,
    nextMarginAdj,
    costDelta: nextCost - currentCost,
    isSynced: Math.abs(nextCost - currentCost) < 0.01 && Math.abs(nextMarginAdj - asNumber(award.row.marginAdj)) < 0.0005
  };
}

function sourcingEstimateSyncRows(candidates = sourcingCandidates()) {
  return sourcingAwardRows(candidates).map(sourcingEstimateSyncEntry).sort((a, b) => {
    const supplierSort = String(a.quote.vendorName || "").localeCompare(String(b.quote.vendorName || ""));
    return supplierSort || Math.abs(b.costDelta) - Math.abs(a.costDelta) || rowDisplayName(a.row).localeCompare(rowDisplayName(b.row));
  });
}

function renderSourcingEstimateSyncBoard(candidates) {
  const entries = sourcingEstimateSyncRows(candidates);
  const groups = entries.reduce((memo, entry) => {
    const key = entry.quote.vendorName || "Unassigned Manufacturer";
    memo[key] = memo[key] || [];
    memo[key].push(entry);
    return memo;
  }, {});
  const currentTotal = entries.reduce((sum, entry) => sum + entry.currentCost, 0);
  const nextTotal = entries.reduce((sum, entry) => sum + entry.nextCost, 0);
  const syncedCount = entries.filter((entry) => entry.isSynced).length;
  const changedCount = entries.length - syncedCount;
  return `
    <div class="sourcing-sync-board">
      <header class="sourcing-sync-overview">
        <article>
          <span>Selected Winners</span>
          <strong>${entries.length}</strong>
        </article>
        <article>
          <span>Need Apply</span>
          <strong>${changedCount}</strong>
        </article>
        <article>
          <span>Current Estimate Cost</span>
          <strong>${money(currentTotal, 2)}</strong>
        </article>
        <article>
          <span>Selected Landed Cost</span>
          <strong>${money(nextTotal, 2)}</strong>
        </article>
        <article>
          <span>Cost Difference</span>
          <strong>${money(nextTotal - currentTotal, 2)}</strong>
        </article>
      </header>
      <div class="sourcing-sync-note">
        <div>
          <strong>PPP retained</strong>
          <span>Applying selected landed costs updates estimate cost and adjusts margin so the current PPP stays unchanged.</span>
        </div>
        <button class="ghost-btn apply-sync-all" type="button" ${changedCount ? "" : "disabled"}>Apply All Visible</button>
      </div>
      ${entries.length ? Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([supplier, groupEntries]) => renderSourcingEstimateSyncGroup(supplier, groupEntries))
        .join("") : `<div class="sourcing-empty">No selected quote winners yet. Use Decisions to select winners before syncing landed costs to the estimate.</div>`}
    </div>
  `;
}

function renderSourcingEstimateSyncGroup(supplier, entries) {
  const currentTotal = entries.reduce((sum, entry) => sum + entry.currentCost, 0);
  const nextTotal = entries.reduce((sum, entry) => sum + entry.nextCost, 0);
  const changedEntries = entries.filter((entry) => !entry.isSynced);
  const rowIds = changedEntries.map((entry) => entry.row.id).join(",");
  return `
    <section class="sourcing-sync-group">
      <header>
        <div>
          <strong>${escapeHtml(supplier)}</strong>
          <span>${entries.length} selected item${entries.length === 1 ? "" : "s"} / ${changedEntries.length} need apply</span>
        </div>
        <div class="sourcing-sync-actions">
          <span>${money(nextTotal - currentTotal, 2)} diff</span>
          <button class="ghost-btn apply-sync-group" type="button" data-row-ids="${escapeHtml(rowIds)}" ${changedEntries.length ? "" : "disabled"}>Apply Supplier</button>
        </div>
      </header>
      <div class="sourcing-sync-row sourcing-sync-head">
        <span>Item</span>
        <span>Supplier</span>
        <span>Estimate Qty</span>
        <span>Quote Qty</span>
        <span>Current / pc</span>
        <span>Landed / pc</span>
        <span>Current Cost</span>
        <span>New Cost</span>
        <span>Diff</span>
        <span>Margin Adj</span>
        <span></span>
      </div>
      ${entries.map((entry) => renderSourcingEstimateSyncRow(entry)).join("")}
    </section>
  `;
}

function renderSourcingEstimateSyncRow(entry) {
  return `
    <div class="sourcing-sync-row ${entry.isSynced ? "sync-synced" : "sync-pending"}">
      <span><strong>${escapeHtml(rowDisplayName(entry.row))}</strong><small>${escapeHtml(sourcingItemCode(entry.row))}</small></span>
      <span>${escapeHtml(entry.quote.vendorName || "Unassigned")}<small>${escapeHtml(entry.quote.status || "Selected")}</small></span>
      <span>${Math.round(entry.qtyToOrder).toLocaleString()}</span>
      <span>${Math.round(entry.calc.qty).toLocaleString()}</span>
      <span>${money(entry.currentUnit, 3)}</span>
      <span>${money(entry.calc.landedUnitCost, 3)}</span>
      <span>${money(entry.currentCost, 2)}</span>
      <span>${money(entry.nextCost, 2)}</span>
      <span class="${entry.costDelta >= 0 ? "positive-diff" : "negative-diff"}">${money(entry.costDelta, 2)}</span>
      <span>${decimal(entry.nextMarginAdj, 3)}</span>
      <span><button class="ghost-btn apply-sync-row" type="button" data-row-id="${escapeHtml(entry.row.id)}" ${entry.isSynced ? "disabled" : ""}>Apply</button></span>
    </div>
  `;
}

function sourcingForwarderRows(candidates = sourcingCandidates()) {
  return sourcingAwardRows(candidates).sort((a, b) => {
    const forwarderSort = String(a.quote.forwarderName || "").localeCompare(String(b.quote.forwarderName || ""));
    const supplierSort = String(a.quote.vendorName || "").localeCompare(String(b.quote.vendorName || ""));
    return forwarderSort || supplierSort || rowDisplayName(a.row).localeCompare(rowDisplayName(b.row));
  });
}

function renderSourcingForwarderBoard(candidates) {
  const entries = sourcingForwarderRows(candidates);
  const groups = entries.reduce((memo, entry) => {
    const key = entry.quote.forwarderName || "Unassigned Forwarder";
    memo[key] = memo[key] || [];
    memo[key].push(entry);
    return memo;
  }, {});
  const manufacturerCount = uniqueValues(entries.map((entry) => entry.quote.vendorName || "Unassigned Manufacturer")).length;
  const freightTotal = entries.reduce((sum, entry) => sum + asNumber(entry.quote.freightEstimate), 0);
  const landedTotal = entries.reduce((sum, entry) => sum + entry.calc.landedTotal, 0);
  return `
    <div class="sourcing-forwarder-board">
      <header class="sourcing-forwarder-overview">
        <article>
          <span>Forwarders</span>
          <strong>${Object.keys(groups).length}</strong>
        </article>
        <article>
          <span>Manufacturers</span>
          <strong>${manufacturerCount}</strong>
        </article>
        <article>
          <span>Selected Items</span>
          <strong>${entries.length}</strong>
        </article>
        <article>
          <span>Freight Estimate</span>
          <strong>${money(freightTotal, 2)}</strong>
        </article>
        <article>
          <span>Landed Total</span>
          <strong>${money(landedTotal, 2)}</strong>
        </article>
      </header>
      ${entries.length ? Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([forwarder, groupEntries]) => renderSourcingForwarderGroup(forwarder, groupEntries))
        .join("") : `<div class="sourcing-empty">No selected winners yet. Choose quote winners in Decisions before reviewing freight forwarder coverage.</div>`}
    </div>
  `;
}

function renderSourcingForwarderGroup(forwarder, entries) {
  const manufacturers = uniqueValues(entries.map((entry) => entry.quote.vendorName || "Unassigned Manufacturer"));
  const shipFroms = uniqueValues(entries.map((entry) => entry.quote.shipFrom).filter(Boolean));
  const modes = uniqueValues(entries.map((entry) => entry.quote.freightMode).filter(Boolean));
  const freightTotal = entries.reduce((sum, entry) => sum + asNumber(entry.quote.freightEstimate), 0);
  const landedTotal = entries.reduce((sum, entry) => sum + entry.calc.landedTotal, 0);
  const qtyTotal = entries.reduce((sum, entry) => sum + entry.calc.qty, 0);
  return `
    <section class="sourcing-forwarder-group">
      <header>
        <div>
          <strong>${escapeHtml(forwarder)}</strong>
          <span>${entries.length} item${entries.length === 1 ? "" : "s"} / ${manufacturers.length} manufacturer${manufacturers.length === 1 ? "" : "s"}${shipFroms.length ? ` / ${escapeHtml(shipFroms.join(", "))}` : ""}</span>
        </div>
        <div class="sourcing-forwarder-actions">
          <span>Qty ${Math.round(qtyTotal).toLocaleString()}</span>
          <span>Freight ${money(freightTotal, 2)}</span>
          <span>Landed ${money(landedTotal, 2)}</span>
          <button class="ghost-btn export-forwarder-manifest" type="button" data-forwarder="${escapeHtml(forwarder)}">Export Manifest CSV</button>
        </div>
      </header>
      <div class="sourcing-forwarder-meta">
        <span><strong>Manufacturers</strong> ${escapeHtml(manufacturers.join(", "))}</span>
        <span><strong>Modes</strong> ${escapeHtml(modes.join(", ") || "Unassigned")}</span>
      </div>
      <div class="sourcing-forwarder-row sourcing-forwarder-head">
        <span>Manufacturer</span>
        <span>Item</span>
        <span>Qty</span>
        <span>Freight</span>
        <span>Landed</span>
        <span>Mode</span>
        <span>Ship From</span>
        <span>Incoterm</span>
        <span>HTS</span>
        <span>Status</span>
      </div>
      ${entries.map((entry) => renderSourcingForwarderRow(entry)).join("")}
    </section>
  `;
}

function renderSourcingForwarderRow(entry) {
  return `
    <div class="sourcing-forwarder-row">
      <span>${escapeHtml(entry.quote.vendorName || "Unassigned")}</span>
      <span><strong>${escapeHtml(rowDisplayName(entry.row))}</strong><small>${escapeHtml(sourcingItemCode(entry.row))}</small></span>
      <span>${Math.round(entry.calc.qty).toLocaleString()}</span>
      <span>${money(asNumber(entry.quote.freightEstimate), 2)}</span>
      <span>${money(entry.calc.landedTotal, 2)}</span>
      <span>${escapeHtml(entry.quote.freightMode || "")}</span>
      <span>${escapeHtml(entry.quote.shipFrom || "")}</span>
      <span>${escapeHtml(entry.quote.incoterm || "")}</span>
      <span>${escapeHtml(entry.quote.htsCode || "")}</span>
      <span>${escapeHtml(entry.quote.status || "Selected")}</span>
    </div>
  `;
}

const forwarderManifestColumns = [
  "workspace_number",
  "estimate_number",
  "estimate_name",
  "freight_forwarder",
  "forwarder_contact",
  "supplier",
  "item",
  "sourcing_id",
  "reusable_item_id",
  "package",
  "product",
  "sku",
  "quantity",
  "freight_estimate",
  "landed_unit_cost",
  "landed_total",
  "currency",
  "freight_mode",
  "incoterm",
  "country_origin",
  "ship_from",
  "customs_broker",
  "hts_code",
  "duty_rate",
  "tariff_rate",
  "lead_time_days",
  "quote_version",
  "quote_date",
  "refresh_date",
  "expiration_date",
  "status",
  "notes"
];

function forwarderManifestExportRows(candidates = sourcingCandidates(), forwarderName = "") {
  const targetForwarder = String(forwarderName || "").trim();
  return sourcingForwarderRows(candidates)
    .filter((entry) => !targetForwarder || (entry.quote.forwarderName || "Unassigned Forwarder") === targetForwarder)
    .map((entry) => ({
      workspace_number: currentWorkspaceNumber || "",
      estimate_number: currentProjectNumber(),
      estimate_name: els.projectName?.value || "",
      freight_forwarder: entry.quote.forwarderName || "Unassigned Forwarder",
      forwarder_contact: entry.quote.forwarderContact || "",
      supplier: entry.quote.vendorName || "",
      item: rowDisplayName(entry.row),
      sourcing_id: sourcingItemCode(entry.row),
      reusable_item_id: entry.quote.reusableItemId || reusableSourcingItemCode(entry.row),
      package: entry.row.packageName || "",
      product: entry.row.product || "",
      sku: entry.row.sku || "",
      quantity: decimal(entry.calc.qty, 0),
      freight_estimate: decimal(asNumber(entry.quote.freightEstimate), 2),
      landed_unit_cost: decimal(entry.calc.landedUnitCost, 3),
      landed_total: decimal(entry.calc.landedTotal, 2),
      currency: entry.quote.currency || "USD",
      freight_mode: entry.quote.freightMode || "",
      incoterm: entry.quote.incoterm || "",
      country_origin: entry.quote.countryOrigin || "",
      ship_from: entry.quote.shipFrom || "",
      customs_broker: entry.quote.brokerName || "",
      hts_code: entry.quote.htsCode || "",
      duty_rate: entry.quote.dutyRate ?? "",
      tariff_rate: entry.quote.tariffRate ?? "",
      lead_time_days: entry.quote.leadTimeDays ?? "",
      quote_version: entry.quote.quoteVersion || "",
      quote_date: entry.quote.quoteDate || "",
      refresh_date: entry.quote.refreshDate || "",
      expiration_date: entry.quote.expirationDate || "",
      status: entry.quote.status || "Selected",
      notes: entry.quote.notes || ""
    }));
}

async function exportForwarderManifest(forwarderName = "") {
  const exportRows = forwarderManifestExportRows(sourcingCandidates(), forwarderName);
  const label = forwarderName || "forwarders";
  if (!exportRows.length) {
    setSourcingImportStatus(`No selected sourcing rows to export for ${label}`, true);
    return;
  }
  const csv = [
    csvLine(forwarderManifestColumns),
    ...exportRows.map((row) => csvLine(forwarderManifestColumns.map((column) => row[column])))
  ].join("\n");
  const projectToken = filenameToken(currentProjectNumber() || "sourcing", "sourcing");
  const filename = `${projectToken}-forwarder-${filenameToken(label, "manifest")}.csv`;
  try {
    const result = await saveCsvToDownloads(csv, filename);
    setSourcingImportStatus(`Exported ${exportRows.length} forwarder manifest row${exportRows.length === 1 ? "" : "s"} to ${result.path || `Downloads/${result.filename}`}`);
    setSaveStatus(`Saved to Downloads: ${result.filename}`);
  } catch (err) {
    console.warn("Forwarder manifest export server save failed, using browser download:", err);
    downloadCsvInBrowser(csv, filename);
    setSourcingImportStatus(`Browser download started as ${filename}`);
  }
}

function renderSourcingPoQueue(candidates) {
  const readyAwards = sourcingAwardRows(candidates).filter((award) => award.quote.status === "PO Ready" || award.quote.status === "PO Exported");
  const groups = readyAwards.reduce((memo, award) => {
    const key = award.quote.vendorName || "Unassigned Manufacturer";
    memo[key] = memo[key] || [];
    memo[key].push(award);
    return memo;
  }, {});
  const total = readyAwards.reduce((sum, award) => sum + award.calc.landedTotal, 0);
  const forwarderCount = uniqueValues(readyAwards.map((award) => award.quote.forwarderName || "Unassigned Forwarder")).length;
  const exportedCount = readyAwards.filter((award) => award.quote.status === "PO Exported").length;
  const exportableCount = readyAwards.filter((award) => award.quote.status === "PO Ready").length;
  return `
    <div class="sourcing-po-board">
      <header class="sourcing-po-overview">
        <article>
          <span>PO Queue Items</span>
          <strong>${readyAwards.length}</strong>
        </article>
        <article>
          <span>Suppliers</span>
          <strong>${Object.keys(groups).length}</strong>
        </article>
        <article>
          <span>Forwarders</span>
          <strong>${forwarderCount}</strong>
        </article>
        <article>
          <span>Queue Landed</span>
          <strong>${money(total, 2)}</strong>
        </article>
        <article>
          <span>Exported</span>
          <strong>${exportedCount}</strong>
        </article>
      </header>
      <div class="sourcing-po-note">
        <div>
          <strong>Xero relay placeholder</strong>
          <span>Items here are marked PO Ready or PO Exported. No purchase order is created or transmitted yet.</span>
        </div>
        <button class="ghost-btn export-po-queue" type="button" ${exportableCount ? "" : "disabled"}>Export PO Queue</button>
      </div>
      ${readyAwards.length ? Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([vendor, entries]) => renderSourcingPoGroup(vendor, entries))
        .join("") : `<div class="sourcing-empty">No items are PO Ready. Use Awards to mark selected winners as PO Ready.</div>`}
    </div>
  `;
}

function renderSourcingPoGroup(vendor, awards) {
  const groupTotal = awards.reduce((sum, award) => sum + award.calc.landedTotal, 0);
  const forwarders = uniqueValues(awards.map((award) => award.quote.forwarderName || "Unassigned Forwarder")).join(", ");
  const readyAwards = awards.filter((award) => award.quote.status === "PO Ready");
  const exportedCount = awards.filter((award) => award.quote.status === "PO Exported").length;
  const readyRowIds = readyAwards.map((award) => award.row.id).join(",");
  return `
    <section class="sourcing-po-group">
      <header>
        <div>
          <strong>${escapeHtml(vendor)}</strong>
          <span>${readyAwards.length} ready / ${exportedCount} exported / ${escapeHtml(forwarders)}</span>
        </div>
        <div class="sourcing-po-actions">
          <span>${money(groupTotal, 2)}</span>
          <button class="ghost-btn export-po-group" type="button" data-row-ids="${escapeHtml(readyRowIds)}" data-supplier="${escapeHtml(vendor)}" ${readyAwards.length ? "" : "disabled"}>Export Supplier CSV</button>
          <button class="ghost-btn send-po-placeholder" type="button" disabled>Send to Xero</button>
        </div>
      </header>
      <div class="sourcing-po-row sourcing-po-head">
        <span>Item</span>
        <span>Qty</span>
        <span>Unit</span>
        <span>Total</span>
        <span>Forwarder</span>
        <span>Broker</span>
        <span>Ship From</span>
        <span>HTS</span>
        <span>Need By</span>
        <span></span>
      </div>
      ${awards.map((award) => renderSourcingPoRow(award)).join("")}
    </section>
  `;
}

function renderSourcingPoRow(award) {
  return `
    <div class="sourcing-po-row ${award.quote.status === "PO Exported" ? "po-exported" : ""}">
      <span><strong>${escapeHtml(rowDisplayName(award.row))}</strong><small>${escapeHtml(sourcingItemCode(award.row))}</small></span>
      <span>${Math.round(award.calc.qty).toLocaleString()}</span>
      <span>${money(award.calc.landedUnitCost, 3)}</span>
      <span>${money(award.calc.landedTotal, 2)}</span>
      <span>${escapeHtml(award.quote.forwarderName || "Unassigned")}</span>
      <span>${escapeHtml(award.quote.brokerName || "Unassigned")}</span>
      <span>${escapeHtml(award.quote.shipFrom || "")}</span>
      <span>${escapeHtml(award.quote.htsCode || "")}</span>
      <span>${escapeHtml(award.quote.expirationDate || award.quote.refreshDate || "")}</span>
      <span><button class="ghost-btn remove-po-ready" type="button" data-row-id="${escapeHtml(award.row.id)}">Remove</button></span>
    </div>
  `;
}

const poQueueColumns = [
  "workspace_number",
  "estimate_number",
  "estimate_name",
  "supplier",
  "item",
  "sourcing_id",
  "reusable_item_id",
  "package",
  "product",
  "sku",
  "description",
  "quantity",
  "landed_unit_cost",
  "landed_total",
  "currency",
  "quote_version",
  "quote_date",
  "refresh_date",
  "expiration_date",
  "incoterm",
  "country_origin",
  "ship_from",
  "freight_mode",
  "freight_forwarder",
  "forwarder_contact",
  "customs_broker",
  "hts_code",
  "duty_rate",
  "tariff_rate",
  "freight_estimate",
  "customs_broker_fees",
  "lead_time_days",
  "notes"
];

function poQueueExportRows(candidates = sourcingCandidates(), rowIds = null) {
  const rowIdSet = rowIds?.length ? new Set(rowIds.map((rowId) => String(rowId))) : null;
  return sourcingAwardRows(candidates)
    .filter((award) => award.quote.status === "PO Ready" && (!rowIdSet || rowIdSet.has(award.row.id)))
    .map((award) => ({
      workspace_number: currentWorkspaceNumber || "",
      estimate_number: currentProjectNumber(),
      estimate_name: els.projectName?.value || "",
      supplier: award.quote.vendorName || "",
      item: rowDisplayName(award.row),
      sourcing_id: sourcingItemCode(award.row),
      reusable_item_id: award.quote.reusableItemId || reusableSourcingItemCode(award.row),
      package: award.row.packageName || "",
      product: award.row.product || "",
      sku: award.row.sku || "",
      description: award.row.description || "",
      quantity: decimal(award.calc.qty, 0),
      landed_unit_cost: decimal(award.calc.landedUnitCost, 3),
      landed_total: decimal(award.calc.landedTotal, 2),
      currency: award.quote.currency || "USD",
      quote_version: award.quote.quoteVersion || "",
      quote_date: award.quote.quoteDate || "",
      refresh_date: award.quote.refreshDate || "",
      expiration_date: award.quote.expirationDate || "",
      incoterm: award.quote.incoterm || "",
      country_origin: award.quote.countryOrigin || "",
      ship_from: award.quote.shipFrom || "",
      freight_mode: award.quote.freightMode || "",
      freight_forwarder: award.quote.forwarderName || "",
      forwarder_contact: award.quote.forwarderContact || "",
      customs_broker: award.quote.brokerName || "",
      hts_code: award.quote.htsCode || "",
      duty_rate: award.quote.dutyRate ?? "",
      tariff_rate: award.quote.tariffRate ?? "",
      freight_estimate: award.quote.freightEstimate ?? "",
      customs_broker_fees: award.quote.customsFees ?? "",
      lead_time_days: award.quote.leadTimeDays ?? "",
      notes: award.quote.notes || ""
    }));
}

async function exportPoQueue(rowIds = null, label = "") {
  const rowIdSet = rowIds?.length ? new Set(rowIds.map((rowId) => String(rowId))) : null;
  const readyAwards = sourcingAwardRows(sourcingCandidates())
    .filter((award) => award.quote.status === "PO Ready" && (!rowIdSet || rowIdSet.has(award.row.id)));
  const exportRows = poQueueExportRows(sourcingCandidates(), rowIds);
  if (!exportRows.length) {
    setSourcingImportStatus(`No PO Ready items to export${label ? ` for ${label}` : ""}`, true);
    return;
  }
  const csv = [
    csvLine(poQueueColumns),
    ...exportRows.map((row) => csvLine(poQueueColumns.map((column) => row[column])))
  ].join("\n");
  const projectToken = filenameToken(currentProjectNumber() || "sourcing", "sourcing");
  const exportToken = rowIdSet ? `po-${filenameToken(label, "supplier")}` : "po-queue";
  const filename = `${projectToken}-${exportToken}.csv`;
  try {
    const result = await saveCsvToDownloads(csv, filename);
    markPoQueueExported(readyAwards.map((award) => award.row.id));
    setSourcingImportStatus(`Exported ${exportRows.length} PO row${exportRows.length === 1 ? "" : "s"}${label ? ` for ${label}` : ""} to ${result.path || `Downloads/${result.filename}`}`);
    setSaveStatus(`Saved to Downloads: ${result.filename}`);
    renderSourcing();
  } catch (err) {
    console.warn("PO queue export server save failed, using browser download:", err);
    downloadCsvInBrowser(csv, filename);
    setSourcingImportStatus(`Browser download started as ${filename}`);
  }
}

function renderCoverageGroup(title, coverageRows, groupType) {
  const selectedRows = coverageRows.filter((entry) => entry.isSelected);
  const selectedTotal = selectedRows.reduce((sum, entry) => sum + entry.calc.landedTotal, 0);
  const qtyTotal = selectedRows.reduce((sum, entry) => sum + entry.calc.qty, 0);
  return `
    <section class="sourcing-coverage-group">
      <header>
        <div>
          <strong>${escapeHtml(title || "Unassigned")}</strong>
          <span>${coverageRows.length} quote${coverageRows.length === 1 ? "" : "s"} / ${selectedRows.length} selected</span>
        </div>
        <div class="sourcing-coverage-totals">
          <span>Selected qty ${Math.round(qtyTotal).toLocaleString()}</span>
          <span>Selected landed ${money(selectedTotal, 2)}</span>
        </div>
      </header>
      <div class="sourcing-coverage-row sourcing-coverage-head">
        <span>Sourcing ID</span>
        <span>Item</span>
        <span>Manufacturer</span>
        <span>Forwarder</span>
        <span>Mode</span>
        <span>Incoterm</span>
        <span>Qty</span>
        <span>Landed / pc</span>
        <span>Refresh</span>
        <span>Status</span>
      </div>
      ${coverageRows.map(({ row, quote, calc, isSelected }) => `
        <div class="sourcing-coverage-row ${isSelected ? "selected-coverage-row" : ""}">
          <span>${escapeHtml(sourcingItemCode(row))}</span>
          <span><strong>${escapeHtml(rowDisplayName(row))}</strong><small>${escapeHtml(row.packageName)}</small></span>
          <span>${escapeHtml(quote.vendorName || "Unassigned")}</span>
          <span>${escapeHtml(quote.forwarderName || "Unassigned")}</span>
          <span>${escapeHtml(quote.freightMode || "")}</span>
          <span>${escapeHtml(quote.incoterm || "")}</span>
          <span>${Math.round(calc.qty).toLocaleString()}</span>
          <span>${money(calc.landedUnitCost, 3)}</span>
          <span>${escapeHtml(quote.refreshDate || quote.quoteDate || "")}</span>
          <span>${isSelected ? "Selected" : escapeHtml(quote.status || "Needs Quote")}</span>
        </div>
      `).join("")}
    </section>
  `;
}

function upsertQuote(rowId, quoteId, patch) {
  sourcing.quotes[rowId] = (sourcing.quotes[rowId] || []).map((quote) => (
    quote.id === quoteId ? { ...quote, ...patch } : quote
  ));
  touchSourcingRecord();
  renderSourcing();
}

function upsertQuoteBreak(rowId, quoteId, breakId, patch) {
  sourcing.quotes[rowId] = (sourcing.quotes[rowId] || []).map((quote) => {
    if (quote.id !== quoteId) return quote;
    return {
      ...quote,
      breaks: (quote.breaks || []).map((priceBreak) => (
        priceBreak.id === breakId ? { ...priceBreak, ...patch } : priceBreak
      ))
    };
  });
  touchSourcingRecord();
  renderSourcing();
}

function addSourcingQuote(rowId) {
  const row = rows.find((candidate) => candidate.id === rowId);
  if (!row) return;
  sourcing.quotes[rowId] = [...(sourcing.quotes[rowId] || []), defaultQuote(row)];
  touchSourcingRecord();
  renderSourcing();
}

function addQuoteBreak(rowId, quoteId) {
  sourcing.quotes[rowId] = (sourcing.quotes[rowId] || []).map((quote) => {
    if (quote.id !== quoteId) return quote;
    const lastBreak = quote.breaks?.[quote.breaks.length - 1] || { qty: 1, unitCost: 0 };
    return {
      ...quote,
      breaks: [...(quote.breaks || []), {
        id: uid("break"),
        qty: Math.max(Math.round(asNumber(lastBreak.qty) * 1.25), asNumber(lastBreak.qty) + 1, 1),
        unitCost: asNumber(lastBreak.unitCost),
        toolingCost: asNumber(lastBreak.toolingCost),
        sampleCost: 0,
        packagingCost: asNumber(lastBreak.packagingCost)
      }]
    };
  });
  touchSourcingRecord();
  renderSourcing();
}

function addQuoteVersion(rowId, quoteId) {
  const quote = (sourcing.quotes[rowId] || []).find((candidate) => candidate.id === quoteId);
  if (!quote) return;
  const row = rows.find((candidate) => candidate.id === rowId);
  const today = new Date().toISOString().slice(0, 10);
  const nextVersion = Math.max(...(sourcing.quotes[rowId] || []).map((candidate) => asNumber(candidate.quoteVersion) || 1)) + 1;
  const copy = structuredClone(quote);
  copy.id = uid("quote");
  copy.quoteVersion = nextVersion;
  copy.quoteDate = today;
  copy.refreshDate = today;
  copy.status = "Received";
  copy.notes = [copy.notes, `Version ${nextVersion} refreshed ${today}.`].filter(Boolean).join("\n");
  copy.breaks = (copy.breaks || []).map((priceBreak, index) => ({
    ...priceBreak,
    id: uid(`break-v${nextVersion}-${index + 1}`)
  }));
  copy.selectedBreakId = copy.breaks[0]?.id || "";
  sourcing.quotes[rowId] = [...(sourcing.quotes[rowId] || []), copy];
  touchSourcingRecord();
  renderSourcing();
  setSourcingImportStatus(`Created quote v${nextVersion} for ${row ? rowDisplayName(row) : "selected item"}`);
}

function setSourcingQuoteStatus(rowId, quoteId, status) {
  if (!rowId || !quoteId || !status) return;
  sourcing.quotes[rowId] = (sourcing.quotes[rowId] || []).map((quote) => (
    quote.id === quoteId ? { ...quote, status } : quote
  ));
  touchSourcingRecord();
  renderSourcing();
  setSourcingImportStatus(`Marked quote ${status}`);
}

function assignCurrentProjectToQuote(rowId, quoteId) {
  const project = currentProjectNumber();
  if (!project) return;
  const quotes = sourcing.quotes[rowId] || [];
  const quote = quotes.find((candidate) => candidate.id === quoteId);
  if (!quote) return;
  const assigned = uniqueValues(String(quote.assignedProjects || "")
    .split(/[,\n]/)
    .map((value) => value.trim())
    .concat(project));
  upsertQuote(rowId, quoteId, { assignedProjects: assigned.join(", ") });
}

function setQuoteCurrentProjectAssignment(rowId, quoteId, assigned) {
  const project = currentProjectNumber();
  if (!project || !rowId || !quoteId) return false;
  const quote = (sourcing.quotes[rowId] || []).find((candidate) => candidate.id === quoteId);
  if (!quote) return false;
  const existing = assignedProjectList(quote.assignedProjects);
  if (assigned && existing.includes(project)) return false;
  if (!assigned && !existing.includes(project)) return false;
  const next = assigned
    ? uniqueValues([...existing, project])
    : existing.filter((candidate) => candidate !== project);
  upsertQuote(rowId, quoteId, { assignedProjects: next.join(", ") });
  return true;
}

function setSelectedWinnerProjectAssignments(assigned) {
  const currentProject = currentProjectNumber();
  if (!currentProject) {
    setSourcingImportStatus("No current estimate number is available for assignment", true);
    return;
  }
  const entries = sourcingAwardRows(sourcingCandidates());
  let changed = 0;
  entries.forEach((entry) => {
    const didChange = setQuoteCurrentProjectAssignment(entry.row.id, entry.quote.id, assigned);
    if (didChange) changed += 1;
  });
  renderSourcing();
  setSourcingImportStatus(`${assigned ? "Assigned" : "Unassigned"} ${changed} selected winner quote${changed === 1 ? "" : "s"} ${assigned ? "to" : "from"} ${currentProject}`, !changed);
}

function selectQuoteBreak(rowId, quoteId, breakId) {
  sourcing.selected[rowId] = { quoteId, breakId };
  sourcing.quotes[rowId] = (sourcing.quotes[rowId] || []).map((quote) => ({
    ...quote,
    status: quote.id === quoteId ? "Selected" : quote.status
  }));
  touchSourcingRecord();
  renderSourcing();
}

function applySelectedQuote(rowId) {
  const row = rows.find((candidate) => candidate.id === rowId);
  const selection = row ? selectedQuoteForRow(row) : null;
  if (!row || !selection) return;
  const estimateCalc = calculate(row);
  const qtyToOrder = Math.max(estimateCalc.qtyToOrder, 0);
  const qty = Math.max(estimateCalc.qty, 0);
  const currentPpp = estimateCalc.ppp;
  const nextCost = qtyToOrder * selection.calc.landedUnitCost;
  const targetClientPrice = qty * currentPpp;
  const marginAdj = targetClientPrice > 0 ? Math.max(Math.min(1 - nextCost / targetClientPrice, 0.95), -0.95) : row.marginAdj;
  updateRow(row.id, { cost: nextCost, marginAdj });
}

function applySelectedQuoteRows(rowIds, label = "selected rows") {
  const ids = uniqueValues(rowIds.map((rowId) => String(rowId || "").trim()).filter(Boolean));
  if (!ids.length) {
    setSourcingImportStatus(`No estimate sync rows to apply for ${label}`, true);
    return;
  }
  let applied = 0;
  ids.forEach((rowId) => {
    const before = rows.find((candidate) => candidate.id === rowId);
    if (!before || !selectedQuoteForRow(before)) return;
    applySelectedQuote(rowId);
    applied += 1;
  });
  renderSourcing();
  setSourcingImportStatus(applied ? `Applied ${applied} selected landed cost${applied === 1 ? "" : "s"} to estimate for ${label}` : `No selected quote winners to apply for ${label}`, !applied);
}

function markAwardRowsPoReady(rowIds) {
  const ids = uniqueValues(rowIds.map((rowId) => String(rowId || "").trim()).filter(Boolean));
  if (!ids.length) return;
  ids.forEach((rowId) => {
    const selected = sourcing.selected[rowId];
    if (!selected?.quoteId) return;
    sourcing.quotes[rowId] = (sourcing.quotes[rowId] || []).map((quote) => (
      quote.id === selected.quoteId ? { ...quote, status: "PO Ready" } : quote
    ));
  });
  touchSourcingRecord();
  renderSourcing();
}

function clearAwardRowsPoReady(rowIds) {
  const ids = uniqueValues(rowIds.map((rowId) => String(rowId || "").trim()).filter(Boolean));
  if (!ids.length) return;
  ids.forEach((rowId) => {
    const selected = sourcing.selected[rowId];
    if (!selected?.quoteId) return;
    sourcing.quotes[rowId] = (sourcing.quotes[rowId] || []).map((quote) => (
      quote.id === selected.quoteId && (quote.status === "PO Ready" || quote.status === "PO Exported") ? { ...quote, status: "Selected" } : quote
    ));
  });
  touchSourcingRecord();
  renderSourcing();
}

function markPoQueueExported(rowIds) {
  const ids = uniqueValues(rowIds.map((rowId) => String(rowId || "").trim()).filter(Boolean));
  if (!ids.length) return;
  ids.forEach((rowId) => {
    const selected = sourcing.selected[rowId];
    if (!selected?.quoteId) return;
    sourcing.quotes[rowId] = (sourcing.quotes[rowId] || []).map((quote) => (
      quote.id === selected.quoteId && quote.status === "PO Ready" ? { ...quote, status: "PO Exported" } : quote
    ));
  });
  touchSourcingRecord();
}

function sourcingContextBadge(label, value, tone = "neutral") {
  return `<span class="sourcing-context-badge ${tone ? `tone-${tone}` : ""}"><b>${escapeHtml(label)}</b>${escapeHtml(value)}</span>`;
}

function sourcingHealthPill(label, value, tone = "neutral", viewMode = "") {
  const content = `<b>${escapeHtml(label)}</b>${escapeHtml(value)}`;
  if (!viewMode) return `<span class="sourcing-health-pill tone-${tone}">${content}</span>`;
  return `<button class="sourcing-health-pill tone-${tone} is-action" type="button" data-sourcing-jump="${escapeHtml(viewMode)}">${content}</button>`;
}

function sourcingActiveRecordMeta() {
  const type = recordTypeFor("sourcing");
  const workspace = workspaceByNumber(currentWorkspaceNumber);
  const records = workspace?.records?.sourcing || [];
  const activeNumber = activeRecordNumber("sourcing") || nextWorkspaceRecordNumber("sourcing", "SRC", "sourcingNumber");
  const activeRecord = records.find((record) => record[type.numberKey] === activeNumber);
  return { activeNumber, activeRecord };
}

function sourcingRecordHealthHtml(candidates) {
  const { activeNumber, activeRecord } = sourcingActiveRecordMeta();
  const quoteCount = Object.values(sourcing.quotes || {}).reduce((sum, quotes) => sum + quotes.length, 0);
  const quotedItems = candidates.filter((row) => (sourcing.quotes[row.id] || []).length).length;
  const decisionCandidates = candidates.filter((row) => quoteDecisionCandidates(row).length);
  const selectedAwards = sourcingAwardRows(candidates);
  const needsSelection = decisionCandidates.filter((row) => !selectedQuoteForRow(row)).length;
  const syncRows = sourcingEstimateSyncRows(candidates);
  const needsSync = syncRows.filter((entry) => !entry.isSynced).length;
  const refreshRows = quoteRefreshRows(candidates);
  const needsRefresh = refreshRows.filter((entry) => entry.state.key !== "current").length;
  const queueRows = selectedAwards.filter((award) => award.quote.status === "PO Ready" || award.quote.status === "PO Exported");
  const poReady = queueRows.filter((award) => award.quote.status === "PO Ready").length;
  const poExported = queueRows.filter((award) => award.quote.status === "PO Exported").length;
  const assignmentRows = sourcingAssignmentRows(candidates);
  const selectedUnassigned = assignmentRows.filter((entry) => entry.isSelected && !entry.assignedToCurrent).length;
  const hasUnsaved = dirtyWorkspaceRecords.has("sourcing");
  const recordTone = !activeRecord || hasUnsaved ? "warning" : "good";
  const recordValue = !activeRecord ? `${activeNumber} not saved` : hasUnsaved ? `${activeNumber} changed` : `${activeNumber} saved`;
  const nextStep = !candidates.length
    ? "Add sourced items"
    : quoteCount === 0
      ? "Import or add quotes"
      : needsSelection
        ? "Choose winners"
        : selectedUnassigned
          ? "Assign to estimate"
          : needsSync
            ? "Sync estimate costs"
            : needsRefresh
              ? "Refresh old quotes"
              : poReady
                ? "Export PO CSV"
                : hasUnsaved || !activeRecord
                  ? "Save sourcing set"
                  : "Ready";
  const nextView = !candidates.length
    ? "summary"
    : quoteCount === 0
      ? "detail"
      : needsSelection
        ? "decision"
        : selectedUnassigned
          ? "projects"
          : needsSync
            ? "sync"
            : needsRefresh
              ? "refresh"
              : poReady
                ? "poQueue"
                : "";
  const nextTone = nextStep === "Ready" ? "good" : "warning";
  return `
    <div class="sourcing-health-row" aria-label="Sourcing record status">
      ${sourcingHealthPill("Record", recordValue, recordTone)}
      ${sourcingHealthPill("Coverage", `${quotedItems}/${candidates.length} items · ${quoteCount} quotes`, quotedItems === candidates.length && candidates.length ? "good" : "warning", quoteCount ? "summary" : "detail")}
      ${sourcingHealthPill("Decisions", `${selectedAwards.length} selected${needsSelection ? ` · ${needsSelection} open` : ""}`, needsSelection ? "warning" : selectedAwards.length ? "good" : "neutral", "decision")}
      ${sourcingHealthPill("Sync", needsSync ? `${needsSync} need apply` : "Current", needsSync ? "warning" : "good", "sync")}
      ${sourcingHealthPill("Refresh", needsRefresh ? `${needsRefresh} need refresh` : "Current", needsRefresh ? "warning" : "good", "refresh")}
      ${sourcingHealthPill("PO", poReady || poExported ? `${poReady} ready · ${poExported} exported` : "No queue", poReady ? "warning" : poExported ? "good" : "neutral", "poQueue")}
      ${sourcingHealthPill("Next", nextStep, nextTone, nextView)}
    </div>
  `;
}

function sourcingBoardContextHtml(candidates) {
  const quotes = quoteCoverageRows(candidates);
  const awards = sourcingAwardRows(candidates);
  const selectedCount = awards.length;
  const quoteCount = quotes.length;
  const quotedItemCount = candidates.filter((row) => (sourcing.quotes[row.id] || []).length).length;
  if (sourcingViewMode === "projects") {
    const assignments = sourcingAssignmentRows(candidates);
    const assigned = assignments.filter((entry) => entry.assignedToCurrent).length;
    const selectedUnassigned = assignments.filter((entry) => entry.isSelected && !entry.assignedToCurrent).length;
    const projectCount = uniqueValues(assignments.flatMap((entry) => entry.assignedProjects)).length;
    return [
      sourcingContextBadge("Assigned", assigned.toLocaleString(), assigned ? "good" : "neutral"),
      sourcingContextBadge("Selected open", selectedUnassigned.toLocaleString(), selectedUnassigned ? "warning" : "good"),
      sourcingContextBadge("Projects", projectCount.toLocaleString())
    ].join("");
  }
  if (sourcingViewMode === "readiness") {
    const readinessRows = sourcingReadinessRows(candidates);
    const ready = readinessRows.filter((entry) => entry.isReady).length;
    const work = readinessRows.length - ready;
    const issueCount = readinessRows.reduce((sum, entry) => sum + entry.issues.length, 0);
    return [
      sourcingContextBadge("Ready", `${ready}/${readinessRows.length}`, ready === readinessRows.length && readinessRows.length ? "good" : "neutral"),
      sourcingContextBadge("Needs work", work.toLocaleString(), work ? "warning" : "good"),
      sourcingContextBadge("Open issues", issueCount.toLocaleString(), issueCount ? "warning" : "good")
    ].join("");
  }
  if (sourcingViewMode === "decision") {
    const withDecisionQuotes = candidates.filter((row) => quoteDecisionCandidates(row).length).length;
    const needsSelection = candidates.filter((row) => quoteDecisionCandidates(row).length && !selectedQuoteForRow(row)).length;
    return [
      sourcingContextBadge("Quoted items", withDecisionQuotes.toLocaleString()),
      sourcingContextBadge("Selected", selectedCount.toLocaleString(), selectedCount ? "good" : "neutral"),
      sourcingContextBadge("Needs selection", needsSelection.toLocaleString(), needsSelection ? "warning" : "good")
    ].join("");
  }
  if (sourcingViewMode === "sync") {
    const syncRows = sourcingEstimateSyncRows(candidates);
    const needApply = syncRows.filter((entry) => !entry.isSynced).length;
    const diff = syncRows.reduce((sum, entry) => sum + entry.costDelta, 0);
    return [
      sourcingContextBadge("Selected", syncRows.length.toLocaleString()),
      sourcingContextBadge("Need apply", needApply.toLocaleString(), needApply ? "warning" : "good"),
      sourcingContextBadge("Cost diff", money(diff, 2), Math.abs(diff) > 0.01 ? "warning" : "good")
    ].join("");
  }
  if (sourcingViewMode === "award") {
    const suppliers = uniqueValues(awards.map((award) => award.quote.vendorName || "Unassigned Manufacturer")).length;
    const ready = awards.filter((award) => award.quote.status === "PO Ready" || award.quote.status === "PO Exported").length;
    return [
      sourcingContextBadge("Awards", awards.length.toLocaleString()),
      sourcingContextBadge("Suppliers", suppliers.toLocaleString()),
      sourcingContextBadge("PO ready", `${ready}/${awards.length}`, ready === awards.length && awards.length ? "good" : "warning")
    ].join("");
  }
  if (sourcingViewMode === "forwarder") {
    const forwarderRows = sourcingForwarderRows(candidates);
    const forwarders = uniqueValues(forwarderRows.map((entry) => entry.quote.forwarderName || "Unassigned Forwarder")).length;
    const manufacturers = uniqueValues(forwarderRows.map((entry) => entry.quote.vendorName || "Unassigned Manufacturer")).length;
    const missing = forwarderRows.filter((entry) => !String(entry.quote.forwarderName || "").trim()).length;
    return [
      sourcingContextBadge("Forwarders", forwarders.toLocaleString(), forwarders ? "good" : "neutral"),
      sourcingContextBadge("Manufacturers", manufacturers.toLocaleString()),
      sourcingContextBadge("Missing", missing.toLocaleString(), missing ? "warning" : "good")
    ].join("");
  }
  if (sourcingViewMode === "refresh") {
    const refreshRows = quoteRefreshRows(candidates);
    const needsRefresh = refreshRows.filter((entry) => entry.state.key !== "current").length;
    const expiring = refreshRows.filter((entry) => entry.state.key === "expired" || entry.state.key === "expiring").length;
    const oldestAge = refreshRows.reduce((max, entry) => Math.max(max, entry.state.ageDays || 0), 0);
    return [
      sourcingContextBadge("Needs refresh", needsRefresh.toLocaleString(), needsRefresh ? "warning" : "good"),
      sourcingContextBadge("Expired/expiring", expiring.toLocaleString(), expiring ? "warning" : "good"),
      sourcingContextBadge("Oldest", oldestAge ? `${oldestAge}d` : "Current", oldestAge >= 30 ? "warning" : "good")
    ].join("");
  }
  if (sourcingViewMode === "poQueue") {
    const queueRows = awards.filter((award) => award.quote.status === "PO Ready" || award.quote.status === "PO Exported");
    const ready = queueRows.filter((award) => award.quote.status === "PO Ready").length;
    const exported = queueRows.filter((award) => award.quote.status === "PO Exported").length;
    const suppliers = uniqueValues(queueRows.map((award) => award.quote.vendorName || "Unassigned Manufacturer")).length;
    return [
      sourcingContextBadge("Ready", ready.toLocaleString(), ready ? "warning" : "neutral"),
      sourcingContextBadge("Exported", exported.toLocaleString(), exported ? "good" : "neutral"),
      sourcingContextBadge("Suppliers", suppliers.toLocaleString())
    ].join("");
  }
  return [
    sourcingContextBadge("Items", candidates.length.toLocaleString()),
    sourcingContextBadge("Quoted", `${quotedItemCount}/${candidates.length}`, quotedItemCount === candidates.length && candidates.length ? "good" : "neutral"),
    sourcingContextBadge("Quotes", quoteCount.toLocaleString()),
    sourcingContextBadge("Selected", selectedCount.toLocaleString(), selectedCount ? "good" : "neutral")
  ].join("");
}

function renderSourcing() {
  if (!els.sourcingView || !els.sourcingItems) return;
  const candidates = sourcingCandidates();
  const quoteCount = Object.values(sourcing.quotes).reduce((sum, quotes) => sum + quotes.length, 0);
  const selectedRows = rows.map((row) => selectedQuoteForRow(row)).filter(Boolean);
  const latestRefresh = selectedRows
    .map((selection) => selection.quote.refreshDate || selection.quote.quoteDate || "")
    .filter(Boolean)
    .sort()
    .at(-1);
  const groupBy = els.sourcingGroupBy?.value || "item";
  if (els.sourcingProjectScope) {
    const workspaceNumber = currentWorkspaceNumber || "No Workspace";
    const workspaceName = els.workspaceName?.value.trim();
    const projectNumber = currentProjectNumber() || "Draft";
    const projectName = els.projectName.value.trim();
    const estimateLabel = projectName ? `${projectNumber} v${currentEstimateVersion()} / ${projectName}` : `${projectNumber} v${currentEstimateVersion()}`;
    els.sourcingProjectScope.textContent = `${workspaceNumber}${workspaceName ? ` / ${workspaceName}` : ""} · ${estimateLabel}`;
  }
  els.sourcingItemCount.textContent = candidates.length.toLocaleString();
  els.sourcingQuoteCount.textContent = quoteCount.toLocaleString();
  els.sourcingSelectedCount.textContent = selectedRows.length.toLocaleString();
  els.sourcingSelectedCost.textContent = money(selectedRows.reduce((sum, selection) => sum + selection.calc.landedTotal, 0), 2);
  if (els.sourcingLatestRefresh) els.sourcingLatestRefresh.textContent = latestRefresh || "None";
  els.sourcingViewModeButtons.forEach((button) => {
    const isActive = button.dataset.sourcingViewMode === sourcingViewMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  if (els.sourcingBoardContext) {
    els.sourcingBoardContext.innerHTML = `${sourcingRecordHealthHtml(candidates)}${candidates.length ? `<div class="sourcing-view-context-row">${sourcingBoardContextHtml(candidates)}</div>` : ""}`;
  }

  if (!candidates.length) {
    els.sourcingItems.innerHTML = `<div class="sourcing-empty">No sourced items match this view. Mark estimate rows as Manufacturer or vendor, or turn on Show all estimate items.</div>`;
    return;
  }

  if (sourcingViewMode === "decision") {
    els.sourcingItems.innerHTML = renderSourcingDecisionBoard(candidates);
    return;
  }

  if (sourcingViewMode === "projects") {
    els.sourcingItems.innerHTML = renderSourcingAssignmentBoard(candidates);
    return;
  }

  if (sourcingViewMode === "readiness") {
    els.sourcingItems.innerHTML = renderSourcingReadinessBoard(candidates);
    return;
  }

  if (sourcingViewMode === "award") {
    els.sourcingItems.innerHTML = renderSourcingAwardBoard(candidates);
    return;
  }

  if (sourcingViewMode === "sync") {
    els.sourcingItems.innerHTML = renderSourcingEstimateSyncBoard(candidates);
    return;
  }

  if (sourcingViewMode === "forwarder") {
    els.sourcingItems.innerHTML = renderSourcingForwarderBoard(candidates);
    return;
  }

  if (sourcingViewMode === "refresh") {
    els.sourcingItems.innerHTML = renderSourcingRefreshBoard(candidates);
    return;
  }

  if (sourcingViewMode === "poQueue") {
    els.sourcingItems.innerHTML = renderSourcingPoQueue(candidates);
    return;
  }

  if (groupBy !== "item") {
    const coverageRows = quoteCoverageRows(candidates);
    if (!coverageRows.length) {
      els.sourcingItems.innerHTML = `<div class="sourcing-empty">No quotes yet. Add quotes in Item view, then use this view to see manufacturer and freight forwarder coverage.</div>`;
      return;
    }
    const groups = coverageRows.reduce((memo, entry) => {
      const key = groupBy === "manufacturer"
        ? entry.quote.vendorName || "Unassigned Manufacturer"
        : entry.quote.forwarderName || "Unassigned Freight Forwarder";
      memo[key] = memo[key] || [];
      memo[key].push(entry);
      return memo;
    }, {});
    els.sourcingItems.innerHTML = Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([group, entries]) => renderCoverageGroup(group, entries, groupBy))
      .join("");
    return;
  }

  els.sourcingItems.innerHTML = sourcingViewMode === "summary"
    ? renderSourcingSummaryBoard(candidates)
    : candidates.map((row) => renderSourcingItemDetail(row, true)).join("");
}

function renderSourcingSummaryBoard(candidates) {
  return `
    <div class="sourcing-summary-board">
      <div class="sourcing-summary-row sourcing-summary-head">
        <span>Select</span>
        <span>Sourcing ID</span>
        <span>Item</span>
        <span>Manufacturer</span>
        <span>Forwarder</span>
        <span>Version</span>
        <span>Refresh</span>
        <span>Qty</span>
        <span>Landed / pc</span>
        <span>Status</span>
        <span></span>
      </div>
      ${candidates.map((row) => renderSourcingSummaryRow(row)).join("")}
    </div>
  `;
}

function renderSourcingSummaryRow(row) {
  const quotes = sourcing.quotes[row.id] || [];
  const selected = selectedQuoteForRow(row);
  const quote = selected?.quote || quotes[0] || {};
  const calc = selected?.calc || (quote.breaks?.[0] ? quoteBreakCalc(quote, quote.breaks[0]) : calculate(row));
  const expanded = sourcingExpandedRows.has(row.id);
  return `
    <section class="sourcing-summary-item ${expanded ? "expanded" : ""}" data-row-id="${row.id}">
      <div class="sourcing-summary-row sourcing-summary-line" role="button" tabindex="0">
        <span class="summary-select-cell">
          <input class="sourcing-row-select" type="checkbox" ${selectedSourcingRows.has(row.id) ? "checked" : ""} aria-label="Select ${escapeHtml(rowDisplayName(row))}" />
          <b class="summary-chevron">${expanded ? "⌄" : "›"}</b>
        </span>
        <span>${escapeHtml(sourcingItemCode(row))}<small>${escapeHtml(quote.reusableItemId || reusableSourcingItemCode(row))}</small></span>
        <span><strong>${escapeHtml(rowDisplayName(row))}</strong><small>${escapeHtml(row.packageName)}</small></span>
        <span>${escapeHtml(quote.vendorName || "No quote")}<small>${escapeHtml(quote.assignedProjects || currentProjectNumber() || "")}</small></span>
        <span>${escapeHtml(quote.forwarderName || "Unassigned")}</span>
        <span>${quote.quoteVersion ? `v${escapeHtml(quote.quoteVersion)}` : ""}</span>
        <span>${escapeHtml(quote.refreshDate || quote.quoteDate || "")}</span>
        <span>${Math.round(calc.qty || calculate(row).qtyToOrder || 0).toLocaleString()}</span>
        <span>${selected ? money(selected.calc.landedUnitCost, 3) : "—"}</span>
        <span>${selected ? "Selected" : escapeHtml(quote.status || "Needs Quote")}</span>
        <span><button class="ghost-btn add-sourcing-quote" type="button">Add Quote</button></span>
      </div>
      ${expanded ? renderSourcingItemDetail(row, false) : ""}
    </section>
  `;
}

function renderSourcingItemDetail(row, includeHeader) {
  const quotes = sourcing.quotes[row.id] || [];
  const calc = calculate(row);
  const selected = selectedQuoteForRow(row);
  return `
    <section class="sourcing-item" data-row-id="${row.id}">
      ${includeHeader ? `
        <header class="sourcing-item-head">
          <div>
            <strong>${escapeHtml(rowDisplayName(row))}</strong>
            <span>${escapeHtml(sourcingItemCode(row))} · ${escapeHtml(row.packageName)}${row.product ? ` / ${escapeHtml(row.product)}` : ""}</span>
          </div>
          <div class="sourcing-item-meta">
            <span>${escapeHtml(row.source || "Unassigned")}</span>
            <span>Qty to order ${Math.round(calc.qtyToOrder).toLocaleString()}</span>
            <span>Current ${money(calc.perPieceCost, 3)} / pc</span>
            ${selected ? `<span class="selected-pill">Selected ${money(selected.calc.landedUnitCost, 3)} / pc</span>` : `<span class="needs-pill">Needs quote</span>`}
          </div>
          <button class="ghost-btn add-sourcing-quote" type="button">Add Quote</button>
        </header>
      ` : ""}
      <div class="sourcing-quotes">
        ${quotes.length ? quotes.map((quote) => renderSourcingQuote(row, quote)).join("") : `<div class="sourcing-no-quotes">No quotes yet.</div>`}
      </div>
    </section>
  `;
}

function renderSourcingQuote(row, quote) {
  const selected = sourcing.selected[row.id] || {};
  const bestBreak = quote.breaks?.find((priceBreak) => priceBreak.id === selected.breakId && quote.id === selected.quoteId);
  const selectedCalc = bestBreak ? quoteBreakCalc(quote, bestBreak) : null;
  const field = (key, label, type = "text", extra = "") => `
    <label>${label}<input class="sourcing-quote-field" data-key="${key}" type="${type}" value="${escapeHtml(quote[key] ?? "")}" ${extra} /></label>
  `;
  return `
    <article class="sourcing-quote" data-quote-id="${quote.id}">
      <div class="sourcing-quote-grid">
        ${field("reusableItemId", "Reusable Item ID")}
        ${field("vendorName", "Manufacturer / Vendor")}
        ${field("quoteVersion", "Version", "number", "step=\"1\" min=\"1\"")}
        <label>Status
          <select class="sourcing-quote-field" data-key="status">
            ${["Needs Quote", "Requested", "Received", "Clarifying", "Selected", "Rejected", "Expired", "PO Ready", "PO Exported"].map((status) => `<option value="${status}" ${quote.status === status ? "selected" : ""}>${status}</option>`).join("")}
          </select>
        </label>
        ${field("quoteDate", "Quote Date", "date")}
        ${field("refreshDate", "Refresh Date", "date")}
        ${field("expirationDate", "Expires", "date")}
        ${field("assignedProjects", "Assigned Projects")}
        <label>Incoterm
          <select class="sourcing-quote-field" data-key="incoterm">
            ${["EXW", "FOB", "CIF", "DDP", "DAP"].map((term) => `<option value="${term}" ${quote.incoterm === term ? "selected" : ""}>${term}</option>`).join("")}
          </select>
        </label>
        ${field("countryOrigin", "Country of Origin")}
        ${field("shipFrom", "Ship From")}
        <label>Freight Mode
          <select class="sourcing-quote-field" data-key="freightMode">
            ${["Ocean", "Air", "Express", "Truck", "Mixed"].map((mode) => `<option value="${mode}" ${quote.freightMode === mode ? "selected" : ""}>${mode}</option>`).join("")}
          </select>
        </label>
        ${field("forwarderName", "Freight Forwarder")}
        ${field("forwarderContact", "Forwarder Contact")}
        ${field("brokerName", "Customs Broker")}
        ${field("htsCode", "HTS Code")}
        ${field("dutyRate", "Duty Rate", "number", "step=\"0.01\" min=\"0\"")}
        ${field("tariffRate", "Tariff Rate", "number", "step=\"0.01\" min=\"0\"")}
        ${field("freightEstimate", "Freight", "number", "step=\"1\" min=\"0\"")}
        ${field("customsFees", "Customs / Broker", "number", "step=\"1\" min=\"0\"")}
        ${field("leadTimeDays", "Lead Days", "number", "step=\"1\" min=\"0\"")}
      </div>
      <label class="sourcing-notes">Notes<textarea class="sourcing-quote-field" data-key="notes" rows="2">${escapeHtml(quote.notes || "")}</textarea></label>
      <div class="sourcing-breaks">
        <div class="sourcing-break sourcing-break-head">
          <span>Select</span><span>Qty</span><span>Unit Cost</span><span>Tooling</span><span>Sample</span><span>Packaging</span><span>Landed Total</span><span>Landed / pc</span>
        </div>
        ${(quote.breaks || []).map((priceBreak) => {
          const calc = quoteBreakCalc(quote, priceBreak);
          const isSelected = selected.quoteId === quote.id && selected.breakId === priceBreak.id;
          return `
            <div class="sourcing-break ${isSelected ? "selected-break" : ""}" data-break-id="${priceBreak.id}">
              <button class="ghost-btn select-sourcing-break" type="button">${isSelected ? "Selected" : "Select"}</button>
              <input class="sourcing-break-field" data-key="qty" type="number" min="0" step="1" value="${decimal(priceBreak.qty, 0)}" />
              <input class="sourcing-break-field" data-key="unitCost" type="number" min="0" step="0.001" value="${decimal(priceBreak.unitCost, 3)}" />
              <input class="sourcing-break-field" data-key="toolingCost" type="number" min="0" step="1" value="${decimal(priceBreak.toolingCost, 0)}" />
              <input class="sourcing-break-field" data-key="sampleCost" type="number" min="0" step="1" value="${decimal(priceBreak.sampleCost, 0)}" />
              <input class="sourcing-break-field" data-key="packagingCost" type="number" min="0" step="1" value="${decimal(priceBreak.packagingCost, 0)}" />
              <strong>${money(calc.landedTotal, 2)}</strong>
              <strong>${money(calc.landedUnitCost, 3)}</strong>
            </div>
          `;
        }).join("")}
      </div>
      <div class="sourcing-quote-actions">
        <button class="ghost-btn add-quote-break" type="button">Add Qty Break</button>
        <button class="ghost-btn add-quote-version" type="button">New Version</button>
        <button class="ghost-btn assign-current-project" type="button">Assign Current Project</button>
        <button class="ghost-btn apply-sourcing-quote" type="button" ${selectedCalc ? "" : "disabled"}>Apply Selected to Estimate</button>
        ${selectedCalc ? `<span>Selected landed cost ${money(selectedCalc.landedUnitCost, 3)} / pc</span>` : `<span>Select a quantity break to use this quote.</span>`}
      </div>
    </article>
  `;
}

function setActiveView(viewId) {
  activeView = isViewVisibleInMode(viewId) ? viewId : defaultWorkspaceView();
  const workspace = workspaceByNumber(currentWorkspaceNumber);
  if (workspace) {
    workspace.activeView = activeView;
    workspace.workspaceMode = workspaceMode;
    workspace.updatedAt = new Date().toISOString();
    saveWorkspaces();
  }
  [els.proposalView, els.estimateView, els.servicesView, els.sourcingView, els.printQuoteView, els.ecommView].forEach((view) => {
    if (!view) return;
    const isActive = view.id === activeView;
    view.hidden = !isActive;
    view.classList.toggle("active-view", isActive);
  });
  els.appTabs.forEach((tab) => {
    const isVisible = isViewVisibleInMode(tab.dataset.view);
    tab.hidden = !isVisible;
    tab.classList.toggle("active", tab.dataset.view === activeView);
  });
  if (activeView === "proposalView") renderProposal();
  if (activeView === "servicesView") renderServicesCalculator();
  if (activeView === "sourcingView") renderSourcing();
}

function openWorkspaceRecordCollection(collection) {
  const type = recordTypeFor(collection);
  if (!type?.viewId) return;
  if (!isViewVisibleInMode(type.viewId)) {
    setWorkspaceMode("full", { preferredView: type.viewId });
    render();
    return;
  }
  setActiveView(type.viewId);
}

function syncLookupsFromRow(row) {
  const changes = {
    packages: row.packageName,
    products: row.product,
    elements: row.element
  };
  Object.entries(changes).forEach(([key, value]) => {
    if (value && !lookups[key].includes(value)) lookups[key] = uniqueValues([...lookups[key], value]);
  });
}

function renderDatalists() {
  renderWorkspaceDatalists();
  const sorted = sortEstimatesList(estimatesList);
  [
    [els.packageLookup, lookups.packages],
    [els.productLookup, lookups.products],
    [els.elementLookup, lookups.elements],
    [els.clientLookup, uniqueValues([...(lookups.clients || []), ...clientsList, ...sorted.map((e) => e.clientName), els.clientName.value])],
    [els.yearLookup, uniqueValues([...(lookups.years || []), ...sorted.map((e) => e.estimateYear), els.estimateYear.value])]
  ].forEach(([list, values]) => {
    list.innerHTML = "";
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      list.append(option);
    });
  });

  els.projectNameLookup.innerHTML = "";
  sorted.forEach((estimate) => {
    const projectNumber = String(estimate.projectNumber || "").trim();
    const projectName = String(estimate.projectName || "").trim();
    if (projectName) {
      const option = document.createElement("option");
      option.value = projectName;
      option.label = projectNumber;
      els.projectNameLookup.append(option);
    }
  });
}

function renderFilters() {
  const packages = ["All", ...uniqueValues([...lookups.packages, ...rows.map((row) => row.packageName)])];
  els.packageFilters.innerHTML = "";
  packages.forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = name;
    button.className = name === activePackage ? "active" : "";
    button.addEventListener("click", () => {
      if (name !== "All" && !packageRows().some((row) => row.packageName === name)) {
        activePackage = name;
        addPackage(name);
        return;
      }
      activePackage = name;
      touchWorkspaceRecord("estimates");
      render();
    });
    els.packageFilters.append(button);
  });

  els.typeFilters.innerHTML = "";
  Object.entries(typeLabels).forEach(([type, label]) => {
    const wrapper = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = activeTypes.has(type);
    input.addEventListener("change", () => {
      if (input.checked) activeTypes.add(type);
      else activeTypes.delete(type);
      touchWorkspaceRecord("estimates");
      render();
    });
    wrapper.append(input, `${type} - ${label}`);
    els.typeFilters.append(wrapper);
  });
}

function setDescendantsActive(row, active) {
  rows = rows.map((candidate) => (descendantsOf(row).some((desc) => desc.id === candidate.id) ? { ...candidate, active } : candidate));
}

function levelRank(level) {
  return { package: 0, product: 1, element: 2 }[level] ?? 2;
}

function rowName(row) {
  return row.level === "package" ? row.packageName : row.level === "product" ? row.product : row.element;
}

function syncRowHierarchy(row) {
  if (row.level === "package") {
    return { ...row, parentId: undefined, product: "", element: "", type: "" };
  }

  const parent = rows.find((candidate) => candidate.id === row.parentId);
  if (row.level === "product") {
    return {
      ...row,
      packageName: parent?.packageName ?? row.packageName,
      element: ""
    };
  }

  return {
    ...row,
    packageName: parent?.packageName ?? row.packageName,
    product: parent?.product ?? row.product,
    type: row.type || parent?.type || "MP"
  };
}

function cascadeHierarchy(parent) {
  rows = rows.map((row) => {
    if (row.id === parent.id) return syncRowHierarchy(row);
    if (!descendantsOf(parent).some((child) => child.id === row.id)) return row;
    return syncRowHierarchy(row);
  });
}

function previousVisibleRow(row) {
  const visible = visibleRows();
  return visible[visible.findIndex((candidate) => candidate.id === row.id) - 1];
}

function siblingRows(row) {
  return rows
    .filter((candidate) => candidate.level === row.level && (candidate.parentId || "") === (row.parentId || ""))
    .sort((a, b) => a.sourceOrder - b.sourceOrder);
}

function moveRowOrder(row, direction) {
  const siblings = siblingRows(row);
  const index = siblings.findIndex((candidate) => candidate.id === row.id);
  const swapWith = siblings[index + direction];
  if (!swapWith) return;
  const order = row.sourceOrder;
  rows = rows.map((candidate) => {
    if (candidate.id === row.id) return { ...candidate, sourceOrder: swapWith.sourceOrder };
    if (candidate.id === swapWith.id) return { ...candidate, sourceOrder: order };
    return candidate;
  });
  render();
}

function normalizeSiblingOrder(parentId = "") {
  const siblings = rows
    .filter((row) => (row.parentId || "") === (parentId || ""))
    .sort((a, b) => a.sourceOrder - b.sourceOrder);
  rows = rows.map((row) => {
    const index = siblings.findIndex((candidate) => candidate.id === row.id);
    return index >= 0 ? { ...row, sourceOrder: index + 1 } : row;
  });
}

function reparentRow(row, parent) {
  const nextLevel = parent ? (parent.level === "package" ? "product" : "element") : "package";
  const promotedName = rowName(row);
  const targetParentId = parent?.id;
  const targetOrder = parent ? childrenOf(parent).length + 1 : packageRows().length + 1;
  rows = rows.map((candidate) => {
    if (candidate.id !== row.id) return candidate;
    const updated = {
      ...candidate,
      level: nextLevel,
      parentId: targetParentId,
      sourceOrder: targetOrder
    };
    if (nextLevel === "package") {
      updated.packageName = promotedName || candidate.packageName;
      updated.product = "";
      updated.element = "";
      updated.type = "";
    } else if (nextLevel === "product") {
      updated.packageName = parent.packageName;
      updated.product = promotedName || candidate.product;
      updated.element = "";
    } else {
      updated.packageName = parent.packageName;
      updated.product = parent.product;
      updated.element = promotedName || candidate.element;
      updated.type = candidate.type || parent.type || "MP";
    }
    return syncRowHierarchy(updated);
  });
  const updated = rows.find((candidate) => candidate.id === row.id);
  if (updated) cascadeHierarchy(updated);
  if (parent) expanded.add(parent.id);
  normalizeSiblingOrder(targetParentId || "");
  touchWorkspaceRecord("estimates");
  render();
}

function reorderBefore(row, target) {
  if (row.id === target.id || row.level !== target.level || (row.parentId || "") !== (target.parentId || "")) return;
  const sorted = siblingRows(row).filter((candidate) => candidate.id !== row.id);
  const targetIndex = sorted.findIndex((candidate) => candidate.id === target.id);
  sorted.splice(targetIndex, 0, row);
  rows = rows.map((candidate) => {
    const index = sorted.findIndex((item) => item.id === candidate.id);
    return index >= 0 ? { ...candidate, sourceOrder: index + 1 } : candidate;
  });
  touchWorkspaceRecord("estimates");
  render();
}

function handleRowDrop(source, target) {
  if (!source || !target || source.id === target.id) return;
  if (descendantsOf(source).some((row) => row.id === target.id)) return;

  if (source.level === target.level && (source.parentId || "") === (target.parentId || "")) {
    reorderBefore(source, target);
    return;
  }

  if (target.level !== "element") {
    reparentRow(source, target);
  }
}

function demoteRow(row) {
  const targetParent = previousVisibleRow(row);
  if (!targetParent || levelRank(targetParent.level) !== levelRank(row.level) - 1) return;
  rows = rows.map((candidate) => (candidate.id === row.id ? syncRowHierarchy({ ...candidate, parentId: targetParent.id, sourceOrder: targetParent.sourceOrder + 0.1 }) : candidate));
  cascadeHierarchy(rows.find((candidate) => candidate.id === row.id));
  expanded.add(targetParent.id);
  touchWorkspaceRecord("estimates");
  render();
}

function promoteRow(row) {
  if (row.level === "package") return;
  const parent = rows.find((candidate) => candidate.id === row.parentId);
  if (!parent) return;

  if (row.level === "product") {
    rows = rows.map((candidate) =>
      candidate.id === row.id
        ? syncRowHierarchy({
            ...candidate,
            level: "package",
            parentId: undefined,
            packageName: row.product || row.packageName,
            product: "",
            element: "",
            description: row.description || `${row.product} package`,
            type: "",
            sourceOrder: parent.sourceOrder + 0.5
          })
        : candidate
    );
  } else {
    rows = rows.map((candidate) =>
      candidate.id === row.id
        ? syncRowHierarchy({
            ...candidate,
            level: "product",
            parentId: parent.parentId,
            product: row.element || row.product,
            element: "",
            sourceOrder: parent.sourceOrder + 0.5
          })
        : candidate
    );
  }

  const updated = rows.find((candidate) => candidate.id === row.id);
  if (updated) cascadeHierarchy(updated);
  touchWorkspaceRecord("estimates");
  render();
}

function makePackage(row) {
  if (!row || row.level === "package") return;
  const packageName = rowName(row) || "New Package";
  const originalLevel = row.level;
  rows = rows.map((candidate) => {
    if (candidate.id === row.id) {
      return syncRowHierarchy({
        ...candidate,
        level: "package",
        parentId: undefined,
        packageName,
        product: "",
        element: "",
        description: candidate.description || `${packageName} package`,
        type: "",
        sourceOrder: packageRows().length + 1
      });
    }

    if (originalLevel === "product" && candidate.parentId === row.id && candidate.level === "element") {
      return syncRowHierarchy({
        ...candidate,
        level: "product",
        parentId: row.id,
        packageName,
        product: candidate.element || candidate.product || "New Product / Service",
        element: "",
        sourceOrder: candidate.sourceOrder
      });
    }

    return candidate;
  });
  syncLookupsFromRow(rows.find((candidate) => candidate.id === row.id));
  expanded.add(row.id);
  activePackage = packageName;
  touchWorkspaceRecord("estimates");
  render();
}

function updateRow(id, patch) {
  const original = rows.find((row) => row.id === id);
  if (!original) return;
  const updated = { ...original, ...patch };
  syncLookupsFromRow(updated);

  rows = rows.map((row) => {
    if (row.id === id) return updated;
    if (original.level === "package" && row.packageName === original.packageName && patch.packageName) {
      return { ...row, packageName: patch.packageName };
    }
    if (original.level === "product" && row.parentId === original.id && (patch.product || patch.packageName || patch.type)) {
      return {
        ...row,
        packageName: patch.packageName ?? row.packageName,
        product: patch.product ?? row.product,
        type: patch.type ?? row.type
      };
    }
    return row;
  });

  if (Object.hasOwn(patch, "active")) setDescendantsActive(updated, patch.active);
  cascadeHierarchy(updated);
  touchWorkspaceRecord("estimates");
  render();
}

function bindInput(input, row, key, numeric = false) {
  input.value = row[key] ?? "";
  input.title = row.description || row.element || row.product || row.packageName || "";
  input.addEventListener("input", () => {
    rows = rows.map((candidate) => (
      candidate.id === row.id
        ? { ...candidate, [key]: numeric ? asNumber(input.value) : input.value }
        : candidate
    ));
    touchWorkspaceRecord("estimates");
  });
  input.addEventListener("change", () => updateRow(row.id, { [key]: numeric ? asNumber(input.value) : input.value }));
}

function bindClientOrderQtyInput(input, row, calc) {
  input.value = row.level === "package" ? "" : Math.round(calc.qty);
  input.title = "Editing this updates the needed quantity from Client QOH + Client Order Qty";
  input.disabled = row.level === "package";
  input.addEventListener("input", () => {
    const clientOrderQty = Math.max(asNumber(input.value), 0);
    const latest = rows.find((candidate) => candidate.id === row.id) || row;
    const neededQty = clientOrderQty + Math.max(asNumber(latest.clientQoh), 0);
    const neededInput = input.closest("tr")?.querySelector(".needed-input");
    if (neededInput && !neededInput.readOnly) neededInput.value = Math.round(neededQty);
    rows = rows.map((candidate) => (
      candidate.id === row.id
        ? { ...candidate, neededQty }
        : candidate
    ));
    touchWorkspaceRecord("estimates");
  });
  input.addEventListener("change", () => {
    const latest = rows.find((candidate) => candidate.id === row.id) || row;
    const clientOrderQty = Math.max(asNumber(input.value), 0);
    updateRow(row.id, { neededQty: clientOrderQty + Math.max(asNumber(latest.clientQoh), 0) });
  });
}

function nameKeyFor(row) {
  if (row.level === "package") return "packageName";
  if (row.level === "product") return "product";
  return "element";
}

// ── Inventory lookup dropdown ─────────────────────────────────────────────────
const invDropdown = document.getElementById("invLookupDropdown");
let invDropdownRowId = null;
let invDebounceTimer = null;

function closeInvDropdown() {
  invDropdown.hidden = true;
  invDropdown.innerHTML = "";
  invDropdownRowId = null;
}

function positionInvDropdown(input) {
  const rect = input.getBoundingClientRect();
  // position: fixed coords are relative to viewport — do NOT add scroll offsets
  invDropdown.style.top  = `${rect.bottom + 2}px`;
  invDropdown.style.left = `${rect.left}px`;
  invDropdown.style.width = `${Math.max(rect.width, 380)}px`;
}

function renderInvDropdown(input, results, onSelect) {
  invDropdown.innerHTML = "";
  if (!results.length) {
    const empty = document.createElement("div");
    empty.className = "inv-lookup-empty";
    empty.textContent = "No inventory items found";
    invDropdown.appendChild(empty);
  } else {
    results.forEach(item => {
      const opt = document.createElement("div");
      opt.className = "inv-lookup-option";
      opt.innerHTML =
        `<span class="inv-lookup-name">${escapeHtml(item.name)}</span>` +
        `<span class="inv-lookup-sku">${escapeHtml(item.sku || "")}</span>` +
        `<span class="inv-lookup-qty">${item.warehouseQty != null ? Number(item.warehouseQty).toLocaleString() : "—"}</span>`;
      opt.addEventListener("mousedown", e => {
        e.preventDefault();
        onSelect(item);
        closeInvDropdown();
      });
      invDropdown.appendChild(opt);
    });
  }
  positionInvDropdown(input);
  invDropdown.hidden = false;
}

function setupInventoryLookup(input, row, nameField) {
  input.addEventListener("input", () => {
    clearTimeout(invDebounceTimer);
    const q = input.value.trim();
    if (q.length < 2) { closeInvDropdown(); return; }
    invDropdownRowId = row.id;
    invDebounceTimer = setTimeout(async () => {
      if (invDropdownRowId !== row.id) return;
      const clientName = els.clientName.value.trim();
      const estimateYear = parseInt(els.estimateYear.value) || new Date().getFullYear();
      const priorYear = estimateYear - 1;
      try {
        const res = await fetch(`/api/inventory/search?q=${encodeURIComponent(q)}&client=${encodeURIComponent(clientName)}&year=${priorYear}`);
        const results = await res.json();
        if (invDropdownRowId !== row.id) return;
        positionInvDropdown(input);
        renderInvDropdown(input, results, item => {
          updateRow(row.id, {
            [nameField]: item.name,
            sku: item.sku || "",
            inventoryQty: Number(item.warehouseQty) || 0,
            priorPpp: Number(item.priorPpp) || 0
          });
        });
      } catch { closeInvDropdown(); }
    }, 300);
  });

  input.addEventListener("blur", () => setTimeout(closeInvDropdown, 150));
  input.addEventListener("focus", () => {
    if (input.value.trim().length >= 2) input.dispatchEvent(new Event("input"));
  });
}

function setupNameInput(input, row) {
  const key = nameKeyFor(row);
  const isLeafProduct = row.level === "product" && !childrenOf(row).some(c => c.level === "element");
  const hasInventoryLookup = row.level === "element" || isLeafProduct;

  // Only attach datalist for rows that don't use the custom inventory dropdown
  // (native datalist would overlap and block the custom dropdown)
  if (!hasInventoryLookup) {
    input.setAttribute("list", row.level === "package" ? "packageLookup" : "productLookup");
  }

  bindInput(input, row, key);

  if (row.level === "element") {
    setupInventoryLookup(input, row, "element");
  } else if (isLeafProduct) {
    setupInventoryLookup(input, row, "product");
  }
}

function renderRows() {
  const visible = visibleRows();
  els.lineItems.innerHTML = "";

  visible.forEach((row) => {
    const calc = calculate(row);
    const fragment = els.rowTemplate.content.cloneNode(true);
    const tr = fragment.querySelector("tr");
    tr.classList.toggle("inactive", !row.active);
    tr.classList.toggle("package-row", row.level === "package");
    tr.classList.toggle("product-row", row.level === "product");
    tr.classList.toggle("element-row", row.level === "element");
    tr.classList.toggle("rollup-source", row.level !== "element" && childrenOf(row).some((child) => child.active));
    tr.dataset.level = row.level;
    tr.dataset.id = row.id;
    const dragHandle = fragment.querySelector(".drag-handle");
    dragHandle.draggable = true;
    dragHandle.addEventListener("dragstart", (event) => {
      draggedRowId = row.id;
      tr.classList.add("dragging-row");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", row.id);
    });
    dragHandle.addEventListener("dragend", () => {
      draggedRowId = null;
      tr.classList.remove("dragging-row");
      document.querySelectorAll(".drop-target").forEach((target) => target.classList.remove("drop-target"));
    });
    tr.addEventListener("dragover", (event) => {
      const source = rows.find((candidate) => candidate.id === draggedRowId);
      if (!source || source.id === row.id || descendantsOf(source).some((candidate) => candidate.id === row.id)) return;
      event.preventDefault();
      tr.classList.add("drop-target");
    });
    tr.addEventListener("dragleave", () => tr.classList.remove("drop-target"));
    tr.addEventListener("drop", (event) => {
      event.preventDefault();
      tr.classList.remove("drop-target");
      const source = rows.find((candidate) => candidate.id === draggedRowId || candidate.id === event.dataTransfer.getData("text/plain"));
      handleRowDrop(source, row);
    });

    const deleteButton = fragment.querySelector(".delete-row-btn");
    deleteButton.addEventListener("click", () => {
      const removeIds = new Set([row.id, ...descendantsOf(row).map((child) => child.id)]);
      rows = rows.filter((candidate) => !removeIds.has(candidate.id));
      expanded.delete(row.id);
      touchWorkspaceRecord("estimates");
      render();
    });

    const useInput = fragment.querySelector(".use-input");
    useInput.checked = row.active;
    useInput.addEventListener("change", () => updateRow(row.id, { active: useInput.checked }));

    const chevron = fragment.querySelector(".chevron-btn");
    const hasChildren = childrenOf(row).length > 0;
    chevron.classList.toggle("empty-chevron", !hasChildren);
    chevron.disabled = !hasChildren;
    chevron.textContent = expanded.has(row.id) ? "⌄" : "›";
    chevron.addEventListener("click", () => {
      if (expanded.has(row.id)) expanded.delete(row.id);
      else expanded.add(row.id);
      renderRows();
      renderFooter(visiblePackageRows());
    });

    setupNameInput(fragment.querySelector(".name-input"), row);
    bindInput(fragment.querySelector(".sku-input"), row, "sku");
    bindInput(fragment.querySelector(".description-input"), row, "description");
    bindInput(fragment.querySelector(".type-input"), row, "type");
    bindInput(fragment.querySelector(".source-input"), row, "source");
    bindInput(fragment.querySelector(".moq-input"), row, "moq", true);
    bindInput(fragment.querySelector(".inventory-input"), row, "inventoryQty", true);
    bindInput(fragment.querySelector(".needed-input"), row, "neededQty", true);
    bindInput(fragment.querySelector(".cost-input"), row, "cost", true);
    bindInput(fragment.querySelector(".client-qoh-input"), row, "clientQoh", true);
    bindClientOrderQtyInput(fragment.querySelector(".client-order-qty"), row, calc);
    bindInput(fragment.querySelector(".markup-input"), row, "markup", true);
    bindInput(fragment.querySelector(".margin-input"), row, "marginAdj", true);
    bindInput(fragment.querySelector(".prior-input"), row, "priorPpp", true);

    if (row.level !== "element" && childrenOf(row).some((child) => child.active)) {
      ["inventory-input", "needed-input", "cost-input", "client-qoh-input", "client-order-qty", "markup-input", "margin-input", "prior-input"].forEach((className) => {
        const input = fragment.querySelector(`.${className}`);
        input.readOnly = true;
        input.title = "Calculated from nested active rows";
      });
      fragment.querySelector(".inventory-input").value = Math.round(calc.inventoryQty);
      fragment.querySelector(".needed-input").value = Math.round(calc.neededQty);
      fragment.querySelector(".cost-input").value = decimal(calc.cost, 2);
      fragment.querySelector(".client-qoh-input").value = Math.round(calc.clientQoh);
      fragment.querySelector(".client-order-qty").value = row.level === "package" ? "" : Math.round(calc.qty);
      fragment.querySelector(".markup-input").value = decimal(calc.markup, 3);
      fragment.querySelector(".margin-input").value = decimal(calc.marginAdj, 3);
      fragment.querySelector(".prior-input").value = decimal(calc.priorPpp, 3);
    }

    if (row.level === "package") {
      const typeInput = fragment.querySelector(".type-input");
      typeInput.value = "";
      typeInput.disabled = true;
    }

    fragment.querySelector(".cost-input").value = decimal(calc.cost, 2);
    fragment.querySelector(".qty-to-order").textContent = row.level === "package" ? "" : Math.round(calc.qtyToOrder).toLocaleString();
    fragment.querySelector(".per-piece-cost").textContent = money(calc.perPieceCost, 3);
    fragment.querySelector(".margin-dollars").textContent = money(calc.marginDollars, 2);
    fragment.querySelector(".standard-price").textContent = money(calc.standardPrice, 2);
    fragment.querySelector(".client-price").textContent = money(calc.clientPrice, 2);
    fragment.querySelector(".ppp").textContent = money(calc.ppp, 3);

    const diff = fragment.querySelector(".diff");
    diff.textContent = money(calc.diff, 3);
    diff.classList.toggle("negative", calc.diff < 0);
    diff.classList.toggle("positive", calc.diff > 0);

    els.lineItems.append(fragment);
  });

  const packageCount = visiblePackageRows().length;
  els.visibleCount.textContent = `${packageCount} active package row${packageCount === 1 ? "" : "s"} shown`;
  renderFooter(visiblePackageRows());
}

function renderFooter(sourceRows) {
  const totals = totalFor(sourceRows);
  els.neededQtyHead.textContent = `${els.estimateYear.value || "Project"} Needed`;
  els.priorPppHead.textContent = `${asNumber(els.estimateYear.value) - 1 || "Previous"} PPP`;
  // Quantity columns — not shown in footer
  els.footerInventoryQty.textContent = "";
  els.footerNeededQty.textContent = "";
  els.footerQtyToOrder.textContent = "";
  els.footerClientQoh.textContent = "";
  els.footerQty.textContent = "";
  els.footerPerPieceCost.textContent = "";
  // Dollar totals
  els.footerCost.textContent = money(totals.cost, 2);
  els.footerStdMarkup.textContent = money(totals.standardPrice, 2);
  els.footerMargin.textContent = money(totals.margin, 2);
  els.footerClient.textContent = money(totals.client, 2);
  // PPP and Diff — sum of package-level values (additive, matching package rollup)
  const packageCalcs = sourceRows.map(calculate);
  els.footerPpp.textContent = money(packageCalcs.reduce((s, c) => s + c.ppp, 0), 2);
  els.footerDiff.textContent = money(packageCalcs.reduce((s, c) => s + c.diff, 0), 2);
}

function renderPrintTypeSubtotals() {
  const totals = activeLeafRowsForVisiblePackages()
    .reduce(
      (memo, row) => {
        const type = row.type || "MP";
        memo[type] = (memo[type] || 0) + calculate(row).clientPrice;
        return memo;
      },
      { M: 0, VF: 0, FP: 0, MP: 0 }
    );
  const grandTotal = Object.values(totals).reduce((sum, value) => sum + value, 0);
  els.printTypeSubtotals.innerHTML = `
    <strong>Total ${money(grandTotal, 2)}</strong>
    ${Object.entries(totals)
      .filter(([, total]) => total)
      .map(([type, total]) => `<span>${type} - ${typeLabels[type]} ${money(total, 2)}</span>`)
    .join("")}
  `;
}

function simulatedTotalsFor(sourceRows) {
  const value = asNumber(els.simulationPercent.value);
  const basis = els.simulationBasis.value;
  return sourceRows.reduce(
    (memo, row) => {
      const calc = calculate(row);
      const simulation = simulatedValuesFor(row, calc, value, basis);
      memo.neededQty += simulation.neededQty;
      memo.qty += simulation.qty;
      memo.qtyToOrder += simulation.qtyToOrder;
      memo.cost += simulation.cost;
      memo.client += simulation.clientPrice;
      memo.margin += simulation.clientPrice - simulation.cost;
      return memo;
    },
    { cost: 0, client: 0, margin: 0, qty: 0, neededQty: 0, qtyToOrder: 0 }
  );
}

function simulatedNeededQtyFor(row, calc, multiplier, basis) {
  const clientQoh = Math.max(asNumber(row.clientQoh), 0);
  if (els.simulationMode.value === "set") {
    const targetQty = Math.max(multiplier, 0);
    return basis === "neededQty" ? targetQty : targetQty + clientQoh;
  }
  const pctMultiplier = 1 + multiplier / 100;
  if (basis === "neededQty") return calc.neededQty * pctMultiplier;
  return (calc.qty * pctMultiplier) + clientQoh;
}

function marginAdjForPpp(cost, clientPrice, fallback) {
  if (clientPrice <= 0) return fallback;
  return Math.min(Math.max(1 - (cost / clientPrice), -0.95), 0.95);
}

function simulatedValuesFor(row, calc, multiplier, basis) {
  const neededQty = Math.max(Math.round(simulatedNeededQtyFor(row, calc, multiplier, basis)), 0);
  const clientQoh = Math.max(asNumber(row.clientQoh), 0);
  const inventoryQty = Math.max(asNumber(row.inventoryQty), 0);
  const qty = Math.max(neededQty - clientQoh, 0);
  const qtyToOrder = Math.max(neededQty - inventoryQty, 0);
  const cost = qtyToOrder * calc.perPieceCost;
  const clientPrice = qty * calc.ppp;
  return {
    neededQty,
    qty,
    qtyToOrder,
    cost,
    clientPrice,
    marginAdj: marginAdjForPpp(cost, clientPrice, row.marginAdj)
  };
}

function simulationTargetIds() {
  return new Set(activeLeafRowsForSimulation().map((row) => row.id));
}

function simulatedRowsSnapshot() {
  const value = asNumber(els.simulationPercent.value);
  const basis = els.simulationBasis.value;
  const targetIds = simulationTargetIds();
  return rows.map((row) => {
    if (!targetIds.has(row.id)) return row;
    const calc = calculate(row);
    const simulation = simulatedValuesFor(row, calc, value, basis);
    return {
      ...row,
      neededQty: simulation.neededQty,
      cost: simulation.cost,
      marginAdj: simulation.marginAdj
    };
  });
}

function withPreviewRows(callback) {
  if (!els.simulationPreview.checked || (els.simulationMode.value === "percent" && asNumber(els.simulationPercent.value) === 0)) return callback();
  const currentRows = rows;
  previewBaseRows = currentRows;
  rows = simulatedRowsSnapshot();
  try {
    return callback();
  } finally {
    rows = currentRows;
    previewBaseRows = null;
  }
}

function withRows(sourceRows, callback) {
  const currentRows = rows;
  rows = sourceRows;
  try {
    return callback();
  } finally {
    rows = currentRows;
  }
}

function renderSimulationSummary() {
  const sourceRows = previewBaseRows || rows;
  const { baseTotals, simulated, targetCount } = withRows(sourceRows, () => ({
    baseTotals: totalFor(visiblePackageRows()),
    simulated: simulatedTotalsFor(activeLeafRowsForSimulation()),
    targetCount: activeLeafRowsForSimulation().length
  }));
  const value = asNumber(els.simulationPercent.value);
  const isSetMode = els.simulationMode.value === "set";
  const basisLabel = els.simulationBasis.value === "neededQty" ? `${els.estimateYear.value || "Project"} Needed` : "Client Order Qty";
  const previewLabel = els.simulationPreview.checked && (isSetMode || value !== 0) ? "Preview on" : "Preview off";
  const scenarioLabel = isSetMode
    ? `Set ${basisLabel} to ${Math.round(Math.max(value, 0)).toLocaleString()}`
    : `${value > 0 ? "+" : ""}${decimal(value, 1)}% ${basisLabel}`;
  els.simulationValueLabel.textContent = isSetMode ? "Qty" : "%";
  els.simulationSummary.innerHTML = `
    <div><span>Scenario</span><strong>${scenarioLabel}</strong><small>${previewLabel}</small></div>
    <div><span>Cost</span><strong>${money(simulated.cost, 2)}</strong><small>${money(simulated.cost - baseTotals.cost, 2)}</small></div>
    <div><span>Client Price</span><strong>${money(simulated.client, 2)}</strong><small>${money(simulated.client - baseTotals.client, 2)}</small></div>
    <div><span>Margin $</span><strong>${money(simulated.margin, 2)}</strong><small>${money(simulated.margin - baseTotals.margin, 2)}</small></div>
    <div><span>Needed / Order</span><strong>${Math.round(simulated.neededQty).toLocaleString()} / ${Math.round(simulated.qty).toLocaleString()}</strong></div>
    <div><span>Applies to</span><strong>${targetCount} active row${targetCount === 1 ? "" : "s"}</strong></div>
  `;
}

function applyQuantitySimulation() {
  const value = asNumber(els.simulationPercent.value);
  const basis = els.simulationBasis.value;
  const targetIds = simulationTargetIds();
  if (!targetIds.size) {
    setSaveStatus("No active rows to update");
    return;
  }

  rows = rows.map((row) => {
    if (!targetIds.has(row.id)) return row;
    const calc = calculate(row);
    const simulation = simulatedValuesFor(row, calc, value, basis);
    return {
      ...row,
      neededQty: simulation.neededQty,
      cost: simulation.cost,
      marginAdj: simulation.marginAdj
    };
  });

  els.simulationPercent.value = "0";
  els.simulationPreview.checked = false;
  touchWorkspaceRecord("estimates");
  render();
  setSaveStatus(`Simulation applied to ${targetIds.size} active row${targetIds.size === 1 ? "" : "s"}`);
}

function renderSummary() {
  const totals = totalFor(packageRows().filter((row) => row.active));
  els.clientTotal.textContent = money(totals.client, 0);
  els.costTotal.textContent = money(totals.cost, 0);
  els.marginTotal.textContent = money(totals.margin, 0);
  els.weightedPpp.textContent = money(totals.qty ? totals.client / totals.qty : 0, 3);
  renderSimulationSummary();
}

function renderRollup() {
  els.packageRollup.innerHTML = "";
  packageRows()
    .filter((row) => row.active)
    .sort((a, b) => a.packageName.localeCompare(b.packageName))
    .forEach((row) => {
      const calc = calculate(row);
      const productCount = childrenOf(row).filter((child) => child.level === "product").length;
      const elementCount = descendantsOf(row).filter((child) => child.level === "element").length;
      const item = document.createElement("div");
      item.className = "rollup-row";
      item.innerHTML = `
        <div><strong>${row.packageName}</strong><small>${productCount} products / ${elementCount} elements</small></div>
        <span>${money(calc.clientPrice, 0)}</span>
        <span>${decimal(calc.marginPct * 100, 1)}% margin</span>
      `;
      els.packageRollup.append(item);
    });
}

function paymentTotalsByType() {
  return activeLeafRowsForVisiblePackages()
    .reduce(
      (memo, row) => {
        const type = row.type || "MP";
        memo[type] = (memo[type] || 0) + calculate(row).clientPrice;
        return memo;
      },
      { M: 0, VF: 0, FP: 0, MP: 0 }
    );
}

function historicalCalc(row, year) {
  const currentYear = Math.max(asNumber(els.estimateYear.value), 2025);
  const calc = calculate(row);
  const yearGap = currentYear - year;
  const factor = yearGap <= 0 ? 1 : 1 - Math.min(yearGap * 0.045, 0.25);
  const cost = calc.cost * factor;
  const client = calc.clientPrice * factor;
  return {
    cost,
    client,
    margin: client - cost,
    marginPct: client ? (client - cost) / client : 0
  };
}

function trackingRows() {
  const level = els.trackingLevel.value;
  const selectedId = els.trackingItem.value;
  const candidates = (level === "package" ? packageRows().filter((row) => row.active) : rows.filter((row) => row.level === level && row.active && rowPassesBaseFilters(row))).sort((a, b) => calculate(b).clientPrice - calculate(a).clientPrice);
  return selectedId === "all" ? candidates : candidates.filter((row) => row.id === selectedId);
}

function renderTrackingItems() {
  const level = els.trackingLevel.value;
  const current = els.trackingItem.value || "all";
  const candidates = level === "package" ? packageRows().filter((row) => row.active) : rows.filter((row) => row.level === level && row.active && rowPassesBaseFilters(row));
  els.trackingItem.innerHTML = '<option value="all">All visible</option>';
  candidates
    .sort((a, b) => calculate(b).clientPrice - calculate(a).clientPrice)
    .forEach((row) => {
      const option = document.createElement("option");
      option.value = row.id;
      option.textContent = rowName(row);
      els.trackingItem.append(option);
    });
  els.trackingItem.value = Array.from(els.trackingItem.options).some((option) => option.value === current) ? current : "all";
}

function renderTracking() {
  const selectedMetrics = Array.from(document.querySelectorAll(".metric-filter:checked")).map((input) => input.value);
  if (!selectedMetrics.length) {
    els.yearTracking.innerHTML = '<p class="chart-note">Select at least one metric to view tracking.</p>';
    return;
  }

  if (els.trackingMode.value === "compare") {
    renderTrackingCompare(selectedMetrics);
    return;
  }

  const currentYear = Math.max(asNumber(els.estimateYear.value), 2025);
  const years = [currentYear - 2, currentYear - 1, currentYear];
  const candidates = trackingRows();
  const items = years.map((year) => {
    const calc = candidates.reduce(
      (memo, row) => {
        const historical = historicalCalc(row, year);
        memo.cost += historical.cost;
        memo.margin += historical.margin;
        memo.client += historical.client;
        return memo;
      },
      { cost: 0, margin: 0, client: 0 }
    );
    return { label: String(year), calc };
  });
  renderStackedComparisonChart(items, selectedMetrics, `${candidates.length} active ${els.trackingLevel.value} row${candidates.length === 1 ? "" : "s"} included.`);
}

function shortLabel(value, max = 18) {
  const text = String(value || "");
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function compactMoney(value) {
  const number = Math.abs(asNumber(value));
  const sign = asNumber(value) < 0 ? "-" : "";
  if (number >= 1000000) return `${sign}$${decimal(number / 1000000, 1)}M`;
  if (number >= 10000) return `${sign}$${decimal(number / 1000, 0)}k`;
  if (number >= 1000) return `${sign}$${decimal(number / 1000, 1)}k`;
  return `${sign}$${decimal(number, 0)}`;
}

function renderTrackingCompare(selectedMetrics) {
  const level = els.trackingLevel.value;
  const currentYear = Math.max(asNumber(els.estimateYear.value), 2025);
  const candidates = (level === "package" ? packageRows().filter((row) => row.active) : rows.filter((row) => row.level === level && row.active && rowPassesBaseFilters(row))).sort((a, b) => calculate(b).clientPrice - calculate(a).clientPrice);
  const items = candidates.map((row) => ({
    label: rowName(row),
    calc: historicalCalc(row, currentYear)
  }));
  renderStackedComparisonChart(items, selectedMetrics, `${candidates.length} active ${level} row${candidates.length === 1 ? "" : "s"} compared for ${currentYear}.`);
}

function renderStackedComparisonChart(items, selectedMetrics, note) {
  const activeMetrics = selectedMetrics.includes("margin") && !selectedMetrics.includes("cost") ? ["cost", ...selectedMetrics] : selectedMetrics;
  const width = Math.max(760, items.length * 112);
  const height = els.yearPanel.classList.contains("chart-expanded") ? 520 : 300;
  const pad = { top: 52, right: 28, bottom: 78, left: 58 };
  const maxValue = Math.max(
    ...items.map((item) => {
      const stackValue = (activeMetrics.includes("cost") ? item.calc.cost : 0) + (activeMetrics.includes("margin") ? Math.max(item.calc.margin, 0) : 0);
      return Math.max(stackValue, activeMetrics.includes("client") ? item.calc.client : 0);
    }),
    1
  );
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const groupWidth = plotWidth / Math.max(items.length, 1);
  const barWidth = Math.min(26, groupWidth * 0.24);
  const barGap = Math.min(22, groupWidth * 0.18);
  const yFor = (value) => height - pad.bottom - (value / maxValue) * plotHeight;
  const bars = items
    .map((item, itemIndex) => {
      const groupX = pad.left + itemIndex * groupWidth + groupWidth / 2;
      const stackX = groupX - barWidth - barGap / 2;
      const clientX = groupX + barGap / 2;
      const costHeight = height - pad.bottom - yFor(item.calc.cost);
      const margin = Math.max(item.calc.margin, 0);
      const marginHeight = height - pad.bottom - yFor(margin);
      const clientHeight = height - pad.bottom - yFor(item.calc.client);
      const stackBase = activeMetrics.includes("cost") ? costHeight : 0;
      const stackTotal = (activeMetrics.includes("cost") ? item.calc.cost : 0) + (activeMetrics.includes("margin") ? margin : 0);
      const stackLabelY = yFor(stackTotal) - 18;
      const clientLabelY = yFor(item.calc.client) - 6;
      const costRect = activeMetrics.includes("cost") ? `<rect x="${stackX}" y="${height - pad.bottom - costHeight}" width="${barWidth}" height="${costHeight}" rx="4" fill="${metricStyles.cost.color}" />` : "";
      const marginRect = activeMetrics.includes("margin") ? `<rect x="${stackX}" y="${height - pad.bottom - stackBase - marginHeight}" width="${barWidth}" height="${marginHeight}" rx="4" fill="${metricStyles.margin.color}" />` : "";
      const stackLabel = stackTotal ? `<text class="chart-value chart-value-stack" x="${stackX + barWidth / 2}" y="${Math.max(14, stackLabelY)}" text-anchor="middle">${compactMoney(stackTotal)}</text>` : "";
      const clientBar = activeMetrics.includes("client")
        ? `<rect x="${clientX}" y="${height - pad.bottom - clientHeight}" width="${barWidth}" height="${clientHeight}" rx="4" fill="${metricStyles.client.color}" />
          <text class="chart-value chart-value-client" x="${clientX + barWidth / 2}" y="${Math.max(30, clientLabelY)}" text-anchor="middle">${compactMoney(item.calc.client)}</text>`
        : "";
      return `${costRect}${marginRect}${stackLabel}${clientBar}<text x="${groupX}" y="${height - 50}" text-anchor="end" transform="rotate(-38 ${groupX} ${height - 50})">${shortLabel(item.label)}</text>`;
    })
    .join("");

  els.yearTracking.innerHTML = `
    <div class="chart-legend">
      ${activeMetrics.map((metric) => `<span><i style="background:${metricStyles[metric].color}"></i>${metricStyles[metric].label}</span>`).join("")}
    </div>
    <svg class="line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Compare items by selected metric">
      <line x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="#d9d9d9" />
      <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}" stroke="#d9d9d9" />
      ${bars}
    </svg>
    <p class="chart-note">${note}</p>
  `;
}

function renderPayments() {
  const totalsByType = paymentTotalsByType();
  els.paymentSchedule.innerHTML = "";
  if (!rows.length) return;
  const printRows = [];
  Object.entries(totalsByType).forEach(([type, total]) => {
    const settings = paymentSettingFor(type);
    const depositCount = settings.depositCount;
    const depositPct = settings.depositPct;
    const paymentCount = settings.paymentCount;
    const balancePct = depositCount ? 1 - depositPct : 1;
    const header = document.createElement("div");
    header.className = "payment-type-heading";
    header.classList.toggle("no-payment-rows", depositCount === 0 && paymentCount === 0);
    header.innerHTML = `
      <strong class="payment-type-name">${type} - ${typeLabels[type]} Total</strong>
      <div class="payment-header-controls internal-col">
        <label class="payment-header-control">Deposit <input class="deposit-count-setting" type="number" min="0" max="1" step="1" value="${depositCount}" /></label>
        <label class="payment-header-control">Deposit % <input class="deposit-setting" type="number" min="0" max="100" step="5" value="${decimal(depositPct * 100, 0)}" /></label>
        <label class="payment-header-control">Balance <input class="count-setting" type="number" min="0" max="12" step="1" value="${paymentCount}" /></label>
      </div>
      <span>${money(total, 0)}</span>
    `;
    header.querySelector(".deposit-count-setting").addEventListener("change", (event) => {
      paymentSettings[type] = {
        ...paymentSettingFor(type),
        depositCount: Math.min(Math.max(Math.round(asNumber(event.target.value)), 0), 1)
      };
      touchWorkspaceRecord("estimates");
      renderPayments();
    });
    header.querySelector(".deposit-setting").addEventListener("change", (event) => {
      paymentSettings[type] = {
        ...paymentSettingFor(type),
        depositPct: Math.min(Math.max(asNumber(event.target.value) / 100, 0), 1)
      };
      touchWorkspaceRecord("estimates");
      renderPayments();
    });
    header.querySelector(".count-setting").addEventListener("change", (event) => {
      paymentSettings[type] = {
        ...paymentSettingFor(type),
        paymentCount: Math.min(Math.max(Math.round(asNumber(event.target.value)), 0), 12)
      };
      touchWorkspaceRecord("estimates");
      renderPayments();
    });
    els.paymentSchedule.append(header);
    if (!total) return;
    const entries = [
      ...Array.from({ length: depositCount }, () => ["Deposit", total * depositPct, `${decimal(depositPct * 100, 0)}%`]),
      ...Array.from({ length: paymentCount }, (_, index) => [`Balance ${index + 1}`, paymentCount ? (balancePct * total) / paymentCount : 0, paymentCount ? `${decimal((balancePct * 100) / paymentCount, 1)}%` : "0%"])
    ];
    let typeBalance = total;
    entries.forEach(([label, amount, note], index) => {
      const key = `${type}-${label.toLowerCase().replace(/\s+/g, "-")}`;
      const legacyDate = depositCount ? paymentDates[`${type}-${index}`] : "";
      const rowDate = paymentDates[key] || legacyDate || "";
      typeBalance = Math.max(typeBalance - amount, 0);
      printRows.push({
        date: rowDate,
        type,
        typeLabel: typeLabels[type],
        label,
        note,
        amount,
        typeBalance
      });
      const row = document.createElement("label");
      row.className = "payment-row";
      row.innerHTML = `
        <span><strong>${label}</strong><small>${note}</small></span>
        <input type="date" value="${rowDate}" aria-label="${type} ${label} date" />
        <strong>${money(amount, 2)}</strong>
      `;
      row.querySelector("input").addEventListener("change", (event) => {
        paymentDates[key] = event.target.value;
        touchWorkspaceRecord("estimates");
        renderPayments();
      });
      els.paymentSchedule.append(row);
    });
  });
  if (printRows.length) {
    const sortedRows = printRows.sort((a, b) => {
      if (!a.date && !b.date) return a.type.localeCompare(b.type) || a.label.localeCompare(b.label);
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date) || a.type.localeCompare(b.type) || a.label.localeCompare(b.label);
    });
    const printSchedule = document.createElement("div");
    printSchedule.className = "print-payment-schedule";
    printSchedule.innerHTML = `
      <div class="print-payment-row print-payment-head">
        <span>Date</span>
        <span>Type</span>
        <span>Payment</span>
        <span>Type Balance</span>
        <span>Amount</span>
      </div>
      ${sortedRows.map((row) => `
        <div class="print-payment-row">
          <span>${row.date || "TBD"}</span>
          <span>${row.type} - ${row.typeLabel}</span>
          <span>${row.label} <small>${row.note}</small></span>
          <span>${money(row.typeBalance, 2)}</span>
          <span>${money(row.amount, 2)}</span>
        </div>
      `).join("")}
    `;
    els.paymentSchedule.append(printSchedule);
  }
}

function renderLookupList() {
  const tableName = els.lookupTable.value;
  els.lookupList.innerHTML = "";
  (lookups[tableName] || []).forEach((value) => {
    const row = document.createElement("div");
    row.className = "lookup-row";
    row.innerHTML = `
      <input class="lookup-row-input" type="text" value="${value.replaceAll('"', "&quot;")}" />
      <button class="ghost-btn save-lookup-row" type="button">Save</button>
      <button class="ghost-btn remove-lookup-row" type="button">Remove</button>
    `;
    row.querySelector(".save-lookup-row").addEventListener("click", () => {
      const nextValue = row.querySelector(".lookup-row-input").value.trim();
      if (!nextValue || nextValue === value) return;
      lookups[tableName] = uniqueValues(lookups[tableName].map((candidate) => (candidate === value ? nextValue : candidate)));
      rows = rows.map((item) => ({
        ...item,
        packageName: tableName === "packages" && item.packageName === value ? nextValue : item.packageName,
        product: tableName === "products" && item.product === value ? nextValue : item.product,
        element: tableName === "elements" && item.element === value ? nextValue : item.element
      }));
      if (tableName === "packages" && activePackage === value) activePackage = nextValue;
      if (tableName === "clients" && els.clientName.value === value) els.clientName.value = nextValue;
      if (tableName === "years" && String(els.estimateYear.value) === String(value)) els.estimateYear.value = nextValue;
      render();
    });
    row.querySelector(".remove-lookup-row").addEventListener("click", () => {
      lookups[tableName] = lookups[tableName].filter((candidate) => candidate !== value);
      render();
    });
    els.lookupList.append(row);
  });
}

function render() {
  withPreviewRows(() => {
    document.body.classList.toggle("summary-view", els.estimateViewMode.value === "summary");
    els.estimateViewModeButtons.forEach((button) => {
      const isActive = button.dataset.viewMode === els.estimateViewMode.value;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    updateProjectHeader();
    renderDatalists();
    renderFilters();
    renderRows();
    renderSummary();
    renderRollup();
    renderTrackingItems();
    renderTracking();
    renderPayments();
    renderPrintTypeSubtotals();
    renderLookupList();
    renderProposal();
    renderPlaceholderDrafts();
    renderPlaceholderSummaries();
    renderPrintQuoteDraft();
    renderTabRecordControls();
    renderTabRecordIndicators();
    if (activeView === "sourcingView") renderSourcing();
  });
}

function estimateSearchText(estimate) {
  return [estimate.projectNumber, estimate.projectName, estimate.clientName, estimate.estimateYear]
    .map((value) => String(value || "").toLowerCase())
    .join(" ");
}

function renderLoadEstimateList() {
  const query = els.loadEstimateSearch.value.trim().toLowerCase();
  const estimates = sortEstimatesList(estimatesList).filter((estimate) => !query || estimateSearchText(estimate).includes(query));
  els.loadEstimateList.innerHTML = "";

  if (!estimates.length) {
    const empty = document.createElement("div");
    empty.className = "load-estimate-empty";
    empty.textContent = query ? "No saved estimates match that search." : "No saved estimates yet.";
    els.loadEstimateList.append(empty);
    return;
  }

  estimates.forEach((estimate) => {
    const row = document.createElement("div");
    row.className = "load-estimate-row";
    const savedDate = estimate.savedAt ? new Date(estimate.savedAt).toLocaleDateString() : "";
    row.innerHTML = `
      <span class="load-project-number">${escapeHtml(estimate.projectNumber || "")}</span>
      <span class="load-project-main">
        <strong>${escapeHtml(estimate.projectName || "Untitled Estimate")}</strong>
        <small>${escapeHtml([estimate.clientName, estimate.estimateYear, savedDate && `Saved ${savedDate}`].filter(Boolean).join(" · "))}</small>
      </span>
      <button class="ghost-btn compact-btn" type="button">Load</button>
    `;
    row.querySelector("button").addEventListener("click", () => loadEstimate(estimate));
    els.loadEstimateList.append(row);
  });
}

function openLoadEstimateDialog() {
  if (!estimatesList.length) {
    setSaveStatus("No saved estimates");
    return;
  }
  els.loadEstimateModal.hidden = false;
  els.loadEstimateSearch.value = "";
  renderLoadEstimateList();
  els.loadEstimateSearch.focus();
}

function closeLoadEstimateDialog() {
  els.loadEstimateModal.hidden = true;
}

async function saveCurrentEstimate() {
  const projectName = els.projectName.value.trim() || "Untitled Estimate";
  const projectNumber = normalizeEstimateNumber(String(els.projectNumber.value || els.projectNumber.textContent || "").trim()) || nextProjectNumber();
  els.projectName.value = projectName;
  setProjectNumber(projectNumber);
  const workspace = ensureWorkspace();
  const estimate = {
    projectNumber,
    projectName,
    workspaceNumber: workspace.workspaceNumber,
    workspaceName: workspace.workspaceName,
    estimateVersion: currentEstimateVersion(),
    clientName: els.clientName.value.trim(),
    estimateYear: String(els.estimateYear.value || ""),
    rows: structuredClone(rows),
    lookups: structuredClone(lookups),
    activePackage,
    activeTypes: Array.from(activeTypes),
    expanded: Array.from(expanded),
    paymentDates: structuredClone(paymentDates),
    paymentSettings: structuredClone(paymentSettings),
    proposal: proposalSnapshotWithSources(undefined, { persist: true }),
    sourcing: sourcingDataSnapshot(),
    tariffRate: asNumber(els.tariffRate.value),
    globalMarkup: asNumber(els.globalMarkup.value)
  };
  try {
    const res = await fetch("/api/estimates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estimate)
    });
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    await fetchEstimatesList();
    saveWorkspaceEstimateRecord(projectNumber);
    if (estimate.clientName) lookups.clients = uniqueValues([...(lookups.clients || []), estimate.clientName]);
    if (estimate.estimateYear) lookups.years = uniqueValues([...(lookups.years || []), estimate.estimateYear]);
    saveSourcingLocal();
    clearWorkspaceRecordDirty("estimates");
    render();
    setSaveStatus(`Saved ${workspace.workspaceNumber} / ${projectNumber} v${currentEstimateVersion()}`);
    return true;
  } catch (err) {
    console.error("Save error:", err);
    setSaveStatus("Save failed");
    return false;
  } finally {
    renderTabRecordControls();
  }
}

async function duplicateCurrentEstimate() {
  if (!rows.length) {
    setSaveStatus("Nothing to duplicate");
    return;
  }

  try {
    await fetchEstimatesList();
    const projectNumber = nextProjectNumber();
    const baseName = els.projectName.value.trim() || "Untitled Estimate";
    const clone = cloneRowsForNewProject(rows);
    const nextSourcing = { quotes: {}, selected: {} };
    Object.entries(sourcing.quotes || {}).forEach(([rowId, quotes]) => {
      const nextRowId = clone.idMap.get(rowId);
      if (!nextRowId) return;
      nextSourcing.quotes[nextRowId] = structuredClone(quotes).map((quote) => ({ ...quote, rowId: nextRowId }));
    });
    Object.entries(sourcing.selected || {}).forEach(([rowId, selected]) => {
      const nextRowId = clone.idMap.get(rowId);
      if (nextRowId) nextSourcing.selected[nextRowId] = structuredClone(selected);
    });
    rows = clone.rows;
    sourcing = nextSourcing;
    selectedSourcingRows = new Set(Array.from(selectedSourcingRows).map((id) => clone.idMap.get(id)).filter(Boolean));
    sourcingExpandedRows = new Set(Array.from(sourcingExpandedRows).map((id) => clone.idMap.get(id)).filter(Boolean));
    expanded = new Set(Array.from(expanded).map((id) => clone.idMap.get(id)).filter(Boolean));
    els.projectName.value = `${baseName} Copy`;
    if (els.estimateVersion) els.estimateVersion.value = "1";
    clearProjectNumber();
    setProjectNumber(projectNumber);
    const saved = await saveCurrentEstimate();
    if (saved) setSaveStatus(`Duplicated as ${projectNumber}`);
  } catch (err) {
    console.error("Duplicate error:", err);
    setSaveStatus("Duplicate failed");
  } finally {
    renderTabRecordControls();
  }
}

async function loadEstimate(summary, options = {}) {
  if (!summary) {
    setSaveStatus("Not found");
    return;
  }
  try {
    if (!options.skipDirtyCheck && !(await resolveDirtyRecordsBefore(estimateLoadDirtyCollections(), "Loading this estimate"))) return;
    const key = normalizeEstimateNumber(summary.projectNumber) || String(summary.projectName || "").trim();
    if (!key) return;
    let res = await fetch(`/api/estimates/${encodeURIComponent(key)}`);
    const legacyKey = legacyEstimateNumber(key);
    if (!res.ok && legacyKey !== key) {
      res = await fetch(`/api/estimates/${encodeURIComponent(legacyKey)}`);
    }
    if (!res.ok) {
      setSaveStatus("Not found");
      return;
    }
    const estimate = await res.json();
    estimate.projectNumber = normalizeEstimateNumber(estimate.projectNumber) || nextProjectNumber();
    setProjectNumber(estimate.projectNumber);
    els.projectName.value = estimate.projectName || "";
    els.clientName.value = estimate.clientName || "";
    els.estimateYear.value = estimate.estimateYear || "";
    const knownWorkspace = workspaceForEstimate(estimate.projectNumber) || workspaceByNumber(estimate.workspaceNumber);
    if (knownWorkspace) {
      setWorkspaceNumber(knownWorkspace.workspaceNumber);
      if (els.workspaceName) els.workspaceName.value = knownWorkspace.workspaceName || "";
      const version = (knownWorkspace.records?.estimates || [])
        .filter((record) => normalizeEstimateNumber(record.projectNumber) === estimate.projectNumber)
        .sort((a, b) => asNumber(b.version) - asNumber(a.version))[0]?.version;
      if (els.estimateVersion) els.estimateVersion.value = version || estimate.estimateVersion || "1";
    } else {
      if (els.workspaceName) els.workspaceName.value = estimate.workspaceName || estimate.projectName || "";
      if (els.estimateVersion) els.estimateVersion.value = estimate.estimateVersion || "1";
      ensureWorkspace();
    }
    rows = structuredClone(estimate.rows || seedRows).map(normalizeEstimateRow);
    lookups = structuredClone({ ...seedLookups, ...(estimate.lookups || {}) });
    activePackage = estimate.activePackage || "All";
    activeTypes = new Set(estimate.activeTypes || Object.keys(typeLabels));
    expanded = new Set(estimate.expanded || rows.filter((row) => row.level !== "element").map((row) => row.id));
    paymentDates = structuredClone(estimate.paymentDates || {});
    paymentSettings = structuredClone(estimate.paymentSettings || defaultPaymentSettings());
    proposal = normalizeProposalRecord(estimate.proposal || {});
    restoreProposalSourceReferences(proposal.sourceRecords, { skipCollections: ["estimates", "proposals"] });
    const storedSourcing = estimate.sourcing && Object.keys(estimate.sourcing).length
      ? estimate.sourcing
      : loadSourcingLocal(estimate.projectNumber);
    sourcing = normalizeSourcing(storedSourcing);
    applySourcingUiSnapshot(storedSourcing.ui || defaultSourcingUi());
    if (!sourcingHasQuotes(sourcing) && estimate.projectNumber === "E-000008") {
      sourcing = buildSampleSourcingForRows(rows);
      saveSourcingLocal();
    }
    closeLoadEstimateDialog();
    clearWorkspaceRecordDirty("estimates");
    clearWorkspaceRecordDirty("proposals");
    clearWorkspaceRecordDirty("sourcing");
    render();
    setSaveStatus(`Loaded ${estimate.projectNumber}`);
  } catch (err) {
    console.error("Load error:", err);
    setSaveStatus("Not found");
  }
}

function syncProjectAssociationFromName() {
  const estimate = findEstimateByProjectName(els.projectName.value.trim());
  if (estimate?.projectNumber) {
    setProjectNumber(normalizeEstimateNumber(estimate.projectNumber));
    els.clientName.value = estimate.clientName || els.clientName.value;
    els.estimateYear.value = estimate.estimateYear || els.estimateYear.value;
    renderDatalists();
    renderPrintTypeSubtotals();
  }
}

function bindEstimateMetaInputs() {
  if (els.projectName && !els.projectName.dataset.boundEstimateMeta) {
    els.projectName.addEventListener("change", syncProjectAssociationFromName);
    els.projectName.addEventListener("input", () => {
      updateProjectHeader();
      touchWorkspaceRecord("estimates");
      renderProposalPreview();
      if (activeView === "sourcingView") renderSourcing();
    });
    els.projectName.dataset.boundEstimateMeta = "true";
  }
  if (els.estimateVersion && !els.estimateVersion.dataset.boundEstimateMeta) {
    els.estimateVersion.addEventListener("change", () => {
      touchWorkspaceRecord("estimates");
      renderSourcing();
    });
    els.estimateVersion.dataset.boundEstimateMeta = "true";
  }
}

function addPackage(packageName = "New Package") {
  if (typeof packageName !== "string") packageName = "New Package";
  const row = {
    id: uid("package"),
    level: "package",
    active: true,
    sourceOrder: rows.length + 100,
    packageName,
    product: "",
    element: "",
    sku: "",
    description: "",
    type: "",
    source: "",
    moq: 0,
    qty: 0,
    neededQty: 0,
    inventoryQty: 0,
    clientQoh: 0,
    cost: 0,
    markup: asNumber(els.globalMarkup.value),
    marginAdj: 0.4,
    priorPpp: 0
  };
  syncLookupsFromRow(row);
  rows = [...rows, row];
  expanded.add(row.id);
  touchWorkspaceRecord("estimates");
  render();
}

function addProduct() {
  const parent = visibleRows().find((row) => row.level === "package") || packageRows()[0];
  if (!parent) {
    addPackage();
    return;
  }
  const product = "New Product / Service";
  const row = {
    id: uid("product"),
    level: "product",
    parentId: parent.id,
    active: true,
    sourceOrder: rows.length + 1,
    packageName: parent.packageName,
    product,
    element: "",
    sku: "",
    description: "",
    type: "MP",
    source: "",
    moq: 0,
    qty: 0,
    neededQty: 0,
    inventoryQty: 0,
    clientQoh: 0,
    cost: 0,
    markup: asNumber(els.globalMarkup.value),
    marginAdj: 0.4,
    priorPpp: 0
  };
  syncLookupsFromRow(row);
  rows = [...rows, row];
  expanded.add(parent.id);
  expanded.add(row.id);
  touchWorkspaceRecord("estimates");
  render();
}

function addElement() {
  const parent = visibleRows().find((row) => row.level === "product") || rows.find((row) => row.level === "product");
  if (!parent) {
    addProduct();
    return;
  }
  const row = {
    id: uid("element"),
    level: "element",
    parentId: parent.id,
    active: true,
    sourceOrder: rows.length + 1,
    packageName: parent.packageName,
    product: parent.product,
    element: "New Element",
    sku: "",
    description: "",
    type: parent.type || "MP",
    source: "",
    moq: 0,
    qty: 0,
    neededQty: 0,
    inventoryQty: 0,
    clientQoh: 0,
    cost: 0,
    markup: asNumber(els.globalMarkup.value),
    marginAdj: 0.4,
    priorPpp: 0
  };
  syncLookupsFromRow(row);
  rows = [...rows, row];
  expanded.add(parent.id);
  touchWorkspaceRecord("estimates");
  render();
}

function downloadCsvInBrowser(csv, filename) {
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function saveCsvToDownloads(csv, filename) {
  const response = await fetch("/api/export-csv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, csv: `\uFEFF${csv}` })
  });
  if (!response.ok) throw new Error("Save failed");
  return response.json();
}

function rowsForExport() {
  const orderedRows = [];
  packageRows()
    .sort((a, b) => a.sourceOrder - b.sourceOrder)
    .forEach((packageRow) => {
      orderedRows.push(packageRow);
      childrenOf(packageRow)
        .sort((a, b) => a.sourceOrder - b.sourceOrder)
        .forEach((productRow) => {
          orderedRows.push(productRow);
          childrenOf(productRow)
            .sort((a, b) => a.sourceOrder - b.sourceOrder)
            .forEach((elementRow) => orderedRows.push(elementRow));
        });
    });
  return orderedRows;
}

function csvExportRow(row) {
  const calc = calculate(row);
  const isPackage = row.level === "package";
  return [
    row.level,
    row.active ? "TRUE" : "FALSE",
    row.packageName,
    row.product,
    row.element,
    row.sku || "",
    row.description,
    row.type,
    row.source || "",
    row.moq ? formatNumberForReport(row.moq, 0) : "",
    isPackage ? "" : formatNumberForReport(calc.inventoryQty, 0),
    isPackage ? "" : formatNumberForReport(calc.neededQty, 0),
    isPackage ? "" : formatNumberForReport(calc.qtyToOrder, 0),
    decimal(calc.cost, 2),
    money(calc.perPieceCost, 3),
    isPackage ? "" : formatNumberForReport(calc.clientQoh, 0),
    isPackage ? "" : formatNumberForReport(calc.qty, 0),
    decimal(calc.markup, 3),
    money(calc.standardPrice, 2),
    decimal(calc.marginAdj, 3),
    money(calc.marginDollars, 2),
    money(calc.clientPrice, 2),
    money(calc.ppp, 3),
    money(calc.priorPpp, 3),
    money(calc.diff, 3)
  ];
}

async function exportCsv() {
  const headers = ["Level", "Active", "Package", "Product / Service", "Element", "SKU", "Description", "Production Type", "Source", "MOQ", "Inventory Qty", "Needed Qty", "Qty to Order", "Cost", "Per Piece Cost", "Client QOH", "Client Order Qty", "Markup", "Std Markup Price", "Margin Adj", "Margin Dollars", "Client Price", "PPP", "Prior PPP", "Difference"];
  const lines = [headers];
  rowsForExport().forEach((row) => {
    lines.push(csvExportRow(row));
  });

  const csv = lines.map((line) => line.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const filename = `${(els.projectName.value || "estimate").replace(/[^\w-]+/g, "-")}-${els.estimateYear.value || "year"}.csv`;
  try {
    const result = await saveCsvToDownloads(csv, filename);
    setSaveStatus(`Saved to Downloads: ${result.filename}`);
  } catch (err) {
    console.warn("Downloads export failed, using browser download:", err);
    downloadCsvInBrowser(csv, filename);
    setSaveStatus(`Downloaded: ${filename}`);
  }
}

function saveLookup() {
  const tableName = els.lookupTable.value;
  const value = els.lookupValue.value.trim();
  const editing = els.lookupValue.dataset.editing;
  if (!value) return;

  lookups[tableName] = uniqueValues((lookups[tableName] || []).map((candidate) => (candidate === editing ? value : candidate)).concat(value));
  if (editing && editing !== value) {
    rows = rows.map((row) => ({
      ...row,
      packageName: tableName === "packages" && row.packageName === editing ? value : row.packageName,
      product: tableName === "products" && row.product === editing ? value : row.product,
      element: tableName === "elements" && row.element === editing ? value : row.element
    }));
  }
  if (tableName === "clients" && editing && els.clientName.value === editing) els.clientName.value = value;
  if (tableName === "years" && editing && String(els.estimateYear.value) === String(editing)) els.estimateYear.value = value;
  els.lookupValue.value = "";
  delete els.lookupValue.dataset.editing;
  render();
}

let printInputState = [];

function setPrintInputValue(input, formattedValue) {
  printInputState.push({
    input,
    type: input.type,
    value: input.value,
    step: input.getAttribute("step")
  });
  input.type = "text";
  input.value = formattedValue;
}

function prepareReportPrint() {
  printInputState = [];
  document.querySelectorAll("#lineItems tr").forEach((tr) => {
    const row = rows.find((candidate) => candidate.id === tr.dataset.id);
    if (!row) return;
    const calc = calculate(row);
    const isPackage = row.level === "package";
    const formats = [
      [".inventory-input", isPackage ? "" : formatNumberForReport(calc.inventoryQty, 0)],
      [".needed-input", isPackage ? "" : formatNumberForReport(calc.neededQty, 0)],
      [".cost-input", money(calc.cost, 2)],
      [".client-qoh-input", isPackage ? "" : formatNumberForReport(calc.clientQoh, 0)],
      [".prior-input", money(calc.priorPpp, 3)]
    ];
    formats.forEach(([selector, value]) => {
      const input = tr.querySelector(selector);
      if (input) setPrintInputValue(input, value);
    });
  });
}

function restoreReportPrint() {
  printInputState.forEach(({ input, type, value, step }) => {
    input.type = type;
    input.value = value;
    if (step === null) input.removeAttribute("step");
    else input.setAttribute("step", step);
  });
  printInputState = [];
  document.body.classList.remove("report-print-costs", "report-print-schedule", "report-print-both", "proposal-print", "proposal-print-draft");
  delete document.body.dataset.proposalOutputAudience;
  delete document.body.dataset.proposalOutputScope;
  delete document.body.dataset.proposalPublishingTemplate;
}

function printReport() {
  const scope = els.pdfScope.value || "both";
  document.body.classList.remove("report-print-costs", "report-print-schedule", "report-print-both");
  document.body.classList.add(`report-print-${scope}`);
  window.print();
}

function printProposalPublishingOutput() {
  renderProposalPreview();
  const { needsSave, needsAttach } = proposalPublishingReadiness();
  const warningCount = needsSave.length + needsAttach.length;
  const audienceLabel = proposalIsClientOutput() ? "client" : "internal";
  setSaveStatus(warningCount
    ? `Preparing ${audienceLabel} PDF preview; ${warningCount} source issue${warningCount === 1 ? "" : "s"} flagged`
    : `Preparing ${audienceLabel} proposal PDF`);
  document.body.classList.remove("report-print-costs", "report-print-schedule", "report-print-both");
  document.body.classList.add("proposal-print");
  document.body.classList.toggle("proposal-print-draft", warningCount > 0);
  document.body.dataset.proposalOutputAudience = proposal.outputAudience || "client";
  document.body.dataset.proposalOutputScope = proposal.outputScope || "both";
  document.body.dataset.proposalPublishingTemplate = proposal.publishingTemplate || "directMail";
  window.print();
}

function proposalExportBase(section, source) {
  return {
    workspace: currentWorkspaceNumber || "",
    proposal: activeRecordNumber("proposals") || nextWorkspaceRecordNumber("proposals", "P", "proposalNumber", 10),
    title: proposal.title || "Proposal",
    client: proposal.preparedFor || els.clientName.value.trim() || "",
    section,
    source
  };
}

function proposalExportRecord(section, source, item, detail = "", qty = "", unit = "", total = "", notes = "") {
  return {
    ...proposalExportBase(section, source),
    item,
    detail,
    qty,
    unit,
    total,
    notes
  };
}

function proposalManifestExportRows(manifest) {
  return [
    proposalExportRecord("Publishing manifest", "Manifest", "Template", manifest.templateLabel),
    proposalExportRecord("Publishing manifest", "Manifest", "Audience", manifest.audienceLabel),
    proposalExportRecord("Publishing manifest", "Manifest", "Output", manifest.outputScopeLabel),
    proposalExportRecord("Publishing manifest", "Manifest", "Included sections", manifest.includedSectionLabels.join(" / ")),
    ...manifest.sources.map((source) => proposalExportRecord(
      "Publishing manifest",
      "Manifest",
      source.label,
      source.number || "Draft",
      "",
      "",
      "",
      source.statusLabel
    ))
  ];
}

function proposalPublishingExportRows() {
  renderProposalPreview();
  const manifest = proposalPublishingManifest();
  const exportRows = proposal.outputAudience === "internal" ? proposalManifestExportRows(manifest) : [];
  const proposalSource = proposalRecordSourceLabel("proposals", "Current proposal draft");

  if (proposalHasSection("copy")) {
    exportRows.push(
      proposalExportRecord("Proposal copy", proposalSource, "Overview", proposal.overview),
      proposalExportRecord("Proposal copy", proposalSource, "Audience / Scope", proposal.audience),
      proposalExportRecord("Proposal copy", proposalSource, "Deliverables", proposal.deliverables),
      proposalExportRecord("Proposal copy", proposalSource, "Value Narrative", proposal.valueNarrative),
      proposalExportRecord("Proposal copy", proposalSource, "Next Steps", proposal.nextSteps),
      proposalExportRecord("Proposal copy", proposalSource, "Terms Summary", proposal.terms)
    );
  }

  if (proposalHasSection("estimate") && proposal.outputScope !== "schedule") {
    const estimateSource = proposalRecordSourceLabel("estimates", "Current estimate");
    proposalPricingRows().forEach((row) => {
      exportRows.push(proposalExportRecord(
        "Estimate pricing",
        estimateSource,
        row.name,
        row.context,
        row.qty ? Math.round(row.qty).toLocaleString() : "",
        row.unit ? money(row.unit, 3) : "",
        money(row.total, 2)
      ));
    });
  }

  if (proposalHasSection("schedule") && proposal.outputScope !== "costs") {
    const scheduleSource = proposalRecordSourceLabel("estimates", "Current estimate");
    proposalPaymentRows().forEach((row) => {
      exportRows.push(proposalExportRecord(
        "Payment schedule",
        scheduleSource,
        `${row.type} - ${row.typeLabel}`,
        [row.date || "TBD", row.label, row.note].filter(Boolean).join(" / "),
        "",
        "",
        money(row.amount, 2),
        `Type balance ${money(row.typeBalance, 2)}`
      ));
    });
  }

  if (proposalHasSection("services")) {
    const servicesSource = proposalRecordSourceLabel("services", "Current services draft");
    const totals = serviceTotals();
    const isMonthlyMode = serviceTermMode() === "monthly";
    const termPrice = (isMonthlyMode ? 0 : totals.activationPrice) + totals.monthlyPrice * totals.termMonths;
    const rowsForServicesExport = serviceActiveCalcRows()
      .map((row) => ({ row, calc: serviceCalc(row) }))
      .filter(({ calc }) => calc.activationPrice || calc.monthlyPrice)
      .sort((a, b) => b.calc.monthlyPrice - a.calc.monthlyPrice);
    if (!proposalIsClientOutput() || rowsForServicesExport.length) {
      exportRows.push(proposalExportRecord(
        "Services calculator",
        servicesSource,
        serviceScenarioNames[serviceScenario] || "Service calculation",
        `${totals.termMonths} month term / ${decimal(totals.appointments, 1)} appointments per month`,
        "",
        "",
        money(termPrice, 2),
        `Activation ${isMonthlyMode ? "$0.00" : money(totals.activationPrice, 2)} / Monthly ${money(totals.monthlyPrice, 2)}`
      ));
      rowsForServicesExport.forEach(({ row, calc }) => {
        exportRows.push(proposalExportRecord(
          "Services calculator",
          servicesSource,
          row.item,
          [row.platform, row.costType].filter(Boolean).join(" / "),
          "",
          money(calc.monthlyPrice, 2),
          money(calc.activationPrice, 2),
          `Monthly price ${money(calc.monthlyPrice, 2)}`
        ));
      });
    }
  }

  if (proposalHasSection("sourcing")) {
    const sourcingSource = proposalRecordSourceLabel("sourcing", "Current sourcing draft");
    proposalSourcingPreviewRows({ includeSamples: proposal.outputAudience === "internal" }).forEach((entry) => {
      if (entry.sample) {
        exportRows.push(proposalExportRecord(
          "Sourcing summary",
          "Sample sourcing output",
          entry.item,
          [entry.vendor, entry.forwarder].filter(Boolean).join(" / "),
          entry.qty ? Math.round(entry.qty).toLocaleString() : "",
          money(entry.landedUnitCost, 3),
          money(entry.landedTotal, 2),
          entry.status || ""
        ));
        return;
      }
      exportRows.push(proposalExportRecord(
        "Sourcing summary",
        sourcingSource,
        rowDisplayName(entry.row),
        [entry.quote.vendorName || "Unassigned vendor", entry.quote.forwarderName || "Unassigned forwarder"].join(" / "),
        entry.priceBreak.qty ? Math.round(entry.priceBreak.qty).toLocaleString() : "",
        money(entry.calc.landedUnitCost, 3),
        money(entry.calc.landedTotal, 2),
        entry.quote.status || ""
      ));
    });
  }

  if (proposalHasSection("printQuote")) {
    syncPlaceholderDraftsFromInputs();
    if (!proposalIsClientOutput() || printQuoteHasClientContent()) {
      exportRows.push(proposalExportRecord(
        "Print quote",
        proposalRecordSourceLabel("printQuotes", "Current print quote draft"),
        printQuote.name || "Print Quote Draft",
        [printQuote.source, printQuote.externalRef && `Ref ${printQuote.externalRef}`, printQuote.sourceUrl].filter(Boolean).join(" / "),
        "",
        "",
        "",
        printQuote.notes || ""
      ));
    }
  }

  if (proposalHasSection("ecomm")) {
    syncPlaceholderDraftsFromInputs();
    if (!proposalIsClientOutput() || ecommPriceListHasClientContent()) {
      exportRows.push(proposalExportRecord(
        "Ecomm price list",
        proposalRecordSourceLabel("ecomm", "Current ecomm price list draft"),
        ecommPriceList.name || "Ecomm Price List Draft",
        [ecommPriceList.channel, ecommPriceList.externalRef && `Ref ${ecommPriceList.externalRef}`, ecommPriceList.sourceUrl].filter(Boolean).join(" / "),
        "",
        "",
        "",
        ecommPriceList.notes || ""
      ));
    }
  }

  return exportRows;
}

function proposalPublishingCsvPayload() {
  const manifest = proposalPublishingManifest();
  const isInternalOutput = manifest.audience === "internal";
  const columns = isInternalOutput
    ? ["Workspace #", "Proposal #", "Proposal Title", "Client", "Section", "Source Record", "Item", "Detail", "Qty", "Unit", "Total", "Notes"]
    : ["Proposal #", "Proposal Title", "Client", "Section", "Item", "Detail", "Qty", "Unit", "Total", "Notes"];
  const rowsForCsv = proposalPublishingExportRows();
  const csv = [
    csvLine(columns),
    ...rowsForCsv.map((row) => csvLine(isInternalOutput
      ? [
        row.workspace,
        row.proposal,
        row.title,
        row.client,
        row.section,
        row.source,
        row.item,
        row.detail,
        row.qty,
        row.unit,
        row.total,
        row.notes
      ]
      : [
        row.proposal,
        row.title,
        row.client,
        row.section,
        row.item,
        row.detail,
        row.qty,
        row.unit,
        row.total,
        row.notes
      ]))
  ].join("\n");
  const filename = `${filenameToken(proposal.title || els.workspaceName.value || "proposal", "proposal")}-${isInternalOutput ? "internal" : "client"}-output.csv`;
  return { manifest, isInternalOutput, columns, rowsForCsv, csv, filename };
}

async function exportProposalPublishingCsv() {
  const { manifest, isInternalOutput, csv, filename } = proposalPublishingCsvPayload();
  try {
    const result = await saveCsvToDownloads(csv, filename);
    setSaveStatus(`${manifest.ready ? "Exported" : "Preview exported"} ${isInternalOutput ? "internal" : "client"} CSV to Downloads: ${result.filename}`);
  } catch (err) {
    console.warn("Proposal publishing export failed, using browser download:", err);
    downloadCsvInBrowser(csv, filename);
    setSaveStatus(`${manifest.ready ? "Downloaded" : "Preview downloaded"} ${isInternalOutput ? "internal" : "client"} CSV: ${filename}`);
  }
}

function runProposalExportQaIfRequested() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("proposalExportQa")) return;
  const originalAudience = proposal.outputAudience;
  const originalTemplate = proposal.publishingTemplate;
  const originalSections = [...proposalIncludedSections()];

  proposal.outputAudience = "client";
  const clientPayload = proposalPublishingCsvPayload();
  proposal.outputAudience = "internal";
  const internalPayload = proposalPublishingCsvPayload();

  proposal.outputAudience = originalAudience;
  proposal.publishingTemplate = originalTemplate;
  proposal.includedSections = originalSections;
  renderProposalPreview();
  renderProposalPublishingActions();

  const result = {
    clientColumns: clientPayload.columns,
    internalColumns: internalPayload.columns,
    clientRowCount: clientPayload.rowsForCsv.length,
    internalRowCount: internalPayload.rowsForCsv.length,
    clientHasInternalColumns: clientPayload.columns.some((column) => ["Workspace #", "Source Record"].includes(column)),
    internalHasManifestRows: internalPayload.rowsForCsv.some((row) => row.section === "Publishing manifest"),
    clientHasManifestRows: clientPayload.rowsForCsv.some((row) => row.section === "Publishing manifest"),
    clientFilename: clientPayload.filename,
    internalFilename: internalPayload.filename
  };
  window.__proposalExportQa = result;
  document.querySelector("#proposalExportQaResult")?.remove();
  const resultEl = document.createElement("script");
  resultEl.id = "proposalExportQaResult";
  resultEl.type = "application/json";
  resultEl.textContent = JSON.stringify(result);
  document.body.append(resultEl);
}

els.appTabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveView(tab.dataset.view || "estimateView"));
});
els.tabRecordControls.forEach((control) => {
  control.addEventListener("click", workspaceRecordAction);
  control.addEventListener("change", workspaceRecordAction);
});
if (els.serviceScenario) {
  [els.serviceScenario, els.serviceTermMonths, els.serviceOngoingMonths, els.serviceAppointments, els.serviceStartupMarkup, els.serviceMonthlyMarkup, ...els.serviceTermModes].forEach((input) => {
    input.addEventListener("change", () => {
      if (input === els.serviceStartupMarkup) {
        serviceVisibleRows().forEach((row) => {
          row.startupMarkup = asNumber(els.serviceStartupMarkup.value);
        });
      }
      if (input === els.serviceMonthlyMarkup) {
        serviceVisibleRows().forEach((row) => {
          row.monthlyMarkup = asNumber(els.serviceMonthlyMarkup.value);
        });
      }
      touchWorkspaceRecord("services");
      renderServicesCalculator();
    });
  });
  [els.execDialsPerDay, els.execDaysPerWeek, els.execConversationsPerDay, els.execSetsPerWeek, els.execShowRate, els.execWinRate].forEach((input) => {
    input.addEventListener("input", () => {
      updateServiceAppointmentsFromExecution();
      touchWorkspaceRecord("services");
      renderServicesCalculator();
    });
  });
  els.serviceRows.addEventListener("change", (event) => {
    const rowEl = event.target.closest(".service-row[data-index]");
    if (!rowEl) return;
    const row = serviceRows[Number(rowEl.dataset.index)];
    if (!row) return;
    if (event.target.classList.contains("service-active")) row.active = event.target.checked;
    if (event.target.classList.contains("service-platform")) row.platform = event.target.value;
    if (event.target.classList.contains("service-cost-type")) row.costType = event.target.value;
    if (event.target.classList.contains("service-cost-center")) row.costCenter = serviceNormalizeCostCenter(event.target.value);
    if (event.target.classList.contains("service-startup")) row.startup = asNumber(event.target.value);
    if (event.target.classList.contains("service-recurring")) row.recurring = asNumber(event.target.value);
    if (event.target.classList.contains("service-variable")) row.variable = asNumber(event.target.value);
    if (event.target.classList.contains("service-quantity")) row.quantity = asNumber(event.target.value);
    if (event.target.classList.contains("service-variable-model")) row.variableModel = event.target.value;
    if (event.target.classList.contains("service-startup-markup")) row.startupMarkup = asNumber(event.target.value);
    if (event.target.classList.contains("service-monthly-markup")) row.monthlyMarkup = asNumber(event.target.value);
    touchWorkspaceRecord("services");
    renderServicesCalculator();
  });
  els.serviceRows.addEventListener("click", (event) => {
    const button = event.target.closest(".service-chevron");
    if (!button) return;
    const rowEl = button.closest(".service-row[data-index]");
    const row = serviceRows[Number(rowEl?.dataset.index)];
    if (!row) return;
    if (serviceExpanded.has(row.id)) serviceExpanded.delete(row.id);
    else serviceExpanded.add(row.id);
    touchWorkspaceRecord("services");
    renderServicesCalculator();
  });
}
[
  els.sourcingSearch,
  els.sourcingSourceFilter,
  els.sourcingStatusFilter,
  els.sourcingGroupBy,
  els.sourcingShowAll
].filter(Boolean).forEach((input) => {
  input.addEventListener("input", () => {
    touchSourcingRecord();
    renderSourcing();
  });
  input.addEventListener("change", () => {
    touchSourcingRecord();
    renderSourcing();
  });
});
els.populateSourcingSampleBtn?.addEventListener("click", populateSourcingReviewData);
els.selectVisibleSourcingBtn?.addEventListener("click", () => {
  const visibleRows = sourcingCandidates();
  const allVisibleSelected = visibleRows.length && visibleRows.every((row) => selectedSourcingRows.has(row.id));
  if (allVisibleSelected) visibleRows.forEach((row) => selectedSourcingRows.delete(row.id));
  else visibleRows.forEach((row) => selectedSourcingRows.add(row.id));
  touchSourcingRecord();
  renderSourcing();
  setSourcingImportStatus(allVisibleSelected ? "Cleared visible selection" : `Selected ${visibleRows.length} visible row${visibleRows.length === 1 ? "" : "s"}`);
});
els.exportSourcingTemplateBtn?.addEventListener("click", exportSourcingQuoteSheet);
els.importSourcingQuotesBtn?.addEventListener("click", () => els.sourcingImportFile?.click());
els.sourcingImportFile?.addEventListener("change", (event) => {
  prepareSourcingImportMapping(event.target.files?.[0]);
});
els.sourcingImportMapper?.addEventListener("click", (event) => {
  if (event.target.closest("#cancelSourcingImportMapBtn") || event.target.closest(".cancel-sourcing-import-map")) {
    clearSourcingImportMapper();
    setSourcingImportStatus("Import cancelled");
  }
  const includeAllButton = event.target.closest("[data-import-include-all]");
  if (includeAllButton && pendingSourcingImport) {
    setAllImportRowsIncluded(sourcingImportPreviewRows(), includeAllButton.dataset.importIncludeAll === "true");
    renderSourcingImportPreview();
  }
  const previewRowButton = event.target.closest("[data-import-preview-index]");
  if (previewRowButton && pendingSourcingImport) {
    pendingSourcingImport.selectedPreviewIndex = asNumber(previewRowButton.dataset.importPreviewIndex);
    renderSourcingImportPreview();
  }
  if (event.target.closest("#applySourcingImportMapBtn")) {
    const allMappedRows = mappedImportRowsFromPending();
    const previewRows = allMappedRows.map((row, index) => sourcingImportResolution(row, index));
    const selectedWarnings = previewRows
      .filter((entry, index) => importRowIncluded(entry, index))
      .reduce((total, entry) => total + sourcingImportWarnings(entry).length, 0);
    const mappedRows = allMappedRows.flatMap((row, index) => {
      const entry = previewRows[index];
      if (entry.status !== "matched" || !importRowIncluded(entry, index)) return [];
      return [{ ...row, _matchedRowId: entry.row.id, _importAction: entry.importAction }];
    });
    mappedRows._warningCount = selectedWarnings;
    applyImportedSourcingRows(mappedRows);
    clearSourcingImportMapper();
  }
});
els.sourcingImportMapper?.addEventListener("change", (event) => {
  if (event.target.classList.contains("sourcing-map-select")) renderSourcingImportPreview();
  if (event.target.matches("[data-import-include-index]")) {
    setImportRowIncluded(asNumber(event.target.dataset.importIncludeIndex), event.target.checked);
    renderSourcingImportPreview();
  }
  if (event.target.matches("[data-import-match-index]")) {
    setImportRowManualMatch(asNumber(event.target.dataset.importMatchIndex), event.target.value);
    renderSourcingImportPreview();
  }
  if (event.target.matches("[data-import-action-index]")) {
    setImportRowAction(asNumber(event.target.dataset.importActionIndex), event.target.value);
    renderSourcingImportPreview();
  }
});
els.sourcingViewModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sourcingViewMode = button.dataset.sourcingViewMode || "summary";
    touchSourcingRecord();
    renderSourcing();
  });
});
els.sourcingBoardContext?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sourcing-jump]");
  if (!button) return;
  const viewMode = button.dataset.sourcingJump;
  if (!validSourcingViewModes().includes(viewMode)) return;
  sourcingViewMode = viewMode;
  touchSourcingRecord();
  renderSourcing();
  setSourcingImportStatus(`Opened ${button.textContent.replace(/\s+/g, " ").trim()}`);
});
if (els.sourcingItems) {
  els.sourcingItems.addEventListener("change", (event) => {
    if (!event.target.classList.contains("sourcing-row-select")) return;
    const item = event.target.closest(".sourcing-summary-item");
    const rowId = item?.dataset.rowId;
    if (!rowId) return;
    if (event.target.checked) selectedSourcingRows.add(rowId);
    else selectedSourcingRows.delete(rowId);
    touchSourcingRecord();
    event.stopPropagation();
    renderSourcing();
  });
  els.sourcingItems.addEventListener("input", (event) => {
    const item = event.target.closest(".sourcing-item, .sourcing-summary-item, .sourcing-decision-item");
    const quoteEl = event.target.closest(".sourcing-quote");
    const breakEl = event.target.closest(".sourcing-break");
    const rowId = item?.dataset.rowId;
    const quoteId = quoteEl?.dataset.quoteId;
    if (!rowId || !quoteId) return;
    const quote = (sourcing.quotes[rowId] || []).find((candidate) => candidate.id === quoteId);
    if (event.target.classList.contains("sourcing-quote-field") && quote) {
      const key = event.target.dataset.key;
      const numericFields = new Set(["quoteVersion", "dutyRate", "tariffRate", "freightEstimate", "customsFees", "leadTimeDays"]);
      quote[key] = numericFields.has(key) ? asNumber(event.target.value) : event.target.value;
      touchSourcingRecord();
    }
    if (event.target.classList.contains("sourcing-break-field") && quote && breakEl?.dataset.breakId) {
      const priceBreak = (quote.breaks || []).find((candidate) => candidate.id === breakEl.dataset.breakId);
      if (priceBreak) {
        priceBreak[event.target.dataset.key] = asNumber(event.target.value);
        touchSourcingRecord();
      }
    }
  });
  els.sourcingItems.addEventListener("click", (event) => {
    const removePoButton = event.target.closest(".remove-po-ready");
    if (removePoButton) {
      clearAwardRowsPoReady([removePoButton.dataset.rowId]);
      return;
    }
    const exportForwarderButton = event.target.closest(".export-forwarder-manifest");
    if (exportForwarderButton) {
      exportForwarderManifest(exportForwarderButton.dataset.forwarder || "");
      return;
    }
    const exportPoGroupButton = event.target.closest(".export-po-group");
    if (exportPoGroupButton) {
      const rowIds = String(exportPoGroupButton.dataset.rowIds || "").split(",").filter(Boolean);
      if (!rowIds.length) {
        setSourcingImportStatus(`No PO Ready items to export for ${exportPoGroupButton.dataset.supplier || "supplier"}`, true);
        return;
      }
      exportPoQueue(rowIds, exportPoGroupButton.dataset.supplier || "supplier");
      return;
    }
    if (event.target.closest(".export-po-queue")) {
      exportPoQueue();
      return;
    }
    const poReadyButton = event.target.closest(".mark-award-po-ready");
    if (poReadyButton) {
      markAwardRowsPoReady(String(poReadyButton.dataset.rowIds || "").split(","));
      return;
    }
    const awardApplyButton = event.target.closest(".apply-award-estimate");
    if (awardApplyButton) {
      applySelectedQuote(awardApplyButton.dataset.rowId);
      return;
    }
    const decisionButton = event.target.closest(".select-sourcing-decision");
    if (decisionButton) {
      selectQuoteBreak(decisionButton.dataset.rowId, decisionButton.dataset.quoteId, decisionButton.dataset.breakId);
      return;
    }
    if (event.target.closest(".export-readiness-csv")) {
      exportSourcingReadiness();
      return;
    }
    const projectRow = event.target.closest(".sourcing-project-row");
    if (projectRow && event.target.closest(".assign-current-project-row")) {
      if (setQuoteCurrentProjectAssignment(projectRow.dataset.rowId, projectRow.dataset.quoteId, true)) {
        setSourcingImportStatus(`Assigned quote to ${currentProjectNumber() || "current estimate"}`);
      }
      return;
    }
    if (projectRow && event.target.closest(".unassign-current-project-row")) {
      if (setQuoteCurrentProjectAssignment(projectRow.dataset.rowId, projectRow.dataset.quoteId, false)) {
        setSourcingImportStatus(`Unassigned quote from ${currentProjectNumber() || "current estimate"}`);
      }
      return;
    }
    if (event.target.closest(".assign-selected-winners")) {
      setSelectedWinnerProjectAssignments(true);
      return;
    }
    if (event.target.closest(".unassign-selected-winners")) {
      setSelectedWinnerProjectAssignments(false);
      return;
    }
    const readinessRow = event.target.closest(".sourcing-readiness-row");
    if (readinessRow && event.target.closest(".readiness-assign")) {
      if (setQuoteCurrentProjectAssignment(readinessRow.dataset.rowId, readinessRow.dataset.quoteId, true)) {
        setSourcingImportStatus(`Assigned quote to ${currentProjectNumber() || "current estimate"}`);
      }
      return;
    }
    if (readinessRow && event.target.closest(".readiness-sync")) {
      applySelectedQuoteRows([readinessRow.dataset.rowId], "readiness row");
      return;
    }
    if (readinessRow && event.target.closest(".readiness-version")) {
      addQuoteVersion(readinessRow.dataset.rowId, readinessRow.dataset.quoteId);
      return;
    }
    if (readinessRow && event.target.closest(".readiness-po-ready")) {
      markAwardRowsPoReady([readinessRow.dataset.rowId]);
      return;
    }
    const applySyncRowButton = event.target.closest(".apply-sync-row");
    if (applySyncRowButton) {
      applySelectedQuoteRows([applySyncRowButton.dataset.rowId], "row");
      return;
    }
    const applySyncGroupButton = event.target.closest(".apply-sync-group");
    if (applySyncGroupButton) {
      const rowIds = String(applySyncGroupButton.dataset.rowIds || "").split(",").filter(Boolean);
      applySelectedQuoteRows(rowIds, "supplier");
      return;
    }
    if (event.target.closest(".apply-sync-all")) {
      const rowIds = sourcingEstimateSyncRows(sourcingCandidates())
        .filter((entry) => !entry.isSynced)
        .map((entry) => entry.row.id);
      applySelectedQuoteRows(rowIds, "visible rows");
      return;
    }
    const refreshRow = event.target.closest(".sourcing-refresh-row");
    if (refreshRow && event.target.closest(".refresh-new-version")) {
      addQuoteVersion(refreshRow.dataset.rowId, refreshRow.dataset.quoteId);
      return;
    }
    const refreshStatusButton = event.target.closest(".refresh-quote-status");
    if (refreshRow && refreshStatusButton) {
      setSourcingQuoteStatus(refreshRow.dataset.rowId, refreshRow.dataset.quoteId, refreshStatusButton.dataset.status);
      return;
    }
    const item = event.target.closest(".sourcing-item, .sourcing-summary-item, .sourcing-decision-item");
    const quoteEl = event.target.closest(".sourcing-quote");
    const breakEl = event.target.closest(".sourcing-break");
    const rowId = item?.dataset.rowId;
    const quoteId = quoteEl?.dataset.quoteId;
    const breakId = breakEl?.dataset.breakId;
    if (!rowId) return;
    if (event.target.closest(".sourcing-summary-line") && !event.target.closest("button, input, select, textarea")) {
      if (sourcingExpandedRows.has(rowId)) sourcingExpandedRows.delete(rowId);
      else sourcingExpandedRows.add(rowId);
      touchSourcingRecord();
      renderSourcing();
      return;
    }
    if (event.target.closest(".add-sourcing-quote")) addSourcingQuote(rowId);
    if (quoteId && event.target.closest(".add-quote-break")) addQuoteBreak(rowId, quoteId);
    if (quoteId && event.target.closest(".add-quote-version")) addQuoteVersion(rowId, quoteId);
    if (quoteId && event.target.closest(".assign-current-project")) assignCurrentProjectToQuote(rowId, quoteId);
    if (quoteId && breakId && event.target.closest(".select-sourcing-break")) selectQuoteBreak(rowId, quoteId, breakId);
    if (event.target.closest(".apply-sourcing-quote")) applySelectedQuote(rowId);
  });
  els.sourcingItems.addEventListener("change", (event) => {
    if (event.target.classList.contains("sourcing-row-select")) return;
    const item = event.target.closest(".sourcing-item, .sourcing-summary-item, .sourcing-decision-item");
    const quoteEl = event.target.closest(".sourcing-quote");
    const breakEl = event.target.closest(".sourcing-break");
    const rowId = item?.dataset.rowId;
    const quoteId = quoteEl?.dataset.quoteId;
    if (!rowId || !quoteId) return;
    if (event.target.classList.contains("sourcing-quote-field")) {
      const key = event.target.dataset.key;
      const numericFields = new Set(["quoteVersion", "dutyRate", "tariffRate", "freightEstimate", "customsFees", "leadTimeDays"]);
      upsertQuote(rowId, quoteId, { [key]: numericFields.has(key) ? asNumber(event.target.value) : event.target.value });
    }
    if (event.target.classList.contains("sourcing-break-field") && breakEl?.dataset.breakId) {
      upsertQuoteBreak(rowId, quoteId, breakEl.dataset.breakId, { [event.target.dataset.key]: asNumber(event.target.value) });
    }
  });
}
[
  els.proposalTemplateSearch,
  els.proposalTemplateCategory,
  els.proposalTemplateSelect
].filter(Boolean).forEach((input) => {
  input.addEventListener("input", renderProposalTemplateLibrary);
  input.addEventListener("change", renderProposalTemplateLibrary);
});
els.loadProposalTemplateBtn?.addEventListener("click", loadSelectedProposalTemplate);
els.renameProposalTemplateCopyBtn?.addEventListener("click", renameProposalTemplateCopy);
els.resetProposalSourceBtn?.addEventListener("click", resetProposalStarterToSource);
els.proposalEditPreviewBtn?.addEventListener("click", () => {
  proposalPreviewEditMode = !proposalPreviewEditMode;
  syncProposalPreviewEditableState();
});
document.querySelector(".proposal-page")?.addEventListener("input", (event) => {
  const field = event.target.closest("[data-proposal-field]");
  if (!field || !proposalPreviewEditMode) return;
  updateProposalFromPreviewField(field);
});
document.querySelector(".proposal-page")?.addEventListener("blur", (event) => {
  const field = event.target.closest("[data-proposal-field]");
  if (!field || !proposalPreviewEditMode) return;
  updateProposalFromPreviewField(field);
  renderProposalPreview();
}, true);

[
  [els.proposalTitle, "title"],
  [els.proposalSubtitle, "subtitle"],
  [els.proposalPreparedFor, "preparedFor"],
  [els.proposalPricingMode, "pricingMode"],
  [els.proposalPublishingTemplate, "publishingTemplate"],
  [els.proposalOutputAudience, "outputAudience"],
  [els.proposalOutputScope, "outputScope"],
  [els.proposalOverview, "overview"],
  [els.proposalAudience, "audience"],
  [els.proposalDeliverables, "deliverables"],
  [els.proposalValueNarrative, "valueNarrative"],
  [els.proposalNextSteps, "nextSteps"],
  [els.proposalTerms, "terms"]
].forEach(([input, key]) => {
  if (!input) return;
  input.addEventListener("input", () => {
    if (key === "publishingTemplate") {
      applyProposalTemplatePreset(input.value);
      setProposalEditorValues();
    } else {
      proposal[key] = input.value;
    }
    if (key === "outputScope") {
      const included = proposalIncludedSections();
      if (input.value === "costs") included.delete("schedule");
      if (input.value === "schedule") included.add("schedule");
      if (input.value === "both") included.add("schedule");
      proposal.includedSections = Array.from(included);
      els.proposalSectionToggles.forEach((toggle) => {
        toggle.checked = included.has(toggle.value);
      });
    }
    touchWorkspaceRecord("proposals");
    renderProposalPreview();
  });
});
els.proposalSectionToggles.forEach((input) => {
  input.addEventListener("change", () => {
    const sections = els.proposalSectionToggles.filter((toggle) => toggle.checked).map((toggle) => toggle.value);
    proposal.includedSections = sections.length ? sections : ["copy"];
    if (input.value === "schedule" && input.checked && els.proposalOutputScope?.value === "costs") {
      proposal.outputScope = "both";
      els.proposalOutputScope.value = "both";
    }
    if (input.value === "estimate" && !input.checked && els.proposalOutputScope?.value === "costs") {
      proposal.outputScope = "schedule";
      els.proposalOutputScope.value = "schedule";
    }
    touchWorkspaceRecord("proposals");
    renderProposalPreview();
  });
});
els.resetProposalTemplateBtn?.addEventListener("click", () => {
  applyProposalTemplatePreset(proposal.publishingTemplate || "directMail");
  setProposalEditorValues();
  touchWorkspaceRecord("proposals");
  renderProposalPreview();
});
els.proposalPublishManifest?.addEventListener("click", (event) => {
  if (event.target.closest("[data-manifest-action='save-sources']")) {
    saveProposalManifestSources();
    return;
  }
  if (event.target.closest("[data-manifest-action='attach-sources']")) {
    attachProposalManifestSources();
    return;
  }
  const sourceButton = event.target.closest("[data-manifest-source]");
  if (!sourceButton) return;
  openWorkspaceRecordCollection(sourceButton.dataset.manifestSource);
});
els.proposalPublishReadiness?.addEventListener("click", (event) => {
  if (event.target.closest("[data-readiness-action='save-sources']")) {
    saveProposalManifestSources();
    return;
  }
  if (event.target.closest("[data-readiness-action='attach-sources']")) {
    attachProposalManifestSources();
  }
});
els.proposalPublishSummary?.addEventListener("click", (event) => {
  const sourceButton = event.target.closest("[data-publishing-source]");
  if (!sourceButton) return;
  openWorkspaceRecordCollection(sourceButton.dataset.publishingSource);
});
[
  els.printQuoteName,
  els.printQuoteSource,
  els.printQuoteExternalRef,
  els.printQuoteSourceUrl,
  els.printQuoteNotes,
  els.printQuoteValidUntil,
  els.printQuoteCustomerName,
  els.printQuoteCustomerCompany,
  els.printQuoteShipMethod,
  els.printQuoteShippingAmount,
  els.printQuoteCustomerNote,
  els.printQuoteCustomerTerms,
  els.printQuoteInternalNotes,
  els.ecommListName,
  els.ecommChannel,
  els.ecommExternalRef,
  els.ecommSourceUrl,
  els.ecommNotes
].filter(Boolean).forEach((input) => {
  input.addEventListener("input", () => {
    syncPlaceholderDraftsFromInputs();
    if ([els.printQuoteName, els.printQuoteSource, els.printQuoteExternalRef, els.printQuoteSourceUrl, els.printQuoteNotes, els.printQuoteValidUntil, els.printQuoteCustomerName, els.printQuoteCustomerCompany, els.printQuoteShipMethod, els.printQuoteShippingAmount, els.printQuoteCustomerNote, els.printQuoteCustomerTerms, els.printQuoteInternalNotes].includes(input)) {
      touchWorkspaceRecord("printQuotes");
    }
    if ([els.ecommListName, els.ecommChannel, els.ecommExternalRef, els.ecommSourceUrl, els.ecommNotes].includes(input)) {
      touchWorkspaceRecord("ecomm");
    }
    renderPlaceholderSummaries();
    renderPrintQuoteDraft();
    renderTabRecordControls();
    renderProposalPreview();
  });
});
els.addPrintQuoteLineBtn?.addEventListener("click", addPrintQuoteLine);
els.refreshPrintQuoteLinesBtn?.addEventListener("click", refreshPrintQuoteLinesFromEstimate);
els.printQuoteLines?.addEventListener("change", (event) => {
  const input = event.target.closest("[data-print-quote-line-field]");
  if (!input) return;
  const row = input.closest("[data-print-quote-line-id]");
  if (!row) return;
  updatePrintQuoteLine(row.dataset.printQuoteLineId, input.dataset.printQuoteLineField, input.value);
});
els.printQuoteLines?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-print-quote-line-remove]");
  if (!removeButton) return;
  const row = removeButton.closest("[data-print-quote-line-id]");
  if (!row) return;
  removePrintQuoteLine(row.dataset.printQuoteLineId);
});
els.printQuoteOutputModeButtons?.forEach((button) => {
  button.addEventListener("click", () => {
    printQuote.outputMode = button.dataset.printQuoteMode === "customer" ? "customer" : "builder";
    touchWorkspaceRecord("printQuotes");
    renderPrintQuoteDraft();
    renderTabRecordControls();
  });
});
els.searchInput.addEventListener("input", render);
els.includeInactive.addEventListener("change", render);
els.estimateViewModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    els.estimateViewMode.value = button.dataset.viewMode;
    render();
  });
});
els.tariffRate.addEventListener("change", () => {
  touchWorkspaceRecord("estimates");
  render();
});
els.simulationMode.addEventListener("change", render);
els.simulationBasis.addEventListener("change", render);
els.simulationPercent.addEventListener("input", render);
els.simulationPreview.addEventListener("change", render);
els.applySimulationBtn.addEventListener("click", applyQuantitySimulation);
els.estimateYear.addEventListener("change", () => {
  touchWorkspaceRecord("estimates");
  render();
});
els.clientName.addEventListener("input", renderProposalPreview);
bindEstimateMetaInputs();
els.workspaceName.addEventListener("change", syncWorkspaceFromName);
els.workspaceName.addEventListener("input", renderSourcing);
els.workspaceMode.addEventListener("change", () => {
  setWorkspaceMode(els.workspaceMode.value);
  render();
});
els.workspaceModeButtons?.forEach((button) => {
  button.addEventListener("click", () => {
    setWorkspaceMode(button.dataset.workspaceMode);
    render();
  });
});
els.newWorkspaceBtn.addEventListener("click", newWorkspace);
els.saveWorkspaceBtn.addEventListener("click", saveCurrentWorkspaceOnly);
els.duplicateWorkspaceBtn.addEventListener("click", duplicateCurrentWorkspace);
els.loadWorkspaceBtn.addEventListener("click", openLoadWorkspaceDialog);
els.closeLoadWorkspaceBtn.addEventListener("click", closeLoadWorkspaceDialog);
els.loadWorkspaceSearch.addEventListener("input", renderLoadWorkspaceList);
els.loadWorkspaceModal.addEventListener("click", (event) => {
  if (event.target === els.loadWorkspaceModal) closeLoadWorkspaceDialog();
});
els.closeLibraryRecordBtn?.addEventListener("click", closeLibraryRecordDialog);
els.libraryRecordSearch?.addEventListener("input", renderLibraryRecordList);
els.libraryRecordScopeButtons?.forEach((button) => {
  button.addEventListener("click", () => {
    libraryPickerScope = button.dataset.libraryScope || "all";
    renderLibraryRecordList();
  });
});
els.libraryRecordModal?.addEventListener("click", (event) => {
  if (event.target === els.libraryRecordModal) closeLibraryRecordDialog();
});
els.dirtySaveContinueBtn?.addEventListener("click", () => closeDirtyRecordsModal("save"));
els.dirtyDiscardContinueBtn?.addEventListener("click", () => closeDirtyRecordsModal("discard"));
els.dirtyCancelBtn?.addEventListener("click", () => closeDirtyRecordsModal("cancel"));
els.dirtyCancelActionBtn?.addEventListener("click", () => closeDirtyRecordsModal("cancel"));
els.dirtyRecordsModal?.addEventListener("click", (event) => {
  if (event.target === els.dirtyRecordsModal) closeDirtyRecordsModal("cancel");
});
els.trackingLevel.addEventListener("change", render);
els.trackingMode.addEventListener("change", renderTracking);
els.trackingItem.addEventListener("change", renderTracking);
els.expandChartBtn.addEventListener("click", () => {
  els.yearPanel.classList.toggle("chart-expanded");
  els.expandChartBtn.textContent = els.yearPanel.classList.contains("chart-expanded") ? "Close" : "Expand";
  renderTracking();
});
document.querySelectorAll(".metric-filter").forEach((input) => input.addEventListener("change", render));
els.promoteDropZone.addEventListener("dragover", (event) => {
  if (!draggedRowId) return;
  event.preventDefault();
  els.promoteDropZone.classList.add("drop-target");
});
els.promoteDropZone.addEventListener("dragleave", () => els.promoteDropZone.classList.remove("drop-target"));
els.promoteDropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  els.promoteDropZone.classList.remove("drop-target");
  const source = rows.find((row) => row.id === draggedRowId || row.id === event.dataTransfer.getData("text/plain"));
  if (source) makePackage(source);
});
els.lookupTable.addEventListener("change", () => {
  els.lookupValue.value = "";
  delete els.lookupValue.dataset.editing;
  renderLookupList();
});
els.saveLookupBtn.addEventListener("click", saveLookup);
els.closeLoadEstimateBtn.addEventListener("click", closeLoadEstimateDialog);
els.loadEstimateSearch.addEventListener("input", renderLoadEstimateList);
els.loadEstimateModal.addEventListener("click", (event) => {
  if (event.target === els.loadEstimateModal) closeLoadEstimateDialog();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && els.dirtyRecordsModal && !els.dirtyRecordsModal.hidden) closeDirtyRecordsModal("cancel");
  if (event.key === "Escape" && !els.loadEstimateModal.hidden) closeLoadEstimateDialog();
  if (event.key === "Escape" && !els.loadWorkspaceModal.hidden) closeLoadWorkspaceDialog();
  if (event.key === "Escape" && els.libraryRecordModal && !els.libraryRecordModal.hidden) closeLibraryRecordDialog();
});
els.addPackageBtn.addEventListener("click", addPackage);
els.addProductBtn.addEventListener("click", addProduct);
els.addElementBtn.addEventListener("click", addElement);
els.exportBtn.addEventListener("click", exportCsv);
els.pdfBtn.addEventListener("click", printReport);
els.proposalPublishPdfBtn.addEventListener("click", printProposalPublishingOutput);
els.proposalPublishCsvBtn.addEventListener("click", exportProposalPublishingCsv);
window.addEventListener("beforeprint", prepareReportPrint);
window.addEventListener("afterprint", restoreReportPrint);
els.resetBtn.addEventListener("click", async () => {
  if (!(await resolveDirtyRecordsBefore(estimateLoadDirtyCollections(), "Resetting the estimate"))) return;
  els.estimateYear.value = "2026";
  await fetchAndApplySeed();
  rows = structuredClone(seedRows);
  lookups = structuredClone(seedLookups);
  expanded = new Set(seedRows.filter((row) => row.level !== "element").map((row) => row.id));
  activePackage = "All";
  activeTypes = new Set(Object.keys(typeLabels));
  setProjectNumber(nextProjectNumber());
  if (els.workspaceName) els.workspaceName.value = "North Pole 2026 Proposal Workspace";
  if (els.estimateVersion) els.estimateVersion.value = "1";
  els.projectName.value = "2026 North Pole Inventory Estimate";
  els.clientName.value = "North Pole Post Office";
  els.estimateYear.value = "2026";
  ensureWorkspace();
  els.searchInput.value = "";
  els.includeInactive.checked = false;
  els.globalMarkup.value = "0.40";
  els.tariffRate.value = "0.30";
  paymentDates = {};
  paymentSettings = defaultPaymentSettings();
  proposal = defaultProposal();
  sourcing = buildSampleSourcingForRows(rows);
  clearWorkspaceRecordDirty("estimates");
  clearWorkspaceRecordDirty("proposals");
  clearWorkspaceRecordDirty("sourcing");
  touchWorkspaceRecord("estimates");
  touchWorkspaceRecord("proposals");
  touchSourcingRecord();
  render();
  setSaveStatus("Reset to fresh unsaved estimate");
});
els.applyMarkupBtn.addEventListener("click", () => {
  const markup = asNumber(els.globalMarkup.value);
  rows = rows.map((row) => (row.active && row.level === "element" ? { ...row, markup } : row));
  touchWorkspaceRecord("estimates");
  render();
});

async function init() {
  els.estimateDate.textContent = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date());
  startBlankEstimate();
  setWorkspaceMode("full", { preferredView: "proposalView" });
  render();
  runProposalExportQaIfRequested();
  fetchAndApplySeed()
    .then(() => {
      if (!rows.length) {
        lookups = structuredClone(seedLookups);
        render();
      }
    })
    .catch(() => {});
  fetchEstimatesList().then(() => renderLoadEstimateList()).catch(() => {});
  fetch("/api/clients")
    .then((r) => r.json())
    .then((clientsRes) => {
      clientsList = Array.isArray(clientsRes) ? clientsRes : [];
      renderDatalists();
    })
    .catch(() => {});
}

init();
