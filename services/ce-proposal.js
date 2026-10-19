(() => {
  const P = window.CePricing, esc = escapeHtml;
  const host = document.createElement('section');
  host.className = 'ce-proposal-pricing';
  document.querySelector('#proposal-content-panel').append(host);
  const shell = document.createElement('dialog'), editor = document.createElement('dialog');
  shell.className = 'eng-dialog ce-proposal-dialog'; editor.className = 'eng-dialog';
  document.body.append(shell, editor);
  const button = (action, label, icon, extra = '') => `<button type="button" data-service-action="${action}" ${extra}><i data-lucide="${icon}" aria-hidden="true"></i>${label ? `<span>${label}</span>` : ''}</button>`;
  const input = (label, name, value, type = 'text', extra = '') => `<label>${esc(label)}<input name="${name}" type="${type}" value="${esc(value ?? '')}" ${extra}></label>`;
  const opts = (entries, value) => Object.entries(entries).map(([id, label]) => `<option value="${esc(id)}" ${id === value ? 'selected' : ''}>${esc(label)}</option>`).join('');
  let draft, base, controller, busy = false, previousVersion, proposalNumber;
  function summary() {
    const state = proposalServicesState(), config = state.catalogConfiguration;
    host.hidden = !proposalIncludedSections().has('services') || !P.isAssessed(config);
    if (host.hidden) return;
    const changes = P.deviations(config);
    host.innerHTML = `<h3>Services pricing</h3><p>${changes.length ? 'Adjusted from product' : 'Matches product specification'}</p><small>${esc(proposal.servicesPricingOverride ? 'Proposal-specific pricing' : 'Saved Services pricing')} · ${esc(proposal.sourceRecords?.services?.number || '')}</small>${button('proposal-pricing', 'Adjust pricing', 'sliders-horizontal')}`;
    window.lucide?.createIcons();
  }
  function modal(title, html) {
    editor.innerHTML = `<header><h2>${esc(title)}</h2>${button('close', '', 'x', 'title="Close" aria-label="Close"')}</header>${html}`;
    if (!editor.open) editor.showModal();
    window.lucide?.createIcons();
  }
  function open() {
    controller?.destroy();
    base = proposalSavedServices();
    if (!P.isAssessed(base?.snapshot.serviceEngagement?.catalogConfiguration)) { setSaveStatus('Save and select a Services version before adjusting proposal pricing.'); return; }
    if (!savedRecordForCollection('proposals')) { setSaveStatus('Save this proposal first, then adjust its pricing in a new version.'); return; }
    draft = structuredClone(proposalServicesState());
    previousVersion = Number(savedRecordForCollection('proposals').version);
    proposalNumber = activeRecordNumber('proposals');
    shell.innerHTML = `<header><h2>Proposal Services pricing</h2>${button('close-shell', '', 'x', 'title="Close" aria-label="Close"')}</header><section class="eng-builder"></section><p class="ce-proposal-status" role="status"></p><footer>${button('reset-proposal', 'Reset to saved Services', 'rotate-ccw')}<button type="button" data-save-pricing>Save proposal version</button></footer>`;
    controller = window.createCeServicesBuilder({ root: shell.querySelector('.eng-builder'), dialog: editor, modal,
      changed: () => controller.render(), input, button, opts, esc, currency: n => money(n, 2), getState: () => draft, proposalMode: true });
    controller.render(); shell.showModal();
  }
  async function hash(value) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(P.canonical(value)));
    return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  async function save() {
    if (busy) return;
    busy = true;
    const submit = shell.querySelector('[data-save-pricing]'), status = shell.querySelector('.ce-proposal-status');
    submit.disabled = true;
    const prior = structuredClone(proposal);
    try {
      if (proposalNumber !== activeRecordNumber('proposals') || previousVersion !== Number(savedRecordForCollection('proposals')?.version)) throw Error('Proposal changed. Close and reopen pricing before saving.');
      const result = P.calculate(draft.catalogConfiguration);
      if (!result.complete) throw Error(result.issues.join('. '));
      const baseline = base.snapshot.serviceEngagement.catalogConfiguration;
      const baselineHash = await hash(baseline);
      if (baselineHash === await hash(draft.catalogConfiguration)) delete proposal.servicesPricingOverride;
      else proposal.servicesPricingOverride = { schema: 'ce-proposal-pricing-v1', sourceRecord: { number: base.number, version: base.version }, baseConfigurationHash: baselineHash, configuration: structuredClone(draft.catalogConfiguration) };
      proposal.sourceRecords.services = { number: base.number, version: base.version };
      markWorkspaceRecordDirty('proposals');
      const saved = await newVersionFromManager('proposals');
      if (saved === '' || Number(savedRecordForCollection('proposals')?.version) <= previousVersion) throw Error('Proposal version was not saved. Your pricing edits remain open.');
      shell.close(); summary();
    } catch (error) { proposal = prior; status.textContent = error.message; renderProposal(); }
    finally { busy = false; submit.disabled = false; }
  }
  host.addEventListener('click', e => { if (e.target.closest('[data-service-action="proposal-pricing"]')) open(); });
  shell.addEventListener('click', e => {
    if (e.target.closest('[data-save-pricing]')) { save(); return; }
    const target = e.target.closest('[data-service-action]'); if (!target) return;
    if (target.dataset.serviceAction === 'close-shell') shell.close();
    else if (target.dataset.serviceAction === 'reset-proposal') { draft = structuredClone(base.snapshot.serviceEngagement); controller.render(); }
    else controller.action(target);
  });
  editor.addEventListener('click', e => {
    const target = e.target.closest('[data-service-action]'); if (!target) return;
    if (target.dataset.serviceAction === 'close') editor.close(); else controller.action(target);
  });
  const originalRender = renderProposal;
  renderProposal = function (...args) { const value = originalRender.apply(this, args); summary(); return value; };
  summary();
})();
