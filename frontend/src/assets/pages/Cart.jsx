import React, { useEffect, useState } from "react";
import {
  Box, Container, Typography, Button, IconButton, Divider, Paper, Grid, Chip, Stack, Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";
const CART_KEY = "zinoraCart";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) return image;
  return `${API_BASE}/${image.replace(/^\/+/, "")}`;
};
const normalizeCartItem = (item) => ({
  ...item, id: item.id, name: item.name || item.title || "Jewellery Product",
  category: item.category_name || (typeof item.category === "string" ? item.category : "") || "Jewellery",
  price: Number(item.price || 0), quantity: Math.max(1, Number(item.quantity || 1)),
  image: getImageUrl(item.image || item.image_url || ""),
});
const readCart = () => {
  try { const c = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); return Array.isArray(c) ? c.map(normalizeCartItem) : []; } catch { return []; }
};

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(readCart);

  useEffect(() => {
    const loadCart = () => setCartItems(readCart());
    window.addEventListener("storage", loadCart);
    window.addEventListener("focus", loadCart);
    window.addEventListener("zinoraCartUpdated", loadCart);
    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("focus", loadCart);
      window.removeEventListener("zinoraCartUpdated", loadCart);
    };
  }, []);

  const saveCart = (updatedCart) => {
    const normalizedCart = updatedCart.map(normalizeCartItem);
    localStorage.setItem(CART_KEY, JSON.stringify(normalizedCart));
    setCartItems(normalizedCart);
    window.dispatchEvent(new Event("zinoraCartUpdated"));
  };
  const updateQuantity = (id, change) => {
    const updatedCart = cartItems.map((item) => String(item.id) !== String(id) ? item : { ...item, quantity: Number(item.quantity || 1) + change }).filter((item) => item.quantity > 0);
    saveCart(updatedCart);
  };
  const removeItem = (id) => saveCart(cartItems.filter((item) => String(item.id) !== String(id)));

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box sx={{ bgcolor: "#fbf8f5", minHeight: "100vh", py: { xs: 3, md: 4 } }}>
      <Container maxWidth="xl">
        {/* HEADER - ROYAL */}
        <Box sx={{ textAlign: "center", mb: 4, p: 3.5, borderRadius: 4, background: "radial-gradient(100% 150% at 30% 20%, #6a1020 0%, #390009 60%, #1e0004 100%)", color: "#fff", position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", top: -40, right: "10%", width: 180, height: 180, background: "radial-gradient(circle, rgba(254,214,91,0.18), transparent)", borderRadius: "50%" }} />
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "rgba(254,214,91,0.12)", border: "1px solid rgba(254,214,91,0.25)", px: 2, py: 0.5, borderRadius: 10, mb: 1.5 }}>
              <LocalMallIcon sx={{ fontSize: 14, color: "#fed65b" }} />
              <Typography sx={{ color: "#fed65b", letterSpacing: 2.5, fontSize: 10, fontWeight: 800 }}>YOUR COLLECTION</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, fontSize: { xs: 32, md: 44 }, lineHeight: 1.1 }}>
              Shopping Bag <Box component="span" sx={{ color: "#fed65b", fontStyle: "italic" }}>✦</Box>
            </Typography>
            <Typography sx={{ color: "#f0dfe0", mt: 1, fontSize: 13 }}>
              {totalItems} {totalItems === 1 ? "item" : "items"} • Crafted for you with love
            </Typography>
          </Box>
        </Box>

        {cartItems.length === 0 ? (
          <Paper elevation={0} sx={{ textAlign: "center", py: 9, px: 3, border: "1px solid #f0e6e3", borderRadius: 4, bgcolor: "#fff" }}>
            <Box sx={{ width: 90, height: 90, borderRadius: "50%", bgcolor: "#fdf2f3", border: "1px solid #f0d6d9", display: "grid", placeItems: "center", mx: "auto", mb: 2.5 }}>
              <ShoppingBagOutlinedIcon sx={{ fontSize: 42, color: "#c98a90" }} />
            </Box>
            <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, color: "#390009", mb: 1 }}>Your bag is waiting for sparkle</Typography>
            <Typography sx={{ color: "#8a6b6e", mb: 3, fontSize: 13.5 }}>Explore our royal jewellery collection and add your favourites.</Typography>
            <Button variant="contained" onClick={() => navigate("/")} sx={{ bgcolor: "#390009", px: 4, py: 1.4, borderRadius: 2.5, textTransform: "none", fontWeight: 800, "&:hover": { bgcolor: "#5a1020" } }}>Continue Shopping</Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* LEFT - ITEMS */}
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ border: "1px solid #f0e6e3", borderRadius: 3.5, overflow: "hidden", bgcolor: "#fff" }}>
                <Box sx={{ p: { xs: 2.2, md: 3 }, borderBottom: "1px solid #f6ecea", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: "'Playfair Display', Georgia, serif", color: "#390009", fontSize: 18 }}>Your Selected Pieces</Typography>
                  <Chip label={`${totalItems} Items`} size="small" sx={{ bgcolor: "#fdf2f3", color: "#390009", fontWeight: 800, border: "1px solid #f0d6d9" }} />
                </Box>
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  {cartItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <Divider sx={{ my: 3, borderColor: "#f6ecea" }} />}
                      <Grid container spacing={2.5} alignItems="center">
                        <Grid item xs={4} sm={3}>
                          <Box sx={{ position: "relative", borderRadius: 2.5, overflow: "hidden", bgcolor: "#fdf7f5", border: "1px solid #f6ecea" }}>
                            {item.image ? (
                              <Box component="img" src={item.image} alt={item.name} onError={(e) => e.currentTarget.style.visibility = "hidden"} sx={{ display: "block", width: "100%", height: { xs: 120, sm: 165 }, objectFit: "cover" }} />
                            ) : (
                              <Box sx={{ height: { xs: 120, sm: 165 }, display: "grid", placeItems: "center" }}><ShoppingBagOutlinedIcon sx={{ fontSize: 36, color: "#c5a38d" }} /></Box>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={8} sm={9}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5, alignItems: "flex-start" }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Chip label={item.category} size="small" sx={{ bgcolor: "#fff8e1", color: "#8a6a1a", border: "1px solid #f0d6a0", fontWeight: 700, fontSize: 10, height: 22, mb: 1 }} />
                              <Typography sx={{ fontWeight: 800, fontSize: { xs: 14, sm: 16 }, color: "#281a1a", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.name}</Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                                <Typography sx={{ color: "#390009", fontWeight: 900, fontSize: 18 }}>₹{item.price.toLocaleString("en-IN")}</Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#2e7d32", fontSize: 11, fontWeight: 700 }}><VerifiedIcon sx={{ fontSize: 14 }} /> In Stock</Box>
                              </Box>
                            </Box>
                            <IconButton onClick={() => removeItem(item.id)} sx={{ bgcolor: "#fdf2f3", width: 36, height: 36, border: "1px solid #f0d6d9", "&:hover": { bgcolor: "#f8e0e2" } }}><DeleteIcon sx={{ fontSize: 18, color: "#7a1020" }} /></IconButton>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", mt: 2.2, gap: 2, flexWrap: "wrap" }}>
                            <Box sx={{ display: "flex", alignItems: "center", border: "1.5px solid #e8d5d7", borderRadius: 2.5, overflow: "hidden", bgcolor: "#fff" }}>
                              <IconButton size="small" onClick={() => updateQuantity(item.id, -1)} sx={{ borderRadius: 0, px: 1.5, "&:hover": { bgcolor: "#fdf2f3" } }}><RemoveIcon fontSize="small" sx={{ color: "#390009" }} /></IconButton>
                              <Typography sx={{ minWidth: 32, textAlign: "center", fontWeight: 900, color: "#390009", fontSize: 14 }}>{item.quantity}</Typography>
                              <IconButton size="small" onClick={() => updateQuantity(item.id, 1)} sx={{ borderRadius: 0, px: 1.5, "&:hover": { bgcolor: "#fdf2f3" } }}><AddIcon fontSize="small" sx={{ color: "#390009" }} /></IconButton>
                            </Box>
                            <Typography sx={{ ml: "auto", fontWeight: 900, fontSize: 15, color: "#281a1a" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Box>
              </Paper>
              <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")} sx={{ mt: 2.2, color: "#390009", textTransform: "none", fontWeight: 800, bgcolor: "#fff", border: "1px solid #f0e6e3", borderRadius: 2.5, px: 2.5, py: 1, "&:hover": { bgcolor: "#fdf2f3" } }}>Continue Shopping</Button>
            </Grid>

            {/* RIGHT - SUMMARY */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, border: "1px solid #f0e6e3", borderRadius: 3.5, position: { md: "sticky" }, top: 20, bgcolor: "#fff", boxShadow: "0 6px 24px rgba(57,0,9,0.04)" }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, fontFamily: "'Playfair Display', Georgia, serif", color: "#390009" }}>Order Summary</Typography>
                <Stack spacing={1.8}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography sx={{ color: "#8a6b6e", fontSize: 13.5 }}>Subtotal ({totalItems} items)</Typography><Typography sx={{ fontWeight: 800, fontSize: 14 }}>₹{subtotal.toLocaleString("en-IN")}</Typography></Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography sx={{ color: "#8a6b6e", fontSize: 13.5 }}>Shipping</Typography><Typography sx={{ color: shipping === 0 ? "#2e7d32" : "#281a1a", fontWeight: 800, fontSize: 13.5 }}>{shipping === 0 ? "FREE" : `₹${shipping}`}</Typography></Box>
                </Stack>
                <Divider sx={{ my: 2.5, borderColor: "#f6ecea" }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}><Typography sx={{ fontWeight: 900, fontSize: 16, color: "#281a1a" }}>Total Amount</Typography><Typography sx={{ fontWeight: 900, color: "#390009", fontSize: 22 }}>₹{total.toLocaleString("en-IN")}</Typography></Box>

                {subtotal > 0 && subtotal < 999 && (
                  <Box sx={{ bgcolor: "#fff8e1", border: "1px solid #f0d6a0", p: 1.8, borderRadius: 2.5, mb: 2 }}>
                    <Typography sx={{ fontSize: 12, color: "#7a5a1a", lineHeight: 1.6, fontWeight: 600 }}>Add ₹{(999 - subtotal).toLocaleString("en-IN")} more for <Box component="span" sx={{ fontWeight: 900 }}>FREE shipping</Box> 🚚</Typography>
                    <Box sx={{ mt: 1.2, height: 6, bgcolor: "#f0e0a0", borderRadius: 10, overflow: "hidden" }}><Box sx={{ width: `${(subtotal / 999) * 100}%`, height: "100%", bgcolor: "#c5a059", borderRadius: 10 }} /></Box>
                  </Box>
                )}
                {subtotal >= 999 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, bgcolor: "#e8f5e9", border: "1px solid #a5d6a7", p: 1.6, borderRadius: 2.5, mb: 2 }}>
                    <LocalShippingOutlinedIcon sx={{ color: "#2e7d32", fontSize: 20 }} />
                    <Typography sx={{ fontSize: 12.5, color: "#2e7d32", fontWeight: 800 }}>Yay! You got FREE shipping</Typography>
                  </Box>
                )}

                <Button fullWidth variant="contained" disabled={cartItems.length === 0} onClick={() => navigate("/checkout")} endIcon={<LockOutlinedIcon sx={{ fontSize: 18 }} />} sx={{ mt: 1, py: 1.6, bgcolor: "#390009", fontWeight: 900, textTransform: "none", fontSize: 14, borderRadius: 2.5, letterSpacing: 0.3, "&:hover": { bgcolor: "#5a1020" }, "&.Mui-disabled": { bgcolor: "#e8d5d7", color: "#fff" } }}>Proceed to Checkout</Button>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 2.5 }}><LockOutlinedIcon sx={{ fontSize: 15, color: "#9a8a8b" }} /><Typography sx={{ color: "#9a8a8b", fontSize: 11, fontWeight: 600 }}>100% Secure Checkout • SSL Encrypted</Typography></Box>
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}><Chip label="COD Available" size="small" sx={{ fontSize: 10, height: 22, bgcolor: "#fdf2f3", border: "1px solid #f0d6d9" }} /><Chip label="Easy Returns" size="small" sx={{ fontSize: 10, height: 22, bgcolor: "#fdf2f3", border: "1px solid #f0d6d9" }} /><Chip label="Premium Box" size="small" sx={{ fontSize: 10, height: 22, bgcolor: "#fff8e1", border: "1px solid #f0d6a0" }} /></Stack>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Cart;