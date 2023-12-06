"use client";

import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();

  useEffect(() => {
    const urlTab = pathname.split("/")[2]; // assuming the tab is the third part of the URL
    if (urlTab && tabs.some((t) => t.value === urlTab)) {
      if (urlTab !== tab) {
        setTab(urlTab);
      }
    } else {
      setTab(tabs[0].value);
    }
  }, [pathname, router]);

  useEffect(() => {
    if (tab) {
      router.push(`/profile/${tab}`);
    }
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
