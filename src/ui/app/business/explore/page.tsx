"use client";
import { Box, Grid, Pagination, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { ExploreFilterInitialValues, ExploreFilterSchema } from "./validation";
import ExploreFilters from "./components/exploreFilters";
import Footer from "@/src/components/shared/footer";
import InfluencersCards from "../components/influencersContainer/influencersCards";
import { getService } from "@/src/services/httpServices";
import { notification } from "@/src/components/shared/notification";

type InfluencersType = {
  id: string;
  name: string;
  twitterUsername: string;
  profileUrl: string;
  services: string[];
  followers: string;
  minPrice: number;
  maxPrice: number;
};

type Props = {};

const formatTwitterFollowers = (followersCount: any) => {
  if (followersCount >= 1000000) {
    // Convert to millions format
    return `${(followersCount / 1000000).toFixed(1)}M`;
  } else if (followersCount >= 1000) {
    // Convert to thousands format
    return `${(followersCount / 1000).toFixed(1)}K`;
  } else {
    // Leave as is
    return followersCount?.toString();
  }
};

export default function Explore({}: Props) {
  const [influencersData, setInfluencersData] = useState<InfluencersType[]>();

  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 12,
  });
  const formik = useFormik({
    initialValues: ExploreFilterInitialValues,
    onSubmit: (values) => {
      getInfluencers(values);
    },
    validationSchema: ExploreFilterSchema,
  });

  useEffect(() => {
    getInfluencers();
  }, [pagination.current_page_number]);

  useEffect(() => {
    let filterData: any = localStorage.getItem("filterData");
    filterData = filterData ? JSON.parse(filterData) : null;

    if (filterData) {
      formik.setFieldValue("categories", filterData?.categories);
    }
    getInfluencers(filterData);
  }, []);

  const getInfluencers = async (filterData?: any) => {
    const { isSuccess, data, message } = await getService(
      "/account/twitter-account/",
      {
        page_number: pagination?.current_page_number,
        page_size: pagination?.current_page_size,
        ...filterData,
        regions: filterData?.regions?.map((item: any) => item.regionName),
        categories: filterData?.categories?.map((item: any) => item.name),
        serviceTypes: filterData?.serviceTypes?.map((item: any) => item.name),
      }
    );
    if (isSuccess) {
      const filteredData = data?.data?.map((inf: any) => {
        return {
          id: inf.user_id,
          name: inf.name || "",
          twitterUsername: inf.user_name || "",
          profileUrl: inf.profile_image_url || "",
          services: inf.service_types
            ? inf.service_types.map((service: any) => service.serviceType)
            : [],

          followers: formatTwitterFollowers(inf.followers_count),
          minPrice:
            inf.service_types && inf.service_types.length > 0
              ? Math.min(
                  ...inf.service_types.map((service: any) => service.price)
                )
              : 0,
          maxPrice:
            inf.service_types && inf.service_types.length > 0
              ? Math.max(
                  ...inf.service_types.map((service: any) => service.price)
                )
              : 0,
        };
      });
      setPagination({
        ...pagination,
        total_data_count: data?.pagination?.total_data_count,
        total_page_count: data?.pagination?.total_page_count,
      });
      setInfluencersData(filteredData);
    } else {
      notification(message ? message : "Something went wrong", "error");
    }
  };

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
            {pagination?.total_data_count ?? 0} Results
          </Typography>
        </Box>
        <Grid
          container
          spacing={3}
          mt={0}
          justifyContent={"flex-start"}
          alignItems={"center"}
        >
          {influencersData?.map((inf, index) => {
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
