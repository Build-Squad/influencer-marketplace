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
import TypeModal from "./components/typeModal";

// Two types of login would be SIGNIN and LOGIN

const Login: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role");

  const [loginAs, setLoginAs] = useState(role ?? "Business");
  const [loginType, setLoginType] = useState("");
  const [walletOpen, setWalletOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [isReferralCodeValid, setIsReferralCodeValid] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
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
      loginType,
      role: loginAs == "Business" ? "business_owner" : "influencer",
      referral_code: isReferralCodeValid ? referralCode : "",
    });
  };

  const checkReferralCode = async () => {
    try {
      const { isSuccess, data } = await getService(
        `reward/check-referral-validity/?referral_code=${referralCode}`
      );
      if (isSuccess) {
        notification("Referral Code is Valid");
        setIsReferralCodeValid(true);
      } else {
        notification("Invalid Referral Code", "error");
        setIsReferralCodeValid(false);
      }
      setIsUserTyping(false);
    } catch (error) {
      console.error("Error during Referral code checking:", error);
      setIsReferralCodeValid(false);
    }
  };

  const isSectionDisabled =
    loginType == "SIGNIN" && (isUserTyping || !isReferralCodeValid);

  return (
    <Box
      sx={{
        height: "75vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        filter: !!loginType ? "none" : "blur(6px)",
      }}
    >
      <Box sx={{ maxWidth: "700px", flex: "1", mx: 5 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Image
            src={XfluencerLogo}
            width={30}
            height={30}
            alt="bgimg"
            priority
          />
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
            {loginType == "SIGNIN"
              ? `Sign-in to XFluencer as a ${loginAs}`
              : `Log-in to XFluencer as a ${loginAs}`}
          </Typography>
          <Typography variant="caption" sx={{ lineHeight: "2px" }}>
            {loginAs == "Business"
              ? "Discover a world of opportunity on our marketplace, where you can connect with top influencers or creators on X. Browse through a variety of services, from tweets, retweets and many more."
              : "Monetize your X influence with our marketplace. Set your rates and showcase your services to businesses eager to connect with you. Link your X account to get started!"}
          </Typography>
        </Box>

        <Box
          sx={{
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
            display: loginType == "SIGNIN" ? "flex" : "none",
          }}
        >
          <Input
            type="text"
            color="secondary"
            sx={{
              ".MuiInputBase-root": {
                borderRadius: "24px",
              },
              width: "60%",
            }}
            placeholder="Enter Referral Code To Sign-In"
            size="small"
            fullWidth
            value={referralCode}
            onChange={(e) => {
              setReferralCode(e.target.value);
              setIsUserTyping(true);
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
        </Box>

        {loginAs === "Business" && (
          <LoginAccordion
            title="Connect with Wallets"
            subtitle="If you're a pro, connect your wallet"
            defaultExpanded
            isDisabled={isSectionDisabled}
          >
            <LoginOptions
              disabled={isSectionDisabled}
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
          isDisabled={isSectionDisabled}
        >
          <Grid container spacing={2} justifyContent={"flex-start"}>
            <Grid item>
              <LoginOptions
                disabled={isSectionDisabled}
                label="Connect with X"
                onClick={handleConnectX}
              />
            </Grid>

            {loginAs === "Business" ? (
              <Grid item>
                <LoginOptions
                  disabled={isSectionDisabled}
                  label="Connect with Email"
                  onClick={handleConnectEmail}
                />
              </Grid>
            ) : null}
          </Grid>
        </LoginAccordion>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          {loginType === "SIGNIN" ? (
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: "none",
                cursor: "pointer",
              }}
              onClick={() => setLoginType("LOGIN")}
            >
              Existing User?{" "}
              <span style={{ color: "#0089EA", fontWeight: "bold" }}>
                Login-in
              </span>
            </Typography>
          ) : (
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: "none",
                cursor: "pointer",
              }}
              onClick={() => setLoginType("SIGNIN")}
            >
              New User?{" "}
              <span style={{ color: "#0089EA", fontWeight: "bold" }}>
                Sign-in
              </span>
            </Typography>
          )}

          <Typography
            variant="subtitle2"
            sx={{
              color: "#0089EA",
              textTransform: "none",
              cursor: "pointer",
            }}
            onClick={handleLoginAsToggle}
          >
            {loginType == "SIGNIN" ? "Sign-In as" : "Login as"}{" "}
            {loginAs === "Business" ? "Influencer" : "Business"}?
          </Typography>
        </Box>
      </Box>

      {/* Wallet Model */}
      <WalletConnectModal
        open={walletOpen}
        setOpen={setWalletOpen}
        referralCode={referralCode}
        loginType={loginType}
      />

      {/* Email Modal */}
      <EmailLoginModal
        open={emailOpen}
        setOpen={setEmailOpen}
        referralCode={referralCode}
        loginType={loginType}
      />
      <TypeModal open={typeOpen} setOpen={setTypeOpen} setType={setLoginType} />
    </Box>
  );
};

export default Login;
