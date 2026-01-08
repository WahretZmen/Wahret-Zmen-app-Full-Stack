// Recommended.jsx
// -----------------------------------------------------------------------------
// Purpose : Carousel of recommended products using Swiper.
// Notes   : Only comments/structure added. No logic/JSX/text changes.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react';

// Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper modules
import { Pagination, Navigation } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Local components & data hooks
import ProductCard from '../products/ProductCard';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const Recommended = () => {
  // ---------------------------------------------------------------------------
  // 1) Data
  // ---------------------------------------------------------------------------
  const { data: products = [] } = useFetchAllProductsQuery();

  // ---------------------------------------------------------------------------
  // 2) Render
  // ---------------------------------------------------------------------------
  return (
    <div className="py-16">
      {/* Section title */}
      <h2 className="text-3xl text-gray-600 italic font-medium mb-6 text-center tracking-wide transition-all duration-300 ease-in-out">
        Recommended for You
      </h2>

      {/* Swiper carousel */}
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
          1180: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {/* Slides: slice(1,7) to skip the very first and limit total */}
        {products.length > 0 &&
          products.slice(1, 7).map((product, index) => (
            <SwiperSlide key={index}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Recommended;
