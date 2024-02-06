import { useAppSelector } from "@/src/hooks/useRedux";
import { ROLE_NAME } from "@/src/utils/consts";
import { Box, Typography } from "@mui/material";
import React from "react";

// A prop that will accept children as prop

function Unauthorized(message: string) {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontStyle: "italic",
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}

type RouteProtectionProps = {
  children: React.ReactNode;
  influencer?: boolean;
  business_owner?: boolean;
  logged_in?: boolean;
  message?: string;
};

export default function RouteProtection({
  children,
  influencer,
  business_owner,
  logged_in,
  message = "You are not authorized to view this page",
}: RouteProtectionProps) {
  const user = useAppSelector((state) => state.user)?.user;
  /*
    Case 1:
    If only logged_in is true, then check if user exists in the store
    If user exists, then return children

    Case 2:
    If influencer is true, then check if user exists in the store and if user is an influencer
    If user exists and is an influencer, then return children

    Case 3:
    If business_owner is true, then check if user exists in the store and if user is a business_owner
    If user exists and is a business_owner, then return children
  */

  return (
    <>
      {logged_in && !user && Unauthorized("You are not logged in")}
      {influencer &&
        user?.role?.name !== ROLE_NAME.INFLUENCER &&
        Unauthorized(message)}
      {business_owner &&
        user?.role?.name !== ROLE_NAME.BUSINESS_OWNER &&
        Unauthorized(message)}
      {children}
    </>
  );
}
