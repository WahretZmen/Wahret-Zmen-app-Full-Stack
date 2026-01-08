// DashboardLayout.jsx
// -----------------------------------------------------------------------------
// Purpose : Admin dashboard shell with a collapsible sidebar, header actions,
//           and routed main content. Includes logout confirmation.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
import axios from "axios"; // (not used directly here, but kept as in original)
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

// Icons
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaTools,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";

// UI libs & meta
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

// Assets
import HomeIcone from "../../../public/fav-icon.png";

// Styles for layout (sidebar + mobile button)
import "../../Styles/StylesDashboardLayout.css";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const DashboardLayout = () => {
  // ---------------------------------------------------------------------------
  // 1) Router & local state
  // ---------------------------------------------------------------------------
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // 2) Handlers
  // ---------------------------------------------------------------------------
  // Logout flow with confirmation modal
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم تسجيل خروجك من لوحة تحكم المدير",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B5C3E",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، سجّل خروجي!",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      Swal.fire({
        title: "تم تسجيل الخروج",
        text: "تم إنهاء جلسة المدير بنجاح.",
        icon: "success",
        confirmButtonColor: "#8B5C3E",
        timer: 2000,
      });
      navigate("/");
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // ---------------------------------------------------------------------------
  // 3) Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // ✅ جعل الواجهة من اليمين إلى اليسار داخل لوحة التحكم
    document.documentElement.dir = "rtl";

    // ✅ إعادة الاتجاه حسب اللغة المحفوظة عند مغادرة لوحة التحكم
    return () => {
      const savedLang = localStorage.getItem("language");
      if (savedLang === "ar") {
        document.documentElement.dir = "rtl";
      } else {
        document.documentElement.dir = "ltr";
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 4) Render
  // ---------------------------------------------------------------------------
  return (
    <section
      dir="rtl"
      className="dashboard-container flex bg-gray-100 overflow-hidden"
    >
      {/* Page title */}
      <Helmet>
        <title>لوحة تحكم المدير</title>
      </Helmet>

      {/* --------------------------------------------------------------------- */}
      {/* Mobile Sidebar Toggle (button on the RIGHT)                          */}
      {/* --------------------------------------------------------------------- */}
      <button
        className="mobile-menu-button md:hidden flex items-center justify-center w-12 h-12 shadow-lg rounded-lg"
        onClick={toggleSidebar}
      >
        <FaBars className="h-6 w-6" />
      </button>

      {/* --------------------------------------------------------------------- */}
      {/* Sidebar                                                              */}
      {/* --------------------------------------------------------------------- */}
      <aside
        className={`sidebar bg-gray-800 text-white md:flex flex-col justify-between z-40 shadow-lg ${
          sidebarOpen ? "open" : ""
        }`}
      >
        {/* Home link (logo button) */}
        <div className="sidebar-logo mt-24 flex items-center justify-center w-full">
          <Link
            to="/"
            className="flex items-center justify-center h-14 w-full bg-white hover:bg-gray-100 transition-all rounded-lg shadow-sm"
            onClick={closeSidebar}
          >
            <img
              src={HomeIcone}
              alt="الصفحة الرئيسية"
              className="h-8 w-8 object-contain rounded"
            />
          </Link>
        </div>

        {/* Nav icons */}
        <nav className="sidebar-nav mt-4 flex-grow">
          <Link
            to="/dashboard"
            className="sidebar-link bg-[#8B5C3E] rounded-lg text-white justify-center"
            onClick={closeSidebar}
          >
            <FaTachometerAlt className="h-4 w-4 ml-2" />
            <span className="sidebar-text">لوحة التحكم</span>
          </Link>

          <Link
            to="/dashboard/add-new-product"
            className="sidebar-link rounded-lg justify-center"
            onClick={closeSidebar}
          >
            <FaPlusCircle className="h-4 w-4 ml-2" />
            <span className="sidebar-text">إضافة منتج</span>
          </Link>

          <Link
            to="/dashboard/manage-products"
            className="sidebar-link rounded-lg justify-center"
            onClick={closeSidebar}
          >
            <MdProductionQuantityLimits className="h-4 w-4 ml-2" />
            <span className="sidebar-text">إدارة المنتجات</span>
          </Link>
        </nav>

        {/* Logout (bottom) */}
        <div className="p-2 flex justify-center mt-auto">
          <button
            onClick={() => {
              closeSidebar();
              handleLogout();
            }}
            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center justify-center"
          >
            <FaSignOutAlt className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* --------------------------------------------------------------------- */}
      {/* Main Content                                                         */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex-grow text-gray-800 overflow-auto">
        {/* Header actions */}
        <header className="bg-white shadow-md py-4 px-6 flex flex-col gap-4 md:flex-row md:justify-between items-center sticky top-0 z-30 w-full">
          <h1 className="text-2xl font-semibold text-[#8B5C3E] w-full text-center md:text-right">
            لوحة التحكم
          </h1>

          <div className="flex flex-col gap-4 w-full md:flex-row md:items-center md:justify-end">
            <Link to="/dashboard/add-new-product" className="w-full md:w-auto">
              <button className="flex items-center justify-center w-full px-6 py-3 h-14 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all">
                <FaPlusCircle className="h-5 w-5 ml-2" />
                إضافة منتج
              </button>
            </Link>
            <Link
              to="/dashboard/manage-products"
              className="w-full md:w-auto"
            >
              <button className="flex items-center justify-center w-full px-6 py-3 h-14 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all">
                <FaTools className="h-5 w-5 ml-2" />
                إدارة المنتجات
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-6 py-3 h-14 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all md:w-auto"
            >
              <FaSignOutAlt className="h-5 w-5 ml-2" />
              تسجيل الخروج
            </button>
          </div>
        </header>

        {/* Routed content */}
        <main className="p-6 sm:p-8 space-y-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardLayout;
