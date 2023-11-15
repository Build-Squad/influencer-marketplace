"use client";

import { Box, Typography, TextField, Button } from "@mui/material";
import { Send } from "@mui/icons-material";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const authTwitterUser = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/auth-twitter-user/`);
      window.location.href = res.data.auth_url;
    } catch (e) {
      window.alert(e);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "60%" }}>
        <Image src={"/twitter.jpeg"} fill={true} alt="bgimg" />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "grey",
          padding: "20px",
          zIndex: 1,
          width: "fit-content",
          height: "20%",
          mr: 2,
        }}
      >
        <Typography variant="h4" sx={{ color: "primary.main" }}>
          XFluencer Marketplace
        </Typography>
        <Box sx={{ display: "flex", columnGap: "12px" }}>
          <Button
            variant="contained"
            endIcon={<Send />}
            sx={{ mt: 2 }}
            onClick={authTwitterUser}
          >
            Connect twitter
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
