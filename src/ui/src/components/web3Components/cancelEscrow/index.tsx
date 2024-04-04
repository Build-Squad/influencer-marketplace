import { IconButton, Tooltip } from "@mui/material";
import {
  Connection,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from "@solana/web3.js";
import idl from "../../../utils/xfluencer.json";

import * as anchor from "@coral-xyz/anchor";

import { postService } from "@/src/services/httpServices";
import { getAnchorProgram } from "@/src/utils/anchorUtils";
import { CURRENCY_TYPE, TRANSACTION_TYPE } from "@/src/utils/consts";
import { findATA } from "@/src/utils/helper";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import DownloadingIcon from "@mui/icons-material/Downloading";
import { AnchorProvider, setProvider } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { notification } from "../../shared/notification";

type CancelEscrowProps = {
  order: OrderType;
  updateStatus: () => void;
  setConnectWallet: (value: boolean) => void;
};

const programId = new PublicKey(idl.metadata.address);

export default function CancelEscrow({
  updateStatus,
  order,
  setConnectWallet,
}: CancelEscrowProps) {
  const [localLoading, setLocalLoading] = useState(false);
  const connection = new Connection(`${process.env.NEXT_PUBLIC_RPC_LINK}`, {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 30000,
  });
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
        const influencerPk = new PublicKey(
          order?.influencer_wallet?.wallet_address_id
        );

        // breakpoint

        // Check if wallet is connected
        if (!connection || !publicKey) {
          notification("Please connect your wallet first", "error");
          setConnectWallet(true);
          return;
        }

        // Check that the correct wallet is connected
        if (publicKey?.toBase58() !== order?.buyer_wallet?.wallet_address_id) {
          notification("Please connect the correct wallet", "error");
          setConnectWallet(true);
          return;
        }

        if (order?.currency?.currency_type === CURRENCY_TYPE.SOL) {
          // Find the escrow PDA
          const [escrowPDA] = PublicKey.findProgramAddressSync(
            [
              utf8.encode("escrow"),
              publicKey.toBuffer(),
              influencerPk.toBuffer(),
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
        } else {
          const validationAuthorityPk = new PublicKey(
            process.env.NEXT_PUBLIC_VALIDATION_KEY!
          );
          const mintPublicKey = new PublicKey(order?.currency?.token_address!);
          const associatedTokenAccForBusiness = await findATA(
            publicKey!,
            mintPublicKey
          );

          const [vaultAccountPda] = PublicKey.findProgramAddressSync(
            [
              Buffer.from(
                anchor.utils.bytes.utf8.encode(
                  "token-seed" + order?.order_number?.toString()
                )
              ),
            ],
            program.programId
          );
          const [escrowAccountPda] = PublicKey.findProgramAddressSync(
            [
              Buffer.from(
                anchor.utils.bytes.utf8.encode(
                  "escrow-data" + order?.order_number?.toString()
                )
              ),
            ],
            program.programId
          );

          const ix = await program.methods
            .cancelEscrowSpl(new anchor.BN(order?.order_number))
            .accounts({
              business: publicKey!,
              businessDepositTokenAccount: associatedTokenAccForBusiness,
              vaultAccount: vaultAccountPda,
              vaultAuthority: validationAuthorityPk,
              escrowAccount: escrowAccountPda,
              tokenProgram: TOKEN_PROGRAM_ID,
              rent: SYSVAR_RENT_PUBKEY,
            })
            .instruction();

          const tx = new Transaction().add(ix);

          const options = {
            skipPreflight: process.env.NEXT_PUBLIC_RPC_LINK?.includes("devnet"),
          };
          try {
            const signature = await sendTransaction(tx, connection, options);
            const txSign = await connection.confirmTransaction(
              signature,
              "processed"
            );
            console.debug("txSing", txSign);
            console.debug("context", txSign.context);
            console.debug("value", txSign.value);
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
            console.error(error);
          }
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
