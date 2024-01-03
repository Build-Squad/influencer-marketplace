"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button, List, ListItem, Menu } from "@mui/material";
import * as React from "react";
import ProfileIcon from "@/public/svg/Profile.svg";
import Image from "next/image";

type LoginMenuProps = {
  twitterLogin: () => {};
  setEmailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWalletOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginMenu({
  twitterLogin,
  setEmailOpen,
  setWalletOpen,
}: LoginMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const loginOptions = [
    {
      label: "Profile",
      function: () => {},
    },
    {
      label: "Connect with X",
      function: twitterLogin,
    },
    {
      label: "Connect with Email",
      function: () => {
        setEmailOpen(true);
      },
    },
    {
      label: "Connect with Wallet",
      function: () => setWalletOpen(true),
    },
  ];

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
          {loginOptions.map((option: any) => (
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
