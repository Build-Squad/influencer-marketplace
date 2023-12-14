"use client";

import CheckoutModal from "@/src/components/checkoutModal";
import CreateUpdateService from "@/src/components/profileComponents/createUpdateService";
import { ConfirmDelete } from "@/src/components/shared/confirmDeleteModal";
import { notification } from "@/src/components/shared/notification";
import { deleteService, getService } from "@/src/services/httpServices";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Card,
  Grid,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

const Services = () => {
  const [checkedOutServices, setCheckedOutServices] = React.useState<
    ServiceType[]
  >([]);
  const [services, setServices] = React.useState<ServiceType[]>([]);
  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 5,
  });
  const [loading, setLoading] = React.useState<boolean>(true);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [refreshPage, setRefreshPage] = React.useState<boolean>(false);
  const [selectedService, setSelectedService] =
    React.useState<ServiceType | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);

  const getServices = async () => {
    try {
      setLoading(true);
      const { message, data, isSuccess, errors } = await getService(
        "packages/service",
        {
          page_number: pagination.current_page_number,
          page_size: pagination.current_page_size,
        }
      );
      if (isSuccess) {
        setServices(data?.data);
        setPagination({
          ...pagination,
          total_data_count: data?.pagination?.total_data_count,
          total_page_count: data?.pagination?.total_page_count,
        });
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

  const deleteServiceItem = async (id: string) => {
    try {
      setDeleteLoading(true);
      const { isSuccess, message } = await deleteService(
        `/packages/service/${id}/`
      );
      if (isSuccess) {
        notification(message, "success");
        setRefreshPage(true);
      } else {
        notification(
          message ? message : "Something went wrong, try again later",
          "error"
        );
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setPagination((prev) => ({
      ...prev,
      current_page_number: page,
    }));
  };

  useEffect(() => {
    if (refreshPage) {
      getServices();
      setRefreshPage(false);
    }
  }, [refreshPage]);

  useEffect(() => {
    getServices();
  }, [pagination.current_page_number, pagination.current_page_size]);

  useEffect(() => {
    if (!openModal) {
      setSelectedService(null);
    }
  }, [openModal]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100%",
      }}
    >
      <Grid container spacing={2}>
        <Grid container spacing={2}>
          {loading ? null : (
            <>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Card
                  sx={{
                    height: "100%",
                    minHeight: 150,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "16px",
                    boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
                  }}
                  onClick={() => {
                    setSelectedService(null);
                    setOpenModal(true);
                  }}
                >
                  <Tooltip title="Add Package">
                    <Box>
                      <AddCircleOutlineIcon
                        sx={{
                          fontSize: 80,
                          color: "secondary.main",
                        }}
                      />
                      <Typography variant="body2">Add Service</Typography>
                    </Box>
                  </Tooltip>
                </Card>
              </Grid>
              {services?.map((service) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={service.id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 150,
                      padding: 2,
                      borderRadius: "16px",
                      boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedService(service);
                      setOpenModal(true);
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {service.service_master.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1">
                          {service.currency.symbol} {service.price}
                        </Typography>
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <ConfirmDelete
                            sx={{
                              ml: 1,
                            }}
                            onConfirm={() => deleteServiceItem(service.id)}
                            title="Service"
                            loading={deleteLoading}
                            deleteElement={<DeleteOutlineIcon color="error" />}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body2">
                      {service.service_master.description}
                    </Typography>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{
                          borderRadius: "20px",
                          mx: 2,
                        }}
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          setCheckedOutServices((prev) => [...prev, service]);
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                          borderRadius: "20px",
                          mx: 2,
                        }}
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          setCheckedOutServices((prev) => [...prev, service]);
                        }}
                      >
                        Buy Now
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </>
          )}
        </Grid>
        <Grid item xs={12}>
          <Pagination
            count={pagination.total_page_count}
            page={pagination.current_page_number}
            onChange={handlePaginationChange}
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 4,
            }}
            color="secondary"
            shape="rounded"
          />
        </Grid>
      </Grid>
      <CreateUpdateService
        open={openModal}
        setOpen={setOpenModal}
        setRefreshPage={setRefreshPage}
        serviceItem={selectedService}
      />
      <CheckoutModal
        open={checkedOutServices.length > 0}
        handleClose={() => {
          setCheckedOutServices([]);
        }}
        serviceItems={checkedOutServices}
        packageItems={[]}
      />
    </Box>
  );
};

export default Services;
