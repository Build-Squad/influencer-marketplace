import React from "react";
import { Box, Typography, Grid } from "@mui/material";

type AnalyticsItemProps = {
  value: String;
  subtitle: String;
};

const AnalyticsItem = ({ value, subtitle }: AnalyticsItemProps) => (
  <Grid
    item
    xs={12}
    sm={12}
    md={3}
    lg={3}
    justifyContent="space-around"
    alignItems="center"
    display="flex"
  >
    <Box>
      <Typography variant="h4" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="subtitle1">{subtitle}</Typography>
    </Box>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2"
      height="126"
      viewBox="0 0 2 126"
      fill="none"
    >
      <path
        d="M1 1L0.999995 125"
        stroke="white"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
    </svg>
  </Grid>
);

const AnalyticsContainer = () => (
  <Grid
    container
    spacing={2}
    justifyContent="center"
    alignItems="center"
    sx={{
      color: "white",
      m: 0,
      width: "100%",
      padding: "24px 40px",
      borderRadius: "32px 32px 0px 0px",
      border: "1px solid #000",
      background: "black",
      textAlign: "left",
    }}
  >
    <AnalyticsItem value="15 M" subtitle="Total Influencer’s on X" />
    <AnalyticsItem value="500 K" subtitle="Influencers Database on Xfluencer" />
    <AnalyticsItem value="2 M" subtitle="Avg. following of a Xfluencer" />
    <Grid item xs={12} sm={12} md={3} lg={3}>
      <Typography variant="h4" fontWeight="bold">
        15 M
      </Typography>
      <Typography variant="subtitle1">
        Avg. impressions of Xfluencers
      </Typography>
    </Grid>
  </Grid>
);

export default AnalyticsContainer;
