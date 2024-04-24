import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
import XfluencerLogo from "@/public/svg/Xfluencer_Logo_Beta.svg";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
};

export default function TypeModal({ open, setOpen, setType }: Props) {
  return (
    <Modal open={open}>
      <Box
        sx={{
          border: "1px solid black",
          minHeight: "30vh",
          textAlign: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          maxWidth: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 4,
          p: 3,
        }}
      >
        <Image
          src={XfluencerLogo}
          width={175}
          height={30}
          alt="bgimg"
          priority
        />
        <Typography fontWeight={"bold"} sx={{ mt: 2 }}>
          Welcome to Our Community!
        </Typography>
        <Typography
          variant="caption"
          sx={{
            textAlign: "center",
            maxWidth: "80%",
            display: "block",
            mx: "auto",
          }}
        >
          We're thrilled you're here! Sign up or log in to unlock a world of
          possibilities. Join our vibrant community, explore exciting features,
          and make meaningful connections. Your journey with us starts now!
        </Typography>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={12} lg={6} xl={6}>
            <Button
              variant="outlined"
              sx={{
                background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                color: "black",
                border: "1px solid black",
                borderRadius: "20px",
              }}
              fullWidth
              onClick={() => {
                setType("LOGIN");
                setOpen(false);
              }}
            >
              Log in to existing account!
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} xl={6}>
            <Button
              variant="outlined"
              sx={{
                background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                color: "black",
                border: "1px solid black",
                borderRadius: "20px",
              }}
              fullWidth
              onClick={() => {
                setType("SIGNIN");
                setOpen(false);
              }}
            >
              Create a new account!
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
