// src/components/Navbar.jsx
// -----------------------------------------------------------------------------
// Navbar (RTL): logo + links + search + cart + user dropdown + mobile drawer
// -----------------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import logoImg from "../../src/assets/Logo/Logo-Boutique-Wahret-Zmen.png";
import "../Styles/StylesNavbar.css";

const Navbar = () => {
  // ----------------------------
  // Config
  // ----------------------------
  const dir = "rtl";
  const isRTL = true;
  const MOBILE_BP = 1024;
  const SIDE_WIDTH = 320;

  // ----------------------------
  // State
  // ----------------------------
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // ----------------------------
  // Refs
  // ----------------------------
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  // ----------------------------
  // Data
  // ----------------------------
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ----------------------------
  // Layout: height + breakpoint
  // ----------------------------
  useEffect(() => {
    const updateLayout = () => {
      const h = headerRef.current?.offsetHeight || 60;
      document.documentElement.style.setProperty("--navbar-height", `${h}px`);
      document.documentElement.setAttribute("dir", dir);

      setIsMobile(window.matchMedia(`(max-width: ${MOBILE_BP}px)`).matches);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [dir]);

  // ----------------------------
  // Global close: outside + ESC
  // ----------------------------
  useEffect(() => {
    const onMouseDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }

      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isSidebarOpen]);

  // ----------------------------
  // Actions
  // ----------------------------
  const closeAll = useCallback(() => {
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
  }, []);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const q = searchValue.trim();
      if (!q) return;

      navigate(`/products?search=${encodeURIComponent(q)}`);
      setSearchValue("");
      setIsSidebarOpen(false);
    },
    [navigate, searchValue]
  );

  const handleLogout = useCallback(() => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  }, [logout, navigate]);

  // ----------------------------
  // Mobile drawer styles
  // ----------------------------
  const fromEnd = dir === "rtl" ? "left" : "right";

  const overlayStyle = useMemo(
    () => ({
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.32)",
      zIndex: 2500,
      display: isSidebarOpen ? "block" : "none",
    }),
    [isSidebarOpen]
  );

  const sidebarStyle = useMemo(
    () => ({
      position: "fixed",
      top: "var(--navbar-height, 58px)",
      bottom: 0,
      [fromEnd]: 0,
      width: `min(88vw, ${SIDE_WIDTH}px)`,
      maxWidth: "100%",
      background: "#F8F9FA",
      boxShadow: dir === "rtl" ? "2px 0 18px rgba(0,0,0,.18)" : "-2px 0 18px rgba(0,0,0,.18)",
      borderInlineStart: "1px solid #E5E7EB",
      zIndex: 2600,
      transform: `translateX(${isSidebarOpen ? "0" : dir === "rtl" ? "-100%" : "100%"})`,
      transition: "transform .25s ease",
      display: isMobile ? "flex" : "none",
      flexDirection: "column",
    }),
    [dir, fromEnd, isMobile, isSidebarOpen]
  );

  const sidebarHeaderStyle = useMemo(
    () => ({
      padding: "10px 14px",
      borderBottom: "1px solid #E5E7EB",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }),
    []
  );

  const sidebarBodyStyle = useMemo(
    () => ({
      padding: "10px 14px",
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
    }),
    []
  );

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <header className="navbar-container" ref={headerRef}>
      <nav className="navbar-content" dir={dir}>
        {/* Brand */}
        <div className="navbar-left">
          <Link to="/" className="logo premium-logo" onClick={closeAll}>
            <span className="logo-emblem" aria-hidden="true">
              <img src={logoImg} alt="شعار وهرة زمان" className="logo-img" />
              <span className="logo-halo" aria-hidden="true" />
              <span className="logo-shimmer" aria-hidden="true" />
            </span>

            <span className="logo-text" aria-label="وهرة زمان">
              <span className="logo-text-shine">وهرة زمان</span>
            </span>
          </Link>
        </div>

        {/* Mobile: hamburger */}
        <button
          className="mobile-menu-btn nav-icon-stack mobile-nav-stack"
          type="button"
          aria-label={isSidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
          onClick={() => setIsSidebarOpen((s) => !s)}
        >
          {isSidebarOpen ? <FiX className="menu-icon" /> : <FiMenu className="menu-icon" />}
          <span className="nav-icon-label">{isSidebarOpen ? "إغلاق" : "القائمة"}</span>
        </button>

        {/* Desktop/tablet: links + search */}
        <ul className="nav-links">
          <li>
            <Link to="/">الرئيسية</Link>
          </li>
          <li>
            <Link to="/products">المنتجات</Link>
          </li>
          <li>
            <Link to="/about">من نحن</Link>
          </li>
          <li>
            <Link to="/contact">اتصل بنا</Link>
          </li>

          {token && (
            <li>
              <Link to="/dashboard">لوحة التحكم</Link>
            </li>
          )}

          <li className="nav-search">
            <form onSubmit={handleSearchSubmit} className="wz-search">
              <input
                type="text"
                dir={isRTL ? "rtl" : "ltr"}
                placeholder="ابحث عن المنتجات..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                aria-label="بحث"
                className="wz-search__input"
              />
              <button type="submit" aria-label="بحث" className="wz-search__btn">
                <FiSearch className="wz-search__icon" />
              </button>
            </form>
          </li>
        </ul>

        {/* Right: cart + user */}
        <div className="nav-icons">
          <Link to="/cart" className="cart-icon nav-icon-stack" aria-label="السلة" onClick={closeAll}>
            <FiShoppingBag className="icon" />
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
            <span className="nav-icon-label">السلة</span>
          </Link>

          {currentUser ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-avatar-btn nav-icon-stack"
                type="button"
                aria-label="حسابي"
                aria-haspopup="menu"
                onClick={() => setIsDropdownOpen((s) => !s)}
              >
                <FiUser className="user-icon logged-in" />
                <span className="nav-icon-label">حسابي</span>
              </button>

              <div className={`user-dropdown ${isDropdownOpen ? "active" : ""} ${dir === "rtl" ? "rtl" : "ltr"}`}>
                <ul>
                  <li>
                    <Link to="/user-dashboard" onClick={() => setIsDropdownOpen(false)}>
                      لوحة المستخدم
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" onClick={() => setIsDropdownOpen(false)}>
                      طلباتي
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} type="button">
                      تسجيل الخروج
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : token ? (
            <Link to="/dashboard" className="dashboard-link admin-only" onClick={closeAll}>
              لوحة التحكم
            </Link>
          ) : (
            <Link to="/login" className="login-icon nav-icon-stack" aria-label="تسجيل الدخول" onClick={closeAll}>
              <FiUser className="user-icon" />
              <span className="nav-icon-label">حسابي</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile overlay */}
      <div style={overlayStyle} onClick={() => setIsSidebarOpen(false)} />

      {/* Mobile drawer */}
      <aside ref={sidebarRef} style={sidebarStyle} dir={dir} aria-hidden={!isSidebarOpen}>
        <div style={sidebarHeaderStyle}>
          <strong style={{ fontSize: 16, color: "#333" }}>القائمة</strong>
          <button
            className="mobile-menu-btn"
            style={{ background: "transparent" }}
            type="button"
            aria-label="إغلاق"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <div style={sidebarBodyStyle}>
          <form onSubmit={handleSearchSubmit} className="wz-search">
            <input
              type="text"
              dir={isRTL ? "rtl" : "ltr"}
              placeholder="ابحث عن المنتجات..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="بحث"
              className="wz-search__input"
            />
            <button type="submit" aria-label="بحث" className="wz-search__btn">
              <FiSearch className="wz-search__icon" />
            </button>
          </form>

          <ul className="drawer-links">
            <li>
              <Link to="/" onClick={() => setIsSidebarOpen(false)}>
                الرئيسية
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={() => setIsSidebarOpen(false)}>
                المنتجات
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsSidebarOpen(false)}>
                من نحن
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setIsSidebarOpen(false)}>
                اتصل بنا
              </Link>
            </li>

            {token && (
              <li>
                <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)}>
                  لوحة التحكم
                </Link>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;
