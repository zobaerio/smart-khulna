// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyC6C2wYhHlL0k78DEA7MYDfdn7FvCXFNRs",
  authDomain: "smart-khulna.firebaseapp.com",
  projectId: "smart-khulna",
  storageBucket: "smart-khulna.firebasestorage.app",
  messagingSenderId: "728229923162",
  appId: "1:728229923162:web:c7be0a5087db0e84c04b63"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'স্মার্ট খুলনা বিজ্ঞপ্তি';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'নতুন আপডেট এসেছে। দেখতে ট্যাপ করুন।',
    icon: payload.notification?.icon || payload.data?.icon || '/pwa-192x192.png',
    badge: '/icon.svg',
    image: payload.notification?.image || payload.data?.image || undefined,
    data: {
      url: payload.data?.deepLink || payload.fcmOptions?.link || '/',
      notificationId: payload.data?.notificationId || payload.data?.id,
      category: payload.data?.category || 'notice',
      priority: payload.data?.priority || 'medium'
    },
    tag: payload.data?.tag || 'smart-khulna-alert',
    renotify: true,
    requireInteraction: payload.data?.priority === 'high' || payload.data?.category === 'emergency',
    vibrate: payload.data?.category === 'emergency' ? [300, 100, 300, 100, 300] : [200, 100, 200],
    actions: [
      { action: 'open', title: 'দেখুন' },
      { action: 'dismiss', title: 'বাতিল' }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window client is already open, focus it and navigate
      for (const client of windowClients) {
        if (client.url && 'focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_DEEP_LINK',
            url: targetUrl,
            data: event.notification.data
          });
          return client.focus();
        }
      }
      // If no window is open, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
