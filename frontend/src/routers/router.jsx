// src/routes/router.jsx
// -----------------------------------------------------------------------------
// Purpose: Central routing configuration for the app using React Router v6+.
// Features:
//   - Public pages: home, products, about, contact, login/register
//   - Protected routes via PrivateRoute (orders, checkout, user dashboard)
//   - Admin routes protected via AdminRoute
//   - Includes password auth flows: forgot, reset, change
// Notes:
//   - No functional changes; only organization and comments added.
// -----------------------------------------------------------------------------

import { createBrowserRouter } from "react-router-dom";

// Core App
import App from "../App";

// Public Pages
import Home from "../pages/home/Home";
import ProductsPage from "../pages/Products.jsx";
import AboutPage from "../pages/About.jsx";
import ContactPage from "../pages/Contact.jsx";
import SingleProduct from "../pages/products/SingleProduct";

// Auth (User)
import Login from "../components/Login";
import Register from "../components/Register";
import ForgotPassword from "../pages/products/ForgotPassword.jsx";
import ResetPassword from "../pages/products/ResetPassword.jsx";
import ChangePassword from "../pages/products/ChangePassword.jsx";

// Cart & Orders (User)
import CartPage from "../pages/products/CartPage";
import CheckoutPage from "../pages/products/CheckoutPage";
import OrderPage from "../pages/products/OrderPage.jsx";
import UserDashboard from "../pages/dashboard/users/UserDashboard";

// Auth Guards
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// Admin Pages
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageProducts from "../pages/dashboard/manageProducts/ManageProducts";
import AddProduct from "../pages/dashboard/addProduct/AddProduct";
import UpdateProduct from "../pages/dashboard/EditProduct/UpdateProduct";
import ManageOrders from "../pages/dashboard/manageOrders/manageOrder";
import AddOrder from "../pages/dashboard/addOrder/addOrder.jsx";
import UpdateOrder from "../pages/dashboard/EditOrder/UpdateOrder.jsx";

// -----------------------------------------------------------------------------
// Router Definition
// -----------------------------------------------------------------------------
const router = createBrowserRouter([
  // ---------------------------------------------------------------------------
  // Public + User Routes
  // ---------------------------------------------------------------------------
  {
    path: "/",
    element: <App />,
    children: [
      // Public pages
      { path: "/", element: <Home /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/about", element: <div><AboutPage /></div> },
      { path: "/contact", element: <ContactPage /> },

      // Auth pages
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },

      // Change password (protected)
      {
        path: "/change-password",
        element: (
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        ),
      },

      // Cart + Checkout
      { path: "/cart", element: <CartPage /> },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },

      // Orders (protected)
      {
        path: "/orders",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },

      // Single Product
      { path: "/products/:id", element: <SingleProduct /> },

      // User Dashboard (protected)
      {
        path: "/user-dashboard",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Admin Routes
  // ---------------------------------------------------------------------------

  // Admin login (public)
  {
    path: "/admin",
    element: <AdminLogin />,
  },

  // Admin dashboard (protected via AdminRoute)
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      // Dashboard home
      { path: "", element: <AdminRoute><Dashboard /></AdminRoute> },

      // Products management
      {
        path: "add-new-product",
        element: (
          <AdminRoute>
            <AddProduct />
          </AdminRoute>
        ),
      },
      {
        path: "edit-product/:id",
        element: (
          <AdminRoute>
            <UpdateProduct />
          </AdminRoute>
        ),
      },
      {
        path: "manage-products",
        element: (
          <AdminRoute>
            <ManageProducts />
          </AdminRoute>
        ),
      },

      // Orders management
      {
        path: "manage-orders",
        element: (
          <AdminRoute>
            <ManageOrders />
          </AdminRoute>
        ),
      },
      {
        path: "add-order",
        element: (
          <AdminRoute>
            <AddOrder />
          </AdminRoute>
        ),
      },
      {
        path: "edit-order/:id",
        element: (
          <AdminRoute>
            <UpdateOrder />
          </AdminRoute>
        ),
      },
    ],
  },
]);

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
export default router;
