// RevenueChart.jsx
// -----------------------------------------------------------------------------
// Arabic (Tunisia) + Right-To-Left months layout
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useGetAllOrdersQuery } from "../../redux/features/orders/ordersApi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = () => {
  const { data: orders, error, isLoading } = useGetAllOrdersQuery();
  const [revenueData, setRevenueData] = useState([]);

  const getMonth = (date) => new Date(date).getMonth();

  const calculateRevenue = () => {
    const monthlyRevenue = Array(12).fill(0);

    if (orders) {
      orders.forEach((order) => {
        const month = getMonth(order.createdAt);
        monthlyRevenue[month] += order.totalPrice;
      });
    }

    setRevenueData(monthlyRevenue);
  };

  useEffect(() => {
    if (orders) calculateRevenue();
  }, [orders]);

  if (isLoading) return <p dir="rtl">جارٍ تحميل بيانات الإيرادات...</p>;
  if (error)
    return (
      <p dir="rtl">
        حدث خطأ أثناء جلب البيانات:{" "}
        {error?.message || "خطأ غير متوقع."}
      </p>
    );

  // الأشهر الشمسية في تونس (بالترتيب من جانفي إلى ديسمبر)
  const monthLabels = [
    "جانفي",
    "فيفري",
    "مارس",
    "أفريل",
    "ماي",
    "جوان",
    "جويلية",
    "أوت",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const data = {
    labels: monthLabels,           // ❗ نترك الترتيب عادي
    datasets: [
      {
        label: "الإيرادات (دولار أمريكي)",
        data: revenueData,         // ❗ بدون عكس البيانات
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
        rtl: true,
        textDirection: "rtl",
      },
      title: {
        display: true,
        text: "الإيرادات الشهرية (بالدولار)",
        rtl: true,
        textDirection: "rtl",
      },
      tooltip: {
        rtl: true,
        textDirection: "rtl",
      },
    },

    scales: {
      x: {
        reverse: true, // ✅ هذا وحده يكفي لعكس المحور أفقياً
        ticks: {
          font: { family: "Arial" },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      dir="rtl"
      className="w-full max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
        مخطط الإيرادات الشهرية (بالدولار)
      </h2>

      <div className="w-full h-[300px] md:h-[400px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
