// service-worker.js

// Define a cache name for your assets
const CACHE_NAME = 'my-site-cache-v1';

// List the files you want to cache
const urlsToCache = [
    '/',
    'index.html',
    'assets/css/style.css',
    'assets/js/historik.js',
    'assets/js/indstillinger.js',
    'assets/js/ligenu.js',
    'assets/js/main.js',
    'assets/js/oversigt.js',
    'assets/js/settingsModal.js',
    // Add more URLs to cache as needed
];

// Install the service worker
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch and serve assets from cache
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // Cache hit - return the cached response
            if (response) {
                return response;
            }
            // No cache hit - fetch and add to cache
            return fetch(event.request).then(function (response) {
                // Check if we received a valid response
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
