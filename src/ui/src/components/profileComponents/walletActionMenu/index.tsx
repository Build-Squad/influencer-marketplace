import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { notification } from "../../shared/notification";
import { postService } from "@/src/services/httpServices";

type userWalletActionMenuProps = {
  userWallet: WalletType;
  getWallets: () => void;
};

export default function WalletActionMenu({
  userWallet,
  getWallets,
}: userWalletActionMenuProps) {
  const { wallet, publicKey, connected, disconnect } = useWallet();
  const [currenctConnectWalletAddress, setCurrenctConnectWalletAddress] =
    React.useState<string>("");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const makePrimary = async (walletAddress: string) => {};

  const options = [
    {
      label: "Disconnect",
      onClick: () => {
        try {
          if (connected) {
            disconnect();
            notification("Wallet disconnected successfully");
          } else {
            notification("Wallet is not connected", "error");
          }
        } catch (error: any) {
          console.log(error);
        }
      },
    },
    {
      label: "Make Primary",
      onClick: () => {
        makePrimary(userWallet?.wallet_address_id);
      },
    },
    {
      label: "Remove",
      onClick: () => {
        console.log("remove");
      },
    },
  ];

  useEffect(() => {
    if (publicKey) {
      setCurrenctConnectWalletAddress(
        publicKey.toBase58()?.slice(0, 4) +
          "..." +
          publicKey.toBase58()?.slice(-4)
      );
    } else {
      setCurrenctConnectWalletAddress("");
    }
  }, [publicKey]);

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((option) => {
          // If the userWallet is primary, then disable the make primary option and the remove option
          return (
            <MenuItem
              key={option.label}
              onClick={() => {
                option.onClick();
                handleClose();
              }}
              disabled={
                (userWallet?.wallet_address_id !==
                  currenctConnectWalletAddress &&
                  option.label === "Disconnect") ||
                (userWallet?.is_primary &&
                  (option.label === "Make Primary" ||
                    option.label === "Remove"))
              }
            >
              {option.label}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
