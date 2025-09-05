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

// Single shared Google provider instance (optionally force account picker)
const googleProvider = new GoogleAuthProvider();
// googleProvider.setCustomParameters({ prompt: "select_account" });

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
  // Google OAuth with popup → redirect fallback
  // - Handles in-app browsers (Messenger/IG) that block popups
  // - Surfaces specific error for authDomain not configured
  // ---------------------------------------------------------------------------
  const signInWithGoogle = async () => {
    if (isGoogleSigningIn) return;
    setIsGoogleSigningIn(true);
    try {
      // 1) Try popup first for best UX on normal browsers
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

      // ❗ authDomain not configured / current host not in Authorized domains
      if (err?.code === "auth/auth-domain-config-required") {
        console.error(
          "[Auth] authDomain missing or host not authorized.\n" +
            "Fix in Firebase Console → Authentication → Settings → Authorized domains.\n" +
            "Also ensure Vercel env VITE_AUTH_DOMAIN is set and redeploy."
        );
        throw err; // Let UI show a proper alert
      }

      // 2) Fallback to redirect (works in in-app browsers that block popups)
      console.warn(
        "[Auth] signInWithPopup failed, falling back to signInWithRedirect due to:",
        err?.code || err
      );
      await signInWithRedirect(auth, googleProvider);
      // After redirect back, getRedirectResult can be handled in useEffect below.
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
  // Auth state hydration + optional redirect result handling
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // If the app returned from signInWithRedirect, this resolves the result.
  // You can hook a toast here if you want, but we keep it silent to avoid duplicate toasts.
  useEffect(() => {
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          // Optionally display a success toast here if desired
          // console.log("[Auth] Google redirect sign-in success:", result.user.email);
        }
      } catch (err) {
        // Surface specific domain error if it happens after redirect (rare)
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
