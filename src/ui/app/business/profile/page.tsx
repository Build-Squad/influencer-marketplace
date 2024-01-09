"use client";
import { useAppSelector } from "@/src/hooks/useRedux";
import { Box, Grid } from "@mui/material";
import React from "react";
import LeftComponent from "./components/leftComponent";
import MiddleComponent from "./components/middleComponent";
import RightComponent from "./components/rightComponent";

type Props = {};

export default function BusinessProfile({}: Props) {
  const user = useAppSelector((state) => state.user);

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <LeftComponent userName={user?.user?.first_name ?? "Anonymous User"} />
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <MiddleComponent />
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <RightComponent />
      </Grid>
    </Grid>
  );
}
