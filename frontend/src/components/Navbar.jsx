import { FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import logoImg from "../../src/assets/Logo/Logo Boutique Wahret Zmen.jpg";
import "../Styles/StylesNavbar.css";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import InputSearch from "./SearchInput";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navQuery, setNavQuery] = useState(""); // kept

  const dropdownRef = useRef(null);
  const headerRef = useRef(null);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();
  const token = localStorage.getItem("token");

  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();

  // Expose navbar height as a CSS variable so the fixed dropdown can sit below it
  useEffect(() => {
    const setNavHeightVar = () => {
      const h = headerRef.current?.offsetHeight || 60;
      document.documentElement.style.setProperty("--navbar-height", `${h}px`);
    };
    setNavHeightVar();
    window.addEventListener("resize", setNavHeightVar);
    return () => window.removeEventListener("resize", setNavHeightVar);
  }, []);

  // Click outside + close mobile menu when clicking outside navbar
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

  return (
    <header className="navbar-container" ref={headerRef}>
      <nav className="navbar-content" dir={dir}>
        {/* Logo Section */}
        <div className="navbar-left">
          <Link
            to="/"
            className="logo premium-logo"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {/* Emblem with halo + shimmer overlay (decorative) */}
            <span className="logo-emblem" aria-hidden="true">
              <img src={logoImg} alt="Wahret Zmen Logo" className="logo-img" />
              <span className="logo-halo" aria-hidden="true"></span>
              <span className="logo-shimmer" aria-hidden="true"></span>
            </span>

            {/* Brand text with gentle shine */}
            <span className="logo-text">
              <span className="logo-text-shine">{t("navbar.brand")}</span>
            </span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-menu-btn"
          aria-label="Toggle menu"
          onClick={() => setIsMobileMenuOpen((s) => !s)}
        >
          {isMobileMenuOpen ? <FiX className="menu-icon" /> : <FiMenu className="menu-icon" />}
        </button>

        {/* Center Navigation Links */}
        <ul className={`nav-links ${isMobileMenuOpen ? "mobile-center open" : ""}`}>
          <li>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              {t("home")}
            </Link>
          </li>
          <li>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>
              {t("products")}
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
              {t("about-menu")}
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              {t("contact-menu")}
            </Link>
          </li>
          {token && (
            <li>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                {t("admin_dashboard")}
              </Link>
            </li>
          )}
        </ul>

        {/* Right area: Search placed right before icons */}
        <div className="nav-icons">
          <Link
            to="/cart"
            className="cart-icon"
            onClick={() => window.scrollTo(0, 0)}
            aria-label={t("cart")}
          >
            <FiShoppingBag className="icon" />
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </Link>

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
              >
                <FiUser className="user-icon logged-in" />
              </button>

              {/* Fixed, high z-index, scrollable dropdown */}
              <div
                id="profile-menu"
                className={`user-dropdown ${isDropdownOpen ? "active" : ""} ${dir === "rtl" ? "rtl" : "ltr"}`}
                role="menu"
              >
                <ul>
                  <li role="menuitem">
                    <Link
                      to="/user-dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {t("dashboard")}
                    </Link>
                  </li>
                  <li role="menuitem">
                    <Link
                      to="/orders"
                      onClick={() => setIsDropdownOpen(false)}
                    >
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

          {/* Optional: language switcher spot */}
          {/* <div className="language-switcher-wrapper">
            <LanguageSwitcher />
          </div> */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
