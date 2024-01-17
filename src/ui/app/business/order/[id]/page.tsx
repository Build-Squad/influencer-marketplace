"use client";

import OrderItemForm from "@/src/components/checkoutComponents/orderItemForm";
import { notification } from "@/src/components/shared/notification";
import { getService } from "@/src/services/httpServices";
import { Box, Button, FormLabel, Grid, Link, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import StatusChip from "@/src/components/shared/statusChip";
import dayjs from "dayjs";
import { DISPLAY_DATE_FORMAT, ORDER_STATUS } from "@/src/utils/consts";

export default function OrderDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderType | null>(null);
  const [influencer, setInfluencer] = useState<UserType | null>(null);

  const getOrderDetails = async () => {
    try {
      setLoading(true);
      const { isSuccess, data, message } = await getService(
        `/orders/order/${params.id}/`
      );
      if (isSuccess) {
        setOrder(data?.data);
        setInfluencer(data?.data?.order_item_order_id[0]?.package?.influencer);
      } else {
        notification(message ? message : "Something went wrong", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      getOrderDetails();
    }
  }, [params.id]);

  if (!order) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Order details not found</Typography>
      </Box>
    );
  }

  if (order && order?.status !== ORDER_STATUS.PENDING) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Only Pending orders can be edited</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid
        container
        spacing={2}
        sx={{
          px: 2,
        }}
      >
        <Grid item xs={0} md={1.5} lg={1.5} sm={0}></Grid>
        <Grid
          item
          xs={12}
          md={9}
          lg={9}
          sm={12}
          sx={{
            p: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={"bold"}
            sx={{
              my: 2,
            }}
          >
            Edit Order Details
          </Typography>
          {order && (
            <Box
              sx={{
                borderRadius: 4,
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 30px 0px rgba(0, 0, 0, 0.08)",
                width: "100%",
                p: 2,
                my: 2,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={3} lg={3} sm={12}>
                  <FormLabel>Influencer</FormLabel>
                  <Typography variant="body1">
                    <Link
                      component={NextLink}
                      href={`/influencer/profile/${influencer?.id}`}
                      target="_blank"
                      underline="hover"
                      sx={{
                        color: "#09F",
                      }}
                    >
                      {influencer?.twitter_account?.user_name}
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} lg={3} sm={12}>
                  <FormLabel>Total Amount</FormLabel>
                  <Typography variant="body1">
                    {order?.amount + " " + order?.currency?.symbol}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} lg={3} sm={12}>
                  <FormLabel>Status</FormLabel>
                  <Box>
                    <StatusChip status={order?.status ? order?.status : ""} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={3} lg={3} sm={12}>
                  <FormLabel>Order Date</FormLabel>
                  <Typography variant="body1">
                    {dayjs(order?.created_at).format(DISPLAY_DATE_FORMAT)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          {order?.order_item_order_id?.map((orderItem, index: number) => {
            return (
              <OrderItemForm
                key={index}
                orderItem={{
                  order_item: orderItem,
                  index: index,
                }}
                index={index}
                disableDelete={order?.order_item_order_id?.length === 1}
              />
            );
          })}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  p: 1,
                  mt: 1,
                  borderRadius: 8,
                  minWidth: 100,
                }}
                onClick={() => {
                  // onSave();
                }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={0} md={1.5} lg={1.5} sm={0}></Grid>
      </Grid>
    </LocalizationProvider>
  );
}
