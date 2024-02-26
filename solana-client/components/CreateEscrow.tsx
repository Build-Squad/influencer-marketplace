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
import { Xfluencer } from "../types/xfluencer";

import { FC } from 'react'
import styles from '../styles/PingButton.module.css'

import {
	AccountLayout,
	MintLayout,
	getAssociatedTokenAddress,
	TOKEN_PROGRAM_ID,
  } from '@solana/spl-token';
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { SendTransactionOptions } from "@solana/wallet-adapter-base";

// THESE ACCOUNTS MUST EXIST (check on devnet)
const BUYER_ACCOUNT = `GQRDv58u1dULSyHSYWPqNTjcWjsFHHi763mbqDaEEgQ3`
const SELLER_ACCOUNT = `EBBRDuAZVf2XHJsQwzZqwPLF64cKC8SbaukL3H19nX2Q`

// USDC MINT on Solana Devnet
const USDC_MINT = `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`

// export ANCHOR_WALLET=~/.config/solana/id.json

const programId = new PublicKey(idl.metadata.address)
//const program = new Program(idl as Idl, programId)

export const getAnchorProgram = (conection: Connection): Program => {
  
	const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
	const program = new Program(idl as Idl, programId, { connection });
  
	return program;
  }

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

export const CreateEscrow: FC = () => {

	const connection = new Connection(clusterApiUrl('devnet'));
	const program = getAnchorProgram(connection);

	const wallet = useAnchorWallet()
	const provider = new AnchorProvider(connection, wallet, {})
	setProvider(provider)

	const { publicKey, sendTransaction } = useWallet();

	/// WALLETS MUST have a ATA S
	// https://spl-token-faucet.com/?token-name=USDC-Dev

	const onClick = async () => {

		const orderCode = 123; // uuid uniquely the escrow and the valut
		const amount = 0;
		const buyer_pk = new PublicKey(BUYER_ACCOUNT);
		const judge_pk = new PublicKey(BUYER_ACCOUNT);
		const seller_pk = new PublicKey(SELLER_ACCOUNT);
		const mint = new PublicKey(USDC_MINT);

		console.log("Amount:",amount);
		console.log("Buyer Public Key",buyer_pk.toString());
		console.log("Seller Public Key",seller_pk.toString());
		console.log("USDC MINT Address",mint.toString());
		console.log("Judge Public Key",judge_pk.toString());

		if (!connection || !publicKey) { 			
			console.warn("Wallet was not connected")
			return }

		const ESCROW_SEED = Buffer.from("escrow" + orderCode.toString(),"utf8"); 
	
		const [_escrow_account_pda, _escrow_account_bump] = await PublicKey.findProgramAddress(
			[ESCROW_SEED],programId);
		const escrow_account_pda = _escrow_account_pda;

		console.info("escrow",_escrow_account_pda,_escrow_account_bump)

		const VAULT_SEED = Buffer.from("vault" + orderCode.toString(),"utf8"); 
	
		const [_vault_account_pda, _vault_account_bump] = await PublicKey.findProgramAddress(
			[VAULT_SEED],programId);
		console.info("vault",_vault_account_pda,_vault_account_bump)

		const vault_account_pda = _vault_account_pda;
		const vault_account_bump = _vault_account_bump;


		const buyerTokenAccount = await findATA(buyer_pk, mint);
		const sellerTokenAccount = await findATA(seller_pk, mint);
		console.log("buyer ATA",buyerTokenAccount.toString());
		console.log("seller ATA",sellerTokenAccount.toString());

		const signer = wallet?.publicKey;

		const ix = await program.methods
			.initialize(
				vault_account_bump,
				new BN(amount),
				new BN(orderCode))
		  .accounts(
		  {
			initializer: buyer_pk, 
			buyer: buyer_pk,
			seller: seller_pk,
			judge: judge_pk,
			mint: mint,        
			buyerDepositTokenAccount: buyerTokenAccount,
			sellerReceiveTokenAccount: sellerTokenAccount,
			escrowAccount: escrow_account_pda,
			vaultAccount: vault_account_pda,
			systemProgram: SystemProgram.programId,
			tokenProgram: TOKEN_PROGRAM_ID,
			rent: SYSVAR_RENT_PUBKEY,
		  }).instruction();


		  const recentBlockhash = (
				await connection.getLatestBlockhash('confirmed')).blockhash;
		  console.log('blockhash', recentBlockhash);
		  const tx = new Transaction({
			feePayer: publicKey,
			recentBlockhash,
		  });
		  console.log("ix",ix)

		  tx.add(ix);

		  const options : SendTransactionOptions = {
			skipPreflight: true,
			preflightCommitment: 'processed'
		  };

		  console.log("tx",tx)

		
		  /*const adapter = new PhantomWalletAdapter();
		  console.log("connecting wallet adapter")
		  try {
			adapter.connect();
			const txSign = await adapter.sendTransaction(tx,connection, options);
			return txSign
		  }
		  catch (error) {
			console.error("Onchain tx was wrong",error)    
			return null;
		  }*/
		  /*tx.addSignature(publicKey, publicKey);

		  const wireTransaction = tx.serialize();
		  const txSign = await connection.sendRawTransaction(wireTransaction,  options)
		  	.then((transactionSignature) => {
				console.log("txSing",transactionSignature)
				return transactionSignature
		  });

		  const latestBlockHash = await connection.getLatestBlockhash()*/
		 

		  const adapter = new PhantomWalletAdapter();
		  try {
			adapter.connect();			
			const txSign = await adapter.sendTransaction(tx, connection);
			console.log("Transaction Signature", txSign);
			
			return txSign;
		  }
		  catch (error) {
			console.warn(error);
			return null;
		  }


	}

	return (
		<div className={styles.buttonContainer} onClick={onClick}>
			<button className={styles.button}>CreateEscrow</button>
		</div>
	)
}