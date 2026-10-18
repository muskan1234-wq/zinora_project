import React, { useState, useMemo, useEffect } from "react";

import {
Box,
Typography,
Button,
Paper,
Grid,
TextField,
InputAdornment,
MenuItem,
Chip,
IconButton,
Switch,
Avatar,
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Stack,
Tooltip,
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
Card,
CardContent,
FormControlLabel,
Divider,
} from "@mui/material";

import {
  Add,
  Search,
  EditOutlined,
  Delete as DeleteOutline,
  Inventory2Outlined,
  CategoryOutlined,
  ToggleOnOutlined,
  CurrencyRupee,
  Close,
  CloudUploadOutlined,
  RestartAlt,
} from "@mui/icons-material";

const MAROON = "#650c20";
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const PRODUCTS_API = `${API_BASE}/api/products/`;
const CATEGORIES_API = `${API_BASE}/api/products/categories/`;

const EMPTY_PRODUCT = {
  name: "", sku: "", category: "", categoryId: "", price: "",
  originalPrice: "", stock: "", description: "", status: true,
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("zinoraAdminToken");
  return token ? { Authorization: `Token ${token}` } : {};
};

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) return image;
  return `${API_BASE}${image.startsWith("/") ? "" : "/"}${image}`;
};

const normalizeProduct = (item) => ({
  id: item.id,
  name: item.name || "",
  sku: item.sku || "",
  category: item.category_name || item.category_detail?.name || "",
  categoryId: String(item.category ?? item.category_id ?? ""),
  price: Number(item.price || 0),
  originalPrice: item.original_price == null ? "" : Number(item.original_price),
  stock: Number(item.stock_quantity || 0),
  description: item.description || "",
  image: getImageUrl(item.image),
  status: Boolean(item.is_active),
});

function Products() {
const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [apiError, setApiError] = useState("");
const [saving, setSaving] = useState(false);
const [imageFile, setImageFile] = useState(null);

const [search, setSearch] = useState("");
const [categoryFilter, setCategoryFilter] = useState("All");
const [statusFilter, setStatusFilter] = useState("All");

const [dialogOpen, setDialogOpen] = useState(false);
const [editingId, setEditingId] = useState(null);
const [form, setForm] = useState(EMPTY_PRODUCT);
const [formError, setFormError] = useState("");
const [deleteId, setDeleteId] = useState(null);

const [imagePreview, setImagePreview] = useState("");

const loadData = async () => {
  setLoading(true);
  setApiError("");
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch(PRODUCTS_API, { headers: getAuthHeaders() }),
      fetch(CATEGORIES_API, { headers: getAuthHeaders() }),
    ]);
    if (!productsResponse.ok) throw new Error(`Products API error (${productsResponse.status}).`);
    if (!categoriesResponse.ok) throw new Error(`Categories API error (${categoriesResponse.status}).`);
    const productsJson = await productsResponse.json();
    const categoriesJson = await categoriesResponse.json();
    setProducts((Array.isArray(productsJson) ? productsJson : productsJson.results || []).map(normalizeProduct));
    setCategories(Array.isArray(categoriesJson) ? categoriesJson : categoriesJson.results || []);
  } catch (error) {
    setApiError(`${error.message} Check that Django is running and the API URLs are configured.`);
  } finally {
    setLoading(false);
  }
};

useEffect(() => { loadData(); }, []);

const filteredProducts = useMemo(() => {
return products.filter((product) => {
const searchText = search.trim().toLowerCase();


  const matchesSearch =
    product.name.toLowerCase().includes(searchText) ||
    product.sku.toLowerCase().includes(searchText);

  const matchesCategory =
    categoryFilter === "All" ||
    product.category === categoryFilter;

  const matchesStatus =
    statusFilter === "All" ||
    (statusFilter === "Active" && product.status) ||
    (statusFilter === "Inactive" && !product.status);

  return matchesSearch && matchesCategory && matchesStatus;
});


}, [products, search, categoryFilter, statusFilter]);

const activeCount = products.filter((p) => p.status).length;
const inactiveCount = products.filter((p) => !p.status).length;
const lowStockCount = products.filter(
(p) => Number(p.stock) > 0 && Number(p.stock) <= 10
).length;

const formatPrice = (price) =>
`₹${Number(price || 0).toLocaleString("en-IN")}`;

const openAddDialog = () => {
setEditingId(null);
setForm({ ...EMPTY_PRODUCT });
setFormError("");
setImagePreview("");
setImageFile(null);
setDialogOpen(true);
};

const openEditDialog = (product) => {
setEditingId(product.id);


setForm({ ...product, categoryId: String(product.categoryId || ""), price: String(product.price), originalPrice: String(product.originalPrice ?? ""), stock: String(product.stock) });
setImageFile(null);

setImagePreview(product.image || "");
setFormError("");
setDialogOpen(true);
};

const closeDialog = () => {
setDialogOpen(false);
setEditingId(null);
setForm({ ...EMPTY_PRODUCT });
setFormError("");
setImagePreview("");
setImageFile(null);
};

const handleInputChange = (event) => {
const { name, value } = event.target;
  if (name === "category") {
    const selected = categories.find((item) => String(item.id) === String(value));
    setForm((previous) => ({ ...previous, categoryId: value, category: selected?.name || "" }));
    return;
  }
  setForm((previous) => ({ ...previous, [name]: value }));


};

const handleImageChange = (event) => {
const file = event.target.files?.[0];


if (!file) return;

if (!file.type.startsWith("image/")) {
  setFormError("Please select a valid image file.");
  event.target.value = "";
  return;
}

if (file.size > 5 * 1024 * 1024) {
  setFormError("Image size must be less than 5 MB.");
  event.target.value = "";
  return;
}

setFormError("");

setImageFile(file);
setImagePreview(URL.createObjectURL(file));
};

const handleSaveProduct = async (event) => {
  event.preventDefault();
  setFormError("");
  if (!form.name.trim() || !form.sku.trim() || !form.categoryId || form.price === "" || form.stock === "") {
    setFormError("Please fill in all required product fields and select a category."); return;
  }
  const price = Number(form.price);
  const originalPrice = form.originalPrice === "" ? null : Number(form.originalPrice);
  const stock = Number(form.stock);
  if (!Number.isFinite(price) || (originalPrice !== null && !Number.isFinite(originalPrice)) || !Number.isInteger(stock) || price < 0 || (originalPrice !== null && originalPrice < 0) || stock < 0) {
    setFormError("Price and stock must be valid non-negative numbers. Stock must be a whole number."); return;
  }
  if (originalPrice !== null && originalPrice > 0 && price > originalPrice) {
    setFormError("Selling price should not exceed the original price."); return;
  }
  const duplicateSku = products.some((product) => product.sku.trim().toLowerCase() === form.sku.trim().toLowerCase() && product.id !== editingId);
  if (duplicateSku) { setFormError("This SKU already exists. Please use a unique SKU."); return; }

  const payload = new FormData();
  payload.append("name", form.name.trim());
  payload.append("sku", form.sku.trim());
  payload.append("category", form.categoryId);
  payload.append("price", String(price));
  if (originalPrice !== null) payload.append("original_price", String(originalPrice));
  payload.append("stock_quantity", String(stock));
  payload.append("description", form.description.trim());
  payload.append("is_active", String(Boolean(form.status)));
  if (imageFile) payload.append("image", imageFile);

  setSaving(true);
  try {
    const url = editingId !== null ? `${PRODUCTS_API}${editingId}/` : PRODUCTS_API;
    const response = await fetch(url, {
      method: editingId !== null ? "PATCH" : "POST",
      headers: getAuthHeaders(),
      body: payload,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data.detail || Object.entries(data).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`).join(" | ");
      throw new Error(detail || `Could not save product (${response.status}).`);
    }
    await loadData();
    closeDialog();
  } catch (error) {
    setFormError(error.message || "Unable to save product. Please try again.");
  } finally { setSaving(false); }
};

const handleDeleteProduct = async () => {
  try {
    const response = await fetch(`${PRODUCTS_API}${deleteId}/`, { method: "DELETE", headers: getAuthHeaders() });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || `Delete failed (${response.status}).`);
    }
    setProducts((previous) => previous.filter((product) => product.id !== deleteId));
    setDeleteId(null);
    setApiError("");
  } catch (error) { setApiError(error.message); setDeleteId(null); }
};

const handleStatusChange = async (id) => {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const payload = new FormData();
  payload.append("is_active", String(!product.status));
  try {
    const response = await fetch(`${PRODUCTS_API}${id}/`, { method: "PATCH", headers: getAuthHeaders(), body: payload });
    if (!response.ok) throw new Error(`Could not update status (${response.status}).`);
    const updated = normalizeProduct(await response.json());
    setProducts((previous) => previous.map((item) => item.id === id ? updated : item));
  } catch (error) { setApiError(error.message); }
};

const resetFilters = () => {
setSearch("");
setCategoryFilter("All");
setStatusFilter("All");
};

return (
<Box sx={{ width: "100%" }}>
{apiError && <Paper sx={{ p: 2, mb: 2, border: "1px solid #f0c5c5", color: "#a11", bgcolor: "#fff8f8" }}>{apiError}</Paper>}
{loading && <Typography sx={{ mb: 2, color: MAROON }}>Loading products from backend...</Typography>}
{/* PAGE HEADING */}
<Box
sx={{
display: "flex",
justifyContent: "space-between",
alignItems: { xs: "flex-start", sm: "center" },
flexDirection: { xs: "column", sm: "row" },
gap: 2,
mb: 3,
}}
> <Box>
<Typography
sx={{
fontSize: { xs: 23, md: 28 },
fontWeight: 800,
color: MAROON,
}}
>
Product Management </Typography>


      <Typography sx={{ color: "#8b8082", fontSize: 13, mt: 0.5 }}>
        Manage your jewellery catalogue, prices, stock and visibility.
      </Typography>
    </Box>

    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={openAddDialog}
      sx={{
        bgcolor: MAROON,
        color: "#fff",
        px: 2.5,
        py: 1.2,
        borderRadius: 2,
        fontWeight: 700,
        textTransform: "none",
        boxShadow: "none",
        "&:hover": {
          bgcolor: "#4b0918",
          boxShadow: "none",
        },
      }}
    >
      Add Product
    </Button>
  </Box>

  {/* SUMMARY CARDS */}
  <Grid container spacing={2} sx={{ mb: 3 }}>
    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <Card
        elevation={0}
        sx={{
          border: "1px solid #eee5e2",
          borderRadius: 3,
          height: "100%",
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#f8edf0", color: MAROON, width: 48, height: 48 }}>
            <Inventory2Outlined />
          </Avatar>

          <Box>
            <Typography sx={{ color: "#8b8082", fontSize: 12 }}>
              Total Products
            </Typography>

            <Typography sx={{ fontSize: 25, fontWeight: 800, color: MAROON }}>
              {products.length}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>

    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <Card
        elevation={0}
        sx={{
          border: "1px solid #eee5e2",
          borderRadius: 3,
          height: "100%",
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#e8f7ed", color: "#218344", width: 48, height: 48 }}>
            <ToggleOnOutlined />
          </Avatar>

          <Box>
            <Typography sx={{ color: "#8b8082", fontSize: 12 }}>
              Active Products
            </Typography>

            <Typography sx={{ fontSize: 25, fontWeight: 800, color: "#218344" }}>
              {activeCount}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>

    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <Card
        elevation={0}
        sx={{
          border: "1px solid #eee5e2",
          borderRadius: 3,
          height: "100%",
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#fff4df", color: "#ad761b", width: 48, height: 48 }}>
            <CategoryOutlined />
          </Avatar>

          <Box>
            <Typography sx={{ color: "#8b8082", fontSize: 12 }}>
              Categories
            </Typography>

            <Typography sx={{ fontSize: 25, fontWeight: 800, color: "#ad761b" }}>
              {categories.length}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>

    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <Card
        elevation={0}
        sx={{
          border: "1px solid #eee5e2",
          borderRadius: 3,
          height: "100%",
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#fff0ed", color: "#bd4b30", width: 48, height: 48 }}>
            <Inventory2Outlined />
          </Avatar>

          <Box>
            <Typography sx={{ color: "#8b8082", fontSize: 12 }}>
              Low Stock (1–10)
            </Typography>

            <Typography sx={{ fontSize: 25, fontWeight: 800, color: "#bd4b30" }}>
              {lowStockCount}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  </Grid>

  {/* CATEGORY SHORTCUTS */}
  <Paper
    elevation={0}
    sx={{
      border: "1px solid #eee5e2",
      borderRadius: 3,
      p: 2.5,
      mb: 3,
    }}
  >
    <Typography sx={{ fontSize: 16, fontWeight: 800, color: MAROON, mb: 1.8 }}>
      Product Categories
    </Typography>

    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      flexWrap="wrap"
    >
      <Chip
        label="All Categories"
        onClick={() => setCategoryFilter("All")}
        variant={categoryFilter === "All" ? "filled" : "outlined"}
        sx={{
          fontWeight: 600,
          bgcolor: categoryFilter === "All" ? MAROON : "transparent",
          color: categoryFilter === "All" ? "#fff" : "#6d6064",
          borderColor: "#ded2d3",
          "&:hover": {
            bgcolor: categoryFilter === "All" ? "#4b0918" : "#faf3f4",
          },
        }}
      />

      {categories.map((category) => (
        <Chip
          key={category.id}
          label={category.name}
          clickable
          onClick={() => setCategoryFilter(category.name)}
          variant={categoryFilter === category.name ? "filled" : "outlined"}
          sx={{
            fontWeight: 600,
            bgcolor: categoryFilter === category.name ? MAROON : "transparent",
            color: categoryFilter === category.name ? "#fff" : "#6d6064",
            borderColor: "#ded2d3",
            "&:hover": {
              bgcolor: categoryFilter === category.name ? "#4b0918" : "#faf3f4",
            },
          }}
        />
      ))}
    </Stack>
  </Paper>

  {/* SEARCH AND FILTERS */}
  <Paper
    elevation={0}
    sx={{
      p: 2,
      border: "1px solid #eee5e2",
      borderRadius: 3,
      mb: 2,
    }}
  >
    <Grid container spacing={2} sx={{ alignItems: "center" }}>
      <Grid size={{ xs: 12, md: 5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search product name or SKU..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#8c7a7d" }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <TextField
          fullWidth
          select
          size="small"
          label="Category"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          <MenuItem value="All">All Categories</MenuItem>

          {categories.map((category) => (
            <MenuItem key={category.id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <TextField
          fullWidth
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <MenuItem value="All">All Statuses</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, md: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<RestartAlt />}
          onClick={resetFilters}
          sx={{
            height: 40,
            color: MAROON,
            borderColor: "#d9c5ca",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Reset Filters
        </Button>
      </Grid>
    </Grid>
  </Paper>

  {/* PRODUCTS TABLE */}
  <Paper
    elevation={0}
    sx={{
      border: "1px solid #eee5e2",
      borderRadius: 3,
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        p: 2.5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: 17, color: MAROON }}>
          All Products
        </Typography>

        <Typography sx={{ color: "#8b8082", fontSize: 12, mt: 0.5 }}>
          Showing {filteredProducts.length} of {products.length} products
        </Typography>
      </Box>

      <Chip
        label={`${activeCount} Active · ${inactiveCount} Inactive`}
        size="small"
        sx={{
          bgcolor: "#faf3f4",
          color: MAROON,
          fontWeight: 700,
        }}
      />
    </Box>

    <Divider />

    <TableContainer sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 950 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "#fcf9f7" }}>
            {[
              "PRODUCT",
              "SKU",
              "CATEGORY",
              "PRICE",
              "STOCK",
              "STATUS",
              "ACTIONS",
            ].map((heading) => (
              <TableCell
                key={heading}
                sx={{
                  color: "#8a777c",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 0.8,
                  py: 2,
                  whiteSpace: "nowrap",
                }}
              >
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow
              key={product.id}
              hover
              sx={{
                "&:last-child td": { borderBottom: 0 },
              }}
            >
              {/* PRODUCT DETAILS */}
              <TableCell sx={{ py: 1.8 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    variant="rounded"
                    src={product.image || undefined}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "#f8edf0",
                      color: MAROON,
                      border: "1px solid #eee5e2",
                    }}
                  >
                    <Inventory2Outlined />
                  </Avatar>

                  <Box sx={{ minWidth: 130 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 12,
                        color: "#392a2e",
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#998b8d",
                        mt: 0.4,
                      }}
                    >
                      {product.description || "No description"}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>

              <TableCell>
                <Typography sx={{ fontSize: 12, color: "#726568" }}>
                  {product.sku}
                </Typography>
              </TableCell>

              <TableCell>
                <Chip
                  label={product.category}
                  size="small"
                  sx={{
                    bgcolor: "#f8f4f0",
                    color: "#69565b",
                    fontSize: 10,
                    maxWidth: 170,
                  }}
                />
              </TableCell>

              <TableCell>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: MAROON,
                  }}
                >
                  {formatPrice(product.price)}
                </Typography>

                {Number(product.originalPrice) > Number(product.price) && (
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#a49a9b",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatPrice(product.originalPrice)}
                  </Typography>
                )}
              </TableCell>

              <TableCell>
                <Chip
                  size="small"
                  label={
                    Number(product.stock) === 0
                      ? "Out of stock"
                      : `${product.stock} units`
                  }
                  sx={{
                    bgcolor:
                      Number(product.stock) === 0
                        ? "#fff0ed"
                        : Number(product.stock) <= 10
                        ? "#fff5df"
                        : "#eaf7ee",
                    color:
                      Number(product.stock) === 0
                        ? "#bd4b30"
                        : Number(product.stock) <= 10
                        ? "#a66b12"
                        : "#258047",
                    fontWeight: 700,
                    fontSize: 10,
                  }}
                />
              </TableCell>

              {/* ACTIVE / INACTIVE */}
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Switch
                    size="small"
                    checked={Boolean(product.status)}
                    onChange={() => handleStatusChange(product.id)}
                    inputProps={{
                      "aria-label": `Change ${product.name} status`,
                    }}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: MAROON,
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: MAROON,
                      },
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: product.status ? "#258047" : "#9a8c8f",
                    }}
                  >
                    {product.status ? "Active" : "Inactive"}
                  </Typography>
                </Stack>
              </TableCell>

              {/* ACTIONS */}
              <TableCell>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Edit Product">
                    <IconButton
                      size="small"
                      onClick={() => openEditDialog(product)}
                      sx={{
                        color: MAROON,
                        bgcolor: "#f8edf0",
                        "&:hover": { bgcolor: "#f0dfe4" },
                      }}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete Product">
                    <IconButton
                      size="small"
                      onClick={() => setDeleteId(product.id)}
                      sx={{
                        color: "#bd303d",
                        bgcolor: "#fff0f0",
                        "&:hover": { bgcolor: "#ffe0e0" },
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}

          {filteredProducts.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} sx={{ py: 7, textAlign: "center" }}>
                <Inventory2Outlined
                  sx={{ fontSize: 45, color: "#d7c5c9", mb: 1 }}
                />

                <Typography sx={{ fontWeight: 700, color: MAROON }}>
                  No products found
                </Typography>

                <Typography sx={{ color: "#968a8d", fontSize: 12, mt: 0.5 }}>
                  Try changing your search or filters.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>

  {/* ADD / EDIT PRODUCT DIALOG */}
  <Dialog
    open={dialogOpen}
    onClose={closeDialog}
    fullWidth
    maxWidth="md"
    PaperProps={{
      sx: {
        borderRadius: 3,
        backgroundColor: "#fff",
      },
    }}
  >
    <Box
      component="form"
      onSubmit={handleSaveProduct}
      noValidate
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee5e2",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 21, fontWeight: 800, color: MAROON }}>
            {editingId !== null ? "Edit Product" : "Add New Product"}
          </Typography>

          <Typography sx={{ fontSize: 12, color: "#8b8082", mt: 0.5 }}>
            Enter product details for your Zinora catalogue.
          </Typography>
        </Box>

        <IconButton onClick={closeDialog} aria-label="Close form">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Grid container spacing={2.5} sx={{ mt: 0 }}>
          {/* PRODUCT NAME */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="e.g. Royal Kundan Necklace"
            />
          </Grid>

          {/* SKU */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="SKU / Product Code"
              name="sku"
              value={form.sku}
              onChange={handleInputChange}
              placeholder="e.g. ZIN-NK-006"
            />
          </Grid>

          {/* CATEGORY */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              select
              label="Product Category"
              name="category"
              value={form.categoryId}
              onChange={handleInputChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={String(category.id)}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* SELLING PRICE */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              type="number"
              label="Selling Price (₹)"
              name="price"
              value={form.price}
              onChange={handleInputChange}
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyRupee />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* ORIGINAL PRICE */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              type="number"
              label="Original / MRP (₹)"
              name="originalPrice"
              value={form.originalPrice}
              onChange={handleInputChange}
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Grid>

          {/* STOCK */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              type="number"
              label="Available Stock"
              name="stock"
              value={form.stock}
              onChange={handleInputChange}
              inputProps={{ min: 0, step: 1 }}
            />
          </Grid>

          {/* IMAGE UPLOAD */}
          <Grid size={{ xs: 12 }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#514246",
                mb: 1,
              }}
            >
              Product Image
            </Typography>

            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadOutlined />}
              sx={{
                color: MAROON,
                borderColor: "#d9c5ca",
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Choose Image

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            <Typography sx={{ fontSize: 11, color: "#968a8d", mt: 0.8 }}>
              Select an image up to 5 MB. It will be uploaded to Django media storage.
            </Typography>

            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Product preview"
                  sx={{
                    width: 110,
                    height: 110,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #eee5e2",
                  }}
                />

                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    setImagePreview("");
                    setImageFile(null);
                    setForm((previous) => ({ ...previous, image: "" }));
                  }}
                  sx={{ ml: 1, textTransform: "none" }}
                >
                  Remove Image
                </Button>
              </Box>
            )}
          </Grid>

          {/* DESCRIPTION */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Product Description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Describe the design, material and occasion..."
            />
          </Grid>

          {/* STATUS */}
          <Grid size={{ xs: 12 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                borderColor: "#eee5e2",
                bgcolor: "#fcfaf8",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(form.status)}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        status: event.target.checked,
                      }))
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: MAROON,
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: MAROON,
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                      {form.status ? "Active Product" : "Inactive Product"}
                    </Typography>

                    <Typography sx={{ fontSize: 11, color: "#8b8082" }}>
                      {form.status
                        ? "This product is marked active."
                        : "This product is marked inactive."}
                    </Typography>
                  </Box>
                }
              />
            </Paper>
          </Grid>

          {/* VALIDATION MESSAGE */}
          {formError && (
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ color: "#c62828", fontSize: 13 }}>
                {formError}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          borderTop: "1px solid #eee5e2",
          gap: 1,
        }}
      >
        <Button
          onClick={closeDialog}
          variant="outlined"
          sx={{
            color: "#66585c",
            borderColor: "#d9c5ca",
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={saving}
          variant="contained"
          sx={{
            bgcolor: MAROON,
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            fontWeight: 700,
            "&:hover": { bgcolor: "#4b0918" },
          }}
        >
          {saving ? "Saving..." : editingId !== null ? "Save Changes" : "Add Product"}
        </Button>
      </DialogActions>
    </Box>
  </Dialog>

  {/* DELETE CONFIRMATION */}
  <Dialog
    open={deleteId !== null}
    onClose={() => setDeleteId(null)}
    maxWidth="xs"
    fullWidth
  >
    <DialogTitle sx={{ color: MAROON, fontWeight: 800 }}>
      Delete Product?
    </DialogTitle>

    <DialogContent>
      <Typography sx={{ fontSize: 14, color: "#6c6265" }}>
        Are you sure you want to delete this product? This action will
        remove it from the database and website.
      </Typography>
    </DialogContent>

    <DialogActions sx={{ px: 3, pb: 2.5 }}>
      <Button
        onClick={() => setDeleteId(null)}
        sx={{ color: "#6c6265", textTransform: "none" }}
      >
        Cancel
      </Button>

      <Button
        onClick={handleDeleteProduct}
        variant="contained"
        sx={{
          bgcolor: "#b42332",
          textTransform: "none",
          "&:hover": { bgcolor: "#8e1724" },
        }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
</Box>


);
}

export default Products;
