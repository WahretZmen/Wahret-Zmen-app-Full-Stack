// src/firebase/firebase.config.js
// ============================================================================
// 🔥 Firebase Configuration
// - Uses Vite environment variables (⚠️ case-sensitive!)
// - Initializes Firebase app + Auth instance
// ============================================================================

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ⚠️ Ensure your `.env` file has EXACT keys, e.g.:
//   VITE_API_KEY=xxxx
//   VITE_AUTH_DOMAIN=xxxx.firebaseapp.com
//   VITE_PROJECT_ID=xxxx
//   VITE_STORAGE_BUCKET=xxxx.appspot.com
//   VITE_MESSAGING_SENDERID=xxxx
//   VITE_APPID=xxxx

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDERID,
  appId: import.meta.env.VITE_APPID,
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Auth instance (used throughout app)
export const auth = getAuth(app);
