"use client";

import {
  Box,
  Button,
  Divider,
  FormLabel,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { checkedOutServices, formFields, masterFields } from "./consts";
import AddIcon from "@mui/icons-material/Add";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import NextLink from "next/link";
import { useAppSelector } from "@/src/hooks/useRedux";
import { notification } from "@/src/components/shared/notification";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function CheckoutPage() {
  const cart = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.user);
  const route = useRouter();

  const [orderItems, setOrderItems] = React.useState<OrderItemType[]>([]);

  if (!user) {
    notification("You need to login first", "error");
    route.push("/");
    return null;
  }

  if (cart?.orderItems?.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">No items added to the cart</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid
        container
        spacing={2}
        sx={{
          px: 2,
        }}
      >
        <Grid
          item
          xs={12}
          md={8}
          lg={8}
          sm={12}
          sx={{
            p: 2,
          }}
        >
          {cart?.orderItems?.map((orderItem) => {
            return (
              <Box
                sx={{
                  borderRadius: 4,
                  backgroundColor: "#ffffff",
                  boxShadow: "0px 4px 30px 0px rgba(0, 0, 0, 0.08)",
                  width: "100%",
                  p: 2,
                  m: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {orderItem.service?.package?.name}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      borderRadius: 7,
                    }}
                    startIcon={<AddIcon />}
                  >
                    Add More
                  </Button>
                </Box>
                <Divider
                  sx={{
                    my: 2,
                  }}
                />
                <Grid
                  container
                  spacing={2}
                  sx={{
                    p: 2,
                  }}
                >
                  {orderItem?.service?.service_master?.service_master_meta_data?.map(
                    (formFields) => {
                      return (
                        <Grid
                          md={formFields?.span}
                          lg={formFields?.span}
                          xs={12}
                          sm={12}
                          sx={{
                            my: 1,
                            display: "flex",
                            flexDirection: "column",
                            p: 1,
                          }}
                        >
                          <FormLabel
                            sx={{
                              color: "secondary.main",
                            }}
                          >
                            {formFields?.label}
                          </FormLabel>
                          {formFields?.field_type === "text" && (
                            <TextField
                              variant="outlined"
                              fullWidth
                              placeholder={formFields?.placeholder}
                              size="small"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 3,
                                },
                              }}
                            />
                          )}
                          {formFields?.field_type === "long_text" && (
                            <TextField
                              variant="outlined"
                              fullWidth
                              multiline
                              rows={4}
                              inputProps={{
                                maxLength: formFields?.max,
                              }}
                              placeholder={formFields?.placeholder}
                              size="small"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 3,
                                },
                              }}
                            />
                          )}
                          {formFields?.field_type === "date_time" && (
                            <DateTimePicker
                              value={dayjs()}
                              onChange={() => {}}
                              slotProps={{
                                textField: {
                                  size: "small",
                                  variant: "outlined",
                                  fullWidth: true,
                                  // borderRadius: 3,
                                  sx: {
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 3,
                                    },
                                  },
                                },
                              }}
                            />
                          )}
                          {formFields?.field_type === "media" && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Button
                                variant="contained"
                                disableElevation
                                sx={{
                                  p: 2,
                                  mt: 1,
                                  borderRadius: 8,
                                }}
                              >
                                {formFields?.placeholder}
                              </Button>
                            </Box>
                          )}
                        </Grid>
                      );
                    }
                  )}
                </Grid>
              </Box>
            );
          })}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  p: 1,
                  mt: 1,
                  borderRadius: 8,
                  minWidth: 100,
                  mx: 2,
                }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  p: 1,
                  mt: 1,
                  borderRadius: 8,
                  minWidth: 100,
                  mx: 2,
                }}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4} lg={4} sm={12}>
          <Box
            sx={{
              p: 2,
              borderRadius: 4,
              border: "1px solid #D3D3D3",
              m: 2,
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 30px 0px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
              }}
            >
              Order Details
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                }}
              >
                Infleuncer : &nbsp;
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "19px",
                }}
              >
                <Link
                  href={`/influencer/profile/${cart?.influencer?.id}`}
                  target="_blank"
                  component={NextLink}
                  sx={{
                    color: "#09F",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {cart?.influencer?.twitter_account?.user_name}
                </Link>
              </Typography>
            </Box>
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
                  {cart?.orderItems?.length === 0 && (
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
                  {cart?.servicesAdded.map((orderItem) => (
                    <TableRow key={orderItem?.service.id}>
                      <TableCell>{orderItem?.service?.package?.name}</TableCell>
                      <TableCell>{orderItem?.quantity} </TableCell>
                      <TableCell>
                        {Number(orderItem?.service?.platform_price)?.toFixed(2)}{" "}
                        {orderItem?.service?.currency?.symbol}
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
                      {cart?.orderTotal?.toFixed(2)}{" "}
                      {cart?.orderTotalCurrency?.symbol}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box
              sx={{
                my: 2,
              }}
            >
              <Typography variant="body1">
                {`Your payment will be held for 72 hours. If ${cart?.influencer?.twitter_account?.name}
                declines the order, the amount will be added back to your Wallet`}
              </Typography>
            </Box>
            <Box>
              <Button
                disableElevation
                fullWidth
                variant="outlined"
                sx={{
                  background:
                    "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                  color: "black",
                  border: "1px solid black",
                  borderRadius: "20px",
                }}
              >
                Make Payment
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
