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
import React, { useEffect, useState } from "react";
import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import WalletsTable from "@/src/components/walletsTable";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import { useAppSelector } from "@/src/hooks/useRedux";
import WalletConnectModal from "@/src/components/web3Components/walletConnectModal";
import { getService, putService } from "@/src/services/httpServices";
import { notification } from "@/src/components/shared/notification";
import EditSvg from "@/public/svg/Edit.svg";

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
        <WalletsTable walletOpen={walletOpen} />
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
          onClick={() => startTwitterAuthentication({ role: "business_owner" })}
        >
          Login to X
        </Button>
      </Box>
    </>
  );
};

const DetailsComponent = () => {
  const user = useAppSelector((state) => state.user?.user);
  const [formData, setFormData] = useState({
    business_name: "",
    industry: "",
    founded: "",
    headquarters: "",
    bio: "",
    user_email: "",
    phone: "",
    website: "",
    twitter_account: "",
    linked_in: "",
  });

  const getBusinessDetails = async () => {
    try {
      const { isSuccess, message, data } = await getService(
        `/account/business-meta-data/${user?.id}/`
      );
      if (isSuccess) {
        setFormData({
          business_name: data.data.business_name ?? "",
          industry: data.data.industry ?? "",
          founded: data.data.founded ?? "",
          headquarters: data.data.headquarters ?? "",
          bio: data.data.bio ?? "",
          user_email: data.data.user_email ?? "",
          phone: data.data.phone ?? "",
          website: data.data.website ?? "",
          twitter_account: data.data.twitter_account ?? "",
          linked_in: data.data.linked_in ?? "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };

  useEffect(() => {
    getBusinessDetails();
  }, []);

  // TODO: Apply debouncing and call update user details API
  const handleChange = async (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const { isSuccess, message, data } = await putService(
      `/account/business-meta-data/${user?.id}/`,
      {
        [e.target.name]: e.target.value,
      }
    );
    if (isSuccess) {
      getBusinessDetails();
    } else {
      notification(
        message ? message : "Something went wrong, try again later",
        "error"
      );
    }
  };
  return (
    <>
      <Box>
        <Typography variant="h6">Basic Details</Typography>
        <Divider light />
        <Typography
          variant="subtitle1"
          fontWeight={"bold"}
          sx={{ mt: 2, color: "#C7C7C7" }}
        >
          Business name <Image src={EditSvg} height={16} alt="EditSvg" />
        </Typography>
        <TextField
          color="secondary"
          fullWidth
          name="business_name"
          variant="standard"
          onChange={handleChange}
          value={formData.business_name}
        />
        <Typography
          variant="subtitle1"
          fontWeight={"bold"}
          sx={{ mt: 2, color: "#C7C7C7" }}
        >
          Industry <Image src={EditSvg} height={16} alt="EditSvg" />
        </Typography>
        <TextField
          color="secondary"
          fullWidth
          name="industry"
          variant="standard"
          onChange={handleChange}
          value={formData.industry}
        />
        <Typography
          variant="subtitle1"
          fontWeight={"bold"}
          sx={{ mt: 2, color: "#C7C7C7" }}
        >
          Founded In <Image src={EditSvg} height={16} alt="EditSvg" />
        </Typography>
        <TextField
          color="secondary"
          fullWidth
          name="founded"
          variant="standard"
          onChange={handleChange}
          value={formData.founded}
        />
        <Typography
          variant="subtitle1"
          fontWeight={"bold"}
          sx={{ mt: 2, color: "#C7C7C7" }}
        >
          Headquarters <Image src={EditSvg} height={16} alt="EditSvg" />
        </Typography>
        <TextField
          color="secondary"
          fullWidth
          name="headquarters"
          variant="standard"
          onChange={handleChange}
          value={formData.headquarters}
        />
      </Box>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6">About</Typography>
        <Divider light />
        <Typography
          variant="subtitle1"
          fontWeight={"bold"}
          sx={{ mt: 2, color: "#C7C7C7" }}
        >
          Bio <Image src={EditSvg} height={16} alt="EditSvg" />
        </Typography>
        <TextField
          multiline
          rows={5}
          color="secondary"
          fullWidth
          name="bio"
          variant="standard"
          onChange={handleChange}
          value={formData.bio}
        />
      </Box>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6">Contact Details</Typography>
        <Divider light />
        <Typography
          variant="subtitle1"
          fontWeight={"bold"}
          sx={{ mt: 2, color: "#C7C7C7" }}
        >
          Email <Image src={EditSvg} height={16} alt="EditSvg" />
        </Typography>
        <TextField
          color="secondary"
          fullWidth
          name="user_email"
          variant="standard"
          onChange={handleChange}
          value={formData.user_email}
          disabled
        />
        <Typography
          variant="subtitle1"
          fontWeight={"bold"}
          sx={{ mt: 2, color: "#C7C7C7" }}
        >
          Phone <Image src={EditSvg} height={16} alt="EditSvg" />
        </Typography>
        <TextField
          color="secondary"
          fullWidth
          name="phone"
          variant="standard"
          onChange={handleChange}
          value={formData.phone}
        />
        <Typography
          variant="subtitle1"
          fontWeight={"bold"}
          sx={{ mt: 2, color: "#C7C7C7" }}
        >
          Website <Image src={EditSvg} height={16} alt="EditSvg" />
        </Typography>
        <TextField
          color="secondary"
          fullWidth
          name="website"
          variant="standard"
          onChange={handleChange}
          value={formData.website}
        />
        <Typography
          variant="subtitle1"
          fontWeight={"bold"}
          sx={{ mt: 2, color: "#C7C7C7" }}
        >
          X <Image src={EditSvg} height={16} alt="EditSvg" />
        </Typography>
        <TextField
          color="secondary"
          fullWidth
          name="twitter_account"
          variant="standard"
          onChange={handleChange}
          value={formData.twitter_account}
        />
        <Typography
          variant="subtitle1"
          fontWeight={"bold"}
          sx={{ mt: 2, color: "#C7C7C7" }}
        >
          linked In <Image src={EditSvg} height={16} alt="EditSvg" />
        </Typography>
        <TextField
          color="secondary"
          fullWidth
          name="linked_in"
          variant="standard"
          onChange={handleChange}
          value={formData.linked_in}
        />
      </Box>
    </>
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
