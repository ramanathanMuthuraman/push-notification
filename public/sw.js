self.addEventListener('install', function (event) {
  console.log('%c ServiceWorker installation successful', 'color: #FF00ff');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  console.log('%c ServiceWorker activation successful', 'color: #CDDC39');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let body = '';

  if (event.data) {
    body = event.data.text();
    const {message} = JSON.parse(body);
    const options = {
      body: message
    };
    event.waitUntil(
      self.registration.showNotification('Push Received', options)
    );
  }
});
