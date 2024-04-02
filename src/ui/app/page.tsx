"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Backdrop, CircularProgress } from "@mui/material";
import { useAppSelector } from "@/src/hooks/useRedux";
import { ROLE_NAME } from "@/src/utils/consts";

type Props = {};

export default function Home({}: Props) {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    const url =
      user?.user?.role?.name === ROLE_NAME.INFLUENCER
        ? "/influencer"
        : "/business";
    router.push(url);
  }, []);

  return null;
}
