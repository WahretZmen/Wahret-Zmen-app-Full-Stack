import React from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import heroAvif from "../assets/Jebbas/LargeBanner/Jebba-tunisienne-LargeBanner.avif";
import "@/Styles/StylesLargeBanner.css";
=======
import { useTranslation, Trans } from "react-i18next";
import "../Styles/StylesLargeBanner.css";

import heroAvif from "../assets/Jebbas/LargeBanner/Jebba-tunisienne-LargeBanner.avif"; // ✅ only AVIF
>>>>>>> 1e8f5082f548298b745607be41c678f7c24d3772

const LargeBanner = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;
<<<<<<< HEAD

  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";

  return (
    <section className="hz-hero" dir={isRTL ? "rtl" : "ltr"}>
      {/* Background */}
      <div className="hz-hero__bg">
        <img src={heroAvif} alt={t("banner_img_alt", "Traditional Jebbas Collection")} />
        <div className="hz-hero__overlay" />
      </div>

      {/* Content */}
      <div className="hz-hero__container">
        <div className="hz-hero__content">
          <h2 className="hz-hero__title hz-fade-in-up">
            <span className="hz-slide-in-left">Wahret</span>{" "}
            <span className="hz-slide-in-right hz-delay-200">Zmen</span>
            <span className="hz-hero__by hz-delay-400">By Sabri</span>
          </h2>

          <p className="hz-hero__subtitle hz-delay-300">
            {t(
              "hero.subtitle",
              "Discover our exquisite collection of traditional Jebbas, where timeless elegance meets contemporary craftsmanship. Each piece tells a story of heritage and style."
            )}
          </p>

          <div className="hz-hero__ctas hz-delay-400">
            <Link to="/products">
              <Button className="hz-btn hz-btn--xl hz-btn--hero hz-animate-glow">
                {t("hero.cta_explore", "Explore Collection")}
              </Button>
            </Link>

            <Link to="/about">
              <Button
                variant="ghost"
                className="hz-btn hz-btn--xl hz-btn--outline"
              >
                {t("hero.cta_learn", "Learn Our Story")}
              </Button>
=======

  return (
    <section
      className="relative min-h-[80vh] flex items-center overflow-hidden"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      aria-label={t("largebanner.banner_aria")}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroAvif}
          alt={t("largebanner.banner_img_alt")}
          className="w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          {/* Title */}
          <h2 className="text-5xl md:text-7xl font-secondary font-bold text-foreground mb-6 leading-tight">
            {t("largebanner.brand")}
            <span className="block text-3xl md:text-4xl font-light bg-gradient-to-r from-[#d4af37] via-[#cfa255] to-[#b8860b] bg-clip-text text-transparent">
              {t("largebanner.by_sabri")}
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg font-cairo">
            <Trans i18nKey="largebanner.description" />
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="btn-lg btn-primary-gradient">
              {t("largebanner.explore")}
            </Link>

            <Link to="/about" className="btn-lg btn-outline-light">
              {t("largebanner.learn")}
>>>>>>> 1e8f5082f548298b745607be41c678f7c24d3772
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LargeBanner;
