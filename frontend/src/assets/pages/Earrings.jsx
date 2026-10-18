import React, { useEffect, useMemo, useState } from "react";

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
  CircularProgress,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// ======================================================
// DJANGO API CONFIGURATION
// ======================================================

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const PRODUCTS_API = `${API_BASE}/api/products/`;
const CATEGORIES_API = `${API_BASE}/api/products/categories/`;

// ======================================================
// HELPER FUNCTIONS
// ======================================================

const getArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getText = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return "";
};

const getNumber = (...values) => {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== "") {
      const number = Number(
        String(value).replace(/[₹,\s]/g, "")
      );

      if (Number.isFinite(number)) {
        return number;
      }
    }
  }

  return 0;
};

const resolveImage = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    value =
      value.url ||
      value.image ||
      value.src ||
      value.image_url ||
      "";
  }

  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  const image = value.trim();

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return `${API_BASE}/${image.replace(/^\/+/, "")}`;
};

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

const normalizeProduct = (item, index) => {
  const category =
    typeof item.category === "object"
      ? getText(
          item.category?.name,
          item.category?.title,
          item.category?.category_name
        )
      : getText(item.category, item.category_name, item.category_title);

  const price = getNumber(
    item.price,
    item.selling_price,
    item.sale_price,
    item.discounted_price
  );

  const oldPrice = getNumber(
    item.old_price,
    item.original_price,
    item.mrp,
    item.compare_at_price
  );

  const images = Array.isArray(item.images) ? item.images : [];

  const image = resolveImage(
    item.image ||
      item.image_url ||
      item.product_image ||
      item.thumbnail ||
      item.image1 ||
      images[0]
  );

  const discount =
    oldPrice > price && oldPrice > 0
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  return {
    id: item.id ?? item.pk ?? `product-${index}`,
    name: getText(
      item.name,
      item.product_name,
      item.title,
      item.product_title
    ) || "Untitled Product",

    description: getText(
      item.description,
      item.short_description,
      item.desc
    ) || "Discover elegant jewellery from the Zinora collection.",

    category,

    price,
    oldPrice,

    rating: getNumber(item.rating, item.average_rating),
    reviews: getNumber(item.reviews, item.review_count),

    badge: getText(item.badge, item.tag, item.label, item.product_tag),
    offer:
      getText(item.offer, item.discount_label) ||
      (discount ? `${discount}% OFF` : ""),

    image,

    style: getText(item.style, item.silhouette, item.product_style),
    stone: getText(item.stone, item.stone_type, item.karigari),
    metal: getText(item.metal, item.metal_type, item.material),
    weight: getText(item.weight, item.product_weight),

    isActive: item.is_active !== false && item.is_active !== 0,

    createdAt: getText(item.created_at, item.createdAt),
  };
};

// ======================================================
// FILTER OPTIONS
// ======================================================

const STYLE_OPTIONS = [
  "Traditional Jhumkas",
  "Chandbali",
  "Pearl Drops",
  "Studs",
  "Bridal Chandbali",
  "Gold Drops",
  "Temple Jhumkas",
];

const STONE_OPTIONS = [
  "Kundan",
  "Meenakari",
  "Pearls",
  "Kemp Ruby",
  "Uncut Polki",
  "Crystal CZ",
];

const PRICE_OPTIONS = [
  "Under ₹499",
  "₹500 - ₹1,499",
  "₹1,500 - ₹3,500",
];

const METAL_OPTIONS = [
  "Hypoallergenic Brass",
  "German Silver",
  "Vintage Copper Alloy",
];

const WEIGHT_OPTIONS = [
  "Lightweight < 40 grams",
  "Medium 40–80 grams",
  "Heavy > 80 grams",
];

// ======================================================
// FILTER HELPERS
// ======================================================

const matchesText = (product, field, selectedValues) => {
  if (selectedValues.length === 0) return true;

  const actualValue = getText(product[field]);

  // If the backend does not provide this field,
  // try matching the product's text fields instead.
  const searchableText = [
    product.name,
    product.description,
    product.category,
    product.style,
    product.stone,
    product.metal,
    product.weight,
  ]
    .join(" ")
    .toLowerCase();

  if (actualValue) {
    return selectedValues.some(
      (value) => actualValue.toLowerCase() === value.toLowerCase()
    );
  }

  return selectedValues.some((value) =>
    searchableText.includes(value.toLowerCase())
  );
};

const matchesPrice = (product, selectedValues) => {
  if (selectedValues.length === 0) return true;

  return selectedValues.some((range) => {
    if (range === "Under ₹499") {
      return product.price < 500;
    }

    if (range === "₹500 - ₹1,499") {
      return product.price >= 500 && product.price <= 1499;
    }

    if (range === "₹1,500 - ₹3,500") {
      return product.price >= 1500 && product.price <= 3500;
    }

    return true;
  });
};

// ======================================================
// PRODUCT CARD
// ======================================================

function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
}) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [product.image]);

  const showOldPrice = product.oldPrice > product.price;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #ebe5df",
        borderRadius: "5px",
        overflow: "hidden",
        backgroundColor: "#fff",
        position: "relative",
        transition: "0.25s",
        minWidth: 0,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
        },
      }}
    >
      {/* PRODUCT IMAGE */}

      <Box
        sx={{
          height: { xs: 210, sm: 230, md: 245 },
          position: "relative",
          backgroundColor: "#f3eee8",
          overflow: "hidden",
        }}
      >
        {product.image && !imageFailed ? (
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.04)",
              },
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#927c70",
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: 35 }}>♢</Typography>
            <Typography sx={{ fontSize: 10 }}>
              Product image unavailable
            </Typography>
          </Box>
        )}

        {/* BADGE */}

        {product.badge && (
          <Box sx={{ position: "absolute", top: 8, left: 8 }}>
            <Typography
              sx={{
                display: "inline-block",
                backgroundColor: "#6c0d19",
                color: "#fff",
                fontSize: "8px",
                fontWeight: 700,
                px: 0.8,
                py: 0.4,
              }}
            >
              {product.badge}
            </Typography>
          </Box>
        )}

        {/* OFFER */}

        {product.offer && (
          <Box sx={{ position: "absolute", top: product.badge ? 29 : 8, left: 8 }}>
            <Typography
              sx={{
                display: "inline-block",
                backgroundColor: "#d71920",
                color: "#fff",
                fontSize: "8px",
                fontWeight: 700,
                px: 0.8,
                py: 0.4,
              }}
            >
              {product.offer}
            </Typography>
          </Box>
        )}

        {/* WISHLIST */}

        <IconButton
          size="small"
          aria-label={
            isFavorite ? "Remove from wishlist" : "Add to wishlist"
          }
          onClick={() => onToggleFavorite(product.id)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            backgroundColor: "#fff",
            width: 30,
            height: 30,
            "&:hover": {
              backgroundColor: "#fff5f5",
            },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ fontSize: 17, color: "#d71920" }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 17, color: "#6c0d19" }} />
          )}
        </IconButton>
      </Box>

      {/* PRODUCT DETAILS */}

      <Box sx={{ p: 1.2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.4,
          }}
        >
          <StarIcon sx={{ fontSize: 12, color: "#d69b00" }} />

          <Typography sx={{ fontSize: "9px", fontWeight: 700 }}>
            {product.rating ? product.rating.toFixed(1) : "New"}
          </Typography>

          {product.reviews > 0 && (
            <Typography sx={{ fontSize: "8px", color: "#777" }}>
              ({product.reviews} reviews)
            </Typography>
          )}
        </Box>

        <Typography
          title={product.name}
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#55101a",
            mt: 0.6,
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
            lineHeight: 1.5,
            minHeight: 24,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </Typography>

        {/* PRICE */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            mt: 0.8,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              color: "#6c0d19",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {formatPrice(product.price)}
          </Typography>

          {showOldPrice && (
            <Typography
              sx={{
                color: "#999",
                fontSize: "8px",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.oldPrice)}
            </Typography>
          )}
        </Box>

        <Typography sx={{ fontSize: "7px", color: "#777", mt: 0.5 }}>
          ✓ Free Express Delivery
        </Typography>
      </Box>
    </Paper>
  );
}

// ======================================================
// MAIN EARRINGS PAGE
// ======================================================

function Earrings() {
  // ====================================================
  // DYNAMIC DATA STATES
  // ====================================================

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // ====================================================
  // FILTER STATES
  // ====================================================

  const [selectedCategory, setSelectedCategory] = useState("All Earrings");

  const [selectedStyle, setSelectedStyle] = useState([]);
  const [selectedStone, setSelectedStone] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [selectedMetal, setSelectedMetal] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState([]);

  const [sortBy, setSortBy] = useState("featured");

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("zinoraWishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ====================================================
  // FETCH PRODUCTS AND CATEGORIES FROM DJANGO
  // ====================================================

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setCategoryError("");

    try {
      const productsResponse = await fetch(PRODUCTS_API);

      if (!productsResponse.ok) {
        throw new Error(
          `Products API error: ${productsResponse.status}`
        );
      }

      const productsData = await productsResponse.json();

      const normalizedProducts = getArray(productsData)
        .map(normalizeProduct)
        .filter((product) => product.isActive);

      setProducts(normalizedProducts);
    } catch (err) {
      console.error("Products API error:", err);
      setError(
        "Products load nahi ho paaye. Django backend aur Products API check karo."
      );
      setProducts([]);
    }

    try {
      const categoriesResponse = await fetch(CATEGORIES_API);

      if (!categoriesResponse.ok) {
        throw new Error(
          `Categories API error: ${categoriesResponse.status}`
        );
      }

      const categoriesData = await categoriesResponse.json();

      const normalizedCategories = getArray(categoriesData)
        .filter(
          (category) =>
            category.is_active !== false && category.is_active !== 0
        )
        .map((category) =>
          getText(
            category.name,
            category.title,
            category.category_name
          )
        )
        .filter(Boolean);

      setCategories([...new Set(normalizedCategories)]);
    } catch (err) {
      console.error("Categories API error:", err);
      setCategoryError(
        "Categories API load nahi hui. Product categories se tabs dikhaye ja rahe hain."
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ====================================================
  // DYNAMIC CATEGORY TABS
  // ====================================================

  const categoryOptions = useMemo(() => {
    const productCategories = products
      .map((product) => product.category)
      .filter(Boolean);

    const allCategories = [
      ...categories,
      ...productCategories,
    ];

    return [
      "All Earrings",
      ...new Set(allCategories),
    ];
  }, [categories, products]);

  // ====================================================
  // TOGGLE FILTER
  // ====================================================

  const toggleFilter = (setter, value) => {
    setter((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };

  // ====================================================
  // WISHLIST
  // ====================================================

  const toggleFavorite = (productId) => {
    setFavorites((previous) => {
      const updated = previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId];

      try {
        localStorage.setItem(
          "zinoraWishlist",
          JSON.stringify(updated)
        );
      } catch (err) {
        console.error("Wishlist storage error:", err);
      }

      return updated;
    });
  };

  // ====================================================
  // RESET FILTERS
  // ====================================================

  const resetFilters = () => {
    setSelectedCategory("All Earrings");
    setSelectedStyle([]);
    setSelectedStone([]);
    setSelectedPrice([]);
    setSelectedMetal([]);
    setSelectedWeight([]);
    setSortBy("featured");
  };

  // ====================================================
  // FILTER AND SORT DYNAMIC PRODUCTS
  // ====================================================

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const categoryMatch =
        selectedCategory === "All Earrings" ||
        product.category.toLowerCase() ===
          selectedCategory.toLowerCase();

      const styleMatch = matchesText(
        product,
        "style",
        selectedStyle
      );

      const stoneMatch = matchesText(
        product,
        "stone",
        selectedStone
      );

      const priceMatch = matchesPrice(
        product,
        selectedPrice
      );

      const metalMatch = matchesText(
        product,
        "metal",
        selectedMetal
      );

      const weightMatch = matchesText(
        product,
        "weight",
        selectedWeight
      );

      return (
        categoryMatch &&
        styleMatch &&
        stoneMatch &&
        priceMatch &&
        metalMatch &&
        weightMatch
      );
    });

    if (sortBy === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedStyle,
    selectedStone,
    selectedPrice,
    selectedMetal,
    selectedWeight,
    sortBy,
  ]);

  // ====================================================
  // PAGE UI
  // ====================================================

  return (
    <Box
      sx={{
        backgroundColor: "#faf9f7",
        minHeight: "100vh",
        color: "#4d1717",
        pb: 0,
      }}
    >
      {/* HERO SECTION */}

      <Box
        sx={{
          px: { xs: 2, md: 5 },
          pt: { xs: 2, md: 3 },
        }}
      >
        <Typography
          sx={{
            fontSize: "9px",
            color: "#9b7a29",
            mb: 1,
          }}
        >
          Home › Jewellery › Earrings & Jhumkas
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.15fr 0.85fr",
            },
            gap: { xs: 2, md: 4 },
            alignItems: "center",
          }}
        >
          {/* LEFT SIDE */}

          <Box>
            <Typography
              sx={{
                color: "#9a731f",
                fontSize: { xs: "9px", md: "11px" },
                letterSpacing: 1.2,
                fontWeight: 600,
              }}
            >
              ROYAL HERITAGE ORNAMENTATION — Vol. VI Collection
            </Typography>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                color: "#560914",
                fontSize: {
                  xs: "34px",
                  sm: "43px",
                  md: "48px",
                },
                lineHeight: 0.98,
                fontWeight: 500,
                mt: 1,
              }}
            >
              Earrings, Jhumkas
              <br />
              <Box
                component="span"
                sx={{
                  fontStyle: "italic",
                  color: "#6a3c42",
                }}
              >
                & Grand Chandbalis
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#746966",
                fontSize: { xs: "10px", md: "11px" },
                lineHeight: 1.6,
                maxWidth: 600,
                mt: 1.5,
              }}
            >
              From featherlight daily studs to opulent wedding
              chandeliers, discover handcrafted earrings inspired
              by India's royal heritage and finished for modern
              celebrations.
            </Typography>

            <Button
              variant="contained"
              endIcon={
                <ArrowForwardIcon
                  sx={{ fontSize: "13px !important" }}
                />
              }
              onClick={() =>
                document
                  .getElementById("earrings-products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              sx={{
                mt: 2,
                backgroundColor: "#680b18",
                color: "#fff",
                textTransform: "none",
                fontSize: "9px",
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: "#4d0710",
                },
              }}
            >
              Explore Collection
            </Button>
          </Box>

          {/* HERO IMAGE */}

          <Paper
            elevation={0}
            sx={{
              height: {
                xs: 250,
                sm: 300,
                md: 310,
              },
              overflow: "hidden",
              borderRadius: 2,
              position: "relative",
              backgroundColor: "#e8ded5",
            }}
          >
            <Box
              component="img"
              src={
                products.find((product) => product.image)?.image ||
                ""
              }
              alt="Zinora earrings collection"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
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
                bottom: 0,
                left: 0,
                right: 0,
                background:
                  "linear-gradient(transparent, rgba(0,0,0,0.75))",
                p: 2,
                pt: 5,
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                Royal Chandbalis
              </Typography>

              <Typography
                sx={{
                  color: "#eee",
                  fontSize: "7px",
                  mt: 0.3,
                }}
              >
                Kundan • Meenakari • Pearl Finish
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* DYNAMIC CATEGORY TABS */}

      <Box
        sx={{
          px: { xs: 2, md: 5 },
          mt: 3,
          display: "flex",
          gap: 1,
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {categoryOptions.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            sx={{
              flexShrink: 0,
              textTransform: "none",
              fontSize: "8px",
              px: 1.6,
              py: 0.8,
              minHeight: 30,
              borderRadius: "5px",
              backgroundColor:
                selectedCategory === category
                  ? "#650c18"
                  : "#fff",
              color:
                selectedCategory === category
                  ? "#fff"
                  : "#6a3333",
              border:
                selectedCategory === category
                  ? "none"
                  : "1px solid #eee6df",
              "&:hover": {
                backgroundColor:
                  selectedCategory === category
                    ? "#650c18"
                    : "#f5f0eb",
              },
            }}
          >
            {category === "All Earrings"
              ? `All Earrings (${products.length})`
              : category}
          </Button>
        ))}
      </Box>

      {/* API STATUS */}

      {categoryError && (
        <Typography
          sx={{
            mx: { xs: 2, md: 5 },
            mt: 1,
            fontSize: 10,
            color: "#9a731f",
          }}
        >
          {categoryError}
        </Typography>
      )}

      {/* PRODUCT COUNT AND SORT */}

      <Box
        id="earrings-products"
        sx={{
          px: { xs: 2, md: 5 },
          mt: 1,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 1,
            px: 1.5,
            border: "1px solid #eee8e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              fontSize: "8px",
              fontWeight: 700,
              color: "#63101b",
            }}
          >
            {filteredProducts.length} Handcrafted Pieces
            <Box
              component="span"
              sx={{
                color: "#aaa",
                mx: 1,
              }}
            >
              |
            </Box>
            Royal Earrings Collection
          </Typography>

          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              sx={{
                height: 28,
                fontSize: "8px",
                minWidth: { xs: 145, sm: 170 },
                backgroundColor: "#fafafa",
                "& fieldset": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="featured">
                Sort: Featured & Popularity
              </MenuItem>
              <MenuItem value="low">
                Price: Low to High
              </MenuItem>
              <MenuItem value="high">
                Price: High to Low
              </MenuItem>
              <MenuItem value="rating">
                Highest Rated
              </MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>

      {/* FILTERS AND PRODUCTS */}

      <Box
        sx={{
          px: { xs: 2, md: 5 },
          mt: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "205px 1fr",
          },
          gap: 2,
        }}
      >
        {/* FILTER SIDEBAR */}

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
              }}
            >
              <FilterListIcon
                sx={{
                  fontSize: 13,
                  mr: 0.5,
                  verticalAlign: "middle",
                }}
              />
              Filters
            </Typography>

            <Button
              onClick={resetFilters}
              sx={{
                minWidth: 0,
                p: 0,
                fontSize: "7px",
                color: "#9a731f",
              }}
            >
              RESET ALL
            </Button>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* STYLE */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Earring Style
          </Typography>

          <FormGroup>
            {STYLE_OPTIONS.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={selectedStyle.includes(item)}
                    onChange={() =>
                      toggleFilter(setSelectedStyle, item)
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
                sx={{
                  m: 0,
                  minHeight: 23,
                }}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 1.5 }} />

          {/* STONE */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
              mb: 0.7,
            }}
          >
            Stone & Karigari
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            {STONE_OPTIONS.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onClick={() =>
                  toggleFilter(setSelectedStone, item)
                }
                sx={{
                  height: 21,
                  fontSize: "7px",
                  backgroundColor: selectedStone.includes(item)
                    ? "#680b18"
                    : "#f4efea",
                  color: selectedStone.includes(item)
                    ? "#fff"
                    : "#705c56",
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
            {PRICE_OPTIONS.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={selectedPrice.includes(item)}
                    onChange={() =>
                      toggleFilter(setSelectedPrice, item)
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

          {/* METAL */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            Base Metal & Finish
          </Typography>

          <FormGroup>
            {METAL_OPTIONS.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={selectedMetal.includes(item)}
                    onChange={() =>
                      toggleFilter(setSelectedMetal, item)
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

          {/* WEIGHT */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            Earring Weight
          </Typography>

          <FormGroup>
            {WEIGHT_OPTIONS.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={selectedWeight.includes(item)}
                    onChange={() =>
                      toggleFilter(setSelectedWeight, item)
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

          {/* SKIN SAFE */}

          <Box
            sx={{
              mt: 2,
              p: 1,
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
              ♢ 100% Skin Safe Promise
            </Typography>

            <Typography
              sx={{
                fontSize: "6px",
                color: "#777",
                mt: 0.5,
              }}
            >
              Nickel-free, lead-free alloy
              <br />
              tested for sensitive skin.
            </Typography>
          </Box>
        </Paper>

        {/* PRODUCT GRID */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 1.5,
            alignContent: "start",
            minWidth: 0,
          }}
        >
          {/* LOADING */}

          {loading && (
            <Box
              sx={{
                gridColumn: "1 / -1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 8,
                gap: 2,
              }}
            >
              <CircularProgress
                size={32}
                sx={{ color: "#680b18" }}
              />

              <Typography sx={{ fontSize: 11, color: "#777" }}>
                Loading earrings from Zinora...
              </Typography>
            </Box>
          )}

          {/* API ERROR */}

          {!loading && error && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                gridColumn: "1 / -1",
                border: "1px solid #ebe5df",
              }}
            >
              <Typography
                sx={{
                  color: "#680b18",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Unable to Load Products
              </Typography>

              <Typography
                sx={{
                  color: "#777",
                  fontSize: 10,
                  mt: 1,
                }}
              >
                {error}
              </Typography>

              <Button
                onClick={fetchData}
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#680b18",
                  textTransform: "none",
                  fontSize: 10,
                  "&:hover": {
                    backgroundColor: "#4d0710",
                  },
                }}
              >
                Retry
              </Button>
            </Paper>
          )}

          {/* PRODUCTS */}

          {!loading &&
            !error &&
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}

          {/* EMPTY STATE */}

          {!loading &&
            !error &&
            filteredProducts.length === 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  textAlign: "center",
                  gridColumn: "1 / -1",
                  border: "1px solid #ebe5df",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Georgia, serif",
                    color: "#680b18",
                    fontSize: "22px",
                  }}
                >
                  No Earrings Found
                </Typography>

                <Typography
                  sx={{
                    color: "#777",
                    fontSize: "10px",
                    mt: 1,
                  }}
                >
                  Products abhi available nahi hain ya selected
                  filters se match nahi karte. Backend mein products
                  aur categories check karo.
                </Typography>

                <Button
                  onClick={resetFilters}
                  sx={{
                    mt: 2,
                    backgroundColor: "#680b18",
                    color: "#fff",
                    fontSize: "9px",
                    textTransform: "none",
                    px: 2,
                    "&:hover": {
                      backgroundColor: "#4d0710",
                    },
                  }}
                >
                  Reset Filters
                </Button>
              </Paper>
            )}
        </Box>
      </Box>

      {/* STYLIST CTA */}

      <Box
        sx={{
          px: { xs: 2, md: 5 },
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
              CAN'T DECIDE YOUR STYLE?
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
                mt: 0.3,
              }}
            >
              Get personalized earring recommendations for your
              outfit and occasion.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => {
              window.open(
                "https://wa.me/",
                "_blank",
                "noopener,noreferrer"
              );
            }}
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

      {/* STYLING GUIDE */}

      <Box
        sx={{
          px: { xs: 2, md: 5 },
          mt: 5,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "#9a731f",
            fontSize: "8px",
            letterSpacing: 1,
          }}
        >
          EDITORIAL STYLING GUIDE
        </Typography>

        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            color: "#560914",
            fontSize: { xs: "24px", md: "30px" },
            mt: 0.5,
          }}
        >
          How to Style Your Earrings
        </Typography>

        <Typography
          sx={{
            fontSize: "8px",
            color: "#777",
            maxWidth: 550,
            mx: "auto",
            mt: 0.5,
          }}
        >
          Discover the perfect earring silhouette for festive
          sarees, bridal outfits and everyday Indian looks.
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
            mt: 3,
            textAlign: "left",
          }}
        >
          {[
            {
              title: "Silk Sarees",
              text: "PAIRING: TEMPLE JHUMKAS",
            },
            {
              title: "Bridal Lehenga",
              text: "PAIRING: KUNDAN CHANDBALIS",
            },
            {
              title: "Festive Anarkali",
              text: "PAIRING: PEARL DROPS",
            },
            {
              title: "Daily Kurtis",
              text: "PAIRING: DELICATE STUDS",
            },
          ].map((item) => (
            <Paper
              key={item.title}
              elevation={0}
              sx={{
                p: 1.5,
                minHeight: 130,
                backgroundColor: "#f5f2ed",
                borderRadius: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#6b101c",
                  fontSize: "18px",
                }}
              >
                ♡
              </Typography>

              <Typography
                sx={{
                  color: "#6b101c",
                  fontSize: "10px",
                  fontWeight: 700,
                  mt: 0.8,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  color: "#9a731f",
                  fontSize: "8px",
                  fontWeight: 700,
                  mt: 0.5,
                }}
              >
                {item.text}
              </Typography>

              <Typography
                sx={{
                  color: "#777",
                  fontSize: "7px",
                  lineHeight: 1.5,
                  mt: 1,
                }}
              >
                Choose proportions that complement your outfit
                without overpowering the overall look.
              </Typography>

              <Typography
                sx={{
                  color: "#6b101c",
                  fontSize: "7px",
                  fontWeight: 700,
                  mt: 1,
                }}
              >
                Explore Style →
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* PROMISE STRIP */}

      <Box
        sx={{
          mt: 4,
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
            "Zero nickel, lead, hypoallergenic",
          ],
          [
            "✧",
            "1-Year Polish Warranty",
            "Complimentary replating included",
          ],
          [
            "♕",
            "Handcrafted by Karigars",
            "Inspired by Indian craftsmanship",
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
                width: 32,
                height: 32,
                backgroundColor: "#8b2634",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                }}
              >
                {subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* NEWSLETTER / COLLECTION CTA */}

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
              fontSize: "20px",
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
            Discover private festive collection previews and
            exclusive jewellery offers from Zinora.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() =>
            document
              .getElementById("earrings-products")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          sx={{
            backgroundColor: "#680b18",
            fontSize: "8px",
            textTransform: "uppercase",
            "&:hover": {
              backgroundColor: "#4d0710",
            },
          }}
        >
          Explore More →
        </Button>
      </Box>
    </Box>
  );
}

export default Earrings;