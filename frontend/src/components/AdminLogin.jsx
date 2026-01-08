// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/StylesLogin.css";

/**
 * AdminLogin (Arabic only, no i18n)
 * ---------------------------------
 * - Simple admin login form (username + password)
 * - Uses react-hook-form for validation
 * - Calls backend: POST /api/auth/admin
 * - Stores token in localStorage and auto-expires after 1 hour
 * - SweetAlert messages in Arabic
 */
const AdminLogin = () => {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* --------------------------------
   * SweetAlert helpers
   * -------------------------------- */
  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#8B5C3E",
      confirmButtonText: "الدخول إلى لوحة التحكم",
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
      confirmButtonText: "حاول مرة أخرى",
      showClass: { popup: "animate__animated animate__shakeX" },
      hideClass: { popup: "animate__animated animate__fadeOut" },
    });
  };

  /* --------------------------------
   * Submit handler
   * -------------------------------- */
  const onSubmit = async (data) => {
    try {
      setMessage("");

      // 🔐 Authenticate admin
      const response = await axios.post(
        `${getBaseUrl()}/api/auth/admin`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const auth = response.data;

      // 💾 Save token + auto-expire after 1 hour
      if (auth.token) {
        localStorage.setItem("token", auth.token);

        setTimeout(() => {
          localStorage.removeItem("token");
          showErrorAlert(
            "انتهت الجلسة",
            "انتهت صلاحية جلسة الإدارة، يرجى تسجيل الدخول من جديد."
          );
          navigate("/");
        }, 3600 * 1000);
      }

      /// ✅ Success → go to dashboard
      showSuccessAlert("تم تسجيل الدخول", "تم تسجيل دخولك كمسؤول بنجاح");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      const errText = "اسم المستخدم أو كلمة المرور غير صحيحة.";
      setMessage(errText);
      showErrorAlert("خطأ في تسجيل الدخول", errText);
    }
  };

  /* ---------------------------------
   * Render (same CSS structure as Register.jsx)
   * -------------------------------- */
  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <h2 className="login-title">تسجيل دخول الإدارة</h2>
          <p className="login-subtitle">
            هذا القسم مخصص فقط لإدارة متجر وهرة زمان.
          </p>
        </div>

        {/* Optional inline message */}
        {message && (
          <p className="login-error" role="alert">
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {/* Username */}
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              اسم المستخدم
            </label>
            <input
              {...register("username", { required: true })}
              type="text"
              name="username"
              id="username"
              placeholder="أدخل اسم المستخدم"
              className="input-field"
              autoComplete="username"
            />
            {errors.username && (
              <p className="error-text">اسم المستخدم مطلوب.</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              كلمة المرور
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              name="password"
              id="password"
              placeholder="أدخل كلمة المرور"
              className="input-field"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="error-text">كلمة المرور مطلوبة.</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="login-button">
            دخول لوحة التحكم
          </button>
        </form>

        {/* Link back to main boutique */}
        <p className="login-link">
          العودة إلى المتجر؟{" "}
          <Link to="/" className="link-primary">
            الصفحة الرئيسية
          </Link>
        </p>

        <p className="footer-text">
          ©{new Date().getFullYear()} Wahret Zmen Boutique. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
