"use client";

import CheckoutTable from "@/src/components/checkoutComponents/checkoutTable";
import OrderItemForm from "@/src/components/checkoutComponents/orderItemForm";
import { ConfirmCancel } from "@/src/components/shared/confirmCancel";
import { notification } from "@/src/components/shared/notification";
import RouteProtection from "@/src/components/shared/routeProtection";
import CreateEscrow from "@/src/components/web3Components/createEscrow";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { initializeCart, resetCart } from "@/src/reducers/cartSlice";
import {
  deleteService,
  postService,
  putService,
} from "@/src/services/httpServices";
import { ORDER_STATUS } from "@/src/utils/consts";
import { Box, Button, Grid, Link, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!user) {
    notification("You need to login first", "error");
    router.push("/");
    return null;
  }

  const deleteOrder = async () => {
    try {
      const influencerId = cart?.influencer?.id;
      if (!cart?.orderId) {
        dispatch(resetCart());
        router.push(`/influencer/profile/${influencerId}`);
        return;
      }
      setLoading(true);
      const { isSuccess, message } = await deleteService(
        `/orders/order/${cart?.orderId}/`
      );
      if (isSuccess) {
        notification("Order cancelled successfully!", "success");
        dispatch(resetCart());
        router.push(`/influencer/profile/${influencerId}`);
      } else {
        notification(message, "error", 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (address: string) => {
    if (user?.user?.wallets?.length === 0) {
      notification("You need to add a wallet first", "error", 3000);
      return;
    }

    const { isSuccess, data, message } = await putService(
      `orders/update-status/${cart?.orderId}/`,
      {
        status: ORDER_STATUS.PENDING,
        address: address,
      }
    );

    if (isSuccess) {
      notification("Payment successfully done!", "success");
      dispatch(resetCart());
      router.push(`/business/dashboard`);
    } else {
      notification(
        message
          ? message
          : "Something went wrong, couldn't update order status",
        "error"
      );
    }
  };

  const createOrder = async () => {
    const body = {
      order_items: cart?.orderItems?.map((orderItem) => {
        return {
          publish_date: orderItem?.publish_date,
          service_id: orderItem?.service_id,
          meta_data: orderItem?.order_item?.order_item_meta_data?.map(
            (metaData) => {
              return {
                service_master_meta_data_id:
                  metaData?.service_master_meta_data_id,
                value: metaData?.value,
              };
            }
          ),
        };
      }),
    };
    try {
      const { isSuccess, message, data } = await postService(
        "/orders/order/",
        body
      );
      if (isSuccess) {
        notification("Order Details saved successfully!", "success");
        const order = data?.data;
        dispatch(
          initializeCart({
            order_number: order.order_number,
            orderId: order.id,
            influencer: order?.order_item_order_id[0].package.influencer,
            orderItems: order.order_item_order_id,
            influencer_wallet: order?.influencer_wallet,
            buyer_wallet: order?.buyer_wallet,
          })
        );
      } else {
        notification(message, "error", 3000);
      }
    } finally {
    }
  };

  const updateOrder = async () => {
    const body = {
      order_items: cart?.orderItems?.map((orderItem) => {
        return {
          service_id: orderItem?.service_id,
          order_item_id: orderItem?.order_item?.id,
          publish_date: orderItem?.publish_date,
          meta_data: orderItem?.order_item?.order_item_meta_data?.map(
            (metaData) => {
              return {
                order_item_meta_data_id: metaData?.id,
                service_master_meta_data_id:
                  metaData?.service_master_meta_data_id,
                value: metaData?.value,
              };
            }
          ),
        };
      }),
    };
    try {
      const { isSuccess, message, data } = await putService(
        `/orders/order/${cart?.orderId}/`,
        body
      );
      if (isSuccess) {
        notification("Order Details saved successfully!", "success");
        const order = data?.data;
        dispatch(
          initializeCart({
            order_number: order.order_number,
            orderId: order.id,
            influencer: order.order_item_order_id[0].package.influencer,
            orderItems: order.order_item_order_id,
            influencer_wallet: order?.influencer_wallet,
            buyer_wallet: order?.buyer_wallet,
          })
        );
      } else {
        notification(message, "error", 3000);
      }
    } finally {
    }
  };

  const onSave = async () => {
    try {
      setLoading(true);
      if (!cart?.orderId) {
        createOrder();
      } else {
        updateOrder();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteProtection logged_in={true} business_owner={true}>
      {cart?.orderItems?.length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontStyle: "italic",
            }}
          >
            Cart is Empty
          </Typography>
        </Box>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid
          container
          spacing={2}
          sx={{
            px: 2,
          }}
        >
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
            {cart?.orderItems?.map((orderItem, index: number) => {
              return (
                <OrderItemForm
                  key={index}
                  orderItem={orderItem}
                  index={index}
                  disableDelete={cart?.orderItems?.length === 1}
                  sx={{
                    m: 2,
                  }}
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
                    onSave();
                  }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} lg={4} sm={12}>
            <Box
              sx={{
                p: 2,
                borderRadius: 4,
                border: "1px solid #D3D3D3",
                m: 2,
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 30px 0px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                }}
              >
                Order Details
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Infleuncer : &nbsp;
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    lineHeight: "19px",
                  }}
                >
                  <Link
                    href={`/influencer/profile/${cart?.influencer?.id}`}
                    target="_blank"
                    component={NextLink}
                    sx={{
                      color: "#09F",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {cart?.influencer?.twitter_account?.user_name}
                  </Link>
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "auto",
                }}
              >
                <CheckoutTable />
              </Box>
              <Box
                sx={{
                  my: 2,
                }}
              >
                <Typography variant="body1">
                  {`Your payment will be held for 72 hours. If ${cart?.influencer?.twitter_account?.name}
                declines the order, the amount will be added back to your Wallet`}
                </Typography>
              </Box>
              <Box>
                <ConfirmCancel
                  title="this order"
                  onConfirm={() => {
                    deleteOrder();
                  }}
                  loading={loading}
                  hide
                  deleteElement={
                    <Button
                      color="secondary"
                      disableElevation
                      fullWidth
                      variant="outlined"
                      disabled={loading}
                      sx={{
                        borderRadius: "20px",
                      }}
                    >
                      Cancel Order
                    </Button>
                  }
                />
                <CreateEscrow loading={loading} updateStatus={updateStatus} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </RouteProtection>
  );
}
