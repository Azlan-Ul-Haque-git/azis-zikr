/* Azis Zikr SW v7 — network first, no cache blocking */
const CACHE='aziszikr-v7';
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.hostname!==self.location.hostname)return; /* APIs always network */
  /* Always network first — never serve stale cached files */
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
