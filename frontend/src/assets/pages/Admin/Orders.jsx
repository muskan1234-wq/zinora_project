
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
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Change this URL if your Django orders endpoint is different.
const API_URL = "http://127.0.0.1:8000/api/orders/admin/";

const COLORS = {
  maroon: "#650c20",
  gold: "#c5a059",
  background: "#f7f5f2",
  border: "#e7e0dc",
  muted: "#777777",
};

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const normalizeStatus = (status) => {
  const value = String(status || "Pending").trim().toLowerCase();

  const statusMap = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    canceled: "Cancelled",
  };

  return statusMap[value] || "Pending";
};

const getStatusColor = (status) => {
  switch (normalizeStatus(status)) {
    case "Delivered":
      return "success";
    case "Processing":
      return "info";
    case "Shipped":
      return "primary";
    case "Confirmed":
      return "secondary";
    case "Cancelled":
      return "error";
    default:
      return "warning";
  }
};

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "₹0.00";
  }

  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getOrderId = (order) => {
  return (
    order.order_number ||
    order.order_id ||
    order.id ||
    "—"
  );
};

const getCustomerName = (order) => {
  if (order.customer_name) {
    return order.customer_name;
  }

  if (order.customer && typeof order.customer === "object") {
    const customer = order.customer;

    return (
      customer.name ||
      [customer.first_name, customer.last_name]
        .filter(Boolean)
        .join(" ") ||
      customer.username ||
      customer.email ||
      "Customer"
    );
  }

  return order.customer || "Customer";
};

const getOrderAmount = (order) => {
  return (
    order.total_amount ??
    order.total_price ??
    order.grand_total ??
    order.amount ??
    0
  );
};

const getPaymentStatus = (order) => {
  return (
    order.payment_status ||
    order.payment?.status ||
    "Pending"
  );
};

const getOrderDate = (order) => {
  return (
    order.created_at ||
    order.order_date ||
    order.created ||
    order.date ||
    null
  );
};

const getItemCount = (order) => {
  if (Array.isArray(order.items)) {
    return order.items.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0
    );
  }

  if (Array.isArray(order.order_items)) {
    return order.order_items.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0
    );
  }

  return Number(order.item_count || order.quantity || 0);
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch orders from the Django backend.
  const fetchOrders = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("zinoraAdminToken");

      if (!token) {
        throw new Error(
          "Admin token nahi mila. Please admin login dobara karein."
        );
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Admin access denied. Login aur backend permissions check karein."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.detail ||
            "Orders load nahi ho paaye. Backend API check karein."
        );
      }

      const orderList = Array.isArray(data)
        ? data
        : Array.isArray(data.orders)
        ? data.orders
        : Array.isArray(data.results)
        ? data.results
        : [];

      setOrders(orderList);
    } catch (err) {
      setError(err.message || "Orders load karte waqt error aaya.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update order status in the backend.
  const updateOrderStatus = async (order, newStatus) => {
    const token = localStorage.getItem("zinoraAdminToken");
    const orderId = order.id;

    if (!token) {
      setError("Admin token nahi mila. Please dobara login karein.");
      return;
    }

    if (orderId === undefined || orderId === null) {
      setError("Order ID nahi mila. Backend response check karein.");
      return;
    }

    const currentStatus = normalizeStatus(order.status);

    if (currentStatus === newStatus) {
      return;
    }

    if (
      currentStatus === "Cancelled" ||
      currentStatus === "Delivered"
    ) {
      setError(
        `Delivered ya Cancelled order ka status change karne ki permission backend mein check karein.`
      );
      return;
    }

    setUpdatingId(orderId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}${orderId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.detail ||
            "Order status update nahi hua. Backend PATCH API check karein."
        );
      }

      const updatedStatus = normalizeStatus(
        data.status || newStatus
      );

      setOrders((previousOrders) =>
        previousOrders.map((item) =>
          String(item.id) === String(orderId)
            ? { ...item, ...data, status: updatedStatus }
            : item
        )
      );

      setSuccess(
        `Order #${getOrderId(order)} status updated to ${updatedStatus}.`
      );
    } catch (err) {
      setError(
        err.message || "Order status update karte waqt error aaya."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Summary counts.
  const pendingCount = orders.filter(
    (order) => normalizeStatus(order.status) === "Pending"
  ).length;

  const processingCount = orders.filter((order) =>
    ["Confirmed", "Processing", "Shipped"].includes(
      normalizeStatus(order.status)
    )
  ).length;

  const deliveredCount = orders.filter(
    (order) => normalizeStatus(order.status) === "Delivered"
  ).length;

  // Search and status filter.
  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderStatus = normalizeStatus(order.status);

      const matchesStatus =
        statusFilter === "All" || orderStatus === statusFilter;

      const customerName = getCustomerName(order);

      const customerEmail =
        order.customer_email ||
        order.email ||
        order.customer?.email ||
        "";

      const searchableValues = [
        getOrderId(order),
        customerName,
        customerEmail,
        order.status,
        order.payment_status,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const summaryCards = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: <ShoppingCartIcon />,
      color: COLORS.maroon,
      background: "#f4e6e9",
    },
    {
      title: "Pending Orders",
      value: pendingCount,
      icon: <PendingActionsIcon />,
      color: "#b7791f",
      background: "#fff3d6",
    },
    {
      title: "Processing Orders",
      value: processingCount,
      icon: <LocalShippingIcon />,
      color: "#2563a6",
      background: "#e4effc",
    },
    {
      title: "Delivered Orders",
      value: deliveredCount,
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
        p: { xs: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: COLORS.maroon,
              fontWeight: 800,
              fontSize: { xs: "1.65rem", md: "2rem" },
            }}
          >
            Orders Management
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: COLORS.muted, mt: 0.7 }}
          >
            View customer orders and manage order processing.
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
            borderRadius: 2,
            px: 2.5,
            py: 1.1,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#4b0818",
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Messages */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {success}
        </Alert>
      )}

      {/* Summary cards */}
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
        {summaryCards.map((card) => (
          <Card
            key={card.title}
            elevation={0}
            sx={{
              border: `1px solid ${COLORS.border}`,
              borderRadius: 3,
              backgroundColor: "#fff",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: card.background,
                  color: card.color,
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>

                <Typography variant="h5" fontWeight={800}>
                  {card.value}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Orders table */}
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
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ color: COLORS.maroon, fontWeight: 800 }}
            >
              All Orders
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Showing {filteredOrders.length} of {orders.length} orders
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
          >
            <TextField
              size="small"
              placeholder="Search order or customer..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              sx={{
                minWidth: { sm: 260 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#fff",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: COLORS.muted }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#fff",
                }}
              >
                <MenuItem value="All">All Statuses</MenuItem>

                {ORDER_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: COLORS.border }} />

        {loading ? (
          <Box
            sx={{
              minHeight: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <CircularProgress sx={{ color: COLORS.maroon }} />

            <Typography color="text.secondary">
              Loading orders...
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 1150 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#faf7f5" }}>
                  {[
                    "Order ID",
                    "Customer",
                    "Order Date",
                    "Items",
                    "Total Amount",
                    "Payment",
                    "Order Status",
                    "Update Status",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        fontWeight: 800,
                        color: COLORS.maroon,
                        whiteSpace: "nowrap",
                        py: 2,
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
                    <TableCell colSpan={8}>
                      <Box
                        sx={{
                          py: 6,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <ShoppingCartIcon
                          sx={{ fontSize: 42, color: "#b5aaa5" }}
                        />

                        <Typography fontWeight={700}>
                          No orders found
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Orders will appear here when they are available
                          through your backend API.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order, index) => {
                    const orderId = getOrderId(order);
                    const status = normalizeStatus(order.status);
                    const paymentStatus = getPaymentStatus(order);
                    const updating =
                      String(updatingId) === String(order.id);

                    return (
                      <TableRow
                        hover
                        key={order.id ?? `${orderId}-${index}`}
                        sx={{
                          "&:last-child td": {
                            borderBottom: 0,
                          },
                        }}
                      >
                        <TableCell>
                          <Typography
                            fontWeight={800}
                            color={COLORS.maroon}
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            #{orderId}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ minWidth: 170 }}>
                          <Typography fontWeight={700} fontSize={14}>
                            {getCustomerName(order)}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {order.customer_email ||
                              order.email ||
                              order.customer?.email ||
                              "—"}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {formatDate(getOrderDate(order))}
                        </TableCell>

                        <TableCell>
                          {getItemCount(order)}
                        </TableCell>

                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          <Typography fontWeight={800}>
                            {formatCurrency(getOrderAmount(order))}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={paymentStatus}
                            color={
                              String(paymentStatus).toLowerCase() ===
                                "paid" ||
                              String(paymentStatus).toLowerCase() ===
                                "completed"
                                ? "success"
                                : "default"
                            }
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={status}
                            color={getStatusColor(status)}
                            variant="outlined"
                            sx={{
                              fontWeight: 700,
                              minWidth: 85,
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ minWidth: 190 }}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <FormControl
                              size="small"
                              sx={{ minWidth: 125 }}
                            >
                              <Select
                                value={status}
                                disabled={
                                  updating ||
                                  status === "Delivered" ||
                                  status === "Cancelled"
                                }
                                onChange={(event) =>
                                  updateOrderStatus(
                                    order,
                                    event.target.value
                                  )
                                }
                                sx={{
                                  borderRadius: 2,
                                  fontSize: 13,
                                  backgroundColor: "#fff",
                                }}
                              >
                                {ORDER_STATUSES.map((item) => (
                                  <MenuItem key={item} value={item}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {updating && (
                              <CircularProgress
                                size={18}
                                sx={{ color: COLORS.maroon }}
                              />
                            )}
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

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 2,
          color: COLORS.muted,
        }}
      >
        Order information and status updates are managed by the Django
        backend. Payment status should be updated only after verified
        payment confirmation.
      </Typography>
    </Box>
  );
}
