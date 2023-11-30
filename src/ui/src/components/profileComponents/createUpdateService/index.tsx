"use client";

import { postService, putService } from "@/src/services/httpServices";
import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { FormikValues, useFormik } from "formik";
import React from "react";
import CustomModal from "../../shared/customModal";
import { serviceFormInitialValues, serviceFormSchema } from "./validation";
import CloseIcon from "@mui/icons-material/Close";

type CreateUpdateServiceProps = {
  serviceItem?: ServiceType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateUpdateService = ({
  serviceItem,
  open,
  setOpen,
}: CreateUpdateServiceProps) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const updateService = async (values: FormikValues) => {
    try {
      setLoading(true);
      const { message, data, errors, isSuccess } = await putService(
        `/packages/service/${serviceItem?.id}`,
        values
      );
      if (isSuccess) {
        console.log(data);
        setOpen(false);
      } else {
        console.log(errors);
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
        "/packages/service",
        values
      );
      if (isSuccess) {
        console.log(data);
        setOpen(false);
      } else {
        console.log(errors);
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
