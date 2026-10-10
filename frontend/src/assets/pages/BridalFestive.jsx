import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Checkbox,
  FormControlLabel,
  Divider,
  Rating,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Chip,
} from "@mui/material";

import {
  FavoriteBorder,
  Favorite,
  ShoppingBagOutlined,
  ChevronRight,
  KeyboardArrowDown,
  Star,
  LocalShippingOutlined,
  VerifiedOutlined,
  SecurityOutlined,
  HandshakeOutlined,
  CalendarMonthOutlined,
} from "@mui/icons-material";

/* =========================
   PRODUCT DATA
========================= */

const products = [
  {
    name: "The Jodha Maharani 7-Piece Bridal Trousseau",
    price: "₹3,499",
    oldPrice: "₹5,999",
    discount: "42% OFF",
    rating: 4.9,
    reviews: 24,
    badge: "TOP GIFTING CHOICE",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Padmavati Kemp Ruby Temple Bridal Set",
    price: "₹1,849",
    oldPrice: "₹3,499",
    discount: "47% OFF",
    rating: 4.8,
    reviews: 31,
    badge: "TEMPLE EDIT",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Aaradhya Green Onyx & Uncut Polki Choker Set",
    price: "₹1,499",
    oldPrice: "₹2,999",
    discount: "50% OFF",
    rating: 4.9,
    reviews: 41,
    badge: "SANGEET EDIT",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Sultana Dual Tiered Halubali Earrings",
    price: "₹899",
    oldPrice: "₹1,699",
    discount: "47% OFF",
    rating: 4.8,
    reviews: 18,
    badge: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Devanshi Rajwadi Chooda & Broad Kada Set",
    price: "₹1,399",
    oldPrice: "₹2,499",
    discount: "44% OFF",
    rating: 4.9,
    reviews: 29,
    badge: "OPENABLE BANGLE",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Kalyani Peacock Long Haar Bridal Set",
    price: "₹1,799",
    oldPrice: "₹3,599",
    discount: "50% OFF",
    rating: 5.0,
    reviews: 12,
    badge: "ROYAL EDIT",
    image:
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Siya Floral Kundan Pearl Mathapatti",
    price: "₹649",
    oldPrice: "₹1,299",
    discount: "50% OFF",
    rating: 4.8,
    reviews: 27,
    badge: "POLKI EDIT",
    image:
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Mehrunissa Bridal Clip-On Kundan Nath",
    price: "₹349",
    oldPrice: "₹699",
    discount: "50% OFF",
    rating: 4.9,
    reviews: 35,
    badge: "NO PIERCING NATH",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=85",
  },
];

/* =========================
   MAIN PAGE
========================= */

export default function BridalFestive() {
  return (
    <Box
      sx={{
        background: "#fbf9f6",
        color: "#281a1a",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <HeroSection />

      <CategoryTabs />

      <ShopSection />

      <StylingSection />

      <RealBrides />

      <Guarantees />

      <RoyalPrivileges />
    </Box>
  );
}

/* =========================
   HERO
========================= */

function HeroSection() {
  return (
    <Box
      sx={{
        background:
          "radial-gradient(circle at 70% 30%, #641a24 0%, #390009 45%, #250006 100%)",
        color: "#fff",
        px: { xs: 2, md: 5 },
        py: { xs: 4, md: 5 },
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* LEFT */}
        <Grid item xs={12} md={7}>
          <Box sx={{ maxWidth: 650 }}>
            <Chip
              label="✦ HANDCRAFTED ROYAL TROUSSEAU COLLECTION 2026"
              size="small"
              sx={{
                mb: 2,
                background: "rgba(255,255,255,.12)",
                color: "#fed65b",
                border: "1px solid rgba(254,214,91,.35)",
                fontSize: 8,
                letterSpacing: 0.5,
              }}
            />

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: { xs: 36, md: 48 },
                fontWeight: 700,
                lineHeight: 1.05,
              }}
            >
              The Royal Bridal Atelier
            </Typography>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                color: "#fed65b",
                fontSize: { xs: 30, md: 42 },
                fontWeight: 600,
                mb: 2,
              }}
            >
              & Festive Heirlooms
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                lineHeight: 1.7,
                color: "#f2dddd",
                maxWidth: 590,
                mb: 3,
              }}
            >
              Complete 5-piece and 7-piece handcrafted bridal sets, heirloom
              Kundan bridal haars, mathapattis, and richly jeweled curated
              pieces for the discerning modern Indian bride. Fine bridal
              grandeur, zero weighty failure.
            </Typography>

            {/* FEATURES */}
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              {[
                ["✦", "COMPLIMENTARY", "Velvet Trousseau Box"],
                ["◈", "LIVE VIDEO", "CONCIERGE", "1-on-1 Bridal Styling"],
                ["✓", "ZERO-TARNISH", "1-Year Micro-Gold Seal"],
              ].map((item, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Box
                    sx={{
                      border: "1px solid rgba(255,255,255,.22)",
                      background: "rgba(255,255,255,.07)",
                      borderRadius: 1,
                      p: 1.4,
                      minHeight: 70,
                    }}
                  >
                    <Typography sx={{ color: "#fed65b", fontSize: 11 }}>
                      {item[0]} {item[1]}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 10,
                        color: "#fff",
                        mt: 0.5,
                      }}
                    >
                      {item[2]}
                    </Typography>

                    {item[3] && (
                      <Typography sx={{ fontSize: 9, color: "#e5caca" }}>
                        {item[3]}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                sx={{
                  background: "#fed65b",
                  color: "#390009",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 11,
                  px: 2.5,
                  "&:hover": {
                    background: "#f7c93e",
                  },
                }}
              >
                Explore Bridal Jewels ↓
              </Button>

              <Button
                variant="outlined"
                sx={{
                  borderColor: "#fed65b",
                  color: "#fff",
                  textTransform: "none",
                  fontSize: 11,
                  px: 2.5,
                  "&:hover": {
                    borderColor: "#fed65b",
                    background: "rgba(254,214,91,.08)",
                  },
                }}
              >
                ◉ Book Virtual Styling
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* RIGHT IMAGE */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              position: "relative",
              maxWidth: 430,
              mx: "auto",
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1610173827043-9db50e0d8ef9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW5kaWFuJTIwYnJpZGV8ZW58MHx8MHx8fDA%3D"
              sx={{
                width: "100%",
                height: { xs: 380, md: 470 },
                objectFit: "cover",
                borderRadius: 2,
                display: "block",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                bottom: 12,
                left: 12,
                right: 12,
                background: "rgba(255,255,255,.96)",
                color: "#281a1a",
                borderRadius: 1,
                p: 1.2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 9, color: "#777" }}>
                  ZN
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  Bride Ananya Singhania
                </Typography>

                <Typography sx={{ fontSize: 8, color: "#777" }}>
                  Kundan Pure Wedding • wearing Jodha Set
                </Typography>
              </Box>

              <Typography sx={{ fontSize: 10 }}>
                ★ 5.0
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

/* =========================
   CATEGORY TABS
========================= */

function CategoryTabs() {
  const categories = [
    "All Bridal & Festive",
    "Complete Bridal Sets",
    "Royal Mathapatti & Maangtikkas",
    "Bridal Nath & Nose Rings",
    "Sangeet & Cocktail Statement",
    "Haldi & Mehendi",
  ];

  return (
    <Box
      sx={{
        background: "#fff",
        px: { xs: 1, md: 3 },
        py: 1,
        borderBottom: "1px solid #eee",
        overflowX: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          minWidth: "max-content",
        }}
      >
        {categories.map((cat, index) => (
          <Button
            key={cat}
            sx={{
              textTransform: "none",
              fontSize: 9,
              minWidth: "auto",
              px: 1.5,
              py: 0.8,
              borderRadius: 10,
              background:
                index === 0 ? "#390009" : "#f7f5f2",
              color: index === 0 ? "#fff" : "#554242",
              "&:hover": {
                background:
                  index === 0 ? "#390009" : "#eeeae6",
              },
            }}
          >
            {cat}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

/* =========================
   SHOP SECTION
========================= */

function ShopSection() {
  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
      {/* TOP */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 10,
              color: "#777",
              mb: 0.5,
            }}
          >
            ✦ REFINE TROUSSEAU
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Bridal & Festive Edit
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: 10 }}>Sort By:</Typography>

          <Select
            size="small"
            defaultValue="featured"
            sx={{
              fontSize: 10,
              minWidth: 150,
              height: 34,
              background: "#fff",
            }}
          >
            <MenuItem value="featured">Featured Royal Trousseau</MenuItem>
            <MenuItem value="priceLow">Price Low to High</MenuItem>
            <MenuItem value="priceHigh">Price High to Low</MenuItem>
          </Select>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* SIDEBAR */}
        <Grid item xs={12} md={2.5}>
          <Sidebar />
        </Grid>

        {/* PRODUCTS */}
        <Grid item xs={12} md={9.5}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 1.5,
            }}
          >
            {products.map((product, index) => (
              <ProductCard product={product} key={index} />
            ))}
          </Box>

          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography sx={{ fontSize: 9, color: "#888", mb: 1 }}>
              Showing 8 of 54 Bridal & Festive Designs
            </Typography>

            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                fontSize: 10,
                borderColor: "#ddd",
                color: "#390009",
              }}
            >
              Load More Bridal Sets
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

/* =========================
   SIDEBAR
========================= */

function Sidebar() {
  return (
    <Box
      sx={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 1,
        p: 1.8,
        position: { md: "sticky" },
        top: 10,
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          mb: 1.5,
        }}
      >
        FILTER BY
      </Typography>

      <FilterTitle title="BRIDAL CEREMONY" />

      <CheckItem text="Mehendi / Haldi" count="14" />
      <CheckItem text="Sangeet & Cocktail" count="21" checked />
      <CheckItem text="Wedding Process" count="62" checked />
      <CheckItem text="Reception Luxe" count="12" />

      <Divider sx={{ my: 1.5 }} />

      <FilterTitle title="SET INCLUSIONS" />

      <RadioItem text="Full Trousseau (5-7 Pc)" count="11" checked />
      <RadioItem text="Choker + Mathapatti Only" count="22" />
      <RadioItem text="Mathapatti & Maang Tikka" count="17" />
      <RadioItem text="Bridal Nath & Bangles" count="8" />

      <Divider sx={{ my: 1.5 }} />

      <FilterTitle title="METAL & PLATING" />

      <CheckItem text="Jaipur Kundan Polki" count="28" />
      <CheckItem text="South Temple-Polki Work" count="16" />
      <CheckItem text="Hyderabad Nizam Beads" count="7" />
      <CheckItem text="Royal Meenakari" count="12" />

      <Divider sx={{ my: 1.5 }} />

      <FilterTitle title="WEIGHT & COMFORT" />

      <Box
        sx={{
          p: 1,
          background: "#f8f6f3",
          borderRadius: 1,
          mb: 1,
        }}
      >
        <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
          Lightweight Grandeur-Ready
        </Typography>

        <Typography sx={{ fontSize: 8, color: "#888" }}>
          12-20g per heavy piece
        </Typography>
      </Box>

      <Box
        sx={{
          p: 1,
          background: "#f8f6f3",
          borderRadius: 1,
        }}
      >
        <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
          Grand Heirloom Heavy
        </Typography>

        <Typography sx={{ fontSize: 8, color: "#888" }}>
          22-35g Statement
        </Typography>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <FilterTitle title="PRICE TIER" />

      <CheckItem text="Under ₹999" count="19" />
      <CheckItem text="Grand Statement ₹1,000 - ₹2,499" count="24" />
      <CheckItem text="Bridal Trousseau ₹2,500 - ₹5,999" count="11" />

      <Box
        sx={{
          background: "#390009",
          color: "#fff",
          p: 1.5,
          borderRadius: 1,
          mt: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          Need Sizing or Match Help?
        </Typography>

        <Typography
          sx={{
            fontSize: 8,
            color: "#e9cccc",
            lineHeight: 1.5,
            mb: 1,
          }}
        >
          Our bridal specialists match necklaces, bangles and mathapattis.
        </Typography>

        <Button
          fullWidth
          size="small"
          sx={{
            background: "#fed65b",
            color: "#390009",
            fontSize: 8,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          CHAT WITH STYLIST
        </Button>
      </Box>
    </Box>
  );
}

function FilterTitle({ title }) {
  return (
    <Typography
      sx={{
        fontSize: 8,
        fontWeight: 700,
        color: "#777",
        letterSpacing: 0.5,
        mb: 0.7,
      }}
    >
      {title}
    </Typography>
  );
}

function CheckItem({ text, count, checked = false }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <FormControlLabel
        sx={{ m: 0 }}
        control={
          <Checkbox
            defaultChecked={checked}
            size="small"
            sx={{
              p: 0.3,
              "& .MuiSvgIcon-root": {
                fontSize: 15,
              },
            }}
          />
        }
        label={
          <Typography sx={{ fontSize: 8.5 }}>
            {text}
          </Typography>
        }
      />

      <Typography sx={{ fontSize: 7, color: "#999" }}>
        {count}
      </Typography>
    </Box>
  );
}

function RadioItem({ text, count, checked = false }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <FormControlLabel
        sx={{ m: 0 }}
        control={
          <Checkbox
            type="radio"
            defaultChecked={checked}
            size="small"
            sx={{
              p: 0.3,
              "& .MuiSvgIcon-root": {
                fontSize: 14,
              },
            }}
          />
        }
        label={
          <Typography sx={{ fontSize: 8.5 }}>
            {text}
          </Typography>
        }
      />

      <Typography sx={{ fontSize: 7, color: "#999" }}>
        {count}
      </Typography>
    </Box>
  );
}

/* =========================
   PRODUCT CARD
========================= */

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);

  return (
    <Card
      sx={{
        borderRadius: 1,
        boxShadow: "0 2px 10px rgba(0,0,0,.05)",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{
            height: { xs: 180, sm: 210, md: 220 },
            objectFit: "cover",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 6,
            left: 6,
            background: "#390009",
            color: "#fff",
            px: 0.7,
            py: 0.4,
            fontSize: 6.5,
            fontWeight: 700,
            borderRadius: 0.4,
          }}
        >
          {product.badge}
        </Box>

        <IconButton
          onClick={() => setLiked(!liked)}
          sx={{
            position: "absolute",
            right: 5,
            top: 5,
            background: "rgba(255,255,255,.9)",
            width: 28,
            height: 28,
            "&:hover": {
              background: "#fff",
            },
          }}
        >
          {liked ? (
            <Favorite
              sx={{
                fontSize: 15,
                color: "#8c1021",
              }}
            />
          ) : (
            <FavoriteBorder
              sx={{
                fontSize: 15,
              }}
            />
          )}
        </IconButton>

        <Box
          sx={{
            position: "absolute",
            bottom: 6,
            left: 6,
            background: "#fed65b",
            color: "#390009",
            fontSize: 7,
            px: 0.7,
            py: 0.35,
            fontWeight: 700,
          }}
        >
          {product.discount}
        </Box>
      </Box>

      <Box sx={{ p: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.3,
            mb: 0.5,
          }}
        >
          <Star sx={{ fontSize: 11, color: "#b78900" }} />

          <Typography sx={{ fontSize: 8 }}>
            {product.rating}
          </Typography>

          <Typography
            sx={{
              fontSize: 7,
              color: "#999",
            }}
          >
            ({product.reviews})
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1.25,
            minHeight: 28,
          }}
        >
          {product.name}
        </Typography>

        <Typography
          sx={{
            fontSize: 7.5,
            color: "#888",
            mt: 0.4,
            mb: 0.7,
          }}
        >
          Handcrafted royal bridal jewellery...
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 800,
              color: "#390009",
            }}
          >
            {product.price}
          </Typography>

          <Typography
            sx={{
              fontSize: 8,
              color: "#999",
              textDecoration: "line-through",
            }}
          >
            {product.oldPrice}
          </Typography>
        </Box>

        <Button
          fullWidth
          startIcon={
            <ShoppingBagOutlined sx={{ fontSize: "13px !important" }} />
          }
          sx={{
            background: "#390009",
            color: "#fff",
            fontSize: 8,
            fontWeight: 700,
            textTransform: "uppercase",
            py: 0.7,
            borderRadius: 0.5,
            "&:hover": {
              background: "#58111a",
            },
          }}
        >
          Add to Bag
        </Button>
      </Box>
    </Card>
  );
}

/* =========================
   VIRTUAL STYLING
========================= */

function StylingSection() {
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Grid
        container
        sx={{
          background: "#fff",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 3px 20px rgba(0,0,0,.07)",
        }}
      >
        {/* LEFT */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            background:
              "linear-gradient(145deg,#390009,#5b101c)",
            color: "#fff",
            p: { xs: 3, md: 4 },
          }}
        >
          <Typography
            sx={{
              color: "#fed65b",
              fontSize: 9,
              letterSpacing: 1,
              mb: 1,
            }}
          >
            ZINORA JEWEL STUDIO
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: 27,
              fontWeight: 600,
              lineHeight: 1.15,
              mb: 1.5,
            }}
          >
            Book a Free Virtual Bridal Styling Session
          </Typography>

          <Typography
            sx={{
              color: "#edd7d7",
              fontSize: 10,
              lineHeight: 1.7,
              mb: 2,
            }}
          >
            Don't guess your bridal neckline. Send us photographs of your
            lehenga or saree blouse, and our master stylist in Jaipur will
            present a curated jewellery pairing over a video consultation.
          </Typography>

          {[
            "Neckline silhouette color matching",
            "Live weight & finish styling demonstration",
            "Zero-commitment consultation",
          ].map((item) => (
            <Typography
              key={item}
              sx={{
                fontSize: 9,
                mb: 1,
                color: "#f5e8e8",
              }}
            >
              ✓ {item}
            </Typography>
          ))}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background:
                  "url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80) center/cover",
              }}
            />

            <Box>
              <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
                Meera Sharma
              </Typography>

              <Typography sx={{ fontSize: 8, color: "#dcbebe" }}>
                Head of Bridal Concierge • 600+ Brides Styled
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={7} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Schedule your Bridal Session
          </Typography>

          <Typography
            sx={{
              fontSize: 9,
              color: "#888",
              mb: 2,
            }}
          >
            Choose your preferred consultation slot and our stylist will
            contact you.
          </Typography>

          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Bride's Full Name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="WhatsApp Number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="E-mail Address"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Preferred Consultation Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Lehenga / Saree Colour"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Preferred Occasion"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Describe your jewellery requirement"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                startIcon={<CalendarMonthOutlined />}
                sx={{
                  background: "#390009",
                  color: "#fff",
                  fontSize: 10,
                  py: 1,
                  textTransform: "uppercase",
                  "&:hover": {
                    background: "#58111a",
                  },
                }}
              >
                Confirm Video Consultation
              </Button>
            </Grid>
          </Grid>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: 7,
              color: "#999",
              mt: 1,
            }}
          >
            ✦ Zero pre-payment • 30 min consultation • No purchase obligation
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

/* =========================
   REAL BRIDES
========================= */

function RealBrides() {
  const brides = [
    {
      name: "Tanvi Mehra",
      location: "Mumbai",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA0ZoAiQFvBm2ZfFvZ91qE1Fq9-8D4Td24GSihERA2HA&s=10",
      text: "I wanted my bridal jewellery to feel timeless yet modern. The entire experience was beautifully curated.",
    },
    {
      name: "Pooja Ramanathan",
      location: "Bengaluru",
      image:
        "https://images.unsplash.com/photo-1727430228383-aa1fb59db8bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGluZGlhbiUyMGJyaWRlfGVufDB8fDB8fHww",
      text: "The handcrafted finish and the detailing matched my wedding lehenga perfectly.",
    },
    {
      name: "Kavita Singhal",
      location: "New Delhi",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAkq3LtM0ToVluHbyN6MnxdkJt82As41l7F3scTSX7Ww&s=10",
      text: "So lightweight I danced the entire Sangeet without worrying about my jewellery.",
    },
    {
      name: "Shreya Kulkarni",
      location: "Pune",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-2MXNIabI8Zzty9KT7mi0brl7rZBytsHGyit5KRz-rQ&s=10",
      text: "The complete wedding set made my bridal look feel regal, elegant and completely unique.",
    },
  ];

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 9,
              color: "#9b7c21",
              letterSpacing: 1,
            }}
          >
            ☆☆☆☆☆ 4.95 / 5 Rating Across 180+ Bridal Stories
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: 26,
              mt: 0.5,
            }}
          >
            Real Zinora Brides
          </Typography>
        </Box>

        <Button
          sx={{
            textTransform: "none",
            fontSize: 9,
            color: "#390009",
          }}
        >
          View Complete Wedding Gallery →
        </Button>
      </Box>

      <Grid container spacing={1.5}>
        {brides.map((bride) => (
          <Grid item xs={6} md={3} key={bride.name}>
            <Card
              sx={{
                borderRadius: 1,
                boxShadow: "0 2px 10px rgba(0,0,0,.06)",
              }}
            >
              <CardMedia
                component="img"
                image={bride.image}
                sx={{
                  height: { xs: 230, md: 320 },
                  objectFit: "cover",
                }}
              />

              <Box sx={{ p: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: 8,
                    color: "#777",
                    lineHeight: 1.6,
                    mb: 1,
                  }}
                >
                  "{bride.text}"
                </Typography>

                <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
                  {bride.name}
                </Typography>

                <Typography sx={{ fontSize: 7, color: "#999" }}>
                  Bride • {bride.location}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/* =========================
   GUARANTEES
========================= */

function Guarantees() {
  const items = [
    {
      icon: <VerifiedOutlined />,
      title: "100% Skin Safe Brass & Copper",
      text: "Hypoallergenic, nickel-free compositions crafted for comfort.",
    },
    {
      icon: <SecurityOutlined />,
      title: "1-Year Polish Warranty",
      text: "Guaranteed micro-gold finish longevity with care.",
    },
    {
      icon: <HandshakeOutlined />,
      title: "Handcrafted by Indian Karigars",
      text: "Sustaining generational craftsmanship from Jaipur, Agra & Kolkata.",
    },
  ];

  return (
    <Box
      sx={{
        background: "#fff",
        borderTop: "1px solid #eee",
        borderBottom: "1px solid #eee",
        px: { xs: 2, md: 5 },
        py: 3,
      }}
    >
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} md={4} key={item.title}>
            <Box
              sx={{
                textAlign: "center",
                maxWidth: 300,
                mx: "auto",
              }}
            >
              <Box sx={{ color: "#735c00", mb: 0.5 }}>
                {React.cloneElement(item.icon, {
                  sx: { fontSize: 25 },
                })}
              </Box>

              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: 8,
                  color: "#888",
                  mt: 0.5,
                  lineHeight: 1.5,
                }}
              >
                {item.text}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/* =========================
   ROYAL PRIVILEGES
========================= */

function RoyalPrivileges() {
  return (
    <Box
      sx={{
        background: "#f3f0ec",
        px: { xs: 2, md: 5 },
        py: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#9b7c21",
              fontSize: 8,
              letterSpacing: 1,
            }}
          >
            EXCLUSIVE ROYAL PRIVILEGES
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: 25,
              color: "#390009",
            }}
          >
            Join the Zinora Atelier
          </Typography>

          <Typography
            sx={{
              fontSize: 9,
              color: "#777",
              maxWidth: 450,
            }}
          >
            Sign up to receive private collection previews and enjoy an
            exclusive 5% off your maiden order.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 0.7,
            width: { xs: "100%", md: 430 },
          }}
        >
          <TextField
            size="small"
            fullWidth
            placeholder="Enter your mobile number or email address"
            sx={{
              background: "#fff",
            }}
          />

          <Button
            sx={{
              background: "#390009",
              color: "#fff",
              whiteSpace: "nowrap",
              fontSize: 8,
              "&:hover": {
                background: "#58111a",
              },
            }}
          >
            CLAIM 15% OFF
          </Button>
        </Box>
      </Box>
    </Box>
  );
}