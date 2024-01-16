"use client";

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import React from "react";

const styles = {
  headerCellStyle: {
    fontSize: "20px",
    paddingX: 0,
    paddingY: "10px",
  },
  bodyCellStyle: {
    fontSize: "16px",
    paddingX: "0",
    paddingY: "4px",
  },
  tableRowStyles: {
    "& td, & th": { border: 0 },
  },
};

const OrderSummaryTable = ({
  order,
  totalOrders = 0,
}: {
  order?: OrderType;
  totalOrders?: number;
}) => {
  const totalAmount = order?.order_item_order_id?.reduce(
    (acc: number, item: any) => {
      return acc + parseFloat(item.price);
    },
    0
  );
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={styles.tableRowStyles}>
            <TableCell align="left" sx={{ ...styles.headerCellStyle }}>
              Services
            </TableCell>
            <TableCell align="center" sx={{ ...styles.headerCellStyle }}>
              Quantity
            </TableCell>
            <TableCell align="right" sx={{ ...styles.headerCellStyle }}>
              Amount
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order?.order_item_order_id.map((item: any) => {
            return (
              <TableRow sx={styles.tableRowStyles}>
                <TableCell align="left" sx={{ ...styles.bodyCellStyle }}>
                  {item?.service_master?.name}
                </TableCell>
                <TableCell align="center" sx={{ ...styles.bodyCellStyle }}>
                  1
                </TableCell>
                <TableCell align="right" sx={{ ...styles.bodyCellStyle }}>
                  {item?.price} {order?.currency?.symbol}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableBody>
          <TableRow sx={styles.tableRowStyles}>
            <TableCell align="left" sx={{ ...styles.bodyCellStyle }}>
              <Typography variant="h6" fontWeight={"bold"}>
                Total
              </Typography>
            </TableCell>
            <TableCell align="center" sx={{ ...styles.bodyCellStyle }}>
              <Typography variant="h6" fontWeight={"bold"}>
                {totalOrders}
              </Typography>
            </TableCell>
            <TableCell align="right" sx={{ ...styles.bodyCellStyle }}>
              <Typography variant="h6" fontWeight={"bold"}>
                {totalAmount}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderSummaryTable;
