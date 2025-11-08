import "server-only";

import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { app, auth, db, messaging };
