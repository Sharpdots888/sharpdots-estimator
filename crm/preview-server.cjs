const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4187);
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
http.createServer((req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  if(pathname==='/') {res.writeHead(302,{Location:'/index.html?crm=1'}).end();return;}
  // Static, localhost-only review server. Never loads credentials, DB clients or app routes.
  if(req.method!=='GET' || pathname.startsWith('/api/') || pathname.split('/').some(p=>p.startsWith('.')) || !/\.(html|js|css|json|svg|png|jpg|woff2)$/.test(pathname)) {res.writeHead(403).end('Not available on the draft server.');return;}
  const file = path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)) {res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(data);});
}).listen(port,'127.0.0.1',()=>console.log(`CRM draft: http://127.0.0.1:${port}/index.html?crm=1`));
