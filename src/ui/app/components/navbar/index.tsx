import { loginStatusType } from "@/app/utils/types";
import HomeIcon from "@/public/svg/Home.svg";
import HomeDisabledIcon from "@/public/svg/Home_disabled.svg";
import { useAppSelector } from "@/src/hooks/useRedux";
import useTwitterAuth from "@/src/hooks/useTwitterAuth";
import { LOGIN_STATUS_FAILED, LOGIN_STATUS_SUCCESS } from "@/src/utils/consts";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Lock } from "@mui/icons-material";
import React, { useEffect } from "react";
import LoginMenu from "../loginMenu";

import CartIcon from "@/public/svg/Cart.svg";
import CartDisabledIcon from "@/public/svg/Cart_disabled.svg";
import DashboardIcon from "@/public/svg/Dashboard.svg";
import DashboardDisabledIcon from "@/public/svg/Dashboard_disabled.svg";
import ExploreIcon from "@/public/svg/Explore.svg";
import ExploreDisabledIcon from "@/public/svg/Explore_disabled.svg";
import MessagesIcon from "@/public/svg/Messages.svg";
import MessagesDisabledIcon from "@/public/svg/Messages_disabled.svg";
import NotificationIcon from "@/public/svg/Notification.svg";
import NotificationDisabledIcon from "@/public/svg/Notification_disabled.svg";
import OrdersIcon from "@/public/svg/Orders.svg";
import OrdersDisabledIcon from "@/public/svg/Orders_Disabled.svg";
import XfluencerLogo from "@/public/svg/Xfluencer_Logo_Beta.svg";
import NotificationPanel from "@/src/components/notificationPanel";
import NextLink from "next/link";

type NavbarProps = {
  setLoginStatus: React.Dispatch<React.SetStateAction<loginStatusType>>;
  setCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  Messages: {
    label: "Messages",
    route: "/messages",
    icon: MessagesIcon,
    disabledIcon: MessagesDisabledIcon,
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
};

const MenuItemsComponent = ({ items }: { items: string[] }) => {
  const cart = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.user);
  const pathname = usePathname();
  return items ? (
    <>
      {items?.map((key: string) => {
        const item = MENU_ITEMS[key];

        let route = "";
        if (!user?.user?.role) {
          if (pathname.includes("business")) {
            route = `/business${item?.route}`;
          } else if (pathname.includes("influencer")) {
            route = `/influencer${item?.route}`;
          } else {
            route = "/business";
          }
        } else {
          route = user?.user?.role?.name?.includes("business")
            ? `/business${item?.route}`
            : pathname.includes("influencer")
            ? `/influencer${item?.route}`
            : "";
        }

        return (
          <Box key={item.label}>
            {item?.route.includes("/notifications") ? (
              <Box
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NotificationPanel />
                <Typography sx={{ fontSize: "10px" }}>{item?.label}</Typography>
              </Box>
            ) : (
              <Link
                component={NextLink}
                href={route}
                sx={{
                  color: "secondary.main",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {item?.route.includes("/checkout") ? (
                  <Badge
                    badgeContent={cart?.orderItems.length}
                    color="secondary"
                  >
                    <Image
                      src={pathname == route ? item?.icon : item?.disabledIcon}
                      alt={item?.label}
                      height={16}
                    />
                  </Badge>
                ) : item?.route.includes("/notifications") ? (
                  <NotificationPanel />
                ) : (
                  <Image
                    src={pathname == route ? item?.icon : item?.disabledIcon}
                    alt={item?.label}
                    height={16}
                  />
                )}

                <Typography sx={{ fontSize: "10px" }}>{item?.label}</Typography>
              </Link>
            )}
          </Box>
        );
      })}
    </>
  ) : null;
};

export default function Navbar({
  setLoginStatus,
  setCategoryOpen,
  categoryOpen,
}: NavbarProps) {
  const {
    isTwitterUserLoggedIn,
    logoutTwitterUser,
    isAccountSetupComplete,
    checkAccountSetup,
  } = useTwitterAuth();

  const router = useRouter();
  const pathname = usePathname();
  // const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);

  const params = useSearchParams();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    const status = params.get("authenticationStatus");
    const message = params.get("message");
    if (status) {
      setLoginStatus({
        status,
        message:
          status == "success"
            ? LOGIN_STATUS_SUCCESS
            : message ?? LOGIN_STATUS_FAILED,
      });
      router.push(pathname);
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

  useEffect(() => {
    if (!categoryOpen) {
      checkAccountSetup();
    }
  }, [categoryOpen]);

  const handleConnect = () => {
    const roleQueryParams = pathname.includes("business")
      ? "Business"
      : "Influencer";
    router.push(`/login?role=${roleQueryParams}`);
  };

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: "none",
        borderBottom: "1px solid #D3D3D3",
        position: "sticky",
        top: 0,
        zIndex: 2,
      }}
    >
      <Toolbar
        component="nav"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ width: "33%" }}>
          <Link
            component={NextLink}
            href="/"
            sx={{
              textDecoration: "none",
            }}
          >
            <Image
              src={XfluencerLogo}
              width={175}
              height={30}
              alt="bgimg"
              priority
            />
          </Link>
        </Box>
        {user?.loggedIn || pathname.includes("login") ? null : (
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
                router.push("/influencer?loginAs=Influencer");
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
                router.push("/business?loginAs=Business");
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
            {user?.loggedIn ? (
              // Business menu items
              user?.user?.role?.name.includes("business_owner") ? (
                <MenuItemsComponent
                  items={[
                    "Home",
                    "Explore",
                    "Dashboard",
                    "Messages",
                    "Cart",
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
                    "Messages",
                    "Notifications",
                  ]}
                />
              )
            ) : (
              <>
                {pathname.includes("business") ? (
                  <MenuItemsComponent items={["Home", "Explore"]} />
                ) : (
                  <MenuItemsComponent items={["Home"]} />
                )}
              </>
            )}

            {user?.loggedIn ? (
              <LoginMenu logoutTwitterUser={logoutTwitterUser} />
            ) : (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleConnect}
              >
                Connect
              </Button>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
