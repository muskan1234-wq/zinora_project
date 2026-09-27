import { Box, Typography } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#faf7f5",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          mb: 2,
        }}
      >
        Welcome to Zinora Project
      </Typography>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 500,
        }}
      >
        Our Team
      </Typography>
    </Box>
  );
}

export default App;