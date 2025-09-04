// src/components/ContentShowcase.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

// Animations
import FadeInSection from "../Animations/FadeInSection.jsx";
import ScrollFade from "../Animations/ScrollFade.jsx";

// Assets
import hommeJebba from "../assets/Jebbas/Hommes/Jebba-Homme.jpg";
import femmeJebba from "../assets/Jebbas/Femmes/Jebba-Femme.jpg";
import enfantJebba from "../assets/Jebbas/Enfants/Jebba-Enfant.jpg";

import "../Styles/StylesContentShowcase.css";

/**
 * 🖼️ ContentShowcase
 * -----------------------------------------------------
 * Multilingual showcase section highlighting product categories:
 * - Hommes
 * - Femmes
 * - Enfants
 *
 * Features:
 * - Uses FadeInSection + ScrollFade for smooth animations.
 * - Supports RTL/LTR direction via i18n language.
 * - Each row alternates image/text layout for variety.
 * - Ends with a CTA band linking to all products.
 */
const ContentShowcase = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";

  return (
    <section
      className="content-showcase-wrapper"
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={t("contentshowcase.showcase_aria")}
    >
      {/* ======================
          Section Heading
      ======================= */}
      <FadeInSection>
        <header className="cs-header">
          <h2 className="cs-title shimmer-title">
            {t("contentshowcase.showcase_title")}
          </h2>
          <p className="cs-subtitle">
            <Trans i18nKey="contentshowcase.showcase_subtitle" />
          </p>
        </header>
      </FadeInSection>

      {/* ======================
          Card 1 — Hommes
      ======================= */}
      <article className="cs-row">
        {/* Image */}
        <ScrollFade direction={isRTL ? "right-to-left" : "left-to-right"} delay={0.1}>
          <div className="cs-image tilt-on-hover">
            <img src={hommeJebba} alt={t("contentshowcase.cs_hommes_alt")} />
            <span className="cs-image-badge">
              {t("contentshowcase.badge_artisan")}
            </span>
          </div>
        </ScrollFade>

        {/* Text */}
        <ScrollFade direction={isRTL ? "left-to-right" : "right-to-left"} delay={0.15}>
          <div className="cs-text">
            <h3 className="cs-heading">{t("contentshowcase.cs_hommes_title")}</h3>
            <p className="cs-desc">
              <Trans i18nKey="contentshowcase.cs_hommes_desc" />
            </p>
            <Link to="/category/hommes" className="cs-btn">
              {t("contentshowcase.shop_men")}
            </Link>
          </div>
        </ScrollFade>
      </article>

      {/* ======================
          Card 2 — Femmes
      ======================= */}
      <article className="cs-row cs-row--alt">
        {/* Text */}
        <ScrollFade direction={isRTL ? "right-to-left" : "left-to-right"} delay={0.1}>
          <div className="cs-text">
            <h3 className="cs-heading">{t("contentshowcase.cs_femmes_title")}</h3>
            <p className="cs-desc">
              <Trans i18nKey="contentshowcase.cs_femmes_desc" />
            </p>
            <Link to="/category/femmes" className="cs-btn">
              {t("contentshowcase.shop_women")}
            </Link>
          </div>
        </ScrollFade>

        {/* Image */}
        <ScrollFade direction={isRTL ? "left-to-right" : "right-to-left"} delay={0.15}>
          <div className="cs-image tilt-on-hover">
            <img src={femmeJebba} alt={t("contentshowcase.cs_femmes_alt")} />
            <span className="cs-image-badge">
              {t("contentshowcase.badge_fait_main")}
            </span>
          </div>
        </ScrollFade>
      </article>

      {/* ======================
          Card 3 — Enfants
      ======================= */}
      <article className="cs-row">
        {/* Image */}
        <ScrollFade direction={isRTL ? "right-to-left" : "left-to-right"} delay={0.1}>
          <div className="cs-image tilt-on-hover">
            <img src={enfantJebba} alt={t("contentshowcase.cs_enfants_alt")} />
            <span className="cs-image-badge">
              {t("contentshowcase.badge_nouveaute")}
            </span>
          </div>
        </ScrollFade>

        {/* Text */}
        <ScrollFade direction={isRTL ? "left-to-right" : "right-to-left"} delay={0.15}>
          <div className="cs-text">
            <h3 className="cs-heading">{t("contentshowcase.cs_enfants_title")}</h3>
            <p className="cs-desc">
              <Trans i18nKey="contentshowcase.cs_enfants_desc" />
            </p>
            <Link to="/category/enfants" className="cs-btn">
              {t("contentshowcase.shop_children")}
            </Link>
          </div>
        </ScrollFade>
      </article>

      {/* ======================
          CTA Band
      ======================= */}
      <FadeInSection>
        <div className="cs-cta">
          <p className="cs-cta-text">
            <Trans i18nKey="contentshowcase.cs_cta_text" />
          </p>
          <Link to="/products" className="cs-cta-btn">
            {t("contentshowcase.browse_all")}
          </Link>
        </div>
      </FadeInSection>
    </section>
  );
};

export default ContentShowcase;
