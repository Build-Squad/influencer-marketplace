import React, { useEffect, useState } from "react";
import { Toolbar, AppBar, Button, Box } from "@mui/material";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LoginMenu from "../loginMenu";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import { LOGIN_STATUS_SUCCESS, LOGIN_STATUS_FAILED } from "@/src/utils/consts";
import { loginStatusType } from "@/app/utils/types";
import { useAppSelector } from "@/src/hooks/useRedux";

type NavbarProps = {
  setLoginStatus: React.Dispatch<React.SetStateAction<loginStatusType>>;
  setEmailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWalletOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  emailOpen: boolean;
  walletOpen: boolean;
};

export default function Navbar({
  setLoginStatus,
  setEmailOpen,
  setWalletOpen,
  setCategoryOpen,
  emailOpen,
  walletOpen,
}: NavbarProps) {
  const {
    isTwitterUserLoggedIn,
    startTwitterAuthentication,
    logoutTwitterUser,
    checkTwitterUserAuthentication,
    isAccountSsetupComplete,
  } = useTwitterAuth();
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useAppSelector((state) => state.user?.user);
  // const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);

  const params = useSearchParams();

  useEffect(() => {
    if (!emailOpen) {
      checkTwitterUserAuthentication();
    }
  }, [emailOpen]);

  useEffect(() => {
    if (!walletOpen) {
      checkTwitterUserAuthentication();
    }
  }, [walletOpen]);

  useEffect(() => {
    const status = params.get("authenticationStatus");
    if (status) {
      setLoginStatus({
        status,
        message:
          status == "success" ? LOGIN_STATUS_SUCCESS : LOGIN_STATUS_FAILED,
      });
    }
  }, [isTwitterUserLoggedIn]);

  useEffect(() => {
    const status = params.get("authenticationStatus");
    if (
      isTwitterUserLoggedIn &&
      !isAccountSsetupComplete &&
      status === "success"
    ) {
      setCategoryOpen(true);
    }
  }, [isTwitterUserLoggedIn, isAccountSsetupComplete]);

  return (
    <AppBar position="static" sx={{ boxShadow: "none" }}>
      <Toolbar
        component="nav"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ width: "33%" }}>
          <Image
            src={"/XFluencer_logo.png"}
            width="150"
            height="20"
            alt="bgimg"
          />
        </Box>
        {isTwitterUserLoggedIn ? null : (
          <Box
            sx={{
              display: "flex",
              columnGap: "8px",
              // width: "33%",
              justifyContent: "center",
            }}
          >
            <Button
              variant={
                pathname.includes("influencer") ? "contained" : "outlined"
              }
              color="secondary"
              sx={{
                borderRadius: "20px",
              }}
              onClick={() => {
                router.push("/influencer");
              }}
            >
              For Influencer
            </Button>
            <Button
              variant={pathname.includes("business") ? "contained" : "outlined"}
              color="secondary"
              sx={{
                borderRadius: "20px",
              }}
              onClick={() => {
                router.push("/business");
              }}
            >
              For Business
            </Button>
          </Box>
        )}
        <Box sx={{ textAlign: "right" }}>
          <Button color="inherit" sx={{ fontSize: "16px" }}>
            Why XFluencer
          </Button>
          <Button
            color="inherit"
            sx={{ fontSize: "16px" }}
            onClick={() => {
              router.push("/business/explore");
            }}
          >
            Explore
          </Button>
          <Button color="inherit" sx={{ fontSize: "16px" }}>
            How it works
          </Button>
          <Button color="inherit" sx={{ fontSize: "16px" }}>
            About
          </Button>
          {isTwitterUserLoggedIn ? (
            <>
              {pathname.includes("business") ? null : (
                <Button
                  color="inherit"
                  sx={{ fontSize: "16px" }}
                  onClick={() => {
                    window.location.href = `/influencer/profile/${currentUser?.id}`;
                  }}
                >
                  Profile
                </Button>
              )}
              <Button
                variant="outlined"
                sx={{
                  background:
                    "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                  color: "black",
                  border: "1px solid black",
                  borderRadius: "20px",
                  "&:hover": {
                    border: "1px solid black",
                  },
                }}
                onClick={() => {
                  logoutTwitterUser();
                  if (pathname.includes("influencer")) {
                    router.push("/influencer");
                  } else if (pathname.includes("business")) {
                    router.push("/business");
                  } else {
                    router.push("/");
                  }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {pathname.includes("influencer") ? (
                <Button
                  variant="outlined"
                  sx={{
                    background:
                      "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
                    color: "black",
                    border: "1px solid black",
                    borderRadius: "20px",
                  }}
                  onClick={startTwitterAuthentication}
                >
                  Login
                </Button>
              ) : (
                <>
                  <LoginMenu
                    twitterLogin={startTwitterAuthentication}
                    setEmailOpen={setEmailOpen}
                    setWalletOpen={setWalletOpen}
                  />
                </>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
