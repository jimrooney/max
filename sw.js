var SW_Version = 15;
var cacheName = 'Balance2';
var filesToCache = [
'/',
  'index.html',
  'crosswind.html',
  'crosswindScript.js',
  'Performance.html',
  'Performance.js',
  'JimQuery.js',
  'navbar.js',
  'CSS.css',
  'script.js',
  'Airplane.js',
  'Airplanes.js',
  'C206.js',
  'C208.js',
  'data.js',
  'Display.js',
  'DOM.js',
  'GA8.js',
  'UI.js',
  'root.js',
  'Seat.js',
  'Station.js',
  'Sliders.css',
  'Sliders.js'
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