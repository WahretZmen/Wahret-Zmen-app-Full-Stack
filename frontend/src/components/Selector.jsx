import React from "react";
import { useTranslation } from "react-i18next";

const Selector = ({ onSelect, label }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA"; // 🆕 detect RTL

  const options = ["All", "Men", "Women", "Children"];

  return (
    <div className="selector-wrapper mx-auto mb-4" dir={isRTL ? "rtl" : "ltr"}> {/* ✅ dynamic dir */}
      {label && (
        <label className="text-lg font-medium mb-2 text-gray-700 text-center block">
          {label}
        </label>
      )}
      <select
        defaultValue=""
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-gray-500 
                   focus:border-gray-500 bg-white text-gray-700 cursor-pointer 
                   transition duration-200 ease-in-out"
      >
        <option value="" disabled className="text-gray-500">
          {t("select_category")}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option} className="text-gray-900">
            {t(`categories.${option.toLowerCase()}`)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;
