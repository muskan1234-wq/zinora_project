
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Container,
  Typography,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  Button,
  Switch,
  CircularProgress,
} from "@mui/material";

import {
  FavoriteBorder,
  Favorite,
  GridView,
  ViewComfy,
  ChevronRight,
  Star,
  LocalShippingOutlined,
  VerifiedOutlined,
  SecurityOutlined,
  HandshakeOutlined,
  ArrowForward,
  Refresh,
} from "@mui/icons-material";

/*
=========================================================
API CONFIGURATION
=========================================================
Django backend:
http://127.0.0.1:8000

Products:
GET /api/products/

Categories:
GET /api/categories/
=========================================================
*/
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const PRODUCTS_API = `${API_BASE}/api/products/`;
const CATEGORIES_API = `${API_BASE}/api/products/categories/`;

const quickFilters = [
  "Just Dropped",
  "Under ₹299",
  "Festive Polki",
  "Anti-Tarnish Dailywear",
  "Temple Jewels",
];

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

const getDiscount = (price, originalPrice) => {
  const current = Number(price || 0);
  const original = Number(originalPrice || 0);

  if (!original || original <= current) return 0;

  return Math.round(((original - current) / original) * 100);
};

const getImageUrl = (product) => {
  const image = product?.image_url || product?.image;

  if (!image) return "";

  if (typeof image === "object") {
    return image.url || image.image_url || "";
  }

  if (/^(https?:\/\/|data:|blob:)/i.test(image)) {
    return image;
  }

  return `${API_BASE}/${String(image).replace(/^\/+/, "")}`;
};

const getProductCategory = (product) =>
  product.category_name ||
  product.category?.name ||
  product.category_detail?.name ||
  (typeof product.category === "string" ? product.category : "");

const normalizeProduct = (product) => {
  const price = Number(product.price || 0);
  const originalPrice =
    product.original_price === null ||
    product.original_price === undefined ||
    product.original_price === ""
      ? null
      : Number(product.original_price);

  return {
    ...product,
    id: product.id,
    name: product.name || "Untitled Product",
    desc: product.description || "",
    price,
    old: originalPrice,
    discount: getDiscount(price, originalPrice),
    cat: getProductCategory(product),
    img: getImageUrl(product),
    badge: product.is_new_arrival
      ? "NEW ARRIVAL"
      : product.is_featured
        ? "FEATURED"
        : "",
    stock: Number(product.stock_quantity || 0),
    createdAt: product.created_at
      ? new Date(product.created_at).getTime()
      : 0,
  };
};

const unwrapResults = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

/*
=========================================================
MAIN COMPONENT
=========================================================
*/

function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Just Dropped");
  const [sort, setSort] = useState("Newest First");
  const [columns, setColumns] = useState(4);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [shippingOnly, setShippingOnly] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(PRODUCTS_API),
        fetch(CATEGORIES_API),
      ]);

      if (!productsResponse.ok) {
        throw new Error(
          `Products API error (${productsResponse.status}).`
        );
      }

      if (!categoriesResponse.ok) {
        throw new Error(
          `Categories API error (${categoriesResponse.status}).`
        );
      }

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      const productList = unwrapResults(productsData)
        .filter(
          (product) =>
            product.is_active === true &&
            product.is_new_arrival === true
        )
        .map(normalizeProduct);

      const categoryList = unwrapResults(categoriesData).filter(
        (category) => category.is_active === true
      );

      setProducts(productList);
      setCategories(categoryList);
      setPage(1);
    } catch (err) {
      console.error("New Arrivals API error:", err);

      setError(
        `${err.message} Please ensure Django is running and the API URLs are correct.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleCategory = (categoryName) => {
    setSelectedCategories((current) =>
      current.includes(categoryName)
        ? current.filter((item) => item !== categoryName)
        : [...current, categoryName]
    );

    setPage(1);
  };

  const togglePriceRange = (range) => {
    setSelectedPriceRanges((current) =>
      current.includes(range)
        ? current.filter((item) => item !== range)
        : [...current, range]
    );

    setPage(1);
  };

  const clearFilters = () => {
    setActiveFilter("Just Dropped");
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setShippingOnly(false);
    setSort("Newest First");
    setPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeFilter === "Under ₹299") {
      result = result.filter((product) => product.price <= 299);
    }

    if (activeFilter === "Festive Polki") {
      result = result.filter(
        (product) =>
          /polki|bridal|festive|kundan/i.test(
            `${product.name} ${product.desc} ${product.cat}`
          )
      );
    }

    if (activeFilter === "Anti-Tarnish Dailywear") {
      result = result.filter((product) =>
        /anti.?tarnish|daily|everyday|waterproof/i.test(
          `${product.name} ${product.desc}`
        )
      );
    }

    if (activeFilter === "Temple Jewels") {
      result = result.filter((product) =>
        /temple|haram|heritage/i.test(
          `${product.name} ${product.desc} ${product.cat}`
        )
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.cat)
      );
    }

    if (selectedPriceRanges.length > 0) {
      result = result.filter((product) =>
        selectedPriceRanges.some((range) => {
          if (range === "under199") return product.price < 199;
          if (range === "199to499")
            return product.price >= 199 && product.price <= 499;
          if (range === "499to999")
            return product.price > 499 && product.price <= 999;
          if (range === "999plus") return product.price > 999;
          return true;
        })
      );
    }

    if (shippingOnly) {
      result = result.filter((product) => product.stock > 0);
    }

    if (sort === "Price Low-High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "Price High-Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "Newest First") {
      result.sort((a, b) => b.createdAt - a.createdAt);
    }

    return result;
  }, [
    products,
    activeFilter,
    selectedCategories,
    selectedPriceRanges,
    shippingOnly,
    sort,
  ]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, sort, selectedCategories, selectedPriceRanges, shippingOnly]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / pageSize)
  );

  const visibleProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Box
      sx={{
        backgroundColor: "#fbf9f6",
        color: "#1b1c1a",
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
      }}
    >
      <HeroSection />

      <FilterBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sort={sort}
        setSort={setSort}
        columns={columns}
        setColumns={setColumns}
        productCount={filteredProducts.length}
      />

      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "205px minmax(0, 1fr)",
            },
            gap: 2,
          }}
        >
          <Sidebar
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            selectedPriceRanges={selectedPriceRanges}
            togglePriceRange={togglePriceRange}
            shippingOnly={shippingOnly}
            setShippingOnly={setShippingOnly}
            clearFilters={clearFilters}
          />

          <Box>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2, alignItems: "center" }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={<Refresh />}
                    onClick={fetchProducts}
                  >
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
                  minHeight: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <CircularProgress sx={{ color: "#390009" }} />
                <Typography fontSize={13} color="#877272">
                  Loading Zinora collections...
                </Typography>
              </Box>
            ) : !error && visibleProducts.length === 0 ? (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5dfda",
                  py: 7,
                  px: 2,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 25,
                    color: "#390009",
                  }}
                >
                  No products found
                </Typography>

                <Typography
                  sx={{ color: "#877272", fontSize: 12, mt: 1 }}
                >
                  No active New Arrivals match these filters.
                </Typography>

                <Button
                  onClick={clearFilters}
                  sx={{
                    mt: 2,
                    color: "#390009",
                    textTransform: "none",
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0, 1fr))",
                      sm: `repeat(${columns}, minmax(0, 1fr))`,
                    },
                    gap: 1.1,
                  }}
                >
                  {visibleProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      favorite={favorites.includes(product.id)}
                      onFavorite={() => toggleFavorite(product.id)}
                    />
                  ))}
                </Box>

                <Editorial />

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalItems={filteredProducts.length}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              </>
            )}
          </Box>
        </Box>
      </Container>

      <Guarantees />
      <ValueProps />
    </Box>
  );
}

/*
=========================================================
HERO SECTION
=========================================================
*/

function HeroSection() {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(90deg,#f5f2ed 0%,#fff1f0 52%,#fbf4df 100%)",
        borderBottom: "1px solid #e5dfda",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 1.8 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.8,
            backgroundColor: "#fff",
            borderRadius: 2,
            px: 1.2,
            py: 0.6,
            mb: 1.2,
            boxShadow: "0 1px 4px #00000012",
          }}
        >
          <Box
            sx={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              backgroundColor: "#edd17f",
              animation: "zinoraBlink 1.2s ease-in-out infinite",
              "@keyframes zinoraBlink": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.3 },
              },
            }}
          />

          <Typography
            sx={{
              fontSize: 9,
              letterSpacing: 1,
              color: "#554242",
            }}
          >
            THE LATEST ZINORA COLLECTION
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ maxWidth: 650 }}>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: { xs: 30, md: 42 },
                lineHeight: 1.05,
                color: "#390009",
              }}
            >
              Fresh Karigari &{" "}
              <Box
                component="span"
                sx={{ fontStyle: "italic", fontWeight: 400 }}
              >
                Modern
                <br />
                Silhouettes
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: 11,
                color: "#877272",
                lineHeight: 1.7,
                mt: 1,
                maxWidth: 520,
              }}
            >
              Discover the latest jewellery collection, handcrafted details,
              elegant finishes and statement designs from Zinora.
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <AssuranceCard
              icon={<VerifiedOutlined />}
              title="PURITY ASSURED"
              text="Quality Checked"
            />

            <AssuranceCard
              icon={<LocalShippingOutlined />}
              title="EXPRESS DISPATCH"
              text="Reliable Delivery"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function AssuranceCard({ icon, title, text }) {
  return (
    <Box
      sx={{
        width: 145,
        backgroundColor: "#fff",
        p: 1.2,
        display: "flex",
        gap: 0.8,
        alignItems: "center",
        borderRadius: 1,
      }}
    >
      <Box sx={{ color: "#735c00", "& svg": { fontSize: 22 } }}>
        {icon}
      </Box>

      <Box>
        <Typography sx={{ fontSize: 8, color: "#877272" }}>
          {title}
        </Typography>

        <Typography
          sx={{ fontSize: 10, fontWeight: 700, color: "#390009" }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
}

/*
=========================================================
TOP FILTER BAR
=========================================================
*/

function FilterBar({
  activeFilter,
  setActiveFilter,
  sort,
  setSort,
  columns,
  setColumns,
  productCount,
}) {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5dfda",
        borderTop: "1px solid #e5dfda",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            py: 1,
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Typography
            sx={{ fontSize: 10, color: "#877272", whiteSpace: "nowrap" }}
          >
            Home
          </Typography>

          <ChevronRight sx={{ fontSize: 13, color: "#aaa" }} />

          <Typography
            sx={{ fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}
          >
            New Arrivals
          </Typography>

          <Chip
            label={`${productCount} Designs`}
            size="small"
            sx={{ height: 25, fontSize: 9, ml: 0.5 }}
          />

          {quickFilters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onClick={() => setActiveFilter(filter)}
              size="small"
              sx={{
                height: 27,
                fontSize: 9,
                backgroundColor:
                  activeFilter === filter ? "#390009" : "#fff",
                color: activeFilter === filter ? "#fff" : "#554242",
                border: "1px solid #e5dfda",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            />
          ))}

          <Box sx={{ flex: 1, minWidth: 8 }} />

          <IconButton
            size="small"
            aria-label="Show three columns"
            onClick={() => setColumns(3)}
            sx={{
              display: { xs: "none", md: "flex" },
              backgroundColor: columns === 3 ? "#f1ece8" : "transparent",
            }}
          >
            <GridView sx={{ fontSize: 16 }} />
          </IconButton>

          <IconButton
            size="small"
            aria-label="Show four columns"
            onClick={() => setColumns(4)}
            sx={{
              display: { xs: "none", md: "flex" },
              backgroundColor: columns === 4 ? "#f1ece8" : "transparent",
            }}
          >
            <ViewComfy sx={{ fontSize: 16 }} />
          </IconButton>

          <FormControl size="small" sx={{ minWidth: 135 }}>
            <Select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              sx={{
                height: 30,
                fontSize: 10,
                backgroundColor: "#fff",
              }}
            >
              <MenuItem value="Newest First">Newest First</MenuItem>
              <MenuItem value="Price Low-High">Price Low-High</MenuItem>
              <MenuItem value="Price High-Low">Price High-Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Container>
    </Box>
  );
}

/*
=========================================================
SIDEBAR
=========================================================
*/

function Sidebar({
  categories,
  selectedCategories,
  toggleCategory,
  selectedPriceRanges,
  togglePriceRange,
  shippingOnly,
  setShippingOnly,
  clearFilters,
}) {
  const priceRanges = [
    { label: "Under ₹199", value: "under199" },
    { label: "₹199 - ₹499", value: "199to499" },
    { label: "₹499 - ₹999", value: "499to999" },
    { label: "₹999 & Above", value: "999plus" },
  ];

  return (
    <Box sx={{ fontSize: 10 }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #e5dfda",
          p: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.2,
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
            Filter By
          </Typography>

          <Button
            onClick={clearFilters}
            sx={{
              minWidth: 0,
              p: 0,
              fontSize: 8,
              color: "#735c00",
            }}
          >
            CLEAR ALL
          </Button>
        </Box>

        <Box
          sx={{
            backgroundColor: "#f6f3ee",
            p: 1,
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 0.6,
          }}
        >
          <LocalShippingOutlined sx={{ fontSize: 16, color: "#735c00" }} />

          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 9 }}>In Stock Only</Typography>
            <Typography sx={{ fontSize: 8, color: "#877272" }}>
              Available products
            </Typography>
          </Box>

          <Switch
            size="small"
            checked={shippingOnly}
            onChange={(event) => setShippingOnly(event.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#390009",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#390009",
              },
            }}
          />
        </Box>

        <FilterGroup title="JEWELLERY TYPE">
          {categories.length === 0 ? (
            <Typography sx={{ fontSize: 9, color: "#877272" }}>
              No active categories
            </Typography>
          ) : (
            categories.map((category) => (
              <CheckRow
                key={category.id}
                label={category.name}
                checked={selectedCategories.includes(category.name)}
                onChange={() => toggleCategory(category.name)}
              />
            ))
          )}
        </FilterGroup>

        <FilterGroup title="PRICE RANGE">
          {priceRanges.map((range) => (
            <CheckRow
              key={range.value}
              label={range.label}
              checked={selectedPriceRanges.includes(range.value)}
              onChange={() => togglePriceRange(range.value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="COLLECTION">
          <Typography sx={{ fontSize: 9, color: "#877272", lineHeight: 1.7 }}>
            Use the quick filters above to explore affordable, festive and
            everyday styles.
          </Typography>
        </FilterGroup>
      </Box>

      <Box
        sx={{
          mt: 1,
          backgroundColor: "#390009",
          color: "#fff",
          p: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 8, letterSpacing: 1 }}>
          ZINORA CONCIERGE
        </Typography>

        <Typography
          sx={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 17,
            lineHeight: 1.2,
            mt: 0.7,
          }}
        >
          Find your signature style
        </Typography>

        <Typography sx={{ fontSize: 9, opacity: 0.8, mt: 0.7 }}>
          Explore designs for everyday wear and special occasions.
        </Typography>
      </Box>
    </Box>
  );
}

function FilterGroup({ title, children }) {
  return (
    <Box sx={{ mb: 1.8 }}>
      <Typography
        sx={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: 1,
          mb: 0.7,
        }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
}

function CheckRow({ label, checked, onChange }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 0.4 }}>
      <Checkbox
        size="small"
        checked={checked}
        onChange={onChange}
        sx={{
          p: 0,
          mr: 0.5,
          "& svg": { fontSize: 15 },
        }}
      />

      <Typography
        onClick={onChange}
        sx={{
          fontSize: 9,
          flex: 1,
          lineHeight: 1.4,
          cursor: "pointer",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

/*
=========================================================
PRODUCT CARD
=========================================================
*/

function ProductCard({ product, favorite, onFavorite }) {
  const [imageFailed, setImageFailed] = useState(false);

  const discount = getDiscount(product.price, product.old);
  const hasImage = Boolean(product.img) && !imageFailed;

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        border: "1px solid #e7e1dc",
        minWidth: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          aspectRatio: "0.82",
          overflow: "hidden",
          backgroundColor: "#eee9e3",
        }}
      >
        {hasImage ? (
          <Box
            component="img"
            src={product.img}
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
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: 11, color: "#877272" }}>
              Product image unavailable
            </Typography>
          </Box>
        )}

        {product.badge && (
          <Chip
            label={product.badge}
            size="small"
            sx={{
              position: "absolute",
              top: 5,
              left: 5,
              height: 20,
              maxWidth: "75%",
              backgroundColor: "#390009",
              color: "#fff",
              fontSize: 7,
              fontWeight: 700,
              borderRadius: 0.3,
            }}
          />
        )}

        <IconButton
          onClick={onFavorite}
          size="small"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            backgroundColor: "#fff",
            width: 28,
            height: 28,
            "&:hover": { backgroundColor: "#fff" },
          }}
        >
          {favorite ? (
            <Favorite sx={{ fontSize: 15, color: "#390009" }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: 15 }} />
          )}
        </IconButton>

        {discount > 0 && (
          <Chip
            label={`${discount}% OFF`}
            size="small"
            sx={{
              position: "absolute",
              bottom: 5,
              left: 5,
              height: 20,
              backgroundColor: "#fed65b",
              color: "#390009",
              fontSize: 8,
              fontWeight: 700,
            }}
          />
        )}

        {product.stock === 0 && (
          <Chip
            label="OUT OF STOCK"
            size="small"
            sx={{
              position: "absolute",
              bottom: 5,
              right: 5,
              height: 20,
              backgroundColor: "#fff",
              color: "#390009",
              fontSize: 7,
              fontWeight: 700,
            }}
          />
        )}
      </Box>

      <Box sx={{ p: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
          <Star sx={{ fontSize: 12, color: "#735c00" }} />

          <Typography sx={{ fontSize: 8, color: "#877272" }}>
            Zinora Collection
          </Typography>
        </Box>

        <Typography
          title={product.name}
          sx={{
            fontSize: 11,
            fontWeight: 700,
            lineHeight: 1.5,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: 33,
            mt: 0.4,
          }}
        >
          {product.name}
        </Typography>

        <Typography
          title={product.desc}
          sx={{
            fontSize: 9,
            color: "#877272",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: 26,
            mt: 0.3,
          }}
        >
          {product.desc || product.cat || "Explore this Zinora design"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0.6,
            mt: 0.8,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 800,
              color: "#390009",
            }}
          >
            ₹{formatPrice(product.price)}
          </Typography>

          {product.old !== null &&
            product.old !== undefined &&
            product.old > product.price && (
              <Typography
                sx={{
                  fontSize: 9,
                  color: "#999",
                  textDecoration: "line-through",
                }}
              >
                ₹{formatPrice(product.old)}
              </Typography>
            )}
        </Box>

        {product.cat && (
          <Typography
            sx={{
              fontSize: 8,
              color: "#735c00",
              mt: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.cat}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/*
=========================================================
EDITORIAL
=========================================================
*/

function Editorial() {
  return (
    <Box
      sx={{
        mt: 1.5,
        backgroundColor: "#eeece8",
        p: { xs: 1.5, md: 2 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Box>
        <Typography sx={{ fontSize: 8, color: "#735c00", letterSpacing: 1 }}>
          THE ZINORA STANDARD
        </Typography>

        <Typography
          sx={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: { xs: 16, md: 20 },
            color: "#390009",
            mt: 0.4,
          }}
        >
          Jewellery for Every Special Moment
        </Typography>

        <Typography
          sx={{
            fontSize: 9,
            color: "#877272",
            mt: 0.5,
            maxWidth: 580,
            lineHeight: 1.6,
          }}
        >
          Discover distinctive designs and find pieces that complement your
          personal style.
        </Typography>
      </Box>

      <Button
        variant="contained"
        endIcon={<ArrowForward />}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        sx={{
          backgroundColor: "#58111a",
          fontSize: 10,
          textTransform: "none",
          "&:hover": { backgroundColor: "#390009" },
        }}
      >
        Explore Collection
      </Button>
    </Box>
  );
}

/*
=========================================================
DYNAMIC PAGINATION
=========================================================
*/

function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <Box
      sx={{
        mt: 1.5,
        backgroundColor: "#fff",
        border: "1px solid #e5dfda",
        p: 1.2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        flexWrap: "wrap",
      }}
    >
      <Typography sx={{ fontSize: 9, color: "#877272" }}>
        Showing <b>{start}–{end}</b> of <b>{totalItems}</b> designs
      </Typography>

      <Box sx={{ display: "flex", gap: 0.4, alignItems: "center" }}>
        <Button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          sx={{
            minWidth: 35,
            height: 28,
            fontSize: 10,
            color: "#390009",
          }}
        >
          Prev
        </Button>

        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .filter(
            (pageNumber) =>
              pageNumber === 1 ||
              pageNumber === totalPages ||
              Math.abs(pageNumber - page) <= 1
          )
          .map((pageNumber, index, array) => (
            <React.Fragment key={pageNumber}>
              {index > 0 && pageNumber - array[index - 1] > 1 && (
                <Typography sx={{ fontSize: 10 }}>...</Typography>
              )}

              <Button
                onClick={() => onPageChange(pageNumber)}
                sx={{
                  minWidth: 28,
                  height: 28,
                  p: 0,
                  fontSize: 10,
                  color: page === pageNumber ? "#fff" : "#554242",
                  backgroundColor:
                    page === pageNumber ? "#390009" : "#f8f6f3",
                  "&:hover": {
                    backgroundColor:
                      page === pageNumber ? "#58111a" : "#eee8e2",
                  },
                }}
              >
                {pageNumber}
              </Button>
            </React.Fragment>
          ))}

        <Button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          sx={{
            minWidth: 40,
            height: 28,
            fontSize: 10,
            color: "#390009",
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}


function Guarantees() {
  const items = [
    {
      title: "Customer-Focused Service",
      text: "A thoughtful shopping experience from selection to delivery.",
      Icon: SecurityOutlined,
    },
    {
      title: "Easy Exchange Assistance",
      text: "Contact our team for help with exchange requests.",
      Icon: ArrowForward,
    },
    {
      title: "Quality-Conscious Designs",
      text: "Explore jewellery selected for style and everyday elegance.",
      Icon: VerifiedOutlined,
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#f5f3f0", py: 2.5, mt: 2 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3,1fr)",
            },
            gap: 1,
          }}
        >
          {items.map(({ title, text, Icon }, index) => (
            <Box
              key={title}
              sx={{
                backgroundColor: "#fff",
                p: 1.5,
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  backgroundColor: ["#ffe2e1", "#ffe5a6", "#d4f5df"][index],
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 1,
                }}
              >
                <Icon sx={{ fontSize: 18, color: "#390009" }} />
              </Box>

              <Box>
                <Typography
                  sx={{ fontSize: 10, fontWeight: 700, color: "#390009" }}
                >
                  {title}
                </Typography>

                <Typography
                  sx={{ fontSize: 9, color: "#877272", lineHeight: 1.5 }}
                >
                  {text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

/*
=========================================================
VALUE PROPOSITIONS
=========================================================
*/

function ValueProps() {
  const items = [
    {
      title: "Thoughtful Designs",
      text: "Explore styles suited to daily wear and special occasions.",
      Icon: SecurityOutlined,
    },
    {
      title: "A Collection for Every Occasion",
      text: "Browse the latest designs added to the Zinora catalogue.",
      Icon: VerifiedOutlined,
    },
    {
      title: "Celebrating Indian Craftsmanship",
      text: "Discover jewellery inspired by traditional and modern styles.",
      Icon: HandshakeOutlined,
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#fff", py: 4 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3,1fr)",
            },
          }}
        >
          {items.map(({ title, text, Icon }) => (
            <Box
              key={title}
              sx={{
                textAlign: "center",
                py: 1.8,
                px: 2,
              }}
            >
              <Icon sx={{ fontSize: 26, color: "#735c00" }} />

              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#390009",
                  mt: 0.5,
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  fontSize: 9,
                  color: "#877272",
                  maxWidth: 280,
                  mx: "auto",
                  lineHeight: 1.6,
                  mt: 0.5,
                }}
              >
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default NewArrivals;
