import React, { useState } from "react";

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { Link } from "react-router-dom";

// =========================
// ANNOUNCEMENT BAR
// =========================

const AnnouncementBar = () => (
  <Box
    sx={{
      bgcolor: "#4a2028",
      color: "white",
      textAlign: "center",
      py: 0.8,
      px: 2,
      fontSize: {
        xs: "9px",
        md: "12px",
      },
      letterSpacing: "0.5px",
      fontWeight: 500,
      lineHeight: 1.4,
    }}
  >
    FREE EXPRESS SHIPPING ON ORDERS ABOVE ₹999 | COD AVAILABLE | 48-HOUR EASY
    EXCHANGE
  </Box>
);

// =========================
// NAVIGATION ITEMS
// =========================

const navItems = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "New Arrivals",
    path: "/new-arrivals",
  },
  {
    label: "Necklaces & Chokers",
    path: "/necklaces",
  },
  {
    label: "Earrings & Jhumkas",
    path: "/earrings",
  },
  {
    label: "Bangles & Kadas",
    path: "/bangles",
  },
  {
    label: "Rings & Pendants",
    path: "/rings",
  },
  {
    label: "Bridal & Festive",
    path: "/bridal-festive",
  },
  {
    label: "Under ₹199 / ₹299",
    path: "/under-199-299",
  },
  {
    label: "Offers",
    path: "/offers",
  },
];

// =========================
// TOPBAR
// =========================

export default function Topbar() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // =========================
  // COLLECTION MENU
  // =========================

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* =========================
          ANNOUNCEMENT BAR
      ========================== */}

      <AnnouncementBar />

      {/* =========================
          APP BAR
      ========================== */}

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "black",
          borderBottom: "1px solid #eee",
        }}
      >
        {/* =========================
            ROW 1
        ========================== */}

        <Toolbar
          sx={{
            justifyContent: "space-between",
            py: {
              xs: 0.5,
              md: 1,
            },
          }}
        >
          {/* =========================
              LOGO
          ========================== */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Mobile Menu Button */}

            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}

            <Typography
              component={Link}
              to="/"
              sx={{
                fontFamily: "serif",
                fontWeight: 800,
                fontSize: {
                  xs: "22px",
                  md: "24px",
                },
                letterSpacing: "1px",
                color: "#000",
                textDecoration: "none",
              }}
            >
              ZINORA
            </Typography>
          </Box>

          {/* =========================
              DESKTOP SEARCH
          ========================== */}

          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                maxWidth: "550px",
                gap: 1,
                mx: 3,
              }}
            >
              {/* Collection Dropdown */}

              <Button
                onClick={handleMenuOpen}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  bgcolor: "#f5f5f5",
                  color: "#333",
                  textTransform: "none",
                  borderRadius: "6px",
                  px: 2,
                  py: 1,
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                }}
              >
                All Collections
              </Button>

              {/* Collection Menu */}

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  component={Link}
                  to="/necklaces"
                  onClick={handleMenuClose}
                >
                  Necklaces
                </MenuItem>

                <MenuItem
                  component={Link}
                  to="/earrings"
                  onClick={handleMenuClose}
                >
                  Earrings
                </MenuItem>

                <MenuItem
                  component={Link}
                  to="/bangles"
                  onClick={handleMenuClose}
                >
                  Bangles
                </MenuItem>
              </Menu>

              {/* Search Box */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#f5f5f5",
                  borderRadius: "6px",
                  px: 1.5,
                  py: 0.6,
                  flexGrow: 1,
                }}
              >
                <SearchIcon
                  sx={{
                    color: "gray",
                    fontSize: 20,
                    mr: 1,
                  }}
                />

                <InputBase
                  placeholder="Search bridal necklaces, kundan chokers, jhumka"
                  sx={{
                    fontSize: "13px",
                    width: "100%",
                  }}
                  fullWidth
                />
              </Box>
            </Box>
          )}

          {/* =========================
              RIGHT ICONS
          ========================== */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: {
                xs: 0.5,
                md: 1.5,
              },
            }}
          >
            {/* Chat & Track */}

            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                }}
              >
                <ChatIcon
                  sx={{
                    fontSize: 18,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  Chat & Track
                </Typography>
              </Box>
            )}

            {/* =========================
                WISHLIST
            ========================== */}

            <IconButton
              component={Link}
              to="/wishlist"
              size={isMobile ? "small" : "medium"}
              sx={{
                color: "#333",
              }}
            >
              <Badge
                badgeContent={2}
                color="error"
              >
                <FavoriteBorderIcon
                  sx={{
                    fontSize: 22,
                  }}
                />
              </Badge>
            </IconButton>

            {/* =========================
                SHOPPING CART
            ========================== */}

            <Box
              component={Link}
              to="/cart"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <Badge
                badgeContent={2}
                color="warning"
              >
                <ShoppingBagOutlinedIcon
                  sx={{
                    fontSize: 22,
                  }}
                />
              </Badge>

              {!isMobile && (
                <Box
                  sx={{
                    lineHeight: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    Bag
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    ₹1,598
                  </Typography>
                </Box>
              )}
            </Box>

            {/* =========================
                CUSTOMER LOGIN
            ========================== */}

            <IconButton
              component={Link}
              to="/customer-login"
              sx={{
                bgcolor: "#4a2028",
                color: "white",
                width: 28,
                height: 28,

                "&:hover": {
                  bgcolor: "#4a2028",
                },
              }}
            >
              <PersonIcon
                sx={{
                  fontSize: 18,
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>

        {/* =========================
            MOBILE SEARCH
        ========================== */}

        {isMobile && (
          <Box
            sx={{
              px: 2,
              pb: 1.5,
              display: "flex",
              gap: 1,
            }}
          >
            <Button
              onClick={handleMenuOpen}
              endIcon={
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: 16,
                  }}
                />
              }
              sx={{
                bgcolor: "#f5f5f5",
                color: "#333",
                textTransform: "none",
                fontSize: "12px",
                borderRadius: "6px",
                px: 1.5,
                minWidth: "90px",
              }}
            >
              All
            </Button>

            {/* Mobile Collection Menu */}

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                component={Link}
                to="/necklaces"
                onClick={handleMenuClose}
              >
                Necklaces
              </MenuItem>

              <MenuItem
                component={Link}
                to="/earrings"
                onClick={handleMenuClose}
              >
                Earrings
              </MenuItem>

              <MenuItem
                component={Link}
                to="/bangles"
                onClick={handleMenuClose}
              >
                Bangles
              </MenuItem>
            </Menu>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#f5f5f5",
                borderRadius: "6px",
                px: 1.5,
                py: 0.5,
                flexGrow: 1,
              }}
            >
              <SearchIcon
                sx={{
                  color: "gray",
                  fontSize: 18,
                  mr: 0.5,
                }}
              />

              <InputBase
                placeholder="Search jhumka, chokers..."
                sx={{
                  fontSize: "12px",
                  width: "100%",
                }}
              />
            </Box>
          </Box>
        )}

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}

        {!isMobile && (
          <>
            <Divider />

            <Toolbar
              sx={{
                justifyContent: "flex-start",
                gap: 1,
                minHeight: "48px !important",
                overflowX: "auto",

                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{
                    textTransform: "none",
                    color: "#333",
                    bgcolor: "transparent",
                    borderRadius: "4px",
                    px: 2,
                    py: 0.8,
                    fontSize: "13px",
                    fontWeight: 400,
                    whiteSpace: "nowrap",

                    "&:hover": {
                      bgcolor: "#f5f5f5",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Toolbar>
          </>
        )}
      </AppBar>

      {/* =========================
          MOBILE DRAWER
      ========================== */}

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 280,
          }}
        >
          {/* Drawer Header */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              bgcolor: "#4a2028",
              color: "white",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontFamily: "serif",
              }}
            >
              ZINORA
            </Typography>

            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Navigation List */}

          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.label}
                disablePadding
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    bgcolor: "transparent",
                    borderLeft: "4px solid transparent",

                    "&:hover": {
                      bgcolor: "#f5f5f5",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#333",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          {/* Wishlist */}

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/wishlist"
              onClick={() => setDrawerOpen(false)}
            >
              <FavoriteBorderIcon
                sx={{
                  mr: 1.5,
                  fontSize: 20,
                }}
              />

              <ListItemText
                primary="Wishlist"
                primaryTypographyProps={{
                  fontSize: "14px",
                }}
              />
            </ListItemButton>
          </ListItem>

          {/* Cart */}

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/cart"
              onClick={() => setDrawerOpen(false)}
            >
              <ShoppingBagOutlinedIcon
                sx={{
                  mr: 1.5,
                  fontSize: 20,
                }}
              />

              <ListItemText
                primary="Cart"
                primaryTypographyProps={{
                  fontSize: "14px",
                }}
              />
            </ListItemButton>
          </ListItem>

          {/* Customer Login */}

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/customer-login"
              onClick={() => setDrawerOpen(false)}
            >
              <PersonIcon
                sx={{
                  mr: 1.5,
                  fontSize: 20,
                }}
              />

              <ListItemText
                primary="Customer Login"
                primaryTypographyProps={{
                  fontSize: "14px",
                }}
              />
            </ListItemButton>
          </ListItem>

          <Divider />

          {/* Chat & Track */}

          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ChatIcon
              sx={{
                fontSize: 18,
              }}
            />

            <Typography
              sx={{
                fontSize: "13px",
              }}
            >
              Chat & Track
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}