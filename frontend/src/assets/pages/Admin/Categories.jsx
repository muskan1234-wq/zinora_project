import React, { useEffect, useState } from "react";

import {
Box,
Button,
Typography,
Paper,
TextField,
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
IconButton,
Chip,
Switch,
Avatar,
Alert,
CircularProgress,
Stack,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const API_URL = "http://127.0.0.1:8000/api/products/categories/";

const emptyForm = {
name: "",
description: "",
is_active: true,
image: null,
};

// Automatically generate a URL-friendly slug from the category name.
const generateSlug = (name) => {
return name
.trim()
.toLowerCase()
.replace(/&/g, " and ")
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");
};

export default function Categories() {
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [open, setOpen] = useState(false);
const [editingCategory, setEditingCategory] = useState(null);
const [formData, setFormData] = useState({ ...emptyForm });
const [preview, setPreview] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

// Read the token saved by the admin login page.
const getAuthHeaders = () => {
const token =
localStorage.getItem("zinoraAdminToken") ||
localStorage.getItem("zinoraToken");


if (!token) {
  throw new Error(
    "Admin token missing. Please logout and login again."
  );
}

const role =
  localStorage.getItem("zinoraAdminRole") ||
  localStorage.getItem("zinoraRole");

if (role && role.toUpperCase() !== "ADMIN") {
  throw new Error("Admin access required. Please login as an administrator.");
}

return {
  Authorization: `Token ${token}`,
};


};

// Convert API errors into readable messages.
const getErrorMessage = (data, status) => {
if (data?.detail) {
if (status === 401) {
return "Authentication failed. Please logout and login again.";
}

 
  if (status === 403) {
    return "Permission denied. Verify that your account has admin access.";
  }

  return data.detail;
}

if (data && typeof data === "object") {
  return Object.entries(data)
    .map(([field, messages]) => {
      const message = Array.isArray(messages)
        ? messages.join(", ")
        : typeof messages === "object"
          ? JSON.stringify(messages)
          : String(messages);

      return `${field}: ${message}`;
    })
    .join(" | ");
}

return `Request failed with status ${status}.`;
 

};

// Load categories from Django.
const fetchCategories = async () => {
setLoading(true);
setError("");


try {
  const response = await fetch(API_URL);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(getErrorMessage(data, response.status));
  }

  const categoryList = Array.isArray(data)
    ? data
    : data.results || [];

  setCategories(categoryList);
} catch (err) {
  setError(
    err.message ||
      "Categories could not be loaded. Please check the Django backend."
  );

  console.error("Fetch categories error:", err);
} finally {
  setLoading(false);
}


};

useEffect(() => {
fetchCategories();
}, []);

// Open Add Category dialog.
const handleOpenAdd = () => {
setEditingCategory(null);
setFormData({ ...emptyForm });
setPreview("");
setError("");
setSuccess("");
setOpen(true);
};

// Open Edit Category dialog.
const handleOpenEdit = (category) => {
setEditingCategory(category);


setFormData({
  name: category.name || "",
  description: category.description || "",
  is_active: Boolean(category.is_active),
  image: null,
});

setPreview(category.image_url || category.image || "");
setError("");
setSuccess("");
setOpen(true);


};

// Close dialog.
const handleClose = () => {
if (saving) return;


setOpen(false);
setEditingCategory(null);
setFormData({ ...emptyForm });
setPreview("");
setError("");


};

// Handle text inputs.
const handleChange = (event) => {
const { name, value } = event.target;


setFormData((previous) => ({
  ...previous,
  [name]: value,
}));


};

// Handle image selection.
const handleImageChange = (event) => {
const file = event.target.files?.[0];


if (!file) return;

if (!file.type.startsWith("image/")) {
  setError("Please select a valid image file.");
  event.target.value = "";
  return;
}

// Release the previous temporary preview URL.
if (preview.startsWith("blob:")) {
  URL.revokeObjectURL(preview);
}

setFormData((previous) => ({
  ...previous,
  image: file,
}));

setPreview(URL.createObjectURL(file));
setError("");
event.target.value = "";


};

// Add or update a category.
const handleSave = async () => {
setError("");
setSuccess("");


const categoryName = formData.name.trim();

if (!categoryName) {
  setError("Category name is required.");
  return;
}

const slug = generateSlug(categoryName);

if (!slug) {
  setError("Please enter a valid category name.");
  return;
}

if (!editingCategory && !formData.image) {
  setError("Please select an image for the new category.");
  return;
}

// Send multipart/form-data so Django can receive the uploaded image.
const payload = new FormData();

payload.append("name", categoryName);
payload.append("slug", slug);
payload.append("description", formData.description || "");
payload.append("is_active", String(formData.is_active));

if (formData.image instanceof File) {
  payload.append("image", formData.image);
}

const isEditing = Boolean(editingCategory);

const url = isEditing
  ? `${API_URL}${editingCategory.id}/`
  : API_URL;

setSaving(true);

try {
  const headers = getAuthHeaders();

  const response = await fetch(url, {
    method: isEditing ? "PATCH" : "POST",
    headers,
    body: payload,
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      getErrorMessage(responseData, response.status)
    );
  }

  setSuccess(
    isEditing
      ? "Category successfully updated."
      : "Category successfully added."
  );

  setOpen(false);
  setEditingCategory(null);
  setFormData({ ...emptyForm });

  if (preview.startsWith("blob:")) {
    URL.revokeObjectURL(preview);
  }

  setPreview("");

  await fetchCategories();
} catch (err) {
  setError(err.message || "Category could not be saved.");

  console.error("Category save error:", err);
} finally {
  setSaving(false);
}


};

// Change active/inactive status.
const handleToggleActive = async (category) => {
setError("");
setSuccess("");


try {
  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_URL}${category.id}/`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      is_active: !category.is_active,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(getErrorMessage(data, response.status));
  }

  setSuccess("Category status updated successfully.");

  await fetchCategories();
} catch (err) {
  setError(err.message || "Category status could not be updated.");

  console.error("Category status error:", err);
}


};

// Delete a category.
const handleDelete = async (category) => {
const confirmed = window.confirm(
`Are you sure you want to delete "${category.name}"?`
);


if (!confirmed) return;

setError("");
setSuccess("");

try {
  const response = await fetch(`${API_URL}${category.id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(getErrorMessage(data, response.status));
  }

  setSuccess("Category deleted successfully.");

  await fetchCategories();
} catch (err) {
  setError(
    err.message ||
      "Category could not be deleted. Check whether products are linked to this category."
  );

  console.error("Category delete error:", err);
}


};

return (
<Box
sx={{
p: { xs: 2, md: 3 },
backgroundColor: "#f7f5f2",
minHeight: "100vh",
}}
>
{/* Page Header */}
<Stack
direction={{ xs: "column", sm: "row" }}
justifyContent="space-between"
alignItems={{ xs: "stretch", sm: "center" }}
spacing={2}
sx={{ mb: 3 }}
> <Box>
<Typography
variant="h4"
sx={{
color: "#650c20",
fontWeight: 700,
}}
>
Categories </Typography>


      <Typography
        sx={{
          color: "text.secondary",
          mt: 0.5,
        }}
      >
        Manage your jewellery product categories
      </Typography>
    </Box>

    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleOpenAdd}
      sx={{
        backgroundColor: "#650c20",
        "&:hover": {
          backgroundColor: "#4d0919",
        },
      }}
    >
      Add Category
    </Button>
  </Stack>

  {/* Error Message */}
  {error && !open && (
    <Alert
      severity="error"
      sx={{ mb: 2 }}
      onClose={() => setError("")}
    >
      {error}
    </Alert>
  )}

  {/* Success Message */}
  {success && (
    <Alert
      severity="success"
      sx={{ mb: 2 }}
      onClose={() => setSuccess("")}
    >
      {success}
    </Alert>
  )}

  {/* Categories Table */}
  <Paper
    elevation={0}
    sx={{
      border: "1px solid #eadfe1",
      borderRadius: 3,
      overflow: "hidden",
    }}
  >
    {loading ? (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 5,
        }}
      >
        <CircularProgress sx={{ color: "#650c20" }} />
      </Box>
    ) : categories.length === 0 ? (
      <Box
        sx={{
          textAlign: "center",
          p: 6,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#650c20",
            mb: 1,
          }}
        >
          No Categories Found
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Add your first jewellery category to get started.
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ backgroundColor: "#650c20" }}
        >
          Create First Category
        </Button>
      </Box>
    ) : (
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "#650c20" }}>
            <TableRow>
              {[
                "Image",
                "Category Name",
                "Description",
                "Status",
                "Active",
                "Actions",
              ].map((heading) => (
                <TableCell
                  key={heading}
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map((category) => {
              const imageUrl =
                category.image_url || category.image || "";

              return (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={imageUrl || undefined}
                      alt={category.name}
                      sx={{
                        width: 58,
                        height: 58,
                        backgroundColor: "#f1e7e9",
                        color: "#650c20",
                      }}
                    >
                      {category.name?.charAt(0)}
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={600}>
                      {category.name}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {category.slug}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 250 }}>
                    {category.description || "—"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        category.is_active ? "Active" : "Inactive"
                      }
                      color={
                        category.is_active ? "success" : "default"
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Switch
                      checked={Boolean(category.is_active)}
                      onChange={() => handleToggleActive(category)}
                      color="success"
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton
                      aria-label="Edit category"
                      onClick={() => handleOpenEdit(category)}
                      sx={{ color: "#650c20" }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      aria-label="Delete category"
                      onClick={() => handleDelete(category)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Paper>

  {/* Add/Edit Dialog */}
  <Dialog
    open={open}
    onClose={handleClose}
    fullWidth
    maxWidth="sm"
  >
    <DialogTitle
      sx={{
        backgroundColor: "#650c20",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {editingCategory ? "Edit Category" : "Add Category"}

      <IconButton
        onClick={handleClose}
        sx={{ color: "#fff" }}
        disabled={saving}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent sx={{ pt: "24px !important" }}>
      {error && open && (
        <Alert
          severity="error"
          sx={{ mb: 2, mt: 1 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Stack spacing={2.5} sx={{ mt: 1 }}>
        <TextField
          label="Category Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          placeholder="Example: Earrings & Jhumkas"
        />

        <TextField
          label="Generated Slug"
          value={generateSlug(formData.name)}
          fullWidth
          helperText="Generated automatically from the category name."
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={3}
          placeholder="Describe this jewellery category"
        />

        <Box>
          <Button
            component="label"
            variant="outlined"
            sx={{
              color: "#650c20",
              borderColor: "#650c20",
            }}
          >
            {formData.image
              ? "Change Image"
              : "Upload Category Image"}

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {preview && (
            <Box sx={{ mt: 2 }}>
              <Avatar
                variant="rounded"
                src={preview}
                alt="Category preview"
                sx={{
                  width: 110,
                  height: 110,
                }}
              />
            </Box>
          )}
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography>Category Active</Typography>

          <Switch
            checked={Boolean(formData.is_active)}
            onChange={(event) =>
              setFormData((previous) => ({
                ...previous,
                is_active: event.target.checked,
              }))
            }
            color="success"
          />
        </Stack>
      </Stack>
    </DialogContent>

    <DialogActions sx={{ p: 2.5 }}>
      <Button
        onClick={handleClose}
        disabled={saving}
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={saving}
        sx={{
          backgroundColor: "#650c20",
          "&:hover": {
            backgroundColor: "#4d0919",
          },
        }}
      >
        {saving ? (
          <CircularProgress
            size={22}
            sx={{ color: "#fff" }}
          />
        ) : editingCategory ? (
          "Update Category"
        ) : (
          "Save Category"
        )}
      </Button>
    </DialogActions>
  </Dialog>
</Box>


);
}
