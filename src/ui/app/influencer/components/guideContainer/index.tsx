"use client";
import React from "react";
import { Typography, Box } from "@mui/material";
import Image from "next/image";

type Props = {};

const WORKING_STEPS = [
  {
    id: "STEP_1",
    imageUrl: require("@/public/svg/Step1_Influencer.svg"),
    description: "Connect & List Services",
  },
  {
    id: "STEP_2",
    imageUrl: require("@/public/svg/Step5_Influencer.svg"),
    description: "Accept & Schedule Orders",
  },
  {
    id: "STEP_3",
    imageUrl: require("@/public/svg/Step2_Influencer.svg"),
    description: "Claim Payouts",
  },
];

const stepContainerStyle = {
  flex: "1",
  textAlign: "center",
};

export default function GuideContainer({}: Props) {
  return (
    <Box
      sx={{
        paddingY: "52px",
        borderRadius: "16px",
        boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        How it Works?
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "#505050" }}>
        List your services and start earning right away.
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          padding: "64px 72px",
          paddingBottom: "0px",
          flexWrap: "wrap",
          columnGap: "20px",
        }}
      >
        {WORKING_STEPS.map((step) => (
          <Box key={step.id} sx={stepContainerStyle}>
            <Image
              src={step.imageUrl}
              height={94}
              width={94}
              alt={step.description}
            />
            <Typography variant="subtitle1">{step.description}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
