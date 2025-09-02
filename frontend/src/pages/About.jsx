// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../Styles/StylesAbout.css";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

// If your project keeps Header/Footer under components/ui (like CartPage), use these paths:
import Header from "../components/ui/Header.jsx";
import Footer from "../components/ui/Footer.jsx";

const About = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  const isRTL =
    i18n.language === "ar" ||
    i18n.language === "ar-SA" ||
    (typeof i18n.language === "string" && i18n.language.startsWith("ar"));

  return (
    <div className="about-page min-h-screen bg-[#fff] text-[#2b2b2b]" dir={isRTL ? "rtl" : "ltr"}>
      <Helmet>
        <title>
          {t("about.title")} | {t("navbar.brand")}
        </title>
        <meta name="description" content={t("home_meta_description")} />
      </Helmet>

      {/* ======= Site Header ======= */}
      <Header />

      {/* ======= Hero (CSS-only background; no images) ======= */}
      <section className="about-hero about-hero--gradient">
        <div className="about-hero__overlay" />
        <div className="about-hero__content animate-fade-up">
          <h1 className="about-hero__title">{t("about.title")}</h1>
          <p className="about-hero__subtitle">{t("about.description")}</p>

          <div className="about-hero__actions">
            <Link to="/products" className="btn-luxury animate-pop-in delay-100">
              {t("discover_now", "Découvrir maintenant")}
            </Link>
            <Link to="/contact" className="btn-outline animate-pop-in delay-150">
              {t("footer.contactUs")}
            </Link>
          </div>
        </div>
      </section>

      {/* ======= Main content (text-only sections) ======= */}
      <main className="about-container">
        {/* Mission */}
        <section className="about-section">
          <div className="about-grid single">
            <div className="about-col animate-slide-left">
              <h2 className="about-h2">{t("about.mission_title")}</h2>
              <p className="about-p">{t("about.mission_text1")}</p>
              <p className="about-p">{t("about.mission_text2")}</p>
            </div>
          </div>
        </section>

        {/* Crafted / Products */}
        <section className="about-section">
          <div className="about-grid single">
            <div className="about-col animate-slide-right">
              <h2 className="about-h2">{t("about.crafted_title")}</h2>
              <p className="about-p">{t("about.crafted_text1")}</p>
              <p className="about-p">{t("about.crafted_text2")}</p>
            </div>
          </div>
        </section>

        {/* Medina / Behind */}
        <section className="about-section">
          <div className="about-grid single">
            <div className="about-col animate-slide-left">
              <h2 className="about-h2">{t("about.behind_title")}</h2>
              <p className="about-p">{t("about.behind_text")}</p>
            </div>
          </div>
        </section>

        {/* Join / CTA */}
        <section className="about-section">
          <div className="about-grid single">
            <div className="about-col animate-slide-right">
              <h2 className="about-h2">{t("about.join_title")}</h2>
              <p className="about-p">{t("about.join_text1")}</p>
              <p className="about-p">{t("about.join_text2")}</p>

              <div className="about-actions">
                <Link to="/products" className="btn-luxury animate-pop-in">
                  {t("discover_now", "Découvrir maintenant")}
                </Link>
                <Link to="/contact" className="btn-outline animate-pop-in delay-100">
                  {t("footer.contactUs")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ======= Site Footer ======= */}
      <Footer />
    </div>
  );
};

export default About;
