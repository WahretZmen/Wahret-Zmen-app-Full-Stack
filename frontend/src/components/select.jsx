// src/components/Selector.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "../Styles/StylesSelector.css"; // ⬅️ component styles

/* =============================================================================
   🔽 Selector (category filter)
   - Shows a localized <select> with categories (All, Men, Women, Children)
   - Uses i18n keys when available; falls back to local dictionaries
   - RTL-aware (Arabic), switches direction via i18n.language
============================================================================= */

// Default categories shown if no `options` prop is provided.
// NOTE: "All" is intentionally included to keep your current behavior.
const DEFAULT_OPTIONS = ["All", "Men", "Women", "Children"];

/**
 * Localized fallbacks used when a translation key is missing.
 * We map the raw option (case-insensitive) → localized label for ar/fr/en.
 */
const FALLBACKS = {
  ar: { all: "الكل", men: "رجال", women: "نساء", children: "أطفال" },
  fr: { all: "Tous", men: "Hommes", women: "Femmes", children: "Enfants" },
  en: { all: "All", men: "Men", women: "Women", children: "Children" },
};

/**
 * Resolve a local fallback label:
 * - Normalizes option key (lowercase)
 * - Picks language short code (e.g., "fr" from "fr-FR")
 * - Returns label from FALLBACKS or the original string as a final fallback
 */
function localFallback(opt, lang) {
  const key = String(opt).toLowerCase();
  const short = (lang || "en").split("-")[0]; // "ar-SA" → "ar"
  return FALLBACKS[short]?.[key] ?? FALLBACKS.en[key] ?? String(opt);
}

/**
 * Props:
 * - onSelect: (value: string) => void         // change handler
 * - label: string | i18n key                  // visible label above the select
 * - options: string[]                         // category options (defaults to DEFAULT_OPTIONS)
 * - value: string                             // controlled value
 */
export default function Selector({
  onSelect,
  label,
  options = DEFAULT_OPTIONS,
  value = "",
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";

  /**
   * Build the visible text for each option:
   * - Preferred: i18n key "categories.<option>"
   * - Fallback: localFallback(option, currentLanguage)
   * Memoized to avoid recomputing unless options or language change.
   */
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
      {/* Optional visible label (accepts plain text or i18n key) */}
      {label && (
        <label className="selector__label" htmlFor="category-select">
          {t(label, label)}
        </label>
      )}

      <div className="selector__field">
        {/* Decorative elements for your UI theme */}
        <span aria-hidden className="selector__halo" />
        <span aria-hidden className="selector__underline" />

        {/* Controlled select: value + onChange proxy to onSelect */}
        <select
          id="category-select"
          value={value}
          required
          onChange={(e) => onSelect?.(e.target.value)}
          className="selector__control"
        >
          {/* Placeholder row (disabled) — text resolved via i18n with local fallback to "All" */}
          <option value="" disabled>
            {t("select_category", { defaultValue: localFallback("All", i18n.language) })}
          </option>

          {/* Concrete options */}
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
