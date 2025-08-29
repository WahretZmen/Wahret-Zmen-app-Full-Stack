// src/pages/products/ChangePassword.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const { changePassword, currentUser } = useAuth();
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  const isRTL = i18n.dir() === "rtl";

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

  const Toggle = ({ onClick, label }) => (
    <span
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-sm text-[#8B5C3E] cursor-pointer select-none`}
      aria-label={label}
    >
      {label}
    </span>
  );

  const onSubmit = async ({ currentPassword, newPassword, confirmPassword }) => {
    currentPassword = (currentPassword || "").trim();
    newPassword = (newPassword || "").trim();
    confirmPassword = (confirmPassword || "").trim();

    if (!currentPassword || !newPassword) {
      return Swal.fire({
        title: t("changePassword.error_title", "Error"),
        text: t(
          "changePassword.error_text",
          "We couldn’t change your password. Please check your current password and try again."
        ),
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire({
        title: t("reset.mismatch_title"),
        text: t("reset.mismatch_text"),
        icon: "warning",
        confirmButtonColor: "#8B5C3E",
      });
    }

    try {
      await changePassword({ currentPassword, newPassword });
      reset();
      Swal.fire({
        title: t("changePassword.success_title", "Password changed"),
        text: t(
          "changePassword.success_text",
          "Your password has been updated successfully."
        ),
        icon: "success",
        confirmButtonColor: "#8B5C3E",
      });
    } catch (err) {
      console.error(err);
      const code = err?.code || "";

      let msg =
        t(
          "changePassword.error_text",
          "We couldn’t change your password. Please check your current password and try again."
        ) || "Failed to change password.";

      if (code === "auth/missing-password") {
        msg =
          t("changePassword.current_required", "Current password is required.") ||
          msg;
      } else if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        msg =
          t("changePassword.wrong_current", "The current password is incorrect.") ||
          msg;
      } else if (code === "auth/too-many-requests") {
        msg =
          t("changePassword.too_many_requests", "Too many attempts. Please try again later.") ||
          msg;
      } else if (code === "auth/provider-not-password") {
        msg =
          t(
            "changePassword.not_password_user_text",
            "Your account is signed in with Google or another provider. Password changes are only available for email/password accounts."
          ) || msg;
      } else if (code === "auth/requires-recent-login") {
        msg =
          t(
            "changePassword.recent_login",
            "For security, please sign in again and then retry."
          ) || msg;
      }

      Swal.fire({
        title: t("changePassword.error_title", "Error"),
        text: msg,
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const isPasswordAccount = currentUser?.providerData?.some(
    (p) => p.providerId === "password"
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F4EEE0]" dir={i18n.dir()}>
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-[#8B5C3E] text-2xl font-semibold text-center mb-4">
          {t("changePassword.title", "Change Password")}
        </h2>

        {!isPasswordAccount ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 text-sm">
            {t(
              "changePassword.not_password_user_text",
              "Your account is signed in with Google or another provider. Password changes are only available for email/password accounts."
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Current */}
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="currentPassword">
                {t("changePassword.current_label", "Current password")}
              </label>
              <input
                {...register("currentPassword", { required: true })}
                type={showCurr ? "text" : "password"}
                id="currentPassword"
                autoComplete="current-password"
                dir="ltr"
                placeholder={t("changePassword.current_placeholder", "Enter current password")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B5C3E] focus:outline-none"
              />
              <Toggle
                onClick={() => setShowCurr((v) => !v)}
                label={showCurr ? t("changePassword.hide", "Hide") : t("changePassword.show", "Show")}
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">
                  {t("changePassword.current_required", "Current password is required.")}
                </p>
              )}
            </div>

            {/* New */}
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="newPassword">
                {t("changePassword.new_label", "New password")}
              </label>
              <input
                {...register("newPassword", { required: true, minLength: 6 })}
                type={showNew ? "text" : "password"}
                id="newPassword"
                autoComplete="new-password"
                dir="ltr"
                placeholder={t("changePassword.new_placeholder", "Enter new password (min 6)")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B5C3E] focus:outline-none"
              />
              <Toggle
                onClick={() => setShowNew((v) => !v)}
                label={showNew ? t("changePassword.hide", "Hide") : t("changePassword.show", "Show")}
              />
              {errors.newPassword?.type === "required" && (
                <p className="text-red-500 text-sm">{t("reset.password_required")}</p>
              )}
              {errors.newPassword?.type === "minLength" && (
                <p className="text-red-500 text-sm">{t("reset.password_min")}</p>
              )}
            </div>

            {/* Confirm */}
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="confirmPassword">
                {t("changePassword.confirm_label", "Confirm new password")}
              </label>
              <input
                {...register("confirmPassword", {
                  required: true,
                  validate: (val) => val === watch("newPassword"),
                })}
                type={showConf ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                dir="ltr"
                placeholder={t("changePassword.confirm_placeholder", "Re-enter new password")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B5C3E] focus:outline-none"
              />
              <Toggle
                onClick={() => setShowConf((v) => !v)}
                label={showConf ? t("changePassword.hide", "Hide") : t("changePassword.show", "Show")}
              />
              {errors.confirmPassword?.type === "required" && (
                <p className="text-red-500 text-sm">{t("reset.confirm_password_required")}</p>
              )}
              {errors.confirmPassword?.type === "validate" && (
                <p className="text-red-500 text-sm">{t("reset.mismatch_text")}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white font-semibold py-2 rounded-md transition ${
                isSubmitting ? "bg-[#8B5C3E]/60 cursor-not-allowed" : "bg-[#8B5C3E] hover:bg-[#74452D]"
              }`}
            >
              {isSubmitting
                ? t("checkout.processing") || "..."
                : t("changePassword.submit_btn", "Update Password")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
