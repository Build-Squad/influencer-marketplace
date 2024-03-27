"use client";

import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import {
  removeOrderItem,
  updateFieldValues,
  updatePublishDate,
} from "@/src/reducers/cartSlice";
import {
  deleteService,
  postService,
  putService,
} from "@/src/services/httpServices";
import {
  FORM_DATE_TIME_TZ_FORMAT,
  ORDER_ITEM_STATUS,
  ROLE_NAME,
} from "@/src/utils/consts";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ConfirmDelete } from "../../shared/confirmDeleteModal";
import { notification } from "../../shared/notification";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import ArrayItem from "../arrayItem";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import StatusChip from "../../shared/statusChip";

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
  getOrderDetails?: () => Promise<void>;
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
    case ORDER_ITEM_STATUS.REJECTED:
      return (
        <Chip
          label="Rejected"
          color="error"
          disabled={true}
          sx={{ fontWeight: "bold" }}
        />
      );
    case ORDER_ITEM_STATUS.ACCEPTED:
      return (
        <Chip
          label="Accepted"
          color="success"
          disabled={true}
          sx={{ fontWeight: "bold" }}
        />
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
  getOrderDetails,
}: OrderItemFormProps) {
  const [disabled, setDisabled] = useState(false);
  const user = useAppSelector((state) => state.user?.user);
  const [publishDateUpdated, setPublishDateUpdated] = useState(false);

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

  const updateStatus = async (action: string) => {
    let apiEndpoint = "";
    if (action === ORDER_ITEM_STATUS.SCHEDULED)
      apiEndpoint = "orders/send-tweet";
    if (action === ORDER_ITEM_STATUS.CANCELLED)
      apiEndpoint = "orders/cancel-tweet";

    try {
      const { isSuccess, data, message } = await postService(apiEndpoint, {
        order_item_id: orderItem?.order_item?.id,
      });
      if (isSuccess) {
        notification(message);
        if (getOrderDetails) {
          getOrderDetails();
        }
        // Once any item is published or cancelled, update the orders data
      } else {
        notification(
          message ? message : "Something went wrong, try again later",
          "error"
        );
      }
    } finally {
    }
  };

  const approveOrderItem = async () => {
    const { isSuccess, message } = await putService(
      `/orders/approve-ordder-item/${orderItem?.order_item?.id}/`,
      {
        approved: true,
      }
    );
    if (isSuccess) {
      notification("Order Item approved successfully!", "success");
      if (getOrderDetails) {
        getOrderDetails();
      }
    } else {
      notification(message, "error", 3000);
    }
  };

  useEffect(() => {
    if (orderItem?.service_id && user) {
      setDisabled(false);
    } else if (!orderItem?.service_id && orderItem?.order_item && user) {
      let order_item: OrderItemType = orderItem?.order_item;
      switch (order_item?.status) {
        case ORDER_ITEM_STATUS.CANCELLED:
          // If the order item is cancelled, enable the form for influencers all the time but for businesses only if publish_date is in the past
          if (
            user?.role?.name === ROLE_NAME.BUSINESS_OWNER &&
            dayjs(order_item?.publish_date) > dayjs()
          ) {
            setDisabled(true);
          } else {
            setDisabled(false);
          }
          break;
        case ORDER_ITEM_STATUS.PUBLISHED:
          // If the order item is published, disable the form for both influencers and businesses
          setDisabled(true);
          break;
        case ORDER_ITEM_STATUS.SCHEDULED:
          // If order item is scheduled disable the form for both influencers and businesses unless the publish_date is in the past
          if (dayjs(order_item?.publish_date) > dayjs()) {
            setDisabled(true);
          } else {
            setDisabled(false);
          }
          break;
        case ORDER_ITEM_STATUS.REJECTED:
          // Disable the form for both influencers and businesses if the order item is rejected
          setDisabled(true);
          break;
        case ORDER_ITEM_STATUS.ACCEPTED:
          // If the order item is accepted, enable the form for influencers all the time but for businesses only if publish_date is in the past
          if (
            user?.role?.name === ROLE_NAME.BUSINESS_OWNER &&
            dayjs(order_item?.publish_date) > dayjs()
          ) {
            setDisabled(true);
          } else {
            setDisabled(false);
          }
          break;
        case ORDER_ITEM_STATUS.IN_PROGRESS:
          // If the order item is in progress, disable the form for both influencers and businesses
          if (user?.role?.name === ROLE_NAME.BUSINESS_OWNER) {
            setDisabled(false);
          } else {
            setDisabled(true);
          }
          break;
        default:
          setDisabled(false);
      }
    } else {
      setDisabled(false);
    }
  }, [orderItem?.order_item, user]);

  /**
   * React useEffect hook that updates the publish date of an order item or a specific index.
   *
   * The hook first checks if the publish date of the order item is not defined and if the publish date has not been updated.
   * If both conditions are true, it proceeds with the logic inside the hook.
   *
   * It then creates a default date. If the current time is before 4 PM, the default date is set to 5 PM of the current day.
   * If the current time is 4 PM or later, the default date is set to one hour later than the current time.
   *
   * If the function `updateOrderItemPublishDate` is defined and the order item has an id, it calls `updateOrderItemPublishDate`
   * with the order item id and the formatted default date as arguments. It then sets `publishDateUpdated` to true and ends the execution of the hook.
   *
   * If the above condition is not met and `index` is not undefined, it dispatches an action to update the publish date at the given index
   * with the formatted default date. It then sets `publishDateUpdated` to true.
   *
   * The hook will re-run whenever any of the values in the dependency array change. The dependency array includes `orderItem?.publish_date`,
   * `publishDateUpdated`, `updateOrderItemPublishDate`, `dispatch`, `updatePublishDate`, and `index`.
   */

  useEffect(() => {
    if (
      !orderItem?.publish_date &&
      !orderItem?.order_item?.publish_date &&
      !publishDateUpdated
    ) {
      let defaultDate = dayjs();
      if (defaultDate.hour() < 16) {
        // if current time is before 4 PM
        defaultDate = defaultDate.startOf("day").add(17, "hour"); // set to 5 PM
      } else {
        // if current time is 4 PM or later
        defaultDate = defaultDate.add(60, "minute"); // set to one hour later
      }
      if (updateOrderItemPublishDate && orderItem?.order_item?.id) {
        updateOrderItemPublishDate(
          orderItem.order_item.id,
          defaultDate.format(FORM_DATE_TIME_TZ_FORMAT)
        );
        setPublishDateUpdated(true);
        return;
      } else if (index !== undefined) {
        dispatch(
          updatePublishDate({
            index: index,
            value: defaultDate.format(FORM_DATE_TIME_TZ_FORMAT),
          })
        );
        setPublishDateUpdated(true);
      }
    }
  }, [
    orderItem?.publish_date,
    publishDateUpdated,
    updateOrderItemPublishDate,
    dispatch,
    updatePublishDate,
    index,
  ]);

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
      className={"joyride-order-item-form"}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {!orderItem?.service_id && (
            <StatusChip status={orderItem?.order_item?.status} />
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
          {user?.role?.name === ROLE_NAME.INFLUENCER && (
            <Box sx={{ mx: 1 }}>
              {(orderItem?.order_item?.status === ORDER_ITEM_STATUS.ACCEPTED ||
                orderItem?.order_item?.status ===
                  ORDER_ITEM_STATUS.CANCELLED) &&
                dayjs(orderItem?.order_item?.publish_date) > dayjs() && (
                  <>
                    {console.log(orderItem?.order_item)}
                    {orderItem?.order_item?.approved ? (
                      <Tooltip title="Schedule Post" placement="top" arrow>
                        <IconButton
                          onClick={() => {
                            updateStatus(ORDER_ITEM_STATUS.SCHEDULED);
                          }}
                        >
                          <ScheduleSendIcon color="warning" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      // Required approval from business
                      <Chip
                        label="Approval Pending"
                        color="warning"
                        disabled={true}
                        sx={{ fontWeight: "bold" }}
                      />
                    )}
                  </>
                )}
              {orderItem?.order_item?.status === ORDER_ITEM_STATUS.SCHEDULED &&
                dayjs(orderItem?.order_item?.publish_date) > dayjs() && (
                  <Tooltip title="Cancel Post" placement="top" arrow>
                    <IconButton
                      onClick={() => {
                        updateStatus(ORDER_ITEM_STATUS.CANCELLED);
                      }}
                    >
                      <CancelScheduleSendIcon color="error" />
                    </IconButton>
                  </Tooltip>
                )}
            </Box>
          )}
          {user?.role?.name === ROLE_NAME.BUSINESS_OWNER &&
            !orderItem?.order_item?.approved &&
            (orderItem?.order_item?.status === ORDER_ITEM_STATUS.ACCEPTED ||
              orderItem?.order_item?.status ===
                ORDER_ITEM_STATUS.CANCELLED) && (
              // Action to approve the post
              <Button
                variant="outlined"
                color="success"
                sx={{
                  borderRadius: 8,
                  mx: 1,
                }}
                onClick={() => {
                  approveOrderItem();
                }}
              >
                Approve
              </Button>
            )}
        </Box>
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
          ?.map((formFields: any, ind: number) => {
            return (
              <Grid
                item
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
                key={ind}
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
                    value={formFields?.value ? formFields?.value : ""}
                    name={formFields?.id}
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
                        component="span"
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
                    value={formFields?.value ? formFields?.value : ""}
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
                        component="span"
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
                {formFields?.field_type === "array" && (
                  <ArrayItem
                    formFields={formFields}
                    disabled={disabled}
                    updatevalues={(e: string) => {
                      if (
                        updateFunction &&
                        typeof updateFunction === "function"
                      ) {
                        updateFunction(
                          orderItem?.order_item?.id
                            ? orderItem?.order_item?.id
                            : "",
                          formFields?.id ? formFields?.id : "",
                          e
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
                          value: e,
                        })
                      );
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
          item
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
          <FormLabel
            sx={{
              color: "secondary.main",
            }}
          >
            {`Publish Date and Time`}
          </FormLabel>
          <DateTimePicker
            disabled={disabled}
            value={
              orderItem?.publish_date
                ? dayjs(orderItem?.publish_date)
                : orderItem?.order_item?.publish_date
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
            minDateTime={dayjs().add(30, "minute")}
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
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            closeOnSelect={false}
            formatDensity="spacious"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
