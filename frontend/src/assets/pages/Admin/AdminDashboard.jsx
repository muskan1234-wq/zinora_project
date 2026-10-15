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
Visibility as VisibilityIcon,
OpenInNew as OpenInNewIcon,
Inventory as ManageProductsIcon,
} from "@mui/icons-material";

const DRAWER_WIDTH = 255;
const MAROON = "#650c20";
const GOLD = "#c5a059";

const menuItems = [
{
label: "Dashboard",
icon: <DashboardIcon />,
path: "/admin/dashboard",
},
{
label: "Products",
icon: <ProductsIcon />,
path: "/admin/dashboard/products",
},
{
label: "Categories",
icon: <CategoryIcon />,
path: "/admin/dashboard/categories",
},
{
label: "Customers",
icon: <CustomersIcon />,
path: "/admin/dashboard/customers",
},
{
label: "Orders",
icon: <OrdersIcon />,
path: "/admin/dashboard/orders",
},
{
label: "Payments",
icon: <PaymentsIcon />,
path: "/admin/dashboard/payments",
},
{
label: "Coupons & Offers",
icon: <OffersIcon />,
path: "/admin/dashboard/offers",
},
{
label: "Inventory",
icon: <InventoryIcon />,
path: "/admin/dashboard/inventory",
},
{
label: "Settings",
icon: <SettingsIcon />,
path: "/admin/dashboard/settings",
},
];

function AdminDashboard() {
const navigate = useNavigate();
const location = useLocation();

const [mobileOpen, setMobileOpen] = useState(false);
const [search, setSearch] = useState("");
const [anchorEl, setAnchorEl] = useState(null);

const username =
localStorage.getItem("zinoraAdminUsername") ||
sessionStorage.getItem("zinoraAdminUsername") ||
"Admin";

// Identify the active sidebar item from the URL.
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
  (item) =>
    item.path !== "/admin/dashboard" &&
    currentPath.startsWith(item.path)
);

return currentItem ? currentItem.label : "Dashboard";


};

const selectedMenu = getSelectedMenu();

// Close the mobile sidebar after navigation.
useEffect(() => {
setMobileOpen(false);
}, [location.pathname]);

const handleLogout = () => {
localStorage.removeItem("zinoraAdminToken");
localStorage.removeItem("zinoraAdminRole");
localStorage.removeItem("zinoraAdminUsername");


sessionStorage.removeItem("zinoraAdminToken");
sessionStorage.removeItem("zinoraAdminRole");
sessionStorage.removeItem("zinoraAdminUsername");

navigate("/admin/login", { replace: true });


};

const handleMenuClick = (item) => {
navigate(item.path);
setMobileOpen(false);
};

// Sidebar content shared by mobile and desktop drawers.
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
ZINORA </Typography>


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

  {/* MENU HEADING */}
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
    {menuItems.map((item) => {
      const isSelected = selectedMenu === item.label;

      return (
        <ListItemButton
          key={item.label}
          selected={isSelected}
          onClick={() => handleMenuClick(item)}
          sx={{
            borderRadius: 2,
            mb: 0.7,
            py: 1.25,
            color: isSelected ? MAROON : "#6c6265",

            "& .MuiListItemIcon-root": {
              minWidth: 42,
              color: isSelected ? MAROON : "#91878a",
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
              fontWeight: isSelected ? 700 : 500,
            }}
          />
        </ListItemButton>
      );
    })}
  </List>

  {/* LOGOUT */}
  <Divider />

  <Box sx={{ p: 2 }}>
    <ListItemButton
      onClick={handleLogout}
      sx={{
        borderRadius: 2,
        color: "#b42332",

        "&:hover": {
          backgroundColor: "#fff0f0",
        },
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
<Box
sx={{
display: "flex",
minHeight: "100vh",
backgroundColor: "#f7f5f2",
}}
>
{/* ================= TOP HEADER ================= */}

```
  <AppBar
    position="fixed"
    elevation={0}
    sx={{
      width: {
        xs: "100%",
        md: `calc(100% - ${DRAWER_WIDTH}px)`,
      },
      ml: { md: `${DRAWER_WIDTH}px` },
      backgroundColor: "#fff",
      color: "#30282a",
      borderBottom: "1px solid #eee7e3",
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
  >
    <Toolbar
      sx={{
        minHeight: "76px !important",
        px: { xs: 2, md: 3 },
        gap: 1,
      }}
    >
      {/* MOBILE MENU */}
      <IconButton
        onClick={() => setMobileOpen(true)}
        sx={{
          display: { xs: "inline-flex", md: "none" },
          mr: 0.5,
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* PAGE TITLE */}
      <Box
        sx={{
          flexShrink: 0,
          minWidth: { xs: 90, md: 145 },
          mr: { xs: 0, md: 1 },
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: 14, md: 18 },
            color: MAROON,
          }}
        >
          {selectedMenu === "Dashboard"
            ? "Dashboard Overview"
            : selectedMenu}
        </Typography>

        <Typography
          sx={{
            fontSize: 10,
            color: "#968a8d",
            mt: 0.3,
          }}
        >
          Zinora / {selectedMenu}
        </Typography>
      </Box>

      {/* VIEW CUSTOMER WEBSITE BUTTON — STATIC ON EVERY ADMIN PAGE */}
      <Button
        variant="outlined"
        startIcon={<OpenInNewIcon />}
        onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
        sx={{
          flexShrink: 0,
          textTransform: "none",
          whiteSpace: "nowrap",
          borderRadius: 2,
          px: { xs: 1, md: 1.5 },
          py: 0.9,
          fontSize: { xs: 10, md: 12 },
          color: MAROON,
          borderColor: MAROON,
          fontWeight: 700,

          "& .MuiButton-startIcon": {
            mr: { xs: 0.5, md: 0.8 },
          },

          "&:hover": {
            backgroundColor: "#f8edf0",
            borderColor: MAROON,
          },
        }}
      >
        View Customer Website
      </Button>

      {/* STATIC SEARCH BAR — AFTER THE CUSTOMER WEBSITE BUTTON */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          backgroundColor: "#f8f5f3",
          px: 1.2,
          borderRadius: 2,
          flexGrow: 1,
          minWidth: 80,
          maxWidth: 250,
          ml: "auto",
        }}
      >
        <SearchIcon sx={{ color: "#94878a", fontSize: 20 }} />

        <InputBase
          placeholder="Search..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{
            ml: 1,
            fontSize: 12,
            width: "100%",
          }}
        />
      </Box>

      {/* NOTIFICATIONS */}
      <IconButton sx={{ flexShrink: 0 }}>
        <NotificationsIcon />
      </IconButton>

      {/* ADMIN AVATAR */}
      <Avatar
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          backgroundColor: MAROON,
          color: GOLD,
          fontWeight: 800,
        }}
      >
        {username.charAt(0).toUpperCase()}
      </Avatar>

      {/* ADMIN MENU */}
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{ flexShrink: 0 }}
      >
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

  {/* ================= SIDEBAR ================= */}

  <Box
    component="nav"
    sx={{
      width: { md: DRAWER_WIDTH },
      flexShrink: { md: 0 },
    }}
  >
    {/* MOBILE SIDEBAR */}
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

    {/* DESKTOP SIDEBAR */}
    <Drawer
      variant="permanent"
      open
      sx={{
        display: { xs: "none", md: "block" },

        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid #eee7e3",
        },
      }}
    >
      {SidebarContent}
    </Drawer>
  </Box>

  {/* ================= RIGHT MAIN CONTENT ================= */}

  <Box
    component="main"
    sx={{
      flexGrow: 1,
      minWidth: 0,
      p: { xs: 2, md: 4 },
      pt: { xs: "100px", md: "108px" },
    }}
  >
    {/* PAGE CONTENT CHANGES HERE; HEADER AND BUTTON STAY STATIC */}
    <Outlet context={{ search }} />

    {/* FOOTER */}
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
