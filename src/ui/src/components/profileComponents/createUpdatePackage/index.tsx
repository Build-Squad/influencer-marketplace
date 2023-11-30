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
import React from "react";
import { packageFormInitialValues, packageFormSchema } from "./validation";
import CustomModal from "../../shared/customModal";

type CreateUpdatePackageProps = {
  packageItem?: PackageType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const statusOptions = Object.values(PACKAGE_STATUS).map((status) => status);

const CreateUpdatePackage = ({
  packageItem,
  open,
  setOpen,
}: CreateUpdatePackageProps) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const updatePackage = async (values: FormikValues) => {
    try {
      setLoading(true);
      const { message, data, errors, isSuccess } = await putService(
        `/packages/${packageItem?.id}`,
        values
      );
      if (isSuccess) {
        console.log("Package updated successfully");
        setOpen(false);
      } else {
        console.log(errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const createPackage = async (values: FormikValues) => {
    try {
      setLoading(true);
      const { message, data, errors, isSuccess } = await postService(
        "/packages",
        values
      );
      if (isSuccess) {
        console.log("Package created successfully");
        setOpen(false);
      } else {
        console.log(errors);
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
                value={statusOptions.find(
                  (option) => option.value === formik.values.status
                )}
                onChange={(event, value) => {
                  const selectedOption = statusOptions.find(
                    (option) => option.value === value?.value
                  );
                  formik.setFieldValue("status", selectedOption?.value || "");
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
