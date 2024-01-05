import { loginStatusType } from "@/app/utils/types";
import HomeIcon from "@/public/svg/Home.svg";
import HomeDisabledIcon from "@/public/svg/Home_disabled.svg";
import { useAppSelector } from "@/src/hooks/useRedux";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import { LOGIN_STATUS_FAILED, LOGIN_STATUS_SUCCESS } from "@/src/utils/consts";
import { AppBar, Badge, Box, Button, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import LoginMenu from "../loginMenu";

import DashboardIcon from "@/public/svg/Dashboard.svg";
import DashboardDisabledIcon from "@/public/svg/Dashboard_disabled.svg";
import CartIcon from "@/public/svg/Cart.svg";
import CartDisabledIcon from "@/public/svg/Cart_disabled.svg";
import NotificationIcon from "@/public/svg/Notification.svg";
import NotificationDisabledIcon from "@/public/svg/Notification_disabled.svg";
import ExploreIcon from "@/public/svg/Explore.svg";
import ExploreDisabledIcon from "@/public/svg/Explore_disabled.svg";
import OrdersDisabledIcon from "@/public/svg/Orders_disabled.svg";
import OrdersIcon from "@/public/svg/Orders.svg";
import MessageIcon from "@/public/svg/Messages.svg";
import MessageDisabledIcon from "@/public/svg/Messages_disabled.svg";

import SavedProfileIcon from "@/public/svg/Saved.svg";
import SavedProfileDisabledIcon from "@/public/svg/Saved_disabled.svg";
import { getService } from "@/src/services/httpServices";

type NavbarProps = {
  setLoginStatus: React.Dispatch<React.SetStateAction<loginStatusType>>;
  setEmailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWalletOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  emailOpen: boolean;
  walletOpen: boolean;
  setConnectWallet: React.Dispatch<React.SetStateAction<boolean>>;
  categoryOpen: boolean;
};

const MENU_ITEMS: {
  [key: string]: {
    label: string;
    route: string;
    icon: string;
    disabledIcon: string;
  };
} = {
  Home: {
    label: "Home",
    route: "",
    icon: HomeIcon,
    disabledIcon: HomeDisabledIcon,
  },
  Explore: {
    label: "Explore",
    route: "/explore",
    icon: ExploreIcon,
    disabledIcon: ExploreDisabledIcon,
  },
  Dashboard: {
    label: "Dashboard",
    route: "/dashboard",
    icon: DashboardIcon,
    disabledIcon: DashboardDisabledIcon,
  },
  Cart: {
    label: "My cart",
    route: "/checkout",
    icon: CartIcon,
    disabledIcon: CartDisabledIcon,
  },
  Notifications: {
    label: "Notifications",
    route: "/notifications",
    icon: NotificationIcon,
    disabledIcon: NotificationDisabledIcon,
  },
  Orders: {
    label: "Orders",
    route: "/orders",
    icon: OrdersIcon,
    disabledIcon: OrdersDisabledIcon,
  },
  Message: {
    label: "Messages",
    route: "/messages",
    icon: MessageIcon,
    disabledIcon: MessageDisabledIcon,
  },

  "Saved Profile": {
    label: "Saved Profile",
    route: "/saved-profiles",
    icon: SavedProfileIcon,
    disabledIcon: SavedProfileDisabledIcon,
  },
};

const MenuItemsComponent = ({ items }: { items: string[] }) => {
  const cart = useAppSelector((state) => state.cart);
  const router = useRouter();
  const pathname = usePathname();
  return items ? (
    <>
      {items.map((key: string) => {
        const item = MENU_ITEMS[key];
        const route = pathname.includes("business")
          ? `/business${item.route}`
          : pathname.includes("influencer")
          ? `/influencer${item.route}`
          : "";

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
              router.push(route);
            }}
          >
            {item.label === "My cart" ? (
              <Badge badgeContent={cart?.orderItems.length} color="secondary">
                <Image
                  src={pathname == route ? item.icon : item.disabledIcon}
                  alt={item.label}
                  height={16}
                />
              </Badge>
            ) : (
              <Image
                src={pathname == route ? item.icon : item.disabledIcon}
                alt={item.label}
                height={16}
              />
            )}

            <Typography sx={{ fontSize: "10px" }}>{item.label}</Typography>
          </Box>
        );
      })}
    </>
  ) : null;
};

export default function Navbar({
  setLoginStatus,
  setEmailOpen,
  setWalletOpen,
  setCategoryOpen,
  emailOpen,
  walletOpen,
  setConnectWallet,
  categoryOpen,
}: NavbarProps) {
  const {
    isTwitterUserLoggedIn,
    startTwitterAuthentication,
    logoutTwitterUser,
    checkTwitterUserAuthentication,
    isAccountSetupComplete,
    categoriesAdded,
    checkAccountSetup,
  } = useTwitterAuth();

  const router = useRouter();
  const pathname = usePathname();
  // const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);

  const params = useSearchParams();

  const getWallets = async () => {
    const { isSuccess, message, data } = await getService(`/account/wallets/`);
    if (isSuccess) {
      if (data?.data?.length === 0) {
        setWalletOpen(true);
        setConnectWallet(true);
      }
    }
  };

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
      !isAccountSetupComplete &&
      status === "success"
    ) {
      setCategoryOpen(true);
    }
  }, [isTwitterUserLoggedIn, isAccountSetupComplete]);

  // Check for the wallet open after the categroy selection
  // But also check if category selection check is complete

  useEffect(() => {
    if (!categoryOpen) {
      checkAccountSetup();
    }
  }, [categoryOpen]);

  useEffect(() => {
    const status = params.get("authenticationStatus");
    console.log("categoriesAdded", categoriesAdded);
    if (categoriesAdded && status === "success" && isTwitterUserLoggedIn) {
      getWallets();
    }
  }, [categoriesAdded, isTwitterUserLoggedIn]);

  return (
    <AppBar
      position="static"
      sx={{ boxShadow: "none", borderBottom: "1px solid #000" }}
    >
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
            onClick={() => {
              router.push("/");
            }}
          />
        </Box>
        {isTwitterUserLoggedIn ? null : (
          <Box
            sx={{
              display: "flex",
              columnGap: "8px",
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
        <Box sx={{ textAlign: "right", width: "33%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              columnGap: "16px",
            }}
          >
            {isTwitterUserLoggedIn ? (
              // Business menu items
              pathname.includes("business") ? (
                <MenuItemsComponent
                  items={[
                    "Home",
                    "Explore",
                    "Dashboard",
                    "Message",
                    "Cart",
                    "Saved Profile",
                    "Notifications",
                  ]}
                />
              ) : (
                // Influencer menu items
                <MenuItemsComponent
                  items={[
                    "Home",
                    "Orders",
                    "Dashboard",
                    "Message",
                    "Notifications",
                  ]}
                />
              )
            ) : (
              <MenuItemsComponent items={["Home", "Explore"]} />
            )}
            <LoginMenu
              isTwitterUserLoggedIn={isTwitterUserLoggedIn}
              twitterLogin={startTwitterAuthentication}
              setEmailOpen={setEmailOpen}
              setWalletOpen={setWalletOpen}
              logoutTwitterUser={logoutTwitterUser}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
