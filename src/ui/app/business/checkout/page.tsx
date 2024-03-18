"use client";

import CheckoutTable from "@/src/components/checkoutComponents/checkoutTable";
import OrderItemForm from "@/src/components/checkoutComponents/orderItemForm";
import { ConfirmCancel } from "@/src/components/shared/confirmCancel";
import { notification } from "@/src/components/shared/notification";
import RouteProtection from "@/src/components/shared/routeProtection";
import CreateEscrow from "@/src/components/web3Components/createEscrow";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { initializeCart, resetCart } from "@/src/reducers/cartSlice";
import BackIcon from "@/public/svg/Back.svg";
import Image from "next/image";
import {
  deleteService,
  getService,
  postService,
  putService,
} from "@/src/services/httpServices";
import { CHECKOUT_TEXT, ORDER_STATUS } from "@/src/utils/consts";
import { Box, Button, Grid, Link, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import XfluencerLogo from "@/public/svg/Xfluencer_Logo_Beta.svg";
import { DriveEta } from "@mui/icons-material";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // User Guide
  const [isFirstOrder, setIsFirstOrder] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<any>([
    {
      content: (
        <Box>
          <Image
            src={XfluencerLogo}
            width={175}
            height={30}
            alt="bgimg"
            priority
          />
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
            Place your order successfully!
          </Typography>
          <Typography sx={{ mt: 1 }}>
            This tour will help you place your selected services order
            accurately. Please ensure you follow each step without skipping any.
          </Typography>
        </Box>
      ),
      placement: "center",
      target: "body",
    },
    {
      content: (
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Fill in the details.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Enter the details and select the time to publish your service.
          </Typography>
        </Box>
      ),
      placement: "right",
      target: ".joyride-order-item-form",
    },
    {
      content: (
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Save your order.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Click on save to proceed with the payment.
          </Typography>
        </Box>
      ),
      placement: "top",
      target: ".joyride-order-save-button",
    },
    {
      content: (
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Make Payment
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Once you've saved your order, click on "Make Offer" and pay via your
            wallet.
          </Typography>
        </Box>
      ),
      placement: "left",
      target: ".joyride-make-payment",
    },
  ]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const { isSuccess, data, message } = await getService(
        `orders/order-list/`
      );
      if (isSuccess) {
        let totalOrders = 0;
        Object.values(data?.data).map((value: any) => {
          totalOrders += value;
        });
        if (!totalOrders) {
          setIsFirstOrder(true);
          setRun(true);
        }
      }
    } finally {
    }
  };

  const handleJoyrideCallback = (data: any) => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setRun(false);
    }
  };
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

  const validateMetaDataValues = () => {
    let isValid = true;
    cart?.orderItems?.forEach((orderItem) => {
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
      orderItem?.order_item?.order_item_meta_data?.forEach((metaData) => {
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
      if (!validateMetaDataValues()) {
        setLoading(false);
        return;
      }
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Image
          src={BackIcon}
          alt={"BackIcon"}
          height={30}
          style={{ marginTop: "16px", marginLeft: "32px", cursor: "pointer" }}
          onClick={() => {
            router.back();
          }}
        />
        <Box
          sx={{
            mr: 4,
            color: "grey",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            columnGap: "4px",
          }}
          onClick={() => {
            setStepIndex(0);
            setRun(true);
          }}
        >
          <DriveEta fontSize="small" />
          <Typography sx={{color:'#C60C30'}}>Take A Tour!</Typography>
        </Box>
      </Box>
      {cart?.orderItems?.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
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
      ) : (
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
                    className={"joyride-order-save-button"}
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
                    Influencer : &nbsp;
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
                  <Typography variant="body1">{CHECKOUT_TEXT}</Typography>
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
          {isFirstOrder ? (
            <Joyride
              callback={handleJoyrideCallback}
              continuous
              stepIndex={stepIndex}
              // disableOverlay
              run={run}
              scrollToFirstStep
              // showProgress
              showSkipButton
              steps={steps}
              spotlightClicks
              styles={{
                options: {
                  zIndex: 2,
                },
              }}
              locale={{ last: "Finish" }}
            />
          ) : null}
        </LocalizationProvider>
      )}
    </RouteProtection>
  );
}
