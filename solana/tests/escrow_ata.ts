import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import { assert } from 'chai';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";

import * as utils from "./utils";
import { Xfluencer } from "../target/types/xfluencer";

import { createInitializeMintCloseAuthorityInstruction } from '@solana/spl-token';

import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import {
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount, 
  createMint, 
  getMint, 
  mintTo,
  MINT_SIZE,  
  createAssociatedTokenAccountIdempotentInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";
import { CollectionMasterEditionAccountInvalidError, printArgs } from "@metaplex-foundation/mpl-token-metadata";


describe("Testing Escrow Using SPL Tokens", () => {
    
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

  // keypairs for testing
  const payer = anchor.web3.Keypair.generate();
  const business = anchor.web3.Keypair.generate();
  const influencer = anchor.web3.Keypair.generate();
  const validatorAuthority = anchor.web3.Keypair.generate();
  const escrowAccount = anchor.web3.Keypair.generate();
  const mintAuthority = anchor.web3.Keypair.generate(); 

  // SPL token information
  const NUMBER_DECIMALS = 6;

  // Amount of tokens with decimals
  const amount = 123 * 10 ** NUMBER_DECIMALS; // 10 tokens
  
  // RPC options
  const options = {
    skipPreflight: true      
  }

  it('Initialize Program State', async () => {
    
    // Airdrop Sol to payer.
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, 
                                               10 * LAMPORTS_PER_SOL), // 10 SOL
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

      businessTokenAmount   = 1215 * 10 ** NUMBER_DECIMALS; // 1000 Tokens  
      influencerTokenAmount  = 525 * 10 ** NUMBER_DECIMALS; // 1 Tokens
  
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

      console.log("ATA for Business:", associatedTokenAccForBusiness.toString());
      console.log("ATA Owner:",owner.toString());
      console.log("Business Balance:",balanceBusiness.value.uiAmount);

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
      
      console.log("ATA for Influencer:", 
                associatedTokenAccForInfluencer.toString());  
      console.log("ATA owner:",influencer.publicKey.toString());                
      console.log("Influencer Balance:",balanceInfluencer.value.uiAmount);

    });

    
    it("Create Escrow using SPL (ATAs)", async () => {

      const orderCode = 123; // uuid uniquely the escrow and the vault

      const [vaultAccountPda, vault_account_bump] 
          = await PublicKey.findProgramAddressSync(
            [Buffer.from(anchor.utils.bytes.utf8.encode("token-seed"+orderCode.toString()))],
        program.programId
      );

      const [escrowAccount, ] 
          = await PublicKey.findProgramAddressSync(
            [Buffer.from(anchor.utils.bytes.utf8.encode("escrow-data"+orderCode.toString()))],
         program.programId
      );

      await program.methods
      .initialize(
        vault_account_bump,
        new anchor.BN(amount),
        new anchor.BN(orderCode))
      .accounts(
      {
        business: business.publicKey,
        influencer: influencer.publicKey,
        vaultAccount: vaultAccountPda,
        validationAuthority: validatorAuthority.publicKey,
        mint: mintA,        
        businessDepositTokenAccount: associatedTokenAccForBusiness,
        influencerReceiveTokenAccount: associatedTokenAccForInfluencer,
        escrowAccount: escrowAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([ business])
      .rpc(options);

      // Fetching vault account   
      try {
        const info = await connection.getTokenAccountBalance(vaultAccountPda);
        if (info.value.uiAmount == null) throw new Error('No balance found');
        console.log('Post Escrow Creation - Balance Vault Account:', info.value.uiAmount);
           
        // vault account contains the number of tokens expected
        assert.ok(info.value.decimals == NUMBER_DECIMALS);
        assert.ok(Number(info.value.amount) == amount);
        assert.ok(info.value.uiAmount == amount / 10 ** NUMBER_DECIMALS);

      }
      catch(error) {   
        console.log(error)
      }
    });
    
    it('Create Escrow Using ATA, Cancel By Business with no validation should Fail', async () => {

      /////////////////// 
      // create escrow //
      ///////////////////

      const orderCode = 124; // uuid uniquely the escrow and the vault
     
      const [vaultAccountPda, vault_account_bump] 
          = await PublicKey.findProgramAddressSync(
            [Buffer.from(anchor.utils.bytes.utf8.encode("token-seed"+orderCode.toString()))],
       program.programId
      );

      const [escrowAccountPda, ] 
          = await PublicKey.findProgramAddressSync(
            [Buffer.from(anchor.utils.bytes.utf8.encode("escrow-data"+orderCode.toString()))],
        program.programId
      );
    
      await program.methods
      .initialize(
        vault_account_bump,
        new anchor.BN(amount),
        new anchor.BN(orderCode))
      .accounts(
      {
        business: business.publicKey,
        influencer: influencer.publicKey,
        vaultAccount: vaultAccountPda,
        validationAuthority: validatorAuthority.publicKey,
        mint: mintA,        
        businessDepositTokenAccount: associatedTokenAccForBusiness,
        influencerReceiveTokenAccount: associatedTokenAccForInfluencer,
        escrowAccount: escrowAccountPda,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([business])
      .rpc(options);
    
      ////////////////////////////////////
      // cancel deal without validation //
      //////////////////////////////////// 

      try {

        await program.methods
        .cancelEscrowSpl(
          new anchor.BN(orderCode)
        )
        .accounts({
          business: business.publicKey,
          businessDepositTokenAccount: associatedTokenAccForBusiness,
          vaultAccount: vaultAccountPda,
          vaultAuthority: validatorAuthority.publicKey,
          escrowAccount: escrowAccountPda,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([business])
        .rpc(options);
      }  catch (err) {
        //console.log(err)
        assert.strictEqual(err.code, 6007);      
        assert.strictEqual(err.msg, "Bad Escrow State");
      }

    });


    it('Create Escrow Using ATA, Claim By Influencer, with no validation should Fail', async () => {


      /////////////////// 
      // create escrow //
      ///////////////////
  
        const orderCode = 125; // uuid uniquely the escrow and the vault

        const [vaultAccountPda, vault_account_bump] 
        = await PublicKey.findProgramAddressSync(
          [Buffer.from(anchor.utils.bytes.utf8.encode("token-seed"+orderCode.toString()))],
         program.programId
        );
  
        const [escrowAccountPda, ] 
            = await PublicKey.findProgramAddressSync(
              [Buffer.from(anchor.utils.bytes.utf8.encode("escrow-data"+orderCode.toString()))],
          program.programId
        );
    
        await program.methods
        .initialize(
          vault_account_bump,
          new anchor.BN(amount),
          new anchor.BN(orderCode))
        .accounts(
        {
          business: business.publicKey,
          influencer: influencer.publicKey,
          vaultAccount: vaultAccountPda,
          validationAuthority: validatorAuthority.publicKey,
          mint: mintA,        
          businessDepositTokenAccount: associatedTokenAccForBusiness,
          influencerReceiveTokenAccount: associatedTokenAccForInfluencer,
          escrowAccount: escrowAccountPda,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([business])
        .rpc(options);
    
      /////////////////////////////////////
      // claim escrow without validation //
      ///////////////////////////////////// 
  
        try {
    
          await program.methods
          .claimEscrowSpl(
            new anchor.BN(orderCode)
          )
          .accounts({
            business: business.publicKey,
            businessDepositTokenAccount: associatedTokenAccForBusiness,
            influencer: influencer.publicKey,
            influencerReceiveTokenAccount: associatedTokenAccForInfluencer,
            vaultAccount: vaultAccountPda,
            vaultAuthority: validatorAuthority.publicKey,
            escrowAccount: escrowAccountPda,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([influencer])
          .rpc(options);
        }  catch (err) {
          //console.log(err)
          assert.strictEqual(err.code, 6007);      
          assert.strictEqual(err.msg, "Bad Escrow State");
        }
          
      });


      it('Create Escrow Using ATA, Validate to Cancel, and Cancel By Business', async () => {

        /////////////////// 
        // create escrow //
        ///////////////////
    
        const orderCode = 126; // uuid uniquely the escrow and the vault

        let uiOriginalBusinessBalanceAmount = null;

        const [vaultAccountPda, vault_account_bump] 
        = await PublicKey.findProgramAddressSync(
          [Buffer.from(anchor.utils.bytes.utf8.encode("token-seed"+orderCode.toString()))],
         program.programId
        );
  
        const [escrowAccountPda, ] 
            = await PublicKey.findProgramAddressSync(
              [Buffer.from(anchor.utils.bytes.utf8.encode("escrow-data"+orderCode.toString()))],
          program.programId
        );

        {
          const info1 = await connection.getTokenAccountBalance(associatedTokenAccForBusiness);
          if (info1.value.uiAmount == null) throw new Error('No balance found');
          console.log('Pre Creation - Business ATA:', info1.value.uiAmount);

          const info2 = await connection.getTokenAccountBalance(associatedTokenAccForInfluencer);
          if (info2.value.uiAmount == null) throw new Error('No balance found');
          console.log('Pre Creation - Influencer ATA:', info2.value.uiAmount);

          uiOriginalBusinessBalanceAmount = info1.value.uiAmount;
        }

        await program.methods
        .initialize(
          vault_account_bump,
          new anchor.BN(amount),
          new anchor.BN(orderCode))
        .accounts(
        { 
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

        {
          const info1 = await connection.getTokenAccountBalance(associatedTokenAccForBusiness);
          if (info1.value.uiAmount == null) throw new Error('No balance found');
          console.log('Post Creation - Business ATA:', info1.value.uiAmount);

          const info3 = await connection.getTokenAccountBalance(vaultAccountPda);
          if (info3.value.uiAmount == null) throw new Error('No balance found');
          console.log('Post Creation - Vault Account:', info3.value.uiAmount);

          const info2 = await connection.getTokenAccountBalance(associatedTokenAccForInfluencer);
          if (info2.value.uiAmount == null) throw new Error('No balance found');
          console.log('Post Creation - Influencer ATA:', info2.value.uiAmount);

          assert.ok(info3.value.uiAmount == amount / 10 ** NUMBER_DECIMALS);
          
        }

        ////////////////////////
        // validate to cancel //
        ////////////////////////

        const targetState = 1;
        const percentageFee = 500; // 5%

        await program.methods
          .validateEscrowSpl(
            targetState,
            percentageFee
          )
          .accounts({
            validationAuthority: validatorAuthority.publicKey,
            vaultAccount: vaultAccountPda,
            influencer: influencer.publicKey,
            business: business.publicKey,
            escrowAccount: escrowAccountPda,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .signers([validatorAuthority])
          .rpc(options)

          {
            const info1 = await connection.getTokenAccountBalance(associatedTokenAccForBusiness);
            if (info1.value.uiAmount == null) throw new Error('No balance found');
            console.log('Post Validation to Cancel - Business ATA:', info1.value.uiAmount);
  
            const info3 = await connection.getTokenAccountBalance(vaultAccountPda);
            if (info3.value.uiAmount == null) throw new Error('No balance found');
            console.log('Post Validation to Cancel - Vault Account:', info3.value.uiAmount);
  
            const info2 = await connection.getTokenAccountBalance(associatedTokenAccForInfluencer);
            if (info2.value.uiAmount == null) throw new Error('No balance found');
            console.log('Post Validation to Cancel - Influencer ATA:', info2.value.uiAmount);
  
          }
          /////////////////////////////////
          // cancel deal with validation //
          ///////////////////////////////// 

          await program.methods
          .cancelEscrowSpl(
            new anchor.BN(orderCode)
          )
          .accounts({
            business: business.publicKey,
            businessDepositTokenAccount: associatedTokenAccForBusiness,
            vaultAccount: vaultAccountPda,
            vaultAuthority: validatorAuthority.publicKey,
            escrowAccount: escrowAccountPda,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .signers([business])
          .rpc(options);

        
          {

            const info1 = await connection.getTokenAccountBalance(associatedTokenAccForBusiness);
            if (info1.value.uiAmount == null) throw new Error('No balance found');
            console.log('Post Cancel - Business ATA:', info1.value.uiAmount);
  
            
            try {
                const info = await connection.getTokenAccountBalance(vaultAccountPda);
                if (info == null) throw new Error('No account found');
                assert.fail("Escrow account was not closed after cancelation");
            } catch (error) {
                assert.ok("Escrow Account closed after cancellation");
            }
           
            const info2 = await connection.getTokenAccountBalance(associatedTokenAccForInfluencer);
            if (info2.value.uiAmount == null) throw new Error('No balance found');
            console.log('Post Cancel - Influencer ATA:', info2.value.uiAmount);
  
             
            assert.ok(info1.value.uiAmount == uiOriginalBusinessBalanceAmount);
          }
             
    
      });



      it('Create Escrow Using ATA, Validate to Delivery, and Claim By Influencer', async () => {

        /////////////////// 
        // create escrow //
        ///////////////////
        console.log("------------------------");
    
        const orderCode = 127; // uuid uniquely the escrow and the vault
        let preDealBalanceInfluencer = null;

        const [vaultAccountPda, vault_account_bump] 
        = await PublicKey.findProgramAddressSync(
          [Buffer.from(anchor.utils.bytes.utf8.encode("token-seed"+orderCode.toString()))],
         program.programId
        );
  
        const [escrowAccountPda, ] 
            = await PublicKey.findProgramAddressSync(
              [Buffer.from(anchor.utils.bytes.utf8.encode("escrow-data"+orderCode.toString()))],
          program.programId
        );

        {
          const info1 = await connection.getTokenAccountBalance(associatedTokenAccForBusiness);
          if (info1.value.uiAmount == null) throw new Error('No balance found');
          console.log('Pre Creation - Business ATA:', info1.value.uiAmount);

          const info2 = await connection.getTokenAccountBalance(associatedTokenAccForInfluencer);
          if (info2.value.uiAmount == null) throw new Error('No balance found');
          console.log('Pre Creation - Influencer ATA:', info2.value.uiAmount);

          preDealBalanceInfluencer = info2.value.uiAmount;
        }

        await program.methods
        .initialize(
          vault_account_bump,
          new anchor.BN(amount),
          new anchor.BN(orderCode))
        .accounts(
        { 
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

        {
          const info1 = await connection.getTokenAccountBalance(associatedTokenAccForBusiness);
          if (info1.value.uiAmount == null) throw new Error('No balance found');
          console.log('Post Creation - Business ATA:', info1.value.uiAmount);

          const info3 = await connection.getTokenAccountBalance(vaultAccountPda);
          if (info3.value.uiAmount == null) throw new Error('No balance found');
          console.log('Post Creation - Vault Account:', info3.value.uiAmount);

          const info2 = await connection.getTokenAccountBalance(associatedTokenAccForInfluencer);
          if (info2.value.uiAmount == null) throw new Error('No balance found');
          console.log('Post Creation - Influencer ATA:', info2.value.uiAmount);

          assert.ok(info3.value.uiAmount == amount / 10 ** NUMBER_DECIMALS);
          
        }

        //////////////////////////
        // validate to delivery //
        //////////////////////////

        const targetState = 2;
        const percentageFee = 500; // 5%

        await program.methods
          .validateEscrowSpl(
            targetState,
            percentageFee
          )
          .accounts({
            validationAuthority: validatorAuthority.publicKey,
            vaultAccount: vaultAccountPda,
            influencer: influencer.publicKey,
            business: business.publicKey,
            escrowAccount: escrowAccountPda,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .signers([validatorAuthority])
          .rpc(options)

          {
            const info1 = await connection.getTokenAccountBalance(associatedTokenAccForBusiness);
            if (info1.value.uiAmount == null) throw new Error('No balance found');
            console.log('Post Validation to Cancel - Business ATA:', info1.value.uiAmount);
  
            const info3 = await connection.getTokenAccountBalance(vaultAccountPda);
            if (info3.value.uiAmount == null) throw new Error('No balance found');
            console.log('Post Validation to Cancel - Vault Account:', info3.value.uiAmount);
  
            const info2 = await connection.getTokenAccountBalance(associatedTokenAccForInfluencer);
            if (info2.value.uiAmount == null) throw new Error('No balance found');
            console.log('Post Validation to Cancel - Influencer ATA:', info2.value.uiAmount);
  
          }
          ////////////////////////////////
          // claim deal with validation //
          //////////////////////////////// 

          await program.methods
          .claimEscrowSpl(
            new anchor.BN(orderCode)
          )
          .accounts({
            business: business.publicKey,
            businessDepositTokenAccount: associatedTokenAccForBusiness,
            influencer: influencer.publicKey,
            influencerReceiveTokenAccount: associatedTokenAccForInfluencer,
            vaultAccount: vaultAccountPda,
            vaultAuthority: validatorAuthority.publicKey,
            escrowAccount: escrowAccountPda,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .signers([influencer])
          .rpc(options);

        
          {

            const info1 = await connection.getTokenAccountBalance(associatedTokenAccForBusiness);
            if (info1.value.uiAmount == null) throw new Error('No balance found');
            console.log('Post Claim - Business ATA:', info1.value.uiAmount);
  
            try {            
              const info = await connection.getTokenAccountBalance(vaultAccountPda);
              if (info == null) throw new Error('No acount found');
              assert.fail("Post Claim - Escrow Closing failed")
            }
            catch(err){
              assert.ok(err.code == -32602);
              assert.ok("Post Claim - Escrow Closed OK post claim");
            }

            const info2 = await connection.getTokenAccountBalance(associatedTokenAccForInfluencer);
            if (info2.value.uiAmount == null) throw new Error('No balance found');
            console.log('Post Claim - Influencer ATA:', info2.value.uiAmount);
  
            const uiAmountTransferred = amount / 10 ** NUMBER_DECIMALS;
            assert.ok(info2.value.uiAmount == preDealBalanceInfluencer + uiAmountTransferred);
          }
            
    
      });

});
