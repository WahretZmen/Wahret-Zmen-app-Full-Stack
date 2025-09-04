// RevenueChart.jsx
// -----------------------------------------------------------------------------
// Purpose: Display monthly revenue (USD) based on orders data.
// Features:
//   - Fetches all orders via RTK Query.
//   - Aggregates revenue per month.
//   - Renders a responsive bar chart with Chart.js.
// Notes:
//   - No functional or visual changes, only organization & comments.
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetAllOrdersQuery } from '../../redux/features/orders/ordersApi';

// Register Chart.js components globally
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const RevenueChart = () => {
  // ---------------------------------------------------------------------------
  // Data fetching & local state
  // ---------------------------------------------------------------------------
  const { data: orders, error, isLoading } = useGetAllOrdersQuery();
  const [revenueData, setRevenueData] = useState([]);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  // Extract month index (0–11) from a date string
  const getMonth = (date) => {
    const newDate = new Date(date);
    return newDate.getMonth();
  };

  // Aggregate revenue by month
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

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (orders) {
      calculateRevenue();
    }
  }, [orders]);

  // ---------------------------------------------------------------------------
  // Early returns
  // ---------------------------------------------------------------------------
  if (isLoading) return <p>Loading revenue data...</p>;
  if (error) return <p>Error fetching orders: {error.message}</p>;

  // ---------------------------------------------------------------------------
  // Chart.js config
  // ---------------------------------------------------------------------------
  const data = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    datasets: [
      {
        label: 'Revenue (USD)',
        data: revenueData,
        backgroundColor: 'rgba(34, 197, 94, 0.7)', // Tailwind green-500 w/ opacity
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // allow flexible resizing
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Revenue (USD)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      {/* Chart title */}
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
        Monthly Revenue (USD)
      </h2>

      {/* Chart container (height adjusts by breakpoint) */}
      <div className="w-full h-[300px] md:h-[400px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
export default RevenueChart;
