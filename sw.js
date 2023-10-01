var SW_Version = 17;
var cacheName = 'Balance2';
var filesToCache = [
'/',
'CSS.css',
'Calculator.js',
'DOM.js',
'JimQuery.js',
'Performance.js',
'Sliders.css',
'Sliders.js',
'UI.js',
'data.js',
'manifest.json',
'navbar.js',
'performance.html',
'root.js',
'test.css',
];
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});