"use client";

import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type CheckoutModalProps = {
  serviceItems: ServiceType[];
  open: boolean;
  handleClose: () => void;
};

const CheckoutModal = ({
  serviceItems,
  open,
  handleClose,
}: CheckoutModalProps) => {
  const router = useRouter();
  const [checkedOutServices, setCheckedOutServices] = React.useState<
    Array<ServiceCheckOutType>
  >([]);

  useEffect(() => {
    if (serviceItems.length === 0) {
      setCheckedOutServices([]);
      return;
    }
    const services: ServiceCheckOutType[] = [];
    serviceItems.forEach((item) => {
      const quantity = 1;
      // If the service is already in the array, then just increase the quantity
      const index = services.findIndex(
        (service) => service.serviceItem.id === item.id
      );
      if (index !== -1) {
        services[index].quantity += 1;
        services[index].price =
          parseFloat(services[index].serviceItem?.platform_price) *
          services[index].quantity;
        return;
      }
      services.push({
        serviceItem: item,
        quantity: quantity,
        price: parseFloat(item.platform_price),
      });
    });
    setCheckedOutServices(services);
  }, [serviceItems]);

  return (
    <Box
      sx={{
        display: open ? "block" : "none",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          bottom: 10,
          right: 10,
          width: "400px",
          Height: "400px",
          bgcolor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "white",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Service
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {checkedOutServices.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      No service added
                    </TableCell>
                  </TableRow>
                )}
                {checkedOutServices.map((service) => (
                  <TableRow key={service.serviceItem.id}>
                    <TableCell>{service.serviceItem?.package?.name}</TableCell>
                    <TableCell>
                      {/* A counter */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          color="secondary"
                          sx={{
                            borderRadius: "50%",
                            minWidth: 0,
                            width: 30,
                            height: 30,
                            p: 0,
                            mr: 1,
                          }}
                          onClick={() => {
                            const services = [...checkedOutServices];
                            services.forEach((item) => {
                              if (
                                item.serviceItem.id === service.serviceItem.id
                              ) {
                                item.quantity = Math.max(item.quantity - 1, 0);
                                item.price =
                                  parseFloat(item.serviceItem.platform_price) *
                                  item.quantity;
                                if (item.quantity === 0) {
                                  const index = services.findIndex(
                                    (service) =>
                                      service.serviceItem.id ===
                                      item.serviceItem.id
                                  );
                                  services.splice(index, 1);
                                }
                              }
                            });

                            setCheckedOutServices(services);
                          }}
                        >
                          -
                        </Button>
                        <Box
                          sx={{
                            p: "0px 8px",
                            border: "1px solid #e8e8e8",
                            borderRadius: 2,
                            backgroundColor: "#f8f8f8",
                          }}
                        >
                          {service.quantity}
                        </Box>
                        <Button
                          color="secondary"
                          sx={{
                            borderRadius: "50%",
                            minWidth: 0,
                            width: 30,
                            height: 30,
                            p: 0,
                            ml: 1,
                          }}
                          onClick={() => {
                            const services = [...checkedOutServices];

                            services.forEach((item) => {
                              if (
                                item.serviceItem.id === service.serviceItem.id
                              ) {
                                item.quantity += 1;
                                item.price =
                                  parseFloat(item.serviceItem.platform_price) *
                                  item.quantity;
                              }
                            });

                            setCheckedOutServices(services);
                          }}
                        >
                          +
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {service.price?.toFixed(2)}{" "}
                      {service.serviceItem.currency.symbol}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  {/* Total */}
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Total
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    {checkedOutServices
                      .reduce((acc, cur) => acc + cur.price, 0)
                      ?.toFixed(2)}{" "}
                    {checkedOutServices[0]?.serviceItem.currency.symbol}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box
            sx={{
              width: "100%",
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setCheckedOutServices([]);
                handleClose();
              }}
              color="secondary"
              sx={{ borderRadius: 5, mx: 1 }}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ borderRadius: 5, mx: 1 }}
              fullWidth
              disabled={checkedOutServices.length === 0}
              onClick={() => {
                router.push("/checkout");
              }}
            >
              Proceed
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckoutModal;
