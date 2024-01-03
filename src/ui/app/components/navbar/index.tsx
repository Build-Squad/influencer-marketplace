import React, { useEffect, useState } from "react";
import { Toolbar, AppBar, Button, Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LoginMenu from "../loginMenu";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import { LOGIN_STATUS_SUCCESS, LOGIN_STATUS_FAILED } from "@/src/utils/consts";
import { loginStatusType } from "@/app/utils/types";
import { useAppSelector } from "@/src/hooks/useRedux";
import HomeIcon from "@/public/svg/Home.svg";
import HomeDisabledIcon from "@/public/svg/Home_disabled.svg";

import ProfileIcon from "@/public/svg/Profile.svg";
import ProfileDisabledIcon from "@/public/svg/Profile_disabled.svg";

import DashboardIcon from "@/public/svg/Dashboard.svg";
import DashboardDisabledIcon from "@/public/svg/Dashboard_disabled.svg";

import CartIcon from "@/public/svg/Cart.svg";
import CartDisabledIcon from "@/public/svg/Cart_disabled.svg";

import NotificationIcon from "@/public/svg/Notification.svg";
import NotificationDisabledIcon from "@/public/svg/Notification_disabled.svg";

import ExploreIcon from "@/public/svg/Explore.svg";
import ExploreDisabledIcon from "@/public/svg/Explore_disabled.svg";

type NavbarProps = {
  setLoginStatus: React.Dispatch<React.SetStateAction<loginStatusType>>;
  setEmailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWalletOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  emailOpen: boolean;
  walletOpen: boolean;
};

const MENU_ITEMS = [
  {
    label: "Home",
    route: "/business",
    icon: HomeIcon,
    disabledIcon: HomeDisabledIcon,
  },
  {
    label: "Explore",
    route: "/business/explore",
    icon: ExploreIcon,
    disabledIcon: ExploreDisabledIcon,
  },

  {
    label: "Dashboard",
    route: "/business/dashboard",
    icon: DashboardIcon,
    disabledIcon: DashboardDisabledIcon,
  },
  {
    label: "My cart",
    route: "/business/cart",
    icon: CartIcon,
    disabledIcon: CartDisabledIcon,
  },
  {
    label: "Notifications",
    route: "/business/notifications",
    icon: NotificationIcon,
    disabledIcon: NotificationDisabledIcon,
  },
];

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              columnGap: "16px",
            }}
          >
            {MENU_ITEMS.map((item: any) => {
              return (
                <Box
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    if (item?.route) {
                      router.push(item.route);
                    }
                  }}
                >
                  <Image
                    src={pathname == item.route ? item.icon : item.disabledIcon}
                    alt={item.label}
                    height={item.height ?? 16}
                  />
                  <Typography sx={{ fontSize: "10px" }}>
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}
