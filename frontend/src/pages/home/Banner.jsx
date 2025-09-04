// src/pages/home/Banner.jsx
// -----------------------------------------------------------------------------
// Purpose: Homepage banner with animated image, title, description, and CTA.
// Features:
//   - i18n-powered translations for all text.
//   - Scroll-based fade/reveal animations for image and text.
//   - Shimmer/replay title and animated description text.
//   - CTA button linking to /products with smooth scroll reset.
// Notes:
//   - No content/logic changes. Only added structure and comments.
// -----------------------------------------------------------------------------

import React from "react";
import { useTranslation } from "react-i18next";

// Animations
import ScrollFade from "../../Animations/ScrollFade.jsx";
import AnimatedText from "../../Animations/AnimatedText.jsx";

// Styles
import "../../Styles/StylesBanner.css";
import "../../Styles/StylesAnimatedText.css";

// Assets
import bannerImg from "../../assets/Banner/Banner.avif";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const Banner = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  return (
    <a
      href="/products"
      onClick={() => window.scrollTo(0, 0)}
      className="banner-container-enhanced link-wrapper"
    >
      {/* --------------------------------------------------------------------- */}
      {/* Left: Banner Image (with fade/rotate/zoom animation) */}
      {/* --------------------------------------------------------------------- */}
      <div className="banner-image-wrapper">
        <ScrollFade direction="fade-rotate-zoom" delay={0.5}>
          <img
            src={bannerImg}
            alt={t("banner_img_alt")}
            className="banner-img"
          />
        </ScrollFade>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Right: Text Section */}
      {/* --------------------------------------------------------------------- */}
      <div className="banner-text-wrapper">
        {/* Title with premium shimmer/replay effect */}
        <ScrollFade direction="left-to-right" delay={0.5}>
          <h1 className="banner-title wz-royal-title">
            {t("banner_title")}
          </h1>
        </ScrollFade>

        {/* Animated description text */}
        <ScrollFade>
          <div className="banner-description">
            <AnimatedText text={t("banner_description")} />
          </div>
        </ScrollFade>

        {/* CTA button: "Discover Now" */}
        <ScrollFade direction="bottom" delay={0.6}>
          <button type="button" className="btn-premium">
            {t("discover_now")}
          </button>
        </ScrollFade>
      </div>
    </a>
  );
};

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
export default Banner;
