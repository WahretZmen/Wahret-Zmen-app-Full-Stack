// src/components/Selector.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "../Styles/StylesSelector.css"; // ⬅️ import the CSS file

const DEFAULT_OPTIONS = ["All", "Men", "Women", "Children"];

export default function Selector({ onSelect, label, options = DEFAULT_OPTIONS, value = "" }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";

  const translated = useMemo(() => {
    const key = (k) => `categories.${String(k).toLowerCase()}`;
    return options.map((opt) => ({
      raw: opt,
      text: t(key(opt), opt), // fallback to raw if missing in i18n
    }));
  }, [options, t]);

  return (
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
