"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { notification } from "../components/shared/notification";
import { resetCart } from "../reducers/cartSlice";
import { loginReducer, logoutReducer } from "../reducers/userSlice";
import { getService } from "../services/httpServices";
import { ROLE_NAME } from "../utils/consts";
import { useAppDispatch } from "./useRedux";
import { useWallet } from "@solana/wallet-adapter-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Hook for handling user login/signup via X
export default function useTwitterAuth() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { publicKey, disconnect } = useWallet();

  // State to track whether the user is logged in via X
  const [isTwitterUserLoggedIn, setTwitterUserLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState<UserType | null>(null);

  useEffect(() => {
    checkTwitterUserAuthentication();
  }, []);

  // Function to initiate X user authentication
  const startTwitterAuthentication = async ({
    role = "",
    referral_code = "",
    loginType = "",
  }: {
    role: string;
    referral_code?: string;
    loginType?: string;
  }) => {
    try {
      if (!!loginType) {
        window.location.href = `${BACKEND_URL}auth-twitter-user/${role}/auth/?referral_code=${referral_code}&login_type=${loginType}`;
      }
    } catch (error) {
      console.error("Error initiating Twitter authentication:", error);
    }
  };

  // Function to logout the X user
  const logoutTwitterUser = async () => {
    try {
      const { isSuccess, message } = await getService("logout/");
      if (isSuccess) {
        notification("Logged out successfully");
        setTwitterUserLoggedIn(false);
        dispatch(logoutReducer());
        dispatch(resetCart());
        localStorage.removeItem("persist:user");
        localStorage.removeItem("persist:cart");
        if (publicKey) {
          await disconnect();
        }
        if (pathname.includes(ROLE_NAME.INFLUENCER)) {
          router.push(`/login?role=Influencer`);
        } else {
          router.push(`/login?role=Business`);
        }
      } else {
        notification(
          message ? message : "Something went wrong, please try again later",
          "error"
        );
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Function to check if the user is authenticated
  const checkTwitterUserAuthentication = async () => {
    try {
      const { isSuccess, data } = await getService("account/");
      if (isSuccess) {
        setUserDetails(data?.data);
        setTwitterUserLoggedIn(true);
        dispatch(loginReducer(data?.data));
      } else {
        setUserDetails(null);
        setTwitterUserLoggedIn(false);
        dispatch(logoutReducer());
        dispatch(resetCart());
        localStorage.removeItem("persist:user");
        localStorage.removeItem("persist:cart");
      }
    } catch (error) {
      console.error("Error during authentication check:", error);
      setTwitterUserLoggedIn(false);
    }
  };

  return {
    isTwitterUserLoggedIn,
    startTwitterAuthentication,
    logoutTwitterUser,
    checkTwitterUserAuthentication,
    userDetails,
  };
}
