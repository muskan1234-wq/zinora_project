
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";


const API_URL = "http://127.0.0.1:8000/api/payments/admin/";

const getStatusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "paid":
    case "successful":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "error";
    case "refunded":
      return "info";
    default:
      return "default";
  }
};

const formatAmount = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError("");

    try {
const token = localStorage.getItem("zinoraAdminToken") || 
              localStorage.getItem("adminToken") ||
              localStorage.getItem("zinoraToken") ||
              localStorage.getItem("token") || "";
      if (!token) {
        throw new Error("Admin login token nahi mila. Dobara admin login karein.");
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Login session invalid hai. Admin login dobara karein.");
        }

        if (response.status === 403) {
          throw new Error("Aapko payments dekhne ki permission nahi hai.");
        }

        if (response.status === 404) {
          throw new Error(
            "Payments API nahi mili. Django backend endpoint abhi banana hoga."
          );
        }

        throw new Error(`Payments load nahi hue. Server status: ${response.status}`);
      }

      const data = await response.json();

      // Django API list ya paginated response, dono support honge.
      const records = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : [];

      setPayments(records);
    } catch (err) {
      setError(
        err.message ||
          "Payments load nahi hue. Django backend aur API URL check karein."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        String(payment.payment_id || "").toLowerCase().includes(query) ||
        String(payment.order_number || payment.order || "")
          .toLowerCase()
          .includes(query) ||
        String(payment.customer_name || payment.customer || "")
          .toLowerCase()
          .includes(query) ||
        String(payment.transaction_id || "").toLowerCase().includes(query);

      const status = String(payment.status || "").toLowerCase();
      const method = String(payment.payment_method || "").toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      const matchesMethod =
        methodFilter === "All" ||
        method === methodFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const summary = useMemo(() => {
    const successful = payments.filter((p) =>
      ["paid", "successful"].includes(String(p.status || "").toLowerCase())
    );

    const pending = payments.filter(
      (p) => String(p.status || "").toLowerCase() === "pending"
    );

    const failed = payments.filter(
      (p) => String(p.status || "").toLowerCase() === "failed"
    );

    return {
      totalCount: payments.length,
      totalAmount: payments.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      ),
      successfulCount: successful.length,
      successfulAmount: successful.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      ),
      pendingCount: pending.length,
      failedCount: failed.length,
    };
  }, [payments]);

  const summaryCards = [
    {
      title: "Total Payments",
      value: summary.totalCount,
      amount: formatAmount(summary.totalAmount),
      icon: <PaymentsIcon />,
      color: "#650c20",
    },
    {
      title: "Successful Payments",
      value: summary.successfulCount,
      amount: formatAmount(summary.successfulAmount),
      icon: <CheckCircleIcon />,
      color: "#218653",
    },
    {
      title: "Pending Payments",
      value: summary.pendingCount,
      amount: "Awaiting confirmation",
      icon: <PendingActionsIcon />,
      color: "#d18a13",
    },
    {
      title: "Failed Payments",
      value: summary.failedCount,
      amount: "Requires attention",
      icon: <ErrorIcon />,
      color: "#c62828",
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: "#f7f5f2",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#650c20", mb: 0.5 }}
          >
            Payments
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Track customer payments and transaction records.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchPayments}
          disabled={loading}
          sx={{
            borderColor: "#650c20",
            color: "#650c20",
            textTransform: "none",
            "&:hover": {
              borderColor: "#650c20",
              backgroundColor: "#f1e6e8",
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchPayments}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Summary cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} lg={3} key={card.title}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid #eee3e5",
                borderRadius: 3,
                backgroundColor: "#fff",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      color: card.color,
                      backgroundColor: `${card.color}15`,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#292126", mb: 0.5 }}
                >
                  {card.value}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {card.amount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search and filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: "1px solid #eee3e5",
          borderRadius: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search payment, order, customer or transaction ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Payment Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {["All", "Paid", "Pending", "Failed", "Refunded"].map(
                (status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Payment Method"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              {[
                "All",
                "UPI",
                "Card",
                "Net Banking",
                "COD",
                "Wallet",
              ].map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Payments table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #eee3e5",
          borderRadius: 3,
          overflowX: "auto",
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #eee3e5" }}>
          <Typography variant="h6" sx={{ color: "#650c20", fontWeight: 700 }}>
            Payment Transactions
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {filteredPayments.length} payment record(s)
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress sx={{ color: "#650c20" }} />
          </Box>
        ) : (
          <Table sx={{ minWidth: 950 }}>
            <TableHead sx={{ backgroundColor: "#faf6f6" }}>
              <TableRow>
                {[
                  "Payment ID",
                  "Order ID",
                  "Customer",
                  "Amount",
                  "Method",
                  "Date",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      fontWeight: 700,
                      color: "#650c20",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow hover key={payment.id}>
                  <TableCell>
                    {payment.payment_id || `PAY-${payment.id}`}
                  </TableCell>

                  <TableCell>
                    {payment.order_number || payment.order || "—"}
                  </TableCell>

                  <TableCell>
                    {payment.customer_name || payment.customer || "—"}
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    {formatAmount(payment.amount)}
                  </TableCell>

                  <TableCell>
                    {payment.payment_method || "—"}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {payment.created_at
                      ? new Date(payment.created_at).toLocaleDateString(
                          "en-IN"
                        )
                      : "—"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={payment.status || "Pending"}
                      color={getStatusColor(payment.status)}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton
                      aria-label="View payment details"
                      onClick={() => setSelectedPayment(payment)}
                      sx={{ color: "#650c20" }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {filteredPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <PaymentsIcon
                      sx={{ fontSize: 42, color: "#b7a6aa", mb: 1 }}
                    />

                    <Typography fontWeight={600}>
                      No payment records found
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Payments will appear here when records are available
                      from the backend.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Payment details dialog */}
      <Dialog
        open={Boolean(selectedPayment)}
        onClose={() => setSelectedPayment(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: "#650c20", fontWeight: 700 }}>
          Payment Details
        </DialogTitle>

        <DialogContent dividers>
          {selectedPayment && (
            <Grid container spacing={2}>
              {[
                [
                  "Payment ID",
                  selectedPayment.payment_id || `PAY-${selectedPayment.id}`,
                ],
                [
                  "Order ID",
                  selectedPayment.order_number ||
                    selectedPayment.order ||
                    "—",
                ],
                [
                  "Customer",
                  selectedPayment.customer_name ||
                    selectedPayment.customer ||
                    "—",
                ],
                ["Amount", formatAmount(selectedPayment.amount)],
                ["Method", selectedPayment.payment_method || "—"],
                ["Transaction ID", selectedPayment.transaction_id || "—"],
                ["Status", selectedPayment.status || "Pending"],
                [
                  "Date",
                  selectedPayment.created_at
                    ? new Date(selectedPayment.created_at).toLocaleString(
                        "en-IN"
                      )
                    : "—",
                ],
                ["Refund ID", selectedPayment.refund_id || "—"],
              ].map(([label, value]) => (
                <Grid item xs={12} sm={6} key={label}>
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>

                  <Typography sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
                    {String(value)}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setSelectedPayment(null)}
            sx={{ color: "#650c20", textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments;
