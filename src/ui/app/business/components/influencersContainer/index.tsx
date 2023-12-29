"use client";
import { Typography, Grid, Box } from "@mui/material";
import React, { useState } from "react";
import InfluencersCards from "./influencersCards";
import { TopInfluencersType } from "./types";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

type Props = {};

const dummyData: Array<TopInfluencersType> = [
  {
    name: "Parikshit Singh",
    twitterUsername: "ParikshitSingh567",
    profileUrl:
      "https://miro.medium.com/v2/resize:fit:720/format:webp/0*1WJiB8mUJKcylomi.jpg",
    services: ["Story", "Post", "Repost", "Thread"],
    location: "Hyderabad, India",
    minPrice: 100,
    maxPrice: 500,
  },
  {
    name: "Shyam Visamsetty",
    twitterUsername: "shyamvisamsetty",
    profileUrl:
      "https://miro.medium.com/v2/resize:fit:720/format:webp/0*1WJiB8mUJKcylomi.jpg",
    services: ["Post", "Repost", "Thread"],
    location: "Madrid, Spain",
    minPrice: 100,
    maxPrice: 200,
  },
  {
    name: "Mudit Sethi",
    twitterUsername: "alphamudit",
    profileUrl:
      "https://miro.medium.com/v2/resize:fit:720/format:webp/0*1WJiB8mUJKcylomi.jpg",
    services: ["Like", "Repost", "Thread"],
    location: "Punjab, India",
    minPrice: 1200,
    maxPrice: 2800,
  },
  {
    name: "Laxmi Jangid",
    twitterUsername: "laxjangid1",
    profileUrl:
      "https://miro.medium.com/v2/resize:fit:720/format:webp/0*1WJiB8mUJKcylomi.jpg",
    services: ["Post", "Repost", "Thread", "Post"],
    location: "Madrid, Spain",
    minPrice: 11200,
    maxPrice: 34400,
  },
  {
    name: "Mudit Sethi",
    twitterUsername: "alphamudit",
    profileUrl:
      "https://miro.medium.com/v2/resize:fit:720/format:webp/0*1WJiB8mUJKcylomi.jpg",
    services: ["Like", "Repost", "Thread"],
    location: "Punjab, India",
    minPrice: 1200,
    maxPrice: 2800,
  },
  {
    name: "Laxmi Jangid",
    twitterUsername: "laxjangid1",
    profileUrl:
      "https://miro.medium.com/v2/resize:fit:720/format:webp/0*1WJiB8mUJKcylomi.jpg",
    services: ["Post", "Repost", "Thread", "Post"],
    location: "Madrid, Spain",
    minPrice: 11200,
    maxPrice: 34400,
  },
  {
    name: "Parikshit Singh",
    twitterUsername: "ParikshitSingh567",
    profileUrl:
      "https://miro.medium.com/v2/resize:fit:720/format:webp/0*1WJiB8mUJKcylomi.jpg",
    services: ["Story", "Post", "Repost", "Thread"],
    location: "Hyderabad, India",
    minPrice: 100,
    maxPrice: 500,
  },
  {
    name: "Shyam Visamsetty",
    twitterUsername: "shyamvisamsetty",
    profileUrl:
      "https://miro.medium.com/v2/resize:fit:720/format:webp/0*1WJiB8mUJKcylomi.jpg",
    services: ["Post", "Repost", "Thread"],
    location: "Madrid, Spain",
    minPrice: 100,
    maxPrice: 200,
  },
];

const CARDS_PER_GROUP = 4;

export default function InfluencersContainer({}: Props) {
  const [topInfluencers, setTopInfluencers] =
    useState<TopInfluencersType[]>(dummyData);

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
        Dive into the future of the web with top influencers.
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
