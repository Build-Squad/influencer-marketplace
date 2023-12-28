"use client";

import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import CustomModal from "../shared/customModal";
import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import PhantomIcon from "@/public/phantomIcon.svg";
import Image from "next/image";
import { postService } from "@/src/services/httpServices";
import { notification } from "../shared/notification";
import { useAppDispatch } from "@/src/hooks/useRedux";
import { loginReducer } from "@/src/reducers/userSlice";

type WalletConnectModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function WalletConnectModal({
  open,
  setOpen,
}: WalletConnectModalProps) {
  const dispatch = useAppDispatch();
  const [isPhantomInstalled, setIsPhantomInstalled] = React.useState(false);
  const [provider, setProvider] = React.useState<any>(null);
  const [walletAddress, setWalletAddress] = React.useState<string>("");

  const getProvider = () => {
    if ("phantom" in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) {
        setIsPhantomInstalled(true);
        setProvider(provider);
        return;
      }
    }

    setIsPhantomInstalled(false);
  };

  const connectWallet = async () => {
    if (provider) {
      try {
        const connected = await provider.connect();
        if (connected) {
          const publicKey = connected.publicKey.toString();
          setWalletAddress(publicKey);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      getProvider();
    }
  };

  const onSubmit = async () => {
    const requestBody = {
      wallet_address_id: walletAddress,
      wallet_provider_id: "phantom",
      wallet_network_id: "solana",
    };
    const { isSuccess, data, message } = await postService(
      "/account/wallet-auth/",
      requestBody
    );
    if (isSuccess) {
      dispatch(loginReducer(data?.data));
      notification(message);
      setOpen(false);
    } else {
      notification(
        message ? message : "Something went wrong, please try again later",
        "error"
      );
    }
  };

  const installPhantom = async () => {
    if (!provider) {
      window.open("https://phantom.app/", "_blank");
    }
  };

  useEffect(() => {
    getProvider();
  }, []);

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      sx={{
        p: 2,
        border: "1px solid black",
        minHeight: "30vh",
      }}
    >
      <Grid
        container
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Image src={Star_Coloured} alt={"Coloured Start"} height={30} />
            <Typography variant="h5" sx={{ ml: 2, fontWeight: "bold" }}>
              Connect Your Wallet
            </Typography>
          </Box>
        </Grid>
        {!walletAddress && (
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                my: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isPhantomInstalled ? (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={connectWallet}
                  startIcon={
                    <Image
                      src={PhantomIcon}
                      alt={"Coloured Start"}
                      height={30}
                      width={30}
                    />
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: 4,
                    px: 2,
                    py: 1,
                    border: "1px solig rgba(0,0,0,0.2)",
                  }}
                >
                  Phantom Wallet
                </Button>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={installPhantom}
                  >
                    Install Phantom Wallet
                  </Button>
                  <Typography
                    sx={{
                      mt: 4,
                    }}
                  >
                    Already installed?{" "}
                    <Button onClick={getProvider}>Recheck</Button>
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        )}
        {walletAddress && (
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                my: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Your Wallet Address:
              </Typography>
              <Typography variant="h6">{walletAddress}</Typography>
            </Box>
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              mt: 4,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "grey",
                textAlign: "center",
              }}
            >
              By logging in, you agree to our Terms & Conditions and Privacy
              Policy
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{ borderRadius: 8 }}
            onClick={onSubmit}
            disabled={!walletAddress}
          >
            Save & Continue
          </Button>
        </Grid>
      </Grid>
    </CustomModal>
  );
}
