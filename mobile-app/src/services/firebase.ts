/**
 * Firebase Service Stub
 *
 * TODO: Replace placeholder config values with your actual Firebase project credentials.
 * Get them from: https://console.firebase.google.com → Project Settings → Your apps → SDK setup
 *
 * TODO (Post-MVP): Uncomment and wire up the Realtime Database reads/writes
 * for active_jeeps and waiting_passengers nodes.
 *
 * Proposed DB schema:
 * {
 *   "users": {
 *     "user_id_123": { "role": "passenger", "name": "Juan" },
 *     "driver_id_456": { "role": "jeep_driver", "route": "Dagupan-Manaoag", "plate": "ABC1234" }
 *   },
 *   "active_jeeps": {
 *     "driver_id_456": {
 *       "lat": 16.0433, "lng": 120.3333, "heading": 90,
 *       "status": "seats_available", "timestamp": 1715000000
 *     }
 *   },
 *   "waiting_passengers": {
 *     "user_id_123": { "lat": 16.0450, "lng": 120.3350, "route_needed": "Dagupan-Manaoag" }
 *   }
 * }
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// TODO: Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  databaseURL: 'https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

let app: FirebaseApp;
let db: Database;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

db = getDatabase(app);

export { app, db };

// TODO (Post-MVP): Implement these functions
// export const broadcastDriverLocation = async (driverId: string, location: DriverLocation) => { ... }
// export const listenToActiveJeeps = (callback: (jeeps: ActiveJeep[]) => void) => { ... }
// export const setWaitingPassenger = async (userId: string, pin: LatLng, routeNeeded: string) => { ... }
