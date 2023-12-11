"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import Navbar from "./components/navbar";
import Banner from "./components/banner";
import InfluencersContainer from "./components/influencersContainer";
import GuideContainer from "./components/guideContainer";
import AnalyticsContainer from "./components/analyticsContainer";
import HomePageFooter from "./components/homePageFooter";
import SnackbarComp from "@/src/components/shared/snackBarComp";
import { AlertColor } from "@mui/material/Alert";
import {
  LOGIN_STATUS_SUCCESS,
  LOGIN_STATUS_FAILED,
  LOGOUT_SUCCESS,
} from "@/src/utils/consts";
import { useSearchParams } from "next/navigation";

type loginStatusType = {
  status: AlertColor | string;
  message: string;
};

export default function Home() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // Snackbar only if the user tries to login/signup
  const [loginStatus, setloginStatus] = useState<loginStatusType>({
    status: "",
    message: "",
  });
  const params = useSearchParams();

  // Check if the cookie is present & login status.
  useEffect(() => {
    isAuthenticated();
  }, []);

  // Authenticate user based on cookie present on the browser
  const isAuthenticated = async () => {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "is-authenticated/",
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("user", JSON.stringify(res?.data?.data));
      setIsUserAuthenticated(true);
    } catch (e) {
      setIsUserAuthenticated(false);
    }
    
    // Checking login status after redirecting back from authentication.
    try {
      const status = params.get("authenticationStatus");
      if (status) {
        setloginStatus({
          status: status,
          message:
            status == "success" ? LOGIN_STATUS_SUCCESS : LOGIN_STATUS_FAILED,
        });
      }
    } catch (e) {
      console.log("Error while checking login status");
    }
  };

  const logout = async () => {
    try {
      // Deleting the cookie from the browser
      await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + "logout/", {
        withCredentials: true,
      });
      setIsUserAuthenticated(false);
      setloginStatus({
        status: "success",
        message: LOGOUT_SUCCESS,
      });
    } catch (e) {
      console.log("Error while logging out: ", e);
    }
  };

  // Redirect the user to twitter authentication URL.
  const authTwitterUser = async () => {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "auth-twitter-user/"
      );
      window.location.href = res.data.auth_url;
    } catch (e) {
      window.alert(e);
    }
  };

  // const authTwitterUser = async () => {
  //   const { isSuccess, data, message } = await postService(
  //     "account/twitter-auth/",
  //     {
  //       role: "influecer",
  //     }
  //   );
  //   if (isSuccess) {
  //     console.log(data);
  //     window.location.href = data;
  //   } else {
  //     notification(message ? message : "Something went wrong", "error");
  //   }
  // };

  return (
    <Box>
      {/* Navigation */}
      <Navbar
        authTwitterUser={authTwitterUser}
        logout={logout}
        isUserAuthenticated={isUserAuthenticated}
      />
      {/* Filter's container */}
      <Banner />
      {/* Influencers section */}
      <Box sx={{ marginTop: "120px", marginX: "40px", textAlign: "center" }}>
        <InfluencersContainer />
      </Box>
      {/* Guide section */}
      <Box sx={{ marginTop: "84px", textAlign: "center" }}>
        <GuideContainer />
      </Box>
      {/* Analytics section */}
      <Box sx={{ marginTop: "24px", textAlign: "center" }}>
        <AnalyticsContainer />
      </Box>
      {/* Footer */}
      <HomePageFooter />
      {/* Snack bar to notify user about loggin status */}

      {loginStatus.status ? (
        <SnackbarComp
          variant={loginStatus.status}
          message={<>{loginStatus.message}</>}
          updateParentState={() => {
            setloginStatus({
              status: "",
              message: "",
            });
          }}
        />
      ) : null}
    </Box>
  );
}
