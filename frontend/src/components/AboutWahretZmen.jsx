import React from "react";
import { Award, Heart, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../Styles/StylesAboutWahretZmen.css";

const AboutWahretZmen = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  const isRTL = i18n.language?.startsWith("ar");

  return (
    <section className="wz-about-basic" dir={isRTL ? "rtl" : "ltr"}>
      <div className="wz-container">
        <div className="wz-grid">
          {/* Left column */}
          <div className="wz-left wz-anim-slide-left">
            <h2 className="wz-title wz-anim-fade-up">
              {t("AboutWahretZmen.title", "The Art of Traditional Elegance")}
            </h2>

            <p className="wz-paragraph wz-anim-delay-200">
              {t(
                "AboutWahretZmen.p1",
                "At Wahret Zmen By Sabri, we preserve the rich heritage of traditional craftsmanship while embracing contemporary design. Each Jebba is meticulously handcrafted by skilled artisans who have passed down their techniques through generations."
              )}
            </p>

            <p className="wz-paragraph wz-anim-delay-300">
              {t(
                "AboutWahretZmen.p2",
                "Our commitment to authenticity and quality ensures that every piece not only honors the past but also celebrates the timeless beauty of traditional attire."
              )}
            </p>

            <a href="/products" className="wz-btn wz-btn-luxury wz-anim-delay-400">
              {t("AboutWahretZmen.cta", "Discover Our Heritage")}
            </a>
          </div>

          {/* Right column */}
          <div className="wz-right wz-anim-slide-right">
            {/* Card 1 */}
            <div className="wz-card wz-anim-delay-200">
              <div className="wz-icon">
                <Award />
              </div>
              <div className="wz-card-content">
                <h3 className="wz-card-title">
                  {t("AboutWahretZmen.features.craftsmanship.title", "Master Craftsmanship")}
                </h3>
                <p className="wz-card-text">
                  {t(
                    "AboutWahretZmen.features.craftsmanship.desc",
                    "Each piece is handcrafted by experienced artisans with decades of expertise in traditional techniques."
                  )}
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="wz-card wz-anim-delay-300">
              <div className="wz-icon">
                <Heart />
              </div>
              <div className="wz-card-content">
                <h3 className="wz-card-title">
                  {t("AboutWahretZmen.features.heritage.title", "Authentic Heritage")}
                </h3>
                <p className="wz-card-text">
                  {t(
                    "AboutWahretZmen.features.heritage.desc",
                    "We honor traditional design elements while adapting for modern comfort and style."
                  )}
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="wz-card wz-anim-delay-400">
              <div className="wz-icon">
                <Sparkles />
              </div>
              <div className="wz-card-content">
                <h3 className="wz-card-title">
                  {t("AboutWahretZmen.features.quality.title", "Premium Quality")}
                </h3>
                <p className="wz-card-text">
                  {t(
                    "AboutWahretZmen.features.quality.desc",
                    "Only the finest fabrics and materials are selected to ensure lasting beauty and comfort."
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* /right */}
        </div>
      </div>
    </section>
  );
};

export default AboutWahretZmen;
