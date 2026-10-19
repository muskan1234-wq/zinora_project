import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
Alert,
Avatar,
Box,
Button,
Card,
CardContent,
Chip,
CircularProgress,
Container,
Dialog,
DialogActions,
DialogContent,
DialogTitle,
Divider,
Grid,
IconButton,
MenuItem,
Paper,
Snackbar,
Stack,
Tab,
Tabs,
TextField,
Typography,
} from "@mui/material";

import Person from "@mui/icons-material/Person";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api/accounts";

const PROFILE_KEY = "zinoraCustomerProfile";
const ADDRESSES_KEY = "zinoraCustomerAddresses";


const INITIAL_PROFILE = {
first_name: "",
last_name: "",
email: "",
phone: "",
};

const INITIAL_ADDRESS = {
full_name: "",
phone: "",
address_line: "",
city: "",
state: "",
pincode: "",
landmark: "",
address_type: "Home",
is_default: false,
};

const tabs = [
{ label: "Overview", value: 0, icon: <DashboardOutlinedIcon /> },
{ label: "My Profile", value: 1, icon: <Person /> },
{ label: "My Addresses", value: 2, icon: <LocationOnOutlinedIcon /> },
{ label: "My Orders", value: 3, icon: <ShoppingBagOutlinedIcon /> },
];

const getToken = () => {
return (
localStorage.getItem("zinoraCustomerToken") ||
localStorage.getItem("authToken") ||
localStorage.getItem("token") ||
localStorage.getItem("zinoraAdminToken") ||
""
);
};

const getAuthHeaders = (includeJson = true) => {
const token = getToken();

const headers = {};

if (includeJson) {
headers["Content-Type"] = "application/json";
}

if (token) {
headers.Authorization = `Token ${token}`;
}

return headers;
};

const readJson = async (response) => {
const text = await response.text();

if (!text) return {};

try {
return JSON.parse(text);
} catch {
return { detail: text };
}
};

const request = async (url, options = {}) => {
const response = await fetch(url, {
...options,
headers: {
...getAuthHeaders(),
...(options.headers || {}),
},
});

const data = await readJson(response);

if (!response.ok) {
let message =
data.error ||
data.detail ||
data.message ||
"The request could not be completed.";


if (typeof message !== "string") {
  message = Object.entries(data)
    .map(([key, value]) => {
      const formatted = Array.isArray(value)
        ? value.join(", ")
        : typeof value === "string"
          ? value
          : JSON.stringify(value);

      return `${key}: ${formatted}`;
    })
    .join(" | ");
}

if (response.status === 401) {
  message = "Your session may have expired. Please log in again.";
}

throw new Error(message);


}

return data;
};

const getFullName = (profile) => {
const first = profile?.first_name || "";
const last = profile?.last_name || "";

return `${first} ${last}`.trim();
};

const formatDate = (value) => {
if (!value) return "Date unavailable";

const date = new Date(value);

if (Number.isNaN(date.getTime())) {
return value;
}

return date.toLocaleDateString("en-IN", {
day: "2-digit",
month: "short",
year: "numeric",
});
};

const formatCurrency = (value) => {
const amount = Number(value || 0);

return new Intl.NumberFormat("en-IN", {
style: "currency",
currency: "INR",
maximumFractionDigits: 2,
}).format(Number.isFinite(amount) ? amount : 0);
};

const getOrderId = (order) => {
return order?.order_number || order?.order_id || order?.id || "Order";
};

const getOrderStatus = (order) => {
return String(order?.status || "PLACED").toUpperCase();
};

const getPaymentStatus = (order) => {
return String(
order?.payment_status || order?.payment?.status || "PENDING"
).toUpperCase();
};

const getOrderTotal = (order) => {
return (
order?.total_amount ??
order?.total ??
order?.grand_total ??
order?.amount ??
0
);
};

const getOrderDate = (order) => {
return (
order?.created_at ||
order?.created ||
order?.order_date ||
order?.date ||
null
);
};

const getOrderItems = (order) => {
const items = order?.items || order?.order_items || [];

if (!Array.isArray(items)) return [];

return items;
};

const getAddressText = (address) => {
if (!address) return "Delivery address unavailable";

if (typeof address === "string") return address;

const parts = [
address.address_line,
address.address,
address.street,
address.landmark,
address.city,
address.state,
address.pincode,
address.postal_code,
].filter(Boolean);

return [...new Set(parts)].join(", ") || "Delivery address unavailable";
};

const statusColor = (status) => {
const value = String(status || "").toUpperCase();

if (["DELIVERED", "PAID", "COMPLETED"].includes(value)) {
return "success";
}

if (["CANCELLED", "FAILED", "REFUNDED"].includes(value)) {
return "error";
}

if (["SHIPPED", "PROCESSING", "CONFIRMED"].includes(value)) {
return "info";
}

return "warning";
};

const normaliseAddress = (address) => ({
...INITIAL_ADDRESS,
...address,
full_name:
address?.full_name ||
address?.name ||
"",
phone: address?.phone || "",
address_line:
address?.address_line ||
address?.address ||
address?.street ||
"",
city: address?.city || "",
state: address?.state || "",
pincode:
address?.pincode ||
address?.postal_code ||
"",
landmark: address?.landmark || "",
address_type:
address?.address_type ||
address?.label ||
"Home",
is_default: Boolean(address?.is_default),
});

export default function Profile() {
const navigate = useNavigate();

const [activeTab, setActiveTab] = useState(0);

const [profile, setProfile] = useState(INITIAL_PROFILE);
const [profileForm, setProfileForm] = useState(INITIAL_PROFILE);

const [addresses, setAddresses] = useState([]);
const [orders, setOrders] = useState([]);

const [loading, setLoading] = useState(true);
const [savingProfile, setSavingProfile] = useState(false);
const [savingAddress, setSavingAddress] = useState(false);

const [addressDialogOpen, setAddressDialogOpen] = useState(false);
const [editingAddressId, setEditingAddressId] = useState(null);
const [addressForm, setAddressForm] = useState(INITIAL_ADDRESS);

const [error, setError] = useState("");
const [snackbar, setSnackbar] = useState({
open: false,
message: "",
severity: "success",
});

const showMessage = useCallback((message, severity = "success") => {
setSnackbar({
open: true,
message,
severity,
});
}, []);

const closeSnackbar = () => {
setSnackbar((previous) => ({
...previous,
open: false,
}));
};

const loadProfile = useCallback(async () => {
const cached = localStorage.getItem(PROFILE_KEY);


if (cached) {
  try {
    const parsed = JSON.parse(cached);
    setProfile((previous) => ({ ...previous, ...parsed }));
    setProfileForm((previous) => ({ ...previous, ...parsed }));
  } catch {
    localStorage.removeItem(PROFILE_KEY);
  }
}

const data = await request(`${API_BASE}/customer-profile/`, {
  method: "GET",
});

const profileData = data.profile || data;

const nextProfile = {
  first_name: profileData.first_name || "",
  last_name: profileData.last_name || "",
  email: profileData.email || "",
  phone: profileData.phone || "",
  username: profileData.username || "",
  id: profileData.id,
  address: profileData.address || "",
};

setProfile(nextProfile);
setProfileForm(nextProfile);

localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile));


}, []);

const loadAddresses = useCallback(async () => {
const data = await request(`${API_BASE}/addresses/`, {
method: "GET",
});


const addressList = Array.isArray(data)
  ? data
  : data.addresses || data.results || [];

setAddresses(addressList.map(normaliseAddress));

// localStorage is only a cache; the API is the source of truth.
localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addressList));


}, []);
const loadOrders = useCallback(async () => {
  const token =
    localStorage.getItem("zinoraCustomerToken") ||
    localStorage.getItem("zinoraToken");

  if (!token) {
    setOrders([]);
    throw new Error("Please log in to view your orders.");
  }

  const response = await fetch(
    `${API_BASE}/customer/orders/`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
      },
    }
  );

  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        "Unable to load your orders."
    );
  }

  const orderList = Array.isArray(data)
    ? data
    : Array.isArray(data.orders)
      ? data.orders
      : Array.isArray(data.results)
        ? data.results
        : [];

  console.log("Customer orders:", orderList);

  setOrders(orderList);
}, []);

const loadDashboard = useCallback(async () => {
if (!getToken()) {
setError("Please log in to view your customer dashboard.");
setLoading(false);
return;
}


setLoading(true);
setError("");

const results = await Promise.allSettled([
  loadProfile(),
  loadAddresses(),
  loadOrders(),
]);

const failed = results.filter((result) => result.status === "rejected");

if (failed.length === results.length) {
  setError(
    failed[0]?.reason?.message ||
      "Unable to load your dashboard. Please try again."
  );
} else if (failed.length > 0) {
  const firstError = failed[0].reason?.message;

  showMessage(
    firstError || "Some dashboard information could not be loaded.",
    "warning"
  );
}

setLoading(false);


}, [loadProfile, loadAddresses, loadOrders, showMessage]);

useEffect(() => {
loadDashboard();
}, [loadDashboard]);

const fullName = useMemo(
() => getFullName(profile) || profile.username || "Customer",
[profile]
);

const totalOrders = orders.length;

const pendingOrders = orders.filter((order) =>
[
"PLACED",
"PENDING",
"CONFIRMED",
"PROCESSING",
"PACKED",
"SHIPPED",
"OUT_FOR_DELIVERY",
].includes(getOrderStatus(order))
).length;

const deliveredOrders = orders.filter(
(order) => getOrderStatus(order) === "DELIVERED"
).length;

const totalSpent = orders
.filter(
(order) =>
!["CANCELLED", "FAILED", "REFUNDED"].includes(
getOrderStatus(order)
)
)
.reduce((sum, order) => sum + Number(getOrderTotal(order) || 0), 0);

const handleProfileChange = (event) => {
const { name, value } = event.target;


setProfileForm((previous) => ({
  ...previous,
  [name]: value,
}));


};

const saveProfile = async (event) => {
event.preventDefault();


if (!profileForm.first_name.trim()) {
  showMessage("Please enter your first name.", "error");
  return;
}

if (!profileForm.email.trim()) {
  showMessage("Please enter your email address.", "error");
  return;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(profileForm.email.trim())) {
  showMessage("Please enter a valid email address.", "error");
  return;
}

setSavingProfile(true);

try {
  const payload = {
    first_name: profileForm.first_name.trim(),
    last_name: profileForm.last_name.trim(),
    email: profileForm.email.trim(),
    phone: profileForm.phone.trim(),
  };

  const data = await request(`${API_BASE}/customer-profile/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  const updated = {
    ...profile,
    ...payload,
    ...(data.profile || {}),
  };

  setProfile(updated);
  setProfileForm(updated);

  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));

  showMessage(
    data.message || "Profile updated successfully in the database."
  );
} catch (err) {
  showMessage(err.message || "Unable to save your profile.", "error");
} finally {
  setSavingProfile(false);
}


};

const openAddAddress = () => {
setEditingAddressId(null);


setAddressForm({
  ...INITIAL_ADDRESS,
  full_name: fullName,
  phone: profile.phone || "",
  is_default: addresses.length === 0,
});

setAddressDialogOpen(true);


};

const openEditAddress = (address) => {
setEditingAddressId(address.id);


setAddressForm(normaliseAddress(address));

setAddressDialogOpen(true);


};

const closeAddressDialog = () => {
if (savingAddress) return;


setAddressDialogOpen(false);
setEditingAddressId(null);
setAddressForm(INITIAL_ADDRESS);


};

const handleAddressChange = (event) => {
const { name, value, type, checked } = event.target;


setAddressForm((previous) => ({
  ...previous,
  [name]: type === "checkbox" ? checked : value,
}));


};

const saveAddress = async (event) => {
event.preventDefault();


const requiredFields = [
  ["full_name", "Full name"],
  ["phone", "Phone number"],
  ["address_line", "Address"],
  ["city", "City"],
  ["state", "State"],
  ["pincode", "PIN code"],
];

for (const [field, label] of requiredFields) {
  if (!String(addressForm[field] || "").trim()) {
    showMessage(`${label} is required.`, "error");
    return;
  }
}

const phoneDigits = addressForm.phone.replace(/\D/g, "");
const pinDigits = addressForm.pincode.replace(/\D/g, "");

if (phoneDigits.length < 10 || phoneDigits.length > 15) {
  showMessage("Please enter a valid phone number.", "error");
  return;
}

if (pinDigits.length !== 6) {
  showMessage("Please enter a valid 6-digit PIN code.", "error");
  return;
}

setSavingAddress(true);

try {
  const payload = {
    full_name: addressForm.full_name.trim(),
    phone: addressForm.phone.trim(),
    address_line: addressForm.address_line.trim(),
    city: addressForm.city.trim(),
    state: addressForm.state.trim(),
    pincode: addressForm.pincode.trim(),
    landmark: addressForm.landmark.trim(),
    address_type: addressForm.address_type,
    is_default: Boolean(addressForm.is_default),
  };

  const url = editingAddressId
    ? `${API_BASE}/addresses/${editingAddressId}/`
    : `${API_BASE}/addresses/`;

  const data = await request(url, {
    method: editingAddressId ? "PATCH" : "POST",
    body: JSON.stringify(payload),
  });

  // Backend returns the saved address from AddressSerializer.
  if (!data || !data.id) {
    throw new Error(
      "The address API did not return the saved address ID. Check AddressSerializer."
    );
  }

  await loadAddresses();

  setAddressDialogOpen(false);
  setEditingAddressId(null);
  setAddressForm(INITIAL_ADDRESS);

  showMessage(
    editingAddressId
      ? "Delivery address updated successfully."
      : "Delivery address saved successfully."
  );
} catch (err) {
  showMessage(err.message || "Unable to save your address.", "error");
} finally {
  setSavingAddress(false);
}


};

const deleteAddress = async (address) => {
if (!address?.id) {
showMessage("Address ID is missing.", "error");
return;
}


const confirmed = window.confirm(
  "Are you sure you want to delete this delivery address?"
);

if (!confirmed) return;

try {
  await request(`${API_BASE}/addresses/${address.id}/`, {
    method: "DELETE",
  });

  await loadAddresses();

  showMessage("Delivery address deleted successfully.");
} catch (err) {
  showMessage(err.message || "Unable to delete this address.", "error");
}


};

const setDefaultAddress = async (address) => {
if (!address?.id) return;


try {
  await request(`${API_BASE}/addresses/${address.id}/`, {
    method: "PATCH",
    body: JSON.stringify({ is_default: true }),
  });

  await loadAddresses();

  showMessage("Default delivery address updated.");
} catch (err) {
  showMessage(err.message || "Unable to update the default address.", "error");
}


};

const logout = () => {
[
"zinoraCustomerToken",
"zinoraCustomerRole",
"zinoraCustomerUsername",
"authToken",
"token",
].forEach((key) => localStorage.removeItem(key));


navigate("/login");


};

const renderStatCard = (title, value, icon, subtitle) => (
<Card
key={title}
sx={{
height: "100%",
borderRadius: 3,
border: "1px solid #eee4e6",
boxShadow: "0 4px 18px rgba(60,20,30,0.05)",
}}
>
<CardContent sx={{ p: 2.5 }}> <Stack
       direction="row"
       justifyContent="space-between"
       alignItems="flex-start"
       spacing={1}
     > <Box> <Typography color="text.secondary" variant="body2">
{title} </Typography>


        <Typography
          variant="h4"
          sx={{ mt: 1, fontWeight: 800, color: "#69101d" }}
        >
          {value}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.5 }}
        >
          {subtitle}
        </Typography>
      </Box>

      <Avatar
        sx={{
          bgcolor: "#f8ecee",
          color: "#69101d",
          width: 46,
          height: 46,
        }}
      >
        {icon}
      </Avatar>
    </Stack>
  </CardContent>
</Card>


);

const renderOrderCard = (order) => {
const items = getOrderItems(order);


const status = getOrderStatus(order);
const paymentStatus = getPaymentStatus(order);

const address =
  order.address ||
  order.delivery_address ||
  order.shipping_address;

return (
  <Card
    key={order.id || getOrderId(order)}
    sx={{
      mb: 2,
      borderRadius: 3,
      border: "1px solid #eee4e6",
      boxShadow: "0 4px 16px rgba(60,20,30,0.04)",
    }}
  >
    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Typography variant="h6" fontWeight={800}>
            {getOrderId(order)}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Ordered on {formatDate(getOrderDate(order))}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label={status.replaceAll("_", " ")}
            color={statusColor(status)}
            size="small"
          />

          <Chip
            label={`Payment: ${paymentStatus.replaceAll("_", " ")}`}
            color={statusColor(paymentStatus)}
            variant="outlined"
            size="small"
          />
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        Order Items
      </Typography>

      {items.length > 0 ? (
        <Stack spacing={1}>
          {items.map((item, index) => (
            <Stack
              key={item.id || index}
              direction="row"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography variant="body2">
                {item.product_name ||
                  item.name ||
                  item.product?.name ||
                  "Product"}
                {" × "}
                {item.quantity || 1}
              </Typography>

              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(
                  item.line_total ??
                    item.total ??
                    Number(item.unit_price ?? item.price ?? 0) *
                      Number(item.quantity || 1)
                )}
              </Typography>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Item details are not available for this order.
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOnOutlinedIcon
              sx={{ color: "#69101d", fontSize: 20 }}
            />

            <Typography variant="subtitle2" fontWeight={700}>
              Delivery Address
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, overflowWrap: "anywhere" }}
          >
            {getAddressText(address)}
          </Typography>
        </Box>

        <Box sx={{ minWidth: { sm: 160 }, textAlign: { sm: "right" } }}>
          <Typography variant="body2" color="text.secondary">
            Order Total
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: "#69101d", fontWeight: 800, mt: 0.5 }}
          >
            {formatCurrency(getOrderTotal(order))}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
        Delivery Progress
      </Typography>

      {renderTracking(status)}
    </CardContent>
  </Card>
);


};

function renderTracking(status) {
const stages = [
{ key: "PLACED", label: "Placed" },
{ key: "CONFIRMED", label: "Confirmed" },
{ key: "PROCESSING", label: "Processing" },
{ key: "SHIPPED", label: "Shipped" },
{ key: "DELIVERED", label: "Delivered" },
];


const aliases = {
  PENDING: "PLACED",
  PACKED: "PROCESSING",
  OUT_FOR_DELIVERY: "SHIPPED",
  COMPLETED: "DELIVERED",
};

const currentStatus = aliases[status] || status;

const currentIndex = stages.findIndex(
  (stage) => stage.key === currentStatus
);

if (["CANCELLED", "FAILED", "REFUNDED"].includes(status)) {
  return (
    <Alert severity="error">
      This order is {status.toLowerCase().replaceAll("_", " ")}.
    </Alert>
  );
}

return (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
      gap: { xs: 0.5, sm: 1 },
    }}
  >
    {stages.map((stage, index) => {
      const completed = currentIndex >= 0 && index <= currentIndex;

      return (
        <Box key={stage.key} sx={{ textAlign: "center", minWidth: 0 }}>
          <Box
            sx={{
              height: 5,
              borderRadius: 5,
              mb: 1,
              bgcolor: completed ? "#69101d" : "#e9e1e3",
            }}
          />

          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: "0.62rem", sm: "0.75rem" },
              color: completed ? "#69101d" : "text.secondary",
              fontWeight: completed ? 700 : 400,
              overflowWrap: "anywhere",
            }}
          >
            {stage.label}
          </Typography>
        </Box>
      );
    })}
  </Box>
);


}

const renderOverview = () => ( <Stack spacing={3}>
<Paper
sx={{
p: { xs: 2.5, sm: 4 },
borderRadius: 4,
color: "#fff",
background:
"linear-gradient(120deg, #500914 0%, #69101d 55%, #8b3441 100%)",
}}
>
<Stack
direction={{ xs: "column", sm: "row" }}
alignItems={{ xs: "flex-start", sm: "center" }}
spacing={2.5}
>
<Avatar
sx={{
width: 76,
height: 76,
bgcolor: "#fff",
color: "#69101d",
fontSize: 30,
fontWeight: 800,
}}
>
{fullName.charAt(0).toUpperCase()} </Avatar>


      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          WELCOME TO ZINORA
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
          Hello, {fullName}!
        </Typography>

        <Typography sx={{ opacity: 0.85, mt: 1 }}>
          Manage your account, addresses and jewellery orders in one place.
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<ShoppingBagOutlinedIcon />}
        onClick={() => navigate("/")}
        sx={{
          bgcolor: "#fff",
          color: "#69101d",
          fontWeight: 700,
          "&:hover": { bgcolor: "#f7e9eb" },
        }}
      >
        Continue Shopping
      </Button>
    </Stack>
  </Paper>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, minmax(0, 1fr))",
        lg: "repeat(4, minmax(0, 1fr))",
      },
      gap: 2,
    }}
  >
    {renderStatCard(
      "Total Orders",
      totalOrders,
      <ShoppingBagOutlinedIcon />,
      "Orders placed"
    )}

    {renderStatCard(
      "In Progress",
      pendingOrders,
      <PendingActionsOutlinedIcon />,
      "Not yet completed"
    )}

    {renderStatCard(
      "Delivered",
      deliveredOrders,
      <CheckCircleIcon />,
      "Successfully delivered"
    )}

    {renderStatCard(
      "Order Value",
      formatCurrency(totalSpent),
      <LocalShippingOutlinedIcon />,
      "Non-cancelled orders"
    )}
  </Box>

  <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      sx={{ mb: 2 }}
    >
      <Typography variant="h6" fontWeight={800}>
        Recent Orders
      </Typography>

      <Button onClick={() => setActiveTab(3)} size="small">
        View All
      </Button>
    </Stack>

    {orders.length === 0 ? (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <ShoppingBagOutlinedIcon
          sx={{ fontSize: 48, color: "#c8b6b9" }}
        />

        <Typography fontWeight={700} sx={{ mt: 1 }}>
          No orders yet
        </Typography>

        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
          Your placed orders will appear here.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ mt: 2, bgcolor: "#69101d" }}
        >
          Explore Products
        </Button>
      </Box>
    ) : (
      orders
        .slice()
        .sort(
          (a, b) =>
            new Date(getOrderDate(b) || 0) -
            new Date(getOrderDate(a) || 0)
        )
        .slice(0, 3)
        .map((order) => (
          <Box key={order.id || getOrderId(order)} sx={{ mb: 2 }}>
            {renderOrderCard(order)}
          </Box>
        ))
    )}
  </Paper>
</Stack>


);

const renderProfile = () => (
<Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
<Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
Personal Information </Typography>


  <Typography color="text.secondary" sx={{ mb: 3 }}>
    Update your details. Changes are saved to your account in the database.
  </Typography>

  <Box component="form" onSubmit={saveProfile}>
    <Grid container spacing={2.5}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="First Name"
          name="first_name"
          value={profileForm.first_name || ""}
          onChange={handleProfileChange}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Last Name"
          name="last_name"
          value={profileForm.last_name || ""}
          onChange={handleProfileChange}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={profileForm.email || ""}
          onChange={handleProfileChange}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={profileForm.phone || ""}
          onChange={handleProfileChange}
          inputProps={{ maxLength: 15 }}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          type="submit"
          variant="contained"
          disabled={savingProfile}
          sx={{
            mt: 1,
            px: 4,
            py: 1.25,
            bgcolor: "#69101d",
            "&:hover": { bgcolor: "#4f0b15" },
          }}
        >
          {savingProfile ? "Saving..." : "Save Changes"}
        </Button>
      </Grid>
    </Grid>
  </Box>
</Paper>


);

const renderAddresses = () => ( <Stack spacing={2.5}>
<Paper
sx={{
p: { xs: 2, sm: 3 },
borderRadius: 3,
}}
>
<Stack
direction={{ xs: "column", sm: "row" }}
justifyContent="space-between"
alignItems={{ xs: "flex-start", sm: "center" }}
spacing={2}
> <Box> <Typography variant="h5" fontWeight={800}>
My Delivery Addresses </Typography>


        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Manage the addresses you use for checkout.
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddAddress}
        sx={{ bgcolor: "#69101d", whiteSpace: "nowrap" }}
      >
        Add Address
      </Button>
    </Stack>
  </Paper>

  {addresses.length === 0 ? (
    <Paper sx={{ p: 5, textAlign: "center", borderRadius: 3 }}>
      <LocationOnOutlinedIcon
        sx={{ fontSize: 52, color: "#bfa9ad" }}
      />

      <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
        No delivery addresses
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Add an address to make checkout easier.
      </Typography>

      <Button
        onClick={openAddAddress}
        variant="contained"
        sx={{ mt: 2, bgcolor: "#69101d" }}
      >
        Add Your First Address
      </Button>
    </Paper>
  ) : (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      {addresses.map((address) => (
        <Card
          key={address.id}
          sx={{
            borderRadius: 3,
            border: address.is_default
              ? "1.5px solid #69101d"
              : "1px solid #eee4e6",
            boxShadow: "0 4px 18px rgba(60,20,30,0.04)",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ minWidth: 0 }}
              >
                <LocationOnOutlinedIcon sx={{ color: "#69101d" }} />

                <Typography variant="h6" fontWeight={800}>
                  {address.address_type || "Home"}
                </Typography>
              </Stack>

              {address.is_default && (
                <Chip
                  label="Default"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
            </Stack>

            <Typography fontWeight={700} sx={{ mt: 2 }}>
              {address.full_name}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {getAddressText(address)}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Phone: {address.phone}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
            >
              {!address.is_default ? (
                <Button
                  size="small"
                  onClick={() => setDefaultAddress(address)}
                >
                  Set as Default
                </Button>
              ) : (
                <Typography variant="caption" color="success.main">
                  Default delivery address
                </Typography>
              )}

              <Stack direction="row" spacing={0.5}>
                <IconButton
                  aria-label="Edit address"
                  onClick={() => openEditAddress(address)}
                  sx={{ color: "#69101d" }}
                >
                  <EditOutlinedIcon />
                </IconButton>

                <IconButton
                  aria-label="Delete address"
                  onClick={() => deleteAddress(address)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  )}

  <Dialog
    open={addressDialogOpen}
    onClose={closeAddressDialog}
    fullWidth
    maxWidth="sm"
  >
    <Box component="form" onSubmit={saveAddress}>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {editingAddressId ? "Edit Delivery Address" : "Add Delivery Address"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="full_name"
            value={addressForm.full_name}
            onChange={handleAddressChange}
            required
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={addressForm.phone}
            onChange={handleAddressChange}
            required
          />

          <TextField
            fullWidth
            label="Address"
            name="address_line"
            value={addressForm.address_line}
            onChange={handleAddressChange}
            multiline
            minRows={2}
            required
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={addressForm.city}
                onChange={handleAddressChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={addressForm.state}
                onChange={handleAddressChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PIN Code"
                name="pincode"
                value={addressForm.pincode}
                onChange={handleAddressChange}
                inputProps={{ maxLength: 6 }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Address Type"
                name="address_type"
                value={addressForm.address_type}
                onChange={handleAddressChange}
              >
                <MenuItem value="Home">Home</MenuItem>
                <MenuItem value="Work">Work</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Landmark (Optional)"
            name="landmark"
            value={addressForm.landmark}
            onChange={handleAddressChange}
          />

          <TextField
            fullWidth
            select
            label="Default Address"
            name="is_default"
            value={addressForm.is_default ? "yes" : "no"}
            onChange={(event) =>
              setAddressForm((previous) => ({
                ...previous,
                is_default: event.target.value === "yes",
              }))
            }
          >
            <MenuItem value="yes">Yes, use as default</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={closeAddressDialog} disabled={savingAddress}>
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={savingAddress}
          sx={{ bgcolor: "#69101d" }}
        >
          {savingAddress ? "Saving..." : "Save Address"}
        </Button>
      </DialogActions>
    </Box>
  </Dialog>
</Stack>


);

const renderOrders = () => ( <Stack spacing={2}>
<Paper
sx={{
p: { xs: 2, sm: 3 },
borderRadius: 3,
}}
>
<Stack
direction={{ xs: "column", sm: "row" }}
justifyContent="space-between"
alignItems={{ xs: "flex-start", sm: "center" }}
spacing={2}
> <Box> <Typography variant="h5" fontWeight={800}>
My Orders </Typography>


        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          View your order details, payment status and delivery progress.
        </Typography>
      </Box>

      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={loadDashboard}
        sx={{ borderColor: "#69101d", color: "#69101d" }}
      >
        Refresh
      </Button>
    </Stack>
  </Paper>

  {orders.length === 0 ? (
    <Paper sx={{ p: 5, textAlign: "center", borderRadius: 3 }}>
      <ShoppingBagOutlinedIcon
        sx={{ fontSize: 52, color: "#bfa9ad" }}
      />

      <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
        No orders found
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Once you place an order, its details will appear here.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{ mt: 2, bgcolor: "#69101d" }}
      >
        Start Shopping
      </Button>
    </Paper>
  ) : (
    orders
      .slice()
      .sort(
        (a, b) =>
          new Date(getOrderDate(b) || 0) -
          new Date(getOrderDate(a) || 0)
      )
      .map(renderOrderCard)
  )}
</Stack>


);

if (loading) {
return (
<Container maxWidth="xl" sx={{ py: 10 }}> <Stack alignItems="center" spacing={2}>
<CircularProgress sx={{ color: "#69101d" }} />


      <Typography color="text.secondary">
        Loading your dashboard...
      </Typography>
    </Stack>
  </Container>
);


}

if (error && !getToken()) {
return (
<Container maxWidth="sm" sx={{ py: 8 }}>
<Alert severity="warning" sx={{ mb: 2 }}>
{error} </Alert>


    <Button
      variant="contained"
      onClick={() => navigate("/login")}
      sx={{ bgcolor: "#69101d" }}
    >
      Go to Login
    </Button>
  </Container>
);


}

return (
<Box sx={{ bgcolor: "#fcf9f9", minHeight: "100vh", py: { xs: 3, md: 5 } }}> <Container maxWidth="xl">
<Stack
direction={{ xs: "column", sm: "row" }}
justifyContent="space-between"
alignItems={{ xs: "flex-start", sm: "center" }}
spacing={2}
sx={{ mb: 3 }}
> <Box>
<Typography
variant="h4"
sx={{
fontWeight: 900,
color: "#69101d",
fontSize: { xs: "1.8rem", sm: "2.2rem" },
}}
>
My Account </Typography>


        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Welcome back, {fullName}
        </Typography>
      </Box>

      <Button
        variant="outlined"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={logout}
      >
        Logout
      </Button>
    </Stack>

    {error && (
      <Alert
        severity="warning"
        sx={{ mb: 2 }}
        action={
          <Button color="inherit" size="small" onClick={loadDashboard}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    )}

    <Paper
      sx={{
        borderRadius: 3,
        mb: 3,
        overflow: "hidden",
        border: "1px solid #eee4e6",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          px: { xs: 1, sm: 2 },
          "& .MuiTab-root": {
            minHeight: 64,
            textTransform: "none",
            fontWeight: 700,
            fontSize: { xs: 0, sm: "0.875rem" },
            minWidth: { xs: 72, sm: 130 },
          },
          "& .Mui-selected": {
            color: "#69101d !important",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#69101d",
            height: 3,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            iconPosition="start"
            label={tab.label}
          />
        ))}
      </Tabs>
    </Paper>

    {activeTab === 0 && renderOverview()}
    {activeTab === 1 && renderProfile()}
    {activeTab === 2 && renderAddresses()}
    {activeTab === 3 && renderOrders()}

    <Box sx={{ textAlign: "center", mt: 5, pb: 2 }}>
      <Typography variant="caption" color="text.secondary">
        ZINORA · Your Style, Your Story
      </Typography>
    </Box>
  </Container>

  <Snackbar
    open={snackbar.open}
    autoHideDuration={4000}
    onClose={closeSnackbar}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert
      onClose={closeSnackbar}
      severity={snackbar.severity}
      variant="filled"
      sx={{ width: "100%" }}
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
</Box>


);
}
