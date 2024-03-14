"use client";

import { Box, Typography } from "@mui/material";
import React from "react";

type StatusCardProps = {
  card: {
    label: string;
    value: number;
    icon: React.JSX.Element;
    onClick: () => void;
  };
  selectedCard: number;
  count: number | string;
};

export default function StatusCard({
  card,
  selectedCard,
  count,
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
        minHeight: "180px",
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
        }}
      >
        {card.icon}
        <Typography
          variant="body1"
          sx={{
            color: card?.value === selectedCard ? "#fff" : "#000",
            ml: 1,
          }}
        >
          {card.label}
        </Typography>
      </Box>
    </Box>
  );
}
