# Firebase Setup

This app works standalone with localStorage (no setup needed), but for Stage 2
you'll want real shared/cross-device data — that means connecting Firebase.
Takes about 10 minutes.

## 1. Create a Firebase project
1. Go to https://console.firebase.google.com
2. Click **Add project** → name it (e.g. `case-file-verifier`) → follow the prompts
   (you can disable Google Analytics for this project, not needed)

## 2. Register a web app
1. In your new project, click the **web icon (`</>`)** on the project overview page
2. Give it a nickname (e.g. `case-file-web`) — no need to set up Hosting here
3. Firebase will show you a `firebaseConfig` object with your keys — copy these

## 3. Fill in your `.env` file
1. In the project folder, copy `.env.example` to a new file named `.env`
2. Paste in the matching values from the config Firebase showed you:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=case-file-verifier.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=case-file-verifier
VITE_FIREBASE_STORAGE_BUCKET=case-file-verifier.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

`.env` is already in `.gitignore` — it will not be committed to GitHub.

## 4. Enable Anonymous Authentication
1. In the Firebase console, go to **Build → Authentication**
2. Click **Get started**
3. Under **Sign-in method**, enable **Anonymous**

This lets the app track "your" case history without requiring a login screen —
each browser gets a silent anonymous user ID.

## 5. Create a Firestore database
1. Go to **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** for now (fine for a hackathon demo — see the
   security note below for what to do if you have extra time)
4. Pick a location close to your users (e.g. `asia-south1` for India)

## 6. (Optional but recommended) Tighten security rules
Test mode allows anyone to read/write anything, which is fine for a demo but
worth tightening if you have 10 spare minutes. In **Firestore → Rules**, replace
with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scans/{scanId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
    match /reports/{reportId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```

This means: anyone can read community reports (they're meant to be public),
but only the user who created a scan can read their own scan history, and you
must be signed in (even anonymously) to write anything.

## 7. Run the app
```bash
npm install
npm run dev
```

If `.env` is filled in correctly, you'll stop seeing the "Running in local
mode" banner on the Scan page, and reports/history will sync live through
Firestore.

## Troubleshooting
- **Still seeing "local mode" banner** → double check `.env` is in the project
  root (same folder as `package.json`), and restart `npm run dev` after
  editing it — Vite only reads `.env` at startup.
- **"Missing or insufficient permissions" error** → you likely skipped step 4
  (enabling Anonymous auth) or are using the tightened rules from step 6
  without being signed in.
