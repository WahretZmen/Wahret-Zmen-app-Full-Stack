import React from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import news1 from "../../assets/news/news n°1 Wahret Zmen.webp";
import news2 from "../../assets/news/news n°2 Wahret Zmen.webp";
import news3 from "../../assets/news/news n°3 Wahret Zmen.webp";
import "../../Styles/StylesNews.css"; // ✅ full new CSS below

const News = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  const dir = i18n.language === "ar" ? "rtl" : "ltr";
  const arrow = dir === "rtl" ? "←" : "→";
  const newsItems = t("news.items", { returnObjects: true }) || [];
  const images = [news1, news2, news3];

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

  return (
    <section className="news-section" dir={dir} aria-labelledby="news-heading">
      <div className="news-container">
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

        <div className="news-slider-wrap">
          <Slider {...settings}>
            {newsItems.map((item, idx) => {
              const img = images[idx] || images[0];
              const title =
                item?.title ||
                t("news.fallback_title", { defaultValue: "Wahret Zmen News" });
              const description =
                item?.description ||
                t("news.fallback_desc", {
                  defaultValue: "Discover our latest collections and atelier moments.",
                });

              return (
                <div key={idx} className="news-slide">
                  {/* ✅ full reload navigation */}
                  <Link
                    to="/about"
                    reloadDocument
                    className="news-card-pro"
                    aria-label={title}
                  >
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

                    <div className="news-body">
                      <h3 className="news-heading-pro">{title}</h3>
                      <p className="news-desc-pro">{description}</p>
                      <span className="news-cta">
                        {t("news.read_more", { defaultValue: "Learn more" })} {arrow}
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

export default News;
