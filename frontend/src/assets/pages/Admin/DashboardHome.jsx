import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography,
} from "@mui/material";
import {
  ShoppingBagOutlined, CurrencyRupee, Inventory2Outlined, People,
  PendingActionsOutlined, LocalShippingOutlined, CheckCircle, WarningAmberOutlined,
  RefreshOutlined, ArrowForwardOutlined, ShoppingCartOutlined, ErrorOutlineOutlined,
} from "@mui/icons-material";

const MAROON = "#650c20";
const BG = "#faf7f5";
const TEXT = "#39272b";
const MUTED = "#897b7e";
const BORDER = "#eee5e2";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

const API_URLS = {
  orders: `${API_BASE}/api/orders/admin/`,
  products: `${API_BASE}/api/products/`,
  customers: `${API_BASE}/api/accounts/admin/customers/`,
};

// FIXED TOKEN - SAB JAGAH DHOONDEGA
const getToken = () => {
  return (
    localStorage.getItem("zinoraAdminToken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("zinoraToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("zinoraAdminToken") ||
    ""
  ).trim();
};

const getArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.customers)) return data.customers;
  return [];
};
const getNumber = (value) => { const n = Number(value ?? 0); return Number.isFinite(n) ? n : 0; };
const formatMoney = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(getNumber(value));
const getOrderStatus = (order) => String(order?.status || order?.order_status || "Pending").toLowerCase();
const getOrderNumber = (order) => order?.order_number || order?.order_id || order?.orderId || (order?.id != null ? `#${order.id}` : "—");
const getCustomerName = (order) => {
  const customer = order?.customer_detail || order?.customer;
  if (typeof customer === "string") return customer;
  return order?.customer_name || customer?.full_name || customer?.name || customer?.username || customer?.email || "Customer";
};
const getOrderAmount = (order) => getNumber(order?.total_amount ?? order?.total ?? order?.amount ?? order?.grand_total ?? 0);
const getProductStock = (product) => getNumber(product?.stock_quantity ?? product?.stock ?? product?.quantity ?? 0);
const getProductName = (product) => product?.name || product?.product_name || "Unnamed Product";
const isActiveProduct = (product) => {
  const v = product?.is_active ?? product?.status ?? true;
  return !(v === false || v === 0 || v === "false" || v === "inactive" || v === "Inactive");
};
const getDate = (order) => {
  const d = order?.created_at || order?.created || order?.order_date;
  if (!d) return "—";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
const getStatusColor = (status) => {
  const v = String(status || "").toLowerCase();
  if (["delivered", "completed", "success", "paid"].includes(v)) return "success";
  if (["cancelled", "failed", "rejected", "returned"].includes(v)) return "error";
  if (["shipped", "packed", "confirmed", "processing"].includes(v)) return "info";
  return "warning";
};

function StatCard({ title, value, subtitle, icon, iconColor = MAROON, iconBg = "#f8e9ed", onClick, loading }) {
  return (
    <Card onClick={onClick} sx={{ height: "100%", minHeight: 145, border: `1px solid ${BORDER}`, borderRadius: 3, boxShadow: "0 3px 14px rgba(55,20,30,0.04)", cursor: onClick ? "pointer" : "default", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(55,20,30,0.09)" } }}>
      <CardContent sx={{ p: 2.2, "&:last-child": { pb: 2.2 } }}>
        <Stack direction="row" justifyContent="space-between" spacing={1.5}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: MUTED, fontSize: 12, fontWeight: 600, mb: 1.5 }}>{title}</Typography>
            {loading ? <CircularProgress size={22} sx={{ color: MAROON }} /> : <Typography sx={{ fontSize: { xs: 21, sm: 24 }, fontWeight: 800, color: TEXT }}>{value}</Typography>}
            <Typography sx={{ color: MUTED, fontSize: 11, mt: 1.2 }}>{subtitle}</Typography>
          </Box>
          <Box sx={{ width: 43, height: 43, borderRadius: 2.5, bgcolor: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</Box>
        </Stack>
      </CardContent>
    </Card>
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

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const token = getToken();
      console.log("Dashboard Token:", token ? "FOUND" : "NOT FOUND");
      if (!token) throw new Error("Admin login token nahi mila. Please admin login dobara karein.");

      const headers = { Authorization: `Token ${token}`, Accept: "application/json" };

      const fetchResource = async (url, name) => {
        try {
          const res = await fetch(url, { method: "GET", headers });
          if (res.status === 401) throw new Error("Admin session expired. Dobara login karein.");
          if (res.status === 403) throw new Error(`${name} permission nahi hai.`);
          if (!res.ok) {
            const text = await res.text();
            console.error(`${name} API Error:`, text);
            return []; // Ek API fail hua to bhi baaki chalne do
          }
          return await res.json();
        } catch (e) {
          console.warn(`${name} fetch failed:`, e.message);
          return [];
        }
      };

      const [ordersData, productsData, customersData] = await Promise.all([
        fetchResource(API_URLS.orders, "Orders"),
        fetchResource(API_URLS.products, "Products"),
        fetchResource(API_URLS.customers, "Customers"),
      ]);

      console.log("Orders:", ordersData, "Products:", productsData);

      setOrders(getArray(ordersData));
      setProducts(getArray(productsData));
      setCustomers(getArray(customersData));
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError(err.message || "Dashboard data load nahi ho paya.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const totalOrders = orders.length;
  const totalRevenue = orders.filter(o => !["cancelled","returned","refunded"].includes(getOrderStatus(o))).reduce((s, o) => s + getOrderAmount(o), 0);
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const pendingOrders = orders.filter(o => ["pending","placed","processing","confirmed"].includes(getOrderStatus(o))).length;
  const deliveredOrders = orders.filter(o => ["delivered","completed"].includes(getOrderStatus(o))).length;
  const lowStockProducts = products.filter(p => { const stock = getProductStock(p); return isActiveProduct(p) && stock <= 10; }).length;
  const activeProducts = products.filter(isActiveProduct).length;

  const recentOrders = [...orders].sort((a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0)).slice(0, 6);

  return (
    <Box sx={{ width: "100%", bgcolor: BG, p: { xs: 1.5, sm: 2.5, md: 3 }, borderRadius: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: { xs: 23, md: 29 }, fontWeight: 800, color: MAROON }}>Dashboard Overview</Typography>
          <Typography sx={{ fontSize: 13, color: MUTED, mt: 0.7 }}>Welcome back! Here is your Zinora store summary.</Typography>
        </Box>
        <Button variant="outlined" startIcon={refreshing ? <CircularProgress size={15} /> : <RefreshOutlined />} disabled={refreshing || loading} onClick={() => fetchDashboardData(true)} sx={{ borderColor: MAROON, color: MAROON, borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Refresh</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} action={<Button color="inherit" size="small" onClick={() => fetchDashboardData(true)}>Retry</Button>}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Total Orders" value={totalOrders.toLocaleString("en-IN")} subtitle="All orders received" icon={<ShoppingBagOutlined />} loading={loading} onClick={() => navigate("/admin/dashboard/orders")} /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Total Revenue" value={formatMoney(totalRevenue)} subtitle="Excluding cancelled" icon={<CurrencyRupee />} iconColor="#967021" iconBg="#fbf1d9" loading={loading} onClick={() => navigate("/admin/dashboard/payments")} /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Total Products" value={totalProducts.toLocaleString("en-IN")} subtitle={`${activeProducts} active`} icon={<Inventory2Outlined />} iconColor="#496b9c" iconBg="#eaf0fb" loading={loading} onClick={() => navigate("/admin/dashboard/products")} /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Total Customers" value={totalCustomers.toLocaleString("en-IN")} subtitle="Registered customers" icon={<People />} iconColor="#34845d" iconBg="#e6f5eb" loading={loading} onClick={() => navigate("/admin/dashboard/customers")} /></Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Pending Orders" value={pendingOrders.toLocaleString("en-IN")} subtitle="Needs attention" icon={<PendingActionsOutlined />} iconColor="#a36b16" iconBg="#fff2d9" loading={loading} onClick={() => navigate("/admin/dashboard/orders")} /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Delivered Orders" value={deliveredOrders.toLocaleString("en-IN")} subtitle="Successfully delivered" icon={<LocalShippingOutlined />} iconColor="#3977a7" iconBg="#e6f1fa" loading={loading} onClick={() => navigate("/admin/dashboard/orders")} /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Low Stock Products" value={lowStockProducts.toLocaleString("en-IN")} subtitle="≤10 items in stock" icon={<WarningAmberOutlined />} iconColor="#b47716" iconBg="#fff3dc" loading={loading} onClick={() => navigate("/admin/dashboard/inventory")} /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard title="Active Products" value={activeProducts.toLocaleString("en-IN")} subtitle="Live on store" icon={<CheckCircle />} iconColor="#278153" iconBg="#e5f5eb" loading={loading} onClick={() => navigate("/admin/dashboard/products")} /></Grid>
      </Grid>

      <Paper elevation={0} sx={{ border: `1px solid ${BORDER}`, borderRadius: 3, overflow: "hidden", bgcolor: "#fff" }}>
        <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box><Typography sx={{ fontSize: 18, fontWeight: 800, color: MAROON }}>Recent Orders</Typography><Typography sx={{ color: MUTED, fontSize: 12, mt: 0.5 }}>Latest {recentOrders.length} orders from your store</Typography></Box>
          <Button variant="outlined" endIcon={<ArrowForwardOutlined />} onClick={() => navigate("/admin/dashboard/orders")} sx={{ color: MAROON, borderColor: MAROON, borderRadius: 2, textTransform: "none", fontWeight: 700 }}>View All</Button>
        </Box>
        <Divider sx={{ borderColor: BORDER }} />
        {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 6, gap: 1.5 }}><CircularProgress size={24} sx={{ color: MAROON }} /><Typography sx={{ color: MUTED, fontSize: 13 }}>Loading...</Typography></Box>
          : recentOrders.length === 0 ? <Box sx={{ textAlign: "center", py: 6 }}><ShoppingBagOutlined sx={{ fontSize: 42, color: "#d5c6c5", mb: 1 }} /><Typography sx={{ fontWeight: 700 }}>No orders yet</Typography><Typography sx={{ fontSize: 12, color: MUTED }}>Orders API check karo: {API_URLS.orders}</Typography></Box>
          : <TableContainer><Table size="medium" sx={{ minWidth: 700 }}><TableHead><TableRow><TableCell>ORDER ID</TableCell><TableCell>CUSTOMER</TableCell><TableCell>DATE</TableCell><TableCell>AMOUNT</TableCell><TableCell>STATUS</TableCell></TableRow></TableHead><TableBody>{recentOrders.map((order, i) => (<TableRow key={order?.id ?? i} hover><TableCell><Typography sx={{ fontSize: 12, fontWeight: 800, color: MAROON }}>{getOrderNumber(order)}</Typography></TableCell><TableCell><Stack direction="row" spacing={1.2} alignItems="center"><Avatar sx={{ width: 34, height: 34, bgcolor: "#f3e5e8", color: MAROON, fontSize: 12, fontWeight: 800 }}>{String(getCustomerName(order)).charAt(0).toUpperCase()}</Avatar><Typography sx={{ fontSize: 12, fontWeight: 600 }}>{getCustomerName(order)}</Typography></Stack></TableCell><TableCell>{getDate(order)}</TableCell><TableCell><Typography sx={{ fontSize: 12, fontWeight: 800 }}>{formatMoney(getOrderAmount(order))}</Typography></TableCell><TableCell><Chip size="small" label={String(order?.status || "Pending")} color={getStatusColor(order?.status)} sx={{ fontSize: 10, fontWeight: 700, textTransform: "capitalize" }} /></TableCell></TableRow>))}</TableBody></Table></TableContainer>}
        <Divider />
        <Box sx={{ px: 2.5, py: 1.8, display: "flex", justifyContent: "space-between" }}><Typography sx={{ color: MUTED, fontSize: 11 }}>Showing {recentOrders.length} of {totalOrders} orders</Typography><Typography sx={{ color: MUTED, fontSize: 11 }}>{lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString("en-IN")}` : "—"}</Typography></Box>
      </Paper>
    </Box>
  );
}