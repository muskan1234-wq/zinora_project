import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle"; 
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"; 
import LocalShippingIcon from "@mui/icons-material/LocalShipping" ;
import { useLocation, useNavigate } from "react-router-dom";

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(
    location.state?.order || null
  );

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);

      sessionStorage.setItem(
        "zinoraLastOrder",
        JSON.stringify(location.state.order)
      );

      return;
    }

    try {
      const storedOrder = JSON.parse(
        sessionStorage.getItem("zinoraLastOrder") || "null"
      );

      setOrder(storedOrder);
    } catch {
      setOrder(null);
    }
  }, [location.state]);

  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          No recent order found
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Please check your orders in your customer profile.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/profile")}
          sx={{
            bgcolor: "#a66b48",
            "&:hover": { bgcolor: "#805035" },
          }}
        >
          Go to My Profile
        </Button>
      </Container>
    );
  }

  const address = order.address || {};
  const items = order.items || [];

  const orderNumber =
    order.order_number || order.order_id || order.id || "Confirmed";

  const status = order.status || "PLACED";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fffaf7",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Card
          elevation={0}
          sx={{
            border: "1px solid #eadbd2",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 4, md: 6 },
              px: 2,
              bgcolor: "#f8eee8",
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 75,
                color: "#54815a",
                mb: 2,
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#29211e",
                fontSize: { xs: 27, md: 36 },
              }}
            >
              Order Placed Successfully!
            </Typography>

            <Typography color="text.secondary" mt={2}>
              Thank you for shopping with Zinora.
            </Typography>

            <Typography color="text.secondary">
              Your order has been received.
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={2}
              mb={3}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Order Number
                </Typography>

                <Typography variant="h6" fontWeight={800}>
                  #{orderNumber}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Order Status
                </Typography>

                <Chip
                  label={status}
                  sx={{
                    mt: 0.5,
                    bgcolor: "#edf5ec",
                    color: "#3d7044",
                    fontWeight: 700,
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Payment Method
                </Typography>

                <Typography fontWeight={700} mt={0.5}>
                  {order.payment_method === "COD"
                    ? "Cash on Delivery"
                    : order.payment_method || "COD"}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              mb={2}
            >
              <LocalShippingIcon sx={{ color: "#a66b48" }} />

              <Typography variant="h6" fontWeight={700}>
                Delivery Address
              </Typography>
            </Stack>

            <Box
              sx={{
                p: 2,
                bgcolor: "#fffaf7",
                border: "1px solid #eadbd2",
                borderRadius: 2,
              }}
            >
              <Typography fontWeight={700}>
                {address.full_name || "Customer"}
              </Typography>

              <Typography sx={{ mt: 0.5, overflowWrap: "anywhere" }}>
                {address.address_line || address.address || ""}
              </Typography>

              <Typography>
                {[address.city, address.state, address.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </Typography>

              {address.landmark && (
                <Typography color="text.secondary">
                  Landmark: {address.landmark}
                </Typography>
              )}

              {address.phone && (
                <Typography mt={1}>
                  Mobile: {address.phone}
                </Typography>
              )}
            </Box>

            <Typography variant="h6" fontWeight={700} mt={4} mb={2}>
              Order Items
            </Typography>

            {items.length > 0 ? (
              items.map((item, index) => {
                const name =
                  item.name ||
                  item.product_name ||
                  item.product?.name ||
                  "Jewellery Product";

                const quantity = Number(item.quantity || 1);

                const price = Number(
                  item.price ??
                    item.unit_price ??
                    item.product?.price ??
                    0
                );

                return (
                  <Box key={item.id || index}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Box>
                        <Typography fontWeight={600}>
                          {name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Quantity: {quantity}
                        </Typography>
                      </Box>

                      <Typography fontWeight={700}>
                        ₹{money(price * quantity)}
                      </Typography>
                    </Stack>
                  </Box>
                );
              })
            ) : (
              <Typography color="text.secondary">
                Your order details are available in My Orders.
              </Typography>
            )}

            <Divider sx={{ my: 3 }} />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight={800}>
                Order Total
              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                sx={{ color: "#a66b48" }}
              >
                ₹{money(order.total_amount)}
              </Typography>
            </Stack>

            {order.payment_method === "COD" && (
              <Typography color="text.secondary" variant="body2" mt={2}>
                Please pay when your order is delivered.
              </Typography>
            )}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              mt={4}
            >
              <Button
                fullWidth
                variant="contained"
                startIcon={<ShoppingBagIcon />}
                onClick={() => navigate("/")}
                sx={{
                  py: 1.4,
                  bgcolor: "#a66b48",
                  "&:hover": { bgcolor: "#805035" },
                }}
              >
                Continue Shopping
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/profile", {
                  state: { tab: "orders" },
                })}
                sx={{
                  py: 1.4,
                  borderColor: "#a66b48",
                  color: "#805035",
                }}
              >
                View My Orders
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default OrderSuccess;