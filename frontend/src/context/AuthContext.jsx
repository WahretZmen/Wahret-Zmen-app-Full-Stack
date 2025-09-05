// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Password-reset redirect URL (handled by your app’s route)
const RESET_URL =
  import.meta.env.VITE_RESET_URL || "http://localhost:5173/reset-password";

// Single shared Google provider instance
const googleProvider = new GoogleAuthProvider();
// Optional: force account picker
// googleProvider.setCustomParameters({ prompt: "select_account" });

/** Detect contexts where popups are unreliable:
 *  - In-app browsers (FB/IG/Twitter, etc.)
 *  - COOP/COEP active (crossOriginIsolated = true)
 */
function mustUseRedirect() {
  const ua = navigator.userAgent || "";
  const isInApp = /FBAN|FBAV|Instagram|Line\/|Twitter|FB_IAB|Pinterest|LinkedIn/i.test(ua);
  const coopCoepActive = !!window.crossOriginIsolated;
  return isInApp || coopCoepActive;
}

export const AuthProvider = ({ children }) => {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // hydration flag
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false); // popup guard
  const { t, i18n } = useTranslation();

  // ---------------------------------------------------------------------------
  // Basic email/password auth
  // ---------------------------------------------------------------------------
  const registerUser = async (email, password) =>
    await createUserWithEmailAndPassword(auth, email, password);

  const loginUser = async (email, password) =>
    await signInWithEmailAndPassword(auth, email, password);

  // ---------------------------------------------------------------------------
  // Google OAuth with smart popup → redirect strategy
  // - Uses redirect automatically in COOP/COEP or in-app browsers
  // - Falls back to redirect on popup failures
  // ---------------------------------------------------------------------------
  const signInWithGoogle = async () => {
    if (isGoogleSigningIn) return;
    setIsGoogleSigningIn(true);
    try {
      if (mustUseRedirect()) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      // Try popup first for best UX on normal browsers
      const res = await signInWithPopup(auth, googleProvider);
      return res;
    } catch (err) {
      // Expected user-cancel flows
      if (err?.code === "auth/popup-closed-by-user") {
        console.warn("[Auth] Google popup closed by user.");
        return;
      }
      if (err?.code === "auth/cancelled-popup-request") {
        console.warn("[Auth] Another sign-in already in progress.");
        return;
      }

      // Domain misconfig (keep loud for debugging)
      if (err?.code === "auth/auth-domain-config-required") {
        console.error(
          "[Auth] authDomain missing or host not authorized.\n" +
            "Fix: Firebase Console → Authentication → Settings → Authorized domains.\n" +
            "Also ensure Vercel env VITE_AUTH_DOMAIN is set and redeploy."
        );
        throw err; // surface to UI toast
      }

      // Any other popup failure → fallback to redirect
      console.warn(
        "[Auth] signInWithPopup failed; falling back to signInWithRedirect. Reason:",
        err?.code || err
      );
      await signInWithRedirect(auth, googleProvider);
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Logout with localized confirmation
  // ---------------------------------------------------------------------------
  const logout = async () => {
    const result = await Swal.fire({
      title:
        i18n.language === "ar"
          ? "هل أنت متأكد؟"
          : i18n.language === "fr"
          ? "Êtes-vous sûr(e) ?"
          : "Are you sure?",
      text:
        i18n.language === "ar"
          ? "سيتم تسجيل خروجك من الحساب."
          : i18n.language === "fr"
          ? "Vous serez déconnecté(e) de votre compte."
          : "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B5C3E",
      cancelButtonColor: "#d33",
      confirmButtonText:
        i18n.language === "ar"
          ? "نعم، تسجيل الخروج!"
          : i18n.language === "fr"
          ? "Oui, déconnectez-moi !"
          : "Yes, Logout!",
    });

    if (result.isConfirmed) {
      await signOut(auth);
      Swal.fire({
        title:
          i18n.language === "ar"
            ? "تم تسجيل الخروج!"
            : i18n.language === "fr"
            ? "Déconnecté(e) !"
            : "Logged Out!",
        text:
          i18n.language === "ar"
            ? "لقد تم تسجيل خروجك بنجاح."
            : i18n.language === "fr"
            ? "Vous avez été déconnecté(e) avec succès."
            : "You have been successfully logged out.",
        icon: "success",
        confirmButtonColor: "#8B5C3E",
        timer: 2000,
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Forgot / Reset password
  // ---------------------------------------------------------------------------
  const sendResetEmail = async (email) => {
    const actionCodeSettings = { url: RESET_URL, handleCodeInApp: true };
    return await sendPasswordResetEmail(auth, email, actionCodeSettings);
  };

  const verifyResetCodeWrapper = async (oobCode) =>
    await verifyPasswordResetCode(auth, oobCode);

  const confirmPasswordResetWrapper = async (oobCode, newPassword) =>
    await confirmPasswordReset(auth, oobCode, newPassword);

  // ---------------------------------------------------------------------------
  // Change password (reauthenticate required)
  // Only for users with "password" provider
  // ---------------------------------------------------------------------------
  const changePassword = async ({ currentPassword, newPassword }) => {
    const user = auth.currentUser;
    if (!user) {
      const e = new Error("No current user");
      e.code = "auth/no-current-user";
      throw e;
    }
    if (!currentPassword || !newPassword) {
      const e = new Error("Missing password");
      e.code = "auth/missing-password";
      throw e;
    }
    const isPasswordAccount = user.providerData?.some(
      (p) => p.providerId === "password"
    );
    if (!isPasswordAccount) {
      const e = new Error("Not a password account");
      e.code = "auth/provider-not-password";
      throw e;
    }
    const cred = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, newPassword);
  };

  // ---------------------------------------------------------------------------
  // Auth state hydration
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // If the app returned from signInWithRedirect, resolve result once.
  useEffect(() => {
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          // Optional: toast success here if you want
          // console.log("[Auth] Google redirect sign-in success:", result.user.email);
        }
      } catch (err) {
        if (err?.code === "auth/auth-domain-config-required") {
          console.error(
            "[Auth] Redirect result failed: domain not authorized / authDomain missing."
          );
        } else if (err) {
          console.error("[Auth] getRedirectResult error:", err);
        }
      }
    })();
  }, []);

  // ---------------------------------------------------------------------------
  // Context value
  // ---------------------------------------------------------------------------
  const value = {
    currentUser,
    loading,
    // email/password
    registerUser,
    loginUser,
    // google
    signInWithGoogle,
    isGoogleSigningIn,
    // logout
    logout,
    // reset password
    sendResetEmail,
    verifyResetCodeWrapper,
    confirmPasswordResetWrapper,
    // change password
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
