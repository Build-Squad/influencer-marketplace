"use client";

import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import {
  removeOrderItem,
  updateFieldValues,
  updatePublishDate,
} from "@/src/reducers/cartSlice";
import { deleteService } from "@/src/services/httpServices";
import {
  FORM_DATE_TIME_TZ_FORMAT,
  ORDER_ITEM_STATUS,
} from "@/src/utils/consts";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { ConfirmDelete } from "../../shared/confirmDeleteModal";
import { notification } from "../../shared/notification";

type OrderItemFormProps = {
  orderItem: any;
  index: number;
  disableDelete: boolean;
  sx?: any;
  updateFunction?: (
    orderItemId: string,
    orderItemMetaDataId: string,
    value: string | null
  ) => Promise<void>;
  updateOrderItemPublishDate?: (
    orderItemId: string,
    publishDate: string
  ) => Promise<void>;
};

const GetOrderItemBadge = ({
  orderStatus,
  eachOrderItem,
}: {
  orderStatus: any;
  eachOrderItem: any;
}) => {
  const user = useAppSelector((state) => state.user?.user);
  switch (eachOrderItem?.status) {
    case ORDER_ITEM_STATUS.CANCELLED:
      return (
        <Chip
          label="Cancelled"
          color="error"
          disabled={true}
          sx={{ fontWeight: "bold" }}
        />
      );
    case ORDER_ITEM_STATUS.PUBLISHED:
      return (
        <Chip
          label="Published"
          color="success"
          disabled={true}
          sx={{ fontWeight: "bold" }}
        />
      );
    case ORDER_ITEM_STATUS.SCHEDULED:
      return (
        <Box sx={{ display: "flex", columnGap: "8px" }}>
          <Chip
            label="Scheduled"
            color="warning"
            disabled={true}
            sx={{ fontWeight: "bold" }}
          />
        </Box>
      );
    default:
      return null;
  }
};

export default function OrderItemForm({
  orderItem,
  index,
  disableDelete,
  sx,
  updateFunction,
  updateOrderItemPublishDate,
}: OrderItemFormProps) {
  let disabled = false;
  const user = useAppSelector((state) => state.user?.user);
  if (user?.role?.name == "influencer") {
    disabled = orderItem?.order_item?.status != ORDER_ITEM_STATUS.ACCEPTED;
  }

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const deleteOrderItem = async () => {
    try {
      setLoading(true);
      if (orderItem?.order_item?.id) {
        const { isSuccess, message } = await deleteService(
          `/orders/order-item/${orderItem?.order_item?.id}/`
        );
        if (isSuccess) {
          dispatch(
            removeOrderItem({
              index: index,
              packageId: orderItem?.order_item?.package?.id,
            })
          );
          notification("Order Item deleted successfully!", "success");
        } else {
          notification(message, "error", 3000);
        }
      } else {
        dispatch(
          removeOrderItem({
            index: index,
            packageId: orderItem?.order_item?.package?.id,
          })
        );
        notification("Order Item deleted successfully!", "success");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        borderRadius: 4,
        backgroundColor: "#ffffff",
        boxShadow: "0px 4px 30px 0px rgba(0, 0, 0, 0.08)",
        width: "100%",
        p: 2,
        ...sx,
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
          {`${index + 1}. ${orderItem?.order_item?.package?.name}`}
        </Typography>
        {disabled && (
          <GetOrderItemBadge
            orderStatus={orderItem?.order_item?.status}
            eachOrderItem={orderItem?.order_item}
          />
        )}

        {!disableDelete && (
          <ConfirmDelete
            title="this order item"
            onConfirm={() => {
              deleteOrderItem();
            }}
            loading={loading}
            hide={true}
            deleteElement={
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: 7,
                }}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            }
          />
        )}
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
        {orderItem?.order_item?.order_item_meta_data
          .toSorted((a: any, b: any) => {
            return a?.order - b?.order;
          })
          ?.map((formFields: any) => {
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
                    disabled={disabled}
                    color="secondary"
                    value={formFields?.value}
                    name={formFields?.id}
                    onChange={(e) => {
                      console.log(e.target.value, formFields);
                      if (updateFunction) {
                        updateFunction(
                          orderItem?.order_item?.id
                            ? orderItem?.order_item?.id
                            : "",
                          formFields?.id ? formFields?.id : "",
                          e.target.value
                        );
                        return;
                      }
                      dispatch(
                        updateFieldValues({
                          index: index,
                          service_master_meta_data_id:
                            formFields?.service_master_meta_data_id
                              ? formFields?.service_master_meta_data_id
                              : "",
                          order_item_meta_data_id: formFields?.id,
                          value: e.target.value,
                        })
                      );
                    }}
                    variant="outlined"
                    fullWidth
                    placeholder={formFields?.placeholder}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                      },
                    }}
                    InputProps={{
                      inputProps: {
                        maxLength: formFields?.max,
                      },
                    }}
                    helperText={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {formFields?.max
                          ? `${
                              formFields?.value?.length
                                ? formFields?.value?.length
                                : 0
                            }/${formFields?.max}`
                          : ""}
                      </Box>
                    }
                  />
                )}
                {formFields?.field_type === "long_text" && (
                  <TextField
                    disabled={disabled}
                    color="secondary"
                    name={formFields?.id}
                    value={formFields?.value}
                    onChange={(e) => {
                      if (updateFunction) {
                        updateFunction(
                          orderItem?.order_item?.id
                            ? orderItem?.order_item?.id
                            : "",
                          formFields?.id ? formFields?.id : "",
                          e.target.value
                        );
                        return;
                      }
                      dispatch(
                        updateFieldValues({
                          index: index,
                          service_master_meta_data_id:
                            formFields?.service_master_meta_data_id
                              ? formFields?.service_master_meta_data_id
                              : "",
                          order_item_meta_data_id: formFields?.id,
                          value: e.target.value,
                        })
                      );
                    }}
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
                    InputProps={{
                      inputProps: {
                        maxLength: formFields?.max,
                      },
                    }}
                    helperText={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {formFields?.max
                          ? `${
                              formFields?.value?.length
                                ? formFields?.value?.length
                                : 0
                            }/${formFields?.max}`
                          : ""}
                      </Box>
                    }
                  />
                )}
                {formFields?.field_type === "date_time" && (
                  <DateTimePicker
                    disabled={disabled}
                    value={
                      dayjs(formFields?.value).isValid()
                        ? dayjs(formFields?.value)
                        : null
                    }
                    onChange={(e) => {
                      if (updateFunction) {
                        updateFunction(
                          orderItem?.order_item?.id
                            ? orderItem?.order_item?.id
                            : "",
                          formFields?.id ? formFields?.id : "",
                          dayjs(e).format("YYYY-MM-DD HH:mm:ss")
                        );
                        return;
                      }
                      dispatch(
                        updateFieldValues({
                          index: index,
                          service_master_meta_data_id:
                            formFields?.service_master_meta_data_id
                              ? formFields?.service_master_meta_data_id
                              : "",
                          order_item_meta_data_id: formFields?.id,
                          value: dayjs(e).format("YYYY-MM-DD HH:mm:ss"),
                        })
                      );
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        variant: "outlined",
                        fullWidth: true,
                        // borderRadius: 3,
                        name: formFields?.id,
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
                      disabled={disabled}
                      variant="contained"
                      disableElevation
                      sx={{
                        p: 2,
                        mt: 1,
                        borderRadius: 8,
                      }}
                    >
                      {formFields?.label}
                    </Button>
                  </Box>
                )}
              </Grid>
            );
          })}
        <Grid
          md={6}
          lg={6}
          xs={12}
          sm={12}
          sx={{
            my: 1,
            display: "flex",
            flexDirection: "column",
            p: 1,
          }}
        >
          <DateTimePicker
            disabled={disabled}
            value={
              orderItem?.order_item?.publish_date
                ? dayjs(orderItem?.order_item?.publish_date)
                : null
            }
            onChange={(e) => {
              if (updateOrderItemPublishDate) {
                updateOrderItemPublishDate(
                  orderItem?.order_item?.id ? orderItem?.order_item?.id : "",
                  dayjs(e).format(FORM_DATE_TIME_TZ_FORMAT)
                );
                return;
              }
              dispatch(
                updatePublishDate({
                  index: index,
                  value: dayjs(e).format(FORM_DATE_TIME_TZ_FORMAT),
                })
              );
            }}
            disablePast
            slotProps={{
              textField: {
                size: "small",
                color: "secondary",
                variant: "outlined",
                fullWidth: true,
                placeholder: "Publish Date and Time",
                name: "publish_date",
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
