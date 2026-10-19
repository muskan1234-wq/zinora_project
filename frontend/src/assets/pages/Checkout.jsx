import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";
const CART_KEY = "zinoraCart";

const getToken = () =>
  localStorage.getItem("zinoraCustomerToken") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("token");

const emptyAddress = {
  full_name: "",
  phone: "",
  email: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  address_type: "Home",
};

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

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
      const storedCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      setCartItems(
        Array.isArray(storedCart)
          ? storedCart.filter((item) => Number(item.quantity) > 0)
          : []
      );
    } catch {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    const loadAddresses = async () => {
      const token = getToken();

      if (!token) {
        setLoadingAddresses(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE}/api/products/addresses/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Please log in again to continue.");
          }

          throw new Error(
            "Saved addresses could not be loaded. You can enter a new address."
          );
        }

        const data = await response.json();

        const addresses = Array.isArray(data)
          ? data
          : data.results || data.addresses || [];

        setSavedAddresses(addresses);

        const defaultAddress = addresses.find(
          (item) => item.is_default
        );

        if (defaultAddress) {
          setSelectedAddressId(String(defaultAddress.id));

          setAddress({
            full_name: defaultAddress.full_name || "",
            phone: defaultAddress.phone || "",
            email: defaultAddress.email || "",
            address_line: defaultAddress.address_line || "",
            city: defaultAddress.city || "",
            state: defaultAddress.state || "",
            pincode: defaultAddress.pincode || "",
            landmark: defaultAddress.landmark || "",
            address_type: defaultAddress.address_type || "Home",
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, []);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum +
          Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const updateAddress = (event) => {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const selectSavedAddress = (event) => {
    const id = event.target.value;

    setSelectedAddressId(id);

    if (id === "new") {
      setAddress(emptyAddress);
      return;
    }

    const selected = savedAddresses.find(
      (item) => String(item.id) === id
    );

    if (!selected) return;

    setAddress({
      full_name: selected.full_name || "",
      phone: selected.phone || "",
      email: selected.email || "",
      address_line: selected.address_line || "",
      city: selected.city || "",
      state: selected.state || "",
      pincode: selected.pincode || "",
      landmark: selected.landmark || "",
      address_type: selected.address_type || "Home",
    });
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const token = getToken();

    if (!token) {
      setError("Please log in before placing an order.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your shopping cart is empty.");
      return;
    }

    const requiredFields = [
      ["full_name", "Full name"],
      ["phone", "Phone number"],
      ["address_line", "Delivery address"],
      ["city", "City"],
      ["state", "State"],
      ["pincode", "PIN code"],
    ];

    for (const [field, label] of requiredFields) {
      if (!String(address[field] || "").trim()) {
        setError(`Please enter ${label}.`);
        return;
      }
    }

    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }

    setPlacingOrder(true);

    try {
      /*
       * Backend must:
       * 1. Verify the logged-in customer.
       * 2. Validate product IDs and current prices from the database.
       * 3. Save the delivery address in MySQL.
       * 4. Create the order and order items.
       * 5. Return the created order details.
       */

      const response = await fetch(
        `${API_BASE}/api/products/checkout/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            address:
              selectedAddressId !== "new"
                ? {
                    id: Number(selectedAddressId),
                    ...address,
                  }
                : address,

            items: cartItems.map((item) => ({
              product: item.id,
              quantity: Number(item.quantity),
            })),

            payment_method: paymentMethod,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data.detail ||
          data.error ||
          data.message ||
          (typeof data === "object"
            ? Object.values(data).flat().join(" ")
            : "");

        throw new Error(
          message || "Unable to place your order."
        );
      }

      const order = data.order || data;

      if (!order.id && !order.order_number) {
        throw new Error(
          "The server did not return an order confirmation."
        );
      }

      const confirmation = {
        id: order.id || null,
        order_number: order.order_number || order.order_id || "",
        status: order.status || "PLACED",
        payment_method: order.payment_method || paymentMethod,
        total_amount:
          order.total_amount !== undefined
            ? Number(order.total_amount)
            : total,
        address: order.address || address,
        items: order.items || cartItems,
      };

      sessionStorage.setItem(
        "zinoraLastOrder",
        JSON.stringify(confirmation)
      );

      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event("zinoraCartUpdated"));

      navigate("/order-success", {
        replace: true,
        state: { order: confirmation },
      });
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Your shopping bag is empty
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            bgcolor: "#a66b48",
            "&:hover": { bgcolor: "#805035" },
          }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fffaf7", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/cart")}
          sx={{ color: "#805035", mb: 3 }}
        >
          Back to Cart
        </Button>

        <Typography
          variant="overline"
          sx={{
            color: "#a66b48",
            letterSpacing: 3,
            fontWeight: 700,
          }}
        >
          ZINORA CHECKOUT
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "#29211e",
            mb: 4,
            fontSize: { xs: 30, md: 40 },
          }}
        >
          Complete Your Order
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={placeOrder}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #eadbd2",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="h6" fontWeight={700} mb={1}>
                    1. Delivery Address
                  </Typography>

                  <Typography color="text.secondary" mb={3}>
                    Where should we deliver your jewellery?
                  </Typography>

                  {loadingAddresses ? (
                    <CircularProgress size={25} />
                  ) : (
                    <>
                      {savedAddresses.length > 0 && (
                        <FormControl sx={{ mb: 3, width: "100%" }}>
                          <Typography fontWeight={600} mb={1}>
                            Select a saved address
                          </Typography>

                          <RadioGroup
                            value={selectedAddressId}
                            onChange={selectSavedAddress}
                          >
                            {savedAddresses.map((item) => (
                              <FormControlLabel
                                key={item.id}
                                value={String(item.id)}
                                control={<Radio />}
                                label={`${item.full_name} — ${item.address_line}, ${item.city}`}
                              />
                            ))}

                            <FormControlLabel
                              value="new"
                              control={<Radio />}
                              label="Enter a new address"
                            />
                          </RadioGroup>
                        </FormControl>
                      )}

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            required
                            label="Full Name"
                            name="full_name"
                            value={address.full_name}
                            onChange={updateAddress}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="Mobile Number"
                            name="phone"
                            value={address.phone}
                            onChange={updateAddress}
                            inputProps={{ maxLength: 10 }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={address.email}
                            onChange={updateAddress}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            required
                            label="House No. / Street / Area"
                            name="address_line"
                            value={address.address_line}
                            onChange={updateAddress}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="City"
                            name="city"
                            value={address.city}
                            onChange={updateAddress}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="State"
                            name="state"
                            value={address.state}
                            onChange={updateAddress}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="PIN Code"
                            name="pincode"
                            value={address.pincode}
                            onChange={updateAddress}
                            inputProps={{ maxLength: 6 }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Landmark (Optional)"
                            name="landmark"
                            value={address.landmark}
                            onChange={updateAddress}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography fontWeight={600} mb={1}>
                            Address Type
                          </Typography>

                          <RadioGroup
                            row
                            name="address_type"
                            value={address.address_type}
                            onChange={updateAddress}
                          >
                            <FormControlLabel
                              value="Home"
                              control={<Radio />}
                              label="Home"
                            />

                            <FormControlLabel
                              value="Office"
                              control={<Radio />}
                              label="Office"
                            />
                          </RadioGroup>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card
                elevation={0}
                sx={{
                  mt: 3,
                  border: "1px solid #eadbd2",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    2. Payment Method
                  </Typography>

                  <RadioGroup
                    value={paymentMethod}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  >
                    <FormControlLabel
                      value="COD"
                      control={<Radio />}
                      label="Cash on Delivery (COD)"
                    />

                    <FormControlLabel
                      value="ONLINE"
                      control={<Radio />}
                      label="Online Payment"
                      disabled
                    />
                  </RadioGroup>

                  <Typography variant="body2" color="text.secondary">
                    Online payment will be available after a payment
                    gateway is integrated.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #eadbd2",
                  borderRadius: 3,
                  position: { md: "sticky" },
                  top: 20,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} mb={3}>
                    3. Order Summary
                  </Typography>

                  {cartItems.map((item, index) => (
                    <Box key={item.id}>
                      {index > 0 && <Divider sx={{ my: 2 }} />}

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={2}
                      >
                        <Box>
                          <Typography fontWeight={600}>
                            {item.name || item.title || "Jewellery Product"}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity}
                          </Typography>
                        </Box>

                        <Typography fontWeight={600}>
                          ₹
                          {money(
                            Number(item.price || 0) *
                              Number(item.quantity || 1)
                          )}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}

                  <Divider sx={{ my: 3 }} />

                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">
                        Subtotal
                      </Typography>

                      <Typography>₹{money(subtotal)}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">
                        Shipping
                      </Typography>

                      <Typography>
                        {shipping === 0 ? "FREE" : `₹${money(shipping)}`}
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight={800} fontSize={18}>
                        Total
                      </Typography>

                      <Typography
                        fontWeight={800}
                        fontSize={21}
                        color="#a66b48"
                      >
                        ₹{money(total)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Alert severity="info" sx={{ mt: 3 }}>
                    Please verify your delivery address before placing
                    your order.
                  </Alert>

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={placingOrder || loadingAddresses}
                    sx={{
                      mt: 3,
                      py: 1.6,
                      bgcolor: "#a66b48",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "#805035" },
                    }}
                  >
                    {placingOrder ? (
                      <CircularProgress size={23} color="inherit" />
                    ) : (
                      "Place Order"
                    )}
                  </Button>

                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                    mt={2}
                  >
                    <LockOutlinedIcon
                      sx={{ fontSize: 17, color: "#888" }}
                    />

                    <Typography variant="caption" color="text.secondary">
                      Secure checkout
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          mt={4}
        >
          <LocalShippingOutlinedIcon sx={{ color: "#a66b48" }} />

          <Typography variant="body2" color="text.secondary">
            Free shipping on orders of ₹999 or more
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default Checkout;