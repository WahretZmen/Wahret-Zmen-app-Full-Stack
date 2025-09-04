// src/components/ui/FullWidth.jsx
import React from "react";

/**
 * 📐 FullWidth
 * ----------------------------
 * Utility wrapper that makes content span the entire viewport width
 * (ignores container padding/margins from parent layouts like shadcn).
 *
 * Typical usage:
 * - Hero sections
 * - Carousels
 * - Promo banners
 *
 * Props:
 * - children → content inside the full-width section
 * - className (string) → optional extra classes
 * - dir (string) → optional text direction ("ltr" | "rtl"), passed directly to <section>
 */
const FullWidth = ({ children, className = "", dir }) => {
  return (
    <section
      dir={dir}
      className={[
        // ✅ Force full viewport width and center by counteracting container margins
        "w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]",
        // ✅ Prevent clipping/overlap issues with ancestor containers
        "isolate overflow-clip",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
};

export default FullWidth;
