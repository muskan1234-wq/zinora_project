import React, { useEffect, useState } from "react";
import {
Box,
Container,
Typography,
Grid,
Card,
CardMedia,
CardContent,
Button,
CircularProgress,
Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Topbar from "./components/Topbar";

const PRODUCTS_API = "http://127.0.0.1:8000/api/products/";

function Home() {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const navigate = useNavigate();

useEffect(() => {
const fetchProducts = async () => {
try {
setLoading(true);
setError("");


    const response = await fetch(PRODUCTS_API);

    if (!response.ok) {
      throw new Error("Products load nahi ho paaye.");
    }

    const data = await response.json();

    const productList = Array.isArray(data)
      ? data
      : data.results || [];

    // Website par sirf active products dikhaye jayenge.
    setProducts(productList.filter((product) => product.is_active));
  } catch (err) {
    console.error("Product fetch error:", err);
    setError(
      "Products load nahi ho rahe. Django backend check karke dobara try karein."
    );
  } finally {
    setLoading(false);
  }
};

fetchProducts();


}, []);

const formatPrice = (price) =>
Number(price || 0).toLocaleString("en-IN", {
style: "currency",
currency: "INR",
maximumFractionDigits: 2,
});

return (
<> <Topbar />


  <Box sx={{ bgcolor: "#fffaf7", minHeight: "100vh", pb: 6 }}>
    {/* Hero Section */}
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 5, md: 8 },
        px: 2,
        bgcolor: "#650c20",
        color: "#fff",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 2,
          fontSize: { xs: "2rem", md: "3rem" },
        }}
      >
        Discover Zinora
      </Typography>

      <Typography sx={{ fontSize: { xs: 14, md: 18 } }}>
        Elegant Jewellery for Every Special Moment
      </Typography>

      <Button
        variant="contained"
        onClick={() =>
          document
            .getElementById("zinora-products")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        sx={{
          mt: 3,
          bgcolor: "#c5a059",
          color: "#fff",
          fontWeight: 700,
          px: 4,
          "&:hover": { bgcolor: "#ad8643" },
        }}
      >
        Explore Collection
      </Button>
    </Box>

    {/* Products Section */}
    <Container id="zinora-products" maxWidth="xl" sx={{ mt: 6 }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          color: "#650c20",
          fontWeight: 700,
          mb: 1,
        }}
      >
        Our Collection
      </Typography>

      <Typography
        sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}
      >
        Discover jewellery added to our collection.
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#650c20" }} />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && products.length === 0 && (
        <Alert severity="info">
          Abhi koi active product available nahi hai. Admin Dashboard se
          product add karein aur uska status Active rakhein.
        </Alert>
      )}

      {!loading && !error && products.length > 0 && (
        <Grid container spacing={3}>
          {products.map((product) => {
            const imageUrl = product.image_url || product.image;

            return (
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
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {imageUrl ? (
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt={product.name}
                      sx={{
                        height: 260,
                        objectFit: "contain",
                        bgcolor: "#fff",
                        p: 1,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 260,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#f3eeee",
                      }}
                    >
                      <Typography color="text.secondary">
                        No image available
                      </Typography>
                    </Box>
                  )}

                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#650c20",
                        mb: 1,
                      }}
                    >
                      {product.name}
                    </Typography>

                    {product.category_name && (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mb: 1 }}
                      >
                        {product.category_name}
                      </Typography>
                    )}

                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#222",
                      }}
                    >
                      {formatPrice(product.price)}
                    </Typography>

                    {Number(product.original_price) >
                      Number(product.price) && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          textDecoration: "line-through",
                        }}
                      >
                        {formatPrice(product.original_price)}
                      </Typography>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        // Abhi product card ka basic action hai.
                        // Baad mein ise product details/cart se connect kar sakte hain.
                        navigate("/products");
                      }}
                      sx={{
                        mt: 2,
                        bgcolor: "#650c20",
                        "&:hover": { bgcolor: "#4d0918" },
                      }}
                    >
                      View Product
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  </Box>
</>


);
}

export default Home;
