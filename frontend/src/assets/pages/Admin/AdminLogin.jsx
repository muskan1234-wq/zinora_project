import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  AdminPanelSettings,
  EmailOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  ArrowForward,
  ShieldOutlined,
} from "@mui/icons-material";

const LOGIN_API = "http://127.0.0.1:8000/api/accounts/login/";
const ADMIN_DASHBOARD_API =
  "http://127.0.0.1:8000/api/accounts/admin-dashboard/";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Admin Login + Backend Dashboard Verification
  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Verify admin credentials
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }

      // Step 2: Allow only ADMIN accounts
      if (data.role !== "ADMIN") {
        setError(
          "Access denied. This account does not have administrator access."
        );
        return;
      }

      if (!data.token) {
        setError("Authentication token was not received from the server.");
        return;
      }

      // Step 3: Verify the token with the protected Admin Dashboard API
      const dashboardResponse = await fetch(ADMIN_DASHBOARD_API, {
        method: "GET",
        headers: {
          Authorization: `Token ${data.token}`,
          "Content-Type": "application/json",
        },
      });

      const dashboardData = await dashboardResponse.json();

      if (!dashboardResponse.ok) {
        setError(
          dashboardData.error ||
            "Admin verification failed. Please check your account permissions."
        );
        return;
      }

      // Step 4: Save admin details only after successful verification
      const storage = rememberMe ? localStorage : sessionStorage;

      // Clear previous admin login information
      localStorage.removeItem("zinoraAdminToken");
      localStorage.removeItem("zinoraAdminRole");
      localStorage.removeItem("zinoraAdminUsername");

      sessionStorage.removeItem("zinoraAdminToken");
      sessionStorage.removeItem("zinoraAdminRole");
      sessionStorage.removeItem("zinoraAdminUsername");

      storage.setItem("zinoraAdminToken", data.token);
      storage.setItem("zinoraAdminRole", data.role);
      storage.setItem("zinoraAdminUsername", data.username);

      // Step 5: Open Admin Dashboard
      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      console.error("Admin login error:", err);

      setError(
        "Unable to connect to the server. Please check whether Django is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f8f1e8 0%, #efe2d1 50%, #f8f1e8 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 1000,
          minHeight: 580,
          display: "flex",
          overflow: "hidden",
          borderRadius: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* LEFT PANEL */}
        <Box
          sx={{
            width: { xs: "100%", md: "45%" },
            background:
              "linear-gradient(145deg, #4b1020 0%, #711f32 55%, #35101a 100%)",
            color: "#fff",
            p: { xs: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 6,
              }}
            >
              <AdminPanelSettings
                sx={{ fontSize: 42, color: "#e6c17a" }}
              />

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: 3,
                    color: "#e6c17a",
                  }}
                >
                  ZINORA
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ letterSpacing: 2, color: "#f1dfc2" }}
                >
                  IMITATION JEWELLERY
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                lineHeight: 1.25,
                mb: 2,
                fontSize: { xs: 30, md: 38 },
              }}
            >
              Welcome Back,
              <br />
              Administrator.
            </Typography>

            <Typography
              sx={{
                color: "#ead7d0",
                fontSize: 15,
                lineHeight: 1.9,
                mb: 4,
              }}
            >
              Manage your jewellery store, products, customers and orders
              through your dedicated administration panel.
            </Typography>

            <Divider
              sx={{
                borderColor: "rgba(230,193,122,0.4)",
                mb: 3,
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <ShieldOutlined sx={{ color: "#e6c17a", fontSize: 32 }} />

              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  Secure Administrator Access
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "#ead7d0", mt: 0.5 }}
                >
                  Authorized personnel only
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: "#d6b8b4",
              mt: 5,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            © {new Date().getFullYear()} Zinora Jewellery. All rights reserved.
          </Typography>
        </Box>

        {/* RIGHT PANEL - LOGIN FORM */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, sm: 5, md: 7 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#fffdfb",
          }}
        >
          <Box sx={{ maxWidth: 390, width: "100%", mx: "auto" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#4b1020",
                mb: 1,
              }}
            >
              Admin Login
            </Typography>

            <Typography
              sx={{
                color: "#82747a",
                mb: 4,
                fontSize: 14,
              }}
            >
              Enter your credentials to access the dashboard.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              {/* EMAIL */}
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#4b1020",
                  mb: 1,
                  fontSize: 14,
                }}
              >
                Email Address
              </Typography>

              <TextField
                fullWidth
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
                disabled={loading}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fff",
                    "&.Mui-focused fieldset": {
                      borderColor: "#711f32",
                    },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ color: "#8c6670" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* PASSWORD */}
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#4b1020",
                  mb: 1,
                  fontSize: 14,
                }}
              >
                Password
              </Typography>

              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fff",
                    "&.Mui-focused fieldset": {
                      borderColor: "#711f32",
                    },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: "#8c6670" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword((previous) => !previous)
                          }
                          edge="end"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          disabled={loading}
                        >
                          {showPassword ? (
                            <VisibilityOffOutlined />
                          ) : (
                            <VisibilityOutlined />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* REMEMBER ME */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                      sx={{
                        color: "#711f32",
                        "&.Mui-checked": {
                          color: "#711f32",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13, color: "#6f6267" }}>
                      Remember me
                    </Typography>
                  }
                />
              </Box>

              {/* LOGIN BUTTON */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={
                  loading ? (
                    <CircularProgress size={19} color="inherit" />
                  ) : (
                    <ArrowForward />
                  )
                }
                sx={{
                  py: 1.6,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: 16,
                  fontWeight: 700,
                  background:
                    "linear-gradient(90deg, #4b1020 0%, #711f32 100%)",
                  boxShadow: "0 6px 18px rgba(75,16,32,0.2)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #35101a 0%, #5b1728 100%)",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#a78b91",
                    color: "#fff",
                  },
                }}
              >
                {loading ? "Signing In..." : "Sign In to Dashboard"}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="caption"
              sx={{
                color: "#998990",
                display: "block",
                textAlign: "center",
                lineHeight: 1.8,
              }}
            >
              This area is restricted to authorized administrators.
              <br />
              Your login credentials are verified by the Zinora backend.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLogin;