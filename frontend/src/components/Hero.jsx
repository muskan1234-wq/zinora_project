
import React from "react";
import { Box, Typography, Button } from "@mui/material";

function Hero() {
  return (
    <Box
      sx={{
        minHeight: "520px",
        backgroundColor: "#650d19",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: {
          xs: "40px 25px",
          md: "60px 70px",
        },
      }}
    >
      {/* LEFT SIDE */}
      <Box sx={{ maxWidth: "560px" }}>

        <Typography
          sx={{
            fontSize: "12px",
            letterSpacing: "2px",
            color: "#e8c98a",
            marginBottom: "18px",
          }}
        >
          HERITAGE KARGAR • FESTIVE 2025 RELEASE
        </Typography>

        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: {
              xs: "38px",
              md: "54px",
            },
            lineHeight: 1,
            fontWeight: 500,
          }}
        >
          Jewellery That Makes
        </Typography>

        <Typography
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: {
              xs: "38px",
              md: "54px",
            },
            lineHeight: 1.1,
            fontStyle: "italic",
            color: "#e7c27c",
            marginBottom: "20px",
          }}
        >
          Every Moment Shine
        </Typography>

        <Typography
          sx={{
            fontSize: "13px",
            lineHeight: 1.7,
            color: "#eadcdc",
            maxWidth: "500px",
            marginBottom: "25px",
          }}
        >
          Handcrafted Kundan, Temple & American Diamond
          imitation jewellery designed for grand weddings,
          intimate festivities, and effortless everyday regal charm.
        </Typography>

        {/* BUTTONS */}
        <Box sx={{ display: "flex", gap: "12px" }}>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#f0c45f",
              color: "#4d0a13",
              fontSize: "12px",
              fontWeight: 600,
              padding: "12px 22px",
              textTransform: "none",

              "&:hover": {
                backgroundColor: "#e4b64f",
              },
            }}
          >
            SHOP FESTIVE COLLECTION →
          </Button>

          <Button
            sx={{
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "10px 20px",
              fontSize: "12px",
              textTransform: "none",
            }}
          >
            EXPLORE UNDER ₹299
          </Button>

        </Box>

        {/* FEATURES */}
        <Box
          sx={{
            display: "flex",
            gap: "45px",
            marginTop: "35px",
          }}
        >
          <Box>
            <Typography sx={{ color: "#e6c47c", fontWeight: 600 }}>
              14 Karat
            </Typography>
            <Typography sx={{ fontSize: "10px" }}>
              Micro Gold Dip
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ color: "#e6c47c", fontWeight: 600 }}>
              Nickel-Free
            </Typography>
            <Typography sx={{ fontSize: "10px" }}>
              Anti-Allergic Brass
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ color: "#e6c47c", fontWeight: 600 }}>
              48 Hours
            </Typography>
            <Typography sx={{ fontSize: "10px" }}>
              Free Easy Exchange
            </Typography>
          </Box>
        </Box>

      </Box>

      {/* RIGHT SIDE IMAGE AREA */}
      <Box
        sx={{
          width: "42%",
          height: "420px",
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#4b0912",
          borderRadius: "4px",
        }}
      >
        <Typography
          sx={{
            color: "#d8b36b",
            fontFamily: "Georgia, serif",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          Your Jewellery Image
          <br />
          Goes Here
        </Typography>
      </Box>
    </Box>
  );
}

export default Hero;
