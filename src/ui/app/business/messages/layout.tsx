"use client";

import BackIcon from "@/public/svg/Back.svg";
import XfluencerLogo from "@/public/svg/Xfluencer_Logo_Beta.svg";
import OrderChatCard from "@/src/components/messagesComponents/orderChatCard";
import OrderChatFilterBar from "@/src/components/messagesComponents/orderChatFilterBar";
import RouteProtection from "@/src/components/shared/routeProtection";
import { useAppSelector } from "@/src/hooks/useRedux";
import { postService } from "@/src/services/httpServices";
import { ORDER_STATUS } from "@/src/utils/consts";
import { DriveEta } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import * as relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";

const relativeTime1: any = relativeTime;
dayjs.extend(relativeTime1);

export default function BusinessMessages({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user)?.user;
  const [orderChats, setOrderChats] = React.useState<OrderChatType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedOrderChatId, setSelectedOrderChatId] = React.useState<
    string | null
  >(null);
  const [filters, setFilters] = React.useState<OrderFilterType>({
    status: [
      ORDER_STATUS.ACCEPTED,
      ORDER_STATUS.REJECTED,
      ORDER_STATUS.PENDING,
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.CANCELLED,
    ],
  });
  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 10,
  });

  // User Guide for the very first order
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [run, setRun] = useState(false);
  const [hasAMessage, setHasAMessage] = useState(false);
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
            Chat with influencers.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            This tour will guide you through the chatting room where you can
            message the influencers and have a short discussion about your
            order.
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
            Customized filters.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Advanced filters for chats based on the services, order ID, and
            status of orders.
          </Typography>
        </Box>
      ),
      placement: "right",
      target: ".joyride-message-filters",
    },
    {
      content: (
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Influencer's List.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Click on the influencer to chat with them and have a discussion
            about the order.
          </Typography>
        </Box>
      ),
      placement: "right",
      target: ".joyride-user-chats",
    },
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
            Congratulations!!!
          </Typography>
          <Typography sx={{ mt: 1 }}>
            You've completed your messages tour, you're good to go and chat with
            your influencer.
          </Typography>
        </Box>
      ),
      placement: "center",
      target: "body",
    },
  ]);

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

  const handleUserInteraction = async () => {
    const { isSuccess, message, data } = await postService(
      "/orders/user-order-messages/",
      {}
    );
    if (isSuccess) {
      // Fetching all user-message and if there's exactly 1 object, show the user guide
      if (data?.data?.orders?.length == 1) {
        setStepIndex(0);
        setRun(true);
      }
      if (data?.data?.orders?.length > 0) {
        setHasAMessage(true);
      }
    }
  };

  const getAllChats = async () => {
    try {
      setLoading(true);
      const { isSuccess, message, data } = await postService(
        "/orders/user-order-messages/",
        {
          page_number: pagination.current_page_number,
          page_size: pagination.current_page_size,
          ...filters,
        }
      );
      if (isSuccess) {
        setOrderChats(data?.data);
        setPagination({
          ...pagination,
          total_data_count: data?.pagination?.total_data_count,
          total_page_count: data?.pagination?.total_page_count,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setPagination((prev) => ({
      ...prev,
      current_page_number: page,
    }));
  };

  useEffect(() => {
    // The last part of the URL is the order ID if it's a message page
    const urlParts = pathname.split("/");
    const orderChatId = urlParts[urlParts.length - 1];
    // if its an UUID
    if (orderChatId.length === 36) {
      setSelectedOrderChatId(orderChatId);
    }
  }, [pathname]);

  useEffect(() => {
    getAllChats();

    // Set up the interval
    const intervalId = setInterval(() => {
      getAllChats();
    }, 30000); // 30000 milliseconds = 30 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [filters, pagination.current_page_number, pagination.current_page_size]);

  useEffect(() => {
    handleUserInteraction();
  }, []);

  if (!user) {
    return (
      <Box
        sx={{
          // In the center of this component
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontStyle: "italic",
          }}
        >
          Please login to view Messages
        </Typography>
      </Box>
    );
  }

  return (
    <RouteProtection logged_in={true} business_owner={true}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={4}
          lg={4}
          sm={4}
          sx={{
            height: "100%",
            overflow: "auto",
            minHeight: "93vh",
            maxHeight: "93vh",
            mb: 2,
          }}
        >
          <Box
            sx={{
              px: 2,
              pt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Image
              src={BackIcon}
              alt={"BackIcon"}
              height={30}
              style={{
                marginTop: "8px",
                marginBottom: "8px",
                cursor: "pointer",
              }}
              onClick={() => {
                router.back();
              }}
            />
            <Box
              sx={{
                color: "grey",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                columnGap: "4px",
                visibility: hasAMessage ? "visible" : "hidden",
              }}
              onClick={() => {
                setStepIndex(0);
                setRun(true);
              }}
            >
              <DriveEta fontSize="small" />
              <Typography sx={{ color: "#C60C30" }}>Take A Tour!</Typography>
            </Box>
          </Box>
          <Box sx={{ p: 2, pt: 0 }}>
            <OrderChatFilterBar filters={filters} setFilters={setFilters} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontStyle: "italic",
                }}
              >
                {pagination?.total_data_count} Orders
              </Typography>
              {loading && <CircularProgress size={20} />}
            </Box>
            {orderChats?.length > 0 ? (
              <>
                {orderChats?.map((orderChat) => {
                  let chatDisplayDetails: ChatDisplayType = {};
                  if (user?.id === orderChat?.order?.buyer?.id) {
                    if (orderChat?.order?.order_item_order_id) {
                      chatDisplayDetails = {
                        username:
                          orderChat?.order?.order_item_order_id[0]?.package
                            ?.influencer?.twitter_account?.user_name,
                        message: orderChat?.order_message,
                        profile_image_url:
                          orderChat?.order?.order_item_order_id[0]?.package
                            ?.influencer?.twitter_account?.profile_image_url,
                      };
                    }
                  }
                  return (
                    <OrderChatCard
                      key={orderChat?.order?.id}
                      orderChat={orderChat}
                      chatDisplayDetails={chatDisplayDetails}
                      handleOrderChat={(id: string) => {
                        router.push(`/business/messages/${id}`);
                      }}
                      selectedOrderChatId={selectedOrderChatId}
                    />
                  );
                })}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Pagination
                      count={pagination.total_page_count}
                      page={pagination.current_page_number}
                      onChange={handlePaginationChange}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                      color="secondary"
                      shape="rounded"
                    />
                  </Box>
                </Grid>
              </>
            ) : (
              <>
                {loading ? (
                  <Box
                    sx={{
                      // In the center of this component
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50vh",
                      flexDirection: "column",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <Typography
                    variant="h6"
                    sx={{
                      fontStyle: "italic",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    No Orders
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          lg={8}
          sm={8}
          sx={{
            borderLeft: "1px solid rgba(0,0,0,0.1)",
            width: "100%",
          }}
        >
          {children}
        </Grid>
      </Grid>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        stepIndex={stepIndex}
        run={run}
        scrollToFirstStep
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
    </RouteProtection>
  );
}
