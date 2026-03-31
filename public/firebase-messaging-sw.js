importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBiMMY0e_G_q9NYlUOgcD5cgCzohUvLQAk',
  authDomain: 'her-him-bank.firebaseapp.com',
  projectId: 'her-him-bank',
  storageBucket: 'her-him-bank.firebasestorage.app',
  messagingSenderId: '52213948984',
  appId: '1:52213948984:web:d28f3cab47eccb5fd1fccd'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  });
});