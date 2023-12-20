"use client";
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
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
        background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          columnGap: "4px",
          mt: 3,
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
          width: "40%",
          textAlign: "center",
          mt: 1,
          display: "flex",
          alignItems: "flex-end",
          columnGap: "8px",
          position: "relative",
          marginBottom: "120px",
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
          position: "absolute",
          top: "100%",
          transform: "translateY(-50%)",
          px: 5,
          py: 3,
          width: "80%",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={4} sm={4} md={2} lg={2} sx={{ mb: 2 }}>
              <FiltersComponent formik={formik} type={"LANGUAGE"} />
            </Grid>
            <Grid item xs={4} sm={4} md={2} lg={2}>
              <FiltersComponent formik={formik} type={"SERVICES"} />
            </Grid>
            <Grid item xs={4} sm={4} md={2} lg={2}>
              <FiltersComponent formik={formik} type={"CATEGORIES"} />
            </Grid>
            <Grid item xs={3} sm={3} md={1.2} lg={1.2}>
              <FiltersComponent
                formik={formik}
                type={"PRICE"}
                data={{ name: "lowerPriceLimit", label: "Min. Price($)" }}
              />
            </Grid>
            <span style={{ marginTop: "24px", marginLeft: "8px" }}>-</span>
            <Grid item xs={3} sm={3} md={1.2} lg={1.2}>
              <FiltersComponent
                formik={formik}
                type={"PRICE"}
                data={{ name: "upperPriceLimit", label: "Max. Price($)" }}
              />
            </Grid>
            <Grid item xs={3} sm={3} md={1.2} lg={1.2}>
              <FiltersComponent
                formik={formik}
                type={"FOLLOWERS"}
                data={{ name: "lowerFollowerLimit", label: "Min. Followers" }}
              />
            </Grid>
            <span style={{ marginTop: "24px", marginLeft: "8px" }}>-</span>
            <Grid item xs={3} sm={3} md={1.2} lg={1.2}>
              <FiltersComponent
                formik={formik}
                type={"FOLLOWERS"}
                data={{ name: "upperPriceLimit", label: "Max. Followers" }}
              />
            </Grid>
          </Grid>
          <FiltersComponent formik={formik} type={"SEARCH"} />
        </form>
      </Box>
    </Box>
  );
}
