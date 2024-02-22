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
import { useRouter } from "next/navigation";
import ScrollTop from "@/public/svg/ScrollTop.svg";
import Image from "next/image";

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
  const router = useRouter();
  const [topInfluencers, setTopInfluencers] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 200) {
        // Adjust this value as needed
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getPrice = (inf: any, type = "max") => {
    const services = inf.service_types || [];
    const comparator = type === "max" ? Math.max : Math.min;

    if (services.length === 0) {
      return "0";
    }

    const price = comparator(...services.map((service: any) => service.price));
    const serviceWithPrice = services.find(
      (service: any) => service.price === price
    );

    return `${price}${serviceWithPrice.currencySymbol}`;
  };

  const getTopInfluencers = async () => {
    const { isSuccess, data, message } = await getService(
      "/account/top-influencers/"
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
          minPrice: getPrice(inf, "min"),
          maxPrice: getPrice(inf, "max"),
          rating: inf.rating || 0,
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
      {isVisible && (
        <div
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "6px",
            right: "16px",
            cursor: "pointer",
            zIndex: "10",
          }}
        >
          <Image src={ScrollTop} alt="ScrollTop" height={50} />
        </div>
      )}
    </Box>
  );
}
