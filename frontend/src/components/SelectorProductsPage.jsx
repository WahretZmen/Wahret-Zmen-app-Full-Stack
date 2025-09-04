// SelectorPageProducts.jsx
// -------------------------------------------------------------
// Plain-CSS filter sidebar for the Products page with robust
// category alias normalization + dedupe + i18n (incl. "All").
// Now with tighter mobile layout, desktop sticky card,
// consistent class names (matches CSS), and RTL polish.
// -------------------------------------------------------------

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Filter } from "lucide-react";
import "../Styles/StylesSelectorProductsPage.css";

/* ===== Canonicalization: map any alias → canonical key ===== */
const CANONICAL = {
  all: "All",
  tous: "All",
  // EN
  men: "Men",
  women: "Women",
  children: "Children",
  kids: "Children",
  kid: "Children",
  // FR
  hommes: "Men",
  homme: "Men",
  femmes: "Women",
  femme: "Women",
  enfants: "Children",
  enfant: "Children",
  // AR
  "الكل": "All",
  "رجال": "Men",
  "نساء": "Women",
  "أطفال": "Children",
};

/* i18n fallbacks for display text if keys are missing */
const FALLBACKS = {
  ar: { all: "الكل", men: "رجال", women: "نساء", children: "أطفال" },
  fr: { all: "Tous", men: "Hommes", women: "Femmes", children: "Enfants" },
  en: { all: "All", men: "Men", women: "Women", children: "Children" },
};
function localFallback(opt, lang) {
  const key = String(opt).toLowerCase();
  const short = (lang || "en").split("-")[0];
  return FALLBACKS[short]?.[key] ?? FALLBACKS.en[key] ?? String(opt);
}

function canonicalizeCategory(raw) {
  if (raw == null) return "";
  const k = String(raw).trim().toLowerCase();
  return CANONICAL[k] || raw; // if unknown, keep as-is
}

const SelectorPageProducts = ({
  categorySel,
  setCategorySel,
  categories,
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice,
  clearFilters,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n?.language || "en";
  const isRTL = lang === "ar" || lang === "ar-SA" || lang.startsWith("ar");

  /* === Normalize & dedupe categories === */
  const normalizedCategories = useMemo(() => {
    const seen = new Set();
    const canonList = [];

    for (const c of categories || []) {
      const canon = canonicalizeCategory(c);
      const k = String(canon);
      if (!seen.has(k)) {
        seen.add(k);
        canonList.push(canon);
      }
    }

    // Ensure "All" is present and first
    if (!seen.has("All")) {
      canonList.unshift("All");
    } else {
      const withoutAll = canonList.filter((x) => x !== "All");
      canonList.splice(0, canonList.length, "All", ...withoutAll);
    }

    return canonList;
  }, [categories]);

  // Localized label for a canonical value
  const catText = (c) =>
    t(`categories.${String(c).toLowerCase()}`, {
      defaultValue: localFallback(c, lang),
    });

  // Show "All" when external state is ""
  const selectedCategoryForUI = categorySel ? canonicalizeCategory(categorySel) : "All";

  const onCategoryChange = (e) => {
    const picked = e.target.value;
    setCategorySel(picked === "All" ? "" : picked); // "" means no filter (All)
  };

  // Clamp helpers (prevents invalid min>max on quick drags)
  const clampMin = Math.min(Math.max(minPrice, priceRange[0]), priceRange[1]);
  const clampMax = Math.max(Math.min(maxPrice, priceRange[1]), priceRange[0]);

  return (
    <aside className="filters-sidebar" dir={isRTL ? "rtl" : "ltr"}>
      <div className="filters-card">
        {/* ---------- Header ---------- */}
        <div className="filters-header">
          <h3 className="filters-title">{t("filters", "الفلاتر")}</h3>
          <Filter className="icon" aria-hidden="true" />
        </div>

        {/* ---------- Category Select ---------- */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="category-select">
            {t("category", "الفئة")}
          </label>
          <select
            id="category-select"
            className="filter-select"
            value={selectedCategoryForUI}
            onChange={onCategoryChange}
          >
            {normalizedCategories.map((c) => (
              <option key={c} value={c}>
                {catText(c)}
              </option>
            ))}
          </select>
        </div>

        {/* ---------- Price Range (min/max inputs + dual range) ---------- */}
       {/* ---------- Price Range (min/max inputs + dual range) ---------- */}
<div className="filter-group">
  <label className="filter-label">{t("price_range", "نطاق السعر")}</label>

  {/* Min/Max inputs (stay as editable fields) */}
  <div className="price-row" role="group" aria-label={t("price_range", "نطاق السعر")}>
    <div className="price-field">
      <span className="currency">$</span>
      <input
        aria-label={t("min_price", "أقل سعر")}
        type="number"
        min={minPrice}
        max={clampMax}
        value={Math.round(clampMin)}
        onChange={(e) => setPriceRange([Number(e.target.value) || minPrice, clampMax])}
        inputMode="decimal"
      />
    </div>

    <span className="dash" aria-hidden="true">—</span>

    <div className="price-field">
      <span className="currency">$</span>
      <input
        aria-label={t("max_price", "أعلى سعر")}
        type="number"
        min={clampMin}
        max={maxPrice}
        value={Math.round(clampMax)}
        onChange={(e) => setPriceRange([clampMin, Number(e.target.value) || maxPrice])}
        inputMode="decimal"
      />
    </div>
  </div>

  {/* Two-line visual: thin neutral bar (top) + thick gold bar with dual thumbs (bottom) */}
  <div className="range-wrap twoline" aria-hidden="false">
    {/* Top thin bar (decorative only) */}
    <div className="range-thin-track" />

    {/* Bottom thick bar with both thumbs sharing one line */}
    <input
      className="range thick base"
      type="range"
      min={minPrice}
      max={maxPrice}
      step="1"
      value={clampMin}
      onChange={(e) => {
        const nextMin = Math.min(Number(e.target.value), clampMax);
        setPriceRange([nextMin, clampMax]);
      }}
    />
    <input
      className="range thick second"
      type="range"
      min={minPrice}
      max={maxPrice}
      step="1"
      value={clampMax}
      onChange={(e) => {
        const nextMax = Math.max(Number(e.target.value), clampMin);
        setPriceRange([clampMin, nextMax]);
      }}
    />
  </div>

  {/* Optional little end labels under the bar (matches the look in your ref) */}
  <div className="range-ends">
    <span>${Math.round(minPrice)}</span>
    <span>${Math.round(maxPrice)}</span>
  </div>
</div>


          {/* Dual sliders – stacked so thumbs never overlap visually */}
          <div className="range-wrap" aria-hidden="false">
            <input
              className="range"
              type="range"
              min={minPrice}
              max={maxPrice}
              step="1"
              value={clampMin}
              onChange={(e) => {
                const nextMin = Math.min(Number(e.target.value), clampMax);
                setPriceRange([nextMin, clampMax]);
              }}
            />

            <input
              className="range second"
              type="range"
              min={minPrice}
              max={maxPrice}
              step="1"
              value={clampMax}
              onChange={(e) => {
                const nextMax = Math.max(Number(e.target.value), clampMin);
                setPriceRange([clampMin, nextMax]);
              }}
            />
          </div>
        </div>

        {/* ---------- Clear Filters Button ---------- */}
        <button
          type="button"
          className="btn-outline w-full"
          onClick={clearFilters}
          aria-label={t("clear_filters", "مسح الفلاتر")}
        >
          {t("clear_filters", "مسح الفلاتر")}
        </button>
      </div>
    </aside>
  );
};

export default SelectorPageProducts;
