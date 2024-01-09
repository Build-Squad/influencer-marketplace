import { Box } from "@mui/material";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

type Props = {
  wallets: {
    addr: string;
    walletName: string;
  }[];
};

function createData(addr: string, walletName: string) {
  return { addr, walletName };
}

const rows = [
  createData("0x4...423", "Phantom"),
  createData("0x4...423", "Phantom"),
  createData("0x4...423", "Phantom"),
  createData("0x4...423", "Phantom"),
  createData("0x4...423", "Phantom"),
];

export default function WalletsTable({ wallets }: Props) {
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell align="right">Wallet Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.addr}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.addr}
                </TableCell>
                <TableCell align="right">{row.walletName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
