import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/products/CartPage";
import CheckoutPage from "../pages/products/CheckoutPage";
import SingleProduct from "../pages/products/SingleProduct";
import PrivateRoute from "./PrivateRoute";
import OrderPage from "../pages/products/OrderPage.jsx";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageProducts from "../pages/dashboard/manageProducts/ManageProducts";
import AddProduct from "../pages/dashboard/addProduct/AddProduct";
import UpdateProduct from "../pages/dashboard/EditProduct/UpdateProduct";
import UserDashboard from "../pages/dashboard/users/UserDashboard";
import ProductsPage from "../pages/Products.jsx"
import ContactPage from "../pages/Contact.jsx";
import AboutPage from "../pages/About.jsx";
import UpdateOrder from "../pages/dashboard/EditOrder/UpdateOrder.jsx";
import AddOrder from "../pages/dashboard/addOrder/addOrder.jsx";
import ManageOrders from "../pages/dashboard/manageOrders/manageOrder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/products", element: <ProductsPage /> },
      {
        path: "/orders",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },
      { path: "/about", element: <div><AboutPage/></div> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/contact", element: <ContactPage /> },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
      { path: "/products/:id", element: <SingleProduct /> },
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
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      { path: "", element: <AdminRoute><Dashboard /></AdminRoute> },
      {
        path: "add-new-product",
        element: (
          <AdminRoute>
            <AddProduct />
          </AdminRoute>
        ),
      },
      {
        path: "edit-product/:id",  // Edit product route
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
      {
        path: "manage-orders",
        element: (
          <AdminRoute>
            <ManageOrders/>
          </AdminRoute>
        ),
      },
      {
        path: "add-order",  // Add order route
        element: (
          <AdminRoute>
            <AddOrder />
          </AdminRoute>
        ),
      },
      {
        path: "edit-order/:id", // Edit order route
        element: (
          <AdminRoute>
            <UpdateOrder />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
