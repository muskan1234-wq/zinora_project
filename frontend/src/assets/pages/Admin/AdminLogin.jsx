
import React, { useState } from "react";
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

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Connect your actual admin login API here.
      // Example:
      // const response = await axios.post("/api/admin/login", {
      //   email,
      //   password,
      // });

      setError(
        "Login API is not connected yet. Please connect your backend authentication endpoint."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to log in. Please try again."
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
        px: 2,
        py: 4,
        background:
          "radial-gradient(circle at 15% 15%, #8c3449 0%, transparent 35%), linear-gradient(135deg, #3e0614 0%, #650c20 50%, #30040f 100%)",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1000,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 25px 70px rgba(0,0,0,0.3)",
        }}
      >
        {/* Left information panel */}

        <Box
          sx={{
            p: { xs: 3, sm: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: { xs: "auto", md: 570 },
            color: "#fff8f2",
            background:
              "linear-gradient(145deg, #72182d 0%, #4a0819 100%)",
          }}
        >
          <Box>
            {/* Logo */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 7,
              }}
            >
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #c9ae78",
                  borderRadius: 1.5,
                  color: "#d7bc82",
                }}
              >
                <ShieldOutlined sx={{ fontSize: 30 }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: "Georgia, serif",
                    fontSize: 25,
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: "#f6e8d5",
                  }}
                >
                  ZINORA
                </Typography>

                <Typography
                  sx={{
                    fontSize: 9,
                    letterSpacing: 2,
                    color: "#d9bdab",
                  }}
                >
                  IMITATION JEWELLERY
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: 2,
                color: "#d7bc82",
                fontWeight: 700,
                mb: 2,
              }}
            >
              ADMINISTRATOR PORTAL
            </Typography>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: { xs: 32, sm: 39 },
                lineHeight: 1.25,
                fontWeight: 600,
                mb: 2,
                color: "#fff8f2",
              }}
            >
              Welcome to your
              <br />
              royal workspace.
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                lineHeight: 1.9,
                color: "#e2cfc9",
                maxWidth: 360,
              }}
            >
              Manage your jewellery collection, monitor orders,
              oversee customers, and control your store from
              one secure administration portal.
            </Typography>

            <Divider
              sx={{
                my: 4,
                borderColor: "rgba(255,255,255,0.18)",
              }}
            />

            {[
              "Product and inventory management",
              "Customer and order management",
              "Secure administrative access",
            ].map((item) => (
              <Box
                key={item}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#d7bc82",
                    flexShrink: 0,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#f1dfd5",
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography
            sx={{
              mt: 5,
              fontSize: 10,
              color: "#d3b7ac",
              letterSpacing: 0.5,
            }}
          >
            © 2026 ZINORA. ALL RIGHTS RESERVED.
          </Typography>
        </Box>

        {/* Right login panel */}

        <Box
          sx={{
            p: { xs: 3, sm: 5 },
            display: "flex",
            alignItems: "center",
            background: "#fffdfa",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
            <Box
              sx={{
                width: 55,
                height: 55,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                background: "#f5e9e9",
                color: "#650c20",
                mb: 3,
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 32 }} />
            </Box>

            <Typography
              sx={{
                fontFamily: "Georgia, serif",
                fontSize: 30,
                fontWeight: 600,
                color: "#571326",
                mb: 1,
              }}
            >
              Admin Login
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                lineHeight: 1.8,
                color: "#8c7774",
                mb: 4,
              }}
            >
              Sign in with your administrator credentials
              to access the Zinora dashboard.
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  fontSize: 12,
                  overflowWrap: "anywhere",
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#62494b",
                  mb: 1,
                }}
              >
                EMAIL ADDRESS
              </Typography>

              <TextField
                fullWidth
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
                size="small"
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    background: "#fbf7f4",
                    borderRadius: 1.5,
                    fontSize: 13,
                    "& fieldset": {
                      borderColor: "#e8dcd7",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#650c20",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined
                        sx={{ color: "#987b79", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#62494b",
                  }}
                >
                  PASSWORD
                </Typography>

                <Typography
                  component="button"
                  type="button"
                  onClick={() =>
                    setError(
                      "Please contact your administrator to reset your password."
                    )
                  }
                  sx={{
                    border: 0,
                    background: "transparent",
                    p: 0,
                    fontSize: 10,
                    color: "#8a6242",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Forgot password?
                </Typography>
              </Box>

              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                size="small"
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    background: "#fbf7f4",
                    borderRadius: 1.5,
                    fontSize: 13,
                    "& fieldset": {
                      borderColor: "#e8dcd7",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#650c20",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined
                        sx={{ color: "#987b79", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        size="small"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() =>
                          setShowPassword((value) => !value)
                        }
                      >
                        {showPassword ? (
                          <VisibilityOffOutlined fontSize="small" />
                        ) : (
                          <VisibilityOutlined fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                sx={{
                  mt: 1,
                  mb: 3,
                  "& .MuiFormControlLabel-label": {
                    fontSize: 11,
                    color: "#806e6b",
                  },
                }}
                control={
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                    sx={{
                      color: "#987b79",
                      "&.Mui-checked": {
                        color: "#650c20",
                      },
                    }}
                  />
                }
                label="Remember me"
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={
                  loading ? (
                    <CircularProgress size={17} color="inherit" />
                  ) : (
                    <ArrowForward />
                  )
                }
                sx={{
                  py: 1.5,
                  borderRadius: 1.5,
                  background: "#650c20",
                  color: "#fffaf5",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  boxShadow: "0 5px 15px rgba(101,12,32,0.18)",
                  "&:hover": {
                    background: "#480716",
                  },
                }}
              >
                {loading ? "SIGNING IN..." : "SIGN IN TO DASHBOARD"}
              </Button>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#eee4df" }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <ShieldOutlined
                sx={{ fontSize: 17, color: "#9a8154" }}
              />

              <Typography
                sx={{
                  fontSize: 10,
                  color: "#887571",
                }}
              >
                Secure administrator authentication
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 3,
                textAlign: "center",
                fontSize: 11,
                color: "#8b7772",
              }}
            >
              Not an administrator? Contact your store administrator.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
