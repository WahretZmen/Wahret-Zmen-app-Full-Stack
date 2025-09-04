// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";
import { useNavigate } from "react-router-dom";
import "../Styles/StylesAdminLogin.css";
import { useTranslation } from "react-i18next";

/**
 * AdminLogin
 * ----------------------------
 * - Multilingual admin login form (username + password)
 * - Uses react-hook-form for validation
 * - Calls backend: POST /api/auth/admin
 * - Stores token in localStorage and auto-expires after 1 hour
 * - Shows SweetAlert success/error messages
 * - Supports RTL (Arabic) layout
 */
const AdminLogin = () => {
  /* --------------------------------
   * i18n / form / router / local UI
   * -------------------------------- */
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;
  const isRTL = i18n.language === "ar";

  /* --------------------------------
   * SweetAlert helpers
   * -------------------------------- */
  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#8B5C3E",
      confirmButtonText: t("admin.enter_dashboard"),
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
      confirmButtonText: t("admin.try_again"),
      showClass: { popup: "animate__animated animate__shakeX" },
      hideClass: { popup: "animate__animated animate__fadeOut" },
    });
  };

  /* --------------------------------
   * Submit handler
   * -------------------------------- */
  const onSubmit = async (data) => {
    try {
      // 🔐 Authenticate admin
      const response = await axios.post(`${getBaseUrl()}/api/auth/admin`, data, {
        headers: { "Content-Type": "application/json" },
      });
      const auth = response.data;

      // 💾 Save token + auto-expire after 1 hour
      if (auth.token) {
        localStorage.setItem("token", auth.token);

        setTimeout(() => {
          localStorage.removeItem("token");
          showErrorAlert(
            t("admin.session_expired_title"),
            t("admin.session_expired_text")
          );
          navigate("/");
        }, 3600 * 1000);
      }

      // ✅ Success → go to dashboard
      showSuccessAlert(t("admin.success_title"), t("admin.success_text"));
      navigate("/dashboard");
    } catch (error) {
      // ❌ Error → show alert
      showErrorAlert(t("admin.error_title"), t("admin.error_text"));
      console.error(error);
    }
  };

  /* --------------------------------
   * Render
   * -------------------------------- */
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      lang={i18n.language}
      className="flex justify-center items-center min-h-screen bg-[#F4EEE0]"
    >
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-[#8B5C3E] text-2xl font-semibold text-center mb-4">
          {t("admin.title")}
        </h2>

        {/* Optional inline message (kept from your original) */}
        {message && <p className="text-red-500 text-center mb-3">{message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className={isRTL ? "text-right" : "text-left"}>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="username">
              {t("admin.username_label")}
            </label>
            <input
              {...register("username", { required: true })}
              type="text"
              name="username"
              id="username"
              placeholder={t("admin.username_placeholder")}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B5C3E] focus:outline-none ${
                isRTL ? "text-right" : "text-left"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{t("admin.username_required")}</p>
            )}
          </div>

          {/* Password */}
          <div className={isRTL ? "text-right" : "text-left"}>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
              {t("admin.password_label")}
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              name="password"
              id="password"
              placeholder={t("admin.password_placeholder")}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B5C3E] focus:outline-none ${
                isRTL ? "text-right" : "text-left"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{t("admin.password_required")}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#8B5C3E] hover:bg-[#74452D] text-white font-semibold py-2 rounded-md transition"
          >
            {t("admin.login_btn")}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          ©2025 Wahret Zmen Boutique. {t("admin.rights")}
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
