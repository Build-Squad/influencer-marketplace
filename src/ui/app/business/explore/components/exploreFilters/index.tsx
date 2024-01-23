import FiltersComponent from "@/src/components/shared/filtersComponent";
import { FilterList } from "@mui/icons-material";
import { Box, Grid, Switch, Typography } from "@mui/material";
import React from "react";

export default function ExploreFilters({ formik }: any) {
  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "8px",
      }}
    >
      <Box sx={{ display: "flex", mt: 1, columnGap: "2px" }}>
        <FilterList sx={{ marginTop: "2px" }} />
        <Typography variant="h6">Filters</Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} alignItems={"center"} sx={{mb:2}}>
            <Grid item xs={4} sm={4} md={2} lg={2}>
              <FiltersComponent formik={formik} type={"LANGUAGE"} />
            </Grid>
            <Grid item xs={4} sm={4} md={2} lg={2}>
              <FiltersComponent formik={formik} type={"SERVICES"} />
            </Grid>
            <Grid item xs={4} sm={4} md={2} lg={2}>
              <FiltersComponent formik={formik} type={"CATEGORIES"} />
            </Grid>
            <Grid item xs={3} sm={3} md={1.2} lg={1}>
              <FiltersComponent
                formik={formik}
                type={"PRICE"}
                data={{ name: "lowerPriceLimit", label: "Min. Price($)" }}
              />
            </Grid>
            <span style={{ marginTop: "24px", marginLeft: "8px" }}>-</span>
            <Grid item xs={3} sm={3} md={1.2} lg={1}>
              <FiltersComponent
                formik={formik}
                type={"PRICE"}
                data={{ name: "upperPriceLimit", label: "Max. Price($)" }}
              />
            </Grid>
            <Grid item xs={3} sm={3} md={1.2} lg={1}>
              <FiltersComponent
                formik={formik}
                type={"FOLLOWERS"}
                data={{ name: "lowerFollowerLimit", label: "Min. Followers" }}
              />
            </Grid>
            <span style={{ marginTop: "24px", marginLeft: "8px" }}>-</span>
            <Grid item xs={3} sm={3} md={1.2} lg={1}>
              <FiltersComponent
                formik={formik}
                type={"FOLLOWERS"}
                data={{ name: "upperFollowerLimit", label: "Max. Followers" }}
              />
            </Grid>
            <Grid
              item
              xs={3}
              sm={3}
              md={2}
              lg={1}
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
          <FiltersComponent formik={formik} type={"SEARCH"} />
        </form>
      </Box>
    </Box>
  );
}
