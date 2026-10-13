import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CustomerLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Current Django login API expects username.
          body: JSON.stringify({
            username: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email/username or password.");
        return;
      }

      if (data.role !== "CUSTOMER") {
        setError("Access denied. Please use a customer account.");
        return;
      }

      localStorage.setItem("zinoraToken", data.token);
      localStorage.setItem("zinoraRole", data.role);
      localStorage.setItem("zinoraUsername", data.username);

      navigate("/customer-dashboard");
    } catch (err) {
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
        minHeight: "calc(100vh - 80px)",
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
        {/* LEFT SIDE */}
        <Box
          sx={{
            width: { xs: "100%", md: "42%" },
            minHeight: { xs: 250, md: 520 },
            background:
              "linear-gradient(rgba(67,0,10,0.88), rgba(67,0,10,0.96)), url('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            p: { xs: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              color: "#d9b66d",
              letterSpacing: 3,
              fontSize: 11,
              mb: 2,
            }}
          >
            ATELIER ROYAL ACCESS
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: { xs: 32, md: 42 },
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Step Into Royal Grandeur
          </Typography>

          <Typography sx={{ color: "#e4d6d6", lineHeight: 1.8 }}>
            Discover elegant jewellery, explore exclusive collections, and
            experience the beauty of ZINORA.
          </Typography>
        </Box>

        {/* RIGHT SIDE - LOGIN FORM */}
        <Box
          sx={{
            width: { xs: "100%", md: "58%" },
            p: { xs: 3, sm: 5, md: 7 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              color: "#80652d",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              mb: 2,
            }}
          >
            CUSTOMER ACCOUNT
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontFamily: "Georgia, serif",
              color: "#52000d",
              mb: 1,
            }}
          >
            Welcome to ZINORA
          </Typography>

          <Typography sx={{ color: "#777", fontSize: 14, mb: 4 }}>
            Sign in to access your account and continue shopping.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 1 }}>
              EMAIL
            </Typography>

            <TextField
              fullWidth
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: "#80652d" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 1 }}>
              PASSWORD
            </Typography>

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "#80652d" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
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
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: "#3d0009",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={23} color="inherit" />
              ) : (
                "SIGN IN →"
              )}
            </Button>
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: 12,
              color: "#777",
              mt: 3,
            }}
          >
            Welcome to the royal world of ZINORA.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerLogin;