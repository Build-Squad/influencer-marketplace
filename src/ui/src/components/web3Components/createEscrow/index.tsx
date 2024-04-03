import { useAppSelector } from "@/src/hooks/useRedux";
import { Button, CircularProgress } from "@mui/material";
import {
  Connection,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import idl from "../../../utils/xfluencer.json";

import * as anchor from "@coral-xyz/anchor";

import { getAnchorProgram } from "@/src/utils/anchorUtils";
import { CURRENCY_TYPE } from "@/src/utils/consts";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { AnchorProvider, setProvider } from "@project-serum/anchor";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { notification } from "../../shared/notification";

import { findATA } from "@/src/utils/helper";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
} from "@solana/spl-token";

type CreateEscrowProps = {
  loading: boolean;
  updateStatus: (address: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
};

const programId = new PublicKey(idl.metadata.address);

export default function CreateEscrow({
  loading,
  updateStatus,
  setLoading,
}: CreateEscrowProps) {
  const cart = useAppSelector((state) => state.cart);
  const [localLoading, setLocalLoading] = useState(false);
  const connection = new Connection(`https://api.devnet.solana.com`, {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 30000,
  });
  const wallet = useAnchorWallet();

  const program = getAnchorProgram(connection);
  const provider = new AnchorProvider(connection, wallet!, {});
  setProvider(provider);

  const { publicKey: businessPk, sendTransaction } = useWallet();

  const createEscrow = async () => {
    try {
      setLocalLoading(true);
      setLoading(true);
      if (cart?.order_number && cart?.influencer_wallet) {
        // Get influencer wallet address
        const influencer_pk = new PublicKey(
          cart?.influencer_wallet?.wallet_address_id
        );

        // Check if wallet is connected
        if (!connection || !businessPk) {
          notification("Please connect your wallet first", "error");
          return;
        }

        const validationAuthorityPk = new PublicKey(
          process.env.NEXT_PUBLIC_VALIDATION_KEY!
        );

        const amount =
          Number(cart?.orderTotal) *
          10 ** Number(cart?.orderTotalCurrency?.decimals);

        if (cart?.orderTotalCurrency?.currency_type === CURRENCY_TYPE.SOL) {
          // Find the escrow PDA
          const [escrowPDA] = PublicKey.findProgramAddressSync(
            [
              utf8.encode("escrow"),
              businessPk.toBuffer(),
              influencer_pk.toBuffer(),
              utf8.encode(cart?.order_number?.toString()),
            ],
            programId
          );
          // Create the escrow
          const ix = await program.methods
            .createEscrow(
              new anchor.BN(amount),
              new anchor.BN(cart?.order_number)
            )
            .accounts({
              validationAuthority: validationAuthorityPk,
              from: businessPk,
              to: influencer_pk,
              systemProgram: anchor.web3.SystemProgram.programId,
              escrow: escrowPDA,
            })
            .instruction();

          const tx = new Transaction().add(ix);

          const options = {
            skipPreflight: true, // WARNING: This is dangerous on Mainnet
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
              updateStatus(signature);
            }
          } catch (error) {
            console.error("Transaction error", error);
          }
        } else {
          let businessTokenAccount = null;
          let influencerTokenAccount = null;

          const mintPublicKey = new PublicKey(
            cart?.orderTotalCurrency?.token_address!
          );

          const [escrow_account_pda, _escrow_account_bump] =
            PublicKey.findProgramAddressSync(
              [
                utf8.encode("escrow-data"),
                utf8.encode(cart?.order_number?.toString()),
              ],
              programId
            );

          const VAULT_SEED = Buffer.from(
            "token-seed" + cart?.order_number?.toString(),
            "utf8"
          );

          const [_vault_account_pda, _vault_account_bump] =
            PublicKey.findProgramAddressSync([VAULT_SEED], programId);

          const vault_account_pda = _vault_account_pda;

          businessTokenAccount = await findATA(businessPk, mintPublicKey);
          influencerTokenAccount = await findATA(influencer_pk, mintPublicKey);

          const tx = new Transaction();

          const ix_init_influencer_ata =
            createAssociatedTokenAccountIdempotentInstruction(
              businessPk,
              influencerTokenAccount,
              influencer_pk,
              mintPublicKey
            );

          tx.add(ix_init_influencer_ata);

          const ix = await program.methods
            .initialize(
              _escrow_account_bump,
              new anchor.BN(amount),
              new anchor.BN(cart?.order_number)
            )
            .accounts({
              business: businessPk,
              influencer: influencer_pk,
              validationAuthority: validationAuthorityPk,
              mint: mintPublicKey,
              businessDepositTokenAccount: businessTokenAccount,
              influencerReceiveTokenAccount: influencerTokenAccount,
              escrowAccount: escrow_account_pda,
              vaultAccount: vault_account_pda,
              systemProgram: SystemProgram.programId,
              tokenProgram: TOKEN_PROGRAM_ID,
              rent: SYSVAR_RENT_PUBKEY,
            })
            .instruction();

          tx.add(ix);

          const options = {
            skipPreflight: true,
            confirm: false,
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
              updateStatus(signature);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    } finally {
      setLocalLoading(false);
      setLoading(false);
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
      className="joyride-make-payment"
    >
      {localLoading ? (
        <CircularProgress size={24} color="secondary" />
      ) : (
        "Make Offer"
      )}
    </Button>
  );
}
