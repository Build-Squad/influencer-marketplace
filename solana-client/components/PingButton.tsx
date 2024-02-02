import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js'
import { FC } from 'react'
import styles from '../styles/PingButton.module.css'
import { SendTransactionOptions } from '@solana/wallet-adapter-base';
import { Transaction } from '@solana/web3.js';

const PROGRAM_ID = `7zNs7f6rJyhvu9k4DZwqeqgBa27GqX12mVeQAS528xEq`
const DATA_ACCOUNT_PUBKEY = `7RrLxz6wHesPMNpL1z2X6bSLfUvVQ2YcyPN7NWakfq1V`

export const PingButton: FC = () => {
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();

	const onClick = async () => {
		if (!connection || !publicKey) { return }

		const programId = new web3.PublicKey(PROGRAM_ID)
		const programDataAccount = new web3.PublicKey(DATA_ACCOUNT_PUBKEY)
		
		const instruction = new web3.TransactionInstruction({
			keys: [
				{
					pubkey: programDataAccount,
					isSigner: false,
					isWritable: true
				},
			],
			programId
		});

		const options : SendTransactionOptions = {
			skipPreflight: true,
			preflightCommitment: 'processed'
		  }

		


		const recentBlockhash = (
			await connection.getLatestBlockhash('confirmed')).blockhash;
			  console.log('blockhash', recentBlockhash);
		const tx = new Transaction({
			feePayer: publicKey,
			recentBlockhash,
	  	});
	  	
		sendTransaction(tx, connection, options).then(sig => {
			console.log(sig)
		})
	}

	return (
		<div className={styles.buttonContainer} onClick={onClick}>
			<button className={styles.button}>Ping!</button>
		</div>
	)
}