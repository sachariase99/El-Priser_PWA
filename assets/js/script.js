if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
    .then(function(registration) {
        console.log('ServiceWorker registration successful with scope:', registration.scope);
    })
    .catch(function(error) {
        console.log('ServiceWorker registration failed:', error);
    });
}