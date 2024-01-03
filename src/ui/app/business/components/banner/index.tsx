"use client";
import React from "react";
import { Box, Button, Grid, Switch, Typography } from "@mui/material";
import { BannerFilterSchema, BannerFilterInitialValues } from "./validation";
import Image from "next/image";
import Arrow from "@/public/svg/Arrow.svg";
import Star from "@/public/svg/Star.svg";
import FiltersComponent from "@/src/components/shared/filtersComponent";
import { useFormik } from "formik";

type Props = {};

export default function Banner({}: Props) {
  const formik = useFormik({
    initialValues: BannerFilterInitialValues,
    onSubmit: (values) => {
      console.log(values);
    },
    validationSchema: BannerFilterSchema,
  });
  return (
    <Box
      sx={{
        border: "1px solid #000",
        borderTop: "none",
        backgroundImage: "url(/Business_Landing_page.png)",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        paddingY: "82px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          columnGap: "4px",
        }}
      >
        <Image
          src={Star}
          height={40}
          width={34}
          alt=""
          style={{ marginBottom: "8px" }}
        />
        <Typography variant="body1">
          Strategically Match Your Business with Twitter's Finest Influencers.
        </Typography>
      </Box>
      <Box
        sx={{
          width: "60%",
          textAlign: "center",
          mt: 1,
          display: "flex",
          alignItems: "flex-end",
          columnGap: "8px",
        }}
      >
        <Typography variant="h4" fontWeight={"bold"}>
          Connecting Businesses with X Influencers for maximum impact
          <Image
            src={Arrow}
            height={24}
            width={70}
            alt=""
            style={{ marginLeft: "8px" }}
          />
        </Typography>
      </Box>

      {/* Filters Container */}
      <Box
        sx={{
          mt: 5,
          px: 5,
          py: 3,
          width: "60%",
          background: "rgba(255, 255, 255, 0.51)",
          borderRadius: "16px",
          backdropFilter: "blur(5px)",
          boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} justifyContent={"space-around"}>
            <Grid item xs={3} sm={3} md={3} lg={3} sx={{ mb: 2 }}>
              <FiltersComponent formik={formik} type={"LANGUAGE"} />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3}>
              <FiltersComponent formik={formik} type={"SERVICES"} />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3}>
              <FiltersComponent formik={formik} type={"CATEGORIES"} />
            </Grid>
            <Grid
              item
              xs={3}
              sm={3}
              md={3}
              lg={3}
              sx={{
                display: "flex",
                alignItems: "center",
                "&.MuiGrid-item": {
                  paddingTop: "0px",
                },
              }}
            >
              <Typography>Verified</Typography>
              <Switch
                color="secondary"
                checked={formik.values.isVerified}
                onChange={(e: any) => {
                  formik.setFieldValue("isVerified", e.target.checked);
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent={"space-around"}>
            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
              <FiltersComponent
                formik={formik}
                type={"PRICE"}
                data={{ name: "lowerPriceLimit", label: "Min. Price($)" }}
              />
            </Grid>
            <span style={{ marginTop: "24px" }}>-</span>
            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
              <FiltersComponent
                formik={formik}
                type={"PRICE"}
                data={{ name: "upperPriceLimit", label: "Max. Price($)" }}
              />
            </Grid>
            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
              <FiltersComponent
                formik={formik}
                type={"FOLLOWERS"}
                data={{ name: "lowerFollowerLimit", label: "Min. Followers" }}
              />
            </Grid>
            <span style={{ marginTop: "24px", marginLeft: "8px" }}>-</span>
            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
              <FiltersComponent
                formik={formik}
                type={"FOLLOWERS"}
                data={{ name: "upperPriceLimit", label: "Max. Followers" }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent={"space-around"}
            sx={{ paddingTop: "16px" }}
          >
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <FiltersComponent formik={formik} type={"SEARCH"} />
            </Grid>
          </Grid>
        </form>
      </Box>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h6">
          How can Xfluencer add to the success of your business?
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            columnGap: "8px",
            mt: 2,
          }}
        >
          {[
            "Post",
            "Thread",
            "Like",
            "Reply",
            "Pinned Tweet",
            "Quote a Post",
          ].map((it: string, ind: number) => {
            return (
              <Button
                key={ind}
                variant={"outlined"}
                color="secondary"
                sx={{
                  borderRadius: "24px",
                  border: "1px solid #7B7B7B",
                  background: "rgba(255, 255, 255, 0.40)",
                  fontSize: "20px",
                }}
              >
                {it}
              </Button>
            );
          })}
          <Typography variant="h6" fontWeight={"bold"}>
            + Much More
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
