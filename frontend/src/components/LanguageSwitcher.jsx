// src/components/LanguageSwitcher.jsx
import React, { useContext } from "react";
import { LanguageContext } from "../contextLanguage/LanguageContext";
import "../Styles/StylesLanguageSwitcher.css";

/**
 * 🌐 LanguageSwitcher
 * --------------------------------
 * Dropdown selector for switching app language.
 *
 * Context:
 * - Reads `language` and `changeLanguage` from LanguageContext.
 *
 * Behavior:
 * - Renders a <select> with available language options.
 * - Updates global language via changeLanguage().
 *
 * Notes:
 * - Add/remove <option> tags if you want to support more languages.
 */
const LanguageSwitcher = () => {
  const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="language-switcher"
    >
      {/* 🇫🇷 French */}
      <option value="fr">🇫🇷 Français</option>

      {/* 🇸🇦 Arabic */}
      <option value="ar">🇸🇦 العربية</option>
    </select>
  );
};

export default LanguageSwitcher;
