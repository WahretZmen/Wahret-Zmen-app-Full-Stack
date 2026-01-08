// src/pages/home/OurSellers.jsx
// -----------------------------------------------------------------------------
// "Wahret Zmen Collection" section with product carousel and category filter.
// Arabic-only UI with static text and RTL layout.
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { useGetAllProductsQuery } from "../../redux/features/products/productsApi";
import ProductCard from "../products/ProductCard";
import Selector from "../../components/Selector.jsx";

import FadeInSection from "../../Animations/FadeInSection.jsx";
import ScrollFade from "../../Animations/ScrollFade.jsx";

import "../../Styles/StylesOurSellers.css";

/* Always RTL for this section */
const isRTL = true;

/* Category keys used for sorting logic (normalized to lower-case) */
const CATEGORY_ORDER = {
  men: 1,
  women: 2,
  children: 3,
};

/* Selector options in Arabic (static, no i18n)
   value = backend category string (Men / Women / Children) */
const CATEGORY_OPTIONS_AR = [
  { value: "", label: "الكل" },       // ALL
  { value: "Men", label: "رجال" },    // Men
  { value: "Women", label: "نساء" },  // Women
  { value: "Children", label: "أطفال" }, // Children
];

/* Carousel responsive breakpoints */
const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1400 }, items: 3, slidesToSlide: 1 },
  desktop:           { breakpoint: { max: 1400, min: 1024 }, items: 3, slidesToSlide: 1 },
  tablet:            { breakpoint: { max: 1024, min: 768 },  items: 2, slidesToSlide: 1 },
  mobile:            { breakpoint: { max: 768,  min: 0 },    items: 1, slidesToSlide: 1 },
};

/* Static Arabic UI text */
const SECTION_TITLE = "مجموعة وهرة زمان";
const SELECT_CATEGORY_LABEL = "اختر الفئة";
const PREVIOUS_LABEL = "السابق";
const NEXT_LABEL = "التالي";
const NO_PRODUCTS_TEXT = "لا توجد منتجات حالياً.";

const OurSellers = () => {
  // Currently selected category ("" = all)
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch all products from API
  const { data: products = [] } = useGetAllProductsQuery(undefined, {
    pollingInterval: 5000,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const norm = (s = "") => String(s).trim().toLowerCase();

  // Filter and sort products based on category
  const filteredProducts =
    selectedCategory === ""
      ? [...products].sort((a, b) => {
          return (
            (CATEGORY_ORDER[norm(a.category)] || 99) -
            (CATEGORY_ORDER[norm(b.category)] || 99)
          );
        })
      : products.filter(
          (p) => norm(p.category) === norm(selectedCategory)
        );

  // Carousel arrow button
  const Arrow = ({ onClick, type }) => {
    const icon = type === "prev" ? "‹" : "›";

    return (
      <button
        type="button"
        className={`wz-arrow ${type === "prev" ? "wz-prev" : "wz-next"}`}
        onClick={onClick}
        aria-label={type === "prev" ? PREVIOUS_LABEL : NEXT_LABEL}
      >
        <span className="wz-arrow-icon">{icon}</span>
      </button>
    );
  };

  return (
    <FadeInSection>
      <div className="our-sellers-wrapper" dir={isRTL ? "rtl" : "ltr"}>
        <section className="our-sellers-section" aria-label={SECTION_TITLE}>
          <div className="our-sellers-container">
            {/* Section title */}
            <ScrollFade direction="right" delay={0}>
              <h2 className="text-4xl text-[#5a382d] font-bold mb-6 text-center tracking-wide our-sellers-title os-title">
                <span className="os-title__text">{SECTION_TITLE}</span>
              </h2>
            </ScrollFade>

            {/* Category selector */}
            <div className="mb-6 flex flex-col items-center px-2 sm:px-0 w-full">
              <h3 className="select-category-title text-lg sm:text-xl font-semibold text-[#5a382d] mb-2 text-center">
                {SELECT_CATEGORY_LABEL}
              </h3>

              <div className="w-full px-2 sm:px-0 max-w-xs">
                <Selector
                  options={CATEGORY_OPTIONS_AR}
                  value={selectedCategory}
                  onSelect={setSelectedCategory}
                />
              </div>
            </div>

            {/* Carousel with products */}
            <div className="max-w-6xl mx-auto px-2 sm:px-4">
              {filteredProducts.length > 0 ? (
                <div className="carousel-clip custom-carousel">
                  <Carousel
                    responsive={responsive}
                    autoPlay
                    autoPlaySpeed={3000}
                    infinite
                    swipeable
                    draggable
                    keyBoardControl
                    customTransition="transform 350ms ease"
                    arrows
                    showDots={false}
                    containerClass="rmc-list"
                    sliderClass="rmc-track"
                    itemClass="rmc-item"
                    customLeftArrow={<Arrow type="prev" />}
                    customRightArrow={<Arrow type="next" />}
                    rtl={isRTL} // ✅ ensure items flow right-to-left
                  >
                    {filteredProducts.map((product, index) => (
                      <FadeInSection
                        key={index}
                        delay={index * 0.1}
                        duration={0.6}
                        yOffset={30}
                      >
                        <div className="carousel-card-wrapper">
                          {/* Counter is hidden here to keep slides clean */}
                          <ProductCard product={product} showCounter={false} />
                        </div>
                      </FadeInSection>
                    ))}
                  </Carousel>
                </div>
              ) : (
                <p className="text-center text-[#5a382d] text-lg">
                  {NO_PRODUCTS_TEXT}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </FadeInSection>
  );
};

export default OurSellers;
