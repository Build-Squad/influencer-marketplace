"use client";

import React from "react";

import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import { ExpandMore } from "@mui/icons-material";

type Props = {};

const FAQs = [
  {
    question: "Do I need to pay to view an influencer's profile and services ?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse malesuada lacus ex, sit amet blandit leo lobortiseget.",
  },
  {
    question: "Do I need to pay to view an influencer's profile and services ?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse malesuada lacus ex, sit amet blandit leo lobortiseget.",
  },
  {
    question: "Do I need to pay to view an influencer's profile and services ?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse malesuada lacus ex, sit amet blandit leo lobortiseget.",
  },
  {
    question: "Do I need to pay to view an influencer's profile and services ?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse malesuada lacus ex, sit amet blandit leo lobortiseget.",
  },
];

export default function FAQSection({}: Props) {
  return (
    <>
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          paddingY: "46px",
          alignItems: "center",
          columnGap: "40px",
        }}
      >
        <Box sx={{ flex: 1, textAlign: "left" }}>
          <Typography variant="h4" fontWeight={"bold"}>
            Frequently Asked Questions
          </Typography>
          <Typography sx={{ mt: 3, color: "#676767" }} variant="h6">
            Our platform is curated specifically for those influencers who have
            mastered the art of engaging their audience on one of the most
            dynamic social media platforms.
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            rowGap: "20px",
          }}
        >
          {FAQs.map(({ question, answer }) => {
            return (
              <Accordion
                disableGutters
                sx={{
                  textAlign: "left",
                  "&.MuiAccordion-root": {
                    borderRadius: "24px",
                    border: "1px solid black",
                    boxShadow: "none",
                  },
                  "&.MuiPaper-root": {
                    "&::before": {
                      content: "none",
                    },
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6" sx={{ color: "#676767" }}>
                    {question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle1" sx={{ color: "#676767" }}>
                    {answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
