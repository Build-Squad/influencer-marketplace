"use client";

import { useAppSelector } from "@/src/hooks/useRedux";
import { ROLE_NAME } from "@/src/utils/consts";
import { stringToColor } from "@/src/utils/helper";
import { Avatar, List, ListItem, Menu } from "@mui/material";
import { useRouter } from "next/navigation";
import * as React from "react";

type LoginMenuProps = {
  logoutTwitterUser: () => {};
};

export default function LoginMenu({ logoutTwitterUser }: LoginMenuProps) {
  const router = useRouter();
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
    return [
      {
        label: "My Profile",
        function: () => {
          if (currentUser && currentUser?.role?.name === ROLE_NAME.INFLUENCER) {
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
          // router.push("/");
        },
      },
    ];
  };

  return (
    <>
      {currentUser?.twitter_account?.profile_image_url &&
      !currentUser?.twitter_account?.profile_image_url.includes("default") ? (
        <>
          <Avatar
            sx={{
              width: "34px",
              height: "34px",
              cursor: "pointer",
            }}
            onClick={handleClick}
            src={currentUser?.twitter_account?.profile_image_url}
          />
        </>
      ) : (
        <Avatar
          sx={{
            bgcolor: stringToColor(
              currentUser?.username ? currentUser?.username : ""
            ),
            width: "34px",
            height: "34px",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          {currentUser?.username?.charAt(0)?.toUpperCase()}
        </Avatar>
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
