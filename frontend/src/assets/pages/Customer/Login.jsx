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

const LOGIN_API = "http://127.0.0.1:8000/api/accounts/login/";

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
    body: JSON.stringify({
      username: identifier,
      password: password,
    }),
  });

  const responseText = await response.text();

  let data = {};

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = { detail: responseText };
  }

  if (!response.ok) {
    setError(
      data.error ||
        data.detail ||
        data.message ||
        "Invalid email/username or password."
    );
    return;
  }

  const role = String(data.role || "").trim().toUpperCase();
  const token = data.token;
  const username = data.username || identifier;

  // A valid authentication token must be returned by Django.
  if (!token) {
    setError(
      "Authentication token is missing. Please check the Django login API response."
    );
    return;
  }

  // Accept only supported account roles returned by the backend.
  if (role !== "ADMIN" && role !== "CUSTOMER") {
    setError(
      "Your account role could not be verified. Please contact the administrator."
    );
    return;
  }

  // ADMIN LOGIN
  if (role === "ADMIN") {
    localStorage.setItem("zinoraAdminToken", token);
    localStorage.setItem("zinoraAdminRole", role);
    localStorage.setItem("zinoraAdminUsername", username);

    // Also maintain the application's common authentication keys.
    localStorage.setItem("zinoraToken", token);
    localStorage.setItem("zinoraRole", role);
    localStorage.setItem("zinoraUsername", username);

    // Clear any previous customer session.
    localStorage.removeItem("zinoraCustomerToken");

    navigate("/admin/dashboard", { replace: true });
    return;
  }

 // CUSTOMER LOGIN
localStorage.setItem("zinoraToken", token);
localStorage.setItem("zinoraRole", role);
localStorage.setItem("zinoraUsername", username);

// Save customer-specific authentication details
localStorage.setItem("zinoraCustomerToken", token);
localStorage.setItem("zinoraCustomerUsername", username);
localStorage.setItem("zinoraCustomerRole", role);
localStorage.setItem("zinoraToken", data.token);
localStorage.setItem("zinoraRole", data.role);
localStorage.setItem("zinoraUsername", data.username);

// Remove any previous administrator session
localStorage.removeItem("zinoraAdminToken");
localStorage.removeItem("zinoraAdminRole");
localStorage.removeItem("zinoraAdminUsername");

// Return to the requested page, or open the home page
const redirectTo = location.state?.from?.pathname || "/";
navigate(redirectTo, { replace: true });


  // Customer goes to the main Zinora shopping website.
  navigate("/", { replace: true });
} catch (err) {
  console.error("Login API error:", err);

  setError(
    "Unable to connect to the server. Please make sure Django is running."
  );
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
{/* LEFT SIDE */}
<Box
sx={{
width: { xs: "100%", md: "42%" },
minHeight: { xs: 220, md: 520 },
background:
"linear-gradient(145deg, #52000d, #800020, #300008)",
color: "#fff",
p: { xs: 3, md: 5 },
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
fontWeight: 700,
mb: 2,
}}
>
WELCOME TO ZINORA </Typography>


      <Typography
        sx={{
          fontFamily: "Georgia, serif",
          fontSize: { xs: 32, md: 42 },
          lineHeight: 1.2,
          mb: 2,
        }}
      >
        Step Into
        <br />
        Royal Grandeur
      </Typography>

      <Typography
        sx={{
          color: "#e4d6d6",
          lineHeight: 1.8,
          fontSize: 14,
        }}
      >
        Discover elegant jewellery, explore exclusive collections, and
        experience the beauty of ZINORA.
      </Typography>

      <Box
        sx={{
          width: 65,
          height: 3,
          backgroundColor: "#d9b66d",
          mt: 4,
        }}
      />

      <Typography
        sx={{
          color: "#e4d6d6",
          fontSize: 13,
          lineHeight: 1.9,
          mt: 3,
        }}
      >
        ✨ Explore exclusive collections.
        <br />
        ✨ Discover your favourite jewellery.
        <br />
        ✨ Enjoy your shopping experience.
      </Typography>
    </Box>

    {/* RIGHT SIDE — CUSTOMER AND ADMIN LOGIN */}
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
        SECURE ACCOUNT ACCESS
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontFamily: "Georgia, serif",
          color: "#52000d",
          mb: 1,
          fontSize: { xs: 28, md: 34 },
          fontWeight: 700,
        }}
      >
        Sign In
      </Typography>

      <Typography
        sx={{
          color: "#777",
          fontSize: 14,
          mb: 4,
          lineHeight: 1.7,
        }}
      >
        Sign in to your ZINORA account to continue shopping. Administrators
        will be redirected to the admin dashboard.
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, whiteSpace: "pre-line" }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleLogin}>
        {/* EMAIL / USERNAME */}
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            mb: 1,
            color: "#333",
          }}
        >
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
              "&.Mui-focused fieldset": {
                borderColor: "#800020",
              },
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

        {/* PASSWORD */}
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            mb: 1,
            color: "#333",
          }}
        >
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
              "&.Mui-focused fieldset": {
                borderColor: "#800020",
              },
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
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* LOGIN BUTTON */}
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
            "&:hover": {
              backgroundColor: "#3d0009",
            },
            "&.Mui-disabled": {
              backgroundColor: "#a68a8d",
              color: "#fff",
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

      <Divider sx={{ my: 3 }} />

      {/* REGISTRATION LINK FOR NEW CUSTOMERS */}
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 14,
          color: "#777",
        }}
      >
        New to ZINORA?{" "}
        <Button
          variant="text"
          onClick={() => navigate("/register")}
          disabled={loading}
          sx={{
            color: "#800020",
            fontWeight: 700,
            textTransform: "none",
            minWidth: "auto",
            "&:hover": {
              backgroundColor: "rgba(128,0,32,0.06)",
              textDecoration: "underline",
            },
          }}
        >
          Create Account
        </Button>
      </Typography>

      <Typography
        sx={{
          textAlign: "center",
          fontSize: 12,
          color: "#777",
          mt: 3,
          lineHeight: 1.8,
        }}
      >
        Your account access is determined by your verified account role.
      </Typography>
    </Box>
  </Box>
</Box>


);
};

export default Login;
