// menggunakan versi 3.6.3 sesuai dengan saran di diskusi materi.
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
  console.log('workBox berhasil dimuat');
} else {
  console.log('workBox gagal dimuat');
}

workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/src/assets/icons/icon192.png', revision: '1' },
  { url: '/src/assets/icons/icon512.png', revision: '1' },
  { url: '/src/assets/icons/maskable_icon_x72.png', revision: '1' },
  { url: '/src/assets/icons/maskable_icon_x96.png', revision: '1' },
  { url: '/src/assets/icons/maskable_icon_x144.png', revision: '1' },
  { url: '/src/assets/img/stadium.jpg', revision: '1' },
  { url: '/src/assets/logo/favicon.ico', revision: '1' },
  { url: '/src/assets/logo/logo.png', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: 'https://fonts.googleapis.com/icon?family=Material+Icons', revision: '1' },
]);

// pages caching
workbox.routing.registerRoute(
  new RegExp('src/pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages',
  })
);
// css and js files
workbox.routing.registerRoute(
  /\.(?:css|js)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'script and styles',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 30 * 30 * 60 * 60,
      }),
    ],
  })
);

// fonts
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'fonts',
  })
);

// Footbal data API
workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'Football-API',
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24,
        maxEntries: 50,
      }),
    ],
  })
);

//push notification

self.addEventListener('push', function (event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  let options = {
    body: body,
    icon: '/public/src/assets/icons/icon192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(self.registration.showNotification('Push Notification', options));
});
