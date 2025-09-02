// src/components/AboutWahretZmen.jsx
import React, { useEffect, useRef, useState } from "react";
import { Award, Heart, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const AboutWahretZmen = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  const isRTL = i18n.language?.startsWith("ar");

  // Refs + visibility state for reveal-on-scroll
  const textRef = useRef(null);
  const cardsRef = useRef([]);
  const [textVisible, setTextVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState([false, false, false]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const idx = Number(e.target.getAttribute("data-idx"));
          if (e.isIntersecting) {
            if (idx === -1) setTextVisible(true);
            else
              setCardVisible((prev) => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
    );

    if (textRef.current) {
      textRef.current.setAttribute("data-idx", "-1");
      obs.observe(textRef.current);
    }
    cardsRef.current.forEach((el, i) => {
      if (el) {
        el.setAttribute("data-idx", String(i));
        obs.observe(el);
      }
    });

    return () => obs.disconnect();
  }, []);

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="py-16 sm:py-20 bg-gradient-to-br from-background to-muted/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text Column (slides from the side based on direction) */}
          <div
            ref={textRef}
            className={[
              isRTL ? "text-right" : "text-left",
              "transition-all duration-700 ease-out will-change-transform",
              textVisible
                ? "opacity-100 translate-x-0"
                : isRTL
                ? "opacity-0 -translate-x-6"
                : "opacity-0 translate-x-6",
            ].join(" ")}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              {t("AboutWahretZmen.title")}
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-7 sm:leading-8 mb-5 sm:mb-6 max-w-[680px]">
              {t("AboutWahretZmen.p1")}
            </p>

            <p className="text-base sm:text-lg text-muted-foreground leading-7 sm:leading-8 mb-6 sm:mb-8 max-w-[680px]">
              {t("AboutWahretZmen.p2")}
            </p>

            {/* CTA */}
            <a href="/products" >
            <button
              className="
                inline-flex items-center justify-center
                h-11 sm:h-12
                px-6 rounded-md
                bg-[#5C2E14] text-white
                text-sm sm:text-base font-semibold tracking-wide
                shadow-md hover:shadow-lg
                transition-all duration-200
                hover:bg-[#4a2410] active:translate-y-px
                focus:outline-none focus:ring-2 focus:ring-[#5C2E14]/70
              "
              style={{ minWidth: 220 }}
            >
              {t("AboutWahretZmen.cta")}
            </button>
            </a>
          </div>

          {/* Feature Cards (staggered reveal + hover lift) */}
          <div className="grid grid-cols-1 gap-6">
            {[
              {
                Icon: Award,
                title: t("AboutWahretZmen.features.craftsmanship.title"),
                desc: t("AboutWahretZmen.features.craftsmanship.desc"),
                delay: 0,
              },
              {
                Icon: Heart,
                title: t("AboutWahretZmen.features.heritage.title"),
                desc: t("AboutWahretZmen.features.heritage.desc"),
                delay: 100,
              },
              {
                Icon: Sparkles,
                title: t("AboutWahretZmen.features.quality.title"),
                desc: t("AboutWahretZmen.features.quality.desc"),
                delay: 200,
              },
            ].map(({ Icon, title, desc, delay }, i) => (
              <div
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
                style={{ transitionDelay: `${delay}ms` }}
                className={[
                  "flex items-start gap-4 p-5 sm:p-6 rounded-md border bg-[#FFF7F2] border-[#E9DED6] shadow-sm",
                  "transition-all duration-700 ease-out will-change-transform",
                  "hover:-translate-y-1 hover:shadow-md",
                  cardVisible[i]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6",
                ].join(" ")}
              >
                <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-[#C46A2B] flex-shrink-0 mt-0.5" />
                <div className={isRTL ? "text-right" : "text-left"}>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1.5">
                    {title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* End Feature Cards */}
        </div>
      </div>
    </section>
  );
};

export default AboutWahretZmen;
