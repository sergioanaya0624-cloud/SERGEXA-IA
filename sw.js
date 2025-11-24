<<<<<<< HEAD
const CACHE_NAME = 'asistente-pwa-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/modules.css',
  '/assets/js/app.js',
  '/assets/js/core/moduleManager.js',
  '/assets/js/core/router.js',
  '/assets/js/core/storage.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
=======
// Service Worker básico con precache y runtime caching.
// Coloca este archivo en la raíz: /sw.js
const CACHE_NAME = 'mi-app-ia-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/global.css',
  '/css/theme.css',
  '/js/helpers.js',
  '/js/theme.js',
  '/js/app.js',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

// Strategy:
// - navigation / HTML requests: network-first, fallback to cache -> offline.html
// - other resources: cache-first, then network, cache responses
self.addEventListener('fetch', event => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // HTML navigation (SPA)
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // clone and cache
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // For other requests (CSS, JS, images)
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(networkResponse => {
        // cache successful responses (status 200)
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return networkResponse;
      }).catch(() => {
        // fallback for images
        if (request.destination === 'image') {
          return caches.match('/icon-192.png');
        }
      });
    })
>>>>>>> 07277c119b6cb23cb78090d72d19187fc10b2016
  );
});
