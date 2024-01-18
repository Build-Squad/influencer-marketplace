import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import { assert } from 'chai';
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import * as utils from "./utils";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { Xfluencer } from "../target/types/xfluencer";

import {TOKEN_PROGRAM_ID} from '@solana/spl-token';

describe("xfluencer", () => {
    
  const provider = utils.getAnchorProvider();

  const program = anchor.workspace.Xfluencer as Program<Xfluencer>;
  const nodeWallet: NodeWallet = (program.provider as anchor.AnchorProvider).wallet as NodeWallet;

  // Token & PDA
  let mintA: PublicKey = null; 
  let buyerTokenAccountA = null;
  let sellerTokenAccountA = null;
  let vault_account_pda = null;
  let vault_account_bump = null;
  let vault_authority_pda = null;

  const amount = 1000;
  const amountPartial = 500;
  const orderCode = 99;
  const trialDay = 0;

  // Account
  const payer = anchor.web3.Keypair.generate();
  const buyer = nodeWallet.payer; //anchor.web3.Keypair.generate();
  const seller = anchor.web3.Keypair.generate();
  const judge = anchor.web3.Keypair.generate();
  const escrowAccount = anchor.web3.Keypair.generate();
  const mintAuthority = anchor.web3.Keypair.generate();


  it('Initialize program state', async () => {
    const provider = anchor.getProvider()
    // Airdrop Sol to payer.
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, 10000000000),
      "processed"
    );

    // Airdrop SOL to all accounts
    for (const keypair of [
      buyer,
      seller,
      judge,
      escrowAccount,
      mintAuthority,
    ]) {
      await utils.airdrop(program, keypair, 1);
    }

    // Create Token A
    const NUMBER_DECIMALS = 6;
    mintA = await utils.createNewMint(
      program.provider,
      nodeWallet,
      NUMBER_DECIMALS
    );
    console.log("mintA", mintA)
    buyerTokenAccountA  = await utils.createAssociatedTokenAccountWithBalance(mintA, buyer.publicKey, 100);
    sellerTokenAccountA = await utils.createAssociatedTokenAccountWithBalance(mintA, seller.publicKey, 200);
    console.log("Buyer  ATA for mint A", buyerTokenAccountA);
    console.log("Seller ATA for mint A", sellerTokenAccountA);

    // Create and funding ATAs 
    const amountA = await utils.getTokenAccountBalance(provider, buyerTokenAccountA);
    assert.ok(amountA == 100000000);
    const amountB = await utils.getTokenAccountBalance(provider, sellerTokenAccountA);
    assert.ok(amountB == 200000000);

    

  });


 

  it("Create escrow", async () => {

    
    // Vault Authority
    //const [_vault_authority_pda, _vault_authority_bump] = await PublicKey.findProgramAddress(
    //  [Buffer.from(anchor.utils.bytes.utf8.encode("escrow-" + orderCode.toString()))],
    //  program.programId
    //);
    //vault_authority_pda = _vault_authority_pda;

    
    // Escrow Account 
    const [_escrow_account_pda, _escrow_account_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("escrow" + orderCode.toString()))],
      program.programId
    );
    const escrow_account_pda = _escrow_account_pda;

    // Init vault account
    const [_vault_account_pda, _vault_account_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("vault" + orderCode.toString()))],
      program.programId
    );

    vault_account_pda = _vault_account_pda;
    vault_account_bump = _vault_account_bump;



    /*type ConfirmOptions = {
      skipPreflight?: boolean;
      commitment?: Commitment;
      preflightCommitment?: Commitment;
      maxRetries?: number;
      minContextSlot?: number;
  }*/

    const options = {
      skipPreflight: true      
    }

    //const ix_create_escrow_account 
    //  = await program.account.escrowAccount.createInstruction(buyer);
    //const ix_create_escrow_account 
    //  = await program.account.testAcount.createInstruction(buyer);

      
    //let tx = new Transaction()
    //tx.instructions = [ix_create_escrow_account]

    //const re = await provider.sendAndConfirm(tx,[buyer], options); //, [buyer]);
    //console.log(re)


      const tx = await program.methods
        .initialize(
          vault_account_bump,
          new anchor.BN(amount),
          new anchor.BN(orderCode))
        .accounts(
        {
          initializer: buyer.publicKey, 
          buyer: buyer.publicKey,
          seller: seller.publicKey,
          judge: judge.publicKey,
          mint: mintA,          
          buyerDepositTokenAccount: buyerTokenAccountA,
          sellerReceiveTokenAccount: sellerTokenAccountA,
          escrowAccount: escrow_account_pda,
          vaultAccount: vault_account_pda,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([buyer])
        //.preInstructions([ix_create_escrow_account])
        .rpc(options);


       
      // Add your test here.
      
    //const tx = await program.methods. .initialize().rpc();
    //console.log("Your transaction signature", tx);



    // Get data info from Blockchain.

    //let _vault = await mintA.getAccountInfo(vault_account_pda);
    //let _escrowAccount = await program.account.escrowAccount.fetch(escrowAccount.publicKey);

    //assert.ok(_vault.owner.equals(vault_account_pda));

  });
});
