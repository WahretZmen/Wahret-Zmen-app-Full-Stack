// src/components/SelectorProductsPage.jsx
// -----------------------------------------------------------------------------
// Sidebar filters for products page:
//  - Category (EN/FR/AR aliases → one canonical value)
//  - Embroidery type (multi-language object or string)
//  - Price range (min / max inputs + dual sliders)
// Pure Arabic UI (labels), fixed RTL layout, no i18n.
// -----------------------------------------------------------------------------

import React, { useMemo } from "react";
import { Filter } from "lucide-react";
import "../Styles/StylesSelectorProductsPage.css";

// Map different aliases of categories (FR / AR / EN) to one canonical value
const CANONICAL = {
  // All
  all: "All",
  tous: "All",
  "الكل": "All",

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
  رجال: "Men",
  نساء: "Women",
  أطفال: "Children",
};

const normalize = (v) => (v || "").toString().trim().toLowerCase();
const normStr = (s) => String(s ?? "").trim();

function canonicalizeCategory(raw) {
  if (raw == null) return "";
  const k = normalize(raw);
  return CANONICAL[k] || raw;
}

// Arabic label for canonical categories
function categoryLabel(canon) {
  const key = normalize(canon);
  if (key === "all") return "الكل";
  if (key === "men") return "رجال";
  if (key === "women") return "نساء";
  if (key === "children") return "أطفال";
  return canon;
}

const SelectorPageProducts = ({
  // Category filter
  categorySel,
  setCategorySel,
  categories,

  // Color filter (kept for compatibility)
  colorSel,
  setColorSel,
  colors,

  // Embroidery filter
  embroiderySel,
  setEmbroiderySel,
  embroideryTypes,

  // Price filter
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice,

  clearFilters,
}) => {
  const isRTL = true;

  // Normalize and dedupe categories, ensure "All" is present and first
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

    if (!seen.has("All")) {
      canonList.unshift("All");
    } else {
      const withoutAll = canonList.filter((x) => x !== "All");
      canonList.splice(0, canonList.length, "All", ...withoutAll);
    }

    return canonList;
  }, [categories]);

  // Normalize embroidery types (string OR {en,fr,ar}), dedupe by value, ensure "All" first
  const normalizedEmbroideryTypes = useMemo(() => {
    const seen = new Set();
    const list = [];

    const pushPack = (value, pack) => {
      const key = normStr(value);
      if (!key || seen.has(key)) return;
      seen.add(key);
      list.push({ value: key, pack });
    };

    for (const e of embroideryTypes || []) {
      if (!e) continue;

      if (typeof e === "object") {
        const en = normStr(e.en || e.fr || e.ar);
        const fr = normStr(e.fr || en || e.ar);
        const ar = normStr(e.ar || e.fr || en);
        const key = en || fr || ar;
        if (!key) continue;
        pushPack(key, { en: key, fr: fr || key, ar: ar || key });
      } else if (typeof e === "string") {
        const s = normStr(e);
        if (!s) continue;
        pushPack(s, { en: s, fr: s, ar: s });
      }
    }

    if (!seen.has("All")) {
      pushPack("All", { en: "All", fr: "Tous", ar: "الكل" });
    } else {
      const others = list.filter((x) => x.value !== "All");
      const allOpt = list.find((x) => x.value === "All");
      return [allOpt, ...others];
    }

    return list;
  }, [embroideryTypes]);

  // Embroidery option label: prefer Arabic, then FR/EN
  const embroideryLabel = (pack) => {
    return pack.ar || pack.fr || pack.en;
  };

  const selectedCategoryForUI = canonicalizeCategory(categorySel || "All");
  const selectedEmbroideryForUI = normStr(embroiderySel || "All") || "All";

  const onCategoryChange = (e) => {
    const picked = canonicalizeCategory(e.target.value);
    setCategorySel(picked);
  };

  const onEmbroideryChange = (e) => {
    const picked = e.target.value || "All";
    setEmbroiderySel(picked);
  };

  // Clamp price values so min <= max
  const clampMin = Math.min(Math.max(minPrice, priceRange[0]), priceRange[1]);
  const clampMax = Math.max(Math.min(maxPrice, priceRange[1]), priceRange[0]);

  return (
    <aside className="filters-sidebar" dir={isRTL ? "rtl" : "ltr"}>
      <div className="filters-card">
        {/* Header */}
        <div className="filters-header">
          <h3 className="filters-title">الفلاتر</h3>
          <Filter className="icon" aria-hidden="true" />
        </div>

        {/* Category */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="category-select">
            الفئة
          </label>
          <select
            id="category-select"
            className="filter-select"
            value={selectedCategoryForUI}
            onChange={onCategoryChange}
          >
            {normalizedCategories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>
        </div>

        {/* Embroidery type */}
        {normalizedEmbroideryTypes.length > 0 && (
          <div className="filter-group">
            <label className="filter-label" htmlFor="embroidery-select">
              نوع التطريز
            </label>
            <select
              id="embroidery-select"
              className="filter-select"
              value={selectedEmbroideryForUI}
              onChange={onEmbroideryChange}
            >
              {normalizedEmbroideryTypes.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.value === "All" ? "الكل" : embroideryLabel(opt.pack)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price Range */}
        <div className="filter-group">
          <label className="filter-label">نطاق السعر</label>

          {/* Numeric inputs */}
          <div
            className="price-row"
            role="group"
            aria-label="نطاق السعر"
          >
            <div className="price-field">
              <span className="currency">$</span>
              <input
                aria-label="أقل سعر"
                type="number"
                min={minPrice}
                max={clampMax}
                value={Math.round(clampMin)}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value) || minPrice, clampMax])
                }
                inputMode="decimal"
              />
            </div>

            <span className="dash" aria-hidden="true">
              —
            </span>

            <div className="price-field">
              <span className="currency">$</span>
              <input
                aria-label="أعلى سعر"
                type="number"
                min={clampMin}
                max={maxPrice}
                value={Math.round(clampMax)}
                onChange={(e) =>
                  setPriceRange([clampMin, Number(e.target.value) || maxPrice])
                }
                inputMode="decimal"
              />
            </div>
          </div>

          {/* Dual sliders */}
          <div className="range-wrap double" aria-hidden="false">
            <input
              className="range line first"
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
              className="range line second"
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

          {/* Endpoints */}
          <div className="range-ends">
            <span>${Math.round(minPrice)}</span>
            <span>${Math.round(maxPrice)}</span>
          </div>
        </div>

        {/* Clear Filters */}
        <button
          type="button"
          className="btn-outline w-full"
          onClick={clearFilters}
          aria-label="مسح الفلاتر"
        >
          مسح الفلاتر
        </button>
      </div>
    </aside>
  );
};

export default SelectorPageProducts;
