// src/routes/PrivateRoute.jsx
// -----------------------------------------------------------------------------
// Purpose: Wrapper for protecting routes that require authentication.
// Features:
//   - Uses AuthContext to check `currentUser` and `loading` state
//   - Shows a loading message while auth state is being resolved
//   - Redirects unauthenticated users to /login
//   - Renders children when authenticated
// Notes:
//   - No functional changes; only organization and comments added.
// -----------------------------------------------------------------------------

import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // While authentication state is being determined
  if (loading) {
    return <div>Loading..</div>;
  }

  // If user is authenticated, render children
  if (currentUser) {
    return children;
  }

  // Otherwise, redirect to login
  return <Navigate to="/login" replace />;
};

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
export default PrivateRoute;
