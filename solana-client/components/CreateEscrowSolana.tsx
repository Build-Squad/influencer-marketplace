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

interface CreateEscrowSolanaProps {
    business: string,
    influencer: string,
    orderCode: number,
    lamports: number
  }

export const CreateEscrowSolana: FC<CreateEscrowSolanaProps> = ({business, influencer, orderCode, lamports}) => {

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
        console.log("CreateEscrowSolana")

        if (!connection || !publicKey) { 			
			console.warn("Wallet was not connected")
			return }

        const business_pk = new PublicKey(business)
        const influencer_pk = new PublicKey(influencer);
        const validator_pk = new PublicKey("CwhNj8h9D2rFYodxChKWzmWKWLEfKq4LuxiN1qzmvG6u")

        
        const [escrowPDA] = await PublicKey.findProgramAddress([
            utf8.encode('escrow'),
            business_pk.toBuffer(), 
            influencer_pk.toBuffer(),
            utf8.encode(orderCode.toString())
          ],
          programId
        );
        
        console.debug("escrowPDA", escrowPDA);
          
        const amount = lamports * 0.01;
        console.log("amount",amount.toString())

        const ix = await program.methods.createEscrow(
            new anchor.BN(amount),
            new anchor.BN(orderCode)
            ).accounts({
                validationAuthority: validator_pk,
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
            console.debug("signature", signature.valueOf());
            const txSign = await connection.confirmTransaction(signature, "processed");
            console.debug("txSing",txSign.value);
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
            <button className={styles.button}>CREATE Business {business} Influencer {influencer}</button>
        </div>
    )

}