import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

const DEFAULT_OPTIONS = ["All", "Men", "Women", "Children"];

export default function Selector({ onSelect, label, options = DEFAULT_OPTIONS, value = "" }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";

  const translated = useMemo(() => {
    const key = (k) => `categories.${k.toLowerCase()}`;
    return options.map((opt) => ({
      raw: opt,
      text: t(key(opt), opt), // fallback to raw if missing in i18n
    }));
  }, [options, t]);

  return (
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
          </option>
        ))}
      </select>
    </div>
  );
}
