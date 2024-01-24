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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        wordBreak: "break-word", // Add this line
        maxWidth: "50%",
        height: "auto",
        p: 2,
        m: 1,
        borderRadius: 8,
        border: message.isMe ? "" : "1px solid #000",
        backgroundColor: message.isMe ? "rgba(0, 0, 0, 0.8)" : "#fff",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: message.isMe ? "#fff" : "#000",
        }}
      >
        {message.message}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "grey",
        }}
      >
        {dayjs(message.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
      </Typography>
    </Box>
  );
}
