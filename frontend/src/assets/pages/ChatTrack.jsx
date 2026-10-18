
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";

function ChatTrack() {
  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState(null);
  const [trackingError, setTrackingError] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatMessage, setChatMessage] = useState("");
  const [chatStatus, setChatStatus] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Django backend API base URL
  const API_URL = "http://127.0.0.1:8000";

  // Track customer order
  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setTrackingError("Please enter your Order ID.");
      setTracking(null);
      return;
    }

    setLoading(true);
    setTracking(null);
    setTrackingError("");

    try {
      const token = localStorage.getItem("customerToken");

      const response = await fetch(
        `${API_URL}/api/orders/track/${encodeURIComponent(
          orderId.trim()
        )}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Order not found, or tracking is not available."
        );
      }

      setTracking(data);
    } catch (error) {
      setTrackingError(
        error.message ||
          "Unable to track your order. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Send customer message to admin
  const handleSendMessage = async () => {
    if (!orderId.trim()) {
      setChatStatus("Please enter your Order ID first.");
      return;
    }

    if (!chatMessage.trim()) {
      setChatStatus("Please enter your question.");
      return;
    }

    setChatLoading(true);
    setChatStatus("");

    try {
      const token = localStorage.getItem("customerToken");

      if (!token) {
        setChatStatus("Please log in to chat with the admin.");
        return;
      }

      const response = await fetch(`${API_URL}/api/chat/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: orderId.trim(),
          message: chatMessage.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Unable to send your message. Please try again."
        );
      }

      setChatMessage("");
      setChatStatus("Your message has been sent to the admin successfully.");
    } catch (error) {
      setChatStatus(
        error.message ||
          "Unable to connect to chat. Please try again later."
      );
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fffaf7",
        py: { xs: 4, md: 7 },
      }}
    >
      <Container maxWidth="md">
        {/* Page Heading */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            sx={{
              color: "#a66b48",
              letterSpacing: 3,
              fontSize: 13,
              fontWeight: 700,
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
            Track Your Order
          </Typography>

          <Typography sx={{ color: "#777", fontSize: 15 }}>
            Check your order status and get help with your jewellery order.
          </Typography>
        </Box>

        {/* Order Tracking Card */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #eadbd2",
            borderRadius: 3,
            bgcolor: "#fff",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                bgcolor: "#f7e8df",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
              }}
            >
              <LocalShippingOutlinedIcon
                sx={{ fontSize: 32, color: "#a66b48" }}
              />
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#29211e", mb: 1 }}
            >
              Where Is My Order?
            </Typography>

            <Typography
              sx={{ color: "#777", mb: 3, lineHeight: 1.8 }}
            >
              Enter the Order ID you received after placing your order to
              check its latest status.
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <TextField
              fullWidth
              label="Order ID"
              placeholder="e.g. ZIN10001"
              value={orderId}
              onChange={(event) => {
                setOrderId(event.target.value);
                setTrackingError("");
                setTracking(null);
                setChatStatus("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleTrackOrder();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Inventory2OutlinedIcon sx={{ color: "#a66b48" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#a66b48",
                  },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#a66b48",
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SearchIcon />
                )
              }
              onClick={handleTrackOrder}
              disabled={loading}
              sx={{
                bgcolor: "#a66b48",
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: 16,
                fontWeight: 600,
                "&:hover": { bgcolor: "#805035" },
              }}
            >
              {loading ? "Checking Order..." : "Track Order"}
            </Button>

            {trackingError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {trackingError}
              </Alert>
            )}

            {/* Actual order status from backend */}
            {tracking && (
              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  bgcolor: "#fffaf7",
                  border: "1px solid #eadbd2",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{ fontWeight: 700, color: "#29211e", mb: 2 }}
                >
                  Order Details
                </Typography>

                <Typography sx={{ mb: 1, color: "#555" }}>
                  <strong>Order ID:</strong>{" "}
                  {tracking.order_id || orderId}
                </Typography>

                <Typography sx={{ mb: 1, color: "#555" }}>
                  <strong>Order Status:</strong>{" "}
                  {tracking.status || tracking.order_status || "Unavailable"}
                </Typography>

                <Typography sx={{ mb: 1, color: "#555" }}>
                  <strong>Tracking Number:</strong>{" "}
                  {tracking.tracking_number || "Not available yet"}
                </Typography>

                <Typography sx={{ color: "#555" }}>
                  <strong>Estimated Delivery:</strong>{" "}
                  {tracking.estimated_delivery || "Not available yet"}
                </Typography>

                {tracking.current_location && (
                  <Typography sx={{ mt: 1, color: "#555" }}>
                    <strong>Current Location:</strong>{" "}
                    {tracking.current_location}
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Chat with Admin */}
        <Card
          elevation={0}
          sx={{
            mt: 4,
            border: "1px solid #eadbd2",
            borderRadius: 3,
            bgcolor: "#fff",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 55,
                  height: 55,
                  minWidth: 55,
                  borderRadius: "50%",
                  bgcolor: "#f7e8df",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChatOutlinedIcon
                  sx={{ fontSize: 29, color: "#a66b48" }}
                />
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#29211e" }}
                >
                  Need Help?
                </Typography>

                <Typography sx={{ color: "#888", fontSize: 14 }}>
                  Chat with our admin about your order.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
              Have a question about delivery, payment, cancellation, or your
              jewellery order? Send your message to the Zinora admin team.
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Write your question"
              placeholder="Hi, I have a question about my order..."
              value={chatMessage}
              onChange={(event) => {
                setChatMessage(event.target.value);
                setChatStatus("");
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#a66b48",
                  },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#a66b48",
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              startIcon={
                chatLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <ChatOutlinedIcon />
                )
              }
              onClick={handleSendMessage}
              disabled={chatLoading}
              sx={{
                bgcolor: "#a66b48",
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: 16,
                fontWeight: 600,
                "&:hover": { bgcolor: "#805035" },
              }}
            >
              {chatLoading ? "Sending Message..." : "Chat with Admin"}
            </Button>

            {chatStatus && (
              <Alert
                severity={
                  chatStatus.includes("successfully") ? "success" : "info"
                }
                sx={{ mt: 2 }}
              >
                {chatStatus}
              </Alert>
            )}
          </CardContent>
        </Card>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography sx={{ color: "#a66b48", fontWeight: 600 }}>
            Zinora — A special sparkle for every relationship ✨
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default ChatTrack;
