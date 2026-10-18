
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";

/* =========================================================
   THEME
========================================================= */

const MAROON = "#641526";
const DARK_MAROON = "#45101D";
const GOLD = "#B89556";
const CREAM = "#FBF7F1";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const PRODUCTS_API = `${API_BASE}/api/products/`;

const PRODUCT_STORAGE_KEY = "zinoraProducts";
const WISHLIST_STORAGE_KEY = "zinoraWishlist";
const CART_STORAGE_KEY = "zinoraCart";

/*
  Existing website categories.
  Products belonging to these categories will not appear
  on the Other Products page.
*/

const KNOWN_CATEGORIES = [
  "necklace",
  "necklaces",
  "necklaces & chokers",
  "choker",
  "chokers",

  "earring",
  "earrings",
  "earrings & jhumkas",
  "jhumka",
  "jhumkas",

  "ring",
  "rings",
  "rings & pendants",
  "pendant",
  "pendants",

  "bangle",
  "bangles",
  "bangles & kadas",
  "kada",
  "kadas",

  "bridal",
  "bridal & festive",
  "bridal jewellery",
  "bridal jewelry",
  "festive",

  "offers",
  "offer",
  "budget",
  "under ₹199",
  "under ₹299",
  "under 199",
  "under 299",

  "new arrivals",
  "new arrival",
];

/* =========================================================
   HELPERS
========================================================= */

const normalizeCategory = (category) =>
  String(category ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const isOtherCategory = (category) => {
  const normalized = normalizeCategory(category);

  /*
    Products with no category are treated as Other Products.
  */

  if (!normalized) return true;

  /*
    Admin can explicitly select Other Products.
  */

  if (
    [
      "other",
      "others",
      "other product",
      "other products",
    ].includes(normalized)
  ) {
    return true;
  }

  /*
    If the category is not part of the existing website
    categories, the product belongs to Other Products.
  */

  return !KNOWN_CATEGORIES.includes(normalized);
};

const getProductId = (product) =>
  String(
    product?.id ??
      product?.product_id ??
      product?._id ??
      product?.slug ??
      product?.name ??
      product?.product_name ??
      ""
  );

const getProductName = (product) =>
  product?.name ||
  product?.product_name ||
  product?.title ||
  "Zinora Product";

const getProductPrice = (product) =>
  Number(
    product?.price ??
      product?.selling_price ??
      product?.sale_price ??
      0
  );

const getOriginalPrice = (product) =>
  Number(
    product?.originalPrice ??
      product?.original_price ??
      product?.old_price ??
      product?.mrp ??
      0
  );

const getProductCategory = (product) => {
  const category = product?.category;

  if (typeof category === "string") {
    return category;
  }

  if (category && typeof category === "object") {
    return (
      category.name ||
      category.title ||
      category.category_name ||
      ""
    );
  }

  return (
    product?.category_name ||
    product?.categoryName ||
    product?.category_title ||
    ""
  );
};

const getImageUrl = (value) => {
  if (!value) return "";

  let image = value;

  if (typeof image === "object") {
    image = image.url || image.image || image.src || "";
  }

  if (typeof image !== "string" || !image.trim()) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return `${API_BASE}/${image.replace(/^\/+/, "")}`;
};

const getProductImage = (product) => {
  const image =
    product?.image ||
    product?.image_url ||
    product?.imageUrl ||
    product?.product_image ||
    product?.thumbnail ||
    (Array.isArray(product?.images) ? product.images[0] : "");

  return getImageUrl(image);
};

const getProductDescription = (product) =>
  product?.description ||
  product?.short_description ||
  product?.desc ||
  "";

const isProductActive = (product) => {
  if (product?.is_active === false) return false;
  if (product?.active === false) return false;

  if (
    typeof product?.status === "string" &&
    ["inactive", "disabled", "draft"].includes(
      product.status.toLowerCase()
    )
  ) {
    return false;
  }

  return true;
};

const getResponseProducts = (data) => {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const readLocalProducts = () => {
  try {
    const stored = JSON.parse(
      localStorage.getItem(PRODUCT_STORAGE_KEY) || "[]"
    );

    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const readWishlist = () => {
  try {
    const stored = JSON.parse(
      localStorage.getItem(WISHLIST_STORAGE_KEY) || "[]"
    );

    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const readCart = () => {
  try {
    const stored = JSON.parse(
      localStorage.getItem(CART_STORAGE_KEY) || "[]"
    );

    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

/* =========================================================
   COMPONENT
========================================================= */

export default function OtherProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState([]);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================================================
     NOTIFICATION
  ========================================================= */

  const showMessage = useCallback(
    (message, severity = "success") => {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  /* =========================================================
     LOAD PRODUCTS FROM DJANGO
  ========================================================= */

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setApiError("");

    try {
      const response = await fetch(PRODUCTS_API);

      if (!response.ok) {
        throw new Error(
          `Products API returned status ${response.status}`
        );
      }

      const data = await response.json();

      const backendProducts = getResponseProducts(data);

      /*
        Backend is the primary source of product information.
        Do not append demo products or merge stale local products
        into the backend response.
      */

      const activeProducts = backendProducts.filter(isProductActive);

      /*
        Remove duplicate IDs in the API response.
      */

      const uniqueProducts = Array.from(
        new Map(
          activeProducts.map((product, index) => [
            getProductId(product) || `product-${index}`,
            product,
          ])
        ).values()
      );

      setProducts(uniqueProducts);

      /*
        Keep the local fallback store updated for other components
        that still use zinoraProducts.
      */

      try {
        localStorage.setItem(
          PRODUCT_STORAGE_KEY,
          JSON.stringify(uniqueProducts)
        );
      } catch {
        // Backend products still work if localStorage is unavailable.
      }
    } catch (error) {
      console.error("Products API error:", error);

      /*
        If the backend is unavailable, use previously stored products
        rather than showing fake demo products.
      */

      const localProducts = readLocalProducts().filter(isProductActive);

      setProducts(localProducts);

      setApiError(
        localProducts.length > 0
          ? "Backend unavailable. Showing previously saved products."
          : "Could not connect to the products backend. Please start Django and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================================================
     INITIAL LOAD + UPDATE LISTENERS
  ========================================================= */

  useEffect(() => {
    loadProducts();
    setWishlist(readWishlist());

    /*
      Same-tab events:
      Admin dashboard can dispatch these after creating,
      updating or deleting a product.
    */

    const handleProductsUpdated = () => {
      loadProducts();
    };

    /*
      Existing Zinora cart updates.
    */

    const handleCartUpdated = () => {
      // The cart page can listen to zinoraCartUpdated.
    };

    /*
      Other tabs:
      Storage events fire in other tabs when localStorage changes.
    */

    const handleStorage = (event) => {
      if (
        event.key === PRODUCT_STORAGE_KEY ||
        event.key === WISHLIST_STORAGE_KEY
      ) {
        if (event.key === PRODUCT_STORAGE_KEY) {
          loadProducts();
        }

        if (event.key === WISHLIST_STORAGE_KEY) {
          setWishlist(readWishlist());
        }
      }
    };

    window.addEventListener(
      "zinoraProductsUpdated",
      handleProductsUpdated
    );

    window.addEventListener(
      "zinoraCartUpdated",
      handleCartUpdated
    );

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "zinoraProductsUpdated",
        handleProductsUpdated
      );

      window.removeEventListener(
        "zinoraCartUpdated",
        handleCartUpdated
      );

      window.removeEventListener("storage", handleStorage);
    };
  }, [loadProducts]);

  /* =========================================================
     FILTER OTHER PRODUCTS
  ========================================================= */

  const otherProducts = useMemo(() => {
    return products.filter((product) => {
      const category = getProductCategory(product);

      return isOtherCategory(category);
    });
  }, [products]);

  /* =========================================================
     SEARCH + SORT
  ========================================================= */

  const visibleProducts = useMemo(() => {
    let result = otherProducts.filter((product) => {
      const query = search.trim().toLowerCase();

      if (!query) return true;

      const name = getProductName(product).toLowerCase();
      const category = getProductCategory(product).toLowerCase();
      const description = getProductDescription(product).toLowerCase();

      return (
        name.includes(query) ||
        category.includes(query) ||
        description.includes(query)
      );
    });

    if (sortBy === "price-low") {
      result = [...result].sort(
        (a, b) => getProductPrice(a) - getProductPrice(b)
      );
    } else if (sortBy === "price-high") {
      result = [...result].sort(
        (a, b) => getProductPrice(b) - getProductPrice(a)
      );
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) =>
        getProductName(a).localeCompare(getProductName(b))
      );
    }

    return result;
  }, [otherProducts, search, sortBy]);

  /* =========================================================
     WISHLIST
  ========================================================= */

  const toggleWishlist = (product) => {
    const id = getProductId(product);
    const current = readWishlist();

    const exists = current.some((item) => {
      const itemId =
        typeof item === "object" && item !== null
          ? getProductId(item)
          : String(item);

      return itemId === id;
    });

    let updated;

    if (exists) {
      updated = current.filter((item) => {
        const itemId =
          typeof item === "object" && item !== null
            ? getProductId(item)
            : String(item);

        return itemId !== id;
      });

      showMessage("Product wishlist se remove ho gaya.");
    } else {
      updated = [...current, product];

      showMessage("Product wishlist mein add ho gaya.");
    }

    try {
      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(updated)
      );

      setWishlist(
        updated.map((item) =>
          typeof item === "object" && item !== null
            ? getProductId(item)
            : String(item)
        )
      );

      window.dispatchEvent(new Event("zinoraWishlistUpdated"));
    } catch {
      showMessage("Wishlist browser storage mein save nahi ho paayi.", "error");
    }
  };

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const addToCart = (product) => {
    const id = getProductId(product);

    if (!id) {
      showMessage("Product ID missing hai. Backend product check karein.", "error");
      return;
    }

    try {
      const cart = readCart();

      const existingIndex = cart.findIndex(
        (item) => getProductId(item) === id
      );

      const cartProduct = {
        ...product,
        id: product.id ?? product.product_id ?? id,
        name: getProductName(product),
        price: getProductPrice(product),
        image: getProductImage(product),
      };

      if (existingIndex >= 0) {
        cart[existingIndex] = {
          ...cart[existingIndex],
          quantity: Number(cart[existingIndex].quantity || 1) + 1,
        };
      } else {
        cart.push({
          ...cartProduct,
          quantity: 1,
        });
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

      window.dispatchEvent(new Event("zinoraCartUpdated"));

      window.dispatchEvent(
        new CustomEvent("zinora:add-to-cart", {
          detail: cartProduct,
        })
      );

      showMessage("Product cart mein add ho gaya.");
    } catch (error) {
      console.error("Cart error:", error);

      showMessage("Product cart mein add nahi ho paaya.", "error");
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: CREAM,
        pb: 8,
      }}
    >
      {/* HERO */}

      <Box
        sx={{
          background: `linear-gradient(120deg, ${DARK_MAROON}, ${MAROON})`,
          color: "#fff",
          py: { xs: 6, md: 9 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              color: "#E6CB94",
              letterSpacing: 4,
              fontSize: 12,
              fontWeight: 700,
              mb: 2,
            }}
          >
            DISCOVER SOMETHING DIFFERENT
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: { xs: 36, md: 58 },
              fontWeight: 500,
              mb: 2,
            }}
          >
            Other Products
          </Typography>

          <Typography
            sx={{
              maxWidth: 580,
              mx: "auto",
              color: "#F4E8E5",
              lineHeight: 1.9,
              fontSize: { xs: 14, md: 16 },
            }}
          >
            Explore unique jewellery and accessories that add a special
            touch to every occasion.
          </Typography>

          <Box
            sx={{
              width: 65,
              height: 2,
              bgcolor: GOLD,
              mx: "auto",
              mt: 3,
            }}
          />
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pt: 5 }}>
        {/* ERROR MESSAGE */}

        {apiError && (
          <Alert
            severity={products.length ? "warning" : "error"}
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={loadProducts}
              >
                Retry
              </Button>
            }
          >
            {apiError}
          </Alert>
        )}

        {/* HEADING + SEARCH */}

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              sx={{
                color: MAROON,
                fontSize: 26,
                fontFamily: "Georgia, serif",
                fontWeight: 600,
              }}
            >
              Curated For You
            </Typography>

            <Typography
              sx={{
                color: "#777",
                mt: 0.5,
                fontSize: 14,
              }}
            >
              {loading
                ? "Loading products..."
                : `${visibleProducts.length} products to explore`}
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <TextField
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              size="small"
              sx={{
                minWidth: { xs: "100%", sm: 240 },
                bgcolor: "#fff",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "&.Mui-focused fieldset": {
                    borderColor: MAROON,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: MAROON }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              size="small"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              sx={{
                minWidth: 180,
                bgcolor: "#fff",
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: MAROON,
                },
              }}
              aria-label="Sort products"
            >
              <MenuItem value="featured">Featured</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="name">Name: A to Z</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        {/* LOADING */}

        {loading && products.length === 0 ? (
          <Box
            sx={{
              py: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: MAROON }} />

            <Typography sx={{ color: "#777", fontSize: 13 }}>
              Loading products from the backend...
            </Typography>
          </Box>
        ) : visibleProducts.length > 0 ? (
          /* PRODUCT GRID */

          <Grid container spacing={3}>
            {visibleProducts.map((product, index) => {
              const id = getProductId(product) || `product-${index}`;

              const productName = getProductName(product);
              const price = getProductPrice(product);
              const originalPrice = getOriginalPrice(product);
              const image = getProductImage(product);
              const category = getProductCategory(product);

              const isWishlisted = wishlist.includes(id);

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={id}
                >
                  <Card
                    sx={{
                      height: "100%",
                      position: "relative",
                      borderRadius: 1,
                      boxShadow: "0 5px 24px rgba(69,16,29,0.07)",
                      transition: "all .3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow:
                          "0 12px 30px rgba(69,16,29,0.15)",
                      },
                    }}
                  >
                    {/* IMAGE */}

                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {image ? (
                        <CardMedia
                          component="img"
                          image={image}
                          alt={productName}
                          sx={{
                            height: { xs: 280, md: 320 },
                            objectFit: "cover",
                            bgcolor: "#F0E8E0",
                            transition: "transform .4s ease",
                            "&:hover": {
                              transform: "scale(1.04)",
                            },
                          }}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";

                            const parent = event.currentTarget.parentElement;

                            if (parent && !parent.querySelector(".image-error")) {
                              const fallback = document.createElement("div");

                              fallback.className = "image-error";
                              fallback.textContent = "Product image unavailable";
                              fallback.style.height = "320px";
                              fallback.style.display = "flex";
                              fallback.style.alignItems = "center";
                              fallback.style.justifyContent = "center";
                              fallback.style.background = "#F0E8E0";
                              fallback.style.color = MAROON;
                              fallback.style.fontSize = "13px";

                              parent.prepend(fallback);
                            }
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: { xs: 280, md: 320 },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            p: 2,
                            bgcolor: "#F0E8E0",
                            color: MAROON,
                            fontSize: 13,
                          }}
                        >
                          Product image unavailable
                        </Box>
                      )}

                      {/* WISHLIST */}

                      <IconButton
                        aria-label={
                          isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        onClick={() => toggleWishlist(product)}
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          bgcolor: "#fff",
                          color: isWishlisted ? MAROON : "#777",
                          "&:hover": {
                            bgcolor: "#F7E9EC",
                            color: MAROON,
                          },
                        }}
                      >
                        {isWishlisted ? (
                          <FavoriteIcon sx={{ color: MAROON }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>

                      {/* CATEGORY */}

                      <Chip
                        label={category || "Other Products"}
                        size="small"
                        sx={{
                          position: "absolute",
                          left: 12,
                          top: 12,
                          bgcolor: "#FFFCF6",
                          color: MAROON,
                          fontWeight: 600,
                          maxWidth: "70%",
                        }}
                      />
                    </Box>

                    {/* DETAILS */}

                    <CardContent
                      sx={{
                        p: 2.5,
                        display: "flex",
                        flexDirection: "column",
                        height: "calc(100% - 320px)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#777",
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: 1.2,
                          mb: 1,
                        }}
                      >
                        ZINORA COLLECTION
                      </Typography>

                      <Typography
                        sx={{
                          color: "#321B20",
                          fontWeight: 600,
                          fontSize: 16,
                          mb: 1,
                          minHeight: 24,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {productName}
                      </Typography>

                      {getProductDescription(product) && (
                        <Typography
                          sx={{
                            color: "#777",
                            fontSize: 12,
                            lineHeight: 1.6,
                            mb: 1.5,
                          }}
                        >
                          {getProductDescription(product)}
                        </Typography>
                      )}

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ mb: 2, mt: "auto", flexWrap: "wrap" }}
                      >
                        <Typography
                          sx={{
                            color: MAROON,
                            fontSize: 19,
                            fontWeight: 700,
                          }}
                        >
                          ₹{price.toLocaleString("en-IN")}
                        </Typography>

                        {originalPrice > price && (
                          <Typography
                            sx={{
                              color: "#999",
                              textDecoration: "line-through",
                              fontSize: 13,
                            }}
                          >
                            ₹{originalPrice.toLocaleString("en-IN")}
                          </Typography>
                        )}
                      </Stack>

                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingBagOutlinedIcon />}
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => addToCart(product)}
                        sx={{
                          py: 1.2,
                          bgcolor: MAROON,
                          color: "#fff",
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 1,
                          "&:hover": {
                            bgcolor: DARK_MAROON,
                          },
                        }}
                      >
                        Add to Bag
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          /* EMPTY STATE */

          <Box
            sx={{
              textAlign: "center",
              py: 9,
              px: 2,
              bgcolor: "#fff",
              border: "1px solid #EEE2D5",
              borderRadius: 2,
            }}
          >
            <ShoppingBagOutlinedIcon
              sx={{
                fontSize: 55,
                color: GOLD,
                mb: 2,
              }}
            />

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                color: MAROON,
                fontSize: 25,
                mb: 1,
              }}
            >
              No products found
            </Typography>

            <Typography
              sx={{
                color: "#777",
                mb: 3,
              }}
            >
              {search
                ? "Try another search."
                : "New products that do not belong to your existing categories will appear here."}
            </Typography>

            {search && (
              <Button
                variant="outlined"
                onClick={() => setSearch("")}
                sx={{
                  color: MAROON,
                  borderColor: MAROON,
                  textTransform: "none",
                }}
              >
                Clear Search
              </Button>
            )}
          </Box>
        )}

        {/* FOOTER NOTE */}

       
      </Container>

      {/* NOTIFICATION */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
