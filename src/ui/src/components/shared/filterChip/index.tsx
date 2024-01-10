"use client";

import { Chip } from "@mui/material";
import React from "react";

type FilterChipProps = {
  label: string;
  onDelete: () => void;
  variant?: "outlined" | "filled";
  color?: "primary" | "secondary";
};

export default function FilterChip({
  label,
  onDelete,
  color = "primary",
  variant = "outlined",
}: FilterChipProps) {
  return (
    <Chip
      sx={{ mr: 1, mb: 1 }}
      label={label}
      onDelete={onDelete}
      variant={variant}
      color={color}
    />
  );
}
