import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBiMMY0e_G_q9NYlUOgcD5cgCzohUvLQAk',
  authDomain: 'her-him-bank.firebaseapp.com',
  projectId: 'her-him-bank',
  storageBucket: 'her-him-bank.firebasestorage.app',
  messagingSenderId: '52213948984',
  appId: '1:52213948984:web:d28f3cab47eccb5fd1fccd'
};

export const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
console.log('Service worker registered:', registration);

const token = await getToken(messaging, {
  vapidKey: 'BGAuQG-uszjprU6YVqkNxon1U8bTPzEr8HRWXVqLoLj_F8IVypo3aB3fanEBJl7aLOIoetpGIG_B1h8TEFaAnOs',
  serviceWorkerRegistration: registration
});
console.log('FCM Token:', token);
return token;
    }
    return null;
  } catch (error) {
    console.error('Notification permission error:', error);
    return null;
  }
}

export { onMessage };