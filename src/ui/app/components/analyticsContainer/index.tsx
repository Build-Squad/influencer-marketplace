import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import Vertical_Line from "@/public/svg/Vertical_Line.svg";
import Image from "next/image";

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
    <Image src={Vertical_Line} height={124} width={0} alt="" />
  </Grid>
);

const AnalyticsContainer = () => (
  <Grid
    container
    spacing={2}
    justifyContent="center"
    alignItems="center"
    sx={{
      m: 0,
      width: "100%",
      padding: "24px 40px",
      borderRadius: "32px 32px 0px 0px",
      border: "1px solid #000",
      background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
      textAlign: "left",
    }}
  >
    <AnalyticsItem value="15 M" subtitle="Total Influencer’s on X" />
    <AnalyticsItem value="500 K" subtitle="Influencers Database on Xfluence" />
    <AnalyticsItem value="2 M" subtitle="Avg. following of a XInfluencer" />
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
