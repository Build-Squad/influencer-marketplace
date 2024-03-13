"use client";

import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import Phantom_Logo from "@/public/svg/Phantom_Logo.svg";
import Solflare_Logo from "@/public/svg/Solflare_Logo.svg";
import { useAppDispatch } from "@/src/hooks/useRedux";
import { loginReducer } from "@/src/reducers/userSlice";
import { postService } from "@/src/services/httpServices";
import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";
import CustomModal from "../../shared/customModal";
import { notification } from "../../shared/notification";
import NextLink from "next/link";
import OpenInNew from "@mui/icons-material/OpenInNew";

const SOLANA_ADDRESS_REGEX = "^[1-9A-HJ-NP-Za-km-z]{32,44}";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-material-ui")).WalletMultiButton,
  { ssr: false }
);
const SignMessageDynamic = dynamic(
  async () => (await import("../signMessage")).SignMessage,
  { ssr: false }
);

type WalletConnectModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  connect?: boolean;
  onlyAddress?: boolean;
};

const eampleWallets = [
  {
    name: "Phantom",
    link: "https://phantom.app/",
    image: Phantom_Logo,
  },
  {
    name: "Solflare",
    link: "https://solflare.com/",
    image: Solflare_Logo,
  },
];

export default function WalletConnectModal({
  open,
  setOpen,
  connect = false,
  onlyAddress = false,
}: WalletConnectModalProps) {
  const { publicKey, wallet, wallets } = useWallet();
  const dispatch = useAppDispatch();
  const [rawWalletAddress, setRawWalletAddress] = React.useState<string>("");

  const onSubmit = async (signature?: string, text?: string) => {
    const requestBody = {
      wallet_address_id: publicKey?.toBase58(),
      wallet_provider_id: wallet?.adapter?.name,
      wallet_network_id: "solana",
      signature: signature ? signature : undefined,
      message: text ? text : undefined,
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
        "error",
        5000
      );
    }
  };

  const onAddition = async () => {
    if (!rawWalletAddress.match(SOLANA_ADDRESS_REGEX)) {
      notification("Invalid Solana Wallet Address", "error", 5000);
      return;
    }
    const requestBody = {
      wallet_address_id: rawWalletAddress,
      // wallet_provider_id: null,
      wallet_network_id: "solana",
    };
    const { isSuccess, data, message } = await postService(
      "/account/connect-wallet/",
      requestBody
    );
    if (isSuccess) {
      notification(message);
      setOpen(false);
    } else {
      notification(
        message ? message : "Something went wrong, please try again later",
        "error",
        5000
      );
    }
  };

  // On close, reset the rawWalletAddress
  React.useEffect(() => {
    if (!open) {
      setRawWalletAddress("");
    }
  }, [open]);

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
            {wallets?.length > 0 ? (
              <WalletMultiButtonDynamic
                color="secondary"
                variant="outlined"
                sx={{
                  borderRadius: 8,
                  "& .MuiButton-root": {
                    borderRadius: 8,
                    color: "#ffffff",
                  },
                }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "grey",
                    textAlign: "center",
                  }}
                >
                  {
                    "Install a Solana Wallet to connect with the app and sign the message"
                  }
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  {eampleWallets.map((wallet, index) => (
                    <Link
                      href={wallet.link}
                      target="_blank"
                      rel="noreferrer"
                      key={index}
                      component={NextLink}
                      sx={{
                        textDecoration: "none",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{
                          m: 1,
                          borderRadius: 8,
                          "& .MuiButton-root": {
                            borderRadius: 8,
                            color: "#ffffff",
                          },
                        }}
                        startIcon={
                          <Image
                            src={wallet.image}
                            alt={wallet.name}
                            height={20}
                          />
                        }
                        endIcon={
                          <OpenInNew
                            sx={{
                              color: "grey",
                            }}
                          />
                        }
                        key={index}
                      >
                        {`Install ${wallet.name}`}
                      </Button>
                    </Link>
                  ))}
                </Box>
              </Box>
            )}
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
              mt: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "grey",
                textAlign: "center",
              }}
            >
              {
                "By signing the message, you agree to our Terms & Conditions and Privacy Policy"
              }
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
          <SignMessageDynamic onSignMessageSuccess={onSubmit} />
        </Grid>
        {onlyAddress && (
          <>
            <Divider
              sx={{
                mt: 2,
                mb: 2,
                width: "100%",
              }}
            >
              OR
            </Divider>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <TextField
                label="Solana Wallet Address"
                placeholder="Enter your Solana Wallet Address"
                variant="outlined"
                value={rawWalletAddress}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 8,
                  },
                  minWidth: "300px",
                }}
                size="small"
                fullWidth
                color="secondary"
                onChange={(e) => setRawWalletAddress(e.target.value)}
              />
              <Box
                sx={{
                  mt: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "grey",
                    textAlign: "center",
                  }}
                >
                  {`Add your Solana Wallet Address without connecting your wallet to the app.`}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  mt: 2,
                  borderRadius: 8,
                  "& .MuiButton-root": {
                    borderRadius: 8,
                    color: "#ffffff",
                  },
                }}
                disabled={!rawWalletAddress.match(SOLANA_ADDRESS_REGEX)}
                onClick={onAddition}
              >
                Add Wallet
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </CustomModal>
  );
}
