// src/components/Selector.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "../Styles/StylesSelector.css";

/* Canonical default keys (lowercase) */
const DEFAULT_OPTIONS = ["all", "men", "women", "children"];

/* Localized fallbacks in case i18n keys are missing */
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

export default function Selector({
  onSelect,
  label,                          // e.g. "select_category"
  options = DEFAULT_OPTIONS,       // expects keys: "all" | "men" | "women" | "children"
  value = "",                      // "" means "all"
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const isRTL =
    lang === "ar" || lang === "ar-SA" || (typeof lang === "string" && lang.startsWith("ar"));

  // Build translated options. We normalize to lowercase,
  // and map the "all" item to value="" so it matches your state model.
  const translated = useMemo(() => {
    const normed = options
      .map((o) => String(o).toLowerCase())
      // de-duplicate just in case both "All" and "all" were passed
      .filter((v, idx, arr) => arr.indexOf(v) === idx);

    return normed.map((opt) => {
      const text = t(`categories.${opt}`, { defaultValue: localFallback(opt, lang) });
      return {
        key: opt,
        value: opt === "all" ? "" : opt, // 👈 All -> ""
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
          value={value}                 // "" for All
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
