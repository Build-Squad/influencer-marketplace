"use client";
import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle } from "@mui/icons-material";
import Article3_Business from "@/public/svg/Article3_Influencer.svg";
import Article2_Business from "@/public/svg/Article2_Influencer.svg";
import Article1_Business from "@/public/svg/Article1_Influencer.svg";
type Props = {};

const TABS = ["Customize Services", "Trustless Payouts", "Scheduling"];

const FirstTabComponent = () => {
  return (
    <>
      <Grid item sx={{ textAlign: "left" }} xs={12} sm={6} md={6} lg={6}>
        <Typography variant="h4" fontWeight={"bold"}>
          Set prices, tailor services, personalize offerings.
        </Typography>
        <Typography sx={{ mt: 3 }} variant="h6">
          If you have a knack for creating captivating and shareable content,
          this service is for you
        </Typography>
        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            As an influencer, you can set your own prices based on factors such
            as the complexity of the content, the engagement you can guarantee,
            and the level of creativity involved.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            Businesses are always on the lookout for influencers who can produce
            content that resonates with their target audience, and by offering
            this service, you position yourself as a valuable asset.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Image
          src={
            "https://xfluencer.s3.eu-west-2.amazonaws.com/static/customize_services.png"
          }
          alt=""
          width={"500"}
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
          Enjoy Trustless Payouts And Enhanced Security
        </Typography>
        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            With the integration of web3 wallets, our platform ensures that all
            transactions are secure, transparent, and tamper-proof. Bid farewell
            to concerns about delayed payments or disputes.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            Leveraging blockchain technology and specifically Solana blockchain
            - known for its high performance and scalability, utilizing Proof of
            History (PoH) to timestamp transactions efficiently. Solana boasts
            remarkable speed and efficiency, processing transactions at a
            significantly faster rate and with lower fees compared to
            competitors like Ethereum.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Image
          src={
            "https://xfluencer.s3.eu-west-2.amazonaws.com/static/blockchain.png"
          }
          alt=""
          width={"952"}
          height={"500"}
          style={{ marginLeft: "8px", width: "100%", height: "500px" }}
        />
      </Grid>
    </>
  );
};

const ThirdTabComponent = () => {
  return (
    <>
      <Grid item sx={{ textAlign: "left" }} xs={12} sm={6} md={6} lg={6}>
        <Typography variant="h4" fontWeight={"bold"}>
          Experience Automated Scheduling
        </Typography>
        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            Discover the remarkable convenience of scheduling services
            effortlessly with a single click. Simply navigate to an order item,
            review the designated publish time and date, then click the publish
            button to automatically schedule the service for you.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            With this intuitive feature, managing service schedules has never
            been easier.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Image
          src={Article3_Business}
          alt=""
          height={100}
          width={100}
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
          Your Influence, Your Control
        </Typography>
        <Typography sx={{ fontSize: "40px" }}>
          Take your Influence to new Heights
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
