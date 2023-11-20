import { Box, Typography } from "@mui/material";

export default function Home() {

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fefefe",
      }}
    >
      <Typography variant="h4" sx={{ color: "primary.main" }}>
        Influencer Marketplace
      </Typography>
    </Box>
  );
}
