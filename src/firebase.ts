import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  databaseId: firebaseConfig.firestoreDatabaseId,
  experimentalAutoDetectLongPolling: true, // Probe for long polling if WebSockets fail
});
export const storage = getStorage(app);
