import { getService, putService } from "@/src/services/httpServices";
import {
  DISPLAY_DATE_FORMAT,
  ORDER_ITEM_STATUS,
  ORDER_STATUS,
  ROLE_NAME,
} from "@/src/utils/consts";
import {
  Box,
  Button,
  FormLabel,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import OrderItemForm from "../../checkoutComponents/orderItemForm";
import CustomModal from "../../shared/customModal";
import { notification } from "../../shared/notification";
import StatusChip from "../../shared/statusChip";
import OrderSummaryDetails from "../orderSummaryDetails";
import { useAppSelector } from "@/src/hooks/useRedux";
import CloseIcon from "@mui/icons-material/Close";

type UpdateOrderProps = {
  order_id: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UpdateOrder({
  order_id,
  open,
  setOpen,
}: UpdateOrderProps) {
  const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderType | null>(null);
  const [influencer, setInfluencer] = useState<UserType | null>(null);

  const getOrderDetails = async () => {
    try {
      setLoading(true);
      const { isSuccess, data, message } = await getService(
        `/orders/order/${order_id}/`
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

  const validateMetaDataValues = () => {
    let isValid = true;
    order?.order_item_order_id?.forEach((orderItem) => {
      if (!orderItem?.publish_date) {
        notification("Please select a publish date", "error", 3000);
        isValid = false;
      }
      if (orderItem?.publish_date) {
        // Make sure that publish_date is atleast 30 minutes from now that is if current time is 12:00 then publish_date should be atleast 12:30
        const publishDate = dayjs(orderItem?.publish_date);
        const _30MinutesLater = dayjs().add(30, "minutes");
        if (publishDate.isBefore(_30MinutesLater)) {
          notification(
            "Please select a publish date atleast 30 minutes from now",
            "error",
            3000
          );
          isValid = false;
        }
      }
      orderItem?.order_item_meta_data?.forEach((metaData) => {
        if (metaData.regex && metaData?.value) {
          const regex = new RegExp(metaData.regex);
          if (!regex.test(metaData?.value)) {
            notification(
              `Please fill the correct value for ${metaData.label}`,
              "error",
              3000
            );
            isValid = false;
          }
        }
      });
    });
    return isValid;
  };

  const updateOrder = async () => {
    const body = {
      order_items: order?.order_item_order_id?.map((orderItem) => {
        return {
          order_item_id: orderItem?.id,
          publish_date: orderItem?.publish_date,
          meta_data: orderItem?.order_item_meta_data?.map((metaData) => {
            return {
              order_item_meta_data_id: metaData?.id,
              service_master_meta_data_id:
                metaData?.service_master_meta_data_id,
              value: metaData?.value,
            };
          }),
        };
      }),
    };
    try {
      const { isSuccess, message } = await putService(
        `/orders/order/${order_id}/`,
        body
      );
      if (isSuccess) {
        notification("Order Details saved successfully!", "success");
        await getOrderDetails();
      } else {
        notification(message, "error", 3000);
      }
    } finally {
    }
  };

  const updateOrderItemMetaData = async (
    orderItemId: string,
    orderItemMetaDataId: string,
    value: string | null
  ) => {
    // The function will find the relevant order item and update the metadata in the order

    // First, create a copy of the order
    const orderCopy = { ...order };

    // Then find the order item
    const orderItem = orderCopy?.order_item_order_id?.find(
      (orderItem) => orderItem.id === orderItemId
    );

    // If order item not found, return
    if (!orderItem) {
      return;
    }

    // Find the order item meta data
    const orderItemMetaData = orderItem?.order_item_meta_data?.find(
      (orderItemMetaData) => orderItemMetaData.id === orderItemMetaDataId
    );

    // If order item meta data not found, return
    if (!orderItemMetaData) {
      return;
    }

    // Update the value
    orderItemMetaData.value = value;

    // Update the order
    setOrder(orderCopy);
  };

  const updatePublishDate = async (
    orderItemId: string,
    publishDate: string
  ) => {
    // The function will find the relevant order item and update the metadata in the order

    // First, create a copy of the order
    const orderCopy = { ...order };

    // Then find the order item
    const orderItem = orderCopy?.order_item_order_id?.find(
      (orderItem) => orderItem.id === orderItemId
    );

    // If order item not found, return
    if (!orderItem) {
      return;
    }

    // Update the publish date
    orderItem.publish_date = publishDate;

    // Update the order
    setOrder(orderCopy);
  };

  useEffect(() => {
    if (order_id && open) {
      getOrderDetails();
    }
  }, [order_id, open]);

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      sx={{
        p: 0,
        minHeight: "90vh",
        minWidth: "80vw",
        overflow: "auto",
        maxHeight: "90vh",
        maxWidth: "80vw",
      }}
      customCloseButton={true}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
          }}
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            sm={12}
            sx={{
              p: 2,
              ml: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={"bold"}
                sx={{
                  my: 2,
                }}
              >
                Order Details: {order?.order_code}
              </Typography>
              <IconButton
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
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
            {order?.status === ORDER_STATUS.ACCEPTED ||
            (order?.status === ORDER_STATUS.PENDING &&
              user?.role?.name === ROLE_NAME.BUSINESS_OWNER) ? (
              <>
                {order?.order_item_order_id?.map(
                  (orderItem: any, index: number) => {
                    return (
                      <>
                        {orderItem?.status === ORDER_ITEM_STATUS.PUBLISHED ? (
                          <OrderSummaryDetails
                            orderItem={orderItem}
                            orderStatus={order?.status}
                          />
                        ) : (
                          <OrderItemForm
                            key={index}
                            orderItem={{
                              order_item: orderItem,
                              index: index,
                            }}
                            index={index}
                            disableDelete={true}
                            updateFunction={updateOrderItemMetaData}
                            sx={{
                              my: 2,
                            }}
                            updateOrderItemPublishDate={updatePublishDate}
                            getOrderDetails={getOrderDetails}
                          />
                        )}
                      </>
                    );
                  }
                )}
              </>
            ) : (
              <Box>
                <OrderSummaryDetails
                  orderItem={order?.order_item_order_id}
                  orderStatus={order?.status}
                />
              </Box>
            )}
            {(order?.status === ORDER_STATUS.ACCEPTED ||
              (order?.status === ORDER_STATUS.PENDING &&
                user?.role?.name === ROLE_NAME.BUSINESS_OWNER)) && (
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
                      if (!validateMetaDataValues()) {
                        return;
                      }
                      updateOrder();
                    }}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
          <Grid item xs={0} md={1.5} lg={1.5} sm={0}></Grid>
        </Grid>
      </LocalizationProvider>
    </CustomModal>
  );
}
