
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  ShoppingBagOutlined,
  CurrencyRupee,
  Inventory2Outlined,
  People,
  PendingActionsOutlined,
  LocalShippingOutlined,
  CheckCircle,
  WarningAmberOutlined,
  RefreshOutlined,
  ArrowForwardOutlined,
  ShoppingCartOutlined,
  TrendingUpOutlined,
  ErrorOutlineOutlined,
} from "@mui/icons-material";

const MAROON = "#650c20";

const GOLD = "#c5a059";
const BG = "#faf7f5";
const TEXT = "#39272b";
const MUTED = "#897b7e";
const BORDER = "#eee5e2";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const API_URLS = {
  orders: `${API_BASE}/api/orders/admin/`,
  products: `${API_BASE}/api/products/`,
  customers: `${API_BASE}/api/accounts/admin/customers/`,
};

const getToken = () =>
  localStorage.getItem("zinoraAdminToken") ||
  sessionStorage.getItem("zinoraAdminToken") ||
  "";

const getArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getNumber = (value) => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
};

const formatMoney = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(getNumber(value));

const getOrderStatus = (order) =>
  String(order?.status || order?.order_status || "Pending").toLowerCase();

const getOrderNumber = (order) =>
  order?.order_number ||
  order?.order_id ||
  order?.orderId ||
  (order?.id != null ? `#${order.id}` : "—");

const getCustomerName = (order) => {
  const customer = order?.customer_detail || order?.customer;

  if (typeof customer === "string") return customer;

  return (
    order?.customer_name ||
    customer?.full_name ||
    customer?.name ||
    customer?.username ||
    customer?.email ||
    "Customer"
  );
};

const getOrderAmount = (order) =>
  getNumber(
    order?.total_amount ??
      order?.total ??
      order?.amount ??
      order?.grand_total ??
      0
  );

const getProductStock = (product) =>
  getNumber(
    product?.stock_quantity ??
      product?.stock ??
      product?.quantity ??
      0
  );

const getProductName = (product) =>
  product?.name || product?.product_name || "Unnamed Product";

const getProductActive = (product) =>
  product?.is_active ?? product?.status ?? true;

const isActiveProduct = (product) => {
  const value = getProductActive(product);

  return !(
    value === false ||
    value === 0 ||
    value === "false" ||
    value === "inactive" ||
    value === "Inactive"
  );
};

const getDate = (order) => {
  const dateValue =
    order?.created_at || order?.created || order?.order_date;

  if (!dateValue) return "—";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusColor = (status) => {
  const value = String(status || "").toLowerCase();

  if (["delivered", "completed", "success", "paid"].includes(value)) {
    return "success";
  }

  if (["cancelled", "failed", "rejected", "returned"].includes(value)) {
    return "error";
  }

  if (["shipped", "packed", "confirmed", "processing"].includes(value)) {
    return "info";
  }

  return "warning";
};

const statCardStyle = {
  height: "100%",
  minHeight: 145,
  border: `1px solid ${BORDER}`,
  borderRadius: 3,
  boxShadow: "0 3px 14px rgba(55, 20, 30, 0.04)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 8px 24px rgba(55, 20, 30, 0.09)",
  },
};

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = MAROON,
  iconBg = "#f8e9ed",
  onClick,
  loading,
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        ...statCardStyle,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <CardContent
        sx={{
          p: 2.2,
          "&:last-child": { pb: 2.2 },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1.5}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                color: MUTED,
                fontSize: 12,
                fontWeight: 600,
                mb: 1.5,
              }}
            >
              {title}
            </Typography>

            {loading ? (
              <CircularProgress
                size={22}
                sx={{ color: MAROON, my: 0.5 }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: 21, sm: 24 },
                  fontWeight: 800,
                  color: TEXT,
                  lineHeight: 1.25,
                  overflowWrap: "anywhere",
                }}
              >
                {value}
              </Typography>
            )}

            <Typography
              sx={{
                color: MUTED,
                fontSize: 11,
                mt: 1.2,
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 43,
              height: 43,
              flexShrink: 0,
              borderRadius: 2.5,
              bgcolor: iconBg,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function EmptyOrders() {
  return (
    <Box sx={{ textAlign: "center", py: 6, px: 2 }}>
      <ShoppingBagOutlined
        sx={{ fontSize: 42, color: "#d5c6c5", mb: 1 }}
      />

      <Typography sx={{ fontWeight: 700, color: TEXT }}>
        No orders available
      </Typography>

      <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.7 }}>
        New customer orders will appear here.
      </Typography>
    </Box>
  );
}

export default function DashboardHome() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const token = getToken();

        if (!token) {
          throw new Error(
            "Admin login token nahi mila. Please admin login dobara karein."
          );
        }

        const headers = {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        };

        const fetchResource = async (url, resourceName) => {
          const response = await fetch(url, {
            method: "GET",
            headers,
          });

          if (response.status === 401) {
            throw new Error(
              "Admin session invalid ya expired hai. Dobara login karein."
            );
          }

          if (response.status === 403) {
            throw new Error(
              `${resourceName} dekhne ki permission nahi hai.`
            );
          }

          if (!response.ok) {
            throw new Error(
              `${resourceName} API error (${response.status}). URL check karein: ${url}`
            );
          }

          return response.json();
        };

        const [ordersData, productsData, customersData] =
          await Promise.all([
            fetchResource(API_URLS.orders, "Orders"),
            fetchResource(API_URLS.products, "Products"),
            fetchResource(API_URLS.customers, "Customers"),
          ]);

        setOrders(getArray(ordersData));
        setProducts(getArray(productsData));
        setCustomers(getArray(customersData));
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Dashboard data error:", err);

        setError(
          err.message ||
            "Dashboard data load nahi ho paya. Django server aur API URLs check karein."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Dashboard statistics
  const totalOrders = orders.length;

  const totalRevenue = orders
    .filter((order) => {
      const status = getOrderStatus(order);
      const paymentStatus = String(
        order?.payment_status || ""
      ).toLowerCase();

      // Revenue mein cancelled/refunded orders count nahi honge.
      if (["cancelled", "returned", "refunded"].includes(status)) {
        return false;
      }

      if (paymentStatus === "refunded") return false;

      return true;
    })
    .reduce((sum, order) => sum + getOrderAmount(order), 0);

  const totalProducts = products.length;
  const totalCustomers = customers.length;

  const pendingOrders = orders.filter((order) =>
    ["pending", "placed", "processing"].includes(getOrderStatus(order))
  ).length;

  const deliveredOrders = orders.filter((order) =>
    ["delivered", "completed"].includes(getOrderStatus(order))
  ).length;

  const lowStockProducts = products.filter((product) => {
    const stock = getProductStock(product);
    return isActiveProduct(product) && stock >= 0 && stock <= 10;
  }).length;

  const activeProducts = products.filter(isActiveProduct).length;

  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(
        a?.created_at || a?.created || a?.order_date || 0
      ).getTime();

      const dateB = new Date(
        b?.created_at || b?.created || b?.order_date || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 6);

  // Important: navigate inside the admin dashboard.
  const openOrders = () => navigate("/admin/dashboard/orders");
  const openProducts = () => navigate("/admin/dashboard/products");
  const openCustomers = () => navigate("/admin/dashboard/customers");
  const openPayments = () => navigate("/admin/dashboard/payments");

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        bgcolor: BG,
        p: { xs: 1.5, sm: 2.5, md: 3 },
        borderRadius: 3,
      }}
    >
      {/* Dashboard heading — no extra Admin Panel heading */}
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
            component="h1"
            sx={{
              fontSize: { xs: 23, md: 29 },
              fontWeight: 800,
              color: MAROON,
              lineHeight: 1.3,
            }}
          >
            Dashboard Overview
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: MUTED,
              mt: 0.7,
            }}
          >
            Welcome back! Here is your Zinora store summary.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={
            refreshing ? (
              <CircularProgress size={15} />
            ) : (
              <RefreshOutlined />
            )
          }
          disabled={refreshing || loading}
          onClick={() => fetchDashboardData(true)}
          sx={{
            borderColor: MAROON,
            color: MAROON,
            borderRadius: 2,
            px: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            whiteSpace: "nowrap",
            "&:hover": {
              bgcolor: "#f8e9ed",
              borderColor: MAROON,
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          icon={<ErrorOutlineOutlined />}
          sx={{
            mb: 3,
            borderRadius: 2,
            alignItems: "center",
            overflowWrap: "anywhere",
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => fetchDashboardData(true)}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* FIRST ROW: exactly four cards on desktop */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Orders"
            value={totalOrders.toLocaleString("en-IN")}
            subtitle="All orders received"
            icon={<ShoppingBagOutlined />}
            iconColor={MAROON}
            iconBg="#f8e9ed"
            loading={loading}
            onClick={openOrders}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Revenue"
            value={formatMoney(totalRevenue)}
            subtitle="Based on available orders"
            icon={<CurrencyRupee />}
            iconColor="#967021"
            iconBg="#fbf1d9"
            loading={loading}
            onClick={openPayments}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Products"
            value={totalProducts.toLocaleString("en-IN")}
            subtitle="Products in catalogue"
            icon={<Inventory2Outlined />}
            iconColor="#496b9c"
            iconBg="#eaf0fb"
            loading={loading}
            onClick={openProducts}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Customers"
            value={totalCustomers.toLocaleString("en-IN")}
            subtitle="Registered customers"
            icon={<People />}
            iconColor="#34845d"
            iconBg="#e6f5eb"
            loading={loading}
            onClick={openCustomers}
          />
        </Grid>
      </Grid>

      {/* SECOND ROW: four more useful summary cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Pending Orders"
            value={pendingOrders.toLocaleString("en-IN")}
            subtitle="Orders requiring attention"
            icon={<PendingActionsOutlined />}
            iconColor="#a36b16"
            iconBg="#fff2d9"
            loading={loading}
            onClick={openOrders}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Delivered Orders"
            value={deliveredOrders.toLocaleString("en-IN")}
            subtitle="Successfully delivered"
            icon={<LocalShippingOutlined />}
            iconColor="#3977a7"
            iconBg="#e6f1fa"
            loading={loading}
            onClick={openOrders}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Low Stock Products"
            value={lowStockProducts.toLocaleString("en-IN")}
            subtitle="10 or fewer items in stock"
            icon={<WarningAmberOutlined />}
            iconColor="#b47716"
            iconBg="#fff3dc"
            loading={loading}
            onClick={openProducts}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Active Products"
            value={activeProducts.toLocaleString("en-IN")}
            subtitle="Products marked active"
            icon={<CheckCircle />}
            iconColor="#278153"
            iconBg="#e5f5eb"
            loading={loading}
            onClick={openProducts}
          />
        </Grid>
      </Grid>

      {/* RECENT ORDERS */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${BORDER}`,
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 800,
                color: MAROON,
              }}
            >
              Recent Orders
            </Typography>

            <Typography
              sx={{
                color: MUTED,
                fontSize: 12,
                mt: 0.5,
              }}
            >
              Latest customer orders from your store
            </Typography>
          </Box>

          <Button
            variant="outlined"
            endIcon={<ArrowForwardOutlined />}
            onClick={openOrders}
            sx={{
              color: MAROON,
              borderColor: MAROON,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              px: 2,
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: "#f8e9ed",
                borderColor: MAROON,
              },
            }}
          >
            View All
          </Button>
        </Box>

        <Divider sx={{ borderColor: BORDER }} />

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
              py: 6,
            }}
          >
            <CircularProgress size={24} sx={{ color: MAROON }} />

            <Typography sx={{ color: MUTED, fontSize: 13 }}>
              Loading recent orders...
            </Typography>
          </Box>
        ) : recentOrders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
            <Table
              size="medium"
              sx={{
                minWidth: 700,
                "& th": {
                  bgcolor: "#fbf7f6",
                  color: "#766669",
                  fontSize: 11,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  py: 1.8,
                },
                "& td": {
                  borderColor: "#f1eae8",
                  color: TEXT,
                  fontSize: 12,
                  py: 1.8,
                },
                "& tbody tr:hover": {
                  bgcolor: "#fdf9f8",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>ORDER ID</TableCell>
                  <TableCell>CUSTOMER</TableCell>
                  <TableCell>DATE</TableCell>
                  <TableCell>AMOUNT</TableCell>
                  <TableCell>PAYMENT</TableCell>
                  <TableCell>STATUS</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {recentOrders.map((order, index) => {
                  const orderStatus =
                    order?.status || order?.order_status || "Pending";

                  const paymentStatus =
                    order?.payment_status ||
                    order?.payment?.status ||
                    "Pending";

                  const customerName = getCustomerName(order);

                  return (
                    <TableRow
                      key={order?.id ?? getOrderNumber(order) ?? index}
                      hover
                    >
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: MAROON,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getOrderNumber(order)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.2}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: "#f3e5e8",
                              color: MAROON,
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            {String(customerName)
                              .trim()
                              .charAt(0)
                              .toUpperCase() || "C"}
                          </Avatar>

                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              maxWidth: 180,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {customerName}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {getDate(order)}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: TEXT,
                          }}
                        >
                          {formatMoney(getOrderAmount(order))}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={String(paymentStatus).replace(/_/g, " ")}
                          color={getStatusColor(paymentStatus)}
                          sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={String(orderStatus).replace(/_/g, " ")}
                          color={getStatusColor(orderStatus)}
                          sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Divider sx={{ borderColor: BORDER }} />

        <Box
          sx={{
            px: 2.5,
            py: 1.8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography sx={{ color: MUTED, fontSize: 11 }}>
            {loading
              ? "Updating dashboard..."
              : `Showing ${recentOrders.length} of ${totalOrders} orders`}
          </Typography>

          <Typography sx={{ color: MUTED, fontSize: 11 }}>
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Waiting for dashboard data"}
          </Typography>
        </Box>
      </Paper>

      {/* QUICK ACTIONS */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: { xs: 2, sm: 2.5 },
          border: `1px solid ${BORDER}`,
          borderRadius: 3,
          bgcolor: "#fff",
        }}
      >
        <Typography
          sx={{
            fontSize: 17,
            fontWeight: 800,
            color: MAROON,
            mb: 0.6,
          }}
        >
          Quick Actions
        </Typography>

        <Typography sx={{ fontSize: 12, color: MUTED, mb: 2 }}>
          Quickly access important store management pages.
        </Typography>

        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              startIcon={<ShoppingCartOutlined />}
              onClick={openOrders}
              sx={{
                justifyContent: "flex-start",
                border: `1px solid ${BORDER}`,
                borderRadius: 2,
                p: 1.5,
                color: MAROON,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { bgcolor: "#fbf3f4" },
              }}
            >
              Manage Orders
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              startIcon={<Inventory2Outlined />}
              onClick={openProducts}
              sx={{
                justifyContent: "flex-start",
                border: `1px solid ${BORDER}`,
                borderRadius: 2,
                p: 1.5,
                color: MAROON,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { bgcolor: "#fbf3f4" },
              }}
            >
              Manage Products
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              startIcon={<People />}
              onClick={openCustomers}
              sx={{
                justifyContent: "flex-start",
                border: `1px solid ${BORDER}`,
                borderRadius: 2,
                p: 1.5,
                color: MAROON,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { bgcolor: "#fbf3f4" },
              }}
            >
              Manage Customers
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
