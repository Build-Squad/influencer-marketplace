import { Box, Button, Typography, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { UserDetailsType } from "../../type";
import Image from "next/image";
import NoMissingData from "@/public/no_missing_info.png";

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
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const percentage = getProgressPercentage();

    if (percentage === 100) {
      setIsProfileComplete(true);
    } else {
      setIsProfileComplete(false);
    }
  }, [userDetails]);

  const emptyFields = Object.entries(userDetails.businessDetails)
    .filter(([key, value]) => value === "")
    .map(([key]) => key);

  const getProgressPercentage = () => {
    const completionStringArr = getProfileCompletedStatus(userDetails)
      .replace(/\s/g, "")
      .split("/");

    return (
      (parseInt(completionStringArr[0]) / parseInt(completionStringArr[1])) *
      100
    );
  };

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
        {isProfileComplete ? (
          <>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1">Information Added</Typography>
              <Typography
                variant="h4"
                fontWeight={"bold"}
                sx={{ color: "#4AA785" }}
              >
                {getProfileCompletedStatus(userDetails)}
              </Typography>
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={getProgressPercentage()}
                  sx={{
                    "& .MuiLinearProgress-bar": { backgroundColor: "#4AA785" },
                  }}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" fontStyle={"italic"}>
                  Congratulations! Complete profile boosts influencer’s trust 💯{" "}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Missing Details-</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  paddingY: "40px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src={NoMissingData}
                  alt="NoMissingData"
                  style={{ height: "25%", width: "25%" }}
                />
                <Typography variant="subtitle1">No Missing Details!</Typography>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1">Information Added</Typography>
              <Typography variant="h4" fontWeight={"bold"}>
                {getProfileCompletedStatus(userDetails)}
              </Typography>
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={getProgressPercentage()}
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
                {emptyFields.map((field) => (
                  <li key={field}>Fill in your {field.replace("_", " ")}</li>
                ))}
              </ul>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
