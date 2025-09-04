// Register.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "../Styles/StylesLogin.css";

/* =============================================================================
   📝 Register Page
   - Email/password account creation via AuthContext.registerUser
   - Google OAuth via AuthContext.signInWithGoogle
   - i18n text, RTL-safe
   - SweetAlert2 for user feedback
============================================================================= */
const Register = () => {
  // Local UI state (kept)
  const [message, setMessage] = useState("");

  // Auth
  const { registerUser, signInWithGoogle } = useAuth();

  // Router + form
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // i18n
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  // UX: ensure top of page on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ----------------------------------------
     SweetAlert helpers
  ---------------------------------------- */
  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#8B5C3E",
      confirmButtonText: t("register.continue_shopping"),
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
      confirmButtonText: t("register.try_again"),
      showClass: { popup: "animate__animated animate__shakeX" },
      hideClass: { popup: "animate__animated animate__fadeOut" },
    });
  };

  /* ----------------------------------------
     Handlers
  ---------------------------------------- */
  const onSubmit = async (data) => {
    try {
      await registerUser(data.email, data.password);
      showSuccessAlert(t("register.success_title"), t("register.success_text"));
      navigate("/");
    } catch (error) {
      showErrorAlert(t("register.error_title"), t("register.error_text"));
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showSuccessAlert(t("register.google_success_title"), t("register.success_text"));
      navigate("/");
    } catch (error) {
      showErrorAlert(t("register.google_error_title"), t("register.try_again"));
      console.error(error);
    }
  };

  /* ----------------------------------------
     Render
  ---------------------------------------- */
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F4EEE0]">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        {/* Title */}
        <h2 className="text-[#8B5C3E] text-2xl font-semibold text-center mb-4">
          {t("register.create_account")}
        </h2>

        {/* Optional top message */}
        {message && <p className="text-red-500 text-center mb-3">{message}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
              {t("register.email_label")}
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              name="email"
              id="email"
              placeholder={t("register.email_placeholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B5C3E] focus:outline-none"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{t("register.email_required")}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
              {t("register.password_label")}
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              name="password"
              id="password"
              placeholder={t("register.password_placeholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B5C3E] focus:outline-none"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{t("register.password_required")}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#8B5C3E] hover:bg-[#74452D] text-white font-semibold py-2 rounded-md transition"
          >
            {t("register.register_btn")}
          </button>
        </form>

        {/* Already have an account? */}
        <p className="text-center text-sm text-gray-700 mt-4">
          {t("register.have_account")}{" "}
          <Link to="/login" className="text-[#8B5C3E] hover:underline">
            {t("register.login_link")}
          </Link>
        </p>

        {/* Google OAuth */}
        <div className="text-center mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center items-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 rounded-md shadow-sm hover:bg-gray-100 transition"
            type="button"
          >
            <FaGoogle className="text-red-500" />
            {t("register.google_btn")}
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          ©2025 Wahret Zmen Boutique. {t("register.rights")}
        </p>
      </div>
    </div>
  );
};

export default Register;
