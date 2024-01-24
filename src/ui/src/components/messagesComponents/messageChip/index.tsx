"use client";

import { DISPLAY_DATE_TIME_FORMAT } from "@/src/utils/consts";
import { Box, Chip, Typography } from "@mui/material";
import dayjs from "dayjs";
import React from "react";

type MessageChipType = {
  message: MessageType;
};

export default function MessageChip({ message }: MessageChipType) {
  return (
    // If the message is from the user, then the chip will be on the right side
    // Otherwise, it will be on the left side

    <Chip
      label={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="body1">{message.message}</Typography>
          <Typography
            variant="caption"
            sx={{
              color: message.isMe ? "grey" : "grey",
            }}
          >
            {dayjs(message.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
          </Typography>
        </Box>
      }
      sx={{
        display: "flex",
        justifyContent: message.isMe ? "flex-end" : "flex-start",
        my: 1,
        mx: 1,
        p: 1,
        borderRadius: 8,
        maxWidth: "50%",
        height: "auto",
      }}
      color="secondary"
      variant={message.isMe ? "filled" : "outlined"}
    />
  );
}
