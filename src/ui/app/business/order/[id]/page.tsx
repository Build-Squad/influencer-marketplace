"use client";

import OrderItemForm from "@/src/components/checkoutComponents/orderItemForm";
import { notification } from "@/src/components/shared/notification";
import { getService } from "@/src/services/httpServices";
import { Box, Button, Grid, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";

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
        setInfluencer(data?.data?.order_item_order_id[0]?.influencer_id);
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid
        container
        spacing={2}
        sx={{
          px: 2,
        }}
      >
        <Grid item xs={0} md={2} lg={2} sm={0}></Grid>
        <Grid
          item
          xs={12}
          md={8}
          lg={8}
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
        <Grid item xs={0} md={2} lg={2} sm={0}></Grid>
      </Grid>
    </LocalizationProvider>
  );
}
