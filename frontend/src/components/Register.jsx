// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import "../Styles/StylesLogin.css";

const Register = () => {
  const [message, setMessage] = useState("");
  const [awaitingGoogle, setAwaitingGoogle] = useState(false);

  const { currentUser, registerUser, signInWithGoogle, isGoogleSigningIn } =
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

  // Email/password register
  const onSubmit = async (data) => {
    try {
      setMessage("");
      await registerUser(data.email, data.password);
      showSuccessAlert(
        "تم إنشاء الحساب بنجاح",
        "تم إنشاء حسابك بنجاح، مرحباً بك في  وهرة زمان"
      );
      navigate("/");
    } catch (error) {
      console.error(error);
      const errText = "حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى.";
      setMessage(errText);
      showErrorAlert("تعذّر إنشاء الحساب", errText);
    }
  };

  // Google sign-up
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
          "تم التسجيل باستخدام جوجل",
          "تم إنشاء حسابك بنجاح، مرحباً بك في وهرة زمان."
        );
        navigate("/");
      } else if (res?.status === "redirect") {
        // wait for auth state after redirect
      } else {
        setAwaitingGoogle(false);
        console.warn("[Register] Unexpected Google sign-in status:", res);
      }
    } catch (error) {
      console.error(error);
      setAwaitingGoogle(false);
      showErrorAlert("تعذّر التسجيل بواسطة جوجل", "حاول مرة أخرى.");
    }
  };

  // When Google flow finishes and user exists
  useEffect(() => {
    if (awaitingGoogle && currentUser) {
      setAwaitingGoogle(false);
      showSuccessAlert(
        "تم التسجيل باستخدام جوجل",
        "تم إنشاء حسابك بنجاح، مرحباً بك في وهرة زمان."
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
          <h2 className="login-title">إنشاء حساب جديد</h2>
          <p className="login-subtitle">
            أنشئ حسابك لمتابعة التسوق في وهرة زمان
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
              name="email"
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
              name="password"
              id="password"
              placeholder="اختر كلمة مرور"
              className="input-field"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="error-text">كلمة المرور إجبارية.</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="login-button">
            إنشاء حساب
          </button>
        </form>

        {/* Link to login */}
        <p className="login-link">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="link-primary">
            تسجيل الدخول
          </Link>
        </p>

        {/* Divider */}
        <div className="login-divider">
          <span className="login-divider-text">أو التسجيل باستخدام</span>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          disabled={isBusy}
          aria-busy={isBusy ? "true" : "false"}
          className={`google-button${isBusy ? " is-busy" : ""}`}
        >
          <FaGoogle className="google-icon" />
          <span>
            {isBusy
              ? "التسجيل باستخدام جوجل..."
              : "التسجيل باستخدام جوجل"}
          </span>
        </button>

        <p className="footer-text">
          ©{new Date().getFullYear()} Wahret Zmen Boutique. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
};

export default Register;
