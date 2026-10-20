import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert, Box, Button, Checkbox, Chip, CircularProgress, Container,
  FormControl, IconButton, MenuItem, Select, Typography, Paper,
} from "@mui/material";
import {
  Favorite, FavoriteBorder, LocalMallOutlined, ShoppingCartOutlined, Tune, Refresh,
} from "@mui/icons-material";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const PRODUCTS_API = `${API_BASE}/api/products/`;

const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
const getImageUrl = (value) => {
  if (!value) return "";
  if (typeof value === "object") value = value.url || value.image_url || value.image || "";
  if (!value) return "";
  if (/^(https?:\/\/|data:|blob:)/i.test(value)) return value;
  return `${API_BASE}/${String(value).replace(/^\/+/, "")}`;
};
const getText = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object") return v.name || v.title || v.category_name || "";
  return "";
};
const getArray = (data) => (Array.isArray(data) ? data : data?.results || data?.data || []);

export default function Rings() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("zinoraWishlist") || "[]").map((i) => String(i.id)); } catch { return []; }
  });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [openFilter, setOpenFilter] = useState("type");
  const [sort, setSort] = useState("Newest First");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(PRODUCTS_API);
      if (!res.ok) throw new Error(`API Error (${res.status})`);
      const data = await res.json();
      const all = getArray(data).map((item) => ({
        id: item.id, 
        name: getText(item.name) || "Ring", 
        price: Number(item.price || 0),
        img: getImageUrl(item.image || item.image_url), 
        cat: getText(item.category_name || item.category || item.category?.name || ""),
        style: getText(item.style || ""),
        createdAt: item.created_at ? new Date(item.created_at).getTime() : 0, 
        badge: "NEW",
      }));

      // ✅ FINAL CORRECT FILTER - Rings + Pendants ONLY, No Earrings
      const ringsOnly = all.filter(p => {
        const cat = (p.cat || "").toLowerCase().trim();
        const name = (p.name || "").toLowerCase();
        const style = (p.style || "").toLowerCase();
        const combined = `${cat} ${name} ${style}`;

        // STEP 1: Earrings, Bangles, Necklace ko pehle hi hata do
        if (combined.includes("earring") || combined.includes("jhumka") || combined.includes("chandbali") || combined.includes("bali") && combined.includes("ear")) {
          return false;
        }
        if (combined.includes("bangle") || combined.includes("chooda") || combined.includes("chood") || combined.includes("kangan")) {
          return false;
        }
        if (combined.includes("necklace") || combined.includes("choker") || combined.includes("haram") || combined.includes("haar") && !combined.includes("pendant")) {
          return false;
        }

        // STEP 2: Sirf Rings aur Pendants allow karo
        const isRingCategory = cat === "ring" || cat === "rings" || cat === "ring set" || cat.startsWith("ring ") || cat.endsWith(" ring");
        const isPendantCategory = cat === "pendant" || cat === "pendants";
        
        const isRingProduct = name.includes("ring") && !name.includes("earring");
        const isPendantProduct = combined.includes("pendant");

        return isRingCategory || isPendantCategory || isRingProduct || isPendantProduct;
      });

      setProducts(ringsOnly);
      setPage(1);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const jewelleryTypes = ["Gold Ring","Silver Ring","Pendant Ring","Adjustable","Couple Rings","Temple","Statement"];
  const toggleType = (type) => setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  const togglePrice = (val) => setSelectedPrice(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  const clearFilters = () => { setSelectedTypes([]); setSelectedPrice([]); setSort("Newest First"); setPage(1); };

  const filtered = useMemo(() => {
    let result = products.filter(p => {
      const typeMatch = selectedTypes.length === 0 || selectedTypes.some(t => (p.style + " " + p.cat + " " + p.name).toLowerCase().includes(t.toLowerCase().split(" ")[0]));
      const priceMatch = selectedPrice.length === 0 || selectedPrice.some(r => {
        if (r === "under199") return p.price < 199; if (r === "199to499") return p.price >= 199 && p.price <= 499;
        if (r === "500to999") return p.price >= 500 && p.price <= 999; if (r === "1000plus") return p.price >= 1000; return true;
      });
      return typeMatch && priceMatch;
    });
    if (sort === "Price Low-High") result.sort((a,b) => a.price - b.price);
    else if (sort === "Price High-Low") result.sort((a,b) => b.price - a.price);
    else result.sort((a,b) => b.createdAt - a.createdAt);
    return result;
  }, [products, selectedTypes, selectedPrice, sort]);

  useEffect(() => { setPage(1); }, [selectedTypes, selectedPrice, sort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const heroProduct = products.find(p => p.img);

  const makeCartItem = (p) => ({ id: p.id, name: p.name, price: p.price, image: p.img, image_url: p.img, quantity: 1, category: p.cat });
  const addToCart = (product, buyNow = false) => {
    const item = makeCartItem(product); const current = JSON.parse(localStorage.getItem("zinoraCart") || "[]");
    let updated = buyNow ? [item] : current.some(c => String(c.id) === String(item.id)) ? current.map(c => String(c.id) === String(item.id) ? {...c, quantity: c.quantity+1} : c) : [...current, item];
    localStorage.setItem("zinoraCart", JSON.stringify(updated)); window.dispatchEvent(new Event("zinoraCartUpdated")); navigate("/cart");
  };
  const toggleWishlist = (product) => {
    const current = JSON.parse(localStorage.getItem("zinoraWishlist") || "[]");
    const idStr = String(product.id);
    const exists = current.some(i => String(i.id) === idStr);
    const updated = exists ? current.filter(i => String(i.id) !== idStr) : [...current, makeCartItem(product)];
    localStorage.setItem("zinoraWishlist", JSON.stringify(updated)); 
    setFavorites(updated.map(i => String(i.id))); 
    window.dispatchEvent(new Event("zinoraWishlistUpdated"));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fbf8f5", color: "#332426" }}>
      <Box sx={{ background: "radial-gradient(circle at 70% 30%, #641a24 0%, #390009 45%, #250006 100%)", color: "#fff", px: { xs: 2, md: 5 }, py: { xs: 4, md: 5 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" }, gap: 4, alignItems: "center" }}>
          <Box>
            <Chip label="✦ RINGS & PENDANTS ONLY" size="small" sx={{ mb: 2, background: "rgba(255,255,255,.12)", color: "#fed65b", fontSize: 9 }} />
            <Typography sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: { xs: 36, md: 48 }, fontWeight: 700 }}>Rings & Pendants</Typography>
            <Typography sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", color: "#fed65b", fontSize: { xs: 28, md: 42 }, fontWeight: 600, mb: 2 }}>& Statement Pieces</Typography>
            <Typography sx={{ fontSize: 13, lineHeight: 1.8, color: "#f2dddd", maxWidth: 590, mb: 3 }}>Only Rings and Pendants collection - Earrings, Bangles, Necklaces excluded.</Typography>
            <Button variant="contained" onClick={() => document.getElementById("rings-products")?.scrollIntoView({ behavior: "smooth" })} sx={{ background: "#fed65b", color: "#390009", textTransform: "none", fontWeight: 700, fontSize: 12, px: 2.5 }}>Explore Rings ↓</Button>
          </Box>
          <Box sx={{ position: "relative", maxWidth: 430, mx: "auto", minHeight: { xs: 320, md: 430 }, borderRadius: 2, overflow: "hidden", background: "linear-gradient(145deg,#6b2631,#2b0007)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {heroProduct?.img ? <Box component="img" src={heroProduct.img} alt={heroProduct.name} sx={{ width: "100%", height: { xs: 320, md: 430 }, objectFit: "cover" }} /> : <Box sx={{ textAlign: "center", p: 3 }}><Typography sx={{ fontSize: 44, color: "#fed65b" }}>✦</Typography><Typography sx={{ fontFamily: "Georgia, serif", fontSize: 24 }}>Zinora</Typography></Box>}
          </Box>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }} id="rings-products">
        {error && <Alert severity="error" sx={{ mb: 2 }} action={<Button color="inherit" size="small" startIcon={<Refresh />} onClick={fetchProducts}>Retry</Button>}>{error}</Alert>}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "235px minmax(0, 1fr)" }, gap: 3, alignItems: "start" }}>
          <Box sx={{ bgcolor: "#fff", border: "1px solid #eee3e1", borderRadius: 2, overflow: "hidden", position: { md: "sticky" }, top: 18 }}>
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f0e7e5" }}>
              <Box sx={{ display: "flex", gap: 0.8 }}><Tune sx={{ color: "#650c20", fontSize: 19 }} /><Typography sx={{ fontSize: 14, fontWeight: 900, color: "#650c20" }}>Filters</Typography></Box>
              <Button onClick={clearFilters} size="small" sx={{ fontSize: 11, textTransform: "none", fontWeight: 800 }}>Clear all</Button>
            </Box>
            <Box sx={{ px: 2, py: 1.8, borderBottom: "1px solid #f0e7e5" }}>
              <Box component="button" onClick={() => setOpenFilter(p => p === "type" ? "" : "type")} sx={{ width: "100%", display: "flex", justifyContent: "space-between", border: 0, bgcolor: "transparent", cursor: "pointer", fontWeight: 800, fontSize: 12 }}>
                TYPE<Box sx={{ fontSize: 20 }}>{openFilter === "type" ? "−" : "+"}</Box>
              </Box>
              {openFilter === "type" && (
                <Box sx={{ pt: 1.5, display: "grid", gap: 0.8 }}>
                  {jewelleryTypes.map(type => (
                    <Box key={type} onClick={() => toggleType(type)} sx={{ display: "flex", gap: 0.7, cursor: "pointer" }}>
                      <Checkbox size="small" checked={selectedTypes.includes(type)} sx={{ p: 0.2, "&.Mui-checked": { color: "#650c20" } }} />
                      <Typography sx={{ fontSize: 12 }}>{type}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Box sx={{ px: 2, py: 1.8 }}>
              <Box component="button" onClick={() => setOpenFilter(p => p === "price" ? "" : "price")} sx={{ width: "100%", display: "flex", justifyContent: "space-between", border: 0, bgcolor: "transparent", cursor: "pointer", fontWeight: 800, fontSize: 12 }}>
                PRICE RANGE<Box sx={{ fontSize: 20 }}>{openFilter === "price" ? "−" : "+"}</Box>
              </Box>
              {openFilter === "price" && (
                <Box sx={{ pt: 1.5, display: "grid", gap: 0.8 }}>
                  {[{ label: "Under ₹199", value: "under199" },{ label: "₹199 – ₹499", value: "199to499" },{ label: "₹500 – ₹999", value: "500to999" },{ label: "₹1,000 & above", value: "1000plus" }].map(r => (
                    <Box key={r.value} onClick={() => togglePrice(r.value)} sx={{ display: "flex", gap: 0.7, cursor: "pointer" }}>
                      <Checkbox size="small" checked={selectedPrice.includes(r.value)} sx={{ p: 0.2, "&.Mui-checked": { color: "#650c20" } }} />
                      <Typography sx={{ fontSize: 12 }}>{r.label}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, p: 1.5, bgcolor: "#fff", border: "1px solid #eee3e1", borderRadius: 2 }}>
              <Typography sx={{ fontSize: 13 }}><Box component="span" sx={{ color: "#650c20", fontWeight: 800 }}>{filtered.length}</Box> Rings + Pendants only</Typography>
              <FormControl size="small" sx={{ minWidth: 155 }}><Select value={sort} onChange={(e) => setSort(e.target.value)} sx={{ fontSize: 12 }}><MenuItem value="Newest First">Newest First</MenuItem><MenuItem value="Price Low-High">Low to High</MenuItem><MenuItem value="Price High-Low">High to Low</MenuItem></Select></FormControl>
            </Box>
            {loading ? <Box sx={{ minHeight: 300, display: "grid", placeItems: "center" }}><CircularProgress sx={{ color: "#650c20" }} /></Box>
            : visible.length === 0 ? (
              <Box sx={{ bgcolor: "#fff", border: "1px solid #eee3e1", borderRadius: 2, py: 8, textAlign: "center" }}>
                <Typography sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: "#650c20", fontWeight: 700 }}>Product Not Found</Typography>
                <Typography sx={{ fontSize: 13, color: "#777", mt: 1 }}>No products found for <b>Rings / Pendants</b> category</Typography>
                <Typography sx={{ fontSize: 11, color: "#999", mt: 1 }}>Backend me Category = Rings ya Pendants select karo</Typography>
                <Button onClick={fetchProducts} sx={{ mt: 2, border: "1px solid #650c20", color: "#650c20" }} startIcon={<Refresh />}>Retry</Button>
              </Box>
            ) : (
              <>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }, gap: 2 }}>
                  {visible.map(product => (
                    <Box key={product.id} sx={{ bgcolor: "#fff", border: "1px solid #eee4e1", borderRadius: 2.5, overflow: "hidden" }}>
                      <Box sx={{ position: "relative", aspectRatio: "0.88", bgcolor: "#f4efeb" }}>
                        {product.img ? <Box component="img" src={product.img} alt={product.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                        <Chip label={product.cat || "RING"} size="small" sx={{ position: "absolute", top: 9, left: 9, bgcolor: "#650c20", color: "#fff", fontSize: 9 }} />
                        <IconButton onClick={() => toggleWishlist(product)} sx={{ position: "absolute", top: 8, right: 8, width: 34, height: 34, bgcolor: "#fff", color: favorites.includes(String(product.id)) ? "#a20d32" : "#650c20" }}>
                          {favorites.includes(String(product.id)) ? <Favorite sx={{ fontSize: 19 }} /> : <FavoriteBorder sx={{ fontSize: 19 }} />}
                        </IconButton>
                      </Box>
                      <Box sx={{ p: 1.5 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 800, minHeight: 36, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.name}</Typography>
                        <Typography sx={{ fontSize: 10, color: "#888" }}>{product.cat}</Typography>
                        <Typography sx={{ color: "#650c20", fontWeight: 900, fontSize: 16, mt: 1 }}>₹{formatPrice(product.price)}</Typography>
                        <Box sx={{ display: "grid", gap: 0.8, mt: 1.5 }}>
                          <Button variant="outlined" onClick={() => addToCart(product)} startIcon={<ShoppingCartOutlined />} sx={{ borderColor: "#650c20", color: "#650c20", borderRadius: 1.5, fontSize: 11, fontWeight: 800, textTransform: "none" }}>Add to Cart</Button>
                          <Button variant="contained" onClick={() => addToCart(product, true)} startIcon={<LocalMallOutlined />} sx={{ bgcolor: "#650c20", borderRadius: 1.5, fontSize: 11, fontWeight: 800, textTransform: "none" }}>Order Now</Button>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
                {totalPages > 1 && (<Box sx={{ mt: 2, p: 1.5, bgcolor: "#fff", border: "1px solid #eee3e1", borderRadius: 2, display: "flex", justifyContent: "space-between" }}><Button disabled={page === 1} onClick={() => setPage(c => c - 1)}>Previous</Button><Typography sx={{ fontSize: 12, py: 1 }}>Page {page} of {totalPages}</Typography><Button disabled={page >= totalPages} onClick={() => setPage(c => c + 1)}>Next</Button></Box>)}
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}