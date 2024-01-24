"use client";

import { useAppSelector } from "@/src/hooks/useRedux";
import {
  getService,
  patchService,
  postService,
} from "@/src/services/httpServices";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { notification } from "../../shared/notification";
import MessageChip from "../messageChip";
import { ORDER_STATUS } from "@/src/utils/consts";
import StatusChip from "../../shared/statusChip";

type OrderChatPanelType = {
  selectedOrderChat: OrderChatType;
};

export default function OrderChatPanel({
  selectedOrderChat,
}: OrderChatPanelType) {
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const [toSendMessage, setToSendMessage] = React.useState("");

  const user = useAppSelector((state) => state.user)?.user;

  const getAllMessages = async () => {
    try {
      setLoading(true);
      const { isSuccess, message, data } = await getService(
        `/orders/order-message/${selectedOrderChat?.order?.id}/`,
        {
          page_size: 10000,
          page_number: 1,
        }
      );
      if (isSuccess) {
        data?.data?.forEach((message: MessageType) => {
          message.isMe = message.sender_id === user?.id;
        });
        setMessages(data?.data);
        await markAsRead();
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    await patchService(
      `/orders/order-message/${selectedOrderChat?.order?.id}/`
    );
  };

  const sendMessage = async () => {
    if (!toSendMessage?.length) {
      return;
    }
    const { isSuccess, message, data } = await postService(
      `/orders/order-message/`,
      {
        message: toSendMessage,
        order_id: selectedOrderChat?.order?.id,
      }
    );
    if (isSuccess) {
      setToSendMessage("");
      await getAllMessages();
      // Scroll to bottom
      const messagesContainer = document.getElementById("messagesContainer");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    } else {
      notification(message ? message : "Something went wrong", "error");
    }
  };

  useEffect(() => {
    getAllMessages();

    // Set up the interval
    const intervalId = setInterval(() => {
      getAllMessages();
    }, 30000); // 30000 milliseconds = 30 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [selectedOrderChat]);

  useEffect(() => {
    markAsRead();
  }, [selectedOrderChat]);

  return (
    <Grid container direction="column" sx={{ height: "100%", pr: 2 }}>
      <Grid item>
        <Box
          sx={{
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            {selectedOrderChat?.order?.order_item_order_id && (
              <>
                {user?.id === selectedOrderChat?.order?.buyer?.id ? (
                  <Avatar
                    src={
                      selectedOrderChat?.order?.order_item_order_id[0]?.package
                        ?.influencer?.twitter_account?.profile_image_url
                    }
                    sx={{
                      mr: 1,
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      mr: 1,
                    }}
                  />
                )}
              </>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {selectedOrderChat?.order?.order_item_order_id && (
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  @
                  {user?.id === selectedOrderChat?.order?.buyer?.id
                    ? selectedOrderChat?.order?.order_item_order_id[0]?.package
                        ?.influencer?.twitter_account?.user_name
                    : selectedOrderChat?.order?.buyer?.username}
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{
                  color: "#000",
                }}
              >
                #{selectedOrderChat?.order?.order_code}
              </Typography>
            </Box>
          </Box>
          <StatusChip
            status={
              selectedOrderChat?.order?.status
                ? selectedOrderChat?.order?.status
                : ""
            }
          />
        </Box>
      </Grid>

      <Grid
        item
        xs
        style={{
          overflow: "auto",
          display: "flex",
          flexDirection: "column-reverse",
        }}
        id="messagesContainer"
      >
        {messages?.length > 0 ? (
          <>
            {messages.map((message, index) => (
              <Box
                key={message?.id}
                sx={{
                  display: "flex",
                  justifyContent: message?.isMe ? "flex-end" : "flex-start",
                }}
              >
                <MessageChip message={message} />
              </Box>
            ))}
          </>
        ) : (
          <Box
            sx={{
              height: "100%",
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
              No Messages Found
            </Typography>
          </Box>
        )}
      </Grid>
      <Grid item>
        {selectedOrderChat?.order?.status === ORDER_STATUS.PENDING ||
        selectedOrderChat?.order?.status === ORDER_STATUS.ACCEPTED ? (
          <TextField
            color="secondary"
            fullWidth
            placeholder="Type a message"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
              },
              my: 1,
            }}
            multiline
            InputProps={{
              endAdornment: (
                <IconButton
                  sx={{
                    backgroundColor: "#000",
                  }}
                  onClick={sendMessage}
                >
                  <SendIcon
                    sx={{
                      color: "#fff",
                    }}
                  />
                </IconButton>
              ),
            }}
            value={toSendMessage}
            onChange={(e) => setToSendMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
        ) : (
          <Box
            sx={{
              borderTop: "1px solid rgba(0,0,0,0.1)",
              my: 2,
              p: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontStyle: "italic",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Order is closed
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
