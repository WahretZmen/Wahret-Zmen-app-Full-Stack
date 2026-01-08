// src/components/Loading.jsx
import { ClipLoader } from "react-spinners";

/**
 * Loading Screen
 * -----------------------------------------
 * - Fullscreen overlay
 * - Elegant Arabic loading text
 * - Center spinner with glow pulse effect
 */
const LoadingSpinner = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-center items-center
                 bg-gradient-to-b from-white to-[#fdf6ee] animate-fadeIn"
    >
      {/* Brand Arabic Loading Text */}
      <h2
        className="text-[#C49A6C] text-2xl md:text-3xl font-semibold mb-6
                   font-cairo tracking-wide animate-pulse drop-shadow-sm text-center"
      >
        جارٍ التحميل … وهرة زمان ...
      </h2>

      {/* Spinner + Glow Ring */}
      <div className="relative">
        {/* Soft glow pulse */}
        <div className="absolute inset-0 animate-ping rounded-full border-4 border-[#C49A6C]/30"></div>

        {/* Main Loader */}
        <ClipLoader color="#C49A6C" size={65} speedMultiplier={1.2} />
      </div>
    </div>
  );
};

export default LoadingSpinner;



