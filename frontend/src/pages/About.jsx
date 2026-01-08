// src/pages/About.jsx
// -----------------------------------------------------------------------------
// Purpose: Brand About page with hero, values, gallery, mission/crafted/behind,
//          and join sections. Arabic-only version with RTL layout.
// -----------------------------------------------------------------------------

import React, { useEffect } from "react";
import "../Styles/StylesAbout.css";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

// Layout
import Header from "../components/ui/Header.jsx";
import Footer from "../components/ui/Footer.jsx";

// Images (About folder)
import AboutImgn1 from "../assets/About/AboutImgn1.avif";
import AboutImgn2 from "../assets/About/AboutImgn2.avif";
import AboutImgn3 from "../assets/About/AboutImgn3.avif";
import AboutImgn4 from "../assets/About/AboutImgn4.avif";
import AboutImgn5 from "../assets/About/AboutImgn5.avif";
import AboutImgn6 from "../assets/About/AboutImgn6.avif";
import AboutImgn7 from "../assets/About/AboutImgn7.avif";

// -----------------------------------------------------------------------------
// Inline Icon component
// -----------------------------------------------------------------------------
const Icon = ({ name }) => {
  if (name === "heart") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
      </svg>
    );
  }
  if (name === "medal") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="5" />
        <path d="M8 13 6 22l6-3 6 3-2-9" />
      </svg>
    );
  }
  if (name === "spark") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M12 3l2.5 5L20 10.5 15 12l-3 6-3-6-5-1.5L9.5 8 12 3z" />
      </svg>
    );
  }
  if (name === "user") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
      </svg>
    );
  }
  if (name === "globe") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
      </svg>
    );
  }
  if (name === "clock") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    );
  }
  return null;
};

// -----------------------------------------------------------------------------
// Component (Arabic-only, RTL)
// -----------------------------------------------------------------------------
const About = () => {
  const location = useLocation();

  // Always scroll to top on mount (and clean #top hash if present)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (location.hash === "#top" && window.history.replaceState) {
      const { pathname, search } = window.location;
      window.history.replaceState(null, "", pathname + search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Static Arabic title text
  const titleText = "من نحن";

  // Value cards (icon + title + text) in Arabic
  const values = [
    {
      title: "أصالة في كل تفصيلة",
      text: "نستلهم تصاميمنا من التراث التونسي العريق، مع الحفاظ على روح الجبّة واللباس التقليدي بلمسة عصرية راقية.",
      icon: "heart",
    },
    {
      title: "جودة حرفية عالية",
      text: "كل قطعة تُخاط بعناية على يد حرفيين ذوي خبرة، مع اختيار أقمشة وخامات منتقاة لتمنحك راحة وأناقة تدوم.",
      icon: "medal",
    },
    {
      title: "تفاصيل مطرزة بحب",
      text: "من التطريز اليدوي إلى اللمسات الدقيقة، نهتم بأصغر التفاصيل لتكون كل جبّة تجربة خاصة وفريدة.",
      icon: "spark",
    },
    {
      title: "قريبة منكم",
      text: "نؤمن أن الأناقة الحقيقية تبدأ من الشعور بالثقة والراحة، لذلك نصمّم موديلات تناسب مختلف الأذواق والمقاسات.",
      icon: "user",
    },
    {
      title: "هوية تونسية مميزة",
      text: "نحمل جزءاً من روح تونس في كل تصميم، لنقدّم لك لباساً يجمع بين الهوية المحلية والذوق العالمي.",
      icon: "globe",
    },
    {
      title: "عناية بخدمتكم",
      text: "من اختيار الموديل حتى التوصيل، نرافقكم بخدمة محترفة وسريعة، مع جاهزية للرد على كل استفساراتكم.",
      icon: "clock",
    },
  ];

  return (
    <div
      id="top"
      className="about-page min-h-screen bg-[#fff] text-[#2b2b2b]"
      dir="rtl"
    >
      {/* Head metadata */}
      <Helmet>
        <title>من نحن | وهرة زمان</title>
        <meta
          name="description"
          content="اكتشف قصة وهرة زمان: جُبَب تقليدية بتصميم عصري، تطريزات دقيقة، وخامة مختارة بعناية لتمنحك أناقة من روح الماضي بروح اليوم."
        />
      </Helmet>

      {/* Header */}
      <Header />

      {/* ------------------------------------------------------------------- */}
      {/* HERO                                                              */}
      {/* ------------------------------------------------------------------- */}
      <section className="about-hero about-hero--gradient animate-fade-up">
        <div className="about-hero__overlay" />
        <div className="about-hero__content">
          {/* Title — RTL float animation */}
          <h1 className="about-hero__title about-hero__title--rtl">
            <span className="title-rtl-inner">{titleText}</span>
          </h1>

          {/* Subtitle */}
          <p className="about-hero__subtitle">
            اكتشف عالم <strong>وهرة زمان</strong> والروح التي تقف وراء كل جبّة وتفصيلة.
          </p>

          {/* CTAs */}
          <div className="about-hero__actions">
            <a href="/products" className="btn-luxury animate-pop-in">
              اكتشف الموديلات
            </a>
            <a
              href="/contact"
              className="btn-outline small-btn animate-pop-in delay-100"
            >
              تواصل معنا
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* VALUES                                                             */}
      {/* ------------------------------------------------------------------- */}
      <section className="section section--values animate-fade-in">
        <div className="section__inner section__inner--center">
          <h2 className="h2">قيم وهرة زمان</h2>
          <p className="p p--lead">
            في وهرة زمان، ليست الجبّة مجرد لباس، بل إحساس بالانتماء للأصل،
            وبأناقة تحترم ماضيك وتواكب يومك.
          </p>
        </div>

        <div className="values-grid">
          {values.map((v, i) => (
            <article
              key={i}
              className="value-card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="value-card__icon" aria-hidden="true">
                <Icon name={v.icon} />
              </div>
              <h3 className="h3">{v.title}</h3>
              <p className="p p--muted">{v.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* GALLERY                                                            */}
      {/* ------------------------------------------------------------------- */}
      <section className="section section--gallery animate-fade-in">
        <div className="section__inner section__inner--center">
          <h2 className="h2">من أجواء مجموعاتنا</h2>
          <p className="p p--lead">
            لقطات من الجبب، التطريز، والتفاصيل التي تميّز أسلوب{" "}
            <strong>وهرة زمان</strong> بين التقليدي والحديث.
          </p>
        </div>

        <div className="gallery-grid">
          {[AboutImgn1, AboutImgn2, AboutImgn3, AboutImgn4, AboutImgn5, AboutImgn6, AboutImgn7].map(
            (img, idx) => (
              <figure
                key={idx}
                className="gallery-card"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <img
                  src={img}
                  alt="صور من مجموعة وهرة زمان للجبب والتفاصيل المطرزة"
                  className="gallery-img"
                />
              </figure>
            )
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTENT (Mission / Crafted / Behind / Join)                   */}
      {/* ------------------------------------------------------------------- */}
      <main className="about-container">
        {/* Mission */}
        <section className="about-section animate-fade-in">
          <div className="about-grid single">
            <div className="about-col animate-slide-left">
              <h2 className="about-h2">رسالتنا</h2>
              <p className="about-p">
                رسالتنا أن نعيد إلى الجبّة التونسية مكانتها في خزانة كل شخص يحب
                الأناقة الأصيلة، مع تقديم تصاميم تناسب الحياة اليومية والمناسبات
                الخاصة.
              </p>
              <p className="about-p">
                نعمل على المزج بين الحرفية التقليدية والقصّات الحديثة، لنقدّم
                لكم قطعاً مريحة، أنيقة، وسهلة الارتداء، دون أن نفقد روح
                &quot;الزمن الجميل&quot;.
              </p>
            </div>
          </div>
        </section>

        {/* Crafted */}
        <section className="about-section animate-fade-in">
          <div className="about-grid single">
            <div className="about-col animate-slide-right">
              <h2 className="about-h2">حرفية في التصنيع</h2>
              <p className="about-p">
                كل جبّة تمرّ بعدّة مراحل دقيقة: من اختيار القماش، مروراً برسم
                الباترون، وصولاً للتطريز واللمسات النهائية. نراقب كل خطوة بحب
                واهتمام.
              </p>
              <p className="about-p">
                هدفنا أن تصلكم قطعة متقنة، متوازنة في الشكل والراحة، وترافقكم
                لسنوات مع الحفاظ على أناقتها وجودتها.
              </p>
            </div>
          </div>
        </section>

        {/* Behind */}
        <section className="about-section animate-fade-in">
          <div className="about-grid single">
            <div className="about-col animate-slide-left">
              <h2 className="about-h2">الروح وراء وهرة زمان</h2>
              <p className="about-p">
                خلف كل مجموعة فريق صغير يجمع بين المصممين، الحرفيين، وأشخاص
                يعشقون اللباس التقليدي. نعمل معاً لنترجم هذه المحبة إلى تفاصيل
                ملموسة تشعرون بها عند أول تجربة للجبّة.
              </p>
            </div>
          </div>
        </section>

        {/* Join / CTA */}
        <section className="about-section animate-fade-in">
          <div className="about-grid single">
            <div className="about-col animate-slide-right">
              <h2 className="about-h2">انضموا إلى عائلة وهرة زمان</h2>
              <p className="about-p">
                سواء كنتم تبحثون عن جبّة للمناسبات، للعيد، أو لستايل يومي
                مميّز، ستجدون في مجموعاتنا قطعاً تعبّر عنكم وتُشبه شخصيّتكم.
              </p>
              <p className="about-p">
                ندعوكم لاكتشاف موديلاتنا، متابعتنا على الشبكات الاجتماعية، أو
                التواصل معنا لأي طلب خاص أو مقاس معيّن. يسعدنا دائماً أن نكون
                جزءاً من لحظاتكم الجميلة.
              </p>
              <div className="about-cta">
                <a href="/products" className="btn-luxury animate-pop-in">
                  اكتشف الموديلات
                </a>
                <a
                  href="/contact"
                  className="btn-outline small-btn animate-pop-in delay-100"
                >
                  تواصل معنا
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
