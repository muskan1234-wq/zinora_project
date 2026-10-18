import React, { useCallback, useEffect, useState } from "react";

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  Button,
  Badge,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";

import { Link, useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

const PRODUCT_API = `${API_BASE}/api/products/`;

const readStorage = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const getCartCount = () =>
  readStorage("zinoraCart").reduce(
    (total, item) => total + Math.max(0, Number(item.quantity) || 1),
    0
  );

const getWishlistCount = () => readStorage("zinoraWishlist").length;

const getProductPath = (product) => {
  const category = String(
    product.category_name ||
      (typeof product.category === "string" ? product.category : "") ||
      product.category_slug ||
      ""
  )
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  if (product.is_new_arrival) return "/new-arrivals";

  if (category.includes("necklace") || category.includes("choker")) {
    return "/necklaces";
  }

  if (category.includes("earring") || category.includes("jhumka")) {
    return "/earrings";
  }

  if (category.includes("bangle") || category.includes("kada")) {
    return "/bangles";
  }

  if (category.includes("ring") || category.includes("pendant")) {
    return "/rings";
  }

  if (category.includes("bridal") || category.includes("festive")) {
    return "/bridal-festive";
  }

  return "/search?q=" + encodeURIComponent(product.name || "");
};

function Topbar() {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [collectionAnchor, setCollectionAnchor] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(getCartCount);
  const [wishlistCount, setWishlistCount] = useState(getWishlistCount);

  // Fetch actual products from Django backend
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch(PRODUCT_API);

        if (!response.ok) {
          throw new Error("Unable to fetch products");
        }

        const data = await response.json();

        const productList = Array.isArray(data)
          ? data
          : data.results || data.products || [];

        if (isMounted) {
          setProducts(
            productList.filter((product) => product.is_active !== false)
          );
        }
      } catch (error) {
        console.error("Topbar product search error:", error);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Keep cart and wishlist counts updated
  const refreshCounts = useCallback(() => {
    setCartCount(getCartCount());
    setWishlistCount(getWishlistCount());
  }, []);

  useEffect(() => {
    refreshCounts();

    window.addEventListener("storage", refreshCounts);
    window.addEventListener("focus", refreshCounts);
    window.addEventListener("zinoraCartUpdated", refreshCounts);
    window.addEventListener("zinoraWishlistUpdated", refreshCounts);

    return () => {
      window.removeEventListener("storage", refreshCounts);
      window.removeEventListener("focus", refreshCounts);
      window.removeEventListener("zinoraCartUpdated", refreshCounts);
      window.removeEventListener("zinoraWishlistUpdated", refreshCounts);
    };
  }, [refreshCounts]);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "New Arrivals", path: "/new-arrivals" },
    { name: "Necklaces & Chokers", path: "/necklaces" },
    { name: "Earrings & Jhumkas", path: "/earrings" },
    { name: "Bangles & Kadas", path: "/bangles" },
    { name: "Rings & Pendants", path: "/rings" },
    { name: "Bridal & Festive", path: "/bridal-festive" },
    { name: "Other Products", path: "/OtherProducts" },
    { name: "Offers", path: "/offers" },
  ];

  const collections = [
    { name: "All Collections", path: "/collections" },
    { name: "Necklaces & Chokers", path: "/necklaces" },
    { name: "Earrings & Jhumkas", path: "/earrings" },
    { name: "Bangles & Kadas", path: "/bangles" },
    { name: "Rings & Pendants", path: "/rings" },
    { name: "Bridal & Festive", path: "/bridal-festive" },
    { name: "New Arrivals", path: "/new-arrivals" },
    { name: "Other Products", path: "/OtherProducts" },
    { name: "Offers", path: "/offers" },
  ];

  // Search real backend products
  const filteredProducts = products
    .filter((product) => {
      const query = searchText.trim().toLowerCase();

      if (!query) return false;

      const name = String(product.name || "").toLowerCase();
      const category = String(
        product.category_name ||
          (typeof product.category === "string" ? product.category : "")
      ).toLowerCase();

      const sku = String(product.sku || "").toLowerCase();

      return (
        name.includes(query) ||
        category.includes(query) ||
        sku.includes(query)
      );
    })
    .slice(0, 5);

  const handleSearch = (event) => {
    if (event) event.preventDefault();

    const query = searchText.trim();

    if (!query) {
      setShowSuggestions(true);
      return;
    }

    setShowSuggestions(false);
    setShowSearch(false);

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleCollectionClick = (path) => {
    setCollectionAnchor(null);
    navigate(path);
  };

  const handleSuggestionClick = (product) => {
    setShowSuggestions(false);
    setShowSearch(false);

    navigate(getProductPath(product));
  };

  const handleRegisterClick = () => {
    setCollectionAnchor(null);
    setShowSuggestions(false);
    setShowSearch(false);

    navigate("/register");
  };

  const renderSearchField = () => (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      <TextField
        fullWidth
        value={searchText}
        onChange={(event) => {
          setSearchText(event.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Search necklaces, jhumkas, rings..."
        variant="outlined"
        size="small"
        inputProps={{
          "aria-label": "Search jewellery products",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                type="submit"
                size="small"
                aria-label="Search products"
              >
                <SearchIcon
                  sx={{ fontSize: 20, color: "#69101d" }}
                />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: searchText ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label="Clear search"
                onClick={() => {
                  setSearchText("");
                  setShowSuggestions(false);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: "38px",
            backgroundColor: "#f7f5f3",
            fontSize: "12px",
            borderRadius: "4px",
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "#d8b9bd",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#69101d",
            },
          },
        }}
      />

      {showSuggestions && searchText.trim() && (
        <Paper
          elevation={5}
          sx={{
            position: "absolute",
            top: "43px",
            left: 0,
            right: 0,
            zIndex: 1500,
            maxHeight: 300,
            overflowY: "auto",
            borderRadius: 1,
          }}
        >
          {filteredProducts.length > 0 ? (
            <List disablePadding>
              {filteredProducts.map((product, index) => (
                <React.Fragment key={product.id ?? product.sku ?? product.name}>
                  <ListItemButton
                    onClick={() => handleSuggestionClick(product)}
                    sx={{ py: 1 }}
                  >
                    <SearchIcon
                      sx={{
                        mr: 1.5,
                        fontSize: 18,
                        color: "#777",
                      }}
                    />

                    <ListItemText
                      primary={product.name}
                      secondary={product.category_name || "Jewellery"}
                      primaryTypographyProps={{ fontSize: 13 }}
                      secondaryTypographyProps={{ fontSize: 11 }}
                    />
                  </ListItemButton>

                  {index < filteredProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography fontSize={13} color="text.secondary">
                {products.length === 0
                  ? "Loading products or backend is unavailable."
                  : "No matching products found."}
              </Typography>

              <Button
                onClick={handleSearch}
                sx={{
                  mt: 1,
                  p: 0,
                  color: "#69101d",
                  textTransform: "none",
                  fontSize: 13,
                }}
              >
                Search for "{searchText}"
              </Button>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#333",
        borderBottom: "1px solid #ddd",
        zIndex: 1200,
      }}
    >
      {/* Top Announcement */}
      <Box
        sx={{
          backgroundColor: "#69101d",
          color: "#fff",
          minHeight: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: { xs: "9px", sm: "11px" },
          textAlign: "center",
          px: 1,
          py: 0.5,
        }}
      >
        FREE EXPRESS SHIPPING ABOVE ₹999 &nbsp; | &nbsp;
        COD AVAILABLE &nbsp; | &nbsp; 48-HOUR EASY EXCHANGE
      </Box>

      {/* Main Header */}
      <Toolbar
        sx={{
          minHeight: "70px !important",
          px: { xs: 1, md: 3 },
          gap: { xs: 0.5, md: 2 },
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            flexShrink: 0,
            mr: { xs: "auto", md: 0 },
            minWidth: { md: "140px" },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
              fontSize: { xs: "21px", md: "24px" },
              letterSpacing: "2px",
              color: "#5b0b18",
            }}
          >
            ZINORA
          </Typography>
        </Box>

        {/* All Collections */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Box
            onClick={(event) =>
              setCollectionAnchor(event.currentTarget)
            }
            role="button"
            tabIndex={0}
            aria-label="Open all collections"
            aria-haspopup="true"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setCollectionAnchor(event.currentTarget);
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#f7f5f3",
              width: "145px",
              height: "36px",
              px: 1.2,
              fontSize: "12px",
              color: "#555",
              borderRadius: "3px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#eee6e4",
                color: "#69101d",
              },
            }}
          >
            All Collections
            <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
          </Box>

          <Menu
            anchorEl={collectionAnchor}
            open={Boolean(collectionAnchor)}
            onClose={() => setCollectionAnchor(null)}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 220,
                  maxHeight: 420,
                  overflowY: "auto",
                  borderRadius: 1,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                },
              },
            }}
          >
            {collections.map((collection) => (
              <MenuItem
                key={collection.path}
                onClick={() =>
                  handleCollectionClick(collection.path)
                }
                sx={{
                  py: 1.2,
                  fontSize: 13,
                  "&:hover": {
                    backgroundColor: "#f8eeee",
                    color: "#69101d",
                  },
                }}
              >
                {collection.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Desktop Search */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            flex: 1,
            maxWidth: "390px",
            minWidth: 100,
          }}
        >
          {renderSearchField()}
        </Box>

        {/* Right Icons */}
        <Box
          sx={{
            marginLeft: { xs: 0, md: "auto" },
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.2, md: 1 },
          }}
        >
          {/* Register */}
          <Button
            variant="contained"
            onClick={handleRegisterClick}
            sx={{
              backgroundColor: "#69101d",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "11px", md: "13px" },
              minWidth: "auto",
              px: { xs: 1.2, md: 2 },
              py: 0.8,
              borderRadius: "4px",
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#4f0b15",
                boxShadow: "none",
              },
            }}
          >
            Register
          </Button>

          {/* Mobile Search */}
          {isMobile && (
            <IconButton
              size="small"
              aria-label="Open search"
              onClick={() => {
                setShowSearch((previous) => !previous);
                setShowSuggestions(false);
              }}
            >
              {showSearch ? (
                <CloseIcon sx={{ color: "#5b0b18" }} />
              ) : (
                <SearchIcon sx={{ color: "#5b0b18" }} />
              )}
            </IconButton>
          )}

          {/* Chat & Track */}
          <Button
            onClick={() => navigate("/chat-track")}
            sx={{
              color: "#29211e",
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "10px", md: "14px" },
              minWidth: "auto",
              px: { xs: 0.5, md: 1 },
              whiteSpace: "nowrap",
              "&:hover": {
                color: "#a66b48",
                backgroundColor: "transparent",
              },
            }}
          >
            Chat & Track
          </Button>

          {/* Wishlist with live count */}
          <IconButton
            size="small"
            aria-label={`Wishlist, ${wishlistCount} items`}
            onClick={() => navigate("/wishlist")}
          >
            <Badge
              badgeContent={wishlistCount}
              color="error"
              max={99}
              overlap="circular"
            >
              <FavoriteBorderIcon
                sx={{
                  fontSize: { xs: 20, md: 24 },
                  color: "#5b0b18",
                }}
              />
            </Badge>
          </IconButton>

          {/* Cart with live count */}
          <IconButton
            size="small"
            aria-label={`Shopping bag, ${cartCount} items`}
            onClick={() => navigate("/cart")}
          >
            <Badge
              badgeContent={cartCount}
              color="error"
              max={99}
              overlap="circular"
            >
              <ShoppingBagOutlinedIcon
                sx={{
                  fontSize: { xs: 20, md: 24 },
                  color: "#5b0b18",
                }}
              />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton
            aria-label="Open Profile"
            title="Profile"
            onClick={() => navigate("/profile")}
            sx={{
              width: 34,
              height: 34,
              backgroundColor: "#5b0b18",
              "&:hover": {
                backgroundColor: "#741526",
              },
            }}
          >
            <PersonIcon
              sx={{ color: "#fff", fontSize: 21 }}
            />
          </IconButton>
        </Box>

        {/* Mobile Search Field */}
        {isMobile && showSearch && (
          <Box
            sx={{
              width: "100%",
              flexBasis: "100%",
              pb: 1,
            }}
          >
            {renderSearchField()}
          </Box>
        )}
      </Toolbar>

      {/* Navigation */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: {
            xs: "flex-start",
            md: "space-around",
          },
          minHeight: "48px",
          borderTop: "1px solid #eeeeee",
          backgroundColor: "#fff",
          overflowX: "auto",
          px: 1,
          "&::-webkit-scrollbar": {
            height: "3px",
          },
        }}
      >
        {menuItems.map((item) => (
          <Box
            key={item.path}
            component={Link}
            to={item.path}
            sx={{
              textDecoration: "none",
              color: "#555",
              fontSize: { xs: "11px", md: "13px" },
              px: { xs: 1.2, md: 1.5 },
              py: 1,
              whiteSpace: "nowrap",
              transition: "0.2s",
              "&:hover": {
                color: "#69101d",
                fontWeight: "bold",
              },
            }}
          >
            {item.name}
          </Box>
        ))}
      </Box>
    </AppBar>
  );
}

export default Topbar;