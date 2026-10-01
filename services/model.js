(function (root, factory) {
  const api = factory(typeof module === "object" && module.exports ? require('./ce-engagement') : root.CeEngagement);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ServiceEngagement = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (CE) {
  const groups = { items: "Item / service", platforms: "Platform", capabilities: "Workflow / capability", teams: "Team / role" };
  const bases = { one_time: "One-time", per_month: "Monthly", per_year: "Annual", per_hour: "Hourly / month", per_run: "Per run / month" };
  const clone = value => JSON.parse(JSON.stringify(value));
  const valid = value => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1e9;
  const amount = value => valid(value) ? value : null;
  const round = value => Math.round((value + Number.EPSILON) * 100) / 100;
  const empty = () => ({ schemaVersion: 1, name: "New engagement", termMonths: 3, markup: 40, products: [], customLines: [], overrides: {}, capacity: {} });
  function restore(value) {
    if (!value || value.schemaVersion !== 1 || !Array.isArray(value.products) || !Array.isArray(value.customLines)) return empty();
    const restored = { ...empty(), ...clone(value) };
    for (const key of ["overrides", "capacity"]) if (!restored[key] || typeof restored[key] !== "object" || Array.isArray(restored[key])) restored[key] = {};
    return restored;
  }
  function variableIssue(v) {
    if (!groups[v.definitionType] || !v.definitionRef || !v.name) return "Missing component identity";
    if (v.pricingModel?.components?.length) return "Composite vendor pricing needs a certified adapter";
    if (!bases[v.rateBasis]) return "Unsupported rate basis";
    if (v.currency !== "USD") return "Only USD costing is supported";
    if (!valid(v.rate) || !valid(v.quantity)) return "Cost or quantity is missing";
    if (v.rateBasis === "per_hour" && !["hour", "minute"].includes(v.unit)) return "Hourly cost needs hour or minute units";
    if (v.rateBasis === "per_year" && v.unit !== "year") return "Annual cost needs year units";
    if (v.estimatorMappingSupported === false) return "Source marks this component unsupported";
    return "";
  }
  function productIssue(product) {
    if (product.catalogStatus !== "reviewed_template") return "Not a reviewed product";
    if (product.sourceValid === false || product.enabledForSelection === false || product.estimatorCompatible === false) return "Unavailable in source catalog";
    if (!product.cascadePaths?.length || product.cascadePaths.some(p => p.productId !== product.localProductServiceId || !p.itemId || !p.platformId || !p.capabilityId || !p.teamId)) return "Incomplete delivery relationships";
    if (!product.templateVariables?.length) return "No component definitions";
    return product.templateVariables.map(variableIssue).find(Boolean) || "";
  }
  function normalizeCatalog(input) {
    if (input?.contractVersion !== "living-ops-estimator-services-v1" || input.messageType !== "catalog_snapshot" || !Array.isArray(input.payload?.products)) throw Error("Choose a Living Ops catalog_snapshot export.");
    if (!input.payload.catalogId || input.payload.products.length > 200) throw Error("Invalid or oversized catalog.");
    const ids = new Set();
    const products = input.payload.products.map(p => {
      if (!p || typeof p.localProductServiceId !== "string" || !p.localProductServiceId || typeof p.name !== "string" || !p.name.trim() || typeof p.catalogStatus !== "string" || ids.has(p.localProductServiceId) || !Array.isArray(p.templateVariables) || p.templateVariables.length > 500 || !Array.isArray(p.cascadePaths) || p.cascadePaths.some(path => !path || typeof path !== "object")) throw Error("Catalog has missing, duplicate, or invalid product definitions.");
      ids.add(p.localProductServiceId);
      const refs = new Set();
      for (const v of p.templateVariables) {
        if (!v || typeof v.definitionRef !== "string" || typeof v.name !== "string" || typeof v.definitionType !== "string") throw Error("Catalog contains an invalid component identity.");
        const key = `${v.definitionType}:${v.definitionRef}`;
        if (refs.has(key)) throw Error("Product contains duplicate component definitions.");
        refs.add(key);
      }
      return { ...clone(p), id: p.localProductServiceId, revision: p.sourceRevision || input.sourceRevision || null };
    });
    return { id: input.payload.catalogId, revision: input.sourceRevision || null, sample: input.sample === true,
      importedAt: new Date().toISOString(), products };
  }
  function addProduct(state, catalog, id) {
    if (CE.isCatalog(state)) throw Error("Create a new Services record for imported products. The CE snapshot is unchanged.");
    const product = catalog.products.find(p => p.id === id);
    if (!product) throw Error("Product is no longer in this catalog.");
    const issue = productIssue(product);
    if (issue) throw Error(issue);
    if (state.products.some(p => p.id === id)) return false;
    state.products.push({ ...clone(product), catalogId: catalog.id, catalogRevision: catalog.revision, catalogSnapshotHash: catalog.snapshotHash || null, sample: catalog.sample });
    return true;
  }
  function signature(v) { return JSON.stringify([v.rate, v.quantity, v.rateBasis, v.unit, v.currency, v.costStatus, v.pricingModel]); }
  function lines(state) {
    const index = new Map();
    const field = { items: "itemId", platforms: "platformId", capabilities: "capabilityId", teams: "teamId" };
    for (const p of state.products) for (const v of p.templateVariables) {
      const key = `${v.definitionType}:${v.definitionRef}`;
      const existing = index.get(key);
      if (existing) {
        existing.productIds.push(p.id);
        existing.paths.push(...p.cascadePaths.filter(path => path[field[v.definitionType]] === v.definitionRef));
        existing.conflict ||= signature(existing) !== signature(v);
      } else index.set(key, { ...clone(v), key, productIds: [p.id], paths: p.cascadePaths.filter(path => path[field[v.definitionType]] === v.definitionRef), conflict: false });
    }
    for (const custom of state.customLines) index.set(custom.key, { ...clone(custom), productIds: [], paths: [], conflict: false });
    const order = Object.keys(groups);
    return [...index.values()].sort((a, b) => order.indexOf(a.definitionType) - order.indexOf(b.definitionType) || a.name.localeCompare(b.name)).map(base => {
      const override = state.overrides[base.key] || {};
      const resolved = { ...base, treatment: base.costStatus === "cancelled" ? "excluded" : base.rate === 0 ? "reference" : "priced", markup: state.markup, costCenter: "Unassigned", ...override };
      resolved.conflict = base.conflict && !override.resolveShared;
      resolved.issue = resolved.conflict ? "Shared product defaults conflict" : variableIssue(resolved);
      resolved.overridden = Object.keys(override).length > 0;
      resolved.calc = calculate(resolved);
      return resolved;
    });
  }
  function calculate(line) {
    const zero = { activationCost: 0, monthlyCost: 0, activationPrice: 0, monthlyPrice: 0, complete: true };
    if (["reference", "excluded"].includes(line.treatment)) return zero;
    if (line.issue || variableIssue(line) || !valid(line.markup) || !["priced", "cost_only"].includes(line.treatment)) return { ...zero, complete: false };
    const cost = line.rate * line.quantity / (line.rateBasis === "per_year" ? 12 : line.rateBasis === "per_hour" && line.unit === "minute" ? 60 : 1);
    const price = line.treatment === "cost_only" ? 0 : cost * (1 + line.markup / 100);
    const oneTime = line.rateBasis === "one_time";
    return { activationCost: oneTime ? round(cost) : 0, monthlyCost: oneTime ? 0 : round(cost), activationPrice: oneTime ? round(price) : 0, monthlyPrice: oneTime ? 0 : round(price), complete: true };
  }
  function totals(state) {
    if (CE.isCatalog(state)) return CE.totals(state);
    const entries = lines(state);
    const sum = entries.reduce((a, l) => { for (const key of ["activationCost", "monthlyCost", "activationPrice", "monthlyPrice"]) a[key] = round(a[key] + l.calc[key]); return a; }, { activationCost: 0, monthlyCost: 0, activationPrice: 0, monthlyPrice: 0 });
    const termValid = Number.isInteger(state.termMonths) && state.termMonths >= 1 && state.termMonths <= 120;
    const term = termValid ? state.termMonths : 0;
    return { ...sum, termMonths: term, initialTermMonths: term, ongoingTermMonths: 1, appointments: 0,
      termPrice: round(sum.activationPrice + sum.monthlyPrice * term), termCost: round(sum.activationCost + sum.monthlyCost * term),
      complete: termValid && entries.every(l => l.calc.complete), issues: [...(termValid ? [] : ["Term must be 1 to 120 whole months"]), ...entries.filter(l => !l.calc.complete).map(l => `${l.name}: ${l.issue || "Invalid markup"}`)],
      count: entries.length, sample: state.products.some(p => p.sample) };
  }
  function outputRows(state) {
    if (CE.isCatalog(state)) return CE.outputRows(state);
    const ledger = lines(state);
    const buckets = state.products.map(p => ({ id: p.id, name: p.name, description: p.description || "", rows: ledger.filter(l => l.productIds.length === 1 && l.productIds[0] === p.id) }));
    const sharedRows = ledger.filter(l => l.productIds.length > 1);
    const sharedProducts = new Set(sharedRows.flatMap(l => l.productIds));
    buckets.push({ id: "shared", name: "Shared delivery services", description: state.products.filter(p => sharedProducts.has(p.id)).map(p => p.name).join(" / "), rows: sharedRows });
    buckets.push({ id: "custom", name: "Additional services", description: "Engagement-specific scope", rows: ledger.filter(l => !l.productIds.length) });
    return buckets.map(b => ({ ...b, calc: b.rows.reduce((sum, line) => { for (const k of ["activationCost", "monthlyCost", "activationPrice", "monthlyPrice"]) sum[k] = round(sum[k] + line.calc[k]); return sum; }, { activationCost: 0, monthlyCost: 0, activationPrice: 0, monthlyPrice: 0 }) })).filter(b => b.calc.activationPrice || b.calc.monthlyPrice);
  }
  function capacity(state) {
    return lines(state).filter(l => l.definitionType === "teams" && l.treatment !== "excluded").map(l => {
      const demand = l.rateBasis === "per_hour" && valid(l.quantity) ? l.quantity / (l.unit === "minute" ? 60 : 1) : null;
      const available = amount(state.capacity[l.key]);
      return { ...l, demand, available, gap: demand !== null && available !== null ? available - demand : null };
    });
  }
  function serviceRows(state) {
    if (CE.isCatalog(state)) return CE.outputRows(state).map(b => ({ id: b.id, level: "element", active: true, item: b.name, platform: b.description, costType: "Services", costCenter: "", engagementCalc: b.calc }));
    return lines(state).filter(l => !["reference", "excluded"].includes(l.treatment)).map(l => ({ id: l.key, level: "element", active: true, item: l.name, platform: groups[l.definitionType], costType: l.definitionType === "platforms" ? "Platforms" : "Services", costCenter: l.costCenter, engagementCalc: l.calc }));
  }
  return { groups, bases, empty, restore, normalizeCatalog, productIssue, addProduct, lines, totals, capacity, outputRows, serviceRows, calculate };
});
