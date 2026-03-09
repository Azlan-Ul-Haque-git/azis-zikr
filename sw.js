/* =====================================================
   AZIS ZIKR – sw.js  (Service Worker)
   Single source of truth – replaces service-worker.js
===================================================== */

const CACHE_NAME = "azis-zikr-v2";

const ASSETS = [
    "/",
    "/index.html",
    "/stats.html",
    "/features.html",
    "/about.html",
    "/css/style.css",
    "/js/script.js",
    "/manifest.json",
    "/assets/logo.svg",
    "/assets/logo1.png",
    "/assets/icons/icon-192.png",
    "/assets/icons/icon-512.png",
    "/assets/audio/nasheed.mp3",
    "/assets/video/background.mp4"
];

/* ── INSTALL: cache all assets ── */
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

/* ── ACTIVATE: remove old caches ── */
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

/* ── FETCH: cache-first, fallback to network ── */
self.addEventListener("fetch", (e) => {
    // Only handle GET requests
    if (e.request.method !== "GET") return;

    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;

            return fetch(e.request)
                .then(response => {
                    // Cache valid responses
                    if (response && response.status === 200 && response.type === "basic") {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                    }
                    return response;
                })
                .catch(() => {
                    // Offline fallback for HTML pages
                    if (e.request.destination === "document") {
                        return caches.match("/index.html");
                    }
                });
        })
    );
});