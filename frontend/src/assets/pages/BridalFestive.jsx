import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Chip,
  CircularProgress,
  Snackbar,
  Rating,
  Paper,
} from "@mui/material";

import {
  FavoriteBorder,
  Favorite,
  ShoppingBagOutlined,
  CalendarMonthOutlined,
  VerifiedOutlined,
  SecurityOutlined,
  HandshakeOutlined,
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const PRODUCTS_API = `${API_BASE}/api/products/`;
const CATEGORIES_API = `${API_BASE}/api/products/categories/`;

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const getList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.products)) return response.products;
  if (Array.isArray(response?.categories)) return response.categories;

  return [];
};

const getImageUrl = (value) => {
  if (!value) return "";

  let image = value;

  if (typeof value === "object") {
    image = value.url || value.image || value.src || "";
  }

  if (typeof image !== "string" || !image.trim()) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return `${API_BASE}/${image.replace(/^\/+/, "")}`;
};

const getCategoryName = (category) => {
  if (!category) return "Uncategorized";

  if (typeof category === "string") return category;

  return category.name || category.title || "Uncategorized";
};

const getNumber = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      const number = Number(value);

      if (Number.isFinite(number)) {
        return number;
      }
    }
  }

  return 0;
};

const normalizeProduct = (item) => {
  const price = getNumber(
    item.price,
    item.selling_price,
    item.sale_price
  );

  const oldPrice = getNumber(
    item.old_price,
    item.original_price,
    item.mrp,
    item.compare_at_price
  );

  const discount = getNumber(
    item.discount_percentage,
    item.discount
  );

  const calculatedDiscount =
    oldPrice > price && oldPrice > 0
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  const imageValue =
    item.image ||
    item.image_url ||
    item.product_image ||
    item.thumbnail ||
    (Array.isArray(item.images) ? item.images[0] : "");

  return {
    id: item.id ?? item.pk ?? item.slug ?? item.name,
    name:
      item.name ||
      item.product_name ||
      item.title ||
      "Untitled Product",
    price,
    oldPrice,
    discount: discount || calculatedDiscount,
    rating: getNumber(item.rating, item.average_rating),
    reviews: getNumber(item.reviews, item.review_count),
    badge: item.badge || item.tag || item.label || "",
    image: getImageUrl(imageValue),
    category: getCategoryName(item.category || item.category_name),
    description:
      item.description ||
      item.short_description ||
      item.desc ||
      "",
    stock: getNumber(item.stock, item.stock_quantity, item.quantity),
    isActive: item.is_active !== false,
  };
};

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

/* =========================================================
   MAIN PAGE
========================================================= */

export default function BridalFestive() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("zinoraWishlist") || "[]");
    } catch {
      return [];
    }
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [visibleCount, setVisibleCount] = useState(8);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [productResult, categoryResult] = await Promise.allSettled([
        fetch(PRODUCTS_API),
        fetch(CATEGORIES_API),
      ]);

      if (productResult.status !== "fulfilled") {
        throw new Error("Product API could not be reached.");
      }

      const productResponse = productResult.value;

      if (!productResponse.ok) {
        throw new Error(
          `Products API returned status ${productResponse.status}.`
        );
      }

      const productJson = await productResponse.json();

      const normalizedProducts = getList(productJson)
        .map(normalizeProduct)
        .filter((product) => product.isActive);

      setProducts(normalizedProducts);

      if (categoryResult.status === "fulfilled") {
        const categoryResponse = categoryResult.value;

        if (categoryResponse.ok) {
          const categoryJson = await categoryResponse.json();

          setCategories(
            getList(categoryJson).filter(
              (category) => category.is_active !== false
            )
          );
        }
      }
    } catch (err) {
      setError(
        err.message ||
          "Products could not be loaded. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("zinoraWishlist", JSON.stringify(wishlist));
    } catch {
      // Continue even if browser storage is unavailable.
    }
  }, [wishlist]);

  /* =========================================================
     DYNAMIC CATEGORY OPTIONS
  ========================================================= */

  const categoryOptions = useMemo(() => {
    const names = [
      ...categories.map((category) => getCategoryName(category)),
      ...products.map((product) => product.category),
    ];

    const uniqueNames = [...new Set(names)]
      .map((name) => name.trim())
      .filter(
        (name) =>
          name &&
          name.toLowerCase() !== "uncategorized"
      );

    const relevantNames = uniqueNames.filter((name) =>
      /bridal|festive|wedding|kundan|polki|mathapatti|nath|jewellery|jewelry/i.test(
        name
      )
    );

    return relevantNames.length ? relevantNames : uniqueNames;
  }, [categories, products]);

  /* =========================================================
     FILTERING AND SORTING
  ========================================================= */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.some(
          (category) =>
            product.category.toLowerCase() === category.toLowerCase()
        )
      );
    }

    if (selectedPriceRanges.length > 0) {
      result = result.filter((product) =>
        selectedPriceRanges.some((range) => {
          if (range === "under999") return product.price < 1000;

          if (range === "1000-2499") {
            return product.price >= 1000 && product.price <= 2499;
          }

          if (range === "2500-5999") {
            return product.price >= 2500 && product.price <= 5999;
          }

          if (range === "6000plus") return product.price >= 6000;

          return true;
        })
      );
    }

    if (sortBy === "priceLow") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHigh") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategories, selectedPriceRanges, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  /* =========================================================
     FILTER HANDLERS
  ========================================================= */

  const toggleCategory = (category) => {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    );

    setVisibleCount(8);
  };

  const togglePriceRange = (range) => {
    setSelectedPriceRanges((previous) =>
      previous.includes(range)
        ? previous.filter((item) => item !== range)
        : [...previous, range]
    );

    setVisibleCount(8);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSortBy("featured");
    setVisibleCount(8);
  };

  /* =========================================================
     WISHLIST HANDLER
  ========================================================= */

  const toggleWishlist = (product) => {
    setWishlist((previous) => {
      const exists = previous.some(
        (item) => String(item.id) === String(product.id)
      );

      if (exists) {
        return previous.filter(
          (item) => String(item.id) !== String(product.id)
        );
      }

      return [
        ...previous,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
      ];
    });

    setNotification({
      open: true,
      message: "Wishlist updated.",
      severity: "success",
    });
  };

  /* =========================================================
     ADD TO BAG
  ========================================================= */

  const addToBag = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    // Allows an existing Zinora cart component to listen for this event.
    window.dispatchEvent(
      new CustomEvent("zinora:add-to-cart", {
        detail: cartItem,
      })
    );

    setNotification({
      open: true,
      message: `${product.name} selected for your bag.`,
      severity: "success",
    });
  };

  return (
    <Box
      sx={{
        background: "#fbf9f6",
        color: "#281a1a",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <HeroSection
        products={products}
        onExplore={() =>
          document
            .getElementById("bridal-products")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <CategoryTabs
        categories={categoryOptions}
        selectedCategories={selectedCategories}
        onSelect={toggleCategory}
        onClear={clearFilters}
      />

      <ShopSection
        loading={loading}
        error={error}
        products={visibleProducts}
        total={filteredProducts.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categoryOptions}
        selectedCategories={selectedCategories}
        selectedPriceRanges={selectedPriceRanges}
        toggleCategory={toggleCategory}
        togglePriceRange={togglePriceRange}
        clearFilters={clearFilters}
        wishlist={wishlist}
        onWishlist={toggleWishlist}
        onAddToBag={addToBag}
        onRetry={loadData}
        visibleCount={visibleCount}
        setVisibleCount={setVisibleCount}
      />

      <StylingSection setNotification={setNotification} />

      <Guarantees />

      <RoyalPrivileges setNotification={setNotification} />

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        onClose={() =>
          setNotification((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() =>
            setNotification((previous) => ({
              ...previous,
              open: false,
            }))
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/* =========================================================
   HERO
========================================================= */

function HeroSection({ products, onExplore }) {
  const heroProduct = products.find((product) => product.image);

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
        <Grid item xs={12} md={7}>
          <Box sx={{ maxWidth: 650 }}>
            <Chip
              label="✦ HANDCRAFTED ROYAL TROUSSEAU COLLECTION"
              size="small"
              sx={{
                mb: 2,
                background: "rgba(255,255,255,.12)",
                color: "#fed65b",
                border: "1px solid rgba(254,214,91,.35)",
                fontSize: 9,
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
                fontSize: { xs: 28, md: 42 },
                fontWeight: 600,
                mb: 2,
              }}
            >
              & Festive Heirlooms
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                lineHeight: 1.8,
                color: "#f2dddd",
                maxWidth: 590,
                mb: 3,
              }}
            >
              Discover bridal jewellery, traditional sets and festive
              statement pieces from the Zinora collection. Explore the
              products added by your administrator.
            </Typography>

            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              {[
                ["✦", "ROYAL COLLECTION", "Curated bridal styles"],
                ["◈", "FESTIVE EDIT", "Traditional elegance"],
                ["✓", "SHOP WITH EASE", "Explore your favourites"],
              ].map((item) => (
                <Grid item xs={12} sm={4} key={item[1]}>
                  <Box
                    sx={{
                      border: "1px solid rgba(255,255,255,.22)",
                      background: "rgba(255,255,255,.07)",
                      borderRadius: 1,
                      p: 1.4,
                      minHeight: 72,
                    }}
                  >
                    <Typography sx={{ color: "#fed65b", fontSize: 10 }}>
                      {item[0]} {item[1]}
                    </Typography>

                    <Typography sx={{ fontSize: 10, mt: 0.5 }}>
                      {item[2]}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              onClick={onExplore}
              sx={{
                background: "#fed65b",
                color: "#390009",
                textTransform: "none",
                fontWeight: 700,
                fontSize: 12,
                px: 2.5,
                "&:hover": { background: "#f7c93e" },
              }}
            >
              Explore Bridal Jewels ↓
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box
            sx={{
              position: "relative",
              maxWidth: 430,
              mx: "auto",
              minHeight: { xs: 320, md: 430 },
              borderRadius: 2,
              overflow: "hidden",
              background: "linear-gradient(145deg,#6b2631,#2b0007)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {heroProduct?.image ? (
              <Box
                component="img"
                src={heroProduct.image}
                alt={heroProduct.name}
                sx={{
                  width: "100%",
                  height: { xs: 320, md: 430 },
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <Box sx={{ textAlign: "center", p: 3 }}>
                <Typography sx={{ fontSize: 44, color: "#fed65b" }}>
                  ✦
                </Typography>
                <Typography sx={{ fontFamily: "Georgia, serif", fontSize: 24 }}>
                  Zinora
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#f2dddd", mt: 1 }}>
                  Upload product images through your backend.
                </Typography>
              </Box>
            )}

            {heroProduct && (
              <Paper
                elevation={0}
                sx={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  right: 12,
                  p: 1.5,
                  background: "rgba(255,255,255,.96)",
                }}
              >
                <Typography sx={{ fontSize: 9, color: "#777" }}>
                  ZINORA COLLECTION
                </Typography>

                <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                  {heroProduct.name}
                </Typography>

                <Typography
                  sx={{ fontSize: 12, fontWeight: 700, color: "#390009" }}
                >
                  {formatPrice(heroProduct.price)}
                </Typography>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

/* =========================================================
   CATEGORY TABS
========================================================= */

function CategoryTabs({
  categories,
  selectedCategories,
  onSelect,
  onClear,
}) {
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
      <Box sx={{ display: "flex", gap: 1, minWidth: "max-content" }}>
        <Button
          onClick={onClear}
          sx={{
            textTransform: "none",
            fontSize: 10,
            px: 1.5,
            borderRadius: 10,
            background:
              selectedCategories.length === 0 ? "#390009" : "#f7f5f2",
            color: selectedCategories.length === 0 ? "#fff" : "#554242",
            "&:hover": { background: "#eeeae6" },
          }}
        >
          All Bridal & Festive
        </Button>

        {categories.map((category) => {
          const selected = selectedCategories.includes(category);

          return (
            <Button
              key={category}
              onClick={() => onSelect(category)}
              sx={{
                textTransform: "none",
                fontSize: 10,
                px: 1.5,
                borderRadius: 10,
                background: selected ? "#390009" : "#f7f5f2",
                color: selected ? "#fff" : "#554242",
                "&:hover": { background: "#eeeae6" },
              }}
            >
              {category}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}

/* =========================================================
   SHOP SECTION
========================================================= */

function ShopSection({
  loading,
  error,
  products,
  total,
  sortBy,
  setSortBy,
  categories,
  selectedCategories,
  selectedPriceRanges,
  toggleCategory,
  togglePriceRange,
  clearFilters,
  wishlist,
  onWishlist,
  onAddToBag,
  onRetry,
  visibleCount,
  setVisibleCount,
}) {
  return (
    <Box
      id="bridal-products"
      sx={{ px: { xs: 2, md: 3 }, py: 3 }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 10, color: "#777", mb: 0.5 }}>
            ✦ REFINE TROUSSEAU
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: 25,
              fontWeight: 600,
            }}
          >
            Bridal & Festive Edit
          </Typography>

          <Typography sx={{ fontSize: 11, color: "#888", mt: 0.5 }}>
            {loading
              ? "Loading products..."
              : `${total} product${total === 1 ? "" : "s"} available`}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: 11 }}>Sort By:</Typography>

          <Select
            size="small"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            sx={{
              fontSize: 11,
              minWidth: 170,
              height: 36,
              background: "#fff",
            }}
          >
            <MenuItem value="featured">Featured Royal Trousseau</MenuItem>
            <MenuItem value="priceLow">Price Low to High</MenuItem>
            <MenuItem value="priceHigh">Price High to Low</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
          </Select>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={2.5}>
          <Sidebar
            categories={categories}
            selectedCategories={selectedCategories}
            selectedPriceRanges={selectedPriceRanges}
            toggleCategory={toggleCategory}
            togglePriceRange={togglePriceRange}
            clearFilters={clearFilters}
          />
        </Grid>

        <Grid item xs={12} md={9.5}>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small" onClick={onRetry}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 8,
                gap: 2,
              }}
            >
              <CircularProgress sx={{ color: "#390009" }} />
              <Typography sx={{ fontSize: 12, color: "#777" }}>
                Loading bridal collection...
              </Typography>
            </Box>
          ) : products.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                textAlign: "center",
                p: { xs: 3, md: 6 },
                border: "1px solid #eee",
                background: "#fff",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  fontSize: 25,
                  mb: 1,
                }}
              >
                No Products Found
              </Typography>

              <Typography sx={{ color: "#777", fontSize: 12, mb: 2 }}>
                Add products in your admin/backend, or clear your selected
                filters to see other products.
              </Typography>

              <Button
                variant="contained"
                onClick={clearFilters}
                sx={{
                  background: "#390009",
                  textTransform: "none",
                  "&:hover": { background: "#58111a" },
                }}
              >
                Clear Filters
              </Button>
            </Paper>
          ) : (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2,minmax(0,1fr))",
                    sm: "repeat(3,minmax(0,1fr))",
                    lg: "repeat(4,minmax(0,1fr))",
                  },
                  gap: 1.5,
                }}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    liked={wishlist.some(
                      (item) => String(item.id) === String(product.id)
                    )}
                    onWishlist={() => onWishlist(product)}
                    onAddToBag={() => onAddToBag(product)}
                  />
                ))}
              </Box>

              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography
                  sx={{ fontSize: 10, color: "#888", mb: 1 }}
                >
                  Showing {products.length} of {total} products
                </Typography>

                {products.length < total && (
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setVisibleCount((count) => count + 8)
                    }
                    sx={{
                      textTransform: "none",
                      fontSize: 11,
                      borderColor: "#ddd",
                      color: "#390009",
                    }}
                  >
                    Load More Bridal Sets
                  </Button>
                )}
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  categories,
  selectedCategories,
  selectedPriceRanges,
  toggleCategory,
  togglePriceRange,
  clearFilters,
}) {
  const priceOptions = [
    { value: "under999", label: "Under ₹999" },
    { value: "1000-2499", label: "₹1,000 - ₹2,499" },
    { value: "2500-5999", label: "₹2,500 - ₹5,999" },
    { value: "6000plus", label: "₹6,000 and above" },
  ];

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
          FILTER BY
        </Typography>

        <Button
          onClick={clearFilters}
          size="small"
          sx={{
            fontSize: 9,
            textTransform: "none",
            color: "#8c1021",
          }}
        >
          Clear
        </Button>
      </Box>

      <FilterTitle title="CATEGORIES" />

      {categories.length === 0 ? (
        <Typography sx={{ fontSize: 10, color: "#888", mb: 1 }}>
          Categories will appear here when added in the backend.
        </Typography>
      ) : (
        categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                size="small"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                sx={{
                  p: 0.5,
                  color: "#aaa",
                  "&.Mui-checked": { color: "#8c1021" },
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: 10 }}>
                {category}
              </Typography>
            }
            sx={{ display: "flex", m: 0 }}
          />
        ))
      )}

      <Divider sx={{ my: 1.5 }} />

      <FilterTitle title="PRICE TIER" />

      {priceOptions.map((option) => (
        <FormControlLabel
          key={option.value}
          control={
            <Checkbox
              size="small"
              checked={selectedPriceRanges.includes(option.value)}
              onChange={() => togglePriceRange(option.value)}
              sx={{
                p: 0.5,
                color: "#aaa",
                "&.Mui-checked": { color: "#8c1021" },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: 10 }}>
              {option.label}
            </Typography>
          }
          sx={{ display: "flex", m: 0 }}
        />
      ))}

      <Divider sx={{ my: 1.5 }} />

      <Box
        sx={{
          background: "#390009",
          color: "#fff",
          p: 1.5,
          borderRadius: 1,
        }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 700, mb: 0.5 }}>
          Need Styling Help?
        </Typography>

        <Typography
          sx={{
            fontSize: 9,
            color: "#e9cccc",
            lineHeight: 1.6,
            mb: 1,
          }}
        >
          Explore our collection and choose jewellery for your special
          occasion.
        </Typography>

        <Button
          fullWidth
          size="small"
          onClick={() =>
            document
              .getElementById("bridal-styling")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          sx={{
            background: "#fed65b",
            color: "#390009",
            fontSize: 9,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": { background: "#f7c93e" },
          }}
        >
          BOOK A STYLING SESSION
        </Button>
      </Box>
    </Box>
  );
}

function FilterTitle({ title }) {
  return (
    <Typography
      sx={{
        fontSize: 9,
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

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({ product, liked, onWishlist, onAddToBag }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Card
      sx={{
        borderRadius: 1,
        boxShadow: "0 2px 10px rgba(0,0,0,.05)",
        overflow: "hidden",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          position: "relative",
          background: "#f1ece6",
          minHeight: { xs: 160, sm: 210 },
        }}
      >
        {product.image && !imageFailed ? (
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            onError={() => setImageFailed(true)}
            sx={{
              height: { xs: 180, sm: 210, md: 220 },
              objectFit: "cover",
            }}
          />
        ) : (
          <Box
            sx={{
              height: { xs: 180, sm: 210, md: 220 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#866b6b",
              p: 2,
            }}
          >
            <Typography sx={{ fontSize: 30 }}>✦</Typography>
            <Typography sx={{ fontSize: 10, textAlign: "center" }}>
              Product image unavailable
            </Typography>
          </Box>
        )}

        {product.badge && (
          <Box
            sx={{
              position: "absolute",
              top: 6,
              left: 6,
              background: "#390009",
              color: "#fff",
              px: 0.7,
              py: 0.4,
              fontSize: 7,
              fontWeight: 700,
              borderRadius: 0.4,
              maxWidth: "75%",
            }}
          >
            {product.badge}
          </Box>
        )}

        <IconButton
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={onWishlist}
          sx={{
            position: "absolute",
            right: 5,
            top: 5,
            background: "rgba(255,255,255,.9)",
            width: 30,
            height: 30,
            "&:hover": { background: "#fff" },
          }}
        >
          {liked ? (
            <Favorite sx={{ fontSize: 16, color: "#8c1021" }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: 16 }} />
          )}
        </IconButton>

        {product.discount > 0 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 6,
              left: 6,
              background: "#fed65b",
              color: "#390009",
              fontSize: 8,
              px: 0.7,
              py: 0.35,
              fontWeight: 700,
            }}
          >
            {product.discount}% OFF
          </Box>
        )}
      </Box>

      <Box
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        {product.rating > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: 0.5,
            }}
          >
            <Rating
              value={Math.min(product.rating, 5)}
              precision={0.1}
              readOnly
              size="small"
              sx={{
                fontSize: 13,
                "& .MuiRating-iconFilled": { color: "#b78900" },
              }}
            />

            <Typography sx={{ fontSize: 9 }}>
              {product.rating.toFixed(1)}
            </Typography>

            {product.reviews > 0 && (
              <Typography sx={{ fontSize: 8, color: "#999" }}>
                ({product.reviews})
              </Typography>
            )}
          </Box>
        )}

        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            lineHeight: 1.4,
            minHeight: 32,
            overflowWrap: "anywhere",
          }}
        >
          {product.name}
        </Typography>

        {product.category && (
          <Typography
            sx={{
              fontSize: 9,
              color: "#888",
              mt: 0.5,
              mb: 0.5,
            }}
          >
            {product.category}
          </Typography>
        )}

        {product.description && (
          <Typography
            sx={{
              fontSize: 9,
              color: "#888",
              lineHeight: 1.5,
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            flexWrap: "wrap",
            mt: "auto",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 800,
              color: "#390009",
            }}
          >
            {formatPrice(product.price)}
          </Typography>

          {product.oldPrice > product.price && (
            <Typography
              sx={{
                fontSize: 9,
                color: "#999",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.oldPrice)}
            </Typography>
          )}
        </Box>

        <Button
          fullWidth
          startIcon={<ShoppingBagOutlined sx={{ fontSize: "14px !important" }} />}
          onClick={onAddToBag}
          sx={{
            background: "#390009",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            py: 0.8,
            borderRadius: 0.5,
            "&:hover": { background: "#58111a" },
          }}
        >
          Add to Bag
        </Button>
      </Box>
    </Card>
  );
}

/* =========================================================
   VIRTUAL STYLING
========================================================= */

function StylingSection({ setNotification }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    colour: "",
    occasion: "",
    requirement: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      setNotification({
        open: true,
        message: "Please enter your name and WhatsApp number.",
        severity: "warning",
      });
      return;
    }

    if (!/^[0-9+\-\s()]{10,18}$/.test(form.phone.trim())) {
      setNotification({
        open: true,
        message: "Please enter a valid contact number.",
        severity: "warning",
      });
      return;
    }

    setSubmitting(true);

    try {
      // No appointment API has been configured yet.
      // This currently validates the form but does not save it to Django.
      setNotification({
        open: true,
        message:
          "Form validated. Connect your Django appointment API to save this request.",
        severity: "info",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      id="bridal-styling"
      sx={{ px: { xs: 2, md: 4 }, py: 4 }}
    >
      <Grid
        container
        sx={{
          background: "#fff",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 3px 20px rgba(0,0,0,.07)",
        }}
      >
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            background: "linear-gradient(145deg,#390009,#5b101c)",
            color: "#fff",
            p: { xs: 3, md: 4 },
          }}
        >
          <Typography
            sx={{
              color: "#fed65b",
              fontSize: 10,
              letterSpacing: 1,
              mb: 1,
            }}
          >
            ZINORA JEWEL STUDIO
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: 28,
              fontWeight: 600,
              lineHeight: 1.2,
              mb: 1.5,
            }}
          >
            Book a Bridal Styling Session
          </Typography>

          <Typography
            sx={{
              color: "#edd7d7",
              fontSize: 11,
              lineHeight: 1.8,
              mb: 2,
            }}
          >
            Tell us about your occasion and jewellery preferences so our
            team can help you find a suitable style.
          </Typography>

          {[
            "Occasion-based jewellery suggestions",
            "Colour and outfit coordination",
            "Personalised collection guidance",
          ].map((item) => (
            <Typography
              key={item}
              sx={{ fontSize: 10, mb: 1, color: "#f5e8e8" }}
            >
              ✓ {item}
            </Typography>
          ))}
        </Grid>

        <Grid item xs={12} md={7} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: 23,
              fontWeight: 600,
            }}
          >
            Tell Us Your Preferences
          </Typography>

          <Typography sx={{ fontSize: 10, color: "#888", mb: 2 }}>
            Complete the form to prepare your styling request.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  name="name"
                  label="Bride's Full Name"
                  value={form.name}
                  onChange={updateField}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  name="phone"
                  label="WhatsApp Number"
                  value={form.phone}
                  onChange={updateField}
                  inputProps={{ maxLength: 18 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="date"
                  label="Preferred Consultation Date"
                  type="date"
                  value={form.date}
                  onChange={updateField}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="colour"
                  label="Lehenga / Saree Colour"
                  value={form.colour}
                  onChange={updateField}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="occasion"
                  label="Preferred Occasion"
                  value={form.occasion}
                  onChange={updateField}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  name="requirement"
                  label="Describe Your Jewellery Requirement"
                  multiline
                  rows={3}
                  value={form.requirement}
                  onChange={updateField}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  disabled={submitting}
                  startIcon={<CalendarMonthOutlined />}
                  sx={{
                    background: "#390009",
                    color: "#fff",
                    fontSize: 11,
                    py: 1.2,
                    textTransform: "uppercase",
                    "&:hover": { background: "#58111a" },
                  }}
                >
                  {submitting
                    ? "Please wait..."
                    : "Validate Styling Request"}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: 9,
              color: "#999",
              mt: 1.5,
            }}
          >
            Your request will need a connected backend API to be saved.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

/* =========================================================
   GUARANTEES
========================================================= */

function Guarantees() {
  const items = [
    {
      icon: <VerifiedOutlined />,
      title: "Quality-Focused Selection",
      text: "Explore jewellery products listed in the Zinora collection.",
    },
    {
      icon: <SecurityOutlined />,
      title: "Clear Product Details",
      text: "Review available prices and product information before ordering.",
    },
    {
      icon: <HandshakeOutlined />,
      title: "Discover Traditional Craft",
      text: "Find jewellery for bridal occasions and festive celebrations.",
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
                {React.cloneElement(item.icon, { sx: { fontSize: 27 } })}
              </Box>

              <Typography sx={{ fontSize: 11, fontWeight: 700 }}>
                {item.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: 9,
                  color: "#888",
                  mt: 0.5,
                  lineHeight: 1.7,
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

/* =========================================================
   ROYAL PRIVILEGES / NEWSLETTER
========================================================= */

function RoyalPrivileges({ setNotification }) {
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = (event) => {
    event.preventDefault();

    const value = contact.trim();

    if (!value) {
      setNotification({
        open: true,
        message: "Please enter your email or mobile number.",
        severity: "warning",
      });
      return;
    }

    if (value.includes("@")) {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (!validEmail) {
        setNotification({
          open: true,
          message: "Please enter a valid email address.",
          severity: "warning",
        });
        return;
      }
    } else {
      const digits = value.replace(/\D/g, "");

      if (digits.length !== 10) {
        setNotification({
          open: true,
          message: "Please enter a valid 10-digit mobile number.",
          severity: "warning",
        });
        return;
      }
    }

    setSubmitting(true);

    try {
      setNotification({
        open: true,
        message:
          "Details validated. Connect a Django subscription API to save your subscription.",
        severity: "info",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
              fontSize: 9,
              letterSpacing: 1,
            }}
          >
            EXCLUSIVE ROYAL PRIVILEGES
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: { xs: 23, md: 28 },
              color: "#390009",
            }}
          >
            Join the Zinora Atelier
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              color: "#777",
              maxWidth: 450,
              lineHeight: 1.7,
            }}
          >
            Stay connected with Zinora and discover updates about our
            collections and new arrivals.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubscribe}
          sx={{
            display: "flex",
            gap: 0.7,
            width: { xs: "100%", md: 440 },
          }}
        >
          <TextField
            size="small"
            fullWidth
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="Email address or mobile number"
            sx={{ background: "#fff" }}
          />

          <Button
            type="submit"
            disabled={submitting}
            sx={{
              background: "#390009",
              color: "#fff",
              whiteSpace: "nowrap",
              fontSize: 9,
              px: 2,
              "&:hover": { background: "#58111a" },
            }}
          >
            {submitting ? "PLEASE WAIT" : "SUBSCRIBE"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}