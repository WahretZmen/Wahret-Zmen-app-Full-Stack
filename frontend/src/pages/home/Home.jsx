// src/pages/home/Home.jsx
// Home page (Arabic / RTL)

import React from "react";
import { Helmet } from "react-helmet";

import FadeInSection from "../../Animations/FadeInSection.jsx";
import "../../Styles/StylesHome.css";

import LargeBanner from "../../components/LargeBanner.jsx";
import Banner from "./Banner";
import ShopByCategory from "../../components/ShopByCategory.jsx";
import OurSellers from "./OurSellers";
import News from "./News";
import CraftsmanshipShowcase from "../../components/CraftsmanshipShowcase.jsx";
import AboutWahretZmen from "../../components/AboutWahretZmen.jsx";

import hommeJebba from "../../assets/Jebbas/Hommes/Jebba-Homme.jpg";
import femmeJebba from "../../assets/Jebbas/Femmes/Jebba-Femme.jpg";
import enfantJebba from "../../assets/Jebbas/Enfants/Jebba-Enfant.jpg";

import FullWidth from "../../components/ui/FullWidth";

const Home = () => {
  const isRTL = true;

  const shopItems = [
    {
      key: "hommes",
      label: "رجال",
      image: hommeJebba,
      to: "/products?category=hommes",
    },
    {
      key: "femmes",
      label: "نساء",
      image: femmeJebba,
      to: "/products?category=femmes",
    },
    {
      key: "enfants",
      label: "أطفال",
      image: enfantJebba,
      to: "/products?category=enfants",
    },
  ];

  return (
    <>
      <Helmet>
        <title>وهرة زمان - الملابس التقليدية وبائعونا</title>
        <meta
          name="description"
          content="مرحبًا بكم في وهرة زمان، استكشفوا مجموعتنا من الملابس التقليدية، والوافدات الجديدة، وآخر صيحات الموضة."
        />
      </Helmet>

      <FadeInSection delay={0} yOffset={0}>
        <div className="anim-scale-in">
          <FullWidth dir={isRTL ? "rtl" : "ltr"}>
            <LargeBanner />
          </FullWidth>
        </div>
      </FadeInSection>

      <div
        className="home-container px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1440px] mx-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <section className="home-title-block text-center">
          <h1 className={`home-title sparkle ${isRTL ? "rtl" : "ltr"}`}>
            <span className="home-title__text">الرئيسية</span>
            <span className="home-title__underline" />
          </h1>

          <p className="home-title__sub">
            مرحبًا بكم في <strong>بوتيك وهرة زمان</strong>، حيث تلتقي التقاليد
            بالأناقة. اكتشفوا ملابسنا المصنوعة يدويًا، المستوحاة من التراث
            الثقافي التونسي الغني. عيشوا تجربة أزياء خالدة تمزج بين التاريخ
            والرقي الحديث.
          </p>
        </section>

        <FadeInSection delay={0.2}>
          <section
            className="mb-16 anim-scale-in anim-delay"
            style={{ "--d": "100ms" }}
          >
            <div className="relative">
              <Banner />
              <span className="block h-[2px] w-1/2 mx-auto mt-6 rounded-full anim-shimmer" />
            </div>

            <div className="text-center mt-6">
              <p
                className="text-lg text-gray-700 max-w-3xl mx-auto px-2 anim-fade-up anim-delay"
                style={{ "--d": "120ms" }}
              >
                خطوة نحو التقاليد بأناقة. بوتيك وهرة زمان يقدم لكم مجموعة خالدة
                من الأزياء التونسية الأصيلة، مصنوعة بشغف وإرث.
              </p>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection delay={0.25}>
          <div className="anim-fade-up anim-delay" style={{ "--d": "80ms" }}>
            <ShopByCategory
              items={shopItems}
              title={
                <span
                  className="t-anim t-tracking t-delay t-underline"
                  style={{ "--t-delay": "100ms" }}
                >
                  تسوّق حسب الفئة
                </span>
              }
            />
          </div>
        </FadeInSection>

        <FadeInSection delay={0.3}>
          <section
            className="py-12 bg-[#ffffff] rounded-2xl shadow-xl mt-12 anim-fade-up anim-delay"
            style={{ "--d": "100ms" }}
          >
            <div className="text-center px-4">
              <h2
                className="text-3xl font-bold text-[#8A5D3B] drop-shadow-sm t-anim t-tracking t-glow t-delay"
                style={{ "--t-delay": "140ms" }}
              >
                مجموعاتنا
              </h2>

              <p
                className="text-lg text-gray-600 max-w-3xl mx-auto mt-3 anim-blur-in anim-delay"
                style={{ "--d": "180ms" }}
              >
                استكشفوا مجموعتنا من الملابس التقليدية المصنوعة بعناية وأصالة
                ثقافية. من القفاطين الأنيقة إلى الجباب التقليدية، اكتشفوا جمال
                التراث في كل قطعة.
              </p>
            </div>

            <OurSellers />
          </section>
        </FadeInSection>

        <FadeInSection delay={0.4}>
          <section
            className="py-12 bg-white rounded-2xl shadow-md mt-12 anim-fade-up anim-delay"
            style={{ "--d": "120ms" }}
          >
            <div className="text-center px-4">
              <h2
                className="text-3xl font-semibold text-[#5C3D2E] t-anim t-tracking t-delay"
                style={{ "--t-delay": "160ms" }}
              >
                <span className="t-underline t-delay" style={{ "--t-delay": "220ms" }}>
                  آخر الأخبار والاتجاهات
                </span>
              </h2>
            </div>

            <News />
          </section>
        </FadeInSection>

        <FadeInSection delay={0.43}>
          <div className="anim-fade-up anim-delay" style={{ "--d": "100ms" }}>
            <CraftsmanshipShowcase />
          </div>
        </FadeInSection>

        <FadeInSection delay={0.45}>
          <div className="anim-scale-in anim-delay" style={{ "--d": "80ms" }}>
            <AboutWahretZmen />
          </div>
        </FadeInSection>
      </div>
    </>
  );
};

export default Home;
