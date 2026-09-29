
import React from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const menuItems = [
  "Home",
  "New Arrivals",
  "Necklaces & Chokers",
  "Earrings & Jhumkas",
  "Bangles & Kadas",
  "Rings & Pendants",
  "Bridal & Festive",
  "Under ₹199 & ₹299",
  "All Categories",
];

function Topbar() {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      {/* ================= OFFER BAR ================= */}
      <Box
        sx={{
          height: "24px",
          backgroundColor: "#5b0b16",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "9px",
          letterSpacing: "0.3px",
        }}
      >
        FREE EXPRESS SHIPPING ON ORDERS ABOVE ₹999
        &nbsp; | &nbsp;
        COD AVAILABLE ACROSS ALL PINCODES
        &nbsp; | &nbsp;
        48-HOUR EASY EXCHANGE
      </Box>

      {/* ================= MAIN HEADER ================= */}
      <Box
        sx={{
          minHeight: "62px",
          display: "flex",
          alignItems: "center",
          padding: "0 25px",
          gap: "18px",
          borderBottom: "1px solid #eeeeee",
          backgroundColor: "#ffffff",
        }}
      >
        {/* LOGO */}
        <Box
          sx={{
            minWidth: "105px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: "22px",
              fontWeight: "bold",
              color: "#5b0b16",
              letterSpacing: "2px",
            }}
          >
            ZINORA
          </Typography>
        </Box>

        {/* ALL CATEGORIES */}
        <Button
          sx={{
            color: "#333333",
            fontSize: "11px",
            textTransform: "none",
            whiteSpace: "nowrap",
            minWidth: "auto",
          }}
        >
          All Categories
        </Button>

        {/* SEARCH BOX */}
        <Box
          sx={{
            flex: 1,
            maxWidth: "430px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            border: "1px solid #dddddd",
            borderRadius: "2px",
            padding: "0 9px",
            backgroundColor: "#ffffff",
          }}
        >
          <SearchIcon
            sx={{
              fontSize: "18px",
              color: "#777777",
            }}
          />

          <TextField
            variant="standard"
            placeholder="Search bridal necklaces, kundan chokers, jhumke"
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              width: "100%",
              marginLeft: "7px",

              "& input": {
                fontSize: "10px",
              },
            }}
          />
        </Box>

        {/* RIGHT SIDE */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginLeft: "auto",
            gap: "2px",
          }}
        >
          <Button
            sx={{
              color: "#333333",
              fontSize: "10px",
              textTransform: "none",
              whiteSpace: "nowrap",
              minWidth: "auto",
            }}
          >
            Chat & Track
          </Button>

          {/* WISHLIST */}
          <IconButton
            size="small"
            sx={{
              color: "#333333",
            }}
          >
            <FavoriteBorderIcon sx={{ fontSize: "19px" }} />
          </IconButton>

          {/* CART */}
          <IconButton
            size="small"
            sx={{
              color: "#333333",
            }}
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: "19px" }} />
          </IconButton>

          {/* ACCOUNT */}
          <IconButton
            size="small"
            sx={{
              color: "#333333",
            }}
          >
            <PersonOutlinedIcon sx={{ fontSize: "19px" }} />
          </IconButton>
        </Box>
      </Box>

      {/* ================= NAVIGATION MENU ================= */}
      <Box
        sx={{
          width: "100%",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #eeeeee",
          backgroundColor: "#ffffff",
          overflowX: "auto",

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {menuItems.map((item, index) => (
          <Button
            key={item}
            sx={{
              height: "52px",
              padding: "0 18px",
              borderRadius: 0,

              backgroundColor:
                index === 0 ? "#6b0d18" : "transparent",

              color:
                index === 0 ? "#ffffff" : "#333333",

              fontSize: "10px",
              fontWeight: index === 0 ? 600 : 400,
              textTransform: "none",
              whiteSpace: "nowrap",

              "&:hover": {
                backgroundColor:
                  index === 0 ? "#6b0d18" : "#f7f2f2",

                color:
                  index === 0 ? "#ffffff" : "#5b0b16",
              },
            }}
          >
            {item}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export default Topbar;