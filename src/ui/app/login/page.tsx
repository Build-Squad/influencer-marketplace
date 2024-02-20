"use client";
import Image from "next/image";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import XfluencerLogo from "@/public/XfluencerLogo_Icon.png";
import LoginOptions from "./components/loginOptions";
import LoginAccordion from "./components/loginAccordion";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import WalletConnectModal from "@/src/components/web3Components/walletConnectModal";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/src/hooks/useRedux";
import EmailLoginModal from "@/src/components/emailLoginModal";
import { getService } from "@/src/services/httpServices";
import { Send } from "@mui/icons-material";
import { notification } from "@/src/components/shared/notification";

const Login: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role");

  const [loginAs, setLoginAs] = useState(role ?? "Business");
  const [walletOpen, setWalletOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [isReferralCodeValid, setIsReferralCodeValid] = useState(false);
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
          ? "/business"
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
      referral_code: isReferralCodeValid ? referralCode : "",
    });
  };

  const checkReferralCode = async () => {
    try {
      const { isSuccess, data } = await getService(
        `account/user/check-referral-validity/?referral_code=${referralCode}`
      );
      if (isSuccess) {
        notification("Referral Code is Valid");
        setIsReferralCodeValid(true);
      } else {
        notification("Invalid Referral Code", "error");
        setIsReferralCodeValid(false);
      }
    } catch (error) {
      console.error("Error during referal code checking:", error);
      setIsReferralCodeValid(false);
    }
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
          <Typography variant="caption" sx={{ lineHeight: "2px" }}>
            {loginAs == "Business"
              ? "Discover a world of opportunity on our marketplace, where you can connect with top influencers on X to elevate your brand's presence. Browse through a variety of services, from tweets to retweets and more, all priced in Solana – the trusted cryptocurrency for secure transactions."
              : "Monetize your X influence with our marketplace. Set your rates in Solana and showcase your services to businesses eager to connect with you. Link your X account to get started!"}
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
            loginAs == "Influencer"
              ? "Sign in with your X"
              : "Sign in with your email or socials"
          }
          defaultExpanded={loginAs === "Influencer"}
        >
          <Grid
            container
            spacing={2}
            justifyContent={
              loginAs === "Influencer" ? "space-between" : "flex-start"
            }
          >
            <Grid item>
              <LoginOptions label="Connect with X" onClick={handleConnectX} />
            </Grid>
            {loginAs === "Influencer" ? (
              <Grid item xs={5} md={5} lg={5} sm={5} sx={{ float: "right" }}>
                <Input
                  type="text"
                  color="secondary"
                  sx={{
                    ".MuiInputBase-root": {
                      borderRadius: "24px",
                    },
                  }}
                  placeholder="Enter Referral Code"
                  size="small"
                  fullWidth
                  value={referralCode}
                  onChange={(e) => {
                    setReferralCode(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={checkReferralCode}
                      >
                        <Send />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Grid>
            ) : null}

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
        <Typography
          variant="subtitle2"
          sx={{
            color: "#0089EA",
            textTransform: "none",
            cursor: "pointer",
            mt: 3,
            textAlign: "end",
          }}
          onClick={handleLoginAsToggle}
        >
          Login as {loginAs === "Business" ? "Influencer" : "Business"}?
        </Typography>
      </Box>

      {/* Wallet Model */}
      <WalletConnectModal open={walletOpen} setOpen={setWalletOpen} />

      {/* Email Modal */}
      <EmailLoginModal open={emailOpen} setOpen={setEmailOpen} />
    </Box>
  );
};

export default Login;
