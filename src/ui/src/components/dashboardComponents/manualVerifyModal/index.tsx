"use client";

import React, { useEffect, useState } from "react";
import CustomModal from "../../shared/customModal";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getService, putService } from "@/src/services/httpServices";
import { notification } from "../../shared/notification";
import {
  Button,
  CircularProgress,
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import OrderSummaryDetails from "../orderSummaryDetails";
import CloseIcon from "@mui/icons-material/Close";

type ManualVerifyModalProps = {
  orderItemId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TWITTER_POST_URL_REGEX =
  "^https?:\\/\\/(twitter|x)\\.com\\/(?:#!\\/)?(\\w+)\\/status(es)?\\/(\\d+)$";

export default function ManualVerifyModal({
  orderItemId,
  open,
  setOpen,
}: ManualVerifyModalProps) {
  const [orderItem, setOrderItem] = useState<OrderItemType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [verificationLoading, setVerificationLoading] =
    useState<boolean>(false);
  const [published_post_link, setPublishedPostLink] = useState<string>();

  const getOrderItemDetails = async () => {
    try {
      setLoading(true);
      const { isSuccess, data, message } = await getService(
        `/orders/order-item/${orderItemId}/`
      );
      if (isSuccess) {
        setOrderItem(data?.data);
      } else {
        notification(
          message ? message : "Something went wrong, please try again later.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOrderItem = async () => {
    try {
      setVerificationLoading(true);
      const regex = new RegExp(TWITTER_POST_URL_REGEX, "gm");
      if (published_post_link && !regex.test(published_post_link)) {
        notification("Please enter a correct X Post Link", "error");
        return;
      }
      if (
        published_post_link &&
        !published_post_link?.includes(
          orderItem?.package?.influencer?.twitter_account?.user_name!
        )
      ) {
        notification(
          "The post link does not match the influencer's twitter account. Please enter the correct post link.",
          "error",
          3000
        );
        return;
      }
      const { isSuccess, data, message } = await putService(
        `/orders/order-item/verify/${orderItemId}/`,
        {
          published_post_link,
        }
      );
      if (isSuccess) {
        notification(message);
        setOpen(false);
      } else {
        notification(
          message ? message : "Something went wrong, please try again later.",
          "error"
        );
      }
    } finally {
      setVerificationLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      getOrderItemDetails();
    }
    setPublishedPostLink("");
  }, [orderItemId, open]);

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      sx={{
        p: 0,
        overflow: "auto",
        minWidth: "50vw",
        maxWidth: "50vw",
        minHeight: "50vh",
      }}
      customCloseButton={true}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
          }}
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            sm={12}
            sx={{
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" fontWeight={"bold"}>
              Manual Approval
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={12} lg={12} sm={12}>
            {loading ? (
              <CircularProgress
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                }}
              />
            ) : (
              <>
                {orderItem ? (
                  <OrderSummaryDetails orderItem={[orderItem]} />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: "italic",
                    }}
                  >
                    Order Item not found
                  </Typography>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={12} md={12} lg={12} sm={12}>
            <FormLabel>Published Post Link (Optional)</FormLabel>
            <TextField
              placeholder="Published Post Link (Optional)"
              variant="outlined"
              fullWidth
              value={published_post_link}
              onChange={(e) => setPublishedPostLink(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
              size="small"
              helperText="Enter the link of the published post to track order item analytics."
              disabled={verificationLoading}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12} sm={12}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                float: "right",
              }}
              onClick={verifyOrderItem}
              disabled={verificationLoading || loading || !orderItem}
            >
              Verify Order Item
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </CustomModal>
  );
}
