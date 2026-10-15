
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  Divider,
  IconButton,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";

// ================= PRODUCTS DATA =================

const products = [
  {
    name: "The Jodha Royal Kundan Necklace",
    price: "₹1,849",
    oldPrice: "₹4,299",
    rating: "4.9",
    reviews: "128",
    badge: "BESTSELLER",
    category: "Bridal Choker Sets",
    silhouette: "Choker & Collar Sets",
    stone: "Uncut Polki",
    priceRange: "Grand Bridal ₹1,500 - ₹3,500",
    metal: "Hypoallergenic Pure Brass",
    weight: "Royal Trousseau > 80 grams",
    offer: "57% OFF",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Padmavati Kemp Ruby Heritage",
    price: "₹999",
    oldPrice: "₹2,199",
    rating: "4.8",
    reviews: "89",
    badge: "HERITAGE TEMPLE",
    category: "Temple & Antique Harams",
    silhouette: "Rani Haar & Long",
    stone: "Kemp Ruby",
    priceRange: "Festive Luxury ₹500 - ₹1,499",
    metal: "Brass",
    weight: "Royal Trousseau > 80 grams",
    offer: "55% OFF",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Noor Dual-Layer Moissanite",
    price: "₹799",
    oldPrice: "₹1,699",
    rating: "4.7",
    reviews: "64",
    badge: "WATERPROOF",
    category: "Minimal Daily Chains",
    silhouette: "Layered & Tiered Chains",
    stone: "Moissanite CZ",
    priceRange: "Festive Luxury ₹500 - ₹1,499",
    metal: "German Silver Finish",
    weight: "Medium Partywear 40–80 grams",
    offer: "53% OFF",
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Mayuri Peacock Antique Necklace",
    price: "₹1,699",
    oldPrice: "₹3,499",
    rating: "5.0",
    reviews: "41",
    badge: "ROYAL HARAM",
    category: "Temple & Antique Harams",
    silhouette: "Rani Haar & Long",
    stone: "Green Onyx",
    priceRange: "Grand Bridal ₹1,500 - ₹3,500",
    metal: "Vintage Copper Alloy",
    weight: "Royal Trousseau > 80 grams",
    offer: "51% OFF",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Gauri Delicate Pearl Collar",
    price: "₹349",
    oldPrice: "₹799",
    rating: "4.6",
    reviews: "52",
    badge: "SAREE FAVORITE",
    category: "Pearl & Polki Strings",
    silhouette: "Princess Length",
    stone: "Basra Pearls",
    priceRange: "Budget Picks Under ₹499",
    metal: "Hypoallergenic Pure Brass",
    weight: "Lightweight < 40 grams",
    offer: "56% OFF",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Aanya Micro-Gold Dainty Chain",
    price: "₹249",
    oldPrice: "₹599",
    rating: "4.9",
    reviews: "110",
    badge: "DAILY WEAR",
    category: "Minimal Daily Chains",
    silhouette: "Princess Length",
    stone: "Meenakari Enamel",
    priceRange: "Budget Picks Under ₹499",
    metal: "Hypoallergenic Pure Brass",
    weight: "Lightweight < 40 grams",
    offer: "58% OFF",
    image:
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Rajkumari Green Onyx Necklace",
    price: "₹1,399",
    oldPrice: "₹2,999",
    rating: "4.8",
    reviews: "78",
    badge: "ROYAL JAIPURI",
    category: "Oxidised Silver Necklaces",
    silhouette: "Hasi & Rigid Torque",
    stone: "Green Onyx",
    priceRange: "Festive Luxury ₹500 - ₹1,499",
    metal: "Vintage Copper Alloy",
    weight: "Medium Partywear 40–80 grams",
    offer: "53% OFF",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Sitara Celestial Star Choker",
    price: "₹599",
    oldPrice: "₹1,299",
    rating: "4.7",
    reviews: "93",
    badge: "TRENDING",
    category: "Bridal Choker Sets",
    silhouette: "Choker & Collar Sets",
    stone: "Moissanite CZ",
    priceRange: "Festive Luxury ₹500 - ₹1,499",
    metal: "German Silver Finish",
    weight: "Lightweight < 40 grams",
    offer: "54% OFF",
    image:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=700&q=80",
  },
];

// ================= PRODUCT CARD =================

function ProductCard({ product }) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #ebe5df",
        borderRadius: "5px",
        overflow: "hidden",
        backgroundColor: "#fff",
        position: "relative",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 5px 18px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box
        sx={{
          height: { xs: 200, sm: 210, md: 230 },
          position: "relative",
          backgroundColor: "#eee",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        <Box sx={{ position: "absolute", top: 7, left: 7 }}>
          <Typography
            sx={{
              backgroundColor: "#6c0d19",
              color: "#fff",
              fontSize: "8px",
              fontWeight: 700,
              px: 0.7,
              py: 0.35,
            }}
          >
            {product.badge}
          </Typography>

          <Typography
            sx={{
              display: "inline-block",
              backgroundColor: "#e60000",
              color: "#fff",
              fontSize: "8px",
              fontWeight: 700,
              px: 0.7,
              py: 0.35,
              mt: 0.3,
            }}
          >
            {product.offer}
          </Typography>
        </Box>

        <IconButton
          size="small"
          aria-label="Add to wishlist"
          sx={{
            position: "absolute",
            right: 6,
            top: 6,
            backgroundColor: "#fff",
            width: 27,
            height: 27,
            "&:hover": { backgroundColor: "#fff" },
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 16, color: "#777" }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 1.2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
          <StarIcon sx={{ fontSize: 13, color: "#d69b00" }} />
          <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>
            {product.rating}
          </Typography>
          <Typography sx={{ fontSize: "9px", color: "#777" }}>
            ({product.reviews} reviews)
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#55101a",
            mt: 0.7,
            minHeight: 32,
          }}
        >
          {product.name}
        </Typography>

        <Typography sx={{ fontSize: "9px", color: "#888", mt: 0.5 }}>
          Handcrafted premium jewellery with micro-gold finishing.
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Typography
            sx={{ color: "#6c0d19", fontSize: "14px", fontWeight: 700 }}
          >
            {product.price}
          </Typography>
          <Typography
            sx={{
              color: "#999",
              fontSize: "10px",
              textDecoration: "line-through",
            }}
          >
            {product.oldPrice}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: "9px", color: "#777", mt: 0.6 }}>
          ✓ Free Express Delivery
        </Typography>
      </Box>
    </Paper>
  );
}

// ================= NECKLACES PAGE =================

function Necklaces() {
  const [selectedSilhouette, setSelectedSilhouette] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [selectedMetal, setSelectedMetal] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState([]);
  const [sortBy, setSortBy] = useState("featured");

  // Checkbox handler
  const handleFilterChange = (value, setter) => {
    setter((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedSilhouette([]);
    setSelectedPrice([]);
    setSelectedMetal([]);
    setSelectedWeight([]);
  };

  // All filters work together
  const filteredProducts = products
    .filter((product) => {
      const silhouetteMatch =
        selectedSilhouette.length === 0 ||
        selectedSilhouette.includes(product.silhouette);

      const priceMatch =
        selectedPrice.length === 0 ||
        selectedPrice.includes(product.priceRange);

      const metalMatch =
        selectedMetal.length === 0 ||
        selectedMetal.includes(product.metal);

      const weightMatch =
        selectedWeight.length === 0 ||
        selectedWeight.includes(product.weight);

      return (
        silhouetteMatch &&
        priceMatch &&
        metalMatch &&
        weightMatch
      );
    })
    .sort((a, b) => {
      const priceA = Number(a.price.replace(/[₹,]/g, ""));
      const priceB = Number(b.price.replace(/[₹,]/g, ""));

      if (sortBy === "low") return priceA - priceB;
      if (sortBy === "high") return priceB - priceA;

      return 0;
    });

  const silhouetteOptions = [
    "Choker & Collar Sets",
    "Rani Haar & Long",
    "Princess Length",
    "Layered & Tiered Chains",
    "Hasi & Rigid Torque",
  ];

  const priceOptions = [
    "Budget Picks Under ₹499",
    "Festive Luxury ₹500 - ₹1,499",
    "Grand Bridal ₹1,500 - ₹3,500",
  ];

  const metalOptions = [
    "Hypoallergenic Pure Brass",
    "Brass",
    "Vintage Copper Alloy",
    "German Silver Finish",
  ];

  const weightOptions = [
    "Lightweight < 40 grams",
    "Medium Partywear 40–80 grams",
    "Royal Trousseau > 80 grams",
  ];

  const filterLabelSx = {
    "& .MuiFormControlLabel-label": {
      fontSize: "10px",
      color: "#51413e",
    },
    margin: 0,
    alignItems: "flex-start",
  };

  const checkboxSx = {
    color: "#9d8d83",
    "&.Mui-checked": { color: "#6c0d19" },
    padding: "3px 6px 3px 0",
  };

  return (
    <Box
      sx={{
        backgroundColor: "#faf9f7",
        minHeight: "100vh",
        color: "#4d1717",
      }}
    >
      {/* PAGE HEADER */}
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 2 }}>
        <Typography sx={{ fontSize: "10px", color: "#9b7a29", mb: 1 }}>
          Home › Jewellery › Necklaces
        </Typography>

        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            color: "#560914",
            fontSize: { xs: "29px", sm: "36px", md: "43px" },
            lineHeight: 1.1,
            fontWeight: 500,
          }}
        >
          Necklaces, Chokers & Royal
          <br />
          Harams
        </Typography>

        <Typography
          sx={{
            mt: 1,
            maxWidth: 700,
            color: "#746966",
            fontSize: "11px",
            lineHeight: 1.7,
          }}
        >
          Handcrafted heritage Kundan sets, multi-layered temple haarams,
          and luminous stone chokers inspired by Indian jewellery artisans.
        </Typography>

        {/* SORT BAR */}
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 1.2,
            border: "1px solid #eee8e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ fontSize: "11px", fontWeight: 700 }}>
            {filteredProducts.length} Products Found
          </Typography>

          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              sx={{
                height: 32,
                fontSize: "10px",
                minWidth: 175,
                backgroundColor: "#fff",
              }}
            >
              <MenuItem value="featured">Sort: Featured</MenuItem>
              <MenuItem value="low">Price: Low to High</MenuItem>
              <MenuItem value="high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>

      {/* MAIN SECTION */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          mt: 2,
          mb: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "190px 1fr",
            md: "220px 1fr",
          },
          gap: 2,
          alignItems: "start",
        }}
      >
        {/* FILTER SIDEBAR */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            border: "1px solid #ebe5df",
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "12px", fontWeight: 700 }}>
              <FilterListIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
              Filters
            </Typography>

            <Button
              size="small"
              onClick={resetFilters}
              sx={{
                fontSize: "9px",
                color: "#9a731f",
                minWidth: "auto",
                textTransform: "none",
              }}
            >
              RESET ALL
            </Button>
          </Box>

          <Divider sx={{ my: 1.3 }} />

          {/* SILHOUETTE FILTER */}
          <Typography sx={{ fontSize: "11px", fontWeight: 700, mb: 0.6 }}>
            Silhouette & Style
          </Typography>

          <FormGroup>
            {silhouetteOptions.map((item) => (
              <FormControlLabel
                key={item}
                sx={filterLabelSx}
                control={
                  <Checkbox
                    size="small"
                    sx={checkboxSx}
                    checked={selectedSilhouette.includes(item)}
                    onChange={() =>
                      handleFilterChange(item, setSelectedSilhouette)
                    }
                  />
                }
                label={item}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 1.3 }} />

          {/* PRICE FILTER */}
          <Typography sx={{ fontSize: "11px", fontWeight: 700, mb: 0.6 }}>
            Price Range
          </Typography>

          <FormGroup>
            {priceOptions.map((item) => (
              <FormControlLabel
                key={item}
                sx={filterLabelSx}
                control={
                  <Checkbox
                    size="small"
                    sx={checkboxSx}
                    checked={selectedPrice.includes(item)}
                    onChange={() => handleFilterChange(item, setSelectedPrice)}
                  />
                }
                label={item}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 1.3 }} />

          {/* METAL FILTER */}
          <Typography sx={{ fontSize: "11px", fontWeight: 700, mb: 0.6 }}>
            Base Metal & Skin Safe
          </Typography>

          <FormGroup>
            {metalOptions.map((item) => (
              <FormControlLabel
                key={item}
                sx={filterLabelSx}
                control={
                  <Checkbox
                    size="small"
                    sx={checkboxSx}
                    checked={selectedMetal.includes(item)}
                    onChange={() => handleFilterChange(item, setSelectedMetal)}
                  />
                }
                label={item}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 1.3 }} />

          {/* WEIGHT FILTER */}
          <Typography sx={{ fontSize: "11px", fontWeight: 700, mb: 0.6 }}>
            Necklace Weight Profile
          </Typography>

          <FormGroup>
            {weightOptions.map((item) => (
              <FormControlLabel
                key={item}
                sx={filterLabelSx}
                control={
                  <Checkbox
                    size="small"
                    sx={checkboxSx}
                    checked={selectedWeight.includes(item)}
                    onChange={() => handleFilterChange(item, setSelectedWeight)}
                  />
                }
                label={item}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 1.3 }} />

          <Typography sx={{ fontSize: "10px", color: "#777", lineHeight: 1.6 }}>
            ♢ Skin-safe jewellery
            <br />
            Crafted with care for everyday elegance.
          </Typography>
        </Paper>

        {/* PRODUCT GRID */}
        <Box>
          {filteredProducts.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.5,
                alignContent: "start",
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </Box>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                border: "1px solid #ebe5df",
                backgroundColor: "#fff",
              }}
            >
              <Typography sx={{ fontSize: "16px", fontWeight: 700 }}>
                No necklaces found
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "#777", mt: 1 }}>
                Try changing your filters or reset all filters.
              </Typography>
              <Button
                onClick={resetFilters}
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#6c0d19",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#4d0710" },
                }}
              >
                Reset Filters
              </Button>
            </Paper>
          )}
        </Box>
      </Box>

      {/* STYLIST SECTION */}
      <Box sx={{ px: { xs: 2, md: 4 }, mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#f5f2ed",
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "10px", color: "#9a731f" }}>
              CAN'T DECIDE YOUR FIT?
            </Typography>
            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: "20px",
                color: "#6b101c",
                mt: 0.5,
              }}
            >
              Speak to Our Jewellery Stylist
            </Typography>
            <Typography sx={{ fontSize: "10px", color: "#777", mt: 0.5 }}>
              Find a necklace to complement your style.
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#075d39",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { backgroundColor: "#064c30" },
            }}
          >
            STYLE ME ON WHATSAPP
          </Button>
        </Paper>
      </Box>

      {/* FOOTER PROMISE STRIP */}
      <Box
        sx={{
          backgroundColor: "#680b18",
          color: "#fff",
          px: { xs: 2, md: 5 },
          py: 3,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {[
          ["♢", "Skin-safe Jewellery", "Thoughtfully selected materials"],
          ["✧", "Polished Finish", "Made for elegant occasions"],
          ["♕", "Handcrafted Style", "Inspired by Indian craftsmanship"],
        ].map(([icon, title, subtitle]) => (
          <Box
            key={title}
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
          >
            <Box
              sx={{
                width: 35,
                height: 35,
                backgroundColor: "#8b2634",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography sx={{ fontSize: "12px", fontWeight: 700 }}>
                {title}
              </Typography>
              <Typography sx={{ fontSize: "10px", opacity: 0.8 }}>
                {subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Necklaces;
