import React, { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Typography, Button, Grid, Card, CardMedia, IconButton,
  Rating, Chip, Container, Stack
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { Link } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";
const readStorage = (key) => {
  try { const v = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
};
const normalizeProduct = (product) => {
  const image = product.image || product.image_url || product.imageUrl || product.product_image || "";
  const resolvedImage = image && !image.startsWith("http://") && !image.startsWith("https://") && !image.startsWith("data:") ? `${API_BASE}/${image.replace(/^\/+/, "")}` : image;
  const price = Number(product.price ?? product.selling_price ?? 0);
  const oldPrice = Number(product.oldPrice ?? product.old_price ?? product.original_price ?? product.mrp ?? 0);
  const discount = oldPrice > price && oldPrice > 0 ? `${Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF` : product.discount || "";
  return { ...product, id: product.id, name: product.name || product.title || product.product_name || "Zinora Jewellery", description: product.description || "", price, oldPrice, discount, rating: Number(product.rating || 0), reviews: Number(product.reviews || 0), image: resolvedImage };
};

function Wishlist() {
  const [products, setProducts] = useState(() => readStorage("zinoraWishlist").map(normalizeProduct));
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const loadWishlist = useCallback(() => {
    setProducts(readStorage("zinoraWishlist").map(normalizeProduct));
  }, []);

  useEffect(() => {
    loadWishlist();
    const handleFocus = () => loadWishlist();
    const handleVisibility = () => { if (document.visibilityState === "visible") loadWishlist(); };
    const handleStorage = (e) => { if (!e.key || e.key === "zinoraWishlist") loadWishlist(); };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [loadWishlist]);

  const showMessage = (text, type = "success") => { setMessage(text); setMessageType(type); setTimeout(()=>setMessage(""),3000); };
  const removeProduct = (id) => {
    const updated = readStorage("zinoraWishlist").filter((p) => String(p.id) !== String(id));
    localStorage.setItem("zinoraWishlist", JSON.stringify(updated));
    setProducts(updated.map(normalizeProduct));
    window.dispatchEvent(new Event("zinoraWishlistUpdated"));
    showMessage("Removed from wishlist");
  };
  const moveToBag = (product) => {
    try {
      const existingBag = readStorage("zinoraCart");
      const existingIndex = existingBag.findIndex((item) => String(item.id) === String(product.id));
      let updatedBag = existingIndex !== -1 ? existingBag.map((item, index) => index === existingIndex ? { ...item, quantity: Number(item.quantity || 1) + 1 } : item) : [...existingBag, { ...product, quantity: 1 }];
      localStorage.setItem("zinoraCart", JSON.stringify(updatedBag));
      const updatedWishlist = readStorage("zinoraWishlist").filter((item) => String(item.id) !== String(product.id));
      localStorage.setItem("zinoraWishlist", JSON.stringify(updatedWishlist));
      setProducts(updatedWishlist.map(normalizeProduct));
      window.dispatchEvent(new Event("zinoraCartUpdated"));
      window.dispatchEvent(new Event("zinoraWishlistUpdated"));
      showMessage("Added to your bag! 🛍️");
    } catch { showMessage("Unable to update bag", "error"); }
  };

  return (
    <Box sx={{ bgcolor: "#fbf8f5", minHeight: "100vh", pb: 8 }}>
      <Box sx={{ background: "radial-gradient(100% 150% at 20% 30%, #6a1020 0%, #390009 50%, #1e0004 100%)", color: "#fff", py: { xs: 6, md: 8 }, px: 2, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "rgba(254,214,91,0.12)", border: "1px solid rgba(254,214,91,0.25)", px: 2, py: 0.6, borderRadius: 10, mb: 2 }}>
            <FavoriteIcon sx={{ fontSize: 14, color: "#fed65b" }} />
            <Typography sx={{ fontSize: 10, letterSpacing: 2.5, color: "#fed65b", fontWeight: 800 }}>YOUR LOVED COLLECTION</Typography>
          </Box>
          <Typography component="h1" sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: { xs: 36, md: 52 }, fontWeight: 800, lineHeight: 1.1 }}>
            My Wishlist <Box component="span" sx={{ color: "#fed65b", fontStyle: "italic", fontWeight: 600 }}>✦</Box>
          </Typography>
          <Typography sx={{ fontSize: { xs: 13, md: 14 }, color: "#f0dfe0", maxWidth: 520, mx: "auto", lineHeight: 1.8, mt: 1.5 }}>
            Every piece you adored, saved in one royal place. Ready to make them yours?
          </Typography>
          {products.length > 0 && (
            <Chip label={`${products.length} ${products.length === 1 ? "Piece" : "Pieces"} Saved`} sx={{ mt: 2.5, bgcolor: "#fed65b", color: "#390009", fontWeight: 900, fontSize: 12, px: 1 }} />
          )}
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 3.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 3, p: 2, bgcolor: "#fff", borderRadius: 2.5, border: "1px solid #f0e6e3" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 12, color: "#8a6b6e" }}>
            <Typography component={Link} to="/" sx={{ color: "#8a6b6e", textDecoration: "none", fontSize: 12 }}>Home</Typography>
            <Box sx={{ opacity: 0.5 }}>/</Box>
            <Typography sx={{ color: "#390009", fontWeight: 800, fontSize: 12 }}>My Wishlist</Typography>
          </Box>
          {products.length > 0 && (
            <Button component={Link} to="/" endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />} sx={{ color: "#390009", textTransform: "none", fontSize: 12, fontWeight: 800, bgcolor: "#fdf2f3", borderRadius: 2, px: 2, "&:hover": { bgcolor: "#f8e9eb" } }}>
              Continue Shopping
            </Button>
          )}
        </Box>

        {products.length === 0 ? (
          <Box sx={{ bgcolor: "#fff", border: "1px solid #f0e6e3", borderRadius: 4, textAlign: "center", py: { xs: 7, md: 11 }, px: 3 }}>
            <Box sx={{ width: 110, height: 110, borderRadius: "50%", background: "linear-gradient(135deg, #fff5f6, #f8e9eb)", border: "1px solid #f0d6d9", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2.5, position: "relative" }}>
              <FavoriteBorderIcon sx={{ fontSize: 48, color: "#c98a90" }} />
              <Box sx={{ position: "absolute", top: -5, right: -5, bgcolor: "#fed65b", width: 28, height: 28, borderRadius: "50%", display: "grid", placeItems: "center" }}><AutoAwesomeIcon sx={{ fontSize: 16, color: "#390009" }} /></Box>
            </Box>
            <Typography sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 800, color: "#390009" }}>Your Wishlist is Empty</Typography>
            <Typography sx={{ fontSize: 13.5, color: "#8a6b6e", maxWidth: 420, mx: "auto", lineHeight: 1.8, mt: 1.2 }}>
              You haven't saved any sparkle yet. Explore our new arrivals and save the pieces that steal your heart.
            </Typography>
            <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 3.5 }}>
              <Button component={Link} to="/new-arrivals" variant="contained" endIcon={<ArrowForwardIcon />} sx={{ bgcolor: "#390009", color: "#fff", px: 3.5, py: 1.4, borderRadius: 2.5, textTransform: "none", fontSize: 13, fontWeight: 800, "&:hover": { bgcolor: "#5a1020" } }}>Explore New Arrivals</Button>
              <Button component={Link} to="/" variant="outlined" sx={{ borderColor: "#e8d0d2", color: "#390009", px: 3, py: 1.4, borderRadius: 2.5, textTransform: "none", fontSize: 13, fontWeight: 700 }}>Home</Button>
            </Stack>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card sx={{ height: "100%", borderRadius: 3.5, bgcolor: "#fff", border: "1px solid #f2e6e7", boxShadow: "0 4px 18px rgba(57,0,9,0.04)", overflow: "hidden", transition: "all .28s", "&:hover": { transform: "translateY(-6px)", boxShadow: "0 14px 35px rgba(57,0,9,0.12)", borderColor: "#e8cbd0" } }}>
                  <Box sx={{ position: "relative", bgcolor: "#fdf7f5" }}>
                    {product.image ? (
                      <CardMedia component="img" image={product.image} alt={product.name} sx={{ height: 285, objectFit: "contain", p: 1.2 }} />
                    ) : (
                      <Box sx={{ height: 285, display: "grid", placeItems: "center", color: "#bfa3a5" }}><Typography variant="body2">No image</Typography></Box>
                    )}
                    {product.discount && <Chip label={product.discount} size="small" sx={{ position: "absolute", top: 12, left: 12, bgcolor: "#390009", color: "#fed65b", borderRadius: 1.5, fontSize: 10, fontWeight: 900 }} />}
                    <IconButton onClick={() => removeProduct(product.id)} sx={{ position: "absolute", top: 10, right: 10, bgcolor: "rgba(255,255,255,0.9)", width: 36, height: 36, boxShadow: "0 2px 10px rgba(0,0,0,0.08)", "&:hover": { bgcolor: "#fff" } }}><DeleteIcon sx={{ fontSize: 19, color: "#7a1020" }} /></IconButton>
                  </Box>
                  <Box sx={{ p: 2.2 }}>
                    {product.rating > 0 && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1 }}>
                        <Rating value={product.rating} precision={0.1} readOnly size="small" sx={{ fontSize: 14, color: "#c5a059" }} />
                        <Typography sx={{ fontSize: 11, color: "#8a6b6e", fontWeight: 700 }}>{product.rating} ({product.reviews})</Typography>
                      </Box>
                    )}
                    <Typography sx={{ fontSize: 14.5, fontWeight: 800, lineHeight: 1.4, minHeight: 40, color: "#281a1a", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.name}</Typography>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.2, mt: 1.2, mb: 2 }}>
                      <Typography sx={{ fontSize: 20, fontWeight: 900, color: "#390009" }}>₹{product.price.toLocaleString("en-IN")}</Typography>
                      {product.oldPrice > product.price && <Typography sx={{ fontSize: 12, color: "#b0a0a0", textDecoration: "line-through" }}>₹{product.oldPrice.toLocaleString("en-IN")}</Typography>}
                    </Box>
                    <Stack spacing={1}>
                      <Button fullWidth variant="contained" startIcon={<LocalMallIcon sx={{ fontSize: 18 }} />} onClick={() => moveToBag(product)} sx={{ py: 1.3, bgcolor: "#390009", color: "#fff", borderRadius: 2.5, fontSize: 12, fontWeight: 900, textTransform: "uppercase", "&:hover": { bgcolor: "#5a1020" } }}>Add to Bag</Button>
                      <Button fullWidth onClick={() => removeProduct(product.id)} startIcon={<DeleteIcon sx={{ fontSize: 16 }} />} sx={{ color: "#9a7b7d", fontSize: 11, textTransform: "none", fontWeight: 600, py: 0.6, "&:hover": { color: "#7a1020", bgcolor: "#fdf2f3" } }}>Remove</Button>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {message && (
        <Box sx={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 1500, width: { xs: "92%", sm: "auto" }, maxWidth: 420 }}>
          <Alert severity={messageType} onClose={() => setMessage("")} variant="filled" sx={{ borderRadius: 3, boxShadow: "0 8px 25px rgba(0,0,0,0.2)", fontWeight: 700 }}>{message}</Alert>
        </Box>
      )}
    </Box>
  );
}

export default Wishlist;