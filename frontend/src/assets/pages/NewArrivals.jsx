import React, { useMemo, useState } from "react";

import {
  Box,
  Container,
  Typography,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  Divider,
  Button,
  Switch,
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
} from "@mui/icons-material";

/* =========================================================
   PRODUCTS
========================================================= */

const products = [
  {
    id: 1,
    badge: "NEW DROP",
    name: "Aaradhya Moissanite Polki Choker Set",
    desc: "Green Meenakari & Hand-Strung Pearls",
    price: 1499,
    old: 2999,
    discount: "50% Off",
    rating: 4.9,
    reviews: 18,
    cat: "Chokers & Sets",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    badge: "JUST LAUNCHED",
    name: "Meera Dual-Tone Filigree Jhumkas",
    desc: "Featherweight Brass • 24K Micron",
    price: 349,
    old: 799,
    discount: "56% OFF",
    rating: 4.8,
    reviews: 42,
    cat: "Chandbalis & Jhumkas",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    badge: "ANTI-TARNISH",
    name: "Rhea Baguette Solitaire Minimal Ring",
    desc: "Waterproof PVD Silver • Everyday",
    price: 199,
    old: 499,
    discount: "60% OFF",
    rating: 5.0,
    reviews: 9,
    cat: "Solitaire & Cocktail Rings",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    badge: "BESTSELLER",
    name: "Devanshi Rajwadi Openable Kada",
    desc: "Screw-Lock Mechanism • High Durability",
    price: 899,
    old: 1899,
    discount: "53% OFF",
    rating: 4.9,
    reviews: 63,
    cat: "Openable Kadas & Bangles",
    img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    badge: "BRIDAL EDIT",
    name: "Siya Floral Kundan Pearl Mathapatti",
    desc: "Hand-Beaded Shell Pearls • Intricate",
    price: 649,
    old: 1299,
    discount: "50% OFF",
    rating: 4.7,
    reviews: 27,
    cat: "Mathapattis & Maangtikkas",
    img: "https://media.istockphoto.com/id/2278219146/photo/indian-brides-traditional-wedding-jewelry-close-up.jpg?s=612x612&w=0&k=20&c=BBc2aNy0uRy8UZyB_RHjJ8MCHTFCbATVpDWcXy2xWwM=",
  },
  {
    id: 6,
    badge: "DAILY ESSENTIAL",
    name: "Nitya Evil Eye Layered Chain",
    desc: "18K Triple Dipped • Hypoallergenic",
    price: 229,
    old: 499,
    discount: "54% OFF",
    rating: 4.9,
    reviews: 84,
    cat: "Chokers & Sets",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 7,
    badge: "HERITAGE",
    name: "Kalyani Peacock Temple Long Haram",
    desc: "Micro-Gold Antique Finish • Pure",
    price: 1799,
    old: 3599,
    discount: "50% OFF",
    rating: 5.0,
    reviews: 11,
    cat: "Chokers & Sets",
    img: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 8,
    badge: "TRENDING",
    name: "Zoya Statement Emerald Cocktail Ring",
    desc: "Adjustable Band • Simulated Hydro",
    price: 279,
    old: 599,
    discount: "53% OFF",
    rating: 4.8,
    reviews: 35,
    cat: "Solitaire & Cocktail Rings",
    img: "https://media.istockphoto.com/id/137063256/photo/golden-ring-with-diamonds.jpg?s=612x612&w=0&k=20&c=ym2T7ykTknuXlBncvBtnJrl17b76sD-G04kq-lbXDMY=",
  },
];

const categories = [
  ["Chokers & Sets", 28],
  ["Chandbalis & Jhumkas", 42],
  ["Openable Kadas & Bangles", 19],
  ["Solitaire & Cocktail Rings", 24],
  ["Mathapattis & Maangtikkas", 18],
];

const quickFilters = [
  "Just Dropped",
  "Under ₹299",
  "Festive Polki",
  "Anti-Tarnish Dailywear",
  "Temple Jewels",
];

/* =========================================================
   MAIN
========================================================= */

function NewArrivals() {
  const [favorites, setFavorites] = useState([]);

  // Screenshot mein Just Dropped selected hai
  const [activeFilter, setActiveFilter] =
    useState("Just Dropped");

  const [sort, setSort] = useState("Newest First");

  const [columns, setColumns] = useState(4);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /*
      Important:
      Screenshot mein "Just Dropped" selected hone ke
      baad bhi saare 8 products visible hain.
      Isliye initial Just Dropped ko visual filter ki
      tarah rakha gaya hai, products hide nahi honge.
    */

    if (activeFilter === "Under ₹299") {
      result = result.filter(
        (product) => product.price <= 299
      );
    }

    if (activeFilter === "Festive Polki") {
      result = result.filter(
        (product) =>
          product.badge === "BRIDAL EDIT" ||
          product.badge === "HERITAGE"
      );
    }

    if (activeFilter === "Anti-Tarnish Dailywear") {
      result = result.filter(
        (product) =>
          product.badge === "ANTI-TARNISH" ||
          product.badge === "DAILY ESSENTIAL"
      );
    }

    if (activeFilter === "Temple Jewels") {
      result = result.filter(
        (product) => product.badge === "HERITAGE"
      );
    }

    if (sort === "Price Low-High") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "Price High-Low") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "Customer Rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeFilter, sort]);

  return (
    <Box
      sx={{
        backgroundColor: "#fbf9f6",
        color: "#1b1c1a",
        minHeight: "100vh",
        fontFamily:
          "'Plus Jakarta Sans', Arial, sans-serif",
      }}
    >
      {/* HERO */}

      <HeroSection />

      {/* FILTER BAR */}

      <FilterBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sort={sort}
        setSort={setSort}
        columns={columns}
        setColumns={setColumns}
      />

      {/* MAIN */}

      <Container
        maxWidth="xl"
        sx={{
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "180px minmax(0, 1fr)",
            },
            gap: 2,
          }}
        >
          {/* LEFT FILTER */}

          <Sidebar />

          {/* PRODUCTS */}

          <Box>
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
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  favorite={favorites.includes(
                    product.id
                  )}
                  onFavorite={() =>
                    toggleFavorite(product.id)
                  }
                />
              ))}
            </Box>

            {/* EDITORIAL */}

            <Editorial />

            {/* PAGINATION */}

            <Pagination />
          </Box>
        </Box>
      </Container>

      {/* GUARANTEES */}

      <Guarantees />

      {/* BOTTOM 3 VALUE PROPS */}

      <ValueProps />
    </Box>
  );
}

/* =========================================================
   HERO
========================================================= */

function HeroSection() {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(90deg,#f5f2ed 0%,#fff1f0 52%,#fbf4df 100%)",
        borderBottom: "1px solid #e5dfda",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: 1.2,
        }}
      >
        {/* Small Drop Label */}

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            backgroundColor: "#fff",
            borderRadius: 10,
            px: 1,
            py: 0.35,
            mb: 0.7,
            boxShadow: "0 1px 4px #00000012",
          }}
        >
          <Box
  sx={{
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: "#edd17f",
    boxShadow: "0 0 6px #fed65b",
    animation: "zinoraBlink 1.2s ease-in-out infinite",
    "@keyframes zinoraBlink": {
      "0%, 100%": {
        opacity: 1,
        transform: "scale(1)",
        boxShadow: "0 0 6px #fed65b",
      },
      "50%": {
        opacity: 0.25,
        transform: "scale(0.7)",
        boxShadow: "0 0 1px #fed65b",
      },
    },
    flexShrink: 0,
  }}
/>

          <Typography
            sx={{
              fontSize: 9,
              letterSpacing: 1,
              color: "#554242",
            }}
          >
            SPRING / FESTIVE 2025 DROP 02
          </Typography>

          <Typography
            sx={{
              fontSize: 9,
              fontWeight: 700,
              color: "#390009",
            }}
          >
            • 54 New Styles Added Today
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Heading */}

          <Box
            sx={{
              maxWidth: 610,
            }}
          >
            <Typography
              sx={{
                fontFamily:
                  "'Playfair Display', Georgia, serif",
                fontSize: {
                  xs: 30,
                  md: 40,
                },
                lineHeight: 1.02,
                color: "#390009",
              }}
            >
              Fresh Karigari &{" "}
              <Box
                component="span"
                sx={{
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Modern
                <br />
                Silhouettes
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: 10,
                color: "#877272",
                lineHeight: 1.55,
                mt: 0.8,
                maxWidth: 500,
              }}
            >
              Just dropped handcrafted uncut polki,
              brilliant CZ micro-pavé, and 24K
              micro-gold dipped jewels engineered for
              lightweight grandeur and sensitive Indian
              skin.
            </Typography>
          </Box>

          {/* Assurance Cards */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              gap: 1,
            }}
          >
            <AssuranceCard
              icon={<VerifiedOutlined />}
              title="PURITY ASSURED"
              text="Micro-Micron Plating"
            />

            <AssuranceCard
              icon={<LocalShippingOutlined />}
              title="EXPRESS DISPATCH"
              text="Ships in 24 Hours"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

/* =========================================================
   ASSURANCE
========================================================= */

function AssuranceCard({
  icon,
  title,
  text,
}) {
  return (
    <Box
      sx={{
        width: 130,
        backgroundColor: "#fff",
        p: 1,
        display: "flex",
        gap: 0.7,
        alignItems: "center",
        borderRadius: 0.5,
      }}
    >
      <Box
        sx={{
          color: "#735c00",
          "& svg": {
            fontSize: 20,
          },
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: 8,
            color: "#877272",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 700,
            color: "#390009",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
}

/* =========================================================
   FILTER BAR
========================================================= */

function FilterBar({
  activeFilter,
  setActiveFilter,
  sort,
  setSort,
  columns,
  setColumns,
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
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 9,
              color: "#877272",
              whiteSpace: "nowrap",
            }}
          >
            Home
          </Typography>

          <ChevronRight
            sx={{
              fontSize: 12,
              color: "#aaa",
            }}
          />

          <Typography
            sx={{
              fontSize: 9,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            New Arrivals
          </Typography>

          <Chip
            label="128 Designs"
            size="small"
            sx={{
              height: 27,
              fontSize: 9,
              borderRadius: 0.5,
              ml: 0.5,
            }}
          />

          {quickFilters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onClick={() =>
                setActiveFilter(filter)
              }
              size="small"
              sx={{
                height: 27,
                fontSize: 9,
                borderRadius: 10,
                backgroundColor:
                  activeFilter === filter
                    ? "#390009"
                    : "#fff",
                color:
                  activeFilter === filter
                    ? "#fff"
                    : "#554242",
                border:
                  "1px solid #e5dfda",
                whiteSpace: "nowrap",
              }}
            />
          ))}

          <Box
            sx={{
              flex: 1,
              minWidth: 10,
            }}
          />

          {/* 3 columns */}

          <IconButton
            size="small"
            onClick={() => setColumns(3)}
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              borderRadius: 0.5,
              backgroundColor:
                columns === 3
                  ? "#f1ece8"
                  : "transparent",
            }}
          >
            <GridView
              sx={{
                fontSize: 15,
              }}
            />
          </IconButton>

          {/* 4 columns */}

          <IconButton
            size="small"
            onClick={() => setColumns(4)}
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              borderRadius: 0.5,
              backgroundColor:
                columns === 4
                  ? "#f1ece8"
                  : "transparent",
            }}
          >
            <ViewComfy
              sx={{
                fontSize: 15,
              }}
            />
          </IconButton>

          {/* Sort */}

          <FormControl
            size="small"
            sx={{
              minWidth: 128,
            }}
          >
            <Select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              sx={{
                height: 28,
                fontSize: 9,
                backgroundColor: "#fff",
              }}
            >
              <MenuItem value="Newest First">
                Sort: Newest First
              </MenuItem>

              <MenuItem value="Price Low-High">
                Price Low-High
              </MenuItem>

              <MenuItem value="Price High-Low">
                Price High-Low
              </MenuItem>

              <MenuItem value="Customer Rating">
                Customer Rating
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Container>
    </Box>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar() {
  return (
    <Box
      sx={{
        fontSize: 10,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #e5dfda",
          p: 1.3,
        }}
      >
        {/* Filter Heading */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            Filter By
          </Typography>

          <Typography
            sx={{
              fontSize: 8,
              color: "#735c00",
            }}
          >
            CLEAR ALL
          </Typography>
        </Box>

        {/* Shipping */}

        <Box
          sx={{
            backgroundColor: "#f6f3ee",
            p: 1,
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <LocalShippingOutlined
            sx={{
              fontSize: 14,
              color: "#735c00",
            }}
          />

          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 8,
              }}
            >
              Ships in 24 Hrs
            </Typography>

            <Typography
              sx={{
                fontSize: 7,
                color: "#877272",
              }}
            >
              Ready in Jaipur warehouse
            </Typography>
          </Box>

          <Switch
            size="small"
            defaultChecked
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#390009",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                {
                  backgroundColor: "#390009",
                },
            }}
          />
        </Box>

        {/* Jewellery Type */}

        <FilterGroup title="JEWELLERY TYPE">
          {categories.map(([name, count]) => (
            <CheckRow
              key={name}
              label={name}
              count={count}
              checked={
                name === "Chokers & Sets"
              }
            />
          ))}
        </FilterGroup>

        {/* Plating */}

        <FilterGroup title="PLATING & FINISH">
          {[
            "24K Antique Gold",
            "Rhodium Silver (Diamond Look)",
            "Dual-Tone Rose Gold",
          ].map((item, index) => (
            <Box
              key={item}
              sx={{
                display: "flex",
                gap: 0.7,
                alignItems: "center",
                mb: 0.7,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: [
                    "#f2d278",
                    "#ddd",
                    "#e8b7bd",
                  ][index],
                }}
              />

              <Typography
                sx={{
                  fontSize: 8,
                }}
              >
                {item}
              </Typography>
            </Box>
          ))}
        </FilterGroup>

        {/* Price */}

        <FilterGroup title="PRICE RANGE">
          <Typography
            sx={{
              fontSize: 8,
              color: "#877272",
              mb: 0.5,
            }}
          >
            Up to ₹3,999
          </Typography>

          {[
            "Under ₹199 (Pocket Luxe)",
            "₹199 - ₹499 (Everyday)",
            "₹499 - ₹999 (Festive Edit)",
            "₹999 & Above (Bridal Sets)",
          ].map((item, index) => (
            <CheckRow
              key={item}
              label={item}
              count={[24, 68, 32, 14][index]}
              checked={index === 1 || index === 2}
            />
          ))}
        </FilterGroup>

        {/* Occasion */}

        <FilterGroup title="OCCASION">
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
            }}
          >
            {[
              "Daily Office",
              "Haldi / Mehendi",
              "Cocktail & Sangeet",
              "Royal Wedding",
            ].map((item, index) => (
              <Chip
                key={item}
                label={item}
                size="small"
                sx={{
                  height: 19,
                  fontSize: 7,
                  backgroundColor:
                    index === 1
                      ? "#390009"
                      : "#f2efea",
                  color:
                    index === 1
                      ? "#fff"
                      : "#554242",
                }}
              />
            ))}
          </Box>
        </FilterGroup>
      </Box>

      {/* Stylist Concierge */}

      <Box
        sx={{
          mt: 1,
          backgroundColor: "#390009",
          color: "#fff",
          p: 1.4,
        }}
      >
        <Typography
          sx={{
            fontSize: 8,
            letterSpacing: 1,
          }}
        >
          STYLIST CONCIERGE
        </Typography>

        <Typography
          sx={{
            fontFamily:
              "'Playfair Display', Georgia, serif",
            fontSize: 16,
            lineHeight: 1.05,
            mt: 0.7,
          }}
        >
          Need bridal matching advice?
        </Typography>

        <Typography
          sx={{
            fontSize: 7.5,
            opacity: 0.75,
            mt: 0.7,
            lineHeight: 1.4,
          }}
        >
          Direct video consultation with our Jaipur
          jewellery curator.
        </Typography>

        <Button
          endIcon={<ArrowForward />}
          sx={{
            p: 0,
            mt: 0.5,
            color: "#fed65b",
            fontSize: 9,
            textTransform: "none",
          }}
        >
          Book Free Slot
        </Button>
      </Box>
    </Box>
  );
}

/* =========================================================
   FILTER GROUP
========================================================= */

function FilterGroup({
  title,
  children,
}) {
  return (
    <Box
      sx={{
        mb: 1.5,
      }}
    >
      <Typography
        sx={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: 1,
          mb: 0.6,
        }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
}

/* =========================================================
   CHECK ROW
========================================================= */

function CheckRow({
  label,
  count,
  checked,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 0.25,
      }}
    >
      <Checkbox
        size="small"
        defaultChecked={checked}
        sx={{
          p: 0,
          mr: 0.3,
          "& svg": {
            fontSize: 13,
          },
        }}
      />

      <Typography
        sx={{
          fontSize: 8,
          flex: 1,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 7,
          color: "#877272",
        }}
      >
        {count}
      </Typography>
    </Box>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
  favorite,
  onFavorite,
}) {
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
      {/* IMAGE */}

      <Box
        sx={{
          position: "relative",
          aspectRatio: "0.82",
          overflow: "hidden",
          backgroundColor: "#eee",
        }}
      >
        <Box
          component="img"
          src={product.img}
          alt={product.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Badge */}

        <Chip
          label={product.badge}
          size="small"
          sx={{
            position: "absolute",
            top: 4,
            left: 4,
            height: 18,
            backgroundColor: "#390009",
            color: "#fff",
            fontSize: 7,
            fontWeight: 700,
            borderRadius: 0.2,
          }}
        />

        {/* Wishlist */}

        <IconButton
          onClick={onFavorite}
          size="small"
          sx={{
            position: "absolute",
            top: 2,
            right: 2,
            backgroundColor: "#fff",
            width: 25,
            height: 25,
            "&:hover": {
              backgroundColor: "#fff",
            },
          }}
        >
          {favorite ? (
            <Favorite
              sx={{
                fontSize: 14,
                color: "#390009",
              }}
            />
          ) : (
            <FavoriteBorder
              sx={{
                fontSize: 14,
              }}
            />
          )}
        </IconButton>

        {/* First product discount */}

        {product.id === 1 && (
          <Chip
            label="50% Off"
            size="small"
            sx={{
              position: "absolute",
              bottom: 4,
              left: 4,
              height: 18,
              backgroundColor: "#fed65b",
              fontSize: 7,
            }}
          />
        )}
      </Box>

      {/* DETAILS */}

      <Box
        sx={{
          p: 0.65,
        }}
      >
        {/* Rating */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.2,
          }}
        >
          <Star
            sx={{
              fontSize: 10,
              color: "#735c00",
            }}
          />

          <Typography
            sx={{
              fontSize: 7,
              color: "#877272",
            }}
          >
            {product.rating} ({product.reviews} reviews)
          </Typography>
        </Box>

        {/* Name */}

        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mt: 0.25,
          }}
        >
          {product.name}
        </Typography>

        {/* Description */}

        <Typography
          sx={{
            fontSize: 7,
            color: "#877272",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mt: 0.2,
          }}
        >
          {product.desc}
        </Typography>

        {/* Price */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.4,
            mt: 0.55,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 800,
              color: "#390009",
            }}
          >
            ₹{product.price.toLocaleString("en-IN")}
          </Typography>

          <Typography
            sx={{
              fontSize: 7,
              color: "#999",
              textDecoration: "line-through",
            }}
          >
            ₹{product.old.toLocaleString("en-IN")}
          </Typography>

          <Chip
            label={product.discount}
            size="small"
            sx={{
              ml: "auto",
              height: 18,
              backgroundColor: "#fff4c9",
              color: "#735c00",
              fontSize: 7,
              borderRadius: 0.2,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

/* =========================================================
   EDITORIAL
========================================================= */

function Editorial() {
  return (
    <Box
      sx={{
        mt: 1,
        backgroundColor: "#eeece8",
        p: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: 8,
            color: "#735c00",
            letterSpacing: 1,
          }}
        >
          THE ZINORA STANDARD
        </Typography>

        <Typography
          sx={{
            fontFamily:
              "'Playfair Display', Georgia, serif",
            fontSize: 16,
            color: "#390009",
            mt: 0.25,
          }}
        >
          Micro-Gold Layering Engineered for Longevity
        </Typography>

        <Typography
          sx={{
            fontSize: 7.5,
            color: "#877272",
            mt: 0.3,
            maxWidth: 580,
          }}
        >
          Every drop undergoes strict corrosion and sweat
          testing before release. Our 1.5-micron gold bath
          ensures an indistinguishable strong glow from
          22K hallmarked jewellery.
        </Typography>
      </Box>

      <Button
        variant="contained"
        endIcon={<ArrowForward />}
        sx={{
          backgroundColor: "#58111a",
          fontSize: 8,
          textTransform: "none",
          whiteSpace: "nowrap",
          "&:hover": {
            backgroundColor: "#390009",
          },
        }}
      >
        Explore Karigari Story
      </Button>
    </Box>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination() {
  return (
    <Box
      sx={{
        mt: 1,
        backgroundColor: "#fff",
        border: "1px solid #e5dfda",
        p: 1.2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography
        sx={{
          fontSize: 8,
          color: "#877272",
        }}
      >
        Showing <b>1–8</b> of <b>128</b> designs
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 0.3,
        }}
      >
        {[
          "‹",
          "1",
          "2",
          "3",
          "...",
          "16",
          "Next ›",
        ].map((item, index) => (
          <Button
            key={index}
            sx={{
              minWidth:
                index === 6 ? 48 : 25,
              height: 24,
              p: 0,
              fontSize: 8,
              color:
                index === 1
                  ? "#fff"
                  : "#554242",
              backgroundColor:
                index === 1
                  ? "#390009"
                  : "#f8f6f3",
            }}
          >
            {item}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

/* =========================================================
   GUARANTEES
========================================================= */

function Guarantees() {
  const items = [
    {
      title: "Try at Home Guarantee",
      text: "Check weight, luster, and skin feel at your doorstep.",
      Icon: SecurityOutlined,
    },
    {
      title: "48-Hour Free Exchange",
      text: "Zero questions asked pickup across 19,000+ Indian pincodes.",
      Icon: ArrowForward,
    },
    {
      title: "1-Year Polish Warranty",
      text: "Includes certified anti-tarnish guarantee card with order.",
      Icon: VerifiedOutlined,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#f5f3f0",
        py: 2.2,
        mt: 2,
      }}
    >
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
          {items.map(
            ({ title, text, Icon }, index) => (
              <Box
                key={title}
                sx={{
                  backgroundColor: "#fff",
                  p: 1.2,
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: [
                      "#ffe2e1",
                      "#ffe5a6",
                      "#d4f5df",
                    ][index],
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 1,
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: 16,
                      color: "#390009",
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#390009",
                    }}
                  >
                    {title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 7,
                      color: "#877272",
                      lineHeight: 1.35,
                    }}
                  >
                    {text}
                  </Typography>
                </Box>
              </Box>
            )
          )}
        </Box>
      </Container>
    </Box>
  );
}

/* =========================================================
   VALUE PROPOSITIONS
========================================================= */

function ValueProps() {
  const items = [
    {
      title: "100% Skin Safe Brass & Copper",
      text: "Hypoallergenic, nickel-free compositions crafted for sensitive skin.",
      Icon: SecurityOutlined,
    },
    {
      title: "1-Year Polish Warranty",
      text: "Guaranteed micro-gold and rhodium plating longevity with certificate.",
      Icon: VerifiedOutlined,
    },
    {
      title: "Handcrafted by Indian Karigars",
      text: "Sustaining generational artisans across Jaipur, Rajkot, and Kolhapur.",
      Icon: HandshakeOutlined,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        py: 5,
      }}
    >
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
          {items.map(
            ({ title, text, Icon }) => (
              <Box
                key={title}
                sx={{
                  textAlign: "center",
                  py: 1.5,
                  px: 2,
                }}
              >
                <Icon
                  sx={{
                    fontSize: 24,
                    color: "#735c00",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#390009",
                    mt: 0.4,
                  }}
                >
                  {title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 7,
                    color: "#877272",
                    maxWidth: 260,
                    mx: "auto",
                    lineHeight: 1.4,
                    mt: 0.3,
                  }}
                >
                  {text}
                </Typography>
              </Box>
            )
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default NewArrivals;