"use client";
import { Box, Chip, Typography } from "@mui/material";
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

type Props = {};

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

export default function WalletsTable({}: Props) {
  const [userWallets, setUserWallets] = useState<walletsType>();
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
    } else {
      notification(message ? message : "Something went wrong", "error");
    }
  };

  useEffect(() => {
    getUserWallets();
  }, []);

  return (
    <Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              border: "2px solid black",
              borderRadius: "12px",
            }}
          >
            <TableRow>
              <TableCell align="left" sx={styles.headerCellStyle}>
                Address
              </TableCell>
              <TableCell align="left" sx={styles.headerCellStyle}>
                Wallet Name
              </TableCell>
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
                        label="primary"
                        size="small"
                      />
                    ) : null}
                  </TableCell>
                  <TableCell align="left" sx={styles.bodyCellStyle}>
                    {row.walletName}
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
