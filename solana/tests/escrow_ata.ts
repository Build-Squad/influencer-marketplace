import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import { assert } from 'chai';
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import * as utils from "./utils";
import { Xfluencer } from "../target/types/xfluencer";

import { TOKEN_PROGRAM_ID, createAssociatedTokenAccount, createMint, getMint, mintTo } from '@solana/spl-token';
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MINT_SIZE,  
  createAssociatedTokenAccountIdempotentInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";


describe("Testing Escrow for ATA", () => {
    
  const provider = anchor.getProvider()
  const connection = provider.connection;
  const program = anchor.workspace.Xfluencer as Program<Xfluencer>;



  // Token & PDA
  let mintA: PublicKey = null; 
  let buyerTokenAccountA = null;
  let influencerTokenAccountA = null;
  let vault_account_pda = null;
  let vault_account_bump = null;
  let vault_authority_pda = null;

  let amountA = null; 
  let amountB = null; 

  const amount = 1000;  
  
  // keypairs for testing
  const payer = anchor.web3.Keypair.generate();
  const buyer = anchor.web3.Keypair.generate();
  const influencer = anchor.web3.Keypair.generate();
  const judge = anchor.web3.Keypair.generate();
  const escrowAccount = anchor.web3.Keypair.generate();

  const mintAuthority = anchor.web3.Keypair.generate(); // this is not known in practise

  const NUMBER_DECIMALS = 6;


  
  
  it('Initialize program state', async () => {
    
    // Airdrop Sol to payer.
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, 
                                               10 * 10 ** 9),
      "processed"
    );

    // Airdrop SOL to all accounts
    for (const keypair of [
      buyer,
      influencer,
      judge,
      escrowAccount,
      mintAuthority,
    ]) {
      await utils.airdrop(program, keypair, 1);
    }

    mintA = await createMint(      
      provider.connection,
      mintAuthority,
      mintAuthority.publicKey,
      mintAuthority.publicKey,
      NUMBER_DECIMALS);

      const buyerTokenAmount = 100;
      const influencerTokenAmount = 200;
  
      
      const owner = buyer.publicKey;
  

      const [associatedTokenAcc, mintInfo] = await Promise.all([
        createAssociatedTokenAccount(
          provider.connection,
          payer,
          mintA,
          owner
        ),
        getMint(provider.connection, mintA),
      ]);

      console.log("owner",owner);

      await mintTo(
        provider.connection,
        payer,
        mintA,
        associatedTokenAcc,
        mintAuthority, // Assumption mint was created by provider.wallet,
        buyerTokenAmount,
        []
      );

    /*
   

    const buyerTokenAmount = 100;
    const influencerTokenAmount = 200;

    const mintPk = mintA;
    const owner = buyer.publicKey;
    const balance = buyerTokenAmount;
*/
    
   /*
    const [associatedTokenAcc, mintInfo] = await Promise.all([
      createAssociatedTokenAccount(
        provider.connection,
        nodeWallet.payer,
        mintPk,
        owner
      ),
      getMint(provider.connection, mintPk),
    ]);

    await mintTo(
      provider.connection,
      nodeWallet.payer,
      mintPk,
      associatedTokenAcc,
      owner,  // Assumption mint was created by provider.wallet,
      Number(balance), // * 10 ** mintInfo.decimals,
      [buyer]
    );*/
/*
    buyerTokenAccountA  
        = await utils.createAssociatedTokenAccountWithBalance(mintA, buyer.publicKey, buyerTokenAmount);

    influencerTokenAccountA 
        = await utils.createAssociatedTokenAccountWithBalance(mintA, influencer.publicKey, influencerTokenAmount);
*/
    // Create and funding ATAs 
    //amountA = await utils.getTokenAccountBalance(provider, buyerTokenAccountA);
    //assert.ok(amountA == buyerTokenAmount * 10**NUMBER_DECIMALS);

    //amountB = await utils.getTokenAccountBalance(provider, influencerTokenAccountA);
    //assert.ok(amountB == influencerTokenAmount * 10**NUMBER_DECIMALS); 

  });

/*
  it("Create Escrow using ATA", async () => {

    const orderCode = 99; // uuid uniquely the escrow and the valut

    // Note that this weill be the vault authority
    const [_escrow_account_pda, _escrow_account_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("escrow" + orderCode.toString()))],
      program.programId
    );
    const escrow_account_pda = _escrow_account_pda;

    const [_vault_account_pda, _vault_account_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("vault" + orderCode.toString()))],
      program.programId
    );

    vault_account_pda = _vault_account_pda;
    vault_account_bump = _vault_account_bump;

    const options = {
      skipPreflight: true      
    }
    
    const tx = await program.methods
        .initialize(
          vault_account_bump,
          new anchor.BN(amount),
          new anchor.BN(orderCode))
        .accounts(
        {
          initializer: buyer.publicKey, 
          buyer: buyer.publicKey,
          influencer: influencer.publicKey,
          judge: judge.publicKey,
          mint: mintA,        
          buyerDepositTokenAccount: buyerTokenAccountA,
          influencerReceiveTokenAccount: influencerTokenAccountA,
          escrowAccount: escrow_account_pda,
          vaultAccount: vault_account_pda,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([buyer])
        .rpc(options);


    // Fetching escrow account   
    let _escrow_account = await program.account.escrowAccount.fetch(escrow_account_pda);

    // Check that escrow account values as expected state
    assert.ok(_escrow_account.buyerKey.equals(buyer.publicKey));
    assert.ok(_escrow_account.buyerDepositTokenAccount.equals(buyerTokenAccountA));
    assert.ok(_escrow_account.judgeKey.equals(judge.publicKey));
    assert.ok(_escrow_account.amount.toNumber() == amount);
    assert.ok(_escrow_account.orderCode.toNumber() == orderCode);
    assert.ok(_escrow_account.status.toString() == "0");
    assert.ok(_escrow_account.deliveryTime.toNumber() > 0);
      
    // fetching buyer account
    let _buyer_accont_ballance = await provider.connection.getTokenAccountBalance(buyerTokenAccountA);

    // check amount remaning in the buyer's token account 
    assert.ok(_buyer_accont_ballance.value.amount == (amountA-amount).toString());

    // check amount in the progrma vault with authority the escrow
    let _vault_account_balance = await provider.connection.getTokenAccountBalance(vault_account_pda);
    assert.ok(_vault_account_balance.value.amount == amount.toString());
    assert.ok(_vault_account_balance.value.decimals == NUMBER_DECIMALS);


  });


  it("Initialize and Cancel Escrow using ATA", async () => {

    const orderCode = 100; // uuid uniquely the escrow and the valut
      
    // Note that this weill be the vault authority
    const [_escrow_account_pda, _escrow_account_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("escrow" + orderCode.toString()))],
      program.programId
    );
    const escrow_account_pda = _escrow_account_pda;

    const [_vault_account_pda, _vault_account_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("vault" + orderCode.toString()))],
      program.programId
    );

    vault_account_pda = _vault_account_pda;
    vault_account_bump = _vault_account_bump;

    const options = {
      skipPreflight: true      
    }
    
    const tx = await program.methods
        .initialize(
          vault_account_bump,
          new anchor.BN(amount),
          new anchor.BN(orderCode))
        .accounts(
        {
          initializer: buyer.publicKey, 
          buyer: buyer.publicKey,
          influencer: influencer.publicKey,
          judge: judge.publicKey,
          mint: mintA,        
          buyerDepositTokenAccount: buyerTokenAccountA,
          influencerReceiveTokenAccount: influencerTokenAccountA,
          escrowAccount: escrow_account_pda,
          vaultAccount: vault_account_pda,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([buyer])
        .rpc(options);


    // Fetching escrow account   
    let _escrow_account = await program.account.escrowAccount.fetch(escrow_account_pda);

    // Check that escrow account values as expected state
    assert.ok(_escrow_account.buyerKey.equals(buyer.publicKey));
    assert.ok(_escrow_account.buyerDepositTokenAccount.equals(buyerTokenAccountA));
    assert.ok(_escrow_account.judgeKey.equals(judge.publicKey));
    assert.ok(_escrow_account.amount.toNumber() == amount);
    assert.ok(_escrow_account.orderCode.toNumber() == orderCode);
    assert.ok(_escrow_account.status.toString() == "0");
    assert.ok(_escrow_account.deliveryTime.toNumber() > 0);
      
    // fetching buyer account
    let _buyer_accont_ballance = await provider.connection.getTokenAccountBalance(buyerTokenAccountA);

    // check amount remaning in the buyer's token account 
    // (note: this is the 2nd escrow initizalied by the buyer for any test session)
    assert.ok(_buyer_accont_ballance.value.amount == (amountA-2*amount).toString());

    // check amount in the program vault with authority the escrow
    let _vault_account_balance = await provider.connection.getTokenAccountBalance(vault_account_pda);
    assert.ok(_vault_account_balance.value.amount == amount.toString());
    assert.ok(_vault_account_balance.value.decimals == NUMBER_DECIMALS);

    // Start cancellation for order code by the buyer (status == 0)
    const tx_cancel = await program.methods.cancel(
        new anchor.BN(orderCode))
        .accounts({
            buyer: buyer.publicKey,
            buyerDepositTokenAccount: buyerTokenAccountA,
            vaultAccount: vault_account_pda,
            vaultAuthority: escrow_account_pda,
            escrowAccount: escrow_account_pda,
            tokenProgram: TOKEN_PROGRAM_ID,}
        )
        .signers([buyer])
        .rpc(options);

    _buyer_accont_ballance = await provider.connection.getTokenAccountBalance(buyerTokenAccountA);
    assert.ok(_buyer_accont_ballance.value.amount == (amountA-amount).toString());

  });
  


  */
});
