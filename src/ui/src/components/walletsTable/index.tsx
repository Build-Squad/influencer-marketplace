"use client";
import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
} from "@mui/material";
import { getService } from "@/src/services/httpServices";
import { notification } from "../shared/notification";
import EmptyWalletIcon from "@/public/svg/No_wallets_connected.svg";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAppSelector } from "@/src/hooks/useRedux";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

type Props = {
  walletOpen: boolean;
};

type walletsType = {
  addr: string;
  walletName: string;
  isPrimary: boolean;
}[];

const styles = {
  headerCellStyle: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  bodyCellStyle: {
    paddingX: "10px",
  },
};

export default function WalletsTable({ walletOpen }: Props) {
  const user = useAppSelector((state) => state.user);
  const { logoutTwitterUser } = useTwitterAuth();
  const { publicKey, disconnect } = useWallet();
  const [userWallets, setUserWallets] = useState<walletsType>();
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [connectedWallet, setConnectedWallet] = useState<WalletType | null>(
    null
  );

  const getUserWallets = async () => {
    const { isSuccess, data, message } = await getService("/account/wallets/");
    if (isSuccess) {
      const allWallets = data?.data ?? [];

      const wallets = allWallets.map((wal: any) => {
        return {
          addr: wal.wallet_address_id,
          walletName: wal?.wallet_provider_id?.wallet_provider,
          isPrimary: wal?.is_primary,
        };
      });
      setUserWallets(wallets);
      setWallets(data?.data);
    } else {
      notification(message ? message : "Something went wrong", "error");
    }
  };

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

  useEffect(() => {
    if (publicKey) {
      console.log("publicKey", publicKey?.toBase58(), wallets);
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

  useEffect(() => {
    getUserWallets();
  }, [walletOpen]);

  return (
    <Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{
                ".MuiTableCell-head": {
                  border: "2px solid black",
                  borderRadius: "12px",
                },
              }}
            >
              <TableCell
                align="left"
                sx={{ ...styles.headerCellStyle, borderRight: "0 !important" }}
              >
                Address
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  ...styles.headerCellStyle,
                  borderLeft: "0 !important",
                  borderRight: "0 !important",
                }}
              >
                Wallet Name
              </TableCell>
              <TableCell
                sx={{
                  ...styles.headerCellStyle,
                  borderLeft: "0 !important",
                }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userWallets?.length ? (
              userWallets?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor: row.isPrimary
                      ? "rgba(162, 229, 235, 0.40)"
                      : "inherit",
                  }}
                >
                  <TableCell align="left" sx={styles.bodyCellStyle}>
                    {row.addr}
                    {row.isPrimary ? (
                      <Chip
                        sx={{ ml: 1, backgroundColor: "#9AE3E9" }}
                        label="Primary"
                        size="small"
                      />
                    ) : null}
                  </TableCell>
                  <TableCell align="left" sx={styles.bodyCellStyle}>
                    {row.walletName}
                  </TableCell>
                  <TableCell>
                    {connectedWallet?.wallet_address_id === row.addr && (
                      <Tooltip title="Disconnect Wallet">
                        <IconButton
                          onClick={() => {
                            disConnectWallet();
                          }}
                        >
                          <RemoveCircleOutlineIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>
                  <Box
                    sx={{
                      paddingY: "40px",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Image
                      src={EmptyWalletIcon}
                      alt="existing_user_account"
                      width="64"
                    />
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      No Wallets Connected
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
