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
import { Send } from "@mui/icons-material";
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
      const res = await axios.get(`https://127.0.0.1:8000/is-authenticated/`, {
        withCredentials: true,
      });
      setIsUserAuthenticated(res.data.isAuthenticated);
    } catch (e) {
      console.log("Error while authenticating:", e);
    }
  };

  const logout = async () => {
    try {
      // Deleting the cookie from the browser
      await axios.get(`https://127.0.0.1:8000/logout/`, {
        withCredentials: true,
      });
      setIsUserAuthenticated(false);
    } catch (e) {
      console.log("Error while logging out: ", e);
    }
  };

  const setTempCookie = async () => {
    try {
      await axios.get(`https://127.0.0.1:8000/set-session/`, {
        withCredentials: true,
      });
      setIsUserAuthenticated(true);
    } catch (e) {
      console.log("e");
    }
  };

  // Redirect the user to twitter authentication URL.
  const authTwitterUser = async () => {
    try {
      const res = await axios.get(`https://127.0.0.1:8000/auth-twitter-user/`);
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
              {/* <Button color="inherit" onClick={setTempCookie}>
                Temp Login
              </Button> */}
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
