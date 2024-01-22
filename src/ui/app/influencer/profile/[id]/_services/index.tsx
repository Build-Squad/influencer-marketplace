"use client";

import CheckoutModal from "@/src/components/checkoutComponents/checkoutModal";
import CreateUpdateService from "@/src/components/profileComponents/createUpdateService";
import { ConfirmDelete } from "@/src/components/shared/confirmDeleteModal";
import { notification } from "@/src/components/shared/notification";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { addOrderItem, resetCart } from "@/src/reducers/cartSlice";
import {
  deleteService,
  getService,
  putService,
} from "@/src/services/httpServices";
import { SERVICE_STATUS } from "@/src/utils/consts";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  ButtonGroup,
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
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import UnpublishedIcon from "@mui/icons-material/Unpublished";

type ServiceProps = {
  currentInfluencer: UserType | null;
  id: string;
  wallets: WalletType[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Services = ({
  currentInfluencer,
  id,
  wallets,
  setOpen,
}: ServiceProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const loggedInUser = useAppSelector((state) => state.user?.user);
  const [type, setType] = React.useState<string | null>(null);
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
  const [openCheckoutModal, setOpenCheckoutModal] =
    React.useState<boolean>(false);

  const getServices = async () => {
    try {
      setLoading(true);
      const { message, data, isSuccess, errors } = await getService(
        "packages/service",
        {
          page_number: pagination.current_page_number,
          page_size: pagination.current_page_size,
          influencer: id,
          status: id === loggedInUser?.id ? type : "published",
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

  const updateService = async (service: ServiceType, action: string) => {
    try {
      setLoading(true);
      const requestBody = {
        status: action,
        package: {
          status: action,
        },
      };
      const { message, data, errors, isSuccess } = await putService(
        `/packages/service/${service?.id}/`,
        requestBody
      );
      if (isSuccess) {
        notification(message);
        getServices();
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

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setPagination((prev) => ({
      ...prev,
      current_page_number: page,
    }));
  };

  const addItemToCart = (service: ServiceType) => {
    // Check if the service is already in the cart
    dispatch(
      addOrderItem({
        influencer: currentInfluencer,
        service: service,
      })
    );
  };

  const closeCheckoutModal = () => {
    dispatch(resetCart());
    setOpenCheckoutModal(false);
  };

  useEffect(() => {
    if (refreshPage) {
      getServices();
      setRefreshPage(false);
    }
  }, [refreshPage]);

  useEffect(() => {
    getServices();
  }, [pagination.current_page_number, pagination.current_page_size, type]);

  useEffect(() => {
    if (!openModal) {
      setSelectedService(null);
    }
  }, [openModal]);

  useEffect(() => {
    if (cart?.orderItems?.length > 0) {
      setOpenCheckoutModal(true);
    }
  }, [cart]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100%",
      }}
    >
      <Grid container>
        {id === loggedInUser?.id && (
          <Grid item xs={12}>
            <ButtonGroup
              aria-label="outlined primary button group"
              sx={{
                mb: 2,
                borderRadius: 8,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant={type === null ? "contained" : "outlined"}
                color="secondary"
                onClick={() => {
                  setType(null);
                }}
                sx={{
                  borderRadius: "20px 0px 0px 20px",
                }}
              >
                All
              </Button>
              <Button
                variant={type === "published" ? "contained" : "outlined"}
                color="secondary"
                onClick={() => {
                  setType("published");
                }}
              >
                Published
              </Button>
              <Button
                variant={type === "draft" ? "contained" : "outlined"}
                color="secondary"
                onClick={() => {
                  setType("draft");
                }}
                sx={{
                  borderRadius: "0px 20px 20px 0px",
                }}
              >
                Draft
              </Button>
            </ButtonGroup>
          </Grid>
        )}
        <Grid container spacing={2}>
          {loading ? null : (
            <>
              {id === loggedInUser?.id && (
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
                      if (wallets.length > 0) {
                        setSelectedService(null);
                        setOpenModal(true);
                      } else {
                        notification("Please add a wallet first", "error");
                        setOpen(true);
                      }
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
              {services?.length === 0 && id !== loggedInUser?.id && (
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    No services found
                  </Typography>
                </Grid>
              )}
              {services?.map((serviceItem) => {
                // Attach the platform_price to the service object
                // It will be price + price * (platform_fee / 100)
                // Take care of type conversion
                let service = { ...serviceItem };
                service.platform_price = (
                  parseFloat(service?.price?.toString()) +
                  parseFloat(service?.price?.toString()) *
                    (parseFloat(service?.platform_fees?.toString()) / 100)
                )?.toString();
                return (
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
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              mr: 2,
                            }}
                          >
                            {service?.package?.name}
                          </Typography>
                          {service?.package?.influencer?.id ===
                            loggedInUser?.id && (
                            <Chip
                              sx={{
                                mr: 2,
                              }}
                              label={
                                service?.package?.status
                                  .charAt(0)
                                  .toUpperCase() +
                                service?.package?.status.slice(1)
                              }
                              color="secondary"
                              variant={
                                service.status === "draft"
                                  ? "filled"
                                  : "outlined"
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
                          {service?.package?.influencer?.id ===
                          loggedInUser?.id ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {service?.status === SERVICE_STATUS.DRAFT ? (
                                <Tooltip title="Publish">
                                  <IconButton
                                    color="info"
                                    size="small"
                                    sx={{
                                      backgroundColor: "secondary.main",
                                    }}
                                    onClick={() => {
                                      updateService(
                                        service,
                                        SERVICE_STATUS.PUBLISHED
                                      );
                                    }}
                                    disableRipple
                                    disableFocusRipple
                                  >
                                    <PublishedWithChangesIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Unpublish">
                                  <IconButton
                                    color="info"
                                    size="small"
                                    sx={{
                                      backgroundColor: "secondary.main",
                                    }}
                                    onClick={() => {
                                      updateService(
                                        service,
                                        SERVICE_STATUS.DRAFT
                                      );
                                    }}
                                    disableRipple
                                    disableFocusRipple
                                  >
                                    <UnpublishedIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Edit">
                                <IconButton
                                  color="info"
                                  size="small"
                                  sx={{
                                    backgroundColor: "secondary.main",
                                    ml: 1,
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
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                sx={{ fontWeight: "bold" }}
                                variant="h6"
                              >
                                {service?.platform_price +
                                  " " +
                                  service?.currency?.symbol}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Tooltip
                        title={service?.package?.description}
                        // Only show the tooltip if the description is longer than 100 characters
                        disableHoverListener={
                          service?.package?.description.length < 100
                        }
                        disableFocusListener={
                          service?.package?.description.length < 100
                        }
                      >
                        <Typography variant="body2" sx={{ my: 2 }}>
                          {service.package.description.length > 100
                            ? service.package.description.substring(0, 100) +
                              "..."
                            : service.package.description}
                        </Typography>
                      </Tooltip>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {service?.package?.influencer?.id ===
                        loggedInUser?.id ? (
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
                                Paid to You
                              </FormLabel>
                              <Typography
                                sx={{ fontWeight: "bold" }}
                                variant="body1"
                              >
                                {service?.price +
                                  " " +
                                  service?.currency?.symbol}
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
                                Listing Price
                              </FormLabel>
                              <Typography
                                sx={{ fontWeight: "bold" }}
                                variant="body1"
                              >
                                {service?.platform_price +
                                  " " +
                                  service?.currency?.symbol}
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
                                addItemToCart(service);
                              }}
                              disabled={
                                service?.package?.influencer?.id ===
                                loggedInUser?.id
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
                                addItemToCart(service);
                                router.push(`/business/checkout/`);
                              }}
                              disabled={
                                service?.package?.influencer?.id ===
                                loggedInUser?.id
                              }
                            >
                              Buy Now
                            </Button>
                          </>
                        )}
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
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
        open={openCheckoutModal}
        handleClose={closeCheckoutModal}
        currentInfluencer={currentInfluencer}
      />
    </Box>
  );
};

export default Services;
