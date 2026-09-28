/* Shared persistence is opt-in on the server. Preview keeps its isolated adapter. */
window.crmLiveReady = window.CRM_PREVIEW ? Promise.resolve(null) : (async () => {
  const request = async (path, method='GET', body) => {
    const response=await fetch('/api/crm/'+path,{method,credentials:'same-origin',headers:{'Content-Type':'application/json','X-Requested-With':'SharpdotsCRM'},body:body===undefined?undefined:JSON.stringify(body)});
    const data=await response.json();
    if(!response.ok)throw new Error(data.error||'CRM request failed');
    return data;
  };
  try {
    const status=await request('status');
    if(!status.enabled||!status.access)return null;
    const lookups=await request('lookups'), state=await request('opportunities');
    document.documentElement.classList.add('crm-preview');
    window.CRM_LIVE=true;
    return {request,lookups,...state};
  } catch(error) {
    const banner=document.createElement('p');banner.setAttribute('role','alert');
    banner.textContent='CRM unavailable: '+error.message+'. Existing estimator remains available.';
    document.body.prepend(banner); return null;
  }
})();
