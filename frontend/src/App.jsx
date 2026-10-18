import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Common Components
import Topbar from "./component/topbar";
import Footer from "./component/Footer";

// Customer Pages
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

// Authentication Pages
import Register from "./assets/pages/Admin/Register";
import Login from "./assets/pages/Customer/Login";

// Admin Pages
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

function App() {
  const location = useLocation();

  // Normalize the URL path
  const pathname = location.pathname.replace(/\/+$/, "") || "/";

  // Hide customer header/footer on authentication and profile pages.
  // Admin dashboard has its own layout.
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

  return (
    <>
      {!hideLayout && <Topbar />}

      <Routes>
        {/* Main website opens at Home */}
<Route
  path="/"
  element={<Navigate to="/register" replace />}
/>
        {/* Customer Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Customer Website Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/necklaces" element={<Necklaces />} />
        <Route path="/earrings" element={<Earrings />} />
        <Route path="/rings" element={<Rings />} />
        <Route path="/bangles" element={<Bangles />} />
        <Route path="/bridal-festive" element={<BridalFestive />} />
        <Route path="/offers" element={<CustomerOffers />} />
        <Route path="/OtherProducts" element={<OtherProducts />} />

        {/* Wishlist, Cart and Customer Account */}
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat-track" element={<ChatTrack />} />

        {/* Admin Dashboard with Nested Pages */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
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
        </Route>

        {/* Old Admin Dashboard URL Redirect */}
        <Route
          path="/admin-dashboard"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* Unknown URLs return to the main website */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;