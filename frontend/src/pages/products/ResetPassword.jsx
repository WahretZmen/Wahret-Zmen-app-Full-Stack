import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // path from /pages/products/
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  const navigate = useNavigate();
  const { t } = useTranslation();
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
          title: t("reset.invalid_link_title"),
          text: t("reset.invalid_link_text"),
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
        title: t("reset.mismatch_title"),
        text: t("reset.mismatch_text"),
        icon: "warning",
        confirmButtonColor: "#8B5C3E",
      });
    }
    try {
      setSubmitting(true);
      await confirmPasswordResetWrapper(oobCode, password);
      await Swal.fire({
        title: t("reset.success_title"),
        text: t("reset.success_text"),
        icon: "success",
        confirmButtonColor: "#8B5C3E",
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: t("reset.error_title"),
        text: t("reset.error_text"),
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F4EEE0]">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg text-center">
          <h2 className="text-[#8B5C3E] text-xl font-semibold">
  {t("loading.brand_loading")}
</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F4EEE0]">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-[#8B5C3E] text-2xl font-semibold text-center mb-2">
          {t("reset.title")}
        </h2>

        {email && (
          <p className="text-center text-sm text-gray-600 mb-4">
            {t("reset.for_email")}{" "}
            <span className="font-medium break-all">{email}</span>
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
              {t("reset.new_password_label")}
            </label>
            <input
              {...register("password", { required: true, minLength: 6 })}
              type="password"
              id="password"
              placeholder={t("reset.new_password_placeholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B5C3E] focus:outline-none"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500 text-sm">{t("reset.password_required")}</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500 text-sm">{t("reset.password_min")}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="confirmPassword">
              {t("reset.confirm_password_label")}
            </label>
            <input
              {...register("confirmPassword", {
                required: true,
                validate: (val) => val === watch("password"),
              })}
              type="password"
              id="confirmPassword"
              placeholder={t("reset.confirm_password_placeholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B5C3E] focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{t("reset.confirm_password_required")}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full text-white font-semibold py-2 rounded-md transition ${
              submitting
                ? "bg-[#8B5C3E]/60 cursor-not-allowed"
                : "bg-[#8B5C3E] hover:bg-[#74452D]"
            }`}
          >
            {submitting ? t("checkout.processing") || "..." : t("reset.submit_btn")}
          </button>
        </form>

        {/* Links */}
        <p className="text-center text-sm text-gray-700 mt-4">
          <Link to="/login" className="text-[#8B5C3E] hover:underline">
            {t("login.title")}
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500 mt-4">
          ©2025 Wahret Zmen Boutique. {t("reset.rights")}
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
