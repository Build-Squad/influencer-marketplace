"use client";

import { Avatar, Box, List, ListItem, Menu, Typography } from "@mui/material";
import * as React from "react";
import ProfileIcon from "@/public/svg/Profile.svg";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Lock } from "@mui/icons-material";
import { useAppSelector } from "@/src/hooks/useRedux";
import { ROLE_NAME } from "@/src/utils/consts";

type LoginMenuProps = {
  logoutTwitterUser: () => {};
  isTwitterUserLoggedIn: boolean;
  twitterLogin: () => {};
  setEmailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWalletOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginMenu({
  logoutTwitterUser,
  isTwitterUserLoggedIn,
  twitterLogin,
  setEmailOpen,
  setWalletOpen,
}: LoginMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const currentUser = useAppSelector((state) => state.user?.user);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getLoginOptions = () => {
    let options = [];
    if (isTwitterUserLoggedIn) {
      options.push(
        {
          label: "My Profile",
          function: () => {
            if (
              currentUser &&
              currentUser?.role?.name === ROLE_NAME.INFLUENCER
            ) {
              window.location.href = `/influencer/profile/${currentUser?.id}`;
            } else if (
              currentUser &&
              currentUser?.role?.name === ROLE_NAME.BUSINESS_OWNER
            ) {
              router.push("/business/profile?tab=wallet");
            } else {
              return;
            }
          },
        },
        {
          label: "Logout",
          function: () => {
            logoutTwitterUser();
            router.push("/");
          },
        }
      );
    }
    if (!isTwitterUserLoggedIn) {
      options.push({
        label: "Connect with X",
        function: twitterLogin,
      });
      if (pathname.includes("business")) {
        options.push(
          {
            label: "Connect with Email",
            function: () => {
              setEmailOpen(true);
            },
          },
          {
            label: "Connect with Wallet",
            function: () => setWalletOpen(true),
          }
        );
      }
    }

    return options;
  };

  return (
    <>
      {isTwitterUserLoggedIn ? (
        <>
          {currentUser?.twitter_account?.profile_image_url ? (
            <Avatar
              sx={{
                width: "34px",
                height: "34px",
                cursor: "pointer",
              }}
              onClick={handleClick}
              src={currentUser?.twitter_account?.profile_image_url}
            />
          ) : (
            <Image
              src={ProfileIcon}
              alt={"Profile Icon"}
              height={34}
              onClick={handleClick}
              style={{ cursor: "pointer" }}
            />
          )}
        </>
      ) : (
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleClick}
        >
          <Lock style={{ fontSize: "16px" }} />
          <Typography sx={{ fontSize: "10px" }}>Login</Typography>
        </Box>
      )}

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "20px",
          },
        }}
      >
        <List>
          {getLoginOptions().map((option: any) => (
            <ListItem
              key={option.label}
              onClick={() => {
                option.function();
                handleClose();
              }}
              sx={{
                width: "100%",
                justifyContent: "left",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#F2F2F2",
                },
              }}
            >
              {option.label}
            </ListItem>
          ))}
        </List>
      </Menu>
    </>
  );
}
