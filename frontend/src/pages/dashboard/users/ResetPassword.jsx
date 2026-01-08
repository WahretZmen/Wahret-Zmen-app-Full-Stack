// src/pages/.../ResetPassword.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // path from /pages/products/
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import "../../../Styles/StylesLogin.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  const navigate = useNavigate();
  const { verifyResetCodeWrapper, confirmPasswordResetWrapper } = useAuth();

  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Verify the reset code on mount
  useEffect(() => {
    const verify = async () => {
      try {
        if (mode !== "resetPassword" || !oobCode) {
          throw new Error("invalid_link");
        }
        const emailFromCode = await verifyResetCodeWrapper(oobCode);
        setEmail(emailFromCode || "");
      } catch (err) {
        Swal.fire({
          title: "رابط غير صالح",
          text: "رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية.",
          icon: "error",
          confirmButtonColor: "#d33",
        }).then(() => navigate("/forgot-password"));
      } finally {
        setVerifying(false);
      }
    };
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, oobCode]);

  const onSubmit = async ({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      return Swal.fire({
        title: "عدم تطابق كلمة المرور",
        text: "كلمة المرور وتأكيدها غير متطابقين.",
        icon: "warning",
        confirmButtonColor: "#8B5C3E",
      });
    }
    try {
      setSubmitting(true);
      await confirmPasswordResetWrapper(oobCode, password);
      await Swal.fire({
        title: "تم تغيير كلمة المرور",
        text: "تم تحديث كلمة المرور الخاصة بك بنجاح. يمكنك الآن تسجيل الدخول.",
        icon: "success",
        confirmButtonColor: "#8B5C3E",
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "خطأ في تغيير كلمة المرور",
        text: "تعذّر تغيير كلمة المرور، يرجى المحاولة مرة أخرى.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <div className="login-page" dir="rtl">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">
              جارٍ التحقق من رابط إعادة التعيين...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <h2 className="login-title">إعادة تعيين كلمة المرور</h2>
          <p className="login-subtitle">
            أدخل كلمة المرور الجديدة لحسابك في وهرة زمان
          </p>
        </div>

        {email && (
          <p className="login-link" style={{ marginTop: "0", marginBottom: "0.75rem" }}>
            إعادة تعيين كلمة المرور للبريد:{" "}
            <span className="link-primary" style={{ wordBreak: "break-all" }}>
              {email}
            </span>
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {/* New password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              كلمة المرور الجديدة
            </label>
            <input
              {...register("password", { required: true, minLength: 6 })}
              type="password"
              id="password"
              placeholder="أدخل كلمة المرور الجديدة (على الأقل 6 أحرف)"
              className="input-field"
            />
            {errors.password?.type === "required" && (
              <p className="error-text">كلمة المرور الجديدة مطلوبة.</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="error-text">
                يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              تأكيد كلمة المرور الجديدة
            </label>
            <input
              {...register("confirmPassword", {
                required: true,
                validate: (val) => val === watch("password"),
              })}
              type="password"
              id="confirmPassword"
              placeholder="أعد إدخال كلمة المرور الجديدة"
              className="input-field"
            />
            {errors.confirmPassword?.type === "required" && (
              <p className="error-text">تأكيد كلمة المرور مطلوب.</p>
            )}
            {errors.confirmPassword?.type === "validate" && (
              <p className="error-text">
                كلمة المرور وتأكيدها غير متطابقين.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="login-button"
          >
            {submitting ? "جارٍ المعالجة..." : "تأكيد كلمة المرور الجديدة"}
          </button>
        </form>

        {/* Links */}
        <p className="login-link">
          <Link to="/login" className="link-primary">
            العودة إلى تسجيل الدخول
          </Link>
        </p>

        <p className="footer-text">
          ©{new Date().getFullYear()} Wahret Zmen Boutique. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
