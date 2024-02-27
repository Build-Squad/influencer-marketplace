import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Star_Coloured from "@/public/svg/Star_Coloured.svg";
import WalletsTable from "@/src/components/walletsTable";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import { useAppSelector } from "@/src/hooks/useRedux";
import WalletConnectModal from "@/src/components/web3Components/walletConnectModal";
import {
  getService,
  postService,
  putService,
} from "@/src/services/httpServices";
import { notification } from "@/src/components/shared/notification";
import EditSvg from "@/public/svg/Edit.svg";
import { UserDetailsType } from "../../type";
import Info_Profile from "@/public/Info_Profile.png";
import { ArrowRightAlt, Verified } from "@mui/icons-material";
import VerifyEmailModal from "@/src/components/verifyEmailModal";

const debounce = (fn: Function, ms = 500) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

type Props = {
  setUserDetails: Dispatch<SetStateAction<UserDetailsType>>;
  userDetails: UserDetailsType;
};

const ConnectWalletComponent = ({ setUserDetails, userDetails }: Props) => {
  const [connectWallet, setConnectWallet] = useState<boolean>(false);
  const [walletOpen, setWalletOpen] = useState<boolean>(false);

  const getUserWallets = async () => {
    const { isSuccess, data, message } = await getService("/account/wallets/");
    if (isSuccess) {
      const allWallets = data?.data ?? [];
      setUserDetails((prevState: any) => {
        return {
          ...prevState,
          isWalletConnected: !!allWallets?.length,
        };
      });
    } else {
      notification(message ? message : "Something went wrong", "error");
    }
  };

  useEffect(() => {
    getUserWallets();
  }, [walletOpen]);

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

  if (userTwitterDetails) {
    return (
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
              // window.location.href = `${pathname}?tab=${tabName}`;
            }}
          >
            Disconnect
          </Button>
        </Box>
      </Box>
    );
  }

  return (
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

const DetailsComponent = ({ setUserDetails, userDetails }: Props) => {
  const user = useAppSelector((state) => state.user?.user);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [secondsLeft, setSecondsLeft] = React.useState(0);
  console.log("userDetails===", userDetails)
  console.log("user===", user)

  useEffect(() => {
    setIsEmailVerified(!!userDetails.businessDetails.user_email);
    setEmail(userDetails.businessDetails.user_email);
  }, [userDetails.businessDetails.user_email]);

  useEffect(() => {
    if (email == userDetails.businessDetails.user_email) {
      setIsEmailVerified(true);
    }
  }, [email]);

  const handleChange = async (e: any) => {
    try {
      const { isSuccess, message, data } = await putService(
        `/account/business-meta-data/${user?.id}/`,
        {
          [e.target.name]: e.target.value,
        }
      );
      if (isSuccess) {
        notification(message);
      } else {
        notification(
          message ? message : "Something went wrong, try again later",
          "error"
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateUserDetails = (e: any) => {
    setUserDetails((prevState) => ({
      ...prevState,
      businessDetails: {
        ...prevState.businessDetails,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const debouncedHandleChange = debounce(handleChange, 500);

  // First updating the form fields and calling the update API after 1 second
  // This is to avoid multiple API calls.
  // Adding memoisation to avoid function update on rerenders as it will hinder with our debounce function
  const updatedHandleChange = useCallback((e: any) => {
    updateUserDetails(e);
    debouncedHandleChange(e);
  }, []);

  const handleEmailChange = (e: any) => {
    setIsEmailVerified(false);
    setEmail(e.target.value);
  };

  const handleVerifyEmail = () => {
    if (!isEmailVerified) {
      requestOTP();
    }
  };

  const requestOTP = async () => {
    if (!email) {
      notification("Please enter email", "error");
      return;
    }
    const { isSuccess, message } = await postService("account/otp/v2", {
      email: email,
      username: userDetails.username,
    });
    if (isSuccess) {
      notification(message);
      setEmailOpen(true);
      setSecondsLeft(60);
    } else {
      notification(message, "error");
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
          onChange={updatedHandleChange}
          value={userDetails.businessDetails.business_name}
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
          onChange={updatedHandleChange}
          value={userDetails.businessDetails.industry}
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
          onChange={updatedHandleChange}
          value={userDetails.businessDetails.founded}
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
          onChange={updatedHandleChange}
          value={userDetails.businessDetails.headquarters}
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
          onChange={updatedHandleChange}
          value={userDetails.businessDetails.bio}
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
          onChange={handleEmailChange}
          value={email}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleVerifyEmail}
                  sx={{
                    color: "green",
                    display: "flex",
                    columnGap: "4px",
                    "&:hover": {
                      background: "none",
                    },
                  }}
                >
                  <Typography variant="caption">
                    {isEmailVerified ? "Email Verified" : "Verify Now"}
                  </Typography>
                  {isEmailVerified ? (
                    <Verified fontSize="small" />
                  ) : (
                    <ArrowRightAlt fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
          onChange={updatedHandleChange}
          value={userDetails.businessDetails.phone}
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
          onChange={updatedHandleChange}
          value={userDetails.businessDetails.website}
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
          onChange={updatedHandleChange}
          value={userDetails.businessDetails.twitter_account}
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
          onChange={updatedHandleChange}
          value={userDetails.businessDetails.linked_in}
        />
      </Box>
      {/* Email Modal */}
      {emailOpen ? (
        <VerifyEmailModal
          open={emailOpen}
          setOpen={setEmailOpen}
          emailProp={email}
          username={userDetails.username}
          requestOTP={requestOTP}
          setSecondsLeft={setSecondsLeft}
          secondsLeft={secondsLeft}
          setIsEmailVerified={setIsEmailVerified}
          setUserDetails={setUserDetails}
        />
      ) : null}
    </>
  );
};

const InfoComponent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <ul>
          <li>
            <Typography variant="subtitle1">
              Adding details earns Influencer’s trust
            </Typography>
          </li>
          <li>
            <Typography variant="subtitle1">
              Each point increases your profile completion percentage
            </Typography>
          </li>
          <li>
            <Typography variant="subtitle1">
              See profile preview to know how your business profile will be seen
              by the influencer.
            </Typography>
          </li>
        </ul>
      </Box>
      <Box sx={{}}>
        <Image
          src={Info_Profile}
          alt="Info_Profile"
          style={{ height: "224px", width: "256px" }}
        />
      </Box>
    </Box>
  );
};

const MiddleComponent = ({ setUserDetails, userDetails }: Props) => {
  const searchParams = useSearchParams();
  const tabName = searchParams.get("tab");

  let componentToRender = null;

  if (tabName === "wallet") {
    componentToRender = (
      <ConnectWalletComponent
        setUserDetails={setUserDetails}
        userDetails={userDetails}
      />
    );
  } else if (tabName === "connect_x") {
    componentToRender = <ConnectXComponent tabName={tabName} />;
  } else if (tabName === "details") {
    componentToRender = (
      <DetailsComponent
        setUserDetails={setUserDetails}
        userDetails={userDetails}
      />
    );
  }

  return (
    <>
      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#FFF",
          margin: "20px",
          borderRadius: "16px",
        }}
      >
        <InfoComponent />
      </Box>

      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#FFF",
          margin: "20px",
          borderRadius: "16px",
        }}
      >
        {componentToRender}
      </Box>
    </>
  );
};

export default MiddleComponent;
