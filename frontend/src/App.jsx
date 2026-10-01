
import React from "react";
import { Routes, Route } from "react-router-dom";

import Topbar from "./component/topbar";

import Home from "./assets/pages/Home";
import NewArrivals from "./assets/pages/NewArrivals";
import Necklaces from "./assets/pages/Necklaces";
import Earrings from "./assets/pages/Earrings";
import Rings from "./assets/pages/Rings";
import Bangles from "./assets/pages/Bangles";
import BridalFestive from "./assets/pages/BridalFestive";
import Offers from "./assets/pages/Offers";
import Budget from "./assets/pages/Budget";

function App() {
  return (
    <>
      {/* Static Topbar */}
      <Topbar />

      {/* Page Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/necklaces" element={<Necklaces />} />
        <Route path="/earrings" element={<Earrings />} />
        <Route path="/rings" element={<Rings />} />
        <Route path="/bangles" element={<Bangles />} />
        <Route path="/bridal-festive" element={<BridalFestive />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/budget" element={<Budget />} />
      </Routes>
    </>
  );
}

export default App;
