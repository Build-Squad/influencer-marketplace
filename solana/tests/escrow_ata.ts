import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import { assert } from 'chai';
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import * as utils from "./utils";
import { Xfluencer } from "../target/types/xfluencer";

import { 
  TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount, 
  createMint, 
  getMint, 
  mintTo } from '@solana/spl-token';

import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import {
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
  let mintInfo = null;
  let mintA: PublicKey = null; 
  let businessTokenAmount = null;
  let influencerTokenAmount = null;
  let associatedTokenAccForBusiness = null;
  let associatedTokenAccForInfluencer = null;

  let vault_account_pda = null;
  let vault_account_bump = null;
  let vault_authority_pda = null;


  
  
  // keypairs for testing
  const payer = anchor.web3.Keypair.generate();
  const business = anchor.web3.Keypair.generate();
  const influencer = anchor.web3.Keypair.generate();
  const validatorAuthority = anchor.web3.Keypair.generate();
  const escrowAccount = anchor.web3.Keypair.generate();

  const mintAuthority = anchor.web3.Keypair.generate(); // this is not known in practise

  // SPL token information
  const NUMBER_DECIMALS = 6;

  // Amount of tokens with decimals
  const amount = 10 * 10 ** NUMBER_DECIMALS; // 10 tokens
  
  
  it('Initialize Program State', async () => {
    
    // Airdrop Sol to payer.
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, 
                                               10 * 10 ** 9), // 10 SOL
      "processed"
    );

    // Airdrop SOL to all accounts
    for (const keypair of [
      business,
      influencer,
      validatorAuthority,
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

      businessTokenAmount = 15 * 10 ** NUMBER_DECIMALS; // 10 Tokens  
      influencerTokenAmount = 1 * 10 ** NUMBER_DECIMALS; // 10 Tokens
  
      
      const owner = business.publicKey;  

      [associatedTokenAccForBusiness, mintInfo] = await Promise.all([
        createAssociatedTokenAccount(
          provider.connection,
          payer,
          mintA,
          owner
        ),
        getMint(provider.connection, mintA),
      ]);


      await mintTo(
        provider.connection,
        payer,
        mintA,
        associatedTokenAccForBusiness,
        mintAuthority, // Assumption mint was created by provider.wallet,
        businessTokenAmount,
        []
      );


      // check balance on business
      const balanceBusiness = await provider.connection.getTokenAccountBalance(associatedTokenAccForBusiness);
      console.log("ATA token address for Business:", associatedTokenAccForBusiness);
      console.log("Owner of the Token:",owner);
      console.log("Balance:",balanceBusiness);


      let _bump = null;
      [associatedTokenAccForInfluencer, _bump] = await Promise.all([
        createAssociatedTokenAccount(
          provider.connection,
          payer,
          mintA,
          influencer.publicKey
        ),
        getMint(provider.connection, mintA),
      ]);

      await mintTo(
        provider.connection,
        payer,
        mintA,
        associatedTokenAccForInfluencer,
        mintAuthority, // Assumption mint was created by provider.wallet,
        influencerTokenAmount,
        []
      );


      // check balance on business
      const balanceInfluencer = await provider.connection.getTokenAccountBalance(associatedTokenAccForInfluencer);
      console.log("ATA token address for Influencer:", associatedTokenAccForInfluencer);  
      console.log("Balance:",balanceInfluencer);



    });


    it("Create Escrow using ATA", async () => {

      const orderCode = 123; // uuid uniquely the escrow and the vault

      // Note that this will be the vault authority
      const [escrowAccountPda, vault_account_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("escrow" + orderCode.toString()))],
        program.programId
      );
     
  
      const [vaultAccountPda, vault_account_pda_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("vault" + orderCode.toString()))],
        program.programId
      );
  
       
      const options = {
        skipPreflight: true      
      }

      //console.log(associatedTokenAccForBusiness);
      //console.log(associatedTokenAccForInfluencer);

      const tx = await program.methods
      .initialize(
        vault_account_bump,
        new anchor.BN(amount),
        new anchor.BN(orderCode))
      .accounts(
      {
        initializer: business.publicKey, 
        business: business.publicKey,
        influencer: influencer.publicKey,
        validationAuthority: validatorAuthority.publicKey,
        mint: mintA,        
        businessDepositTokenAccount: associatedTokenAccForBusiness,
        influencerReceiveTokenAccount: associatedTokenAccForInfluencer,
        escrowAccount: escrowAccountPda,
        vaultAccount: vaultAccountPda,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([business])
      .rpc(options);


      // Fetching escrow account   
      try {
        
        const info = await connection.getTokenAccountBalance(vaultAccountPda);
        if (info.value.uiAmount == null) throw new Error('No balance found');
        console.log('Balance (using Solana-Web3.js): ', info.value.uiAmount);
           
        assert.ok(info.value.decimals == NUMBER_DECIMALS);
        assert.ok(Number(info.value.amount) == amount);
        assert.ok(info.value.uiAmount == amount / 10 ** NUMBER_DECIMALS);
      }
      catch(error) {   
        console.log(error)
      }

  
    });

     


/// escrow and cancel



});
  /*
   it("Create Escrow using ATA", async () => {

      const orderCode = 123; // uuid uniquely the escrow and the valut
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
      
      console.log(escrow_account_pda);
      console.log(vault_account_pda);


      const tx = await program.methods
      .initialize(
        vault_account_bump,
        new anchor.BN(amount),
        new anchor.BN(orderCode))
      .accounts(
      {
        initializer: business.publicKey, 
        business: business.publicKey,
        influencer: influencer.publicKey,
        validationAuthority: validatorAuthority.publicKey,
        mint: mintA,        
        businessDepositTokenAccount: businessTokenAccountA,
        influencerReceiveTokenAccount: influencerTokenAccountA,
        escrowAccount: escrow_account_pda,
        vaultAccount: vault_account_pda,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([business])
      .rpc(options);
      */
    





      /*const tx = await program.methods
          .initialize(
            vault_account_bump,
            new anchor.BN(amount),
            new anchor.BN(orderCode))
          .accounts(
          {
            initializer: business.publicKey, 
            business: business.publicKey,
            influencer: influencer.publicKey,
            validatorAuthority: validatorAuthority.publicKey,
            mint: mintA,        
            businessDepositTokenAccount: businessTokenAccountA,
            influencerReceiveTokenAccount: influencerTokenAccountA,
            escrowAccount: escrow_account_pda,
            vaultAccount: vault_account_pda,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([business])
          .rpc(options);
  
  
      // Fetching escrow account   
      let _escrow_account = await program.account.escrowAccount.fetch(escrow_account_pda);*/

    /*
   

    const businessTokenAmount = 100;
    const influencerTokenAmount = 200;

    const mintPk = mintA;
    const owner = business.publicKey;
    const balance = businessTokenAmount;
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
      [business]
    );*/
/*
    businessTokenAccountA  
        = await utils.createAssociatedTokenAccountWithBalance(mintA, business.publicKey, businessTokenAmount);

    influencerTokenAccountA 
        = await utils.createAssociatedTokenAccountWithBalance(mintA, influencer.publicKey, influencerTokenAmount);
*/
    // Create and funding ATAs 
    //amountA = await utils.getTokenAccountBalance(provider, businessTokenAccountA);
    //assert.ok(amountA == businessTokenAmount * 10**NUMBER_DECIMALS);

    //amountB = await utils.getTokenAccountBalance(provider, influencerTokenAccountA);
    //assert.ok(amountB == influencerTokenAmount * 10**NUMBER_DECIMALS); 

 

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
          initializer: business.publicKey, 
          business: business.publicKey,
          influencer: influencer.publicKey,
          validatorAuthority: validatorAuthority.publicKey,
          mint: mintA,        
          businessDepositTokenAccount: businessTokenAccountA,
          influencerReceiveTokenAccount: influencerTokenAccountA,
          escrowAccount: escrow_account_pda,
          vaultAccount: vault_account_pda,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([business])
        .rpc(options);


    // Fetching escrow account   
    let _escrow_account = await program.account.escrowAccount.fetch(escrow_account_pda);

    // Check that escrow account values as expected state
    assert.ok(_escrow_account.businessKey.equals(business.publicKey));
    assert.ok(_escrow_account.businessDepositTokenAccount.equals(businessTokenAccountA));
    assert.ok(_escrow_account.validatorAuthorityKey.equals(validatorAuthority.publicKey));
    assert.ok(_escrow_account.amount.toNumber() == amount);
    assert.ok(_escrow_account.orderCode.toNumber() == orderCode);
    assert.ok(_escrow_account.status.toString() == "0");
    assert.ok(_escrow_account.deliveryTime.toNumber() > 0);
      
    // fetching business account
    let _business_accont_ballance = await provider.connection.getTokenAccountBalance(businessTokenAccountA);

    // check amount remaning in the business's token account 
    assert.ok(_business_accont_ballance.value.amount == (amountA-amount).toString());

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
          initializer: business.publicKey, 
          business: business.publicKey,
          influencer: influencer.publicKey,
          validatorAuthority: validatorAuthority.publicKey,
          mint: mintA,        
          businessDepositTokenAccount: businessTokenAccountA,
          influencerReceiveTokenAccount: influencerTokenAccountA,
          escrowAccount: escrow_account_pda,
          vaultAccount: vault_account_pda,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([business])
        .rpc(options);


    // Fetching escrow account   
    let _escrow_account = await program.account.escrowAccount.fetch(escrow_account_pda);

    // Check that escrow account values as expected state
    assert.ok(_escrow_account.businessKey.equals(business.publicKey));
    assert.ok(_escrow_account.businessDepositTokenAccount.equals(businessTokenAccountA));
    assert.ok(_escrow_account.validatorAuthorityKey.equals(validatorAuthority.publicKey));
    assert.ok(_escrow_account.amount.toNumber() == amount);
    assert.ok(_escrow_account.orderCode.toNumber() == orderCode);
    assert.ok(_escrow_account.status.toString() == "0");
    assert.ok(_escrow_account.deliveryTime.toNumber() > 0);
      
    // fetching business account
    let _business_accont_ballance = await provider.connection.getTokenAccountBalance(businessTokenAccountA);

    // check amount remaning in the business's token account 
    // (note: this is the 2nd escrow initizalied by the business for any test session)
    assert.ok(_business_accont_ballance.value.amount == (amountA-2*amount).toString());

    // check amount in the program vault with authority the escrow
    let _vault_account_balance = await provider.connection.getTokenAccountBalance(vault_account_pda);
    assert.ok(_vault_account_balance.value.amount == amount.toString());
    assert.ok(_vault_account_balance.value.decimals == NUMBER_DECIMALS);

    // Start cancellation for order code by the business (status == 0)
    const tx_cancel = await program.methods.cancel(
        new anchor.BN(orderCode))
        .accounts({
            business: business.publicKey,
            businessDepositTokenAccount: businessTokenAccountA,
            vaultAccount: vault_account_pda,
            vaultAuthority: escrow_account_pda,
            escrowAccount: escrow_account_pda,
            tokenProgram: TOKEN_PROGRAM_ID,}
        )
        .signers([business])
        .rpc(options);

    _business_accont_ballance = await provider.connection.getTokenAccountBalance(businessTokenAccountA);
    assert.ok(_business_accont_ballance.value.amount == (amountA-amount).toString());

  });
  


  */

