"use client";

import { Box, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";

type StatusCardProps = {
  card: {
    label: string;
    value: number;
    icon: React.JSX.Element;
    onClick: () => void;
  };
  selectedCard: number;
  orderCount: {
    accepted: number;
    completed: number;
    pending: number;
    rejected: number;
  };
};

export default function StatusCard({
  card,
  selectedCard,
  orderCount,
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
        {card?.value === 0
          ? orderCount?.accepted +
            orderCount?.completed +
            orderCount?.pending +
            orderCount?.rejected
          : card?.value === 1
          ? orderCount?.accepted
          : card?.value === 2
          ? orderCount?.completed
          : card?.value === 3
          ? orderCount?.pending
          : card?.value === 4
          ? orderCount?.rejected
          : 0}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* <Image
          src={card.icon}
          alt={card.label}
          height={30}
          color={card?.value === selectedCard ? "#fff" : "#000"}
          style={{
            // This is an svg image, so we need to set the fill property to change the color
            fill: card?.value === selectedCard ? "#fff" : "#000",
          }}
        /> */}
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
