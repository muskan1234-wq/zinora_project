import React, { useState } from "react";
import {
Alert,
Box,
Button,
Card,
CardContent,
CircularProgress,
Container,
Divider,
InputAdornment,
TextField,
Typography,
Chip,
Stack,
} from "@mui/material";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

const API_URL = "http://127.0.0.1:8000/api/accounts";

function ChatTrack() {
const [orderId, setOrderId] = useState("");
const [tracking, setTracking] = useState(null);
const [trackingError, setTrackingError] = useState("");
const [loading, setLoading] = useState(false);

const [chatMessage, setChatMessage] = useState("");
const [chatStatus, setChatStatus] = useState("");
const [chatLoading, setChatLoading] = useState(false);

// Get the customer authentication token.
const getToken = () => {
return (
localStorage.getItem("zinoraCustomerToken") ||
localStorage.getItem("zinoraToken") ||
localStorage.getItem("authToken") ||
localStorage.getItem("token") ||
localStorage.getItem("customerToken") ||
""
);
};

// Django TokenAuthentication uses "Token", not "Bearer".
const getHeaders = () => {
const token = getToken();


return {
  Accept: "application/json",
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Token ${token}` } : {}),
};


};

const readResponse = async (response) => {
return response.json().catch(() => ({}));
};

// Find the order belonging to the logged-in customer.
const handleTrackOrder = async () => {
const searchedOrderId = orderId.trim();


if (!searchedOrderId) {
  setTrackingError("Please enter your Order ID.");
  setTracking(null);
  return;
}

if (!getToken()) {
  setTrackingError("Please log in to track your order.");
  setTracking(null);
  return;
}

setLoading(true);
setTracking(null);
setTrackingError("");

try {
  /*
   * This endpoint should return:
   * { count: 1, orders: [...] }
   *
   * It must return only the logged-in customer's orders.
   */
  const response = await fetch(`${API_URL}/customer/orders/`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        "Unable to retrieve your orders. Please log in again."
    );
  }

  const orderList = Array.isArray(data)
    ? data
    : Array.isArray(data.orders)
    ? data.orders
    : Array.isArray(data.results)
    ? data.results
    : [];

  const normalize = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const foundOrder = orderList.find((order) => {
    const possibleIds = [
      order.order_id,
      order.order_number,
      order.order_code,
      order.id,
      order.pk,
    ];

    return possibleIds.some(
      (id) => normalize(id) === normalize(searchedOrderId)
    );
  });

  if (!foundOrder) {
    throw new Error(
      "Order not found in your account. Please check the Order ID."
    );
  }

  setTracking(foundOrder);
} catch (error) {
  setTrackingError(
    error.message || "Unable to track your order. Please try again."
  );
} finally {
  setLoading(false);
}


};

// Send a message to the Django backend.
const handleSendMessage = async () => {
const searchedOrderId = orderId.trim();
const message = chatMessage.trim();


if (!getToken()) {
  setChatStatus("Please log in to contact the Zinora admin team.");
  return;
}

if (!searchedOrderId) {
  setChatStatus("Please enter your Order ID first.");
  return;
}

if (!message) {
  setChatStatus("Please enter your question.");
  return;
}

setChatLoading(true);
setChatStatus("");

try {
  /*
   * Backend must implement this endpoint and save the message
   * in the database for the admin to see it.
   */
  const response = await fetch(`${API_URL}/chat/messages/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      order_id: searchedOrderId,
      message,
    }),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        "Message could not be sent. Please check the chat API."
    );
  }

  setChatMessage("");
  setChatStatus(
    "Your message was sent successfully to the Zinora admin team."
  );
} catch (error) {
  setChatStatus(
    error.message ||
      "Unable to send your message. Please try again later."
  );
} finally {
  setChatLoading(false);
}


};

const getOrderStatus = () => {
  return tracking?.status || "PLACED";
};

const getStatusLabel = (status) => {
  const labels = {
    PLACED: "Order Placed",
    CONFIRMED: "Confirmed",
    PACKED: "Packed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    RETURNED: "Returned",
  };

  return labels[status] || status;
};

const getDeliveryAddress = () => {
  const address = tracking?.delivery_address;

  if (!address || typeof address !== "object") {
    return "Delivery address not available";
  }

  return [
    address.address_line,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

const getMapUrl = () => {
  if (!tracking) return "";

  // Prefer actual delivery coordinates if the backend provides them.
  const latitude =
    tracking.current_latitude ?? tracking.latitude ?? tracking.lat;

  const longitude =
    tracking.current_longitude ?? tracking.longitude ?? tracking.lng;

  if (
    latitude !== undefined &&
    latitude !== null &&
    latitude !== "" &&
    longitude !== undefined &&
    longitude !== null &&
    longitude !== ""
  ) {
    return `https://www.google.com/maps?q=${encodeURIComponent(
      latitude
    )},${encodeURIComponent(longitude)}`;
  }

  // Otherwise, open the saved delivery address in Google Maps.
  const address = getDeliveryAddress();

  if (address && address !== "Delivery address not available") {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
  }

  return "";
};


return (
<Box
sx={{
minHeight: "100vh",
bgcolor: "#fffaf7",
py: { xs: 4, md: 7 },
}}
> <Container maxWidth="md">
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
ZINORA CUSTOMER CARE </Typography>


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

    {/* Order tracking */}
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

        <Typography sx={{ color: "#777", mb: 3, lineHeight: 1.8 }}>
          Enter the Order ID from your order details to check the latest
          status.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <TextField
          fullWidth
          label="Order ID"
          placeholder="Enter your Order ID"
          value={orderId}
          onChange={(event) => {
            setOrderId(event.target.value);
            setTrackingError("");
            setTracking(null);
            setChatStatus("");
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
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              { borderColor: "#a66b48" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#a66b48" },
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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
              sx={{ mb: 2 }}
            >
              <Typography
                sx={{ fontWeight: 700, color: "#29211e", fontSize: 18 }}
              >
                Order Details
              </Typography>

              <Chip
                label={getOrderStatus()}
                sx={{
                  bgcolor: "#f7e8df",
                  color: "#805035",
                  fontWeight: 700,
                }}
              />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Typography sx={{ mb: 1, color: "#555" }}>
              <strong>Order ID:</strong>{" "}
              {tracking.order_id ||
                tracking.order_number ||
                tracking.order_code ||
                tracking.id ||
                orderId}
            </Typography>

            <Typography sx={{ mb: 1, color: "#555" }}>
              <strong>Payment Status:</strong>{" "}
              {tracking.payment_status || "Not available"}
            </Typography>

            <Typography sx={{ mb: 1, color: "#555" }}>
              <strong>Tracking Number:</strong>{" "}
              {tracking.tracking_number || "Not available yet"}
            </Typography>

            <Typography sx={{ mb: 1, color: "#555" }}>
              <strong>Estimated Delivery:</strong>{" "}
              {tracking.estimated_delivery ||
                tracking.estimated_delivery_date ||
                "Not available yet"}
            </Typography>

           
<Typography sx={{ mb: 1, color: "#555" }}>
  <strong>Delivery Address:</strong>{" "}
  {getDeliveryAddress()}
</Typography>

<Typography sx={{ mb: 1, color: "#555" }}>
  <strong>Order Date:</strong>{" "}
  {tracking.created_at
    ? new Date(tracking.created_at).toLocaleDateString("en-IN")
    : "Not available"}
</Typography>

<Typography sx={{ mb: 1, color: "#555" }}>
  <strong>Current Status:</strong>{" "}
  {getStatusLabel(getOrderStatus())}
</Typography>

{tracking.updated_at && (
  <Typography sx={{ mb: 2, color: "#555" }}>
    <strong>Last Updated:</strong>{" "}
    {new Date(tracking.updated_at).toLocaleString("en-IN")}
  </Typography>
)}

{getMapUrl() ? (
  <Button
    variant="outlined"
    startIcon={<MapOutlinedIcon />}
    href={getMapUrl()}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      borderColor: "#a66b48",
      color: "#805035",
      textTransform: "none",
      "&:hover": {
        borderColor: "#805035",
        bgcolor: "#fdf3ed",
      },
    }}
  >
    View Delivery Address on Google Maps
  </Button>
) : (
  <Alert severity="info">
    Delivery address is not available for this order.
  </Alert>
)}




          </Box>
        )}
      </CardContent>
    </Card>

    {/* Contact admin */}
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
            <ChatOutlinedIcon sx={{ fontSize: 29, color: "#a66b48" }} />
          </Box>

          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#29211e" }}
            >
              Need Help?
            </Typography>

            <Typography sx={{ color: "#888", fontSize: 14 }}>
              Send a message to the Zinora admin team.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography
          sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}
        >
          Have a question about delivery, payment, cancellation, or your
          jewellery order? Enter your order ID and send your message.
        </Typography>

        <TextField
          fullWidth
          label="Order ID"
          placeholder="Enter your Order ID"
          value={orderId}
          onChange={(event) => {
            setOrderId(event.target.value);
            setChatStatus("");
          }}
          sx={{ mb: 2 }}
        />

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
              { borderColor: "#a66b48" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#a66b48" },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          startIcon={
            chatLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SendOutlinedIcon />
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
          {chatLoading ? "Sending Message..." : "Send Message to Admin"}
        </Button>

        {chatStatus && (
          <Alert
            severity={
              chatStatus.toLowerCase().includes("successfully")
                ? "success"
                : "info"
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
