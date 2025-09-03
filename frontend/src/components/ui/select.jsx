// src/components/Selector.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "../Styles/StylesSelector.css"; // ⬅️ CSS

const DEFAULT_OPTIONS = ["All", "Men", "Women", "Children"];

/* Localized fallbacks in case a key is missing in i18n files */
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
  label,
  options = DEFAULT_OPTIONS,
  value = "",
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";

  const translated = useMemo(() => {
    const lang = i18n.language;
    const key = (k) => `categories.${String(k).toLowerCase()}`;
    return options.map((opt) => ({
      raw: opt,
      text: t(key(opt), { defaultValue: localFallback(opt, lang) }),
    }));
  }, [options, t, i18n.language]);

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
          value={value}
          required
          onChange={(e) => onSelect?.(e.target.value)}
          className="selector__control"
        >
          <option value="" disabled>
            {t("select_category", { defaultValue: localFallback("All", i18n.language) })}
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
