"use client";
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import LeftComponent from "./components/leftComponent";
import MiddleComponent from "./components/middleComponent";
import RightComponent from "./components/rightComponent";
import { useAppSelector } from "@/src/hooks/useRedux";
import { BasicBusinessDetailsDefault, UserDetailsType } from "./type";
import { getService } from "@/src/services/httpServices";
import RouteProtection from "@/src/components/shared/routeProtection";

type Props = {};

export default function BusinessProfile({}: Props) {
  const [userDetails, setUserDetails] = useState({
    username: "",
    isTwitterAccountConnected: false,
    isWalletConnected: false,
    businessDetails: BasicBusinessDetailsDefault,
  });
  const user = useAppSelector((state) => state.user?.user);

  const getBusinessDetails = async () => {
    try {
      const { isSuccess, message, data } = await getService(
        `/account/business-meta-data/${user?.id}/`
      );
      if (isSuccess) {
        setUserDetails((prevState: UserDetailsType) => {
          return {
            ...prevState,
            businessDetails: {
              business_name: data.data.business_name ?? "",
              industry: data.data.industry ?? "",
              founded: data.data.founded ?? "",
              headquarters: data.data.headquarters ?? "",
              bio: data.data.bio ?? "",
              user_email: data.data.user_email ?? "",
              phone: data.data.phone ?? "",
              website: data.data.website ?? "",
              twitter_account: data.data.twitter_account ?? "",
              linked_in: data.data.linked_in ?? "",
            },
          };
        });
      }
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };

  // Change while adding newer fields in business user model
  useEffect(() => {
    setUserDetails({
      ...userDetails,
      username: user?.username ?? "Anonymous User",
      isTwitterAccountConnected: !!user?.twitter_account,
      isWalletConnected: !!user?.wallets?.length,
    });
    getBusinessDetails();
  }, [user]);

  return (
    <RouteProtection logged_in={true} business_owner={true}>
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
          <MiddleComponent
            setUserDetails={setUserDetails}
            userDetails={userDetails}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <RightComponent userDetails={userDetails} />
        </Grid>
      </Grid>
    </RouteProtection>
  );
}
