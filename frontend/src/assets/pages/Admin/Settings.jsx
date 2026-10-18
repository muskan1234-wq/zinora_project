
import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";

const API_BASE_URL = "http://127.0.0.1:8000/api/accounts";

const getAuthHeaders = () => {
  const token = localStorage.getItem("zinoraAdminToken");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Token ${token}` } : {}),
  };
};

const getErrorMessage = (data, fallback) => {
  if (!data) return fallback;

  if (typeof data === "string") return data;

  if (data.detail) return data.detail;

  const firstKey = Object.keys(data)[0];

  if (firstKey) {
    const value = data[firstKey];

    if (Array.isArray(value)) return value[0];
    if (typeof value === "string") return value;
  }

  return fallback;
};

function Settings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [originalProfile, setOriginalProfile] = useState({
    name: "",
    email: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const token = localStorage.getItem("zinoraAdminToken");

  // Display a notification.
  const showMessage = (text, type = "success") => {
    setMessage(text);
    setSeverity(type);
  };

  // Load the authenticated admin's profile.
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        showMessage(
          "Admin session not found. Please log in again.",
          "error"
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/profile/`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            getErrorMessage(data, "Unable to load admin profile.")
          );
        }

        const loadedProfile = {
          name:
            data.name ||
            data.full_name ||
            data.username ||
            "",
          email: data.email || "",
        };

        setProfile(loadedProfile);
        setOriginalProfile(loadedProfile);
      } catch (error) {
        showMessage(
          error.message ||
            "Could not connect to the backend. Check your Django server.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setProfileErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPassword((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateProfile = () => {
    const errors = {};

    if (!profile.name.trim()) {
      errors.name = "Full name is required.";
    }

    if (!profile.email.trim()) {
      errors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())
    ) {
      errors.email = "Enter a valid email address.";
    }

    setProfileErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();

    if (!validateProfile()) return;

    if (!token) {
      showMessage("Please log in as admin again.", "error");
      return;
    }

    setSavingProfile(true);

    try {
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: profile.name.trim(),
          email: profile.email.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Failed to update profile.")
        );
      }

      const updatedProfile = {
        name:
          data.name ||
          data.full_name ||
          data.username ||
          profile.name.trim(),
        email: data.email || profile.email.trim(),
      };

      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);

      showMessage("Admin profile updated successfully.", "success");
    } catch (error) {
      showMessage(
        error.message || "Unable to update profile.",
        "error"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const validatePassword = () => {
    const errors = {};

    if (!password.currentPassword) {
      errors.currentPassword = "Current password is required.";
    }

    if (!password.newPassword) {
      errors.newPassword = "New password is required.";
    } else if (password.newPassword.length < 8) {
      errors.newPassword =
        "Password must contain at least 8 characters.";
    } else if (
      password.newPassword === password.currentPassword
    ) {
      errors.newPassword =
        "New password must differ from the current password.";
    }

    if (!password.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password.";
    } else if (
      password.newPassword !== password.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setPasswordErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handlePasswordSave = async (event) => {
    event.preventDefault();

    if (!validatePassword()) return;

    if (!token) {
      showMessage("Please log in as admin again.", "error");
      return;
    }

    setSavingPassword(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/change-password/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            current_password: password.currentPassword,
            new_password: password.newPassword,
            confirm_password: password.confirmPassword,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Failed to change password.")
        );
      }

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordErrors({});

      showMessage(
        data.message || "Password changed successfully.",
        "success"
      );
    } catch (error) {
      showMessage(
        error.message || "Unable to change password.",
        "error"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const passwordField = (
    label,
    name,
    helperText = ""
  ) => (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={showPassword[name] ? "text" : "password"}
      value={password[name]}
      onChange={handlePasswordChange}
      error={Boolean(passwordErrors[name])}
      helperText={passwordErrors[name] || helperText}
      autoComplete="new-password"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={`Toggle ${label.toLowerCase()} visibility`}
              onClick={() => togglePasswordVisibility(name)}
              edge="end"
            >
              {showPassword[name] ? (
                <VisibilityOff />
              ) : (
                <Visibility />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#faf7f5",
        }}
      >
        <CircularProgress sx={{ color: "#650c20" }} />
        <Typography color="text.secondary">
          Loading admin settings...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#faf7f5",
        p: { xs: 2, md: 4 },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "26px", md: "32px" },
          fontWeight: 800,
          color: "#650c20",
          mb: 1,
        }}
      >
        Profile & Settings
      </Typography>

      <Typography sx={{ color: "#81767a", mb: 4 }}>
        Manage your admin profile and account security.
      </Typography>

      {/* Admin Profile */}
      <Paper
        elevation={0}
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: { xs: 2.5, md: 4 },
          mb: 3,
          borderRadius: "16px",
          border: "1px solid #eee3e5",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              width: 65,
              height: 65,
              backgroundColor: "#650c20",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {profile.name.trim().charAt(0).toUpperCase() || "A"}
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                color: "#650c20",
              }}
            >
              Admin Profile
            </Typography>

            <Typography sx={{ fontSize: 13, color: "#81767a" }}>
              Update your personal information.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          Personal Information
        </Typography>

        <Box
          component="form"
          onSubmit={handleProfileSave}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            error={Boolean(profileErrors.name)}
            helperText={profileErrors.name}
            autoComplete="name"
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleProfileChange}
            error={Boolean(profileErrors.email)}
            helperText={profileErrors.email}
            autoComplete="email"
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setProfile(originalProfile);
                setProfileErrors({});
              }}
              disabled={savingProfile}
              sx={{
                color: "#650c20",
                borderColor: "#650c20",
                borderRadius: "9px",
                textTransform: "none",
              }}
            >
              Reset
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={savingProfile}
              startIcon={
                savingProfile ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SaveOutlined />
                )
              }
              sx={{
                backgroundColor: "#650c20",
                px: 3,
                py: 1.2,
                borderRadius: "9px",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#4b0918" },
              }}
            >
              {savingProfile ? "Saving..." : "Save Profile"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Change Password */}
      <Paper
        elevation={0}
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: { xs: 2.5, md: 4 },
          borderRadius: "16px",
          border: "1px solid #eee3e5",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LockOutlined sx={{ color: "#650c20" }} />

          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
              color: "#650c20",
            }}
          >
            Change Password
          </Typography>
        </Box>

        <Typography
          sx={{ color: "#81767a", fontSize: 13, mt: 1, mb: 3 }}
        >
          Keep your admin account secure by updating your password.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box
          component="form"
          onSubmit={handlePasswordSave}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {passwordField("Current Password", "currentPassword")}

          {passwordField(
            "New Password",
            "newPassword",
            "Use at least 8 characters."
          )}

          {passwordField(
            "Confirm New Password",
            "confirmPassword"
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={savingPassword}
              startIcon={
                savingPassword ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <LockOutlined />
                )
              }
              sx={{
                backgroundColor: "#650c20",
                px: 3,
                py: 1.2,
                borderRadius: "9px",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#4b0918" },
              }}
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={4500}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={severity}
          onClose={() => setMessage("")}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Settings;
