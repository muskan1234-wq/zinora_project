import React, { useMemo, useState } from "react";
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


// ======================================================
// PRODUCT DATA
// ======================================================

const products = [
  {
    id: 1,
    name: "Meenakari Royal Jhumka",
    price: 599,
    oldPrice: 1299,
    rating: 4.9,
    reviews: 128,
    badge: "BESTSELLER",
    category: "Jhumkas",
    style: "Traditional Jhumkas",
    stone: "Meenakari",
    priceRange: "₹500 - ₹1,499",
    metal: "Hypoallergenic Brass",
    weight: "Lightweight < 40 grams",
    offer: "54% OFF",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 2,
    name: "Kundan Chandbali Earrings",
    price: 799,
    oldPrice: 1599,
    rating: 4.8,
    reviews: 96,
    badge: "TRENDING",
    category: "Chandbalis",
    style: "Chandbali",
    stone: "Kundan",
    priceRange: "₹500 - ₹1,499",
    metal: "German Silver",
    weight: "Medium 40–80 grams",
    offer: "50% OFF",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 3,
    name: "Royal Pearl Drop Earrings",
    price: 449,
    oldPrice: 899,
    rating: 4.7,
    reviews: 74,
    badge: "DAILY WEAR",
    category: "Drops & Studs",
    style: "Pearl Drops",
    stone: "Pearls",
    priceRange: "Under ₹499",
    metal: "Hypoallergenic Brass",
    weight: "Lightweight < 40 grams",
    offer: "50% OFF",
    image:
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 4,
    name: "Padmavati Temple Jhumka",
    price: 899,
    oldPrice: 1899,
    rating: 5.0,
    reviews: 61,
    badge: "HERITAGE",
    category: "Jhumkas",
    style: "Temple Jhumkas",
    stone: "Kemp Ruby",
    priceRange: "₹500 - ₹1,499",
    metal: "Vintage Copper Alloy",
    weight: "Medium 40–80 grams",
    offer: "53% OFF",
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 5,
    name: "Sitara Kundan Studs",
    price: 349,
    oldPrice: 699,
    rating: 4.6,
    reviews: 53,
    badge: "UNDER ₹499",
    category: "Drops & Studs",
    style: "Studs",
    stone: "Kundan",
    priceRange: "Under ₹499",
    metal: "German Silver",
    weight: "Lightweight < 40 grams",
    offer: "50% OFF",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 6,
    name: "Mehfil Pearl Chandbali",
    price: 999,
    oldPrice: 2199,
    rating: 4.9,
    reviews: 82,
    badge: "WEDDING PICK",
    category: "Chandbalis",
    style: "Chandbali",
    stone: "Pearls",
    priceRange: "₹500 - ₹1,499",
    metal: "Hypoallergenic Brass",
    weight: "Medium 40–80 grams",
    offer: "55% OFF",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 7,
    name: "Rani Polki Bridal Earrings",
    price: 1499,
    oldPrice: 2999,
    rating: 4.9,
    reviews: 47,
    badge: "BRIDAL",
    category: "Bridal Earrings",
    style: "Bridal Chandbali",
    stone: "Uncut Polki",
    priceRange: "₹1,500 - ₹3,500",
    metal: "Hypoallergenic Brass",
    weight: "Heavy > 80 grams",
    offer: "50% OFF",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
  },

  {
    id: 8,
    name: "Aanya Gold Finish Drops",
    price: 299,
    oldPrice: 599,
    rating: 4.7,
    reviews: 112,
    badge: "DAILY FAVORITE",
    category: "Drops & Studs",
    style: "Gold Drops",
    stone: "Crystal CZ",
    priceRange: "Under ₹499",
    metal: "German Silver",
    weight: "Lightweight < 40 grams",
    offer: "50% OFF",
    image:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=700&q=80",
  },
];


// ======================================================
// CATEGORY DATA
// ======================================================

const categories = [
  "All Earrings",
  "Jhumkas",
  "Chandbalis",
  "Drops & Studs",
  "Bridal Earrings",
];


// ======================================================
// PRODUCT CARD
// ======================================================

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
        transition: "0.25s",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
        },
      }}
    >
      {/* IMAGE */}
      <Box
        sx={{
          height: {
            xs: 210,
            sm: 230,
            md: 245,
          },
          position: "relative",
          backgroundColor: "#f3eee8",
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
            transition: "0.3s",

            "&:hover": {
              transform: "scale(1.04)",
            },
          }}
        />

        {/* BADGE */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
          }}
        >
          <Typography
            sx={{
              display: "inline-block",
              backgroundColor: "#6c0d19",
              color: "#fff",
              fontSize: "8px",
              fontWeight: 700,
              px: 0.8,
              py: 0.4,
            }}
          >
            {product.badge}
          </Typography>

          <br />

          <Typography
            sx={{
              display: "inline-block",
              backgroundColor: "#d71920",
              color: "#fff",
              fontSize: "8px",
              fontWeight: 700,
              px: 0.8,
              py: 0.4,
              mt: 0.4,
            }}
          >
            {product.offer}
          </Typography>
        </Box>

        {/* WISHLIST */}
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            backgroundColor: "#fff",
            width: 30,
            height: 30,

            "&:hover": {
              backgroundColor: "#fff",
            },
          }}
        >
          <FavoriteBorderIcon
            sx={{
              fontSize: 17,
              color: "#6c0d19",
            }}
          />
        </IconButton>
      </Box>

      {/* PRODUCT DETAILS */}
      <Box sx={{ p: 1.2 }}>
        {/* RATING */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.4,
          }}
        >
          <StarIcon
            sx={{
              fontSize: 12,
              color: "#d69b00",
            }}
          />

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            {product.rating}
          </Typography>

          <Typography
            sx={{
              fontSize: "8px",
              color: "#777",
            }}
          >
            ({product.reviews} reviews)
          </Typography>
        </Box>

        {/* NAME */}
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#55101a",
            mt: 0.6,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </Typography>

        {/* DESCRIPTION */}
        <Typography
          sx={{
            fontSize: "7.5px",
            color: "#888",
            mt: 0.4,
            lineHeight: 1.4,
          }}
        >
          Handcrafted jewellery with elegant finishing for modern
          Indian occasions.
        </Typography>

        {/* PRICE */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            mt: 0.8,
          }}
        >
          <Typography
            sx={{
              color: "#6c0d19",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            ₹{product.price.toLocaleString("en-IN")}
          </Typography>

          <Typography
            sx={{
              color: "#999",
              fontSize: "8px",
              textDecoration: "line-through",
            }}
          >
            ₹{product.oldPrice.toLocaleString("en-IN")}
          </Typography>
        </Box>

        {/* DELIVERY */}
        <Typography
          sx={{
            fontSize: "7px",
            color: "#777",
            mt: 0.5,
          }}
        >
          ✓ Free Express Delivery
        </Typography>
      </Box>
    </Paper>
  );
}


// ======================================================
// MAIN EARRINGS PAGE
// ======================================================

function Earrings() {
  // ----------------------------------------------------
  // FILTER STATES
  // ----------------------------------------------------

  const [selectedCategory, setSelectedCategory] =
    useState("All Earrings");

  const [selectedStyle, setSelectedStyle] = useState([]);

  const [selectedStone, setSelectedStone] = useState([]);

  const [selectedPrice, setSelectedPrice] = useState([]);

  const [selectedMetal, setSelectedMetal] = useState([]);

  const [selectedWeight, setSelectedWeight] = useState([]);

  const [sortBy, setSortBy] = useState("featured");


  // ----------------------------------------------------
  // TOGGLE FUNCTION
  // ----------------------------------------------------

  const toggleFilter = (setter, value) => {
    setter((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };


  // ----------------------------------------------------
  // RESET FILTERS
  // ----------------------------------------------------

  const resetFilters = () => {
    setSelectedCategory("All Earrings");
    setSelectedStyle([]);
    setSelectedStone([]);
    setSelectedPrice([]);
    setSelectedMetal([]);
    setSelectedWeight([]);
    setSortBy("featured");
  };


  // ----------------------------------------------------
  // FILTER PRODUCTS
  // ----------------------------------------------------

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const categoryMatch =
        selectedCategory === "All Earrings" ||
        product.category === selectedCategory;

      const styleMatch =
        selectedStyle.length === 0 ||
        selectedStyle.includes(product.style);

      const stoneMatch =
        selectedStone.length === 0 ||
        selectedStone.includes(product.stone);

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
        categoryMatch &&
        styleMatch &&
        stoneMatch &&
        priceMatch &&
        metalMatch &&
        weightMatch
      );
    });


    // SORT
    if (sortBy === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    selectedCategory,
    selectedStyle,
    selectedStone,
    selectedPrice,
    selectedMetal,
    selectedWeight,
    sortBy,
  ]);


  // ====================================================
  // PAGE UI
  // ====================================================

  return (
    <Box
      sx={{
        backgroundColor: "#faf9f7",
        minHeight: "100vh",
        color: "#4d1717",
      }}
    >

      {/* ==================================================
          HERO SECTION
      ================================================== */}

      <Box
        sx={{
          px: {
            xs: 2,
            md: 5,
          },
          pt: {
            xs: 2,
            md: 3,
          },
        }}
      >
        {/* BREADCRUMB */}

        <Typography
          sx={{
            fontSize: "9px",
            color: "#9b7a29",
            mb: 1,
          }}
        >
          Home › Jewellery › Earrings & Jhumkas
        </Typography>


        {/* HERO */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.15fr 0.85fr",
            },
            gap: {
              xs: 2,
              md: 4,
            },
            alignItems: "center",
          }}
        >

          {/* LEFT SIDE */}

          <Box>
            <Typography
              sx={{
                color: "#9a731f",
                fontSize: {
                  xs: "9px",
                  md: "11px",
                },
                letterSpacing: 1.2,
                fontWeight: 600,
              }}
            >
              ROYAL HERITAGE ORNAMENTATION — Vol. VI Collection
            </Typography>


            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                color: "#560914",
                fontSize: {
                  xs: "34px",
                  sm: "43px",
                  md: "48px",
                },
                lineHeight: 0.98,
                fontWeight: 500,
                mt: 1,
              }}
            >
              Earrings, Jhumkas
              <br />

              <Box
                component="span"
                sx={{
                  fontStyle: "italic",
                  color: "#6a3c42",
                }}
              >
                & Grand Chandbalis
              </Box>
            </Typography>


            <Typography
              sx={{
                color: "#746966",
                fontSize: {
                  xs: "10px",
                  md: "11px",
                },
                lineHeight: 1.6,
                maxWidth: 600,
                mt: 1.5,
              }}
            >
              From featherlight daily studs to opulent wedding
              chandeliers, discover handcrafted earrings inspired
              by India's royal heritage and finished for modern
              celebrations.
            </Typography>


            <Button
              variant="contained"
              endIcon={
                <ArrowForwardIcon
                  sx={{
                    fontSize: "13px !important",
                  }}
                />
              }
              sx={{
                mt: 2,
                backgroundColor: "#680b18",
                color: "#fff",
                textTransform: "none",
                fontSize: "9px",
                px: 2,
                py: 1,

                "&:hover": {
                  backgroundColor: "#4d0710",
                },
              }}
            >
              Explore Collection
            </Button>
          </Box>


          {/* RIGHT IMAGE */}

          <Paper
            elevation={0}
            sx={{
              height: {
                xs: 250,
                sm: 300,
                md: 310,
              },
              overflow: "hidden",
              borderRadius: 2,
              position: "relative",
              backgroundColor: "#e8ded5",
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=85"
              alt="Zinora earrings collection"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background:
                  "linear-gradient(transparent, rgba(0,0,0,0.75))",
                p: 2,
                pt: 5,
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                Royal Chandbalis
              </Typography>

              <Typography
                sx={{
                  color: "#eee",
                  fontSize: "7px",
                  mt: 0.3,
                }}
              >
                Kundan • Meenakari • Pearl Finish
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>


      {/* ==================================================
          CATEGORY TABS
      ================================================== */}

      <Box
        sx={{
          px: {
            xs: 2,
            md: 5,
          },
          mt: 3,
          display: "flex",
          gap: 1,
          overflowX: "auto",
          pb: 1,

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            sx={{
              flexShrink: 0,
              textTransform: "none",
              fontSize: "8px",
              px: 1.6,
              py: 0.8,
              minHeight: 30,
              borderRadius: "5px",

              backgroundColor:
                selectedCategory === category
                  ? "#650c18"
                  : "#fff",

              color:
                selectedCategory === category
                  ? "#fff"
                  : "#6a3333",

              border:
                selectedCategory === category
                  ? "none"
                  : "1px solid #eee6df",

              "&:hover": {
                backgroundColor:
                  selectedCategory === category
                    ? "#650c18"
                    : "#f5f0eb",
              },
            }}
          >
            {category}
          </Button>
        ))}
      </Box>


      {/* ==================================================
          PRODUCT COUNT + SORT
      ================================================== */}

      <Box
        sx={{
          px: {
            xs: 2,
            md: 5,
          },
          mt: 1,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 1,
            px: 1.5,
            border: "1px solid #eee8e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              fontSize: "8px",
              fontWeight: 700,
              color: "#63101b",
            }}
          >
            {filteredProducts.length} Handcrafted Pieces
            <span
              style={{
                color: "#aaa",
                margin: "0 7px",
              }}
            >
              |
            </span>
            Royal Earrings Collection
          </Typography>


          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              sx={{
                height: 28,
                fontSize: "8px",
                minWidth: {
                  xs: 145,
                  sm: 170,
                },
                backgroundColor: "#fafafa",

                "& fieldset": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="featured">
                Sort: Featured & Popularity
              </MenuItem>

              <MenuItem value="low">
                Price: Low to High
              </MenuItem>

              <MenuItem value="high">
                Price: High to Low
              </MenuItem>

              <MenuItem value="rating">
                Highest Rated
              </MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>


      {/* ==================================================
          FILTER + PRODUCTS
      ================================================== */}

      <Box
        sx={{
          px: {
            xs: 2,
            md: 5,
          },
          mt: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "205px 1fr",
          },
          gap: 2,
        }}
      >

        {/* =================================================
            FILTER SIDEBAR
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            border: "1px solid #ebe5df",
            height: "fit-content",
            backgroundColor: "#fff",
          }}
        >

          {/* FILTER HEADER */}

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
              <FilterListIcon
                sx={{
                  fontSize: 13,
                  mr: 0.5,
                  verticalAlign: "middle",
                }}
              />

              Filters
            </Typography>

            <Button
              onClick={resetFilters}
              sx={{
                minWidth: 0,
                p: 0,
                fontSize: "7px",
                color: "#9a731f",
              }}
            >
              RESET ALL
            </Button>
          </Box>


          <Divider sx={{ my: 1 }} />


          {/* STYLE */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Earring Style
          </Typography>

          <FormGroup>
            {[
              "Traditional Jhumkas",
              "Chandbali",
              "Pearl Drops",
              "Studs",
              "Bridal Chandbali",
              "Gold Drops",
              "Temple Jhumkas",
            ].map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={selectedStyle.includes(item)}
                    onChange={() =>
                      toggleFilter(
                        setSelectedStyle,
                        item
                      )
                    }
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
                  <Typography
                    sx={{
                      fontSize: "8px",
                    }}
                  >
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


          {/* STONE */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
              mb: 0.7,
            }}
          >
            Stone & Karigari
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            {[
              "Kundan",
              "Meenakari",
              "Pearls",
              "Kemp Ruby",
              "Uncut Polki",
              "Crystal CZ",
            ].map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onClick={() =>
                  toggleFilter(setSelectedStone, item)
                }
                sx={{
                  height: 21,
                  fontSize: "7px",
                  backgroundColor: selectedStone.includes(item)
                    ? "#680b18"
                    : "#f4efea",
                  color: selectedStone.includes(item)
                    ? "#fff"
                    : "#705c56",
                }}
              />
            ))}
          </Box>


          <Divider sx={{ my: 1.5 }} />


          {/* PRICE */}

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
              "Under ₹499",
              "₹500 - ₹1,499",
              "₹1,500 - ₹3,500",
            ].map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={selectedPrice.includes(item)}
                    onChange={() =>
                      toggleFilter(
                        setSelectedPrice,
                        item
                      )
                    }
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
                  <Typography
                    sx={{
                      fontSize: "8px",
                    }}
                  >
                    {item}
                  </Typography>
                }
                sx={{
                  m: 0,
                }}
              />
            ))}
          </FormGroup>


          <Divider sx={{ my: 1.5 }} />


          {/* METAL */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            Base Metal & Finish
          </Typography>

          <FormGroup>
            {[
              "Hypoallergenic Brass",
              "German Silver",
              "Vintage Copper Alloy",
            ].map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={selectedMetal.includes(item)}
                    onChange={() =>
                      toggleFilter(
                        setSelectedMetal,
                        item
                      )
                    }
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
                  <Typography
                    sx={{
                      fontSize: "8px",
                    }}
                  >
                    {item}
                  </Typography>
                }
                sx={{
                  m: 0,
                }}
              />
            ))}
          </FormGroup>


          <Divider sx={{ my: 1.5 }} />


          {/* WEIGHT */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            Earring Weight
          </Typography>

          <FormGroup>
            {[
              "Lightweight < 40 grams",
              "Medium 40–80 grams",
              "Heavy > 80 grams",
            ].map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={selectedWeight.includes(item)}
                    onChange={() =>
                      toggleFilter(
                        setSelectedWeight,
                        item
                      )
                    }
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
                  <Typography
                    sx={{
                      fontSize: "8px",
                    }}
                  >
                    {item}
                  </Typography>
                }
                sx={{
                  m: 0,
                }}
              />
            ))}
          </FormGroup>


          {/* SKIN SAFE */}

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


        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 1.5,
            alignContent: "start",
          }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: "center",
                gridColumn: "1 / -1",
                border: "1px solid #ebe5df",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  color: "#680b18",
                  fontSize: "22px",
                }}
              >
                No Earrings Found
              </Typography>

              <Typography
                sx={{
                  color: "#777",
                  fontSize: "9px",
                  mt: 1,
                }}
              >
                Try changing or resetting your filters.
              </Typography>

              <Button
                onClick={resetFilters}
                sx={{
                  mt: 2,
                  backgroundColor: "#680b18",
                  color: "#fff",
                  fontSize: "8px",
                  textTransform: "none",
                  px: 2,

                  "&:hover": {
                    backgroundColor: "#4d0710",
                  },
                }}
              >
                Reset Filters
              </Button>
            </Paper>
          )}
        </Box>
      </Box>


      {/* ==================================================
          STYLIST CTA
      ================================================== */}

      <Box
        sx={{
          px: {
            xs: 2,
            md: 5,
          },
          mt: 3,
        }}
      >
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
              CAN'T DECIDE YOUR STYLE?
            </Typography>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: "19px",
                color: "#6b101c",
              }}
            >
              Speak to Our Jewellery Stylist
            </Typography>

            <Typography
              sx={{
                fontSize: "7px",
                color: "#777",
                mt: 0.3,
              }}
            >
              Get personalized earring recommendations for your
              outfit and occasion.
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
            STYLE ME ON WHATSAPP
          </Button>
        </Paper>
      </Box>


      {/* ==================================================
          STYLING GUIDE
      ================================================== */}

      <Box
        sx={{
          px: {
            xs: 2,
            md: 5,
          },
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
          How to Style Your Earrings
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
          Discover the perfect earring silhouette for festive
          sarees, bridal outfits and everyday Indian looks.
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
              title: "Silk Sarees",
              text: "PAIRING: TEMPLE JHUMKAS",
            },
            {
              title: "Bridal Lehenga",
              text: "PAIRING: KUNDAN CHANDBALIS",
            },
            {
              title: "Festive Anarkali",
              text: "PAIRING: PEARL DROPS",
            },
            {
              title: "Daily Kurtis",
              text: "PAIRING: DELICATE STUDS",
            },
          ].map((item) => (
            <Paper
              key={item.title}
              elevation={0}
              sx={{
                p: 1.5,
                minHeight: 130,
                backgroundColor: "#f5f2ed",
                borderRadius: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#6b101c",
                  fontSize: "18px",
                }}
              >
                ♡
              </Typography>

              <Typography
                sx={{
                  color: "#6b101c",
                  fontSize: "10px",
                  fontWeight: 700,
                  mt: 0.8,
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
                Choose proportions that complement your outfit
                without overpowering the overall look.
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


      {/* ==================================================
          PROMISE STRIP
      ================================================== */}

      <Box
        sx={{
          mt: 4,
          backgroundColor: "#680b18",
          color: "#fff",
          px: {
            xs: 2,
            md: 5,
          },
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
          [
            "♢",
            "100% Skin Safe Brass",
            "Zero nickel, lead, hypoallergenic",
          ],
          [
            "✧",
            "1-Year Polish Warranty",
            "Complimentary replating included",
          ],
          [
            "♕",
            "Handcrafted by Karigars",
            "Inspired by Indian craftsmanship",
          ],
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
                width: 32,
                height: 32,
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


      {/* ==================================================
          NEWSLETTER / COLLECTION CTA
      ================================================== */}

      <Box
        sx={{
          backgroundColor: "#f6f3ef",
          px: {
            xs: 2,
            md: 5,
          },
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
              mt: 0.5,
            }}
          >
            Discover private festive collection previews and
            exclusive jewellery offers from Zinora.
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
          Explore More →
        </Button>
      </Box>

    </Box>
  );
}

export default Earrings;