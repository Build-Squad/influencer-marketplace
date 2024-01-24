"use client";

import { Box, Avatar, Typography, Chip, Divider, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import StatusChip from "../../shared/statusChip";

type OrderChatCardType = {
  orderChat: OrderChatType;
  setSelectedOrderChat: React.Dispatch<
    React.SetStateAction<OrderChatType | null>
  >;
  chatDisplayDetails: ChatDisplayType;
};

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

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
          {chatDisplayDetails?.profile_image_url ? (
            <Avatar
              src={chatDisplayDetails?.profile_image_url}
              sx={{
                mr: 1,
              }}
            />
          ) : (
            <Avatar
              sx={{
                mr: 1,
                bgcolor: stringToColor(
                  chatDisplayDetails?.username
                    ? chatDisplayDetails?.username
                    : ""
                ),
              }}
            >
              {chatDisplayDetails?.username?.charAt(0)?.toUpperCase()}
            </Avatar>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {chatDisplayDetails?.username && (
              <Tooltip
                title={chatDisplayDetails?.username}
                placement="top-start"
                disableHoverListener={
                  chatDisplayDetails?.username?.length <= 20
                }
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {`@${
                    chatDisplayDetails?.username?.length > 20
                      ? chatDisplayDetails?.username?.substring(0, 20) + "..."
                      : chatDisplayDetails?.username
                  }`}
                </Typography>
              </Tooltip>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#000",
                  mr: 1,
                }}
              >
                #{orderChat?.order?.order_code}
              </Typography>
              <StatusChip
                status={
                  orderChat?.order?.status ? orderChat?.order?.status : ""
                }
              />
            </Box>
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
