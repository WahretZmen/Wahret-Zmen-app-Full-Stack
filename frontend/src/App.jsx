// src/App.jsx
import { useEffect, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./App.css";
import "../src/i18n.js"; // Ensure i18n is initialized before using <App />

// Layout & Providers
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./contextLanguage/LanguageContext";

/**
 * App (Root)
 * - Wraps the app with Language & Auth providers.
 * - Applies <html lang> and <html dir> based on the active i18n language.
 * - Shows a splash Loading screen for 2s on first mount.
 * - Renders route children via <Outlet />.
 */
function App() {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  /**
   * Derive direction from language code.
   * Treat any "ar" or "ar-*" as RTL; everything else LTR.
   */
  const getDirFromLang = (lang) =>
    typeof lang === "string" && lang.toLowerCase().startsWith("ar") ? "rtl" : "ltr";

  /**
   * Update <html> attributes (lang, dir) whenever language changes.
   * useCallback so the same reference is used in the event listener.
   */
  const applyLanguageAttributes = useCallback(() => {
    const currentLang = i18n.language || "en";
    const currentDir = getDirFromLang(currentLang);

    // Update <html lang=".."> and <html dir="..">
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentDir;

    // Optional: keep a body class for easier RTL-specific CSS if needed
    document.body.classList.toggle("rtl", currentDir === "rtl");
    document.body.classList.toggle("ltr", currentDir === "ltr");
  }, [i18n.language]);

  /**
   * Apply language attributes on mount and on future language changes.
   */
  useEffect(() => {
    applyLanguageAttributes();

    // Listen for i18next language changes to update <html> attributes dynamically
    i18n.on("languageChanged", applyLanguageAttributes);
    return () => {
      i18n.off("languageChanged", applyLanguageAttributes);
    };
  }, [i18n, applyLanguageAttributes]);

  /**
   * Splash screen control: show <Loading /> for ~2s after first mount.
   * Adjust to your liking or remove if not needed.
   */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <LanguageProvider>
      <AuthProvider>
        {/* Top navigation is outside <main> so it persists across routes */}
        <Navbar />

        {/* Main content container (responsive width + base padding) */}
        <main className="min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary">
          {/* React Router will render the matched child route here */}
          <Outlet />
        </main>

        {/* Global footer */}
        <Footer />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
