// src/pages/About.jsx
// -----------------------------------------------------------------------------
// Purpose: Brand About page with hero, values, gallery, mission/crafted/behind,
//          and join sections. Fully localized (i18n) with RTL support.
// Notes:
//   - No functional or visual changes. Only annotations & organization added.
// -----------------------------------------------------------------------------

import React from "react";
import "../Styles/StylesAbout.css";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

// Layout
import Header from "../components/ui/Header.jsx";
import Footer from "../components/ui/Footer.jsx";

// Images (About folder)
import AboutImgn1 from "../assets/About/AboutImgn1.avif";
import AboutImgn2 from "../assets/About/AboutImgn2.avif";
import AboutImgn3 from "../assets/About/AboutImgn3.avif";
import AboutImgn4 from "../assets/About/AboutImgn4.avif";
import AboutImgn5 from "../assets/About/AboutImgn5.avif";
import AboutImgn6 from "../assets/About/AboutImgn6.avif";
import AboutImgn7 from "../assets/About/AboutImgn7.avif";

// -----------------------------------------------------------------------------
// Inline Icon component (kept as-is, annotated for clarity)
// -----------------------------------------------------------------------------
const Icon = ({ name }) => {
  if (name === "heart") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
      </svg>
    );
  }
  if (name === "medal") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="8" r="5" /><path d="M8 13 6 22l6-3 6 3-2-9" />
      </svg>
    );
  }
  if (name === "spark") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3l2.5 5L20 10.5 15 12l-3 6-3-6-5-1.5L9.5 8 12 3z" />
      </svg>
    );
  }
  if (name === "user") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="7" r="4" /><path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
      </svg>
    );
  }
  if (name === "globe") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
      </svg>
    );
  }
  if (name === "clock") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    );
  }
  return null;
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const About = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  // RTL detection
  const isRTL =
    i18n.language === "ar" ||
    i18n.language === "ar-SA" ||
    (typeof i18n.language === "string" && i18n.language.startsWith("ar"));

  // Title text (localized)
  const titleText = t("about.title", "About Us");

  // Value cards (icon + title + text)
  const values = [
    { title: t("about.v1_title"), text: t("about.v1_text"), icon: "heart" },
    { title: t("about.v2_title"), text: t("about.v2_text"), icon: "medal" },
    { title: t("about.v3_title"), text: t("about.v3_text"), icon: "spark" },
    { title: t("about.v4_title"), text: t("about.v4_text"), icon: "user" },
    { title: t("about.v5_title"), text: t("about.v5_text"), icon: "globe" },
    { title: t("about.v6_title"), text: t("about.v6_text"), icon: "clock" },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="about-page min-h-screen bg-[#fff] text-[#2b2b2b]" dir={isRTL ? "rtl" : "ltr"}>
      {/* Head metadata */}
      <Helmet>
        <title>
          {t("about.title", "About")} | {t("navbar.brand", "Wahret Zmen")}
        </title>
        <meta
          name="description"
          content={t("home_meta_description", "Traditional Jebbas with contemporary craftsmanship")}
        />
      </Helmet>

      {/* Header */}
      <Header />

      {/* --------------------------------------------------------------------- */}
      {/* HERO */}
      {/* --------------------------------------------------------------------- */}
      <section className="about-hero about-hero--gradient animate-fade-in">
        <div className="about-hero__overlay" />
        <div className="about-hero__content animate-fade-up">
          {/* Title — per-letter wave for LTR, whole-word for RTL */}
          <h1 className={`about-hero__title ${isRTL ? "about-hero__title--rtl" : ""}`}>
            {isRTL ? (
              <span className="title-rtl-inner">{titleText}</span>
            ) : (
              titleText.split("").map((ch, i) => (
                <span className="title-letter" key={`${ch}-${i}`}>{ch}</span>
              ))
            )}
          </h1>

          {/* Subtitle */}
          <p className="about-hero__subtitle">{t("about.description")}</p>

          {/* CTAs */}
          <div className="about-hero__actions animate-fade-in delay-200">
            <a href="/products" className="btn-luxury animate-pop-in delay-100">
              {t("discover_now", "Discover Now")}
            </a>
            <a href="/contact" className="btn-outline animate-pop-in delay-150">
              {t("footer.contactUs", "Contact Us")}
            </a>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* VALUES */}
      {/* --------------------------------------------------------------------- */}
      <section className="section section--values animate-fade-in">
        <div className="section__inner section__inner--center">
          <h2 className="h2 animate-fade-in delay-100">
            {t("about.values_title")}
          </h2>
          <p className="p p--lead animate-fade-in delay-200">
            {t("about.values_sub")}
          </p>
        </div>

        <div className="values-grid">
          {values.map((v, i) => (
            <div
              key={i}
              className="value-card animate-fade-in"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="value-card__icon" aria-hidden="true">
                <Icon name={v.icon} />
              </div>
              <h3 className="h3">{v.title}</h3>
              <p className="p p--muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* GALLERY */}
      {/* --------------------------------------------------------------------- */}
      <section className="section section--gallery animate-fade-in">
        <div className="section__inner section__inner--center animate-fade-in">
          <h2 className="h2 animate-fade-in delay-100">
            {t("about.gallery_title")}
          </h2>
          <p className="p p--lead animate-fade-in delay-200">
            {t("about.gallery_intro")}
          </p>
        </div>

        <div className="gallery-grid">
          {[AboutImgn1, AboutImgn2, AboutImgn3, AboutImgn4, AboutImgn5, AboutImgn6, AboutImgn7].map(
            (img, idx) => (
              <figure
                key={idx}
                className="gallery-card animate-fade-in"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <img src={img} alt={t("about.gallery_img_alt", "Gallery image")} className="gallery-img" />
              </figure>
            )
          )}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN CONTENT (Mission / Crafted / Behind / Join) */}
      {/* --------------------------------------------------------------------- */}
      <main className="about-container">
        {/* Mission */}
        <section className="about-section animate-fade-in">
          <div className="about-grid single">
            <div className="about-col animate-slide-left">
              <h2 className="about-h2">{t("about.mission_title")}</h2>
              <p className="about-p">{t("about.mission_text1")}</p>
              <p className="about-p">{t("about.mission_text2")}</p>
            </div>
          </div>
        </section>

        {/* Crafted */}
        <section className="about-section animate-fade-in">
          <div className="about-grid single">
            <div className="about-col animate-slide-right">
              <h2 className="about-h2">{t("about.crafted_title")}</h2>
              <p className="about-p">{t("about.crafted_text1")}</p>
              <p className="about-p">{t("about.crafted_text2")}</p>
            </div>
          </div>
        </section>

        {/* Behind */}
        <section className="about-section animate-fade-in">
          <div className="about-grid single">
            <div className="about-col animate-slide-left">
              <h2 className="about-h2">{t("about.behind_title")}</h2>
              <p className="about-p">{t("about.behind_text")}</p>
            </div>
          </div>
        </section>

        {/* Join / CTA */}
        <section className="about-section animate-fade-in">
          <div className="about-grid single">
            <div className="about-col animate-slide-right">
              <h2 className="about-h2">{t("about.join_title")}</h2>
              <p className="about-p">{t("about.join_text1")}</p>
              <p className="about-p">{t("about.join_text2")}</p>
              <div className="about-cta">
                <a href="/products" className="btn-luxury animate-pop-in">
                  {t("discover_now", "Découvrir maintenant")}
                </a>
                <a href="/contact" className="btn-outline small-btn animate-pop-in delay-100">
                  {t("footer.contactUs", "Contact Us")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
export default About;
