"use client"
import { Button } from "@mui/material";
import React from "react";

interface LoginOptionProps {
  label: string;
  onClick: () => void;
}

const LoginOptions: React.FC<LoginOptionProps> = ({ label, onClick }) => {
  return (
    <Button
      variant="outlined"
      sx={{
        background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
        color: "black",
        border: "1px solid black",
        borderRadius: "20px",
        px: 3,
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default LoginOptions;
