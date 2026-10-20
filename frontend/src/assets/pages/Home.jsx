import React, { useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, Card, CardContent, CardMedia, Chip, CircularProgress,
  Container, Divider, IconButton, Typography, Snackbar
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StarIcon from "@mui/icons-material/Star";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";
const PRODUCTS_API = `${API_BASE}/api/products/`;
const CATEGORIES_API = `${API_BASE}/api/products/categories/`;

const GOLD = "#c5a04d";
const MAROON = "#390009";
const DARK_MAROON = "#1e0004";
const CREAM = "#fbf8f5";

function readLocalStorage(key, fallback = []) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function resolveImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) return image;
  return `${API_BASE}/${image.replace(/^\/+/, "")}`;
}
function getCategoryPath(category) {
  const value = String(category?.slug || category?.name || "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (value.includes("earring") || value.includes("jhumka")) return "/earrings";
  if (value.includes("necklace") || value.includes("choker")) return "/necklaces";
  if (value.includes("bangle") || value.includes("kada")) return "/bangles";
  if (value.includes("ring") || value.includes("pendant")) return "/rings";
  if (value.includes("bridal") || value.includes("festive")) return "/bridal-festive";
  if (value.includes("offer")) return "/offers";
  if (value.includes("new-arrival")) return "/new-arrivals";
  return `/category/${category?.slug || value}`;
}
function formatPrice(price) { return Number(price || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 }); }

function Home() {
  const navigate = useNavigate();
  const [apiProducts, setApiProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");
  const [activeTrending, setActiveTrending] = useState("All");
  const [wishlist, setWishlist] = useState(() => readLocalStorage("zinoraWishlist"));
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      try {
        setProductsLoading(true); setProductsError("");
        const res = await fetch(PRODUCTS_API);
        if (!res.ok) throw new Error(`Product API ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];
        const normalized = list.filter(p => p.is_active !== false).map((product, index) => ({
          ...product, id: product.id ?? `product-${index}`,
          title: product.name || product.title || "Zinora Jewellery",
          category: product.category_name || (typeof product.category === "string" ? product.category : "Other"),
          price: Number(product.price ?? product.selling_price ?? 0),
          oldPrice: Number(product.original_price ?? product.old_price ?? product.mrp ?? 0),
          image: resolveImageUrl(product.image_url || product.image || product.product_image),
          rating: Number(product.rating || 0), reviews: Number(product.reviews || 0),
          badge: product.is_new_arrival ? "NEW" : product.is_featured ? "FEATURED" : "",
        }));
        if (!cancelled) setApiProducts(normalized);
      } catch (e) { if (!cancelled) setProductsError("Products load nahi ho rahe. Backend check karo."); } finally { if (!cancelled) setProductsLoading(false); }
    };
    fetchProducts(); return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true); setCategoriesError("");
        const res = await fetch(CATEGORIES_API);
        if (!res.ok) throw new Error(`Category API ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];
        const normalized = list.filter(c => c.is_active !== false).map((category, index) => ({
          ...category, id: category.id ?? `category-${index}`,
          title: category.name || category.title || "Jewellery Collection",
          subtitle: category.description || "",
          image: resolveImageUrl(category.image_url || category.image || ""),
          path: getCategoryPath(category),
        }));
        if (!cancelled) setCategories(normalized);
      } catch (e) { if (!cancelled) setCategoriesError("Categories load nahi ho rahi."); } finally { if (!cancelled) setCategoriesLoading(false); }
    };
    fetchCategories(); return () => { cancelled = true; };
  }, []);

  const products = useMemo(() => apiProducts, [apiProducts]);
  const trendingButtons = ["All", "Necklaces", "Earrings", "Bangles", "Rings"];
  const filteredTrending = useMemo(() => {
    if (activeTrending === "All") return products;
    return products.filter(p => String(p.category || "").toLowerCase().includes(activeTrending.toLowerCase().replace("s","")));
  }, [products, activeTrending]);
  const newArrivals = useMemo(() => products.filter(p => p.is_new_arrival), [products]);
  const budgetProducts = useMemo(() => products.filter(p => p.price <= 299), [products]);
  const offerProducts = useMemo(() => products.filter(p => p.oldPrice > p.price && p.price > 0), [products]);

  const showMessage = (message, severity = "success") => setSnackbar({ open: true, message, severity });
  const handleWishlist = (product) => {
    const current = readLocalStorage("zinoraWishlist");
    const exists = current.some(item => String(item.id) === String(product.id));
    const updated = exists ? current.filter(item => String(item.id) !== String(product.id)) : [...current, product];
    localStorage.setItem("zinoraWishlist", JSON.stringify(updated)); setWishlist(updated);
    window.dispatchEvent(new Event("zinoraWishlistUpdated"));
    showMessage(exists ? "Removed from wishlist" : "Added to wishlist ❤️");
  };
  const isWishlisted = (product) => wishlist.some(item => String(item.id) === String(product.id));
  const handleAddToCart = (product) => {
    const cart = readLocalStorage("zinoraCart");
    const idx = cart.findIndex(item => String(item.id) === String(product.id));
    let updated = idx >= 0 ? cart.map((item, i) => i === idx ? { ...item, quantity: Number(item.quantity ?? 1) + 1 } : item) : [...cart, { ...product, quantity: 1 }];
    localStorage.setItem("zinoraCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("zinoraCartUpdated"));
    showMessage("Added to bag 🛍️");
  };

  const ProductCard = ({ product }) => (
    <Card sx={{ height: "100%", border: "1px solid #f2e6e7", borderRadius: 3.5, overflow: "hidden", boxShadow: "0 4px 18px rgba(57,0,9,0.04)", transition: "all .28s", "&:hover": { transform: "translateY(-6px)", boxShadow: "0 14px 35px rgba(57,0,9,0.12)", borderColor: "#e8cbd0" } }}>
      <Box sx={{ position: "relative", bgcolor: "#fdf7f5" }}>
        {product.image ? <CardMedia component="img" image={product.image} alt={product.title} sx={{ height: 240, objectFit: "cover", transition: "transform .4s", ".MuiCard-root:hover &": { transform: "scale(1.05)" } }} /> : <Box sx={{ height: 240, display: "grid", placeItems: "center", color: "#777" }}><Typography variant="body2">No image</Typography></Box>}
        {product.badge && <Chip label={product.badge} size="small" sx={{ position: "absolute", top: 10, left: 10, bgcolor: MAROON, color: "#fed65b", fontWeight: 800, fontSize: 10, borderRadius: 1.5 }} />}
        <IconButton onClick={() => handleWishlist(product)} sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)", width: 36, height: 36, "&:hover": { bgcolor: "#fff" } }}>{isWishlisted(product) ? <FavoriteIcon sx={{ color: "#a20d32", fontSize: 20 }} /> : <FavoriteBorderIcon sx={{ color: "#7a1020", fontSize: 20 }} />}</IconButton>
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.8 }}><StarIcon sx={{ fontSize: 14, color: GOLD }} /><Typography variant="caption" sx={{ fontWeight: 700, color: "#8a6b6e" }}>{product.rating > 0 ? `${product.rating} • ${product.reviews || 10}+ reviews` : "Zinora Collection"}</Typography></Box>
        <Typography sx={{ color: "#281a1a", fontWeight: 800, fontSize: 14, minHeight: 40, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.title}</Typography>
        <Typography variant="caption" sx={{ color: "#8a6b6e", fontSize: 11 }}>{product.category}</Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 1 }}><Typography sx={{ color: MAROON, fontWeight: 900, fontSize: 18 }}>₹{formatPrice(product.price)}</Typography>{product.oldPrice > product.price && <Typography sx={{ color: "#b0a0a0", textDecoration: "line-through", fontSize: 12 }}>₹{formatPrice(product.oldPrice)}</Typography>}</Box>
        <Button fullWidth variant="contained" startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />} onClick={() => handleAddToCart(product)} sx={{ mt: 2, bgcolor: MAROON, borderRadius: 2.5, textTransform: "none", fontWeight: 800, fontSize: 12.5, py: 1.2, "&:hover": { bgcolor: DARK_MAROON } }}>Add to Bag</Button>
      </CardContent>
    </Card>
  );

  const renderProductGrid = (list, emptyMessage) => {
    if (productsLoading) return <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}><CircularProgress sx={{ color: MAROON }} /></Box>;
    if (productsError) return <Alert severity="error" sx={{ my: 2, borderRadius: 2.5 }}>{productsError}</Alert>;
    if (list.length === 0) return <Box sx={{ py: 5, textAlign: "center", bgcolor: "#fff", borderRadius: 3, border: "1px dashed #e8cbd0" }}><Typography sx={{ color: "#8a6b6e" }}>{emptyMessage}</Typography></Box>;
    return <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2.5 }}>{list.map(p => <ProductCard key={p.id} product={p} />)}</Box>;
  };

  return (
    <Box sx={{ bgcolor: CREAM, minHeight: "100vh" }}>
      {/* HERO - PREMIUM */}
      <Box sx={{ background: "radial-gradient(120% 120% at 20% 20%, #6a1020 0%, #390009 60%, #1e0004 100%)", color: "#fff", px: { xs: 2, md: 6 }, py: { xs: 6, md: 9 }, position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, background: "radial-gradient(circle, rgba(254,214,91,0.18), transparent)", borderRadius: "50%" }} />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Chip icon={<VerifiedIcon sx={{ fontSize: 16, color: "#fed65b !important" }} />} label="THE ZINORA COLLECTION • 2026" size="small" sx={{ bgcolor: "rgba(254,214,91,0.15)", color: "#fed65b", border: "1px solid rgba(254,214,91,0.25)", fontWeight: 800, mb: 3, fontSize: 11 }} />
          <Typography sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: { xs: 38, md: 60 }, lineHeight: 1.1, fontWeight: 800 }}>Jewellery That Makes<Box component="span" sx={{ display: "block", fontStyle: "italic", color: "#fed65b" }}>Every Moment Shine</Box></Typography>
          <Typography sx={{ mt: 2.5, maxWidth: 560, color: "#f5dfe2", lineHeight: 1.8, fontSize: 14.5 }}>Discover beautiful jewellery for weddings, celebrations and everyday elegance with Zinora.</Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap" }}>
            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => document.getElementById("zinora-products")?.scrollIntoView({ behavior: "smooth" })} sx={{ bgcolor: "#fed65b", color: "#390009", fontWeight: 900, px: 3.5, py: 1.5, borderRadius: 2.5, textTransform: "none", "&:hover": { bgcolor: "#ffdf7a" } }}>Shop Collection</Button>
            <Button variant="outlined" onClick={() => navigate("/offers")} sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)", borderRadius: 2.5, textTransform: "none", fontWeight: 700 }}>Explore Offers</Button>
          </Box>
        </Container>
      </Box>

      {/* CATEGORY */}
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
        <Typography sx={{ color: GOLD, fontSize: 11, letterSpacing: 2.5, textAlign: "center", fontWeight: 900 }}>EXPLORE OUR COLLECTIONS</Typography>
        <Typography sx={{ fontFamily: "'Playfair Display', Georgia, serif", color: MAROON, fontSize: { xs: 28, md: 38 }, textAlign: "center", mt: 1, fontWeight: 800 }}>Shop by Category</Typography>
        <Typography sx={{ color: "#8a6b6e", textAlign: "center", mt: 1, mb: 4, fontSize: 13 }}>Find the perfect piece for every style and occasion</Typography>
        {categoriesLoading ? <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress sx={{ color: MAROON }} /></Box> : categoriesError ? <Alert severity="error" sx={{ borderRadius: 2.5 }}>{categoriesError}</Alert> : categories.length === 0 ? <Alert severity="info" sx={{ borderRadius: 2.5 }}>No active categories</Alert> : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }, gap: 2.5 }}>
            {categories.map((category) => (
              <Card key={category.id} onClick={() => navigate(category.path)} sx={{ cursor: "pointer", borderRadius: 3.5, border: "1px solid #f0e6e3", overflow: "hidden", transition: "all .25s", "&:hover": { transform: "translateY(-6px)", boxShadow: "0 14px 35px rgba(57,0,9,0.12)" } }}>
                {category.image ? <CardMedia component="img" image={category.image} alt={category.title} sx={{ height: 180, objectFit: "cover" }} /> : <Box sx={{ height: 180, bgcolor: "#fdf7f5", display: "grid", placeItems: "center" }}><Typography fontWeight={700} color="#390009">{category.title}</Typography></Box>}
                <Box sx={{ p: 1.8, textAlign: "center" }}><Typography sx={{ fontSize: 13, fontWeight: 800, color: MAROON }}>{category.title}</Typography></Box>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* TRENDING */}
      <Container id="zinora-products" maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 4 }}>
          <Box><Typography sx={{ color: GOLD, fontSize: 11, letterSpacing: 2.5, fontWeight: 900 }}>CUSTOMER FAVOURITES</Typography><Typography sx={{ fontFamily: "'Playfair Display', Georgia, serif", color: MAROON, fontSize: { xs: 28, md: 36 }, fontWeight: 800 }}>Trending Jewellery</Typography></Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {trendingButtons.map((button) => (
              <Button key={button} onClick={() => setActiveTrending(button)} sx={{ border: "1.5px solid", borderColor: activeTrending === button ? MAROON : "#f0e6e3", borderRadius: 10, px: 2.2, py: 0.8, color: activeTrending === button ? "#fff" : MAROON, bgcolor: activeTrending === button ? MAROON : "#fff", textTransform: "none", fontWeight: 800, fontSize: 12, "&:hover": { bgcolor: activeTrending === button ? DARK_MAROON : "#fdf2f3" } }}>{button}</Button>
            ))}
          </Box>
        </Box>
        {renderProductGrid(filteredTrending, "Is category me koi product nahi hai.")}
        <Box sx={{ textAlign: "center", mt: 4 }}><Button variant="outlined" onClick={() => navigate("/new-arrivals")} endIcon={<ArrowForwardIcon />} sx={{ color: MAROON, borderColor: MAROON, borderRadius: 2.5, px: 4, textTransform: "none", fontWeight: 800 }}>View New Arrivals</Button></Box>
      </Container>

      {/* OFFERS BANNER */}
      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <Box sx={{ background: `linear-gradient(135deg, ${MAROON} 0%, #6a1020 100%)`, color: "#fff", p: { xs: 3, md: 5 }, borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box><Chip label="SPECIAL COLLECTION" sx={{ bgcolor: "#fed65b", color: MAROON, fontWeight: 900, fontSize: 11, mb: 1.5 }} /><Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 26, md: 34 }, fontWeight: 800 }}>Celebrate Every Occasion</Typography><Typography sx={{ color: "#f5dfe2", mt: 1, fontSize: 13 }}>Explore jewellery offers and special prices</Typography></Box>
          <Button variant="contained" onClick={() => navigate("/offers")} endIcon={<ArrowForwardIcon />} sx={{ bgcolor: "#fed65b", color: MAROON, fontWeight: 900, borderRadius: 2.5, px: 3.5, textTransform: "none", "&:hover": { bgcolor: "#ffdf7a" } }}>Explore Offers</Button>
        </Box>
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2.5, fontWeight: 700 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Home;