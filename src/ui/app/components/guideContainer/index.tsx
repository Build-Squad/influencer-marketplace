import React from "react";
import { Typography, Box } from "@mui/material";
import Image from "next/image";

type Props = {};

const WORKING_STEPS = [
  {
    id: "STEP_1",
    imageUrl: require("@/public/svg/Step1.svg"),
    description: "Explore Influencers",
  },
  {
    id: "STEP_2",
    imageUrl: require("@/public/svg/Step2.svg"),
    description: "Choose Services and Provide Content",
  },
  {
    id: "STEP_3",
    imageUrl: require("@/public/svg/Step3.svg"),
    description: "Influencer accepts your order",
  },
  {
    id: "STEP_4",
    imageUrl: require("@/public/svg/Step4.svg"),
    description: "Communicate Seamlessly with the influencer",
  },
  {
    id: "STEP_5",
    imageUrl: require("@/public/svg/Step5.svg"),
    description: "Watch your Content Succeed!",
  },
];

const stepContainerStyle = {
  flex: "1",
  textAlign: "center",
};

export default function GuideContainer({}: Props) {
  return (
    <>
      <Typography variant="h5" fontWeight="bold">
        How it Works?
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "#505050" }}>
        Dive into the future of the web with top influencers.
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "64px 72px",
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
            <Typography variant="h6">{step.description}</Typography>
          </Box>
        ))}
      </Box>
    </>
  );
}
