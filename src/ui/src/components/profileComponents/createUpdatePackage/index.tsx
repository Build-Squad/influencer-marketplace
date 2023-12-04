"use client";

import { postService, putService } from "@/src/services/httpServices";
import { FORM_DATE_FORMAT, PACKAGE_STATUS } from "@/src/utils/consts";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FormikValues, useFormik } from "formik";
import React, { useEffect } from "react";
import { packageFormInitialValues, packageFormSchema } from "./validation";
import CustomModal from "../../shared/customModal";
import { notification } from "../../shared/notification";
import CustomAutoComplete from "../../shared/customAutoComplete";
import dayjs from "dayjs";

type CreateUpdatePackageProps = {
  packageItem?: PackageType | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshPage: React.Dispatch<React.SetStateAction<boolean>>;
};

const statusOptions: any[] = Object.values(PACKAGE_STATUS).map(
  (status) => status
);

const CreateUpdatePackage = ({
  packageItem,
  open,
  setOpen,
  setRefreshPage,
}: CreateUpdatePackageProps) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const updatePackage = async (values: FormikValues) => {
    try {
      setLoading(true);
      const { message, data, errors, isSuccess } = await putService(
        `/packages/${packageItem?.id}/`,
        values
      );
      if (isSuccess) {
        notification(message);
        setRefreshPage(true);
        formik.resetForm();
        setOpen(false);
      } else {
        notification(
          message ? message : "Something went wrong, try again later",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const createPackage = async (values: FormikValues) => {
    try {
      setLoading(true);
      const { message, data, errors, isSuccess } = await postService(
        "/packages/",
        values
      );
      if (isSuccess) {
        notification(message);
        setRefreshPage(true);
        formik.resetForm();
        setOpen(false);
      } else {
        notification(
          message ? message : "Something went wrong, try again later",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: packageFormInitialValues,
    onSubmit: (values) => {
      if (packageItem) {
        updatePackage(values);
      } else {
        createPackage(values);
      }
    },
    validationSchema: packageFormSchema,
  });

  useEffect(() => {
    if (packageItem && open) {
      formik.setFieldValue("name", packageItem.name);
      formik.setFieldValue("description", packageItem.description);
      formik.setFieldValue("price", packageItem.price);
      formik.setFieldValue("currency", packageItem.currency.id);
      formik.setFieldValue("currencyObject", packageItem.currency);
      formik.setFieldValue("status", packageItem.status);
      const selectedOption = statusOptions.find(
        (option) => option.value === packageItem.status
      );
      formik.setFieldValue("statusObject", selectedOption);
      formik.setFieldValue("publish_date", dayjs(packageItem.publish_date));
    } else {
      formik.resetForm();
      formik.setFieldValue("publish_date", dayjs());
    }
  }, [packageItem, open]);

  return (
    <CustomModal open={open} setOpen={setOpen}>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            borderBottom: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "secondary.main" }}>
            {packageItem ? "Update" : "Create"} Package
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                fullWidth
                id="description"
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                variant="outlined"
                size="small"
                minRows={5}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                variant="outlined"
                size="small"
                type="number"
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <CustomAutoComplete
                apiEndpoint="/core/currency"
                label="Currency"
                placeholder="Search Currency"
                value={formik.values.currencyObject}
                onChange={(value) => {
                  if (typeof value === "object" && value) {
                    if ("id" in value) {
                      formik.setFieldValue("currency", value?.id);
                      formik.setFieldValue("currencyObject", value);
                    } else {
                      formik.setFieldValue("currency", null);
                      formik.setFieldValue("currencyObject", null);
                    }
                  } else {
                    formik.setFieldValue("currency", null);
                    formik.setFieldValue("currencyObject", null);
                  }
                }}
                onClear={() => {
                  formik.setFieldValue("currency", null);
                }}
                helperText={
                  formik.touched.currency && formik.errors.currency
                    ? formik.errors.currency
                    : " "
                }
                error={
                  formik.touched.currency && Boolean(formik.errors.currency)
                }
                sx={{
                  width: "100%",
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
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Autocomplete
                disableClearable
                disablePortal
                id="status"
                options={statusOptions}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Status"
                    variant="outlined"
                    size="small"
                  />
                )}
                value={
                  formik.values.statusObject ? formik.values.statusObject : null
                }
                onChange={(event, value) => {
                  const selectedOption = statusOptions.find(
                    (option) => option.value === value?.value
                  );
                  formik.setFieldValue("status", selectedOption?.value || "");
                  formik.setFieldValue("statusObject", selectedOption);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <DatePicker
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    variant: "outlined",
                    error:
                      formik.touched.publish_date &&
                      Boolean(formik.errors.publish_date),
                    helperText:
                      formik.touched.publish_date && formik.errors.publish_date,
                  },
                }}
                label="Publish Date"
                value={formik.values.publish_date}
                onChange={(newValue) => {
                  formik.setFieldValue("publish_date", newValue);
                }}
                format={FORM_DATE_FORMAT}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                color="secondary"
                variant="contained"
                type="submit"
                sx={{
                  float: "right",
                }}
                disabled={loading}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </LocalizationProvider>
    </CustomModal>
  );
};

export default CreateUpdatePackage;
