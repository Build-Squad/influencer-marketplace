import {
    Connection,
    PublicKey,
    Transaction,
    clusterApiUrl,
    SYSVAR_RENT_PUBKEY
} from "@solana/web3.js"

import {
	getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
  } from '@solana/spl-token';

import {
    AnchorProvider,
    setProvider,
    BN
} from "@project-serum/anchor"

import styles from '../styles/PingButton.module.css'
import idl from "../xfluencer.json"

import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from "@coral-xyz/anchor";

import { FC } from "react";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import * as utils from "./utils";
import { log } from "console";

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

interface CancelEscrowSplProps {
    business: string,
    validatorAuthority: string,
    mintTokenAccount: string,
    orderCode: number
}

export const CancelEscrowSpl: FC<CancelEscrowSplProps> = (
                            {business, 
                             validatorAuthority, 
                             mintTokenAccount,
                             orderCode}) => {

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

        // transform strings to publick keys
        const business_pk = new PublicKey(business)
        const validatorAuthorityPk = new PublicKey(validatorAuthority) ;
        const mintPublicKey = new PublicKey(mintTokenAccount);

        console.log(business_pk.toString())

        // discover ATA for Business
		const associatedTokenAccForBusiness
             = await findATA(business_pk, mintPublicKey);

        // discover PDA for vault token account
        const [vaultAccountPda, vault_account_bump] 
                    = await PublicKey.findProgramAddress(
          [Buffer.from(anchor.utils.bytes.utf8.encode("token-seed"+orderCode.toString()))],
            program.programId
        );

        // discover PDA for escrow (data) account
        const [escrowAccountPda, ] 
                    = await PublicKey.findProgramAddress(
          [Buffer.from(anchor.utils.bytes.utf8.encode("escrow-data"+orderCode.toString()))],
           program.programId
        );

        // prepare instruction for cancel escrow using SPL
        const ix = await program.methods.cancelEscrowSpl(
            new BN(orderCode)
            )
            .accounts({
                business: business_pk,
                businessDepositTokenAccount: associatedTokenAccForBusiness,
                vaultAccount: vaultAccountPda,
                vaultAuthority: validatorAuthorityPk,
                escrowAccount: escrowAccountPda, 
                tokenProgram: TOKEN_PROGRAM_ID,
    			rent: SYSVAR_RENT_PUBKEY,
            })
            .instruction();
        
        const tx = new Transaction().add(ix);

        const options = {
			skipPreflight: true      
		}

        try {
            const signature = await sendTransaction(tx, connection, options);
            const txSign = await connection.confirmTransaction(signature, "processed");
            console.debug("txSing", txSign);
            console.debug("context", txSign.context);
            console.debug("value", txSign.value);
            if(txSign.value.err != null){
                throw new Error(`Instruction error number found: ` + txSign.value.err['InstructionError'][0].toString());
            }
        }
        catch(error)
        {
            console.error(error)
        }
    }

    return (
        <button className={styles.button} onClick={onClick}>
            Cancel Business (SPL) {business}
        </button>
    )

}