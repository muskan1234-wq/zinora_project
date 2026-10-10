import React, { useState } from "react";

import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Rating,
  Chip,
  Container,
  Divider,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { Link } from "react-router-dom";

// Sample products
const initialProducts = [
  {
    id: 1,
    name: "Aaradhya Moissanite Polki Choker Set",
    description: "Traditional elegance with modern craftsmanship",
    price: 1499,
    oldPrice: 2999,
    discount: "50% OFF",
    rating: 4.9,
    reviews: 18,
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Meera Dual-Tone Filigree Jhumkas",
    description: "Beautiful handcrafted statement earrings",
    price: 349,
    oldPrice: 799,
    discount: "56% OFF",
    rating: 4.8,
    reviews: 42,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Rhea Baguette Solitaire Minimal Ring",
    description: "Minimal jewellery for your everyday style",
    price: 199,
    oldPrice: 499,
    discount: "60% OFF",
    rating: 5.0,
    reviews: 9,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    name: "Devanshi Rajwadi Openable Kada",
    description: "A timeless design inspired by royal heritage",
    price: 899,
    oldPrice: 1899,
    discount: "53% OFF",
    rating: 4.9,
    reviews: 63,
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=85",
  },
];

function Wishlist() {
  const [products, setProducts] = useState(initialProducts);

  // Remove product from wishlist
  const removeProduct = (id) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id)
    );
  };

  // Add product to shopping bag
  const moveToBag = (product) => {
    try {
      const existingBag = JSON.parse(
        localStorage.getItem("zinoraCart") || "[]"
      );

      if (!Array.isArray(existingBag)) {
        throw new Error("Invalid cart data");
      }

      const alreadyInBag = existingBag.some(
        (item) => item.id === product.id
      );

      if (!alreadyInBag) {
        localStorage.setItem(
          "zinoraCart",
          JSON.stringify([...existingBag, { ...product, quantity: 1 }])
        );
      }

      removeProduct(product.id);

      alert(
        alreadyInBag
          ? "This product is already in your bag!"
          : "Product added to your bag!"
      );
    } catch (error) {
      console.error("Unable to update shopping bag:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fbf9f6",
        minHeight: "100vh",
        color: "#281a1a",
        pb: 7,
      }}
    >
      {/* HERO SECTION */}
      <Box
        sx={{
          background:
            "linear-gradient(120deg, #390009 0%, #58111a 65%, #731d29 100%)",
          color: "#fff",
          py: { xs: 5, md: 7 },
          px: 2,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AutoAwesomeIcon
          sx={{
            position: "absolute",
            left: "12%",
            top: "25%",
            fontSize: 35,
            color: "#fed65b",
            opacity: 0.35,
          }}
        />

        <FavoriteIcon
          sx={{ fontSize: 34, color: "#fed65b", mb: 1 }}
        />

        <Typography
          sx={{
            fontSize: 10,
            letterSpacing: 3,
            color: "#fed65b",
            mb: 1.5,
          }}
        >
          YOUR PERSONAL JEWELLERY COLLECTION
        </Typography>

        <Typography
          component="h1"
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: { xs: 34, md: 48 },
            fontWeight: 500,
            mb: 1,
          }}
        >
          My Wishlist
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 12, md: 14 },
            color: "#f0dfe0",
            maxWidth: 500,
            mx: "auto",
            lineHeight: 1.8,
          }}
        >
          Every piece you love, collected in one beautiful place.
          Save your favourites and make them yours.
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* BREADCRUMB */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
            fontSize: 11,
            color: "#887878",
          }}
        >
          <Typography
            component={Link}
            to="/"
            sx={{
              color: "#887878",
              textDecoration: "none",
              fontSize: 11,
              "&:hover": { color: "#690e1c" },
            }}
          >
            Home
          </Typography>

          <Typography sx={{ fontSize: 11 }}>/</Typography>

          <Typography sx={{ color: "#690e1c", fontSize: 11 }}>
            My Wishlist
          </Typography>
        </Box>

        {/* SECTION HEADING */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: { xs: 23, md: 29 },
                fontWeight: 600,
              }}
            >
              Your Favourite Pieces
            </Typography>

            <Typography
              sx={{ fontSize: 12, color: "#887878", mt: 0.5 }}
            >
              {products.length}{" "}
              {products.length === 1
                ? "beautiful piece"
                : "beautiful pieces"}{" "}
              saved for you
            </Typography>
          </Box>

          {products.length > 0 && (
            <Button
              component={Link}
              to="/"
              endIcon={<ArrowForwardIcon />}
              sx={{
                color: "#690e1c",
                textTransform: "none",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Continue Shopping
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3, borderColor: "#e8dfda" }} />

        {/* EMPTY WISHLIST */}
        {products.length === 0 ? (
          <Box
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #eee5df",
              borderRadius: 2,
              textAlign: "center",
              py: { xs: 6, md: 9 },
              px: 2,
            }}
          >
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                backgroundColor: "#f8e9eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <FavoriteBorderIcon
                sx={{ fontSize: 43, color: "#690e1c" }}
              />
            </Box>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: 27,
                mb: 1,
              }}
            >
              Your Wishlist is Empty
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: "#887878",
                maxWidth: 400,
                mx: "auto",
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              You haven't saved any jewellery yet. Explore our
              collections and save the pieces you love.
            </Typography>

            <Button
              component={Link}
              to="/new-arrivals"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: "#390009",
                color: "#fff",
                px: 3,
                py: 1.2,
                textTransform: "none",
                fontSize: 12,
                "&:hover": { backgroundColor: "#58111a" },
              }}
            >
              Explore New Arrivals
            </Button>
          </Box>
        ) : (
          /* PRODUCT GRID */
          <Grid container spacing={2.5}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 1.5,
                    backgroundColor: "#fff",
                    boxShadow: "0 3px 15px rgba(57,0,9,0.04)",
                    border: "1px solid #eee8e3",
                    transition: "transform .25s, box-shadow .25s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 25px rgba(57,0,9,0.10)",
                    },
                  }}
                >
                  {/* PRODUCT IMAGE */}
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                      sx={{
                        height: 270,
                        objectFit: "cover",
                        backgroundColor: "#f1ece7",
                      }}
                    />

                    <Chip
                      label={product.discount}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        backgroundColor: "#390009",
                        color: "#fff",
                        borderRadius: 0.5,
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    />

                    <IconButton
                      onClick={() => removeProduct(product.id)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "#fff",
                        width: 35,
                        height: 35,
                        boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                        "&:hover": { backgroundColor: "#f8e9eb" },
                      }}
                    >
                      <DeleteIcon
                        sx={{ fontSize: 20, color: "#690e1c" }}
                      />
                    </IconButton>
                  </Box>

                  {/* PRODUCT DETAILS */}
                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.7,
                        mb: 1,
                      }}
                    >
                      <Rating
                        value={product.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                        sx={{ fontSize: 15, color: "#b58b2a" }}
                      />

                      <Typography sx={{ fontSize: 10, color: "#887878" }}>
                        {product.rating} ({product.reviews})
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1.5,
                        minHeight: 42,
                        color: "#281a1a",
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#887878",
                        lineHeight: 1.6,
                        mt: 0.5,
                        mb: 1.5,
                      }}
                    >
                      {product.description}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#390009",
                        }}
                      >
                        ₹{product.price.toLocaleString("en-IN")}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#999",
                          textDecoration: "line-through",
                        }}
                      >
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingBagOutlinedIcon />}
                      onClick={() => moveToBag(product)}
                      sx={{
                        py: 1.1,
                        backgroundColor: "#390009",
                        color: "#fff",
                        borderRadius: 0.7,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        "&:hover": { backgroundColor: "#58111a" },
                      }}
                    >
                      Add to Bag
                    </Button>

                    <Button
                      fullWidth
                      onClick={() => removeProduct(product.id)}
                      startIcon={<DeleteIcon />}
                      sx={{
                        mt: 0.7,
                        color: "#887878",
                        fontSize: 10,
                        textTransform: "none",
                        "&:hover": {
                          color: "#690e1c",
                          backgroundColor: "#fbf4f3",
                        },
                      }}
                    >
                      Remove from Wishlist
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* BOTTOM BENEFITS */}
        <Grid container spacing={2} sx={{ mt: 5 }}>
          {[
            {
              icon: "✦",
              title: "Skin-Friendly Jewellery",
              text: "Designed with your comfort in mind",
            },
            {
              icon: "◇",
              title: "Quality Craftsmanship",
              text: "Beautiful details in every piece",
            },
            {
              icon: "♡",
              title: "Made to Be Loved",
              text: "Find pieces for every special moment",
            },
          ].map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2.5,
                  backgroundColor: "#fff",
                  border: "1px solid #eee5df",
                  borderRadius: 1.5,
                  height: "100%",
                }}
              >
                <Typography
                  sx={{ fontSize: 28, color: "#98721b" }}
                >
                  {item.icon}
                </Typography>

                <Box>
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 700, mb: 0.5 }}
                  >
                    {item.title}
                  </Typography>

                  <Typography sx={{ fontSize: 11, color: "#887878" }}>
                    {item.text}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Wishlist;