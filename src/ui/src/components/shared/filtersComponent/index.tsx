import CustomAutoComplete from "@/src/components/shared/customAutoComplete";
import { Button, TextField } from "@mui/material";
import React from "react";

type FiltersComponentsType = {
  formik: any;
  type: string;
  data?: {
    name: string;
    label: string;
  };
};

const styles = {
  inputBoxBorderStyles: {
    ".MuiInputBase-root": {
      borderRadius: "24px",
      backgroundColor: "white",
    },
    ".MuiOutlinedInput-notchedOutline": {
      border: "1px solid black",
    },
  },
};

export default function FiltersComponent({
  formik,
  type,
  data,
}: FiltersComponentsType) {
  switch (type) {
    case "LANGUAGE":
      return (
        <CustomAutoComplete
          isMulti={true}
          sx={styles.inputBoxBorderStyles}
          apiEndpoint="/core/language-master"
          label="Language"
          value={formik.values.languages}
          helperText="Enter keywords for languages"
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
          isOptionEqualToValue={(option: any, value: any) => {
            return option.id === value.id;
          }}
          size="medium"
        />
      );
    case "REGION":
      return (
        <CustomAutoComplete
          isMulti={true}
          sx={styles.inputBoxBorderStyles}
          apiEndpoint="/core/regions-master/"
          label="Region"
          value={formik.values.regions}
          helperText="Enter keywords for Region"
          onChange={(value: any) => {
            formik.setFieldValue("regions", value);
          }}
          onClear={() => {
            formik.setFieldValue("regions", []);
          }}
          getOptionLabel={(option) => {
            if (typeof option === "object" && option) {
              if ("regionName" in option) {
                return option.regionName as string;
              } else {
                return "";
              }
            } else {
              return "";
            }
          }}
          isOptionEqualToValue={(option: any, value: any) => {
            return option.id === value.id;
          }}
          size="medium"
        />
      );
    case "SERVICES":
      return (
        <CustomAutoComplete
          isMulti={true}
          sx={styles.inputBoxBorderStyles}
          apiEndpoint="/packages/servicemaster"
          label="Type of service"
          value={formik.values.serviceTypes}
          helperText="Enter keywords for services"
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
          isOptionEqualToValue={(option: any, value: any) => {
            return option.id === value.id;
          }}
          size="medium"
        />
      );
    case "CATEGORIES":
      return (
        <CustomAutoComplete
          isMulti={true}
          sx={styles.inputBoxBorderStyles}
          apiEndpoint="/account/category-master"
          label="Category"
          value={formik.values.categories}
          helperText="Enter keywords for categories"
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
          isOptionEqualToValue={(option: any, value: any) => {
            return option.id === value.id;
          }}
          size="medium"
        />
      );
    // Provide data object with name and label
    case "PRICE": {
      const error =
        data?.name == "lowerPriceLimit"
          ? formik.touched.lowerPriceLimit &&
            Boolean(formik.errors.lowerPriceLimit)
          : formik.touched.upperPriceLimit &&
            Boolean(formik.errors.upperPriceLimit);

      const helpText =
        data?.name == "lowerPriceLimit"
          ? formik.touched.lowerPriceLimit && formik.errors.lowerPriceLimit
          : formik.touched.upperPriceLimit && formik.errors.upperPriceLimit;

      const value =
        data?.name == "lowerPriceLimit"
          ? formik.values.lowerPriceLimit
          : formik.values.upperPriceLimit;
      return (
        <TextField
          color="secondary"
          sx={styles.inputBoxBorderStyles}
          fullWidth
          name={data?.name}
          label={data?.label}
          value={value}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={error}
          helperText={helpText}
          variant="outlined"
          size="small"
          type="number"
          inputProps={{
            min: 0,
          }}
        />
      );
    }
    case "SEARCH":
      return (
        <TextField
          color="secondary"
          name="searchString"
          value={formik.values.searchString}
          onChange={formik.handleChange}
          sx={styles.inputBoxBorderStyles}
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
                  borderRadius: "12px",
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
      );
    case "FOLLOWERS": {
      const error =
        data?.name == "lowerFollowerLimit"
          ? formik.touched.lowerFollowerLimit &&
            Boolean(formik.errors.lowerFollowerLimit)
          : formik.touched.upperFollowerLimit &&
            Boolean(formik.errors.upperFollowerLimit);

      const helpText =
        data?.name == "lowerFollowerLimit"
          ? formik.touched.lowerFollowerLimit &&
            formik.errors.lowerFollowerLimit
          : formik.touched.upperFollowerLimit &&
            formik.errors.upperFollowerLimit;

      const value =
        data?.name == "lowerFollowerLimit"
          ? formik.values.lowerFollowerLimit
          : formik.values.upperFollowerLimit;
      return (
        <TextField
          color="secondary"
          sx={styles.inputBoxBorderStyles}
          fullWidth
          id={data?.name}
          name={data?.name}
          label={data?.label}
          value={value}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={error}
          helperText={helpText}
          variant="outlined"
          size="small"
          type="number"
          inputProps={{
            min: 0,
          }}
        />
      );
    }
    default:
      null;
  }
  return null;
}
