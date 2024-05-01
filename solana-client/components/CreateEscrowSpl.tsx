import {
	Connection,
	PublicKey,
	Transaction,
	SystemProgram,
	SYSVAR_RENT_PUBKEY,
	clusterApiUrl,
	TransactionInstruction
  } from "@solana/web3.js"
  
  import {
	AnchorProvider,
	BN,
	Provider,
	setProvider,
	Idl
  } from "@project-serum/anchor"

import * as utils from "./utils";

import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';

import { Program } from "@coral-xyz/anchor";

import idl from "../xfluencer.json"

import { FC } from 'react'
import styles from '../styles/PingButton.module.css'

import {
	AccountLayout,
	MintLayout,
	getAssociatedTokenAddress,
	createAssociatedTokenAccountIdempotentInstruction,
	TOKEN_PROGRAM_ID,
  } from '@solana/spl-token';

import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";


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

interface CreateEscrowSplProps {
	validator: string,
    business: string,
    influencer: string,
	mint: string,
    orderCode: number,
    tokens: number
}

export const CreateEscrowSpl: FC<CreateEscrowSplProps> = ({validator, 
														   business, 
														   influencer, 
														   mint, 
														   orderCode, 
														   tokens}) => {														
	const programId = new PublicKey(idl.metadata.address)
	const wallet = useAnchorWallet()
    const connection = new Connection(clusterApiUrl('devnet'),
    {
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 30000
    });
    const program = new Program(idl as Idl, programId, { connection });
    const provider = new AnchorProvider(connection, wallet, {})
    setProvider(provider)
    const { publicKey, signTransaction, sendTransaction } = useWallet()

	if (!connection || !publicKey) { 			
		console.warn("Wallet was not connected")
		return (
			<div className={styles.buttonContainer}>
				<button className={styles.button} disabled>Create Escrow With Spl Token (wallet not connected)</button>
			</div>  
		)    
	}

	let businessTokenAccount=null;
	let influencerTokenAccount=null;

	const onClick = async () => {

		const validatorPublicKey = new PublicKey(validator);
		const businessPublicKey = new PublicKey(business);		
		const influencerPublicKey = new PublicKey(influencer);
		const mintPublicKey = new PublicKey(mint);

		console.log("SPL num. of tokens:",  tokens);
		console.log("Business Public Key", 
							businessPublicKey.toString());
		console.log("Influencer Public Key", 
							influencerPublicKey.toString());
		console.log("SPL MINT address in use", mintPublicKey.toString());
		console.log("Program Id", programId.toString())
	
		const [escrow_account_pda, _escrow_account_bump]
		 			= await PublicKey.findProgramAddress([
							utf8.encode('escrow-data'),
							utf8.encode(orderCode.toString())
							],
							programId
					);

		console.log("Program Id", programId)
		console.info("Escrow Address found:",
					escrow_account_pda.toString(), 
					_escrow_account_bump)
	
		const [_vault_account_pda, _vault_account_bump] 
			= await PublicKey.findProgramAddress(
				[Buffer.from("token-seed" + orderCode.toString(),"utf8")],
				programId);

		console.info("vault",_vault_account_pda.toString(),_vault_account_bump)

		const vault_account_pda = _vault_account_pda;
		const vault_account_bump = _vault_account_bump;

		businessTokenAccount = await findATA(businessPublicKey, mintPublicKey);
		influencerTokenAccount = await findATA(influencerPublicKey, mintPublicKey);

		console.log("Business ATA", businessTokenAccount.toString());
		console.log("Influencer ATA", influencerTokenAccount.toString());

		const tx = new Transaction();

		const ix_init_influencer_ata 
			= await createAssociatedTokenAccountIdempotentInstruction(
								wallet.publicKey,
								influencerTokenAccount,
								influencerPublicKey,
								mintPublicKey);

		tx.add(ix_init_influencer_ata);

		const ix = await program.methods
			.initialize(
				_escrow_account_bump,
				new BN(tokens),
				new BN(orderCode))
		  .accounts(
		  {
			business: businessPublicKey,
			influencer: influencerPublicKey,
			vaultAccount: vault_account_pda,
			validationAuthority: validatorPublicKey,			
			mint: mintPublicKey,        
			businessDepositTokenAccount: businessTokenAccount,
			influencerReceiveTokenAccount: influencerTokenAccount,
			escrowAccount: escrow_account_pda,
			systemProgram: SystemProgram.programId,
			tokenProgram: TOKEN_PROGRAM_ID,
			rent: SYSVAR_RENT_PUBKEY,
		  }).instruction();

		  tx.add(ix);
 
		  const options = {
			  skipPreflight: true,
			  confirm: false			     
			}
			const signature = await sendTransaction(tx, connection, options);
        await utils.confirmTransactionSignature(signature, connection);

	}

	return (
		<div>
		<button className={styles.button} onClick={onClick}>
			Create Escrow with Business {business} Influencer {influencer}
		</button>
		</div>
	)
}


