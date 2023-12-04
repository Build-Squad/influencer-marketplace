"use client";

import { Box, Modal } from "@mui/material";
import React from "react";

type CustomModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
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

const CustomModal = ({ open, setOpen, children }: CustomModalProps) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      disableAutoFocus
      disableEnforceFocus
      disablePortal
    >
      <Box sx={customStyle}>{children}</Box>
    </Modal>
  );
};

export default CustomModal;
