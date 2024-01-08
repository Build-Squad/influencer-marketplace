"use client";

import { List, ListItem, Menu } from "@mui/material";
import * as React from "react";
import ProfileIcon from "@/public/svg/Profile.svg";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/src/hooks/useRedux";

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
            if (pathname.includes("influencer")) {
              window.location.href = `/influencer/profile/${currentUser?.id}`;
            }
          },
        },
        {
          label: "Logout",
          function: () => {
            logoutTwitterUser();
            if (pathname.includes("influencer")) {
              router.push("/influencer");
            } else if (pathname.includes("business")) {
              router.push("/business");
            } else {
              router.push("/");
            }
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
      <Image
        src={ProfileIcon}
        alt={"Profile Icon"}
        height={34}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      />
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
