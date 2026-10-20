import React, { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Chip, Container, Divider, Stack, Typography, Paper
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; 
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"; 
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import ReplayIcon from "@mui/icons-material/Replay";
import LockIcon from "@mui/icons-material/Lock";
import { useLocation, useNavigate } from "react-router-dom";

const money = (value) => Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
      sessionStorage.setItem("zinoraLastOrder", JSON.stringify(location.state.order));
      return;
    }
    try {
      const stored = JSON.parse(sessionStorage.getItem("zinoraLastOrder") || "null");
      setOrder(stored);
    } catch { setOrder(null); }
  }, [location.state]);

  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={800} mb={2} sx={{ fontFamily: "'Playfair Display', serif", color: "#390009" }}>No recent order found</Typography>
        <Typography color="#8a6b6e" mb={3} fontSize={13}>Please check your orders in your customer profile.</Typography>
        <Button variant="contained" onClick={() => navigate("/profile")} sx={{ bgcolor: "#390009", borderRadius: 2.5, px: 4, textTransform: "none", fontWeight: 800, "&:hover": { bgcolor: "#5a1020" } }}>Go to My Profile</Button>
      </Container>
    );
  }

  const address = order.address || {};
  const items = order.items || [];
  const orderNumber = order.order_number || order.order_id || order.id || "Confirmed";
  const status = order.status || "PLACED";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fbf8f5", py: { xs: 3, md: 6 } }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 3, p: 3, borderRadius: 4, background: "radial-gradient(100% 150% at 50% 0%, #6a1020 0%, #390009 70%, #1e0004 100%)", color: "#fff" }}>
          <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: "#e8f5e9", border: "3px solid #a5d6a7", display: "grid", placeItems: "center", mx: "auto", mb: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 46, color: "#2e7d32" }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Playfair Display', serif", fontSize: { xs: 26, md: 36 } }}>Order Placed Successfully! <Box component="span" sx={{ color: "#fed65b" }}>✦</Box></Typography>
          <Typography sx={{ color: "#f0dfe0", mt: 1, fontSize: 13 }}>Thank you for shopping with Zinora.</Typography>
          <Chip label={`Order #${orderNumber}`} sx={{ mt: 2, bgcolor: "#fed65b", color: "#390009", fontWeight: 900, px: 1 }} />
        </Box>

        <Card elevation={0} sx={{ border: "1px solid #f0e6e3", borderRadius: 4, overflow: "hidden" }}>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2} mb={3}>
              <Box><Typography variant="body2" color="#8a6b6e" fontSize={11} fontWeight={800}>ORDER NUMBER</Typography><Typography variant="h6" fontWeight={900} color="#390009">#{orderNumber}</Typography></Box>
              <Box><Typography variant="body2" color="#8a6b6e" fontSize={11} fontWeight={800}>STATUS</Typography><Chip label={status} sx={{ mt: 0.5, bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 800, border: "1px solid #a5d6a7" }} /></Box>
              <Box><Typography variant="body2" color="#8a6b6e" fontSize={11} fontWeight={800}>PAYMENT</Typography><Typography fontWeight={800} mt={0.5} fontSize={14} color="#390009">{order.payment_method === "COD" ? "Cash on Delivery" : order.payment_method || "COD"}</Typography></Box>
            </Stack>

            <Divider sx={{ my: 3, borderColor: "#f6ecea" }} />
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <LocalShippingIcon sx={{ color: "#390009" }} />
              <Typography variant="h6" fontWeight={900} fontSize={16} color="#390009">Delivery Address</Typography>
              <Chip label="Verified" size="small" icon={<VerifiedIcon sx={{ fontSize: 14 }} />} sx={{ ml: 1, bgcolor: "#e8f5e9", color: "#2e7d32", fontSize: 10, fontWeight: 800, height: 22 }} />
            </Stack>
            <Box sx={{ p: 2.5, bgcolor: "#fdf7f5", border: "1px solid #f6ecea", borderRadius: 2.5 }}>
              <Typography fontWeight={800} color="#281a1a">{address.full_name || "Customer"}</Typography>
              <Typography sx={{ mt: 0.5, fontSize: 13, color: "#5a3a3d" }}>{address.address_line || address.address || ""}<br/>{[address.city, address.state, address.pincode].filter(Boolean).join(", ")}</Typography>
              {address.phone && <Typography mt={1} fontSize={13} fontWeight={700}>Mobile: {address.phone}</Typography>}
            </Box>

            <Typography variant="h6" fontWeight={900} mt={4} mb={2} color="#390009">Order Items ({items.length})</Typography>
            {items.map((item, index) => {
              const name = item.name || item.product_name || item.product?.name || "Jewellery Product";
              const qty = Number(item.quantity || 1);
              const price = Number(item.price ?? item.unit_price ?? item.product?.price ?? 0);
              return (
                <Box key={item.id || index}>
                  {index > 0 && <Divider sx={{ my: 2, borderColor: "#f6ecea" }} />}
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Box><Typography fontWeight={700} fontSize={13.5}>{name}</Typography><Typography variant="body2" color="#8a6b6e" fontSize={11}>Qty: {qty}</Typography></Box>
                    <Typography fontWeight={800} fontSize={13.5}>₹{money(price * qty)}</Typography>
                  </Stack>
                </Box>
              );
            })}

            <Divider sx={{ my: 3, borderColor: "#f6ecea" }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={900}>Total Amount</Typography>
              <Typography variant="h5" fontWeight={900} sx={{ color: "#390009" }}>₹{money(order.total_amount)}</Typography>
            </Stack>

            <Paper elevation={0} sx={{ mt: 3, p: 2, borderRadius: 2.5, border: "1px solid #f0e6e3", display: "flex", gap: 1.5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: "#e8f5e9", display: "grid", placeItems: "center" }}><ReplayIcon sx={{ fontSize: 18, color: "#2e7d32" }} /></Box>
              <Box>
                <Typography fontWeight={800} fontSize={12.5}>7-Day Easy Return Eligible</Typography>
                <Typography fontSize={11.5} color="#8a6b6e">Return/exchange available from My Orders after delivery.</Typography>
              </Box>
            </Paper>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
              <Button fullWidth variant="contained" startIcon={<ShoppingBagIcon />} onClick={() => navigate("/")} sx={{ py: 1.5, bgcolor: "#390009", borderRadius: 2.5, fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#5a1020" } }}>Continue Shopping</Button>
              <Button fullWidth variant="outlined" onClick={() => navigate("/profile", { state: { tab: "orders" } })} sx={{ py: 1.5, borderColor: "#390009", color: "#390009", borderRadius: 2.5, fontWeight: 800, textTransform: "none" }}>View My Orders</Button>
            </Stack>

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 3 }}><LockIcon sx={{ fontSize: 14, color: "#9a8a8b" }} /><Typography fontSize={11} color="#9a8a8b" fontWeight={600}>100% Secure Order • Need help? Contact support</Typography></Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default OrderSuccess;