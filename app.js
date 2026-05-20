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

function buildSeedRows() {
  const packageIds = new Map();
  const productIds = new Map();
  const rows = [];
  const packageNames = uniqueValues(sourceProducts.map((row) => row.packageName));

  packageNames.forEach((packageName, index) => {
    const id = uid("package");
    packageIds.set(packageName, id);
    rows.push({
      id,
      level: "package",
      active: true,
      sourceOrder: (index + 1) * 100,
      packageName,
      product: "",
      element: "",
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

  sourceProducts.forEach((source, index) => {
    const parentPackageId = packageIds.get(source.packageName);
    const packageIndex = packageNames.indexOf(source.packageName);
    const productKey = `${source.packageName}::${source.product}`;
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
        description: source.sku ? `SKU ${source.sku}` : source.notes,
        type: source.type,
        qty: 0,
        neededQty: 0,
        inventoryQty: 0,
        clientQoh: 0,
        cost: 0,
        markup: source.markup,
        marginAdj: source.marginAdj,
        priorPpp: 0
      });
    }

    rows.push({
      id: uid("element"),
      level: "element",
      parentId: productId,
      active: true,
      sourceOrder: (packageIndex + 1) * 100 + index + 1.1,
      packageName: source.packageName,
      product: source.product,
      element: source.element || source.product,
      description: source.notes,
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
  });

  return rows;
}

const seedRows = buildSeedRows();
const seedLookups = {
  packages: uniqueValues(seedRows.map((row) => row.packageName)),
  products: uniqueValues(seedRows.map((row) => row.product)),
  elements: uniqueValues(seedRows.map((row) => row.element).filter(Boolean)),
  clients: ["North Pole Post Office", "Portofino", "Santa Direct"],
  years: uniqueValues(["2026", ...sourceProducts.map((row) => row.year)])
};

let rows = structuredClone(seedRows);
let lookups = structuredClone(seedLookups);
let activePackage = "All";
let activeTypes = new Set(Object.keys(typeLabels));
let expanded = new Set(seedRows.filter((row) => row.level !== "element").map((row) => row.id));
let draggedRowId = null;
let paymentDates = {};
let paymentSettings = Object.fromEntries(Object.keys(typeLabels).map((type) => [type, { depositPct: 0.25, paymentCount: 3 }]));
let estimatesList = [];
let clientsList = [];

const els = {
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
  yearLookup: document.querySelector("#yearLookup")
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
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
  els.reportProjectNumber.textContent = els.projectNumber.value || els.projectNumber.textContent || "P-000001";
}

function setProjectNumber(projectNumber) {
  const assigned = projectNumber || nextProjectNumber();
  els.projectNumber.value = assigned;
  els.projectNumber.textContent = assigned;
  els.projectNumber.title = assigned;
  updateProjectHeader();
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
  const perPieceCost = qtyToOrder ? cost / qtyToOrder : 0;
  const markupBase = perPieceCost * qty;
  const priceFromMarkup = markup >= 0.95 ? 0 : markupBase / (1 - markup);
  const clientPrice = marginAdj >= 0.95 ? priceFromMarkup : markupBase / (1 - marginAdj);
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
  const markup = average(childCalcs.map((calc) => calc.markup));
  const marginAdj = average(childCalcs.map((calc) => calc.marginAdj));
  const inventoryQty = minValue(childCalcs.map((calc) => calc.inventoryQty));
  const neededQty = minValue(childCalcs.map((calc) => calc.neededQty));
  const clientQoh = minValue(childCalcs.map((calc) => calc.clientQoh));
  const qtyToOrder = row.level === "product" ? minValue(childCalcs.map((calc) => calc.qtyToOrder)) : 0;
  const qty = row.level === "product" ? minValue(childCalcs.map((calc) => calc.qty)) : 0;

  const totals = childCalcs.reduce(
    (memo, child) => {
      memo.cost += child.cost;
      memo.priorValue += child.priorPpp * child.qty;
      memo.priorQty += child.qty;
      return memo;
    },
    { cost: 0, priorValue: 0, priorQty: 0 }
  );
  const perPieceCost = qtyToOrder ? totals.cost / qtyToOrder : 0;
  const markupBase = perPieceCost * qty;
  const standardPrice = markup >= 0.95 ? 0 : markupBase / (1 - markup);
  const clientPrice = marginAdj >= 0.95 ? standardPrice : markupBase / (1 - marginAdj);
  const marginDollars = clientPrice - totals.cost;
  const ppp = qty > 0 ? clientPrice / qty : 0;
  const priorPpp = totals.priorQty > 0 ? totals.priorValue / totals.priorQty : asNumber(row.priorPpp);

  return {
    qty,
    neededQty,
    inventoryQty,
    qtyToOrder,
    clientQoh,
    cost: totals.cost,
    perPieceCost,
    markup,
    marginAdj,
    priceFromMarkup: standardPrice,
    clientPrice,
    ppp,
    costPpp: qty > 0 ? totals.cost / qty : 0,
    priorPpp,
    diff: ppp - priorPpp,
    marginDollars,
    marginPct: clientPrice ? marginDollars / clientPrice : 0,
    standardPrice
  };
}

function calculate(row) {
  return row.level === "element" ? baseCalculate(row) : rollupCalculate(row);
}

function rowMatchesQuery(row, query) {
  if (!query) return true;
  const haystack = [row.packageName, row.product, row.element, row.description, row.type, typeLabels[row.type]].join(" ").toLowerCase();
  return haystack.includes(query) || descendantsOf(row).some((child) => rowMatchesQuery(child, query));
}

function rowMatchesType(row) {
  if (row.level === "element") return activeTypes.has(row.type);
  const descendants = descendantsOf(row).filter((child) => child.level === "element");
  return descendants.length ? descendants.some((child) => activeTypes.has(child.type)) : activeTypes.has(row.type);
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

function setupNameInput(input, row) {
  const key = nameKeyFor(row);
  input.setAttribute("list", row.level === "package" ? "packageLookup" : row.level === "product" ? "productLookup" : "elementLookup");
  bindInput(input, row, key);
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
    fragment.querySelector(".ppp").textContent = money(calc.ppp, 2);

    const diff = fragment.querySelector(".diff");
    diff.textContent = money(calc.diff, 2);
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
  els.footerInventoryQty.textContent = Math.round(totals.inventoryQty).toLocaleString();
  els.footerNeededQty.textContent = Math.round(totals.neededQty).toLocaleString();
  els.footerQtyToOrder.textContent = Math.round(totals.qtyToOrder).toLocaleString();
  els.footerClientQoh.textContent = Math.round(totals.clientQoh).toLocaleString();
  els.footerQty.textContent = Math.round(totals.qty).toLocaleString();
  els.footerCost.textContent = money(totals.cost, 2);
  els.footerPerPieceCost.textContent = money(totals.qtyToOrder ? totals.perPieceCostValue / totals.qtyToOrder : 0, 2);
  els.footerStdMarkup.textContent = money(totals.standardPrice, 2);
  els.footerMargin.textContent = money(totals.margin, 2);
  els.footerClient.textContent = money(totals.client, 2);
  els.footerPpp.textContent = money(totals.qty ? totals.client / totals.qty : 0, 2);
  els.footerDiff.textContent = money(totals.qty ? totals.diffValue / totals.qty : 0, 2);
}

function renderPrintTypeSubtotals() {
  const totals = activeElementsForVisiblePackages()
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
  return activeElementsForVisiblePackages()
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
  Object.entries(totalsByType).forEach(([type, total]) => {
    if (!total) return;
    const settings = paymentSettings[type] || { depositPct: 0.25, paymentCount: 3 };
    const depositPct = Math.min(Math.max(asNumber(settings.depositPct), 0), 1);
    const paymentCount = Math.max(Math.round(asNumber(settings.paymentCount)), 1);
    const header = document.createElement("div");
    header.className = "payment-type-heading";
    header.innerHTML = `
      <strong>${type} - ${typeLabels[type]} Total</strong>
      <label class="payment-header-control internal-col">Deposit % <input class="deposit-setting" type="number" min="0" max="100" step="5" value="${decimal(depositPct * 100, 0)}" /></label>
      <label class="payment-header-control internal-col">Balance <input class="count-setting" type="number" min="1" max="12" step="1" value="${paymentCount}" /></label>
      <span>${money(total, 0)}</span>
    `;
    header.querySelector(".deposit-setting").addEventListener("change", (event) => {
      paymentSettings[type] = {
        ...paymentSettings[type],
        depositPct: Math.min(Math.max(asNumber(event.target.value) / 100, 0), 1)
      };
      renderPayments();
    });
    header.querySelector(".count-setting").addEventListener("change", (event) => {
      paymentSettings[type] = {
        ...paymentSettings[type],
        paymentCount: Math.max(Math.round(asNumber(event.target.value)), 1)
      };
      renderPayments();
    });
    els.paymentSchedule.append(header);
    const entries = [["Deposit", total * depositPct, `${decimal(depositPct * 100, 0)}%`], ...Array.from({ length: paymentCount }, (_, index) => [`Balance ${index + 1}`, ((1 - depositPct) * total) / paymentCount, `${decimal((1 - depositPct) * 100 / paymentCount, 1)}%`])];
    entries.forEach(([label, amount, note], index) => {
      const key = `${type}-${index}`;
      const row = document.createElement("label");
      row.className = "payment-row";
      row.innerHTML = `
        <span><strong>${label}</strong><small>${note}</small></span>
        <input type="date" value="${paymentDates[key] || ""}" aria-label="${type} ${label} date" />
        <strong>${money(amount, 2)}</strong>
      `;
      row.querySelector("input").addEventListener("change", (event) => {
        paymentDates[key] = event.target.value;
      });
      els.paymentSchedule.append(row);
    });
  });
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
    paymentSettings = structuredClone(estimate.paymentSettings || Object.fromEntries(Object.keys(typeLabels).map((type) => [type, { depositPct: 0.25, paymentCount: 3 }])));
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

function exportCsv() {
  const headers = ["Level", "Active", "Package", "Product / Service", "Element", "Description", "Production Type", "Inventory Qty", "Needed Qty", "Qty to Order", "Cost", "Per Piece Cost", "Client QOH", "Client Order Qty", "Markup", "Margin Adj", "Margin Dollars", "Client Price", "PPP", "Prior PPP", "Difference"];
  const lines = [headers];
  visibleRows().forEach((row) => {
    const calc = calculate(row);
    lines.push([row.level, row.active, row.packageName, row.product, row.element, row.description, row.type, calc.inventoryQty, calc.neededQty, calc.qtyToOrder, calc.cost, calc.perPieceCost, calc.clientQoh, calc.qty, calc.markup, calc.marginAdj, calc.marginDollars, calc.clientPrice, calc.ppp, calc.priorPpp, calc.diff]);
  });

  const csv = lines.map((line) => line.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${els.projectName.value || "estimate"}-${els.estimateYear.value || "year"}.csv`;
  link.click();
  URL.revokeObjectURL(url);
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

els.searchInput.addEventListener("input", render);
els.includeInactive.addEventListener("change", render);
els.tariffRate.addEventListener("change", render);
els.estimateYear.addEventListener("change", render);
els.projectName.addEventListener("change", syncProjectAssociationFromName);
els.projectName.addEventListener("input", updateProjectHeader);
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
els.pdfBtn.addEventListener("click", () => window.print());
els.resetBtn.addEventListener("click", () => {
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
  paymentSettings = Object.fromEntries(Object.keys(typeLabels).map((type) => [type, { depositPct: 0.25, paymentCount: 3 }]));
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
    fetch("/api/clients").then((r) => r.json()).catch(() => [])
  ]);
  clientsList = Array.isArray(clientsRes) ? clientsRes : [];
  setProjectNumber(nextProjectNumber());
  els.estimateDate.textContent = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date());
  render();
}

init();
