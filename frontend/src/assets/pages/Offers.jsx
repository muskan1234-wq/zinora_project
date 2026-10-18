
import React, { useEffect, useState } from "react";

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Django backend public offers API
const API_URL = "http://127.0.0.1:8000/api/offers/";

// Safely get the first available field from an offer.
// The aliases allow common backend naming conventions.
const getField = (offer, names, fallback = "") => {
  for (const name of names) {
    if (
      offer?.[name] !== undefined &&
      offer?.[name] !== null &&
      offer?.[name] !== ""
    ) {
      return offer[name];
    }
  }

  return fallback;
};

const getOfferTitle = (offer) =>
  getField(
    offer,
    ["title", "name", "offer_name", "offer_title", "coupon_name"],
    "Exclusive Zinora Offer"
  );

const getOfferDescription = (offer) =>
  getField(
    offer,
    ["description", "offer_description", "details"],
    "Enjoy exclusive offers on your favourite jewellery."
  );

const getOfferDiscount = (offer) => {
  const value = getField(
    offer,
    [
      "discount_percentage",
      "discount_percent",
      "discount",
      "discount_value",
    ],
    ""
  );

  if (value === "") return "";

  const type = String(
    getField(offer, ["discount_type", "type"], "")
  ).toLowerCase();

  if (type.includes("percentage") || type.includes("percent")) {
    return `${value}% OFF`;
  }

  if (String(value).includes("%")) {
    return `${value.toUpperCase()} OFF`;
  }

  // If the backend stores a number without a discount type,
  // display it as the value supplied by the backend.
  return typeof value === "number" ? `₹${value} OFF` : value;
};

const getCouponCode = (offer) =>
  getField(
    offer,
    ["coupon_code", "code", "offer_code", "promo_code"],
    ""
  );

const isOfferActive = (offer) => {
  const status = getField(
    offer,
    ["is_active", "isActive", "active", "status"],
    true
  );

  if (typeof status === "boolean") return status;

  if (typeof status === "number") return status === 1;

  const normalized = String(status).toLowerCase();

  return !["false", "0", "inactive", "disabled", "expired"].includes(
    normalized
  );
};

const getOfferImage = (offer) =>
  getField(
    offer,
    ["image_url", "image", "banner_image", "imageUrl"],
    ""
  );

function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load offers. Server returned ${response.status}.`
          );
        }

        const data = await response.json();

        // Support standard Django REST Framework response formats.
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
            ? data.results
            : Array.isArray(data.offers)
              ? data.offers
              : [];

        if (!cancelled) {
          setOffers(list.filter(isOfferActive));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Customer Offers API error:", err);
          setError(
            "Offers load nahi ho rahe hain. Backend server aur API endpoint check karein."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert(`Coupon code ${code} copied!`);
    } catch {
      window.prompt("Copy your coupon code:", code);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#faf8f4",
        minHeight: "100vh",
      }}
    >
      {/* HERO SECTION */}
      <Box
        sx={{
          bgcolor: "#f4efe7",
          py: { xs: 5, md: 8 },
          borderBottom: "1px solid #eee",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                icon={<LocalOfferIcon />}
                label="EXCLUSIVE ROYAL OFFERS"
                sx={{
                  bgcolor: "#f4d879",
                  color: "#6a111c",
                  fontWeight: 700,
                  mb: 2,
                }}
              />

              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  fontSize: { xs: 36, md: 58 },
                  lineHeight: 1.12,
                  fontWeight: 700,
                  color: "#65101b",
                }}
              >
                The Royal Treasure
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    color: "#a48225",
                  }}
                >
                  Exclusive Offers
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  maxWidth: 600,
                  color: "#666",
                  lineHeight: 1.8,
                }}
              >
                Discover exclusive jewellery offers crafted for every
                celebration. Explore our latest deals and enjoy special
                savings on your favourite styles.
              </Typography>

              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() =>
                  document
                    .getElementById("available-offers")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                sx={{
                  mt: 3,
                  bgcolor: "#650b17",
                  px: 3,
                  py: 1.4,
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "#4d0710",
                  },
                }}
              >
                EXPLORE OFFERS
              </Button>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                component="img"
src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=80"                alt="Zinora jewellery collection"
                sx={{
                  width: "100%",
                  height: { xs: 260, md: 390 },
                  objectFit: "cover",
                  borderRadius: 3,
                  boxShadow: "0 8px 30px rgba(0,0,0,.15)",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* OFFERS FROM BACKEND */}
      <Container
        id="available-offers"
        maxWidth="xl"
        sx={{ py: { xs: 4, md: 6 } }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: "#a48225",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 2,
            }}
          >
            SPECIAL DEALS FOR YOU
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: { xs: 28, md: 36 },
              fontWeight: 700,
              color: "#650b17",
              mt: 1,
            }}
          >
            Today's Best Offers
          </Typography>

          <Typography sx={{ color: "#777", mt: 1 }}>
            Explore our latest offers and available coupon codes.
          </Typography>
        </Box>

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <Stack alignItems="center" spacing={2}>
              <CircularProgress sx={{ color: "#650b17" }} />
              <Typography color="text.secondary">
                Loading exclusive offers...
              </Typography>
            </Stack>
          </Box>
        )}

        {!loading && error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && offers.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
              bgcolor: "#fff",
              border: "1px solid #eee",
              borderRadius: 3,
            }}
          >
            <LocalOfferIcon
              sx={{ fontSize: 48, color: "#a48225", mb: 1 }}
            />

            <Typography
              sx={{
                color: "#650b17",
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              No Active Offers Right Now
            </Typography>

            <Typography sx={{ color: "#777", mt: 1 }}>
              Please check back soon for exciting Zinora deals.
            </Typography>
          </Box>
        )}

        {!loading && !error && offers.length > 0 && (
          <Grid container spacing={3}>
            {offers.map((offer, index) => {
              const title = getOfferTitle(offer);
              const description = getOfferDescription(offer);
              const discount = getOfferDiscount(offer);
              const couponCode = getCouponCode(offer);
              const image = getOfferImage(offer);

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={offer.id ?? offer.pk ?? `${title}-${index}`}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid #eee",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                      transition: "transform .2s, box-shadow .2s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    {image ? (
                      <Box
                        component="img"
                        src={image}
                        alt={title}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                        sx={{
                          width: "100%",
                          height: 190,
                          objectFit: "cover",
                          bgcolor: "#f4efe7",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 120,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#f4efe7",
                        }}
                      >
                        <LocalOfferIcon
                          sx={{ fontSize: 50, color: "#a48225" }}
                        />
                      </Box>
                    )}

                    <CardContent
                      sx={{
                        p: 2.5,
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      {discount && (
                        <Chip
                          label={discount}
                          size="small"
                          sx={{
                            alignSelf: "flex-start",
                            bgcolor: "#650b17",
                            color: "#fff",
                            fontWeight: 700,
                            mb: 1.5,
                          }}
                        />
                      )}

                      <Typography
                        sx={{
                          color: "#650b17",
                          fontWeight: 700,
                          fontSize: 18,
                          mb: 1,
                        }}
                      >
                        {title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#777",
                          fontSize: 13,
                          lineHeight: 1.7,
                          flexGrow: 1,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {description}
                      </Typography>

                      {couponCode && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 1.5,
                            bgcolor: "#faf8f4",
                            border: "1px dashed #c5a059",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#777",
                              mb: 0.5,
                            }}
                          >
                            COUPON CODE
                          </Typography>

                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                          >
                            <Typography
                              sx={{
                                color: "#650b17",
                                fontWeight: 800,
                                overflowWrap: "anywhere",
                              }}
                            >
                              {couponCode}
                            </Typography>

                            <Button
                              size="small"
                              onClick={() => handleCopyCode(couponCode)}
                              startIcon={<ContentCopyIcon />}
                              sx={{
                                color: "#650b17",
                                textTransform: "none",
                                minWidth: "auto",
                              }}
                            >
                              Copy
                            </Button>
                          </Stack>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      <Divider />

     
    </Box>
  );
}

export default Offers;
