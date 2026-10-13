import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
import {
  ShoppingBagOutlined,
  PeopleAltOutlined,
  CurrencyRupee,
  Inventory2Outlined,
  TrendingUp,
  ArrowForward,
  WarningAmberOutlined,
} from "@mui/icons-material";

const maroon = "#650c20";
const gold = "#c6a15b";

const stats = [
  {
    title: "Total Revenue",
    value: "₹1,25,600",
    change: "+12.5%",
    icon: <CurrencyRupee />,
    color: "#e8d5a8",
  },
  {
    title: "Total Orders",
    value: "248",
    change: "+8.2%",
    icon: <ShoppingBagOutlined />,
    color: "#ead5da",
  },
  {
  title: "Total Customers",
  value: "186",
  change: "+15.3%",
  icon: <PeopleAltOutlined />,
  color: "#d8e8df",
},
  {
    title: "Total Products",
    value: "124",
    change: "In inventory",
    icon: <Inventory2Outlined />,
    color: "#dce4f5",
  },
];

const orders = [
  {
    id: "#ZIN1001",
    customer: "Priya Sharma",
    product: "Gold Plated Necklace",
    amount: "₹1,499",
    status: "Delivered",
  },
  {
    id: "#ZIN1002",
    customer: "Sneha Patil",
    product: "Pearl Earrings",
    amount: "₹599",
    status: "Processing",
  },
  {
    id: "#ZIN1003",
    customer: "Ananya Desai",
    product: "Traditional Bangles",
    amount: "₹999",
    status: "Pending",
  },
  {
    id: "#ZIN1004",
    customer: "Riya Khan",
    product: "Bridal Necklace Set",
    amount: "₹2,499",
    status: "Shipped",
  },
];

function DashboardHome() {
  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#faf8f5",
        minHeight: "100%",
      }}
    >
      {/* Welcome Section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: maroon,
              fontSize: { xs: "25px", md: "32px" },
            }}
          >
            Dashboard Overview
          </Typography>

          <Typography
            sx={{
              color: "#777",
              mt: 1,
              fontSize: "14px",
            }}
          >
            Welcome back, Admin! Here's what's happening with Zinora today.
          </Typography>
        </Box>

        <Chip
          label="ADMIN PANEL"
          sx={{
            backgroundColor: maroon,
            color: "#fff",
            fontWeight: 700,
            letterSpacing: 1,
            px: 1,
            py: 2,
            borderRadius: "8px",
          }}
        />
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: "16px",
                border: "1px solid #eee5df",
                backgroundColor: "#fff",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(101,12,32,0.08)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      color: "#777",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {stat.title}
                  </Typography>

                  <Avatar
                    sx={{
                      backgroundColor: stat.color,
                      color: maroon,
                      width: 46,
                      height: 46,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Stack>

                <Typography
                  variant="h4"
                  sx={{
                    color: maroon,
                    fontWeight: 800,
                    mt: 2,
                    fontSize: { xs: "25px", md: "30px" },
                  }}
                >
                  {stat.value}
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  sx={{ mt: 1 }}
                >
                  <TrendingUp
                    sx={{
                      fontSize: 17,
                      color: "#39865a",
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#39865a",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    {stat.change}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #eee5df",
          borderRadius: "16px",
          mb: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: maroon,
              }}
            >
              Recent Orders
            </Typography>

            <Typography
              sx={{
                color: "#888",
                fontSize: "13px",
                mt: 0.5,
              }}
            >
              Latest customer orders at Zinora
            </Typography>
          </Box>

          <Button
            endIcon={<ArrowForward />}
            sx={{
              color: maroon,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            View All
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ overflowX: "auto" }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#faf5f2" }}>
                {[
                  "Order ID",
                  "Customer",
                  "Product",
                  "Amount",
                  "Status",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      color: maroon,
                      fontWeight: 800,
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  hover
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: maroon,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {order.id}
                  </TableCell>

                  <TableCell>{order.customer}</TableCell>

                  <TableCell>{order.product}</TableCell>

                  <TableCell sx={{ fontWeight: 700 }}>
                    {order.amount}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={order.status}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        backgroundColor:
                          order.status === "Delivered"
                            ? "#e1f3e6"
                            : order.status === "Processing"
                            ? "#fff0d5"
                            : order.status === "Shipped"
                            ? "#e1eafa"
                            : "#fbe3e3",
                        color:
                          order.status === "Delivered"
                            ? "#247542"
                            : order.status === "Processing"
                            ? "#956300"
                            : order.status === "Shipped"
                            ? "#2458a6"
                            : "#b32626",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Low Stock Reminder */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #f0dfb8",
          borderRadius: "16px",
          backgroundColor: "#fffaf0",
        }}
      >
        <CardContent
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                backgroundColor: "#f8e8bf",
                color: "#956300",
                width: 48,
                height: 48,
              }}
            >
              <WarningAmberOutlined />
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: maroon,
                }}
              >
                Low Stock Reminder
              </Typography>

              <Typography
                sx={{
                  color: "#777",
                  fontSize: "13px",
                  mt: 0.5,
                }}
              >
                Check products that may need restocking.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            sx={{
              backgroundColor: maroon,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": {
                backgroundColor: "#450817",
              },
            }}
          >
            Check Inventory
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DashboardHome;