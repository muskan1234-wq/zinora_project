import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
Alert,
Box,
Button,
Card,
CardContent,
Chip,
CircularProgress,
Divider,
FormControl,
InputAdornment,
MenuItem,
Paper,
Select,
Stack,
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
TextField,
Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const API_URL = "http://127.0.0.1:8000/api/orders/admin/";

const COLORS = {
maroon: "#650c20",
gold: "#c5a059",
background: "#f7f5f2",
border: "#e7e0dc",
muted: "#777777",
};

const ORDER_STATUSES = [
{ value: "PLACED", label: "Placed" },
{ value: "CONFIRMED", label: "Confirmed" },
{ value: "PACKED", label: "Packed" },
{ value: "SHIPPED", label: "Shipped" },
{ value: "DELIVERED", label: "Delivered" },
{ value: "CANCELLED", label: "Cancelled" },
{ value: "RETURNED", label: "Returned" },
];

const normalizeStatus = (status) => {
const value = String(status || "PLACED").toUpperCase();

const legacyMap = {
PENDING: "PLACED",
PROCESSING: "PACKED",
};

return legacyMap[value] || value;
};

const getStatusLabel = (status) => {
const normalized = normalizeStatus(status);

return (
ORDER_STATUSES.find((item) => item.value === normalized)?.label ||
normalized
);
};

const getStatusColor = (status) => {
switch (normalizeStatus(status)) {
case "DELIVERED":
return "success";
case "SHIPPED":
return "info";
case "CONFIRMED":
return "secondary";
case "PACKED":
return "primary";
case "CANCELLED":
case "RETURNED":
return "error";
default:
return "warning";
}
};

const formatCurrency = (amount) =>
Number(amount || 0).toLocaleString("en-IN", {
style: "currency",
currency: "INR",
minimumFractionDigits: 2,
maximumFractionDigits: 2,
});

const formatDate = (value) => {
if (!value) return "—";

const date = new Date(value);

if (Number.isNaN(date.getTime())) return "—";

return date.toLocaleString("en-IN", {
day: "2-digit",
month: "short",
year: "numeric",
hour: "2-digit",
minute: "2-digit",
});
};

const getCustomerName = (order) => {
const customer = order.customer;

if (order.customer_name) return order.customer_name;

if (customer && typeof customer === "object") {
return (
customer.full_name ||
customer.name ||
[customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
customer.username ||
customer.email ||
"Customer"
);
}

return order.customer_username || "Customer";
};

const getCustomerEmail = (order) =>
order.customer_email ||
(typeof order.customer === "object" ? order.customer?.email : "") ||
"";

const getCustomerPhone = (order) => {
const customer = order.customer;

return (
order.customer_phone ||
order.address?.phone ||
(typeof customer === "object" ? customer?.phone : "") ||
""
);
};

const getAddressText = (order) => {
const address = order.address;

if (!address || typeof address !== "object") {
return typeof address === "string" ? address : "Address unavailable";
}

return [
address.full_name,
address.phone,
address.address_line1,
address.address_line2,
address.landmark,
address.city,
address.state,
address.postal_code || address.pincode,
address.country,
]
.filter(Boolean)
.join(", ");
};

const getOrderItems = (order) => {
if (Array.isArray(order.items)) return order.items;
if (Array.isArray(order.order_items)) return order.order_items;

return [];
};

const getItemsSummary = (order) => {
const items = getOrderItems(order);

if (items.length === 0) {
return order.item_count ? `${order.item_count} item(s)` : "Items unavailable";
}

return items
.map((item) => {
const name =
item.product_name ||
item.product?.name ||
item.name ||
"Product";


  return `${name} × ${item.quantity || 1}`;
})
.join(", ");


};

export default function Orders() {
const [orders, setOrders] = useState([]);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [updatingId, setUpdatingId] = useState(null);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const getToken = () =>
localStorage.getItem("zinoraAdminToken") ||
sessionStorage.getItem("zinoraAdminToken") ||
"";

const fetchOrders = useCallback(async (showLoader = true) => {
if (showLoader) setLoading(true);
else setRefreshing(true);


setError("");

try {
  const token =
    localStorage.getItem("zinoraAdminToken") ||
    sessionStorage.getItem("zinoraAdminToken");

  if (!token) {
    throw new Error("Admin token nahi mila. Dobara admin login karein.");
  }

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        `Orders API failed. Status: ${response.status}`
    );
  }

  const list = Array.isArray(data)
    ? data
    : data.orders || data.results || [];

  setOrders(Array.isArray(list) ? list : []);
} catch (err) {
  setError(err.message || "Orders load nahi ho paaye.");
} finally {
  setLoading(false);
  setRefreshing(false);
}


}, []);

useEffect(() => {
fetchOrders();


const timer = setInterval(() => {
  fetchOrders(false);
}, 15000);

return () => clearInterval(timer);


}, [fetchOrders]);

const updateOrderStatus = async (order, newStatus) => {
const token = getToken();


if (!token) {
  setError("Admin token nahi mila. Dobara login karein.");
  return;
}

if (!order.id) {
  setError("Order database ID response mein nahi mila.");
  return;
}

if (normalizeStatus(order.status) === newStatus) return;

setUpdatingId(order.id);
setError("");
setSuccess("");

try {
  const response = await fetch(`${API_URL}${order.id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        `Status update failed. Status: ${response.status}`
    );
  }

  setOrders((previous) =>
    previous.map((item) =>
      String(item.id) === String(order.id)
        ? { ...item, ...data, status: data.status || newStatus }
        : item
    )
  );

  setSuccess(
    `Order ${order.order_number || order.id} updated to ${getStatusLabel(
      data.status || newStatus
    )}.`
  );

  // Refresh from database to show the actual saved status.
  await fetchOrders(false);
} catch (err) {
  setError(err.message || "Order status update nahi hua.");
} finally {
  setUpdatingId(null);
}


};

const filteredOrders = useMemo(() => {
const query = search.trim().toLowerCase();


return orders.filter((order) => {
  const status = normalizeStatus(order.status);

  const matchesStatus =
    statusFilter === "ALL" || status === statusFilter;

  const searchable = [
    order.order_number,
    order.id,
    getCustomerName(order),
    getCustomerEmail(order),
    getCustomerPhone(order),
    getAddressText(order),
    order.payment_method,
    order.payment_status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return matchesStatus && (!query || searchable.includes(query));
});


}, [orders, search, statusFilter]);

const summary = [
{
title: "Total Orders",
value: orders.length,
icon: <ShoppingCartIcon />,
color: COLORS.maroon,
background: "#f4e6e9",
},
{
title: "Placed Orders",
value: orders.filter(
(order) => normalizeStatus(order.status) === "PLACED"
).length,
icon: <PendingActionsIcon />,
color: "#b7791f",
background: "#fff3d6",
},
{
title: "In Transit",
value: orders.filter((order) =>
["CONFIRMED", "PACKED", "SHIPPED"].includes(
normalizeStatus(order.status)
)
).length,
icon: <LocalShippingIcon />,
color: "#2563a6",
background: "#e4effc",
},
{
title: "Delivered",
value: orders.filter(
(order) => normalizeStatus(order.status) === "DELIVERED"
).length,
icon: <CheckCircleIcon />,
color: "#21834a",
background: "#e7f5ec",
},
];

return (
<Box
sx={{
minHeight: "100%",
backgroundColor: COLORS.background,
p: { xs: 1.5, md: 3 },
}}
>
<Stack
direction={{ xs: "column", sm: "row" }}
justifyContent="space-between"
alignItems={{ xs: "stretch", sm: "center" }}
spacing={2}
mb={3}
> <Box>
<Typography
variant="h4"
sx={{
color: COLORS.maroon,
fontWeight: 800,
fontSize: { xs: "1.5rem", md: "2rem" },
}}
>
Orders Management </Typography>


      <Typography color="text.secondary" mt={0.5}>
        View delivery details and manage customer orders.
      </Typography>
    </Box>

    <Button
      variant="contained"
      startIcon={
        refreshing ? (
          <CircularProgress size={17} color="inherit" />
        ) : (
          <RefreshIcon />
        )
      }
      onClick={() => fetchOrders(false)}
      disabled={loading || refreshing}
      sx={{
        backgroundColor: COLORS.maroon,
        textTransform: "none",
        fontWeight: 700,
        "&:hover": { backgroundColor: "#4b0818" },
      }}
    >
      Refresh Orders
    </Button>
  </Stack>

  {error && (
    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
      {error}
    </Alert>
  )}

  {success && (
    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
      {success}
    </Alert>
  )}

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, minmax(0, 1fr))",
        xl: "repeat(4, minmax(0, 1fr))",
      },
      gap: 2,
      mb: 3,
    }}
  >
    {summary.map((item) => (
      <Card
        key={item.title}
        elevation={0}
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              display: "grid",
              placeItems: "center",
              borderRadius: 2,
              color: item.color,
              backgroundColor: item.background,
            }}
          >
            {item.icon}
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              {item.title}
            </Typography>
            <Typography variant="h5" fontWeight={800}>
              {item.value}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>

  <Paper
    elevation={0}
    sx={{
      border: `1px solid ${COLORS.border}`,
      borderRadius: 3,
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        p: 2.5,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight={800} color={COLORS.maroon}>
          All Customer Orders
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Showing {filteredOrders.length} of {orders.length} orders
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextField
          size="small"
          placeholder="Search order, customer or address..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: { sm: 280 } }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            {ORDER_STATUSES.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>

    <Divider sx={{ borderColor: COLORS.border }} />

    {loading ? (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress sx={{ color: COLORS.maroon }} />
        <Typography mt={2} color="text.secondary">
          Loading orders...
        </Typography>
      </Box>
    ) : (
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 1500 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#faf7f5" }}>
              {[
                "Order ID",
                "Customer",
                "Delivery Address",
                "Order Date",
                "Items",
                "Total",
                "Payment Method",
                "Payment Status",
                "Order Status",
                "Update Status",
              ].map((heading) => (
                <TableCell
                  key={heading}
                  sx={{
                    fontWeight: 800,
                    color: COLORS.maroon,
                    whiteSpace: "nowrap",
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 7 }}>
                  <ShoppingCartIcon
                    sx={{ fontSize: 42, color: "#b5aaa5" }}
                  />
                  <Typography fontWeight={700} mt={1}>
                    No orders found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders will appear here when returned by the backend.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const status = normalizeStatus(order.status);
                const isUpdating =
                  String(updatingId) === String(order.id);

                return (
                  <TableRow hover key={order.id}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography fontWeight={800} color={COLORS.maroon}>
                        #{order.order_number || order.id}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ minWidth: 180 }}>
                      <Typography fontWeight={700}>
                        {getCustomerName(order)}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {getCustomerEmail(order) || "Email unavailable"}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {getCustomerPhone(order) || "Phone unavailable"}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ minWidth: 280, maxWidth: 360 }}>
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <LocationOnIcon
                          sx={{ color: COLORS.maroon, fontSize: 19, mt: 0.2 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "normal", lineHeight: 1.6 }}
                        >
                          {getAddressText(order)}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatDate(order.created_at || order.created)}
                    </TableCell>

                    <TableCell sx={{ minWidth: 220, whiteSpace: "normal" }}>
                      {getItemsSummary(order)}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography fontWeight={800}>
                        {formatCurrency(order.total_amount)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {String(order.payment_method || "—").toUpperCase()}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={order.payment_status || "PENDING"}
                        color={
                          String(order.payment_status).toUpperCase() === "PAID"
                            ? "success"
                            : String(order.payment_status).toUpperCase() === "FAILED"
                            ? "error"
                            : "default"
                        }
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={getStatusLabel(status)}
                        color={getStatusColor(status)}
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell sx={{ minWidth: 175 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FormControl size="small" fullWidth>
                          <Select
                            value={status}
                            disabled={isUpdating}
                            onChange={(event) =>
                              updateOrderStatus(order, event.target.value)
                            }
                          >
                            {ORDER_STATUSES.map((item) => (
                              <MenuItem
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        {isUpdating && <CircularProgress size={18} />}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Paper>

  <Typography variant="caption" display="block" mt={2} color="text.secondary">
    Orders, delivery addresses and status updates are loaded from the Django
    backend. Status changes must be saved successfully by the backend before
    they are considered complete.
  </Typography>
</Box>


);
}
