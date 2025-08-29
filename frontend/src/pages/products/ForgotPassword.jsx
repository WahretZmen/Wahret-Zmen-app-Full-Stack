import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext"; // NOTE: correct path & function name
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { sendResetEmail } = useAuth(); // <-- was sendResetEmailWrapper (wrong)
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

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
        title: t("forgot.success_title", "Email sent"),
        text:
          t(
            "forgot.success_text",
            "We’ve sent you a password reset email. Please check your inbox (and Spam)."
          ),
        icon: "success",
        confirmButtonColor: "#8B5C3E",
      });
    } catch (err) {
      console.error(err);
      let msg =
        t(
          "forgot.error_text",
          "Couldn’t send the reset link. Please try again."
        ) || "Couldn’t send the reset link. Please try again.";

      const code = err?.code || "";
      if (code === "auth/invalid-email") {
        msg = t("forgot.invalid_email", "Invalid email address.");
      } else if (code === "auth/user-not-found") {
        msg = t("forgot.user_not_found", "No account found for this email.");
      } else if (code === "auth/too-many-requests") {
        msg = t("changePassword.too_many_requests", "Too many attempts. Please try again later.");
      }

      Swal.fire({
        title: t("forgot.error_title", "Error"),
        text: msg,
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F4EEE0]" dir={i18n.dir()}>
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-[#8B5C3E] text-2xl font-semibold text-center mb-4">
          {t("forgot.title", "Forgot Password")}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
              {t("forgot.email_label", "Email Address")}
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              placeholder={t("forgot.email_placeholder", "Enter your email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B5C3E] focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {t("forgot.email_required", "Email is required.")}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-semibold py-2 rounded-md transition ${
              isSubmitting ? "bg-[#8B5C3E]/60 cursor-not-allowed" : "bg-[#8B5C3E] hover:bg-[#74452D]"
            }`}
          >
            {isSubmitting ? t("checkout.processing", "Processing...") : t("forgot.submit_btn", "Send reset link")}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          ©2025 Wahret Zmen Boutique.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
