"use client";

import { ORDER_STATUS } from "@/src/utils/consts";
import { Close } from "@mui/icons-material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Link,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import OrderSummaryDetails from "../orderSummaryDetails";

type OrderDetailsProps = {
  order: OrderType | null;
  onClose: () => void;
};

export default function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const router = useRouter();
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
          {order?.status === ORDER_STATUS.PENDING && (
            <Tooltip
              title="Go To Order"
              placement="top"
              arrow
              disableInteractive
            >
              <Link
                href={`/business/order/${order?.id}`}
                component={NextLink}
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                <IconButton>
                  <OpenInNewIcon color="secondary" />
                </IconButton>
              </Link>
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
