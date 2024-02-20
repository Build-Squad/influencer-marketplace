"use client";
import { Backdrop, CircularProgress } from "@mui/material";

type Props = {};

export default function Loading({}: Props) {
  return (
    <Backdrop open={true}>
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}
