import { useAppSelector } from "@/src/hooks/useRedux";
import { Box, IconButton, Link, Tooltip } from "@mui/material";
import React from "react";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { TRANSACTION_TYPE } from "@/src/utils/consts";

type TransactionIconProps = {
  transaction: TransactionType;
};

export default function TransactionIcon({ transaction }: TransactionIconProps) {
  const user = useAppSelector((state) => state.user?.user);

  const colors = {
    [TRANSACTION_TYPE.INITIATE_ESCROW]: "success.main",
    [TRANSACTION_TYPE.CANCEL_ESCROW]: "success.main",
    [TRANSACTION_TYPE.CLAIM_ESCROW]: "success.main",
  };

  return (
    <Tooltip title="View Transaction" arrow disableInteractive>
      <Link
        href={`https://solana.fm/tx/${transaction?.transaction_address}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK}`}
        target="_blank"
        sx={{
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        <IconButton>
          <TravelExploreIcon
            sx={{
              color: colors[transaction?.transaction_type],
            }}
          />
        </IconButton>
      </Link>
    </Tooltip>
  );
}
