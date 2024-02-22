import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import { useAppSelector } from "@/src/hooks/useRedux";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import { deleteService } from "@/src/services/httpServices";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { ConfirmDelete } from "../../shared/confirmDeleteModal";
import { notification } from "../../shared/notification";

type WalletsTableProps = {
  wallets: WalletType[];
  setOpenWalletConnectModal: (value: boolean) => void;
  getWallets: () => void;
};

export default function WalletsTable({
  wallets,
  setOpenWalletConnectModal,
  getWallets,
}: WalletsTableProps) {
  const user = useAppSelector((state) => state.user);
  const { logoutTwitterUser } = useTwitterAuth();
  const { publicKey, disconnect } = useWallet();
  const [connectedWallet, setConnectedWallet] =
    React.useState<WalletType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const disConnectWallet = async () => {
    try {
      if (connectedWallet?.wallet_address_id === user?.user?.username) {
        await logoutTwitterUser();
        return;
      }
      await disconnect();
      notification("Wallet has been disconnected");
    } catch (error) {
      notification("Error disconnecting wallet " + error, "error");
    }
  };

  const deleteWallet = async (id: string) => {
    try {
      setLoading(true);
      const { isSuccess, message } = await deleteService(
        `/account/wallets/${id}/`
      );
      if (isSuccess) {
        notification(message);
        getWallets();
      } else {
        notification(message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      let concatenatedPublicKey = publicKey?.toBase58();
      concatenatedPublicKey =
        concatenatedPublicKey.slice(0, 4) +
        "..." +
        concatenatedPublicKey.slice(-4);
      const connectedWallet = wallets.find(
        (wallet) => wallet.wallet_address_id === concatenatedPublicKey
      );
      if (connectedWallet) {
        setConnectedWallet(connectedWallet);
      } else {
        setConnectedWallet(null);
      }
    } else {
      setConnectedWallet(null);
    }
  }, [publicKey]);

  return (
    <Box
      sx={{
        borderRadius: "16px",
        boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
        backgroundColor: "#FFF",
        zIndex: "1",
        display: "flex",
        minWidth: "100%",
        flexDirection: "column",
        mt: 4,
        p: 2,
        maxWidth: "100%",
      }}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Image src={Star_Coloured} alt={"Coloured Start"} height={30} />
          <Typography variant="h5" sx={{ ml: 2, fontWeight: "bold" }}>
            Web3 Wallets
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body1">
            {/* Text about connecting wallets */}
            Connect your wallet to receive payments in crypto
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{
              borderRadius: 6,
            }}
            onClick={() => {
              setOpenWalletConnectModal(true);
            }}
          >
            Connect Wallet
          </Button>
        </Grid>
        <Grid item xs={12}>
          {wallets?.length === 0 ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "200px",
                }}
              >
                <Image
                  src={"/wallets.png"}
                  alt={"Wallet"}
                  height={100}
                  width={100}
                />
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  No Wallets Connected
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                        }}
                      >
                        Address
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                        }}
                      >
                        Wallet
                      </Typography>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wallets?.map((wallet) => (
                    <TableRow
                      key={wallet.id}
                      sx={{
                        backgroundColor: wallet.is_primary ? "#D1EFF2" : "",
                      }}
                    >
                      <TableCell>
                        <Typography>{wallet.wallet_address_id}</Typography>
                        {wallet.is_primary && (
                          <Chip
                            sx={{ backgroundColor: "#9AE3E9" }}
                            label="Primary"
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {wallet?.wallet_provider_id
                            ? `${
                                wallet?.wallet_provider_id?.wallet_provider
                                  ?.charAt(0)
                                  .toUpperCase() +
                                wallet?.wallet_provider_id?.wallet_provider?.slice(
                                  1
                                )
                              }`
                            : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <>
                          {!wallet.is_primary && (
                            <ConfirmDelete
                              title={wallet?.wallet_address_id}
                              onConfirm={() => {
                                deleteWallet(wallet.id);
                              }}
                              deleteElement={<DeleteOutline color="error" />}
                              loading={loading}
                            />
                          )}
                          {connectedWallet?.id === wallet.id &&
                            wallet.is_primary && (
                              <Tooltip title="Disconnect Wallet">
                                <IconButton
                                  onClick={() => {
                                    disConnectWallet();
                                  }}
                                >
                                  <LinkOffIcon color="error" />
                                </IconButton>
                              </Tooltip>
                            )}
                        </>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
