import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    clusterApiUrl,
    TransactionInstruction,
    sendAndConfirmTransaction,
    Commitment,
    Keypair
} from "@solana/web3.js"


import {
    AnchorProvider,
    BN,
    Provider,
    setProvider,
    Idl
} from "@project-serum/anchor"

import styles from '../styles/PingButton.module.css'

import idl from "../xfluencer.json"
import { IDL, Xfluencer } from "../types/xfluencer";

import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import { FC } from "react";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { getAnchorProvider } from "./utils";

import * as utils from "./utils";

const programId = new PublicKey(idl.metadata.address);

interface ClaimEscrowSolanaProps {
    business: string,
    influencer: string,
    orderCode: number
  }

export const ClaimEscrowSolana: FC<ClaimEscrowSolanaProps> = ({business, influencer, orderCode }) => {



    // ARGUMENTS FOR INSTRUCTION SET BY XFLUENCER
    const BUSINESS   = `4mc6MJVRgyedZxNwjoTHHkk9G7638GQXFCYmyi3TFuwy`;
    const INFLUENCER = `HPJeMLfpswFC7HnTzCKBbwXeGnUiW6M3h1oNmFiCeSNz`;    
    //const orderCode = 125 // THIS MUST BE UNIQUE OTHERWISE ERROR

    const business_pk = new PublicKey(BUSINESS);
    const influencer_pk = new PublicKey(INFLUENCER);

    
    
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
        console.warn("Wallet was not connected")
        return (
        <div className={styles.buttonContainer}>
            <button className={styles.button} disabled>CLAIM (wallet not connected)</button>
        </div>  )      
     }

    const onClick = async () => {

        const business_pk = new PublicKey(business);
        const influencer_pk = new PublicKey(influencer);
        
        const [escrowPDA] = await PublicKey.findProgramAddress([
            utf8.encode('escrow'),
            business_pk.toBuffer(), 
            influencer_pk.toBuffer(),
            utf8.encode(orderCode.toString())
          ],
          programId
        );
        
        console.debug("escrowPDA", escrowPDA);
       
        const ix = await program.methods.claimEscrow(
            new anchor.BN(orderCode)
        ).accounts({
            influencer: influencer_pk,
            business: business_pk,
            escrowAccount: escrowPDA, 
            systemProgram:  anchor.web3.SystemProgram.programId,
        })
        .instruction();
        
        const tx = new Transaction().add(ix);
        const options = {
			skipPreflight: true      
		  }
        try {
            const signature = await sendTransaction(tx, connection, options);
            const txSign = await connection.confirmTransaction(signature, "processed");
            console.debug("txSing",txSign)
            console.debug("context", txSign.context);
            console.debug("value", txSign.value);
            if(txSign.value.err != null){
                throw new Error(`Instruction error number found: `+txSign.value.err['InstructionError'][0].toString());
                
            }
        }
        catch(error)
        {
            console.error(error)
        }

    }

    return (
        <div className={styles.buttonContainer} onClick={onClick}>
            <button className={styles.button}>CLAIM Influencer {influencer}</button>
        </div>
    )

}