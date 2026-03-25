importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

let messaging;

self.addEventListener('message', (event) => {
  if (event.data?.type === 'FIREBASE_CONFIG') {
    firebase.initializeApp(event.data.config);
    messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const { title, body } = payload.notification;
      self.registration.showNotification(title, {
        body,
        icon: '/favicon.ico'
      });
    });
  }
});