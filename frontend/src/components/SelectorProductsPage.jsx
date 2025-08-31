import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/** Keep in sync with Products.jsx */
const DEFAULT_OPTIONS = ["All", "Men", "Women", "Children"];
const normalize = (v) => (v || "").toString().trim().toLowerCase();

const CATEGORY_ALIAS_TO_UI = {
  // FR
  hommes: "Men",
  femmes: "Women",
  enfants: "Children",
  // EN
  men: "Men",
  women: "Women",
  children: "Children",
  kids: "Children",
  kid: "Children",
  // Singular FR
  homme: "Men",
  femme: "Women",
  enfant: "Children",
  // AR
  "رجال": "Men",
  "نساء": "Women",
  "أطفال": "Children",
};

const mapURLCategoryToUI = (raw) => {
  const key = normalize(raw);
  return CATEGORY_ALIAS_TO_UI[key] || "";
};

export default function SelectorProductsPage({
  options = DEFAULT_OPTIONS,
  onSelect,               // expects array: ["All"] or ["Men"] …
  label = "category",
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";
  const location = useLocation();
  const navigate = useNavigate();

  const [selected, setSelected] = useState("All");

  // Build label map
  const labelFor = (k) => {
    if (normalize(k) === "all") {
      return isRTL ? "الكل" : t("all", "Tous");
    }
    const key = `categories.${k.toLowerCase()}`;
    return t(key, k);
  };

  const pills = useMemo(() => options.map((o) => ({
    key: o,
    text: labelFor(o),
  })), [options, isRTL, t]);

  // Sync from URL → local state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("category");
    const mapped = mapURLCategoryToUI(raw);
    if (mapped) {
      setSelected(mapped);
      onSelect?.([mapped]);
    } else {
      setSelected("All");
      onSelect?.(["All"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Update URL when user clicks a pill
  const setCategory = (k) => {
    setSelected(k);
    const params = new URLSearchParams(location.search);
    if (k === "All") {
      params.delete("category");
      onSelect?.(["All"]);
    } else {
      const urlKey = {
        Men: "hommes",
        Women: "femmes",
        Children: "enfants",
      }[k] || k.toLowerCase();
      params.set("category", urlKey);
      onSelect?.([k]);
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  return (
    <div className="w-full" dir={isRTL ? "rtl" : "ltr"}>
      {label && (
        <div className="text-center text-sm text-gray-600 mb-2">
          {t(label, label)}
        </div>
      )}

      <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3`}>
        {pills.map(({ key, text }) => {
          const isActive = key === selected;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition
                ${isActive
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-800 border-gray-300 hover:border-gray-600"
                }`}
              aria-pressed={isActive}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
