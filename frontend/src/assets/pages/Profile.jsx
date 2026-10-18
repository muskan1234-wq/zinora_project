import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

const COLORS = {
  maroon: "#641526",
  darkMaroon: "#45101D",
  cream: "#FAF6F0",
  background: "#FCFAF7",
  border: "#EAE1D8",
  text: "#292321",
  muted: "#817773",
  white: "#FFFFFF",
  lightPink: "#F7EDE9",
  gold: "#C9A66B",
};

const EMPTY_PROFILE = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

const PROFILE_STORAGE_KEY = "zinoraCustomerProfile";

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isEditing, setIsEditing] = useState(false);
  const [activeMenu, setActiveMenu] = useState("My Profile");

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [savedProfile, setSavedProfile] = useState(EMPTY_PROFILE);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load the locally saved profile when the page opens.
  // The real Django customer profile API can replace this later.
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

      const storedUsername =
        localStorage.getItem("zinoraCustomerUsername") ||
        sessionStorage.getItem("zinoraCustomerUsername") ||
        "";

      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);

        const loadedProfile = {
          ...EMPTY_PROFILE,
          ...parsedProfile,
          name: parsedProfile.name || storedUsername,
        };

        setProfile(loadedProfile);
        setSavedProfile(loadedProfile);
      } else {
        const initialProfile = {
          ...EMPTY_PROFILE,
          name: storedUsername,
        };

        setProfile(initialProfile);
        setSavedProfile(initialProfile);
      }
    } catch (error) {
      console.error("Unable to load customer profile:", error);
    }
  }, []);

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const closeToast = () => {
    setToast((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!profile.name.trim()) {
      showToast("Please enter your full name.", "warning");
      return;
    }

    if (
      profile.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())
    ) {
      showToast("Please enter a valid email address.", "warning");
      return;
    }

    if (
      profile.phone.trim() &&
      !/^[0-9+\-\s()]{7,20}$/.test(profile.phone.trim())
    ) {
      showToast("Please enter a valid phone number.", "warning");
      return;
    }

    try {
      const updatedProfile = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim(),
      };

      localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(updatedProfile)
      );

      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      setIsEditing(false);

      // Keep the existing username available to the current UI.
      if (updatedProfile.name) {
        localStorage.setItem(
          "zinoraCustomerUsername",
          updatedProfile.name
        );
      }

      showToast("Your profile has been saved on this browser.");
    } catch (error) {
      console.error("Unable to save customer profile:", error);
      showToast("Unable to save profile details.", "error");
    }
  };

  const handleCancel = () => {
    setProfile({ ...savedProfile });
    setIsEditing(false);
  };

  const handleLogout = () => {
    [
      "zinoraCustomerToken",
      "zinoraCustomerRole",
      "zinoraCustomerUsername",
    ].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // Keep the saved profile on this browser.
    // Remove PROFILE_STORAGE_KEY here too if you want to clear it on logout.

    navigate("/customer/login", { replace: true });
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu.label);

    if (menu.label === "Logout") {
      handleLogout();
      return;
    }

    if (menu.label === "My Profile") {
      setActiveMenu("My Profile");
      return;
    }

    if (menu.path) {
      navigate(menu.path);
      return;
    }

    showToast(`${menu.label} will be available soon.`, "info");
  };

  const menuItems = [
    {
      label: "My Profile",
      icon: <PersonIcon />,
    },
    {
      label: "My Orders",
      icon: <ShoppingBagOutlinedIcon />,
      path: "/my-orders",
    },
    {
      label: "My Wishlist",
      icon: <FavoriteBorderOutlinedIcon />,
      path: "/wishlist",
    },
    {
      label: "My Addresses",
      icon: <LocationOnOutlinedIcon />,
    },
    {
      label: "Login & Security",
      icon: <LockOutlinedIcon />,
    },
    {
      label: "Logout",
      icon: <LogoutOutlinedIcon />,
    },
  ];

  const panelStyle = {
    backgroundColor: COLORS.white,
    border: `1px solid ${COLORS.border}`,
    borderRadius: { xs: "14px", md: "18px" },
    boxShadow: "0 5px 24px rgba(69, 16, 29, 0.045)",
  };

  const renderField = (label, name, value, placeholder) => (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 700,
          color: COLORS.muted,
          mb: 1,
          letterSpacing: "0.4px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>

      <TextField
        fullWidth
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={!isEditing}
        size="medium"
        variant="outlined"
        autoComplete={
          name === "email"
            ? "email"
            : name === "phone"
              ? "tel"
              : name === "name"
                ? "name"
                : "street-address"
        }
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: isEditing ? "#FFFFFF" : "#FAF8F5",
            fontSize: "14px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.border,
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: COLORS.maroon,
            },
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: COLORS.text,
          },
        }}
      />
    </Box>
  );

  const accountCards = [
    {
      title: "My Orders",
      description: "View your purchases and track your deliveries.",
      icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 26 }} />,
      path: "/my-orders",
    },
    {
      title: "My Wishlist",
      description: "Find your saved jewellery and favourite designs.",
      icon: <FavoriteBorderOutlinedIcon sx={{ fontSize: 26 }} />,
      path: "/wishlist",
    },
    {
      title: "Shopping Cart",
      description: "Review your selected jewellery before checkout.",
      icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 26 }} />,
      path: "/cart",
    },
    {
      title: "My Addresses",
      description: "Manage the addresses you use for delivery.",
      icon: <LocationOnOutlinedIcon sx={{ fontSize: 26 }} />,
      action: () => {
        setActiveMenu("My Addresses");
        showToast("Address management will be connected next.", "info");
      },
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: COLORS.background,
        py: { xs: 3, md: 5 },
        boxSizing: "border-box",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
          boxSizing: "border-box",
        }}
      >
        {/* PAGE TITLE */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            sx={{
              color: COLORS.maroon,
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "2.5px",
              mb: 1,
            }}
          >
            ZINORA / MY ACCOUNT
          </Typography>

          <Typography
            sx={{
              color: COLORS.darkMaroon,
              fontFamily: "Georgia, serif",
              fontSize: { xs: "30px", md: "38px" },
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            My Account
          </Typography>

          <Typography
            sx={{
              color: COLORS.muted,
              fontSize: "14px",
              mt: 1,
            }}
          >
            Manage your profile, orders, wishlist and account preferences.
          </Typography>
        </Box>

        {/* MAIN TWO-COLUMN LAYOUT */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "260px minmax(0, 1fr)",
              lg: "285px minmax(0, 1fr)",
            },
            gap: { xs: 2.5, md: 3 },
            alignItems: "start",
            width: "100%",
          }}
        >
          {/* LEFT SIDEBAR */}
          <Paper
            elevation={0}
            sx={{
              ...panelStyle,
              overflow: "hidden",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* CUSTOMER HEADER */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${COLORS.darkMaroon}, ${COLORS.maroon})`,
                p: { xs: 2.5, md: 3 },
                color: COLORS.white,
                textAlign: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 76,
                  height: 76,
                  mx: "auto",
                  mb: 1.5,
                  backgroundColor: "#F4E5D6",
                  color: COLORS.maroon,
                  border: "3px solid rgba(255,255,255,0.75)",
                }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>

              <Typography
                sx={{
                  fontSize: "17px",
                  fontWeight: 700,
                  overflowWrap: "anywhere",
                }}
              >
                {profile.name || "Welcome to Zinora"}
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.8)",
                  mt: 0.5,
                  overflowWrap: "anywhere",
                }}
              >
                {profile.email || "Manage your customer account"}
              </Typography>

              <Chip
                icon={
                  <VerifiedUserOutlinedIcon
                    sx={{
                      color: "#F5D7AD !important",
                      fontSize: 15,
                    }}
                  />
                }
                label="Customer Account"
                size="small"
                sx={{
                  mt: 1.5,
                  color: "#FFF2E1",
                  backgroundColor: "rgba(255,255,255,0.12)",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              />
            </Box>

            {/* SIDEBAR NAVIGATION */}
            <Box
              sx={{
                p: { xs: 1.5, md: 2 },
                display: "flex",
                flexDirection: isMobile ? "row" : "column",
                gap: 1,
                overflowX: isMobile ? "auto" : "visible",
              }}
            >
              {menuItems.map((item) => {
                const selected = activeMenu === item.label;

                return (
                  <Button
                    key={item.label}
                    onClick={() => handleMenuClick(item)}
                    startIcon={item.icon}
                    endIcon={
                      !isMobile && item.label !== "Logout" ? (
                        <ArrowForwardIosIcon
                          sx={{ fontSize: "10px !important" }}
                        />
                      ) : null
                    }
                    sx={{
                      flexShrink: 0,
                      minWidth: isMobile ? "max-content" : 0,
                      width: isMobile ? "auto" : "100%",
                      justifyContent: "flex-start",
                      textTransform: "none",
                      whiteSpace: "nowrap",
                      fontSize: "13px",
                      fontWeight: selected ? 700 : 500,
                      px: 1.5,
                      py: 1.35,
                      borderRadius: "10px",
                      color:
                        item.label === "Logout"
                          ? "#B34444"
                          : selected
                            ? COLORS.maroon
                            : COLORS.muted,
                      backgroundColor: selected
                        ? COLORS.lightPink
                        : "transparent",
                      "&:hover": {
                        backgroundColor: COLORS.lightPink,
                        color: COLORS.maroon,
                      },
                      "& .MuiButton-startIcon": {
                        mr: 1.2,
                      },
                      "& .MuiButton-endIcon": {
                        ml: "auto",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            {!isMobile && (
              <>
                <Divider sx={{ borderColor: COLORS.border, mx: 2 }} />

                <Box sx={{ p: 2.5 }}>
                  <Typography
                    sx={{
                      fontFamily: "Georgia, serif",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: COLORS.maroon,
                    }}
                  >
                    A little sparkle,
                    <br />
                    just for you.
                  </Typography>

                  <Typography
                    sx={{
                      color: COLORS.muted,
                      fontSize: "12px",
                      lineHeight: 1.7,
                      mt: 1,
                    }}
                  >
                    Your jewellery journey, all in one place.
                  </Typography>
                </Box>
              </>
            )}
          </Paper>

          {/* RIGHT CONTENT */}
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2.5, md: 3 },
            }}
          >
            {/* PERSONAL INFORMATION */}
            <Paper
              elevation={0}
              sx={{
                ...panelStyle,
                width: "100%",
                minWidth: 0,
                p: { xs: 2, sm: 3, md: 4 },
                boxSizing: "border-box",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: COLORS.text,
                      fontWeight: 700,
                      fontSize: { xs: "19px", md: "22px" },
                      letterSpacing: "-0.3px",
                    }}
                  >
                    Personal Information
                  </Typography>

                  <Typography
                    sx={{
                      color: COLORS.muted,
                      fontSize: "13px",
                      mt: 0.75,
                    }}
                  >
                    Update and manage your personal details.
                  </Typography>
                </Box>

                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{
                      alignSelf: { xs: "flex-start", sm: "center" },
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "13px",
                      color: COLORS.maroon,
                      borderColor: COLORS.maroon,
                      borderRadius: "9px",
                      px: 2.2,
                      py: 1,
                      "&:hover": {
                        backgroundColor: "#FBF2F0",
                        borderColor: COLORS.darkMaroon,
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={<CloseOutlinedIcon />}
                      onClick={handleCancel}
                      sx={{
                        textTransform: "none",
                        color: COLORS.muted,
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<SaveOutlinedIcon />}
                      onClick={handleSave}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: "9px",
                        backgroundColor: COLORS.maroon,
                        "&:hover": {
                          backgroundColor: COLORS.darkMaroon,
                        },
                      }}
                    >
                      Save
                    </Button>
                  </Stack>
                )}
              </Stack>

              <Divider sx={{ borderColor: COLORS.border, mb: 3 }} />

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  {renderField(
                    "Full Name",
                    "name",
                    profile.name,
                    "Enter your full name"
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  {renderField(
                    "Email Address",
                    "email",
                    profile.email,
                    "Enter your email address"
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  {renderField(
                    "Phone Number",
                    "phone",
                    profile.phone,
                    "Enter your phone number"
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  {renderField(
                    "Address",
                    "address",
                    profile.address,
                    "Enter your delivery address"
                  )}
                </Grid>
              </Grid>

              {!isEditing && (
                <Typography
                  sx={{
                    mt: 2.5,
                    color: COLORS.muted,
                    fontSize: "11px",
                    lineHeight: 1.6,
                  }}
                >
                  Your details are currently stored in this browser. Connect
                  your customer profile API to sync them with your account
                  across devices.
                </Typography>
              )}
            </Paper>

            {/* ACCOUNT SHORTCUTS */}
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    color: COLORS.text,
                    fontWeight: 700,
                    fontSize: { xs: "19px", md: "22px" },
                  }}
                >
                  Your Account
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: "13px",
                    color: COLORS.muted,
                  }}
                >
                  Quick access to your shopping activities.
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {accountCards.map((card) => (
                  <Grid item xs={12} sm={6} key={card.title}>
                    <Paper
                      elevation={0}
                      onClick={() => {
                        if (card.path) {
                          navigate(card.path);
                        } else if (card.action) {
                          card.action();
                        }
                      }}
                      sx={{
                        ...panelStyle,
                        p: { xs: 2.5, md: 3.5 },
                        minHeight: { xs: 160, md: 190 },
                        width: "100%",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#D4B7AF",
                          boxShadow: "0 8px 28px rgba(69,16,29,0.08)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "13px",
                            backgroundColor: COLORS.lightPink,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: COLORS.maroon,
                          }}
                        >
                          {card.icon}
                        </Box>

                        <ArrowForwardIosIcon
                          sx={{
                            fontSize: 14,
                            color: COLORS.muted,
                          }}
                        />
                      </Stack>

                      <Box sx={{ mt: 3 }}>
                        <Typography
                          sx={{
                            fontSize: "18px",
                            fontWeight: 700,
                            color: COLORS.text,
                          }}
                        >
                          {card.title}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.75,
                            fontSize: "13px",
                            lineHeight: 1.7,
                            color: COLORS.muted,
                          }}
                        >
                          {card.description}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* SECURITY AND SUPPORT */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    ...panelStyle,
                    p: 2.5,
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        borderRadius: "12px",
                        backgroundColor: COLORS.lightPink,
                        color: COLORS.maroon,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LockOutlinedIcon />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: COLORS.text,
                          fontSize: "15px",
                        }}
                      >
                        Login & Security
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: "12px",
                          color: COLORS.muted,
                          lineHeight: 1.6,
                        }}
                      >
                        Password and account protection.
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    onClick={() =>
                      showToast(
                        "Password management needs to be connected to your authentication API.",
                        "info"
                      )
                    }
                    endIcon={<ArrowForwardIosIcon sx={{ fontSize: 12 }} />}
                    sx={{
                      mt: 2,
                      textTransform: "none",
                      color: COLORS.maroon,
                      fontWeight: 700,
                    }}
                  >
                    Manage Security
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    ...panelStyle,
                    p: 2.5,
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        borderRadius: "12px",
                        backgroundColor: COLORS.lightPink,
                        color: COLORS.maroon,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SupportAgentOutlinedIcon />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: COLORS.text,
                          fontSize: "15px",
                        }}
                      >
                        Help & Support
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: "12px",
                          color: COLORS.muted,
                          lineHeight: 1.6,
                        }}
                      >
                        Need help with an order or your account?
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    onClick={() => navigate("/contact")}
                    endIcon={<ArrowForwardIosIcon sx={{ fontSize: 12 }} />}
                    sx={{
                      mt: 2,
                      textTransform: "none",
                      color: COLORS.maroon,
                      fontWeight: 700,
                    }}
                  >
                    Contact Us
                  </Button>
                </Paper>
              </Grid>
            </Grid>

            {/* BOTTOM NOTE */}
            <Box
              sx={{
                px: 0.5,
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <VerifiedUserOutlinedIcon
                sx={{
                  mt: 0.2,
                  fontSize: 17,
                  color: COLORS.maroon,
                }}
              />

              <Typography
                sx={{
                  color: COLORS.muted,
                  fontSize: "12px",
                  lineHeight: 1.7,
                }}
              >
                Keep your account details updated for a smoother Zinora
                shopping experience.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* NOTIFICATIONS */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={closeToast}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={closeToast}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
