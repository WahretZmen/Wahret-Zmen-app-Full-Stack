import React from "react";
import AdminManageOrders from "../manageOrders/AdminManageOrders.jsx";
import AdminOrdersProgress from "./AdminOrdersProgress.jsx";

const ManageOrders = () => {
  return (
    <div>
      {/* AdminManageOrders Section */}
      <div className="container mx-auto p-6 overflow-x-auto overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">Manage Orders</h2>
        <AdminManageOrders />
      </div>

      {/* AdminOrdersProgress Section */}
      <div className="container mx-auto p-6 overflow-x-auto overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">Manage Orders Progress</h2>
        <AdminOrdersProgress />
      </div>
    </div>
  );
};

export default ManageOrders;
