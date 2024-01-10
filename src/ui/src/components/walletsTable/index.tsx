import { Box } from "@mui/material";
import React from "react";
import {
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
} from "@mui/material";

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
            {rows.map((row) => (
              <TableRow
                key={row.addr}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left" sx={styles.bodyCellStyle}>
                  {row.addr}
                </TableCell>
                <TableCell align="left" sx={styles.bodyCellStyle}>
                  {row.walletName}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
