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
import { Xfluencer } from "../types/xfluencer";


import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import { FC } from "react";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { getAnchorProvider, sleep } from "./utils";

import * as utils from "./utils";

const programId = new PublicKey(idl.metadata.address);

export const CreateEscrowSolana: FC = (props) => {

    // ARGUMENTS FOR INSTRUCTION SET BY XFLUENCER
    const BUSINESS   = `4mc6MJVRgyedZxNwjoTHHkk9G7638GQXFCYmyi3TFuwy`
    const INFLUENCER = `HPJeMLfpswFC7HnTzCKBbwXeGnUiW6M3h1oNmFiCeSNz`
    const amount = 10 ** 8
    const orderCode = 125 // THIS MUST BE UNIQUE PER business-influencer (1 transaction at a time) OTHERWISE ERROR


    const influencer_pk = new PublicKey(INFLUENCER);
    const wallet = useAnchorWallet()

    const connection = new Connection(clusterApiUrl('devnet'),
        {
            commitment: "confirmed",
            confirmTransactionInitialTimeout: 30000
        }
    );
    
    const program = utils.getAnchorProgram(connection);
    const provider = new AnchorProvider(connection, wallet, {})
    setProvider(provider)
    const { publicKey, signTransaction, sendTransaction } = useWallet()

    const onClick = async () => {

        if (!connection || !publicKey) { 			
			console.warn("Wallet was not connected")
			return }

        const [escrowPDA] = await PublicKey.findProgramAddress([
            utf8.encode('escrow'),
            publicKey.toBuffer(), 
            influencer_pk.toBuffer(),
            utf8.encode(orderCode.toString())
          ],
          programId
        );
        
        console.debug("escrowPDA", escrowPDA);
       
        const ix = await program.methods.createEscrow(
            new anchor.BN(amount),
            new anchor.BN(orderCode)
            ).accounts({
                from: publicKey,
                to: influencer_pk,
                systemProgram:  anchor.web3.SystemProgram.programId,
                escrow: escrowPDA
              }).instruction();
        
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
            <button className={styles.button}>CreateEscrow</button>
        </div>
    )

}