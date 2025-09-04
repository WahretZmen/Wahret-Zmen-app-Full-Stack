// ManageOrders.jsx
// -----------------------------------------------------------------------------
// Purpose: Wrapper page to render both AdminManageOrders and AdminOrdersProgress
//          components, each in its own styled section.
// -----------------------------------------------------------------------------

import React from "react";

// Internal imports
import AdminManageOrders from "../manageOrders/AdminManageOrders.jsx";
import AdminOrdersProgress from "./AdminOrdersProgress.jsx";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const ManageOrders = () => {
  return (
    <div>
      {/* --------------------------------------------------------------------- */}
      {/* Section 1: Manage Orders (CRUD / Update / Delete) */}
      {/* --------------------------------------------------------------------- */}
      <div className="container mx-auto p-6 overflow-x-auto overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">
          Manage Orders
        </h2>
        <AdminManageOrders />
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Section 2: Manage Orders Progress (per-product tracking) */}
      {/* --------------------------------------------------------------------- */}
      <div className="container mx-auto p-6 overflow-x-auto overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">
          Manage Orders Progress
        </h2>
        <AdminOrdersProgress />
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
export default ManageOrders;
