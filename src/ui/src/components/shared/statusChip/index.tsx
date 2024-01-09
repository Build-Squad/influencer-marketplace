"use client";

import { Chip } from "@mui/material";
import React from "react";

type StatusChipProps = {
  status: "accepted" | "rejected" | "pending" | "completed" | "draft";
};

const colorMap = {
  accepted: "#D2E1FF",
  rejected: "#FDEADC",
  pending: "#F5F6C9",
  completed: "#CBF8D8",
  draft: "#F8F8F8",
};

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Chip
      label={capitalizeFirstLetter(status)}
      sx={{
        backgroundColor: colorMap[status],
        color: "#000",
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: "14px",
        padding: "4px 8px",
      }}
    />
  );
};

export default StatusChip;
