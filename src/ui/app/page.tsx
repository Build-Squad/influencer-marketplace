"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import Navbar from "@/src/components/homePage/navbar";
import Banner from "@/src/components/homePage/banner";
import InfluencersContainer from "@/src/components/homePage/influencersContainer";
import GuideContainer from "@/src/components/homePage/guideContainer";
import AnalyticsContainer from "@/src/components/homePage/analyticsContainer";
import HomePageFooter from "@/src/components/homePage/homePageFooter";

export default function Home() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // Check if the cookie is present and is valid or not
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
      console.log("User is authenticated:", res);
      localStorage.setItem("user", JSON.stringify(res?.data?.data));
      setIsUserAuthenticated(true);
    } catch (e) {
      setIsUserAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      // Deleting the cookie from the browser
      await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + "logout/", {
        withCredentials: true,
      });
      setIsUserAuthenticated(false);
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
    </Box>
  );
}
