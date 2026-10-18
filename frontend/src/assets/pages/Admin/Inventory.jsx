
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const BACKEND_BASE_URL = "http://127.0.0.1:8000";
const PRODUCTS_API = `${API_BASE_URL}/products/`;

const getAdminToken = () =>
  localStorage.getItem("zinoraAdminToken");

const getHeaders = (includeJSON = false) => {
  const token = getAdminToken();

  return {
    Accept: "application/json",
    ...(includeJSON
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token
      ? { Authorization: `Token ${token}` }
      : {}),
  };
};

const normalizeProducts = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  return [];
};

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  const trimmedImage = image.trim();

  if (!trimmedImage) {
    return "";
  }

  // Full URL: use it directly.
  if (
    trimmedImage.startsWith("http://") ||
    trimmedImage.startsWith("https://") ||
    trimmedImage.startsWith("data:")
  ) {
    return trimmedImage;
  }

  // Relative Django media URL.
  return `${BACKEND_BASE_URL}${
    trimmedImage.startsWith("/")
      ? trimmedImage
      : `/${trimmedImage}`
  }`;
};

const normalizeProduct = (product) => {
  const rawImage =
    product.image_url ??
    product.image ??
    product.product_image ??
    product.photo ??
    product.thumbnail ??
    "";

  return {
    id: product.id ?? product.pk,

    name:
      product.name ??
      product.title ??
      product.product_name ??
      "Unnamed Product",

    image: getImageUrl(
      typeof rawImage === "object"
        ? rawImage?.url ?? rawImage?.image ?? ""
        : rawImage
    ),

    category:
      typeof product.category === "object"
        ? product.category?.name ??
          product.category?.title ??
          "Uncategorized"
        : product.category_name ??
          product.category ??
          "Uncategorized",

    price: Number(
      product.price ??
        product.selling_price ??
        0
    ),

    quantity: Number(
      product.stock_quantity ??
        product.quantity ??
        product.stock ??
        0
    ),

    isActive: product.is_active ?? true,
  };
};

function Inventory() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleteProduct, setDeleteProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(PRODUCTS_API, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          `Products API returned ${response.status}. ${message.slice(
            0,
            200
          )}`
        );
      }

      const data = await response.json();

      const list = normalizeProducts(data).map(
        normalizeProduct
      );

      setProducts(list);
    } catch (err) {
      console.error("Inventory fetch error:", err);

      setError(
        err.message ||
          "Products load nahi hue. Django server aur API endpoint check karo."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalProducts = products.length;

  const inStock = products.filter(
    (product) => product.quantity > 5
  ).length;

  const lowStock = products.filter(
    (product) =>
      product.quantity > 0 &&
      product.quantity <= 5
  ).length;

  const outOfStock = products.filter(
    (product) => product.quantity <= 0
  ).length;

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchText) ||
        String(product.category)
          .toLowerCase()
          .includes(searchText)
    );
  }, [products, search]);

  const summaryCards = [
    {
      title: "Total Products",
      value: totalProducts,
      description: "Products in inventory",
    },
    {
      title: "In Stock",
      value: inStock,
      description: "More than 5 items available",
    },
    {
      title: "Low Stock",
      value: lowStock,
      description: "Restocking may be needed",
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      description: "No items available",
    },
  ];

  const getStockStatus = (quantity) => {
    if (quantity <= 0) {
      return {
        label: "Out of Stock",
        color: "error",
      };
    }

    if (quantity <= 5) {
      return {
        label: "Low Stock",
        color: "warning",
      };
    }

    return {
      label: "In Stock",
      color: "success",
    };
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setNewQuantity(String(product.quantity));
    setQuantityError("");
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewQuantity("");
    setQuantityError("");
  };

  const handleUpdate = async (product) => {
    if (newQuantity.trim() === "") {
      setQuantityError("Please enter a quantity.");
      return;
    }

    const quantity = Number(newQuantity);

    if (
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      setQuantityError(
        "Enter a whole number greater than or equal to 0."
      );
      return;
    }

    setSavingId(product.id);
    setError("");
    setSuccess("");
    setQuantityError("");

    try {
      const response = await fetch(
        `${PRODUCTS_API}${product.id}/`,
        {
          method: "PATCH",
          headers: getHeaders(true),
          body: JSON.stringify({
            stock_quantity: quantity,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          `Stock update failed (${response.status}). ${message.slice(
            0,
            250
          )}`
        );
      }

      await fetchProducts();

      setEditingId(null);
      setNewQuantity("");

      setSuccess(
        `Stock updated for ${product.name}.`
      );
    } catch (err) {
      console.error("Stock update error:", err);

      setError(
        err.message || "Stock update failed."
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleActive = async (product) => {
    setSavingId(product.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${PRODUCTS_API}${product.id}/`,
        {
          method: "PATCH",
          headers: getHeaders(true),
          body: JSON.stringify({
            is_active: !product.isActive,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          `Status update failed (${response.status}). ${message.slice(
            0,
            250
          )}`
        );
      }

      await fetchProducts();

      setSuccess(
        `${product.name} is now ${
          product.isActive ? "inactive" : "active"
        }.`
      );
    } catch (err) {
      console.error(
        "Active status update error:",
        err
      );

      setError(
        err.message ||
          "Status update failed. Check whether is_active is an editable API field."
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) {
      return;
    }

    const productToDelete = deleteProduct;

    setSavingId(productToDelete.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${PRODUCTS_API}${productToDelete.id}/`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          `Delete failed (${response.status}). ${message.slice(
            0,
            250
          )}`
        );
      }

      setProducts((previous) =>
        previous.filter(
          (product) =>
            product.id !== productToDelete.id
        )
      );

      setSuccess(
        `${productToDelete.name} deleted successfully.`
      );

      setDeleteProduct(null);
    } catch (err) {
      console.error("Delete product error:", err);

      setError(
        err.message ||
          "Product delete nahi hua. Admin permission check karo."
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#faf7f5",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* Page heading */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: {
              xs: 26,
              md: 32,
            },
            fontWeight: 800,
            color: "#650c20",
          }}
        >
          Inventory
        </Typography>

        <Typography
          sx={{
            color: "#81767a",
            mt: 1,
            fontSize: 14,
          }}
        >
          Manage product images, stock and availability.
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {/* Summary cards */}
      <Grid
        container
        spacing={2.5}
        sx={{ mb: 4 }}
      >
        {summaryCards.map((card) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={card.title}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: "14px",
                border: "1px solid #eee3e5",
                backgroundColor: "#fff",
                transition: "0.2s",
                "&:hover": {
                  borderColor: "#650c20",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Typography
                sx={{
                  color: "#81767a",
                  fontSize: 14,
                }}
              >
                {card.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#650c20",
                  my: 1,
                }}
              >
                {loading ? "—" : card.value}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#81767a",
                }}
              >
                {card.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Products table */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #eee3e5",
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        {/* Table toolbar */}
        <Box
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                color: "#650c20",
              }}
            >
              Product Stock
            </Typography>

            <Typography
              sx={{
                color: "#81767a",
                fontSize: 13,
                mt: 0.5,
              }}
            >
              Product images and stock data from your backend.
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
          >
            <TextField
              size="small"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ color: "#81767a" }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: {
                  xs: "100%",
                  sm: 250,
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9px",
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset":
                  {
                    borderColor: "#650c20",
                  },
              }}
            />

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchProducts}
              disabled={loading}
              sx={{
                borderColor: "#650c20",
                color: "#650c20",
                textTransform: "none",
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Box>

        {/* Responsive table */}
        <TableContainer
          sx={{ overflowX: "auto" }}
        >
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow
                sx={{ backgroundColor: "#f8edef" }}
              >
                {[
                  "Image",
                  "Product Name",
                  "Category",
                  "Price",
                  "Quantity",
                  "Stock Status",
                  "Availability",
                  "Actions",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      fontWeight: 700,
                      color: "#650c20",
                      whiteSpace: "nowrap",
                      py: 2,
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <CircularProgress
                      sx={{ color: "#650c20" }}
                    />

                    <Typography
                      sx={{
                        mt: 2,
                        color: "#81767a",
                      }}
                    >
                      Loading products...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ py: 5 }}
                  >
                    <Typography
                      sx={{
                        color: "#81767a",
                        fontSize: 14,
                      }}
                    >
                      {products.length === 0
                        ? "No products found in the database."
                        : "No products match your search."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const status = getStockStatus(
                    product.quantity
                  );

                  const isEditing =
                    editingId === product.id;

                  const isSaving =
                    savingId === product.id;

                  return (
                    <TableRow
                      key={product.id}
                      hover
                    >
                      {/* Product image */}
                      <TableCell>
                        <Avatar
                          src={
                            product.image || undefined
                          }
                          alt={product.name}
                          variant="rounded"
                          imgProps={{
                            onError: (event) => {
                              event.currentTarget.style.display =
                                "none";
                            },
                          }}
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 2,
                            bgcolor: "#f8edef",
                            color: "#650c20",
                            border: "1px solid #eee3e5",
                            fontWeight: 700,
                          }}
                        >
                          {product.name?.charAt(0)}
                        </Avatar>
                      </TableCell>

                      {/* Product name */}
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#34242a",
                          minWidth: 180,
                        }}
                      >
                        {product.name}
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        {product.category}
                      </TableCell>

                      {/* Price */}
                      <TableCell
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        ₹
                        {product.price.toLocaleString(
                          "en-IN"
                        )}
                      </TableCell>

                      {/* Quantity */}
                      <TableCell>
                        {isEditing ? (
                          <Box sx={{ minWidth: 110 }}>
                            <TextField
                              size="small"
                              type="number"
                              value={newQuantity}
                              onChange={(event) => {
                                setNewQuantity(
                                  event.target.value
                                );
                                setQuantityError("");
                              }}
                              inputProps={{
                                min: 0,
                                step: 1,
                              }}
                              sx={{ width: 90 }}
                            />

                            {quantityError && (
                              <Typography
                                sx={{
                                  color: "#d32f2f",
                                  fontSize: 11,
                                  mt: 0.5,
                                  maxWidth: 180,
                                }}
                              >
                                {quantityError}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color:
                                product.quantity === 0
                                  ? "#d32f2f"
                                  : "#34242a",
                            }}
                          >
                            {product.quantity}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Stock status */}
                      <TableCell>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>

                      {/* Availability */}
                      <TableCell>
                        <Chip
                          label={
                            product.isActive
                              ? "Active"
                              : "Inactive"
                          }
                          color={
                            product.isActive
                              ? "success"
                              : "default"
                          }
                          size="small"
                          variant={
                            product.isActive
                              ? "filled"
                              : "outlined"
                          }
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          sx={{ minWidth: 390 }}
                        >
                          {isEditing ? (
                            <>
                              <Button
                                size="small"
                                disabled={isSaving}
                                onClick={() =>
                                  handleUpdate(product)
                                }
                                sx={{
                                  color: "#650c20",
                                  fontWeight: 700,
                                  textTransform: "none",
                                }}
                              >
                                {isSaving
                                  ? "Saving..."
                                  : "Save"}
                              </Button>

                              <Button
                                size="small"
                                disabled={isSaving}
                                onClick={handleCancel}
                                sx={{
                                  color: "#81767a",
                                  textTransform: "none",
                                }}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="small"
                                startIcon={<EditIcon />}
                                disabled={isSaving}
                                onClick={() =>
                                  handleEdit(product)
                                }
                                sx={{
                                  color: "#650c20",
                                  textTransform: "none",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Edit Stock
                              </Button>

                              <Button
                                size="small"
                                startIcon={
                                  product.isActive ? (
                                    <BlockIcon />
                                  ) : (
                                    <CheckCircleIcon />
                                  )
                                }
                                disabled={isSaving}
                                onClick={() =>
                                  handleToggleActive(product)
                                }
                                sx={{
                                  color: product.isActive
                                    ? "#b26a00"
                                    : "#2e7d32",
                                  textTransform: "none",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {product.isActive
                                  ? "Deactivate"
                                  : "Activate"}
                              </Button>

                              <Button
                                size="small"
                                color="error"
                                startIcon={<DeleteIcon />}
                                disabled={isSaving}
                                onClick={() =>
                                  setDeleteProduct(product)
                                }
                                sx={{
                                  textTransform: "none",
                                }}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Table footer */}
        <Box
          sx={{
            px: 3,
            py: 2,
            backgroundColor: "#fff",
            borderTop: "1px solid #eee3e5",
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              color: "#81767a",
            }}
          >
            Showing{" "}
            {loading ? 0 : filteredProducts.length} of{" "}
            {loading ? 0 : totalProducts} products
          </Typography>
        </Box>
      </Paper>

      {/* Delete confirmation */}
      <Dialog
        open={Boolean(deleteProduct)}
        onClose={() => {
          if (savingId === null) {
            setDeleteProduct(null);
          }
        }}
      >
        <DialogTitle
          sx={{
            color: "#650c20",
            fontWeight: 700,
          }}
        >
          Delete Product?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{deleteProduct?.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteProduct(null)}
            disabled={savingId !== null}
            sx={{
              color: "#81767a",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={savingId !== null}
            sx={{ textTransform: "none" }}
          >
            {savingId !== null
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Inventory;
