import React from "react";
import "../Styles/StylesAbout.css";
import FadeInSection from "../Animations/FadeInSection.jsx";
import aboutImage1 from "../assets/About/about-img-1.webp";
import aboutImage2 from "../assets/About/about-img-2.webp";
import aboutImage3 from "../assets/About/about-img-3.webp";
import aboutImage4 from "../assets/About/About-img-Mosquee.png";
import aboutImage5 from "../assets/About/about-img-5.webp";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  return (
    <div className="main-content">
      <section className="px-6 py-12 max-w-6xl mx-auto about-section space-y-16">

        <Helmet>
          <title>{t('about.title')} | {t('navbar.brand')}</title>
          <meta name="description" content={t('home_meta_description')} />
        </Helmet>

        {/* Section 1 */}
        <FadeInSection>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#5C3D2E] mb-4 border-b-2 border-[#c69c6d] inline-block pb-2">
              {t('about.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('about.description')}
            </p>
          </div>
        </FadeInSection>

        {/* Image Wahret Zmen boutique */}
        <FadeInSection>
          <div className="text-center">
            <img
              src={aboutImage1}
              alt="Wahret Zmen Boutique Interior"
              loading="lazy"
              fetchpriority="low"
              className="rounded-2xl border-4 border-[#c69c6d] shadow-2xl mx-auto w-full max-w-md h-[300px] object-cover transition duration-700 ease-in-out hover:scale-110 hover:brightness-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            />
          </div>
        </FadeInSection>

        {/* Section 2 */}
        <FadeInSection>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#5C3D2E] mb-4 border-b-2 border-[#c69c6d] inline-block pb-2">
              {t('about.mission_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('about.mission_text1')}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('about.mission_text2')}
            </p>
          </div>
        </FadeInSection>

        {/* Image Our Missions */}
        <FadeInSection>
          <div className="text-center">
            <img
              src={aboutImage2}
              alt="Wahret Zmen Boutique Interior"
              loading="lazy"
              fetchpriority="low"
              className="rounded-2xl border-4 border-[#c69c6d] shadow-2xl mx-auto w-full max-w-md h-[300px] object-cover transition duration-700 ease-in-out hover:scale-110 hover:brightness-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            />
          </div>
        </FadeInSection>

         
        {/* Section 3 */}
        <FadeInSection>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#5C3D2E] mb-4 border-b-2 border-[#c69c6d] inline-block pb-2">
              {t('about.crafted_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('about.crafted_text1')}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('about.crafted_text2')}
            </p>
          </div>
        </FadeInSection>

        {/* Image Our Products*/}
        <FadeInSection>
          <div className="text-center">
            <img
              src={aboutImage3}
              alt="Wahret Zmen Boutique Interior"
              loading="lazy"
              fetchpriority="low"
              className="rounded-2xl border-4 border-[#c69c6d] shadow-2xl mx-auto w-full max-w-md h-[300px] object-cover transition duration-700 ease-in-out hover:scale-110 hover:brightness-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            />
          </div>
        </FadeInSection>

       

        {/* Section 4 */}
        <FadeInSection>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#5C3D2E] mb-4 border-b-2 border-[#c69c6d] inline-block pb-2">
              {t('about.behind_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('about.behind_text')}
            </p>
          </div>
        </FadeInSection>

        {/* Image The heart of El Medina El Arbi*/}
        <FadeInSection>
          <div className="text-center">
            <img
              src={aboutImage4}
              alt="Wahret Zmen Boutique Interior"
              loading="lazy"
              fetchpriority="low"
              className="rounded-2xl border-4 border-[#c69c6d] shadow-2xl mx-auto w-full max-w-md h-[300px] object-cover transition duration-700 ease-in-out hover:scale-110 hover:brightness-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            />
          </div>
        </FadeInSection>

       

        

        {/* Section 5 */}
        <FadeInSection>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#5C3D2E] mb-4 border-b-2 border-[#c69c6d] inline-block pb-2">
              {t('about.join_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('about.join_text1')}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('about.join_text2')}
            </p>
          </div>
        </FadeInSection>

        {/* Join our Heritage */}
        <FadeInSection>
          <div className="text-center">
            <img
              src={aboutImage5}
              alt="Wahret Zmen Boutique Interior"
              loading="lazy"
              fetchpriority="low"
              className="rounded-2xl border-4 border-[#c69c6d] shadow-2xl mx-auto w-full max-w-md h-[300px] object-cover transition duration-700 ease-in-out hover:scale-110 hover:brightness-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            />
          </div>
        </FadeInSection>

        
      </section>
    </div>
  );
};

export default About;
