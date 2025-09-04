// AdminRoute.jsx
// -----------------------------------------------------------------------------
// Purpose : Protect admin-only routes. Checks for token in localStorage.
//           - If no token → redirect to /admin
//           - If token exists → render children or nested <Outlet/>
// Notes   : Only comments and structure added. No logic/JSX/text changed.
// -----------------------------------------------------------------------------

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const AdminRoute = ({ children }) => {
  // Check token from localStorage (auth check)
  const token = localStorage.getItem("token");

  // Redirect to admin login if missing
  if (!token) {
    return <Navigate to="/admin" />;
  }

  // Render provided children or nested routes
  return children ? children : <Outlet />;
};

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
export default AdminRoute;
