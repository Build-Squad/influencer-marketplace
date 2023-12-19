"use client";
import { Box, Grid, Pagination, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { ExploreFilterInitialValues, ExploreFilterSchema } from "./validation";
import ExploreFilters from "./components/exploreFilters";
import Footer from "@/src/components/shared/footer";
import InfluencersCards from "../components/influencersContainer/influencersCards";

type TopInfluencersType = {
  name: string;
  twitterUsername: string;
  profileUrl: string;
  services: string[];
  location: string;
  minPrice: number;
  maxPrice: number;
};

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

export default function Explore({}: Props) {
  const [topInfluencers, setTopInfluencers] =
    useState<TopInfluencersType[]>(dummyData);

  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 10,
    current_page_number: 1,
    current_page_size: 5,
  });
  const formik = useFormik({
    initialValues: ExploreFilterInitialValues,
    onSubmit: (values) => {
      console.log(values);
    },
    validationSchema: ExploreFilterSchema,
  });

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setPagination((prev) => ({
      ...prev,
      current_page_number: page,
    }));
  };
  return (
    <>
      {/* Filters section */}
      <Box
        sx={{
          mt: 2,
          p: 3,
          background: `url(/ExplorePage.png) center / cover`,
        }}
      >
        <ExploreFilters formik={formik} />
      </Box>

      {/* Top Influencers section */}
      <Box sx={{ px: 3, py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "baseline", columnGap: "8px" }}>
          <Typography variant="h5">Top Matches</Typography> -
          <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
            20 Results
          </Typography>
        </Box>
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
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <Pagination
            shape="rounded"
            color="secondary"
            count={pagination.total_page_count}
            page={pagination.current_page_number}
            onChange={handlePaginationChange}
          />
        </Box>
      </Box>

      {/* Footer Section */}
      <Footer />
    </>
  );
}
