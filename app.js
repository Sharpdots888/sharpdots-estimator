const typeLabels = {
  M: "Materials",
  VF: "Variable Fulfillment",
  FP: "Fixed Print",
  MP: "Manufactured Product"
};

const metricStyles = {
  cost: { label: "Cost", color: "#428bca" },
  marginPct: { label: "Margin %", color: "#b84048" },
  client: { label: "Client Price", color: "#fe7300" }
};

const sourceProducts = [
  { product: "2025 Letter Materials (stock, envelope, stickers)", type: "M", packageName: "Letter", notes: "4 Page + Envelope", qty: 41073, cost: 30969.47, markup: 0.4, marginAdj: 0.31, priorPpp: 1.0891176471 },
  { product: "Letters by Santa (2025) Print and Fulfillment", type: "VF", packageName: "Letter", notes: "4 Page + Envelope", qty: 63486, cost: 79651.11, markup: 0.4, marginAdj: 0.1, priorPpp: 1.3206576833 },
  { product: "Ornament", type: "FP", packageName: "Letter", notes: "eflute cardboard cutout 5x3", qty: 41073, cost: 3577.4, markup: 0.4, marginAdj: 0.55, priorPpp: 0.2237793852 },
  { product: "Multi Letter Labeled Envelopes", type: "FP", packageName: "Multi", notes: "", qty: 9272, cost: 7554.71, markup: 0.4, marginAdj: 0.33, priorPpp: 1.3779630535 },
  { product: "Shipping software and fulfillment overhead", type: "VF", packageName: "Letter", notes: "Labor, insurance, utility, rent", qty: 63486, cost: 9522.9, markup: 0.4, marginAdj: 0, priorPpp: 0 },
  { product: "Carton Eflute 11x5x4 + kitting", type: "FP", packageName: "Gold", notes: "", qty: 7785, cost: 6855.74, markup: 0.4, marginAdj: 0.53, priorPpp: 1.8214916985 },
  { product: "Door Hangers", type: "FP", packageName: "Gold", notes: "4.25x11, 4/4, die cut, 14pt.", qty: 7785, cost: 1318.7, markup: 0.4, marginAdj: 0.2, priorPpp: 0.1726793372 },
  { product: "Window Sticker 5\"", type: "MP", packageName: "Gold", notes: "5x5 clear, 4/0", qty: 7785, cost: 1373.59, markup: 0.4, marginAdj: 0.73, priorPpp: 0.4809772727 },
  { product: "Magnet 5\"", type: "MP", packageName: "Gold", notes: "5x5 magnet, 4/0", qty: 7785, cost: 1928.89, markup: 0.4, marginAdj: 0.4, priorPpp: 0.309879798 },
  { product: "Fake Snow (incl label)", type: "MP", packageName: "Gold", notes: "Custom Label + Polybag inserted (10g)", qty: 7785, cost: 4515.3, markup: 0.4, marginAdj: 0.5, priorPpp: 0.8989577778 },
  { product: "Reindeer food", type: "MP", packageName: "Gold", notes: "Stand up Pouch, Kraft, CMYK+white", qty: 10000, cost: 10048.95, markup: 0.4, marginAdj: 0.35, priorPpp: 1.4527268519 },
  { product: "Reindeer food pouch", type: "MP", packageName: "Gold", notes: "Pouch component", qty: 10000, cost: 1622.95, markup: 0.4, marginAdj: 0.45, priorPpp: 0.1333 },
  { product: "Fulfillment", type: "VF", packageName: "Gold", notes: "", qty: 15993, cost: 19900.22, markup: 0.4, marginAdj: -0.39, priorPpp: 0.8844131483 },
  { product: "Shipping software and fulfillment overhead", type: "VF", packageName: "Gold", notes: "Labor, insurance, utility, rent", qty: 15993, cost: 2398.95, markup: 0.4, marginAdj: 0, priorPpp: 0 },
  { product: "Carton Eflute 10x10x6 + kitting", type: "FP", packageName: "Eve", notes: "Sizes to be confirmed with final products", qty: 2221, cost: 5882.71, markup: 0.4, marginAdj: 0.1, priorPpp: 2.5079627365 },
  { product: "Bell (7000 qty)", type: "MP", packageName: "Eve", notes: "Ribbon supplied and tied", qty: 2221, cost: 310.94, markup: 0.4, marginAdj: 0.4, priorPpp: 0.1833333333 },
  { product: "Plate 9\"", type: "MP", packageName: "Eve", notes: "111g, design supplied", qty: 2221, cost: 3598.02, markup: 0.4, marginAdj: 0.24, priorPpp: 1.5875 },
  { product: "Mug 4\"d x 4\"", type: "MP", packageName: "Eve", notes: "125g, design supplied", qty: 2221, cost: 5019.46, markup: 0.4, marginAdj: 0.25, priorPpp: 2.275 },
  { product: "Fulfillment", type: "VF", packageName: "Eve", notes: "", qty: 5455, cost: 5814.59, markup: 0.4, marginAdj: 0.485, priorPpp: 2.0583531928 },
  { product: "Shipping software and fulfillment overhead", type: "VF", packageName: "Eve", notes: "Labor, insurance, utility, rent", qty: 5455, cost: 818.25, markup: 0.4, marginAdj: 0, priorPpp: 0 }
];

function uid(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function uniqueValues(values) {
  return Array.from(new Set(values.map((value) => String(value || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function buildSeedRows() {
  const packageIds = new Map();
  const rows = [];

  uniqueValues(sourceProducts.map((row) => row.packageName)).forEach((packageName, index) => {
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
      cost: 0,
      markup: 0.4,
      marginAdj: 0.4,
      priorPpp: 0
    });
  });

  sourceProducts.forEach((source, index) => {
    const productId = uid("product");
    const parentPackageId = packageIds.get(source.packageName);
    rows.push({
      id: productId,
      level: "product",
      parentId: parentPackageId,
      active: true,
      sourceOrder: (Array.from(packageIds.keys()).indexOf(source.packageName) + 1) * 100 + index + 1,
      packageName: source.packageName,
      product: source.product,
      element: "",
      description: source.notes,
      type: source.type,
      qty: source.qty,
      cost: source.cost,
      markup: source.markup,
      marginAdj: source.marginAdj,
      priorPpp: source.priorPpp
    });

    rows.push({
      id: uid("element"),
      level: "element",
      parentId: productId,
      active: true,
      sourceOrder: (Array.from(packageIds.keys()).indexOf(source.packageName) + 1) * 100 + index + 1.1,
      packageName: source.packageName,
      product: source.product,
      element: source.notes || `${source.product} base cost`,
      description: source.notes,
      type: source.type,
      qty: source.qty,
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
  elements: uniqueValues(seedRows.map((row) => row.element).filter(Boolean))
};

let rows = structuredClone(seedRows);
let lookups = structuredClone(seedLookups);
let activePackage = "All";
let activeTypes = new Set(Object.keys(typeLabels));
let expanded = new Set(seedRows.filter((row) => row.level !== "element").map((row) => row.id));

const els = {
  projectName: document.querySelector("#projectName"),
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
  resetBtn: document.querySelector("#resetBtn"),
  exportBtn: document.querySelector("#exportBtn"),
  pdfBtn: document.querySelector("#pdfBtn"),
  clientTotal: document.querySelector("#clientTotal"),
  costTotal: document.querySelector("#costTotal"),
  marginTotal: document.querySelector("#marginTotal"),
  weightedPpp: document.querySelector("#weightedPpp"),
  visibleCount: document.querySelector("#visibleCount"),
  packageRollup: document.querySelector("#packageRollup"),
  depositPct: document.querySelector("#depositPct"),
  paymentCount: document.querySelector("#paymentCount"),
  paymentSchedule: document.querySelector("#paymentSchedule"),
  footerQty: document.querySelector("#footerQty"),
  footerCost: document.querySelector("#footerCost"),
  footerMargin: document.querySelector("#footerMargin"),
  footerClient: document.querySelector("#footerClient"),
  footerPpp: document.querySelector("#footerPpp"),
  footerDiff: document.querySelector("#footerDiff"),
  trackingLevel: document.querySelector("#trackingLevel"),
  yearTracking: document.querySelector("#yearTracking"),
  lookupTable: document.querySelector("#lookupTable"),
  lookupValue: document.querySelector("#lookupValue"),
  saveLookupBtn: document.querySelector("#saveLookupBtn"),
  lookupList: document.querySelector("#lookupList"),
  packageLookup: document.querySelector("#packageLookup"),
  productLookup: document.querySelector("#productLookup"),
  elementLookup: document.querySelector("#elementLookup")
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

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
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
  const qty = Math.max(asNumber(row.qty), 0);
  const cost = Math.max(asNumber(row.cost), 0);
  const markup = Math.min(Math.max(asNumber(row.markup), 0), 0.95);
  const marginAdj = Math.min(Math.max(asNumber(row.marginAdj), -0.95), 0.95);
  const priceFromMarkup = markup >= 0.95 ? 0 : cost / (1 - markup);
  const clientPrice = marginAdj >= 0.95 ? priceFromMarkup : cost / (1 - marginAdj);
  const ppp = qty > 0 ? clientPrice / qty : 0;
  const priorPpp = asNumber(row.priorPpp);

  return {
    qty,
    cost,
    priceFromMarkup,
    clientPrice,
    ppp,
    costPpp: qty > 0 ? cost / qty : 0,
    priorPpp,
    diff: ppp - priorPpp,
    marginDollars: clientPrice - cost,
    marginPct: clientPrice ? (clientPrice - cost) / clientPrice : 0
  };
}

function rollupCalculate(row) {
  const childRows = childrenOf(row).filter((child) => child.active);
  if (!childRows.length) return baseCalculate(row);

  const totals = childRows.reduce(
    (memo, child) => {
      const calc = calculate(child);
      memo.qty = Math.max(memo.qty, calc.qty);
      memo.cost += calc.cost;
      memo.clientPrice += calc.clientPrice;
      memo.marginDollars += calc.marginDollars;
      memo.priorValue += calc.priorPpp * calc.qty;
      memo.priorQty += calc.qty;
      return memo;
    },
    { qty: 0, cost: 0, clientPrice: 0, marginDollars: 0, priorValue: 0, priorQty: 0 }
  );
  const ppp = totals.qty > 0 ? totals.clientPrice / totals.qty : 0;
  const priorPpp = totals.priorQty > 0 ? totals.priorValue / totals.priorQty : asNumber(row.priorPpp);

  return {
    qty: totals.qty,
    cost: totals.cost,
    priceFromMarkup: totals.clientPrice,
    clientPrice: totals.clientPrice,
    ppp,
    costPpp: totals.qty > 0 ? totals.cost / totals.qty : 0,
    priorPpp,
    diff: ppp - priorPpp,
    marginDollars: totals.marginDollars,
    marginPct: totals.clientPrice ? totals.marginDollars / totals.clientPrice : 0
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
      memo.cost += calc.cost;
      memo.client += calc.clientPrice;
      memo.margin += calc.marginDollars;
      memo.diffValue += calc.diff * calc.qty;
      return memo;
    },
    { cost: 0, client: 0, margin: 0, qty: 0, diffValue: 0 }
  );
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
  [
    [els.packageLookup, lookups.packages],
    [els.productLookup, lookups.products],
    [els.elementLookup, lookups.elements]
  ].forEach(([list, values]) => {
    list.innerHTML = "";
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      list.append(option);
    });
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
    tr.dataset.level = row.level;

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
    bindInput(fragment.querySelector(".qty-input"), row, "qty", true);
    bindInput(fragment.querySelector(".cost-input"), row, "cost", true);
    bindInput(fragment.querySelector(".markup-input"), row, "markup", true);
    bindInput(fragment.querySelector(".margin-input"), row, "marginAdj", true);
    bindInput(fragment.querySelector(".prior-input"), row, "priorPpp", true);

    if (row.level !== "element" && childrenOf(row).some((child) => child.active)) {
      ["qty-input", "cost-input", "markup-input", "margin-input", "prior-input"].forEach((className) => {
        const input = fragment.querySelector(`.${className}`);
        input.readOnly = true;
        input.title = "Calculated from nested active rows";
      });
    }

    if (row.level === "package") {
      const typeInput = fragment.querySelector(".type-input");
      typeInput.value = "";
      typeInput.disabled = true;
    }

    fragment.querySelector(".margin-dollars").textContent = money(calc.marginDollars, 0);
    fragment.querySelector(".client-price").textContent = money(calc.clientPrice, 0);
    fragment.querySelector(".ppp").textContent = money(calc.ppp, 3);

    const diff = fragment.querySelector(".diff");
    diff.textContent = money(calc.diff, 3);
    diff.classList.toggle("negative", calc.diff < 0);
    diff.classList.toggle("positive", calc.diff > 0);

    fragment.querySelector(".remove-row-btn").addEventListener("click", () => {
      const removeIds = new Set([row.id, ...descendantsOf(row).map((desc) => desc.id)]);
      rows = rows.filter((candidate) => !removeIds.has(candidate.id));
      render();
    });

    els.lineItems.append(fragment);
  });

  const packageCount = visiblePackageRows().length;
  els.visibleCount.textContent = `${packageCount} active package row${packageCount === 1 ? "" : "s"} shown`;
  renderFooter(visiblePackageRows());
}

function renderFooter(sourceRows) {
  const totals = totalFor(sourceRows);
  els.footerQty.textContent = Math.round(totals.qty).toLocaleString();
  els.footerCost.textContent = money(totals.cost, 0);
  els.footerMargin.textContent = money(totals.margin, 0);
  els.footerClient.textContent = money(totals.client, 0);
  els.footerPpp.textContent = money(totals.qty ? totals.client / totals.qty : 0, 3);
  els.footerDiff.textContent = money(totals.qty ? totals.diffValue / totals.qty : 0, 3);
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
  if (level === "package") return packageRows().filter((row) => row.active);
  return rows.filter((row) => row.level === level && row.active && rowPassesBaseFilters(row));
}

function renderTracking() {
  const selectedMetrics = Array.from(document.querySelectorAll(".metric-filter:checked")).map((input) => input.value);
  const currentYear = Math.max(asNumber(els.estimateYear.value), 2025);
  const years = [currentYear - 2, currentYear - 1, currentYear];
  const candidates = trackingRows();
  const series = selectedMetrics.map((metric) => ({
    metric,
    ...metricStyles[metric],
    values: years.map((year) => {
      const aggregate = candidates.reduce(
        (memo, row) => {
          const calc = historicalCalc(row, year);
          memo.cost += calc.cost;
          memo.client += calc.client;
          memo.margin += calc.margin;
          return memo;
        },
        { cost: 0, client: 0, margin: 0 }
      );
      if (metric === "cost") return aggregate.cost;
      if (metric === "client") return aggregate.client;
      return aggregate.client ? aggregate.margin / aggregate.client : 0;
    })
  }));
  const width = 720;
  const height = 260;
  const pad = { top: 28, right: 28, bottom: 42, left: 58 };
  const xFor = (index) => pad.left + (index * (width - pad.left - pad.right)) / (years.length - 1 || 1);

  const lines = series
    .map((item) => {
      const localMin = Math.min(...item.values);
      const localMax = Math.max(...item.values);
      const localRange = localMax - localMin || 1;
      const yFor = (value) => height - pad.bottom - ((value - localMin) / localRange) * (height - pad.top - pad.bottom);
      const points = item.values.map((value, index) => `${xFor(index)},${yFor(value)}`).join(" ");
      const labels = item.values
        .map((value, index) => {
          const display = item.metric === "marginPct" ? `${decimal(value * 100, 1)}%` : money(value, 0);
          return `<text x="${xFor(index)}" y="${yFor(value) - 8}" text-anchor="middle" fill="${item.color}">${display}</text>`;
        })
        .join("");
      return `<polyline points="${points}" fill="none" stroke="${item.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />${item.values
        .map((value, index) => `<circle cx="${xFor(index)}" cy="${yFor(value)}" r="4" fill="${item.color}" />`)
        .join("")}${labels}`;
    })
    .join("");

  els.yearTracking.innerHTML = `
    <div class="chart-legend">
      ${series.map((item) => `<span><i style="background:${item.color}"></i>${item.label}</span>`).join("")}
    </div>
    <svg class="line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Year tracking line chart">
      <line x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="#d9d9d9" />
      <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}" stroke="#d9d9d9" />
      ${years.map((year, index) => `<text x="${xFor(index)}" y="${height - 14}" text-anchor="middle">${year}</text>`).join("")}
      ${lines}
    </svg>
    <p class="chart-note">${candidates.length} active ${els.trackingLevel.value} row${candidates.length === 1 ? "" : "s"} included.</p>
  `;
}

function renderPayments() {
  const total = totalFor(packageRows().filter((row) => row.active)).client;
  const depositPct = Math.min(Math.max(asNumber(els.depositPct.value), 0), 1);
  const paymentCount = Math.max(Math.round(asNumber(els.paymentCount.value)), 1);
  const deposit = total * depositPct;
  const payment = (total - deposit) / paymentCount;

  els.paymentSchedule.innerHTML = "";
  [["Deposit", deposit, `${decimal(depositPct * 100, 0)}%`], ...Array.from({ length: paymentCount }, (_, index) => [`Balance ${index + 1}`, payment, `${decimal((1 - depositPct) * 100 / paymentCount, 1)}%`])].forEach(([label, amount, note]) => {
    const row = document.createElement("div");
    row.className = "rollup-row";
    row.innerHTML = `<div><strong>${label}</strong><small>${note}</small></div><span>${money(amount, 2)}</span><span></span>`;
    els.paymentSchedule.append(row);
  });
}

function renderLookupList() {
  const tableName = els.lookupTable.value;
  els.lookupList.innerHTML = "";
  lookups[tableName].forEach((value) => {
    const row = document.createElement("div");
    row.className = "lookup-row";
    row.innerHTML = `<span>${value}</span><button class="ghost-btn" type="button">Remove</button>`;
    row.querySelector("button").addEventListener("click", () => {
      lookups[tableName] = lookups[tableName].filter((candidate) => candidate !== value);
      render();
    });
    row.querySelector("span").addEventListener("click", () => {
      els.lookupValue.value = value;
      els.lookupValue.dataset.editing = value;
    });
    els.lookupList.append(row);
  });
}

function render() {
  renderDatalists();
  renderFilters();
  renderRows();
  renderSummary();
  renderRollup();
  renderTracking();
  renderPayments();
  renderLookupList();
}

function addPackage() {
  const packageName = "New Package";
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
  const headers = ["Level", "Active", "Package", "Product / Service", "Element", "Description", "Production Type", "Order Qty", "Cost", "Markup", "Margin Adj", "Margin Dollars", "Client Price", "PPP", "2024 PPP", "Difference"];
  const lines = [headers];
  visibleRows().forEach((row) => {
    const calc = calculate(row);
    lines.push([row.level, row.active, row.packageName, row.product, row.element, row.description, row.type, calc.qty, calc.cost, row.markup, row.marginAdj, calc.marginDollars, calc.clientPrice, calc.ppp, calc.priorPpp, calc.diff]);
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

  lookups[tableName] = uniqueValues(lookups[tableName].map((candidate) => (candidate === editing ? value : candidate)).concat(value));
  if (editing && editing !== value) {
    rows = rows.map((row) => ({
      ...row,
      packageName: tableName === "packages" && row.packageName === editing ? value : row.packageName,
      product: tableName === "products" && row.product === editing ? value : row.product,
      element: tableName === "elements" && row.element === editing ? value : row.element
    }));
  }
  els.lookupValue.value = "";
  delete els.lookupValue.dataset.editing;
  render();
}

els.searchInput.addEventListener("input", render);
els.includeInactive.addEventListener("change", render);
els.tariffRate.addEventListener("change", render);
els.depositPct.addEventListener("change", render);
els.paymentCount.addEventListener("change", render);
els.estimateYear.addEventListener("change", render);
els.trackingLevel.addEventListener("change", render);
document.querySelectorAll(".metric-filter").forEach((input) => input.addEventListener("change", render));
els.lookupTable.addEventListener("change", () => {
  els.lookupValue.value = "";
  delete els.lookupValue.dataset.editing;
  renderLookupList();
});
els.saveLookupBtn.addEventListener("click", saveLookup);
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
  els.projectName.value = "2025 Cost Estimator";
  els.clientName.value = "";
  els.estimateYear.value = "2025";
  els.searchInput.value = "";
  els.includeInactive.checked = false;
  els.globalMarkup.value = "0.40";
  els.tariffRate.value = "0.30";
  els.depositPct.value = "0.25";
  els.paymentCount.value = "3";
  render();
});
els.applyMarkupBtn.addEventListener("click", () => {
  const markup = asNumber(els.globalMarkup.value);
  rows = rows.map((row) => (row.active && row.level === "element" ? { ...row, markup } : row));
  render();
});

render();
