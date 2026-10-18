
import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Spinner,
} from "react-bootstrap";

import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

/* =========================================================
   DJANGO API CONFIGURATION
========================================================= */

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const PRODUCTS_API = `${API_BASE}/api/products/`;
const CATEGORIES_API = `${API_BASE}/api/products/categories/`;

/* =========================================================
   HELPERS
========================================================= */

const getList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const getNumber = (...values) => {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== "") {
      const number = Number(value);

      if (Number.isFinite(number)) {
        return number;
      }
    }
  }

  return 0;
};

const getImageUrl = (image) => {
  if (!image) return "";

  let imagePath = image;

  if (typeof image === "object") {
    imagePath = image.url || image.image || image.src || "";
  }

  if (typeof imagePath !== "string" || !imagePath.trim()) {
    return "";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }

  return `${API_BASE}/${imagePath.replace(/^\/+/, "")}`;
};

const normalizeProduct = (item, index) => {
  const category =
    typeof item.category === "object" && item.category !== null
      ? item.category.name || item.category.title || ""
      : item.category || item.category_name || "";

  const price = getNumber(
    item.price,
    item.selling_price,
    item.sale_price,
    item.discounted_price
  );

  const mrp = getNumber(
    item.mrp,
    item.old_price,
    item.original_price,
    item.compare_at_price
  );

  const image =
    item.image ||
    item.image_url ||
    item.product_image ||
    item.thumbnail ||
    (Array.isArray(item.images) ? item.images[0] : "");

  const calculatedDiscount =
    mrp > price && mrp > 0
      ? Math.round(((mrp - price) / mrp) * 100)
      : 0;

  return {
    id: item.id ?? item.pk ?? index,
    name:
      item.name ||
      item.product_name ||
      item.title ||
      "Zinora Jewellery",

    description:
      item.description ||
      item.short_description ||
      item.desc ||
      "",

    price,
    mrp,

    rating: getNumber(item.rating, item.average_rating),
    reviews: getNumber(
      item.reviews,
      item.review_count,
      item.total_reviews
    ),

    tag: item.tag || item.badge || item.label || item.product_tag || "",

    discount: getNumber(
      item.discount_percentage,
      item.discount,
      item.off
    ) || calculatedDiscount,

    category:
      typeof category === "string" && category.trim()
        ? category.trim()
        : "Uncategorized",

    image: getImageUrl(image),

    isActive: item.is_active !== false,

    raw: item,
  };
};

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

/* =========================================================
   STYLING GUIDE
   Editorial content, not a hardcoded product catalogue.
========================================================= */

const STACKS = [
  {
    title: "Base Collar Tier",
    subtitle: "14-Inch Micro Choker",
    description:
      "Anchor the collarbone with a high-resting minimalist snake band or delicate bezel-set CZ strand. Creates a balanced base for layered jewellery.",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Central Luminary",
    subtitle: "18-Inch Mid Pendant",
    description:
      "Introduce a focal pendant that falls gracefully over high crewnecks, open necklines and festive blouses.",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Elongated Accent",
    subtitle: "22-Inch Lariat / Drop",
    description:
      "Extend the vertical silhouette with an elongated drop pendant. An elegant way to complete your everyday or occasion look.",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85",
  },
];

/* =========================================================
   EDITORIAL CUSTOMER REVIEWS
========================================================= */

const REVIEWS = [
  {
    initials: "AM",
    name: "Ananya Mukherjee",
    city: "Kolkata",
    product: "Everyday Jewellery",
    text: "The finishing is beautiful, and the design works perfectly for both everyday wear and special occasions.",
  },
  {
    initials: "PS",
    name: "Pooja Sharma",
    city: "Bengaluru",
    product: "Layered Jewellery",
    text: "I love the elegant look. The jewellery pairs beautifully with both western outfits and traditional clothing.",
  },
  {
    initials: "RK",
    name: "Ritu Kapoor",
    city: "New Delhi",
    product: "Traditional Jewellery",
    text: "The traditional details and rich finish make these designs a lovely choice for festive occasions.",
  },
];

/* =========================================================
   CSS
========================================================= */

const css = `
:root {
  --maroon: #5a0f1f;
  --maroon-d: #3f0a15;
  --gold: #c8962e;
  --cream: #faf6f0;
  --ink: #2a1a1a;
  --muted: #7a6a68;
  --line: #e6dccf;
}

.zr {
  font-family: Inter, system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  font-size: 14px;
  overflow-x: hidden;
}

.zr h1,
.zr h2,
.zr h3,
.zr .serif {
  font-family: "Playfair Display", Georgia, serif;
}

.zr .hero {
  background: linear-gradient(120deg, #f5ede2, #e9d6bd);
  padding: 56px 0;
}

.zr .hero h1 {
  font-size: 34px;
  font-weight: 600;
  margin: 8px 0 12px;
}

.zr .hero .eyebrow {
  font-size: 11px;
  letter-spacing: 1.5px;
  color: var(--gold);
  font-weight: 700;
}

.zr .pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--line);
  background: #fff;
  font-size: 11px;
  padding: 6px 10px;
  margin: 4px 6px 0 0;
}

.zr .hero-img {
  height: 250px;
  background: linear-gradient(135deg, #0f3d2e, #b8862b);
  position: relative;
  overflow: hidden;
}

.zr .hero-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zr .hero-img .micro {
  position: absolute;
  left: 14px;
  bottom: 14px;
  background: #fff;
  font-size: 10px;
  padding: 7px 10px;
}

.zr .crumb {
  font-size: 11px;
  color: var(--muted);
  padding: 15px 0;
}

.zr .side h6 {
  font-size: 12px;
  letter-spacing: 1px;
  margin: 22px 0 10px;
  font-weight: 700;
}

.zr .side .form-check-label {
  font-size: 12px;
}

.zr .form-check-input:checked {
  background-color: var(--maroon);
  border-color: var(--maroon);
}

.zr .sizer {
  background: var(--maroon);
  color: #fff;
  padding: 14px;
  font-size: 12px;
  margin-top: 20px;
}

.zr .gift {
  background: var(--cream);
  border: 1px dashed var(--line);
  padding: 14px;
  font-size: 12px;
  margin-top: 14px;
}

.zr .pcard {
  border: 1px solid var(--line);
  border-radius: 0;
  height: 100%;
  transition: box-shadow .2s ease, transform .2s ease;
  overflow: hidden;
}

.zr .pcard:hover {
  box-shadow: 0 5px 18px rgba(90, 15, 31, .10);
  transform: translateY(-2px);
}

.zr .pimg {
  height: 210px;
  position: relative;
  background: var(--cream);
  overflow: hidden;
}

.zr .pimg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zr .ptag {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  background: var(--maroon);
  color: #fff;
  font-size: 10px;
  padding: 4px 8px;
}

.zr .poff {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 25px;
  background: var(--gold);
  color: #fff;
  font-size: 10px;
  padding: 3px 8px;
}

.zr .pheart {
  position: absolute;
  right: 8px;
  top: 8px;
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  color: var(--maroon);
  cursor: pointer;
}

.zr .pname {
  font-size: 12px;
  min-height: 35px;
  margin: 8px 0;
  line-height: 1.5;
}

.zr .btn-zr {
  background: var(--maroon);
  border-color: var(--maroon);
  color: #fff;
  border-radius: 0;
  font-size: 11px;
  letter-spacing: 1px;
}

.zr .btn-zr:hover,
.zr .btn-zr:focus {
  background: var(--maroon-d);
  border-color: var(--maroon-d);
  color: #fff;
}

.zr .btn-out {
  border: 1px solid var(--muted);
  border-radius: 0;
  font-size: 11px;
  letter-spacing: 1px;
  background: #fff;
  color: var(--ink);
}

.zr .btn-out:hover {
  background: var(--maroon);
  color: #fff;
}

.zr .section-t {
  text-align: center;
  margin: 56px 0 28px;
}

.zr .section-t h2 {
  font-size: 28px;
}

.zr .section-t p {
  color: var(--muted);
  max-width: 560px;
  margin: 8px auto 0;
  font-size: 12px;
}

.zr .stack-img {
  height: 175px;
  overflow: hidden;
  background: var(--cream);
}

.zr .stack-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zr .stack-card {
  border: 1px solid var(--line);
  border-radius: 0;
  height: 100%;
}

.zr .tip {
  background: var(--cream);
  border: 1px solid var(--line);
  padding: 14px 18px;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 12px;
}

.zr .review {
  border: 1px solid var(--line);
  padding: 16px;
  height: 100%;
  font-size: 12px;
}

.zr .avatar {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--cream);
  display: grid;
  place-items: center;
  font-size: 11px;
  border: 1px solid var(--line);
}

.zr .trust {
  text-align: center;
  padding: 32px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  font-size: 12px;
}

.zr .trust h6 {
  font-size: 13px;
  margin: 8px 0 4px;
}

.zr .join {
  background: var(--cream);
  padding: 34px 0;
}

.zr .empty-state {
  border: 1px solid var(--line);
  background: var(--cream);
  padding: 35px 20px;
  text-align: center;
}

.zr .api-error {
  border: 1px solid #e3b7b7;
  background: #fff5f5;
  padding: 20px;
  color: #8a1525;
}

.zr .muted-label {
  color: var(--muted);
  font-size: 11px;
}

@media (max-width: 767px) {
  .zr .hero {
    padding: 32px 0;
  }

  .zr .hero h1 {
    font-size: 27px;
  }

  .zr .hero-img {
    height: 210px;
  }

  .zr .pimg {
    height: 165px;
  }

  .zr .section-t {
    margin-top: 38px;
  }

  .zr .section-t h2 {
    font-size: 24px;
  }
}
`;

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const Stars = ({ n = 5 }) => (
  <span style={{ color: "#c8962e", whiteSpace: "nowrap" }}>
    {Array.from({ length: Math.max(0, Math.min(5, Math.round(n))) }).map(
      (_, index) => (
        <StarIcon key={index} style={{ fontSize: 13 }} />
      )
    )}
  </span>
);

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ZinoraRingsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const [ringSize, setRingSize] = useState(14);
  const [favorites, setFavorites] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [notice, setNotice] = useState("");

  /* =======================================================
     LOAD PRODUCTS AND CATEGORIES FROM DJANGO
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setApiError("");

      try {
        const [productsResult, categoriesResult] = await Promise.allSettled([
          fetch(PRODUCTS_API),
          fetch(CATEGORIES_API),
        ]);

        if (productsResult.status !== "fulfilled") {
          throw new Error("Unable to connect to the products API.");
        }

        const productsResponse = productsResult.value;

        if (!productsResponse.ok) {
          throw new Error(
            `Products API returned HTTP ${productsResponse.status}.`
          );
        }

        const productsData = await productsResponse.json();

        let categoryData = [];

        if (
          categoriesResult.status === "fulfilled" &&
          categoriesResult.value.ok
        ) {
          categoryData = getList(await categoriesResult.value.json());
        }

        const loadedProducts = getList(productsData)
          .filter((product) => product.is_active !== false)
          .map(normalizeProduct);

        const loadedCategories = categoryData.filter(
          (category) => category.is_active !== false
        );

        if (!cancelled) {
          setProducts(loadedProducts);
          setCategories(loadedCategories);
        }
      } catch (error) {
        if (!cancelled) {
          setApiError(
            error.message ||
              "Products could not be loaded. Please check your backend."
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
  }, [reloadKey]);

  /* =======================================================
     CATEGORY OPTIONS FROM DATABASE
  ======================================================= */

  const categoryOptions = useMemo(() => {
    const names = [
      ...categories.map((category) => category.name || category.title),
      ...products.map((product) => product.category),
    ]
      .filter((name) => typeof name === "string" && name.trim())
      .map((name) => name.trim());

    const unique = new Map();

    names.forEach((name) => {
      const key = name.toLowerCase();

      if (!unique.has(key)) {
        unique.set(key, name);
      }
    });

    return Array.from(unique.values());
  }, [categories, products]);

  /* =======================================================
     FILTER AND SORT PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.some(
          (category) =>
            category.toLowerCase() === product.category.toLowerCase()
        )
      );
    }

    if (selectedPrice === "under199") {
      result = result.filter((product) => product.price < 199);
    } else if (selectedPrice === "199-499") {
      result = result.filter(
        (product) => product.price >= 199 && product.price <= 499
      );
    } else if (selectedPrice === "500-999") {
      result = result.filter(
        (product) => product.price >= 500 && product.price <= 999
      );
    } else if (selectedPrice === "1000+") {
      result = result.filter((product) => product.price >= 1000);
    }

    if (sortBy === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategories, selectedPrice, sortBy]);

  /* =======================================================
     ACTIONS
  ======================================================= */

  const toggleCategory = (category) => {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedPrice("all");
    setSortBy("featured");
  };

  const toggleFavorite = (productId) => {
    setFavorites((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId]
    );
  };

  const addToBag = (product) => {
    /*
      This updates the local UI only.
      Connect this function to your cart API or cart context
      if you want the cart to persist in Django/database.
    */

    const existingCart = JSON.parse(
      localStorage.getItem("zinoraCart") || "[]"
    );

    const updatedCart = [...existingCart];
    const existingItem = updatedCart.find(
      (item) => String(item.id) === String(product.id)
    );

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      updatedCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("zinoraCart", JSON.stringify(updatedCart));

    setCartCount(
      updatedCart.reduce((total, item) => total + (item.quantity || 1), 0)
    );

    setNotice(`${product.name} added to your bag.`);
    window.setTimeout(() => setNotice(""), 2500);
  };

  /* =======================================================
     PAGE UI
  ======================================================= */

  return (
    <div className="zr">
      <style>{css}</style>

      {/* HERO */}

      <section className="hero">
        <Container>
          <Row className="align-items-center g-4">
            <Col md={7}>
              <div className="eyebrow">CURATED CAPSULE ATELIER</div>

              <h1>Artisanal Cocktail Rings &amp; Dainty Pendants</h1>

              <p
                style={{
                  maxWidth: 520,
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                Discover elegant rings and statement pendants designed for
                everyday luxury, festive celebrations and memorable occasions.
                Explore the collection directly from Zinora's product
                catalogue.
              </p>

              <span className="pill">
                Adjustable Bands
              </span>

              <span className="pill">
                <WaterDropOutlinedIcon style={{ fontSize: 14 }} />
                Everyday Jewellery
              </span>

              <span className="pill">
                <ShieldOutlinedIcon style={{ fontSize: 14 }} />
                Elegant Finishes
              </span>
            </Col>

            <Col md={5}>
              <div className="hero-img">
                <img
                  src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=90"
                  alt="Jewellery collection"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <span className="micro">THE ZINORA COLLECTION</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container>
        {/* BREADCRUMB */}

        <div className="crumb">
          Home / Fine Collections / <b>Rings &amp; Pendants</b>
        </div>

        <Row className="g-4">
          {/* SIDEBAR */}

          <Col lg={3} className="side">
            <div className="d-flex justify-content-between align-items-center">
              <b style={{ fontSize: 12 }}>FILTER ARCHIVE</b>

              <button
                type="button"
                onClick={resetFilters}
                style={{
                  fontSize: 11,
                  color: "var(--maroon)",
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                RESET ALL
              </button>
            </div>

            <h6>PRODUCT CATEGORY</h6>

            {loading && categories.length === 0 ? (
              <div className="muted-label">Loading categories...</div>
            ) : categoryOptions.length > 0 ? (
              <Form>
                {categoryOptions.map((category) => (
                  <Form.Check
                    key={category}
                    id={`category-${category}`}
                    type="checkbox"
                    label={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="mb-2"
                  />
                ))}
              </Form>
            ) : (
              <div className="muted-label">
                Categories will appear after products are added in the backend.
              </div>
            )}

            <h6>RING FIT TYPE</h6>

            <Form.Check
              type="radio"
              name="ring-fit"
              label="Free-Size Adjustable Flex"
              defaultChecked
            />

            <Form.Check
              type="radio"
              name="ring-fit"
              label="Standard Fixed Sized Bands"
            />

            <h6>PLATING &amp; POLISH</h6>

            <div className="d-flex flex-wrap gap-2">
              {[
                "18K Gold Dip",
                "24K Antique",
                "Rhodium Silver",
                "Rose Gold",
              ].map((plating) => (
                <span key={plating} className="pill" style={{ margin: 0 }}>
                  {plating}
                </span>
              ))}
            </div>

            <h6>PRICE TIERS</h6>

            <Form>
              {[
                ["all", "All Prices"],
                ["under199", "Under ₹199"],
                ["199-499", "₹199 to ₹499"],
                ["500-999", "₹500 to ₹999"],
                ["1000+", "Above ₹1,000"],
              ].map(([value, label]) => (
                <Form.Check
                  key={value}
                  type="radio"
                  name="price-tier"
                  id={`price-${value}`}
                  label={label}
                  checked={selectedPrice === value}
                  onChange={() => setSelectedPrice(value)}
                  className="mb-2"
                />
              ))}
            </Form>

            <div className="sizer">
              <div className="mb-2">
                <b>Interactive Ring Sizer</b>
              </div>

              <div style={{ fontSize: 11, opacity: 0.9 }}>
                Use this guide to explore a comfortable ring size.
              </div>

              <div className="mt-3">
                Selected Size: <b>{ringSize}</b>
              </div>

              <Form.Range
                min={10}
                max={22}
                value={ringSize}
                onChange={(event) => setRingSize(Number(event.target.value))}
              />

              <div style={{ fontSize: 11 }}>
                Approximate guide: {(ringSize * 1.2).toFixed(1)} mm
              </div>
            </div>

            <div className="gift">
              <CardGiftcardIcon fontSize="small" />{" "}
              <b>Gift-Ready Packaging</b>
              <br />
              Discover jewellery pieces suitable for birthdays, celebrations
              and thoughtful gifting.
            </div>
          </Col>

          {/* PRODUCT GRID */}

          <Col lg={9}>
            <div
              className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3"
              style={{ fontSize: 12 }}
            >
              <div>
                <span className="text-muted">Products:</span>{" "}
                <b>{filteredProducts.length}</b>
                {selectedCategories.length > 0 && (
                  <span className="pill">
                    {selectedCategories.length} category filter(s)
                  </span>
                )}
                {selectedPrice !== "all" && (
                  <span className="pill">Price filter applied</span>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                <ShoppingBagOutlinedIcon style={{ fontSize: 17 }} />
                Bag: {cartCount}

                <span className="ms-2">Sort By:</span>

                <Form.Select
                  size="sm"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  style={{
                    width: 175,
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                >
                  <option value="featured">Featured Products</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Name: A to Z</option>
                </Form.Select>
              </div>
            </div>

            {/* SUCCESS NOTICE */}

            {notice && (
              <div
                className="alert alert-success py-2"
                role="status"
                style={{ fontSize: 12, borderRadius: 0 }}
              >
                {notice}
              </div>
            )}

            {/* LOADING */}

            {loading && (
              <div className="empty-state">
                <Spinner
                  animation="border"
                  style={{ color: "var(--maroon)" }}
                />

                <div className="mt-3">Loading products from Zinora...</div>
              </div>
            )}

            {/* API ERROR */}

            {!loading && apiError && (
              <div className="api-error">
                <b>Unable to load products</b>

                <p className="mt-2 mb-3">{apiError}</p>

                <Button
                  className="btn-zr"
                  onClick={() => setReloadKey((key) => key + 1)}
                >
                  TRY AGAIN
                </Button>
              </div>
            )}

            {/* EMPTY PRODUCTS */}

            {!loading && !apiError && products.length === 0 && (
              <div className="empty-state">
                <h5 className="serif">Your collection is waiting</h5>

                <p className="text-muted mb-3" style={{ fontSize: 12 }}>
                  No active products were returned by the Django API. Add
                  products in your admin dashboard and make sure they are
                  active.
                </p>

                <Button
                  className="btn-zr"
                  onClick={() => setReloadKey((key) => key + 1)}
                >
                  REFRESH PRODUCTS
                </Button>
              </div>
            )}

            {/* FILTER HAS NO MATCHES */}

            {!loading &&
              !apiError &&
              products.length > 0 &&
              filteredProducts.length === 0 && (
                <div className="empty-state">
                  <h5 className="serif">No matching jewellery found</h5>

                  <p className="text-muted" style={{ fontSize: 12 }}>
                    Try changing the category or price filters.
                  </p>

                  <Button className="btn-zr" onClick={resetFilters}>
                    CLEAR FILTERS
                  </Button>
                </div>
              )}

            {/* DYNAMIC PRODUCT CARDS */}

            {!loading && !apiError && filteredProducts.length > 0 && (
              <Row xs={2} md={3} xl={4} className="g-3">
                {filteredProducts.map((product) => (
                  <Col key={product.id}>
                    <Card className="pcard">
                      <div className="pimg">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div
                            className="h-100 d-flex align-items-center justify-content-center text-center p-3"
                            style={{
                              background: "var(--cream)",
                              color: "var(--muted)",
                              fontSize: 12,
                            }}
                          >
                            Product image not available
                          </div>
                        )}

                        {product.tag && (
                          <span className="ptag">{product.tag}</span>
                        )}

                        {product.discount > 0 && (
                          <span className="poff">
                            {product.discount}% OFF
                          </span>
                        )}

                        <button
                          type="button"
                          className="pheart"
                          aria-label={
                            favorites.includes(product.id)
                              ? "Remove from favourites"
                              : "Add to favourites"
                          }
                          onClick={() => toggleFavorite(product.id)}
                        >
                          {favorites.includes(product.id) ? (
                            <FavoriteIcon style={{ fontSize: 18 }} />
                          ) : (
                            <FavoriteBorderIcon style={{ fontSize: 18 }} />
                          )}
                        </button>
                      </div>

                      <Card.Body className="p-2">
                        {product.rating > 0 && (
                          <div style={{ fontSize: 11 }}>
                            <StarIcon
                              style={{
                                fontSize: 13,
                                color: "#c8962e",
                              }}
                            />{" "}
                            {product.rating.toFixed(1)}
                            {product.reviews > 0 && ` (${product.reviews})`}
                          </div>
                        )}

                        <div className="pname">{product.name}</div>

                        {product.category &&
                          product.category !== "Uncategorized" && (
                            <div className="muted-label mb-2">
                              {product.category}
                            </div>
                          )}

                        <div className="mb-2">
                          <b>₹{formatPrice(product.price)}</b>{" "}

                          {product.mrp > product.price && (
                            <s
                              className="text-muted"
                              style={{ fontSize: 11 }}
                            >
                              ₹{formatPrice(product.mrp)}
                            </s>
                          )}
                        </div>

                        <Button
                          className="btn-zr w-100"
                          size="sm"
                          onClick={() => addToBag(product)}
                        >
                          ADD TO BAG
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {!loading && !apiError && filteredProducts.length > 0 && (
              <div
                className="text-center mt-4 p-3"
                style={{
                  border: "1px solid var(--line)",
                  fontSize: 12,
                }}
              >
                Showing {filteredProducts.length} of {products.length} products
                from the backend.

                <div className="mt-2">
                  <Button
                    className="btn-out"
                    size="sm"
                    onClick={() => setReloadKey((key) => key + 1)}
                  >
                    REFRESH CATALOGUE
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row>

        {/* STYLING GUIDE */}

       

       

        

        {/* CUSTOMER REVIEWS */}

        <div className="section-t" style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1.5,
              color: "var(--gold)",
            }}
          >
            CUSTOMER EXPERIENCES
          </div>

          <h2>Made to Be Cherished</h2>

          <p>
            Discover why customers love adding elegant jewellery to their
            everyday wardrobe and special occasions.
          </p>

          <div
            className="d-flex justify-content-center flex-wrap gap-4 mt-3"
            style={{ fontSize: 12 }}
          >
            <span>
              <Stars n={5} /> <b>Customer favourites</b>
            </span>

            <span>
              <VerifiedIcon fontSize="small" /> Thoughtful designs for every
              occasion
            </span>
          </div>
        </div>

        <Row className="g-3">
          {REVIEWS.map((review) => (
            <Col md={4} key={review.name}>
              <div className="review">
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <Stars n={5} />

                  <small className="text-muted">Customer Review</small>
                </div>

                <p className="mt-3">{review.text}</p>

                <div className="d-flex align-items-center gap-2">
                  <span className="avatar">{review.initials}</span>

                  <small>
                    <b>{review.name}</b>
                    <br />
                    {review.city} · {review.product}
                  </small>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>


      


      
    </div>
  );
}
