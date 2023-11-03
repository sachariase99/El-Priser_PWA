const CACHE_NAME = 'Cache-v1';

const urlsToCache = [
    '/',
    'index.html',
    'assets/html/historik.html',
    'assets/html/indstillinger.html',
    'assets/html/ligenu.html',
    'assets/css/style.css',
    'assets/js/historik.js',
    'assets/js/indstillinger.js',
    'assets/js/ligenu.js',
    'assets/js/main.js',
    'assets/js/oversigt.js',
    'assets/js/settingsModal.js',
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request).then(function (response) {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                const responseToCache = response.clone();

                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});
