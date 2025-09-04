// Dashboard.jsx
// -----------------------------------------------------------------------------
// Purpose: Admin dashboard showing quick stats, revenue chart, and order tools.
// Features:
//   - Authenticated admin summary (users, products, sales, orders).
//   - Revenue chart visualization.
//   - Manage Orders (table + per-product progress).
// Notes:
//   - No functional changes. Only comments/organization added.
// -----------------------------------------------------------------------------

import { FaBoxOpen, FaClipboardList, FaChartLine, FaUser } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// UI / Utils / Modules
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import RevenueChart from './RevenueChart';
import ManageOrders from './manageOrders/manageOrder';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const Dashboard = () => {
  // ---------------------------------------------------------------------------
  // Local state
  // ---------------------------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  // Fetch admin summary data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  // Logout handler: clear token + navigate home
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loading />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Derived UI data (stats cards)
  // ---------------------------------------------------------------------------
  const stats = [
    {
      icon: <FaUser className="h-6 w-6" />,
      value: data?.totalUsers,
      label: 'Utilisateurs Totals',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      icon: <FaBoxOpen className="h-6 w-6" />,
      value: data?.totalProducts,
      label: 'Total des Produits',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      icon: <FaChartLine className="h-6 w-6" />,
      value: `${data?.totalSales} USD`,
      label: 'Total des Ventes',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      icon: <FaClipboardList className="h-6 w-6" />,
      value: data?.totalOrders,
      label: 'Total des Commandes',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      borderColor: 'border-teal-200',
    },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div dir="ltr" className="p-4 lg:p-8 w-full max-w-[100vw] mx-auto">
      {/* --------------------------------------------------------------------- */}
      {/* Stats — compact and all in one row on desktop */}
      {/* --------------------------------------------------------------------- */}
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
            <div className="min-w-0">
              <div className="text-xs text-gray-600 truncate">{stat.label}</div>
              <div className="text-xl font-bold leading-tight">{stat.value}</div>
            </div>
          </div>
        ))}
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* Revenue Chart */}
      {/* --------------------------------------------------------------------- */}
      <section className="flex flex-col lg:flex-row gap-6 overflow-x-auto">
        <div className="flex-1 bg-white shadow-md rounded-lg border border-gray-200 p-6 min-w-[600px]">
          <div className="font-semibold mb-4 text-lg">Le nombre de commandes par mois</div>
          <div className="flex items-center justify-center bg-gray-50 border-2 border-gray-200 border-dashed rounded-md p-4">
            <RevenueChart />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* Manage Orders (tables + progress) */}
      {/* --------------------------------------------------------------------- */}
      <section className="bg-white shadow-md rounded-lg p-6 mt-6 overflow-x-auto min-w-[600px] border border-gray-200">
        <ManageOrders />
      </section>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
export default Dashboard;
