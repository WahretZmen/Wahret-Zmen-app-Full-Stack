// src/pages/home/Home.jsx
// -----------------------------------------------------------------------------
// Purpose : Home page composition (hero, CTA banner, shop-by-category,
//           collections, news, craftsmanship, about).
// Notes   : Only organization and comments added. No logic/JSX/text changes.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import FadeInSection from "../../Animations/FadeInSection.jsx";
import "../../Styles/StylesHome.css";

import LargeBanner from "../../components/LargeBanner.jsx";
import Banner from "./Banner";
import ShopByCategory from "../../components/ShopByCategory.jsx";
import OurSellers from "./OurSellers";
import News from "./News";
import CraftsmanshipShowcase from "../../components/CraftsmanshipShowcase.jsx";
import AboutWahretZmen from "../../components/AboutWahretZmen.jsx";

import hommeJebba from "../../assets/Jebbas/Hommes/Jebba-Homme.jpg";
import femmeJebba from "../../assets/Jebbas/Femmes/Jebba-Femme.jpg";
import enfantJebba from "../../assets/Jebbas/Enfants/Jebba-Enfant.jpg";

import FullWidth from "../../components/ui/FullWidth";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const Home = () => {
  // ---------------------------------------------------------------------------
  // 1) i18n / RTL
  // ---------------------------------------------------------------------------
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";
  if (!i18n.isInitialized) return null;

  // ---------------------------------------------------------------------------
  // 2) Labels & data (shop-by-category)
  // ---------------------------------------------------------------------------
  const label = (k) =>
    isRTL
      ? { hommes: "رجال", femmes: "نساء", enfants: "أطفال" }[k]
      : { hommes: "HOMMES", femmes: "FEMMES", enfants: "ENFANTS" }[k];

  const shopItems = [
    { key: "hommes",  label: label("hommes"),  image: hommeJebba,  to: "/products?category=hommes" },
    { key: "femmes",  label: label("femmes"),  image: femmeJebba,  to: "/products?category=femmes" },
    { key: "enfants", label: label("enfants"), image: enfantJebba, to: "/products?category=enfants" },
  ];

  // ---------------------------------------------------------------------------
  // 3) Render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* ===================== Head meta ===================== */}
      <Helmet>
        <title>{t("home_title", "Wahret Zmen – Elegance Réinventée")}</title>
        <meta
          name="description"
          content={t(
            "home_meta_description",
            "Explore timeless garments inspired by Tunisian heritage. Discover kaftans, jebbas and more — crafted with passion and authenticity."
          )}
        />
      </Helmet>

      {/* ===================== Hero Banner ===================== */}
      <FadeInSection delay={0} yOffset={0}>
        <div className="anim-scale-in">
          <FullWidth dir={isRTL ? "rtl" : "ltr"}>
            <LargeBanner />
          </FullWidth>
        </div>
      </FadeInSection>

      {/* ===================== Page container ===================== */}
      <div
        className="home-container px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1440px] mx-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >

        {/* ===================== Home Title ===================== */}
        <section className="home-title-block text-center">
          <h1 className={`home-title sparkle ${isRTL ? "rtl" : "ltr"}`}>
            <span className="home-title__text">{t("home", "الرئيسية")}</span>
            <span className="home-title__underline" />
          </h1>

          <p className="home-title__sub">
            <Trans i18nKey="home_intro_html">
              Step into the world of <strong>Wahret Zmen</strong>, where every stitch tells a
              story of heritage.
            </Trans>
          </p>
        </section>

        {/* ===================== Banner CTA ===================== */}
        <FadeInSection delay={0.2}>
          <section className="mb-16 anim-scale-in anim-delay" style={{ "--d": "100ms" }}>
            <div className="relative">
              <Banner />
              <span className="block h-[2px] w-1/2 mx-auto mt-6 rounded-full anim-shimmer" />
            </div>
            <div className="text-center mt-6">
              <p
                className="text-lg text-gray-700 max-w-3xl mx-auto px-2 anim-fade-up anim-delay"
                style={{ "--d": "120ms" }}
              >
                {t("home_banner_text", "Your heritage. Your identity. Your boutique.")}
              </p>
            </div>
          </section>
        </FadeInSection>

        {/* ===================== Shop By Category ===================== */}
        <FadeInSection delay={0.25}>
          <div className="anim-fade-up anim-delay" style={{ "--d": "80ms" }}>
            <ShopByCategory
              items={shopItems}
              title={
                isRTL ? (
                  <span
                    className="t-anim t-tracking t-delay t-underline"
                    style={{ "--t-delay": "100ms" }}
                  >
                    تسوّق حسب الفئة
                  </span>
                ) : (
                  <span
                    className="t-anim t-tracking t-delay t-underline"
                    style={{ "--t-delay": "100ms" }}
                  >
                    Achetez par Catégorie
                  </span>
                )
              }
            />
          </div>
        </FadeInSection>

        {/* ===================== Our Sellers ===================== */}
        <FadeInSection delay={0.3}>
          <section
            className="py-12 bg-[#ffffff] rounded-2xl shadow-xl mt-12 anim-fade-up anim-delay"
            style={{ "--d": "100ms" }}
          >
            <div className="text-center px-4">
              <h2
                className="text-3xl font-bold text-[#8A5D3B] drop-shadow-sm t-anim t-tracking t-glow t-delay"
                style={{ "--t-delay": "140ms" }}
              >
                {t("our_collections", "Our Traditional Treasures")}
              </h2>

              <p
                className="text-lg text-gray-600 max-w-3xl mx-auto mt-3 anim-blur-in anim-delay"
                style={{ "--d": "180ms" }}
              >
                <Trans i18nKey="our_collections_intro">
                  Browse our curated collection of traditional garments—from majestic{" "}
                  <strong>Kaftans</strong> to signature <strong>Jebbas</strong>—crafted with pride,
                  precision, and love for culture.
                </Trans>
              </p>
            </div>
            <OurSellers />
          </section>
        </FadeInSection>

        {/* ===================== News ===================== */}
        <FadeInSection delay={0.4}>
          <section
            className="py-12 bg-white rounded-2xl shadow-md mt-12 anim-fade-up anim-delay"
            style={{ "--d": "120ms" }}
          >
            <div className="text-center px-4">
              <h2
                className="text-3xl font-semibold text-[#5C3D2E] t-anim t-tracking t-delay"
                style={{ "--t-delay": "160ms" }}
              >
                <span className="t-underline t-delay" style={{ "--t-delay": "220ms" }}>
                  {t("latest_news", "Latest Inspirations")}
                </span>
              </h2>
            </div>
            <News />
          </section>
        </FadeInSection>

        {/* ===================== Craftsmanship ===================== */}
        <FadeInSection delay={0.43}>
          <div className="anim-fade-up anim-delay" style={{ "--d": "100ms" }}>
            <CraftsmanshipShowcase />
          </div>
        </FadeInSection>

        {/* ===================== About ===================== */}
        <FadeInSection delay={0.45}>
          <div className="anim-scale-in anim-delay" style={{ "--d": "80ms" }}>
            <AboutWahretZmen />
          </div>
        </FadeInSection>
      </div>
    </>
  );
};

export default Home;
