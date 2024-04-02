import {
    Connection,
    PublicKey,
    Transaction,
    clusterApiUrl,
} from "@solana/web3.js"

import {
    AnchorProvider,
    setProvider,
} from "@project-serum/anchor"

import styles from '../styles/PingButton.module.css'

import idl from "../xfluencer.json"
import {
    useAnchorWallet,
    useConnection,
    useWallet
} from '@solana/wallet-adapter-react';
import * as anchor from "@coral-xyz/anchor";

import { FC } from "react";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import * as utils from "./utils";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

const programId = new PublicKey(idl.metadata.address);

interface ValidateEscrowSplProps {
    validator: string,
    business: string,
    influencer: string,
    percentageFee: number,
    orderCode: number,
    targetState: number,
    textButton: string
}

export const ValidateEscrowSpl: FC<ValidateEscrowSplProps> = ({ 
        validator, 
        business, influencer,
        percentageFee, orderCode, 
        targetState, textButton }) => {

    const wallet = useAnchorWallet()
    const connection = new Connection(clusterApiUrl('devnet'),
        {
            commitment: "confirmed",
            confirmTransactionInitialTimeout: 30000
        });

    const program = utils.getAnchorProgram(connection);
    const provider = new AnchorProvider(connection, wallet, {})
    setProvider(provider)
    const { publicKey, signTransaction, sendTransaction } = useWallet()

    if (!connection || !publicKey) {
        const msg = "Wallet is not connected"
        console.warn(msg)
        return (
            <div className={styles.buttonContainer}>
                <button className={styles.button} disabled>{textButton} ({msg})</button>
            </div>
        )
    } else {
        console.log("wallet", wallet.publicKey)
    }


    const onClick = async () => {

        if (!connection || !publicKey) {
            console.warn("Wallet is not connected")
            return
        }

        const validatorPublicKey = new PublicKey(validator);
        const businessPublicKey = new PublicKey(business);
        const influencerPublicKey = new PublicKey(influencer);

        const [vaultAccountPda] = await PublicKey.findProgramAddress(
                [Buffer.from("token-seed" + orderCode.toString(),"utf8")],
                programId);

        const [escrowPDA] = await PublicKey.findProgramAddress([
            utf8.encode('escrow-data'),
            utf8.encode(orderCode.toString())],programId);

        const ix = await program.methods.validateEscrowSpl(
            new anchor.BN(targetState),
            new anchor.BN(percentageFee)
        ).accounts({
            validationAuthority: validatorPublicKey,
            vaultAccount: vaultAccountPda,
            influencer: influencerPublicKey,
            business: businessPublicKey,
            escrowAccount: escrowPDA,
            tokenProgram: TOKEN_PROGRAM_ID
        }).instruction();

        const tx = new Transaction().add(ix);

        const options = {
            skipPreflight: true
        }

        try {
            const signature = await sendTransaction(tx, connection, options);
            console.debug("signature", signature.valueOf());
            const txSign = await connection.confirmTransaction(signature, "processed");
            console.debug("txSing", txSign.value);
            console.debug("context", txSign.context);
            console.debug("value", txSign.value);
            if (txSign.value.err != null) {
                throw new Error(`Instruction error number found: ` + txSign.value.err['InstructionError'][0].toString());
            }
        }
        catch (error) {
            console.error(error)
            alert("Error Found on Validation " + error);
        }


    }

    return (
        <button className={styles.button} onClick={onClick}>
             {textButton}
        </button>
    )

}