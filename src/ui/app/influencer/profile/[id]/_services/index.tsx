"use client";

import CheckoutModal from "@/src/components/checkoutComponents/checkoutModal";
import CreateUpdateService from "@/src/components/profileComponents/createUpdateService";
import ServiceCard from "@/src/components/profileComponents/serviceCard";
import { notification } from "@/src/components/shared/notification";
import WalletConnectModal from "@/src/components/web3Components/walletConnectModal";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { addOrderItem, resetCart } from "@/src/reducers/cartSlice";
import { getService } from "@/src/services/httpServices";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";

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
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const loggedInUser = useAppSelector((state) => state.user?.user);
  const [type, setType] = React.useState<string | null>("published");
  const [services, setServices] = React.useState<ServiceType[]>([]);
  const [pagination, setPagination] = React.useState<PaginationType>({
    total_data_count: 0,
    total_page_count: 0,
    current_page_number: 1,
    current_page_size: 9,
  });
  const [loading, setLoading] = React.useState<boolean>(true);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [refreshPage, setRefreshPage] = React.useState<boolean>(false);
  const [selectedService, setSelectedService] =
    React.useState<ServiceType | null>(null);
  const [openCheckoutModal, setOpenCheckoutModal] =
    React.useState<boolean>(false);
  const [openWalletConnectModal, setOpenWalletConnectModal] =
    React.useState<boolean>(false);

  const getServices = async () => {
    try {
      setLoading(true);
      const { message, data, isSuccess } = await getService(
        "packages/service",
        {
          page_number: pagination.current_page_number,
          page_size: pagination.current_page_size,
          influencer: id,
          status: type,
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
    if (id && loggedInUser && loggedInUser?.id && loggedInUser?.id === id) {
      setType(null);
    }
  }, [loggedInUser, id]);

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
                Listed
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
                    className="joyride-create-service-tab"
                    onClick={() => {
                      if (wallets.length > 0) {
                        setSelectedService(null);
                        setOpenModal(true);
                      } else {
                        notification(
                          "You need to add or connect a wallet before creating a service",
                          "error",
                          5000
                        );
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
                  <ServiceCard
                    key={serviceItem.id}
                    service={service}
                    setRefreshPage={setRefreshPage}
                    setLoading={setLoading}
                    getServices={getServices}
                    setSelectedService={setSelectedService}
                    setOpenModal={setOpenModal}
                    addItemToCart={addItemToCart}
                    setOpenWalletConnectModal={setOpenWalletConnectModal}
                  />
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
      <WalletConnectModal
        open={openWalletConnectModal}
        setOpen={setOpenWalletConnectModal}
        connect={false}
        onlyAddress={false}
      />
    </Box>
  );
};

export default Services;
