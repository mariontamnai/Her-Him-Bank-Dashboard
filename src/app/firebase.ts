import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from '../environments/environment';

export const firebaseApp = initializeApp(environment.firebase);
export const messaging = getMessaging(firebaseApp);

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      registration.active?.postMessage({
        type: 'FIREBASE_CONFIG',
        config: environment.firebase
      });
      const token = await getToken(messaging, {
        vapidKey: environment.firebase.vapidKey,
        serviceWorkerRegistration: registration
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Notification permission error:', error);
    return null;
  }
}

export { onMessage };