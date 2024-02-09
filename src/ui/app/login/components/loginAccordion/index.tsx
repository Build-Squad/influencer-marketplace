"use client"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import React from "react";
import { ExpandMore } from "@mui/icons-material";

interface LoginAccordionProps {
  title: string;
  subtitle: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

const LoginAccordion: React.FC<LoginAccordionProps> = ({
  title,
  subtitle,
  defaultExpanded = false,
  children,
}) => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      sx={{
        mt: 1,
        textAlign: "left",
        "&.MuiAccordion-root": {
          borderRadius: "24px",
          border: "1px solid #E5E4E2",
          boxShadow: "none",
        },
        "&.MuiPaper-root": {
          "&::before": {
            content: "none",
          },
        },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="subtitle1">{subtitle}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default LoginAccordion;
