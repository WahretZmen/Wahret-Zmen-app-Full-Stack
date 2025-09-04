// src/components/Selector.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "../Styles/StylesSelector.css";

/* ---------------------------------------------------------------------------
   Default category options (canonical lowercase keys)
--------------------------------------------------------------------------- */
const DEFAULT_OPTIONS = ["all", "men", "women", "children"];

/* ---------------------------------------------------------------------------
   Localized fallbacks (used when i18n translation keys are missing)
--------------------------------------------------------------------------- */
const FALLBACKS = {
  ar: { all: "الكل", men: "رجال", women: "نساء", children: "أطفال" },
  fr: { all: "Tous", men: "Hommes", women: "Femmes", children: "Enfants" },
  en: { all: "All", men: "Men", women: "Women", children: "Children" },
};

/**
 * Pick a localized fallback text for an option
 * @param {string} opt - canonical option key (lowercase)
 * @param {string} lang - current language code
 * @returns {string}
 */
function localFallback(opt, lang) {
  const key = String(opt).toLowerCase();
  const short = (lang || "en").split("-")[0];
  return FALLBACKS[short]?.[key] ?? FALLBACKS.en[key] ?? String(opt);
}

/**
 * Selector Component
 * - Translates category options
 * - Maps "all" → "" so parent state can use "" to mean "no filter"
 *
 * @param {Object} props
 * @param {Function} props.onSelect - callback with selected value
 * @param {string} props.label - label translation key (e.g. "select_category")
 * @param {string[]} [props.options] - list of category keys
 * @param {string} [props.value] - current selected value ("" means All)
 */
export default function Selector({
  onSelect,
  label,
  options = DEFAULT_OPTIONS,
  value = "",
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const isRTL = lang.startsWith("ar");

  // Build translated options with deduplication
  const translated = useMemo(() => {
    const normed = options
      .map((o) => String(o).toLowerCase())
      .filter((v, idx, arr) => arr.indexOf(v) === idx); // de-duplicate

    return normed.map((opt) => {
      const text = t(`categories.${opt}`, {
        defaultValue: localFallback(opt, lang),
      });
      return {
        key: opt,
        value: opt === "all" ? "" : opt, // 👈 Map "all" to ""
        text,
      };
    });
  }, [options, t, lang]);

  return (
    <div className="selector" dir={isRTL ? "rtl" : "ltr"}>
      {label && (
        <label className="selector__label" htmlFor="category-select">
          {t(label, label)}
        </label>
      )}

      <div className="selector__field">
        <span aria-hidden className="selector__halo" />
        <span aria-hidden className="selector__underline" />

        <select
          id="category-select"
          value={value} // "" means All
          onChange={(e) => onSelect?.(e.target.value)}
          className="selector__control"
        >
          {translated.map(({ key, value: val, text }) => (
            <option key={key} value={val}>
              {text}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
