"use client";

import React from "react";
import { enqueueSnackbar } from "notistack";

type VariantProps = "default" | "error" | "success" | "warning" | "info";

export const notification = (
  message: string,
  variant?: VariantProps,
  timer?: number
) => {
  enqueueSnackbar(message, {
    variant: variant ? variant : "success",
    autoHideDuration: timer ? timer : 1000,
  });
};
