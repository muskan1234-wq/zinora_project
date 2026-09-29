
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Topbar from "./component/topbar.jsx";
import Footer from "./component/footer.jsx";

import Wishlist from "./assets/pages/Wishlist.jsx";
import Cart from "./assets/pages/Cart.jsx";

import AdminLogin from "./assets/pages/Admin/AdminLogin.jsx";
import CustomerLogin from "./assets/pages/Customer/CustomerLogin.jsx";
function App() {
  return (
    <BrowserRouter>
      <Topbar />

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={
            <h1 style={{ padding: "30px" }}>
              Home Page
            </h1>
          }
        />

        {/* New Arrivals */}
        <Route
          path="/new-arrivals"
          element={
            <h1 style={{ padding: "30px" }}>
              New Arrivals Page
            </h1>
          }
        />

        {/* Necklaces */}
        <Route
          path="/necklaces"
          element={
            <h1 style={{ padding: "30px" }}>
              Necklaces & Chokers Page
            </h1>
          }
        />

        {/* Earrings */}
        <Route
          path="/earrings"
          element={
            <h1 style={{ padding: "30px" }}>
              Earrings & Jhumkas Page
            </h1>
          }
        />

        {/* Bangles */}
        <Route
          path="/bangles"
          element={
            <h1 style={{ padding: "30px" }}>
              Bangles & Kadas Page
            </h1>
          }
        />

        {/* Rings */}
        <Route
          path="/rings"
          element={
            <h1 style={{ padding: "30px" }}>
              Rings & Pendants Page
            </h1>
          }
        />

        {/* Bridal & Festive */}
        <Route
          path="/bridal-festive"
          element={
            <h1 style={{ padding: "30px" }}>
              Bridal & Festive Page
            </h1>
          }
        />

        {/* Under ₹199 / ₹299 */}
        <Route
          path="/under-199-299"
          element={
            <h1 style={{ padding: "30px" }}>
              Under ₹199 / ₹299 Page
            </h1>
          }
        />

        {/* Offers */}
        <Route
          path="/offers"
          element={
            <h1 style={{ padding: "30px" }}>
              Offers Page
            </h1>
          }
        />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Customer Login */}
        <Route
  path="/customer-login"
  element={<CustomerLogin />}
/>

        {/* Admin Login */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
