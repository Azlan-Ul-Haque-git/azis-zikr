self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("tasbih-v1").then(cache => {
            return cache.addAll([
                "/",
                "/index.html",
                "/css/style.css",
                "/js/script.js",
                "/assets/logo.svg",
                "/nasheed-islamic-background-133345.mp3"
            ]);
        })
    );
});
