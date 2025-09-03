import React, { useState, useEffect } from "react";
import ProductCard from "../products/ProductCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useGetAllProductsQuery } from "../../redux/features/products/productsApi";
import Selector from "../../components/Selector.jsx";
import "../../Styles/StylesOurSellers.css";
import FadeInSection from "../../Animations/FadeInSection.jsx";
import { useTranslation } from "react-i18next";
import ScrollFade from "../../Animations/ScrollFade.jsx";

// ✅ Canonical keys so Selector translates (AR shows "الكل")
const categories = ["all", "men", "women", "children"];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1400 }, items: 3, slidesToSlide: 1 },
  desktop:           { breakpoint: { max: 1400, min: 1024 }, items: 3, slidesToSlide: 1 },
  tablet:            { breakpoint: { max: 1024, min: 768 },  items: 2, slidesToSlide: 1 },
  mobile:            { breakpoint: { max: 768,  min: 0 },    items: 1, slidesToSlide: 1 },
};

const OurSellers = () => {
  // "" means “All”
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: products = [] } = useGetAllProductsQuery(undefined, {
    pollingInterval: 5000,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const { t, i18n } = useTranslation();

  const isRTL =
    i18n.language === "ar" ||
    i18n.language === "ar-SA" ||
    (typeof i18n.language === "string" && i18n.language.startsWith("ar"));
  if (!i18n.isInitialized) return null;

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  const norm = (s = "") => String(s).trim().toLowerCase();

  const filteredProducts =
    selectedCategory === ""
      ? [...products].sort((a, b) => {
          const order = { men: 1, women: 2, children: 3 };
          return (order[norm(a.category)] || 99) - (order[norm(b.category)] || 99);
        })
      : products.filter((p) => norm(p.category) === norm(selectedCategory));

  /* ---------- Custom, RTL-aware arrows ---------- */
  const Arrow = ({ onClick, type }) => {
    // type: 'prev' | 'next'
    // For RTL, icons swap directions visually
    const icon = type === "prev"
      ? (isRTL ? "›" : "‹")   // previous
      : (isRTL ? "‹" : "›");  // next

    return (
      <button
        type="button"
        className={`wz-arrow ${type === "prev" ? "wz-prev" : "wz-next"}`}
        onClick={onClick}
        aria-label={type === "prev" ? (t("previous") || "Previous") : (t("next") || "Next")}
      >
        <span className="wz-arrow-icon">{icon}</span>
      </button>
    );
  };

  return (
    <FadeInSection>
      <div className="our-sellers-wrapper" dir={isRTL ? "rtl" : "ltr"}>
        <section className="our-sellers-section" aria-label={t("wahret_zmen_collection")}>
          <div className="our-sellers-container">
            {/* ===== Title ===== */}
            <ScrollFade direction="right" delay={0}>
              <h2 className="text-4xl text-[#5a382d] font-bold mb-6 text-center uppercase tracking-wide our-sellers-title os-title">
                <span className="os-title__text">{t("wahret_zmen_collection")}</span>
              </h2>
            </ScrollFade>

            {/* ===== Category Filter ===== */}
            <div className="mb-6 flex flex-col items-center px-2 sm:px-0 w-full">
              <h3 className="select-category-title text-lg sm:text-xl font-semibold text-[#5a382d] mb-2 text-center">
                {t("select_category")}
              </h3>
              <div className="w-full px-2 sm:px-0 max-w-xs">
                <Selector
                  options={categories}
                  value={selectedCategory}        /* "" -> All */
                  onSelect={setSelectedCategory}  /* Selector returns "" for 'all' */
                />
              </div>
            </div>

            {/* ===== Carousel ===== */}
            <div className="max-w-6xl mx-auto px-2 sm:px-4">
              {filteredProducts.length > 0 ? (
                <div className="carousel-clip custom-carousel">
                  <Carousel
                    responsive={responsive}
                    autoPlay
                    autoPlaySpeed={3000}
                    infinite
                    arrows
                    swipeable
                    draggable
                    showDots={false}
                    keyBoardControl
                    rtl={isRTL}
                    customTransition="transform 350ms ease"
                    containerClass="rmc-list"
                    sliderClass="rmc-track"
                    itemClass="rmc-item"
                    // 👇 Custom arrows (bigger, RTL-safe, mobile-friendly)
                    customLeftArrow={<Arrow type="prev" />}
                    customRightArrow={<Arrow type="next" />}
                  >
                    {filteredProducts.map((product, index) => (
                      <FadeInSection key={index} delay={index * 0.1} duration={0.6} yOffset={30}>
                        <div className="carousel-card-wrapper">
                          <ProductCard product={product} />
                        </div>
                      </FadeInSection>
                    ))}
                  </Carousel>
                </div>
              ) : (
                <p className="text-center text-[#5a382d] text-lg">{t("no_products_found")}</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </FadeInSection>
  );
};

export default OurSellers;
