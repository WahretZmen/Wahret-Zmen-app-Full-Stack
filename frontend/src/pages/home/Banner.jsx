import React from 'react';
import { useTranslation } from "react-i18next";
import ScrollFade from '../../Animations/ScrollFade.jsx';
import AnimatedText from "../../Animations/AnimatedText.jsx";
import '../../Styles/StylesBanner.css';
import bannerImg from "../../assets/Banner/Banner.png";
import "../../Styles/StylesAnimatedText.css";

const Banner = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  return (
    <a
      href="/products"
      onClick={() => window.scrollTo(0, 0)}
      className="banner-container-enhanced link-wrapper"
    >
      {/* 🖼 Image - Fade from Right */}
      <div className="banner-image-wrapper">
      <ScrollFade direction="fade-rotate-zoom" delay={0.5}>
  <img
    src={bannerImg}
    alt={t("banner_img_alt")}
    className="banner-img"
  />
</ScrollFade>




      </div>

      {/* ✨ Text Section */}
      <div className="banner-text-wrapper">
        <ScrollFade direction="left-to-right" delay={0.5}>
          <h1 className="banner-title">{t("banner_title")}</h1>
        </ScrollFade>

<ScrollFade>
        <div className="banner-description">
          <AnimatedText text={t("banner_description")} />
        </div>
</ScrollFade>

        <ScrollFade direction="bottom" delay={0.6}>
          <button className="banner-cta-btn">
            {t("discover_now")}
          </button>
        </ScrollFade>
      </div>
    </a>
  );
};

export default Banner;
