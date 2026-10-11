import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material";

import {
  ShoppingBag,
  Favorite,
  LocalShipping,
  AccountCircle,
  Logout,
  ShoppingCart,
  ArrowForward,
  Diamond,
  AutoAwesome,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const MAROON = "#720d2b";
const GOLD = "#c9a66b";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("Customer");

  // Load customer username
  useEffect(() => {
    const savedUsername =
      localStorage.getItem("zinoraCustomerUsername") ||
      sessionStorage.getItem("zinoraCustomerUsername");

    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // Continue Shopping: Open Zinora Home Page
  const handleContinueShopping = () => {
    navigate("/");
  };

  // Customer logout
  const handleLogout = () => {
    localStorage.removeItem("zinoraCustomerToken");
    localStorage.removeItem("zinoraCustomerRole");
    localStorage.removeItem("zinoraCustomerUsername");

    sessionStorage.removeItem("zinoraCustomerToken");
    sessionStorage.removeItem("zinoraCustomerRole");
    sessionStorage.removeItem("zinoraCustomerUsername");

    navigate("/customer/login", { replace: true });
  };

  // Customer dashboard quick access cards
  const dashboardItems = [
    {
      title: "My Orders",
      description: "View your orders and check their status.",
      icon: <ShoppingBag sx={{ fontSize: 38 }} />,
      button: "View Orders",
      path: "/my-orders",
    },
    {
      title: "My Wishlist",
      description: "Explore your favourite saved jewellery.",
      icon: <Favorite sx={{ fontSize: 38 }} />,
      button: "View Wishlist",
      path: "/wishlist",
    },
    {
      title: "Shopping Cart",
      description: "Review your selected jewellery items.",
      icon: <ShoppingCart sx={{ fontSize: 38 }} />,
      button: "Open Cart",
      path: "/cart",
    },
    {
      title: "My Profile",
      description: "Manage your personal account details.",
      icon: <AccountCircle sx={{ fontSize: 38 }} />,
      button: "View Profile",
      path: "/profile",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#faf7f2",
      }}
    >
      {/* HEADER */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: MAROON,
          borderBottom: `3px solid ${GOLD}`,
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1400,
            width: "100%",
            mx: "auto",
            boxSizing: "border-box",
            py: 1,
            px: { xs: 2, md: 4 },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: GOLD,
                fontWeight: 800,
                letterSpacing: 3,
              }}
            >
              ZINORA
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "#fff",
                letterSpacing: 2,
              }}
            >
              YOUR JEWELLERY DESTINATION
            </Typography>
          </Box>

          <Button
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{
              color: "#fff",
              border: "1px solid #ffffff70",
              borderRadius: 2,
              px: 2,
              "&:hover": {
                background: "#ffffff15",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        {/* WELCOME BANNER */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            color: "#fff",
            background:
              "linear-gradient(120deg, #720d2b 0%, #4a1022 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: -35,
              top: -45,
              opacity: 0.1,
            }}
          >
            <Diamond sx={{ fontSize: 250, color: GOLD }} />
          </Box>

          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Avatar
              sx={{
                width: 76,
                height: 76,
                bgcolor: GOLD,
                color: MAROON,
                fontSize: 32,
                fontWeight: 800,
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "#f0d7b0",
                  letterSpacing: 2,
                }}
              >
                CUSTOMER ACCOUNT
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: 25, md: 34 },
                }}
              >
                Welcome, {username}!
              </Typography>

              <Typography sx={{ color: "#f6e8e0" }}>
                Every piece tells a story. Find something beautiful today.
              </Typography>
            </Box>

            {/* CONTINUE SHOPPING BUTTON */}
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleContinueShopping}
              sx={{
                bgcolor: GOLD,
                color: "#3c1720",
                px: 3,
                py: 1.3,
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 2,
                position: "relative",
                "&:hover": {
                  bgcolor: "#e2bd81",
                },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>

        {/* QUICK STATS */}
        <Grid container spacing={3} sx={{ mt: 2, mb: 5 }}>
          {[
            {
              title: "My Orders",
              subtitle: "Track your purchases",
              icon: <ShoppingBag />,
            },
            {
              title: "Wishlist",
              subtitle: "Your favourite designs",
              icon: <Favorite />,
            },
            {
              title: "Order Tracking",
              subtitle: "Stay updated on delivery",
              icon: <LocalShipping />,
            },
          ].map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={item.title}
            >
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #eee1d4",
                  bgcolor: "#fff",
                  height: "100%",
                }}
              >
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: "#f5e8e8",
                    color: MAROON,
                  }}
                >
                  {item.icon}
                </Avatar>

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: MAROON,
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.subtitle}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* QUICK ACCESS */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: MAROON,
              fontWeight: 800,
            }}
          >
            Your Account
          </Typography>

          <Typography sx={{ color: "#777", mt: 1 }}>
            Everything you need, all in one place.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {dashboardItems.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={item.title}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  bgcolor: "#fff",
                  border: "1px solid #eee1d4",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px #720d2b15",
                    borderColor: GOLD,
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 65,
                      height: 65,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: MAROON,
                      bgcolor: "#f8eeee",
                      mb: 3,
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      color: MAROON,
                      fontWeight: 800,
                      mb: 1,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#777",
                      lineHeight: 1.8,
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>

                <Divider sx={{ borderColor: "#f0e5da" }} />

                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    endIcon={<ArrowForward />}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: MAROON,
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "#f9eeee",
                      },
                    }}
                  >
                    {item.button}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* SPECIAL OFFER */}
        <Paper
          elevation={0}
          sx={{
            mt: 5,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            bgcolor: "#f0e2d1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <AutoAwesome sx={{ fontSize: 45, color: MAROON }} />

            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: MAROON,
                  fontWeight: 800,
                }}
              >
                A Little Sparkle Goes a Long Way
              </Typography>

              <Typography sx={{ color: "#735b4c", mt: 1 }}>
                Discover elegant designs for every special moment.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/offers")}
            sx={{
              bgcolor: MAROON,
              px: 3,
              py: 1.3,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#50071d",
              },
            }}
          >
            Explore Offers
          </Button>
        </Paper>

        {/* FOOTER */}
        <Box
          sx={{
            textAlign: "center",
            mt: 5,
            pb: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#88766b",
              letterSpacing: 0.5,
            }}
          >
            © {new Date().getFullYear()} ZINORA Jewellery
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: "#a08d80" }}
          >
            A special sparkle for every relationship.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}