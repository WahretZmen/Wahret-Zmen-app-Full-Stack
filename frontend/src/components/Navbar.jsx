import { Link } from "react-router-dom";
import { FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import logoImg from "../../src/assets/Logo/Logo Boutique Wahret Zmen.jpg";
import "../Styles/StylesNavbar.css";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();
  const token = localStorage.getItem("token");

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (isMobileMenuOpen && !event.target.closest(".navbar-content")) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  return (
    <header className="navbar-container">
      <nav className="navbar-content" dir={i18n.language === "ar" ? "rtl" : "ltr"}>

        {/* Logo Section */}
        <div className="navbar-left">
          <Link to="/" className="logo">
            <img src={logoImg} alt="Wahret Zmen Logo" className="logo-img" />
            <span className="logo-text">{t("navbar.brand")}</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

        {/* Right Icons */}
        <div className="nav-icons">
          <Link to="/cart" className="cart-icon">
            <FiShoppingBag className="icon" />
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </Link>

          {currentUser ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FiUser className="user-icon logged-in" />
              </button>

              {/* ✅ PROTECTED DROPDOWN */}
             {isDropdownOpen && (
  <div className="user-dropdown active">
    <ul>
      <li>
        <Link to="/user-dashboard" onClick={() => setIsDropdownOpen(false)}>
          {t("dashboard")}
        </Link>
      </li>
      <li>
        <Link to="/orders" onClick={() => setIsDropdownOpen(false)}>
          {t("orders")}
        </Link>
      </li>
      <li>
        <button onClick={() => { logout(); setIsDropdownOpen(false); }}>
          {t("logout")}
        </button>
      </li>
    </ul>
  </div>
)}

            </div>
          ) : token ? (
            <Link to="/dashboard" className="dashboard-link admin-only">
            {t("admin_dashboard")}
            </Link>

          ) : (
            <Link to="/login" className="login-icon">
              <FiUser className="icon" />
            </Link>
          )}

          {/* Language Switcher */}
          <div className="language-switcher-wrapper">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
