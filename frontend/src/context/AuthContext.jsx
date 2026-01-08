// src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
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

const RESET_URL =
  import.meta.env.VITE_RESET_URL || "http://localhost:5173/reset-password";

const googleProvider = new GoogleAuthProvider();
// If you want to always force account chooser, uncomment:
// googleProvider.setCustomParameters({ prompt: "select_account" });

function mustUseRedirect() {
  if (typeof window === "undefined") return false; // SSR-safe
  const ua = navigator.userAgent || "";
  const isInApp = /FBAN|FBAV|Instagram|Line\/|Twitter|FB_IAB|Pinterest|LinkedIn/i.test(
    ua
  );
  const coopCoepActive = !!window.crossOriginIsolated; // COOP+COEP (blocks popups)
  return isInApp || coopCoepActive;
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const { t, i18n } = useTranslation();

  // Keep Firebase auth flows localized (emails, hosted pages)
  useEffect(() => {
    try {
      auth.languageCode = i18n.language || "en";
    } catch {}
  }, [i18n.language]);

  const registerUser = useCallback(
    async (email, password) =>
      createUserWithEmailAndPassword(auth, email, password),
    []
  );

  const loginUser = useCallback(
    async (email, password) =>
      signInWithEmailAndPassword(auth, email, password),
    []
  );

  /** Google OAuth with explicit status contract */
  const signInWithGoogle = useCallback(async () => {
    if (isGoogleSigningIn) return { status: "cancel" };
    setIsGoogleSigningIn(true);
    try {
      if (mustUseRedirect()) {
        await signInWithRedirect(auth, googleProvider);
        // No code after this runs on this page in most cases, but return for API symmetry
        return { status: "redirect" };
      }
      const res = await signInWithPopup(auth, googleProvider);
      return { status: "ok", user: res.user };
    } catch (err) {
      // User closed the popup or another popup already in progress
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request"
      ) {
        console.warn("[Auth] Google popup canceled/closed.");
        return { status: "cancel" };
      }
      // Configuration issue → surface as error
      if (err?.code === "auth/auth-domain-config-required") {
        console.error(
          "[Auth] authDomain missing or host not authorized. " +
            "Fix: Firebase Console → Authentication → Settings → Authorized domains."
        );
        throw err;
      }
      // Other popup failures → fallback to redirect
      console.warn(
        "[Auth] Popup failed, using redirect. Reason:",
        err?.code || err
      );
      await signInWithRedirect(auth, googleProvider);
      return { status: "redirect" };
    } finally {
      // If we actually redirect, this line is unlikely to execute — safe anyway.
      setIsGoogleSigningIn(false);
    }
  }, [isGoogleSigningIn]);

  const logout = useCallback(async () => {
    const lang = i18n.language || "ar";

    const result = await Swal.fire({
      title:
        lang === "ar"
          ? "تأكيد تسجيل الخروج"
          : lang === "fr"
          ? "Êtes-vous sûr(e) de vouloir vous déconnecter ?"
          : "Are you sure you want to log out?",
      text:
        lang === "ar"
          ? "سيتم تسجيل خروجك من حسابك، ويمكنك تسجيل الدخول مرة أخرى في أي وقت."
          : lang === "fr"
          ? "Vous allez être déconnecté(e) de votre compte. Vous pourrez vous reconnecter à tout moment."
          : "You will be logged out of your account. You can sign in again at any time.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B5C3E",
      cancelButtonColor: "#d33",
      confirmButtonText:
        lang === "ar"
          ? "نعم، قم بتسجيل الخروج"
          : lang === "fr"
          ? "Oui, déconnectez-moi"
          : "Yes, log me out",
      cancelButtonText:
        lang === "ar"
          ? "إلغاء"
          : lang === "fr"
          ? "Annuler"
          : "Cancel",
    });

    if (result.isConfirmed) {
      await signOut(auth);
      Swal.fire({
        title:
          lang === "ar"
            ? "تم تسجيل خروجك بنجاح"
            : lang === "fr"
            ? "Déconnexion réussie"
            : "Logged out successfully",
        text:
          lang === "ar"
            ? "شكرًا لزيارتك لموقعنا، نراك قريبًا بإذن الله."
            : lang === "fr"
            ? "Merci pour votre visite, à très bientôt."
            : "Thank you for visiting, see you again soon.",
        icon: "success",
        confirmButtonColor: "#8B5C3E",
        timer: 2000,
      });
    }
  }, [i18n.language]);

  const sendResetEmail = useCallback(async (email) => {
    const actionCodeSettings = { url: RESET_URL, handleCodeInApp: true };
    return await sendPasswordResetEmail(auth, email, actionCodeSettings);
  }, []);

  const verifyResetCodeWrapper = useCallback(async (oobCode) => {
    return await verifyPasswordResetCode(auth, oobCode);
  }, []);

  const confirmPasswordResetWrapper = useCallback(
    async (oobCode, newPassword) => {
      return await confirmPasswordReset(auth, oobCode, newPassword);
    },
    []
  );

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
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
  }, []);

  // Track auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Handle Google redirect completions (mobile / IAB)
  useEffect(() => {
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          // Optional: toast here if you want
        }
      } catch (err) {
        if (err?.code === "auth/auth-domain-config-required") {
          console.error(
            "[Auth] Redirect result failed: domain not authorized / authDomain missing."
          );
        } else if (err) {
          console.error("[Auth] getRedirectResult error:", err);
        }
      } finally {
        // In case we landed back still “busy”
        setIsGoogleSigningIn(false);
      }
    })();
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      registerUser,
      loginUser,
      signInWithGoogle,
      isGoogleSigningIn,
      logout,
      sendResetEmail,
      verifyResetCodeWrapper,
      confirmPasswordResetWrapper,
      changePassword,
    }),
    [
      currentUser,
      loading,
      registerUser,
      loginUser,
      signInWithGoogle,
      isGoogleSigningIn,
      logout,
      sendResetEmail,
      verifyResetCodeWrapper,
      confirmPasswordResetWrapper,
      changePassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
