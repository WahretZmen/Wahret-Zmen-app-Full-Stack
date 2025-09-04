// src/components/LargeBanner.jsx
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// Assets
import heroAvif from "../assets/Jebbas/LargeBanner/Jebba-tunisienne-LargeBanner.avif";
import "../Styles/StylesLargeBanner.css";

/**
 * 🎌 LargeBanner (Hero Section)
 * ------------------------------------------------
 * - Fullscreen hero banner with background, animated text, and CTAs.
 * - Supports i18n translations + RTL layout.
 * - Dynamically splits brand into first/second words.
 * - Localizes "By Sabri" depending on language.
 */
const LargeBanner = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  const lang = i18n.language || "en";
  const isRTL = lang.startsWith("ar");

  // Brand split: first word + remaining words
  const brand = t("navbar.brand", "Wahret Zmen");
  const parts = brand.trim().split(/\s+/);
  const firstWord = parts[0] || brand;
  const secondWord = parts.slice(1).join(" ");

  // Localized “By Sabri” text
  const bySabri =
    lang.startsWith("fr")
      ? "Par Sabri"
      : lang.startsWith("ar")
      ? "بإدارة صبري"
      : "By Sabri";

  return (
    <section
      className="hz-hero"
      aria-label={t("Welcome_Banner_title", "Welcome to Wahret Zmen")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ======================
          Background Layers
      ======================= */}
      <div className="hz-hero__bg">
        <img
          src={heroAvif}
          alt={t("banner_img_alt", "Wahret Zmen traditional banner")}
          loading="eager"
          className="hz-kenburns"
        />
        <div className="hz-hero__overlay" />
        <div className="hz-hero__bokeh" aria-hidden="true" />
      </div>

      {/* ======================
          Content
      ======================= */}
      <div className="hz-hero__container">
        <div className="hz-hero__grid">
          <div className="hz-hero__content">
            {/* Title */}
            <h2 className="hz-hero__title animate-fade-in-up">
              {/* First word shimmer */}
              <span className="hz-inline hz-title-shimmer animate-slide-in-left">
                {firstWord}
              </span>{" "}
              {/* Second word shimmer (if exists) */}
              {secondWord ? (
                <span className="hz-inline hz-title-shimmer animate-slide-in-right animation-delay-200">
                  {secondWord}
                </span>
              ) : null}
              {/* “By Sabri” localized */}
              <span className="hz-hero__by animate-fade-in-delay-400">
                {bySabri}
              </span>
            </h2>

            {/* Decorative underline */}
            <div
              className="hz-title-underline animate-underline"
              aria-hidden="true"
            />

            {/* Subtitle */}
            <p className="hz-hero__subtitle animate-fade-in-delay-300">
              {t(
                "banner_description",
                "Discover our exquisite collection of traditional Jebbas, where timeless elegance meets contemporary craftsmanship. Each piece tells a story of heritage and style."
              )}
            </p>

            {/* CTAs */}
            <div className="hz-hero__ctas hz-delay-400">
              <Link
                to="/products"
                reloadDocument
                className="hz-btn hz-btn--xl hz-btn--primary animate-glow"
              >
                <span className="hz-btn__label">
                  {t("wahret_zmen_collection", "Explore Collection")}
                </span>
              </Link>

              <Link
                to="/about"
                reloadDocument
                className="hz-btn hz-btn--xl hz-btn--secondary"
              >
                <span className="hz-btn__label">
                  {t("about.title", "Learn Our Story")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LargeBanner;
