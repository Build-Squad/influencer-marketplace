"use client";

import { DISPLAY_DATE_TIME_FORMAT, MESSAGE_STATUS } from "@/src/utils/consts";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

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
        borderRadius: 3,
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
          justifyContent: "space-between",
        }}
      >
        {message?.is_system_message ? (
          <Typography
            variant="caption"
            sx={{
              color: "grey",
              mr: 1,
              fontStyle: "italic",
            }}
          >
            {`Auto Generated`}
          </Typography>
        ) : (
          <Box></Box>
        )}
        <Box>
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
    </Box>
  );
}
