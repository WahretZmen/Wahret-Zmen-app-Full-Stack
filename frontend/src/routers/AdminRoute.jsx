// src/routes/AdminRoute.jsx
// ============================================================================
// 🔐 AdminRoute
// ----------------------------------------------------------------------------
// Purpose:
//   Protect admin-only routes by verifying JWT presence in localStorage.
//   - If token missing → redirect to /admin (login page)
//   - If token exists → render children or nested <Outlet/>
//
// Notes:
//   - Stateless client-side guard (no token validation here).
//   - Server should still verify token in protected API routes.
// ============================================================================

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const AdminRoute = ({ children }) => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("token");

  // Redirect unauthenticated users
  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  // Render nested admin routes or direct children
  return children ? children : <Outlet />;
};

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
export default AdminRoute;
