const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/style.css',  // ganti dengan path CSS kamu
  '/assets/js/main.js',     // ganti dengan path JS utama kamu
  '/assets/images/logo/logo-vertical.png',
  '/assets/images/logo/logo-06.png',
  '/assets/images/logo/logo-07.png',
  '/assets/images/logo/logo-dark.png',
  '/assets/images/logo/logo-vertical-dark.png',
  '/assets/images/logo/logo.png',
  '/assets/images/logo/logos-circle.png', 
];

// Install Service Worker dan cache file-file yang ditentukan
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch data dari cache, jika tidak ada ambil dari network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Aktivasi Service Worker dan bersihkan cache lama jika ada perubahan
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Default Title';
  const options = {
    body: data.body || 'Default message body',
    icon: '/path/to/icon-192x192.png',
    badge: '/path/to/icon-72x72.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
