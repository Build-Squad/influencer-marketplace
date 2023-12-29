import { Box } from "@mui/material";
import Banner from "./components/banner";
import InfluencersContainer from "./components/influencersContainer";
import GuideContainer from "./components/guideContainer";
import AnalyticsContainer from "../components/analyticsContainer";
import CategoryExplore from "./components/categoryExplore";
import Footer from "@/src/components/shared/footer";
import ElevateSection from "./components/elevateSection";
import FAQSection from "./components/faqSection";

export default function BusinessHome() {
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
        <InfluencersContainer />
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
