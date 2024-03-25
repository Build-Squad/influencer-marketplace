import { TRANSACTION_TYPE } from "@/src/utils/consts";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { Button, IconButton, Link, Tooltip } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

type TransactionIconProps = {
  transaction: TransactionType;
};

export default function TransactionIcon({ transaction }: TransactionIconProps) {
  const labels = {
    [TRANSACTION_TYPE.INITIATE_ESCROW]: "Offer TX",
    [TRANSACTION_TYPE.CANCEL_ESCROW]: "Refund TX",
    [TRANSACTION_TYPE.CLAIM_ESCROW]: "Payment TX",
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
        <Button
          variant={
            transaction?.transaction_type === TRANSACTION_TYPE.CANCEL_ESCROW
              ? "outlined"
              : "contained"
          }
          color="secondary"
          size="small"
          sx={{
            mx: 0.5,
          }}
          endIcon={<OpenInNewIcon />}
        >
          {labels[transaction?.transaction_type]}
        </Button>
      </Link>
    </Tooltip>
  );
}
