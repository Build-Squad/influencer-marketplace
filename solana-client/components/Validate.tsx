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
import { SendTransactionOptions } from "@solana/wallet-adapter-base";

const programId = new PublicKey(idl.metadata.address);

interface ValidateProps {
    validator: string,
    business: string,
    influencer: string,
    percentageFee : number,
    orderCode: number,
    targetState: number,
    textButton: string, 
    network: string
  }

export const Validate: FC<ValidateProps> = ({validator, 
                                             business, 
                                             influencer, 
                                             percentageFee, 
                                             orderCode, 
                                             targetState, 
                                             textButton,
                                            network}) => {

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
        const msg = "Wallet is not connected"
        console.warn(msg)
        return (
            <div className={styles.buttonContainer}>
                <button className={styles.button} disabled>{textButton} ({msg})</button>
            </div>  
        )      
     } else {       
        console.log("wallet",wallet.publicKey.toString())
     }


    const onClick = async () => {

        if (!connection || !publicKey) { 			
			console.warn("Wallet is not connected")
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
        
        const ix = await program.methods.validateEscrowSol(
            new anchor.BN(targetState),
            new anchor.BN(percentageFee)
            ).accounts({
                validationAuthority: validatorPublicKey,
                influencer: influencerPublicKey,
                business: businessPublicKey,
                escrowAccount: escrowPDA,
                systemProgram:  anchor.web3.SystemProgram.programId,
              }).instruction();
        
        const tx = new Transaction().add(ix);

        console.log(tx);

        const options: SendTransactionOptions = {
			skipPreflight: false,
            maxRetries: 1,
            preflightCommitment: 'confirmed'
		};

        const signature = await sendTransaction(tx, connection, options);
        await utils.confirmTransactionSignature(signature, connection);
    
    }

    return (
      <button className={styles.button} onClick={onClick}>
        {textButton} | Validator == {validator}
      </button>
    )

}