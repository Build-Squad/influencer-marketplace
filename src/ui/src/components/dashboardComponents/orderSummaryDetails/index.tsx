import Mask_group from "@/public/svg/Mask_group.svg";
import {
  DISPLAY_DATE_TIME_FORMAT,
  ORDER_STATUS,
  ORDER_ITEM_STATUS,
} from "@/src/utils/consts";
import { Attachment, Download } from "@mui/icons-material";
import { postService } from "@/src/services/httpServices";
import { notification } from "../../shared/notification";
import {
  Box,
  Divider,
  Typography,
  Link,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import NextLink from "next/link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { useState } from "react";

const ContentTypeComponent = ({ meta_data }: { meta_data: any }) => {
  switch (meta_data.field_type) {
    case "text":
    case "long_text":
      return (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mt: 2, color: "#9E9E9E" }}>
            <Image
              src={Mask_group}
              height={14}
              alt="Mask_group"
              style={{ marginRight: "8px" }}
            />
            {meta_data?.label}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              position: "relative",
              color: "#676767",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {meta_data?.value ? meta_data?.value : "N/A"}
          </Typography>
        </Box>
      );

    case "media":
      return (
        <Box
          sx={{
            mb: 2,
            borderRadius: "24px",
            border: "1px solid #E8E8E8",
            background: "#F8F8F8",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", columnGap: "8px", alignItems: "center" }}>
            <Attachment />
            <Typography>Media</Typography>
          </Box>
          <Download />
        </Box>
      );

    case "date_time":
      return (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ color: "#9E9E9E" }}>
              {meta_data?.label}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#676767" }}>
              {meta_data?.value
                ? dayjs(meta_data?.value).format(DISPLAY_DATE_TIME_FORMAT)
                : "N/A"}
            </Typography>
          </Box>
        </Box>
      );

    default:
      return null;
  }
};

const OrderSummaryDetails = ({
  orderItem = [],
  orderStatus = "",
  getOrders,
}: {
  orderItem?: any;
  orderStatus?: string;
  getOrders?: () => void;
}) => {
  const [action, setAction] = useState({
    orderId: "",
    type: "",
  });

  const updateStatus = async () => {
    let apiEndpoint = "";
    if (action.type == "SCHEDULE") apiEndpoint = "orders/send-tweet";
    if (action.type == "CANCEL") apiEndpoint = "orders/cancel-tweet";

    try {
      const { isSuccess, data, message } = await postService(apiEndpoint, {
        order_item_id: action.orderId,
      });
      if (isSuccess) {
        notification(message);
        // Once any item is published or cancelled, update the orders data
        if (getOrders) getOrders();
      } else {
        notification(
          message ? message : "Something went wrong, try again later",
          "error"
        );
      }
    } finally {
      handleClose();
    }
  };

  const handleClick = async ({
    orderId,
    type,
  }: {
    orderId: string;
    type: string;
  }) => {
    setAction({
      orderId,
      type,
    });
  };

  const handleClose = () => {
    setAction({ orderId: "", type: "" });
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <Box sx={{ mt: 2 }}>
      {orderItem.map((eachOrderItem: any, index: number) => {
        return (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight={"bold"}>
                {index + 1}. {eachOrderItem?.package.name}
              </Typography>
              {/* The status of the order should be accepted and then for each order item we'll see if it's scheduled, cancelled or already published */}
              {orderStatus == ORDER_STATUS.ACCEPTED ||
              orderStatus == ORDER_STATUS.COMPLETED ? (
                eachOrderItem?.status == ORDER_ITEM_STATUS.ACCEPTED ? (
                  <Box sx={{ display: "flex", columnGap: "8px" }}>
                    <Chip
                      sx={{ fontWeight: "bold" }}
                      label="Schedule"
                      color="success"
                      onClick={() => {
                        handleClick({
                          orderId: eachOrderItem.id,
                          type: "SCHEDULE",
                        });
                      }}
                      variant="outlined"
                    />
                  </Box>
                ) : eachOrderItem?.status == ORDER_ITEM_STATUS.CANCELLED ? (
                  <Chip
                    label="Cancelled"
                    color="error"
                    disabled={true}
                    sx={{ fontWeight: "bold" }}
                  />
                ) : eachOrderItem?.status == ORDER_ITEM_STATUS.PUBLISHED ? (
                  <Chip
                    label="Published"
                    color="success"
                    disabled={true}
                    sx={{ fontWeight: "bold" }}
                  />
                ) : eachOrderItem?.status == ORDER_ITEM_STATUS.SCHEDULED ? (
                  <Box sx={{ display: "flex", columnGap: "8px" }}>
                    <Chip
                      label="Scheduled"
                      color="warning"
                      disabled={true}
                      sx={{ fontWeight: "bold" }}
                    />
                    <Chip
                      sx={{ fontWeight: "bold" }}
                      label="Cancel"
                      color="error"
                      onDelete={() => {
                        handleClick({
                          orderId: eachOrderItem.id,
                          type: "CANCEL",
                        });
                      }}
                      variant="outlined"
                    />
                  </Box>
                ) : null
              ) : null}
            </Box>

            {eachOrderItem?.order_item_meta_data?.map((meta_data: any) => {
              return <ContentTypeComponent meta_data={meta_data} />;
            })}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ color: "#9E9E9E" }}>
                  <EventNoteIcon sx={{ fontSize: 14, mr: 1 }} />
                  Publish Date and Time
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#676767" }}>
                  {eachOrderItem?.publish_date
                    ? dayjs(eachOrderItem?.publish_date).format(
                        DISPLAY_DATE_TIME_FORMAT
                      )
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
            {eachOrderItem?.published_tweet_id && (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ color: "#9E9E9E" }}>
                    <OpenInNewIcon sx={{ fontSize: 14, mr: 1 }} />
                    Tweet Link
                  </Typography>
                  <Link
                    href={`https://x.com/${eachOrderItem?.package?.influencer?.twitter_account?.user_name}/status/${eachOrderItem?.published_tweet_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ color: "#676767" }}
                    component={NextLink}
                  >
                    {`https://x.com/${eachOrderItem?.package?.influencer?.twitter_account?.user_name}/status/${eachOrderItem?.published_tweet_id}`}
                  </Link>
                </Box>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            {/* Model */}
            <Dialog open={!!action.type} onClose={handleClose}>
              <DialogTitle
                sx={{
                  backgroundColor: "#fff !important",
                  color: "#000 !important",
                }}
              >
                Are you sure you want to {capitalizeFirstLetter(action.type)}{" "}
                this order?
              </DialogTitle>
              <DialogActions>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={updateStatus}
                  autoFocus
                >
                  {capitalizeFirstLetter(action.type)}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        );
      })}
    </Box>
  );
};

export default OrderSummaryDetails;
