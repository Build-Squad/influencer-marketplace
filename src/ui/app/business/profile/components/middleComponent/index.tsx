import {
  Avatar,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";
import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import WalletsTable from "@/src/components/walletsTable";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import { useAppSelector } from "@/src/hooks/useRedux";
import WalletConnectModal from "@/src/components/walletConnectModal";

type Props = {};

const ConnectWalletComponent = () => {
  const [connectWallet, setConnectWallet] = useState<boolean>(false);
  const [walletOpen, setWalletOpen] = useState<boolean>(false);
  return (
    <>
      <Box sx={{ display: "flex", columnGap: "4px" }}>
        <Image src={Star_Coloured} alt={"Star_Coloured"} height={25} />
        <Typography variant="h5" fontWeight={"bold"}>
          Connect a Wallet
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "#626262", width: "80%" }}>
          Seamless Wallet Integration on Solana: Elevate your experience with
          our cutting-edge component, empowering users to effortlessly connect
          their Solana blockchain wallets. Unlock secure and streamlined
          transactions for a next-level blockchain interaction.
        </Typography>
        <Box sx={{ width: "20%", textAlign: "right" }}>
          <Button
            variant={"contained"}
            color="secondary"
            sx={{
              borderRadius: "20px",
            }}
            onClick={() => {
              setWalletOpen(true);
              setConnectWallet(true);
            }}
          >
            Add Wallet
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <WalletsTable />
      </Box>
      <WalletConnectModal
        open={walletOpen}
        setOpen={setWalletOpen}
        connect={connectWallet}
      />
    </>
  );
};

const ConnectXComponent = ({ tabName }: { tabName?: string }) => {
  const pathname = usePathname();
  const { startTwitterAuthentication, logoutTwitterUser } = useTwitterAuth();
  const user = useAppSelector((state) => state.user?.user);
  const userTwitterDetails = user?.twitter_account;

  return userTwitterDetails ? (
    <Box sx={{ display: "flex", columnGap: "8px" }}>
      <Avatar
        alt="Influencer profile image"
        src={userTwitterDetails.profile_image_url}
        variant="circular"
        sx={{
          height: "68px",
          width: "68px",
        }}
      />
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6" fontWeight={"bold"}>
          {userTwitterDetails.name}
        </Typography>
        <Typography variant="subtitle1" sx={{ lineHeight: "10px" }}>
          @{userTwitterDetails.user_name}
        </Typography>
        <Button
          variant={"contained"}
          color="secondary"
          sx={{
            borderRadius: "20px",
            mt: 2,
          }}
          onClick={() => {
            logoutTwitterUser();
            console.log(pathname);
            window.location.href = `${pathname}?tab=${tabName}`;
          }}
        >
          Disconnect
        </Button>
      </Box>
    </Box>
  ) : (
    <>
      <Box sx={{ display: "flex", columnGap: "4px" }}>
        <Image src={Star_Coloured} alt={"Star_Coloured"} height={25} />
        <Typography variant="h5" fontWeight={"bold"}>
          Connect with X
        </Typography>
      </Box>

      <Typography variant="subtitle1" sx={{ color: "#626262", mt: 2 }}>
        By connecting with X, the credibility of your business profile is
        elevated, fostering trust among influencers as they assess your order
        requests.
      </Typography>
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant={"contained"}
          color="secondary"
          sx={{
            borderRadius: "20px",
            mt: 5,
          }}
          onClick={startTwitterAuthentication}
        >
          Login to Twitter
        </Button>
      </Box>
    </>
  );
};

const DetailsComponent = () => {
  return (
    <Box>
      <Typography variant="h6">Basic Details</Typography>
      <Divider light />
      <Typography
        variant="subtitle1"
        fontWeight={"bold"}
        sx={{ mt: 2, color: "#C7C7C7" }}
      >
        Business name
      </Typography>
      <TextField fullWidth variant="standard" />
      <Typography
        variant="subtitle1"
        fontWeight={"bold"}
        sx={{ mt: 2, color: "#C7C7C7" }}
      >
        Username
      </Typography>
      <TextField fullWidth variant="standard" />
      <Typography
        variant="subtitle1"
        fontWeight={"bold"}
        sx={{ mt: 2, color: "#C7C7C7" }}
      >
        Status
      </Typography>
      <TextField fullWidth variant="standard" />
      <Typography
        variant="subtitle1"
        fontWeight={"bold"}
        sx={{ mt: 2, color: "#C7C7C7" }}
      >
        Location
      </Typography>
      <TextField fullWidth variant="standard" />
    </Box>
  );
};

export default function MiddleComponent({}: Props) {
  const searchParams = useSearchParams();
  const tabName = searchParams.get("tab");
  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#FFF",
        margin: "20px",
        borderRadius: "16px",
      }}
    >
      {tabName === "wallet" ? (
        <ConnectWalletComponent />
      ) : tabName === "connect_x" ? (
        <ConnectXComponent tabName={tabName} />
      ) : tabName === "details" ? (
        <DetailsComponent />
      ) : null}
    </Box>
  );
}
