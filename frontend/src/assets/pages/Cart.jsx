import React, { useEffect, useState } from "react";
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

const API_BASE = "http://127.0.0.1:8000";
const CART_KEY = "zinoraCart";

const getImageUrl = (image) => {
if (!image) return "";

if (
image.startsWith("http://") ||
image.startsWith("https://") ||
image.startsWith("data:")
) {
return image;
}

return `${API_BASE}/${image.replace(/^\/+/, "")}`;
};

const normalizeCartItem = (item) => ({
...item,
id: item.id,
name: item.name || item.title || "Jewellery Product",
category:
item.category_name ||
(typeof item.category === "string" ? item.category : "") ||
"Jewellery",
price: Number(item.price || 0),
quantity: Math.max(1, Number(item.quantity || 1)),
image: getImageUrl(item.image || item.image_url || ""),
});

const readCart = () => {
try {
const savedCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");


if (!Array.isArray(savedCart)) return [];

return savedCart.map(normalizeCartItem);


} catch (error) {
console.error("Unable to read cart:", error);
return [];
}
};

function Cart() {
const navigate = useNavigate();

const [cartItems, setCartItems] = useState(readCart);

// Load cart whenever this page opens or cart changes elsewhere.
useEffect(() => {
const loadCart = () => {
setCartItems(readCart());
};


window.addEventListener("storage", loadCart);
window.addEventListener("focus", loadCart);
window.addEventListener("zinoraCartUpdated", loadCart);

return () => {
  window.removeEventListener("storage", loadCart);
  window.removeEventListener("focus", loadCart);
  window.removeEventListener("zinoraCartUpdated", loadCart);
};


}, []);

// Save cart changes.
const saveCart = (updatedCart) => {
const normalizedCart = updatedCart.map(normalizeCartItem);


localStorage.setItem(CART_KEY, JSON.stringify(normalizedCart));
setCartItems(normalizedCart);

window.dispatchEvent(new Event("zinoraCartUpdated"));


};

const updateQuantity = (id, change) => {
const updatedCart = cartItems
.map((item) => {
if (String(item.id) !== String(id)) return item;


    return {
      ...item,
      quantity: Number(item.quantity || 1) + change,
    };
  })
  .filter((item) => item.quantity > 0);

saveCart(updatedCart);


};

const removeItem = (id) => {
const updatedCart = cartItems.filter(
(item) => String(item.id) !== String(id)
);


saveCart(updatedCart);


};

const subtotal = cartItems.reduce(
(total, item) => total + item.price * item.quantity,
0
);

const shipping =
subtotal === 0 || subtotal >= 999 ? 0 : 99;

const total = subtotal + shipping;

const totalItems = cartItems.reduce(
(sum, item) => sum + item.quantity,
0
);

return (
<Box
sx={{
bgcolor: "#fffaf7",
minHeight: "100vh",
py: { xs: 3, md: 5 },
}}
> <Container maxWidth="lg">
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
YOUR PERSONAL COLLECTION </Typography>


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
        {totalItems} {totalItems === 1 ? "item" : "items"} selected
        for you
      </Typography>
    </Box>

    {/* Empty Cart */}
    {cartItems.length === 0 ? (
      <Paper
        elevation={0}
        sx={{
          textAlign: "center",
          py: 8,
          px: 3,
          border: "1px solid #eadbd2",
          borderRadius: 3,
          bgcolor: "#fff",
        }}
      >
        <ShoppingBagOutlinedIcon
          sx={{
            fontSize: 65,
            color: "#c5a38d",
            mb: 2,
          }}
        />

        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 1 }}
        >
          Your bag is waiting for something beautiful
        </Typography>

        <Typography sx={{ color: "#888", mb: 3 }}>
          Explore our jewellery collection and find your favourite
          pieces.
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
              bgcolor: "#fff",
            }}
          >
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 2 }}
              >
                Your Selected Pieces
              </Typography>

              {cartItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <Divider sx={{ my: 3 }} />}

                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                  >
                    {/* Product Image */}
                    <Grid item xs={4} sm={3}>
                      {item.image ? (
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          onError={(event) => {
                            event.currentTarget.style.visibility =
                              "hidden";
                          }}
                          sx={{
                            display: "block",
                            width: "100%",
                            height: { xs: 120, sm: 155 },
                            objectFit: "cover",
                            borderRadius: 2,
                            bgcolor: "#f5eee8",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: { xs: 120, sm: 155 },
                            borderRadius: 2,
                            bgcolor: "#f5eee8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ShoppingBagOutlinedIcon
                            sx={{
                              fontSize: 40,
                              color: "#c5a38d",
                            }}
                          />
                        </Box>
                      )}
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
                        <Box sx={{ minWidth: 0 }}>
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
                              overflowWrap: "anywhere",
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
                          gap: 1,
                          flexWrap: "wrap",
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
                            onClick={() =>
                              updateQuantity(item.id, -1)
                            }
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
                            onClick={() =>
                              updateQuantity(item.id, 1)
                            }
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
                          {(
                            item.price * item.quantity
                          ).toLocaleString("en-IN")}
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
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3 }}
            >
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
              <Typography
                sx={{ fontWeight: 700, fontSize: 17 }}
              >
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
                  sx={{
                    fontSize: 12,
                    color: "#805035",
                    lineHeight: 1.7,
                  }}
                >
                  Add ₹
                  {(999 - subtotal).toLocaleString("en-IN")} more
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
