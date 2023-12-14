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
import React, { useEffect } from "react";

type CheckoutModalProps = {
  serviceItems: ServiceType[];
  packageItems: PackageType[];
  open: boolean;
  handleClose: () => void;
};

const CheckoutModal = ({
  serviceItems,
  packageItems,
  open,
  handleClose,
}: CheckoutModalProps) => {
  const [checkedOutServices, setCheckedOutServices] = React.useState<
    ServiceCheckOutType[]
  >([]);

  useEffect(() => {
    if (serviceItems.length === 0) {
      setCheckedOutServices([]);
      return;
    }
    const services: ServiceCheckOutType[] = [];
    serviceItems.forEach((item) => {
      // If the service is already in the array, then just increase the quantity
      const index = services.findIndex(
        (service) => service.serviceItem.id === item.id
      );
      if (index !== -1) {
        services[index].quantity += 1;
        return;
      }
      services.push({
        serviceItem: item,
        quantity: item.quantity,
        price: item.price,
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
      {/* A modal that appears at the bottom left of the page */}
      {/* It will show the items that the user has selected */}
      {/* It will also show the total price */}
      {/* It will have a button to checkout */}

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
                {checkedOutServices.map((service) => (
                  <TableRow key={service.serviceItem.id}>
                    <TableCell>
                      {service.serviceItem.service_master.name}
                    </TableCell>
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
                          variant="outlined"
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
                            const index = services.findIndex(
                              (item) =>
                                item.serviceItem.id === service.serviceItem.id
                            );
                            if (index !== -1) {
                              services[index].quantity -= 1;
                            }
                          }}
                        >
                          -
                        </Button>
                        <Box>{service.quantity}</Box>
                        <Button
                          variant="outlined"
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
                            const index = services.findIndex(
                              (item) =>
                                item.serviceItem.id === service.serviceItem.id
                            );
                            if (index !== -1) {
                              services[index].quantity += 1;
                              setCheckedOutServices(services);
                            }
                          }}
                        >
                          +
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {service.price} {service.serviceItem.currency.symbol}
                    </TableCell>
                  </TableRow>
                ))}
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