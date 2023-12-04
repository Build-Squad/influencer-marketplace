"use client";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Slide,
  Tooltip,
  Typography,
} from "@mui/material";
import { TransitionProps } from "notistack";
import React from "react";

interface Props {
  onConfirm: () => void;
  title: string;
  loading?: boolean;
  hide?: boolean;
  deleteElement: React.ReactNode;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ConfirmDelete: React.FC<Props> = ({
  onConfirm,
  title,
  loading,
  hide = false,
  deleteElement,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <Box>
      <Tooltip title="Delete">
        <Box onClick={() => setOpen(true)}>{deleteElement}</Box>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        TransitionComponent={Transition}
      >
        <DialogTitle
          sx={{
            m: 1,
          }}
        >
          <Typography variant="h6">
            Are you sure you want to delete {title}?
          </Typography>
        </DialogTitle>
        <DialogActions
          sx={{
            ml: 1,
            mr: 1,
            mb: 1,
          }}
        >
          <Button
            onClick={() => {
              setOpen(false);
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              if (hide) {
                setOpen(false);
              }
            }}
            variant="outlined"
            color="error"
          >
            {loading ? (
              <>
                {" "}
                <CircularProgress color="error" sx={{ mr: 1 }} size={24} />{" "}
                {"Deleting"}{" "}
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};