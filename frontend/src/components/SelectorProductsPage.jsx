// SelectorPageProducts.jsx
// -------------------------------------------------------------
// Plain-CSS filter sidebar for the Products page with robust
// category alias normalization + dedupe + i18n (incl. "All").
// (Color filter removed as requested.)
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
  const isRTL =
    i18n?.language === "ar" ||
    i18n?.language === "ar-SA" ||
    (typeof i18n?.language === "string" && i18n.language.startsWith("ar"));

  /* === Normalize & dedupe categories ===
     - Canonical keys: All, Men, Women, Children
     - Ensure "All" exists ONCE and is first
  */
  const normalizedCategories = useMemo(() => {
    const seen = new Set();
    const canonList = [];

    // Start with provided categories
    for (const c of categories || []) {
      const canon = canonicalizeCategory(c);
      const k = String(canon);
      if (!seen.has(k)) {
        seen.add(k);
        canonList.push(canon);
      }
    }

    // Ensure "All" is present
    if (!seen.has("All")) {
      canonList.unshift("All");
    } else {
      // move All to front if it exists elsewhere
      const withoutAll = canonList.filter((x) => x !== "All");
      canonList.splice(0, canonList.length, "All", ...withoutAll);
    }

    return canonList;
  }, [categories]);

  // Localized label for a canonical value
  const catText = (c) =>
    t(`categories.${String(c).toLowerCase()}`, {
      defaultValue: localFallback(c, i18n.language),
    });

  // Show "All" when external state is ""
  const selectedCategoryForUI = categorySel ? canonicalizeCategory(categorySel) : "All";

  const onCategoryChange = (e) => {
    const picked = e.target.value;
    // Externally, use "" to mean "All" (no filter)
    setCategorySel(picked === "All" ? "" : picked);
  };

  return (
    <aside className="filters-sidebar" dir={isRTL ? "rtl" : "ltr"}>
      <div className="filters-card">
        {/* ---------- Header ---------- */}
        <div className="filters-header" style={{ justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>{t("filters", "Filters")}</h3>
          <Filter className="icon" />
        </div>

        {/* ---------- Category Select ---------- */}
        <div className="filter-group">
          <label className="filter-label">{t("category", "Category")}</label>
          <select
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
        <div className="filter-group">
          <label className="filter-label">{t("price_range", "Price Range")}</label>

          <div className="price-row">
            <div className="price-field">
              <span>$</span>
              <input
                type="number"
                min={minPrice}
                max={priceRange[1]}
                value={Math.round(priceRange[0])}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value) || minPrice, priceRange[1]])
                }
              />
            </div>

            <span className="dash">—</span>

            <div className="price-field">
              <span>$</span>
              <input
                type="number"
                min={priceRange[0]}
                max={maxPrice}
                value={Math.round(priceRange[1])}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value) || maxPrice])
                }
              />
            </div>
          </div>

          <input
            className="range"
            type="range"
            min={minPrice}
            max={maxPrice}
            step="5"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
          />

          <input
            className="range second"
            type="range"
            min={minPrice}
            max={maxPrice}
            step="5"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          />
        </div>

        {/* ---------- Clear Filters Button ---------- */}
        <button className="btn-outline w-full" onClick={clearFilters}>
          {t("clear_filters", "Clear Filters")}
        </button>
      </div>
    </aside>
  );
};

export default SelectorPageProducts;
