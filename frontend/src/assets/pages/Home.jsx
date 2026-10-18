import React, { useEffect, useMemo, useState } from "react";
import {
Alert,
Box,
Button,
Card,
CardContent,
CardMedia,
Chip,
CircularProgress,
Container,
Divider,
IconButton,
Rating,
Snackbar,
Typography,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StarIcon from "@mui/icons-material/Star";

import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

const PRODUCTS_API = `${API_BASE}/api/products/`;
const CATEGORIES_API = `${API_BASE}/api/products/categories/`;

const GOLD = "#c5a04d";
const MAROON = "#680b18";
const DARK_MAROON = "#35040a";
const CREAM = "#fffdfb";

function readLocalStorage(key, fallback = []) {
try {
const value = localStorage.getItem(key);
return value ? JSON.parse(value) : fallback;
} catch {
return fallback;
}
}

function resolveImageUrl(image) {
if (!image) return "";

if (
image.startsWith("http://") ||
image.startsWith("https://") ||
image.startsWith("data:")
) {
return image;
}

return `${API_BASE}/${image.replace(/^\/+/, "")}`;
}

function getCategoryPath(category) {
const value = String(
category?.slug || category?.name || category?.category_name || ""
)
.toLowerCase()
.replace(/&/g, " and ")
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");

if (value.includes("earring") || value.includes("jhumka")) {
return "/earrings";
}

if (value.includes("necklace") || value.includes("choker")) {
return "/necklaces";
}

if (value.includes("bangle") || value.includes("kada")) {
return "/bangles";
}

if (value.includes("ring") || value.includes("pendant")) {
return "/rings";
}

if (value.includes("bridal") || value.includes("festive")) {
return "/bridal-festive";
}

if (value.includes("offer")) {
return "/offers";
}

if (value.includes("new-arrival")) {
return "/new-arrivals";
}

return `/category/${category?.slug || value}`;
}

function formatPrice(price) {
return Number(price || 0).toLocaleString("en-IN", {
maximumFractionDigits: 2,
});
}

function Home() {
const navigate = useNavigate();

const [apiProducts, setApiProducts] = useState([]);
const [categories, setCategories] = useState([]);

const [productsLoading, setProductsLoading] = useState(true);
const [categoriesLoading, setCategoriesLoading] = useState(true);

const [productsError, setProductsError] = useState("");
const [categoriesError, setCategoriesError] = useState("");

const [activeTrending, setActiveTrending] = useState("All");

const [wishlist, setWishlist] = useState(() =>
readLocalStorage("zinoraWishlist")
);

const [snackbar, setSnackbar] = useState({
open: false,
message: "",
severity: "success",
});

// Fetch products from Django.
useEffect(() => {
let cancelled = false;


const fetchProducts = async () => {
  try {
    setProductsLoading(true);
    setProductsError("");

    const response = await fetch(PRODUCTS_API);

    if (!response.ok) {
      throw new Error(`Product API error: ${response.status}`);
    }

    const data = await response.json();

    const productList = Array.isArray(data)
      ? data
      : Array.isArray(data.results)
      ? data.results
      : [];

    const normalizedProducts = productList
      .filter((product) => product.is_active !== false)
      .map((product, index) => ({
        ...product,

        id: product.id ?? `product-${index}`,

        title:
          product.name ||
          product.title ||
          product.product_name ||
          "Zinora Jewellery",

        category:
          product.category_name ||
          (typeof product.category === "string"
            ? product.category
            : "Other"),

        price: Number(
          product.price ?? product.selling_price ?? 0
        ),

        oldPrice: Number(
          product.original_price ??
            product.old_price ??
            product.mrp ??
            0
        ),

        image: resolveImageUrl(
          product.image_url || product.image || product.product_image
        ),

        rating: Number(product.rating || 0),
        reviews: Number(product.reviews || 0),

        badge: product.is_new_arrival
          ? "NEW ARRIVAL"
          : product.is_featured
          ? "FEATURED"
          : "",
      }));

    if (!cancelled) {
      setApiProducts(normalizedProducts);
    }
  } catch (error) {
    console.error("Product API error:", error);

    if (!cancelled) {
      setProductsError(
        "Products load nahi ho rahe. Django backend aur Product API check karein."
      );
    }
  } finally {
    if (!cancelled) {
      setProductsLoading(false);
    }
  }
};

fetchProducts();

return () => {
  cancelled = true;
};


}, []);

// Fetch categories from Django.
useEffect(() => {
let cancelled = false;


const fetchCategories = async () => {
  try {
    setCategoriesLoading(true);
    setCategoriesError("");

    const response = await fetch(CATEGORIES_API);

    if (!response.ok) {
      throw new Error(`Category API error: ${response.status}`);
    }

    const data = await response.json();

    const categoryList = Array.isArray(data)
      ? data
      : Array.isArray(data.results)
      ? data.results
      : [];

    const normalizedCategories = categoryList
      .filter((category) => category.is_active !== false)
      .map((category, index) => ({
        ...category,

        id: category.id ?? `category-${index}`,

        title:
          category.name ||
          category.title ||
          "Jewellery Collection",

        subtitle: category.description || "",

        image: resolveImageUrl(
          category.image_url || category.image || ""
        ),

        path: getCategoryPath(category),
      }));

    if (!cancelled) {
      setCategories(normalizedCategories);
    }
  } catch (error) {
    console.error("Category API error:", error);

    if (!cancelled) {
      setCategoriesError(
        "Categories load nahi ho rahi hain. Django Category API check karein."
      );
    }
  } finally {
    if (!cancelled) {
      setCategoriesLoading(false);
    }
  }
};

fetchCategories();

return () => {
  cancelled = true;
};


}, []);

const products = useMemo(() => apiProducts, [apiProducts]);

const trendingButtons = [
"All",
"Necklaces",
"Earrings",
"Bangles",
"Rings",
];

const filteredTrending = useMemo(() => {
if (activeTrending === "All") {
return products;
}


return products.filter((product) => {
  const category = String(product.category || "").toLowerCase();

  if (activeTrending === "Earrings") {
    return (
      category.includes("earring") ||
      category.includes("jhumka")
    );
  }

  if (activeTrending === "Necklaces") {
    return (
      category.includes("necklace") ||
      category.includes("choker")
    );
  }

  if (activeTrending === "Bangles") {
    return (
      category.includes("bangle") ||
      category.includes("kada")
    );
  }

  if (activeTrending === "Rings") {
    return (
      category.includes("ring") ||
      category.includes("pendant")
    );
  }

  return category.includes(activeTrending.toLowerCase());
});


}, [products, activeTrending]);

const newArrivals = useMemo(
() => products.filter((product) => product.is_new_arrival),
[products]
);

const budgetProducts = useMemo(
() => products.filter((product) => product.price <= 299),
[products]
);

const offerProducts = useMemo(
() =>
products.filter(
(product) =>
product.oldPrice > product.price && product.price > 0
),
[products]
);

const showMessage = (message, severity = "success") => {
setSnackbar({
open: true,
message,
severity,
});
};

// Wishlist functionality.
const handleWishlist = (product) => {
const current = readLocalStorage("zinoraWishlist");


const exists = current.some(
  (item) => String(item.id) === String(product.id)
);

const updated = exists
  ? current.filter(
      (item) => String(item.id) !== String(product.id)
    )
  : [...current, product];

localStorage.setItem(
  "zinoraWishlist",
  JSON.stringify(updated)
);

setWishlist(updated);

showMessage(
  exists
    ? "Product removed from wishlist."
    : "Product added to wishlist."
);


};

const isWishlisted = (product) =>
wishlist.some(
(item) => String(item.id) === String(product.id)
);

// Add-to-cart functionality.
const handleAddToCart = (product) => {
const cart = readLocalStorage("zinoraCart");


const existingIndex = cart.findIndex(
  (item) => String(item.id) === String(product.id)
);

let updated;

if (existingIndex >= 0) {
  updated = cart.map((item, index) =>
    index === existingIndex
      ? {
          ...item,
          quantity: Number(item.quantity ?? 1) + 1,
        }
      : item
  );
} else {
  updated = [
    ...cart,
    {
      ...product,
      quantity: 1,
    },
  ];
}

localStorage.setItem("zinoraCart", JSON.stringify(updated));

showMessage("Product added to cart.");


};

// Reusable product card.
const ProductCard = ({ product }) => (
<Card
sx={{
height: "100%",
border: "1px solid #eee5df",
boxShadow: "none",
borderRadius: 2,
overflow: "hidden",
transition: "0.25s",


    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 25px rgba(80,20,20,0.12)",
    },
  }}
>
  <Box sx={{ position: "relative" }}>
    {product.image ? (
      <CardMedia
        component="img"
        image={product.image}
        alt={product.title}
        onError={(event) => {
          event.currentTarget.style.visibility = "hidden";
        }}
        sx={{
          height: { xs: 190, md: 240 },
          objectFit: "contain",
          bgcolor: "#fff",
          p: 1,
        }}
      />
    ) : (
      <Box
        sx={{
          height: { xs: 190, md: 240 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f7f2ee",
          color: "#777",
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          Product image not available
        </Typography>
      </Box>
    )}

    {product.badge && (
      <Chip
        label={product.badge}
        size="small"
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          bgcolor: MAROON,
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
        }}
      />
    )}

    <IconButton
      aria-label="Add to wishlist"
      onClick={() => handleWishlist(product)}
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        bgcolor: "#fff",

        "&:hover": {
          bgcolor: "#f8eeee",
        },
      }}
    >
      {isWishlisted(product) ? (
        <FavoriteIcon sx={{ color: MAROON }} />
      ) : (
        <FavoriteBorderIcon sx={{ color: MAROON }} />
      )}
    </IconButton>
  </Box>

  <CardContent sx={{ p: 2 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <StarIcon sx={{ fontSize: 16, color: GOLD }} />

      <Typography variant="caption">
        {product.rating > 0
          ? `${product.rating} rating`
          : "Jewellery Collection"}
      </Typography>
    </Box>

    <Typography
      sx={{
        color: MAROON,
        fontWeight: 700,
        mt: 1,
        minHeight: 42,
      }}
    >
      {product.title}
    </Typography>

    <Typography
      variant="caption"
      sx={{
        color: "#888",
        display: "block",
        mb: 1,
      }}
    >
      {product.category}
    </Typography>

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
      }}
    >
      <Typography sx={{ color: MAROON, fontWeight: 800 }}>
        ₹{formatPrice(product.price)}
      </Typography>

      {product.oldPrice > product.price && (
        <Typography
          variant="body2"
          sx={{
            color: "#999",
            textDecoration: "line-through",
          }}
        >
          ₹{formatPrice(product.oldPrice)}
        </Typography>
      )}
    </Box>

    <Button
      fullWidth
      variant="contained"
      startIcon={<ShoppingBagOutlinedIcon />}
      onClick={() => handleAddToCart(product)}
      sx={{
        mt: 2,
        bgcolor: MAROON,
        textTransform: "none",

        "&:hover": {
          bgcolor: DARK_MAROON,
        },
      }}
    >
      Add to Cart
    </Button>
  </CardContent>
</Card>


);

// Reusable product grid.
const renderProductGrid = (list, emptyMessage) => {
if (productsLoading) {
return (
<Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
<CircularProgress sx={{ color: MAROON }} /> </Box>
);
}


if (productsError) {
  return (
    <Alert severity="error" sx={{ my: 2 }}>
      {productsError}
    </Alert>
  );
}

if (list.length === 0) {
  return (
    <Typography
      sx={{
        py: 4,
        color: "#777",
        textAlign: "center",
      }}
    >
      {emptyMessage}
    </Typography>
  );
}

return (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "repeat(2, minmax(0, 1fr))",
        md: "repeat(4, minmax(0, 1fr))",
      },
      gap: 2,
    }}
  >
    {list.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </Box>
);


};

return (
<Box
sx={{
bgcolor: CREAM,
color: "#4d1717",
minHeight: "100vh",
overflow: "hidden",
}}
> 


  {/* HERO BANNER */}
  <Box
    sx={{
      background:
        "linear-gradient(135deg, #42050d 0%, #780b18 55%, #4e0610 100%)",
      color: "#fff",
      px: { xs: 2, md: 6 },
      py: { xs: 5, md: 8 },
      textAlign: { xs: "center", md: "left" },
    }}
  >
    <Container maxWidth="xl">
      <Chip
        label="THE ZINORA COLLECTION"
        size="small"
        sx={{
          bgcolor: GOLD,
          color: "#fff",
          fontWeight: 700,
          mb: 3,
        }}
      />

      <Typography
        sx={{
          fontFamily: "Georgia, serif",
          fontSize: { xs: 36, sm: 48, md: 60 },
          lineHeight: 1.15,
        }}
      >
        Jewellery That Makes
      </Typography>

      <Typography
        sx={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          color: "#f5ca70",
          fontSize: { xs: 38, sm: 52, md: 64 },
          lineHeight: 1.15,
        }}
      >
        Every Moment Shine
      </Typography>

      <Typography
        sx={{
          mt: 3,
          maxWidth: 600,
          mx: { xs: "auto", md: 0 },
          color: "#f5dfe2",
          lineHeight: 1.9,
        }}
      >
        Discover beautiful jewellery for weddings, celebrations
        and everyday elegance with Zinora.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "flex-start" },
          gap: 2,
          flexWrap: "wrap",
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() =>
            document
              .getElementById("zinora-products")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          sx={{
            bgcolor: "#f5ca50",
            color: "#5d0a13",
            fontWeight: 700,
            px: 3,

            "&:hover": {
              bgcolor: "#e7b93c",
            },
          }}
        >
          Shop Collection
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/offers")}
          sx={{
            color: "#fff",
            borderColor: "#e9c5c5",

            "&:hover": {
              borderColor: "#fff",
            },
          }}
        >
          Explore Offers
        </Button>
      </Box>

      <Divider sx={{ borderColor: "#a54a54", my: 4 }} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 2,
          textAlign: "center",
        }}
      >
        {[
          ["Elegant", "Designs"],
          ["Special", "Collections"],
          ["Easy", "Shopping"],
        ].map(([title, subtitle]) => (
          <Box key={title}>
            <Typography sx={{ color: "#f5ca50", fontWeight: 700 }}>
              {title}
            </Typography>

            <Typography variant="caption" sx={{ color: "#ead9dc" }}>
              {subtitle}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>

  {/* TRUST STRIP */}
  <Box
    sx={{
      bgcolor: DARK_MAROON,
      color: "#fff",
      px: 2,
      py: 2,
      display: "grid",
      gridTemplateColumns: {
        xs: "repeat(2, 1fr)",
        md: "repeat(4, 1fr)",
      },
      gap: 2,
      textAlign: "center",
    }}
  >
    {[
      "✦ Elegant Designs",
      "✦ Secure Shopping",
      "✦ Easy Order Tracking",
      "✦ Customer Support",
    ].map((item) => (
      <Typography key={item} variant="body2" fontWeight={600}>
        {item}
      </Typography>
    ))}
  </Box>

  {/* SHOP BY CATEGORY */}
  <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
    <Typography
      sx={{
        color: GOLD,
        fontSize: 12,
        letterSpacing: 2,
        textAlign: "center",
      }}
    >
      EXPLORE OUR COLLECTIONS
    </Typography>

    <Typography
      sx={{
        fontFamily: "Georgia, serif",
        color: MAROON,
        fontSize: { xs: 29, md: 38 },
        textAlign: "center",
        mt: 1,
      }}
    >
      Shop by Category
    </Typography>

    <Typography
      sx={{
        color: "#777",
        textAlign: "center",
        mt: 1,
        mb: 4,
      }}
    >
      Find the perfect piece for every style and occasion.
    </Typography>

    {categoriesLoading ? (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: MAROON }} />
      </Box>
    ) : categoriesError ? (
      <Alert severity="error">{categoriesError}</Alert>
    ) : categories.length === 0 ? (
      <Alert severity="info">
        Abhi koi active category available nahi hai. Admin Dashboard
        se category add karein.
      </Alert>
    ) : (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(6, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {categories.map((category) => (
          <Card
            key={category.id}
            onClick={() => navigate(category.path)}
            sx={{
              cursor: "pointer",
              borderRadius: 2,
              boxShadow: "none",
              border: "1px solid #eee5df",
              overflow: "hidden",
              transition: "0.25s",

              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 20px rgba(80,20,20,0.12)",
              },
            }}
          >
            {category.image ? (
              <CardMedia
                component="img"
                image={category.image}
                alt={category.title}
                sx={{
                  height: { xs: 140, md: 180 },
                  objectFit: "contain",
                  bgcolor: "#fff",
                  p: 1,
                }}
              />
            ) : (
              <Box
                sx={{
                  height: { xs: 140, md: 180 },
                  bgcolor: "#f7f2ee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {category.title}
                </Typography>
              </Box>
            )}

            <Box sx={{ p: 1.5, textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: MAROON,
                }}
              >
                {category.title}
              </Typography>

              {category.subtitle && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#888",
                    display: "block",
                    mt: 0.5,
                  }}
                >
                  {category.subtitle}
                </Typography>
              )}
            </Box>
          </Card>
        ))}
      </Box>
    )}
  </Container>

  {/* BUDGET COLLECTION */}
  <Box sx={{ bgcolor: "#f7f5f2", py: { xs: 5, md: 8 } }}>
    <Container maxWidth="xl">
      <Typography
        sx={{
          color: GOLD,
          fontSize: 12,
          letterSpacing: 2,
          textAlign: "center",
        }}
      >
        BEAUTY FOR EVERY BUDGET
      </Typography>

      <Typography
        sx={{
          fontFamily: "Georgia, serif",
          color: MAROON,
          fontSize: { xs: 29, md: 38 },
          textAlign: "center",
          mt: 1,
          mb: 4,
        }}
      >
        Luxury Within Your Reach
      </Typography>

      {renderProductGrid(
        budgetProducts,
        "Abhi ₹299 tak ke products available nahi hain."
      )}
    </Container>
  </Box>

  {/* TRENDING PRODUCTS */}
  <Container
    id="zinora-products"
    maxWidth="xl"
    sx={{ py: { xs: 5, md: 8 } }}
  >
    <Typography
      sx={{
        color: GOLD,
        fontSize: 12,
        letterSpacing: 2,
      }}
    >
      CUSTOMER FAVOURITES
    </Typography>

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        mb: 4,
      }}
    >
      <Typography
        sx={{
          fontFamily: "Georgia, serif",
          color: MAROON,
          fontSize: { xs: 27, md: 36 },
        }}
      >
        Trending Jewellery
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {trendingButtons.map((button) => (
          <Button
            key={button}
            onClick={() => setActiveTrending(button)}
            sx={{
              border: "1px solid #e5d9d2",
              borderRadius: 5,
              px: 2,
              color: activeTrending === button ? "#fff" : MAROON,
              bgcolor: activeTrending === button ? MAROON : "#fff",
              textTransform: "none",

              "&:hover": {
                bgcolor:
                  activeTrending === button ? DARK_MAROON : "#f7efeb",
              },
            }}
          >
            {button}
          </Button>
        ))}
      </Box>
    </Box>

    {renderProductGrid(
      filteredTrending,
      "Is category mein abhi koi active product available nahi hai."
    )}

    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Button
        variant="outlined"
        onClick={() => navigate("/new-arrivals")}
        endIcon={<ArrowForwardIcon />}
        sx={{
          color: MAROON,
          borderColor: MAROON,
          px: 4,
        }}
      >
        View New Arrivals
      </Button>
    </Box>
  </Container>

  {/* NEW ARRIVALS */}
  <Box sx={{ bgcolor: "#f7f5f2", py: { xs: 5, md: 8 } }}>
    <Container maxWidth="xl">
      <Typography
        sx={{
          color: GOLD,
          fontSize: 12,
          letterSpacing: 2,
        }}
      >
        JUST ADDED TO OUR COLLECTION
      </Typography>

      <Typography
        sx={{
          fontFamily: "Georgia, serif",
          color: MAROON,
          fontSize: { xs: 28, md: 36 },
          mt: 1,
          mb: 4,
        }}
      >
        New Arrivals
      </Typography>

      {renderProductGrid(
        newArrivals,
        "Abhi koi new arrival available nahi hai. Admin se product add karke New Arrival enable karein."
      )}
    </Container>
  </Box>

  {/* OFFERS */}
  <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
    <Box
      sx={{
        bgcolor: MAROON,
        color: "#fff",
        p: { xs: 3, md: 5 },
        borderRadius: 3,
        mb: 4,
      }}
    >
      <Chip
        label="SPECIAL COLLECTION"
        sx={{
          bgcolor: "#f5ca50",
          color: MAROON,
          fontWeight: 700,
        }}
      />

      <Typography
        sx={{
          fontFamily: "Georgia, serif",
          fontSize: { xs: 30, md: 42 },
          mt: 2,
        }}
      >
        Celebrate Every Occasion
      </Typography>

      <Typography sx={{ color: "#f5dfe2", mt: 1 }}>
        Explore jewellery offers and special prices from our collection.
      </Typography>
    </Box>

    <Typography
      sx={{
        fontFamily: "Georgia, serif",
        color: MAROON,
        fontSize: { xs: 28, md: 36 },
        mb: 4,
      }}
    >
      Special Offers
    </Typography>

    {renderProductGrid(
      offerProducts,
      "Abhi koi discounted product available nahi hai. Admin Dashboard mein original price aur selling price set karein."
    )}

    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Button
        variant="outlined"
        onClick={() => navigate("/offers")}
        endIcon={<ArrowForwardIcon />}
        sx={{
          color: MAROON,
          borderColor: MAROON,
          px: 4,
        }}
      >
        Explore Offers
      </Button>
    </Box>
  </Container>

  {/* WHY CHOOSE ZINORA */}
  <Box sx={{ bgcolor: MAROON, color: "#fff", py: 5 }}>
    <Container
      maxWidth="xl"
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        },
        gap: 4,
        textAlign: "center",
      }}
    >
      {[
        ["✦", "Thoughtful Designs", "Jewellery for your personal style"],
        ["♢", "Secure Shopping", "A simple and convenient experience"],
        ["♡", "Customer Support", "Help when you need it"],
      ].map(([icon, title, subtitle]) => (
        <Box key={title}>
          <Typography sx={{ color: "#f5ca50", fontSize: 32 }}>
            {icon}
          </Typography>

          <Typography sx={{ fontWeight: 700, mt: 1 }}>
            {title}
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
            {subtitle}
          </Typography>
        </Box>
      ))}
    </Container>
  </Box>

  {/* NEWSLETTER / COLLECTION CTA */}
  <Box sx={{ bgcolor: "#f6f3ef", py: { xs: 4, md: 5 } }}>
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 3,
      }}
    >
      <Box>
        <Typography
          sx={{
            color: GOLD,
            fontSize: 12,
            letterSpacing: 2,
          }}
        >
          EXCLUSIVE ZINORA UPDATES
        </Typography>

        <Typography
          sx={{
            color: MAROON,
            fontFamily: "Georgia, serif",
            fontSize: { xs: 26, md: 34 },
            mt: 1,
          }}
        >
          Discover Your Next Favourite
        </Typography>

        <Typography variant="body2" sx={{ color: "#777", mt: 1 }}>
          Explore new collections and jewellery inspiration.
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<ShoppingBagOutlinedIcon />}
        onClick={() => navigate("/new-arrivals")}
        sx={{
          bgcolor: MAROON,
          px: 3,
          py: 1.5,

          "&:hover": {
            bgcolor: DARK_MAROON,
          },
        }}
      >
        Explore New Arrivals
      </Button>
    </Container>
  </Box>

  {/* SNACKBAR FEEDBACK */}
  <Snackbar
    open={snackbar.open}
    autoHideDuration={3000}
    onClose={() =>
      setSnackbar((previous) => ({
        ...previous,
        open: false,
      }))
    }
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
  >
    <Alert
      severity={snackbar.severity}
      variant="filled"
      onClose={() =>
        setSnackbar((previous) => ({
          ...previous,
          open: false,
        }))
      }
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
</Box>


);
}

export default Home;
