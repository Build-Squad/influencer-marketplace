import React, { Fragment } from "react";
import Banner from "./components/banner";
import AnalyticsContainer from "../components/analyticsContainer";
import Footer from "@/src/components/shared/footer";
import { Box, Typography } from "@mui/material";
import GuideContainer from "./components/guideContainer";
import FAQSection from "./components/faqSection";
import ElevateSection from "./components/elevateSection";

type Props = {};

export default function Influencer({}: Props) {
  return (
    <Fragment>
      <Banner />
      <AnalyticsContainer />
      <Box
        sx={{
          marginX: "40px",
          marginTop: "84px",
          textAlign: "center",
        }}
      >
        <GuideContainer />
      </Box>
      <Box
        sx={{
          marginX: "40px",
          marginTop: "84px",
          textAlign: "center",
        }}
      >
        <ElevateSection />
      </Box>
      <Box
        sx={{
          marginX: "40px",
          marginTop: "84px",
          textAlign: "center",
        }}
      >
        <FAQSection />
      </Box>

      <Footer />
    </Fragment>
  );
}
