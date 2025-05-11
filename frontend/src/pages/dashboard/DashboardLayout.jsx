import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaPlusCircle, FaTools, FaBars, FaSignOutAlt } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import HomeIcone from "../../../public/fav-icon.png";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté du panneau d'administration.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B5C3E",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, Déconnectez-moi !",
    });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      Swal.fire({
        title: "Déconnecté ",
        text: "La session administrateur a été terminée avec succès",
        icon: "success",
        confirmButtonColor: "#8B5C3E",
        timer: 2000,
      });
      navigate("/");
    }
  };


  useEffect(() => {
    // ✅ Force LTR when inside /dashboard route
    document.documentElement.dir = "ltr";
  
    // ✅ Optional: Reset on unmount (if user leaves dashboard)
    return () => {
      const savedLang = localStorage.getItem("language");
      if (savedLang === "ar") {
        document.documentElement.dir = "rtl";
      } else {
        document.documentElement.dir = "ltr";
      }
    };
  }, []);

  return (
    <section dir="ltr" className="flex min-h-screen bg-gray-100 overflow-hidden">
      <Helmet>
        <title>Votre Tableau de Bord Administrateur</title>
      </Helmet>

      {/* Mobile Sidebar Toggle */}
      <button 
  className="md:hidden p-3 bg-[#8B5C3E] text-white fixed top-4 left-4 z-50 shadow-lg w-12 h-12 flex items-center justify-center rounded-lg"
  onClick={() => setSidebarOpen(!sidebarOpen)}
>
  <FaBars className="h-6 w-6" />
</button>

      {/* Sidebar */}
      <aside className={`fixed md:relative md:flex flex-col bg-gray-800 text-white min-h-screen w-14 p-2 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40 shadow-lg`}>
        <div className="flex flex-col items-center space-y-4">
          <Link to="/" className="flex items-center justify-center h-14 w-full bg-white hover:bg-gray-100 transition-all rounded-lg mt-24 shadow-sm">
            <img src={HomeIcone} alt="Home" className="h-8 w-8 object-contain rounded" />
          </Link>
        </div>

        <nav className="flex flex-col mt-4 space-y-2 items-center flex-grow">
          <Link to="/dashboard" className="flex items-center justify-center p-2 w-full bg-[#8B5C3E] rounded-lg text-white hover:bg-[#74452D] transition-all">
            <FaTachometerAlt className="h-4 w-4" />
          </Link>
          <Link to="/dashboard/add-new-product" className="flex items-center justify-center p-2 w-full text-gray-300 hover:text-white hover:bg-[#8B5C3E] rounded-lg transition-all">
            <FaPlusCircle className="h-4 w-4" />
          </Link>
          <Link to="/dashboard/manage-products" className="flex items-center justify-center p-2 w-full text-gray-300 hover:text-white hover:bg-[#8B5C3E] rounded-lg transition-all">
            <MdProductionQuantityLimits className="h-4 w-4" />
          </Link>
        </nav>

        <div className="p-2 flex justify-center mt-auto">
          <button 
            onClick={handleLogout} 
            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center justify-center"
          >
            <FaSignOutAlt className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow text-gray-800 overflow-auto ">
      <header className="bg-white shadow-md py-4 px-6 flex flex-col gap-4 md:flex-row md:justify-between items-center sticky top-0 z-30 w-full">
  <h1 className="text-2xl font-semibold text-[#8B5C3E] w-full text-center md:text-left">
    Tableau de Bord
  </h1>

  <div className="flex flex-col gap-4 w-full md:flex-row md:items-center md:justify-end">
    <Link to="/dashboard/add-new-product" className="w-full md:w-auto">
      <button className="flex items-center justify-center w-full px-6 py-3 h-14 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all">
        <FaPlusCircle className="h-5 w-5 mr-2" />
        Ajouter un Produit
      </button>
    </Link>
    <Link to="/dashboard/manage-products" className="w-full md:w-auto">
      <button className="flex items-center justify-center w-full px-6 py-3 h-14 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all">
        <FaTools className="h-5 w-5 mr-2" />
        Gérer les Produits
      </button>
    </Link>
    <button 
      onClick={handleLogout}
      className="flex items-center justify-center w-full px-6 py-3 h-14 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all md:w-auto"
    >
      <FaSignOutAlt className="h-5 w-5 mr-2" />
      Se Déconnecter
    </button>
  </div>
</header>





        <main className="p-6 sm:p-8 space-y-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardLayout;
