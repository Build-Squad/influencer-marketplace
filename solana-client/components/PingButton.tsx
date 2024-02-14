import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js'
import { FC } from 'react'
import styles from '../styles/PingButton.module.css'
import { SendTransactionOptions } from '@solana/wallet-adapter-base';
import { Transaction } from '@solana/web3.js';

const PROGRAM_ID = `EV31JFJxt28CoRUGm2UAsTHndmpYvpuMFH9Y8JZBJcYd`

const DATA_ACCOUNT_PUBKEY = `9nywvGtF94hcCszh4uYiX5cB3prSuHLJwzws2Nh2Ccad`

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