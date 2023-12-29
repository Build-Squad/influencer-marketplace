"use client";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";
import { CheckCircle } from "@mui/icons-material";

type Props = {};

export default function FAQSection({}: Props) {
  return (
    <>
      <Box>
        <Typography variant="h6" sx={{ color: "#9B9B9B" }}>
          Revolutionize Your Engagement
        </Typography>
        <Typography sx={{ fontSize: "40px" }}>
          Elevate Your Business with Xfluencer
        </Typography>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "14px" }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              borderRadius: "30px",
              border: "1px solid #BABABA",
              width: "fit-content",
              paddingY: "18px",
            }}
          >
            {[
              "Impactful Services",
              "Decentralized Community",
              "Twitter Web3 Influencers",
            ].map((item, ind) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    paddingX: "56px",
                    alignItems: "center",
                    columnGap: "8px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8 10V12L10.7314 9.95143L11.09 9.85021C12.771 9.37573 14 7.8288 14 6C14 3.79086 12.2091 2 10 2H6C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10H8ZM6 16V12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0H10C13.3137 0 16 2.68629 16 6C16 8.74753 14.1532 11.0637 11.6333 11.775L6 16Z"
                      fill="black"
                    />
                  </svg>
                  <Typography>{item}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 3,
          borderRadius: "16px",
          boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          padding: "46px 54px",
          alignItems: "center",
          columnGap: "40px",
        }}
      >
        <Box sx={{ flex: 1, textAlign: "left" }}>
          <Typography variant="h4" fontWeight={"bold"}>
            Tailored Services from Twitter Web3 Influencers:
          </Typography>
          <Typography sx={{ mt: 3 }} variant="h6">
            Xfluencer is not just another influencer marketplace—it's a
            dedicated space for Twitter Web3 influencers.
          </Typography>
          <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
            <CheckCircle
              sx={{ width: "16px", height: "16px", marginTop: "6px" }}
            />
            <Typography variant="h6">
              Our platform is curated specifically for those influencers who
              have mastered the art of engaging their audience on one of the
              most dynamic social media platforms.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
            <CheckCircle
              sx={{ width: "16px", height: "16px", marginTop: "6px" }}
            />
            <Typography variant="h6">
              Choose from a range of services including posts, reposts, replies,
              pinned tweets, likes, and quoted posts, all delivered by
              influencers with a proven track record on Twitter.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Image
            src={"/category_image.png"}
            alt=""
            height={100}
            width={100}
            style={{ marginLeft: "8px", width: "100%", height: "100%" }}
          />
        </Box>
      </Box>
    </>
  );
}
