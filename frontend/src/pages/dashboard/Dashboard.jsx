// src/pages/dashboard/Dashboard.jsx
// -----------------------------------------------------------------------------
// Purpose: Admin dashboard showing quick stats, revenue chart, and order tools.
// Auth:
//   - Requires a valid admin token in localStorage ("token").
//   - Uses Axios directly (no external api.js file).
// UX:
//   - Graceful loading + error banner.
//   - Auto-redirects to /admin on 401/403 or missing token.
// -----------------------------------------------------------------------------

import { FaBoxOpen, FaClipboardList, FaChartLine, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// UI / Utils / Modules
import Loading from "../../components/Loading";
import RevenueChart from "./RevenueChart";
import ManageOrders from "./manageOrders/manageOrder";
import getBaseUrl from "../../utils/baseURL";

const Dashboard = () => {
  // ---------------------------------------------------------------------------
  // Local state
  // ---------------------------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    totalOrders: 0,
    monthlySales: [],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin"); // إعادة التوجيه إذا لم يوجد توكن
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 20000,
        });

        setData(response.data || {});
        setLoading(false);
      } catch (err) {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          (status === 401
            ? "انتهت جلستك. يرجى تسجيل الدخول مرة أخرى."
            : "حدث خطأ أثناء تحميل الإحصائيات.");

        setError(msg);
        setLoading(false);

        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          navigate("/admin"); // الرجوع إلى صفحة تسجيل الدخول
        }

        console.error("[Dashboard] fetch /api/admin failed:", err);
      }
    };

    fetchData();
  }, [navigate]);

  // ---------------------------------------------------------------------------
  // Loading view
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100" dir="rtl">
        <Loading />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Stats cards (Arabic labels)
  // ---------------------------------------------------------------------------
  const stats = [
    {
      icon: <FaUser className="h-6 w-6" />,
      value: data?.totalUsers ?? 0,
      label: "إجمالي المستخدمين",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      icon: <FaBoxOpen className="h-6 w-6" />,
      value: data?.totalProducts ?? 0,
      label: "إجمالي المنتجات",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      icon: <FaChartLine className="h-6 w-6" />,
      value: `${data?.totalSales ?? 0} USD`,
      label: "إجمالي المبيعات",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      icon: <FaClipboardList className="h-6 w-6" />,
      value: data?.totalOrders ?? 0,
      label: "إجمالي الطلبات",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
      borderColor: "border-teal-200",
    },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div
      dir="rtl"
      className="p-4 lg:p-8 w-full max-w-[100vw] mx-auto"
    >
      {/* Header (بدون زر تسجيل خروج هنا) */}
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          لوحة التحكم — الإدارة
        </h1>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm text-right">
          {error}
        </div>
      )}

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-xl border ${stat.borderColor} ${stat.bgColor} shadow-sm p-4 h-28 flex items-center`}
          >
            <div
              className={`flex items-center justify-center h-12 w-12 rounded-full mr-4 ${stat.textColor} bg-white/70`}
            >
              {stat.icon}
            </div>
            <div className="min-w-0 text-right">
              <div className="text-xs text-gray-600 truncate">{stat.label}</div>
              <div className="text-xl font-bold leading-tight">{stat.value}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Revenue Chart */}
      <section className="flex flex-col lg:flex-row gap-6 overflow-x-auto">
        <div className="flex-1 bg-white shadow-md rounded-lg border border-gray-200 p-6 min-w-[600px]">
          <div className="font-semibold mb-4 text-lg text-right">
            عدد الطلبات لكل شهر
          </div>
          <div className="flex items-center justify-center bg-gray-50 border-2 border-gray-200 border-dashed rounded-md p-4">
            <RevenueChart />
          </div>
        </div>
      </section>

      {/* Manage Orders */}
      <section className="bg-white shadow-md rounded-lg p-6 mt-6 overflow-x-auto min-w-[600px] border border-gray-200">
        <ManageOrders />
      </section>
    </div>
  );
};

export default Dashboard;
