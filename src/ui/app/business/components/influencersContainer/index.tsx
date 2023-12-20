"use client";
import { Typography, Grid } from "@mui/material";
import React, { useState } from "react";
import InfluencersCards from "./influencersCards";
import { TopInfluencersType } from "./types";

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

export default function InfluencersContainer({}: Props) {
  const [topInfluencers, setTopInfluencers] =
    useState<TopInfluencersType[]>(dummyData);
  return (
    <>
      <Typography variant="h5" fontWeight={"bold"}>
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
      <Grid
        container
        spacing={3}
        mt={0}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {topInfluencers.map((inf, index) => {
          return <InfluencersCards influencer={inf} key={index} />;
        })}
      </Grid>
    </>
  );
}
