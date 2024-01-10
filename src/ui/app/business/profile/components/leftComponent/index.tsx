"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Connect_wallet_unselected from "@/public/svg/Connect_wallet_unselected.svg";
import Connect_wallet from "@/public/svg/Connect_wallet.svg";
import connect_x_unselected from "@/public/svg/connect_x_unselected.svg";
import connect_x from "@/public/svg/connect_x.svg";
import Details_unselected from "@/public/svg/Details_unselected.svg";
import Details from "@/public/svg/Details.svg";

type Props = {
  userName: string;
};

type CardDetailsType = {
  tabName: string;
  icon: string;
  disabledIcon: string;
  heading: string;
  subHeading: string;
  onClick?: () => void;
  isMandatory: boolean;
  tabProgressString: string;
};

const CARD_DETAILS: CardDetailsType[] = [
  {
    tabName: "wallet",
    icon: Connect_wallet,
    disabledIcon: Connect_wallet_unselected,
    heading: "Connect your web3 wallet",
    subHeading:
      "Connecting your wallet is a crucial step providing a high level of security for transactions.",
    isMandatory: true,
    tabProgressString: "0 / 5",
  },
  {
    tabName: "connect_x",
    icon: connect_x,
    disabledIcon: connect_x_unselected,
    heading: "Connect with X",
    subHeading:
      "Connecting with X helps influencers navigate your profile better for collaboration.",
    isMandatory: false,
    tabProgressString: "1 / 5",
  },
  {
    tabName: "details",
    icon: Details,
    disabledIcon: Details_unselected,
    heading: "Business Details",
    subHeading: "Adding your details increases trust in your business.",
    isMandatory: false,
    tabProgressString: "0 / 5",
  },
];

const styles = {
  cardContainer: {
    padding: "12px",
    borderRadius: "12px",
    mt: 2,
    display: "flex",
    columnGap: "4px",
    cursor: "pointer",
  },
};

const CardComponent: React.FC<CardDetailsType> = ({
  tabName,
  icon,
  disabledIcon,
  heading,
  subHeading,
  isMandatory,
  tabProgressString,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isActive = searchParams.get("tab") === tabName;

  return (
    <Box
      sx={{
        ...styles.cardContainer,
        border: isActive ? "2px solid #000" : "1px solid #B6B6B6",
      }}
      onClick={() => {
        router.push(`profile?tab=${tabName}`);
      }}
    >
      <Box>
        <Image src={isActive ? icon : disabledIcon} alt={tabName} height={44} />
      </Box>

      <Box sx={{ mt: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{ color: "#C7C7C7" }}
          fontWeight="bold"
        >
          {heading}{" "}
          {isMandatory ? <span style={{ color: "#D70000" }}>*</span> : null}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#626262" }}>
          {subHeading}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#0DAB56" }}>
          {tabProgressString}
        </Typography>
      </Box>
    </Box>
  );
};

const LeftComponent: React.FC<Props> = ({ userName }) => (
  <Box
    sx={{
      height: "100%",
      padding: "20px 16px 20px 40px",
      border: "1px solid #D3D3D3",
      borderTop: "none",
    }}
  >
    <Typography variant="h6" sx={{ ml: 1 }}>
      {userName}
    </Typography>
    {CARD_DETAILS.map((item: CardDetailsType, index: number) => (
      <CardComponent key={index} {...item} />
    ))}
  </Box>
);

export default LeftComponent;
