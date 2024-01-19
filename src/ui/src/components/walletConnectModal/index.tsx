"use client";

import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import { useAppDispatch } from "@/src/hooks/useRedux";
import { loginReducer } from "@/src/reducers/userSlice";
import { postService } from "@/src/services/httpServices";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect } from "react";
import CustomModal from "../shared/customModal";
import { notification } from "../shared/notification";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-material-ui")).WalletMultiButton,
  { ssr: false }
);

type WalletConnectModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  connect?: boolean;
};

export default function WalletConnectModal({
  open,
  setOpen,
  connect = false,
}: WalletConnectModalProps) {
  const { publicKey, wallet } = useWallet();
  const dispatch = useAppDispatch();
  const [walletAddress, setWalletAddress] = React.useState<string>("");
  const [walletProvider, setWalletProvider] = React.useState<string>("");

  const onSubmit = async () => {
    const requestBody = {
      wallet_address_id: walletAddress,
      wallet_provider_id: walletProvider,
      wallet_network_id: "solana",
    };
    const { isSuccess, data, message } = await postService(
      connect ? "/account/connect-wallet/" : "/account/wallet-auth/",
      requestBody
    );
    if (isSuccess) {
      if (!connect) {
        dispatch(loginReducer(data?.data));
      }
      notification(message);
      setOpen(false);
    } else {
      notification(
        message ? message : "Something went wrong, please try again later",
        "error"
      );
    }
  };

  useEffect(() => {
    if (wallet && publicKey) {
      setWalletProvider(wallet.adapter.name);
      setWalletAddress(publicKey.toBase58());
    }
  }, [wallet, publicKey]);

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
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              my: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <WalletMultiButtonDynamic
              color="secondary"
              variant="contained"
              sx={{
                borderRadius: 8,
                "& .MuiButton-root": {
                  borderRadius: 8,
                  color: "#ffffff",
                },
              }}
            />
          </Box>
        </Grid>
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
              {connect
                ? "Connect your Wallet"
                : "By logging in, you agree to our Terms & Conditions and Privacy Policy"}
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