import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import { assert } from 'chai';
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import * as utils from "./utils";
import { Xfluencer } from "../target/types/xfluencer";

import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

describe("Testing Escrow for SOL", () => {
    
  const program = anchor.workspace.Xfluencer as Program<Xfluencer>;

  

  const validationAuthority: anchor.web3.Keypair 
        = anchor.web3.Keypair.generate();

  const validationAuthorityPublicKey = validationAuthority.publicKey;

  const influencer: anchor.web3.Keypair 
        = anchor.web3.Keypair.generate();
  const influencerPublicKey = influencer.publicKey;

  const amount = 10 ** 11; // lamports ()
  
  it('Create Escrow for SOL', async () => {

    const orderCode = 1;

    const provider = anchor.getProvider()

    const buyerPublicKey = anchor.AnchorProvider.local().wallet.publicKey;
    let account_data = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const initial_funds = account_data.value;
    console.log(initial_funds)

    //const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const [escrowPDA] = await anchor.web3.PublicKey.findProgramAddress([
        utf8.encode('escrow'),
        buyerPublicKey.toBuffer(), 
        influencerPublicKey.toBuffer(),
        Buffer.from(anchor.utils.bytes.utf8.encode(orderCode.toString()))
      ],
      program.programId
    );
    

    const options = {
      skipPreflight: true      
    }

    await program.methods
    .createEscrow(
      new anchor.BN(amount),
      new anchor.BN(orderCode))
    .accounts({
      validationAuthority: validationAuthorityPublicKey,
      from: buyerPublicKey,
      to: influencerPublicKey,
      systemProgram:  anchor.web3.SystemProgram.programId,
      escrow: escrowPDA
    }).rpc(options);

    const escrow_value = (await program.account.escrowAccountSolana.fetch(escrowPDA)).amount.toNumber();
    console.log("escrow amount",escrow_value)
    assert.ok(escrow_value == amount);


  });


  it('Create Escrow for SOL, Validate Cancel to Business, and Claim Cancel By Business', async () => {

    const orderCode = 2;

    const provider = anchor.getProvider()

    const buyerPublicKey = anchor.AnchorProvider.local().wallet.publicKey;
    let account_data = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const initial_funds = account_data.value;
    console.log(initial_funds)

    //const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const [escrowPDA] = await anchor.web3.PublicKey.findProgramAddress([
        utf8.encode('escrow'),
        buyerPublicKey.toBuffer(), 
        influencerPublicKey.toBuffer(),
        Buffer.from(anchor.utils.bytes.utf8.encode(orderCode.toString()))
      ],
      program.programId
    );
    

    const options = {
      skipPreflight: true      
    }

    /////////////////// 
    // create escrow //
    ///////////////////

    await program.methods
    .createEscrow(
      new anchor.BN(amount),
      new anchor.BN(orderCode))
    .accounts({
      validationAuthority: validationAuthorityPublicKey,
      from: buyerPublicKey,
      to: influencerPublicKey,
      systemProgram:  anchor.web3.SystemProgram.programId,
      escrow: escrowPDA
    }).rpc(options);

    const escrow_value = (await program.account.escrowAccountSolana.fetch(escrowPDA)).amount.toNumber();
    console.log("escrow amount",escrow_value)
    assert.ok(escrow_value == amount);


    /////////////////////
    // validate escrow //
    /////////////////////
    const state = 1;  // 1 == cancel escrow state

    await program.methods
    .validateEscrowSol(
      state
      )
    .accounts(
      { 
        validationAuthority: validationAuthorityPublicKey,
        influencer: influencerPublicKey,
        business: buyerPublicKey,
        escrowAccount: escrowPDA
      }
    ).signers([validationAuthority])
    .rpc(options);

    //////////////////////////
    // claim cancel escrow //
    /////////////////////////
    await program.methods
    .cancelEscrowSol()
    .accounts({
      business: buyerPublicKey,
      escrowAccount: escrowPDA,
    }).rpc(options);


  });


  it('Create Escrow for SOL, Validate Delivered for Influencer, and Claim Delivered By Business', async () => {

    const orderCode = 3;

    const provider = anchor.getProvider()

    const buyerPublicKey = anchor.AnchorProvider.local().wallet.publicKey;
    let account_data = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const initial_funds = account_data.value;
    console.log("Initial Funds",initial_funds)

    const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    
    const [escrowPDA] = await anchor.web3.PublicKey.findProgramAddress([
      utf8.encode('escrow'),
      buyerPublicKey.toBuffer(), 
      influencerPublicKey.toBuffer(),
      Buffer.from(anchor.utils.bytes.utf8.encode(orderCode.toString()))
    ],
    program.programId
    );

    const amount = 123456789;

    const options = {
      skipPreflight: true      
    }
    
    /////////////////// 
    // create escrow //
    ///////////////////

    await program.methods
    .createEscrow(
      new anchor.BN(amount),
      new anchor.BN(orderCode))
    .accounts({
      validationAuthority: validationAuthorityPublicKey,
      from: buyerPublicKey,
      to: influencerPublicKey,
      systemProgram:  anchor.web3.SystemProgram.programId,
      escrow: escrowPDA
    }).rpc(options);

    
    const escrowAccount = await program.account.escrowAccountSolana.fetch(escrowPDA)  

    const escrow_value = escrowAccount.amount.toNumber();
    const account_data2 = await provider.connection.getBalanceAndContext(buyerPublicKey);

    console.log("escrow amount",escrow_value)
    assert.ok(escrow_value == amount);

    /////////////////////
    // validate escrow //
    /////////////////////    
    const state = 2;  // 2 == delivered escrow state

    await program.methods
    .validateEscrowSol(
      state
      )
    .accounts(
      { 
        validationAuthority: validationAuthorityPublicKey,
        influencer: influencerPublicKey,
        business: buyerPublicKey,
        escrowAccount: escrowPDA
      }
    ).signers([validationAuthority])
    .rpc(options);

    ////////////////////////////
    // claim delivered escrow //
    ////////////////////////////
    const tx = await program.methods
      .claimEscrow(
        new anchor.BN(orderCode))
      .accounts({
        influencer: influencer.publicKey,
        business: buyerPublicKey,
        escrowAccount: escrowPDA, 
        systemProgram:  anchor.web3.SystemProgram.programId,
      }
      ).transaction();

      tx.feePayer = influencer.publicKey;
      await utils.airdrop(program, influencer, 1);
 
      const txID = await provider.connection.sendTransaction(tx,[influencer]);
      await provider.connection.confirmTransaction(txID);

      try {
        await program.account.escrowAccountSolana.fetch(escrowPDA)
      }
      catch(error){            
        assert.ok(true);
        return;
      }
      assert.ok(false)

  });



  it('Crease General Fees Account (PDA)', async () => {

  });
  it('Update General Fees Account (PDA)', async () => {

  });



  
  it('Create Escrow for SOL, Validate to Bad State', async () => {

    const orderCode = 4;

    const provider = anchor.getProvider()

    const buyerPublicKey = anchor.AnchorProvider.local().wallet.publicKey;
    let account_data = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const initial_funds = account_data.value;
    console.log("Initial Funds",initial_funds)

    const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    
    const [escrowPDA] = await anchor.web3.PublicKey.findProgramAddress([
      utf8.encode('escrow'),
      buyerPublicKey.toBuffer(), 
      influencerPublicKey.toBuffer(),
      Buffer.from(anchor.utils.bytes.utf8.encode(orderCode.toString()))
    ],
    program.programId
    );

    const amount = 123456789;

    const options = {
      skipPreflight: true      
    }
    
    /////////////////// 
    // create escrow //
    ///////////////////

    await program.methods
    .createEscrow(
      new anchor.BN(amount),
      new anchor.BN(orderCode))
    .accounts({
      validationAuthority: validationAuthorityPublicKey,
      from: buyerPublicKey,
      to: influencerPublicKey,
      systemProgram:  anchor.web3.SystemProgram.programId,
      escrow: escrowPDA
    }).rpc(options);

    
    const escrowAccount = await program.account.escrowAccountSolana.fetch(escrowPDA)  

    const escrow_value = escrowAccount.amount.toNumber();
    const account_data2 = await provider.connection.getBalanceAndContext(buyerPublicKey);

    console.log("escrow amount",escrow_value)
    assert.ok(escrow_value == amount);

    /////////////////////
    // validate escrow //
    /////////////////////    
    const state = 3;  // 3 is a bad state transiction (only 1 or 2)

    try {
      await program.methods
        .validateEscrowSol(
          state
          )
        .accounts(
          { 
            validationAuthority: validationAuthorityPublicKey,
            influencer: influencerPublicKey,
            business: buyerPublicKey,
            escrowAccount: escrowPDA
          }
        ).signers([validationAuthority])
        .rpc(options);
      assert.fail("Should not be able to validate escrow");
    } catch (err) {
      assert.strictEqual(err.code, 6004);
      assert.strictEqual(err.msg, "Bad Target State for Escrow (1) for cancel, (2) for release");
    }

  });

  // @TODO: missing test cases
  // 1. Check that influencer cannot claim funds if no validation delivered is done
  // 2. Check that business cannot claim back its funds if no validation cancel is done

});
