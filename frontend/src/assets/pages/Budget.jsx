
import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
  Chip,
  IconButton,
  Select,
  MenuItem,
  Divider,
  TextField,
  InputAdornment,
  Breadcrumbs,
  Link,
  Rating,
  Paper,
  Stack,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";

const burgundy = "#681b2b";
const gold = "#b49345";

const products = [
  {
    id: 1,
    name: "Classic Gold Floral Ring",
    price: 2499,
    oldPrice: 3499,
    category: "Rings",
    material: "Gold Plated",
    style: "Traditional",
    rating: 4.5,
    badge: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Antique Silver Statement Earrings",
    price: 1899,
    oldPrice: 2699,
    category: "Earrings",
    material: "Silver",
    style: "Traditional",
    rating: 4.3,
    badge: "TRENDING",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Pearl Layered Necklace",
    price: 3299,
    oldPrice: 4299,
    category: "Necklaces",
    material: "Gold Plated",
    style: "Modern",
    rating: 4.7,
    badge: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    name: "Emerald Gold Ring",
    price: 2799,
    oldPrice: 3799,
    category: "Rings",
    material: "Gold Plated",
    style: "Traditional",
    rating: 4.4,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    name: "Pearl Drop Earrings",
    price: 1499,
    oldPrice: 1999,
    category: "Earrings",
    material: "Silver",
    style: "Modern",
    rating: 4.2,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    name: "Elegant Gold Chain",
    price: 2199,
    oldPrice: 2999,
    category: "Necklaces",
    material: "Gold Plated",
    style: "Minimal",
    rating: 4.6,
    badge: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 7,
    name: "Floral Festive Earrings",
    price: 1799,
    oldPrice: 2499,
    category: "Earrings",
    material: "Gold Plated",
    style: "Traditional",
    rating: 4.5,
    badge: "TRENDING",
    image:
      "https://images.unsplash.com/photo-1635767798638-3665a0a4c1c4?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 8,
    name: "Minimal Gold Bracelet",
    price: 1999,
    oldPrice: 2799,
    category: "Bracelets",
    material: "Gold Plated",
    style: "Minimal",
    rating: 4.1,
    badge: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=85",
  },
];

const filterOptions = {
  Category: ["Necklaces", "Earrings", "Rings", "Bracelets"],
  Material: ["Gold Plated", "Silver"],
  Style: ["Traditional", "Modern", "Minimal"],
  Availability: ["Bestsellers", "New Arrivals"],
};

function FilterSection({ title, options, selected, onChange }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          py: 1,
        }}
      >
        <Typography fontWeight={700} fontSize={14}>
          {title}
        </Typography>
        <KeyboardArrowDownIcon
          sx={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.2s",
          }}
        />
      </Box>

      {expanded && (
        <FormGroup>
          {options.map((option) => (
            <FormControlLabel
              key={option}
              sx={{
                my: -0.4,
                "& .MuiFormControlLabel-label": {
                  fontSize: 12,
                  color: "#51484a",
                },
              }}
              control={
                <Checkbox
                  size="small"
                  checked={selected.includes(option)}
                  onChange={() => onChange(option)}
                  sx={{
                    color: "#c7b8b3",
                    "&.Mui-checked": { color: burgundy },
                  }}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
      )}
      <Divider sx={{ mt: 1.5, borderColor: "#eee6e3" }} />
    </Box>
  );
}

export default function BridalFestive() {
  const [selected, setSelected] = useState({
    Category: [],
    Material: [],
    Style: [],
    Availability: [],
  });

  const [priceRange, setPriceRange] = useState([500, 4000]);
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartMessage, setCartMessage] = useState("");

  const toggleFilter = (section, value) => {
    setSelected((prev) => ({
      ...prev,
      [section]: prev[section].includes(value)
        ? prev[section].filter((item) => item !== value)
        : [...prev[section], value],
    }));
  };

  const clearFilters = () => {
    setSelected({
      Category: [],
      Material: [],
      Style: [],
      Availability: [],
    });
    setPriceRange([500, 4000]);
    setSearch("");
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const categoryMatch =
        !selected.Category.length ||
        selected.Category.includes(product.category);

      const materialMatch =
        !selected.Material.length ||
        selected.Material.includes(product.material);

      const styleMatch =
        !selected.Style.length ||
        selected.Style.includes(product.style);

      const availabilityMatch =
        !selected.Availability.length ||
        selected.Availability.some((item) => {
          if (item === "Bestsellers") {
            return product.badge === "BESTSELLER";
          }
          if (item === "New Arrivals") {
            return product.badge === "NEW";
          }
          return true;
        });

      const priceMatch =
        product.price >= priceRange[0] &&
        product.price <= priceRange[1];

      const searchMatch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return (
        categoryMatch &&
        materialMatch &&
        styleMatch &&
        availabilityMatch &&
        priceMatch &&
        searchMatch
      );
    });

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === "newest") {
      result.sort(
        (a, b) =>
          Number(b.badge === "NEW") - Number(a.badge === "NEW")
      );
    }

    return result;
  }, [selected, priceRange, search, sort]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setCartMessage(`${product.name} added to your bag.`);
  };

  const activeFilterCount =
    Object.values(selected).reduce(
      (count, items) => count + items.length,
      0
    ) +
    (priceRange[0] !== 500 || priceRange[1] !== 4000 ? 1 : 0);

  return (
    <Box sx={{ bgcolor: "#faf8f5", color: "#302526", minHeight: "100vh" }}>
      {/* Breadcrumbs */}
      <Container maxWidth="xl" sx={{ pt: 2, pb: 1 }}>
        <Breadcrumbs sx={{ fontSize: 11 }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography fontSize={11} color="text.secondary">
            Jewellery
          </Typography>
          <Typography fontSize={11} color={burgundy}>
            Bridal & Festive Collection
          </Typography>
        </Breadcrumbs>
      </Container>

      {/* Hero section */}
      <Container maxWidth="xl" sx={{ pb: 3 }}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                p: { xs: 2, md: 4 },
                height: "100%",
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #f3e9df, #fffaf3)",
                borderRadius: 2,
              }}
            >
              <Chip
                label="THE FESTIVE EDIT"
                size="small"
                sx={{
                  bgcolor: "#eee0bd",
                  color: burgundy,
                  fontWeight: 700,
                  width: "fit-content",
                  mb: 2,
                }}
              />
              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  fontSize: { xs: 30, md: 43 },
                  lineHeight: 1.15,
                  color: burgundy,
                  fontWeight: 700,
                  mb: 1.5,
                }}
              >
                Jewellery That
                <br />
                Celebrates You
              </Typography>
              <Typography
                sx={{ fontSize: 13, color: "#716365", maxWidth: 430, mb: 2 }}
              >
                Discover timeless designs, elegant statement pieces and
                festive favourites made for your special moments.
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="Everyday Elegance" variant="outlined" />
                <Chip label="Festive Favourites" variant="outlined" />
                <Chip label="Timeless Designs" variant="outlined" />
              </Stack>

              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  bgcolor: burgundy,
                  alignSelf: "flex-start",
                  px: 3,
                  "&:hover": { bgcolor: "#48101d" },
                }}
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                SHOP COLLECTION
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src={products[2].image}
              alt="Jewellery collection"
              sx={{
                width: "100%",
                height: { xs: 240, md: "100%" },
                minHeight: 280,
                objectFit: "cover",
                borderRadius: 2,
                display: "block",
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Benefits */}
      <Container maxWidth="xl" sx={{ pb: 3 }}>
        <Grid container spacing={1}>
          {[
            ["✦", "Premium Designs", "Carefully selected styles"],
            ["◇", "Quality Checked", "Made for lasting elegance"],
            ["♡", "Easy Shopping", "Find your perfect piece"],
          ].map(([icon, title, description]) => (
            <Grid item xs={12} sm={4} key={title}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "#fff",
                  border: "1px solid #eee5df",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Typography fontSize={27} color={gold}>
                  {icon}
                </Typography>
                <Box>
                  <Typography fontSize={13} fontWeight={700}>
                    {title}
                  </Typography>
                  <Typography fontSize={11} color="text.secondary">
                    {description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Category shortcuts */}
      <Container maxWidth="xl" sx={{ pb: 3 }}>
        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: 24,
            color: burgundy,
            mb: 2,
          }}
        >
          Explore Our Collection
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {filterOptions.Category.map((category) => (
            <Chip
              key={category}
              label={category}
              clickable
              onClick={() => toggleFilter("Category", category)}
              color={
                selected.Category.includes(category) ? "primary" : "default"
              }
              sx={{
                px: 1,
                bgcolor: selected.Category.includes(category)
                  ? burgundy
                  : "#fff",
                color: selected.Category.includes(category)
                  ? "#fff"
                  : "#403638",
                border: "1px solid #e9dfd9",
                "&:hover": {
                  bgcolor: burgundy,
                  color: "#fff",
                },
              }}
            />
          ))}
        </Stack>
      </Container>

      {/* Product listing */}
      <Box id="products" sx={{ bgcolor: "#fff", py: 3 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  color: burgundy,
                  fontSize: 27,
                }}
              >
                Bridal & Festive Jewellery
              </Typography>
              <Typography color="text.secondary" fontSize={12} sx={{ mt: 0.5 }}>
                Discover pieces for every celebration and every style.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              <TextField
                size="small"
                placeholder="Search jewellery..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: { xs: "100%", sm: 220 } }}
              />

              <Select
                size="small"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                sx={{ minWidth: 180, fontSize: 12 }}
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Top Rated</MenuItem>
              </Select>
            </Stack>
          </Box>

          <Grid container spacing={2.5}>
            {/* Filter sidebar */}
            <Grid item xs={12} md={3} lg={2.5}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #eee6e1",
                  borderRadius: 2,
                  position: { md: "sticky" },
                  top: 20,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography fontSize={16} fontWeight={700}>
                    Filters
                  </Typography>
                  <Button
                    size="small"
                    onClick={clearFilters}
                    sx={{ color: burgundy, textTransform: "none" }}
                  >
                    Clear all
                  </Button>
                </Box>

                {activeFilterCount > 0 && (
                  <Chip
                    size="small"
                    label={`${activeFilterCount} active`}
                    sx={{ mb: 2, bgcolor: "#f2e5e6", color: burgundy }}
                  />
                )}

                {Object.entries(filterOptions)
                  .filter(([section]) => section !== "Availability")
                  .map(([section, options]) => (
                    <FilterSection
                      key={section}
                      title={section}
                      options={options}
                      selected={selected[section]}
                      onChange={(value) => toggleFilter(section, value)}
                    />
                  ))}

                <Box sx={{ mb: 2.5 }}>
                  <Typography fontSize={14} fontWeight={700} sx={{ mb: 1 }}>
                    Price Range
                  </Typography>

                  <Slider
                    value={priceRange}
                    onChange={(_, value) => setPriceRange(value)}
                    min={500}
                    max={4000}
                    step={100}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `₹${value}`}
                    sx={{
                      color: burgundy,
                      "& .MuiSlider-thumb": {
                        bgcolor: burgundy,
                      },
                    }}
                  />

                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize={11}>₹{priceRange[0]}</Typography>
                    <Typography fontSize={11}>₹{priceRange[1]}</Typography>
                  </Stack>
                  <Divider sx={{ mt: 2, borderColor: "#eee6e3" }} />
                </Box>

                <FilterSection
                  title="Availability"
                  options={filterOptions.Availability}
                  selected={selected.Availability}
                  onChange={(value) => toggleFilter("Availability", value)}
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  sx={{
                    bgcolor: burgundy,
                    "&:hover": { bgcolor: "#48101d" },
                  }}
                >
                  Apply Filters
                </Button>
              </Paper>
            </Grid>

            {/* Product grid */}
            <Grid item xs={12} md={9} lg={9.5}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography fontSize={12} color="text.secondary">
                  Showing {filteredProducts.length} of {products.length} products
                </Typography>

                {activeFilterCount > 0 && (
                  <Button
                    size="small"
                    onClick={clearFilters}
                    sx={{ color: burgundy, textTransform: "none" }}
                  >
                    Reset filters
                  </Button>
                )}
              </Box>

              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={6} sm={6} md={4} lg={3} key={product.id}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        border: "1px solid #f0e9e5",
                        borderRadius: 1.5,
                        transition: "0.25s",
                        "&:hover": {
                          boxShadow: "0 8px 25px rgba(60,30,30,0.10)",
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <Box sx={{ position: "relative", overflow: "hidden" }}>
                        <CardMedia
                          component="img"
                          image={product.image}
                          alt={product.name}
                          sx={{
                            height: { xs: 160, sm: 205, md: 220 },
                            objectFit: "cover",
                            bgcolor: "#f7f1eb",
                          }}
                        />

                        <Chip
                          label={product.badge}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 7,
                            bgcolor:
                              product.badge === "NEW" ? "#e9dca9" : burgundy,
                            color:
                              product.badge === "NEW" ? burgundy : "#fff",
                            fontSize: 9,
                            height: 22,
                            fontWeight: 700,
                          }}
                        />

                        <IconButton
                          aria-label={
                            wishlist.includes(product.id)
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          onClick={() => toggleWishlist(product.id)}
                          sx={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            bgcolor: "#ffffffdf",
                            "&:hover": { bgcolor: "#fff" },
                          }}
                          size="small"
                        >
                          {wishlist.includes(product.id) ? (
                            <FavoriteIcon
                              sx={{ color: burgundy, fontSize: 19 }}
                            />
                          ) : (
                            <FavoriteBorderIcon sx={{ fontSize: 19 }} />
                          )}
                        </IconButton>
                      </Box>

                      <CardContent sx={{ p: 1.3 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={{ mb: 0.5 }}
                        >
                          <Rating
                            value={product.rating}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{
                              fontSize: 13,
                              color: gold,
                            }}
                          />
                          <Typography fontSize={10} color="text.secondary">
                            {product.rating}
                          </Typography>
                        </Stack>

                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 600,
                            minHeight: 36,
                            lineHeight: 1.5,
                          }}
                        >
                          {product.name}
                        </Typography>

                        <Typography
                          sx={{ fontSize: 10, color: "#897b7b", mb: 0.5 }}
                        >
                          {product.material} · {product.style}
                        </Typography>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.8}
                          flexWrap="wrap"
                          useFlexGap
                          sx={{ mb: 1.2 }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            color={burgundy}
                          >
                            ₹{product.price.toLocaleString("en-IN")}
                          </Typography>
                          <Typography
                            fontSize={10}
                            color="text.secondary"
                            sx={{ textDecoration: "line-through" }}
                          >
                            ₹{product.oldPrice.toLocaleString("en-IN")}
                          </Typography>
                          <Typography fontSize={10} color="#34754b">
                            {Math.round(
                              (1 - product.price / product.oldPrice) * 100
                            )}
                            % off
                          </Typography>
                        </Stack>

                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          startIcon={<ShoppingBagOutlinedIcon />}
                          onClick={() => addToCart(product)}
                          sx={{
                            fontSize: 10,
                            borderColor: burgundy,
                            color: burgundy,
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: burgundy,
                              color: "#fff",
                              borderColor: burgundy,
                            },
                          }}
                        >
                          Add to Bag
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {filteredProducts.length === 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    textAlign: "center",
                    p: 5,
                    mt: 2,
                    border: "1px solid #eee6e1",
                  }}
                >
                  <Typography fontSize={18} fontWeight={700} color={burgundy}>
                    No products found
                  </Typography>
                  <Typography color="text.secondary" fontSize={13} sx={{ mt: 1 }}>
                    Try changing your filters or price range.
                  </Typography>
                  <Button
                    onClick={clearFilters}
                    sx={{ mt: 2, color: burgundy }}
                  >
                    Clear all filters
                  </Button>
                </Paper>
              )}

              {cartMessage && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mt: 2,
                    bgcolor: "#f2e9e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Typography fontSize={12}>{cartMessage}</Typography>
                  <Button
                    size="small"
                    onClick={() => setCartMessage("")}
                    sx={{ color: burgundy }}
                  >
                    Dismiss
                  </Button>
                </Paper>
              )}

              <Typography
                fontSize={12}
                color="text.secondary"
                sx={{ mt: 2, textAlign: "right" }}
              >
                Bag items in this demo: {cart.length} · Wishlist items:{" "}
                {wishlist.length}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Collection information */}
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            bgcolor: "#fff",
            borderRadius: 2,
            border: "1px solid #eee6e1",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  fontSize: 26,
                  color: burgundy,
                  mb: 1.5,
                }}
              >
                The Art of Fine Jewellery
              </Typography>
              <Typography fontSize={13} color="text.secondary" lineHeight={1.9}>
                Discover thoughtfully selected jewellery that brings together
                timeless inspiration and contemporary style. From delicate
                everyday pieces to statement designs for celebrations, find
                something that feels uniquely yours.
              </Typography>

              <Stack spacing={1.2} sx={{ mt: 2.5 }}>
                {[
                  "Styles for everyday and special occasions",
                  "Designs to complement your personal style",
                  "Beautiful gifting options for every celebration",
                ].map((text) => (
                  <Stack key={text} direction="row" spacing={1}>
                    <Typography color={gold}>✦</Typography>
                    <Typography fontSize={12}>{text}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  bgcolor: burgundy,
                  "&:hover": { bgcolor: "#48101d" },
                }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Explore Collection
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={products[0].image}
                alt="Fine jewellery details"
                sx={{
                  width: "100%",
                  height: { xs: 220, md: 300 },
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Service cards */}
      <Container maxWidth="xl" sx={{ pb: 5 }}>
        <Typography
          textAlign="center"
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: 27,
            color: burgundy,
            mb: 3,
          }}
        >
          A Shopping Experience to Treasure
        </Typography>

        <Grid container spacing={2}>
          {[
            {
              icon: <LocalShippingOutlinedIcon sx={{ fontSize: 30 }} />,
              title: "Convenient Shopping",
              description:
                "Browse different designs and find your favourite pieces with ease.",
            },
            {
              icon: <WorkspacePremiumOutlinedIcon sx={{ fontSize: 30 }} />,
              title: "Quality & Craftsmanship",
              description:
                "Explore carefully selected jewellery for different occasions.",
            },
            {
              icon: <ReplayOutlinedIcon sx={{ fontSize: 30 }} />,
              title: "Customer Care",
              description:
                "Find helpful information for a smooth shopping experience.",
            },
          ].map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  bgcolor: "#fff",
                  border: "1px solid #eee6e1",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ color: gold, mb: 1.5 }}>{item.icon}</Box>
                <Typography fontSize={15} fontWeight={700} sx={{ mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography
                  fontSize={12}
                  lineHeight={1.8}
                  color="text.secondary"
                >
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Newsletter */}
      <Box sx={{ bgcolor: "#f0e8e3", py: 4 }}>
        <Container maxWidth="xl">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  color: burgundy,
                  fontSize: 26,
                }}
              >
                Join Our Jewellery Club
              </Typography>
              <Typography fontSize={12} color="text.secondary" sx={{ mt: 1 }}>
                Discover new collections, styling inspiration and special offers.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <NewsletterForm />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bottom footer content; existing site footer can remain in App.jsx */}
      <Box sx={{ bgcolor: "#fff", py: 4 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {[
              {
                title: "ABOUT ZINORA",
                links: ["Our Story", "Our Collections", "Contact Us"],
              },
              {
                title: "CUSTOMER SERVICE",
                links: ["Help Centre", "Shipping Information", "Returns"],
              },
              {
                title: "SHOP",
                links: ["Necklaces", "Earrings", "Rings", "Bracelets"],
              },
              {
                title: "INFORMATION",
                links: ["Privacy Policy", "Terms & Conditions", "FAQs"],
              },
            ].map((section) => (
              <Grid item xs={6} md={3} key={section.title}>
                <Typography
                  fontSize={12}
                  fontWeight={700}
                  color={burgundy}
                  sx={{ mb: 1.5 }}
                >
                  {section.title}
                </Typography>

                {section.links.map((link) => (
                  <Typography
                    key={link}
                    fontSize={12}
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      cursor: "pointer",
                      "&:hover": { color: burgundy },
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            fontSize={11}
            color="text.secondary"
            textAlign="center"
          >
            © {new Date().getFullYear()} Zinora. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const subscribe = (event) => {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <Box
      component="form"
      onSubmit={subscribe}
      sx={{
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
      }}
    >
      <TextField
        size="small"
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{
          flex: 1,
          minWidth: 180,
          bgcolor: "#fff",
        }}
      />

      <Button
        type="submit"
        variant="contained"
        sx={{
          bgcolor: burgundy,
          "&:hover": { bgcolor: "#48101d" },
        }}
      >
        Subscribe
      </Button>

      {message && (
        <Typography
          role="status"
          fontSize={12}
          sx={{
            width: "100%",
            color: message.startsWith("Thank") ? "green" : burgundy,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
