import React from "react";
import "../Styles/StylesLargeBanner.css";
import { Trans, useTranslation } from "react-i18next";
import bannerImg from "../assets/Banner/LargeBanner.png";

const LargeBanner = () => {
const { t, i18n } = useTranslation();
const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";
if (!i18n.isInitialized) return null;

  return (
    <section className="wahretzmen-banner">
      <img
        src={bannerImg}
        alt="À propos de Wahret Zmen"
        className="wahretzmen-banner-img"
      />
      <div className="wahretzmen-banner-title">
        <h1>{t("Welcome_Banner_title")}</h1>
      </div>
    </section>
  );
};

export default LargeBanner;
