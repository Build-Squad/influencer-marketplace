"use client";

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import OrderSummaryTable from "../orderSummaryTable";
import OrderSummaryDetails from "../orderSummaryDetails";
import { Close, Edit } from "@mui/icons-material";

type OrderDetailsProps = {
  order: OrderType | null;
  onClose: () => void;
};

export default function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!order) return null;
  return (
    <Drawer
      anchor="right"
      open={!!order}
      onClose={() => onClose()}
      sx={{
        "& .MuiDrawer-paper": {
          width: isMobile ? "100%" : "40%",
          // maxWidth: "40%",
          padding: "24px 32px",
          height: "100%",
          maxHeight: "100%",
          overflowY: "auto",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={"bold"}>
          Order Summary
        </Typography>
        <Box
          sx={{
            display: "flex",
            columnGap: 2,
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          {order?.status === "pending" && (
            <Tooltip title="Edit Details" placement="top" arrow>
              <IconButton onClick={() => onClose()}>
                <Edit />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Close" placement="top" arrow>
            <IconButton onClick={() => onClose()}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <OrderSummaryDetails orderItem={order?.order_item_order_id} />
    </Drawer>
  );
}
