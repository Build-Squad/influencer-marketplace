"use client";

import { Box, Grid, Link, Tab, Tabs } from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const tabs = [
  {
    title: "Orders",
    route: `/business/dashboard/orders`,
    value: 0,
    key: "orders",
  },
  {
    title: "Order Items",
    route: `/business/dashboard/order-items`,
    value: 1,
    key: "order-items",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = React.useState(0);

  useEffect(() => {
    // last part of the path
    const path = pathname.split("/").pop();
    const tab = tabs.find((tab) => tab.key === path);
    if (tab) {
      setSelectedTab(tab.value);
    }
  }, [pathname]);

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", flex: 2 }}>
            <Tabs value={selectedTab}>
              {tabs.map((tab, index) => {
                return (
                  <Link
                    key={index}
                    href={tab.route}
                    underline="none"
                    sx={{
                      textDecoration: "none",
                    }}
                    component={NextLink}
                  >
                    <Tab
                      key={index}
                      label={tab.title}
                      value={tab.value}
                      sx={{
                        color:
                          selectedTab === tab.value ? "#000000" : "#000000",
                        fontSize: "16px",
                        lineHeight: "19px",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    />
                  </Link>
                );
              })}
            </Tabs>
          </Box>
        </Grid>
      </Grid>
      <Box>{children}</Box>
    </Box>
  );
}
