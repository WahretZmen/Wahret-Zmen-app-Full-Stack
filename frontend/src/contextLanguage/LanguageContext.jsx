import React, { createContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Create Language Context
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem("language") || "ar");


  // Function to change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
  
    // ✅ Only apply RTL globally *if not in the dashboard*
    const isDashboard = window.location.pathname.includes("/dashboard");
    if (!isDashboard) {
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  };
  

  // Apply saved language on app load
  useEffect(() => {
    changeLanguage(language);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
