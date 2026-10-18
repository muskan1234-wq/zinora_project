import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const LOGIN_API = "http://127.0.0.1:8000/api/accounts/login/";

const Login = () => {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleLogin = async (event) => {
event.preventDefault();
setError("");


const identifier = email.trim();

if (!identifier || !password) {
  setError("Please enter your email/username and password.");
  return;
}

try {
  setLoading(true);

  const response = await fetch(LOGIN_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: identifier,
      password: password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.error ||
        data.detail ||
        data.message ||
        "Invalid email/username or password."
    );
    return;
  }

  const role = String(data.role || "").toUpperCase();
  const token = data.token;
  const username = data.username || identifier;

  // Verify that the backend returned a valid token.
  if (!token) {
    setError(
      "Authentication token is missing. Please check the Django login API."
    );
    return;
  }

  // This page is intended for administrator login only.
  if (role !== "ADMIN") {
    setError(
      "Admin access denied. Please use an authorized administrator account."
    );
    return;
  }

  // Save the keys required by the admin dashboard and Categories page.
  localStorage.setItem("zinoraAdminToken", token);
  localStorage.setItem("zinoraAdminRole", role);
  localStorage.setItem("zinoraAdminUsername", username);

  // Preserve the existing application authentication keys.
  localStorage.setItem("zinoraToken", token);
  localStorage.setItem("zinoraRole", role);
  localStorage.setItem("zinoraUsername", username);

  // Open the admin dashboard after successful authentication.
  navigate("/admin/dashboard", { replace: true });
} catch (err) {
  console.error("Admin login error:", err);

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
        Discover elegant jewellery, explore exclusive collections,
        and experience the beauty of ZINORA.
      </Typography>

      <Box
        sx={{
          width: 65,
          height: 3,
          backgroundColor: "#d9b66d",
          mt: 4,
        }}
      />
    </Box>

    {/* RIGHT SIDE - ADMIN LOGIN */}
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
        SECURE ADMIN ACCESS
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontFamily: "Georgia, serif",
          color: "#52000d",
          mb: 1,
          fontSize: { xs: 28, md: 34 },
        }}
      >
        Admin Login
      </Typography>

      <Typography
        sx={{
          color: "#777",
          fontSize: 14,
          mb: 4,
          lineHeight: 1.7,
        }}
      >
        Enter your registered email or username and password to access
        the ZINORA administration dashboard.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
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

      <Typography
        sx={{
          textAlign: "center",
          fontSize: 12,
          color: "#777",
          mt: 3,
          lineHeight: 1.8,
        }}
      >
        Authorized administrators only.
      </Typography>
    </Box>
  </Box>
</Box>


);
};

export default Login;
