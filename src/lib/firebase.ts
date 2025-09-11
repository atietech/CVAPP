
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check for missing Firebase config and provide a clear error.
if (!firebaseConfig.apiKey) {
    throw new Error(`
    Firebase API Key is missing.
    Please copy the .env.local.template file to .env.local and fill in your Firebase project's configuration.
    You can get your firebaseConfig object from the Firebase console:
    Project Settings > General > Your apps > Web app.
    `);
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  try {
      enableIndexedDbPersistence(db);
  } catch (error) {
      if (error instanceof Error && 'code' in error) {
          if ((error as {code: string}).code === 'failed-precondition') {
              console.warn('Firestore persistence failed: Multiple tabs open');
          } else if ((error as {code: string}).code === 'unimplemented') {
              console.log('Firestore persistence is not available in this environment.');
          }
      } else {
          console.error("Firestore persistence error:", error);
      }
  }
}


export { app, db, storage, auth };
