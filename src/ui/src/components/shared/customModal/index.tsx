"use client";

import { Box, IconButton, Modal, Tooltip } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

type CustomModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  sx?: any;
  customCloseButton?: boolean;
};

const customStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  maxWidth: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 4,
};

const CustomModal = ({
  open,
  setOpen,
  children,
  sx,
  customCloseButton = false,
}: CustomModalProps) => {
  // On pressing escape key, close the modal
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setOpen]);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      disableAutoFocus
      disableEnforceFocus
      disablePortal
    >
      <Box
        sx={{
          ...customStyle,
          ...sx,
        }}
      >
        {!customCloseButton && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="Close">
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
