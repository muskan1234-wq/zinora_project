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
import RefreshIcon from "@mui/icons-material/Refresh";

// ======================================================
// API CONFIGURATION
// ======================================================

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const PRODUCTS_API = `${API_BASE}/api/products/`;
const CATEGORIES_API = `${API_BASE}/api/products/categories/`;

// ======================================================
// HELPERS
// ======================================================

function getArray(data) {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.results)) return data.results;

  if (Array.isArray(data?.products)) return data.products;

  if (Array.isArray(data?.categories)) return data.categories;

  if (Array.isArray(data?.data)) return data.data;

  return [];
}

function getText(value) {
  if (value === null || value === undefined) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    return (
      value.name ||
      value.title ||
      value.category_name ||
      value.label ||
      ""
    );
  }

  return "";
}

function getNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  const cleaned = String(value).replace(/[₹,\s]/g, "");
  const number = Number(cleaned);

  return Number.isFinite(number) ? number : fallback;
}

function getImageUrl(value) {
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
    image.startsWith("data:") ||
    image.startsWith("//")
  ) {
    return image.startsWith("//") ? `https:${image}` : image;
  }

  try {
    return new URL(
      image.replace(/^\/+/, ""),
      `${API_BASE}/`
    ).href;
  } catch {
    return "";
  }
}

function normalizeProduct(item) {
  const price = getNumber(
    item.price ??
      item.selling_price ??
      item.sale_price ??
      item.current_price,
    0
  );

  const oldPrice = getNumber(
    item.old_price ??
      item.original_price ??
      item.mrp ??
      item.compare_at_price ??
      item.regular_price,
    price
  );

  const discountValue = getNumber(
    item.discount_percentage ??
      item.discount ??
      item.discount_percent,
    0
  );

  const discount =
    discountValue > 0
      ? discountValue
      : oldPrice > price && oldPrice > 0
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : 0;

  const rawImages = Array.isArray(item.images)
    ? item.images
    : [];

  const rawImage =
    item.image ??
    item.image_url ??
    item.product_image ??
    item.thumbnail ??
    item.photo ??
    item.image1 ??
    rawImages[0] ??
    "";

  const category = getText(
    item.category_name ??
      item.category ??
      item.category_title
  );

  const metal = getText(
    item.metal ??
      item.base_metal ??
      item.material ??
      item.material_type
  );

  const stone = getText(
    item.stone ??
      item.stone_type ??
      item.stone_name ??
      item.work_type
  );

  const silhouette = getText(
    item.silhouette ??
      item.style ??
      item.design_type
  );

  const weight = getText(
    item.weight_profile ??
      item.weight ??
      item.product_weight
  );

  const priceRange =
    price < 500
      ? "Budget Picks Under ₹499"
      : price < 1500
        ? "Festive Luxury ₹500 - ₹1,499"
        : price <= 3500
          ? "Grand Bridal ₹1,500 - ₹3,500"
          : "Premium Jewellery Above ₹3,500";

  return {
    id: item.id ?? item.pk ?? item.slug ?? item.name,
    name: getText(
      item.name ??
        item.product_name ??
        item.title
    ) || "Untitled Jewellery",

    description: getText(
      item.description ??
        item.short_description ??
        item.desc
    ),

    price,
    oldPrice,
    discount,

    rating: getNumber(
      item.rating ??
        item.average_rating ??
        item.avg_rating,
      0
    ),

    reviews: getNumber(
      item.reviews ??
        item.review_count ??
        item.total_reviews,
      0
    ),

    badge: getText(
      item.badge ??
        item.tag ??
        item.label ??
        item.product_tag
    ),

    category,
    categoryId:
      typeof item.category === "object"
        ? item.category?.id
        : item.category_id ?? item.category,

    silhouette,
    stone,
    priceRange,
    metal,
    weight,

    image: getImageUrl(rawImage),

    createdAt:
      item.created_at ??
      item.createdAt ??
      item.date_created ??
      item.created ??
      "",

    raw: item,
  };
}

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

// ======================================================
// PRODUCT CARD
// ======================================================

function ProductCard({ product, isFavorite, onToggleFavorite }) {
  const [imageFailed, setImageFailed] = useState(false);

  const hasDiscount =
    product.oldPrice > product.price &&
    product.oldPrice > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #ebe5df",
        borderRadius: "5px",
        overflow: "hidden",
        backgroundColor: "#fff",
        position: "relative",
        transition: "0.2s",
        minWidth: 0,
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 5px 18px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* Product image */}

      <Box
        sx={{
          height: { xs: 180, sm: 210, md: 230 },
          position: "relative",
          backgroundColor: "#f1ece7",
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
            }}
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#987b70",
              gap: 1,
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: 35 }}>◇</Typography>

            <Typography sx={{ fontSize: 10 }}>
              Product image unavailable
            </Typography>
          </Box>
        )}

        {/* Badge and discount */}

        {(product.badge || product.discount > 0) && (
          <Box
            sx={{
              position: "absolute",
              top: 7,
              left: 7,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 0.3,
            }}
          >
            {product.badge && (
              <Typography
                sx={{
                  backgroundColor: "#6c0d19",
                  color: "#fff",
                  fontSize: "8px",
                  fontWeight: 700,
                  px: 0.7,
                  py: 0.35,
                }}
              >
                {product.badge}
              </Typography>
            )}

            {product.discount > 0 && (
              <Typography
                sx={{
                  backgroundColor: "#e60000",
                  color: "#fff",
                  fontSize: "8px",
                  fontWeight: 700,
                  px: 0.7,
                  py: 0.35,
                }}
              >
                {product.discount}% OFF
              </Typography>
            )}
          </Box>
        )}

        {/* Wishlist */}

        <IconButton
          size="small"
          aria-label={
            isFavorite
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          onClick={() => onToggleFavorite(product.id)}
          sx={{
            position: "absolute",
            right: 6,
            top: 6,
            backgroundColor: "#fff",
            width: 29,
            height: 29,
            "&:hover": {
              backgroundColor: "#fff4f4",
            },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon
              sx={{ fontSize: 16, color: "#8b1424" }}
            />
          ) : (
            <FavoriteBorderIcon
              sx={{ fontSize: 16, color: "#777" }}
            />
          )}
        </IconButton>
      </Box>

      {/* Product details */}

      <Box sx={{ p: 1.2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.3,
          }}
        >
          <StarIcon
            sx={{ fontSize: 12, color: "#d69b00" }}
          />

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            {product.rating > 0
              ? product.rating.toFixed(1)
              : "New"}
          </Typography>

          {product.reviews > 0 && (
            <Typography
              sx={{
                fontSize: "8px",
                color: "#777",
              }}
            >
              ({product.reviews} reviews)
            </Typography>
          )}
        </Box>

        <Typography
          title={product.name}
          sx={{
            fontSize: "11px",
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
          title={product.description}
          sx={{
            fontSize: "8px",
            color: "#888",
            mt: 0.4,
            minHeight: 24,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.description ||
            product.category ||
            "Explore our handcrafted jewellery collection."}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            mt: 0.8,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              color: "#6c0d19",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {formatPrice(product.price)}
          </Typography>

          {hasDiscount && (
            <Typography
              sx={{
                color: "#999",
                fontSize: "9px",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.oldPrice)}
            </Typography>
          )}
        </Box>

        {product.category && (
          <Typography
            sx={{
              fontSize: "8px",
              color: "#8a6d43",
              mt: 0.6,
            }}
          >
            {product.category}
          </Typography>
        )}

        <Typography
          sx={{
            fontSize: "7px",
            color: "#777",
            mt: 0.6,
          }}
        >
          ✓ Free Express Delivery
        </Typography>
      </Box>
    </Paper>
  );
}

// ======================================================
// FILTER CHECKBOX GROUP
// ======================================================

function FilterCheckboxGroup({
  items,
  selected,
  onToggle,
}) {
  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          key={item}
          control={
            <Checkbox
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
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
  );
}

// ======================================================
// MAIN NECKLACES PAGE
// ======================================================

function Necklaces() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const [selectedCategory, setSelectedCategory] =
    useState("All Necklaces");

  const [selectedSilhouette, setSelectedSilhouette] =
    useState([]);

  const [selectedStone, setSelectedStone] =
    useState([]);

  const [selectedPrice, setSelectedPrice] =
    useState([]);

  const [selectedMetal, setSelectedMetal] =
    useState([]);

  const [selectedWeight, setSelectedWeight] =
    useState([]);

  const [sortBy, setSortBy] = useState("featured");

  const [favorites, setFavorites] = useState([]);

  // ====================================================
  // FETCH PRODUCTS AND CATEGORIES FROM DJANGO
  // ====================================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [productsResponse, categoriesResponse] =
          await Promise.all([
            fetch(PRODUCTS_API, {
              signal: controller.signal,
            }),
            fetch(CATEGORIES_API, {
              signal: controller.signal,
            }),
          ]);

        if (!productsResponse.ok) {
          throw new Error(
            `Products API error (${productsResponse.status}). Check ${PRODUCTS_API}`
          );
        }

        const productsData = await productsResponse.json();

        const normalizedProducts = getArray(productsData)
          .map(normalizeProduct)
          .filter((product) => product.id !== undefined);

        setProducts(normalizedProducts);

        // Products should still appear if categories endpoint
        // has a temporary issue.

        if (categoriesResponse.ok) {
          const categoriesData =
            await categoriesResponse.json();

          setCategories(getArray(categoriesData));
        } else {
          setCategories([]);
          console.error(
            `Categories API error: ${categoriesResponse.status}`
          );
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Necklaces API error:", err);

        setError(
          err.message ||
            "Unable to load products. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => controller.abort();
  }, [retryKey]);

  // ====================================================
  // CATEGORY OPTIONS
  // ====================================================

  const categoryOptions = useMemo(() => {
    const categoryMap = new Map();

    categories.forEach((category) => {
      const name = getText(
        category.name ??
          category.category_name ??
          category.title
      );

      if (!name) return;

      const isActive =
        category.is_active === undefined ||
        category.is_active === true;

      if (isActive) {
        categoryMap.set(String(category.id ?? name), {
          id: category.id ?? name,
          name,
        });
      }
    });

    // Include categories found in products if the category
    // endpoint does not provide them.

    products.forEach((product) => {
      if (!product.category) return;

      const exists = [...categoryMap.values()].some(
        (category) =>
          category.name.toLowerCase() ===
          product.category.toLowerCase()
      );

      if (!exists) {
        categoryMap.set(product.category, {
          id: product.categoryId ?? product.category,
          name: product.category,
        });
      }
    });

    return [...categoryMap.values()];
  }, [categories, products]);

  // ====================================================
  // DYNAMIC FILTER OPTIONS
  // ====================================================

  const silhouetteOptions = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.silhouette)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  const stoneOptions = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.stone)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  const metalOptions = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.metal)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  const weightOptions = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.weight)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  const priceOptions = [
    "Budget Picks Under ₹499",
    "Festive Luxury ₹500 - ₹1,499",
    "Grand Bridal ₹1,500 - ₹3,500",
    "Premium Jewellery Above ₹3,500",
  ];

  // ====================================================
  // TOGGLE FILTERS
  // ====================================================

  const toggleFilter = (setter) => (value) => {
    setter((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };

  const toggleFavorite = (id) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const resetFilters = () => {
    setSelectedCategory("All Necklaces");
    setSelectedSilhouette([]);
    setSelectedStone([]);
    setSelectedPrice([]);
    setSelectedMetal([]);
    setSelectedWeight([]);
    setSortBy("featured");
  };

  // ====================================================
  // FILTER PRODUCTS
  // ====================================================

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const categoryMatch =
        selectedCategory === "All Necklaces" ||
        product.category.toLowerCase() ===
          selectedCategory.toLowerCase();

      const silhouetteMatch =
        selectedSilhouette.length === 0 ||
        selectedSilhouette.includes(product.silhouette);

      const stoneMatch =
        selectedStone.length === 0 ||
        selectedStone.includes(product.stone);

      const priceMatch =
        selectedPrice.length === 0 ||
        selectedPrice.includes(product.priceRange);

      const metalMatch =
        selectedMetal.length === 0 ||
        selectedMetal.includes(product.metal);

      const weightMatch =
        selectedWeight.length === 0 ||
        selectedWeight.includes(product.weight);

      return (
        categoryMatch &&
        silhouetteMatch &&
        stoneMatch &&
        priceMatch &&
        metalMatch &&
        weightMatch
      );
    });

    if (sortBy === "low") {
      result = [...result].sort(
        (a, b) => a.price - b.price
      );
    } else if (sortBy === "high") {
      result = [...result].sort(
        (a, b) => b.price - a.price
      );
    } else if (sortBy === "newest") {
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime() || 0;
        const dateB = new Date(b.createdAt).getTime() || 0;

        if (dateA !== dateB) {
          return dateB - dateA;
        }

        return Number(b.id) - Number(a.id);
      });
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedSilhouette,
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
      }}
    >
      {/* PAGE HEADER */}

      <Box
        sx={{
          px: { xs: 2, md: 4 },
          pt: 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: "8px",
            color: "#9b7a29",
            mb: 0.8,
          }}
        >
          Home › Jewellery › Necklaces
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                color: "#560914",
                fontSize: {
                  xs: "28px",
                  sm: "36px",
                  md: "43px",
                },
                lineHeight: 0.98,
                fontWeight: 500,
              }}
            >
              Necklaces, Chokers & Royal
              <br />
              Harams
            </Typography>

            <Typography
              sx={{
                mt: 1,
                maxWidth: 700,
                color: "#746966",
                fontSize: "9px",
                lineHeight: 1.5,
              }}
            >
              Explore handcrafted heritage jewellery, temple
              haarams, elegant chains and luminous stone chokers
              from the Zinora collection.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              display: { xs: "none", md: "flex" },
              width: 210,
              p: 1.5,
              alignItems: "center",
              gap: 1,
              border: "1px solid #eee7e0",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "#6c0d19",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
              }}
            >
              ♙
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#6c0d19",
                }}
              >
                Authentic Royal Finish
              </Typography>

              <Typography
                sx={{
                  fontSize: "7px",
                  color: "#777",
                  mt: 0.3,
                }}
              >
                Crafted for special moments
                <br />
                and everyday elegance.
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* DYNAMIC CATEGORY BUTTONS */}

        <Box
          sx={{
            display: "flex",
            gap: 1,
            mt: 2,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Button
            onClick={() => setSelectedCategory("All Necklaces")}
            sx={{
              flexShrink: 0,
              textTransform: "none",
              fontSize: "8px",
              px: 1.5,
              py: 0.7,
              minHeight: 28,
              borderRadius: "5px",
              backgroundColor:
                selectedCategory === "All Necklaces"
                  ? "#650c18"
                  : "#fff",
              color:
                selectedCategory === "All Necklaces"
                  ? "#fff"
                  : "#6a3333",
              border: "1px solid #eee6df",
              "&:hover": {
                backgroundColor: "#f5f0eb",
                color: "#650c18",
              },
            }}
          >
            All Necklaces ({products.length})
          </Button>

          {categoryOptions.map((category) => {
            const isSelected =
              selectedCategory === category.name;

            const count = products.filter(
              (product) =>
                product.category.toLowerCase() ===
                category.name.toLowerCase()
            ).length;

            return (
              <Button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(category.name)
                }
                sx={{
                  flexShrink: 0,
                  textTransform: "none",
                  fontSize: "8px",
                  px: 1.5,
                  py: 0.7,
                  minHeight: 28,
                  borderRadius: "5px",
                  backgroundColor: isSelected
                    ? "#650c18"
                    : "#fff",
                  color: isSelected ? "#fff" : "#6a3333",
                  border: "1px solid #eee6df",
                  "&:hover": {
                    backgroundColor: "#f5f0eb",
                    color: "#650c18",
                  },
                }}
              >
                {category.name} ({count})
              </Button>
            );
          })}
        </Box>

        {/* PRODUCT COUNT AND SORT */}

        <Paper
          elevation={0}
          sx={{
            mt: 2,
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
              fontSize: "9px",
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
            Zinora Collection
          </Typography>

          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              sx={{
                height: 30,
                fontSize: "9px",
                minWidth: 160,
                backgroundColor: "#fafafa",
                "& fieldset": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="featured">
                Sort: Featured
              </MenuItem>

              <MenuItem value="newest">
                Newest First
              </MenuItem>

              <MenuItem value="low">
                Price: Low to High
              </MenuItem>

              <MenuItem value="high">
                Price: High to Low
              </MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>

      {/* PRODUCTS SECTION */}

      <Box
        sx={{
          px: { xs: 2, md: 4 },
          mt: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "190px 1fr",
            md: "205px 1fr",
          },
          gap: 2,
          alignItems: "start",
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
              gap: 1,
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
                  fontSize: 12,
                  mr: 0.5,
                  verticalAlign: "middle",
                }}
              />
              Filters
            </Typography>

            <Button
              size="small"
              onClick={resetFilters}
              sx={{
                fontSize: "7px",
                color: "#9a731f",
                minWidth: 0,
                p: 0.3,
              }}
            >
              RESET ALL
            </Button>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* CATEGORY FILTER */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Categories
          </Typography>

          <FormGroup>
            {categoryOptions.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    checked={
                      selectedCategory === category.name
                    }
                    onChange={() =>
                      setSelectedCategory((previous) =>
                        previous === category.name
                          ? "All Necklaces"
                          : category.name
                      )
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
                    {category.name}
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

          {/* SILHOUETTE FILTER */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Silhouette & Style
          </Typography>

          {silhouetteOptions.length > 0 ? (
            <FilterCheckboxGroup
              items={silhouetteOptions}
              selected={selectedSilhouette}
              onToggle={toggleFilter(setSelectedSilhouette)}
            />
          ) : (
            <Typography
              sx={{ fontSize: "8px", color: "#999" }}
            >
              No style details available.
            </Typography>
          )}

          <Divider sx={{ my: 1.5 }} />

          {/* STONE FILTER */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
              mb: 0.7,
            }}
          >
            Stone & Karigari Work
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            {stoneOptions.length > 0 ? (
              stoneOptions.map((item) => {
                const selected = selectedStone.includes(item);

                return (
                  <Chip
                    key={item}
                    label={item}
                    size="small"
                    onClick={() =>
                      toggleFilter(setSelectedStone)(item)
                    }
                    sx={{
                      height: 23,
                      fontSize: "7px",
                      backgroundColor: selected
                        ? "#6c0d19"
                        : "#f4efea",
                      color: selected ? "#fff" : "#705c56",
                    }}
                  />
                );
              })
            ) : (
              <Typography
                sx={{ fontSize: "8px", color: "#999" }}
              >
                No stone details available.
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* PRICE FILTER */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            Price Range
          </Typography>

          <FilterCheckboxGroup
            items={priceOptions}
            selected={selectedPrice}
            onToggle={toggleFilter(setSelectedPrice)}
          />

          <Divider sx={{ my: 1.5 }} />

          {/* METAL FILTER */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            Base Metal & Skin Safe
          </Typography>

          {metalOptions.length > 0 ? (
            <FilterCheckboxGroup
              items={metalOptions}
              selected={selectedMetal}
              onToggle={toggleFilter(setSelectedMetal)}
            />
          ) : (
            <Typography
              sx={{
                fontSize: "8px",
                color: "#999",
                mt: 0.5,
              }}
            >
              No material details available.
            </Typography>
          )}

          <Divider sx={{ my: 1.5 }} />

          {/* WEIGHT FILTER */}

          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            Necklace Weight Profile
          </Typography>

          {weightOptions.length > 0 ? (
            <FilterCheckboxGroup
              items={weightOptions}
              selected={selectedWeight}
              onToggle={toggleFilter(setSelectedWeight)}
            />
          ) : (
            <Typography
              sx={{
                fontSize: "8px",
                color: "#999",
                mt: 0.5,
              }}
            >
              No weight details available.
            </Typography>
          )}

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
              ♢ Quality Promise
            </Typography>

            <Typography
              sx={{
                fontSize: "7px",
                color: "#777",
                mt: 0.5,
              }}
            >
              Explore jewellery crafted with care.
            </Typography>
          </Box>
        </Paper>

        {/* PRODUCT GRID */}

        <Box sx={{ minWidth: 0 }}>
          {loading ? (
            <Paper
              elevation={0}
              sx={{
                minHeight: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 1.5,
                border: "1px solid #ebe5df",
              }}
            >
              <CircularProgress
                size={30}
                sx={{ color: "#6c0d19" }}
              />

              <Typography sx={{ fontSize: 12 }}>
                Loading necklaces from Zinora...
              </Typography>
            </Paper>
          ) : error ? (
            <Paper
              elevation={0}
              sx={{
                minHeight: 260,
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 1.5,
                textAlign: "center",
                border: "1px solid #ebe5df",
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#6c0d19",
                }}
              >
                Unable to load necklaces
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#777",
                  overflowWrap: "anywhere",
                }}
              >
                {error}
              </Typography>

              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={() => setRetryKey((key) => key + 1)}
                sx={{
                  backgroundColor: "#6c0d19",
                  textTransform: "none",
                  fontSize: 11,
                  "&:hover": {
                    backgroundColor: "#4d0710",
                  },
                }}
              >
                Retry
              </Button>
            </Paper>
          ) : filteredProducts.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                minHeight: 260,
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 1.5,
                textAlign: "center",
                border: "1px solid #ebe5df",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  fontSize: 23,
                  color: "#560914",
                }}
              >
                No necklaces found
              </Typography>

              <Typography
                sx={{ fontSize: 10, color: "#777" }}
              >
                No products match the selected filters.
              </Typography>

              <Button
                onClick={resetFilters}
                sx={{
                  color: "#6c0d19",
                  textTransform: "none",
                  fontSize: 10,
                }}
              >
                Clear all filters
              </Button>
            </Paper>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: 1.5,
                alignContent: "start",
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* STYLIST CTA */}

      <Box
        sx={{
          px: { xs: 2, md: 4 },
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
              CAN'T DECIDE YOUR FIT?
            </Typography>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: "17px",
                color: "#6b101c",
              }}
            >
              Speak to Our Jewellery Stylist
            </Typography>

            <Typography
              sx={{
                fontSize: "8px",
                color: "#777",
              }}
            >
              Get personalized jewellery recommendations.
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
            ▣ STYLE ME ON WHATSAPP
          </Button>
        </Paper>
      </Box>

      {/* STYLING GUIDE */}

      <Box
        sx={{
          px: { xs: 2, md: 4 },
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
            fontSize: {
              xs: "24px",
              md: "30px",
            },
            mt: 0.5,
          }}
        >
          How to Pair Necklaces with Necklines
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
          Master the art of proportions. Pair your favourite
          jewellery with traditional and contemporary outfits.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1.5,
            mt: 3,
            textAlign: "left",
          }}
        >
          {[
            {
              title: "Deep V-Neck Blouse",
              text: "PAIRING: LONG HARAM OR Y-DROP",
            },
            {
              title: "Boat & Sabrina Neck",
              text: "PAIRING: REGAL COLLAR & HASLI",
            },
            {
              title: "Sweetheart Bridal Cut",
              text: "PAIRING: KUNDAN CHOKER STACK",
            },
            {
              title: "Collar Shirts & Blazers",
              text: "PAIRING: DUAL DAINTY CZ CHAINS",
            },
          ].map((item) => (
            <Paper
              key={item.title}
              elevation={0}
              sx={{
                p: 1.5,
                minHeight: 135,
                backgroundColor: "#f5f2ed",
                borderRadius: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#6b101c",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                ♡
              </Typography>

              <Typography
                sx={{
                  color: "#6b101c",
                  fontSize: "10px",
                  fontWeight: 700,
                  mt: 1,
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
                  fontSize: "8px",
                  lineHeight: 1.5,
                  mt: 1,
                }}
              >
                Discover elegant proportions for your
                favourite jewellery pieces.
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
            "Quality Promise",
            "Carefully selected jewellery",
          ],
          [
            "✧",
            "Elegant Designs",
            "Styles for everyday and celebrations",
          ],
          [
            "♕",
            "Crafted with Care",
            "Designed for modern jewellery lovers",
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
                width: 30,
                height: 30,
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

      {/* FEATURE ICONS */}

      <Box
        sx={{
          px: { xs: 2, md: 5 },
          py: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          textAlign: "center",
          gap: 3,
          backgroundColor: "#fff",
        }}
      >
        {[
          "Thoughtfully Selected Designs",
          "Customer-Focused Service",
          "Made for Every Occasion",
        ].map((item) => (
          <Box key={item}>
            <Typography
              sx={{
                color: "#9a731f",
                fontSize: "20px",
              }}
            >
              ✧
            </Typography>

            <Typography
              sx={{
                color: "#6b101c",
                fontSize: "9px",
                fontWeight: 700,
              }}
            >
              {item}
            </Typography>

            <Typography
              sx={{
                fontSize: "8px",
                color: "#777",
                mt: 0.5,
              }}
            >
              Explore the Zinora jewellery collection.
            </Typography>
          </Box>
        ))}
      </Box>

      {/* NEWSLETTER */}

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
              fontSize: "8px",
              color: "#777",
              maxWidth: 450,
            }}
          >
            Discover new arrivals, special collections and
            jewellery inspiration from Zinora.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          sx={{
            backgroundColor: "#680b18",
            fontSize: "8px",
            textTransform: "uppercase",
            "&:hover": {
              backgroundColor: "#4d0710",
            },
          }}
        >
          Explore Collection →
        </Button>
      </Box>
    </Box>
  );
}

export default Necklaces;