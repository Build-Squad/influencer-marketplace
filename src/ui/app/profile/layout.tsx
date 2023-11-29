"use client";

import { Box, Grid, Typography, Tabs, Tab } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const tabs = [
  {
    value: "services",
    label: "Services",
  },
  {
    value: "packages",
    label: "Packages",
  },
];

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const [tab, setTab] = React.useState<string>("services");
  const router = useRouter();

  useEffect(() => {
    router.push(`/profile/${tab}`);
  }, [tab]);

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4">Profile</Typography>
        </Grid>
        <Grid item xs={12}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{
              my: 2,
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                sx={{
                  textTransform: "none",
                }}
              />
            ))}
          </Tabs>
        </Grid>
        <>{children}</>
      </Grid>
    </Box>
  );
};

export default ProfileLayout;
