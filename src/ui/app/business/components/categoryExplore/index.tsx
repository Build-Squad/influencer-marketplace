"use client";
import { Typography, Grid, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import CategoryExploreCards from "./categoryExploreCards";
import { CategoriesType } from "./types";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { getService } from "@/src/services/httpServices";
import { notification } from "@/src/components/shared/notification";

type Props = {};

const CARDS_PER_GROUP = 4;

export default function InfluencersContainer({}: Props) {
  const [allCategoryMasters, setAllCategoryMasters] = React.useState<
    CategoriesType[]
  >([]);

  const getCategoryMasters = async () => {
    const { isSuccess, data, message } = await getService(
      "/account/category-master/",
      {
        page_size: 8,
        page_number: 1,
        show_on_main: true,
      }
    );
    if (isSuccess) {
      const _allCategoryMasters = data?.data?.map(
        (categoryMaster: CategoryMasterType) => {
          return {
            ...categoryMaster,
            coverImage: `/category_explore_${
              Math.floor(Math.random() * 4) + 1
            }.png`,
          };
        }
      );
      setAllCategoryMasters(_allCategoryMasters);
    } else {
      notification(message ? message : "Something went wrong", "error");
    }
  };

  useEffect(() => {
    getCategoryMasters();
  }, []);

  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  const handleBack = () => {
    setCurrentGroupIndex((prevIndex) =>
      prevIndex > 0
        ? prevIndex - 1
        : Math.floor(allCategoryMasters.length / CARDS_PER_GROUP) - 1
    );
  };

  const handleForward = () => {
    setCurrentGroupIndex((prevIndex) =>
      prevIndex < Math.floor(allCategoryMasters.length / CARDS_PER_GROUP) - 1
        ? prevIndex + 1
        : 0
    );
  };
  const startCardIndex = currentGroupIndex * CARDS_PER_GROUP;
  const endCardIndex = startCardIndex + CARDS_PER_GROUP;

  const displayedCategories = allCategoryMasters.slice(
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
            {displayedCategories.map((inf, index) => (
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
