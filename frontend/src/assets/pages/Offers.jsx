import React, { useEffect, useState } from "react";
import {
  Box, Container, Typography, Button, Card, CardContent,
  Grid, Chip, Stack, CircularProgress, Alert, IconButton, Tooltip
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedIcon from "@mui/icons-material/Verified";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DiscountIcon from "@mui/icons-material/Discount";

const API_URL = "http://127.0.0.1:8000/api/offers/";

const getField = (offer, names, fallback = "") => {
  for (const name of names) {
    if (offer?.[name] !== undefined && offer?.[name] !== null && offer?.[name] !== "") {
      return offer[name];
    }
  }
  return fallback;
};
const getOfferTitle = (offer) => getField(offer, ["title", "name", "offer_name", "offer_title", "coupon_name"], "Exclusive Zinora Offer");
const getOfferDescription = (offer) => getField(offer, ["description", "offer_description", "details"], "Enjoy exclusive offers on your favourite jewellery.");
const getOfferDiscount = (offer) => {
  const value = getField(offer, ["discount_percentage", "discount_percent", "discount", "discount_value"], "");
  if (value === "") return "";
  const type = String(getField(offer, ["discount_type", "type"], "")).toLowerCase();
  if (type.includes("percentage") || type.includes("percent")) return `${value}% OFF`;
  if (String(value).includes("%")) return `${value.toUpperCase()} OFF`;
  return typeof value === "number" ? `₹${value} OFF` : value;
};
const getCouponCode = (offer) => getField(offer, ["coupon_code", "code", "offer_code", "promo_code"], "");
const getOfferImage = (offer) => getField(offer, ["image_url", "image", "banner_image", "imageUrl"], "");
const isOfferActive = (offer) => {
  const status = getField(offer, ["is_active", "isActive", "active", "status"], true);
  if (typeof status === "boolean") return status;
  if (typeof status === "number") return status === 1;
  return !["false", "0", "inactive", "disabled", "expired"].includes(String(status).toLowerCase());
};

function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL, { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`Server ${response.status}`);
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.results || data.offers || [];
        if (!cancelled) setOffers(list.filter(isOfferActive));
      } catch (err) {
        if (!cancelled) setError("Offers load nahi ho rahe. Backend check karo.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOffers();
    return () => { cancelled = true; };
  }, []);

  const handleCopyCode = async (code) => {
    try { await navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(""), 2000); }
    catch { window.prompt("Copy coupon:", code); }
  };

  return (
    <Box sx={{ bgcolor: "#fbf8f5", minHeight: "100vh" }}>
      {/* PREMIUM HERO */}
      <Box sx={{
        background: "radial-gradient(120% 120% at 30% 20%, #7a1524 0%, #4a0010 40%, #250006 100%)",
        color: "#fff", py: { xs: 6, md: 9 }, position: "relative", overflow: "hidden"
      }}>
        {/* Gold glow effects */}
        <Box sx={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, background: "radial-gradient(circle, rgba(254,214,91,0.25), transparent)", borderRadius: "50%" }} />
        <Box sx={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(254,214,91,0.15), transparent)", borderRadius: "50%" }} />
        
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip icon={<AutoAwesomeIcon sx={{ color: "#fed65b !important", fontSize: 16 }} />} label="LIMITED TIME ROYAL DEALS" sx={{ bgcolor: "rgba(254,214,91,0.15)", color: "#fed65b", fontWeight: 800, mb: 2.5, border: "1px solid rgba(254,214,91,0.3)", fontSize: 11, letterSpacing: 1 }} />
              <Typography sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: { xs: 38, md: 62 }, lineHeight: 1.05, fontWeight: 800 }}>
                Royal Treasure
                <Box component="span" sx={{ display: "block", fontStyle: "italic", color: "#fed65b", fontWeight: 600 }}>Exclusive Offers</Box>
              </Typography>
              <Typography sx={{ mt: 2.5, maxWidth: 560, color: "#f3d6d9", lineHeight: 1.9, fontSize: 15 }}>
                Handpicked deals for your festive & bridal moments. Copy code, shop jewellery & save big - only on Zinora.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 3.5 }}>
                <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => document.getElementById("available-offers")?.scrollIntoView({ behavior: "smooth" })} sx={{ bgcolor: "#fed65b", color: "#3a0008", px: 3.5, py: 1.6, borderRadius: 2, textTransform: "none", fontWeight: 900, fontSize: 13, "&:hover": { bgcolor: "#ffdf7a" } }}>Explore Offers</Button>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#f3d6d9", fontSize: 12 }}><VerifiedIcon sx={{ fontSize: 18, color: "#fed65b" }} /> Verified • No spam</Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ position: "relative", borderRadius: 4, overflow: "hidden", border: "1px solid rgba(254,214,91,0.2)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
                <Box component="img" src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=80" alt="jewellery" sx={{ width: "100%", height: { xs: 300, md: 420 }, objectFit: "cover" }} />
                <Box sx={{ position: "absolute", bottom: 12, left: 12, right: 12, p: 2, borderRadius: 2, bgcolor: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box><Typography sx={{ fontSize: 11, color: "#fed65b", fontWeight: 800, letterSpacing: 1 }}>TODAY'S HOT DEAL</Typography><Typography sx={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Flat 30% OFF on Bridal Sets</Typography></Box>
                  <DiscountIcon sx={{ color: "#fed65b" }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* OFFERS GRID */}
      <Container id="available-offers" maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
        <Box sx={{ mb: 4.5, display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography sx={{ color: "#a48225", fontWeight: 900, fontSize: 11, letterSpacing: 2.5 }}>ZINORA EXCLUSIVE</Typography>
            <Typography sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: { xs: 28, md: 38 }, fontWeight: 800, color: "#3a0008", mt: 0.5 }}>Today's Best Offers</Typography>
            <Typography sx={{ color: "#8a6b6e", mt: 1, fontSize: 13 }}>Tap copy & apply at checkout - limited stock!</Typography>
          </Box>
          <Chip label={`${offers.length} Active Offers`} sx={{ bgcolor: "#fff", border: "1px solid #f0d6d9", color: "#650b17", fontWeight: 800 }} />
        </Box>

        {loading && <Box sx={{ display: "grid", placeItems: "center", py: 10 }}><Stack alignItems="center" spacing={2}><CircularProgress sx={{ color: "#650b17" }} /><Typography color="#8a6b6e">Loading royal offers...</Typography></Stack></Box>}
        {!loading && error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {!loading && !error && offers.length === 0 && (
          <Box sx={{ textAlign: "center", py: 10, bgcolor: "#fff", border: "1px dashed #e8cbcb", borderRadius: 4 }}>
            <LocalOfferIcon sx={{ fontSize: 52, color: "#d6a97a", mb: 1 }} />
            <Typography sx={{ color: "#650b17", fontWeight: 800, fontSize: 22, fontFamily: "Georgia, serif" }}>No Active Offers Right Now</Typography>
            <Typography sx={{ color: "#8a6b6e", mt: 1 }}>New festive deals coming soon. Stay tuned!</Typography>
          </Box>
        )}

        {!loading && !error && offers.length > 0 && (
          <Grid container spacing={3}>
            {offers.map((offer, index) => {
              const title = getOfferTitle(offer); const description = getOfferDescription(offer); const discount = getOfferDiscount(offer); const couponCode = getCouponCode(offer); const image = getOfferImage(offer);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={offer.id ?? `${title}-${index}`}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3.5, overflow: "hidden", border: "1px solid #f3e2e3", boxShadow: "0 6px 20px rgba(101,11,23,0.06)", transition: "all .25s", "&:hover": { transform: "translateY(-6px)", boxShadow: "0 16px 40px rgba(101,11,23,0.15)", borderColor: "#e8c0c4" } }}>
                    {/* IMAGE WITH DISCOUNT BADGE */}
                    <Box sx={{ position: "relative", height: 200, bgcolor: "#fdf2f3" }}>
                      {image ? <Box component="img" src={image} alt={title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.currentTarget.style.display = "none"} /> : <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}><LocalOfferIcon sx={{ fontSize: 60, color: "#d8a7ad" }} /></Box>}
                      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(58,0,8,0.45), transparent 60%)" }} />
                      {discount && <Chip icon={<DiscountIcon sx={{ fontSize: 16, color: "#3a0008 !important" }} />} label={discount} sx={{ position: "absolute", top: 12, left: 12, bgcolor: "#fed65b", color: "#3a0008", fontWeight: 900, fontSize: 12, px: 0.5 }} />}
                      <Chip label="VERIFIED" size="small" icon={<VerifiedIcon sx={{ fontSize: 14 }} />} sx={{ position: "absolute", top: 12, right: 12, bgcolor: "#fff", color: "#2e7d32", fontWeight: 800, fontSize: 10 }} />
                    </Box>

                    <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ color: "#3a0008", fontWeight: 900, fontSize: 17, lineHeight: 1.3, fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</Typography>
                      <Typography sx={{ color: "#7a5d60", fontSize: 12.5, lineHeight: 1.7, mt: 1, flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{description}</Typography>

                      {couponCode ? (
                        <Box sx={{ mt: 2.5, p: 1.2, pl: 1.8, bgcolor: "#fffaf0", border: "1.5px dashed #c5a059", borderRadius: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                          <Box><Typography sx={{ fontSize: 9, color: "#a48225", fontWeight: 900, letterSpacing: 1.5 }}>COUPON CODE</Typography><Typography sx={{ color: "#3a0008", fontWeight: 900, fontSize: 15, letterSpacing: 0.5 }}>{couponCode}</Typography></Box>
                          <Tooltip title={copied === couponCode ? "Copied!" : "Copy"}>
                            <Button onClick={() => handleCopyCode(couponCode)} size="small" variant={copied === couponCode ? "contained" : "outlined"} sx={{ minWidth: 72, borderRadius: 2, textTransform: "none", fontWeight: 800, bgcolor: copied === couponCode ? "#2e7d32" : "#fff", borderColor: "#c5a059", color: copied === couponCode ? "#fff" : "#650b17" }} startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}>{copied === couponCode ? "Copied" : "Copy"}</Button>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Box sx={{ mt: 2.5, p: 1.5, bgcolor: "#fdf2f3", borderRadius: 2, textAlign: "center" }}><Typography sx={{ fontSize: 11, color: "#650b17", fontWeight: 800 }}>No code needed - auto applied</Typography></Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Offers;