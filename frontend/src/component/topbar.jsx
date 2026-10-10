
import React, { useState } from "react";
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
  ClickAwayListener,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonIcon from "@mui/icons-material/Person";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [collectionAnchor, setCollectionAnchor] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "New Arrivals", path: "/new-arrivals" },
    { name: "Necklaces & Chokers", path: "/necklaces" },
    { name: "Earrings & Jhumkas", path: "/earrings" },
    { name: "Bangles & Kadas", path: "/bangles" },
    { name: "Rings & Pendants", path: "/rings" },
    { name: "Bridal & Festive", path: "/bridal-festive" },
    { name: "Under ₹199 / ₹299", path: "/budget" },
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
    { name: "Under ₹199 / ₹299", path: "/budget" },
    { name: "Offers", path: "/offers" },
  ];

  // Sample data for search suggestions.
  // Replace this array with products fetched from your backend/API.
  const products = [
    {
      name: "Kundan Necklace Set",
      category: "Necklaces & Chokers",
      path: "/necklaces",
    },
    {
      name: "Gold Plated Choker",
      category: "Necklaces & Chokers",
      path: "/necklaces",
    },
    {
      name: "Traditional Jhumka Earrings",
      category: "Earrings & Jhumkas",
      path: "/earrings",
    },
    {
      name: "Pearl Earrings",
      category: "Earrings & Jhumkas",
      path: "/earrings",
    },
    {
      name: "Gold Plated Bangles",
      category: "Bangles & Kadas",
      path: "/bangles",
    },
    {
      name: "Designer Ring",
      category: "Rings & Pendants",
      path: "/rings",
    },
    {
      name: "Bridal Jewellery Set",
      category: "Bridal & Festive",
      path: "/bridal-festive",
    },
  ];

  const filteredProducts = products
    .filter((product) => {
      const query = searchText.trim().toLowerCase();

      if (!query) return false;

      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
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

  const handleSuggestionClick = (path) => {
    setShowSuggestions(false);
    setShowSearch(false);
    navigate(path);
  };

  const renderSearchField = (mobile = false) => (
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
                <React.Fragment key={product.name}>
                  <ListItemButton
                    onClick={() =>
                      handleSuggestionClick(product.path)
                    }
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
                      secondary={product.category}
                      primaryTypographyProps={{
                        fontSize: 13,
                      }}
                      secondaryTypographyProps={{
                        fontSize: 11,
                      }}
                    />
                  </ListItemButton>

                  {index < filteredProducts.length - 1 && (
                    <Divider />
                  )}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography fontSize={13} color="text.secondary">
                No matching sample products found.
              </Typography>

              <Typography
                component="button"
                onClick={handleSearch}
                sx={{
                  mt: 1,
                  p: 0,
                  border: 0,
                  background: "none",
                  color: "#69101d",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Search for "{searchText}"
              </Typography>
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
      {/* TOP ANNOUNCEMENT */}

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

      {/* MAIN HEADER */}

      <Toolbar
        sx={{
          minHeight: "70px !important",
          px: { xs: 1, md: 3 },
          gap: { xs: 0.5, md: 2 },
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}
      >
        {/* LOGO */}

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

        {/* ALL COLLECTIONS */}

        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Box
            onClick={(event) =>
              setCollectionAnchor(event.currentTarget)
            }
            role="button"
            tabIndex={0}
            aria-label="Open all collections"
            aria-haspopup="true"
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

        {/* DESKTOP SEARCH */}

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

        {/* RIGHT ICONS */}

        <Box
          sx={{
            marginLeft: { xs: 0, md: "auto" },
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.2, md: 1 },
          }}
        >
          {/* MOBILE SEARCH ICON */}

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

          {/* CHAT */}

          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
              gap: 0.5,
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            <ChatOutlinedIcon
              sx={{ fontSize: 19, color: "#15533f" }}
            />
            Chat & Track
          </Box>

          {/* WISHLIST */}

          <IconButton
            size="small"
            aria-label="Wishlist"
            onClick={() => navigate("/wishlist")}
          >
            <FavoriteBorderIcon
              sx={{
                fontSize: { xs: 22, md: 24 },
                color: "#5b0b18",
              }}
            />
          </IconButton>

          {/* SHOPPING BAG */}

          <IconButton
            size="small"
            aria-label="Shopping bag"
            onClick={() => navigate("/cart")}
          >
            <ShoppingBagOutlinedIcon
              sx={{
                fontSize: { xs: 22, md: 24 },
                color: "#5b0b18",
              }}
            />
          </IconButton>

          {/* PROFILE */}

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
            <PersonIcon sx={{ color: "#fff", fontSize: 21 }} />
          </IconButton>
        </Box>

        {/* MOBILE SEARCH FIELD */}

        {isMobile && showSearch && (
          <Box sx={{ width: "100%", flexBasis: "100%", pb: 1 }}>
            {renderSearchField(true)}
          </Box>
        )}
      </Toolbar>

      {/* NAVIGATION */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-start", md: "space-around" },
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
