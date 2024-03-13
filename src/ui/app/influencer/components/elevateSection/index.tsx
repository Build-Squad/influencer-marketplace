"use client";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle } from "@mui/icons-material";
import Article3_Business from "@/public/svg/Article3_Influencer.svg";
import Article2_Business from "@/public/svg/Article2_Influencer.svg";
import Article1_Business from "@/public/svg/Article1_Influencer.svg";
type Props = {};

const TABS = ["Customize Services", "Trustless Payouts", "Escrow System"];

const FirstTabComponent = () => {
  return (
    <>
      <Box sx={{ flex: 1, textAlign: "left" }}>
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
      </Box>
      <Box sx={{ flex: 1 }}>
        <Image
          src={Article1_Business}
          alt=""
          height={100}
          width={100}
          style={{ marginLeft: "8px", width: "100%", height: "100%" }}
        />
      </Box>
    </>
  );
};

const SecondTabComponent = () => {
  return (
    <>
      <Box sx={{ flex: 1, textAlign: "left" }}>
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
            By leveraging blockchain technology, we create a trustless
            environment that prioritizes the security of both influencers and
            businesses.
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Image
          src={Article2_Business}
          alt=""
          style={{ marginLeft: "8px", width: "100%", height: "50%" }}
        />
      </Box>
    </>
  );
};

const ThirdTabComponent = () => {
  return (
    <>
      <Box sx={{ flex: 1, textAlign: "left" }}>
        <Typography variant="h4" fontWeight={"bold"}>
          Escrow System Integrations
        </Typography>
        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            Experience ultimate security with our escrow integrations, ensuring
            successful payments through smart contracts on the Solana
            blockchain. Enjoy a streamlined process for transactions, offering
            unmatched security and reliability for all parties involved.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
          <CheckCircle
            sx={{ width: "16px", height: "16px", marginTop: "6px" }}
          />
          <Typography variant="h6">
            In case of any need for refunds, our system facilitates a seamless
            process through smart contracts on the Solana blockchain.
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Image
          src={Article3_Business}
          alt=""
          height={100}
          width={100}
          style={{ marginLeft: "8px", width: "100%", height: "100%" }}
        />
      </Box>
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
        {selectedTab == 0 ? <FirstTabComponent /> : null}
        {selectedTab == 1 ? <SecondTabComponent /> : null}
        {selectedTab == 2 ? <ThirdTabComponent /> : null}
      </Box>
    </>
  );
}
