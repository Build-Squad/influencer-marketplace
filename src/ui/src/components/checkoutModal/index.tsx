"use client";

import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { addOrderItem, removeOrderItem } from "@/src/reducers/cartSlice";
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
  open: boolean;
  handleClose: () => void;
  currentInfluencer: UserType | null;
};

const CheckoutModal = ({
  open,
  handleClose,
  currentInfluencer,
}: CheckoutModalProps) => {
  const router = useRouter();
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const removeItemFromCart = (service: ServiceType) => {
    dispatch(
      removeOrderItem({
        service: service,
      })
    );
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
                {cart?.orderItems.length === 0 && (
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
                {cart?.orderItems.map((orderItem) => {
                  const service = orderItem?.service;
                  const quantity = orderItem?.quantity;
                  return (
                    <TableRow key={service.id}>
                      <TableCell>{service?.package?.name}</TableCell>
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
                              removeItemFromCart(service);
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
                            {quantity}
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
                              addItemToCart(service);
                            }}
                          >
                            +
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {Number(service?.platform_price)?.toFixed(2)}{" "}
                        {service.currency.symbol}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
                    {cart?.orderTotal?.toFixed(2)}{" "}
                    {cart?.orderTotalCurrency?.symbol}
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
              disabled={cart?.orderItems.length === 0}
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
