
import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  Stack,
  Divider,
} from "@mui/material";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const products = [
  {
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
    tag: "BESTSELLER",
    discount: "57% OFF",
    name: "The Jodha Royal Kundan Necklace",
    price: "₹1,849",
    oldPrice: "₹4,299",
  },
  {
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",
    tag: "HERITAGE",
    discount: "55% OFF",
    name: "Padmavati Kemp Ruby Necklace",
    price: "₹999",
    oldPrice: "₹2,199",
  },
  {
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
    tag: "WATERPROOF",
    discount: "53% OFF",
    name: "Noor Dual-Layer Moissanite",
    price: "₹799",
    oldPrice: "₹1,699",
  },
  {
    image:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=700&q=80",
    tag: "ROYAL",
    discount: "51% OFF",
    name: "Mayuri Peacock Antique Necklace",
    price: "₹1,699",
    oldPrice: "₹3,499",
  },
  {
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
    tag: "TRENDING",
    discount: "56% OFF",
    name: "Gauri Delicate Pearl Collar",
    price: "₹349",
    oldPrice: "₹799",
  },
  {
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
    tag: "DAILY WEAR",
    discount: "58% OFF",
    name: "Aanya Micro-Gold Dainty Chain",
    price: "₹249",
    oldPrice: "₹599",
  },
  {
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=700&q=80",
    tag: "SPECIAL",
    discount: "50% OFF",
    name: "Elegant Pearl Drop Earrings",
    price: "₹599",
    oldPrice: "₹1,299",
  },
  {
    image:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=700&q=80",
    tag: "ROYAL PICK",
    discount: "54% OFF",
    name: "Traditional Gold Jhumka",
    price: "₹899",
    oldPrice: "₹1,999",
  },
];

function ProductCard({ product }) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid #eee",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        height: "100%",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="230"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: "cover" }}
        />

        <Chip
          label={product.tag}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            bgcolor: "#6b0f1a",
            color: "#fff",
            fontWeight: 700,
            fontSize: 10,
          }}
        />

        <Chip
          label={product.discount}
          size="small"
          sx={{
            position: "absolute",
            bottom: 10,
            left: 10,
            bgcolor: "#c62828",
            color: "#fff",
            fontWeight: 700,
            fontSize: 10,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "#fff",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FavoriteBorderIcon fontSize="small" />
        </Box>
      </Box>

      <CardContent sx={{ p: 1.5 }}>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: "#4b0d16",
            mb: 0.7,
          }}
        >
          ★ 4.8
          <Typography
            component="span"
            sx={{ fontSize: 10, color: "#777", ml: 0.5 }}
          >
            (96 reviews)
          </Typography>
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            minHeight: 40,
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ mt: 1 }}>
          <Typography
            component="span"
            sx={{
              color: "#8b101f",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            {product.price}
          </Typography>

          <Typography
            component="span"
            sx={{
              ml: 1,
              color: "#999",
              fontSize: 12,
              textDecoration: "line-through",
            }}
          >
            {product.oldPrice}
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingBagOutlinedIcon />}
          sx={{
            mt: 1.5,
            bgcolor: "#650b17",
            textTransform: "none",
            fontSize: 12,
            "&:hover": {
              bgcolor: "#4d0710",
            },
          }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}

function Offers() {
  return (
    <Box sx={{ bgcolor: "#faf8f4", minHeight: "100vh" }}>

      {/* OFFER HERO */}
      <Box
        sx={{
          bgcolor: "#f4efe7",
          py: { xs: 4, md: 7 },
          borderBottom: "1px solid #eee",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={5} alignItems="center">

            <Grid item xs={12} md={6}>
              <Chip
                icon={<LocalOfferIcon />}
                label="EXCLUSIVE ROYAL OFFERS"
                sx={{
                  bgcolor: "#f4d879",
                  color: "#6a111c",
                  fontWeight: 700,
                  mb: 2,
                }}
              />

              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  fontSize: { xs: 35, md: 58 },
                  lineHeight: 0.95,
                  fontWeight: 700,
                  color: "#65101b",
                }}
              >
                The Royal Treasure
                <br />
                <Box component="span" sx={{ color: "#a48225" }}>
                  Makes Your Sparkle
                </Box>
                <br />
                Special
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  maxWidth: 600,
                  color: "#666",
                  lineHeight: 1.7,
                }}
              >
                Discover exclusive jewellery offers crafted for every
                celebration. Enjoy royal designs, timeless craftsmanship and
                special prices.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 3 }}
              >
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: "#650b17",
                    px: 3,
                    py: 1.4,
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  SHOP ALL OFFERS
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#650b17",
                    color: "#650b17",
                    px: 3,
                    textTransform: "none",
                  }}
                >
                  VIEW COLLECTION
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 30px rgba(0,0,0,.15)",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80"
                  sx={{
                    width: "100%",
                    height: { xs: 280, md: 400 },
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* OFFER CATEGORIES */}
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#650b17",
            mb: 3,
          }}
        >
          Today's Best Offers
        </Typography>

        <Grid container spacing={2}>
          {[
            ["57% OFF", "Royal Kundan Collection"],
            ["55% OFF", "Temple Jewellery"],
            ["53% OFF", "Daily Wear Jewellery"],
            ["50% OFF", "Bridal Collection"],
          ].map(([discount, title]) => (
            <Grid item xs={12} sm={6} md={3} key={title}>
              <Card
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid #eee",
                  boxShadow: "none",
                  bgcolor: "#fff",
                }}
              >
                <Chip
                  label={discount}
                  sx={{
                    bgcolor: "#650b17",
                    color: "#fff",
                    fontWeight: 700,
                    mb: 2,
                  }}
                />

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#65101b",
                    fontSize: 17,
                  }}
                >
                  {title}
                </Typography>

                <Typography
                  sx={{
                    color: "#777",
                    fontSize: 13,
                    mt: 1,
                  }}
                >
                  Explore exclusive designs at special prices.
                </Typography>

                <Button
                  sx={{
                    mt: 2,
                    color: "#650b17",
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Shop Now
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* PRODUCT SECTION */}
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 13,
                color: "#a48225",
                fontWeight: 700,
              }}
            >
              LIMITED TIME COLLECTION
            </Typography>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: 30,
                fontWeight: 700,
                color: "#650b17",
              }}
            >
              Shop Exclusive Offers
            </Typography>
          </Box>

          <Button
            variant="outlined"
            sx={{
              borderColor: "#650b17",
              color: "#650b17",
              textTransform: "none",
            }}
          >
            View All Offers
          </Button>
        </Box>

        <Grid container spacing={2.5}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.name}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* TRUST SECTION */}
      <Box sx={{ bgcolor: "#fff", py: 5 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {[
              ["100% Skin Safe Brass", "Nickel-free and hypoallergenic"],
              ["1-Year Polish Warranty", "Guaranteed long-lasting shine"],
              ["Handcrafted Jewellery", "Made by skilled Indian artisans"],
            ].map(([title, text]) => (
              <Grid item xs={12} md={4} key={title}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    border: "1px solid #eee",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#650b17",
                      fontSize: 20,
                      fontWeight: 800,
                    }}
                  >
                    ✦
                  </Typography>

                  <Typography
                    sx={{
                      color: "#650b17",
                      fontWeight: 700,
                      mt: 1,
                    }}
                  >
                    {title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#777",
                      fontSize: 12,
                      mt: 1,
                    }}
                  >
                    {text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FOOTER CTA */}
      <Box
        sx={{
          bgcolor: "#f3f0eb",
          py: 5,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                sx={{
                  fontSize: 12,
                  color: "#a48225",
                  fontWeight: 700,
                }}
              >
                EXCLUSIVE ROYAL PRIVILEGES
              </Typography>

              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  fontSize: 28,
                  color: "#650b17",
                  fontWeight: 700,
                }}
              >
                Join the Zinora Atelier
              </Typography>

              <Typography sx={{ color: "#777", mt: 1 }}>
                Sign up to receive private collection previews and exclusive
                offers.
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Stack direction="row">
                <Box
                  component="input"
                  placeholder="Enter your mobile number or email"
                  sx={{
                    flex: 1,
                    border: "1px solid #ddd",
                    outline: "none",
                    px: 2,
                    py: 1.5,
                    bgcolor: "#fff",
                  }}
                />

                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#650b17",
                    borderRadius: 0,
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  CLAIM 15% OFF
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}

export default Offers;
