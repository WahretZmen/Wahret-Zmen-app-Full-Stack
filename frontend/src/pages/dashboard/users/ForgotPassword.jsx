// src/pages/.../ForgotPassword.jsx
import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";
import "../../../Styles/StylesLogin.css";

const ForgotPassword = () => {
  const { sendResetEmail } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      await sendResetEmail(email.trim());
      reset();
      Swal.fire({
        title: "تم إرسال البريد الإلكتروني",
        text: "قمنا بإرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد (والبريد غير الهام).",
        icon: "success",
        confirmButtonColor: "#8B5C3E",
      });
    } catch (err) {
      console.error(err);
      let msg =
        "تعذّر إرسال رابط إعادة التعيين. يرجى المحاولة مرة أخرى.";

      const code = err?.code || "";
      if (code === "auth/invalid-email") {
        msg = "عنوان البريد الإلكتروني غير صالح.";
      } else if (code === "auth/user-not-found") {
        msg = "لا يوجد حساب مرتبط بهذا البريد الإلكتروني.";
      } else if (code === "auth/too-many-requests") {
        msg = "محاولات كثيرة. يرجى المحاولة لاحقًا.";
      }

      Swal.fire({
        title: "خطأ",
        text: msg,
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <h2 className="login-title">نسيت كلمة المرور</h2>
          <p className="login-subtitle">
            أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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
              dir="ltr"
            />
            {errors.email && (
              <p className="error-text">البريد الإلكتروني إجباري.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="login-button"
          >
            {isSubmitting ? "جارٍ الإرسال..." : "إرسال رابط إعادة التعيين"}
          </button>
        </form>

        <p className="footer-text">
          ©{new Date().getFullYear()} Wahret Zmen Boutique. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
