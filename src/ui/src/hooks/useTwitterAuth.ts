"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { notification } from "../components/shared/notification";
import { resetCart } from "../reducers/cartSlice";
import { loginReducer, logoutReducer } from "../reducers/userSlice";
import { getService } from "../services/httpServices";
import { ROLE_NAME } from "../utils/consts";
import { useAppDispatch } from "./useRedux";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Hook for handling user login/signup via X
export default function useTwitterAuth() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  // State to track whether the user is logged in via X
  const [isTwitterUserLoggedIn, setTwitterUserLoggedIn] = useState(false);
  const [isAccountSetupComplete, setIsAccountSetupComplete] = useState(true);
  const [userDetails, setUserDetails] = useState<UserType | null>(null);
  const [categoriesAdded, setCategoriesAdded] = useState(false);

  useEffect(() => {
    checkTwitterUserAuthentication();
  }, []);

  useEffect(() => {
    if (isTwitterUserLoggedIn) {
      checkAccountSetup();
    }
  }, [isTwitterUserLoggedIn]);

  // Function to initiate X user authentication
  const startTwitterAuthentication = async ({
    role = "",
  }: {
    role: string;
  }) => {
    try {
      window.location.href = `${BACKEND_URL}auth-twitter-user/${role}`;
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
        if (pathname.includes(ROLE_NAME.INFLUENCER)) {
          router.push(`/${ROLE_NAME.INFLUENCER}`);
        } else {
          router.push(`/business`);
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

  const checkAccountSetup = async () => {
    try {
      if (
        isTwitterUserLoggedIn &&
        userDetails?.role?.name === ROLE_NAME.INFLUENCER &&
        !categoriesAdded
      ) {
        const { isSuccess, data } = await getService(
          "account/account-category/"
        );
        if (isSuccess) {
          if (data?.data?.length > 0) {
            setIsAccountSetupComplete(true);
            setCategoriesAdded(true);
          } else if (data?.data?.length === 0) {
            setIsAccountSetupComplete(false);
            setCategoriesAdded(false);
          }
        }
      }
    } catch (error) {
      console.error("Error during account setup check:", error);
    }
  };

  return {
    isTwitterUserLoggedIn,
    startTwitterAuthentication,
    logoutTwitterUser,
    checkTwitterUserAuthentication,
    isAccountSetupComplete,
    userDetails,
    categoriesAdded,
    checkAccountSetup,
  };
}
