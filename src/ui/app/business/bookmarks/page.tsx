"use client";

import { Box, Typography, Grid, Pagination, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfluencersCards from "../components/influencersContainer/influencersCards";
import { getService } from "@/src/services/httpServices";
import { notification } from "@/src/components/shared/notification";
import RouteProtection from "@/src/components/shared/routeProtection";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";

type InfluencersType = {
  id: string;
  name: string;
  twitterUsername: string;
  profileUrl: string;
  services: string[];
  followers: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  is_bookmarked?: boolean | null;
};

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

export default function BookmarksPage() {
  const [influencersData, setInfluencersData] = useState<InfluencersType[]>();
  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 12,
  });
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const getPrice = (inf: any, type = "max") => {
    if (type == "max") {
      if (inf.service_types && inf.service_types.length > 0) {
        const services = inf.service_types;
        const maxService = services.reduce((max: any, service: any) =>
          service.price > max.price ? service : max
        );
        return `${maxService.price}${maxService.currencySymbol}`;
      } else {
        return `${0}`;
      }
    } else {
      if (inf.service_types && inf.service_types.length > 0) {
        const services = inf.service_types;
        const minService = services.reduce((min: any, service: any) =>
          service.price < min.price ? service : min
        );
        return `${minService.price}${minService.currencySymbol}`;
      } else {
        return `${0}`;
      }
    }
  };

  const getInfluencers = async (filterData?: any) => {
    try {
      setLoading(true);
      const { isSuccess, data, message } = await getService(
        "/account/bookmarks/",
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
              ? inf.service_types
                  .filter(
                    (service: any) => service.packageStatus == "published"
                  )
                  .map((service: any) => service.serviceType)
              : [],

            followers: formatTwitterFollowers(inf.followers_count),
            minPrice: getPrice(inf, "min"),
            maxPrice: getPrice(inf, "max"),
            rating: inf.rating || 0,
            is_bookmarked: inf?.is_bookmarked,
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
    } finally {
      setLoading(false);
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

  useEffect(() => {
    getInfluencers();
  }, [pagination.current_page_number]);

  useEffect(() => {
    if (refresh) {
      getInfluencers();
      setRefresh(false);
    }
  }, [refresh]);

  return (
    <RouteProtection logged_in={true} business_owner={true}>
      <Box sx={{ px: 3, py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
          <Typography variant="h5">Bookmarks</Typography> -
          <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
            {pagination?.total_data_count ?? 0} Results
          </Typography>
        </Box>
        <Grid
          container
          spacing={3}
          mt={0}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {loading ? (
            <>
              {[...Array(12)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={200}
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
              ))}
            </>
          ) : (
            <>
              {influencersData && influencersData?.length > 0 ? (
                <>
                  {influencersData?.map((inf, index) => {
                    return (
                      <InfluencersCards
                        influencer={inf}
                        key={index}
                        setRefresh={setRefresh}
                      />
                    );
                  })}
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "70vh",
                    flexDirection: "column",
                  }}
                >
                  <BookmarkAddOutlinedIcon sx={{ fontSize: 150 }} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontStyle: "italic",
                    }}
                  >
                    Bookmark Influencers to see them here
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Grid>
        {influencersData && influencersData?.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <Pagination
              shape="rounded"
              color="secondary"
              count={pagination.total_page_count}
              page={pagination.current_page_number}
              onChange={handlePaginationChange}
            />
          </Box>
        )}
      </Box>
    </RouteProtection>
  );
}
