import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Website Layout
import Topbar from "./component/topbar";
import Footer from "./component/Footer";

// Website Pages
import Home from "./assets/pages/Home";
import NewArrivals from "./assets/pages/NewArrivals";
import Necklaces from "./assets/pages/Necklaces";
import Earrings from "./assets/pages/Earrings";
import Rings from "./assets/pages/Rings";
import Bangles from "./assets/pages/Bangles";
import BridalFestive from "./assets/pages/BridalFestive";
import Offers from "./assets/pages/Offers";
import Budget from "./assets/pages/Budget";
import Wishlist from "./assets/pages/Wishlist";
import Profile from "./assets/pages/Profile";
import ChatTrack from "./assets/pages/ChatTrack";

import AdminLogin from "./assets/pages/Admin/AdminLogin";
import CustomerLogin from "./assets/pages/Customer/CustomerLogin";
import Cart from "./assets/pages/Cart";

function App() {
  const location = useLocation();

  // Pages where the common website Topbar and Footer should be hidden.
  // Dashboards can use their own sidebar and header.
  const hideLayoutPaths = [
    "/profile",
    "/admin/login",
    "/customer/login",
    "/admin-dashboard",
    "/customer-dashboard",
  ];

  const hideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <>
      {/* Website Topbar */}
      {!hideLayout && <Topbar />}

      {/* Application Routes */}
      <Routes>
        {/* Main Website */}
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


        {/* Customer Authentication */}
        <Route
          path="/customer/login"
          element={<CustomerLogin />}
        />

        {/* Customer Dashboard */}
        <Route
          path="/customer-dashboard"
          element={<CustomerDashboard />}
        />


        {/* Admin Authentication */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />


        {/* Redirect unknown routes to Home */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;