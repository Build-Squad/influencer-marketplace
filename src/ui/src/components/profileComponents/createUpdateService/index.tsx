"use client";

import { postService, putService } from "@/src/services/httpServices";
import { DISPLAY_DATE_FORMAT, PACKAGE_STATUS } from "@/src/utils/consts";
import {
  Box,
  Button,
  Divider,
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FormikValues, useFormik } from "formik";
import React from "react";
import CustomAutoComplete from "../../shared/customAutoComplete";
import CustomModal from "../../shared/customModal";
import { notification } from "../../shared/notification";
import { serviceFormInitialValues, serviceFormSchema } from "./validation";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";

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
  const PLATFORM_FEE = process.env.NEXT_PUBLIC_PLATFORM_FEE
    ? Number(process.env.NEXT_PUBLIC_PLATFORM_FEE)
    : 5;
  const [loading, setLoading] = React.useState<boolean>(false);

  const updateService = async (values: FormikValues) => {
    try {
      setLoading(true);
      const requestBody = {
        service_master: values.service_master,
        price: values.price,
        currency: values.currency,
        package: {
          name: values?.name,
          description: values.description,
          status: values.status,
          publish_date: values.publish_date,
        },
        status: values.status,
        platform_fees: PLATFORM_FEE,
        platform_price: (values.price * (1 + PLATFORM_FEE / 100)).toFixed(2),
      };
      const { message, data, errors, isSuccess } = await putService(
        `/packages/service/${serviceItem?.id}/`,
        requestBody
      );
      if (isSuccess) {
        notification(message);
        formik.resetForm();
        setRefreshPage(true);
        setOpen(false);
      } else {
        notification(
          message ? message : "Something went wrong, try again later",
          "error"
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createService = async (values: FormikValues) => {
    try {
      const requestBody = {
        service_master: values.service_master,
        price: values.price,
        currency: values.currency,
        package: {
          name: values?.name,
          description: values.description,
          status: values.status,
          publish_date: values.publish_date,
        },
        status: values.status,
        platform_fees: PLATFORM_FEE,
        platform_price: (values.price * (1 + PLATFORM_FEE / 100)).toFixed(2),
      };
      const { message, data, errors, isSuccess } = await postService(
        "/packages/service/",
        requestBody
      );
      if (isSuccess) {
        notification(message);
        formik.resetForm();
        setRefreshPage(true);
        setOpen(false);
      } else {
        notification(
          message ? message : "Something went wrong, try again later",
          "error"
        );
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
      formik.setFieldValue("price", serviceItem?.price);
      formik.setFieldValue("currency", serviceItem?.currency?.id);
      formik.setFieldValue("currencyObject", serviceItem?.currency);
      formik.setFieldValue("status", serviceItem?.status);
      const selectedOption = statusOptions.find(
        (option) => option.value === serviceItem.status
      );
      formik.setFieldValue("statusObject", selectedOption);
      formik.setFieldValue("description", serviceItem?.package?.description);
      formik.setFieldValue("name", serviceItem?.package?.name);
    } else {
      formik.resetForm();
    }
  }, [serviceItem, open]);

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      sx={{ p: 0, minHeight: "50vh" }}
      customCloseButton={true}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              sx={{
                minHeight: "50vh",
              }}
            >
              <Grid
                container
                spacing={2}
                sx={{
                  p: 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                    p: 1,
                  }}
                >
                  <Typography variant="h6">
                    {serviceItem ? "Update" : "Create"} Service
                  </Typography>
                </Box>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormLabel component="legend">
                    Select Service Master
                  </FormLabel>
                  <CustomAutoComplete
                    apiEndpoint="/packages/servicemaster"
                    placeholder="Search Service Master"
                    value={formik.values.service_masterObject}
                    onChange={(value) => {
                      if (typeof value === "object" && value) {
                        if ("id" in value) {
                          formik.setFieldValue("service_master", value?.id);
                          formik.setFieldValue("service_masterObject", value);
                          if ("name" in value) {
                            formik.setFieldValue("name", value?.name);
                          }
                        } else {
                          formik.setFieldValue("service_master", null);
                          formik.setFieldValue("service_masterObject", null);
                          formik.setFieldValue("name", "");
                        }
                      } else {
                        formik.setFieldValue("service_master", null);
                        formik.setFieldValue("service_masterObject", null);
                        formik.setFieldValue("name", "");
                      }
                    }}
                    onClear={() => {
                      formik.setFieldValue("service_master", null);
                      formik.setFieldValue("service_masterObject", null);
                      formik.setFieldValue("name", "");
                    }}
                    helperText={
                      formik.touched.service_master &&
                      formik.errors.service_master
                        ? formik.errors.service_master
                        : ""
                    }
                    error={
                      formik.touched.service_master &&
                      Boolean(formik.errors.service_master)
                    }
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                      },
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
                  />{" "}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormLabel component="legend">Name</FormLabel>
                  <TextField
                    fullWidth
                    id="name"
                    placeholder="Enter Name of your service"
                    name="name"
                    value={formik.values?.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched?.name && Boolean(formik.errors?.name)}
                    helperText={formik.touched?.name && formik.errors?.name}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 4,
                      },
                    }}
                    disabled={!formik.values.service_masterObject}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormLabel component="legend">Description</FormLabel>
                  <TextField
                    fullWidth
                    id="description"
                    placeholder="Enter Description about your service"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched?.description &&
                      Boolean(formik.errors?.description)
                    }
                    helperText={
                      formik.touched?.description && formik.errors?.description
                    }
                    variant="outlined"
                    size="small"
                    multiline
                    rows={8}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 4,
                      },
                    }}
                  />
                </Grid>
                {serviceItem && serviceItem.status === "published" && (
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <FormLabel component="legend">Published On</FormLabel>
                    <Typography variant="body1">
                      {dayjs(serviceItem?.package?.publish_date)?.format(
                        DISPLAY_DATE_FORMAT
                      )}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              sx={{
                minHeight: "50vh",
                backgroundColor: "#f4f4f4",
                borderRadius: "0px 16px 16px 0px",
              }}
            >
              <Grid
                container
                spacing={2}
                sx={{
                  p: 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <Tooltip title="Close">
                    <IconButton onClick={() => setOpen(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormLabel component="legend">Select Currency</FormLabel>
                  <CustomAutoComplete
                    apiEndpoint="/core/currency"
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
                      formik.setFieldValue("currencyObject", null);
                      formik.setFieldValue("price", 0);
                    }}
                    helperText={
                      formik.touched.currency && formik.errors.currency
                        ? formik.errors.currency
                        : ""
                    }
                    error={
                      formik.touched.currency && Boolean(formik.errors.currency)
                    }
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                      },
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
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormLabel component="legend">Paid to You</FormLabel>
                  <TextField
                    fullWidth
                    id="price"
                    name="price"
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                      },
                    }}
                    disabled={!formik.values.currency}
                    InputProps={{
                      endAdornment: (
                        <Typography
                          variant="body1"
                          sx={{
                            ml: 1,
                          }}
                        >
                          {formik.values.currencyObject?.symbol}
                        </Typography>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body1">
                      Platform Fee ({PLATFORM_FEE}%)
                    </Typography>
                    <Typography variant="body1">
                      {((formik.values.price * PLATFORM_FEE) / 100).toFixed(2) +
                        " "}{" "}
                      {formik?.values?.currencyObject?.symbol}
                    </Typography>
                  </Box>
                  <Divider
                    sx={{
                      width: "100%",
                      mt: 2,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body1">Listing Price</Typography>
                    <Typography variant="body1">
                      {(formik.values.price * (1 + PLATFORM_FEE / 100)).toFixed(
                        2
                      ) + " "}
                      {formik.values.currencyObject?.symbol}
                    </Typography>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={6}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    p: 4,
                  }}
                >
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => {
                      formik.setFieldValue("status", "draft");
                      formik.handleSubmit();
                    }}
                    disabled={loading}
                    sx={{
                      borderRadius: 8,
                    }}
                    fullWidth
                  >
                    {/* During update, if the serviceItem.status is draft, then show an option to unpublish otherwise show an option to update the draft. During creation only show a Save as Draft button */}
                    {serviceItem
                      ? serviceItem.status === "draft"
                        ? "Save Draft"
                        : "Unpublish"
                      : "Save as Draft"}
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => {
                      formik.setFieldValue("status", "published");
                      formik.setFieldValue("publish_date", new Date());
                      formik.handleSubmit();
                    }}
                    disabled={loading}
                    sx={{
                      borderRadius: 8,
                      mt: 2,
                    }}
                    fullWidth
                  >
                    {/* During update, if the serviceItem.status is published, then show an option to save the service otherwise show an option to publish. During creation only show publish button */}
                    {serviceItem
                      ? serviceItem.status === "published"
                        ? "Save"
                        : "Publish"
                      : "Publish"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </LocalizationProvider>
    </CustomModal>
  );
};

export default CreateUpdateService;
