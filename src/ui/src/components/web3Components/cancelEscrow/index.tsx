import { IconButton, Tooltip } from "@mui/material";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import idl from "../../../utils/xfluencer.json";

import * as anchor from "@coral-xyz/anchor";

import { postService } from "@/src/services/httpServices";
import { getAnchorProgram } from "@/src/utils/anchorUtils";
import { TRANSACTION_TYPE } from "@/src/utils/consts";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import DownloadingIcon from "@mui/icons-material/Downloading";
import { AnchorProvider, setProvider } from "@project-serum/anchor";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { notification } from "../../shared/notification";

type CancelEscrowProps = {
  order: OrderType;
  updateStatus: () => void;
};

const programId = new PublicKey(idl.metadata.address);

export default function CancelEscrow({
  updateStatus,
  order,
}: CancelEscrowProps) {
  const [localLoading, setLocalLoading] = useState(false);
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

  const { publicKey, sendTransaction, connect } = useWallet();

  const updateBusinessTransactionAddress = async (address: string) => {
    try {
      const { isSuccess, message } = await postService(
        `orders/create-transaction/`,
        {
          order_id: order?.id,
          transaction_address: address,
          transaction_type: TRANSACTION_TYPE.CANCEL_ESCROW,
          status: "success",
        }
      );

      if (isSuccess) {
        notification("Refund successfully claimed!", "success");
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

  const cancelEscrow = async () => {
    try {
      setLocalLoading(true);
      if (order?.influencer_wallet && order?.order_number) {
        // Get influencer wallet address
        const influencer_pk = new PublicKey(
          order?.influencer_wallet?.wallet_address_id
        );

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
            publicKey.toBuffer(),
            influencer_pk.toBuffer(),
            utf8.encode(order?.order_number?.toString()),
          ],
          programId
        );

        // Create the escrow
        const ix = await program.methods
          .cancelEscrowSol()
          .accounts({
            business: publicKey,
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
              `Instruction error number found: ` +
                txSign?.value?.err?.toString(),
              "error"
            );
          } else {
            updateBusinessTransactionAddress(signature);
          }
        } catch (error) {
          console.error("Transaction error", error);
        }
      }
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Tooltip title="Claim">
      <IconButton
        onClick={() => {
          cancelEscrow();
        }}
        disabled={localLoading}
      >
        <DownloadingIcon />
      </IconButton>
    </Tooltip>
  );
}
