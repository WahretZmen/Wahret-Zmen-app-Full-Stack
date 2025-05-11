import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import ScrollFade from '../../Animations/ScrollFade.jsx'; // ✅ Make sure this is the directional one
import AnimatedText from "../../Animations/AnimatedText.jsx";
import '../../Styles/StylesBanner.css';
import bannerImg from "../../assets/Banner/Banner.png";
import "../../Styles/StylesAnimatedText.css";

const Banner = () => {
  const { t, i18n } = useTranslation();

  if (!i18n.isInitialized) return null;

  
  return (
    <div className="banner-container-enhanced">
  
      {/* 🖼 Image - Fade from Right */}
      <div className="banner-image-wrapper">
      <ScrollFade direction="right-to-left" delay={0.5}>

  <Link to="/products">
    <img
      src={bannerImg}
      alt={t("banner_img_alt")}
      className="banner-img"
    />
  </Link>
</ScrollFade>


      </div>
  
      {/* ✨ Text Section */}
      <div className="banner-text-wrapper">
  
        {/* Title - No animation */}
        <ScrollFade direction="left-to-right" delay={0.5}>
  <h1 className="banner-title">{t("banner_title")}</h1>
</ScrollFade>

  
        {/* Description - Animated Text */}
        <div className="banner-description">
          <AnimatedText text={t("banner_description")} />
        </div>
  
        {/* CTA Button - No animation */}
        <ScrollFade direction="bottom" delay={0.6}>
  <Link to="/products">
    <button className="banner-cta-btn">
      {t("discover_now")}
    </button>
  </Link>
</ScrollFade>

  
      </div>
    </div>
  );
  
  };

export default Banner;
