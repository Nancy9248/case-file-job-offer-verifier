import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  where,
} from 'firebase/firestore'

// These values come from your Firebase project settings.
// See FIREBASE_SETUP.md for how to get them, and .env.example for
// where they go. Never commit real values — .env is gitignored.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let app, auth, db

if (firebaseEnabled) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
}

// Resolves once an anonymous user id is available. If Firebase isn't
// configured yet, resolves to null and the app falls back to
// localStorage-only mode (see lib/storage.js).
export function getUserId() {
  return new Promise((resolve) => {
    if (!firebaseEnabled) return resolve(null)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid)
      } else {
        signInAnonymously(auth)
          .then((cred) => resolve(cred.user.uid))
          .catch(() => resolve(null))
      }
    })
  })
}

export async function saveScan(scan) {
  if (!firebaseEnabled) return null
  return addDoc(collection(db, 'scans'), {
    ...scan,
    createdAt: serverTimestamp(),
  })
}

export function subscribeToUserHistory(uid, callback) {
  if (!firebaseEnabled || !uid) return () => {}
  const q = query(
    collection(db, 'scans'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export async function saveReport(report) {
  if (!firebaseEnabled) return null
  return addDoc(collection(db, 'reports'), {
    ...report,
    createdAt: serverTimestamp(),
  })
}

export function subscribeToReports(callback) {
  if (!firebaseEnabled) return () => {}
  const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(50))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}
