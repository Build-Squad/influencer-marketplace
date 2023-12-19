"use client";

import { Box, Button, List, ListItem, Menu } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import * as React from "react";

type LoginMenuProps = {
  twitterLogin: () => {};
  setEmailOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginMenu({
  twitterLogin,
  setEmailOpen,
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
      function: () => {},
    },
  ];

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        sx={{
          borderRadius: "20px",
        }}
        endIcon={<ArrowDropDownIcon />}
        onClick={handleClick}
      >
        Connect
      </Button>
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
