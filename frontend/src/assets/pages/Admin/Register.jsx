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
Divider,
Alert,
CircularProgress,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const REGISTER_API = `${API_BASE_URL}/api/accounts/register/`;

const Register = () => {
const navigate = useNavigate();

const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [loading, setLoading] = useState(false);

const getErrorMessage = (data) => {
if (typeof data === "string") {
return data;
}


if (data?.detail) {
  return data.detail;
}

if (data?.message) {
  return data.message;
}

if (data && typeof data === "object") {
  return Object.entries(data)
    .map(([field, messages]) => {
      const readableField =
        field === "username"
          ? "Username"
          : field === "email"
            ? "Email"
            : field === "phone"
              ? "Phone"
              : field === "password"
                ? "Password"
                : field === "non_field_errors"
                  ? "Error"
                  : field;

      const readableMessages = Array.isArray(messages)
        ? messages.join(", ")
        : typeof messages === "string"
          ? messages
          : JSON.stringify(messages);

      return `${readableField}: ${readableMessages}`;
    })
    .join("\n");
}

return "Registration failed. Please try again.";


};

const handleRegister = async (event) => {
event.preventDefault();


setError("");
setSuccess("");

const name = fullName.trim();
const normalizedEmail = email.trim().toLowerCase();
const normalizedPhone = phone.trim();

if (!name || !normalizedEmail || !normalizedPhone || !password || !confirmPassword) {
  setError("Please fill in all fields.");
  return;
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
  setError("Please enter a valid email address.");
  return;
}

if (!/^\d{10}$/.test(normalizedPhone)) {
  setError("Please enter a valid 10-digit phone number.");
  return;
}

if (password.length < 8) {
  setError("Password must contain at least 8 characters.");
  return;
}

if (password !== confirmPassword) {
  setError("Password and confirm password do not match.");
  return;
}

const nameParts = name.split(/\s+/);
const firstName = nameParts[0];
const lastName = nameParts.slice(1).join(" ");

/*
  Django's default AbstractUser requires a username.
  The email is used as the username unless your backend
  serializer generates the username itself.
*/
const registrationData = {
  username: normalizedEmail,
  first_name: firstName,
  last_name: lastName,
  email: normalizedEmail,
  phone: normalizedPhone,
  password: password,
  role: "CUSTOMER",
};

setLoading(true);

try {
  const response = await fetch(REGISTER_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(registrationData),
  });

  const responseText = await response.text();

  let data = {};

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = { detail: responseText };
  }

  if (!response.ok) {
    setError(getErrorMessage(data));
    return;
  }

  setSuccess("Registration successful! Redirecting to Sign In...");

  setFullName("");
  setEmail("");
  setPhone("");
  setPassword("");
  setConfirmPassword("");

  // New customers must sign in after registration.
  setTimeout(() => {
    navigate("/login", {
      replace: true,
      state: {
        registered: true,
        email: normalizedEmail,
        message: "Account created successfully. Please sign in.",
      },
    });
  }, 1200);
} catch (err) {
  console.error("Registration API error:", err);

  setError(
    "Unable to connect to the server. Please check your internet connection and try again."
  );
} finally {
  setLoading(false);
}


};

const fieldSx = {
mb: 2.5,
"& .MuiOutlinedInput-root": {
borderRadius: 2,
backgroundColor: "#fff",
"&.Mui-focused fieldset": {
borderColor: "#711f32",
},
},
};

const labelSx = {
fontWeight: 600,
color: "#4b1020",
mb: 1,
fontSize: 14,
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
display: "flex",
overflow: "hidden",
borderRadius: 4,
flexDirection: { xs: "column", md: "row" },
}}
>
{/* LEFT PANEL */}
<Box
sx={{
width: { xs: "100%", md: "42%" },
background:
"linear-gradient(145deg, #4b1020 0%, #711f32 55%, #35101a 100%)",
color: "#fff",
p: { xs: 3, md: 5 },
display: "flex",
flexDirection: "column",
justifyContent: "center",
}}
>
<Box
sx={{
display: "flex",
alignItems: "center",
gap: 1.5,
mb: 5,
}}
>
<PersonIcon sx={{ color: "#e6c17a", fontSize: 36 }} />


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
        Join Our
        <br />
        Royal World.
      </Typography>

      <Typography
        sx={{
          color: "#ead7d0",
          fontSize: 15,
          lineHeight: 1.9,
          mb: 4,
        }}
      >
        Create your account to discover elegant jewellery, explore
        exclusive collections, and enjoy a beautiful shopping experience
        with ZINORA.
      </Typography>

      <Divider
        sx={{
          borderColor: "rgba(230,193,122,0.4)",
          mb: 3,
        }}
      />

      <Typography sx={{ color: "#f1dfc2", lineHeight: 1.8 }}>
        ✨ Discover your style.
        <br />
        ✨ Explore exclusive collections.
        <br />
        ✨ Make every moment special.
      </Typography>

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

    {/* RIGHT PANEL — REGISTRATION FORM */}
    <Box
      sx={{
        flex: 1,
        p: { xs: 3, sm: 5, md: 6 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#fffdfb",
      }}
    >
      <Box sx={{ maxWidth: 420, width: "100%", mx: "auto" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: "#4b1020", mb: 1 }}
        >
          Register
        </Typography>

        <Typography
          sx={{
            color: "#82747a",
            mb: 3,
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          Register to begin your ZINORA shopping journey.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2, whiteSpace: "pre-line" }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister}>
          <Typography sx={labelSx}>Full Name</Typography>

          <TextField
            fullWidth
            placeholder="Enter your full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            required
            disabled={loading}
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#8c6670" }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Typography sx={labelSx}>Email Address</Typography>

          <TextField
            fullWidth
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            disabled={loading}
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: "#8c6670" }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Typography sx={labelSx}>Phone Number</Typography>

          <TextField
            fullWidth
            type="tel"
            placeholder="Enter 10-digit phone number"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
            }
            autoComplete="tel"
            required
            disabled={loading}
            inputProps={{ maxLength: 10, inputMode: "numeric" }}
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon sx={{ color: "#8c6670" }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Typography sx={labelSx}>Password</Typography>

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
            disabled={loading}
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#8c6670" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      edge="end"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Typography sx={labelSx}>Confirm Password</Typography>

          <TextField
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
            disabled={loading}
            sx={{ ...fieldSx, mb: 3 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#8c6670" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                      edge="end"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
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
            endIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <ArrowForwardIcon />
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
                color: "#fff",
                opacity: 0.7,
              },
            }}
          >
            {loading ? "Creating Account..." : "Register"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography
          sx={{
            textAlign: "center",
            color: "#82747a",
            fontSize: 14,
          }}
        >
          Already have an account?{" "}
          <Button
            variant="text"
            onClick={() => navigate("/login")}
            sx={{
              color: "#711f32",
              fontWeight: 700,
              textTransform: "none",
              fontSize: 14,
              minWidth: "auto",
              padding: "2px 5px",
              "&:hover": {
                backgroundColor: "rgba(113, 31, 50, 0.08)",
                textDecoration: "underline",
              },
            }}
          >
            Sign In
          </Button>
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#998990",
            display: "block",
            textAlign: "center",
            lineHeight: 1.8,
            mt: 3,
          }}
        >
          Zinora Jewellery celebrates the beauty of imitation jewellery.
          All rights reserved.
        </Typography>
      </Box>
    </Box>
  </Paper>
</Box>


);
};

export default Register;
