"use client";

import OrderChatCard from "@/src/components/messagesComponents/orderChatCard";
import OrderChatFilterBar from "@/src/components/messagesComponents/orderChatFilterBar";
import OrderChatPanel from "@/src/components/messagesComponents/orderChatPanel";
import { notification } from "@/src/components/shared/notification";
import RouteProtection from "@/src/components/shared/routeProtection";
import { useAppSelector } from "@/src/hooks/useRedux";
import { postService } from "@/src/services/httpServices";
import { ORDER_STATUS } from "@/src/utils/consts";
import ChatIcon from "@mui/icons-material/Chat";
import { Box, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import * as relativeTime from "dayjs/plugin/relativeTime";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const relativeTime1: any = relativeTime;
dayjs.extend(relativeTime1);

export default function BusinessMessages() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user)?.user;
  const [orderChats, setOrderChats] = React.useState<OrderChatType[]>([]);
  const searchParams = useSearchParams();
  const [totalUnreadMessages, setTotalUnreadMessages] = React.useState(0);
  const [selectedOrderChat, setSelectedOrderChat] =
    React.useState<OrderChatType | null>(null);
  const [filters, setFilters] = React.useState<OrderFilterType>({
    status: [
      ORDER_STATUS.ACCEPTED,
      ORDER_STATUS.REJECTED,
      ORDER_STATUS.PENDING,
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.CANCELLED,
    ],
  });

  const getAllChats = async () => {
    const { isSuccess, message, data } = await postService(
      "/orders/user-order-messages/",
      {
        ...filters,
      }
    );
    if (isSuccess) {
      setOrderChats(data?.data?.orders);
      setTotalUnreadMessages(data?.data?.total_unread_messages_count);
    }
  };

  useEffect(() => {
    if (orderChats?.length > 0) {
      const selectedOrderChatId = searchParams.get("order_chat_id");
      if (selectedOrderChatId) {
        const _selectedOrderChat = orderChats.find(
          (orderChat) => orderChat.order.id === selectedOrderChatId
        );
        if (_selectedOrderChat) setSelectedOrderChat(_selectedOrderChat);
      }
    }
  }, [searchParams, orderChats]);

  useEffect(() => {
    getAllChats();

    // Set up the interval
    const intervalId = setInterval(() => {
      getAllChats();
    }, 30000); // 30000 milliseconds = 30 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [filters]);

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
          <Box sx={{ p: 2 }}>
            <OrderChatFilterBar filters={filters} setFilters={setFilters} />
            <Typography
              variant="h6"
              sx={{
                fontStyle: "italic",
              }}
            >
              {orderChats?.length} Orders
            </Typography>
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
                        router.push(`/business/messages?order_chat_id=${id}`);
                      }}
                    />
                  );
                })}
              </>
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
          {selectedOrderChat ? (
            <OrderChatPanel selectedOrderChat={selectedOrderChat} />
          ) : (
            <Box
              sx={{
                // In the center of this component
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <ChatIcon
                sx={{
                  fontSize: "10rem",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontStyle: "italic",
                }}
              >
                Select an order to view Chat
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </RouteProtection>
  );
}
