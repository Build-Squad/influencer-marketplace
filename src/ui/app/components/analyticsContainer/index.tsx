import React from "react";
import { Box, Typography, Grid } from "@mui/material";

type AnalyticsDataItem = {
  value: string;
  subtitle: string;
  isLast?: boolean;
};

type AnalyticsRoleData = {
  role: string;
  data1: AnalyticsDataItem;
  data2: AnalyticsDataItem;
  data3: AnalyticsDataItem;
  data4: AnalyticsDataItem;
};

type AnalyticsContainerProps = {
  role: string;
};

const ANALYTICS_DATA: AnalyticsRoleData[] = [
  {
    role: "business",
    data1: {
      value: "69 %",
      subtitle: "Consumer trust influencer",
    },
    data2: {
      value: "76 %",
      subtitle:
        "Users say they bought something after a recommendation from X.",
    },
    data3: {
      value: "238 M",
      subtitle: "Monthly Active Users (MAU)",
    },
    data4: {
      value: "79 %",
      subtitle: "Of users use X as a news site",
    },
  },
  {
    role: "influencer",
    data1: {
      value: "47.3 %",
      subtitle: "Of all influences are mirco influencers",
    },
    data2: {
      value: "70.2",
      subtitle: "Average number of posts per week",
    },
    data3: {
      value: "$ 214",
      subtitle: "Brands spends per influencer collab",
    },
    data4: {
      value: "440 M",
      subtitle: "Total Users on X",
    },
  },
];

const AnalyticsItem: React.FC<AnalyticsDataItem> = ({
  value,
  subtitle,
  isLast,
}) => (
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
      viewBox="0 0 2 100%"
      fill="none"
      style={{ visibility: isLast ? "hidden" : "visible" }}
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

const AnalyticsContainer: React.FC<AnalyticsContainerProps> = ({ role }) => (
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
    {ANALYTICS_DATA.filter((item) => item.role === role).map((item) => (
      <React.Fragment key={item.role}>
        <AnalyticsItem {...item.data1} />
        <AnalyticsItem {...item.data2} />
        <AnalyticsItem {...item.data3} />
        <AnalyticsItem {...item.data4} isLast={true} />
      </React.Fragment>
    ))}
  </Grid>
);

export default AnalyticsContainer;
