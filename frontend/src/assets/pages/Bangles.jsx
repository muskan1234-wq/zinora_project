
import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  Button,
  Paper,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  Divider,
  CircularProgress,
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const PRODUCTS_API = `${API_BASE}/api/products/`;
const CATEGORIES_API = `${API_BASE}/api/products/categories/`;

const heroImage =
  "https://trendia.co/cdn/shop/files/55027834_3.jpg?v=1780295367";

const sizeOptions = [
  "2.2 (XS) - 54 mm",
  "2.4 (S) - 57.2 mm",
  "2.6 - 60.3 mm",
  "2.8 (L) - 63.5 mm",
  "2.10 (XL) - 66.7 mm",
  "Free-Size / Openable",
];

const priceOptions = [
  "Under ₹299",
  "₹299 - ₹699",
  "₹699 - ₹1,499",
  "Royal Bridal ₹1,500+",
];

const getList = (data) => {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const getPrice = (price) => {
  if (typeof price === "number") return price;

  return Number(String(price ?? "").replace(/[₹,\s]/g, "")) || 0;
};

const formatPrice = (price) =>
  `₹${getPrice(price).toLocaleString("en-IN")}`;

const getImageUrl = (image) => {
  if (!image) return "";

  if (typeof image === "object") {
    image = image.url || image.image || image.src || "";
  }

  if (typeof image !== "string") return "";

  if (/^https?:\/\//i.test(image)) return image;

  return `${API_BASE}/${image.replace(/^\/+/, "")}`;
};

const normalizeProduct = (item, index) => {
  const category =
    typeof item.category === "object" && item.category !== null
      ? item.category.name || item.category.title || ""
      : item.category_name || item.category || "";

  const price = getPrice(
    item.price ?? item.selling_price ?? item.sale_price ?? 0
  );

  const oldPrice = getPrice(
    item.old_price ??
      item.original_price ??
      item.mrp ??
      item.compare_at_price ??
      0
  );

  const discount =
    oldPrice > price && oldPrice > 0
      ? `${Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF`
      : "";

  const rawImage =
    item.image ||
    item.image_url ||
    item.product_image ||
    item.thumbnail ||
    (Array.isArray(item.images) ? item.images[0] : "");

  const rawSizes = item.sizes || item.available_sizes || [];

  return {
    id: item.id ?? item.pk ?? index,
    name:
      item.name ||
      item.product_name ||
      item.title ||
      "Untitled Product",

    price,
    oldPrice,

    rating: Number(item.rating ?? item.average_rating ?? 0) || 0,

    reviews: Number(item.reviews ?? item.review_count ?? 0) || 0,

    badge: item.badge || item.tag || item.label || "",

    offer: item.offer || item.discount_label || discount,

    category:
      typeof category === "string" && category.trim()
        ? category.trim()
        : "Uncategorized",

    image: getImageUrl(rawImage),

    sizes: Array.isArray(rawSizes)
      ? rawSizes.map((size) =>
          typeof size === "object" ? size.name || size.label || "" : size
        )
      : [],

    isActive: item.is_active !== false,
  };
};

function ProductCard({ product, bag, onBagToggle }) {
  const isInBag = bag.includes(String(product.id));

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #ebe5df",
        borderRadius: "4px",
        overflow: "hidden",
        backgroundColor: "#fff",
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 5px 20px rgba(60,20,20,0.12)",
        },
      }}
    >
      <Box
        sx={{
          height: { xs: 160, sm: 190, md: 210 },
          position: "relative",
          backgroundColor: "#f5f2ed",
          overflow: "hidden",
        }}
      >
        {product.image ? (
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            loading="lazy"
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
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#987c70",
              fontSize: 11,
              p: 2,
              textAlign: "center",
            }}
          >
            Product image not available
          </Box>
        )}

        <Box
          sx={{
            position: "absolute",
            top: 6,
            left: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 0.5,
          }}
        >
          {product.badge && (
            <Typography
              sx={{
                backgroundColor: "#650c18",
                color: "#fff",
                fontSize: 8,
                fontWeight: 700,
                px: 0.7,
                py: 0.4,
              }}
            >
              {product.badge}
            </Typography>
          )}

          {product.offer && (
            <Typography
              sx={{
                backgroundColor: "#d50000",
                color: "#fff",
                fontSize: 8,
                fontWeight: 700,
                px: 0.7,
                py: 0.4,
              }}
            >
              {product.offer}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 1.3 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: "#5b101c",
            minHeight: 34,
          }}
        >
          {product.name}
        </Typography>

        {product.rating > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            <StarIcon sx={{ fontSize: 13, color: "#d39a16" }} />

            <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
              {product.rating.toFixed(1)}
            </Typography>

            {product.reviews > 0 && (
              <Typography sx={{ fontSize: 9, color: "#777" }}>
                ({product.reviews} reviews)
              </Typography>
            )}
          </Box>
        )}

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
              color: "#650c18",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {formatPrice(product.price)}
          </Typography>

          {product.oldPrice > product.price && (
            <Typography
              sx={{
                color: "#999",
                fontSize: 10,
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.oldPrice)}
            </Typography>
          )}
        </Box>

        {product.sizes.length > 0 && (
          <Typography
            sx={{
              mt: 0.8,
              fontSize: 9,
              color: "#777",
              lineHeight: 1.6,
            }}
          >
            Sizes: {product.sizes.join(", ")}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={() => onBagToggle(String(product.id))}
          sx={{
            mt: 1.5,
            backgroundColor: isInBag ? "#fff" : "#650c18",
            color: isInBag ? "#650c18" : "#fff",
            border: "1px solid #650c18",
            fontSize: 10,
            fontWeight: 700,
            borderRadius: "3px",
            py: 1,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: isInBag ? "#f8eeee" : "#450710",
              boxShadow: "none",
            },
          }}
        >
          {isInBag ? "REMOVE FROM BAG" : "ADD TO BAG"}
        </Button>
      </Box>
    </Paper>
  );
}

export default function Bangles() {
  const [products, setProducts] = useState([]);
  const [backendCategories, setBackendCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  const [activeCategory, setActiveCategory] = useState(
    "All Bangles & Kadas"
  );

  const [sort, setSort] = useState("featured");

  const [selectedSizes, setSelectedSizes] = useState([
    "2.6 - 60.3 mm",
    "Free-Size / Openable",
  ]);

  const [selectedPrices, setSelectedPrices] = useState([
    "₹299 - ₹699",
    "₹699 - ₹1,499",
  ]);

  const [bag, setBag] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const [productsResponse, categoriesResponse] =
          await Promise.all([
            fetch(PRODUCTS_API),
            fetch(CATEGORIES_API).catch(() => null),
          ]);

        if (!productsResponse.ok) {
          throw new Error(
            `Products API returned HTTP ${productsResponse.status}`
          );
        }

        const productsData = await productsResponse.json();

        let categoriesData = [];

        if (categoriesResponse?.ok) {
          categoriesData = getList(await categoriesResponse.json());
        }

        const normalizedProducts = getList(productsData)
          .filter((item) => item.is_active !== false)
          .map(normalizeProduct);

        const normalizedCategories = categoriesData
          .filter((item) => item.is_active !== false)
          .map((item) =>
            typeof item === "string"
              ? item
              : item.name || item.title || ""
          )
          .filter(Boolean);

        if (!cancelled) {
          setProducts(normalizedProducts);
          setBackendCategories(normalizedCategories);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Products load nahi ho paye. Backend connection check karo."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [reload]);

  const categories = useMemo(() => {
    const allNames = [
      ...backendCategories,
      ...products.map((product) => product.category),
    ];

    const uniqueNames = [];
    const seen = new Set();

    allNames.forEach((name) => {
      const cleanName = String(name || "").trim();

      if (!cleanName) return;

      const key = cleanName.toLowerCase();

      if (
        key === "uncategorized" ||
        key === "all bangles & kadas" ||
        seen.has(key)
      ) {
        return;
      }

      seen.add(key);
      uniqueNames.push(cleanName);
    });

    return ["All Bangles & Kadas", ...uniqueNames];
  }, [backendCategories, products]);

  const handleBagToggle = (id) => {
    setBag((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((previous) =>
      previous.includes(size)
        ? previous.filter((item) => item !== size)
        : [...previous, size]
    );
  };

  const handlePriceChange = (price) => {
    setSelectedPrices((previous) =>
      previous.includes(price)
        ? previous.filter((item) => item !== price)
        : [...previous, price]
    );
  };

  const resetFilters = () => {
    setSelectedSizes([]);
    setSelectedPrices([]);
    setActiveCategory("All Bangles & Kadas");
    setSort("featured");
  };

  const matchesPrice = (price) => {
    if (selectedPrices.length === 0) return true;

    const ranges = {
      "Under ₹299": (value) => value < 299,
      "₹299 - ₹699": (value) => value >= 299 && value <= 699,
      "₹699 - ₹1,499": (value) => value > 699 && value <= 1499,
      "Royal Bridal ₹1,500+": (value) => value >= 1500,
    };

    return selectedPrices.some((range) => ranges[range]?.(price));
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        activeCategory === "All Bangles & Kadas" ||
        product.category.toLowerCase() === activeCategory.toLowerCase();

      const sizeMatch =
        selectedSizes.length === 0 ||
        product.sizes.some((size) => selectedSizes.includes(size));

      const priceMatch = matchesPrice(product.price);

      return categoryMatch && sizeMatch && priceMatch;
    });
  }, [products, activeCategory, selectedSizes, selectedPrices]);

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [filteredProducts, sort]);

  return (
    <Box
      sx={{
        backgroundColor: "#faf9f7",
        minHeight: "100vh",
        color: "#4d1717",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: { xs: 2, md: 5 },
          py: 1.5,
          backgroundColor: "#fff",
          borderBottom: "1px solid #eee6df",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            border: "1px solid #8c6a25",
            color: "#650c18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Georgia, serif",
            fontSize: 22,
          }}
        >
          Z
        </Box>

        <Box>
          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              color: "#650c18",
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: 2,
              lineHeight: 1,
            }}
          >
            ZINORA
          </Typography>

          <Typography
            sx={{
              color: "#9a731f",
              fontSize: 7,
              letterSpacing: 3,
              mt: 0.5,
            }}
          >
            ATELIER
          </Typography>
        </Box>
      </Box>

      {/* PAGE CONTENT */}
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 1.5, pb: 4 }}>
        <Typography
          sx={{ fontSize: 10, color: "#9b7a29", mb: 1.5 }}
        >
          Home › Jewellery › Bangles & Kadas
        </Typography>

        {/* HERO */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.25fr 0.75fr",
            },
            gap: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#f6f1eb",
              p: { xs: 2, md: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "#9a731f",
                fontSize: 10,
                letterSpacing: 1.5,
                fontWeight: 700,
              }}
            >
              HEIRLOOM ARTISTRY • ANTI-TARNISH FINISH
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontFamily: "Georgia, serif",
                color: "#560914",
                fontSize: { xs: 32, sm: 40, md: 47 },
                lineHeight: 1.1,
                mt: 1,
              }}
            >
              Imperial Kadas &
              <br />
              Openable Bangles
            </Typography>

            <Typography
              sx={{
                color: "#746966",
                fontSize: 12,
                lineHeight: 1.8,
                mt: 1.5,
              }}
            >
              Discover traditional Rajwadi kadas, temple jewellery,
              bridal bangles and everyday styles with timeless royal
              elegance.
            </Typography>
          </Box>

          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 230, md: 300 },
              overflow: "hidden",
              backgroundColor: "#eee8df",
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt="Zinora Royal Bangles"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              sx={{
                width: "100%",
                height: "100%",
                minHeight: { xs: 230, md: 300 },
                objectFit: "cover",
                display: "block",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                backgroundColor: "rgba(255,255,255,0.95)",
                p: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#9a731f",
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  SPOTLIGHT TROUSSEAU
                </Typography>

                <Typography
                  sx={{
                    color: "#5b101c",
                    fontSize: 12,
                    fontWeight: 700,
                    mt: 0.5,
                  }}
                >
                  Explore Royal Bangles
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#650c18",
                  fontSize: 11,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                ZINORA
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* SORTING */}
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 1.5,
            border: "1px solid #eee8e2",
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 700 }}>
            {loading ? "Loading products..." : `${sortedProducts.length} Pieces`}
            <Box
              component="span"
              sx={{ color: "#aaa", mx: 1 }}
            >
              |
            </Box>
            Jaipur & Rajkot Ateliers
          </Typography>

          <FormControl size="small">
            <Select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              inputProps={{ "aria-label": "Sort products" }}
              sx={{
                height: 34,
                fontSize: 11,
                minWidth: { xs: 155, sm: 190 },
                backgroundColor: "#fff",
              }}
            >
              <MenuItem value="featured">
                Sort: Featured & Bestsellers
              </MenuItem>
              <MenuItem value="low">Price: Low to High</MenuItem>
              <MenuItem value="high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Top Rated</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* SIDEBAR + PRODUCTS */}
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "220px minmax(0, 1fr)",
            },
            gap: 2,
            alignItems: "start",
          }}
        >
          {/* SIDEBAR */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 0,
            }}
          >
            {/* DYNAMIC CATEGORIES */}
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                border: "1px solid #ebe5df",
                backgroundColor: "#fff",
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#5b101c",
                  mb: 1,
                }}
              >
                CATEGORIES
              </Typography>

              <Divider sx={{ mb: 1 }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    sx={{
                      justifyContent: "flex-start",
                      textAlign: "left",
                      textTransform: "none",
                      fontSize: 11,
                      lineHeight: 1.5,
                      px: 1,
                      py: 1,
                      borderRadius: "3px",
                      color:
                        activeCategory === category
                          ? "#650c18"
                          : "#6a3333",
                      backgroundColor:
                        activeCategory === category
                          ? "#f6eceb"
                          : "#fff",
                      borderLeft:
                        activeCategory === category
                          ? "3px solid #650c18"
                          : "3px solid transparent",
                      "&:hover": {
                        backgroundColor: "#f6eceb",
                      },
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </Box>
            </Paper>

            {/* FILTERS */}
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                border: "1px solid #ebe5df",
                backgroundColor: "#fff",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#5b101c",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FilterListIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Filters
                </Typography>

                <Button
                  onClick={resetFilters}
                  size="small"
                  sx={{
                    fontSize: 9,
                    color: "#9a731f",
                    minWidth: 0,
                  }}
                >
                  RESET ALL
                </Button>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* SIZE FILTER */}
              <Typography
                sx={{ fontSize: 11, fontWeight: 700, mb: 0.5 }}
              >
                Bangle Size
              </Typography>

              <FormGroup>
                {sizeOptions.map((item) => (
                  <FormControlLabel
                    key={item}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedSizes.includes(item)}
                        onChange={() => handleSizeChange(item)}
                        sx={{
                          p: 0.3,
                          "& .MuiSvgIcon-root": { fontSize: 16 },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 10 }}>
                        {item}
                      </Typography>
                    }
                    sx={{ m: 0, minHeight: 25 }}
                  />
                ))}
              </FormGroup>

              <Divider sx={{ my: 1.5 }} />

              {/* PRICE FILTER */}
              <Typography
                sx={{ fontSize: 11, fontWeight: 700, mb: 0.5 }}
              >
                Price Range
              </Typography>

              <FormGroup>
                {priceOptions.map((item) => (
                  <FormControlLabel
                    key={item}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedPrices.includes(item)}
                        onChange={() => handlePriceChange(item)}
                        sx={{
                          p: 0.3,
                          "& .MuiSvgIcon-root": { fontSize: 16 },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 10 }}>
                        {item}
                      </Typography>
                    }
                    sx={{ m: 0, minHeight: 25 }}
                  />
                ))}
              </FormGroup>
            </Paper>
          </Box>

          {/* PRODUCT GRID */}
          <Box sx={{ minWidth: 0 }}>
            {loading ? (
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  textAlign: "center",
                  border: "1px solid #ebe5df",
                  backgroundColor: "#fff",
                }}
              >
                <CircularProgress sx={{ color: "#650c18" }} />

                <Typography sx={{ mt: 2, fontSize: 12 }}>
                  Loading products from backend...
                </Typography>
              </Paper>
            ) : error ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  border: "1px solid #ebe5df",
                  backgroundColor: "#fff",
                }}
              >
                <Typography
                  sx={{
                    color: "#650c18",
                    fontFamily: "Georgia, serif",
                    fontSize: 20,
                  }}
                >
                  Unable to load products
                </Typography>

                <Typography sx={{ fontSize: 12, mt: 1 }}>
                  {error}
                </Typography>

                <Button
                  onClick={() => setReload((value) => value + 1)}
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#650c18",
                    "&:hover": { backgroundColor: "#450710" },
                  }}
                >
                  Try Again
                </Button>
              </Paper>
            ) : sortedProducts.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 1.5,
                  alignContent: "start",
                }}
              >
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    bag={bag}
                    onBagToggle={handleBagToggle}
                  />
                ))}
              </Box>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  border: "1px solid #ebe5df",
                  backgroundColor: "#fff",
                }}
              >
                <Typography
                  sx={{
                    color: "#650c18",
                    fontFamily: "Georgia, serif",
                    fontSize: 20,
                  }}
                >
                  No designs found
                </Typography>

                <Typography sx={{ fontSize: 12, mt: 1 }}>
                  Try changing your category, size, or price filters.
                  If your database has no matching products, add them
                  from the admin dashboard.
                </Typography>

                <Button
                  onClick={resetFilters}
                  sx={{ mt: 1, color: "#650c18" }}
                >
                  Clear Filters
                </Button>
              </Paper>
            )}
          </Box>
        </Box>

        {/* BAG COUNT */}
        <Box
          sx={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 10,
          }}
        >
          {bag.length > 0 && (
            <Paper
              elevation={4}
              sx={{
                px: 2,
                py: 1.2,
                backgroundColor: "#650c18",
                color: "#fff",
                borderRadius: "4px",
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                Bag: {bag.length} {bag.length === 1 ? "item" : "items"}
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
