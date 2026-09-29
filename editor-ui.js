(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const make = (tag, className, html = "") => {
    const element = document.createElement(tag);
    element.className = className;
    element.innerHTML = html;
    return element;
  };
  const field = (id) => $(id).closest("label");
  const disclosure = (title, icon) => make("details", "editor-disclosure", `<summary><i data-lucide="${icon}" aria-hidden="true"></i><span>${title}</span><i data-lucide="chevron-down" aria-hidden="true"></i></summary>`);

  function buildProposalEditor() {
    const editor = $(".proposal-editor");
    if (!editor) return;
    const navigation = make("div", "editor-section-tabs");
    navigation.setAttribute("role", "tablist");
    navigation.setAttribute("aria-label", "Proposal setup");
    const panels = make("section", "proposal-publishing-panel editor-panels");
    panels.setAttribute("aria-label", "Proposal setup");
    const sections = [["details", "Details"], ["content", "Content"], ["send", "Send"]];
    sections.forEach(([id, label], index) => {
      const button = make("button", "editor-section-tab", label);
      button.type = "button";
      button.id = `proposal-${id}-tab`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", `proposal-${id}-panel`);
      button.setAttribute("aria-selected", String(index === 0));
      button.tabIndex = index === 0 ? 0 : -1;
      const panel = make("div", "editor-section-panel", `<h2>${id === "details" ? "Proposal details" : id === "content" ? "Included content" : "Review & send"}</h2>`);
      panel.id = `proposal-${id}-panel`;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", button.id);
      panel.hidden = index !== 0;
      navigation.append(button);
      panels.append(panel);
    });
    const details = $("#proposal-details-panel", panels);
    details.append(field("#proposalTitle"), field("#proposalSubtitle"), field("#proposalPreparedFor"));
    const templates = disclosure("Company templates", "layout-template");
    const workflow = $(".publishing-template-workflow");
    $(".publishing-workflow-label", workflow)?.remove();
    templates.append($("#proposalTemplateLibraryCount"), workflow);
    details.append(templates);

    const content = $("#proposal-content-panel", panels);
    content.append($(".publishing-section-picker"), field("#proposalPricingMode"), $("#proposalPublishManifest"));
    const output = disclosure("Output settings", "sliders-horizontal");
    output.append($(".publishing-grid"), $(".template-integrity-row"));
    content.append(output);

    const send = $("#proposal-send-panel", panels);
    send.append($("#proposalPublishSummary"), $("#proposalPublishReadiness"), $(".publishing-actions"), $("#proposalSignatureStatus"));
    editor.replaceChildren(navigation, panels);
    editor.classList.add("document-editor");

    const activate = (button, focus = false) => {
      navigation.querySelectorAll("[role=tab]").forEach((tab) => {
        const selected = tab === button;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        $(`#${tab.getAttribute("aria-controls")}`, panels).hidden = !selected;
      });
      if (focus) button.focus();
    };
    navigation.addEventListener("click", (event) => {
      const tab = event.target.closest("[role=tab]");
      if (tab) activate(tab);
    });
    navigation.addEventListener("keydown", (event) => {
      const tabs = [...navigation.querySelectorAll("[role=tab]")];
      const index = tabs.indexOf(document.activeElement);
      if (index < 0 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      activate(tabs[next], true);
    });
    const previewToolbar = $(".proposal-preview-toolbar");
    previewToolbar.prepend(make("span", "editor-preview-label", "Document preview"));
  }

  function buildQuoteEditor() {
    const view = $("#printQuoteView");
    if (!view) return;
    view.classList.add("quote-editor-view");
    const layout = $(".print-quote-workspace", view);
    const form = $(".print-quote-form-grid", view);
    const sidebar = make("aside", "quote-details-panel document-editor", "<h2>Quote details</h2>");
    sidebar.setAttribute("aria-label", "Quote details");
    sidebar.append(field("#printQuoteName"), field("#printQuoteCustomerCompany"), field("#printQuoteCustomerName"), field("#printQuoteValidUntil"));
    const delivery = disclosure("Delivery", "truck");
    delivery.append(field("#printQuoteShipMethod"), field("#printQuoteShippingAmount"));
    const message = disclosure("Message & terms", "message-square");
    message.append(field("#printQuoteCustomerNote"), field("#printQuoteCustomerTerms"));
    const internal = disclosure("Source & internal notes", "folder-lock");
    internal.classList.add("quote-internal-details");
    internal.append(field("#printQuoteSource"), field("#printQuoteExternalRef"), field("#printQuoteSourceUrl"), field("#printQuoteInternalNotes"), field("#printQuoteNotes"));
    const references = make("div", "quote-reference-list");
    ["#printQuotePlaceholderNumber", "#printQuoteAttachmentStatus", "#printQuoteSourceSummary"].forEach((id) => references.append($(id).parentElement));
    internal.append(references);
    sidebar.append(delivery, message, internal);
    const output = $(".print-quote-output", view);
    layout.replaceChildren(output, sidebar);
    form.remove();
    $(".placeholder-panel > .section-head", view).remove();
    $(".placeholder-grid", view).remove();
    const actions = $(".print-quote-actions", view);
    const itemActions = $(".print-quote-action-group", actions);
    itemActions.classList.add("quote-items-toolbar");
    $(".section-head", output).after(itemActions);
    $("#addStandardProductBtn").innerHTML = '<i data-lucide="package-plus" aria-hidden="true"></i> Add product';
    $("#addPrintQuoteLineBtn").innerHTML = '<i data-lucide="plus" aria-hidden="true"></i> Custom line';
    $("#refreshPrintQuoteLinesBtn").innerHTML = '<i data-lucide="import" aria-hidden="true"></i> From estimate';
    $("#refreshPrintQuoteLinesBtn").title = "Replace quote lines with the active estimate";
    $("[data-print-quote-mode=builder]").textContent = "Edit quote";
    $("[data-print-quote-mode=customer]").textContent = "Preview";
    $(".print-quote-boundary", view).textContent = "Draft quote · review before sending";
  }

  buildProposalEditor();
  buildQuoteEditor();

  // Keep header popovers predictable without replacing the existing record actions.
  document.addEventListener("click", (event) => {
    document.querySelectorAll(".record-popover[open]").forEach((popover) => {
      if (!popover.contains(event.target) || event.target.closest("[data-record-action]")) popover.open = false;
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".record-popover[open]").forEach((popover) => {
      const hadFocus = popover.contains(document.activeElement);
      popover.open = false;
      if (hadFocus) $("summary", popover).focus();
    });
  });
  window.lucide?.createIcons();
})();
