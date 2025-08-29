import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  // Forgot/Reset password
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  // Change password
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// You can override via Vite env if needed:
// VITE_RESET_URL=https://your-domain.com/reset-password
const RESET_URL =
  import.meta.env.VITE_RESET_URL || "http://localhost:5173/reset-password";

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  // ---------- Basic auth ----------
  const registerUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
  };

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

  // ---------- Forgot / Reset password ----------
  /**
   * Sends a reset email that opens YOUR React route:
   * http://localhost:5173/reset-password?mode=resetPassword&oobCode=...
   */
  const sendResetEmail = async (email) => {
    const actionCodeSettings = {
      url: RESET_URL, // must be an authorized domain in Firebase Auth settings
      handleCodeInApp: true,
    };
    return await sendPasswordResetEmail(auth, email, actionCodeSettings);
  };

  /** Verifies the reset oobCode and returns the email address */
  const verifyResetCodeWrapper = async (oobCode) => {
    return await verifyPasswordResetCode(auth, oobCode);
  };

  /** Confirms the password reset with oobCode + new password */
  const confirmPasswordResetWrapper = async (oobCode, newPassword) => {
    return await confirmPasswordReset(auth, oobCode, newPassword);
  };

  // ---------- Change password (re-authenticate then update) ----------
  /**
   * changePassword({ currentPassword, newPassword })
   * Guards against: missing fields, non-password accounts, etc.
   */
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

    // Only for email/password accounts
    const isPasswordAccount = user.providerData?.some(
      (p) => p.providerId === "password"
    );
    if (!isPasswordAccount) {
      const e = new Error("Not a password account");
      e.code = "auth/provider-not-password";
      throw e;
    }

    // Re-authenticate before sensitive action
    const cred = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, cred);

    // Update to the new password
    await updatePassword(user, newPassword);
  };

  // ---------- Auth state listener ----------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    // basic
    registerUser,
    loginUser,
    signInWithGoogle,
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
