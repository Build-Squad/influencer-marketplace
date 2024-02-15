import { useAppSelector } from "@/src/hooks/useRedux";
import { Button, CircularProgress } from "@mui/material";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import idl from "../../../utils/xfluencer.json";

import * as anchor from "@coral-xyz/anchor";

import { getAnchorProgram } from "@/src/utils/anchorUtils";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { AnchorProvider, setProvider } from "@project-serum/anchor";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { notification } from "../../shared/notification";

type CreateEscrowProps = {
  loading: boolean;
  updateStatus: (address: string) => Promise<void>;
};

const programId = new PublicKey(idl.metadata.address);

export default function CreateEscrow({
  loading,
  updateStatus,
}: CreateEscrowProps) {
  const cart = useAppSelector((state) => state.cart);
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

  const createEscrow = async () => {
    try {
      setLocalLoading(true);
      if (cart?.order_number && cart?.influencer_wallet) {
        // Get influencer wallet address
        const influencer_pk = new PublicKey(
          cart?.influencer_wallet?.wallet_address_id
        );

        // Check if wallet is connected
        if (!connection || !publicKey) {
          await connect();
          notification("Please connect your wallet first", "error");
          return;
        }

        // Find the escrow PDA
        const [escrowPDA] = PublicKey.findProgramAddressSync(
          [
            utf8.encode("escrow"),
            publicKey.toBuffer(),
            influencer_pk.toBuffer(),
            utf8.encode(cart?.order_number?.toString()),
          ],
          programId
        );

        const amount = Number(cart?.orderTotal) * 10 ** 9;

        // Create the escrow
        const ix = await program.methods
          .createEscrow(
            new anchor.BN(amount),
            new anchor.BN(cart?.order_number)
          )
          .accounts({
            from: publicKey,
            to: influencer_pk,
            systemProgram: anchor.web3.SystemProgram.programId,
            escrow: escrowPDA,
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
            updateStatus(signature);
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
    <Button
      disableElevation
      fullWidth
      variant="outlined"
      sx={{
        background: "linear-gradient(90deg, #99E2E8 0%, #F7E7F7 100%)",
        color: "black",
        border: "1px solid black",
        borderRadius: "20px",
        mt: 2,
      }}
      disabled={loading || !cart?.orderId || localLoading}
      onClick={() => {
        createEscrow();
      }}
    >
      {localLoading ? (
        <CircularProgress size={24} color="secondary" />
      ) : (
        "Make Offer"
      )}
    </Button>
  );
}
