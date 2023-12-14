"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Backdrop, CircularProgress } from "@mui/material";

type Props = {};

export default function Home({}: Props) {
  const router = useRouter();
  useEffect(() => {
    router.push("/business");
  }, []);
  return (
    <Backdrop open={true}>
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}
