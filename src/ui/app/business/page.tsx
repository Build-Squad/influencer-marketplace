"use client";
import { Box } from "@mui/material";
import Banner from "./components/banner";
import InfluencersContainer from "./components/influencersContainer";
import GuideContainer from "./components/guideContainer";
import AnalyticsContainer from "../components/analyticsContainer";
import CategoryExplore from "./components/categoryExplore";
import Footer from "@/src/components/shared/footer";
import ElevateSection from "./components/elevateSection";
import FAQSection from "./components/faqSection";
import { useEffect, useState } from "react";
import { getService } from "@/src/services/httpServices";
import { notification } from "@/src/components/shared/notification";

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

export default function BusinessHome() {
  const [topInfluencers, setTopInfluencers] = useState([]);

  const getTopInfluencers = async () => {
    const { isSuccess, data, message } = await getService(
      "/account/twitter-account/",
      {
        page_number: 1,
        page_size: 8,
        lowerFollowerLimit: "500",
      }
    );
    if (isSuccess) {
      const filteredData = data?.data?.map((inf: any) => {
        return {
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
      setTopInfluencers(filteredData);
    } else {
      notification(message ? message : "Something went wrong", "error");
    }
  };

  useEffect(() => {
    getTopInfluencers();
  }, []);
  return (
    <Box sx={{ textAlign: "center" }}>
      {/* Filter's container */}
      <Banner />
      {/* Analytics section */}
      <Box
        sx={{
          position: "relative",
          zIndex: "1",
          marginTop: "-30px",
        }}
      >
        <AnalyticsContainer />
      </Box>
      {/* Influencers section */}
      <Box sx={{ marginTop: "40px", marginX: "40px" }}>
        <InfluencersContainer topInfluencers={topInfluencers} />
      </Box>
      {/* Category Explore section */}
      <Box sx={{ marginTop: "40px", marginX: "40px" }}>
        <CategoryExplore />
      </Box>
      {/* Guide section */}
      <Box
        sx={{
          marginX: "40px",
          marginTop: "84px",
        }}
      >
        <GuideContainer />
      </Box>
      <Box
        sx={{
          marginX: "40px",
          marginTop: "84px",
        }}
      >
        <ElevateSection />
      </Box>
      <Box
        sx={{
          marginX: "40px",
          marginTop: "84px",
        }}
      >
        <FAQSection />
      </Box>
      {/* Footer */}
      <Footer />
    </Box>
  );
}
