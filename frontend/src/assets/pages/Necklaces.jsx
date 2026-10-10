
import React from "react";
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
  Chip,
  IconButton,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const products = [
  {
    name: "The Jodha Royal Kundan Necklace",
    price: "₹1,849",
    oldPrice: "₹4,299",
    rating: "4.9",
    reviews: "128",
    badge: "BESTSELLER",
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
    offer: "54% OFF",
    image:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=700&q=80",
  },
];

const categories = [
  "All Necklaces 84",
  "Bridal Choker Sets",
  "Temple & Antique Harams",
  "Minimal Daily Chains",
  "Pearl & Polki Strings",
  "Oxidised Silver Necklaces",
];

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
      {/* Image */}
      <Box
        sx={{
          height: { xs: 180, sm: 210, md: 230 },
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

        {/* Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 7,
            left: 7,
          }}
        >
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

        {/* Wishlist */}
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            right: 6,
            top: 6,
            backgroundColor: "#fff",
            width: 27,
            height: 27,
            "&:hover": {
              backgroundColor: "#fff",
            },
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 16, color: "#777" }} />
        </IconButton>
      </Box>

      {/* Details */}
      <Box sx={{ p: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
          <StarIcon sx={{ fontSize: 11, color: "#d69b00" }} />

          <Typography sx={{ fontSize: "9px", fontWeight: 700 }}>
            {product.rating}
          </Typography>

          <Typography sx={{ fontSize: "8px", color: "#777" }}>
            ({product.reviews} reviews)
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#55101a",
            mt: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </Typography>

        <Typography
          sx={{
            fontSize: "7px",
            color: "#888",
            mt: 0.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Handcrafted premium jewellery with micro-gold finishing...
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mt: 0.7 }}>
          <Typography
            sx={{
              color: "#6c0d19",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {product.price}
          </Typography>

          <Typography
            sx={{
              color: "#999",
              fontSize: "8px",
              textDecoration: "line-through",
            }}
          >
            {product.oldPrice}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: "7px",
            color: "#777",
            mt: 0.4,
          }}
        >
          ✓ Free Express Delivery
        </Typography>
      </Box>
    </Paper>
  );
}

function Necklaces() {
  return (
    <Box
      sx={{
        backgroundColor: "#faf9f7",
        minHeight: "100vh",
        color: "#4d1717",
      }}
    >
      {/* ================= PAGE HEADER ================= */}
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 1.5 }}>
        {/* Breadcrumb */}
        <Typography
          sx={{
            fontSize: "8px",
            color: "#9b7a29",
            mb: 0.8,
          }}
        >
          Home › Jewellery › Necklaces
        </Typography>

        {/* Main heading area */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                color: "#560914",
                fontSize: {
                  xs: "28px",
                  sm: "36px",
                  md: "43px",
                },
                lineHeight: 0.98,
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
                fontSize: "9px",
                lineHeight: 1.5,
              }}
            >
              Handcrafted heritage Kundan sets, multi-layered temple
              haarams, and luminous stone chokers shaped by generations
              of Indian jewellery artisans using heirloom micro-gold
              plating.
            </Typography>
          </Box>

          {/* Royal finish card */}
          <Paper
            elevation={0}
            sx={{
              display: { xs: "none", md: "flex" },
              width: 210,
              p: 1.5,
              alignItems: "center",
              gap: 1,
              border: "1px solid #eee7e0",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "#6c0d19",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
              }}
            >
              ♙
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#6c0d19",
                }}
              >
                Authentic Royal Finish
              </Typography>

              <Typography
                sx={{
                  fontSize: "7px",
                  color: "#777",
                  mt: 0.3,
                }}
              >
                Micro-maintenance gold with
                <br />
                1-Year Polish Guarantee
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Categories */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mt: 2,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {categories.map((category, index) => (
            <Button
              key={category}
              sx={{
                flexShrink: 0,
                textTransform: "none",
                fontSize: "8px",
                px: 1.5,
                py: 0.7,
                minHeight: 28,
                borderRadius: "5px",
                backgroundColor:
                  index === 0 ? "#650c18" : "#fff",
                color: index === 0 ? "#fff" : "#6a3333",
                border:
                  index === 0
                    ? "none"
                    : "1px solid #eee6df",
                "&:hover": {
                  backgroundColor:
                    index === 0 ? "#650c18" : "#f5f0eb",
                },
              }}
            >
              {category}
            </Button>
          ))}
        </Box>

        {/* Product count / sort */}
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 1,
            px: 1.5,
            border: "1px solid #eee8e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: "8px",
              fontWeight: 700,
              color: "#63101b",
            }}
          >
            84 Handcrafted Pieces
            <span style={{ color: "#aaa", margin: "0 7px" }}>|</span>
            Jaipur & Rajkot Ateliers
          </Typography>

          <FormControl size="small">
            <Select
              defaultValue="featured"
              sx={{
                height: 27,
                fontSize: "8px",
                minWidth: 160,
                backgroundColor: "#fafafa",
                "& fieldset": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="featured">
                Sort: Featured & Bestsellers
              </MenuItem>
              <MenuItem value="low">Price: Low to High</MenuItem>
              <MenuItem value="high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>

      {/* ================= PRODUCTS SECTION ================= */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          mt: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "190px 1fr",
            md: "205px 1fr",
          },
          gap: 2,
        }}
      >
        {/* ================= FILTER SIDEBAR ================= */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            border: "1px solid #ebe5df",
            height: "fit-content",
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
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#5b101c",
              }}
            >
              <FilterListIcon sx={{ fontSize: 12, mr: 0.5 }} />
              Filters
            </Typography>

            <Typography
              sx={{
                fontSize: "7px",
                color: "#9a731f",
              }}
            >
              RESET ALL
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Silhouette */}
          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Silhouette & Style
          </Typography>

          <FormGroup>
            {[
              "Choker & Collar Sets",
              "Rani Haar & Long",
              "Princess Length",
              "Layered & Tiered Chains",
              "Hasi & Rigid Torque",
            ].map((item, index) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    defaultChecked={index === 0}
                    size="small"
                    sx={{
                      p: 0.3,
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "8px" }}>
                    {item}
                  </Typography>
                }
                sx={{
                  m: 0,
                  minHeight: 23,
                }}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 1.5 }} />

          {/* Stone */}
          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
              mb: 0.7,
            }}
          >
            Stone & Karigari Work
          </Typography>

          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {[
              "Uncut Polki",
              "Moissanite CZ",
              "Kemp Ruby",
              "Green Onyx",
              "Basra Pearls",
              "Meenakari Enamel",
            ].map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                sx={{
                  height: 21,
                  fontSize: "7px",
                  backgroundColor: "#f4efea",
                  color: "#705c56",
                }}
              />
            ))}
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Price */}
          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            Price Range
          </Typography>

          <FormGroup>
            {[
              "Budget Picks Under ₹499",
              "Festive Luxury ₹500 - ₹1,499",
              "Grand Bridal ₹1,500 - ₹3,500",
            ].map((item, index) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    defaultChecked={index === 1}
                    size="small"
                    sx={{
                      p: 0.3,
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "8px" }}>
                    {item}
                  </Typography>
                }
                sx={{ m: 0 }}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 1.5 }} />

          {/* Metal */}
          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            Base Metal & Skin Safe
          </Typography>

          <FormGroup>
            {[
              "Hypoallergenic Pure Brass",
              "Brass",
              "Vintage Copper Alloy",
              "German Silver Finish",
            ].map((item, index) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    defaultChecked={index === 0}
                    size="small"
                    sx={{
                      p: 0.3,
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "8px" }}>
                    {item}
                  </Typography>
                }
                sx={{ m: 0 }}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 1.5 }} />

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            Necklace Weight Profile
          </Typography>

          {[
            "Lightweight < 40 grams",
            "Medium Partywear 40–80 grams",
            "Royal Trousseau > 80 grams",
          ].map((item) => (
            <Typography
              key={item}
              sx={{
                fontSize: "8px",
                color: "#666",
                mt: 0.7,
              }}
            >
              □ {item}
            </Typography>
          ))}

          <Box
            sx={{
              mt: 2,
              p: 1,
              backgroundColor: "#fbf7e7",
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "8px",
                color: "#6b101c",
                fontWeight: 700,
              }}
            >
              ♢ 100% Skin Safe Promise
            </Typography>

            <Typography
              sx={{
                fontSize: "6px",
                color: "#777",
                mt: 0.5,
              }}
            >
              Nickel-free, lead-free alloy
              <br />
              tested for sensitive skin.
            </Typography>
          </Box>
        </Paper>

        {/* ================= PRODUCT GRID ================= */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 1.5,
            alignContent: "start",
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
            />
          ))}
        </Box>
      </Box>

      {/* ================= STYLIST CTA ================= */}
      <Box sx={{ px: { xs: 2, md: 4 }, mt: 3 }}>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#f5f2ed",
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "8px",
                color: "#9a731f",
                letterSpacing: 1,
              }}
            >
              CAN'T DECIDE YOUR FIT?
            </Typography>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: "17px",
                color: "#6b101c",
              }}
            >
              Speak to Our Jewellery Stylist
            </Typography>

            <Typography
              sx={{
                fontSize: "7px",
                color: "#777",
              }}
            >
              Send a photo of your outfit and get personalized
              recommendations.
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#075d39",
              fontSize: "8px",
              fontWeight: 700,
              textTransform: "none",
              px: 2,
              "&:hover": {
                backgroundColor: "#064c30",
              },
            }}
          >
            ▣ STYLE ME ON WHATSAPP
          </Button>
        </Paper>
      </Box>

      {/* ================= STYLING GUIDE ================= */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          mt: 5,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "#9a731f",
            fontSize: "8px",
            letterSpacing: 1,
          }}
        >
          EDITORIAL STYLING GUIDE
        </Typography>

        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            color: "#560914",
            fontSize: {
              xs: "24px",
              md: "30px",
            },
            mt: 0.5,
          }}
        >
          How to Pair Necklaces with Necklines
        </Typography>

        <Typography
          sx={{
            fontSize: "8px",
            color: "#777",
            maxWidth: 550,
            mx: "auto",
            mt: 0.5,
          }}
        >
          Master the art of proportions. Harmonize your Zinora
          heirlooms effortlessly with Indian blouses and contemporary
          Western silhouettes.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 1.5,
            mt: 3,
            textAlign: "left",
          }}
        >
          {[
            {
              title: "Deep V-Neck Blouse",
              text: "PAIRING: LONG HARAM OR Y-DROP",
            },
            {
              title: "Boat & Sabrina Neck",
              text: "PAIRING: REGAL COLLAR & HASLI",
            },
            {
              title: "Sweetheart Bridal Cut",
              text: "PAIRING: KUNDAN CHOKER STACK",
            },
            {
              title: "Collar Shirts & Blazers",
              text: "PAIRING: DUAL DAINTY CZ CHAINS",
            },
          ].map((item) => (
            <Paper
              key={item.title}
              elevation={0}
              sx={{
                p: 1.5,
                minHeight: 135,
                backgroundColor: "#f5f2ed",
                borderRadius: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#6b101c",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                ♡
              </Typography>

              <Typography
                sx={{
                  color: "#6b101c",
                  fontSize: "10px",
                  fontWeight: 700,
                  mt: 1,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  color: "#9a731f",
                  fontSize: "8px",
                  fontWeight: 700,
                  mt: 0.5,
                }}
              >
                {item.text}
              </Typography>

              <Typography
                sx={{
                  color: "#777",
                  fontSize: "7px",
                  lineHeight: 1.5,
                  mt: 1,
                }}
              >
                The perfect proportions create an elegant silhouette
                and bring out the beauty of every jewellery piece.
              </Typography>

              <Typography
                sx={{
                  color: "#6b101c",
                  fontSize: "7px",
                  fontWeight: 700,
                  mt: 1,
                }}
              >
                Explore Style →
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* ================= PROMISE STRIP ================= */}
      <Box
        sx={{
          mt: 4,
          backgroundColor: "#680b18",
          color: "#fff",
          px: { xs: 2, md: 5 },
          py: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {[
          ["♢", "100% Skin Safe Brass", "Zero nickel, lead, hypoallergenic"],
          ["✧", "1-Year Polish Warranty", "Complimentary replating included"],
          ["♕", "Handcrafted by Karigars", "Empowering 400+ Rajasthani artisans"],
        ].map(([icon, title, subtitle]) => (
          <Box
            key={title}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
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
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  fontSize: "7px",
                  opacity: 0.8,
                }}
              >
                {subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ================= FEATURE ICONS ================= */}
      <Box
        sx={{
          px: { xs: 2, md: 5 },
          py: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          textAlign: "center",
          gap: 3,
          backgroundColor: "#fff",
        }}
      >
        {[
          "100% Skin Safe Brass & Copper",
          "1-Year Polish Warranty",
          "Handcrafted by Indian Karigars",
        ].map((item) => (
          <Box key={item}>
            <Typography sx={{ color: "#9a731f", fontSize: "20px" }}>
              ✧
            </Typography>

            <Typography
              sx={{
                color: "#6b101c",
                fontSize: "9px",
                fontWeight: 700,
              }}
            >
              {item}
            </Typography>

            <Typography
              sx={{
                fontSize: "7px",
                color: "#777",
                mt: 0.5,
              }}
            >
              Crafted with care and attention to detail for modern
              jewellery lovers.
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ================= NEWSLETTER ================= */}
      <Box
        sx={{
          backgroundColor: "#f6f3ef",
          px: { xs: 2, md: 5 },
          py: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#9a731f",
              fontSize: "8px",
              letterSpacing: 1,
            }}
          >
            EXCLUSIVE ROYAL PRIVILEGES
          </Typography>

          <Typography
            sx={{
              color: "#6b101c",
              fontFamily: "Georgia, serif",
              fontSize: "20px",
            }}
          >
            Join the Zinora Atelier
          </Typography>

          <Typography
            sx={{
              fontSize: "7px",
              color: "#777",
              maxWidth: 450,
            }}
          >
            Sign up to receive private festive collection previews and
            enjoy an exclusive 15% off your maiden order.
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#680b18",
            fontSize: "8px",
            textTransform: "uppercase",
            "&:hover": {
              backgroundColor: "#4d0710",
            },
          }}
        >
          Claim 15% Off →
        </Button>
      </Box>
    </Box>
  );
}

export default Necklaces;