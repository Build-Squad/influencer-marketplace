"use client";
import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle } from "@mui/icons-material";
import Article3_Business from "@/public/svg/Article3_Business.svg";
import Article2_Business from "@/public/svg/Article2_Business.svg";
import Article1_Business from "@/public/svg/Article1_Business.svg";
type Props = {};

const TABS = [
  "Discover Influencers",
  "Collaboration Management",
  "Unlock Explosive Growth",
];

const FirstTabComponent = () => {
  const [articleImage1, setArticleImage1] = useState(
    "https://xfluencer.s3.eu-west-2.amazonaws.com/static/inf_cards2.png"
  );

  const [currentImage1Index, setCurrentImage1Index] = useState(0);

  const Image1 = [
    "https://xfluencer.s3.eu-west-2.amazonaws.com/static/inf_cards2.png",
    "https://xfluencer.s3.eu-west-2.amazonaws.com/static/inf_cards5.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage1Index((prevIndex) => (prevIndex + 1) % Image1.length);
    }, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setArticleImage1(Image1[currentImage1Index]);
  }, [currentImage1Index]);

  return (
    <>
      <Grid item sx={{ textAlign: "left" }} xs={12} sm={6} md={6} lg={6}>
        <Typography variant="h4" fontWeight={"bold"}>
          Search the top influencers:
        </Typography>
        <Typography sx={{ mt: 3 }} variant="h6">
          The search engine allows businesses to find influencers by region,
          category, service offerings, and follower ratings, ensuring targeted
          outreach and collaboration opportunities. Why choose influencers from
          XFluencer?
        </Typography>
        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            Our platform is curated specifically for those influencers who have
            mastered the art of engaging their audience on one of the most
            dynamic social media platforms.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            Choose from a range of services including posts, reposts, replies,
            pinned tweets, likes, and quoted posts, all delivered by influencers
            with a proven track record on X.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Image
          src={articleImage1}
          alt=""
          width={"952"}
          height={"500"}
          style={{ marginLeft: "8px", width: "100%", height: "500px" }}
        />
      </Grid>
    </>
  );
};

const SecondTabComponent = () => {
  return (
    <>
      <Grid item sx={{ textAlign: "left" }} xs={12} sm={6} md={6} lg={6}>
        <Typography variant="h4" fontWeight={"bold"}>
          Manage your dashboard
        </Typography>
        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            Collaboration management centralizes communication, order editing,
            and status tracking, streamlining interactions between parties
            involved in projects or transactions.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            Integrated notifications and transaction tracking ensure efficient
            oversight, enabling users to manage, track, and monitor
            collaborations seamlessly from initiation to completion.
          </Typography>
        </Box>
      </Grid>
      <Grid item sx={{ textAlign: "left" }} xs={12} sm={6} md={6} lg={6}>
        <Image
          src={
            "https://xfluencer.s3.eu-west-2.amazonaws.com/static/business_order_dash.png"
          }
          width={"952"}
          height={"500"}
          alt=""
          style={{ marginLeft: "8px", width: "100%", height: "500px" }}
        />
      </Grid>
    </>
  );
};

const ThirdTabComponent = () => {
  const [articleImage3, setArticleImage3] = useState(
    "https://xfluencer.s3.eu-west-2.amazonaws.com/static/line_graph.png"
  );
  const [currentImage3Index, setCurrentImage3Index] = useState(0);
  const Image3 = [
    "https://xfluencer.s3.eu-west-2.amazonaws.com/static/line_graph.png",
    "https://xfluencer.s3.eu-west-2.amazonaws.com/static/bargraph.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage3Index((prevIndex) => (prevIndex + 1) % Image3.length);
    }, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    setArticleImage3(Image3[currentImage3Index]);
  }, [currentImage3Index]);
  return (
    <>
      <Grid item sx={{ textAlign: "left" }} xs={12} sm={6} md={6} lg={6}>
        <Typography variant="h4" fontWeight={"bold"}>
          Analyse your orders
        </Typography>
        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            Gain insights into growth and revenue acceleration through order
            analytics, leveraging metrics like reach, likes, comments on tweets,
            and other relevant analytics.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            Track progress effectively by analyzing key performance indicators,
            enabling informed decisions to optimize strategies and drive
            impactful results.
          </Typography>
        </Box>
      </Grid>
      <Grid item sx={{ textAlign: "left" }} xs={12} sm={6} md={6} lg={6}>
        <Image
          src={articleImage3}
          alt=""
          width={"952"}
          height={"500"}
          style={{ marginLeft: "8px", width: "100%", height: "500px" }}
        />
      </Grid>
    </>
  );
};

export default function ElevateSection({}: Props) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleSelect = ({ index = 0 }: { index: number }) => {
    setSelectedTab(index);
  };

  return (
    <>
      <Box>
        <Typography variant="h6" sx={{ color: "#9B9B9B" }}>
          Save Time and Experience Growth
        </Typography>
        <Typography sx={{ fontSize: "40px" }}>
          Tailored Marketing Solutions For Businesses
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
            }}
          >
            {TABS.map((item, index) => {
              return (
                <Box
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    paddingX: "56px",
                    alignItems: "center",
                    columnGap: "8px",
                    borderRadius: selectedTab == index ? "30px" : "none",
                    border: selectedTab == index ? "1px solid black" : "none",
                    paddingY: "18px",
                  }}
                  onClick={() => {
                    handleSelect({ index });
                  }}
                  key={index}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
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
      <Grid
        container
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          padding: "46px 54px",
          mt: 3,
          borderRadius: "16px",
          boxShadow: "0px 4px 31px 0px rgba(0, 0, 0, 0.08)",
        }}
      >
        {selectedTab == 0 ? <FirstTabComponent /> : null}
        {selectedTab == 1 ? <SecondTabComponent /> : null}
        {selectedTab == 2 ? <ThirdTabComponent /> : null}
      </Grid>
    </>
  );
}
