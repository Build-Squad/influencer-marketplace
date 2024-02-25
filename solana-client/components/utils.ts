import * as anchor from "@coral-xyz/anchor";

import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  getMint,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AccountLayout
} from "@solana/spl-token";

import {
  Blockhash,
  FeeCalculator,
  Keypair,
  PublicKey,
  SystemProgram,
  RpcResponseAndContext,
  SYSVAR_RENT_PUBKEY,
  SignatureStatus,
  SimulatedTransactionResponse,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
  clusterApiUrl,
} from '@solana/web3.js';

import idl from "../xfluencer.json"

import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";

import { Connection, Commitment } from '@solana/web3.js'
import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";


export enum AccountState {
  Uninitialized = 0,
  Initialized = 1,
  Frozen = 2,
}


export async function getAccountInfo(
  connection: Connection,
  address: PublicKey,
  commitment?: Commitment,
  programId = TOKEN_PROGRAM_ID
) {
  const info = await connection.getAccountInfo(address, commitment)
  if (!info) {

    return new Error('TokenAccountNotFoundError');
  }
  if (!info.owner.equals(programId))
    return new Error('TokenInvalidAccountOwnerError');
  if (info.data.length != AccountLayout.span)
    throw new Error('TokenInvalidAccountSizeError');

  const rawAccount = AccountLayout.decode(Buffer.from(info.data));

  return {
    address,
    mint: rawAccount.mint,
    owner: rawAccount.owner,
    amount: rawAccount.amount,
    delegate: rawAccount.delegateOption ? rawAccount.delegate : null,
    delegatedAmount: rawAccount.delegatedAmount,
    isInitialized: rawAccount.state !== AccountState.Uninitialized,
    isFrozen: rawAccount.state === AccountState.Frozen,
    isNative: !!rawAccount.isNativeOption,
    rentExemptReserve: rawAccount.isNativeOption ? rawAccount.isNative : null,
    closeAuthority: rawAccount.closeAuthorityOption ? rawAccount.closeAuthority : null,
  }
}


export async function createNewMint(
  connection: anchor.Provider,
  wallet: NodeWallet,
  mint_decimals: number
) {
  return await createMint(
    connection,
    wallet.payer,
    wallet.publicKey,
    wallet.publicKey,
    mint_decimals
  );
}

export const getAnchorProvider = async () => {
  return anchor.getProvider() as anchor.AnchorProvider;
}

export function getAnchorProviderSync(){
  return anchor.getProvider() as anchor.AnchorProvider;
}

/*export async function getTokenAccountBalance_v2(
    provider: anchor.Provider,
    tokenAccount: anchor.web3.PublicKey
  ) {
    const result = await provider.connection.getTokenAccountBalance(tokenAccount);
    
    return parseInt(result.value.amount);

export const getTokenAccountBalance = async ( 
  tokenAccount: anchor.web3.PublicKey
) => {
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const result = await provider.connection.getTokenAccountBalance(tokenAccount);

  return parseInt(result.value.amount);
}*/

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



export const createAssociatedTokenAccountWithBalance = async (
  mintPk: anchor.web3.PublicKey,
  owner: anchor.web3.PublicKey,
  balance: number
) => {
  const provider = anchor.getProvider() as anchor.AnchorProvider;
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
    getAnchorProviderSync().wallet.publicKey, // Assumption mint was created by provider.wallet,
    balance * 10 ** mintInfo.decimals,
    []
  );
  // Add Small timeout to ensure funds added before proceeding
  await new Promise((e) => setTimeout(e, 1000));
  return associatedTokenAcc;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export const getUnixTs = () => {
  return new Date().getTime() / 1000;
};


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


export async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): Promise<PublicKey> {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) throw new Error('TokenOwnerOffCurveError')

  const [address] = await PublicKey.findProgramAddress(
    [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
    associatedTokenProgramId
  )

  return address
}


export function createAssociatedTokenAccountInstruction(
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): TransactionInstruction {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedToken, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ]

  return new TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data: Buffer.alloc(0),
  })
}


export async function getOrCreateAssociatedTokenAccount(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  signTransaction: SignerWalletAdapterProps['signTransaction'],
  allowOwnerOffCurve = false,
  commitment?: Commitment,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) {
  const associatedToken = await getAssociatedTokenAddress(
    mint,
    owner,
    allowOwnerOffCurve,
    programId,
    associatedTokenProgramId
  )

  // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
  // Sadly we can't do this atomically.
  let account;
  try {
    console.log("associatedToken", associatedToken.toString())
    account = await getAccountInfo(connection,
      associatedToken,
      commitment, programId)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
    // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
    // TokenInvalidAccountOwnerError in this code path.
    if (error.message === 'TokenAccountNotFoundError' || error.message === 'TokenInvalidAccountOwnerError') {
      // As this isn't atomic, it's possible others can create associated accounts meanwhile.
      try {
        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            payer,
            associatedToken,
            owner,
            mint,
            programId,
            associatedTokenProgramId
          )
        )

        const blockHash = await connection.getRecentBlockhash()
        transaction.feePayer = await payer
        transaction.recentBlockhash = await blockHash.blockhash
        const signed = await signTransaction(transaction)

        const signature = await connection.sendRawTransaction(signed.serialize())

        await connection.confirmTransaction(signature)
      } catch (error: unknown) {
        // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
        // instruction error if the associated account exists already.
      }

      // Now this should always succeed
      account = await getAccountInfo(connection, associatedToken, commitment, programId)
    } else {
      throw error
    }
  }

  if (!account.mint.equals(mint.toBuffer())) throw Error('TokenInvalidMintError')
  if (!account.owner.equals(owner.toBuffer())) throw new Error('TokenInvalidOwnerError')

  return account
}



export async function createAndGetATA(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  signTransaction: SignerWalletAdapterProps['signTransaction'],
  allowOwnerOffCurve = false,
  commitment?: Commitment,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) {
  const associatedToken = await getAssociatedTokenAddress(
    mint,
    owner,
    allowOwnerOffCurve,
    programId,
    associatedTokenProgramId
  )

  const transaction = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      payer,
      associatedToken,
      owner,
      mint,
      programId,
      associatedTokenProgramId
    )
  )

  const blockHash = await connection.getRecentBlockhash()
  transaction.feePayer = await payer
  transaction.recentBlockhash = await blockHash.blockhash
  const signed = await signTransaction(transaction)

  const signature = await connection.sendRawTransaction(signed.serialize())

  await connection.confirmTransaction(signature)
  return await getAccountInfo(connection, associatedToken, commitment, programId)
}


export const getAnchorProgram = (connection: Connection): anchor.Program => {
  const programId = new PublicKey(idl.metadata.address)
	const program = new anchor.Program(idl as anchor.Idl, programId, { connection });
	return program;
  }






export const getKeypairFromSecret = async (secret?: string) => {
 
  // Parse contents of file
  let parsedFileContents: Uint8Array;
  try {
    parsedFileContents = Uint8Array.from(JSON.parse(secret));
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (!error.message.includes("Unexpected token")) {
      throw error;
    }
    throw new Error(`Invalid secret key file`);
  }
  return Keypair.fromSecretKey(parsedFileContents);
};

