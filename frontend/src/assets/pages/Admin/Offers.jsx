
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";

import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

const API_URL = "http://127.0.0.1:8000/api/offers/admin/";

const MAROON = "#650c20";
const GOLD = "#c5a059";

const emptyForm = {
  title: "",
  description: "",
  coupon_code: "",
  discount_type: "PERCENTAGE",
  discount_value: "",
  minimum_order_amount: "0",
  start_date: "",
  end_date: "",
  is_active: true,
  image: null,
};

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [formError, setFormError] = useState("");

  const [imagePreview, setImagePreview] = useState("");
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const [search, setSearch] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("zinoraAdminToken");

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const getHeaders = (includeJson = false) => {
    const headers = {};

    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    if (includeJson) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  };

  const handleApiError = async (response) => {
    let message = `Request failed (${response.status}).`;

    try {
      const data = await response.json();

      if (typeof data.detail === "string") {
        message = data.detail;
      } else if (typeof data.error === "string") {
        message = data.error;
      } else if (typeof data.message === "string") {
        message = data.message;
      } else {
        const firstError = Object.values(data).flat()[0];

        if (typeof firstError === "string") {
          message = firstError;
        }
      }
    } catch {
      // Keep the default HTTP error message.
    }

    if (response.status === 401 || response.status === 403) {
      message =
        "Admin authentication failed. Please log in again with an admin account.";
    }

    throw new Error(message);
  };

  const getImageUrl = (offer) => {
    const image = offer?.image_url || offer?.image || "";

    if (!image || typeof image !== "string") {
      return "";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    if (image.startsWith("blob:") || image.startsWith("data:")) {
      return image;
    }

    return `http://127.0.0.1:8000${image.startsWith("/") ? "" : "/"}${image}`;
  };

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setPageError("");

      if (!token) {
        throw new Error(
          "Admin token nahi mila. Please admin dashboard mein login karein."
        );
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : Array.isArray(data.offers)
        ? data.offers
        : [];

      setOffers(list);
    } catch (error) {
      setPageError(error.message || "Offers load nahi ho paaye.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddDialog = () => {
    setEditingOffer(null);
    setForm({ ...emptyForm });
    setImagePreview("");
    setRemoveExistingImage(false);
    setFormError("");
    setDialogOpen(true);
  };

  const openEditDialog = (offer) => {
    setEditingOffer(offer);

    setForm({
      title: offer.title || "",
      description: offer.description || "",
      coupon_code: offer.coupon_code || "",
      discount_type: offer.discount_type || "PERCENTAGE",
      discount_value: String(offer.discount_value ?? ""),
      minimum_order_amount: String(offer.minimum_order_amount ?? "0"),
      start_date: offer.start_date || "",
      end_date: offer.end_date || "",
      is_active: Boolean(offer.is_active),
      image: null,
    });

    setImagePreview(getImageUrl(offer));
    setRemoveExistingImage(false);
    setFormError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (submitting) return;

    setDialogOpen(false);
    setEditingOffer(null);
    setForm({ ...emptyForm });
    setImagePreview("");
    setRemoveExistingImage(false);
    setFormError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    // Allow selecting the same file again after removing it.
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image size must be less than 5 MB.");
      return;
    }

    setFormError("");
    setRemoveExistingImage(false);

    setForm((previous) => ({
      ...previous,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setForm((previous) => ({
      ...previous,
      image: null,
    }));

    setImagePreview("");

    if (editingOffer && (editingOffer.image || editingOffer.image_url)) {
      setRemoveExistingImage(true);
    }
  };

  const validateForm = () => {
    if (
      !form.title.trim() ||
      !form.coupon_code.trim() ||
      !form.discount_value ||
      !form.start_date ||
      !form.end_date
    ) {
      return "Please fill all required fields.";
    }

    const discount = Number(form.discount_value);
    const minimum = Number(form.minimum_order_amount);

    if (!Number.isFinite(discount) || discount <= 0) {
      return "Discount value must be greater than zero.";
    }

    if (form.discount_type === "PERCENTAGE" && discount > 100) {
      return "Percentage discount cannot exceed 100%.";
    }

    if (!Number.isFinite(minimum) || minimum < 0) {
      return "Minimum order amount cannot be negative.";
    }

    if (form.end_date < form.start_date) {
      return "End date must be on or after the start date.";
    }

    return "";
  };

  const handleSaveOffer = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      if (!token) {
        throw new Error("Admin token missing. Please log in again.");
      }

      const payload = new FormData();

      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      payload.append(
        "coupon_code",
        form.coupon_code.trim().toUpperCase()
      );
      payload.append("discount_type", form.discount_type);
      payload.append("discount_value", String(Number(form.discount_value)));
      payload.append(
        "minimum_order_amount",
        String(Number(form.minimum_order_amount || 0))
      );
      payload.append("start_date", form.start_date);
      payload.append("end_date", form.end_date);
      payload.append("is_active", String(form.is_active));

      if (form.image) {
        payload.append("image", form.image);
      }

      if (removeExistingImage) {
        payload.append("remove_image", "true");
      }

      const isEditing = Boolean(editingOffer);

      const url = isEditing
        ? `${API_URL}${editingOffer.id}/`
        : API_URL;

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: getHeaders(false),
        body: payload,
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      setDialogOpen(false);
      setEditingOffer(null);
      setForm({ ...emptyForm });
      setImagePreview("");
      setRemoveExistingImage(false);

      await fetchOffers();

      showMessage(
        isEditing
          ? "Offer updated successfully!"
          : "Offer added successfully!"
      );
    } catch (error) {
      setFormError(
        error.message ||
          "Offer save nahi ho paya. Backend image upload support check karein."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (offer) => {
    try {
      if (!token) {
        throw new Error("Admin token missing. Please log in again.");
      }

      const response = await fetch(`${API_URL}${offer.id}/`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify({
          is_active: !offer.is_active,
        }),
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      await fetchOffers();

      showMessage(
        !offer.is_active
          ? "Offer activated successfully."
          : "Offer deactivated successfully."
      );
    } catch (error) {
      showMessage(error.message || "Status update failed.", "error");
    }
  };

  const handleDeleteOffer = async (offer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${offer.title}"?`
    );

    if (!confirmed) return;

    try {
      if (!token) {
        throw new Error("Admin token missing. Please log in again.");
      }

      const response = await fetch(`${API_URL}${offer.id}/`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      await fetchOffers();
      showMessage("Offer deleted successfully.");
    } catch (error) {
      showMessage(error.message || "Offer delete nahi hua.", "error");
    }
  };

  const getOfferStatus = (offer) => {
    const today = new Date();
    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (!offer.is_active) {
      return { label: "Inactive", color: "default" };
    }

    if (offer.end_date < todayString) {
      return { label: "Expired", color: "error" };
    }

    if (offer.start_date > todayString) {
      return { label: "Upcoming", color: "info" };
    }

    return { label: "Active", color: "success" };
  };

  const formatDiscount = (offer) => {
    const value = Number(offer.discount_value);

    return offer.discount_type === "PERCENTAGE"
      ? `${value}% OFF`
      : `₹${value.toLocaleString("en-IN")} OFF`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredOffers = offers.filter((offer) => {
    const query = search.toLowerCase();

    return (
      (offer.title || "").toLowerCase().includes(query) ||
      (offer.coupon_code || "").toLowerCase().includes(query) ||
      (offer.description || "").toLowerCase().includes(query)
    );
  });

  const activeCount = offers.filter(
    (offer) => getOfferStatus(offer).label === "Active"
  ).length;

  const inactiveCount = offers.filter(
    (offer) => !offer.is_active
  ).length;

  const expiredCount = offers.filter(
    (offer) => getOfferStatus(offer).label === "Expired"
  ).length;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: "#f7f5f2",
        minHeight: "100vh",
      }}
    >
      {/* PAGE HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: MAROON,
              fontWeight: 800,
              fontSize: { xs: 25, md: 32 },
            }}
          >
            Coupons & Offers
          </Typography>

          <Typography sx={{ color: "#777", mt: 0.7 }}>
            Create and manage promotional offers for your customers.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchOffers}
            sx={{
              borderColor: MAROON,
              color: MAROON,
              textTransform: "none",
            }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
            sx={{
              backgroundColor: MAROON,
              textTransform: "none",
              fontWeight: 700,
              px: 2.5,
              "&:hover": { backgroundColor: "#4a0817" },
            }}
          >
            Add New Offer
          </Button>
        </Box>
      </Box>

      {pageError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" onClick={fetchOffers}>
              Retry
            </Button>
          }
        >
          {pageError}
        </Alert>
      )}

      {/* SUMMARY CARDS */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          {
            label: "Total Offers",
            value: offers.length,
            icon: <LocalOfferOutlinedIcon />,
          },
          {
            label: "Active Offers",
            value: activeCount,
            icon: <ConfirmationNumberOutlinedIcon />,
          },
          {
            label: "Inactive Offers",
            value: inactiveCount,
            icon: <EditOutlinedIcon />,
          },
          {
            label: "Expired Offers",
            value: expiredCount,
            icon: <TimerOutlinedIcon />,
          },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid #eee6e1",
                height: "100%",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: "#f5e9e9",
                    color: MAROON,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>

                <Box>
                  <Typography sx={{ color: "#777", fontSize: 13 }}>
                    {item.label}
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{ color: MAROON, fontWeight: 800 }}
                  >
                    {loading ? "—" : item.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* OFFERS TABLE */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #eee6e1",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ color: MAROON, fontWeight: 800 }}
            >
              All Offers
            </Typography>

            <Typography
              sx={{ color: "#888", fontSize: 13, mt: 0.5 }}
            >
              Manage the offers displayed on your website.
            </Typography>
          </Box>

          <TextField
            size="small"
            placeholder="Search offers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ width: { xs: "100%", sm: 280 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#888" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider />

        {loading ? (
          <Box
            sx={{
              py: 7,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress sx={{ color: MAROON }} />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 1050 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#faf6f2" }}>
                  {[
                    "Image",
                    "Offer",
                    "Coupon Code",
                    "Discount",
                    "Minimum Order",
                    "Validity",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        fontWeight: 800,
                        color: MAROON,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredOffers.map((offer) => {
                  const status = getOfferStatus(offer);
                  const imageUrl = getImageUrl(offer);

                  return (
                    <TableRow hover key={offer.id}>
                      <TableCell>
                        {imageUrl ? (
                          <Box
                            component="img"
                            src={imageUrl}
                            alt={offer.title}
                            sx={{
                              width: 65,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 2,
                              border: "1px solid #eee",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 65,
                              height: 60,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: "#f5e9e9",
                              borderRadius: 2,
                              color: GOLD,
                            }}
                          >
                            <ImageOutlinedIcon />
                          </Box>
                        )}
                      </TableCell>

                      <TableCell sx={{ minWidth: 190 }}>
                        <Typography
                          sx={{ fontWeight: 700, color: "#333" }}
                        >
                          {offer.title}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#888",
                            fontSize: 12,
                            mt: 0.5,
                            maxWidth: 220,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {offer.description || "No description"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={offer.coupon_code}
                          sx={{
                            backgroundColor: "#f8f0e2",
                            color: MAROON,
                            fontWeight: 800,
                          }}
                        />
                      </TableCell>

                      <TableCell
                        sx={{ fontWeight: 700, color: MAROON }}
                      >
                        {formatDiscount(offer)}
                      </TableCell>

                      <TableCell>
                        ₹
                        {Number(
                          offer.minimum_order_amount || 0
                        ).toLocaleString("en-IN")}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography sx={{ fontSize: 13 }}>
                          {formatDate(offer.start_date)}
                        </Typography>

                        <Typography
                          sx={{ color: "#888", fontSize: 12 }}
                        >
                          to {formatDate(offer.end_date)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            title="Edit offer"
                            onClick={() => openEditDialog(offer)}
                            sx={{ color: MAROON }}
                          >
                            <EditOutlinedIcon />
                          </IconButton>

                          <IconButton
                            title="Delete offer"
                            onClick={() => handleDeleteOffer(offer)}
                            sx={{ color: "#c62828" }}
                          >
                            <DeleteIcon />
                          </IconButton>

                          <Switch
                            size="small"
                            checked={Boolean(offer.is_active)}
                            onChange={() => handleToggleActive(offer)}
                            inputProps={{
                              "aria-label": "Activate or deactivate offer",
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filteredOffers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Box sx={{ textAlign: "center", py: 6 }}>
                        <LocalOfferOutlinedIcon
                          sx={{
                            fontSize: 45,
                            color: GOLD,
                            mb: 1,
                          }}
                        />

                        <Typography
                          sx={{ color: "#666", fontWeight: 700 }}
                        >
                          {search
                            ? "No matching offers found."
                            : "No offers added yet."}
                        </Typography>

                        {!search && (
                          <Typography
                            sx={{ color: "#999", fontSize: 13, mt: 1 }}
                          >
                            Click Add New Offer to create your first offer.
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* ADD / EDIT DIALOG */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            backgroundColor: MAROON,
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pr: 1,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {editingOffer ? "Edit Offer" : "Add New Offer"}
            </Typography>

            <Typography
              sx={{ fontSize: 12, color: "#ead9dc", mt: 0.5 }}
            >
              Offer details and image.
            </Typography>
          </Box>

          <IconButton onClick={closeDialog} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box component="form" onSubmit={handleSaveOffer}>
          <DialogContent sx={{ pt: 3 }}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Offer Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Festive Special"
                  inputProps={{ maxLength: 150 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this offer..."
                />
              </Grid>

              {/* IMAGE UPLOAD FIELD */}
              <Grid item xs={12}>
                <Typography
                  sx={{
                    color: MAROON,
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Offer Image
                </Typography>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadOutlinedIcon />}
                  sx={{
                    borderColor: GOLD,
                    color: MAROON,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: MAROON,
                      backgroundColor: "#faf6f2",
                    },
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

                <Typography
                  variant="caption"
                  display="block"
                  sx={{ color: "#777", mt: 1 }}
                >
                  Supported image files. Maximum size: 5 MB.
                </Typography>

                {imagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Offer preview"
                      sx={{
                        display: "block",
                        width: "100%",
                        maxWidth: 320,
                        height: 190,
                        objectFit: "cover",
                        borderRadius: 2,
                        border: "1px solid #eee",
                        bgcolor: "#f7f5f2",
                      }}
                    />

                    <Button
                      size="small"
                      color="error"
                      onClick={handleRemoveImage}
                      sx={{ mt: 1, textTransform: "none" }}
                    >
                      Remove Image
                    </Button>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Coupon Code"
                  name="coupon_code"
                  value={form.coupon_code}
                  onChange={handleChange}
                  placeholder="FESTIVE20"
                  inputProps={{ maxLength: 50 }}
                  helperText="Code will be converted to uppercase."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Discount Type"
                  name="discount_type"
                  value={form.discount_type}
                  onChange={handleChange}
                >
                  <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
                  <MenuItem value="FIXED">Fixed Amount (₹)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Discount Value"
                  name="discount_value"
                  value={form.discount_value}
                  onChange={handleChange}
                  inputProps={{
                    min: 0.01,
                    max:
                      form.discount_type === "PERCENTAGE"
                        ? 100
                        : undefined,
                    step: "0.01",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {form.discount_type === "PERCENTAGE" ? "%" : "₹"}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Minimum Order Amount"
                  name="minimum_order_amount"
                  value={form.minimum_order_amount}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: "0.01" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Start Date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="End Date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.is_active}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          is_active: event.target.checked,
                        }))
                      }
                      color="success"
                    />
                  }
                  label="Make this offer active"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={closeDialog}
              disabled={submitting}
              sx={{ color: "#666", textTransform: "none" }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={17} color="inherit" />
                ) : (
                  <AddIcon />
                )
              }
              sx={{
                backgroundColor: MAROON,
                textTransform: "none",
                fontWeight: 700,
                minWidth: 140,
                "&:hover": { backgroundColor: "#4a0817" },
              }}
            >
              {submitting
                ? "Saving..."
                : editingOffer
                ? "Update Offer"
                : "Save Offer"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* NOTIFICATION */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((previous) => ({
              ...previous,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Offers;
