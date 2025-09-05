// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import "../Styles/StylesLogin.css";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [message, setMessage] = useState("");
  const [awaitingGoogle, setAwaitingGoogle] = useState(false);

  const { currentUser, loginUser, signInWithGoogle, isGoogleSigningIn } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title, text, icon: "success",
      confirmButtonColor: "#8B5C3E",
      confirmButtonText: t("login.continue_shopping"),
      timer: 2000,
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title, text, icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: t("login.try_again"),
      showClass: { popup: "animate__animated animate__shakeX" },
      hideClass: { popup: "animate__animated animate__fadeOut" },
    });
  };

  // Email/password flow can still toast immediately (Firebase resolves synchronously)
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

  // Google sign-in: no success toast here; we defer to auth state
  const handleGoogleSignIn = async (e) => {
    e?.preventDefault();
    setAwaitingGoogle(true);
    try {
      const res = await signInWithGoogle();
      if (res?.status === "cancel") {
        setAwaitingGoogle(false); // user closed popup → stop waiting; no toast
      } else if (res?.status === "ok") {
        // Popup returned a user immediately (desktop browsers). Auth state will follow,
        // but we can finish now to keep UX snappy.
        setAwaitingGoogle(false);
        showSuccessAlert(t("login.google_success_title"), t("login.success_text"));
        navigate("/");
      } else if (res?.status === "redirect") {
        // Keep awaiting; after redirect back, auth state effect below will fire.
      } else {
        // Unknown outcome: stop waiting silently
        setAwaitingGoogle(false);
        console.warn("[Login] Unexpected Google sign-in status:", res);
      }
    } catch (error) {
      setAwaitingGoogle(false);
      showErrorAlert(t("login.google_error_title"), t("login.try_again"));
      console.error(error);
    }
  };

  // Only show success after Google if we were awaiting and a user actually appeared
  useEffect(() => {
    if (awaitingGoogle && currentUser) {
      setAwaitingGoogle(false);
      showSuccessAlert(t("login.google_success_title"), t("login.success_text"));
      navigate("/");
    }
  }, [awaitingGoogle, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F4EEE0]">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-[#8B5C3E] text-2xl font-semibold text-center mb-4">
          {t("login.title")}
        </h2>

        {message && <p className="text-red-500 text-center mb-3">{message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {errors.email && <p className="text-red-500 text-sm">{t("login.email_required")}</p>}
          </div>

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
            {errors.password && <p className="text-red-500 text-sm">{t("login.password_required")}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#8B5C3E] hover:bg-[#74452D] text-white font-semibold py-2 rounded-md transition"
          >
            {t("login.login_btn")}
          </button>
        </form>

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

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSigningIn || awaitingGoogle}
            className={`w-full flex justify-center items-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 rounded-md shadow-sm transition ${
              isGoogleSigningIn || awaitingGoogle ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
            aria-busy={isGoogleSigningIn || awaitingGoogle ? "true" : "false"}
          >
            <FaGoogle className="text-red-500" />
            {(isGoogleSigningIn || awaitingGoogle) ? t("login.google_btn") + "..." : t("login.google_btn")}
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          ©2025 Wahret Zmen Boutique. {t("login.rights")}
        </p>
      </div>
    </div>
  );
};

export default Login;
