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

function uniqueValues(values) {
  return Array.from(new Set(values.map((value) => String(value || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
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
let activeView = "estimateView";

function defaultProposal() {
  return {
    title: "Proposal for Client",
    subtitle: "Direct Mail Campaign",
    preparedFor: "",
    pricingMode: "package",
    overview: "This campaign is designed to replace guesswork with a clear, trackable plan. The estimate below turns the selected package structure into proposal-ready pricing.",
    audience: "Target audience, geography, quantity assumptions, and campaign scope can be summarized here before final production counts are locked.",
    deliverables: "Included deliverables are generated from the active estimating grid. Use the pricing section to review package rollups, detailed line items, or production type summaries.",
    valueNarrative: "The meaningful cost is the investment required to acquire and serve the right lead, customer, or recipient. Pricing should be evaluated against the expected return from each successful response.",
    nextSteps: "1. Review the campaign scope and pricing.\n2. Confirm any list, artwork, quantity, and schedule details.\n3. Approve the proposal so final numbers and production timing can be completed.",
    terms: "This proposal is based on the current project scope and may be refined as details are confirmed. Changes outside the approved scope may affect pricing, schedule, or required approvals."
  };
}

let proposal = defaultProposal();

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

const els = {
  appTabs: document.querySelectorAll(".app-tab"),
  estimateView: document.querySelector("#estimateView"),
  proposalView: document.querySelector("#proposalView"),
  projectNumber: document.querySelector("#projectNumber"),
  reportProjectTitle: document.querySelector("#reportProjectTitle"),
  reportProjectNumber: document.querySelector("#reportProjectNumber"),
  projectName: document.querySelector("#projectName"),
  projectNameLookup: document.querySelector("#projectNameLookup"),
  clientName: document.querySelector("#clientName"),
  estimateYear: document.querySelector("#estimateYear"),
  lineItems: document.querySelector("#lineItems"),
  rowTemplate: document.querySelector("#rowTemplate"),
  searchInput: document.querySelector("#searchInput"),
  packageFilters: document.querySelector("#packageFilters"),
  typeFilters: document.querySelector("#typeFilters"),
  includeInactive: document.querySelector("#includeInactive"),
  globalMarkup: document.querySelector("#globalMarkup"),
  applyMarkupBtn: document.querySelector("#applyMarkupBtn"),
  tariffRate: document.querySelector("#tariffRate"),
  addPackageBtn: document.querySelector("#addPackageBtn"),
  addProductBtn: document.querySelector("#addProductBtn"),
  addElementBtn: document.querySelector("#addElementBtn"),
  saveEstimateBtn: document.querySelector("#saveEstimateBtn"),
  loadEstimateBtn: document.querySelector("#loadEstimateBtn"),
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
  servicesView: document.querySelector("#servicesView"),
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
  executionSummary: document.querySelector("#executionSummary")
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

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

async function fetchEstimatesList() {
  try {
    const res = await fetch("/api/estimates");
    estimatesList = res.ok ? await res.json() : [];
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
  const match = String(projectNumber || "").match(/^P-(\d{6})$/);
  return match ? Number(match[1]) : 0;
}

function sortEstimatesList(estimates) {
  return [...estimates].sort((a, b) => projectNumberSortValue(a.projectNumber) - projectNumberSortValue(b.projectNumber));
}

function nextProjectNumber() {
  const highest = estimatesList.reduce((max, estimate) => Math.max(max, projectNumberSortValue(estimate.projectNumber)), 0);
  return `P-${String(highest + 1).padStart(6, "0")}`;
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
  const isError = message === "Not found" || message === "No saved projects" || message === "Save failed";
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
}

function setProjectNumber(projectNumber) {
  const assigned = projectNumber || nextProjectNumber();
  els.projectNumber.value = assigned;
  els.projectNumber.textContent = assigned;
  els.projectNumber.title = assigned;
  updateProjectHeader();
}

function clearProjectNumber() {
  els.projectNumber.value = "";
  els.projectNumber.textContent = "";
  els.projectNumber.title = "Assigned when saved";
  updateProjectHeader();
}

function startBlankEstimate() {
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
  clearProjectNumber();
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
      childCalcs.reduce((s, c) => s + c.neededQty, 0),
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
    [els.proposalOverview, "overview"],
    [els.proposalAudience, "audience"],
    [els.proposalDeliverables, "deliverables"],
    [els.proposalValueNarrative, "valueNarrative"],
    [els.proposalNextSteps, "nextSteps"],
    [els.proposalTerms, "terms"]
  ].forEach(([input, key]) => {
    if (input && document.activeElement !== input) input.value = proposal[key] || "";
  });
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
  const modeLabels = {
    package: "Active package rows from the estimate grid",
    detail: "Active product and element rows from the estimate grid",
    type: "Active line items grouped by production type"
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

function renderProposalPreview() {
  if (!els.proposalView) return;
  ensureProposalDefaults();
  els.proposalPreviewTitle.textContent = proposal.title || "Proposal";
  els.proposalPreviewSubtitle.textContent = proposal.subtitle || els.projectName.value || "";
  els.proposalPreviewPreparedFor.textContent = proposal.preparedFor || els.clientName.value || "Client";
  els.proposalPreviewProject.textContent = els.projectName.value || "Untitled Project";
  els.proposalPreviewDate.textContent = els.estimateDate.textContent || new Date().toLocaleDateString();
  els.proposalPreviewOverview.innerHTML = textWithBreaks(proposal.overview);
  els.proposalPreviewAudience.innerHTML = textWithBreaks(proposal.audience);
  els.proposalPreviewDeliverables.innerHTML = textWithBreaks(proposal.deliverables);
  els.proposalPreviewValueNarrative.innerHTML = textWithBreaks(proposal.valueNarrative);
  els.proposalPreviewNextSteps.innerHTML = textWithBreaks(proposal.nextSteps);
  els.proposalPreviewTerms.innerHTML = textWithBreaks(proposal.terms);
  renderProposalPricing();
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

function setActiveView(viewId) {
  activeView = viewId;
  [els.estimateView, els.proposalView, els.servicesView].forEach((view) => {
    if (!view) return;
    const isActive = view.id === viewId;
    view.hidden = !isActive;
    view.classList.toggle("active-view", isActive);
  });
  els.appTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewId));
  if (viewId === "proposalView") renderProposal();
  if (viewId === "servicesView") renderServicesCalculator();
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
  render();
}

function bindInput(input, row, key, numeric = false) {
  input.value = row[key] ?? "";
  input.title = row.description || row.element || row.product || row.packageName || "";
  input.addEventListener("change", () => updateRow(row.id, { [key]: numeric ? asNumber(input.value) : input.value }));
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
    bindInput(fragment.querySelector(".inventory-input"), row, "inventoryQty", true);
    bindInput(fragment.querySelector(".needed-input"), row, "neededQty", true);
    bindInput(fragment.querySelector(".cost-input"), row, "cost", true);
    bindInput(fragment.querySelector(".client-qoh-input"), row, "clientQoh", true);
    bindInput(fragment.querySelector(".markup-input"), row, "markup", true);
    bindInput(fragment.querySelector(".margin-input"), row, "marginAdj", true);
    bindInput(fragment.querySelector(".prior-input"), row, "priorPpp", true);

    if (row.level !== "element" && childrenOf(row).some((child) => child.active)) {
      ["inventory-input", "needed-input", "cost-input", "client-qoh-input", "markup-input", "margin-input", "prior-input"].forEach((className) => {
        const input = fragment.querySelector(`.${className}`);
        input.readOnly = true;
        input.title = "Calculated from nested active rows";
      });
      fragment.querySelector(".inventory-input").value = Math.round(calc.inventoryQty);
      fragment.querySelector(".needed-input").value = Math.round(calc.neededQty);
      fragment.querySelector(".cost-input").value = decimal(calc.cost, 2);
      fragment.querySelector(".client-qoh-input").value = Math.round(calc.clientQoh);
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
    fragment.querySelector(".client-order-qty").textContent = row.level === "package" ? "" : Math.round(calc.qty).toLocaleString();
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

function renderSummary() {
  const totals = totalFor(packageRows().filter((row) => row.active));
  els.clientTotal.textContent = money(totals.client, 0);
  els.costTotal.textContent = money(totals.cost, 0);
  els.marginTotal.textContent = money(totals.margin, 0);
  els.weightedPpp.textContent = money(totals.qty ? totals.client / totals.qty : 0, 3);
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
      renderPayments();
    });
    header.querySelector(".deposit-setting").addEventListener("change", (event) => {
      paymentSettings[type] = {
        ...paymentSettingFor(type),
        depositPct: Math.min(Math.max(asNumber(event.target.value) / 100, 0), 1)
      };
      renderPayments();
    });
    header.querySelector(".count-setting").addEventListener("change", (event) => {
      paymentSettings[type] = {
        ...paymentSettingFor(type),
        paymentCount: Math.min(Math.max(Math.round(asNumber(event.target.value)), 0), 12)
      };
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
    empty.textContent = query ? "No saved projects match that search." : "No saved projects yet.";
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
    setSaveStatus("No saved projects");
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
  els.saveEstimateBtn.disabled = true;
  els.saveEstimateBtn.textContent = "Saving…";
  const projectName = els.projectName.value.trim() || "Untitled Estimate";
  const projectNumber = String(els.projectNumber.value || els.projectNumber.textContent || "").trim() || nextProjectNumber();
  els.projectName.value = projectName;
  setProjectNumber(projectNumber);
  const estimate = {
    projectNumber,
    projectName,
    clientName: els.clientName.value.trim(),
    estimateYear: String(els.estimateYear.value || ""),
    rows: structuredClone(rows),
    lookups: structuredClone(lookups),
    activePackage,
    activeTypes: Array.from(activeTypes),
    expanded: Array.from(expanded),
    paymentDates: structuredClone(paymentDates),
    paymentSettings: structuredClone(paymentSettings),
    proposal: structuredClone(proposal),
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
    if (estimate.clientName) lookups.clients = uniqueValues([...(lookups.clients || []), estimate.clientName]);
    if (estimate.estimateYear) lookups.years = uniqueValues([...(lookups.years || []), estimate.estimateYear]);
    render();
    setSaveStatus(`Saved ${projectNumber}`);
  } catch (err) {
    console.error("Save error:", err);
    setSaveStatus("Save failed");
  } finally {
    els.saveEstimateBtn.disabled = false;
    els.saveEstimateBtn.textContent = "Save";
  }
}

async function loadEstimate(summary) {
  if (!summary) {
    setSaveStatus("Not found");
    return;
  }
  try {
    const key = String(summary.projectNumber || summary.projectName || "").trim();
    if (!key) return;
    const res = await fetch(`/api/estimates/${encodeURIComponent(key)}`);
    if (!res.ok) {
      setSaveStatus("Not found");
      return;
    }
    const estimate = await res.json();
    setProjectNumber(estimate.projectNumber || nextProjectNumber());
    els.projectName.value = estimate.projectName || "";
    els.clientName.value = estimate.clientName || "";
    els.estimateYear.value = estimate.estimateYear || "";
    rows = structuredClone(estimate.rows || seedRows);
    lookups = structuredClone({ ...seedLookups, ...(estimate.lookups || {}) });
    activePackage = estimate.activePackage || "All";
    activeTypes = new Set(estimate.activeTypes || Object.keys(typeLabels));
    expanded = new Set(estimate.expanded || rows.filter((row) => row.level !== "element").map((row) => row.id));
    paymentDates = structuredClone(estimate.paymentDates || {});
    paymentSettings = structuredClone(estimate.paymentSettings || defaultPaymentSettings());
    proposal = { ...defaultProposal(), ...(estimate.proposal || {}) };
    closeLoadEstimateDialog();
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
    setProjectNumber(estimate.projectNumber);
    els.clientName.value = estimate.clientName || els.clientName.value;
    els.estimateYear.value = estimate.estimateYear || els.estimateYear.value;
    renderDatalists();
    renderPrintTypeSubtotals();
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

async function exportCsv() {
  const headers = ["Level", "Active", "Package", "Product / Service", "Element", "SKU", "Description", "Production Type", "Inventory Qty", "Needed Qty", "Qty to Order", "Cost", "Per Piece Cost", "Client QOH", "Client Order Qty", "Markup", "Margin Adj", "Margin Dollars", "Client Price", "PPP", "Prior PPP", "Difference"];
  const lines = [headers];
  visibleRows().forEach((row) => {
    const calc = calculate(row);
    lines.push([row.level, row.active, row.packageName, row.product, row.element, row.sku || "", row.description, row.type, calc.inventoryQty, calc.neededQty, calc.qtyToOrder, calc.cost, calc.perPieceCost, calc.clientQoh, calc.qty, calc.markup, calc.marginAdj, calc.marginDollars, calc.clientPrice, calc.ppp, calc.priorPpp, calc.diff]);
  });

  const csv = lines.map((line) => line.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const filename = `${(els.projectName.value || "estimate").replace(/[^\w-]+/g, "-")}-${els.estimateYear.value || "year"}.csv`;
  try {
    const response = await fetch("/api/export-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, csv: `\uFEFF${csv}` })
    });
    if (!response.ok) throw new Error("Save failed");
    const result = await response.json();
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
  document.body.classList.remove("report-print-costs", "report-print-schedule", "report-print-both");
}

function printReport() {
  const scope = els.pdfScope.value || "both";
  document.body.classList.remove("report-print-costs", "report-print-schedule", "report-print-both");
  document.body.classList.add(`report-print-${scope}`);
  window.print();
}

els.appTabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveView(tab.dataset.view || "estimateView"));
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
      renderServicesCalculator();
    });
  });
  [els.execDialsPerDay, els.execDaysPerWeek, els.execConversationsPerDay, els.execSetsPerWeek, els.execShowRate, els.execWinRate].forEach((input) => {
    input.addEventListener("input", () => {
      updateServiceAppointmentsFromExecution();
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
    renderServicesCalculator();
  });
}
[
  [els.proposalTitle, "title"],
  [els.proposalSubtitle, "subtitle"],
  [els.proposalPreparedFor, "preparedFor"],
  [els.proposalPricingMode, "pricingMode"],
  [els.proposalOverview, "overview"],
  [els.proposalAudience, "audience"],
  [els.proposalDeliverables, "deliverables"],
  [els.proposalValueNarrative, "valueNarrative"],
  [els.proposalNextSteps, "nextSteps"],
  [els.proposalTerms, "terms"]
].forEach(([input, key]) => {
  input.addEventListener("input", () => {
    proposal[key] = input.value;
    renderProposalPreview();
  });
});
els.searchInput.addEventListener("input", render);
els.includeInactive.addEventListener("change", render);
els.tariffRate.addEventListener("change", render);
els.estimateYear.addEventListener("change", render);
els.clientName.addEventListener("input", renderProposalPreview);
els.projectName.addEventListener("change", syncProjectAssociationFromName);
els.projectName.addEventListener("input", () => {
  updateProjectHeader();
  renderProposalPreview();
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
els.saveEstimateBtn.addEventListener("click", saveCurrentEstimate);
els.loadEstimateBtn.addEventListener("click", openLoadEstimateDialog);
els.closeLoadEstimateBtn.addEventListener("click", closeLoadEstimateDialog);
els.loadEstimateSearch.addEventListener("input", renderLoadEstimateList);
els.loadEstimateModal.addEventListener("click", (event) => {
  if (event.target === els.loadEstimateModal) closeLoadEstimateDialog();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.loadEstimateModal.hidden) closeLoadEstimateDialog();
});
els.addPackageBtn.addEventListener("click", addPackage);
els.addProductBtn.addEventListener("click", addProduct);
els.addElementBtn.addEventListener("click", addElement);
els.exportBtn.addEventListener("click", exportCsv);
els.pdfBtn.addEventListener("click", printReport);
window.addEventListener("beforeprint", prepareReportPrint);
window.addEventListener("afterprint", restoreReportPrint);
els.resetBtn.addEventListener("click", async () => {
  els.estimateYear.value = "2026";
  await fetchAndApplySeed();
  rows = structuredClone(seedRows);
  lookups = structuredClone(seedLookups);
  expanded = new Set(seedRows.filter((row) => row.level !== "element").map((row) => row.id));
  activePackage = "All";
  activeTypes = new Set(Object.keys(typeLabels));
  setProjectNumber(nextProjectNumber());
  els.projectName.value = "2026 North Pole Inventory Estimate";
  els.clientName.value = "North Pole Post Office";
  els.estimateYear.value = "2026";
  els.searchInput.value = "";
  els.includeInactive.checked = false;
  els.globalMarkup.value = "0.40";
  els.tariffRate.value = "0.30";
  paymentDates = {};
  paymentSettings = defaultPaymentSettings();
  proposal = defaultProposal();
  render();
});
els.applyMarkupBtn.addEventListener("click", () => {
  const markup = asNumber(els.globalMarkup.value);
  rows = rows.map((row) => (row.active && row.level === "element" ? { ...row, markup } : row));
  render();
});

async function init() {
  const [, clientsRes] = await Promise.all([
    fetchEstimatesList(),
    fetch("/api/clients").then((r) => r.json()).catch(() => []),
    fetchAndApplySeed()
  ]);
  clientsList = Array.isArray(clientsRes) ? clientsRes : [];
  startBlankEstimate();
  els.estimateDate.textContent = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date());
  render();
}

init();
