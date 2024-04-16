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
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from "@coral-xyz/anchor";

import { FC } from "react";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import * as utils from "./utils";

const programId = new PublicKey(idl.metadata.address);

interface CreateEscrowSolanaProps {
    validator: string,
    business: string,
    influencer: string,
    orderCode: number,
    lamports: number,
    network: string
  }

export const CreateEscrowSolana: FC<CreateEscrowSolanaProps> = ({validator, business, influencer, orderCode, lamports, network}) => {

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
        const msg = "Wallet was not connected"
        console.warn(msg)
        return (
            <div className={styles.buttonContainer}>
                <button className={styles.button} disabled>CREATE ({msg})</button>
            </div>  
        )      
     } else {
        console.warn("Wallet does NOT Business Configuration");
        console.log("public:",publicKey.toString())
        console.log("wallet:",wallet.publicKey.toString())
     }


    const onClick = async () => {
        console.log("CreateEscrowSolana")

        if (!connection || !publicKey) { 			
			console.warn("Wallet was not connected")
			return }

        const validatorPublicKey = new PublicKey(validator);
        const businessPublicKey = new PublicKey(business);
        const influencerPublicKey = new PublicKey(influencer);
        
        const [escrowPDA] = await PublicKey.findProgramAddress([
            utf8.encode('escrow'),
            businessPublicKey.toBuffer(), 
            influencerPublicKey.toBuffer(),
            utf8.encode(orderCode.toString())
          ],
          programId
        );
        
        console.debug("escrowPDA", escrowPDA);
          
        const ix = await program.methods.createEscrow(
            new anchor.BN(lamports),
            new anchor.BN(orderCode)
            ).accounts({
                validationAuthority: validatorPublicKey,
                from: businessPublicKey,
                to: influencerPublicKey,
                systemProgram:  anchor.web3.SystemProgram.programId,
                escrow: escrowPDA
              }).instruction();
        
        const tx = new Transaction().add(ix);

        console.log(tx);

        const options = {
			skipPreflight: true      
		  }
        
        const signature = await sendTransaction(tx, connection, options);
        await utils.confirmTransactionSignature(signature, connection);
    }

    return (
      <button className={styles.button} onClick={onClick}>CREATE Business {business} Influencer {influencer}</button>
    )

}