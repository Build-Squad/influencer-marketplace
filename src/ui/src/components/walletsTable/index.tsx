"use client";
import { Box, Typography } from "@mui/material";
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

type Props = {
  wallets: {
    addr: string;
    walletName: string;
  }[];
};

const styles = {
  headerCellStyle: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  bodyCellStyle: {
    paddingX: "10px",
  },
};

function createData(addr: string, walletName: string) {
  return { addr, walletName };
}

const rows = [
  createData("CugBzHRdQiDahHp6n89rxs9SRoQdH9BNZYKj9YTjFQbp", "Phantom"),
  createData("CugBzHRdQiDahHp6n89rxs9SRoQdH9BNZYKj9YTjFQbp", "Phantom"),
  createData("CugBzHRdQiDahHp6n89rxs9SRoQdH9BNZYKj9YTjFQbp", "Phantom"),
  createData("CugBzHRdQiDahHp6n89rxs9SRoQdH9BNZYKj9YTjFQbp", "Phantom"),
  createData("CugBzHRdQiDahHp6n89rxs9SRoQdH9BNZYKj9YTjFQbp", "Phantom"),
];

export default function WalletsTable({ wallets }: Props) {
  const [userWallets, setUserWallets] = useState([]);
  const getUserWallets = async () => {
    const { isSuccess, data, message } = await getService("/account/wallets/");
    if (isSuccess) {
      setUserWallets(data?.data ?? []);
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
            {userWallets.length ? (
              rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" sx={styles.bodyCellStyle}>
                    {row.addr}
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
