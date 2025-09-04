// src/components/Loading.jsx
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

/**
 * LoadingSpinner
 * --------------------------------------------------
 * Fullscreen loading overlay with:
 * - Brand text (pulsing)
 * - Centered spinner with glow effect
 *
 * i18n:
 * - Displays localized brand loading message
 * - Supports RTL/LTR via translations
 */
const LoadingSpinner = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-center items-center
                 bg-gradient-to-b from-white to-[#fdf6ee] animate-fadeIn"
    >
      {/* =========================
          Branding Text
      ========================== */}
      <h2
        className="text-[#C49A6C] text-2xl md:text-3xl font-semibold mb-6
                   font-cairo tracking-wide animate-pulse drop-shadow-sm"
      >
        {t("loading.brand_loading")}
      </h2>

      {/* =========================
          Loader with Glow Ring
      ========================== */}
      <div className="relative">
        {/* Expanding ring behind spinner */}
        <div className="absolute inset-0 animate-ping rounded-full border-4 border-[#C49A6C]/30"></div>

        {/* Spinner */}
        <ClipLoader color="#C49A6C" size={65} speedMultiplier={1.2} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
