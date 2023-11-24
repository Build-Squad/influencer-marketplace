"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Toolbar,
  AppBar,
  IconButton,
  Button,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { Menu } from "@mui/icons-material/";

export default function Home() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // Check if the cookie is present and is valid or not
  useEffect(() => {
    isAuthenticated();
  }, []);

  // Authenticate user based on cookie present on the browser
  const isAuthenticated = async () => {
    try {
      await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "is-authenticated/",
        {
          withCredentials: true,
        }
      );
      setIsUserAuthenticated(true);
    } catch (e) {
      setIsUserAuthenticated(false);
      console.log("Error while authenticating:", e);
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

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            XFluencer
          </Typography>
          {isUserAuthenticated ? (
            <>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                User Authenticated
              </Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={authTwitterUser}>
                Login
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "93vh",
        }}
      >
        <Image src={"/twitter.jpeg"} fill={true} alt="bgimg" />
      </Box>
    </Box>
  );
}
