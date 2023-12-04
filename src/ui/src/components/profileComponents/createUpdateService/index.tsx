"use client";

import { postService, putService } from "@/src/services/httpServices";
import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { FormikValues, useFormik } from "formik";
import React from "react";
import CustomModal from "../../shared/customModal";
import { serviceFormInitialValues, serviceFormSchema } from "./validation";
import CloseIcon from "@mui/icons-material/Close";
import CustomAutoComplete from "../../shared/customAutoComplete";
import { PACKAGE_STATUS } from "@/src/utils/consts";
import { notification } from "../../shared/notification";

type CreateUpdateServiceProps = {
  serviceItem?: ServiceType | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshPage: React.Dispatch<React.SetStateAction<boolean>>;
};

const statusOptions: any[] = Object.values(PACKAGE_STATUS).map(
  (status) => status
);
const CreateUpdateService = ({
  serviceItem,
  open,
  setOpen,
  setRefreshPage,
}: CreateUpdateServiceProps) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const updateService = async (values: FormikValues) => {
    try {
      setLoading(true);
      const { message, data, errors, isSuccess } = await putService(
        `/packages/service/${serviceItem?.id}/`,
        values
      );
      if (isSuccess) {
        notification(message);
        formik.resetForm();
        setRefreshPage(true);
        setOpen(false);
      } else {
        notification(message, "error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createService = async (values: FormikValues) => {
    try {
      setLoading(true);
      const { message, data, errors, isSuccess } = await postService(
        "/packages/service/",
        values
      );
      if (isSuccess) {
        notification(message);
        formik.resetForm();
        setRefreshPage(true);
        setOpen(false);
      } else {
        notification(message, "error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: serviceFormInitialValues,
    validationSchema: serviceFormSchema,
    onSubmit: (values) => {
      if (serviceItem) {
        updateService(values);
      } else {
        createService(values);
      }
    },
  });

  React.useEffect(() => {
    if (serviceItem && open) {
      formik.setFieldValue("service_master", serviceItem?.service_master?.id);
      formik.setFieldValue("service_masterObject", serviceItem?.service_master);
      formik.setFieldValue("package", serviceItem?.package?.id);
      formik.setFieldValue("packageObject", serviceItem?.package);
      formik.setFieldValue("price", serviceItem?.price);
      formik.setFieldValue("currency", serviceItem?.currency?.id);
      formik.setFieldValue("currencyObject", serviceItem?.currency);
      formik.setFieldValue("quantity", serviceItem?.quantity);
      formik.setFieldValue("status", serviceItem?.status);
      const selectedOption = statusOptions.find(
        (option) => option.value === serviceItem.status
      );
      formik.setFieldValue("statusObject", selectedOption);
    } else {
      formik.resetForm();
    }
  }, [serviceItem, open]);

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
            {serviceItem ? "Update" : "Create"} Service
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <CustomAutoComplete
              apiEndpoint="/packages/servicemaster"
              label="Service Master"
              placeholder="Search Service Master"
              value={formik.values.service_masterObject}
              onChange={(value) => {
                if (typeof value === "object" && value) {
                  if ("id" in value) {
                    formik.setFieldValue("service_master", value?.id);
                    formik.setFieldValue("service_masterObject", value);
                  } else {
                    formik.setFieldValue("service_master", null);
                    formik.setFieldValue("service_masterObject", null);
                  }
                } else {
                  formik.setFieldValue("service_master", null);
                  formik.setFieldValue("service_masterObject", null);
                }
              }}
              onClear={() => {
                formik.setFieldValue("service_master", null);
                formik.setFieldValue("service_masterObject", null);
              }}
              helperText={
                formik.touched.service_master && formik.errors.service_master
                  ? formik.errors.service_master
                  : " "
              }
              error={
                formik.touched.service_master &&
                Boolean(formik.errors.service_master)
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
            <CustomAutoComplete
              apiEndpoint="/packages"
              label="Package"
              placeholder="Search Package"
              value={formik.values.packageObject}
              onChange={(value) => {
                if (typeof value === "object" && value) {
                  if ("id" in value) {
                    formik.setFieldValue("package", value?.id);
                    formik.setFieldValue("packageObject", value);
                  } else {
                    formik.setFieldValue("package", null);
                    formik.setFieldValue("packageObject", null);
                  }
                } else {
                  formik.setFieldValue("package", null);
                  formik.setFieldValue("packageObject", null);
                }
              }}
              onClear={() => {
                formik.setFieldValue("package", null);
                formik.setFieldValue("packageObject", null);
              }}
              helperText={
                formik.touched.package && formik.errors.package
                  ? formik.errors.package
                  : " "
              }
              error={formik.touched.package && Boolean(formik.errors.package)}
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
              error={formik.touched.currency && Boolean(formik.errors.currency)}
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
            <TextField
              fullWidth
              id="quantity"
              name="quantity"
              label="Quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
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
    </CustomModal>
  );
};

export default CreateUpdateService;
