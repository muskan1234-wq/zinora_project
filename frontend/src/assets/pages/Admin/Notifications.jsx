
import React, { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RefreshIcon from "@mui/icons-material/Refresh";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const API_BASE = "http://127.0.0.1:8000/api/products";

const getAdminToken = () =>
  localStorage.getItem("zinoraAdminToken") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("token") ||
  "";

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getNotificationType = (item) => {
  const text = `${item.title || ""} ${item.message || ""}`.toLowerCase();

  if (
    text.includes("payment successful") ||
    text.includes("payment received") ||
    text.includes("payment completed")
  ) {
    return "PAYMENT";
  }

  if (
    text.includes("status updated") ||
    text.includes("order shipped") ||
    text.includes("delivered") ||
    text.includes("packed") ||
    text.includes("confirmed")
  ) {
    return "STATUS";
  }

  if (
    text.includes("new order") ||
    text.includes("order received")
  ) {
    return "ORDER";
  }

  return "GENERAL";
};

const getNotificationIcon = (item) => {
  const type = getNotificationType(item);

  if (type === "PAYMENT") return <PaymentIcon />;

  if (type === "STATUS") return <LocalShippingIcon />;

  return <ShoppingBagIcon />;
};

const getNotificationColor = (item) => {
  const type = getNotificationType(item);

  if (type === "PAYMENT") return "#287d51";

  if (type === "STATUS") return "#b7791f";

  if (type === "ORDER") return "#650c20";

  return "#65516a";
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [filter, setFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getHeaders = useCallback(() => {
    const token = getAdminToken();

    return {
      Authorization: `Token ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }, []);

  const parseResponse = async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.detail ||
          data.message ||
          `Request failed. HTTP ${response.status}`
      );
    }

    return data;
  };

  const fetchNotifications = useCallback(
    async (showLoader = true) => {
      const token = getAdminToken();

      if (!token) {
        setError(
          "Admin login token nahi mila. Admin Dashboard se dobara login karein."
        );
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      try {
        const response = await fetch(
          `${API_BASE}/admin/notifications/`,
          {
            method: "GET",
            headers: getHeaders(),
          }
        );

        const data = await parseResponse(response);

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.notifications)
          ? data.notifications
          : Array.isArray(data.results)
          ? data.results
          : [];

        setNotifications(list);
      } catch (err) {
        setError(
          err.message ||
            "Notifications load nahi hui. Django server aur API check karein."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getHeaders]
  );

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    if (!getAdminToken()) {
      setError("Admin login token nahi mila.");
      return;
    }

    setUpdatingId(notificationId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE}/admin/notifications/${notificationId}/`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ is_read: true }),
        }
      );

      await parseResponse(response);

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notificationId
            ? { ...item, is_read: true }
            : item
        )
      );

      setSuccess("Notification marked as read.");
    } catch (err) {
      setError(
        err.message ||
          "Notification update nahi hui. Backend detail route check karein."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((item) => !item.is_read);

    if (!unread.length) {
      setSuccess("All notifications are already read.");
      return;
    }

    setError("");
    setSuccess("");

    let failed = 0;

    for (const item of unread) {
      try {
        const response = await fetch(
          `${API_BASE}/admin/notifications/${item.id}/`,
          {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ is_read: true }),
          }
        );

        await parseResponse(response);
      } catch {
        failed += 1;
      }
    }

    await fetchNotifications(false);

    if (failed === 0) {
      setSuccess("All notifications marked as read.");
    } else {
      setError(
        `${failed} notification(s) could not be updated. Please try again.`
      );
    }
  };

  const openDeleteDialog = (notification) => {
    setSelectedNotification(notification);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (deleting) return;

    setDeleteDialogOpen(false);
    setSelectedNotification(null);
  };

  const deleteNotification = async () => {
    if (!selectedNotification) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE}/admin/notifications/${selectedNotification.id}/`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        await parseResponse(response);
      }

      setNotifications((previous) =>
        previous.filter(
          (item) => item.id !== selectedNotification.id
        )
      );

      setSuccess("Notification deleted successfully.");
      setDeleteDialogOpen(false);
      setSelectedNotification(null);
    } catch (err) {
      setError(
        err.message ||
          "Notification delete nahi hui. Backend DELETE API check karein."
      );
    } finally {
      setDeleting(false);
    }
  };

  const unreadCount = notifications.filter(
    (item) => !item.is_read
  ).length;

  const readCount = notifications.length - unreadCount;

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "UNREAD") return !item.is_read;

    if (filter === "READ") return item.is_read;

    return true;
  });

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: "#f8f6f4",
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          mb={3}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "#650c20",
                width: 50,
                height: 50,
              }}
            >
              <NotificationsActiveIcon />
            </Avatar>

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#650c20",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Notifications
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Manage orders, payments and store alerts.
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={
                refreshing ? (
                  <CircularProgress size={16} />
                ) : (
                  <RefreshIcon />
                )
              }
              onClick={() => fetchNotifications(false)}
              disabled={refreshing || loading}
              sx={{
                borderColor: "#650c20",
                color: "#650c20",
                textTransform: "none",
              }}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<DoneAllIcon />}
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || loading}
              sx={{
                bgcolor: "#650c20",
                "&:hover": { bgcolor: "#4c0918" },
                textTransform: "none",
              }}
            >
              Mark All Read
            </Button>
          </Stack>
        </Stack>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {/* Statistics */}
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
          {[
            {
              title: "Total Notifications",
              value: notifications.length,
              icon: <NotificationsActiveIcon />,
              color: "#650c20",
            },
            {
              title: "Unread Notifications",
              value: unreadCount,
              icon: (
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsActiveIcon />
                </Badge>
              ),
              color: "#b7791f",
            },
            {
              title: "Read Notifications",
              value: readCount,
              icon: <DoneAllIcon />,
              color: "#287d51",
            },
          ].map((item) => (
            <Card
              key={item.title}
              elevation={0}
              sx={{
                border: "1px solid #eee5e2",
                borderRadius: 3,
                bgcolor: "#fff",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        mt: 1,
                        color: item.color,
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      bgcolor: `${item.color}15`,
                      color: item.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            border: "1px solid #eee5e2",
            borderRadius: 3,
            mb: 2,
          }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {[
              { label: "All", value: "ALL" },
              { label: "Unread", value: "UNREAD" },
              { label: "Read", value: "READ" },
            ].map((item) => (
              <Button
                key={item.value}
                variant={
                  filter === item.value ? "contained" : "outlined"
                }
                onClick={() => setFilter(item.value)}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  ...(filter === item.value
                    ? {
                        bgcolor: "#650c20",
                        "&:hover": { bgcolor: "#4c0918" },
                      }
                    : {
                        borderColor: "#e1d4d1",
                        color: "#650c20",
                      }),
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Paper>

        {/* Notification list */}
        {loading ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #eee5e2",
            }}
          >
            <CircularProgress sx={{ color: "#650c20" }} />

            <Typography mt={2} color="text.secondary">
              Loading notifications...
            </Typography>
          </Paper>
        ) : filteredNotifications.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 7 },
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #eee5e2",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#f3e8eb",
                color: "#650c20",
                width: 70,
                height: 70,
                mx: "auto",
                mb: 2,
              }}
            >
              <InfoIcon sx={{ fontSize: 35 }} />
            </Avatar>

            <Typography variant="h6" fontWeight={800}>
              No notifications found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1, mb: 2 }}
            >
              New order and payment notifications will appear here
              when the backend creates them.
            </Typography>

            <Button
              onClick={() => fetchNotifications(false)}
              startIcon={<RefreshIcon />}
              sx={{ color: "#650c20" }}
            >
              Check Again
            </Button>
          </Paper>
        ) : (
          <Stack spacing={1.5}>
            {filteredNotifications.map((item) => {
              const color = getNotificationColor(item);

              return (
                <Card
                  key={item.id}
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: item.is_read ? "#eee5e2" : "#dfbd8c",
                    borderRadius: 3,
                    bgcolor: item.is_read ? "#fff" : "#fffaf2",
                    transition: "0.2s",
                    "&:hover": {
                      boxShadow:
                        "0 5px 20px rgba(80, 20, 35, 0.08)",
                    },
                  }}
                >
                  <CardContent
                    sx={{ p: { xs: 2, md: 2.5 } }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems={{
                        xs: "stretch",
                        sm: "flex-start",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: item.is_read ? "#eee9e7" : color,
                          color: item.is_read ? "#650c20" : "#fff",
                          width: 48,
                          height: 48,
                        }}
                      >
                        {getNotificationIcon(item)}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 800,
                              color: "#3d1720",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {item.title || "Store Notification"}
                          </Typography>

                          {!item.is_read && (
                            <Chip
                              label="NEW"
                              size="small"
                              sx={{
                                bgcolor: "#650c20",
                                color: "#fff",
                                fontWeight: 800,
                                height: 23,
                                fontSize: 10,
                              }}
                            />
                          )}

                          <Chip
                            size="small"
                            variant="outlined"
                            label={
                              getNotificationType(item) === "PAYMENT"
                                ? "Payment"
                                : getNotificationType(item) === "STATUS"
                                ? "Order Status"
                                : getNotificationType(item) === "ORDER"
                                ? "New Order"
                                : "General"
                            }
                            sx={{ borderColor: color, color }}
                          />
                        </Stack>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "#62565a",
                            mt: 1,
                            lineHeight: 1.7,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {item.message}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={0.7}
                          alignItems="center"
                          sx={{
                            mt: 1.5,
                            color: "text.secondary",
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 16 }} />

                          <Typography variant="caption">
                            {formatDate(item.created_at)}
                          </Typography>
                        </Stack>
                      </Box>

                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        {!item.is_read && (
                          <Tooltip title="Mark as read">
                            <span>
                              <IconButton
                                aria-label="Mark notification as read"
                                onClick={() => markAsRead(item.id)}
                                disabled={updatingId === item.id}
                                sx={{ color: "#650c20" }}
                              >
                                {updatingId === item.id ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <MarkEmailReadIcon />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}

                        <Tooltip title="Delete notification">
                          <IconButton
                            aria-label="Delete notification"
                            onClick={() => openDeleteDialog(item)}
                            disabled={deleting}
                            sx={{
                              color: "#b42318",
                              "&:hover": {
                                bgcolor: "#fdebea",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}

        <Divider sx={{ my: 3, borderColor: "#eadfdb" }} />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center" }}
        >
          Zinora Admin • Notifications refresh automatically every
          15 seconds
        </Typography>
      </Container>

      {/* Delete confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#650c20" }}>
          Delete Notification?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this notification? This
            action cannot be undone.
          </DialogContentText>

          {selectedNotification && (
            <Typography
              sx={{
                mt: 2,
                fontWeight: 700,
                overflowWrap: "anywhere",
              }}
            >
              {selectedNotification.title}
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={closeDeleteDialog}
            disabled={deleting}
            sx={{ color: "#650c20", textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            onClick={deleteNotification}
            disabled={deleting}
            variant="contained"
            startIcon={
              deleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
            sx={{
              bgcolor: "#b42318",
              "&:hover": { bgcolor: "#8f1c13" },
              textTransform: "none",
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
