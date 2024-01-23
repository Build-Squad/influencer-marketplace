"use client";

import { Box, Avatar, Typography, Chip, Divider } from "@mui/material";
import dayjs from "dayjs";
import React from "react";

type OrderChatCardType = {
  orderChat: OrderChatType;
  setSelectedOrderChat: React.Dispatch<
    React.SetStateAction<OrderChatType | null>
  >;
  chatDisplayDetails: ChatDisplayType;
};

export default function OrderChatCard({
  orderChat,
  setSelectedOrderChat,
  chatDisplayDetails,
}: OrderChatCardType) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          my: 1,
          p: 1,
        }}
        onClick={() => {
          setSelectedOrderChat(orderChat);
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              mr: 1,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
              }}
            >
              @{chatDisplayDetails?.username}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#000",
              }}
            >
              #{orderChat?.order?.order_code}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {orderChat?.order_message?.message?.message ? (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(0,0,0,0.8)",
              }}
            >
              {dayjs(orderChat?.order_message?.message?.created_at).fromNow()}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(0,0,0,0.8)",
              }}
            >
              {dayjs(orderChat?.order?.created_at).fromNow()}
            </Typography>
          )}
          {orderChat?.order_message?.order_unread_messages_count > 0 && (
            <Chip
              label={orderChat?.order_message?.order_unread_messages_count}
              color="secondary"
              variant="outlined"
              sx={{
                borderRadius: 8,
              }}
            />
          )}
        </Box>
      </Box>
      <Divider
        sx={{
          my: 1,
          width: "100%",
        }}
      />
    </Box>
  );
}
