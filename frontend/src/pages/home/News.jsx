import React from 'react';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import news1 from "../../assets/news/news n°1 Wahret Zmen.webp";
import news2 from "../../assets/news/news n°2 Wahret Zmen.webp";
import news3 from "../../assets/news/news n°3 Wahret Zmen.webp";
import FadeInSection from '../../Animations/FadeInSection.jsx';
import "../../Styles/StylesNews.css"; // ✅ Import your CSS file

const News = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;
  const newsItems = t("news.items", { returnObjects: true }) || [];
  const images = [news1, news2, news3];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <FadeInSection>
      <div className="news-wrapper">
        <h2 className="news-title">{t("news.section_title")}</h2>

        <div className="news-slider-container">
          <Slider {...settings}>
            {newsItems.map((item, index) => (
              <div key={index} className="news-card">
                <div className="news-content">
                  <div className="news-image-wrapper">
                    <img
                      src={images[index] || news1}
                      alt={item.title}
                      className="news-image"
                    />
                  </div>
                  <div className="news-text">
                    <Link to="/" className="news-link">
                      <h3 className="news-heading">{item.title}</h3>
                    </Link>
                    <div className="news-divider"></div>
                    <p className="news-description">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </FadeInSection>
  );
};

export default News;
