"use client";
import React from "react";
import { Typography, Box, Grid } from "@mui/material";
import Image from "next/image";

type Props = {};

const WORKING_STEPS = [
  {
    id: "STEP_1",
    imageUrl: require("@/public/svg/Step1.svg"),
    description: "Explore & Pick Influencers",
  },
  {
    id: "STEP_2",
    imageUrl: require("@/public/svg/Step3.svg"),
    description: "Choose Service & Send Offers",
  },
  {
    id: "STEP_3",
    imageUrl: require("@/public/svg/Step5.svg"),
    description: "Watch your Business Grow",
  },
];

const stepContainerStyle = {
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
        How It Works?
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "#505050" }}>
        Explore, Purchase, Analyse in seconds.
      </Typography>
      <Grid
        container
        justifyContent={"space-between"}
        columnGap={"10px"}
        rowGap={"20px"}
        sx={{
          padding: "64px 72px",
          paddingBottom: "0px",
        }}
      >
        {WORKING_STEPS.map((step) => (
          <Grid
            key={step.id}
            sx={stepContainerStyle}
            xs={12}
            sm={3}
            lg={3}
            md={3}
          >
            <Image
              src={step.imageUrl}
              height={94}
              width={94}
              alt={step.description}
            />
            <Typography variant="subtitle1">{step.description}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
