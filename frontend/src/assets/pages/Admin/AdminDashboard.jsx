import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
  InputBase,
  Menu,
  MenuItem,
  Button,
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
  KeyboardArrowDown as ArrowDownIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { getAdminToken, getAdminUsername } from "../../../utils/auth";

const DRAWER_WIDTH = 255;
const MAROON = "#650c20";
const GOLD = "#c5a059";

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { label: "Products", icon: <ProductsIcon />, path: "/admin/dashboard/products" },
  { label: "Categories", icon: <CategoryIcon />, path: "/admin/dashboard/categories" },
  { label: "Customers", icon: <CustomersIcon />, path: "/admin/dashboard/customers" },
  { label: "Orders", icon: <OrdersIcon />, path: "/admin/dashboard/orders" },
  { label: "Payments", icon: <PaymentsIcon />, path: "/admin/dashboard/payments" },
  { label: "Coupons & Offers", icon: <OffersIcon />, path: "/admin/dashboard/offers" },
  { label: "Inventory", icon: <InventoryIcon />, path: "/admin/dashboard/inventory" },
  { label: "Settings", icon: <SettingsIcon />, path: "/admin/dashboard/settings" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // TOKEN CHECK - Sabse important
  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      console.warn("No admin token found, redirecting to login");
      navigate("/login", { replace: true, state: { message: "Please login as admin" } });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      const token = getAdminToken();
      if (!token) return;
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/products/admin/notifications/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          console.error("Notification API failed:", response.status);
          return;
        }
        const data = await response.json();
        setUnreadNotifications(Number(data.unread_count) || 0);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const username = getAdminUsername();

  const getSelectedMenu = () => {
    const currentPath = location.pathname;
    if (
      currentPath === "/admin/dashboard" ||
      currentPath === "/admin/dashboard/" ||
      currentPath === "/admin/dashboard/home"
    ) {
      return "Dashboard";
    }
    const currentItem = menuItems.find(
      (item) => item.path !== "/admin/dashboard" && currentPath.startsWith(item.path)
    );
    return currentItem ? currentItem.label : "Dashboard";
  };

  const selectedMenu = getSelectedMenu();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("zinoraAdminToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("zinoraToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("zinoraAdminRole");
    localStorage.removeItem("zinoraRole");
    localStorage.removeItem("zinoraAdminUsername");
    localStorage.removeItem("zinoraUsername");
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleMenuClick = (item) => {
    navigate(item.path);
    setMobileOpen(false);
  };

  const SidebarContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
      <Box sx={{ px: 3, py: 3 }}>
        <Typography sx={{ color: MAROON, fontSize: 27, fontWeight: 900, letterSpacing: 4 }}>ZINORA</Typography>
        <Typography sx={{ fontSize: 10, letterSpacing: 2, color: "#8c7a7d", mt: 0.5 }}>ADMINISTRATION PANEL</Typography>
      </Box>
      <Divider />
      <Box sx={{ px: 2, pt: 3, pb: 1 }}>
        <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "#a49a9b", px: 1.5 }}>MAIN MENU</Typography>
      </Box>
      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isSelected = selectedMenu === item.label;
          return (
            <ListItemButton
              key={item.label}
              selected={isSelected}
              onClick={() => handleMenuClick(item)}
              sx={{
                borderRadius: 2, mb: 0.7, py: 1.25,
                color: isSelected ? MAROON : "#6c6265",
                "& .MuiListItemIcon-root": { minWidth: 42, color: isSelected ? MAROON : "#91878a" },
                "&.Mui-selected": { backgroundColor: "#f8edf0", borderLeft: `4px solid ${MAROON}` },
                "&.Mui-selected:hover": { backgroundColor: "#f3e3e7" },
                "&:hover": { backgroundColor: "#faf6f4" },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13, fontWeight: isSelected ? 700 : 500 }} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: "#b42332", "&:hover": { backgroundColor: "#fff0f0" } }}>
          <ListItemIcon sx={{ minWidth: 42, color: "#b42332" }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 13, fontWeight: 700 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f7f5f2" }}>
      <AppBar position="fixed" elevation={0} sx={{ width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` }, backgroundColor: "#fff", color: "#30282a", borderBottom: "1px solid #eee7e3", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ minHeight: "76px !important", px: { xs: 2, md: 3 }, gap: 1 }}>
          <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { xs: "inline-flex", md: "none" }, mr: 0.5 }}><MenuIcon /></IconButton>
          <Box sx={{ flexShrink: 0, minWidth: { xs: 90, md: 145 }, mr: { xs: 0, md: 1 } }}>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 14, md: 18 }, color: MAROON }}>{selectedMenu === "Dashboard" ? "Dashboard Overview" : selectedMenu}</Typography>
            <Typography sx={{ fontSize: 10, color: "#968a8d", mt: 0.3 }}>Zinora / {selectedMenu}</Typography>
          </Box>
          <Button variant="outlined" startIcon={<OpenInNewIcon />} onClick={() => window.open("/store", "_blank", "noopener,noreferrer")} sx={{ flexShrink: 0, textTransform: "none", whiteSpace: "nowrap", borderRadius: 2, px: { xs: 1, md: 1.5 }, py: 0.9, fontSize: { xs: 10, md: 12 }, color: MAROON, borderColor: MAROON, fontWeight: 700, "&:hover": { backgroundColor: "#f8edf0", borderColor: MAROON } }}>View Customer Website</Button>
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", backgroundColor: "#f8f5f3", px: 1.2, borderRadius: 2, flexGrow: 1, minWidth: 80, maxWidth: 250, ml: "auto" }}>
            <SearchIcon sx={{ color: "#94878a", fontSize: 20 }} />
            <InputBase placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ ml: 1, fontSize: 12, width: "100%" }} />
          </Box>
          <IconButton onClick={() => navigate("/admin/dashboard/notifications")} aria-label="Open notifications" sx={{ flexShrink: 0, color: MAROON, position: "relative" }}>
            <NotificationsIcon />
            {unreadNotifications > 0 && (
              <Box sx={{ position: "absolute", top: 3, right: 3, minWidth: 17, height: 17, px: 0.4, borderRadius: "50%", backgroundColor: "#d32f2f", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadNotifications > 99 ? "99+" : unreadNotifications}</Box>
            )}
          </IconButton>
          <Avatar sx={{ width: 36, height: 36, flexShrink: 0, backgroundColor: MAROON, color: GOLD, fontWeight: 800 }}>{username.charAt(0).toUpperCase()}</Avatar>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ flexShrink: 0 }}><ArrowDownIcon /></IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => { setAnchorEl(null); handleLogout(); }}><LogoutIcon sx={{ mr: 1, fontSize: 20 }} />Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}>{SidebarContent}</Drawer>
        <Drawer variant="permanent" open sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box", borderRight: "1px solid #eee7e3" } }}>{SidebarContent}</Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 4 }, pt: { xs: "100px", md: "108px" } }}>
        <Outlet context={{ search }} />
        <Typography sx={{ textAlign: "center", mt: 4, color: "#a3989b", fontSize: 11 }}>© {new Date().getFullYear()} Zinora Jewellery · Admin Panel</Typography>
      </Box>
    </Box>
  );
}

export default AdminDashboard;