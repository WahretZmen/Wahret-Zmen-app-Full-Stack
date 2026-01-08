// src/pages/products/ChangePassword.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";
import "../../../Styles/StylesLogin.css";

const ChangePassword = () => {
  const { changePassword, currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const isPasswordAccount = currentUser?.providerData?.some(
    (p) => p.providerId === "password"
  );

  const Toggle = ({ onClick, label }) => (
    <span
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className="input-toggle"
      aria-label={label}
    >
      {label}
    </span>
  );

  const onSubmit = async ({ currentPassword, newPassword, confirmPassword }) => {
    const curr = (currentPassword || "").trim();
    const next = (newPassword || "").trim();
    const conf = (confirmPassword || "").trim();

    if (!curr || !next) {
      return Swal.fire({
        title: "خطأ",
        text: "تعذّر تغيير كلمة المرور. يرجى التأكد من كلمة المرور الحالية والمحاولة مرة أخرى.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }

    if (next !== conf) {
      return Swal.fire({
        title: "عدم تطابق كلمة المرور",
        text: "كلمة المرور الجديدة وتأكيدها غير متطابقين.",
        icon: "warning",
        confirmButtonColor: "#8B5C3E",
      });
    }

    try {
      await changePassword({ currentPassword: curr, newPassword: next });
      reset();
      Swal.fire({
        title: "تم تغيير كلمة المرور",
        text: "تم تحديث كلمة المرور الخاصة بك بنجاح.",
        icon: "success",
        confirmButtonColor: "#8B5C3E",
      });
    } catch (err) {
      console.error(err);
      const code = err?.code || "";

      let msg =
        "تعذّر تغيير كلمة المرور. يرجى التأكد من كلمة المرور الحالية والمحاولة مرة أخرى.";

      if (code === "auth/missing-password") {
        msg = "كلمة المرور الحالية مطلوبة.";
      } else if (
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        msg = "كلمة المرور الحالية غير صحيحة.";
      } else if (code === "auth/too-many-requests") {
        msg = "محاولات كثيرة. يرجى المحاولة لاحقًا.";
      } else if (code === "auth/provider-not-password") {
        msg =
          "حسابك مسجّل عبر Google أو مزود آخر، وتغيير كلمة المرور متاح فقط لحسابات البريد/كلمة المرور.";
      } else if (code === "auth/requires-recent-login") {
        msg = "لأسباب أمنية، يرجى تسجيل الدخول مرة أخرى ثم إعادة المحاولة.";
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
          <h2 className="login-title">تغيير كلمة المرور</h2>
          <p className="login-subtitle">
            حدّث كلمة المرور لحسابك بكل أمان
          </p>
        </div>

        {!isPasswordAccount ? (
          <div className="info-box">
            حسابك مسجّل عبر Google أو مزود آخر. تغيير كلمة المرور متاح فقط
            للحسابات التي تستخدم البريد الإلكتروني وكلمة المرور.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            {/* Current */}
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">
                كلمة المرور الحالية
              </label>

              <div className="input-wrap">
                <input
                  {...register("currentPassword", { required: true })}
                  type={showCurr ? "text" : "password"}
                  id="currentPassword"
                  autoComplete="current-password"
                  dir="ltr"
                  placeholder="أدخل كلمة المرور الحالية"
                  className="input-field"
                />
                <Toggle
                  onClick={() => setShowCurr((v) => !v)}
                  label={showCurr ? "إخفاء" : "إظهار"}
                />
              </div>

              {errors.currentPassword && (
                <p className="error-text">كلمة المرور الحالية مطلوبة.</p>
              )}
            </div>

            {/* New */}
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">
                كلمة المرور الجديدة
              </label>

              <div className="input-wrap">
                <input
                  {...register("newPassword", { required: true, minLength: 6 })}
                  type={showNew ? "text" : "password"}
                  id="newPassword"
                  autoComplete="new-password"
                  dir="ltr"
                  placeholder="أدخل كلمة المرور الجديدة (على الأقل 6 أحرف)"
                  className="input-field"
                />
                <Toggle
                  onClick={() => setShowNew((v) => !v)}
                  label={showNew ? "إخفاء" : "إظهار"}
                />
              </div>

              {errors.newPassword?.type === "required" && (
                <p className="error-text">كلمة المرور الجديدة مطلوبة.</p>
              )}
              {errors.newPassword?.type === "minLength" && (
                <p className="error-text">
                  يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.
                </p>
              )}
            </div>

            {/* Confirm */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                تأكيد كلمة المرور الجديدة
              </label>

              <div className="input-wrap">
                <input
                  {...register("confirmPassword", {
                    required: true,
                    validate: (val) => val === watch("newPassword"),
                  })}
                  type={showConf ? "text" : "password"}
                  id="confirmPassword"
                  autoComplete="new-password"
                  dir="ltr"
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  className="input-field"
                />
                <Toggle
                  onClick={() => setShowConf((v) => !v)}
                  label={showConf ? "إخفاء" : "إظهار"}
                />
              </div>

              {errors.confirmPassword?.type === "required" && (
                <p className="error-text">تأكيد كلمة المرور مطلوب.</p>
              )}
              {errors.confirmPassword?.type === "validate" && (
                <p className="error-text">
                  كلمة المرور الجديدة وتأكيدها غير متطابقين.
                </p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="login-button">
              {isSubmitting ? "جارٍ المعالجة..." : "تحديث كلمة المرور"}
            </button>
          </form>
        )}

        <p className="footer-text">
          ©{new Date().getFullYear()} Wahret Zmen Boutique. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;
