import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardMedia,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StarIcon from "@mui/icons-material/Star";

const categories = [
  {
    title: "Earrings & Jhumkas",
    subtitle: "Chandbalis, Meenakari",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Necklaces & Chokers",
    subtitle: "Bridal Sets & Chains",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Bangles & Kadas",
    subtitle: "Rajwadi & Temple Sets",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Rings & Hathphool",
    subtitle: "Solitaire & Statement",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Mangalsutras",
    subtitle: "Daily & Temple Designs",
    image:
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Bridal Trousseau",
    subtitle: "Complete 7-Piece Sets",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80",
  },
];

const budgetProducts = [
  {
    title: "Dainty Studs & Rings",
    subtitle: "EVERYDAY SPARKLE",
    price: "Under ₹99",
    text: "Featherlight everyday essentials that don't tarnish with washes.",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Pendants & Hoops",
    subtitle: "COLLEGE & OFFICE CHIC",
    price: "Under ₹199",
    text: "Subtle Korean elegance and anti-allergic chains tailored for 9-to-5 grace.",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Statement Jhumkas",
    subtitle: "FESTIVE GLAM",
    price: "Under ₹299",
    text: "Heavy-look ethnic drops designed with hollow brass cores.",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Bridal Look-Alikes",
    subtitle: "ROYAL HERITAGE",
    price: "Under ₹599",
    text: "Indistinguishable from real heirloom gold with high-density micro plating.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80",
  },
];

const trendingProducts = [
  {
    title: "Meera Royal Kundan & Pearl...",
    category: "Chokers",
    rating: "4.9",
    reviews: "184",
    price: "₹1,299",
    oldPrice: "₹2,999",
    offer: "56% OFF",
    badge: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Padmavati Antique Temple...",
    category: "Jhumkas",
    rating: "4.8",
    reviews: "92",
    price: "₹399",
    oldPrice: "₹899",
    offer: "55% OFF",
    badge: "TRENDING",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Zohra 18K Emerald Solitaire...",
    category: "Rings",
    rating: "5.0",
    reviews: "64",
    price: "₹249",
    oldPrice: "₹599",
    offer: "58% OFF",
    badge: "HOT",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Kaveri Openable Rajwadi Kad...",
    category: "Kadas",
    rating: "4.7",
    reviews: "110",
    price: "₹799",
    oldPrice: "₹1,699",
    offer: "53% OFF",
    badge: "LIMITED",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",
  },
];

const styleCards = [
  {
    title: "Daily Wear",
    subtitle: "EFFORTLESS COMFORT",
    text: "Featherlight, sweatproof and nickel-free designs made for 24/7 wear.",
    button: "View 48 Styles",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Sangeet & Cocktail",
    subtitle: "EVENING RADIANCE",
    text: "Dazzling American Diamond and champagne-gold masterpieces.",
    button: "View 64 Styles",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Wedding & Bridal",
    subtitle: "THE BIG DAY",
    text: "Jadau, heavy Polki and grand heirloom necklaces worthy of royalty.",
    button: "View 92 Styles",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Festive Puja",
    subtitle: "TRADITIONAL DEVOTION",
    text: "Micro-gold antique temple jewellery enriched with South Indian artistry.",
    button: "View 55 Styles",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=80",
  },
];

const reviewCards = [
  {
    name: "Priya S.",
    text: "Absolutely beautiful jewellery. The finish looks premium and elegant.",
    product: "Royal Kundan Set",
    rating: 5,
  },
  {
    name: "Sneha M.",
    text: "Loved the quality and packaging. It looked exactly like the pictures.",
    product: "Bridal Choker",
    rating: 5,
  },
  {
    name: "Ananya R.",
    text: "Perfect for festive wear. Lightweight and very comfortable.",
    product: "Temple Jhumkas",
    rating: 5,
  },
];

const lowerGallery = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
];

function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTrending, setActiveTrending] = useState("All Trending");

  const categoryButtons = [
    "All",
    "Necklaces",
    "Bangles",
    "Earrings",
    "Bridal",
    "Daily Wear",
  ];

  const trendingButtons = [
    "All Trending",
    "Chokers",
    "Jhumkas",
    "Kadas",
  ];

  const filteredTrending = useMemo(() => {
    if (activeTrending === "All Trending") {
      return trendingProducts;
    }

    return trendingProducts.filter(
      (product) => product.category === activeTrending
    );
  }, [activeTrending]);

  const handleExplore = (title) => {
    alert(`Opening ${title} collection`);
  };

  const handleCategory = (category) => {
    setActiveCategory(category);

    if (category === "All") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fffdfb",
        color: "#4d1717",
        minHeight: "100vh",
      }}
    >
      {/* ================= HERO ================= */}

      <Box
        sx={{
          background:
            "linear-gradient(135deg, #5b0712 0%, #780b18 55%, #4e0610 100%)",
          color: "#fff",
          px: { xs: 2, md: 5 },
          py: { xs: 4, md: 7 },
          minHeight: { xs: 500, md: 520 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
          alignItems: "center",
          gap: 4,
        }}
      >
        <Box>
          <Chip
            label="✦ HERITAGE KARIGARI • FESTIVE 2025 RELEASE"
            size="small"
            sx={{
              backgroundColor: "#9a731f",
              color: "#fff",
              fontSize: "9px",
              fontWeight: 700,
              mb: 2,
            }}
          />

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: {
                xs: "35px",
                md: "52px",
              },
              lineHeight: 0.95,
              fontWeight: 500,
            }}
          >
            Jewellery That Makes
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              color: "#f4c95d",
              fontSize: {
                xs: "38px",
                md: "55px",
              },
              lineHeight: 1,
            }}
          >
            Every Moment Shine
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: 600,
              fontSize: "11px",
              lineHeight: 1.6,
              color: "#f5dfe2",
            }}
          >
            Handcrafted Kundan, Temple & American Diamond imitation jewellery
            designed for grand weddings, intimate festivities, and effortless
            everyday regal charm.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mt: 3,
            }}
          >
            <Button
              onClick={() => handleExplore("Festive Collection")}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: "#f5ca50",
                color: "#5d0a13",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                "&:hover": {
                  backgroundColor: "#e7b93c",
                },
              }}
            >
              SHOP FESTIVE COLLECTION
            </Button>

            <Button
              onClick={() => handleExplore("Under ₹299")}
              variant="contained"
              sx={{
                backgroundColor: "#7c2933",
                color: "#fff",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                "&:hover": {
                  backgroundColor: "#91323d",
                },
              }}
            >
              EXPLORE UNDER ₹299
            </Button>
          </Box>

          <Divider
            sx={{
              borderColor: "#a54a54",
              my: 2,
            }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
            }}
          >
            {[
              ["24 Karat", "Micro-Gold Dip"],
              ["Nickel-Free", "Anti-Allergic Brass"],
              ["48 Hours", "Hassle-Free Exchange"],
            ].map(([title, subtitle]) => (
              <Box key={title}>
                <Typography
                  sx={{
                    fontFamily: "Georgia, serif",
                    color: "#f4c95d",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                >
                  {title}
                </Typography>

                <Typography sx={{ fontSize: "7px", color: "#ead9dc" }}>
                  {subtitle}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80"
            alt="Bridal Jewellery"
            sx={{
              width: "100%",
              maxWidth: 480,
              height: 380,
              objectFit: "cover",
              borderRadius: 1,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              backgroundColor: "#fff",
              color: "#5b0712",
              p: 1.2,
              borderRadius: 1,
            }}
          >
            <Typography sx={{ fontSize: "9px", fontWeight: 700 }}>
              ✺ Heirloom Grade
            </Typography>
            <Typography sx={{ fontSize: "6px" }}>
              Real Uncut Look-Alike Polki
            </Typography>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              right: 10,
              backgroundColor: "#fff",
              color: "#5b0712",
              p: 1.2,
              borderRadius: 1,
              minWidth: 180,
            }}
          >
            <Typography sx={{ fontSize: "8px", fontWeight: 700 }}>
              BRIDAL SPOTLIGHT
            </Typography>

            <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>
              The Jodha Polki Choker
            </Typography>

            <Typography sx={{ fontSize: "9px" }}>
              ₹1,849
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ================= TRUST STRIP ================= */}

      <Box
        sx={{
          backgroundColor: "#560914",
          color: "#fff",
          px: { xs: 2, md: 5 },
          py: 1.5,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(4, 1fr)",
          },
          gap: 2,
          textAlign: "center",
        }}
      >
        {[
          "▣ 10,000+ Verified Reviews",
          "♢ 1-Year Anti-Tarnish Warranty",
          "▣ Free Shipping Across India",
          "▣ COD Available On All Pincodes",
        ].map((item) => (
          <Typography
            key={item}
            sx={{
              fontSize: "8px",
              fontWeight: 700,
            }}
          >
            {item}
          </Typography>
        ))}
      </Box>

      {/* ================= CATEGORY FILTER ================= */}

      <Box
        sx={{
          px: { xs: 2, md: 5 },
          py: 5,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          sx={{
            color: "#9a731f",
            fontSize: "9px",
            letterSpacing: 1,
          }}
        >
          ROYAL HANDPICKED TREASURY
        </Typography>

        <Box
          sx={{
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
                fontFamily: "Georgia, serif",
                color: "#560914",
                fontSize: "28px",
              }}
            >
              Discover Royal Categories
            </Typography>

            <Typography sx={{ fontSize: "8px", color: "#777" }}>
              From royal Rajasthani jewellery to modern minimalist silhouettes.
            </Typography>
          </Box>

          <Button
            onClick={() => handleExplore("All Categories")}
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: "#680b18",
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            VIEW ALL 18 CATEGORIES
          </Button>
        </Box>

        {/* ACTIVE FILTER BUTTONS */}

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            mt: 3,
            mb: 3,
          }}
        >
          {categoryButtons.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategory(category)}
              sx={{
                minWidth: 80,
                borderRadius: 1,
                border: "1px solid #e5d9d2",
                backgroundColor:
                  activeCategory === category ? "#680b18" : "#fff",
                color:
                  activeCategory === category ? "#fff" : "#6b3333",
                fontSize: "9px",
                textTransform: "none",
                fontWeight: activeCategory === category ? 700 : 500,
                "&:hover": {
                  backgroundColor:
                    activeCategory === category
                      ? "#680b18"
                      : "#f7efeb",
                },
              }}
            >
              {category}
            </Button>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(6, 1fr)",
            },
            gap: 1.5,
          }}
        >
          {categories.map((category) => (
            <Card
              key={category.title}
              onClick={() => handleExplore(category.title)}
              sx={{
                cursor: "pointer",
                borderRadius: 1,
                boxShadow: "none",
                border: "1px solid #eee5df",
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(80,20,20,0.12)",
                },
              }}
            >
              <CardMedia
                component="img"
                image={category.image}
                alt={category.title}
                sx={{
                  height: 150,
                  objectFit: "cover",
                }}
              />

              <Box sx={{ p: 1, textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#680b18",
                  }}
                >
                  {category.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "7px",
                    color: "#888",
                    mt: 0.3,
                  }}
                >
                  {category.subtitle}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>

      {/* ================= BUDGET SECTION ================= */}

      <Box
        sx={{
          backgroundColor: "#f7f5f2",
          px: { xs: 2, md: 5 },
          py: 7,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            sx={{
              color: "#9a731f",
              fontSize: "9px",
              letterSpacing: 1,
            }}
          >
            BESPOKE BUDGET TREASURY
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              color: "#560914",
              fontSize: "28px",
            }}
          >
            Luxury Within Your Reach
          </Typography>

          <Typography sx={{ fontSize: "8px", color: "#777" }}>
            Finest micro-plated jewels categorized by accessible price tiers.
            Indulgence without compromise.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {budgetProducts.map((product) => (
            <Card
              key={product.title}
              sx={{
                borderRadius: 1,
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              }}
            >
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.title}
                  sx={{
                    height: 170,
                    objectFit: "cover",
                  }}
                />

                <Chip
                  label={product.price}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    backgroundColor: "#680b18",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "8px",
                  }}
                />
              </Box>

              <Box sx={{ p: 1.5 }}>
                <Typography
                  sx={{
                    color: "#9a731f",
                    fontSize: "8px",
                    fontWeight: 700,
                  }}
                >
                  {product.subtitle}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "Georgia, serif",
                    color: "#680b18",
                    fontSize: "15px",
                    mt: 0.5,
                  }}
                >
                  {product.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "7px",
                    color: "#777",
                    lineHeight: 1.5,
                    mt: 0.5,
                  }}
                >
                  {product.text}
                </Typography>

                <Button
                  onClick={() => handleExplore(product.title)}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: 1,
                    p: 0,
                    fontSize: "8px",
                    color: "#680b18",
                    textTransform: "none",
                  }}
                >
                  Explore Collection
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>

      {/* ================= TRENDING ================= */}

      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 6,
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
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
              CURRENT HIGH-DEMAND PIECES
            </Typography>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                color: "#560914",
                fontSize: "27px",
              }}
            >
              Trending Artisanal Masterpieces
            </Typography>
          </Box>

          {/* TRENDING ACTIVE FILTER */}

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            {trendingButtons.map((button) => (
              <Button
                key={button}
                onClick={() => setActiveTrending(button)}
                sx={{
                  minWidth: 65,
                  fontSize: "8px",
                  textTransform: "none",
                  color:
                    activeTrending === button ? "#fff" : "#765b5b",
                  backgroundColor:
                    activeTrending === button ? "#680b18" : "#fff",
                  "&:hover": {
                    backgroundColor:
                      activeTrending === button
                        ? "#680b18"
                        : "#f5eeee",
                  },
                }}
              >
                {button}
              </Button>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 1.5,
            mt: 2,
          }}
        >
          {filteredTrending.map((product) => (
            <Card
              key={product.title}
              sx={{
                border: "1px solid #eee5df",
                boxShadow: "none",
                borderRadius: 1,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.title}
                  sx={{
                    height: 190,
                    objectFit: "cover",
                  }}
                />

                <Chip
                  label={product.badge}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    backgroundColor: "#680b18",
                    color: "#fff",
                    fontSize: "7px",
                    fontWeight: 700,
                  }}
                />

                <IconButton
                  onClick={() => alert("Added to Wishlist")}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    backgroundColor: "#fff",
                    width: 27,
                    height: 27,
                  }}
                >
                  <FavoriteBorderIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Box>

              <Box sx={{ p: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <StarIcon
                    sx={{
                      fontSize: 11,
                      color: "#b68a19",
                    }}
                  />

                  <Typography sx={{ fontSize: "7px" }}>
                    {product.rating} ({product.reviews} reviews)
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#680b18",
                    mt: 0.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "7px",
                    color: "#888",
                    mt: 0.3,
                  }}
                >
                  Lightweight design with premium finishing.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <Box>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#680b18",
                      }}
                    >
                      {product.price}
                    </Typography>

                    <Typography
                      component="span"
                      sx={{
                        fontSize: "6px",
                        color: "#999",
                        textDecoration: "line-through",
                        ml: 0.5,
                      }}
                    >
                      {product.oldPrice}
                    </Typography>
                  </Box>

                  <Chip
                    label={product.offer}
                    size="small"
                    sx={{
                      height: 19,
                      backgroundColor: "#ffe2e2",
                      color: "#9a1d2a",
                      fontSize: "7px",
                      fontWeight: 700,
                    }}
                  />
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>

      {/* ================= STYLING GUIDE ================= */}

      <Box
        sx={{
          backgroundColor: "#f6f4f1",
          px: { xs: 2, md: 4 },
          py: 6,
        }}
      >
        <Typography
          sx={{
            color: "#9a731f",
            fontSize: "8px",
            letterSpacing: 1,
          }}
        >
          STYLING GUIDE
        </Typography>

        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            color: "#560914",
            fontSize: "27px",
          }}
        >
          Jewellery Styled For Your Moments
        </Typography>

        <Typography
          sx={{
            fontSize: "8px",
            color: "#777",
            mb: 3,
          }}
        >
          Curated styling edits tailored to India's grand celebrations and
          everyday work rhythms.
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
          }}
        >
          {styleCards.map((card) => (
            <Card
              key={card.title}
              sx={{
                position: "relative",
                height: 300,
                overflow: "hidden",
                borderRadius: 1,
              }}
            >
              <CardMedia
                component="img"
                image={card.image}
                alt={card.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(transparent 30%, rgba(50,0,0,0.9) 100%)",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 1.5,
                  color: "#fff",
                }}
              >
                <Typography
                  sx={{
                    color: "#f5ca50",
                    fontSize: "8px",
                    fontWeight: 700,
                  }}
                >
                  {card.subtitle}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "Georgia, serif",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  {card.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "7px",
                    lineHeight: 1.4,
                    mt: 0.5,
                  }}
                >
                  {card.text}
                </Typography>

                <Button
                  onClick={() => handleExplore(card.title)}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    color: "#f5ca50",
                    fontSize: "8px",
                    p: 0,
                    mt: 0.5,
                    textTransform: "none",
                  }}
                >
                  {card.button}
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>

      {/* ================= FESTIVE OFFER ================= */}

      <Box
        sx={{
          px: { xs: 2, md: 5 },
          py: 6,
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.4fr 1fr",
            },
            gap: 2,
          }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(135deg, #4f0009, #680b18)",
              color: "#fff",
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Chip
              label="◷ LIMITED FESTIVE FLASH OFFER"
              sx={{
                alignSelf: "flex-start",
                backgroundColor: "#f5ca50",
                color: "#5d0a13",
                fontSize: "8px",
                fontWeight: 700,
              }}
            />

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: "27px",
                mt: 2,
              }}
            >
              Buy 2, Get 1 FREE
            </Typography>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                color: "#f5ca50",
                fontSize: "25px",
              }}
            >
              On All Statement Jhumkas
            </Typography>

            <Typography
              sx={{
                fontSize: "8px",
                maxWidth: 500,
                mt: 1,
              }}
            >
              Mix and match any Chandbalis, Meenakari drops, or Temple domes.
              Add any 3 to bag, discount auto-applied at checkout.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                maxWidth: 300,
                backgroundColor: "#761b27",
                mt: 3,
                p: 1.5,
                borderRadius: 1,
              }}
            >
              {[
                ["08", "HOURS"],
                ["35", "MINUTES"],
                ["19", "SECONDS"],
              ].map(([number, label]) => (
                <Box key={label} sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: "20px", fontWeight: 700 }}>
                    {number}
                  </Typography>

                  <Typography sx={{ fontSize: "7px" }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Button
              onClick={() => handleExplore("Jhumka Offer")}
              variant="contained"
              sx={{
                alignSelf: "flex-start",
                mt: 3,
                backgroundColor: "#f5ca50",
                color: "#5d0a13",
                fontSize: "9px",
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: "#e5b83d",
                },
              }}
            >
              CLAIM JHUMKA OFFER 🛍
            </Button>
          </Box>

          <Box
            sx={{
              backgroundColor: "#f7f5f2",
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Typography
              sx={{
                color: "#9a731f",
                fontSize: "8px",
                letterSpacing: 1,
              }}
            >
              COMPLETE BRIDAL CURATION
            </Typography>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                color: "#680b18",
                fontSize: "22px",
              }}
            >
              Trousseau Bundle Box:
              <br />
              5 Pieces for ₹1,999
            </Typography>

            <Typography sx={{ fontSize: "7px", color: "#777" }}>
              Includes Choker Set, Pair of Rajwadi Kadas, 1 Statement
              Mangalsutra, Matha Patti, Ring, and Hathphool.
            </Typography>

            <Box
              component="img"
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
              alt="Bridal Bundle"
              sx={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                borderRadius: 1,
                mt: 1,
              }}
            />

            <Button
              fullWidth
              onClick={() => handleExplore("Trousseau Bundle")}
              sx={{
                mt: 1,
                backgroundColor: "#680b18",
                color: "#fff",
                fontSize: "9px",
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: "#4d0710",
                },
              }}
            >
              UNLOCK TROUSSEAU TRUNK →
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ================= REVIEWS ================= */}

      <Box
        sx={{
          backgroundColor: "#faf8f5",
          px: { xs: 2, md: 4 },
          py: 6,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              color: "#680b18",
              fontSize: "24px",
            }}
          >
            Loved by Indian Brides & Modern
            <br />
            Style Muses
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {reviewCards.map((review) => (
            <Card
              key={review.name}
              sx={{
                p: 2,
                border: "1px solid #eee5df",
                boxShadow: "none",
              }}
            >
              <Box sx={{ display: "flex", mb: 1 }}>
                {[...Array(review.rating)].map((_, index) => (
                  <StarIcon
                    key={index}
                    sx={{
                      fontSize: 11,
                      color: "#b68a19",
                    }}
                  />
                ))}
              </Box>

              <Typography
                sx={{
                  fontSize: "9px",
                  color: "#555",
                  lineHeight: 1.6,
                }}
              >
                "{review.text}"
              </Typography>

              <Typography
                sx={{
                  color: "#680b18",
                  fontSize: "8px",
                  fontWeight: 700,
                  mt: 1,
                }}
              >
                {review.name}
              </Typography>

              <Typography sx={{ fontSize: "7px", color: "#999" }}>
                Purchased: {review.product}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>

      {/* ================= CUSTOMER GALLERY ================= */}

      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 5,
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
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
              ZINORA ON YOU
            </Typography>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                color: "#680b18",
                fontSize: "23px",
              }}
            >
              Real Women. Real Jewellery.
            </Typography>
          </Box>

          <Button
            onClick={() => handleExplore("Instagram")}
            sx={{
              color: "#680b18",
              fontSize: "8px",
              fontWeight: 700,
            }}
          >
            FOLLOW @ZINORAJEWELS →
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(4, 1fr)",
            },
            gap: 1,
          }}
        >
          {lowerGallery.map((image, index) => (
            <Box
              key={image}
              component="img"
              src={image}
              alt={`Zinora customer ${index + 1}`}
              onClick={() => handleExplore("Customer Story")}
              sx={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* ================= FINAL FEATURES ================= */}

      <Box
        sx={{
          backgroundColor: "#680b18",
          color: "#fff",
          px: { xs: 2, md: 5 },
          py: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
          textAlign: "center",
        }}
      >
        {[
          ["♢", "100% Skin Safe Brass", "Zero nickel, lead, hypoallergenic"],
          ["✧", "1-Year Polish Warranty", "Complimentary replating included"],
          [
            "♕",
            "Handcrafted by Indian Karigars",
            "Supporting traditional artisans",
          ],
        ].map(([icon, title, subtitle]) => (
          <Box key={title}>
            <Typography
              sx={{
                color: "#f5ca50",
                fontSize: "22px",
              }}
            >
              {icon}
            </Typography>

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
        ))}
      </Box>

      {/* ================= NEWSLETTER ================= */}

      <Box
        sx={{
          backgroundColor: "#f6f3ef",
          px: { xs: 2, md: 5 },
          py: 4,
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
              color: "#680b18",
              fontFamily: "Georgia, serif",
              fontSize: "24px",
            }}
          >
            Join the Zinora Atelier
          </Typography>

          <Typography
            sx={{
              fontSize: "8px",
              color: "#777",
              maxWidth: 500,
            }}
          >
            Sign up to receive private festive collection previews and enjoy
            an exclusive 15% off your maiden order.
          </Typography>
        </Box>

        <Button
          onClick={() => handleExplore("15% Off")}
          variant="contained"
          startIcon={<ShoppingBagOutlinedIcon />}
          sx={{
            backgroundColor: "#680b18",
            fontSize: "9px",
            textTransform: "uppercase",
            "&:hover": {
              backgroundColor: "#4d0710",
            },
          }}
        >
          Claim 15% Off →
        </Button>
      </Box>

      {/* ================= FOOTER ================= */}

      <Box
        sx={{
          backgroundColor: "#35040a",
          color: "#fff",
          px: { xs: 2, md: 5 },
          py: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: "22px",
              color: "#f5ca50",
            }}
          >
            ZINORA
          </Typography>

          <Typography
            sx={{
              fontSize: "8px",
              color: "#d6bfc2",
              mt: 1,
              lineHeight: 1.6,
            }}
          >
            Royal-inspired jewellery crafted for modern Indian women.
          </Typography>
        </Box>

        <Box>
          <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>
            SHOP
          </Typography>

          {["Necklaces", "Earrings", "Bangles", "Bridal"].map((item) => (
            <Button
              key={item}
              onClick={() => handleExplore(item)}
              sx={{
                display: "block",
                p: 0,
                mt: 0.5,
                color: "#d6bfc2",
                fontSize: "8px",
                textTransform: "none",
              }}
            >
              {item}
            </Button>
          ))}
        </Box>

        <Box>
          <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>
            HELP
          </Typography>

          {[
            "Contact Us",
            "Shipping",
            "Returns",
            "Track Order",
          ].map((item) => (
            <Button
              key={item}
              onClick={() => handleExplore(item)}
              sx={{
                display: "block",
                p: 0,
                mt: 0.5,
                color: "#d6bfc2",
                fontSize: "8px",
                textTransform: "none",
              }}
            >
              {item}
            </Button>
          ))}
        </Box>

        <Box>
          <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>
            CONNECT
          </Typography>

          <Typography
            sx={{
              fontSize: "8px",
              color: "#d6bfc2",
              mt: 1,
              lineHeight: 1.8,
            }}
          >
            Instagram
            <br />
            Facebook
            <br />
            WhatsApp
            <br />
            support@zinora.com
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;