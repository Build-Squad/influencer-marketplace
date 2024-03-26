"use client";
import Image from "next/image";
import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import XfluencerLogo from "@/public/XfluencerLogo_Icon.png";
import LoginOptions from "./components/loginOptions";
import LoginAccordion from "./components/loginAccordion";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import WalletConnectModal from "@/src/components/web3Components/walletConnectModal";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/src/hooks/useRedux";
import EmailLoginModal from "@/src/components/emailLoginModal";

const Login: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role");

  const [loginAs, setLoginAs] = useState(role ?? "Business");
  const [walletOpen, setWalletOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const user = useAppSelector((state) => state.user);

  const {
    startTwitterAuthentication,
    checkTwitterUserAuthentication,
    isTwitterUserLoggedIn,
  } = useTwitterAuth();

  useEffect(() => {
    if (isTwitterUserLoggedIn) {
      const redirectRoute =
        user?.user?.role?.name == "business_owner"
          ? "/business/explore"
          : "/influencer";
      router.push(redirectRoute);
    }
  }, [isTwitterUserLoggedIn]);

  useEffect(() => {
    if (!emailOpen) {
      checkTwitterUserAuthentication();
    }
  }, [emailOpen]);

  useEffect(() => {
    if (!walletOpen) {
      checkTwitterUserAuthentication();
    }
  }, [walletOpen]);

  const handleLoginAsToggle = () => {
    setLoginAs((prevLoginAs) =>
      prevLoginAs === "Business" ? "Influencer" : "Business"
    );
  };

  const handleConnectWallet = () => {
    setWalletOpen(true);
  };
  const handleConnectEmail = () => {
    setEmailOpen(true);
  };
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
        <Box sx={{ textAlign: "center", mb: 3 }}>
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
          subtitle={
            loginAs == "Influencer" ? "Sign in with your X" : "Sign in with your email or socials"
          }
          defaultExpanded={loginAs === "Influencer"}
        >
          <Grid container spacing={2}>
            <Grid item>
              <LoginOptions label="Connect with X" onClick={handleConnectX} />
            </Grid>
            {loginAs === "Business" ? (
              <Grid item>
                <LoginOptions
                  label="Connect with Email"
                  onClick={handleConnectEmail}
                />
              </Grid>
            ) : null}
          </Grid>
        </LoginAccordion>
      </Box>

      {/* Wallet Model */}
      <WalletConnectModal open={walletOpen} setOpen={setWalletOpen} />

      {/* Email Modal */}
      <EmailLoginModal open={emailOpen} setOpen={setEmailOpen} />
    </Box>
  );
};

export default Login;
