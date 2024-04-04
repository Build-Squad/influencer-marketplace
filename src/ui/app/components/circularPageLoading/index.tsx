"use client";
import { Backdrop, CircularProgress } from "@mui/material";

type Props = {};

export default function CircularPageLoading({}: Props) {
  return (
    <Backdrop open={true}>
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}
