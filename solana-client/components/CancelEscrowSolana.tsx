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

import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from "@coral-xyz/anchor";

import { FC } from "react";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import * as utils from "./utils";

const programId = new PublicKey(idl.metadata.address);

interface CancelEscrowSolanaProps {
    business: string,
    influencer: string,
    orderCode: number
  }


export const CancelEscrowSolana: FC<CancelEscrowSolanaProps> = ({business, influencer, orderCode}) => {

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
            <button className={styles.button} disabled>CREATE (wallet not connected)</button>
        </div>  )      
     }

    const onClick = async () => {

        const business_pk = new PublicKey(business)
        const influencer_pk = new PublicKey(influencer);
        

        const [escrowPDA] = await PublicKey.findProgramAddress([
            utf8.encode('escrow'),
            business_pk.toBuffer(), 
            influencer_pk.toBuffer(),
            utf8.encode(orderCode.toString())
          ],
          programId
        );
        console.log()
               
        const ix = await program.methods.cancelEscrowSol()
            .accounts({
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
            <button className={styles.button}>CANCEL Business {business}</button>
        </div>
    )

}