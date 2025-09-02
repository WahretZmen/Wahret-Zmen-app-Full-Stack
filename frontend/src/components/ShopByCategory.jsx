import React from "react";
<<<<<<< HEAD
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import "../Styles/StylesCategories.css";

=======
import { Link } from "react-router-dom";
import "../Styles/StylesCategories.css";

// ✅ import local images (these paths look correct for /src/components/ → /src/assets/)
>>>>>>> 1e8f5082f548298b745607be41c678f7c24d3772
import hommeJebba from "../assets/Jebbas/Hommes/Jebba-Homme.jpg";
import femmeJebba from "../assets/Jebbas/Femmes/Jebba-Femme.jpg";
import enfantJebba from "../assets/Jebbas/Enfants/Jebba-Enfant.jpg";

const DEFAULT_ITEMS = [
<<<<<<< HEAD
  { key: "hommes",  label: "HOMMES",  image: hommeJebba,  to: "/products?category=hommes" },
  { key: "femmes",  label: "FEMMES",  image: femmeJebba,  to: "/products?category=femmes" },
  { key: "enfants", label: "ENFANTS", image: enfantJebba, to: "/products?category=enfants" },
];

/** Extract first string from any value (defensive). */
function extractFirstString(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (Array.isArray(x)) {
    for (const v of x) {
      const s = extractFirstString(v);
      if (s) return s;
    }
    return "";
  }
  if (typeof x === "object") {
    for (const v of Object.values(x)) {
      const s = extractFirstString(v);
      if (s) return s;
    }
    return "";
  }
  try { return String(x); } catch { return ""; }
}

/* ---------- Animated title ---------- */
const AnimatedTitle = ({ text }) => {
  const safe = (extractFirstString(text) || "اختر الفئة").trim();
  const isArabic = /[\u0600-\u06FF]/.test(safe);
  const words = isArabic ? [safe] : safe.split(/\s+/);

  return (
    <header className="shop-title-wrap" aria-label={safe} dir={isArabic ? "rtl" : "ltr"}>
      <div className="shop-title-row">
        <span className="title-emblem" aria-hidden="true">
          <Sparkles className="title-emblem-icon" />
        </span>
        <h2 className="shop-title-pro">
          {words.map((w, i) => (
            <span
              className="title-word"
              key={`${i}-${w}`}
              style={{ "--delay": `${i * 120}ms` }}
            >
              {w}
            </span>
          ))}
          <span className="title-shimmer" aria-hidden="true" />
        </h2>
      </div>
      <span className="title-underline" aria-hidden="true" />
    </header>
  );
};

const ShopByCategory = ({ items = DEFAULT_ITEMS, title }) => {
  const { t } = useTranslation();

  // Always request STRINGS (no returnObjects).
  const selectStr   = t("select_category",        { defaultValue: "اختر الفئة",      returnObjects: false });
  const categoryStr = t("shop_by_category.title", { defaultValue: "تسوّق حسب الفئة", returnObjects: false });

  // Priority: prop title → select_category → shop_by_category.title → literal.
  let rawTitle = "";
  if (typeof title === "string" && title.trim()) {
    rawTitle = title.trim();
  } else if (typeof selectStr === "string" && selectStr.trim()) {
    rawTitle = selectStr.trim();
  } else if (typeof categoryStr === "string" && categoryStr.trim()) {
    rawTitle = categoryStr.trim();
  } else {
    rawTitle = "اختر الفئة";
  }

  // 🚫 Ensure we never show "الرئيسية" (Home) as the section title.
  const blocked = new Set(["الرئيسية", "Home", "Accueil"]);
  if (blocked.has(rawTitle)) rawTitle = "اختر الفئة";

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 my-16">
      <AnimatedTitle text={rawTitle} />

      {/* Bigger avatars + more gap + staggered reveal */}
      <div className="flex justify-center gap-16 md:gap-20 xl:gap-24 flex-wrap">
        {items.map((it, idx) => (
          <a
            key={it.key}
            href={it.to}  /* full page reload */
            aria-label={`${rawTitle} – ${it.label}`}
            className="group category-item w-48 sm:w-60 lg:w-72 flex flex-col items-center anim-fade-up"
            style={{ animationDelay: `${idx * 120}ms` }}
          >
            <span
              className="relative block rounded-full overflow-hidden bg-white
                         ring-2 ring-gray-200 transition-all duration-300
                         group-hover:ring-4 group-hover:ring-[#d4af37]
                         shadow-elev hover:-translate-y-2 will-change-transform
                         w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72"
            >
              <img
                src={it.image}
                alt={it.label}
                className="absolute inset-0 w-full h-full object-cover cat-img"
                loading="lazy"
              />
              <span className="shine" />
            </span>

            <span className="mt-5 text-xl sm:text-2xl font-extrabold tracking-wide text-gray-900 uppercase label-gradient">
              {it.label}
            </span>
          </a>
        ))}
      </div>
      {/* ⛔ "Voir plus" removed as requested */}
=======
  {
    key: "hommes",
    label: "HOMMES",
    image: hommeJebba,
    to: "/products?category=hommes",   // ✅ link to Products.jsx with query
  },
  {
    key: "femmes",
    label: "FEMMES",
    image: femmeJebba,
    to: "/products?category=femmes",
  },
  {
    key: "enfants",
    label: "ENFANTS",
    image: enfantJebba,
    to: "/products?category=enfants",
  },
];




const ShopByCategory = ({ items = DEFAULT_ITEMS, title = "Achetez par Catégorie" }) => {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 my-12">
      <h2 className="text-center text-[15px] sm:text-base font-semibold tracking-wide text-gray-800 mb-6">
        {title}<span className="ml-1">🔥</span>
      </h2>

     <div className="flex justify-center gap-10 flex-wrap">
  {items.map((it) => (
    <Link
      key={it.key}
      to={it.to}
      className="group w-32 sm:w-40 lg:w-48 flex flex-col items-center"
    >
      {/* Circular image */}
      <span className="relative block w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full ring-2 ring-gray-200 overflow-hidden bg-white shadow-md transition-transform duration-200 group-hover:-translate-y-2">
        <img
          src={it.image}
          alt={it.label}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </span>

      {/* Label */}
      <span className="mt-4 text-base sm:text-lg font-bold tracking-wide text-gray-900 uppercase group-hover:opacity-90">
        {it.label}
      </span>
    </Link>
  ))}
</div>


      <div className="text-center mt-8">
        <Link to="/categories" className="inline-block text-sm font-semibold underline underline-offset-2 hover:opacity-80">
          Voir plus &gt;
        </Link>
      </div>
>>>>>>> 1e8f5082f548298b745607be41c678f7c24d3772
    </section>
  );
};

export default ShopByCategory;
