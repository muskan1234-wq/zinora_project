import React, { useState } from "react";
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
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";

const heroImage =
  "https://trendia.co/cdn/shop/files/55027834_3.jpg?v=1780295367";

const products = [
  {
    name: "Devanshi Rajwadi Kada",
    price: "₹899",
    oldPrice: "₹1,999",
    rating: 4.9,
    reviews: 142,
    badge: "BESTSELLER",
    offer: "55% OFF",
    category: "Rajwadi Openable Kadas",
    image:
      "https://www.kairalijewellers.com/media/product_images/966/66275e1a9809e.jpg",
    sizes: ["2.6 - 60.3 mm", "Free-Size / Openable"],
  },
  {
    name: "Padmavati Kemp Ruby Kada",
    price: "₹649",
    oldPrice: "₹1,299",
    rating: 4.8,
    reviews: 88,
    badge: "HERITAGE TEMPLE",
    offer: "50% OFF",
    category: "Temple & Nakshi Choodas",
    image:
      "https://www.chidambaramgoldcovering.com/image/cache/catalog/ChidambaramGoldCovering/bangles/plain-bangles/br1526-latest-flower-pattern-design-ruby-emerald-stone-bangle-for-marriage-wear-buy-online-350-2-425x500.jpg",
    sizes: ["2.4 (S) - 57.2 mm", "2.6 - 60.3 mm"],
  },
  {
    name: "Noor Sleek Tennis Bangle",
    price: "₹349",
    oldPrice: "₹799",
    rating: 4.7,
    reviews: 210,
    badge: "WATERPROOF",
    offer: "56% OFF",
    category: "Daily Wear Minimal Sleek",
    image:
      "https://www.tanishq.com/on/demandware.static/-/Sites-Tanishq-site-catalog/default/dw0e439f98/images/hi-res/513719VDY2A00_1.jpg",
    sizes: ["2.2 (XS) - 54 mm", "2.4 (S) - 57.2 mm"],
  },
  {
    name: "Aarohi Meenakari Chooda",
    price: "₹599",
    oldPrice: "₹1,399",
    rating: 4.9,
    reviews: 64,
    badge: "HAND-PAINTED",
    offer: "57% OFF",
    category: "Temple & Nakshi Choodas",
    image:
      "https://i.pinimg.com/originals/9e/ef/e4/9eefe407337691bc69596708563fe29e.jpg",
    sizes: ["2.6 - 60.3 mm", "2.8 (L) - 63.5 mm"],
  },
  {
    name: "Jodha Uncut Polki Broad Kada",
    price: "₹1,299",
    oldPrice: "₹2,899",
    rating: 5.0,
    reviews: 39,
    badge: "BRIDAL EDITION",
    offer: "55% OFF",
    category: "Kundan & Jadau Sets",
    image:
      "https://ishhaara.com/cdn/shop/files/ishhaara-golden-bridal-bangles-stack-28388322307490.jpg?v=1749207775&width=700",
    sizes: ["2.8 (L) - 63.5 mm", "Free-Size / Openable"],
  },
  {
    name: "Kaveri Filigree Bangle Pair",
    price: "₹299",
    oldPrice: "₹649",
    rating: 4.6,
    reviews: 95,
    badge: "LIGHTWEIGHT",
    offer: "54% OFF",
    category: "Daily Wear Minimal Sleek",
    image: "https://nirankarijewel.com/images/bangles/9.JPG",
    sizes: ["2.2 (XS) - 54 mm", "2.4 (S) - 57.2 mm"],
  },
  {
    name: "Rhea Classic Eternity Bangle",
    price: "₹399",
    oldPrice: "₹899",
    rating: 4.8,
    reviews: 115,
    badge: "STACKABLE",
    offer: "56% OFF",
    category: "Daily Wear Minimal Sleek",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnkBWChGHI6-7ceKJvgPjkn5Txz0LzD8u70FKQSOIbSQ&s",
    sizes: ["2.4 (S) - 57.2 mm", "2.6 - 60.3 mm"],
  },
  {
    name: "Sultana Grand Bridal Kada",
    price: "₹749",
    oldPrice: "₹1,699",
    rating: 4.9,
    reviews: 78,
    badge: "BRIDAL STATEMENT",
    offer: "56% OFF",
    category: "Kundan & Jadau Sets",
    image:
      "https://i.etsystatic.com/26226244/r/il/40473e/7024091860/il_fullxfull.7024091860_4un5.jpg",
    sizes: ["2.8 (L) - 63.5 mm", "Free-Size / Openable"],
  },
];

const categories = [
  "All Bangles & Kadas",
  "Rajwadi Openable Kadas",
  "Temple & Nakshi Choodas",
  "Daily Wear Minimal Sleek",
  "Kundan & Jadau Sets",
];

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

const getPrice = (price) =>
  Number(String(price).replace(/[₹,]/g, ""));

function ProductCard({ product, bag, onBagToggle }) {
  const isInBag = bag.includes(product.name);

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
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.visibility = "hidden";
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
            top: 6,
            left: 6,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <StarIcon sx={{ fontSize: 13, color: "#d39a16" }} />

          <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
            {product.rating.toFixed(1)}
          </Typography>

          <Typography sx={{ fontSize: 9, color: "#777" }}>
            ({product.reviews} reviews)
          </Typography>
        </Box>

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
            sx={{ color: "#650c18", fontSize: 14, fontWeight: 700 }}
          >
            {product.price}
          </Typography>

          <Typography
            sx={{
              color: "#999",
              fontSize: 10,
              textDecoration: "line-through",
            }}
          >
            {product.oldPrice}
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={() => onBagToggle(product.name)}
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

  const handleBagToggle = (name) => {
    setBag((previous) =>
      previous.includes(name)
        ? previous.filter((item) => item !== name)
        : [...previous, name]
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

    return selectedPrices.some((range) => ranges[range](price));
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      activeCategory === "All Bangles & Kadas" ||
      product.category === activeCategory;

    const sizeMatch =
      selectedSizes.length === 0 ||
      product.sizes.some((size) => selectedSizes.includes(size));

    const priceMatch = matchesPrice(getPrice(product.price));

    return categoryMatch && sizeMatch && priceMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "low") {
      return getPrice(a.price) - getPrice(b.price);
    }

    if (sort === "high") {
      return getPrice(b.price) - getPrice(a.price);
    }

    if (sort === "rating") {
      return b.rating - a.rating;
    }

    return 0;
  });

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
        <Typography sx={{ fontSize: 10, color: "#9b7a29", mb: 1.5 }}>
          Home › Jewellery › Bangles & Kadas
        </Typography>

        {/* HERO */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.25fr 0.75fr" },
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
                event.currentTarget.style.visibility = "hidden";
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
                bottom: 4,
                left: 4,
                right: 4,
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
                  The Devanshi Grand Elephant Kada
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#650c18",
                  fontSize: 12,
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                }}
              >
                ₹899
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
            //alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 700 }}>
            {sortedProducts.length} Handcrafted Pieces
            <Box component="span" sx={{ color: "#aaa", mx: 1 }}>
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

        {/* LEFT SIDEBAR + RIGHT PRODUCTS */}

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
  {/* LEFT SIDE: CATEGORIES + FILTERS */}

  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      minWidth: 0,
    }}
  >
    {/* CATEGORIES */}

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
      {/* FILTER HEADER */}

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

      {/* BANGLE SIZE */}

      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          mb: 0.5,
        }}
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
                  "& .MuiSvgIcon-root": {
                    fontSize: 16,
                  },
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: 10 }}>
                {item}
              </Typography>
            }
            sx={{
              m: 0,
              minHeight: 25,
            }}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 1.5 }} />

      {/* PRICE RANGE */}

      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          mb: 0.5,
        }}
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
                  "& .MuiSvgIcon-root": {
                    fontSize: 16,
                  },
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: 10 }}>
                {item}
              </Typography>
            }
            sx={{
              m: 0,
              minHeight: 25,
            }}
          />
        ))}
      </FormGroup>
    </Paper>
  </Box>

  {/* RIGHT SIDE: PRODUCTS */}

  <Box sx={{ minWidth: 0 }}>
    {sortedProducts.length > 0 ? (
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
            key={product.name}
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
        </Typography>

        <Button
          onClick={resetFilters}
          sx={{
            mt: 1,
            color: "#650c18",
          }}
        >
          Clear Filters
        </Button>
      </Paper>
          )}
      </Box>
     </Box>
      </Box>
    </Box>
  );
}

