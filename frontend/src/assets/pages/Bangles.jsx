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
  Chip,
  IconButton,
  Rating,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import CallIcon from "@mui/icons-material/Call";
import SmsIcon from "@mui/icons-material/Sms";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

/* =========================================================
   9 BANGLE / KADA IMAGES
   1 HERO IMAGE + 8 PRODUCT IMAGES
========================================================= */

const heroImage ="https://trendia.co/cdn/shop/files/55027834_3.jpg?v=1780295367"
  

const products = [
  {
    name: "Devanshi Rajwadi Kada",
    price: "₹899",
    oldPrice: "₹1,999",
    rating: 4.9,
    reviews: 142,
    badge: "BESTSELLER",
    offer: "55% OFF",
    category: "Rajwadi Openable Kadas",
    image:
      "https://www.kairalijewellers.com/media/product_images/966/66275e1a9809e.jpg",
  },
  {
    name: "Padmavati Kemp Ruby Kada",
    price: "₹649",
    oldPrice: "₹1,299",
    rating: 4.8,
    reviews: 88,
    badge: "HERITAGE TEMPLE",
    offer: "50% OFF",
    category: "Temple & Nakshi Choodas",
    image:"https://www.chidambaramgoldcovering.com/image/cache/catalog/ChidambaramGoldCovering/bangles/plain-bangles/br1526-latest-flower-pattern-design-ruby-emerald-stone-bangle-for-marriage-wear-buy-online-350-2-425x500.jpg"
    
  },
  {
    name: "Noor Sleek Tennis Bangle",
    price: "₹349",
    oldPrice: "₹799",
    rating: 4.7,
    reviews: 210,
    badge: "WATERPROOF",
    offer: "56% OFF",
    category: "Daily Wear Minimal Sleek",
    image:
      "https://www.tanishq.com/on/demandware.static/-/Sites-Tanishq-site-catalog/default/dw0e439f98/images/hi-res/513719VDY2A00_1.jpg",
  },
  {
    name: "Aarohi Meenakari Chooda",
    price: "₹599",
    oldPrice: "₹1,399",
    rating: 4.9,
    reviews: 64,
    badge: "HAND-PAINTED",
    offer: "57% OFF",
    category: "Temple & Nakshi Choodas",
    image:
      "https://i.pinimg.com/originals/9e/ef/e4/9eefe407337691bc69596708563fe29e.jpg",
  },
  {
    name: "Jodha Uncut Polki Broad Kada",
    price: "₹1,299",
    oldPrice: "₹2,899",
    rating: 5.0,
    reviews: 39,
    badge: "BRIDAL EDITION",
    offer: "55% OFF",
    category: "Kundan & Jadau Sets",
    image:
      "https://ishhaara.com/cdn/shop/files/ishhaara-golden-bridal-bangles-stack-28388322307490.jpg?v=1749207775&width=700",
  },
  {
    name: "Kaveri Filigree Bangle Pair",
    price: "₹299",
    oldPrice: "₹649",
    rating: 4.6,
    reviews: 95,
    badge: "LIGHTWEIGHT",
    offer: "54% OFF",
    category: "Daily Wear Minimal Sleek",
    image:
      "https://nirankarijewel.com/images/bangles/9.JPG",
  },
  {
    name: "Rhea Classic Eternity Bangle",
    price: "₹399",
    oldPrice: "₹899",
    rating: 4.8,
    reviews: 115,
    badge: "STACKABLE",
    offer: "56% OFF",
    category: "Daily Wear Minimal Sleek",
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnkBWChGHI6-7ceKJvgPjkn5Txz0LzD8u70FKQSOIbSQ&s"
  
  },
  {
    name: "Sultana Grand Bridal Kada",
    price: "₹749",
    oldPrice: "₹1,699",
    rating: 4.9,
    reviews: 78,
    badge: "BRIDAL STATEMENT",
    offer: "56% OFF",
    category: "Kundan & Jadau Sets",
    image:
      "https://i.etsystatic.com/26226244/r/il/40473e/7024091860/il_fullxfull.7024091860_4un5.jpg",
  },
];

const categories = [
  "All Bangles & Kadas",
  "Rajwadi Openable Kadas",
  "Temple & Nakshi Choodas",
  "Daily Wear Minimal Sleek",
  "Kundan & Jadau Sets",
];


function ProductCard({ product }) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #ebe5df",
        borderRadius: "3px",
        overflow: "hidden",
        backgroundColor: "#fff",
        position: "relative",
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 5px 20px rgba(60,20,20,0.12)",
        },
      }}
    >
      {/* IMAGE */}
      <Box
        sx={{
          height: {
            xs: 180,
            sm: 190,
            md: 220,
          },
          position: "relative",
          backgroundColor: "#f5f2ed",
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

        {/* BADGES */}
        <Box
          sx={{
            position: "absolute",
            top: 5,
            left: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 0.2,
          }}
        >
          <Typography
            sx={{
              backgroundColor: "#650c18",
              color: "#fff",
              fontSize: "8px",
              fontWeight: 500,
              px: 0.6,
              py: 0.3,
            }}
          >
            {product.badge}
          </Typography>

          <Typography
            sx={{
              backgroundColor: "#d50000",
              color: "#fff",
              fontSize: "6px",
              fontWeight: 500,
              px: 0.6,
              py: 0.3,
            }}
          >
            {product.offer}
          </Typography>
        </Box>

        {/* WISHLIST */}
        <IconButton
          sx={{
            position: "absolute",
            right: 4,
            top: 4,
            width: 20,
            height: 20,
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#fff",
            },
          }}
        >
          <FavoriteBorderIcon
            sx={{
              fontSize: 15,
              color: "#6b101c",
            }}
          />
        </IconButton>
      </Box>

      {/* PRODUCT DETAILS */}
      <Box sx={{ p: 1.3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.3,
          }}
        >
          <StarIcon
            sx={{
              fontSize: 12,
              color: "#d39a16",
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

        <Typography
          sx={{
            fontSize: "10px",
            fontWeight: 500,
            color: "#5b101c",
            mt: 0.7,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </Typography>

        <Typography
          sx={{
            fontSize: "8px",
            color: "#888",
            mt: 0.4,
            lineHeight: 1.4,
          }}
        >
          Handcrafted premium bangle with micro-gold finishing and
          heirloom-inspired detailing.
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.6,
            mt: 0.6,
          }}
        >
          <Typography
            sx={{
              color: "#650c18",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {product.price}
          </Typography>

          <Typography
            sx={{
              color: "#999",
              fontSize: "6px",
              textDecoration: "line-through",
            }}
          >
            {product.oldPrice}
          </Typography>

          <Typography
            sx={{
              color: "#d00000",
              fontSize: "6px",
              fontWeight: 500,
            }}
          >
            {product.offer}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: "6px",
            color: "#777",
            mt: 0.6,
          }}
        >
        </Typography>
      </Box>
    </Paper>
  );
}


function ReviewCard({ name, location, text, size }) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #ebe5df",
        p: 2,
        backgroundColor: "#fff",
        minHeight: 180,
      }}
    >
      <Typography
        sx={{
          color: "#d19a18",
          fontSize: "13px",
          letterSpacing: 1,
        }}
      >
        ★★★★★
      </Typography>

      <Typography
        sx={{
          color: "#777",
          fontSize: "8px",
          mt: 0.5,
        }}
      >
        Size Bought: {size}
      </Typography>

      <Typography
        sx={{
          color: "#5f5350",
          fontSize: "10px",
          lineHeight: 1.7,
          mt: 1.2,
          fontStyle: "italic",
        }}
      >
        "{text}"
      </Typography>

      <Divider sx={{ my: 1.5 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "40%",
            backgroundColor: "#6c0d19",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
            fontWeight: 500,
          }}
        >
          {name.substring(0, 2).toUpperCase()}
        </Box>

        <Box>
          <Typography
            sx={{
              color: "#5b101c",
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            {name}, {location}
          </Typography>

          <Typography
            sx={{
              color: "#777",
              fontSize: "7px",
              mt: 0.2,
            }}
          >
            ◉ Verified Zinora Purchase
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}



export default function Bangles() {
  const [activeCategory, setActiveCategory] =
    useState("All Bangles & Kadas");

  const [sort, setSort] = useState("featured");

  const filteredProducts =
    activeCategory === "All Bangles & Kadas"
      ? products
      : products.filter(
          (product) => product.category === activeCategory
        );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "low") {
      return (
        Number(a.price.replace(/[₹,]/g, "")) -
        Number(b.price.replace(/[₹,]/g, ""))
      );
    }

    if (sort === "high") {
      return (
        Number(b.price.replace(/[₹,]/g, "")) -
        Number(a.price.replace(/[₹,]/g, ""))
      );
    }

    if (sort === "rating") {
      return b.rating - a.rating;
    }

    return 0;
  });

  return (
    <Box
      sx={{
        backgroundColor: "#faf9f7",
        minHeight: "80vh",
        color: "#4d1717",
      }}
    >
      
      <Box
        sx={{
          px: { xs: 2, md: 5 },
          py: 1.5,
          backgroundColor: "#fff",
          borderBottom: "1px solid #eee6df",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* LOGO */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 25,
              height: 25,
              border: "1px solid #8c6a25",
              color: "#650c18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Georgia, serif",
              fontSize: "20px",
              fontWeight: 400,
            }}
          >
            Z
          </Box>

          <Box>
            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                color: "#650c18",
                fontWeight: 600,
                fontSize: "14px",
                letterSpacing: 2,
                lineHeight: 1,
              }}
            >
              ZINORA
            </Typography>

            <Typography
              sx={{
                color: "#9a731f",
                fontSize: "5px",
                letterSpacing: 3,
                mt: 0.4,
              }}
            >
              ATELIER
            </Typography>
          </Box>
        </Box>

        {/* NAV */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3,
          }}
        >
          {[
            "Collections",
            "Bangles & Kadas",
            "Bridal",
            "New Arrivals",
            "Our Craft",
          ].map((item) => (
            <Typography
              key={item}
              sx={{
                fontSize: "9px",
                color:
                  item === "Bangles & Kadas"
                    ? "#650c18"
                    : "#655854",
                fontWeight:
                  item === "Bangles & Kadas" ? 700 : 500,
                cursor: "pointer",
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        {/* CONTACT ICONS */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
          }}
        >
          <IconButton
            size="small"
            sx={{ color: "#650c18" }}
          >
            <CallIcon sx={{ fontSize: 17 }} />
          </IconButton>

          <IconButton
            size="small"
            sx={{ color: "#650c18" }}
          >
            <SmsIcon sx={{ fontSize: 17 }} />
          </IconButton>

          <IconButton
            size="small"
            sx={{ color: "#168c45" }}
          >
            <WhatsAppIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          pt: 1.5,
        }}
      >
        {/* BREADCRUMB */}

        <Typography
          sx={{
            fontSize: "8px",
            color: "#9b7a29",
            mb: 1,
          }}
        >
          Home › Jewellery › Bangles & Kadas
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.25fr 0.75fr",
            },
            gap: 2,
            alignItems: "stretch",
          }}
        >
          {/* LEFT CONTENT */}

          <Box
            sx={{
              backgroundColor: "#f6f1eb",
              p: { xs: 2, md: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "#9a731f",
                fontSize: "9px",
                letterSpacing: 1.5,
                fontWeight: 700,
              }}
            >
              HEIRLOOM ARTISTRY • ANTI-TARNISH FINISH
            </Typography>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                color: "#560914",
                fontSize: {
                  xs: "30px",
                  sm: "40px",
                  md: "47px",
                },
                lineHeight: 1.03,
                fontWeight: 300,
                mt: 1,
              }}
            >
              Imperial Kadas &
              <br />
              Openable Bangles
            </Typography>

            <Typography
              sx={{
                color: "#746966",
                fontSize: "9px",
                lineHeight: 1.7,
                maxWidth: 620,
                mt: 1.5,
              }}
            >
              Precision-hinged temple carvings, antique Rajwadi
              kadas, and everyday anti-tarnish micro-gold bangles
              engineered for effortless slip-on comfort and
              timeless royal styling.
            </Typography>

            {/* FEATURES */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, 1fr)",
                },
                gap: 1,
                mt: 2,
              }}
            >
              {[
                ["▣", "ALL SIZES", "(2.2 TO 2.10)"],
                ["♙", "SCREW-LOCK", "& HINGES"],
                ["◉", "24K MICRO-GOLD", "DIPPED"],
              ].map(([icon, title, subtitle]) => (
                <Box
                  key={title}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#9a731f",
                      fontSize: "20px",
                    }}
                  >
                    {icon}
                  </Typography>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: "7px",
                        color: "#5b101c",
                        fontWeight: 700,
                      }}
                    >
                      {title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "7px",
                        color: "#777",
                      }}
                    >
                      {subtitle}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              <Typography sx={{ fontSize: "7px" }}>
                96 Curated Designs
              </Typography>

              <Typography sx={{ fontSize: "7px" }}>
                •
              </Typography>

              <Typography sx={{ fontSize: "7px" }}>
                ◉ 3-Year Polish Guarantee
              </Typography>

              <Typography sx={{ fontSize: "7px" }}>
                •
              </Typography>

              <Typography sx={{ fontSize: "7px" }}>
                ▱ Dispatched in 24 Hrs
              </Typography>
            </Box>
          </Box>

          {/* HERO IMAGE */}

          <Box
            sx={{
              position: "relative",
              minHeight: {
                xs: 100,
                md: 200,
              },
              overflow: "hidden",
              backgroundColor: "#eee8df",
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt="Zinora Royal Bangles"
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
                bottom: 8,
                left: 8,
                right: 8,
                backgroundColor: "rgba(255,255,255,0.95)",
                p: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#9a731f",
                    fontSize: "7px",
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  SPOTLIGHT TROUSSEAU
                </Typography>

                <Typography
                  sx={{
                    color: "#5b101c",
                    fontSize: "13px",
                    fontWeight: 700,
                    mt: 0.8,
                  }}
                >
                  The Devanshi Grand Elephant Kada
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#650c18",
                  fontSize: "17px",
                  fontWeight: 700,
                }}
              >
                ₹899
              </Typography>
            </Box>
          </Box>
        </Box>

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
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              sx={{
                flexShrink: 0,
                textTransform: "none",
                fontSize: "15px",
                px: 1.5,
                py: 0.8,
                minHeight: 30,
                borderRadius: "5px",
                backgroundColor:
                  activeCategory === category
                    ? "#650c18"
                    : "#fff",
                color:
                  activeCategory === category
                    ? "#fff"
                    : "#6a3333",
                border:
                  activeCategory === category
                    ? "none"
                    : "1px solid #eee6df",
                "&:hover": {
                  backgroundColor:
                    activeCategory === category
                      ? "#650c18"
                      : "#f5f0eb",
                },
              }}
            >
              {category}
            </Button>
          ))}
        </Box>

       

        <Paper
          elevation={0}
          sx={{
            mt: 1,
            p: 1,
            px: 1.5,
            border: "1px solid #eee8e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "8px",
              fontWeight: 700,
              color: "#63101b",
            }}
          >
            {sortedProducts.length} Handcrafted Pieces
            <span
              style={{
                color: "#aaa",
                margin: "0 7px",
              }}
            >
              |
            </span>
            Jaipur & Rajkot Ateliers
          </Typography>

          <FormControl size="small">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              sx={{
                height: 28,
                fontSize: "8px",
                minWidth: 170,
                backgroundColor: "#fafafa",
                "& fieldset": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="featured">
                Sort: Featured & Bestsellers
              </MenuItem>

              <MenuItem value="low">
                Price: Low to High
              </MenuItem>

              <MenuItem value="high">
                Price: High to Low
              </MenuItem>

              <MenuItem value="rating">
                Top Rated
              </MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>

      
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          mt: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "205px 1fr",
          },
          gap: 2,
        }}
      >
        {/* SIDEBAR */}

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
                display: "flex",
                alignItems: "center",
              }}
            >
              <FilterListIcon
                sx={{
                  fontSize: 14,
                  mr: 0.5,
                }}
              />
              Filters
            </Typography>

            <Typography
              sx={{
                fontSize: "7px",
                color: "#9a731f",
                cursor: "pointer",
              }}
            >
              RESET ALL
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* SIZE */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Bangle Size
          </Typography>

          <FormGroup>
            {[
              "2.2 (XS) - 54 mm",
              "2.4 (S) - 57.2 mm",
              "2.6 - 60.3 mm",
              "2.8 (L) - 63.5 mm",
              "2.10 (XL) - 66.7 mm",
              "Free-Size / Openable",
            ].map((item, index) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    defaultChecked={index === 2 || index === 5}
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

          {/* MECHANISM */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
              mb: 0.7,
            }}
          >
            Mechanism & Lock
          </Typography>

          {[
            "Traditional Screw-Lock",
            "Side Push-Spring Hinge",
            "Magnetic Luxury Clasp",
            "Slip-On Solid Core",
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
              sx={{
                m: 0,
                display: "flex",
              }}
            />
          ))}

          <Divider sx={{ my: 1.5 }} />

          {/* WORK */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
              mb: 0.7,
            }}
          >
            Karigari & Finish
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
              "Jadau",
              "Meenakari",
              "Temple",
              "Polki",
              "CZ",
              "Ruby",
              "Pearl",
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
              "Under ₹299",
              "₹299 - ₹699",
              "₹699 - ₹1,499",
              "Royal Bridal ₹1,500+",
            ].map((item, index) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    defaultChecked={
                      index === 1 || index === 2
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
                  <Typography sx={{ fontSize: "8px" }}>
                    {item}
                  </Typography>
                }
                sx={{ m: 0 }}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 1.5 }} />

          {/* PROMISE */}

          <Box
            sx={{
              mt: 1,
              p: 1.2,
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
              ♢ Zero Wrist-Pinch Promise
            </Typography>

            <Typography
              sx={{
                fontSize: "7px",
                color: "#777",
                mt: 0.5,
                lineHeight: 1.8,
              }}
            >
              Concealed internal screws and
              <br />
              smooth finishing for comfort.
            </Typography>
          </Box>
        </Paper>

        

        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 1.5,
              alignContent: "start",
            }}
          >
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
              />
            ))}
          </Box>

          {sortedProducts.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: "center",
                border: "1px solid #eee",
              }}
            >
              <Typography
                sx={{
                  color: "#650c18",
                  fontFamily: "Georgia, serif",
                  fontSize: "20px",
                }}
              >
                No designs found
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>


      <Box
        sx={{
          px: { xs: 2, md: 4 },
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "8px",
            color: "#777",
          }}
        >
          Showing {sortedProducts.length} of 96 royal designs
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 0.5,
          }}
        >
          {["‹", "1", "2", "3", "...", "12", "›"].map(
            (item, index) => (
              <Button
                key={index}
                sx={{
                  minWidth: 28,
                  height: 28,
                  fontSize: "8px",
                  color:
                    item === "1"
                      ? "#fff"
                      : "#650c18",
                  backgroundColor:
                    item === "1"
                      ? "#650c18"
                      : "#fff",
                  border: "1px solid #eee",
                }}
              >
                {item}
              </Button>
            )
          )}
        </Box>
      </Box>

    

      <Box
        sx={{
          px: { xs: 2, md: 4 },
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
              CAN'T DECIDE YOUR FIT?
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
              }}
            >
              Send a photo of your outfit and get personalized
              bangle recommendations.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={
              <WhatsAppIcon sx={{ fontSize: 14 }} />
            }
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
            letterSpacing: 1.5,
            fontWeight: 700,
          }}
        >
          REAL BRIDES, REAL ROYAL WRISTWEAR
        </Typography>

        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            color: "#560914",
            fontSize: {
              xs: "25px",
              md: "32px",
            },
            mt: 0.5,
          }}
        >
          Verified Zinora Atelier Reviews
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            mt: 1,
          }}
        >
          <Typography
            sx={{
              color: "#d19a18",
              fontSize: "14px",
            }}
          >
            ★★★★★
          </Typography>

          <Typography
            sx={{
              fontSize: "9px",
              color: "#555",
            }}
          >
            <b>4.89 / 5.0</b> Average
          </Typography>

          <Typography
            sx={{
              fontSize: "8px",
              color: "#777",
            }}
          >
            (1,480+ Bangle Reviews)
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 1.5,
            mt: 2,
            textAlign: "left",
          }}
        >
          <ReviewCard
            name="Pooja S."
            location="Udaipur"
            size="2.6"
            text="The Devanshi Rajwadi kada looks identical to my ancestral real gold heirloom. The screw lock is easy to open myself, and it stayed gleaming after hours of dancing!"
          />

          <ReviewCard
            name="Ananya M."
            location="Bengaluru"
            size="2.4"
            text="Usually imitation kadas give me green sweat marks. Zinora's micro-gold plating felt comfortable even during a summer event. Incredible craftsmanship."
          />

          <ReviewCard
            name="Nandini K."
            location="New Delhi"
            size="2.8"
            text="I have broad wrists and finding a 2.8 size is always difficult. The Jodha uncut polki kada fit perfectly. The velvet packaging was magnificent!"
          />
        </Box>
      </Box>

     

      <Box
        sx={{
          mt: 5,
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
          [
            "♢",
            "100% Skin Safe Brass",
            "Zero nickel, lead & hypoallergenic",
          ],
          [
            "✧",
            "1-Year Polish Warranty",
            "Complimentary replating included",
          ],
          [
            "♕",
            "Handcrafted by Karigars",
            "Empowering 400+ Rajasthani artisans",
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
                width: 35,
                height: 35,
                backgroundColor: "#8b2634",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
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
                  mt: 0.3,
                }}
              >
                {subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>


      

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
              fontSize: "21px",
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
            Sign up to receive private festive collection
            previews and enjoy an exclusive 15% off your
            maiden order.
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#074d19",
            fontSize: "12px",
            textTransform: "uppercase",
            "&:hover": {
              backgroundColor: "#074d19",
            },
          }}
        >
          CLAIM 15% OFF →
        </Button>
      </Box>

      
      <Box
        component="footer"
        sx={{
          backgroundColor: "#2e1014",
          color: "#fff",
          px: { xs: 2, md: 5 },
          pt: 4,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "1.5fr 1fr 1fr 1fr",
            },
            gap: 3,
            pb: 3,
          }}
        >
          {/* BRAND */}

          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  border: "1px solid #c8a451",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Georgia, serif",
                  fontSize: "23px",
                }}
              >
                Z
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: "Georgia, serif",
                    fontSize: "17px",
                    fontWeight: 700,
                    letterSpacing: 2,
                  }}
                >
                  ZINORA
                </Typography>

                <Typography
                  sx={{
                    color: "#c8a451",
                    fontSize: "7px",
                    letterSpacing: 3,
                  }}
                >
                  ATELIER
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                color: "#d4c2c4",
                fontSize: "8px",
                lineHeight: 1.7,
                mt: 1.5,
                maxWidth: 320,
              }}
            >
              Contemporary Indian heritage meets uncompromising
              craftsmanship. Zinora crafts bespoke heirloom-grade
              imitation jewellery with micro-gold plating and
              hand-set accent stones.
            </Typography>

            {/* CALL SMS WHATSAPP */}

            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 2,
              }}
            >
              <IconButton
                sx={{
                  color: "#fff",
                  backgroundColor: "#6b2630",
                  width: 20,
                  height: 20,
                }}
              >
                <CallIcon sx={{ fontSize: 10 }} />
              </IconButton>

              <IconButton
                sx={{
                  color: "#fff",
                  backgroundColor: "#6b2630",
                  width: 20,
                  height: 20,
                }}
              >
                <SmsIcon sx={{ fontSize: 10 }} />
              </IconButton>

              <IconButton
                sx={{
                  color: "#fff",
                  backgroundColor: "#08783d",
                  width: 20,
                  height: 20,
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 10 }} />
              </IconButton>
            </Box>
          </Box>

          {/* SHOP COLLECTIONS */}

          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontSize: "9px",
                fontWeight: 700,
                mb: 1.5,
              }}
            >
              Shop Collections
            </Typography>

            {[
              "Kundan & Polki Chokers",
              "Temple & Chandbali Jhumkas",
              "Antique Gold Bangles & Kadas",
              "Royal Bridal Trousseau",
              "Modern CZ Everyday Luxe",
            ].map((item) => (
              <Typography
                key={item}
                sx={{
                  color: "#d4c2c4",
                  fontSize: "8px",
                  mb: 0.9,
                  cursor: "pointer",
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          {/* CUSTOMER CARE */}

          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontSize: "10px",
                fontWeight: 700,
                mb: 1,
              }}
            >
              Customer Care
            </Typography>

            {[
              "Track Consignment",
              "1-Year Polish Claim",
              "Bangle & Ring Sizing Guide",
              "Jewellery Care Regimen",
              "WhatsApp Direct Support",
            ].map((item) => (
              <Typography
                key={item}
                sx={{
                  color: "#d4c2c4",
                  fontSize: "8px",
                  mb: 0.9,
                  cursor: "pointer",
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          {/* POLICIES */}

          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontSize: "10px",
                fontWeight: 700,
                mb: 0.9,
              }}
            >
              Policies & Trust
            </Typography>

            {[
              "Shipping & COD Terms",
              "48-Hour Return & Exchange",
              "Privacy & Secure Gateway",
              "Terms of Service",
              "Karigar Sustenance Initiative",
            ].map((item) => (
              <Typography
                key={item}
                sx={{
                  color: "#d4c2c4",
                  fontSize: "8px",
                  mb: 0.9,
                  cursor: "pointer",
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>

        <Divider
          sx={{
            borderColor: "#51262d",
          }}
        />

        <Box
          sx={{
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              color: "#bdaeb0",
              fontSize: "7px",
            }}
          >
            © 2025 ZINORA Luxury Imitation Jewels. All Rights
            Reserved.
          </Typography>

          <Typography
            sx={{
              color: "#bdaeb0",
              fontSize: "10px",
            }}
          >
            UPI　 RuPay　 Visa　 Mastercard　 Cash on
            Delivery　 Razorpay Verified
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}