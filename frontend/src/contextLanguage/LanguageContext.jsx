import React, { createContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

/* =============================================================================
   🌐 Language Context
   - Persists selected language in localStorage
   - Calls i18n.changeLanguage(...)
   - Updates <html lang> and (conditionally) <html dir>
   - Keeps RTL off inside /dashboard routes
============================================================================= */

// Public context
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();

  // Initialize from localStorage (defaults to "ar")
  const [language, setLanguage] = useState(localStorage.getItem("language") || "ar");

  /* -----------------------------------------------------------------------------
     changeLanguage(lang)
     - Updates state
     - Notifies i18n
     - Persists to localStorage
     - Sets <html lang> and <html dir> (except on /dashboard)
  ----------------------------------------------------------------------------- */
  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);

    // Update <html lang> attribute for accessibility/SEO
    document.documentElement.lang = lang;

    // Apply RTL globally only if NOT on admin dashboard
    const isDashboard = window.location.pathname.includes("/dashboard");
    if (!isDashboard) {
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  };

  /* -----------------------------------------------------------------------------
     On initial mount, apply saved language immediately
     (kept as-is to match your current behavior)
  ----------------------------------------------------------------------------- */
  useEffect(() => {
    changeLanguage(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
