// src/firebase/firebase.config.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,   // <- REQUIRED
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDERID,
  appId: import.meta.env.VITE_APPID,
};

// Helpful diagnostics in case envs are missing in a deployed build
if (!firebaseConfig.authDomain) {
  console.warn(
    "[Firebase] Missing VITE_AUTH_DOMAIN. Current host:",
    window?.location?.host
  );
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
