"use client";
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import LeftComponent from "./components/leftComponent";
import MiddleComponent from "./components/middleComponent";
import RightComponent from "./components/rightComponent";
import { useAppSelector } from "@/src/hooks/useRedux";

type Props = {};

export default function BusinessProfile({}: Props) {
  const [userDetails, setUserDetails] = useState({
    username: "",
    isTwitterAccountConnected: false,
    isWalletConnected: false,
    businessDetails: {
      username: "",
    },
  });
  const user = useAppSelector((state) => state.user?.user);

  // Change while adding newer fields in business user model
  useEffect(() => {
    setUserDetails({
      username: user?.username ?? "Anonymous User",
      isTwitterAccountConnected: !!user?.twitter_account,
      isWalletConnected: !!user?.wallets?.length,
      businessDetails: {
        username: user?.username ?? "",
      },
    });
  }, [user]);

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid item xs={12} sm={12} md={3} lg={3}>
        <LeftComponent userDetails={userDetails} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        lg={6}
        sx={{ backgroundColor: "#FAFAFA" }}
      >
        <MiddleComponent />
      </Grid>
      <Grid item xs={12} sm={12} md={3} lg={3}>
        <RightComponent userDetails={userDetails} />
      </Grid>
    </Grid>
  );
}
