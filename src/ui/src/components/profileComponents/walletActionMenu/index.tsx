import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";

type WalletActionMenuProps = {
  wallet: WalletType;
};

export default function WalletActionMenu({ wallet }: WalletActionMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = [
    {
      label: "Disconnect",
    },
    {
      label: "Make Primary",
    },
    {
      label: "Remove",
    },
  ];

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((option) => {
          // If the wallet is primary, then disable the make primary option and the remove option

          return (
            <MenuItem
              key={option.label}
              onClick={() => {
                console.log(
                  wallet.wallet_provider_id.wallet_provider,
                  option.label
                );
              }}
              disabled={wallet.is_primary && option.label !== "Disconnect"}
            >
              {option.label}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
