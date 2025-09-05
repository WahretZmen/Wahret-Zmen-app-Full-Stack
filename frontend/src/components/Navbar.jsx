// Navbar.jsx
import { FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import logoImg from "../../src/assets/Logo/Logo Boutique Wahret Zmen.jpg";
import "../Styles/StylesNavbar.css";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InputSearch from "./SearchInput";

/* =============================================================================
   🧭 Navbar (Wahret Zmen)
   - Fixed, lightweight, accessible
   - RTL/LTR aware
   - Prevents background scroll when mobile menu is open
   - Stable user dropdown that never runs off-screen
   - Adds .scrolled class when page scrolls for subtle elevation
============================================================================= */
const Navbar = () => {
  // UI state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);

  // Data sources
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const { currentUser, logout } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // i18n / router
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------------------------------------------------------------------
     A. Expose --navbar-height CSS var for precise positioning
  --------------------------------------------------------------------------- */
  useEffect(() => {
    const setNavHeightVar = () => {
      const h = headerRef.current?.offsetHeight || 60;
      document.documentElement.style.setProperty("--navbar-height", `${h}px`);
    };
    setNavHeightVar();
    window.addEventListener("resize", setNavHeightVar);
    return () => window.removeEventListener("resize", setNavHeightVar);
  }, []);

  /* ---------------------------------------------------------------------------
     B. Close popovers on outside click / ESC
  --------------------------------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      const navbarEl = document.querySelector(".navbar-content");
      if (isMobileMenuOpen && navbarEl && !navbarEl.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  /* ---------------------------------------------------------------------------
     C. Lock body scroll when mobile menu is open
  --------------------------------------------------------------------------- */
  useEffect(() => {
    const body = document.body;
    if (isMobileMenuOpen) {
      body.classList.add("menu-open");
    } else {
      body.classList.remove("menu-open");
    }
    return () => body.classList.remove("menu-open");
  }, [isMobileMenuOpen]);

  /* ---------------------------------------------------------------------------
     D. Close menus on route change; also close on large-screen resize
  --------------------------------------------------------------------------- */
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    // scroll to top when changing route via navbar links
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1025) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ---------------------------------------------------------------------------
     E. Add 'scrolled' class after small scroll for subtle elevation
  --------------------------------------------------------------------------- */
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 4;
      const root = document.documentElement;
      if (scrolled) root.classList.add("navbar-scrolled");
      else root.classList.remove("navbar-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------------------------------------------------------------------
     Render
  --------------------------------------------------------------------------- */
  return (
    <header className="navbar-container" ref={headerRef}>
      <nav className="navbar-content" dir={dir} aria-label={t("navbar.brand") || "Wahret Zmen"}>
        {/* ---------------------------- Brand / Logo ---------------------------- */}
        <div className="navbar-left">
          <Link
            to="/"
            className="logo premium-logo"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label={t("navbar.brand")}
          >
            <span className="logo-emblem" aria-hidden="true">
              <img src={logoImg} alt="Wahret Zmen Logo" className="logo-img" />
              <span className="logo-halo" aria-hidden="true"></span>
              <span className="logo-shimmer" aria-hidden="true"></span>
            </span>
            <span className="logo-text">
              <span className="logo-text-shine">{t("navbar.brand")}</span>
            </span>
          </Link>
        </div>

        {/* -------------------------- Mobile Toggle ---------------------------- */}
        <button
          className="mobile-menu-btn"
          aria-label={isMobileMenuOpen ? t("close_menu") || "Close menu" : t("open_menu") || "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setIsMobileMenuOpen((s) => !s)}
        >
          {isMobileMenuOpen ? <FiX className="menu-icon" /> : <FiMenu className="menu-icon" />}
        </button>

        {/* ------------------------------ Search (optional) -------------------- */}
        <div className="nav-search" aria-hidden="false">
          {/* You can remove this block if you don't want search in the navbar */}
          <InputSearch />
        </div>

        {/* ----------------------- Center Navigation Links --------------------- */}
        <ul
          id="main-navigation"
          className={`nav-links ${isMobileMenuOpen ? "mobile-center open" : ""}`}
          role="menubar"
        >
          <li role="none">
            <Link role="menuitem" to="/" onClick={() => setIsMobileMenuOpen(false)}>
              {t("home")}
            </Link>
          </li>
          <li role="none">
            <Link role="menuitem" to="/products" onClick={() => setIsMobileMenuOpen(false)}>
              {t("products")}
            </Link>
          </li>
          <li role="none">
            <Link role="menuitem" to="/about" onClick={() => setIsMobileMenuOpen(false)}>
              {t("about-menu")}
            </Link>
          </li>
          <li role="none">
            <Link role="menuitem" to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              {t("contact-menu")}
            </Link>
          </li>
          {token && (
            <li role="none">
              <Link role="menuitem" to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                {t("admin_dashboard")}
              </Link>
            </li>
          )}
        </ul>

        {/* --------------------------- Right (icons) --------------------------- */}
        <div className="nav-icons" aria-label="User and cart">
          {/* Cart */}
          <Link
            to="/cart"
            className="cart-icon"
            onClick={() => window.scrollTo(0, 0)}
            aria-label={t("cart")}
          >
            <FiShoppingBag className="icon" />
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </Link>

          {/* User */}
          {currentUser ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-avatar-btn"
                aria-haspopup="menu"
                aria-expanded={isDropdownOpen}
                aria-controls="profile-menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen((s) => !s);
                }}
                title={currentUser?.email || "Account"}
              >
                <FiUser className="user-icon logged-in" />
              </button>

              {/* Fixed dropdown */}
              <div
                id="profile-menu"
                className={`user-dropdown ${isDropdownOpen ? "active" : ""} ${dir === "rtl" ? "rtl" : "ltr"}`}
                role="menu"
              >
                <ul>
                  <li role="menuitem">
                    <Link to="/user-dashboard" onClick={() => setIsDropdownOpen(false)}>
                      {t("dashboard")}
                    </Link>
                  </li>
                  <li role="menuitem">
                    <Link to="/orders" onClick={() => setIsDropdownOpen(false)}>
                      {t("orders")}
                    </Link>
                  </li>
                  <li role="menuitem">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                        navigate("/");
                      }}
                    >
                      {t("logout")}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : token ? (
            <Link to="/dashboard" className="dashboard-link admin-only">
              {t("admin_dashboard")}
            </Link>
          ) : (
            <Link to="/login" className="login-icon" aria-label={t("login")}>
              <FiUser className="icon" />
            </Link>
          )}

          {/* If you want language switcher inside navbar, un-comment */}
          {/*
          <div className="language-switcher-wrapper">
            <LanguageSwitcher />
          </div>
          */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
