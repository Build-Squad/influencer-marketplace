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
  IconButton,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import NextLink from "next/link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { useState } from "react";
import { useAppSelector } from "@/src/hooks/useRedux";
import { isUrl } from "@/src/utils/helper";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
          {meta_data?.value && isUrl(meta_data.value) ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Link
                href={meta_data.value}
                component={NextLink}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ color: "#676767" }}
              >
                {meta_data.value}
              </Link>
              <Tooltip title="Copy to clipboard" arrow>
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(meta_data.value);
                    notification("Copied to clipboard");
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Typography
              variant="subtitle1"
              sx={{
                position: "relative",
                color: "#676767",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "wrap",
              }}
            >
              {meta_data?.value ? meta_data?.value : "N/A"}
            </Typography>
          )}
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

    case "array":
      return (
        // Comma separated values
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "20px",
          }}
        >
          <Typography variant="subtitle1" sx={{ color: "#9E9E9E" }}>
            <Image
              src={Mask_group}
              height={14}
              alt="Mask_group"
              style={{ marginRight: "8px" }}
            />
            {meta_data?.label}
          </Typography>
          {meta_data?.value?.split(",").map((value: string, index: number) => {
            return (
              <Box key={index}>
                <Typography variant="subtitle1" sx={{ color: "#676767" }}>
                  {`${index + 1}. `}
                  {value}
                </Typography>
              </Box>
            );
          })}
        </Box>
      );
    default:
      return null;
  }
};

const GetOrderItemBadge = ({
  orderStatus,
  eachOrderItem,
  handleClick,
}: {
  orderStatus: any;
  eachOrderItem: any;
  handleClick: any;
}) => {
  const user = useAppSelector((state) => state.user?.user);

  if (
    user?.role?.name !== "influencer" ||
    !(
      orderStatus === ORDER_STATUS.ACCEPTED ||
      orderStatus === ORDER_STATUS.COMPLETED
    )
  ) {
    return null; // If user is not an influencer or order status is not accepted or completed, return null
  }

  switch (eachOrderItem?.status) {
    case ORDER_ITEM_STATUS.ACCEPTED:
      return (
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
      );
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
    <Box sx={{ my: 2 }}>
      {orderItem.map((eachOrderItem: any, index: number) => {
        return (
          <Box
            sx={{
              borderRadius: 4,
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 30px 0px rgba(0, 0, 0, 0.08)",
              width: "100%",
              p: 2,
              my: 2,
            }}
          >
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
              <GetOrderItemBadge
                orderStatus={orderStatus}
                eachOrderItem={eachOrderItem}
                handleClick={handleClick}
              />
            </Box>

            {eachOrderItem?.order_item_meta_data
              ?.sort((a: any, b: any) => a.order - b.order)
              ?.map((meta_data: any) => {
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
                    Post Link
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
                  No
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={updateStatus}
                  autoFocus
                >
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        );
      })}
    </Box>
  );
};

export default OrderSummaryDetails;
