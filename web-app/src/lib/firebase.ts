/**
 * Firebase Client Configuration - Client Only Version
 */

export const dynamic = 'force-dynamic';

export interface DriverLocation {
  lat: number;
  lng: number;
  heading: number;
  status?: string;
  timestamp: number;
}

export interface WaitingPassenger {
  lat: number;
  lng: number;
  route_needed?: string;
}

type Unsubscribe = () => void;
type DataCallback = (data: Record<string, unknown>) => void;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT_ID.firebaseapp.com',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

interface FirebaseSnapshot {
  val: () => Record<string, unknown>;
}

let dbRef: {
  activeJeeps: unknown;
  waitingPassengers: unknown;
} | null = null;
let firebaseReady = false;
let onValueFn: ((ref: unknown, callback: (snapshot: FirebaseSnapshot) => void) => void) | null = null;

async function initFirebase(): Promise<void> {
  if (firebaseReady) return;
  
  const { initializeApp, getApps } = await import('firebase/app');
  const { getDatabase, ref, onValue } = await import('firebase/database');
  
  let app;
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  const db = getDatabase(app);
  dbRef = {
    activeJeeps: ref(db, 'active_jeeps'),
    waitingPassengers: ref(db, 'waiting_passengers'),
  };
  
  onValueFn = onValue as typeof onValueFn;
  firebaseReady = true;
}

export const subscribeToActiveJeeps = async (callback: DataCallback): Promise<Unsubscribe> => {
  await initFirebase();
  if (!dbRef || !onValueFn) return () => {};
  
  const listener = (snapshot: FirebaseSnapshot) => {
    const val = snapshot.val();
    callback(val || {});
  };
  
  onValueFn(dbRef.activeJeeps, listener);
  return () => {};
};

export const subscribeToWaitingPassengers = async (callback: DataCallback): Promise<Unsubscribe> => {
  await initFirebase();
  if (!dbRef || !onValueFn) return () => {};
  
  const listener = (snapshot: FirebaseSnapshot) => {
    const val = snapshot.val();
    callback(val || {});
  };
  
  onValueFn(dbRef.waitingPassengers, listener);
  return () => {};
};
