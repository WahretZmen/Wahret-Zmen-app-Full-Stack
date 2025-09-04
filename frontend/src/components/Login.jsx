// Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import "../Styles/StylesLogin.css";
import { useTranslation } from "react-i18next";

/* =============================================================================
   🔐 Login Page
   - Email/password login via AuthContext.loginUser
   - Google OAuth via AuthContext.signInWithGoogle
   - i18n text & RTL-ready
   - SweetAlert2 for user feedback
============================================================================= */
const Login = () => {
  // Local UI state
  const [message, setMessage] = useState("");

  // Auth actions + Google signing state
  const { loginUser, signInWithGoogle, isGoogleSigningIn } = useAuth();

  // Router + form
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // i18n
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null; // avoid flash before i18n ready

  // UX: ensure top of page on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* -----------------------------
     SweetAlert helpers
  ----------------------------- */
  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#8B5C3E",
      confirmButtonText: t("login.continue_shopping"),
      timer: 2000,
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: t("login.try_again"),
      showClass: { popup: "animate__animated animate__shakeX" },
      hideClass: { popup: "animate__animated animate__fadeOut" },
    });
  };

  /* -----------------------------
     Handlers
  ----------------------------- */
  // Email/password submit
  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      showSuccessAlert(t("login.success_title"), t("login.success_text"));
      navigate("/");
    } catch (error) {
      showErrorAlert(t("login.error_title"), t("login.error_text"));
      console.error(error);
    }
  };

  // Google sign-in
  const handleGoogleSignIn = async (e) => {
    e?.preventDefault(); // avoid double-trigger if inside a form
    try {
      await signInWithGoogle();
      showSuccessAlert(t("login.google_success_title"), t("login.success_text"));
      navigate("/");
    } catch (error) {
      showErrorAlert(t("login.google_error_title"), t("login.try_again"));
      console.error(error);
    }
  };

  /* -----------------------------
     Render
  ----------------------------- */
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F4EEE0]">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        {/* Title */}
        <h2 className="text-[#8B5C3E] text-2xl font-semibold text-center mb-4">
          {t("login.title")}
        </h2>

        {/* Optional top message */}
        {message && <p className="text-red-500 text-center mb-3">{message}</p>}

        {/* Credentials form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
              {t("login.email_label")}
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              placeholder={t("login.email_placeholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B5C3E] focus:outline-none"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{t("login.email_required")}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
              {t("login.password_label")}
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              id="password"
              placeholder={t("login.password_placeholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B5C3E] focus:outline-none"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{t("login.password_required")}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#8B5C3E] hover:bg-[#74452D] text-white font-semibold py-2 rounded-md transition"
          >
            {t("login.login_btn")}
          </button>
        </form>

        {/* Links */}
        <p className="text-center text-sm text-gray-700 mt-3">
          <Link to="/forgot-password" className="text-[#8B5C3E] hover:underline">
            {t("login.forgot_password_link")}
          </Link>
        </p>

        <p className="text-center text-sm text-gray-700 mt-3">
          {t("login.no_account")}{" "}
          <Link to="/register" className="text-[#8B5C3E] hover:underline">
            {t("login.register_link")}
          </Link>
        </p>

        {/* Google OAuth */}
        <div className="text-center mt-4">
          <button
            type="button" // ensure not a submit
            onClick={handleGoogleSignIn}
            disabled={isGoogleSigningIn}
            className={`w-full flex justify-center items-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 rounded-md shadow-sm transition 
              ${isGoogleSigningIn ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-100"}`}
            aria-busy={isGoogleSigningIn ? "true" : "false"}
          >
            <FaGoogle className="text-red-500" />
            {isGoogleSigningIn ? t("login.google_btn") + "..." : t("login.google_btn")}
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          ©2025 Wahret Zmen Boutique. {t("login.rights")}
        </p>
      </div>
    </div>
  );
};

export default Login;
