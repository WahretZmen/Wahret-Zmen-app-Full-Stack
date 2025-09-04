// src/pages/home/News.jsx
// -----------------------------------------------------------------------------
// Purpose: Display a slider with latest Wahret Zmen news/highlights.
// Features:
//   - Localized (i18n) titles and descriptions.
//   - Responsive carousel powered by react-slick.
//   - RTL support for Arabic.
//   - Full reload navigation to /about when a news card is clicked.
// Notes:
//   - No logic/content changes, only structure & comments added.
// -----------------------------------------------------------------------------

import React from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// Slick carousel base styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Assets
import news1 from "../../assets/news/news n°1 Wahret Zmen.webp";
import news2 from "../../assets/news/news n°2 Wahret Zmen.webp";
import news3 from "../../assets/news/news n°3 Wahret Zmen.webp";

// Styles
import "../../Styles/StylesNews.css";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const News = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  // ---------------------------------------------------------------------------
  // Local setup
  // ---------------------------------------------------------------------------
  const dir = i18n.language === "ar" ? "rtl" : "ltr"; // RTL for Arabic
  const arrow = dir === "rtl" ? "←" : "→"; // arrow direction depends on text dir
  const newsItems = t("news.items", { returnObjects: true }) || [];
  const images = [news1, news2, news3];

  // Slick carousel config
  const settings = {
    dots: true,
    infinite: true,
    speed: 650,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4200,
    pauseOnHover: true,
    arrows: false,
    rtl: dir === "rtl",
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <section className="news-section" dir={dir} aria-labelledby="news-heading">
      <div className="news-container">
        {/* Header */}
        <header className="news-header">
          <h2 id="news-heading" className="news-title-pro">
            <span className="news-title-topline" />
            {t("news.section_title")}
            <span className="news-title-underline" />
          </h2>
          <p className="news-sub">
            {t("news.subtitle", {
              defaultValue:
                "Latest highlights from Wahret Zmen — craftsmanship, new arrivals, and stories behind our creations.",
            })}
          </p>
        </header>

        {/* Carousel */}
        <div className="news-slider-wrap">
          <Slider {...settings}>
            {newsItems.map((item, idx) => {
              const img = images[idx] || images[0];

              // Title & description fallbacks
              const title =
                item?.title ||
                t("news.fallback_title", { defaultValue: "Wahret Zmen News" });
              const description =
                item?.description ||
                t("news.fallback_desc", {
                  defaultValue:
                    "Discover our latest collections and atelier moments.",
                });

              return (
                <div key={idx} className="news-slide">
                  {/* ✅ Full reload navigation to /about */}
                  <Link
                    to="/about"
                    reloadDocument
                    className="news-card-pro"
                    aria-label={title}
                  >
                    {/* Image/media wrapper */}
                    <div className="news-media">
                      <img
                        src={img}
                        alt={title}
                        loading="lazy"
                        className="news-img"
                        width="640"
                        height="360"
                      />
                      <span className="news-media-shine" />
                      <span className="news-gold-border" />
                    </div>

                    {/* Body/content */}
                    <div className="news-body">
                      <h3 className="news-heading-pro">{title}</h3>
                      <p className="news-desc-pro">{description}</p>
                      <span className="news-cta">
                        {t("news.read_more", { defaultValue: "Learn more" })}{" "}
                        {arrow}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
export default News;
