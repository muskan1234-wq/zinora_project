
import React from "react";
import { Box, Typography } from "@mui/material";

function Products() {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "#650c20" }}
      >
        Welcome to Products Page
      </Typography>
    </Box>
  );
}

export default Products;
