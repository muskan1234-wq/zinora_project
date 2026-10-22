import React from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// Common components
import Topbar from "./component/topbar";
import Footer from "./component/Footer";

// Customer pages
import Home from "./assets/pages/Home";
import NewArrivals from "./assets/pages/NewArrivals";
import Necklaces from "./assets/pages/Necklaces";
import Earrings from "./assets/pages/Earrings";
import Rings from "./assets/pages/Rings";
import Bangles from "./assets/pages/Bangles";
import BridalFestive from "./assets/pages/BridalFestive";
import CustomerOffers from "./assets/pages/Offers";
import OtherProducts from "./assets/pages/Admin/OtherProducts";
import Wishlist from "./assets/pages/Wishlist";
import Profile from "./assets/pages/Profile";
import ChatTrack from "./assets/pages/ChatTrack";
import Cart from "./assets/pages/Cart";
import Checkout from "./assets/pages/Checkout";
import OrderSuccess from "./assets/pages/OrderSuccess";

// Authentication pages
import Register from "./assets/pages/Admin/Register";
import Login from "./assets/pages/Customer/Login";
import Notifications from "./assets/pages/Admin/Notifications";

// Admin pages
import AdminDashboard from "./assets/pages/Admin/AdminDashboard";
import DashboardHome from "./assets/pages/Admin/DashboardHome";
import Products from "./assets/pages/Admin/Products";
import Categories from "./assets/pages/Admin/Categories";
import Customers from "./assets/pages/Admin/Customers";
import Orders from "./assets/pages/Admin/Orders";
import Payments from "./assets/pages/Admin/Payments";
import AdminOffers from "./assets/pages/Admin/Offers";
import Inventory from "./assets/pages/Admin/Inventory";
import Settings from "./assets/pages/Admin/Settings";

const getCustomerToken = () =>
  localStorage.getItem("zinoraCustomerToken") ||
  (localStorage.getItem("zinoraRole") === "CUSTOMER"
    ? localStorage.getItem("zinoraToken")
    : null);

const getAdminToken = () =>
  localStorage.getItem("zinoraAdminToken") ||
  (localStorage.getItem("zinoraRole") === "ADMIN"
    ? localStorage.getItem("zinoraToken")
    : null);

function CustomerRoute({ children }) {
  const location = useLocation();
  const role =
    localStorage.getItem("zinoraCustomerRole") ||
    localStorage.getItem("zinoraRole");

  if (!getCustomerToken() || role !== "CUSTOMER") {
    return (
      <Navigate
        to="/register"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

function AdminRoute({ children }) {
  const role =
    localStorage.getItem("zinoraAdminRole") ||
    localStorage.getItem("zinoraRole");

  if (!getAdminToken() || role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  const role = localStorage.getItem("zinoraRole");

  const hideLayoutPaths = [
    "/register",
    "/login",
    "/admin/login",
    "/profile",
    "/customer-dashboard",
    "/admin-dashboard",
  ];

  const isAdminPage = pathname.startsWith("/admin/dashboard");
  const hideLayout = hideLayoutPaths.includes(pathname) || isAdminPage;

  const initialRoute = () => {
    if (role === "CUSTOMER" && getCustomerToken()) return "/home";
    if (role === "ADMIN" && getAdminToken()) return "/admin/dashboard";
    return "/register";
  };

  return (
    <>
      {!hideLayout && <Topbar />}

      <Routes>
        {/* First visit: register. Existing authenticated users go to their dashboard. */}
        <Route
          path="/"
          element={<Navigate to={initialRoute()} replace />}
        />

        {/* Customer authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Public storefront preview for the admin dashboard button.
            Keep this OUTSIDE CustomerRoute so admin can view the storefront. */}
        <Route path="/store" element={<Home />} />

        {/* Customer website pages */}
        <Route
          path="/home"
          element={
            <CustomerRoute>
              <Home />
            </CustomerRoute>
          }
        />
        <Route
          path="/new-arrivals"
          element={
            <CustomerRoute>
              <NewArrivals />
            </CustomerRoute>
          }
        />
        <Route
          path="/necklaces"
          element={
            <CustomerRoute>
              <Necklaces />
            </CustomerRoute>
          }
        />
        <Route
          path="/earrings"
          element={
            <CustomerRoute>
              <Earrings />
            </CustomerRoute>
          }
        />
        <Route
          path="/rings"
          element={
            <CustomerRoute>
              <Rings />
            </CustomerRoute>
          }
        />
        <Route
          path="/bangles"
          element={
            <CustomerRoute>
              <Bangles />
            </CustomerRoute>
          }
        />
        <Route
          path="/bridal-festive"
          element={
            <CustomerRoute>
              <BridalFestive />
            </CustomerRoute>
          }
        />
        <Route
          path="/offers"
          element={
            <CustomerRoute>
              <CustomerOffers />
            </CustomerRoute>
          }
        />
        <Route
          path="/OtherProducts"
          element={
            <CustomerRoute>
              <OtherProducts />
            </CustomerRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <CustomerRoute>
              <Wishlist />
            </CustomerRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <CustomerRoute>
              <Cart />
            </CustomerRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <CustomerRoute>
              <Profile />
            </CustomerRoute>
          }
        />
        <Route
          path="/chat-track"
          element={
            <CustomerRoute>
              <ChatTrack />
            </CustomerRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <CustomerRoute>
              <Checkout />
            </CustomerRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <CustomerRoute>
              <OrderSuccess />
            </CustomerRoute>
          }
        />

        {/* Admin authentication and dashboard */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payments" element={<Payments />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Legacy admin dashboard URL */}
        <Route
          path="/admin-dashboard"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* Unknown paths go to the correct starting page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
