import React, { useEffect } from "react";
import CustomModal from "../../shared/customModal";
import {
  Box,
  Button,
  FormLabel,
  Grid,
  IconButton,
  Rating,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { postService, putService } from "@/src/services/httpServices";
import { notification } from "../../shared/notification";

type ReviewModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly: boolean;
  reviewOrder: OrderType | null;
  updateState?: () => void;
};

export default function ReviewModal({
  open,
  setOpen,
  readonly,
  reviewOrder,
  updateState,
}: ReviewModalProps) {
  const [rating, setRating] = React.useState<number>(0);
  const [reviewText, setReviewText] = React.useState<string>("");

  const saveReview = async () => {
    if (reviewOrder?.review?.id) {
      const { isSuccess, message } = await putService(
        `/orders/review/${reviewOrder?.review?.id}/`,
        {
          rating: rating,
          note: reviewText,
          order: reviewOrder?.id,
        }
      );
      if (isSuccess) {
        if (updateState) {
          updateState();
        }
        setOpen(false);
        notification("Review updated successfully", "success");
      } else {
        notification(message, "error");
      }
    } else {
      const { isSuccess, message } = await postService("/orders/review/", {
        rating: rating,
        note: reviewText,
        order: reviewOrder?.id,
      });
      if (isSuccess) {
        if (updateState) {
          updateState();
        }
        setOpen(false);
        notification("Review added successfully", "success");
      } else {
        notification(message, "error");
      }
    }
  };

  useEffect(() => {
    if (open) {
      if (reviewOrder?.review) {
        setRating(reviewOrder?.review.rating);
        setReviewText(reviewOrder?.review.note);
      } else {
        setRating(0);
        setReviewText("");
      }
    }
  }, [reviewOrder, open]);

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      sx={{
        p: 3,
        border: "1px solid black",
      }}
      customCloseButton={true}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {readonly
              ? "Review"
              : reviewOrder?.review
              ? "Edit Review"
              : "Add Review"}
          </Typography>
          <Tooltip title="Close">
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <FormLabel component="legend">Rating</FormLabel>
          {readonly ? (
            <Rating
              name="read-only"
              value={reviewOrder?.review?.rating}
              readOnly
              precision={0.5}
            />
          ) : (
            <Rating
              name="rating"
              defaultValue={0}
              onChange={(event, newValue) => {
                setRating(newValue as number);
              }}
              value={rating}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <FormLabel component="legend">Review</FormLabel>
          {readonly ? (
            <Typography>{reviewOrder?.review?.note}</Typography>
          ) : (
            <TextField
              id="reviewOrder?.review"
              multiline
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              color="secondary"
              variant="outlined"
              fullWidth
              placeholder="Write your review here"
              InputProps={{
                inputProps: {
                  maxLength: 1000,
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
                  {reviewText.length}/1000
                </Box>
              }
            />
          )}
        </Grid>
        {/* Save Button */}
        {!readonly && (
          <Grid item xs={12}>
            <Button
              onClick={() => {
                saveReview();
              }}
              variant="contained"
              sx={{
                float: "right",
              }}
              disabled={rating === 0 || reviewText === ""}
            >
              Save
            </Button>
          </Grid>
        )}
      </Grid>
    </CustomModal>
  );
}
