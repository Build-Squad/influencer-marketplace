"use client";

import React from "react";

import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";

import { ExpandMore } from "@mui/icons-material";

type Props = {};

const FAQs = [
  {
    question: "What I need to get started?",
    answer:
      "Explore our selection of influencers on the explore page, filtering them based on follower count, ratings from other businesses, pricing, and more. Next, choose the services offered by the influencer, add them to your cart, and proceed.",
  },
  {
    question: "How do I send an offer?",
    answer:
      "To initiate the process, browse through our selection of influencers and select the services you require, adding them to your cart. Once you've made your selections, proceed to the checkout where you can schedule the services at your convenience. Finally, complete the payment securely using your wallet.",
  },
  {
    question: "What if the influencer declines my offer?",
    answer:
      "If an influencer rejects your order, the smart contract will automatically refund the payment to your designated wallet.",
  },
  {
    question: "What happens once the influencer accepts my offer?",
    answer:
      "Once an influencer accepts your order, they will schedule it, and the service will be automatically completed at the appointed time. You can monitor the progress of your orders on the dashboard page.",
  },
];

export default function FAQSection({}: Props) {
  return (
    <>
      <Grid
        container
        justifyContent={"space-between"}
        sx={{
          mt: 3,
          paddingY: "46px",
        }}
      >
        <Grid sx={{ textAlign: "left" }} xs={12} sm={12} md={4} xl={4}>
          <Typography variant="h4" fontWeight={"bold"}>
            Frequently Asked Questions
          </Typography>
          <Typography sx={{ mt: 3, mb:3, color: "#676767" }} variant="h6">
            Our platform is curated specifically for those influencers who have
            mastered the art of engaging their audience on one of the most
            dynamic social media platforms.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={7} xl={7}>
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
                  mb:2
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
        </Grid>
      </Grid>
    </>
  );
}
