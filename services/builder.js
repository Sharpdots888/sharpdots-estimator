(() => {
  const M = window.ServiceEngagement;
  const $ = (s, root = document) => root.querySelector(s);
  const esc = escapeHtml;
  const currency = n => money(n, 2);
  const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const button = (action, label, glyph, attrs = "") => `<button type="button" data-service-action="${action}" ${attrs}>${icon(glyph)}${label ? `<span>${label}</span>` : ""}</button>`;
  const number = value => value === "" ? null : Number(value);
  const opts = (entries, value) => Object.entries(entries).map(([k, label]) => `<option value="${esc(k)}" ${k === value ? "selected" : ""}>${esc(label)}</option>`).join("");
  const input = (label, name, value, type = "text", attrs = "") => `<label>${label}<input name="${name}" type="${type}" value="${esc(value ?? "")}" ${attrs}></label>`;
  let view = "products", group = "all", notice = "", catalog;
  const catalogKey = "sharpdots-living-ops-catalog-v1";
  try {
    const saved = JSON.parse(localStorage.getItem(catalogKey));
    catalog = M.normalizeCatalog(saved.packet || saved);
    catalog.snapshotHash = saved.snapshotHash || null;
  } catch { catalog = null; }
  const host = $("#servicesView");
  const modebar = document.createElement("div");
  modebar.className = "eng-modebar";
  const scenarioLabel = $("#serviceScenario").closest("label");
  scenarioLabel.childNodes[0].textContent = "Service model";
  modebar.append(scenarioLabel);
  modebar.insertAdjacentHTML("beforeend", `<span>USD</span>`);
  $(".tab-record-controls", host).after(modebar);
  const root = document.createElement("section");
  root.id = "serviceEngagementBuilder";
  root.className = "eng-builder";
  modebar.after(root);
  const dialog = document.createElement("dialog");
  dialog.className = "eng-dialog";
  document.body.append(dialog);

  function changed() {
    markWorkspaceRecordDirty("services");
    renderTabRecordControls();
    renderTabRecordIndicators();
    renderProposal();
    renderBuilder();
  }
  function modal(title, html) {
    dialog.innerHTML = `<header><h2 id="engDialogTitle">${title}</h2>${button("close", "", "x", 'aria-label="Close" title="Close"')}</header>${html}`;
    dialog.setAttribute("aria-labelledby", "engDialogTitle");
    if (!dialog.open) dialog.showModal();
    window.lucide?.createIcons();
  }
  function catalogStatus() { return !catalog ? "No catalog imported" : catalog.sample ? "Example catalog · Synthetic rates" : `${catalog.products.length} products · Imported catalog`; }
  function productsPanel() {
    const output = M.outputRows(serviceEngagement);
    const lines = M.lines(serviceEngagement);
    return `<div class="eng-section-head"><h3>Engagement products <small>${serviceEngagement.products.length}</small></h3>${button("catalog", "Add product", "plus")}</div>
      ${serviceEngagement.products.length ? `<div class="eng-product-list">${serviceEngagement.products.map(p => {
        const own = output.find(b => b.id === p.id)?.calc;
        const refs = lines.filter(l => l.productIds.includes(p.id));
        const price = !own && refs.some(l => l.productIds.length > 1) ? '<strong>Shared pricing</strong><small>Included in shared services</small>' : `<strong>${currency(own?.monthlyPrice || 0)}<small> / month</small></strong><small>${currency(own?.activationPrice || 0)} one-time</small>`;
        return `<article class="eng-product"><div><span class="eng-eyebrow">${p.sample ? "EXAMPLE" : "LIVING OPS"}</span><h3>${esc(p.name)}</h3><p>${esc(p.description || "")}</p><small>${refs.length} components · ${refs.filter(l => l.productIds.length > 1).length} shared · Revision ${esc(p.revision || "unversioned")}</small></div><div class="eng-product-price">${price}</div><div class="eng-inline-actions">${button("inspect-product", "", "list-tree", `data-id="${esc(p.id)}" title="Inspect product components" aria-label="Inspect ${esc(p.name)} components"`)}${button("remove-product", "", "trash-2", `data-id="${esc(p.id)}" title="Remove product" aria-label="Remove ${esc(p.name)}"`)}</div></article>`;
      }).join("")}</div>` : `<div class="eng-empty">${icon("package")}<h3>No products selected</h3>${button("catalog", "Browse products", "plus")}</div>`}
      ${output.filter(b => ["shared", "custom"].includes(b.id)).map(b => `<div class="eng-shared"><strong>${b.name}</strong><span>${b.rows.length} components</span><b>${currency(b.calc.activationPrice)} one-time · ${currency(b.calc.monthlyPrice)} / month</b></div>`).join("")}
      <div class="eng-source-footer"><span>${esc(catalogStatus())}</span><div>${button("import", "Import catalog", "upload")}${button("example", "View example catalog", "flask-conical")}</div></div>`;
  }
  function lineDialog(key) {
    const line = M.lines(serviceEngagement).find(l => l.key === key);
    if (!line) return;
    const productNames = line.productIds.map(id => serviceEngagement.products.find(p => p.id === id)?.name || id);
    const refs = new Map(serviceEngagement.products.flatMap(p => p.templateVariables.map(v => [v.definitionRef, v.name])));
    modal("Component costing", `<form id="engLineForm" data-key="${esc(key)}"><div class="eng-dialog-body">
      <div class="eng-dialog-intro"><h3>${esc(line.name)}</h3><p>${esc(productNames.join(" · ") || "Engagement-specific line")}</p></div>
      ${line.issue ? `<p class="eng-warning">${esc(line.issue)}</p>` : ""}
      <div class="eng-form-grid">${!line.productIds.length ? input("Item name", "name", line.name, "text", "required maxlength=150") : ""}
      <label>Cost treatment<select name="treatment">${opts({ priced: "Cost + markup", cost_only: "Cost only (no extra charge)", reference: "Reference only", excluded: "Excluded" }, line.treatment)}</select></label>
      ${input("Quantity", "quantity", line.quantity, "number", 'min="0" step="any" required')}
      ${input("Unit cost ($)", "rate", line.rate, "number", 'min="0" step="any" required')}
      <label>Rate basis<select name="rateBasis">${opts(M.bases, line.rateBasis)}</select></label>
      ${input("Unit", "unit", line.unit, "text", "required")}${input("Markup (%)", "markup", line.markup, "number", 'min="0" step="any" required')}
      ${input("Cost center", "costCenter", line.costCenter)}</div>
      ${line.conflict ? '<label class="eng-check"><input type="checkbox" name="resolveShared" required> Use these quantities and rates once across the selected products</label>' : ""}
      ${line.paths.length ? `<details class="eng-lineage"><summary>Living Ops relationships</summary>${line.paths.map(p => `<p>${[p.itemId, p.platformId, p.capabilityId, p.teamId].map(id => esc(refs.get(id) || id)).join(" → ")}</p>`).join("")}<small>${esc(line.definitionRef)} · ${esc(productNames.join(", "))}</small></details>` : ""}
      <p class="eng-muted">Engagement override · Source definitions unchanged</p></div><footer>${line.overridden ? button("reset-line", "Reset to source", "rotate-ccw", `data-key="${esc(key)}"`) : ""}${button("close", "Cancel", "x")}<button type="submit" class="eng-primary">Apply</button></footer></form>`);
  }
  function componentsPanel() {
    const lines = M.lines(serviceEngagement).filter(l => group === "all" || l.definitionType === group || (group.startsWith("product:") && l.productIds.includes(group.slice(8))));
    const filters = { all: "All components", ...M.groups, ...Object.fromEntries(serviceEngagement.products.map(p => [`product:${p.id}`, p.name])) };
    return `<div class="eng-section-head"><label class="eng-filter">Components<select id="engComponentGroup">${opts(filters, group)}</select></label>${button("add-line", "Add custom line", "plus")}</div>
      <div class="eng-table-scroll"><table><thead><tr><th>Component</th><th>Quantity</th><th>Unit cost</th><th>Markup</th><th>Cost</th><th>Client price</th><th><span class="eng-sr-only">Actions</span></th></tr></thead><tbody>${lines.map(l => {
        const once = l.rateBasis === "one_time";
        return `<tr class="${l.calc.complete ? "" : "eng-invalid"}"><td><strong>${esc(l.name)}</strong><small>${esc(M.groups[l.definitionType])} · ${l.productIds.length > 1 ? "Shared · " : ""}${esc(l.treatment.replaceAll("_", " "))}${l.overridden ? " · Override" : ""}</small>${l.issue ? `<small class="eng-error">${esc(l.issue)}</small>` : ""}</td><td>${l.quantity ?? "—"}<small>${esc(l.unit)}</small></td><td>${l.rate == null ? "Unset" : currency(l.rate)}<small>${esc(M.bases[l.rateBasis])}</small></td><td>${l.markup}%</td><td>${l.calc.complete ? currency(once ? l.calc.activationCost : l.calc.monthlyCost) : "Incomplete"}<small>${once ? "one-time" : "/ month"}</small></td><td><strong>${l.calc.complete ? currency(once ? l.calc.activationPrice : l.calc.monthlyPrice) : "Incomplete"}</strong></td><td>${button("edit-line", "", "pencil", `data-key="${esc(l.key)}" title="Edit component costing" aria-label="Edit ${esc(l.name)}"`)}${!l.productIds.length ? button("remove-line", "", "trash-2", `data-key="${esc(l.key)}" title="Remove line" aria-label="Remove ${esc(l.name)}"`) : ""}</td></tr>`;
      }).join("") || '<tr><td colspan="7" class="eng-empty">No components</td></tr>'}</tbody></table></div>`;
  }
  function capacityPanel() {
    const rows = M.capacity(serviceEngagement);
    return `<div class="eng-section-head"><h3>Team / capacity</h3><span class="eng-muted">Planning only · No staff reserved</span></div><div class="eng-table-scroll"><table><thead><tr><th>Team / role</th><th>Demand / month</th><th>Available hours / month</th><th>Remaining</th><th>Cost / month</th><th></th></tr></thead><tbody>${rows.map(l => `<tr><td><strong>${esc(l.name)}</strong><small>${l.productIds.length > 1 ? "Shared requirement" : esc(l.costCenter)}</small></td><td>${l.demand == null ? "Not hour-based" : `${decimal(l.demand, 1)} h`}</td><td><input type="number" min="0" step="any" value="${l.available ?? ""}" placeholder="Unknown" aria-label="${esc(l.name)} available hours" data-capacity-key="${esc(l.key)}"></td><td class="${l.gap < 0 ? "eng-error" : ""}">${l.gap == null ? "Not assessed" : `${decimal(l.gap, 1)} h`}</td><td>${currency(l.calc.monthlyCost)}</td><td>${button("edit-line", "", "pencil", `data-key="${esc(l.key)}" title="Edit role costing" aria-label="Edit ${esc(l.name)}"`)}</td></tr>`).join("") || '<tr><td colspan="6" class="eng-empty">No team requirements</td></tr>'}</tbody></table></div>`;
  }
  function renderBuilder() {
    root.hidden = serviceScenario !== "livingOps";
    if (root.hidden) return;
    if (ce.render()) return;
    const t = M.totals(serviceEngagement);
    const margin = t.termPrice ? (t.termPrice - t.termCost) / t.termPrice * 100 : 0;
    root.innerHTML = `<div class="eng-setup-row"><div class="eng-settings">${input("Engagement name", "engName", serviceEngagement.name, "text", 'maxlength="150"')}${input("Term (months)", "engTerm", serviceEngagement.termMonths, "number", 'min="1" max="120" step="1"')}${input("Default markup (%)", "engMarkup", serviceEngagement.markup, "number", 'min="0" step="any"')}</div>${button("proposal", "Use in proposal", "file-output", `class="eng-primary" ${!t.count || !t.complete ? "disabled" : ""}`)}</div>
      <div class="eng-metrics"><div><span>One-time price</span><strong>${currency(t.activationPrice)}</strong><small>${currency(t.activationCost)} cost</small></div><div><span>Monthly price</span><strong>${currency(t.monthlyPrice)}</strong><small>${currency(t.monthlyCost)} cost</small></div><div><span>Initial term · ${t.termMonths} months</span><strong>${currency(t.termPrice)}</strong><small>${currency(t.termCost)} cost</small></div><div><span>Gross margin</span><strong>${decimal(margin, 1)}%</strong><small>${currency(t.termPrice - t.termCost)}</small></div></div>
      ${t.sample ? '<p class="eng-warning">Example product rates · Internal review only · DocuSeal sending blocked</p>' : ""}
      ${!t.complete ? `<p class="eng-warning">Incomplete pricing · ${esc(t.issues.join("; ") || "Check term and markup")}</p>` : ""}
      <div class="eng-view-tabs" role="group" aria-label="Engagement view">${[["products", "Products", "package"], ["components", "Components", "list-tree"], ["capacity", "Team / Capacity", "users"]].map(([id, label, glyph]) => button("view", label, glyph, `data-view="${id}" aria-pressed="${view === id}"`)).join("")}</div>
      ${view === "products" ? productsPanel() : view === "components" ? componentsPanel() : capacityPanel()}
      <p class="eng-notice" role="status">${esc(notice)}</p>`;
    window.lucide?.createIcons();
  }
  function catalogResults(query = "") {
    const entries = catalog?.products.filter(p => `${p.name} ${p.description} ${p.id}`.toLowerCase().includes(query.toLowerCase())) || [];
    return entries.map(p => {
      const issue = M.productIssue(p), added = serviceEngagement.products.some(x => x.id === p.id);
      return `<article class="eng-catalog-product"><div><h3>${esc(p.name)}</h3><p>${esc(p.description || "")}</p><small>${esc(p.catalogStatus.replaceAll("_", " "))} · ${p.templateVariables.length} components · ${esc(p.revision || "Unversioned snapshot")}</small>${issue ? `<p class="eng-error">${esc(issue)}</p>` : ""}</div>${button("select-product", added ? "Added" : "Add", added ? "check" : "plus", `data-id="${esc(p.id)}" ${issue || added ? "disabled" : ""}`)}</article>`;
    }).join("") || '<div class="eng-empty">No matching products</div>';
  }
  function openCatalog() {
    modal("Living Ops products", `<div class="eng-dialog-body"><div class="eng-section-head"><span class="${catalog?.sample ? "eng-warning" : "eng-muted"}">${esc(catalogStatus())}</span>${button("import", "Import catalog", "upload")}</div><input id="engCatalogSearch" type="search" placeholder="Search products" aria-label="Search products"><div id="engCatalogResults">${catalogResults()}</div></div><footer>${button("example", "View example catalog", "flask-conical")}${button("close", "Done", "check")}</footer>`);
  }
  const file = document.createElement("input");
  file.type = "file"; file.accept = ".json,application/json"; file.hidden = true;
  host.append(file);
  file.addEventListener("change", async () => {
    if (!file.files[0]) return;
    try {
      if (file.files[0].size > 5000000) throw Error("Catalog exceeds 5 MB.");
      const packet = JSON.parse(await file.files[0].text());
      const next = M.normalizeCatalog(packet);
      const bytes = new TextEncoder().encode(JSON.stringify(packet));
      next.snapshotHash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map(b => b.toString(16).padStart(2, "0")).join("");
      localStorage.setItem(catalogKey, JSON.stringify({ packet, snapshotHash: next.snapshotHash }));
      catalog = next;
      notice = "Catalog imported. Saved engagement snapshots are unchanged.";
      renderBuilder(); openCatalog();
    } catch (e) { notice = `Import failed: ${e.message}`; renderBuilder(); if (dialog.open) { const p = document.createElement("p"); p.className = "eng-error"; p.setAttribute("role", "alert"); p.textContent = notice; $(".eng-dialog-body", dialog).prepend(p); } }
    file.value = "";
  });
  async function action(event) {
    const target = event.target.closest("[data-service-action]");
    if (!target || target.disabled) return;
    const a = target.dataset.serviceAction, key = target.dataset.key, id = target.dataset.id;
    if (a === "close") return dialog.close();
    if (a === "view") { view = target.dataset.view; renderBuilder(); return; }
    if (ce.action(target)) return;
    if (a === "catalog") return ce.openCatalog();
    if (a === "imported-catalog") { ce.cancelRead(); return openCatalog(); }
    if (a === "import") { ce.cancelRead(); return file.click(); }
    if (a === "example") { ce.cancelRead(); catalog = M.normalizeCatalog(window.ServiceExampleCatalog); openCatalog(); return; }
    if (a === "select-product") {
      try { M.addProduct(serviceEngagement, catalog, id); notice = "Product snapshot added to engagement."; changed(); openCatalog(); }
      catch (e) { const p = document.createElement("p"); p.className = "eng-warning"; p.textContent = e.message; $(".eng-dialog-body", dialog).prepend(p); }
      return;
    }
    if (a === "inspect-product") { group = `product:${id}`; view = "components"; renderBuilder(); return; }
    if (a === "remove-product") {
      serviceEngagement.products = serviceEngagement.products.filter(p => p.id !== id);
      const remaining = new Set(M.lines(serviceEngagement).map(l => l.key));
      for (const store of [serviceEngagement.overrides, serviceEngagement.capacity]) for (const k of Object.keys(store)) if (!remaining.has(k)) delete store[k];
      if (group === `product:${id}`) group = "all";
      changed(); return;
    }
    if (a === "edit-line") return lineDialog(key);
    if (a === "reset-line") { delete serviceEngagement.overrides[key]; dialog.close(); changed(); return; }
    if (a === "remove-line") { serviceEngagement.customLines = serviceEngagement.customLines.filter(l => l.key !== key); delete serviceEngagement.overrides[key]; changed(); return; }
    if (a === "add-line") {
      modal("Custom engagement component", `<form id="engCustomForm"><div class="eng-dialog-body eng-form-grid">${input("Item name", "name", "", "text", "required maxlength=150")}<label>Type<select name="definitionType">${opts(M.groups, "items")}</select></label></div><footer>${button("close", "Cancel", "x")}<button type="submit" class="eng-primary">Add component</button></footer></form>`); return;
    }
    if (a === "proposal") {
      target.disabled = true;
      try {
        const saved = await saveRecordFromManager("services");
        if (saved === "") throw Error("Services could not be saved. Try again before adding it to the proposal.");
        const source = proposalPublishingSourceState("services");
        if (!source.saved) throw Error("Save Services before adding it to a proposal.");
        proposal.includedSections = [...new Set([...proposalIncludedSections(), "services"])];
        if (CeEngagement.isCatalog(serviceEngagement)) proposal.outputAudience = "internal";
        proposal.sourceRecords = { ...proposal.sourceRecords, services: { number: source.number, version: source.version } };
        markWorkspaceRecordDirty("proposals");
        setActiveView("proposalView");
        render();
      } catch (e) { notice = e.message; renderBuilder(); }
    }
  }
  root.addEventListener("click", action);
  dialog.addEventListener("click", action);
  dialog.addEventListener("input", e => { if (e.target.id === "engCatalogSearch") { $("#engCatalogResults", dialog).innerHTML = catalogResults(e.target.value); window.lucide?.createIcons(); } });
  root.addEventListener("change", e => {
    const el = e.target;
    if (el.id === "engComponentGroup") { group = el.value; renderBuilder(); return; }
    if (el.name === "engName") serviceEngagement.name = el.value.trim() || "New engagement";
    else if (el.name === "engTerm") serviceEngagement.termMonths = number(el.value);
    else if (el.name === "engMarkup") serviceEngagement.markup = number(el.value);
    else if (el.dataset.capacityKey) serviceEngagement.capacity[el.dataset.capacityKey] = number(el.value);
    else return;
    changed();
  });
  dialog.addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    if (e.target.id === "engCustomForm") {
      const id = crypto.randomUUID();
      const custom = { key: `custom:${id}`, definitionRef: id, definitionType: data.definitionType, name: data.name.trim(), rate: null, quantity: 1,
        unit: data.definitionType === "teams" ? "hour" : "month", rateBasis: data.definitionType === "teams" ? "per_hour" : "per_month", currency: "USD", costStatus: "active" };
      if (!custom.name) return;
      serviceEngagement.customLines.push(custom); view = "components"; group = "all";
      changed(); lineDialog(custom.key); return;
    }
    if (e.target.id === "engLineForm") {
      const key = e.target.dataset.key;
      serviceEngagement.overrides[key] = { ...serviceEngagement.overrides[key], ...data, rate: number(data.rate), quantity: number(data.quantity), markup: number(data.markup),
        resolveShared: data.resolveShared === "on" || Boolean(serviceEngagement.overrides[key]?.resolveShared) };
      dialog.close(); changed();
    }
  });
  const ce = window.createCeServicesBuilder({ root, dialog, modal, changed, input, button, opts, esc, currency });
  window.renderEngagementServices = renderBuilder;
  renderServicesCalculator();
})();
