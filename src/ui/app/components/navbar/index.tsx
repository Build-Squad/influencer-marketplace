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
import UserIcon from "@/public/svg/User.svg";
import UserDisabledIcon from "@/public/svg/UserUnselected.svg";
import XfluencerLogo from "@/public/svg/Xfluencer_Logo_Beta.svg";
import NotificationPanel from "@/src/components/notificationPanel";
import { notification } from "@/src/components/shared/notification";
import NextLink from "next/link";
import SavedProfileIcon from "@/public/svg/Saved.svg";
import SavedProfileDisabledIcon from "@/public/svg/Saved_disabled.svg";

const MENU_ITEMS: {
  [key: string]: {
    label: string;
    route: string;
    icon: string;
    disabledIcon: string;
  };
} = {
  Profile: {
    label: "Profile",
    route: "/profile",
    icon: UserIcon,
    disabledIcon: UserDisabledIcon,
  },
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
  Bookmarks: {
    label: "Bookmarks",
    route: "/bookmarks",
    icon: SavedProfileIcon,
    disabledIcon: SavedProfileDisabledIcon,
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
  const [unreadMessageCount, setUnreadMessageCount] = React.useState(0);
  const [orderRequestCount, setOrderRequestCount] = React.useState(0);

  return items ? (
    <>
      {items?.map((key: string) => {
        const item = MENU_ITEMS[key];

        let route = "";

        // Setting routes when user is NOT logged in
        if (!user?.user?.role) {
          if (pathname.includes("business")) {
            route = `/business${item?.route}`;
          } else if (pathname.includes("influencer")) {
            route = `/influencer${item?.route}`;
          } else {
            route = "/business";
          }
        }
        // User is logged in
        else {
          route = user?.user?.role?.name?.includes("business")
            ? `/business${item?.route}`
            : pathname.includes("influencer")
            ? `/influencer${item?.route}`
            : "";
          if (item?.label == "Profile") {
            if (user?.user?.role?.name?.includes("business")) {
              route = "/business/profile?tab=wallet";
            } else {
              route = `${route}/${user?.user?.id}` ?? "";
            }
          }
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
                  color: "secondary.main",
                }}
              >
                <NotificationPanel
                  setUnreadMessageCount={setUnreadMessageCount}
                  setOrderRequestCount={setOrderRequestCount}
                />
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
                  <NotificationPanel
                    setUnreadMessageCount={setUnreadMessageCount}
                    setOrderRequestCount={setOrderRequestCount}
                  />
                ) : item?.route.includes("/messages") ? (
                  <Badge badgeContent={unreadMessageCount} color="secondary">
                    <Image
                      src={pathname == route ? item?.icon : item?.disabledIcon}
                      alt={item?.label}
                      height={16}
                    />
                  </Badge>
                ) : item?.route.includes("/orders") ? (
                  <Badge badgeContent={orderRequestCount} color="secondary">
                    <Image
                      src={pathname == route ? item?.icon : item?.disabledIcon}
                      alt={item?.label}
                      height={16}
                    />
                  </Badge>
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

export default function Navbar() {
  const { logoutTwitterUser } = useTwitterAuth();

  const router = useRouter();
  const pathname = usePathname();
  // const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);

  const user = useAppSelector((state) => state.user);

  const handleConnect = () => {
    const roleQueryParams = pathname.includes("business")
      ? "Business"
      : "Influencer";
    router.push(`/login?role=${roleQueryParams}`);
  };

  const getButtonVariant = (type: string) => {
    // A temp hack considering if the user is not logged in,
    // only business owner will view the influencer's profile
    if (!user?.loggedIn && pathname.includes("influencer/profile")) {
      if (type == "influencer") return "outlined";
      if (type == "business") return "contained";
    }
    return pathname.includes(type) ? "contained" : "outlined";
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
              variant={getButtonVariant("influencer")}
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
              variant={getButtonVariant("business")}
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
            {user?.loggedIn ? (
              // Business menu items
              user?.user?.role?.name.includes("business_owner") ? (
                <MenuItemsComponent
                  items={[
                    "Profile",
                    "Explore",
                    "Dashboard",
                    "Messages",
                    "Cart",
                    "Bookmarks",
                    "Notifications",
                  ]}
                />
              ) : (
                // Influencer menu items
                <MenuItemsComponent
                  items={[
                    "Profile",
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
                ) : null}
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
