
import React from "react";

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonIcon from "@mui/icons-material/Person";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";

import { Link } from "react-router-dom";

function Topbar() {
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

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#333",
        borderBottom: "1px solid #ddd",
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
          fontSize: "11px",
          textAlign: "center",
          px: 1,
        }}
      >
        FREE EXPRESS SHIPPING ON ORDERS ABOVE ₹999 &nbsp; | &nbsp;
        COD AVAILABLE ACROSS ALL PINCODES &nbsp; | &nbsp;
        48-HOUR EASY EXCHANGE
      </Box>

      {/* MAIN HEADER */}
      <Toolbar
        sx={{
          minHeight: "70px !important",
          px: { xs: 1, md: 3 },
          gap: 2,
        }}
      >
        {/* LOGO */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: { md: "180px" },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
              fontSize: "24px",
              letterSpacing: "2px",
              color: "#5b0b18",
            }}
          >
            ZINORA
          </Typography>
        </Box>

        {/* ALL COLLECTIONS */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#f7f5f3",
            width: "125px",
            height: "34px",
            px: 1.2,
            fontSize: "12px",
            color: "#555",
            borderRadius: "3px",
          }}
        >
          All Collections
          <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
        </Box>

        {/* SEARCH */}
        <TextField
          placeholder="Search bridal necklaces, kundan chokers, jhumka"
          variant="outlined"
          size="small"
          sx={{
            display: { xs: "none", md: "block" },
            flex: 1,
            maxWidth: "390px",

            "& .MuiOutlinedInput-root": {
              height: "34px",
              backgroundColor: "#f7f5f3",
              fontSize: "12px",

              "& fieldset": {
                border: "none",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "#777" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* RIGHT ICONS */}
        <Box
          sx={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, md: 1.5 },
          }}
        >
          {/* CHAT */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.5,
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            <ChatOutlinedIcon
              sx={{
                fontSize: 19,
                color: "#15533f",
              }}
            />
            Chat & Track
          </Box>

          {/* WISHLIST */}
          <IconButton size="small">
            <FavoriteBorderIcon
              sx={{
                fontSize: 24,
                color: "#5b0b18",
              }}
            />
          </IconButton>

          {/* BAG */}
          <IconButton size="small">
            <ShoppingBagOutlinedIcon
              sx={{
                fontSize: 24,
                color: "#5b0b18",
              }}
            />
          </IconButton>

          {/* ACCOUNT */}
          <IconButton
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "#5b0b18",

              "&:hover": {
                backgroundColor: "#741526",
              },
            }}
          >
            <PersonIcon
              sx={{
                color: "#fff",
                fontSize: 21,
              }}
            />
          </IconButton>
        </Box>
      </Toolbar>

      {/* NAVIGATION */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          minHeight: "58px",
          borderTop: "1px solid #eeeeee",
          backgroundColor: "#fff",
          overflowX: "auto",
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
              fontSize: "13px",
              px: 1.5,
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
