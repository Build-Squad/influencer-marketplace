import axios from "axios";
import { useState, useEffect } from "react";
import { getServicewithCredentials } from "../services/httpServices";
import { notification } from "../components/shared/notification";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Hook for handling user login/signup via Twitter
export default function useTwitterAuth() {
  // State to track whether the user is logged in via Twitter
  const [isTwitterUserLoggedIn, setTwitterUserLoggedIn] = useState(false);
  const [isAccountSsetupComplete, setIsAccountSetupComplete] = useState(true);

  useEffect(() => {
    checkTwitterUserAuthentication();
  }, []);

  useEffect(() => {
    if (isTwitterUserLoggedIn) {
      checkAccountSetup();
    }
  }, [isTwitterUserLoggedIn]);

  // Function to initiate Twitter user authentication
  const startTwitterAuthentication = async () => {
    try {
      window.location.href = `${BACKEND_URL}auth-twitter-user/`;
    } catch (error) {
      console.error("Error initiating Twitter authentication:", error);
    }
  };

  // Function to logout the Twitter user
  const logoutTwitterUser = async () => {
    try {
      await axios.get(`${BACKEND_URL}logout/`, { withCredentials: true });
      notification("Logged out successfully");
      setTwitterUserLoggedIn(false);
      localStorage.clear();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Function to check if the Twitter user is authenticated
  const checkTwitterUserAuthentication = async () => {
    try {
      const { isSuccess, data } = await getServicewithCredentials("account/");
      if (isSuccess) {
        setTwitterUserLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(data?.data));
      } else {
        setTwitterUserLoggedIn(false);
        localStorage.clear();
      }
    } catch (error) {
      console.error("Error during authentication check:", error);
      setTwitterUserLoggedIn(false);
    }
  };

  const checkAccountSetup = async () => {
    try {
      const { isSuccess, data } = await getServicewithCredentials(
        "account/account-category/"
      );
      if (isSuccess) {
        if (data?.data?.length > 0) {
          localStorage.setItem("category", JSON.stringify(data?.data));
          setIsAccountSetupComplete(true);
        } else if (data?.data?.length === 0) {
          setIsAccountSetupComplete(false);
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
    isAccountSsetupComplete,
  };
}
