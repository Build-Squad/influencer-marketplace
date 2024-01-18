import { Box, Button, Typography, LinearProgress } from "@mui/material";
import React from "react";
import { UserDetailsType } from "../../type";

type Props = {
  userDetails: UserDetailsType;
};

const getProfileCompletedStatus: (
  userDetails: Props["userDetails"]
) => string = (userDetails) => {
  let count = 0;
  if (userDetails.isTwitterAccountConnected) count += 5;
  if (userDetails.isWalletConnected) count += 5;
  if (userDetails.businessDetails)
    count += Object.values(userDetails.businessDetails).filter(
      (value) => value !== ""
    ).length;
  return `${count} / ${10 + Object.keys(userDetails.businessDetails).length}`;
};

export default function RightComponent({ userDetails }: Props) {
  return (
    <Box
      sx={{
        padding: "16px 40px 16px 16px",
        height: "100%",
        border: "1px solid #D3D3D3",
        borderTop: "none",
      }}
    >
      <Button
        fullWidth
        variant={"contained"}
        color="secondary"
        sx={{
          borderRadius: "20px",
          fontWeight: "bold",
        }}
      >
        See Profile Preview
      </Button>

      <Box
        sx={{
          mt: 2,
          padding: "20px 16px 16px 16px",
          border: "1px solid #D3D3D3",
          borderRadius: "12px",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1">Information Added</Typography>
          <Typography variant="h4" fontWeight={"bold"}>
            {getProfileCompletedStatus(userDetails)}
          </Typography>
          <Box sx={{ width: "100%", mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={20}
              color="secondary"
            />
          </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Missing Details-</Typography>
          <ul style={{ color: "#626262" }}>
            {!userDetails.isWalletConnected ? (
              <li>Add wallet to your account</li>
            ) : null}

            {!userDetails.isTwitterAccountConnected ? (
              <li>Connect your X Account</li>
            ) : null}
          </ul>
        </Box>
      </Box>
    </Box>
  );
}
