const CACHE = 'fittracker-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/css/app.css',
  '/js/data.js',
  '/js/workouts.js',
  '/js/screens.js',
  '/js/app.js',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/fonts/tabler-icons.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => {
      if (e.request.destination === 'document') return caches.match('/index.html');
    }))
  );
});
