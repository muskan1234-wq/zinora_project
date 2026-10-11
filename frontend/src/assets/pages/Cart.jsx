
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Divider,
  Paper,
  Grid,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

const initialCartItems = [
  {
    id: 1,
    name: "Royal Gold Plated Jhumkas",
    category: "Earrings",
    price: 799,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
  },
  {
    id: 2,
    name: "Elegant Pearl Necklace",
    category: "Necklace",
    price: 1199,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
  },
];

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <Box sx={{ bgcolor: "#fffaf7", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="lg">
        {/* Page Heading */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            sx={{
              color: "#a66b48",
              letterSpacing: 3,
              fontSize: 12,
              fontWeight: 700,
              mb: 1,
            }}
          >
            YOUR PERSONAL COLLECTION
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#29211e",
              fontSize: { xs: 30, md: 42 },
              mb: 1,
            }}
          >
            Shopping Bag
          </Typography>

          <Typography sx={{ color: "#888" }}>
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            selected for you
          </Typography>
        </Box>

        {cartItems.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              py: 8,
              px: 3,
              border: "1px solid #eadbd2",
              borderRadius: 3,
            }}
          >
            <ShoppingBagOutlinedIcon
              sx={{ fontSize: 65, color: "#c5a38d", mb: 2 }}
            />

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Your bag is waiting for something beautiful
            </Typography>

            <Typography sx={{ color: "#888", mb: 3 }}>
              Explore our jewellery collection and find your favourite pieces.
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                bgcolor: "#a66b48",
                px: 4,
                py: 1.3,
                "&:hover": { bgcolor: "#805035" },
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #eadbd2",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Your Selected Pieces
                  </Typography>

                  {cartItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <Divider sx={{ my: 3 }} />}

                      <Grid container spacing={2} alignItems="center">
                        {/* Product Image */}
                        <Grid item xs={4} sm={3}>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              width: "100%",
                              height: { xs: 120, sm: 155 },
                              objectFit: "cover",
                              borderRadius: 2,
                              bgcolor: "#f5eee8",
                            }}
                          />
                        </Grid>

                        {/* Product Details */}
                        <Grid item xs={8} sm={9}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 1,
                            }}
                          >
                            <Box>
                              <Chip
                                label={item.category}
                                size="small"
                                sx={{
                                  bgcolor: "#f7e8df",
                                  color: "#a66b48",
                                  mb: 1,
                                  fontSize: 11,
                                }}
                              />

                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: { xs: 14, sm: 17 },
                                  mb: 1,
                                }}
                              >
                                {item.name}
                              </Typography>

                              <Typography
                                sx={{
                                  color: "#a66b48",
                                  fontWeight: 700,
                                  fontSize: 18,
                                }}
                              >
                                ₹{item.price.toLocaleString("en-IN")}
                              </Typography>
                            </Box>

                           <IconButton
  aria-label={`Remove ${item.name}`}
  onClick={() => removeItem(item.id)}
  sx={{
    color: "#999",
    alignSelf: "flex-start",
  }}
>
  <DeleteIcon />
</IconButton>
                          </Box>

                          {/* Quantity Controls */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 2,
                              gap: 1.5,
                            }}
                          >
                            <Typography
                              sx={{ fontSize: 13, color: "#777" }}
                            >
                              Qty:
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #e5d4c9",
                                borderRadius: 1,
                              }}
                            >
                              <IconButton
                                size="small"
                                aria-label="Decrease quantity"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>

                              <Typography
                                sx={{
                                  minWidth: 24,
                                  textAlign: "center",
                                  fontWeight: 600,
                                }}
                              >
                                {item.quantity}
                              </Typography>

                              <IconButton
                                size="small"
                                aria-label="Increase quantity"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            <Typography
                              sx={{
                                ml: "auto",
                                fontWeight: 700,
                                fontSize: 14,
                              }}
                            >
                              ₹
                              {(item.price * item.quantity).toLocaleString(
                                "en-IN"
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Box>
              </Paper>

              {/* Continue Shopping */}
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/")}
                sx={{
                  mt: 2,
                  color: "#a66b48",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Continue Shopping
              </Button>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid #eadbd2",
                  borderRadius: 3,
                  position: { md: "sticky" },
                  top: 20,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Order Summary
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ color: "#777" }}>
                    Subtotal
                  </Typography>

                  <Typography sx={{ fontWeight: 600 }}>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ color: "#777" }}>
                    Shipping
                  </Typography>

                  <Typography
                    sx={{
                      color: shipping === 0 ? "#54815a" : "#29211e",
                      fontWeight: 600,
                    }}
                  >
                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping.toLocaleString("en-IN")}`}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                    Total
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#a66b48",
                      fontSize: 20,
                    }}
                  >
                    ₹{total.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                {subtotal > 0 && subtotal < 999 && (
                  <Box
                    sx={{
                      bgcolor: "#f7e8df",
                      p: 1.5,
                      borderRadius: 2,
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 12, color: "#805035", lineHeight: 1.7 }}
                    >
                      Add ₹{(999 - subtotal).toLocaleString("en-IN")} more
                      to reach the free shipping threshold.
                    </Typography>
                  </Box>
                )}

                {subtotal >= 999 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "#edf5ec",
                      p: 1.5,
                      borderRadius: 2,
                      mb: 2,
                    }}
                  >
                    <LocalShippingOutlinedIcon
                      sx={{ color: "#54815a" }}
                    />

                    <Typography
                      sx={{ fontSize: 12, color: "#54815a" }}
                    >
                      Congratulations! You get free shipping.
                    </Typography>
                  </Box>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  disabled={cartItems.length === 0}
                  onClick={() =>
                    window.alert(
                      "Checkout page will be connected soon."
                    )
                  }
                  sx={{
                    mt: 1,
                    py: 1.5,
                    bgcolor: "#a66b48",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#805035" },
                    "&.Mui-disabled": {
                      bgcolor: "#d8c9c0",
                      color: "#fff",
                    },
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                    mt: 2.5,
                  }}
                >
                  <LockOutlinedIcon
                    sx={{ fontSize: 17, color: "#888" }}
                  />

                  <Typography
                    sx={{ color: "#888", fontSize: 12 }}
                  >
                    Secure checkout experience
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Cart;
