import * as firebaseApp from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, CACHE_SIZE_UNLIMITED, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA3UIywHgeGTrJAcuVKqZqpfBO_N5Vf4ws",
  authDomain: "middlepoint-f5127.firebaseapp.com",
  projectId: "middlepoint-f5127",
  storageBucket: "middlepoint-f5127.appspot.com",
  messagingSenderId: "707057089481",
  appId: "1:707057089481:web:1d83479a50cac377900618",
  measurementId: "G-D1F9H37DJX"
};

// Initialize Firebase, ensuring it's only done once.
// Fix: Using namespace import for firebase/app to fix module resolution errors.
const app = !firebaseApp.getApps().length ? firebaseApp.initializeApp(firebaseConfig) : firebaseApp.getApp();
const auth = getAuth(app);

// Initialize Firestore with settings for offline persistence and cache size.
const db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

// Enable multi-tab persistence to keep data in sync across tabs and support offline.
enableMultiTabIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence initialization failed: Another tab might be open.', err);
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence is not supported in this browser.', err);
    }
  });


export { auth, db, app };