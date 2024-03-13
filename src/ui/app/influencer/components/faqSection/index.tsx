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
    question: "How do I use xfluencer?",
    answer:
      "Connect your X account with XFluencer to seamlessly integrate your influence into our platform. List the services you offer, including scheduled tweets, retweets, likes, or polls, and set your rates. Receive requests from businesses, fulfill the services, and get paid promptly upon completion.",
  },
  {
    question: "How do I list a service?",
    answer:
      "Head to your profile and ensure your wallet is linked (if not already). Click on 'Create a Service' where you can set your instructions, specify the ask price, and publish the service. Watch as businesses request your offerings, fulfill the service, and get paid hassle-free.",
  },
  {
    question: "How do I get paid?",
    answer: "After completing and validating the order, XFluencer will release the amount directly to your wallet through our secure smart contract system.",
  },
  {
    question: "Is my payment guranteed?",
    answer: "The payments are wired through the smart contract escrow system, leveraging the secure and reliable Solana blockchain. Your earnings are safeguarded throughout the transaction process, ensuring peace of mind and trust in your financial transactions.",
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
            Our platform is curated specifically for X. It uses blockchain
            technology (Solana) for trustless payments and X API for end-to-end
            automation.
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
          {FAQs.map(({ question, answer }, index: number) => {
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
                key={index}
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
