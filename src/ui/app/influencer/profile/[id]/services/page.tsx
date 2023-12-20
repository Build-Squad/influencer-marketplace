"use client";

import CheckoutModal from "@/src/components/checkoutModal";
import CreateUpdateService from "@/src/components/profileComponents/createUpdateService";
import { ConfirmDelete } from "@/src/components/shared/confirmDeleteModal";
import { notification } from "@/src/components/shared/notification";
import { deleteService, getService } from "@/src/services/httpServices";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
  Chip,
  FormLabel,
  Grid,
  IconButton,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";

const Services = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const PLATFORM_FEE = process.env.NEXT_PUBLIC_PLATFORM_FEE
    ? Number(process.env.NEXT_PUBLIC_PLATFORM_FEE)
    : 5;
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);
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
          influencer: decodeURIComponent(params.id),
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

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setCurrentUser(JSON.parse(localStorage.getItem("user") || "{}"));
    }
  }, []);

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
              {decodeURIComponent(params.id).includes(
                currentUser?.id ? currentUser?.id : ""
              ) && (
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Card
                    sx={{
                      height: "100%",
                      minHeight: 250,
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
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src="/addStar.svg"
                          width={60}
                          height={60}
                          alt="add"
                        />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Create A Service
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Card>
                </Grid>
              )}
              {services?.map((service) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={service.id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 250,
                      maxHeight: 250,
                      overflow: "auto",
                      padding: 2,
                      borderRadius: "16px",
                      boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            mr: 2,
                          }}
                        >
                          {service.service_master.name}
                        </Typography>
                        {service.package.influencer === currentUser?.id && (
                          <Chip
                            label={
                              service?.package?.status.charAt(0).toUpperCase() +
                              service?.package?.status.slice(1)
                            }
                            color="secondary"
                            variant={
                              service.status === "draft" ? "filled" : "outlined"
                            }
                          />
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {service.package.influencer === currentUser?.id && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Tooltip title="Edit">
                              <IconButton
                                color="info"
                                size="small"
                                sx={{
                                  backgroundColor: "secondary.main",
                                }}
                                onClick={() => {
                                  setSelectedService(service);
                                  setOpenModal(true);
                                }}
                                disableRipple
                                disableFocusRipple
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <ConfirmDelete
                              sx={{
                                ml: 1,
                              }}
                              onConfirm={() => deleteServiceItem(service.id)}
                              title="Service"
                              loading={deleteLoading}
                              deleteElement={
                                <IconButton
                                  color="info"
                                  size="small"
                                  sx={{
                                    backgroundColor: "secondary.main",
                                  }}
                                  disableRipple
                                  disableFocusRipple
                                >
                                  <DeleteIcon />
                                </IconButton>
                              }
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ my: 2 }}>
                      {service.package.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {service.package.influencer === currentUser?.id ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <FormLabel
                              sx={{
                                color: "grey",
                              }}
                            >
                              Your Price
                            </FormLabel>
                            <Typography
                              sx={{ fontWeight: "bold" }}
                              variant="body1"
                            >
                              {service?.currency?.symbol}
                              {service?.price}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                            }}
                          >
                            <FormLabel
                              sx={{
                                color: "grey",
                              }}
                            >
                              Final Price for Business
                            </FormLabel>
                            <Typography
                              sx={{ fontWeight: "bold" }}
                              variant="body1"
                            >
                              {service?.currency?.symbol}
                              {(
                                service?.price *
                                (1 + PLATFORM_FEE / 100)
                              ).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <>
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
                              setCheckedOutServices((prev) => [
                                ...prev,
                                service,
                              ]);
                            }}
                            disabled={
                              service.package.influencer === currentUser?.id
                            }
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
                              setCheckedOutServices((prev) => [
                                ...prev,
                                service,
                              ]);
                            }}
                            disabled={
                              service.package.influencer === currentUser?.id
                            }
                          >
                            Buy Now
                          </Button>
                        </>
                      )}
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
