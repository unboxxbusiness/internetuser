import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

// Function to request permission and get token
export const requestNotificationPermission = async (userId: string) => {
  if (!messaging) return;
  console.log("Requesting permission...");
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (currentToken) {
        console.log("FCM Token:", currentToken);
        // Save the token to Firestore
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { fcmToken: currentToken });
      } else {
        console.log("No registration token available. Request permission to generate one.");
      }
    } else {
      console.log("Unable to get permission to notify.");
    }
  } catch (err) {
      console.error("An error occurred while requesting permission or getting token:", err);
  }
};

// Function to handle foreground messages
if (messaging) {
    onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        // You can display a toast or other UI element here
        new Notification(payload.notification?.title || 'New Message', {
            body: payload.notification?.body,
            icon: payload.notification?.icon,
        });
    });
}


export { app, auth, db, messaging };
