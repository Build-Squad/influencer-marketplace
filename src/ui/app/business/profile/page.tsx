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
    <Grid container sx={{ height: "100vh" }}>
      <Grid item xs={12} sm={12} md={3.5} lg={3.5}>
        <LeftComponent userName={user?.user?.first_name ?? "Anonymous User"} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={5}
        lg={5}
        sx={{ backgroundColor: "#FAFAFA" }}
      >
        <MiddleComponent />
      </Grid>
      <Grid item xs={12} sm={12} md={3.5} lg={3.5}>
        <RightComponent />
      </Grid>
    </Grid>
  );
}
