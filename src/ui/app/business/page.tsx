import { Box } from "@mui/material";
import Banner from "./components/banner";
import InfluencersContainer from "./components/influencersContainer";
import GuideContainer from "./components/guideContainer";
import AnalyticsContainer from "../components/analyticsContainer";
import Footer from "@/src/components/shared/footer";

export default function BusinessHome() {
  return (
    <Box>
      {/* Filter's container */}
      <Banner />
      {/* Influencers section */}
      <Box sx={{ marginTop: "120px", marginX: "40px", textAlign: "center" }}>
        <InfluencersContainer />
      </Box>
      {/* Guide section */}
      <Box sx={{ marginTop: "84px", textAlign: "center" }}>
        <GuideContainer />
      </Box>
      {/* Analytics section */}
      <Box sx={{ marginTop: "24px", textAlign: "center" }}>
        <AnalyticsContainer />
      </Box>
      {/* Footer */}
      <Footer />
    </Box>
  );
}
