"use client";

import { useAppSelector } from "@/src/hooks/useRedux";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import React from "react";

export default function CheckoutTable() {
  const cart = useAppSelector((state) => state.cart);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell
            sx={{
              fontWeight: "bold",
            }}
          >
            Service
          </TableCell>
          <TableCell
            sx={{
              fontWeight: "bold",
            }}
          >
            Quantity
          </TableCell>
          <TableCell
            sx={{
              fontWeight: "bold",
            }}
          >
            Amount
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {cart?.servicesAdded?.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={12}
              sx={{
                textAlign: "center",
              }}
            >
              No service added
            </TableCell>
          </TableRow>
        )}
        {cart?.servicesAdded.map((orderItem) => (
          <TableRow key={orderItem?.item.id}>
            <TableCell>{orderItem?.item?.package?.name}</TableCell>
            <TableCell>{orderItem?.quantity} </TableCell>
            <TableCell>
              {Number(orderItem?.platform_price)?.toFixed(2)}{" "}
              {orderItem?.item?.currency?.symbol}
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          {/* Total */}
          <TableCell
            sx={{
              fontWeight: "bold",
            }}
          >
            Total
          </TableCell>
          <TableCell></TableCell>
          <TableCell>
            {cart?.orderTotal?.toFixed(2)} {cart?.orderTotalCurrency?.symbol}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
