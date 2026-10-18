
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

const API_URL = "http://127.0.0.1:8000/api/accounts/admin/customers/";

const COLORS = {
  maroon: "#650c20",
  gold: "#c5a059",
  background: "#f7f5f2",
  text: "#333333",
  muted: "#777777",
  border: "#e7e0dc",
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch customers from Django backend
  const fetchCustomers = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("zinoraAdminToken");

      if (!token) {
        throw new Error(
          "Admin token nahi mila. Please admin login dobara karein."
        );
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Access denied. Admin login aur backend permissions check karein."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || data.detail || "Customers load nahi ho paaye."
        );
      }

      // Supports different backend response formats
      const customerList = Array.isArray(data)
        ? data
        : Array.isArray(data.customers)
        ? data.customers
        : Array.isArray(data.results)
        ? data.results
        : [];

      setCustomers(customerList);
    } catch (err) {
      setError(err.message || "Customers load karte waqt error aaya.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Activate or deactivate a customer in the database
  const toggleCustomerStatus = async (customer) => {
    const token = localStorage.getItem("zinoraAdminToken");

    if (!token) {
      setError("Admin token nahi mila. Please dobara login karein.");
      return;
    }

    const customerId = customer.id ?? customer.customer_id;

    if (customerId === undefined || customerId === null) {
      setError("Customer ID nahi mila. Backend response check karein.");
      return;
    }

    const currentStatus =
      customer.is_active !== undefined
        ? Boolean(customer.is_active)
        : String(customer.status).toLowerCase() === "active";

    const nextStatus = !currentStatus;

    setUpdatingId(customerId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}${customerId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          is_active: nextStatus,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.detail ||
            "Customer status update nahi hua. Backend PATCH API check karein."
        );
      }

      // Update UI immediately after a successful response
      setCustomers((previousCustomers) =>
        previousCustomers.map((item) => {
          const itemId = item.id ?? item.customer_id;

          if (String(itemId) !== String(customerId)) {
            return item;
          }

          return {
            ...item,
            is_active: data.is_active ?? nextStatus,
            status:
              (data.is_active ?? nextStatus) ? "Active" : "Inactive",
          };
        })
      );

      setSuccess(
        `Customer successfully ${
          nextStatus ? "activated" : "deactivated"
        }.`
      );
    } catch (err) {
      setError(err.message || "Status update karte waqt error aaya.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Search customers
  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      const fullName =
        customer.name ||
        [customer.first_name, customer.last_name].filter(Boolean).join(" ");

      const searchableValues = [
        fullName,
        customer.username,
        customer.email,
        customer.phone,
        customer.address,
        customer.customer_id,
        customer.id,
        customer.status,
      ];

      return searchableValues.some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  const activeCount = customers.filter((customer) => {
    if (customer.is_active !== undefined) {
      return Boolean(customer.is_active);
    }

    return String(customer.status).toLowerCase() === "active";
  }).length;

  const inactiveCount = customers.length - activeCount;

  const getCustomerName = (customer) => {
    const fullName =
      customer.name ||
      [customer.first_name, customer.last_name].filter(Boolean).join(" ");

    return fullName || customer.username || "—";
  };

  const getCustomerStatus = (customer) => {
    if (customer.is_active !== undefined) {
      return Boolean(customer.is_active);
    }

    return String(customer.status).toLowerCase() === "active";
  };

  const getJoinedDate = (customer) => {
    const dateValue =
      customer.joined ||
      customer.date_joined ||
      customer.created_at;

    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        backgroundColor: COLORS.background,
        p: { xs: 2, md: 3 },
      }}
    >
      {/* Page heading */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: COLORS.maroon,
              fontSize: { xs: "1.65rem", md: "2rem" },
            }}
          >
            Customers
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: COLORS.muted, mt: 0.7 }}
          >
            View customer details and manage customer account status.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            refreshing ? (
              <CircularProgress size={17} color="inherit" />
            ) : (
              <RefreshIcon />
            )
          }
          onClick={() => fetchCustomers(false)}
          disabled={loading || refreshing}
          sx={{
            backgroundColor: COLORS.maroon,
            borderRadius: 2,
            px: 2.5,
            py: 1.1,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#4b0818",
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Notifications */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {success}
        </Alert>
      )}

      {/* Summary cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Card
          elevation={0}
          sx={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 3,
            backgroundColor: "#fff",
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                backgroundColor: "#f4e6e9",
                color: COLORS.maroon,
              }}
            >
              <GroupIcon />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Customers
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                {customers.length}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 3,
            backgroundColor: "#fff",
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                backgroundColor: "#e7f5ec",
                color: "#21834a",
              }}
            >
              <CheckCircleIcon />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Active Customers
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                {activeCount}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 3,
            backgroundColor: "#fff",
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                backgroundColor: "#f0ecec",
                color: "#777",
              }}
            >
              <BlockIcon />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Inactive Customers
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                {inactiveCount}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Customer table */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={800} color={COLORS.maroon}>
              Customer List
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {filteredCustomers.length} customer
              {filteredCustomers.length === 1 ? "" : "s"} found
            </Typography>
          </Box>

          <TextField
            size="small"
            placeholder="Search customers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{
              width: { xs: "100%", sm: 300 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#fff",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: COLORS.muted }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider sx={{ borderColor: COLORS.border }} />

        {loading ? (
          <Box
            sx={{
              minHeight: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <CircularProgress sx={{ color: COLORS.maroon }} />
            <Typography color="text.secondary">
              Loading customers...
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 1050 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#faf7f5" }}>
                  {[
                    "Customer",
                    "Username",
                    "Email",
                    "Phone",
                    "Joined Date",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        fontWeight: 800,
                        color: COLORS.maroon,
                        whiteSpace: "nowrap",
                        py: 2,
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box
                        sx={{
                          py: 6,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <PersonIcon
                          sx={{ fontSize: 42, color: "#b5aaa5" }}
                        />
                        <Typography fontWeight={700}>
                          No customers found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try another search or refresh the customer list.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer, index) => {
                    const isActive = getCustomerStatus(customer);
                    const customerId =
                      customer.id ?? customer.customer_id ?? index;

                    return (
                      <TableRow
                        key={customerId}
                        hover
                        sx={{
                          "&:last-child td": { borderBottom: 0 },
                        }}
                      >
                        <TableCell sx={{ minWidth: 180 }}>
                          <Stack
                            direction="row"
                            spacing={1.2}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                width: 38,
                                height: 38,
                                borderRadius: "50%",
                                display: "grid",
                                placeItems: "center",
                                flexShrink: 0,
                                backgroundColor: "#f4e6e9",
                                color: COLORS.maroon,
                                fontWeight: 800,
                              }}
                            >
                              {getCustomerName(customer)
                                .charAt(0)
                                .toUpperCase()}
                            </Box>

                            <Box>
                              <Typography fontWeight={700} fontSize={14}>
                                {getCustomerName(customer)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                ID: {customer.id ?? customer.customer_id ?? "—"}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>{customer.username || "—"}</TableCell>
                        <TableCell>{customer.email || "—"}</TableCell>
                        <TableCell>{customer.phone || "—"}</TableCell>
                        <TableCell>{getJoinedDate(customer)}</TableCell>

                        <TableCell>
                          <Chip
                            label={isActive ? "Active" : "Inactive"}
                            size="small"
                            color={isActive ? "success" : "default"}
                            variant="outlined"
                            sx={{ fontWeight: 700, minWidth: 75 }}
                          />
                        </TableCell>

                        <TableCell>
                          <Tooltip
                            title={
                              isActive
                                ? "Deactivate this customer"
                                : "Activate this customer"
                            }
                          >
                            <span>
                              <Button
                                size="small"
                                variant="contained"
                                color={isActive ? "error" : "success"}
                                disabled={updatingId !== null}
                                onClick={() => toggleCustomerStatus(customer)}
                                sx={{
                                  textTransform: "none",
                                  fontWeight: 700,
                                  minWidth: 105,
                                  borderRadius: 2,
                                  boxShadow: "none",
                                  "&:hover": {
                                    boxShadow: "none",
                                  },
                                }}
                              >
                                {updatingId === customerId ? (
                                  <CircularProgress
                                    size={17}
                                    color="inherit"
                                  />
                                ) : isActive ? (
                                  "Deactivate"
                                ) : (
                                  "Activate"
                                )}
                              </Button>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 2,
          color: COLORS.muted,
        }}
      >
        Customer status is managed through the Django backend. Passwords are
        never displayed in this table.
      </Typography>
    </Box>
  );
}
