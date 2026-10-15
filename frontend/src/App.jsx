import React from "react";
import {
Routes,
Route,
useLocation,
Navigate,
} from "react-router-dom";

// Website Layout
import Topbar from "./component/topbar";
import Footer from "./component/Footer";

// Customer Website Pages
import Home from "./assets/pages/Home";
import NewArrivals from "./assets/pages/NewArrivals";
import Necklaces from "./assets/pages/Necklaces";
import Earrings from "./assets/pages/Earrings";
import Rings from "./assets/pages/Rings";
import Bangles from "./assets/pages/Bangles";
import BridalFestive from "./assets/pages/BridalFestive";
import Budget from "./assets/pages/Budget";
import Wishlist from "./assets/pages/Wishlist";
import Profile from "./assets/pages/Profile";
import ChatTrack from "./assets/pages/ChatTrack";
import Cart from "./assets/pages/Cart";

// Authentication Pages
import AdminLogin from "./assets/pages/Admin/AdminLogin";
import CustomerLogin from "./assets/pages/Customer/CustomerLogin";

// Dashboard Layouts
import AdminDashboard from "./assets/pages/Admin/AdminDashboard";
import CustomerDashboard from "./assets/pages/Customer/CustomerDashboard";

// Admin Dashboard Pages
import DashboardHome from "./assets/pages/Admin/DashboardHome";
import Products from "./assets/pages/Admin/Products";
import Categories from "./assets/pages/Admin/Categories";
import Customers from "./assets/pages/Admin/Customers";
import Orders from "./assets/pages/Admin/Orders";
import Payments from "./assets/pages/Admin/Payments";
import Offers from "./assets/pages/Admin/Offers";
import Inventory from "./assets/pages/Admin/Inventory";
import Settings from "./assets/pages/Admin/Settings";

function App() {
const location = useLocation();

// Hide the public website's Topbar and Footer
// on authentication and dashboard pages.
const hideLayoutPaths = [
"/profile",
"/admin/login",
"/customer/login",
"/admin-dashboard",
"/customer-dashboard",
];

const hideLayout =
hideLayoutPaths.includes(location.pathname) ||
location.pathname.startsWith("/admin/dashboard");

return (
<>
{!hideLayout && <Topbar />}

```
  <Routes>
    {/* ================= CUSTOMER WEBSITE ================= */}

    <Route path="/" element={<Home />} />

    <Route path="/new-arrivals" element={<NewArrivals />} />

    <Route path="/necklaces" element={<Necklaces />} />

    <Route path="/earrings" element={<Earrings />} />

    <Route path="/rings" element={<Rings />} />

    <Route path="/bangles" element={<Bangles />} />

    <Route path="/bridal-festive" element={<BridalFestive />} />

    <Route path="/offers" element={<Offers />} />

    <Route path="/budget" element={<Budget />} />

    <Route path="/wishlist" element={<Wishlist />} />

    <Route path="/chat-track" element={<ChatTrack />} />

    <Route path="/cart" element={<Cart />} />

    <Route path="/profile" element={<Profile />} />

    {/* ================= CUSTOMER LOGIN ================= */}

    <Route
      path="/customer/login"
      element={<CustomerLogin />}
    />

    {/* ================= CUSTOMER DASHBOARD ================= */}

    <Route
      path="/customer-dashboard"
      element={<CustomerDashboard />}
    />

    {/* ================= ADMIN LOGIN ================= */}

    <Route
      path="/admin/login"
      element={<AdminLogin />}
    />

    {/* ================= ADMIN DASHBOARD ================= */}
    {/* AdminDashboard is the common layout.
        Its sidebar and header remain visible while
        the nested page changes inside <Outlet />. */}

    <Route
      path="/admin/dashboard"
      element={<AdminDashboard />}
    >
      {/* Default page when admin opens the dashboard */}
      <Route
        index
        element={<DashboardHome />}
      />

      {/* Dashboard Home */}
      <Route
        path="home"
        element={<DashboardHome />}
      />

      {/* Products Management */}
      <Route
        path="products"
        element={<Products />}
      />

      {/* Categories Management */}
      <Route
        path="categories"
        element={<Categories />}
      />

      {/* Customers Management */}
      <Route
        path="customers"
        element={<Customers />}
      />

      {/* Orders Management */}
      <Route
        path="orders"
        element={<Orders />}
      />

      {/* Payments Management */}
      <Route
        path="payments"
        element={<Payments />}
      />

      {/* Coupons and Offers Management */}
      <Route
        path="offers"
        element={<Offers />}
      />

      {/* Inventory Management */}
      <Route
        path="inventory"
        element={<Inventory />}
      />

      {/* Admin Settings */}
      <Route
        path="settings"
        element={<Settings />}
      />
    </Route>

    {/* ================= LEGACY ADMIN DASHBOARD URL ================= */}
    {/* Redirect the old URL to the new dashboard route. */}

    <Route
      path="/admin-dashboard"
      element={
        <Navigate
          to="/admin/dashboard"
          replace
        />
      }
    />

    {/* ================= UNKNOWN URL ================= */}

    <Route
      path="*"
      element={
        <Navigate
          to="/"
          replace
        />
      }
    />
  </Routes>

  {!hideLayout && <Footer />}
</>


);
}

export default App;
