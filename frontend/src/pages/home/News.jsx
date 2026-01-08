// src/pages/home/News.jsx
// -----------------------------------------------------------------------------
// News section for Wahret Zmen.
// Arabic-only text with a premium carousel (react-slick), RTL-aware.
// -----------------------------------------------------------------------------

import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";

// Base slick styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Assets
import news1 from "../../assets/Home/news/news n°1 Wahret Zmen.avif";
import news2 from "../../assets/Home/news/news n°2 Wahret Zmen.avif";
import news3 from "../../assets/Home/news/news n°3 Wahret Zmen.avif";

// Styles
import "../../Styles/StylesNews.css";

const AUTOPLAY_MS = 4200;

const News = () => {
  const dir = "rtl";
  const arrow = "←";

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // Static Arabic news items
  const items = [
    {
      title: "مجموعة جديدة من الجبب التقليدية",
      description:
        "اكتشفوا أحدث تصاميم وهرة زمان المستوحاة من التراث التونسي مع لمسة عصرية تناسب مناسباتكم الخاصة.",
      img: news1,
    },
    {
      title: "لمسة من مشغل وهرة زمان",
      description:
        "نشارككم لحظات من داخل المشغل، حيث تتجسد الحرفية في كل غرزة وتُحاك التفاصيل بحب وشغف.",
      img: news2,
    },
    {
      title: "تطريز يدوي بتوقيع تونسي",
      description:
        "تعرّفوا على تفاصيل التطريز اليدوي الذي يزيّن قطعنا ويمنحها طابعاً فريداً لا يشبه أي قطعة أخرى.",
      img: news3,
    },
  ];

  const onlyOne = items.length <= 1;

  const settings = {
    dots: true,
    infinite: !onlyOne,
    speed: 650,
    slidesToShow: Math.min(2, items.length || 1),
    slidesToScroll: 1,
    autoplay: !reduceMotion && !onlyOne,
    autoplaySpeed: AUTOPLAY_MS,
    pauseOnHover: true,
    arrows: false,
    rtl: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section
      className="news-section"
      dir={dir}
      aria-labelledby="news-heading"
      aria-live="off"
    >
      <div className="news-container">
        {/* Header */}
        <header className="news-header">
          <h2 id="news-heading" className="news-title-pro">
            <span className="news-title-topline" />
            أخبار وهرة زمان
            <span className="news-title-underline" />
          </h2>

          <p className="news-sub">
            تابعوا أحدث الأخبار، الإصدارات الجديدة، ولقطات من كواليس مشغل وهرة
            زمان، حيث تُصنع كل جبّة بروح خاصة.
          </p>
        </header>

        {/* Carousel */}
        <div className="news-slider-wrap">
          <Slider {...settings}>
            {items.map((item, idx) => {
              const { img, title, description } = item;

              return (
                <div key={idx} className="news-slide">
                  <Link
                    to="/about"
                    reloadDocument
                    className="news-card-pro"
                    aria-label={title}
                  >
                    {/* Media */}
                    <div className="news-media">
                      <img
                        src={img}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="news-img"
                        width="640"
                        height="360"
                      />
                      <span className="news-media-shine" />
                      <span className="news-gold-border" />
                    </div>

                    {/* Content */}
                    <div className="news-body">
                      <h3 className="news-heading-pro">{title}</h3>
                      <p className="news-desc-pro">{description}</p>
                      <span className="news-cta">
                        اكتشفوا المزيد {arrow}
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
