// src/components/Selector.jsx
// -----------------------------------------------------------------------------
// Generic selector (Arabic-first)
// - Works with:
//     ["all", "men", "women"]  OR
//     [{ value: "Men", label: "رجال" }, ...]
// - Displays Arabic labels for known category keys
// - Maps "all" → "" so parents can use "" = no filter
// -----------------------------------------------------------------------------

import React, { useMemo } from "react";
import "../Styles/StylesSelector.css";

// Canonical keys for categories
const DEFAULT_OPTIONS = ["all", "men", "women", "children"];

// Arabic labels for known keys
const AR_CATEGORY_LABELS = {
  all: "الكل",
  men: "رجال",
  women: "نساء",
  children: "أطفال",
};

/**
 * Normalize any option (string or object) to { key, value, label }
 */
function normalizeOption(opt) {
  // String case: "Men", "all", etc.
  if (typeof opt === "string") {
    const key = opt.toLowerCase();
    const label = AR_CATEGORY_LABELS[key] || opt;
    const value = key === "all" ? "" : opt; // "" means ALL
    return { key, value, label };
  }

  // Object case: { value, label } or { key, label }
  if (opt && typeof opt === "object") {
    const rawVal = opt.value ?? opt.key ?? "";
    const key = String(rawVal).toLowerCase();
    const value = key === "all" ? "" : rawVal;
    const label =
      (typeof opt.label === "string" && opt.label.trim()) ||
      AR_CATEGORY_LABELS[key] ||
      String(rawVal || "");
    return { key, value, label };
  }

  // Fallback
  const v = String(opt ?? "");
  return { key: v.toLowerCase(), value: v, label: v };
}

/**
 * Selector Component
 *
 * @param {Object} props
 * @param {Function} props.onSelect - callback with selected value
 * @param {string} [props.label] - label text shown above the select
 * @param {Array} [props.options] - strings or { value, label } items
 * @param {string} [props.value] - current selected value ("" means All)
 */
export default function Selector({
  onSelect,
  label,
  options = DEFAULT_OPTIONS,
  value = "",
}) {
  // Build normalized options (deduped by key)
  const normalized = useMemo(() => {
    const mapped = options.map(normalizeOption);
    const seen = new Set();
    return mapped.filter((opt) => {
      if (seen.has(opt.key)) return false;
      seen.add(opt.key);
      return true;
    });
  }, [options]);

  return (
    <div className="selector" dir="rtl">
      {label && (
        <label className="selector__label" htmlFor="category-select">
          {label}
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
          {normalized.map(({ key, value: val, label: text }) => (
            <option key={key} value={val}>
              {text}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
