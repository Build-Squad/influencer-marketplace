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
        `/orders/order-message/${selectedOrderChat?.order?.id}/`
      );
      if (isSuccess) {
        data?.data?.forEach((message: MessageType) => {
          message.isMe = message.sender_id === user?.id;
        });
        setMessages(data?.data);
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
      getAllMessages();
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
          }}
        >
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
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
              {selectedOrderChat?.order?.order_item_order_id && (
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  @
                  {
                    selectedOrderChat?.order?.order_item_order_id[0]?.package
                      ?.influencer?.twitter_account?.user_name
                  }
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
      >
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
      </Grid>
      <Grid item>
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
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
      </Grid>
    </Grid>
  );
}
