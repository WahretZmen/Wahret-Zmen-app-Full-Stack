import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import "../Styles/StylesLargeBanner.css";

import heroAvif from "../assets/Jebbas/LargeBanner/Jebba-tunisienne-LargeBanner.avif"; // ✅ only AVIF

const LargeBanner = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

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
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LargeBanner;
