import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputBase,
  Menu,
  MenuItem,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory2 as ProductsIcon,
  Category as CategoryIcon,
  People as CustomersIcon,
  ShoppingBag as OrdersIcon,
  Payments as PaymentsIcon,
  LocalOffer as OffersIcon,
  Warehouse as InventoryIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  NotificationsNone as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as RevenueIcon,
  ShoppingCart as ShoppingCartIcon,
Person as PersonIcon,
  WarningAmber as WarningIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const DRAWER_WIDTH = 255;

const MAROON = "#650c20";
const GOLD = "#c5a059";
const BACKGROUND = "#f7f5f2";

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "Products", icon: <ProductsIcon /> },
  { label: "Categories", icon: <CategoryIcon /> },
  { label: "Customers", icon: <CustomersIcon /> },
  { label: "Orders", icon: <OrdersIcon /> },
  { label: "Payments", icon: <PaymentsIcon /> },
  { label: "Coupons & Offers", icon: <OffersIcon /> },
  { label: "Inventory", icon: <InventoryIcon /> },
  { label: "Settings", icon: <SettingsIcon /> },
];

const recentOrders = [
  {
    id: "#ZIN1001",
    customer: "Priya Sharma",
    product: "Kundan Necklace Set",
    date: "11 Oct 2026",
    amount: "₹2,499",
    status: "Delivered",
  },
  {
    id: "#ZIN1002",
    customer: "Ananya Patil",
    product: "Gold Plated Jhumkas",
    date: "10 Oct 2026",
    amount: "₹799",
    status: "Processing",
  },
  {
    id: "#ZIN1003",
    customer: "Sneha Kulkarni",
    product: "Antique Gold Bangles",
    date: "10 Oct 2026",
    amount: "₹1,599",
    status: "Pending",
  },
  {
    id: "#ZIN1004",
    customer: "Riya Deshmukh",
    product: "Polki Ring",
    date: "09 Oct 2026",
    amount: "₹499",
    status: "Cancelled",
  },
];

const stats = [
  {
    title: "Total Revenue",
    value: "₹1,24,500",
    change: "+12.5%",
    description: "Compared to last month",
    icon: <RevenueIcon />,
    positive: true,
  },
  {
    title: "Total Orders",
    value: "248",
    change: "+8.2%",
    description: "Compared to last month",
    icon: <ShoppingCartIcon />,
    positive: true,
  },
  {
    title: "Total Customers",
    value: "186",
    change: "+15.3%",
    description: "Compared to last month",
    icon: <PersonIcon />,
    positive: true,
  },
  {
    title: "Total Products",
    value: "124",
    change: "-2.4%",
    description: "Compared to last month",
    icon: <ProductsIcon />,
    positive: false,
  },
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const username =
    localStorage.getItem("zinoraAdminUsername") ||
    sessionStorage.getItem("zinoraAdminUsername") ||
    "Admin";

  const handleLogout = () => {
    localStorage.removeItem("zinoraAdminToken");
    localStorage.removeItem("zinoraAdminRole");
    localStorage.removeItem("zinoraAdminUsername");

    sessionStorage.removeItem("zinoraAdminToken");
    sessionStorage.removeItem("zinoraAdminRole");
    sessionStorage.removeItem("zinoraAdminUsername");

    navigate("/admin/login", { replace: true });
  };

  const handleMenuClick = (label) => {
    setSelectedMenu(label);
    setMobileOpen(false);
  };

  const filteredOrders = recentOrders.filter((order) =>
    `${order.id} ${order.customer} ${order.product} ${order.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return { color: "#218653", backgroundColor: "#e4f5eb" };

      case "Processing":
        return { color: "#a56a08", backgroundColor: "#fff1d6" };

      case "Pending":
        return { color: "#9a5c0b", backgroundColor: "#fff0df" };

      case "Cancelled":
        return { color: "#b42332", backgroundColor: "#fde8e9" };

      default:
        return { color: "#555", backgroundColor: "#eee" };
    }
  };

  const SidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      {/* BRAND */}
      <Box sx={{ px: 3, py: 3 }}>
        <Typography
          sx={{
            color: MAROON,
            fontSize: 27,
            fontWeight: 900,
            letterSpacing: 4,
          }}
        >
          ZINORA
        </Typography>

        <Typography
          sx={{
            fontSize: 10,
            letterSpacing: 2,
            color: "#8c7a7d",
            mt: 0.5,
          }}
        >
          ADMINISTRATION PANEL
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ px: 2, pt: 3, pb: 1 }}>
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.5,
            color: "#a49a9b",
            px: 1.5,
          }}
        >
          MAIN MENU
        </Typography>
      </Box>

      {/* NAVIGATION */}
      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={selectedMenu === item.label}
            onClick={() => handleMenuClick(item.label)}
            sx={{
              borderRadius: 2,
              mb: 0.7,
              py: 1.25,
              color: selectedMenu === item.label ? MAROON : "#6c6265",
              "& .MuiListItemIcon-root": {
                minWidth: 42,
                color: selectedMenu === item.label ? MAROON : "#91878a",
              },
              "&.Mui-selected": {
                backgroundColor: "#f8edf0",
                borderLeft: `4px solid ${MAROON}`,
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#f3e3e7",
              },
              "&:hover": {
                backgroundColor: "#faf6f4",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 13,
                fontWeight: selectedMenu === item.label ? 700 : 500,
              }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* LOGOUT */}
      <Divider />

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "#b42332",
            "&:hover": { backgroundColor: "#fff0f0" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 42, color: "#b42332" }}>
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: 13,
              fontWeight: 700,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: BACKGROUND }}>
      {/* TOP HEADER */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: "#fff",
          color: "#30282a",
          borderBottom: "1px solid #eee7e3",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: "76px !important", px: { xs: 2, md: 4 } }}>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: "none" }, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: 16, md: 20 },
                color: MAROON,
              }}
            >
              {selectedMenu}
            </Typography>

            <Typography sx={{ fontSize: 11, color: "#968a8d", mt: 0.3 }}>
              Zinora / {selectedMenu}
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              backgroundColor: "#f8f5f3",
              px: 1.5,
              borderRadius: 2,
              mr: 2,
              width: 210,
            }}
          >
            <SearchIcon sx={{ color: "#94878a", fontSize: 20 }} />

            <InputBase
              placeholder="Search orders..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              sx={{ ml: 1, fontSize: 12, width: "100%" }}
            />
          </Box>

          <IconButton sx={{ mr: 1 }}>
            <NotificationsIcon />
          </IconButton>

          <Avatar
            sx={{
              width: 38,
              height: 38,
              backgroundColor: MAROON,
              color: GOLD,
              fontWeight: 800,
            }}
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>

          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
            <ArrowDownIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleLogout();
              }}
            >
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* DESKTOP SIDEBAR */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {SidebarContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: "1px solid #eee7e3",
            },
          }}
          open
        >
          {SidebarContent}
        </Drawer>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, md: 4 },
          pt: { xs: "100px", md: "108px" },
        }}
      >
        {/* WELCOME */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "#39262c" }}
            >
              Welcome back, {username}! 👋
            </Typography>

            <Typography sx={{ color: "#94878a", fontSize: 13, mt: 1 }}>
              Here is what's happening with your jewellery store today.
            </Typography>
          </Box>

         <Box
  sx={{
    display: "flex",
    gap: 1.5,
    flexWrap: "wrap",
    alignItems: "center",
  }}
>
  {/* View Customer Website Button */}
  <Button
    variant="outlined"
    startIcon={<VisibilityIcon />}
    onClick={() => navigate("/")}
    sx={{
      textTransform: "none",
      borderRadius: 2,
      px: 2.5,
      py: 1.2,
      color: MAROON,
      borderColor: MAROON,
      fontWeight: 700,
      "&:hover": {
        backgroundColor: "#f8edf0",
        borderColor: MAROON,
      },
    }}
  >
    View Customer Website
  </Button>

  {/* Add Product Button */}
  <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={() => handleMenuClick("Products")}
    sx={{
      textTransform: "none",
      borderRadius: 2,
      px: 2.5,
      py: 1.2,
      backgroundColor: MAROON,
      "&:hover": {
        backgroundColor: "#4b0918",
      },
    }}
  >
    Add Product
  </Button>
</Box>
        </Box>

        {/* STATISTICS CARDS */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} xl={3} key={stat.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid #eee7e3",
                  height: "100%",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 24px rgba(60,30,35,0.06)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2.5,
                  }}
                >
                  <Typography sx={{ color: "#837679", fontSize: 12 }}>
                    {stat.title}
                  </Typography>

                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f8edf0",
                      color: MAROON,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontSize: 27,
                    fontWeight: 800,
                    color: "#38282d",
                    mb: 1.5,
                  }}
                >
                  {stat.value}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {stat.positive ? (
                    <TrendingUpIcon sx={{ fontSize: 16, color: "#218653" }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 16, color: "#c13d48" }} />
                  )}

                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: stat.positive ? "#218653" : "#c13d48",
                    }}
                  >
                    {stat.change}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#a3989b",
                      ml: 0.5,
                    }}
                  >
                    vs last month
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ORDER SECTION */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #eee7e3",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{ fontWeight: 800, color: "#39262c", fontSize: 17 }}
              >
                Recent Orders
              </Typography>

              <Typography sx={{ color: "#94878a", fontSize: 12, mt: 0.5 }}>
                Latest activity from your store
              </Typography>
            </Box>

            <Button
              size="small"
              endIcon={<VisibilityIcon />}
              onClick={() => handleMenuClick("Orders")}
              sx={{
                color: MAROON,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              View All
            </Button>
          </Box>

          <Divider />

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#fcfaf8" }}>
                  {[
                    "ORDER ID",
                    "CUSTOMER",
                    "PRODUCT",
                    "DATE",
                    "AMOUNT",
                    "STATUS",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: 0.7,
                        color: "#928488",
                        py: 2,
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        fontSize: 12,
                        color: MAROON,
                      }}
                    >
                      {order.id}
                    </TableCell>

                    <TableCell sx={{ fontSize: 12 }}>
                      {order.customer}
                    </TableCell>

                    <TableCell sx={{ fontSize: 12 }}>
                      {order.product}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: 11,
                        color: "#827579",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {order.date}
                    </TableCell>

                    <TableCell sx={{ fontSize: 12, fontWeight: 700 }}>
                      {order.amount}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={order.status}
                        size="small"
                        sx={{
                          ...getStatusColor(order.status),
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      No orders match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />

          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography sx={{ color: "#a3989b", fontSize: 11 }}>
              Showing recent sample orders
            </Typography>
          </Box>
        </Paper>

        {/* LOW STOCK ALERT */}
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #f0dfbc",
            backgroundColor: "#fffbf3",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff0d1",
              color: "#a56a08",
            }}
          >
            <WarningIcon />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#704c14" }}>
              Inventory Reminder
            </Typography>

            <Typography sx={{ fontSize: 12, color: "#987d53", mt: 0.5 }}>
              Connect your inventory data to identify products running low on
              stock.
            </Typography>
          </Box>

          <Button
            sx={{
              ml: "auto",
              whiteSpace: "nowrap",
              color: "#8b5d11",
              textTransform: "none",
              fontWeight: 700,
            }}
            onClick={() => handleMenuClick("Inventory")}
          >
            Inventory
          </Button>
        </Paper>

        <Typography
          sx={{
            textAlign: "center",
            mt: 4,
            color: "#a3989b",
            fontSize: 11,
          }}
        >
          © {new Date().getFullYear()} Zinora Jewellery · Admin Panel
        </Typography>
      </Box>
    </Box>
  );
}

export default AdminDashboard;