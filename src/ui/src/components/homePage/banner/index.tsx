import React from "react";
import CustomAutoComplete from "@/src/components/shared/customAutoComplete";
import { FormikValues, useFormik } from "formik";
import { Box, Grid, TextField, Button } from "@mui/material";
import { BannerFilterSchema, BannerFilterInitialValues } from "./validation";
import { SearchOutlined } from "@mui/icons-material";

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
      <Grid container spacing={2}>
        <Grid item xs={4} sm={4} md={2} lg={2}>
          <CustomAutoComplete
            apiEndpoint="/core/language"
            label="Language"
            placeholder="Select Language"
            value={formik.values.language}
            onChange={(value) => {
              console.log("on change value == ", value);
            }}
            onClear={() => {
              formik.setFieldValue("language", []);
            }}
            helperText={
              formik.touched.language && formik.errors.language
                ? formik.errors.language
                : " "
            }
            error={formik.touched.language && Boolean(formik.errors.language)}
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
            isOptionEqualToValue={(option, value) => {
              if (typeof option === "object" && option) {
                if ("id" in option) {
                  return option.id === value;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            }}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={2} lg={2}>
          <CustomAutoComplete
            apiEndpoint="/core/services"
            label="Type of service"
            placeholder="Select type of Service"
            value={formik.values.serviceType}
            onChange={(value) => {
              console.log("on change value == ", value);
            }}
            onClear={() => {
              formik.setFieldValue("serviceType", []);
            }}
            error={
              formik.touched.serviceType && Boolean(formik.errors.serviceType)
            }
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
            isOptionEqualToValue={(option, value) => {
              if (typeof option === "object" && option) {
                if ("id" in option) {
                  return option.id === value;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            }}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={2} lg={2}>
          <CustomAutoComplete
            apiEndpoint="/core/category"
            label="Category"
            placeholder="Select Category"
            value={formik.values.category}
            onChange={(value) => {
              console.log("on change value == ", value);
            }}
            onClear={() => {
              formik.setFieldValue("category", []);
            }}
            error={formik.touched.category && Boolean(formik.errors.category)}
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
            isOptionEqualToValue={(option, value) => {
              if (typeof option === "object" && option) {
                if ("id" in option) {
                  return option.id === value;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            }}
          />
        </Grid>
        <Grid item xs={3} sm={3} md={1.2} lg={1.2}>
          <TextField
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
              formik.touched.lowerPriceLimit && formik.errors.lowerPriceLimit
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
              formik.touched.upperPriceLimit && formik.errors.upperPriceLimit
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
        fullWidth
        id="standard-bare"
        variant="outlined"
        placeholder="Search Influencers by Category or Username"
        InputProps={{
          endAdornment: (
            <Button
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
    </Box>
  );
}
