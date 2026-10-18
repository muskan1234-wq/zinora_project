import React, { useCallback, useEffect, useState } from "react";

import {
Alert,
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

const API_BASE = "http://127.0.0.1:8000";

const readStorage = (key) => {
try {
const value = JSON.parse(localStorage.getItem(key) || "[]");
return Array.isArray(value) ? value : [];
} catch {
return [];
}
};

const normalizeProduct = (product) => {
const image =
product.image ||
product.image_url ||
product.imageUrl ||
product.product_image ||
"";

const resolvedImage =
image &&
!image.startsWith("http://") &&
!image.startsWith("https://") &&
!image.startsWith("data:")
? `${API_BASE}/${image.replace(/^\/+/, "")}`
: image;

const price = Number(product.price ?? product.selling_price ?? 0);

const oldPrice = Number(
product.oldPrice ??
product.old_price ??
product.original_price ??
product.mrp ??
0
);

const discount =
oldPrice > price && oldPrice > 0
? `${Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF`
: product.discount || "";

return {
...product,
id: product.id,
name:
product.name ||
product.title ||
product.product_name ||
"Zinora Jewellery",
description: product.description || "",
price,
oldPrice,
discount,
rating: Number(product.rating || 0),
reviews: Number(product.reviews || 0),
image: resolvedImage,
};
};

function Wishlist() {
const [products, setProducts] = useState(() =>
readStorage("zinoraWishlist").map(normalizeProduct)
);

const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("success");

// Load wishlist from localStorage.
const loadWishlist = useCallback(() => {
const savedProducts = readStorage("zinoraWishlist");
setProducts(savedProducts.map(normalizeProduct));
}, []);

useEffect(() => {
loadWishlist();


// Refresh when the user returns to this tab/page.
const handleFocus = () => loadWishlist();

const handleVisibility = () => {
  if (document.visibilityState === "visible") {
    loadWishlist();
  }
};

// The storage event also handles updates from another browser tab.
const handleStorage = (event) => {
  if (!event.key || event.key === "zinoraWishlist") {
    loadWishlist();
  }
};

window.addEventListener("focus", handleFocus);
window.addEventListener("storage", handleStorage);
document.addEventListener("visibilitychange", handleVisibility);

return () => {
  window.removeEventListener("focus", handleFocus);
  window.removeEventListener("storage", handleStorage);
  document.removeEventListener(
    "visibilitychange",
    handleVisibility
  );
};


}, [loadWishlist]);

const showMessage = (text, type = "success") => {
setMessage(text);
setMessageType(type);
};

// Remove product from wishlist and update localStorage.
const removeProduct = (id) => {
const updated = readStorage("zinoraWishlist").filter(
(product) => String(product.id) !== String(id)
);


localStorage.setItem("zinoraWishlist", JSON.stringify(updated));

setProducts(updated.map(normalizeProduct));

showMessage("Product removed from your wishlist.");


};

// Add product to shopping cart.
const moveToBag = (product) => {
try {
const existingBag = readStorage("zinoraCart");


  const existingIndex = existingBag.findIndex(
    (item) => String(item.id) === String(product.id)
  );

  let updatedBag;

  if (existingIndex !== -1) {
    updatedBag = existingBag.map((item, index) =>
      index === existingIndex
        ? {
            ...item,
            quantity: Number(item.quantity || 1) + 1,
          }
        : item
    );
  } else {
    updatedBag = [
      ...existingBag,
      {
        ...product,
        quantity: 1,
      },
    ];
  }

  // Save cart.
  localStorage.setItem(
    "zinoraCart",
    JSON.stringify(updatedBag)
  );

  // Remove from wishlist after adding to cart.
  const updatedWishlist = readStorage("zinoraWishlist").filter(
    (item) => String(item.id) !== String(product.id)
  );

  localStorage.setItem(
    "zinoraWishlist",
    JSON.stringify(updatedWishlist)
  );

  setProducts(updatedWishlist.map(normalizeProduct));

  showMessage("Product added to your shopping bag!");
} catch (error) {
  console.error("Unable to update cart:", error);
  showMessage("Unable to update your bag. Please try again.", "error");
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
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={product.id}
          >
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
                {product.image ? (
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                    sx={{
                      height: 270,
                      objectFit: "contain",
                      backgroundColor: "#f1ece7",
                      p: 1,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 270,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      p: 2,
                      backgroundColor: "#f1ece7",
                      color: "#887878",
                    }}
                  >
                    <Typography variant="body2">
                      Product image not available
                    </Typography>
                  </Box>
                )}

                {product.discount && (
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
                )}

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
                {product.rating > 0 && (
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
                )}

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

                {product.description && (
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
                )}

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

                  {product.oldPrice > product.price && (
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "#999",
                        textDecoration: "line-through",
                      }}
                    >
                      ₹{product.oldPrice.toLocaleString("en-IN")}
                    </Typography>
                  )}
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
            <Typography sx={{ fontSize: 28, color: "#98721b" }}>
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

  {/* FEEDBACK MESSAGE */}
  {message && (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1500,
        width: { xs: "90%", sm: "auto" },
        maxWidth: 450,
      }}
    >
      <Alert
        severity={messageType}
        onClose={() => setMessage("")}
        variant="filled"
      >
        {message}
      </Alert>
    </Box>
  )}
</Box>


);
}

export default Wishlist;
