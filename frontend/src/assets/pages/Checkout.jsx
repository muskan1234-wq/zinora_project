import React, { useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, Card, CardContent, CircularProgress, Container, Divider,
  FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, TextField, Typography, Paper, Chip
} from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";
const CART_KEY = "zinoraCart";
const getToken = () => localStorage.getItem("zinoraCustomerToken") || localStorage.getItem("authToken") || localStorage.getItem("token");
const emptyAddress = { full_name: "", phone: "", email: "", address_line: "", city: "", state: "", pincode: "", landmark: "", address_type: "Home" };
const money = (value) => Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState(emptyAddress);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      setCartItems(Array.isArray(storedCart) ? storedCart.filter((item) => Number(item.quantity) > 0) : []);
    } catch { setCartItems([]); }
  }, []);

  useEffect(() => {
    const loadAddresses = async () => {
      const token = getToken();
      if (!token) { setLoadingAddresses(false); return; }
      try {
        const response = await fetch(`${API_BASE}/api/products/addresses/`, { headers: { Authorization: `Token ${token}` } });
        if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? "Please log in again." : "Saved addresses load failed.");
        const data = await response.json();
        const addresses = Array.isArray(data) ? data : data.results || data.addresses || [];
        setSavedAddresses(addresses);
        const defaultAddress = addresses.find((item) => item.is_default);
        if (defaultAddress) {
          setSelectedAddressId(String(defaultAddress.id));
          setAddress({
            full_name: defaultAddress.full_name || "", phone: defaultAddress.phone || "", email: defaultAddress.email || "",
            address_line: defaultAddress.address_line || "", city: defaultAddress.city || "", state: defaultAddress.state || "",
            pincode: defaultAddress.pincode || "", landmark: defaultAddress.landmark || "", address_type: defaultAddress.address_type || "Home",
          });
        }
      } catch (err) { setError(err.message); } finally { setLoadingAddresses(false); }
    };
    loadAddresses();
  }, []);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0), [cartItems]);
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const updateAddress = (event) => {
    const { name, value } = event.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };
  const selectSavedAddress = (event) => {
    const id = event.target.value;
    setSelectedAddressId(id);
    if (id === "new") { setAddress(emptyAddress); return; }
    const selected = savedAddresses.find((item) => String(item.id) === id);
    if (!selected) return;
    setAddress({
      full_name: selected.full_name || "", phone: selected.phone || "", email: selected.email || "",
      address_line: selected.address_line || "", city: selected.city || "", state: selected.state || "",
      pincode: selected.pincode || "", landmark: selected.landmark || "", address_type: selected.address_type || "Home",
    });
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setError(""); setSuccess("");
    const token = getToken();
    if (!token) { setError("Please log in before placing an order."); return; }
    if (cartItems.length === 0) { setError("Your cart is empty."); return; }
    const requiredFields = [["full_name", "Full name"], ["phone", "Phone"], ["address_line", "Address"], ["city", "City"], ["state", "State"], ["pincode", "PIN code"]];
    for (const [field, label] of requiredFields) { if (!String(address[field] || "").trim()) { setError(`Please enter ${label}.`); return; } }
    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) { setError("Enter valid 10-digit mobile number."); return; }
    if (!/^\d{6}$/.test(address.pincode.trim())) { setError("Enter valid 6-digit PIN code."); return; }
    setPlacingOrder(true);
    try {
      const response = await fetch(`${API_BASE}/api/products/checkout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({
          address: selectedAddressId !== "new" ? { id: Number(selectedAddressId), ...address } : address,
          items: cartItems.map((item) => ({ product: item.id, quantity: Number(item.quantity) })),
          payment_method: paymentMethod,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data.detail || data.error || data.message || (typeof data === "object" ? Object.values(data).flat().join(" ") : "");
        throw new Error(message || "Unable to place order.");
      }
      const order = data.order || data;
      if (!order.id && !order.order_number) throw new Error("Server did not return confirmation.");
      const confirmation = {
        id: order.id || null, order_number: order.order_number || order.order_id || "", status: order.status || "PLACED",
        payment_method: order.payment_method || paymentMethod,
        total_amount: order.total_amount !== undefined ? Number(order.total_amount) : total,
        address: order.address || address, items: order.items || cartItems,
      };
      sessionStorage.setItem("zinoraLastOrder", JSON.stringify(confirmation));
      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event("zinoraCartUpdated"));
      navigate("/order-success", { replace: true, state: { order: confirmation } });
    } catch (err) { setError(err.message || "Something went wrong."); } finally { setPlacingOrder(false); }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={800} mb={2} sx={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#390009" }}>Your bag is empty</Typography>
        <Button variant="contained" onClick={() => navigate("/")} sx={{ bgcolor: "#390009", borderRadius: 2.5, px: 4, textTransform: "none", fontWeight: 800, "&:hover": { bgcolor: "#5a1020" } }}>Continue Shopping</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fbf8f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/cart")} sx={{ color: "#390009", mb: 2.5, textTransform: "none", fontWeight: 800, bgcolor: "#fff", border: "1px solid #f0e6e3", borderRadius: 2.5, px: 2.5, "&:hover": { bgcolor: "#fdf2f3" } }}>Back to Cart</Button>

        <Box sx={{ mb: 4, p: 3, borderRadius: 4, background: "radial-gradient(100% 150% at 30% 20%, #6a1020 0%, #390009 60%, #1e0004 100%)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Chip icon={<VerifiedIcon sx={{ fontSize: 14, color: "#fed65b !important" }} />} label="SECURE CHECKOUT" size="small" sx={{ bgcolor: "rgba(254,214,91,0.15)", color: "#fed65b", border: "1px solid rgba(254,214,91,0.25)", fontWeight: 800, fontSize: 10, mb: 1 }} />
            <Typography sx={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, fontSize: { xs: 28, md: 36 }, lineHeight: 1.1 }}>Complete Your Order <Box component="span" sx={{ color: "#fed65b", fontStyle: "italic" }}>✦</Box></Typography>
            <Typography sx={{ color: "#f0dfe0", fontSize: 13, mt: 0.5 }}>{cartItems.length} items • Free shipping over ₹999 • 100% Secure</Typography>
          </Box>
          <Stack direction="row" spacing={1}><Chip label="COD" sx={{ bgcolor: "#fed65b", color: "#390009", fontWeight: 900, fontSize: 11 }} /><Chip label="Online Payment" sx={{ bgcolor: "#fff", color: "#390009", fontWeight: 800, fontSize: 11 }} /></Stack>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5 }}>{success}</Alert>}

        <Box component="form" onSubmit={placeOrder}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card elevation={0} sx={{ border: "1px solid #f0e6e3", borderRadius: 3.5, overflow: "hidden" }}>
                <Box sx={{ p: 2.5, borderBottom: "1px solid #f6ecea", bgcolor: "#fffcfb", display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#390009", color: "#fed65b", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 14 }}>1</Box>
                  <Typography variant="h6" fontWeight={900} sx={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#390009", fontSize: 17 }}>Delivery Address</Typography>
                </Box>
                <CardContent sx={{ p: { xs: 2.2, md: 3 } }}>
                  {loadingAddresses ? <Box sx={{ display: "grid", placeItems: "center", py: 4 }}><CircularProgress sx={{ color: "#390009" }} size={26} /></Box> : (
                    <>
                      {savedAddresses.length > 0 && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: "#fdf7f5", borderRadius: 2.5, border: "1px solid #f6ecea" }}>
                          <Typography fontWeight={800} mb={1.2} fontSize={13} color="#390009">Select Saved Address</Typography>
                          <RadioGroup value={selectedAddressId} onChange={selectSavedAddress}>
                            {savedAddresses.map((item) => (
                              <Paper key={item.id} elevation={0} sx={{ p: 1.5, mb: 1, borderRadius: 2, border: selectedAddressId === String(item.id) ? "1.5px solid #390009" : "1px solid #f0e6e3", bgcolor: selectedAddressId === String(item.id) ? "#fdf2f3" : "#fff", cursor: "pointer" }} onClick={() => { setSelectedAddressId(String(item.id)); const sel = savedAddresses.find(i => String(i.id) === String(item.id)); if(sel) setAddress({ full_name: sel.full_name||"", phone: sel.phone||"", email: sel.email||"", address_line: sel.address_line||"", city: sel.city||"", state: sel.state||"", pincode: sel.pincode||"", landmark: sel.landmark||"", address_type: sel.address_type||"Home" }) }}>
                                <FormControlLabel value={String(item.id)} control={<Radio size="small" sx={{ color: "#390009", "&.Mui-checked": { color: "#390009" } }} />} label={<Typography fontSize={13}><b>{item.full_name}</b> — {item.address_line}, {item.city}</Typography>} sx={{ m: 0, width: "100%" }} />
                              </Paper>
                            ))}
                            <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: selectedAddressId === "new" ? "1.5px solid #390009" : "1px solid #f0e6e3", bgcolor: selectedAddressId === "new" ? "#fdf2f3" : "#fff" }}><FormControlLabel value="new" control={<Radio size="small" sx={{ color: "#390009", "&.Mui-checked": { color: "#390009" } }} />} label={<Typography fontSize={13} fontWeight={700}>+ Enter a new address</Typography>} sx={{ m: 0 }} /></Paper>
                          </RadioGroup>
                        </Box>
                      )}
                      <Grid container spacing={2}>
                        <Grid item xs={12}><TextField fullWidth required label="Full Name" name="full_name" value={address.full_name} onChange={updateAddress} size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }} /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth required label="Mobile Number" name="phone" value={address.phone} onChange={updateAddress} inputProps={{ maxLength: 10 }} size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }} /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth label="Email" name="email" type="email" value={address.email} onChange={updateAddress} size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }} /></Grid>
                        <Grid item xs={12}><TextField fullWidth required label="House No. / Street / Area" name="address_line" value={address.address_line} onChange={updateAddress} size="small" multiline rows={2} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }} /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth required label="City" name="city" value={address.city} onChange={updateAddress} size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }} /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth required label="State" name="state" value={address.state} onChange={updateAddress} size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }} /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth required label="PIN Code" name="pincode" value={address.pincode} onChange={updateAddress} inputProps={{ maxLength: 6 }} size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }} /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth label="Landmark (Optional)" name="landmark" value={address.landmark} onChange={updateAddress} size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }} /></Grid>
                        <Grid item xs={12}>
                          <Typography fontWeight={800} mb={1} fontSize={12} color="#390009">ADDRESS TYPE</Typography>
                          <RadioGroup row name="address_type" value={address.address_type} onChange={updateAddress}>
                            <FormControlLabel value="Home" control={<Radio size="small" sx={{ color: "#390009", "&.Mui-checked": { color: "#390009" } }} />} label={<Stack direction="row" alignItems="center" gap={0.5}><HomeIcon sx={{ fontSize: 16 }} /> Home</Stack>} />
                            <FormControlLabel value="Office" control={<Radio size="small" sx={{ color: "#390009", "&.Mui-checked": { color: "#390009" } }} />} label={<Stack direction="row" alignItems="center" gap={0.5}><BusinessIcon sx={{ fontSize: 16 }} /> Office</Stack>} />
                          </RadioGroup>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ mt: 3, border: "1px solid #f0e6e3", borderRadius: 3.5, overflow: "hidden" }}>
                <Box sx={{ p: 2.5, borderBottom: "1px solid #f6ecea", bgcolor: "#fffcfb", display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#390009", color: "#fed65b", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 14 }}>2</Box>
                  <Typography variant="h6" fontWeight={900} sx={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#390009", fontSize: 17 }}>Payment Method</Typography>
                </Box>
                <CardContent sx={{ p: 2.5 }}>
                  <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <Paper elevation={0} onClick={() => setPaymentMethod("COD")} sx={{ p: 2, mb: 1.5, borderRadius: 2.5, border: paymentMethod === "COD" ? "1.5px solid #390009" : "1px solid #f0e6e3", bgcolor: paymentMethod === "COD" ? "#fdf2f3" : "#fff", cursor: "pointer", transition: "all .2s", "&:hover": { borderColor: "#c5a059" } }}>
                      <FormControlLabel value="COD" control={<Radio sx={{ color: "#390009", "&.Mui-checked": { color: "#390009" } }} />} label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "#fff8e1", display: "grid", placeItems: "center" }}><PaymentsIcon sx={{ color: "#8a6a1a", fontSize: 20 }} /></Box>
                          <Box><Typography fontWeight={800} fontSize={14}>Cash on Delivery</Typography><Typography fontSize={11} color="#8a6b6e">Pay when your jewellery arrives</Typography></Box>
                          <Chip label="Popular" size="small" sx={{ ml: "auto", bgcolor: "#e8f5e9", color: "#2e7d32", fontSize: 10, fontWeight: 800 }} />
                        </Box>
                      } sx={{ m: 0, width: "100%" }} />
                    </Paper>

                    <Paper elevation={0} onClick={() => setPaymentMethod("ONLINE")} sx={{ p: 2, borderRadius: 2.5, border: paymentMethod === "ONLINE" ? "1.5px solid #390009" : "1px solid #f0e6e3", bgcolor: paymentMethod === "ONLINE" ? "#fdf2f3" : "#fff", cursor: "pointer", transition: "all .2s", "&:hover": { borderColor: "#c5a059" } }}>
                      <FormControlLabel value="ONLINE" control={<Radio sx={{ color: "#390009", "&.Mui-checked": { color: "#390009" } }} />} label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "#e8f5e9", display: "grid", placeItems: "center" }}><AccountBalanceWalletIcon sx={{ color: "#2e7d32", fontSize: 20 }} /></Box>
                          <Box><Typography fontWeight={800} fontSize={14}>Online Payment (UPI / Card / Netbanking)</Typography><Typography fontSize={11} color="#8a6b6e">Instant confirmation • 100% secure</Typography></Box>
                          <Chip label="Fast" size="small" sx={{ ml: "auto", bgcolor: "#fff8e1", color: "#8a6a1a", fontSize: 10, fontWeight: 800 }} />
                        </Box>
                      } sx={{ m: 0, width: "100%" }} />
                    </Paper>
                  </RadioGroup>

                  {paymentMethod === "ONLINE" && (
                    <Alert severity="info" sx={{ mt: 2, borderRadius: 2.5, bgcolor: "#e8f5e9", border: "1px solid #a5d6a7", color: "#2e7d32" }}>
                      You selected <b>Online Payment</b>. After placing order, you will be redirected to secure payment page (Razorpay / Stripe).
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card elevation={0} sx={{ border: "1px solid #f0e6e3", borderRadius: 3.5, position: { md: "sticky" }, top: 20, overflow: "hidden" }}>
                <Box sx={{ p: 2.5, borderBottom: "1px solid #f6ecea", bgcolor: "#fffcfb", display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#390009", color: "#fed65b", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 14 }}>3</Box>
                  <Typography variant="h6" fontWeight={900} sx={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#390009", fontSize: 17 }}>Order Summary</Typography>
                </Box>
                <CardContent sx={{ p: 2.8 }}>
                  {cartItems.map((item, index) => (
                    <Box key={item.id}>
                      {index > 0 && <Divider sx={{ my: 2, borderColor: "#f6ecea" }} />}
                      <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Box><Typography fontWeight={700} fontSize={13.5} sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.name || item.title || "Jewellery"}</Typography><Typography variant="body2" color="#8a6b6e" fontSize={11}>Qty: {item.quantity} • ₹{money(item.price)} each</Typography></Box>
                        <Typography fontWeight={800} fontSize={13.5}>₹{money(Number(item.price || 0) * Number(item.quantity || 1))}</Typography>
                      </Stack>
                    </Box>
                  ))}
                  <Divider sx={{ my: 2.5, borderColor: "#f6ecea" }} />
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between"><Typography color="#8a6b6e" fontSize={13.5}>Subtotal</Typography><Typography fontWeight={700}>₹{money(subtotal)}</Typography></Stack>
                    <Stack direction="row" justifyContent="space-between"><Typography color="#8a6b6e" fontSize={13.5}>Shipping</Typography><Typography fontWeight={800} color={shipping === 0 ? "#2e7d32" : "#281a1a"}>{shipping === 0 ? "FREE" : `₹${money(shipping)}`}</Typography></Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between"><Typography fontWeight={900} fontSize={16}>Total</Typography><Typography fontWeight={900} fontSize={22} color="#390009">₹{money(total)}</Typography></Stack>
                  </Stack>

                  <Box sx={{ mt: 2.5, p: 2, borderRadius: 2.5, bgcolor: "#fff8e1", border: "1px solid #f0d6a0", display: "flex", gap: 1.2, alignItems: "center" }}>
                    <LocalMallIcon sx={{ fontSize: 18, color: "#8a6a1a" }} />
                    <Typography fontSize={12} fontWeight={600} color="#7a5a1a">{paymentMethod === "COD" ? "You selected COD - Pay at doorstep" : "You selected Online Payment - Secure checkout"}</Typography>
                  </Box>

                  <Button fullWidth type="submit" variant="contained" disabled={placingOrder || loadingAddresses} sx={{ mt: 2.5, py: 1.7, bgcolor: "#390009", fontWeight: 900, borderRadius: 2.5, textTransform: "none", fontSize: 14, letterSpacing: 0.3, "&:hover": { bgcolor: "#5a1020" } }}>
                    {placingOrder ? <CircularProgress size={22} color="inherit" /> : `Place Order • ₹${money(total)}`}
                  </Button>
                  <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={2}><LockOutlinedIcon sx={{ fontSize: 15, color: "#9a8a8b" }} /><Typography variant="caption" color="#9a8a8b" fontWeight={600}>SSL Secure • 100% Safe Checkout</Typography></Stack>
                </CardContent>
              </Card>
              <Box sx={{ mt: 2.5, p: 2, bgcolor: "#fff", border: "1px solid #f0e6e3", borderRadius: 2.5, display: "flex", alignItems: "center", gap: 1.5, justifyContent: "center" }}><LocalShippingOutlinedIcon sx={{ color: "#390009", fontSize: 20 }} /><Typography fontSize={12.5} color="#5a3a3d" fontWeight={600}>Free shipping on orders above ₹999 • Easy returns</Typography></Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Checkout;