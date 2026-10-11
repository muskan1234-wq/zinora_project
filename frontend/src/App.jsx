
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Topbar from "./component/topbar";
import Footer from "./component/Footer";

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

function App() {
  const location = useLocation();

  // Hide Topbar and Footer on these pages
  const hideLayout =
    location.pathname === "/profile" ||
    location.pathname === "/admin/login" ||
    location.pathname === "/customer/login";

  return (
    <>
      {!hideLayout && <Topbar />}

      <Routes>
        {/* Customer Website Pages */}
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

        {/* Profile Page */}
        <Route path="/profile" element={<Profile />} />

        {/* Admin Login Page */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Customer Login Page */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default App;
