import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import heroAvif from "../assets/Jebbas/LargeBanner/Jebba-tunisienne-LargeBanner.avif";
import "@/Styles/StylesLargeBanner.css";

const LargeBanner = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

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
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LargeBanner;
