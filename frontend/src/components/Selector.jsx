<<<<<<< HEAD
// src/components/Selector.jsx
=======
>>>>>>> 1e8f5082f548298b745607be41c678f7c24d3772
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "../Styles/StylesSelector.css"; // ⬅️ import the CSS file

const DEFAULT_OPTIONS = ["All", "Men", "Women", "Children"];
<<<<<<< HEAD

export default function Selector({ onSelect, label, options = DEFAULT_OPTIONS, value = "" }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";

  const translated = useMemo(() => {
    const key = (k) => `categories.${String(k).toLowerCase()}`;
=======

export default function Selector({ onSelect, label, options = DEFAULT_OPTIONS, value = "" }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";

  const translated = useMemo(() => {
    const key = (k) => `categories.${k.toLowerCase()}`;
>>>>>>> 1e8f5082f548298b745607be41c678f7c24d3772
    return options.map((opt) => ({
      raw: opt,
      text: t(key(opt), opt), // fallback to raw if missing in i18n
    }));
  }, [options, t]);

  return (
<<<<<<< HEAD
    <div className="selector" dir={isRTL ? "rtl" : "ltr"}>
      {label && (
        <label className="selector__label" htmlFor="category-select">
          {t(label, label)}
        </label>
      )}

      <div className="selector__field">
        {/* shimmer halo backdrop */}
        <span aria-hidden className="selector__halo" />
        {/* animated underline */}
        <span aria-hidden className="selector__underline" />

        <select
          id="category-select"
          value={value}
          required
          /* 'required' + disabled first option => shows placeholder styling */
          onChange={(e) => onSelect?.(e.target.value)}
          className="selector__control"
        >
          <option value="" disabled>
            {t("select_category", "Select category")}
=======
    <div className="selector-wrapper mx-auto mb-4 w-full max-w-md" dir={isRTL ? "rtl" : "ltr"}>
      {label && (
        <label className="text-lg font-medium mb-2 text-gray-700 text-center block">
          {t(label, label)}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onSelect?.(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-gray-500 
                   focus:border-gray-500 bg-white text-gray-700 cursor-pointer 
                   transition duration-200 ease-in-out"
      >
        <option value="" disabled className="text-gray-500">
          {t("select_category", "Select category")}
        </option>
        {translated.map(({ raw, text }) => (
          <option key={raw} value={raw} className="text-gray-900">
            {text}
>>>>>>> 1e8f5082f548298b745607be41c678f7c24d3772
          </option>

          {translated.map(({ raw, text }) => (
            <option key={raw} value={raw}>
              {text}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
