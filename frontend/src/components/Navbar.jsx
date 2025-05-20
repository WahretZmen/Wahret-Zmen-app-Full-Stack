import { FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import logoImg from "../../src/assets/Logo/Logo Boutique Wahret Zmen.jpg";
import "../Styles/StylesNavbar.css";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

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
          
          <a
  href="/"
  className="logo"
  onClick={() => setIsMobileMenuOpen(false)}
>
  <img src={logoImg} alt="Wahret Zmen Logo" className="logo-img" />
  <span className="logo-text">{t("navbar.brand")}</span>
</a>

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
            <a href="/" onClick={() => setIsMobileMenuOpen(false)}>
  {t("home")}
</a>

          </li>
          <li>
            <a href="/products" onClick={() => setIsMobileMenuOpen(false)}>
  {t("products")}
</a>

          </li>
          <li>
            <a href="/about" onClick={() => setIsMobileMenuOpen(false)}>
  {t("about-menu")}
</a>

              
          </li>
          <li>
            <a href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
  {t("contact-menu")}
</a>

          </li>
          {token && (
            <li>
              <a href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
  {t("admin_dashboard")}
</a>

            </li>
          )}
        </ul>

        {/* Right Icons */}
        <div className="nav-icons">
          <Link
  to="/cart"
  className="cart-icon"
  onClick={() => {
    window.scrollTo(0, 0);
  }}
>
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
                      <a href="/user-dashboard" onClick={() => setIsDropdownOpen(false)}>
  {t("dashboard")}
</a>

                    </li>
                    <li>
                      <a href="/orders" onClick={() => setIsDropdownOpen(false)}>
  {t("orders")}
</a>

                    </li>
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                      >
                        {t("logout")}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : token ? (
            <a href="/dashboard" className="dashboard-link admin-only">
  {t("admin_dashboard")}
</a>

          ) : (
            <a href="/login" className="login-icon">
  <FiUser className="icon" />
</a>

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




