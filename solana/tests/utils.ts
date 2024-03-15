import * as anchor from "@coral-xyz/anchor";

import {
    createMint,
    createAssociatedTokenAccount,
    mintTo,
    getMint,
  } from "@solana/spl-token";


//import { Program } from "@project-serum/anchor";
//import { Xfluencer } from "../target/types/xfluencer";

export async function createNewMint(
    provider: anchor.Provider,
    wallet: NodeWallet,
    mint_decimals: number
  ) {
    return await createMint(
      provider.connection,
      wallet.payer,
      wallet.publicKey,
      wallet.publicKey,
      mint_decimals
    );
}

export function getAnchorProvider(): anchor.AnchorProvider {
    return anchor.getProvider() as anchor.AnchorProvider;
  }
  
export async function getTokenAccountBalance(
    provider: anchor.Provider,
    tokenAccount: anchor.web3.PublicKey
  ) {
    const result = await provider.connection.getTokenAccountBalance(tokenAccount);
    
    return parseInt(result.value.amount);
}

export async function airdrop(
    program: any,
    user: anchor.web3.Keypair,
    amount: number
  ) {
    /**
     * Adds funds to the given user's account.
     * */
    const airdropSignature = await program.provider.connection.requestAirdrop(
      user.publicKey,
      amount * anchor.web3.LAMPORTS_PER_SOL
    );
    const latestBlockHash =
      await program.provider.connection.getLatestBlockhash();
      await program.provider.connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
      });
  }


  export async function createAssociatedTokenAccountWithBalance(
    mintPk: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    balance: number
  ) {
    const provider = getAnchorProvider();
    const wallet = provider.wallet as NodeWallet;
    const [associatedTokenAcc, mintInfo] = await Promise.all([
      createAssociatedTokenAccount(
        provider.connection,
        wallet.payer,
        mintPk,
        owner
      ),
      getMint(provider.connection, mintPk),
    ]);

    await mintTo(
      provider.connection,
      wallet.payer,
      mintPk,
      associatedTokenAcc,
      provider.wallet.publicKey, // Assumption mint was created by provider.wallet,
      balance * 10 ** mintInfo.decimals,
      []
    );
    
    // Add Small timeout to ensure funds added before proceeding
    await new Promise((e) => setTimeout(e, 1000)); 
    return associatedTokenAcc;
  }