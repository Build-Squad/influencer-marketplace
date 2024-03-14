"use client";
import { Typography, Grid, Box } from "@mui/material";
import React, { useState } from "react";
import InfluencersCards from "./influencersCards";
import { TopInfluencersType } from "./types";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

type Props = {
  topInfluencers: TopInfluencersType[];
};

const CARDS_PER_GROUP = 4;

export default function InfluencersContainer({ topInfluencers }: Props) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  const handleBack = () => {
    setCurrentGroupIndex((prevIndex) =>
      prevIndex > 0
        ? prevIndex - 1
        : Math.floor(topInfluencers.length / CARDS_PER_GROUP) - 1
    );
  };

  const handleForward = () => {
    setCurrentGroupIndex((prevIndex) =>
      prevIndex < Math.floor(topInfluencers.length / CARDS_PER_GROUP) - 1
        ? prevIndex + 1
        : 0
    );
  };
  const startCardIndex = currentGroupIndex * CARDS_PER_GROUP;
  const endCardIndex = startCardIndex + CARDS_PER_GROUP;

  const displayedInfluencers = topInfluencers.slice(
    startCardIndex,
    endCardIndex
  );

  return (
    <>
      <Typography variant="h5" fontWeight="bold">
        Top Influencers
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: "#505050",
        }}
      >
        Work with the best.
      </Typography>
      <Grid container mt={3} justifyContent="center" alignItems="center">
        <Grid item>
          <ArrowBackIos onClick={handleBack} sx={{ cursor: "pointer" }} />
        </Grid>
        <Grid item flex={1}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {displayedInfluencers.map((inf, index) => (
              <InfluencersCards influencer={inf} key={index} />
            ))}
          </Box>
        </Grid>
        <Grid item>
          <ArrowForwardIos onClick={handleForward} sx={{ cursor: "pointer" }} />
        </Grid>
      </Grid>
    </>
  );
}
