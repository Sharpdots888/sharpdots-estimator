// CE recipes keep their pricing policy; the import builder remains a separate model.
window.createCeServicesBuilder = ({ root, dialog, modal, changed, input, button, opts, esc, currency }) => {
  const C = window.CeServiceCatalog, E = window.CeEngagement;
  let view = 'products', catalog = null, loading = false, error = '', query = '', notice = '', request = 0;
  const state = () => serviceEngagement;
  const config = () => state().catalogConfiguration;
  const amount = n => n == null ? 'Unknown' : currency(n);
  const number = value => value === '' ? null : Number(value);
  const moneyInput = (label, name, value, extra = '') => input(label, name, value, 'number', `min="0" max="1000000000" step="any" ${extra}`);
  const sourceLabel = c => `${c.source.preview === 'synthetic' ? 'SYNTHETIC PREVIEW · ' : ''}CE catalog revision ${c.source.revision} · ${c.source.workspace.slug}`;
  const noticeHtml = () => `<p class="eng-notice" role="status">${esc(notice)}</p>`;
  function catalogResults() {
    const entries = (catalog?.products || []).filter(p => `${p.name} ${p.id}`.toLowerCase().includes(query.toLowerCase()));
    return entries.map(p => {
      const t = C.calculate(C.selectProducts(catalog, [p.id]));
      const added = config()?.products?.some(x => x.id === p.id);
      return `<article class="eng-catalog-product"><div><h3>${esc(p.name)}</h3><small>${esc(p.sourceStatus.replaceAll('_', ' '))} · ${p.recipe.length} components · ${p.productDefinition.termMonths} months</small><p>${t.complete ? `${amount(t.activationPrice)} one-time · ${amount(t.monthlyPrice)} / month` : 'Incomplete costing'}</p><small>Draft pricing · Internal review only</small></div>${button('ce-add', added ? 'Added' : 'Add', added ? 'check' : 'plus', `data-id="${esc(p.id)}" ${added ? 'disabled' : ''}`)}</article>`;
    }).join('') || '<p class="eng-empty">No matching products</p>';
  }
  function renderCatalog() {
    modal('Living Ops products', `<div class="eng-dialog-body"><div class="eng-section-head"><span class="eng-muted">${loading ? 'Reading saved CE catalog...' : catalog ? esc(sourceLabel(catalog)) : 'CE product library'}</span>${button('ce-refresh', '', 'refresh-cw', `title="Refresh catalog" aria-label="Refresh catalog" ${loading ? 'disabled' : ''}`)}</div>
      ${error ? `<p class="eng-warning" role="alert">${esc(error)}</p>` : ''}
      ${catalog ? `<input id="ceCatalogSearch" type="search" value="${esc(query)}" placeholder="Search products" aria-label="Search CE products"><div id="ceCatalogResults">${catalogResults()}</div>` : ''}${noticeHtml()}</div>
      <footer>${button('import', 'Import catalog', 'upload')}${button('imported-catalog', 'Imported products', 'folder-open')}${button('close', 'Done', 'check')}</footer>`);
  }
  async function openCatalog() {
    const token = ++request;
    catalog = null; loading = true; error = ''; notice = ''; query = '';
    renderCatalog();
    const abort = new AbortController(), timer = setTimeout(() => abort.abort(), 15000);
    try {
      const r = await fetch('/api/services/catalog', { credentials: 'same-origin', cache: 'no-store', signal: abort.signal, headers: { Accept: 'application/json' } });
      if (!r.ok) throw Error(r.status === 401 ? 'Sign in through Portal to read the CE catalog.' : r.status === 403 ? 'CE catalog access is not enabled for this operator.' : r.status === 503 ? 'The CE catalog connection is not enabled or is temporarily unavailable.' : 'The saved CE catalog could not be read. Retry after checking the connection.');
      const next = E.validateCatalog(await r.json());
      if (token !== request) return;
      catalog = next;
    } catch (e) { if (token === request) error = e.name === 'AbortError' ? 'Catalog read timed out. Retry the connection.' : e.message; }
    finally { clearTimeout(timer); if (token === request) { loading = false; if (dialog.open) renderCatalog(); } }
  }
  function productsPanel(t) {
    return `<div class="eng-section-head"><h3>Engagement products <small>${config().products.length}</small></h3>${button('catalog', 'Add product', 'plus')}</div>
      <div class="eng-product-list">${config().products.map(p => {
        const total = t.products.find(x => x.productId === p.id);
        const shared = t.lines.filter(l => l.productIds.includes(p.id) && l.productId !== p.id);
        return `<article class="eng-product"><div><span class="eng-eyebrow">CE DRAFT · ${esc(p.sourceStatus.replaceAll('_', ' '))}</span><h3>${esc(p.name)}</h3><small>${p.recipe.length} source components · ${esc(p.id)}</small>${shared.length ? `<p class="eng-muted">${shared.length} shared components priced under their selected owner</p>` : ''}</div><div class="eng-product-price"><strong>${amount(total?.monthly.totalBudget)}<small> / month</small></strong><small>${amount(total?.once.totalBudget)} one-time</small></div><div class="eng-inline-actions">${button('ce-pricing', '', 'sliders-horizontal', `data-id="${esc(p.id)}" title="Product pricing" aria-label="Pricing for ${esc(p.name)}"`)}${button('ce-remove', '', 'trash-2', `data-id="${esc(p.id)}" title="Remove product" aria-label="Remove ${esc(p.name)}"`)}</div></article>`;
      }).join('')}</div>`;
  }
  function componentsPanel() {
    const c = config();
    return `${E.requirements(c).map(({ key, uses }) => `<div class="eng-shared"><div><strong>${esc(uses[0].componentId)}</strong><p>${esc(uses.map(u => u.productName).join(' / '))}</p><small>${c.sharedResolutions[key] ? 'Shared pricing resolved' : 'Shared scope needs a pricing owner'}</small></div>${button('ce-shared', 'Review shared scope', 'combine', `data-key="${esc(key)}"`)}</div>`).join('')}
      <div class="eng-table-scroll"><table><thead><tr><th>Component / product</th><th>Include</th><th>Quantity</th><th>Cadence</th><th>Unit cost</th><th>Treatment</th><th></th></tr></thead><tbody>${c.products.flatMap(p => p.recipe.map(original => {
        const r = { ...original, ...c.rowOverrides[p.id]?.[original.key] }, component = p.components.find(x => x.id === r.componentId);
        return `<tr class="${r.unitCost == null && r.included !== false ? 'eng-invalid' : ''}"><td><strong>${esc(component.name)}</strong><small>${esc(p.name)}${c.rowOverrides[p.id]?.[original.key] ? ' · Override' : ''}</small></td><td><input type="checkbox" data-ce-include="${esc(p.id)}" data-key="${esc(original.key)}" aria-label="Include ${esc(component.name)} in ${esc(p.name)}" ${r.included !== false ? 'checked' : ''}></td><td>${esc(r.quantity)}<small>${esc(component.unit || '')}</small></td><td>${r.cadence === 'once' ? 'One-time' : 'Monthly'}</td><td>${amount(r.unitCost)}</td><td>${r.passThrough ? 'Pass-through' : 'Delivery + reserve'}</td><td>${button('ce-component', '', 'pencil', `data-id="${esc(p.id)}" data-key="${esc(original.key)}" title="Configure component" aria-label="Configure ${esc(component.name)}"`)}</td></tr>`;
      })).join('')}</tbody></table></div>`;
  }
  function capacityPanel(t) {
    return `<div class="eng-section-head"><h3>Team / capacity</h3><span class="eng-muted">Planning demand · No assignments or reservations</span></div><div class="eng-table-scroll"><table><thead><tr><th>Role</th><th>One-time hours</th><th>Monthly hours</th><th>Availability</th></tr></thead><tbody>${t.capacity.map(r => `<tr><td><strong>${esc(r.name)}</strong></td><td>${r.onceHours.toFixed(1)}</td><td>${r.monthlyHours.toFixed(1)}</td><td>Not assessed</td></tr>`).join('') || '<tr><td colspan="4">No resolved labor requirements</td></tr>'}</tbody></table></div>`;
  }
  function render() {
    if (!E.isCatalog(state())) return false;
    const t = E.totals(state()), c = config();
    if (t.invalid || !c?.products?.length || !c.source || !c.rowOverrides || !c.pricingOverrides) {
      root.innerHTML = `<p class="eng-warning" role="alert">${esc(t.issues.join('; '))}</p>`;
      return true;
    }
    root.innerHTML = `<div class="eng-setup-row"><div class="eng-settings ce-settings">${input('Engagement name', 'engName', state().name, 'text', 'maxlength="150"')}${input('Term (months)', 'ceTerm', c.termMonths, 'number', 'min="1" max="120" step="1" required')}</div>${button('proposal', 'Use in internal proposal', 'file-output', `class="eng-primary" ${!t.count || !t.complete ? 'disabled' : ''}`)}</div>
      <p class="eng-muted">${esc(sourceLabel(c))} · Selected snapshot · Contribution-margin pricing</p>
      ${!c.termConfirmed ? `<div class="eng-warning">Products have different source terms. ${button('ce-confirm-term', `Confirm ${c.termMonths}-month term`, 'check')}</div>` : ''}
      <div class="eng-metrics"><div><span>One-time budget</span><strong>${amount(t.activationPrice)}</strong><small>${amount(t.activationCost)} cost + reserve</small></div><div><span>Monthly budget</span><strong>${amount(t.monthlyPrice)}</strong><small>${amount(t.monthlyCost)} cost + reserve</small></div><div><span>Initial term · ${c.termMonths} months</span><strong>${amount(t.termPrice)}</strong><small>Includes pass-through allowances</small></div><div><span>Publishing</span><strong class="ce-draft-label">Draft only</strong><small>Client output unavailable</small></div></div>
      ${!t.complete ? `<p class="eng-warning" role="alert">${esc(t.issues.join('; '))}</p>` : ''}
      <div class="eng-view-tabs" role="group" aria-label="CE engagement view">${[['products', 'Products', 'package'], ['components', 'Components', 'list-tree'], ['capacity', 'Team / Capacity', 'users']].map(([id, label, glyph]) => button('ce-view', label, glyph, `data-view="${id}" aria-pressed="${view === id}"`)).join('')}</div>
      ${view === 'products' ? productsPanel(t) : view === 'components' ? componentsPanel() : capacityPanel(t)}${noticeHtml()}`;
    window.lucide?.createIcons();
    return true;
  }
  function componentDialog(id, key) {
    const p = config().products.find(x => x.id === id), original = p.recipe.find(r => r.key === key);
    const r = { ...original, ...config().rowOverrides[id]?.[key] }, component = p.components.find(x => x.id === r.componentId);
    const workflow = p.workflows.find(x => x.id === component.workflowId);
    modal('Configure component', `<form id="ceComponentForm" data-id="${esc(id)}" data-key="${esc(key)}"><div class="eng-dialog-body"><h3>${esc(component.name)}</h3><p>${esc(p.name)}</p><div class="eng-form-grid">${moneyInput('Quantity', 'quantity', r.quantity, 'required')}${moneyInput('Unit cost ($)', 'unitCost', r.unitCost, 'placeholder="Unknown"')}<label>Cadence<select name="cadence">${opts({ once: 'One-time', monthly: 'Monthly' }, r.cadence)}</select></label><label>Treatment<input value="${r.passThrough ? 'Pass-through allowance' : 'Delivery + reserve'}" readonly></label></div><details class="eng-lineage"><summary>Source relationships</summary><p>${esc(workflow?.name || component.workflowId)} · ${esc(component.unit || '')}</p><p>${esc(p.roles.filter(role => Object.hasOwn(component.cost.laborHours, role.id)).map(role => `${role.name}: ${component.cost.laborHours[role.id]} h / unit`).join(' · ') || 'No labor hours')}</p><small>${esc(r.configuration || '')}</small></details><p class="eng-muted">Engagement override · CE definitions unchanged</p></div><footer>${button('ce-reset-row', 'Reset to source', 'rotate-ccw', `data-id="${esc(id)}" data-key="${esc(key)}"`)}<button type="submit" class="eng-primary">Apply</button></footer></form>`);
  }
  function pricingDialog(id) {
    const p = config().products.find(x => x.id === id), policy = { ...p.pricingPolicy, ...config().pricingOverrides[id] };
    modal('Product pricing', `<form id="cePricingForm" data-id="${esc(id)}"><div class="eng-dialog-body"><h3>${esc(p.name)}</h3><div class="eng-form-grid">${input('Contribution margin (%)', 'margin', policy.margin * 100, 'number', 'min="0" max="99.99" step="any" required')}${input('Reserve (%)', 'reserve', policy.reserve * 100, 'number', 'min="0" max="100" step="any" required')}${moneyInput('Fixed one-time service fee ($)', 'once', policy.feeOverrides.once, 'placeholder="Calculated"')}${moneyInput('Fixed monthly service fee ($)', 'monthly', policy.feeOverrides.monthly, 'placeholder="Calculated"')}</div><p class="eng-muted">Calculated service fees round up to $25. Pass-through allowances are added separately. Fixed fees remain fixed when components are removed.</p></div><footer>${button('ce-reset-pricing', 'Reset to source', 'rotate-ccw', `data-id="${esc(id)}"`)}<button type="submit" class="eng-primary">Apply</button></footer></form>`);
  }
  function sharedDialog(key) {
    const group = E.requirements(config()).find(g => g.key === key);
    if (!group) return;
    const current = config().sharedResolutions[key] || {};
    modal('Shared component scope', `<form id="ceSharedForm" data-key="${esc(key)}"><div class="eng-dialog-body"><h3>${esc(group.uses[0].componentId)}</h3>${group.uses.map(u => `<p>${esc(u.productName)}: ${u.quantity} × ${amount(u.unitCost)}</p>`).join('')}<div class="eng-form-grid"><label>Pricing owner<select name="pricingProductId" required><option value="">Choose product</option>${opts(Object.fromEntries(group.uses.map(u => [u.productId, u.productName])), current.pricingProductId)}</select></label>${moneyInput('Shared quantity', 'quantity', current.quantity, 'required')}${moneyInput('Shared unit cost ($)', 'unitCost', current.unitCost, 'placeholder="Unknown"')}</div></div><footer><button type="submit" class="eng-primary">Apply shared scope</button></footer></form>`);
  }
  function action(target) {
    const a = target.dataset.serviceAction, id = target.dataset.id, key = target.dataset.key;
    if (!a.startsWith('ce-')) return false;
    try {
      if (a === 'ce-refresh') { openCatalog(); return true; }
      if (a === 'ce-add') { E.addProduct(state(), catalog, id); changed(); notice = 'Product snapshot added. Draft pricing only.'; renderCatalog(); return true; }
      if (a === 'ce-view') { view = target.dataset.view; render(); return true; }
      if (a === 'ce-component') { componentDialog(id, key); return true; }
      if (a === 'ce-pricing') { pricingDialog(id); return true; }
      if (a === 'ce-shared') { sharedDialog(key); return true; }
      if (a === 'ce-remove') E.removeProduct(state(), id);
      if (a === 'ce-confirm-term') config().termConfirmed = true;
      if (a === 'ce-reset-row') { delete config().rowOverrides[id]?.[key]; config().sharedResolutions = {}; dialog.close(); }
      if (a === 'ce-reset-pricing') { delete config().pricingOverrides[id]; dialog.close(); }
      changed();
    } catch (e) { notice = e.message; if (dialog.open) { const p = dialog.querySelector('.eng-notice'); if (p) p.textContent = notice; } else render(); }
    return true;
  }
  dialog.addEventListener('close', () => { request++; });
  dialog.addEventListener('input', e => { if (e.target.id === 'ceCatalogSearch') { query = e.target.value; dialog.querySelector('#ceCatalogResults').innerHTML = catalogResults(); window.lucide?.createIcons(); } });
  root.addEventListener('change', e => {
    if (e.target.name === 'ceTerm') { config().termMonths = number(e.target.value); config().termConfirmed = true; changed(); }
    if (e.target.dataset.ceInclude) {
      state().catalogConfiguration = C.configureProduct(config(), e.target.dataset.ceInclude, e.target.dataset.key, { included: e.target.checked });
      config().sharedResolutions = {}; changed();
    }
  });
  dialog.addEventListener('submit', e => {
    if (!e.target.id.startsWith('ce')) return;
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target)), id = e.target.dataset.id, key = e.target.dataset.key;
    if (e.target.id === 'ceComponentForm') {
      state().catalogConfiguration = C.configureProduct(config(), id, key, { quantity: number(data.quantity), unitCost: number(data.unitCost), cadence: data.cadence });
      config().sharedResolutions = {};
    }
    if (e.target.id === 'cePricingForm') config().pricingOverrides[id] = { margin: number(data.margin) / 100, reserve: number(data.reserve) / 100, feeOverrides: { once: number(data.once), monthly: number(data.monthly) } };
    if (e.target.id === 'ceSharedForm') config().sharedResolutions[key] = { pricingProductId: data.pricingProductId, quantity: number(data.quantity), unitCost: number(data.unitCost) };
    dialog.close(); changed();
  });
  return { render, openCatalog, action, cancelRead: () => { request++; } };
};
