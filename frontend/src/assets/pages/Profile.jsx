
import React, { useState } from "react";
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

import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

const COLORS = {
  maroon: "#641526",
  darkMaroon: "#45101D",
  cream: "#FAF6F0",
  background: "#FCFAF7",
  border: "#EAE1D8",
  text: "#292321",
  muted: "#817773",
  white: "#FFFFFF",
};

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isEditing, setIsEditing] = useState(false);
  const [activeMenu, setActiveMenu] = useState("My Profile");

  // Connect these fields to the logged-in user's API/session.
  // No personal name or email is hardcoded.
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [savedProfile, setSavedProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setSavedProfile({ ...profile });
    setIsEditing(false);

    showToast(
      "Changes saved for this session. Connect your profile API to save permanently."
    );
  };

  const handleCancel = () => {
    setProfile({ ...savedProfile });
    setIsEditing(false);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);

    if (menu === "Logout") {
      showToast("Connect your existing logout function here.", "info");
      return;
    }

    if (menu !== "My Profile") {
      showToast(
        `${menu} needs to be connected to the relevant page.`,
        "info"
      );
    }
  };

  const menuItems = [
    {
      label: "My Profile",
      icon: <PersonIcon />,
    },
    {
      label: "My Orders",
      icon: <ShoppingBagOutlinedIcon />,
    },
    {
      label: "My Wishlist",
      icon: <FavoriteBorderOutlinedIcon />,
    },
    {
      label: "My Addresses",
      icon: <LocationOnOutlinedIcon />,
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
      {/* CENTERED PAGE CONTAINER */}
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
            Manage your personal details and account preferences.
          </Typography>
        </Box>

        {/* MAIN TWO-COLUMN STRUCTURE */}
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
            {/* PROFILE CARD HEADER */}
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
                {profile.name || "My Profile"}
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.8)",
                  mt: 0.5,
                  overflowWrap: "anywhere",
                }}
              >
                {profile.email || "Account details"}
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
                label="Zinora Member"
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

            {/* NAVIGATION */}
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
                    onClick={() => handleMenuClick(item.label)}
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
                      fontSize: "13px",
                      fontWeight: selected ? 700 : 500,
                      px: 1.5,
                      py: 1.35,
                      borderRadius: "10px",
                      color: selected
                        ? COLORS.maroon
                        : item.label === "Logout"
                          ? "#B34444"
                          : COLORS.muted,
                      backgroundColor: selected ? "#F7EDE9" : "transparent",
                      "&:hover": {
                        backgroundColor: "#F7EDE9",
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

          {/* RIGHT CONTENT COLUMN */}
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
                    Update your personal details below.
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
                      Save Changes
                    </Button>
                  </Stack>
                )}
              </Stack>

              <Divider sx={{ borderColor: COLORS.border, mb: 3 }} />

              {/* FORM FIELDS */}
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
                    "Enter your address"
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
                  Your profile information will appear here after it is
                  connected to your login account.
                </Typography>
              )}
            </Paper>

            {/* TWO EQUAL BOXES BELOW PERSONAL INFORMATION */}
            <Grid
              container
              spacing={2.5}
              sx={{
                width: "100%",
                m: 0,
                "& > .MuiGrid-item": {
                  display: "flex",
                },
              }}
            >
              {/* MY ORDERS */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    ...panelStyle,
                    p: { xs: 2.5, md: 3.5 },
                    minHeight: { xs: 160, md: 190 },
                    width: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#D4B7AF",
                      boxShadow: "0 8px 28px rgba(69,16,29,0.08)",
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
                        backgroundColor: "#F7EDE9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: COLORS.maroon,
                      }}
                    >
                      <ShoppingBagOutlinedIcon sx={{ fontSize: 26 }} />
                    </Box>

                    <ArrowForwardIosIcon
                      sx={{ fontSize: 14, color: COLORS.muted }}
                    />
                  </Stack>

                  <Box sx={{ mt: 3 }}>
                    <Typography
                      sx={{
                        fontSize: "19px",
                        fontWeight: 700,
                        color: COLORS.text,
                      }}
                    >
                      My Orders
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.75,
                        fontSize: "13px",
                        lineHeight: 1.7,
                        color: COLORS.muted,
                      }}
                    >
                      View your purchases and track your deliveries.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* MY WISHLIST */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    ...panelStyle,
                    p: { xs: 2.5, md: 3.5 },
                    minHeight: { xs: 160, md: 190 },
                    width: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#D4B7AF",
                      boxShadow: "0 8px 28px rgba(69,16,29,0.08)",
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
                        backgroundColor: "#F7EDE9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: COLORS.maroon,
                      }}
                    >
                      <FavoriteBorderOutlinedIcon sx={{ fontSize: 26 }} />
                    </Box>

                    <ArrowForwardIosIcon
                      sx={{ fontSize: 14, color: COLORS.muted }}
                    />
                  </Stack>

                  <Box sx={{ mt: 3 }}>
                    <Typography
                      sx={{
                        fontSize: "19px",
                        fontWeight: 700,
                        color: COLORS.text,
                      }}
                    >
                      My Wishlist
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.75,
                        fontSize: "13px",
                        lineHeight: 1.7,
                        color: COLORS.muted,
                      }}
                    >
                      Find your saved jewellery and favourite designs.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* BOTTOM NOTE */}
            <Box
              sx={{
                px: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <VerifiedUserOutlinedIcon
                sx={{ fontSize: 17, color: COLORS.maroon }}
              />

              <Typography
                sx={{
                  color: COLORS.muted,
                  fontSize: "12px",
                  lineHeight: 1.7,
                }}
              >
                Keep your account details updated for a smoother shopping
                experience.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* NOTIFICATION */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() =>
          setToast((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() =>
            setToast((previous) => ({
              ...previous,
              open: false,
            }))
          }
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
