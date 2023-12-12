import React from "react";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

export default function SnackbarComp({
  variant = "success",
  message = <></>,
  updateParentState,
}: {
  variant: AlertColor;
  message: React.ReactElement;
  updateParentState?: () => void;
}) {
  const [open, setOpen] = React.useState(true);
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    console.log("reason -- ", reason);
    setOpen(false);
    if (updateParentState) {
      updateParentState();
    }
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        "&.MuiSnackbar-root": {
          top: 0,
        },
      }}
    >
      <MuiAlert elevation={6} severity={variant} sx={{ width: "100%" }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
}
