import React from "react";
import CustomAutoComplete from "@/src/components/shared/customAutoComplete";
import { FormikValues, useFormik } from "formik";
import { Box, Grid, TextField, Button, Typography } from "@mui/material";
import { BannerFilterSchema, BannerFilterInitialValues } from "./validation";
import Image from "next/image";
import Arrow from "@/public/svg/Arrow.svg";
import Star from "@/public/svg/Star.svg";

type Props = {};

export default function Banner({}: Props) {
  const formik = useFormik({
    initialValues: BannerFilterInitialValues,
    onSubmit: (values) => {},
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
              <CustomAutoComplete
                isMulti={true}
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "24px",
                  },
                }}
                apiEndpoint="/core/language"
                label="Language"
                value={formik.values.languages}
                onChange={(value: any) => {
                  formik.setFieldValue("languages", value);
                }}
                onClear={() => {
                  formik.setFieldValue("languages", []);
                }}
                getOptionLabel={(option) => {
                  if (typeof option === "object" && option) {
                    if ("langEnglishName" in option) {
                      return option.langEnglishName as string;
                    } else {
                      return "";
                    }
                  } else {
                    return "";
                  }
                }}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={2} lg={2}>
              <CustomAutoComplete
                isMulti={true}
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "24px",
                  },
                }}
                apiEndpoint="/packages/servicemaster"
                label="Type of service"
                value={formik.values.serviceTypes}
                onChange={(value: any) => {
                  formik.setFieldValue("serviceTypes", value);
                }}
                onClear={() => {
                  formik.setFieldValue("serviceTypes", null);
                }}
                getOptionLabel={(option) => {
                  if (typeof option === "object" && option) {
                    if ("name" in option) {
                      return option.name as string;
                    } else {
                      return "";
                    }
                  } else {
                    return "";
                  }
                }}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={2} lg={2}>
              <CustomAutoComplete
                isMulti={true}
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "24px",
                  },
                }}
                apiEndpoint="/account/category-master"
                label="Category"
                value={formik.values.categories}
                onChange={(value: any) => {
                  formik.setFieldValue("categories", value);
                }}
                onClear={() => {
                  formik.setFieldValue("categories", null);
                }}
                getOptionLabel={(option) => {
                  if (typeof option === "object" && option) {
                    if ("name" in option) {
                      return option.name as string;
                    } else {
                      return "";
                    }
                  } else {
                    return "";
                  }
                }}
              />
            </Grid>
            <Grid item xs={3} sm={3} md={1.2} lg={1.2}>
              <TextField
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "24px",
                  },
                }}
                fullWidth
                name="lowerPriceLimit"
                label="Min. Price($)"
                value={formik.values.lowerPriceLimit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lowerPriceLimit &&
                  Boolean(formik.errors.lowerPriceLimit)
                }
                helperText={
                  formik.touched.lowerPriceLimit &&
                  formik.errors.lowerPriceLimit
                }
                variant="outlined"
                size="small"
                type="number"
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>
            <span style={{ marginTop: "16px", marginLeft: "8px" }}>-</span>
            <Grid item xs={3} sm={3} md={1.2} lg={1.2}>
              <TextField
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "24px",
                  },
                }}
                fullWidth
                name="upperPriceLimit"
                label="Max. Price($)"
                value={formik.values.upperPriceLimit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.upperPriceLimit &&
                  Boolean(formik.errors.upperPriceLimit)
                }
                helperText={
                  formik.touched.upperPriceLimit &&
                  formik.errors.upperPriceLimit
                }
                variant="outlined"
                size="small"
                type="number"
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>
            <Grid item xs={3} sm={3} md={1.2} lg={1.2}>
              <TextField
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "24px",
                  },
                }}
                fullWidth
                id="lowerFollowerLimit"
                name="lowerFollowerLimit"
                label="Min. Followers"
                value={formik.values.lowerFollowerLimit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lowerFollowerLimit &&
                  Boolean(formik.errors.lowerFollowerLimit)
                }
                helperText={
                  formik.touched.lowerFollowerLimit &&
                  formik.errors.lowerFollowerLimit
                }
                variant="outlined"
                size="small"
                type="number"
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>
            <span style={{ marginTop: "16px", marginLeft: "8px" }}>-</span>
            <Grid item xs={3} sm={3} md={1.2} lg={1.2}>
              <TextField
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "24px",
                  },
                }}
                fullWidth
                id="upperFollowerLimit"
                name="upperFollowerLimit"
                label="Max. Followers"
                value={formik.values.upperFollowerLimit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.upperFollowerLimit &&
                  Boolean(formik.errors.upperFollowerLimit)
                }
                helperText={
                  formik.touched.upperFollowerLimit &&
                  formik.errors.upperFollowerLimit
                }
                variant="outlined"
                size="small"
                type="number"
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>
          </Grid>
          <TextField
            name="searchString"
            value={formik.values.searchString}
            onChange={formik.handleChange}
            sx={{
              ".MuiInputBase-root": {
                borderRadius: "24px",
              },
            }}
            fullWidth
            id="standard-bare"
            variant="outlined"
            placeholder="Search Influencers by Category or Username"
            InputProps={{
              endAdornment: (
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{
                    borderRadius: "28px",
                    fontWeight: "bold",
                    px: 4,
                  }}
                  onClick={() => {}}
                >
                  Search
                </Button>
              ),
            }}
          />
        </form>
      </Box>
    </Box>
  );
}
