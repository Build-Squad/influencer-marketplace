import {
    Connection,
    PublicKey,
    Transaction,
    SYSVAR_RENT_PUBKEY,
    clusterApiUrl
} from "@solana/web3.js"

import {
    AnchorProvider,
    BN,
    setProvider,
} from "@project-serum/anchor"

import styles from '../styles/PingButton.module.css'

import idl from "../xfluencer.json"

import { useAnchorWallet, 
         useConnection, 
         useWallet 
} from '@solana/wallet-adapter-react';

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import {
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';


import { FC } from "react";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import * as utils from "./utils";

const programId = new PublicKey(idl.metadata.address);

export const findATA = (
    walletKey: PublicKey,
    mintKey: PublicKey,
): Promise<PublicKey> => {
    return getAssociatedTokenAddress(
        mintKey,
        walletKey,
        true, // allowOwnerOffCurve aka PDA
    );
};


interface ClaimEscrowSplProps {
    business: string,
    influencer: string,
    validatorAuthority: string,
    mintTokenAccount: string,
    orderCode: number,
    network: string
}

export const ClaimEscrowSpl: FC<ClaimEscrowSplProps> = ({ business,
    influencer,
    validatorAuthority,
    mintTokenAccount,
    orderCode, 
    network }) => {

    const wallet = useAnchorWallet()

    const connection = new Connection(network,
        {
            commitment: "confirmed",
            confirmTransactionInitialTimeout: 30000
        });

    const program = utils.getAnchorProgram(connection);
    const provider = new AnchorProvider(connection, wallet, {})
    setProvider(provider)
    const { publicKey, signTransaction, sendTransaction } = useWallet()

    if (!connection || !publicKey) {
        console.warn("Wallet was not connected")
        return (
            <div className={styles.buttonContainer}>
                <button className={styles.button} disabled>
                    CLAIM (wallet not connected)
                </button>
            </div>)
    }

    const onClick = async () => {

        const business_pk = new PublicKey(business);
        const influencer_pk = new PublicKey(influencer);        
        const validatorAuthorityPk = new PublicKey(validatorAuthority)
        const mintPublicKey = new PublicKey(mintTokenAccount);

        // discover ATA for Business
        const associatedTokenAccForBusiness
            = await findATA(business_pk, mintPublicKey);

        // discover ATA for Business
        const associatedTokenAccForInfluencer
            = await findATA(business_pk, mintPublicKey);

        // discover PDA for vault token account
        const [vaultAccountPda, vault_account_bump] = await PublicKey.findProgramAddress(
            [Buffer.from(anchor.utils.bytes.utf8.encode("token-seed" + orderCode.toString()))],
            programId);

        // discover PDA for escrow (data) account
        const [escrowPDA] = await PublicKey.findProgramAddress([
            utf8.encode('escrow-data'), utf8.encode(orderCode.toString())
        ], programId);

        // prepare instruction for claim escrow using SPL
        const ix = await program.methods.claimEscrowSpl(
            new BN(orderCode)
        ).accounts({
            business: business_pk,
            businessDepositTokenAccount: associatedTokenAccForBusiness,
            influencer: influencer_pk,
            influencerReceiveTokenAccount: associatedTokenAccForInfluencer,
            vaultAccount: vaultAccountPda,
            vaultAuthority: validatorAuthorityPk,
            escrowAccount: escrowPDA,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY
        })
            .instruction();

        const tx = new Transaction().add(ix);
        const options = {
            skipPreflight: true
        }
        try {
            const signature = await sendTransaction(tx, connection, options);
            const txSign = await connection.confirmTransaction(signature, "processed");
            console.debug("txSing", txSign)
            console.debug("context", txSign.context);
            console.debug("value", txSign.value);
            if (txSign.value.err != null) {
                throw new Error(`Instruction error number found: ` + txSign.value.err['InstructionError'][0].toString());

            }
        }
        catch (error) {
            console.warn("an error was raised sending claim for spl");
            console.error(error)
        }
    }

    return (
        <div className={styles.buttonContainer} onClick={onClick}>
            <button className={styles.button}>CLAIM Influencer {influencer}</button>
        </div>
    )
}