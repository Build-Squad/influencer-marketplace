import React, { Fragment } from "react";
import Banner from "./components/banner";
import AnalyticsContainer from "../components/analyticsContainer";
import Footer from "@/src/components/shared/footer";
import { Box, Typography } from "@mui/material";

type Props = {};

export default function Influencer({}: Props) {
  return (
    <Fragment>
      <Banner />
      <AnalyticsContainer />
      <Box
        sx={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Other Sections */}
        <Typography variant="h3" fontWeight={"bold"}>
          ... Remaining Sections ...
        </Typography>
      </Box>
      <Footer />
    </Fragment>
  );
}
