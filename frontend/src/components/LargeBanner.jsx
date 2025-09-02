import { useTranslation } from "react-i18next";
import heroAvif from "../assets/Jebbas/LargeBanner/Jebba-tunisienne-LargeBanner.avif";
import "../Styles/StylesLargeBanner.css";

const LargeBanner = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  const lang = i18n.language || "en";
  const isRTL = lang.startsWith("ar");

  // Brand split
  const brand = t("navbar.brand", "Wahret Zmen");
  const parts = brand.trim().split(/\s+/);
  const firstWord = parts[0] || brand;
  const secondWord = parts.slice(1).join(" ");

  // Localized “By Sabri”
  const bySabri =
    lang.startsWith("fr") ? "Par Sabri" : lang.startsWith("ar") ? "بإدارة صبري" : "By Sabri";

  return (
    <section
      className="hz-hero"
      aria-label={t("Welcome_Banner_title", "Welcome to Wahret Zmen")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background */}
      <div className="hz-hero__bg">
        <img
          src={heroAvif}
          alt={t("banner_img_alt", "Wahret Zmen traditional banner")}
          loading="eager"
        />
        <div className="hz-hero__overlay" />
      </div>

      {/* Content */}
      <div className="hz-hero__container">
        <div className="hz-hero__content">
          {/* Title — same classes as Hero.tsx */}
          <h2 className="hz-hero__title animate-fade-in-up">
            <span className="hz-inline animate-slide-in-left">{firstWord}</span>{" "}
            {secondWord ? (
              <span className="hz-inline animate-slide-in-right animation-delay-200">
                {secondWord}
              </span>
            ) : null}
            <span className="hz-hero__by animate-fade-in-delay-400">{bySabri}</span>
          </h2>

          {/* Subtitle — same delayed fade as Hero.tsx */}
          <p className="hz-hero__subtitle animate-fade-in-delay-300">
            {t(
              "banner_description",
              "Discover our exquisite collection of traditional Jebbas, where timeless elegance meets contemporary craftsmanship. Each piece tells a story of heritage and style."
            )}
          </p>

          {/* CTAs — container fades in same delay as Hero.tsx, primary has glow */}
          <div className="hz-hero__ctas animate-fade-in-delay-400">
           <button type="button" className="hz-btn hz-btn--xl hz-btn--primary animate-glow">
  {t("wahret_zmen_collection", "Explore Collection")}
</button>


            <button type="button" className="hz-btn hz-btn--xl hz-btn--secondary">
              {t("about.title", "Learn Our Story")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LargeBanner;
