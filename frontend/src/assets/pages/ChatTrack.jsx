
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Divider,
  Chip,
} from "@mui/material";

import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

function ChatTrack() {
  const [orderId, setOrderId] = useState("");
  const [trackingMessage, setTrackingMessage] = useState("");

  const handleTrackOrder = () => {
    if (!orderId.trim()) {
      setTrackingMessage("Please enter your order ID.");
      return;
    }

    // Actual order tracking API can be connected here.
    setTrackingMessage(
      `Order ID: ${orderId.trim()} — Tracking service will be connected soon.`
    );
  };

  return (
    <Box sx={{ bgcolor: "#fffaf7", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="lg">
        {/* Page Heading */}
        <Box textAlign="center" sx={{ mb: 5 }}>
          <Typography
            sx={{
              color: "#a66b48",
              letterSpacing: 3,
              fontSize: 13,
              fontWeight: 600,
              mb: 1,
            }}
          >
            ZINORA CUSTOMER CARE
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#29211e",
              fontSize: { xs: 30, md: 42 },
              mb: 1.5,
            }}
          >
            Chat & Track
          </Typography>

          <Typography sx={{ color: "#777", fontSize: 15 }}>
            We're here to help you with your jewellery shopping journey.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Chat Card */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid #eadbd2",
                borderRadius: 3,
                bgcolor: "#fff",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    bgcolor: "#f7e8df",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                  }}
                >
                  <ChatOutlinedIcon
                    sx={{ fontSize: 30, color: "#a66b48" }}
                  />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Chat with Us
                </Typography>

                <Typography sx={{ color: "#777", mb: 3, lineHeight: 1.8 }}>
                  Need help choosing jewellery or have questions about your
                  order? Our customer support team is here to help.
                </Typography>

                <Divider sx={{ mb: 2.5 }} />

                <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
                  <SupportAgentIcon sx={{ color: "#a66b48" }} />

                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      Customer Support
                    </Typography>

                    <Typography variant="body2" sx={{ color: "#888" }}>
                      Get assistance with your queries.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ChatOutlinedIcon />}
                  onClick={() =>
                    window.alert(
                      "Customer chat will be available after connecting the chat service."
                    )
                  }
                  sx={{
                    bgcolor: "#a66b48",
                    py: 1.4,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#805035" },
                  }}
                >
                  Start a Chat
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Track Order Card */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid #eadbd2",
                borderRadius: 3,
                bgcolor: "#fff",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    bgcolor: "#f7e8df",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                  }}
                >
                  <LocalShippingOutlinedIcon
                    sx={{ fontSize: 30, color: "#a66b48" }}
                  />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Track Your Order
                </Typography>

                <Typography sx={{ color: "#777", mb: 3, lineHeight: 1.8 }}>
                  Check the latest status of your jewellery order using your
                  order ID.
                </Typography>

                <Divider sx={{ mb: 2.5 }} />

                <TextField
                  fullWidth
                  label="Enter Order ID"
                  placeholder="e.g. ZIN10001"
                  value={orderId}
                  onChange={(event) => {
                    setOrderId(event.target.value);
                    setTrackingMessage("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleTrackOrder();
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Inventory2OutlinedIcon sx={{ color: "#a66b48" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleTrackOrder}
                  sx={{
                    bgcolor: "#a66b48",
                    py: 1.4,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#805035" },
                  }}
                >
                  Track Order
                </Button>

                {trackingMessage && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      role="status"
                      aria-live="polite"
                      sx={{ color: "#805035", fontSize: 14 }}
                    >
                      {trackingMessage}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Order Journey */}
        <Box
          sx={{
            mt: 5,
            p: { xs: 3, md: 4 },
            bgcolor: "#fff",
            border: "1px solid #eadbd2",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}
          >
            Your Order Journey
          </Typography>

          <Typography
            sx={{ color: "#888", textAlign: "center", mb: 4, fontSize: 14 }}
          >
            Follow these steps from purchase to delivery.
          </Typography>

          <Grid container spacing={2}>
            {[
              { label: "Order Placed", number: "01" },
              { label: "Confirmed", number: "02" },
              { label: "Shipped", number: "03" },
              { label: "Out for Delivery", number: "04" },
              { label: "Delivered", number: "05" },
            ].map((step) => (
              <Grid item xs={6} sm={4} md={2.4} key={step.number}>
                <Box sx={{ textAlign: "center", p: 1 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      mx: "auto",
                      mb: 1.5,
                      borderRadius: "50%",
                      bgcolor: "#f7e8df",
                      color: "#a66b48",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    {step.number}
                  </Box>

                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                    {step.label}
                  </Typography>

                  <Chip
                    label="Order stage"
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: "#f8f3ef",
                      color: "#8b6b59",
                      fontSize: 10,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Help Section */}
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography sx={{ color: "#777", mb: 1 }}>
            Need more assistance?
          </Typography>

          <Typography sx={{ fontWeight: 600, color: "#a66b48" }}>
            Zinora — A special sparkle for every relationship ✨
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default ChatTrack;
