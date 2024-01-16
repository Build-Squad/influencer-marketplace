"use client";

import { useAppDispatch } from "@/src/hooks/useRedux";
import { removeOrderItem, updateFieldValues } from "@/src/reducers/cartSlice";
import { deleteService } from "@/src/services/httpServices";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
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

type OrderItem = {
  order_item: OrderItemType;
  index: number;
  service_id?: string;
};

type OrderItemFormProps = {
  orderItem: OrderItem;
  index: number;
  disableDelete: boolean;
};

export default function OrderItemForm({
  orderItem,
  index,
  disableDelete,
}: OrderItemFormProps) {
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
          {orderItem?.order_item?.package?.name}
        </Typography>
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
          .toSorted((a, b) => {
            return a?.order - b?.order;
          })
          ?.map((formFields) => {
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
                    value={formFields?.value}
                    name={formFields?.id}
                    onChange={(e) => {
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
                  />
                )}
                {formFields?.field_type === "long_text" && (
                  <TextField
                    name={formFields?.id}
                    value={formFields?.value}
                    onChange={(e) => {
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
                  />
                )}
                {formFields?.field_type === "date_time" && (
                  <DateTimePicker
                    value={
                      dayjs(formFields?.value).isValid()
                        ? dayjs(formFields?.value)
                        : null
                    }
                    onChange={(e) => {
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
      </Grid>
    </Box>
  );
}
