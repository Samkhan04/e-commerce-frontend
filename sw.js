const CACHE_NAME = 'velric-v1';
const urlsToCache = ['/'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // 🔥 Immediately activate new SW
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // 🔥 Take control immediately
});

self.addEventListener('fetch', event => {
  // 🔥 Skip CORS requests - don't cache API calls
  const url = new URL(event.request.url);
  
  // Don't intercept API calls or cross-origin requests
  if (url.pathname.startsWith('/api/') || 
      url.origin !== self.location.origin) {
    return; // Let browser handle it normally
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});