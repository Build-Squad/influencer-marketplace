"use client";

import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type StatusCardProps = {
  card: {
    label: string;
    value: number;
    icon: React.JSX.Element;
    onClick: () => void;
  };
  selectedCard: number;
  count: number | string | null;
  description?: string;
};

export default function StatusCard({
  card,
  selectedCard,
  count,
  description,
}: StatusCardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "column",
        cursor: "pointer",
        p: 4,
        borderRadius: 4,
        boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
        backgroundColor: selectedCard === card?.value ? "#000" : "#fff",
        minHeight: count !== null ? "180px" : "",
        maxHeight: count !== null ? "180px" : "",
      }}
      onClick={card.onClick}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          color: card?.value === selectedCard ? "#fff" : "#000",
        }}
      >
        {count}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {card.icon}
          <Typography
            variant="h6"
            sx={{
              color: card?.value === selectedCard ? "#fff" : "#000",
              ml: 1,
            }}
          >
            {card.label}
          </Typography>
        </Box>
        {description ? (
          <Tooltip title={description}>
            <IconButton>
              <InfoOutlinedIcon
                sx={{
                  color: card?.value === selectedCard ? "#fff" : "#000",
                }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <Box></Box>
        )}
      </Box>
    </Box>
  );
}
