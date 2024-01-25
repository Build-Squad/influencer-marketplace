"use client";

import { DISPLAY_DATE_TIME_FORMAT, MESSAGE_STATUS } from "@/src/utils/consts";
import { Box, Chip, Typography } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

type MessageChipType = {
  message: MessageType;
};

export default function MessageChip({ message }: MessageChipType) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        wordBreak: "break-word",
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "grey",
            mr: 1,
          }}
        >
          {dayjs(message.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
        </Typography>
        {message?.isMe && (
          <>
            {message?.status === MESSAGE_STATUS.READ ? (
              <DoneAllIcon
                sx={{
                  color: "grey",
                  fontSize: 16,
                }}
              />
            ) : (
              <DoneIcon sx={{ color: "grey", fontSize: 16 }} />
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
