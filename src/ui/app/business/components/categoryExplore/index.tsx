"use client";
import { Typography, Grid, Box } from "@mui/material";
import React, { useState } from "react";
import CategoryExploreCards from "./categoryExploreCards";
import { CategoriesType } from "./types";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

type Props = {};

const dummyData: Array<CategoriesType> = [
  {
    name: "FitFI",
    coverImage: "/category_explore_1.png",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tempus vestibulum elementum donec nec diam nec sapien sit.",
  },
  {
    name: "InfluenceFi",
    coverImage: "/category_explore_2.png",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tempus vestibulum elementum donec nec diam nec sapien sit.",
  },
  {
    name: "CommunicationFi",
    coverImage: "/category_explore_3.png",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tempus vestibulum elementum donec nec diam nec sapien sit.",
  },
  {
    name: "MetaFI",
    coverImage: "/category_explore_4.png",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tempus vestibulum elementum donec nec diam nec sapien sit.",
  },
];

const CARDS_PER_GROUP = 4;

export default function InfluencersContainer({}: Props) {
  const [topInfluencers, setTopInfluencers] =
    useState<CategoriesType[]>(dummyData);

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
        Explore by Category
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: "#505050",
        }}
      >
        Dive into the future of the web with top influencers
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
              <CategoryExploreCards category={inf} key={index} />
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
