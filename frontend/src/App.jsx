import React from "react";
import {
Routes,
Route,
useLocation,
Navigate,
} from "react-router-dom";

// ================= WEBSITE LAYOUT =================
import Topbar from "./component/topbar";
import Footer from "./component/Footer";

// ================= CUSTOMER WEBSITE PAGES =================
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

// ================= AUTHENTICATION PAGES =================
import Register from "./assets/pages/Admin/Register";
import Login from "./assets/pages/Customer/Login";

// ================= ADMIN DASHBOARD LAYOUT =================
import AdminDashboard from "./assets/pages/Admin/AdminDashboard";

// ================= ADMIN DASHBOARD PAGES =================
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

  // Normalize pathname to handle trailing slashes.
const pathname = location.pathname.replace(/\/+$/, "") || "/";
  const hideLayoutPaths = [
    "/profile",
    "/register",
    "/login",
    "/admin/login",
    "/customer-dashboard",
    "/admin-dashboard",
  ];

  const hideLayout =
    hideLayoutPaths.includes(pathname) ||
    pathname.startsWith("/admin/dashboard");

  return (
    <>
      {!hideLayout && <Topbar />}

      <Routes>
        {/* Customer pages */}
        <Route path="/" element={<Home />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/necklaces" element={<Necklaces />} />
        <Route path="/earrings" element={<Earrings />} />
        <Route path="/rings" element={<Rings />} />
        <Route path="/bangles" element={<Bangles />} />
        <Route path="/bridal-festive" element={<BridalFestive />} />

        {/* Customer Offers page */}
        <Route path="/offers" element={<CustomerOffers />} />

        <Route path="/OtherProducts" element={<OtherProducts />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/chat-track" element={<ChatTrack />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin login */}
<Route path="/admin/login" element={<Login />} />
        {/* Admin dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payments" element={<Payments />} />

          {/* Admin Offers management page */}
          <Route path="offers" element={<AdminOffers />} />

          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Legacy redirect */}
        <Route
          path="/admin-dashboard"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
