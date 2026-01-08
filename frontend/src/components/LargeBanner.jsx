// src/components/LargeBanner.jsx
// -----------------------------------------------------------------------------
// Large hero banner with background carousel and CTA buttons (Arabic only).
// -----------------------------------------------------------------------------

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Assets
import heroAvif from "../assets/Home/LargeBanner/Large-Banner1.avif";
import heroAvif2 from "../assets/Home/LargeBanner/Large-Banner2.avif";
import heroAvif3 from "../assets/Home/LargeBanner/Large-Banner3.avif";
import logoImg from "../assets/Logo/Logo-Boutique-Wahret-Zmen.png";

import "../Styles/StylesLargeBanner.css";

const AUTOPLAY_MS = 6000; // slide duration
const TRANSITION_MS = 700; // fade duration

const LargeBanner = () => {
  const isRTL = true;

  // Track image load + active slide + autoplay state
  const [imgLoaded, setImgLoaded] = useState([false, false, false]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [bootLoaded, setBootLoaded] = useState(false);

  const timerRef = useRef(null);
  const progressRef = useRef(null);

  // Slides with Arabic alt text
  const heroSlides = useMemo(
    () => [
      {
        id: "slide-1",
        img: heroAvif3,
        alt: "لافتة وهرة زمان التقليدية",
      },
      {
        id: "slide-2",
        img: heroAvif2,
        alt: "ملابس تقليدية تونسية من بوتيك وهرة زمان",
      },
      {
        id: "slide-3",
        img: heroAvif,
        alt: "جبّة تونسية تقليدية من وهرة زمان",
      },
    ],
    []
  );

  const brand = "وهرة زمان";
  const bySabri = "بإدارة صبري";

  // Autoplay with top progress bar
  useEffect(() => {
    if (!bootLoaded) return;
    if (paused || heroSlides.length < 2) return;

    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, bootLoaded, heroSlides.length]);

  const startAutoplay = () => {
    stopAutoplay();
    timerRef.current = setTimeout(() => {
      goTo(index + 1);
    }, AUTOPLAY_MS);

    // Animate progress bar each cycle
    if (progressRef.current) {
      progressRef.current.style.transition = "none";
      progressRef.current.style.width = "0%";
      requestAnimationFrame(() => {
        progressRef.current.style.transition = `width ${AUTOPLAY_MS}ms linear`;
        progressRef.current.style.width = "100%";
      });
    }
  };

  const stopAutoplay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    if (progressRef.current) {
      progressRef.current.style.transition = "none";
      progressRef.current.style.width = "0%";
    }
  };

  // Carousel helpers
  const clamp = (n) => (n + heroSlides.length) % heroSlides.length;
  const goTo = (n) => setIndex(clamp(n));
  const prev = () => (isRTL ? goTo(index + 1) : goTo(index - 1));
  const next = () => (isRTL ? goTo(index - 1) : goTo(index + 1));

  // Keyboard support
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") (isRTL ? next() : prev());
    if (e.key === "ArrowRight") (isRTL ? prev() : next());
  };

  // When first image is loaded, allow autoplay
  useEffect(() => {
    if (imgLoaded[0]) setBootLoaded(true);
  }, [imgLoaded]);

  const onImgLoad = (idx) =>
    setImgLoaded((arr) => {
      const copy = [...arr];
      copy[idx] = true;
      return copy;
    });

  return (
    <section
      className={`hz-hero ${imgLoaded[0] ? "is-loaded" : ""}`}
      aria-label="مرحبًا بكم في وهرة زمان"
      dir="rtl"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Background slider */}
      <div className="hz-hero__bg" aria-hidden="true">
        <div className="hz-hero__lqip" />

        {heroSlides.map((s, i) => {
          const active = i === index;
          return (
            <picture
              key={s.id}
              style={{
                position: "absolute",
                inset: 0,
                opacity: active && imgLoaded[i] ? 1 : 0,
                transition: `opacity ${TRANSITION_MS}ms ease`,
              }}
            >
              <source srcSet={s.img} type="image/avif" />
              <img
                src={s.img}
                alt={s.alt}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding={i === 0 ? "sync" : "async"}
                width={1920}
                height={1080}
                sizes="100vw"
                className="hz-kenburns"
                onLoad={() => onImgLoad(i)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </picture>
          );
        })}

        <div className="hz-hero__overlay" />
        <div className="hz-hero__bokeh" />
      </div>

      {/* Progress bar */}
      {heroSlides.length > 1 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 3,
            background: "rgba(0,0,0,.06)",
            zIndex: 2,
          }}
          aria-hidden="true"
        >
          <span
            ref={progressRef}
            style={{
              display: "block",
              height: "100%",
              width: 0,
              background:
                "linear-gradient(90deg, #c79a4a, #e6c27a, #f3d58c, #b8863b)",
            }}
          />
        </div>
      )}

      {/* Foreground content */}
      <div className="hz-hero__container">
        <div className="hz-hero__grid">
          <div className="hz-hero__content">
            {/* Logo */}
            <div className="hz-logo-wrap hz-logo-luxe" aria-label={brand}>
              <img
                src={logoImg}
                alt={brand}
                className="hz-hero__logo"
                loading="eager"
                decoding="sync"
              />
            </div>

            {/* Title / byline */}
            <h2 className="hz-hero__title animate-fade-in-up">
              <span className="hz-hero__by animate-fade-in-delay-400">
                {bySabri}
              </span>
            </h2>

            <div
              className="hz-title-underline animate-underline"
              aria-hidden="true"
            />

            {/* Description (Arabic from i18n content) */}
            <p className="hz-hero__subtitle animate-fade-in-delay-300">
              وهرة زمان، الصَّنعة وأسرارها بإدارة صبري — بوتيك تونسي فاخر يجسّد
              روح الأصالة في أبهى صورها. من قلب سوق الصوف بتونس، نقدّم تشكيلة
              منتقاة بعناية من الأزياء التقليدية الراقية، حيث تتجلّى الحرفية
              الدقيقة في كل جبّة تُحاك بخيوط من التراث والجمال.
            </p>

            {/* CTAs */}
            <div className="hz-hero__ctas hz-delay-400">
              <Link
                to="/products"
                reloadDocument
                className="hz-btn hz-btn--xl hz-btn--primary animate-glow"
              >
                <span className="hz-btn__label">مجموعة وهرة زمان</span>
              </Link>

              <Link
                to="/about"
                reloadDocument
                className="hz-btn hz-btn--xl hz-btn--secondary"
              >
                <span className="hz-btn__label">تعرّفوا على قصتنا</span>
              </Link>
            </div>

            {/* Arrows + dots */}
            {heroSlides.length > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "18px",
                }}
              >
                <button
                  type="button"
                  className="hz-btn hz-btn--secondary"
                  onClick={prev}
                  aria-label="السابق"
                >
                  ‹
                </button>

                <div style={{ display: "flex", gap: 8 }}>
                  {heroSlides.map((_, i) => (
                    <button
                      key={`dot-${i}`}
                      onClick={() => goTo(i)}
                      aria-label={`الانتقال إلى الشريحة ${i + 1}`}
                      aria-pressed={i === index}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        border: 0,
                        background:
                          i === index ? "#8B5E3C" : "rgba(0,0,0,.25)",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="hz-btn hz-btn--secondary"
                  onClick={next}
                  aria-label="التالي"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LargeBanner;
