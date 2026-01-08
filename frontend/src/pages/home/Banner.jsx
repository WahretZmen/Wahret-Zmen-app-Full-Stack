// src/pages/home/Banner.jsx
// -----------------------------------------------------------------------------
// Secondary banner carousel with autoplay, swipe, and progress bar (Arabic only).
// -----------------------------------------------------------------------------

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import ScrollFade from "../../Animations/ScrollFade.jsx";
import AnimatedText from "../../Animations/AnimatedText.jsx";

import "../../Styles/StylesBanner.css";
import "../../Styles/StylesAnimatedText.css";

import banner1 from "../../assets/Home/Banner/Banner1.avif";
import banner2 from "../../assets/Home/Banner/Banner2.avif";
import banner3 from "../../assets/Home/Banner/Banner3.avif";

const AUTOPLAY_MS = 3500;
const TRANSITION_MS = 700;
const DRAG_THRESHOLD = 40;
const PAUSE_ON_HOVER = false;

const Banner = () => {
  const isRtl = true;

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Slides with Arabic content
  const slides = useMemo(
    () => [
      {
        id: "wz-1",
        img: banner1,
        title: "وهرة زمان بإدارة صبري – الحفاظ على التراث التونسي بأناقة",
        desc: "وهرة زمان، الصَّنعة وأسرارها بإدارة صبري — بوتيك تونسي فاخر يجسّد روح الأصالة في أبهى صورها. من قلب سوق الصوف بتونس، نقدّم تشكيلة منتقاة بعناية من الأزياء التقليدية الراقية.",
        cta: "اكتشف الآن",
        alt: "ملابس تقليدية تونسية من وهرة زمان",
        href: "/products",
      },
      {
        id: "wz-2",
        img: banner2,
        title: "جبب تقليدية بخياطة دقيقة وتفاصيل من التراث",
        desc: "كل جبّة تُحاك بخيوط من التراث والجمال، حيث تتلاقى الأقمشة الفاخرة مع التطريز اليدوي والتشطيبات الراقية.",
        cta: "اكتشف الآن",
        alt: "جبّة تقليدية تونسية فاخرة",
        href: "/products",
      },
      {
        id: "wz-3",
        img: banner3,
        title: "أناقة خالدة لمناسباتكم الخاصة",
        desc: "تصاميم تجمع بين الأصالة واللمسة العصرية، لترافقكم في الأعراس والمناسبات واللقاءات المميّزة.",
        cta: "اكتشف الآن",
        alt: "أزياء مناسبة للأعراس والمناسبات",
        href: "/products",
      },
    ],
    []
  );

  // Keep aspect ratio consistent using first image
  const [aspectRatio, setAspectRatio] = useState(1);
  useEffect(() => {
    const first = slides?.[0]?.img;
    if (!first) return;
    const probe = new Image();
    probe.src = first;
    const apply = () => {
      if (probe.naturalWidth && probe.naturalHeight) {
        setAspectRatio(probe.naturalWidth / probe.naturalHeight);
      }
    };
    if (probe.complete) apply();
    else {
      probe.onload = apply;
      probe.onerror = () => {};
    }
  }, [slides]);

  const [index, setIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const [isTransitioning, setTransitioning] = useState(false);

  const progressRef = useRef(null);
  const timerRef = useRef(null);
  const watchdogRef = useRef(null);
  const indexRef = useRef(0);
  const runningRef = useRef(false);

  // Mirror index in ref for timers
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Start or stop autoplay loop
  useEffect(() => {
    const canRun = !reduceMotion && !isPaused && slides.length > 1;
    runningRef.current = canRun;

    if (canRun) {
      restartLoop();
      startWatchdog();
    } else {
      stopLoop();
      stopWatchdog();
    }

    return () => {
      stopLoop();
      stopWatchdog();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, isPaused, slides.length]);

  const restartLoop = () => {
    stopLoop();
    animateProgressBar(AUTOPLAY_MS);
    timerRef.current = setTimeout(() => {
      goTo(indexRef.current + 1);
      restartLoop();
    }, AUTOPLAY_MS);
  };

  const stopLoop = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    resetProgressBar();
  };

  // Progress bar helpers
  const resetProgressBar = () => {
    if (!progressRef.current) return;
    const bar = progressRef.current;
    bar.style.transition = "none";
    bar.style.width = "0%";
  };

  const animateProgressBar = (durationMs) => {
    if (!progressRef.current) return;
    const bar = progressRef.current;
    bar.style.transition = "none";
    bar.style.width = "0%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = `width ${durationMs}ms linear`;
        bar.style.width = "100%";
      });
    });
  };

  // Watchdog re-arms autoplay if needed
  const startWatchdog = () => {
    if (watchdogRef.current) return;
    watchdogRef.current = setInterval(() => {
      if (runningRef.current && !timerRef.current && !document.hidden) {
        restartLoop();
      }
    }, 2000);
  };

  const stopWatchdog = () => {
    if (watchdogRef.current) {
      clearInterval(watchdogRef.current);
      watchdogRef.current = null;
    }
  };

  // Pause when tab is hidden
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        stopLoop();
      } else if (runningRef.current) {
        restartLoop();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Navigation helpers
  const clampIndex = (n) => (n + slides.length) % slides.length;
  const goTo = (n) => {
    if (isTransitioning) return;
    setTransitioning(true);
    setIndex(clampIndex(n));
    setTimeout(() => setTransitioning(false), TRANSITION_MS + 40);
  };

  const prev = () => {
    goTo(isRtl ? indexRef.current + 1 : indexRef.current - 1);
    if (runningRef.current) restartLoop();
  };

  const next = () => {
    goTo(isRtl ? indexRef.current - 1 : indexRef.current + 1);
    if (runningRef.current) restartLoop();
  };

  // Hover/focus pause (optional via flag)
  const handleMouseEnter = () => {
    if (PAUSE_ON_HOVER) setPaused(true);
  };
  const handleMouseLeave = () => {
    if (PAUSE_ON_HOVER) setPaused(false);
  };
  const handleFocusIn = () => {
    if (PAUSE_ON_HOVER) setPaused(true);
  };
  const handleFocusOut = () => {
    if (PAUSE_ON_HOVER) setPaused(false);
  };

  // Keyboard navigation
  const onKeyDown = (e) => {
    const { key } = e;
    if (key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (key === "Home") {
      e.preventDefault();
      goTo(0);
      if (runningRef.current) restartLoop();
    } else if (key === "End") {
      e.preventDefault();
      goTo(slides.length - 1);
      if (runningRef.current) restartLoop();
    }
  };

  // Pointer drag/swipe support
  const drag = useRef({ active: false, x: 0, dx: 0 });

  const onPointerDown = (e) => {
    drag.current = {
      active: true,
      x: e.clientX ?? e.touches?.[0]?.clientX ?? 0,
      dx: 0,
    };
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    drag.current.dx = x - drag.current.x;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    const { dx } = drag.current;
    drag.current.active = false;

    if (Math.abs(dx) > DRAG_THRESHOLD) {
      const left = dx < 0;
      const right = dx > 0;
      if ((left && !isRtl) || (right && isRtl)) next();
      else prev();
    }
  };

  return (
    <section
      className="wz-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="لافتات ترويجية"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-live="off"
      dir="rtl"
    >
      {/* Progress bar */}
      <div className="wz-progress">
        <span ref={progressRef} className="wz-progress__bar" />
      </div>

      {/* Slides track */}
      <div
        className="wz-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={endDrag}
        style={{ touchAction: "pan-y" }}
      >
        {slides.map((s, i) => {
          const active = i === index;
          const eager = i === 0;
          const kenburns = active && !reduceMotion ? "wz-kenburns" : "";
          return (
            <article
              key={s.id}
              className={`wz-slide ${active ? "is-active" : ""}`}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}`}
              aria-hidden={!active}
              id={`slide-${i}`}
            >
              <Link
                to={s.href || "/products"}
                onClick={() => window.scrollTo(0, 0)}
                className="banner-container-enhanced link-wrapper wz-slide__inner"
                tabIndex={active ? 0 : -1}
                aria-label={s.title}
              >
                {/* Image section */}
                <div className="banner-image-wrapper">
                  <div
                    className="wz-media"
                    style={{ aspectRatio: aspectRatio || 1 }}
                  >
                    <ScrollFade direction="fade-rotate-zoom" delay={0.2}>
                      <img
                        src={s.img}
                        alt={s.alt}
                        className={`banner-img ${kenburns}`}
                        loading={eager ? "eager" : "lazy"}
                        decoding={eager ? "sync" : "async"}
                        fetchPriority={eager ? "high" : "auto"}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    </ScrollFade>
                  </div>
                </div>

                {/* Text section */}
                <div className="banner-text-wrapper">
                  <ScrollFade direction="left-to-right" delay={0.25}>
                    <h1 className="banner-title wz-royal-title">{s.title}</h1>
                  </ScrollFade>

                  <ScrollFade delay={0.1}>
                    <div className="banner-description">
                      <AnimatedText text={s.desc} />
                    </div>
                  </ScrollFade>

                  <ScrollFade direction="bottom" delay={0.25}>
                    <button type="button" className="btn-premium">
                      {s.cta}
                    </button>
                  </ScrollFade>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* Arrows and pause button */}
      <div className="wz-controls">
        <button type="button" className="wz-arrow wz-arrow--prev" onClick={prev}>
          <span aria-hidden />
        </button>
        <button type="button" className="wz-arrow wz-arrow--next" onClick={next}>
          <span aria-hidden />
        </button>

        <button
          type="button"
          className="wz-pause"
          aria-pressed={isPaused}
          aria-label={isPaused ? "تشغيل" : "إيقاف مؤقت"}
          onClick={() => {
            setPaused((p) => !p);
          }}
          title={isPaused ? "تشغيل" : "إيقاف مؤقت"}
        >
          <span className={`wz-pause__icon ${isPaused ? "is-play" : "is-pause"}`} />
        </button>
      </div>

      {/* Dots */}
      <div className="wz-dots" role="tablist" aria-label="الشرائح">
        {slides.map((_, i) => {
          const active = i === index;
          return (
            <button
              key={`dot-${i}`}
              role="tab"
              aria-selected={active}
              aria-controls={`slide-${i}`}
              className={`wz-dot ${active ? "is-active" : ""}`}
              onClick={() => {
                goTo(i);
                if (runningRef.current) restartLoop();
              }}
              title={`الانتقال إلى الشريحة ${i + 1}`}
            >
              <span className="wz-dot__ring" />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Banner;
