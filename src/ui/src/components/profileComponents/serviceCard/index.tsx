"use client";

import { ROLE_NAME, SERVICE_STATUS } from "@/src/utils/consts";
import {
  Grid,
  Card,
  Box,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  FormLabel,
  Button,
} from "@mui/material";
import router from "next/router";
import React from "react";
import { ConfirmDelete } from "../../shared/confirmDeleteModal";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppSelector } from "@/src/hooks/useRedux";
import { deleteService, putService } from "@/src/services/httpServices";
import { notification } from "../../shared/notification";
import { useRouter } from "next/navigation";

type ServiceCardProps = {
  service: ServiceType;
  setRefreshPage: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getServices: () => Promise<void>;
  setSelectedService: React.Dispatch<React.SetStateAction<ServiceType | null>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  addItemToCart: (service: ServiceType) => void;
};

export default function ServiceCard({
  service,
  setRefreshPage,
  setLoading,
  getServices,
  setSelectedService,
  setOpenModal,
  addItemToCart,
}: ServiceCardProps) {
  const router = useRouter();
  const loggedInUser = useAppSelector((state) => state.user?.user);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);

  const checkValidAddition = async () => {
    // First check if the user is logged in
    if (!loggedInUser) {
      notification(
        "Please login before adding services to the cart",
        "error",
        3000
      );
      return false;
    }

    // Check if the logged in user is a business
    if (loggedInUser?.role?.name !== ROLE_NAME.BUSINESS_OWNER) {
      notification(
        "Only businesses can add services to the cart",
        "error",
        3000
      );
      return false;
    }

    return true;
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
    } finally {
      setLoading(false);
    }
  };

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
            {service?.package?.influencer?.id === loggedInUser?.id && (
              <Chip
                sx={{
                  mr: 2,
                }}
                label={
                  service?.package?.status.charAt(0).toUpperCase() +
                  service?.package?.status.slice(1)
                }
                color="secondary"
                variant={service.status === "draft" ? "filled" : "outlined"}
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {service?.package?.influencer?.id === loggedInUser?.id ? (
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
                        updateService(service, SERVICE_STATUS.PUBLISHED);
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
                        updateService(service, SERVICE_STATUS.DRAFT);
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
                <Typography sx={{ fontWeight: "bold" }} variant="h6">
                  {service?.platform_price + " " + service?.currency?.symbol}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Tooltip
          title={service?.package?.description}
          // Only show the tooltip if the description is longer than 100 characters
          disableHoverListener={service?.package?.description.length < 100}
          disableFocusListener={service?.package?.description.length < 100}
        >
          <Typography variant="body2" sx={{ my: 2 }}>
            {service.package.description.length > 100
              ? service.package.description.substring(0, 100) + "..."
              : service.package.description}
          </Typography>
        </Tooltip>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {service?.package?.influencer?.id === loggedInUser?.id ? (
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
                <Typography sx={{ fontWeight: "bold" }} variant="body1">
                  {service?.price + " " + service?.currency?.symbol}
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
                <Typography sx={{ fontWeight: "bold" }} variant="body1">
                  {service?.platform_price + " " + service?.currency?.symbol}
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
                onClick={async (e) => {
                  const isValid = await checkValidAddition();
                  if (!isValid) {
                    e.stopPropagation();
                    return;
                  } else {
                    e.stopPropagation();
                    addItemToCart(service);
                  }
                }}
                disabled={service?.package?.influencer?.id === loggedInUser?.id}
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
                onClick={async (e) => {
                  const isValid = await checkValidAddition();
                  if (!isValid) {
                    e.stopPropagation();
                    return;
                  } else {
                    e.stopPropagation();
                    addItemToCart(service);
                    router.push(`/business/checkout/`);
                  }
                }}
                disabled={service?.package?.influencer?.id === loggedInUser?.id}
              >
                Buy Now
              </Button>
            </>
          )}
        </Box>
      </Card>
    </Grid>
  );
}
