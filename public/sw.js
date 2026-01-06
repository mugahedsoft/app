const CACHE_NAME = 'pizzeti-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/components/CartView.tsx',
  '/src/components/CustomerForm.tsx',
  '/src/components/ProductCard.tsx',
  '/src/data/menu.ts',
  '/src/types.ts',
  '/src/utils/storage.ts',
  '/src/utils/whatsapp.ts',
  '/src/vite-env.d.ts',
  '/manifest.json',
  '/icon.svg',
  '/menu-bg.JPG',
  'https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@600;700;800&family=Tajawal:wght@400;500;700;800&display=swap',
  'https://fonts.gstatic.com/s/baloobhaijaan2/v18/HT5o5E5t5-FF0T2O2y30A.woff2',
  'https://fonts.gstatic.com/s/tajawal/v16/Iura6Yb-j6Ltt7ff2T0yCw.woff2'
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
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
