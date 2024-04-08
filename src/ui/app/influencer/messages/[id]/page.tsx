"use client";

import { useAppSelector } from "@/src/hooks/useRedux";
import {
  getService,
  patchService,
  postService,
} from "@/src/services/httpServices";
import { ORDER_STATUS } from "@/src/utils/consts";
import { stringToColor } from "@/src/utils/helper";
import ChatIcon from "@mui/icons-material/Chat";
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
import MessageChip from "../../../../src/components/messagesComponents/messageChip";
import { notification } from "../../../../src/components/shared/notification";
import StatusChip from "../../../../src/components/shared/statusChip";

export default function OrderChatPanel({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const [toSendMessage, setToSendMessage] = React.useState("");
  const [selectedOrder, setSelectedOrder] = React.useState<OrderType | null>(
    null
  );

  const user = useAppSelector((state) => state.user)?.user;

  const getAllMessages = async () => {
    try {
      setLoading(true);
      const { isSuccess, message, data } = await getService(
        `/orders/order-message/${params?.id}/`,
        {
          page_size: 10000,
          page_number: 1,
        }
      );
      if (isSuccess) {
        data?.data?.order_messages?.forEach((message: MessageType) => {
          message.isMe = message.sender_id === user?.id;
        });
        setMessages(data?.data?.order_messages);
        setSelectedOrder(data?.data?.order);
        await markAsRead();
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    await patchService(`/orders/order-message/${params?.id}/`);
  };

  const sendMessage = async () => {
    if (!toSendMessage?.length) {
      return;
    }
    const { isSuccess, message, data } = await postService(
      `/orders/order-message/`,
      {
        message: toSendMessage,
        order_id: params?.id,
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
    if (params?.id) {
      getAllMessages();

      // Set up the interval
      const intervalId = setInterval(() => {
        getAllMessages();
      }, 30000); // 30000 milliseconds = 30 seconds

      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalId);
    }
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) markAsRead();
  }, [params?.id]);

  return (
    <Grid container direction="column" sx={{ height: "100%", pr: 2 }}>
      {params?.id ? (
        <>
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
                {selectedOrder?.order_item_order_id && (
                  <>
                    {user?.id === selectedOrder?.buyer?.id ? (
                      <>
                        {selectedOrder?.order_item_order_id[0]?.package
                          ?.influencer?.twitter_account?.profile_image_url &&
                        !selectedOrder?.order_item_order_id[0]?.package?.influencer?.twitter_account?.profile_image_url.includes(
                          "default"
                        ) ? (
                          <>
                            <Avatar
                              sx={{
                                mr: 1,
                                cursor: "pointer",
                              }}
                              src={
                                selectedOrder?.order_item_order_id[0]?.package
                                  ?.influencer?.twitter_account
                                  ?.profile_image_url
                              }
                            />
                          </>
                        ) : (
                          <Avatar
                            sx={{
                              bgcolor: stringToColor(
                                selectedOrder?.order_item_order_id[0]?.package
                                  ?.influencer?.twitter_account?.user_name
                                  ? selectedOrder?.order_item_order_id[0]
                                      ?.package?.influencer?.twitter_account
                                      ?.user_name
                                  : ""
                              ),
                              mr: 1,
                              cursor: "pointer",
                            }}
                          >
                            {selectedOrder?.order_item_order_id[0]?.package?.influencer?.twitter_account?.user_name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </Avatar>
                        )}
                      </>
                    ) : (
                      <Avatar
                        sx={{
                          mr: 1,
                          bgcolor: stringToColor(
                            selectedOrder?.buyer?.username
                              ? selectedOrder?.buyer?.username
                              : ""
                          ),
                        }}
                      >
                        {selectedOrder?.buyer?.username
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </Avatar>
                    )}
                  </>
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {selectedOrder?.order_item_order_id && (
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      @
                      {user?.id === selectedOrder?.buyer?.id
                        ? selectedOrder?.order_item_order_id[0]?.package
                            ?.influencer?.twitter_account?.user_name
                        : selectedOrder?.buyer?.username}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#000",
                    }}
                  >
                    {selectedOrder?.order_code
                      ? `#${selectedOrder?.order_code}`
                      : ""}
                  </Typography>
                </Box>
              </Box>
              <StatusChip
                status={selectedOrder?.status ? selectedOrder?.status : ""}
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
            {selectedOrder?.status === ORDER_STATUS.PENDING ||
            selectedOrder?.status === ORDER_STATUS.ACCEPTED ? (
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
                maxRows={5}
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
        </>
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
  );
}
