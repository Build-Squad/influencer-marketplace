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
import { TimePicker } from "@mui/x-date-pickers";
import NextLink from "next/link";

export default function CheckoutPage() {
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
          {formFields.map((field) => (
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
                  {field.serviceName}
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
                {field.fields.map((subField) => {
                  const masterField = masterFields.find(
                    (masterField) => masterField.id === subField.masterFieldId
                  );
                  return (
                    <Grid
                      md={masterField?.minSpan}
                      lg={masterField?.minSpan}
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
                        required={subField.required}
                        sx={{
                          color: "secondary.main",
                        }}
                      >
                        {masterField?.label}
                      </FormLabel>
                      {masterField?.type === "text" && (
                        <TextField
                          variant="outlined"
                          fullWidth
                          placeholder={masterField?.placeholder}
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                      {masterField?.type === "multiline" && (
                        <TextField
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={4}
                          inputProps={{
                            maxLength: masterField?.max,
                          }}
                          placeholder={masterField?.placeholder}
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                      {masterField?.type === "date" && (
                        <DatePicker
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
                      {masterField?.type === "time" && (
                        <TimePicker
                          value={dayjs()}
                          onChange={() => {}}
                          slotProps={{
                            textField: {
                              size: "small",
                              variant: "outlined",
                              fullWidth: true,
                              sx: {
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 3,
                                },
                              },
                            },
                          }}
                        />
                      )}
                    </Grid>
                  );
                })}
                <Grid item xs={12}>
                  <FormLabel
                    sx={{
                      color: "secondary.main",
                    }}
                  >
                    Add Media
                  </FormLabel>
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
                      Select Media to Upload
                    </Button>
                  </Box>
                </Grid>
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
            </Box>
          ))}
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
                  href=""
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
                  @mudit__21
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
                      <TableCell>
                        {service.serviceItem?.package?.name}
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
                                  item.quantity = Math.max(
                                    item.quantity - 1,
                                    0
                                  );
                                  item.price =
                                    parseFloat(
                                      item.serviceItem.platform_price
                                    ) * item.quantity;
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
                                    parseFloat(
                                      item.serviceItem.platform_price
                                    ) * item.quantity;
                                }
                              });
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
                my: 2,
              }}
            >
              <Typography variant="body1">
                Your payment will be held for 72 hours. If Josh declines the
                order, the amount will be added back to your Wallet
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
