import React from "react";
import { Box, Typography } from "@mui/material";

function Payments() {
  return (
    <Box
      sx={{
        p: 4,
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#650c20",
        }}
      >
        Welcome to Payments Page
      </Typography>
    </Box>
  );
}

export default Payments;