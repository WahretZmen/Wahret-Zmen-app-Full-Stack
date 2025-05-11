import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useGetAllOrdersQuery } from '../../redux/features/orders/ordersApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = () => {
  const { data: orders, error, isLoading } = useGetAllOrdersQuery();
  const [revenueData, setRevenueData] = useState([]);

  const getMonth = (date) => {
    const newDate = new Date(date);
    return newDate.getMonth();
  };

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
    if (orders) {
      calculateRevenue();
    }
  }, [orders]);

  if (isLoading) return <p>Loading revenue data...</p>;
  if (error) return <p>Error fetching orders: {error.message}</p>;

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (USD)',
        data: revenueData,
        backgroundColor: 'rgba(34, 197, 94, 0.7)', 
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensures the chart resizes properly on smaller screens
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

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Monthly Revenue (USD)</h2>
      {/* Chart Container with Responsive Sizing */}
      <div className="w-full h-[300px] md:h-[400px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
