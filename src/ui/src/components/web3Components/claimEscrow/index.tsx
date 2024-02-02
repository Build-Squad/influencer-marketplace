import MoveDownIcon from "@mui/icons-material/MoveDown";
import { IconButton, Tooltip } from "@mui/material";
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import idl from "../../../utils/xfluencer.json";

import * as anchor from "@coral-xyz/anchor";

import { getAnchorProgram } from "@/src/utils/anchorUtils";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { AnchorProvider, setProvider } from "@project-serum/anchor";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { notification } from "../../shared/notification";
import { putService } from "@/src/services/httpServices";
import DownloadingIcon from "@mui/icons-material/Downloading";

type CreateEscrowProps = {
  order: OrderType;
  updateStatus: () => void;
};

const programId = new PublicKey(idl.metadata.address);

export default function ClaimEscrow({
  updateStatus,
  order,
}: CreateEscrowProps) {
  const connection = new Connection(
    `https://rpc.ironforge.network/devnet?apiKey=${process.env.NEXT_PUBLIC_RPC_KEY}`,
    {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 30000,
    }
  );
  const wallet = useAnchorWallet();

  const program = getAnchorProgram(connection);
  const provider = new AnchorProvider(connection, wallet!, {});
  setProvider(provider);

  const { publicKey, sendTransaction } = useWallet();

  const updateInfluencerTransactionAddress = async (address: string) => {
    try {
      const { isSuccess, message } = await putService(
        `orders/update-influencer-transaction/${order?.id}/`,
        {
          address: address,
        }
      );

      if (isSuccess) {
        notification("Payment successfully claimed!", "success");
      } else {
        notification(
          message
            ? message
            : "Something went wrong, couldn't update order status",
          "error"
        );
      }
    } finally {
      updateStatus();
    }
  };

  const claimEscrow = async () => {
    if (order?.buyer_wallet && order?.order_number) {
      // Get influencer wallet address
      const buyer_pk = new PublicKey(order?.buyer_wallet?.wallet_address_id);

      // breakpoint

      // Check if wallet is connected
      if (!connection || !publicKey) {
        notification("Please connect your wallet first", "error");
        return;
      }

      // Find the escrow PDA
      const [escrowPDA] = PublicKey.findProgramAddressSync(
        [
          utf8.encode("escrow"),
          buyer_pk.toBuffer(),
          publicKey.toBuffer(),
          utf8.encode(order?.order_number?.toString()),
        ],
        programId
      );

      // Create the escrow
      const ix = await program.methods
        .claimEscrow(new anchor.BN(order?.order_number))
        .accounts({
          influencer: publicKey,
          business: buyer_pk,
          escrowAccount: escrowPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();

      const tx = new Transaction().add(ix);

      const options = {
        skipPreflight: true,
      };

      try {
        const signature = await sendTransaction(tx, connection, options);

        console.log("Transaction signature: ", signature);

        const txSign = await connection.confirmTransaction(
          signature,
          "processed"
        );

        if (txSign.value.err != null) {
          notification(
            `Instruction error number found: ` + txSign?.value?.err?.toString(),
            "error"
          );
        } else {
          updateInfluencerTransactionAddress(signature);
        }
      } catch (error) {
        console.error("Transaction error", error);
      }
    }
  };

  return (
    <Tooltip title="Claim">
      <IconButton
        onClick={() => {
          claimEscrow();
        }}
      >
        <DownloadingIcon />
      </IconButton>
    </Tooltip>
  );
}
