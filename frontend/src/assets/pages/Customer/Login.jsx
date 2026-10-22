import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const LOGIN_API = `${API_BASE_URL}/api/accounts/login/`;

const AUTH_KEYS = [
  "zinoraAdminToken",
  "adminToken",
  "zinoraCustomerToken",
  "zinoraToken",
  "authToken",
  "token",
  "zinoraAdminRole",
  "zinoraCustomerRole",
  "zinoraRole",
  "zinoraAdminUsername",
  "zinoraCustomerUsername",
  "zinoraUsername",
  "adminUsername",
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const identifier = email.trim();
    if (!identifier || !password) {
      setError("Please enter your email/username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username: identifier, password }),
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = { detail: responseText };
      }

      if (!response.ok) {
        const apiError = data.error || data.detail || data.message;
        const fieldError =
          data.non_field_errors?.join?.(", ") ||
          data.username?.join?.(", ") ||
          data.password?.join?.(", ");
        setError(apiError || fieldError || "Invalid email/username or password.");
        return;
      }

      const role = String(data.role || data.user?.role || "").trim().toUpperCase();
      const token = data.token || data.key || data.access;
      const username = data.username || data.user?.username || identifier;

      if (!token) {
        setError("The login response did not include an authentication token. Please check the Django login API.");
        return;
      }

      if (role !== "ADMIN" && role !== "CUSTOMER") {
        setError("Your account role could not be verified. Please check the Django login API response.");
        return;
      }

      // Clear only old authentication values. Keep cart, wishlist and address data.
      AUTH_KEYS.forEach((key) => localStorage.removeItem(key));

      if (role === "ADMIN") {
        localStorage.setItem("zinoraAdminToken", token);
        localStorage.setItem("adminToken", token);
        localStorage.setItem("zinoraToken", token);
        localStorage.setItem("zinoraAdminRole", role);
        localStorage.setItem("zinoraRole", role);
        localStorage.setItem("zinoraAdminUsername", username);
        localStorage.setItem("zinoraUsername", username);
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      localStorage.setItem("zinoraCustomerToken", token);
      localStorage.setItem("zinoraToken", token);
      localStorage.setItem("zinoraRole", role);
      localStorage.setItem("zinoraUsername", username);
      localStorage.setItem("zinoraCustomerUsername", username);
      localStorage.setItem("zinoraCustomerRole", role);

      const requestedPath = location.state?.from?.pathname;
      const safeCustomerPath =
        requestedPath &&
        requestedPath !== "/" &&
        requestedPath !== "/register" &&
        requestedPath !== "/login" &&
        requestedPath !== "/admin/login" &&
        !requestedPath.startsWith("/admin")
          ? requestedPath
          : "/home";

      navigate(safeCustomerPath, { replace: true });
    } catch (err) {
      console.error("Login API error:", err);
      setError("Unable to connect to the server. Check your internet connection and backend API URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f2ee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1050,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          backgroundColor: "#fff",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 35px rgba(0,0,0,0.12)",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "42%" },
            minHeight: { xs: 220, md: 520 },
            background: "linear-gradient(145deg, #52000d, #800020, #300008)",
            color: "#fff",
            p: { xs: 3, md: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ color: "#d9b66d", letterSpacing: 3, fontSize: 11, fontWeight: 700, mb: 2 }}>
            WELCOME TO ZINORA
          </Typography>
          <Typography sx={{ fontFamily: "Georgia, serif", fontSize: { xs: 32, md: 42 }, lineHeight: 1.2, mb: 2 }}>
            Step Into<br />Royal Grandeur
          </Typography>
          <Typography sx={{ color: "#e4d6d6", lineHeight: 1.8, fontSize: 14 }}>
            Discover elegant jewellery, explore exclusive collections, and experience the beauty of ZINORA.
          </Typography>
          <Box sx={{ width: 65, height: 3, backgroundColor: "#d9b66d", mt: 4 }} />
          <Typography sx={{ color: "#e4d6d6", fontSize: 13, lineHeight: 1.9, mt: 3 }}>
            ✨ Explore exclusive collections.<br />
            ✨ Discover your favourite jewellery.<br />
            ✨ Enjoy your shopping experience.
          </Typography>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "58%" },
            p: { xs: 3, sm: 5, md: 7 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ color: "#80652d", fontSize: 11, fontWeight: 700, letterSpacing: 2, mb: 2 }}>
            SECURE ACCOUNT ACCESS
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "Georgia, serif", color: "#52000d", mb: 1, fontSize: { xs: 28, md: 34 }, fontWeight: 700 }}>
            Sign In
          </Typography>
          <Typography sx={{ color: "#777", fontSize: 14, mb: 4, lineHeight: 1.7 }}>
            Sign in to your ZINORA account to continue shopping. Administrators will be redirected to the admin dashboard.
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3, whiteSpace: "pre-line" }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 1, color: "#333" }}>
              EMAIL / USERNAME
            </Typography>
            <TextField
              fullWidth
              type="text"
              placeholder="Enter your email or username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
              disabled={loading}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&.Mui-focused fieldset": { borderColor: "#800020" },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: "#80652d" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 1, color: "#333" }}>
              PASSWORD
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
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&.Mui-focused fieldset": { borderColor: "#800020" },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#80652d" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((previous) => !previous)}
                        edge="end"
                        disabled={loading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#52000d",
                color: "#fff",
                py: 1.5,
                borderRadius: 1.5,
                fontWeight: 700,
                letterSpacing: 1,
                "&:hover": { backgroundColor: "#3d0009" },
              }}
            >
              {loading ? <CircularProgress size={23} color="inherit" /> : "SIGN IN →"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography sx={{ textAlign: "center", fontSize: 14, color: "#777" }}>
            New to ZINORA?{" "}
            <Button
              variant="text"
              onClick={() => navigate("/register")}
              disabled={loading}
              sx={{ color: "#800020", fontWeight: 700, textTransform: "none" }}
            >
              Create Account
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
