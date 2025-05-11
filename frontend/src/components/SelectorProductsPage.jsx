import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../Styles/StylesSelectorProductsPage.css";
 // classic styles

 // add a comment
// updated to force Vercel build

const SelectorsPageProducts = ({ options = [], onSelect, label }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";
  const [selected, setSelected] = useState(["All"]);

  useEffect(() => {
    onSelect(selected);
  }, [selected, onSelect]);

  const handleChange = (value) => {
    let updated = [];

    if (value === "All") {
      updated = ["All"];
    } else {
      if (selected.includes(value)) {
        updated = selected.filter((item) => item !== value);
      } else {
        updated = [...selected.filter((item) => item !== "All"), value];
      }

      if (updated.length === 0) {
        updated = ["All"];
      }
    }

    setSelected(updated);
  };


  return (
    <div
      className="selector-products-container"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <label className="selector-products-label">{t(label)}</label>
      <div className="selector-options">
        {options.map((option, index) => (
          <label
            key={index}
            className={`selector-option ${
              selected.includes(option) ? "active" : ""
            }`}
          >
            <input
              type="checkbox"
              value={option}
              checked={selected.includes(option)}
              onChange={() => handleChange(option)}
            />
            <span className="capitalize whitespace-nowrap">
              {t(`product_filters.${option.toLowerCase()}`)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SelectorsPageProducts;
