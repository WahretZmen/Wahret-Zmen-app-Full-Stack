import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

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
    registerUser,
    loginUser,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
