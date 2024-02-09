"use client";
import Image from "next/image";
import CustomModal from "@/src/components/shared/customModal";
import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import XfluencerLogo from "@/public/XfluencerLogo_Icon.png";
import LoginOptions from "./components/loginOptions";
import LoginAccordion from "./components/loginAccordion";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";

const Login: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [loginAs, setLoginAs] = useState("Business");

  const { startTwitterAuthentication } = useTwitterAuth();

  const handleLoginAsToggle = () => {
    setLoginAs((prevLoginAs) =>
      prevLoginAs === "Business" ? "Influencer" : "Business"
    );
  };

  const handleConnectWallet = () => {};
  const handleConnectEmail = () => {};
  const handleConnectX = () => {
    startTwitterAuthentication({
      role: loginAs == "Business" ? "business_owner" : "influencer",
    });
  };

  return (
    <Box
      sx={{
        height: "75vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ maxWidth: "700px", flex: "1" }}>
        <Box sx={{ textAlign: "center" }}>
          <Image
            src={XfluencerLogo}
            width={30}
            height={30}
            alt="bgimg"
            priority
          />
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
            Sign in to XFluencer as a {loginAs}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "#0089EA", textTransform: "none", cursor: "pointer" }}
            onClick={handleLoginAsToggle}
          >
            Login as {loginAs === "Business" ? "Influencer" : "Business"}?
          </Typography>
        </Box>

        {loginAs === "Business" && (
          <LoginAccordion
            title="Connect with Wallets"
            subtitle="If you're a pro, connect your wallet"
            defaultExpanded
          >
            <LoginOptions
              label="Connect with Wallet"
              onClick={handleConnectWallet}
            />
          </LoginAccordion>
        )}

        <LoginAccordion
          title="Connect with Socials"
          subtitle="Sign in with your email or socials"
          defaultExpanded={loginAs === "Influencer"}
        >
          <Grid container spacing={2}>
            <Grid item>
              <LoginOptions label="Connect with X" onClick={handleConnectX} />
            </Grid>
            <Grid item>
              <LoginOptions
                label="Connect with Email"
                onClick={handleConnectEmail}
              />
            </Grid>
          </Grid>
        </LoginAccordion>
      </Box>
      <CustomModal
        open={open}
        setOpen={setOpen}
        sx={{
          p: 0,
          border: "1px solid black",
        }}
        customCloseButton={true}
      >
        <Grid container>
          <Grid item xs={12} md={6} lg={6}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={"bold"}>
                Are you a Business Owner?
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  background:
                    "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                  color: "black",
                  border: "1px solid black",
                  borderRadius: "20px",
                  my: 4,
                }}
                fullWidth
                onClick={() => {
                  setLoginAs("Business");
                  setOpen(false);
                }}
              >
                Login as Business
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={"bold"}>
                Are you an Influencer?
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  background:
                    "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                  color: "black",
                  border: "1px solid black",
                  borderRadius: "20px",
                  my: 4,
                }}
                fullWidth
                onClick={() => {
                  setLoginAs("Influencer");
                  setOpen(false);
                }}
              >
                Login as Influencer
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CustomModal>
    </Box>
  );
};

export default Login;
