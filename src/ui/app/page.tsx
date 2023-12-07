"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import Navbar from "@/src/components/homePage/navbar";
import Image from "next/image";
import { Menu } from "@mui/icons-material/";
import {
  getServicewithCredentials,
  postService,
} from "@/src/services/httpServices";
import { notification } from "@/src/components/shared/notification";
import Banner from "@/src/components/homePage/banner";
import InfluencersContainer from "@/src/components/homePage/influencersContainer";

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
      <Navbar
        authTwitterUser={authTwitterUser}
        logout={logout}
        isUserAuthenticated={isUserAuthenticated}
      />
      <Box
        sx={{
          border: "1px solid #000",
          background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            columnGap: "4px",
            mt: 3,
          }}
        >
          <Image src={"/Star.png"} width="34" height="34" alt="bgimg" />
          <Typography variant="body1">
            Strategically Match Your Business with Twitter's Finest Influencers.
          </Typography>
        </Box>

        <Box
          sx={{
            width: "40%",
            textAlign: "center",
            mt: 1,
            display: "flex",
            alignItems: "flex-end",
            columnGap: "8px",
            position: "relative",
            marginBottom: "120px",
          }}
        >
          <Typography variant="h4" fontWeight={"bold"}>
            Connecting Businesses with X Influencers for maximum impact
          </Typography>
          <Image
            src={"/Arrow Right.png"}
            width="68"
            height="24"
            alt="bgimg"
            style={{ position: "absolute", left: "100%", bottom: 0 }}
          />
        </Box>

        <Banner />
      </Box>
      <Box
        sx={{
          marginTop: "120px",
          marginX: "40px",
        }}
      >
        <InfluencersContainer />
      </Box>
    </Box>
  );
}
