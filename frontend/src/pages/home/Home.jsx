import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Banner from "./Banner";
import OurSellers from "./OurSellers";
import News from "./News";
import { Helmet } from "react-helmet";
import FadeInSection from "../../Animations/FadeInSection.jsx";
import "../../Styles/StylesHome.css";
import LargeBanner from "../../components/LargeBanner.jsx";

/* ✅ Categories component */
import ShopByCategory from "../../components/ShopByCategory.jsx";

/* ✅ New image + text showcase (after Banner) */
import ContentShowcase from "../../components/ContentShowcase.jsx";

/* ✅ Wahret Zmen images */
import hommeJebba from "../../assets/Jebbas/Hommes/Jebba-Homme.jpg";
import femmeJebba from "../../assets/Jebbas/Femmes/Jebba-Femme.jpg";
import enfantJebba from "../../assets/Jebbas/Enfants/Jebba-Enfant.jpg";

const Home = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";
  if (!i18n.isInitialized) return null;

  /* ✅ Translated category labels */
  const label = (k) =>
    isRTL
      ? { hommes: "رجال", femmes: "نساء", enfants: "أطفال" }[k]
      : { hommes: "HOMMES", femmes: "FEMMES", enfants: "ENFANTS" }[k];

  /* ✅ Category items */
  const shopItems = [
    { key: "hommes", label: label("hommes"), image: hommeJebba, to: "/category/hommes" },
    { key: "femmes", label: label("femmes"), image: femmeJebba, to: "/category/femmes" },
    { key: "enfants", label: label("enfants"), image: enfantJebba, to: "/category/enfants" },
  ];

  return (
    <>
      {/* 🖼️ Hero Large Banner */}
      <FadeInSection delay={0} yOffset={0}>
        <LargeBanner />
      </FadeInSection>

      

      <div
        className="home-container px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1440px] mx-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >
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

        {/* 🌟 Welcome Section */}
        <FadeInSection delay={0.1}>
          <section className="text-center py-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide text-[#A67C52] drop-shadow-lg">
              {t("home", "Wahret Zmen Boutique")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mt-4 leading-relaxed">
              <Trans i18nKey="home_intro_html">
                Step into the world of <strong>Wahret Zmen</strong>, where every stitch tells a
                story of heritage.
              </Trans>
            </p>
          </section>
        </FadeInSection>

        {/* 🖼️ Banner */}
        <FadeInSection delay={0.2}>
          <section className="mb-16">
            <Banner />
            <div className="text-center mt-6">
              <p className="text-lg text-gray-700 max-w-3xl mx-auto px-2">
                {t("home_banner_text", "Your heritage. Your identity. Your boutique.")}
              </p>
            </div>
          </section>
        </FadeInSection>

        {/* 🧩 New Image + Text Showcase (directly after Banner) */}
        <FadeInSection delay={0.24}>
          <ContentShowcase />
        </FadeInSection>

        {/* 🗂️ Shop By Category */}
        <FadeInSection delay={0.25}>
          <ShopByCategory
            items={shopItems}
            title={isRTL ? "تسوق حسب الفئة" : "Achetez par Catégorie"}
          />
        </FadeInSection>

        {/* 🧵 Our Sellers */}
        <FadeInSection delay={0.3}>
          <section className="py-12 bg-[#ffffff] rounded-2xl shadow-xl mt-12">
            <div className="text-center px-4">
              <h2 className="text-3xl font-bold text-[#8A5D3B] drop-shadow-sm">
                {t("our_collections", "Our Traditional Treasures")}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3">
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

        {/* 📰 News */}
        <FadeInSection delay={0.4}>
          <section className="py-12 bg-white rounded-2xl shadow-md mt-12">
            <div className="text-center px-4">
              <h2 className="text-3xl font-semibold text-[#5C3D2E]">
                {t("latest_news", "Latest Inspirations")}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-2">
                {t(
                  "latest_news_intro",
                  "Stay updated with our latest collections, offers, and style stories. Wahret Zmen brings elegance closer to you."
                )}
              </p>
            </div>
            <News />
          </section>
        </FadeInSection>
      </div>
    </>
  );
};

export default Home;
