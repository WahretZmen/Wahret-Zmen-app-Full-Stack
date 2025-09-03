// SelectorPageProducts.jsx
// -------------------------------------------------------------
// Plain-CSS filter sidebar for the Products page.
// This component renders category, color, and price filters.
// Layout is controlled by Styles/StylesSelectorProductsPage.css.
// NOTE: Content/logic preserved exactly; only formatting & comments added.
// -------------------------------------------------------------

import React from "react";
import { useTranslation } from "react-i18next";
import { Filter } from "lucide-react";
import "../Styles/StylesSelectorProductsPage.css";

/**
 * Props
 * - categorySel, setCategorySel: current category + setter
 * - categories: array of category options (e.g., ["All","Men","Women","Children"])
 * - colorSel, setColorSel: current color + setter
 * - colors: array of color options
 * - priceRange, setPriceRange: [min,max] numeric price range + setter
 * - minPrice, maxPrice: numeric bounds derived from catalog
 * - clearFilters: resets all filters to defaults
 */
const SelectorPageProducts = ({
  categorySel,
  setCategorySel,
  categories,
  colorSel,
  setColorSel,
  colors,
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice,
  clearFilters,
}) => {
  const { t, i18n } = useTranslation();

  // RTL awareness for Arabic
  const isRTL = i18n?.language === "ar" || i18n?.language === "ar-SA";

  return (
    // Sidebar wrapper (positioned to the right/left by the page layout)
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
            value={categorySel}
            onChange={(e) => setCategorySel(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* ---------- Color Select ---------- */}
        <div className="filter-group">
          <label className="filter-label">{t("color", "Color")}</label>
          <select
            className="filter-select"
            value={colorSel}
            onChange={(e) => setColorSel(e.target.value)}
          >
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* ---------- Price Range (min/max inputs + dual range) ---------- */}
        <div className="filter-group">
          <label className="filter-label">{t("price_range", "Price Range")}</label>

          {/* Numeric min/max inputs */}
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

          {/* Dual slider controls (lower + upper) */}
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
