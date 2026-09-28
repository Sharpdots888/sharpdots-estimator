/* Local, opt-in review boundary. Never forward prototype API requests to production. */
(() => {
  const local = ['127.0.0.1', 'localhost'].includes(location.hostname);
  if (!local || new URLSearchParams(location.search).get('crm') !== '1') return;
  window.CRM_PREVIEW = true;
  document.documentElement.classList.add('crm-preview');
  const originalFetch = window.fetch.bind(window);
  const read = () => JSON.parse(localStorage.getItem('crm-preview-estimates') || '[]');
  window.fetch = async (input, options = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.startsWith('/api/')) return originalFetch(input, options);
    const json = (body, status = 200) => Promise.resolve(new Response(JSON.stringify(body), {status, headers: {'Content-Type': 'application/json'}}));
    if (url.pathname === '/api/document-signing/status') return json({configured: false, mode: 'preview', emailDeliveryEnabled: false});
    if (url.pathname.startsWith('/api/document')) return json({error: 'Document sending is unavailable in the local CRM draft.'}, 403);
    if (url.pathname === '/api/estimates' && options.method === 'POST') {
      const record = JSON.parse(options.body);
      const all = read().filter(r => r.projectNumber !== record.projectNumber);
      localStorage.setItem('crm-preview-estimates', JSON.stringify([...all, record]));
      return json({...record, success: true});
    }
    if (url.pathname === '/api/estimates') return json(read());
    if (url.pathname.startsWith('/api/estimates/')) {
      const record = read().find(r => r.projectNumber === decodeURIComponent(url.pathname.split('/').pop()));
      return json(record || {error: 'Not found'}, record ? 200 : 404);
    }
    if (options.method && options.method !== 'GET') return json({error: 'This integration is not connected in the draft.'}, 403);
    return json([]);
  };
})();
