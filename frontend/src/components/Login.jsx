// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import "../Styles/StylesLogin.css";

const Login = () => {
  const [message, setMessage] = useState("");
  const [awaitingGoogle, setAwaitingGoogle] = useState(false);

  const { currentUser, loginUser, signInWithGoogle, isGoogleSigningIn } =
    useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#8B5C3E",
      confirmButtonText: "مواصلة التسوق",
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

  // Email/password login
  const onSubmit = async (data) => {
    try {
      setMessage("");
      await loginUser(data.email, data.password);
      showSuccessAlert("تم تسجيل الدخول بنجاح", "أهلاً بك من جديد في  وهرة زمان.");
      navigate("/");
    } catch (error) {
      console.error(error);
      const errText =
        "تحقّق من البريد الإلكتروني أو كلمة المرور ثم حاول مرة أخرى.";
      setMessage(errText);
      showErrorAlert("خطأ في تسجيل الدخول", errText);
    }
  };

  // Google sign-in
  const handleGoogleSignIn = async (e) => {
    e?.preventDefault();
    setAwaitingGoogle(true);
    try {
      const res = await signInWithGoogle();

      if (res?.status === "cancel") {
        setAwaitingGoogle(false);
      } else if (res?.status === "ok") {
        setAwaitingGoogle(false);
        showSuccessAlert(
          "تم تسجيل الدخول باستخدام جوجل",
          "أهلاً بك في و>وهرة زمان."
        );
        navigate("/");
      } else if (res?.status === "redirect") {
        // wait for auth state after redirect
      } else {
        setAwaitingGoogle(false);
        console.warn("[Login] Unexpected Google sign-in status:", res);
      }
    } catch (error) {
      console.error(error);
      setAwaitingGoogle(false);
      showErrorAlert("تعذّر تسجيل الدخول بواسطة جوجل", "حاول مرة أخرى.");
    }
  };

  // When Google flow finishes and user exists
  useEffect(() => {
    if (awaitingGoogle && currentUser) {
      setAwaitingGoogle(false);
      showSuccessAlert(
        "تم تسجيل الدخول باستخدام جوجل",
        "أهلاً بك في و>وهرة زمان."
      );
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awaitingGoogle, currentUser]);

  const isBusy = isGoogleSigningIn || awaitingGoogle;

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <h2 className="login-title">تسجيل الدخول إلى حسابك</h2>
          <p className="login-subtitle">
            سجّل الدخول لمتابعة التسوق في و>وهرة زمان
          </p>
        </div>

        {message && (
          <p className="login-error" role="alert">
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              البريد الإلكتروني
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="input-field"
              autoComplete="email"
            />
            {errors.email && (
              <p className="error-text">البريد الإلكتروني إجباري.</p>
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
              id="password"
              placeholder="أدخل كلمة المرور"
              className="input-field"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="error-text">كلمة المرور إجبارية.</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="login-button">
            تسجيل الدخول
          </button>
        </form>

        {/* Links */}
        <p className="login-link">
          <Link to="/forgot-password" className="link-primary">
            نسيت كلمة المرور؟
          </Link>
        </p>

        <p className="login-link">
          ليس لديك حساب؟{" "}
          <Link to="/register" className="link-primary">
            إنشاء حساب جديد
          </Link>
        </p>

        {/* Divider */}
        <div className="login-divider">
          <span className="login-divider-text">أو متابعة باستخدام</span>
        </div>

        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isBusy}
          className={`google-button${isBusy ? " is-busy" : ""}`}
          aria-busy={isBusy ? "true" : "false"}
        >
          <FaGoogle className="google-icon" />
          <span>
            {isBusy
              ? "تسجيل الدخول باستخدام جوجل..."
              : "تسجيل الدخول باستخدام جوجل"}
          </span>
        </button>

        <p className="footer-text">
          ©{new Date().getFullYear()} Wahret Zmen Boutique. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
};

export default Login;
