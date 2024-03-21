import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import { assert } from 'chai';
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import * as utils from "./utils";
import { Xfluencer } from "../target/types/xfluencer";

import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

describe("Testing Escrow for SOL", () => {
    
  const program = anchor.workspace.Xfluencer as Program<Xfluencer>;

  // validation authority is able to validate the escrow
  const validationAuthority: anchor.web3.Keypair 
        = anchor.web3.Keypair.generate();

  const validationAuthorityPublicKey = validationAuthority.publicKey;

  const influencer: anchor.web3.Keypair 
        = anchor.web3.Keypair.generate();

  const influencerPublicKey = influencer.publicKey;

  const amount = 1000 * 10 ** 9; // 1000 SOL  
  
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
    console.log("escrow amount dedicated",escrow_value)
    assert.ok(escrow_value == amount);


  });


  it('Create Escrow for SOL, and Claim Cancel By Business Fail', async () => {

    const orderCode = 10;

    const provider = anchor.getProvider()

    const buyerPublicKey = anchor.AnchorProvider.local().wallet.publicKey;
    let account_data = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const initial_funds = account_data.value;
    console.log("Initial Funds from the Buyer", initial_funds)

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

  });


  it('Create Escrow for SOL, Validate for Cancellation, and Claim Cancel By Business', async () => {

    const orderCode = 2;

    const provider = anchor.getProvider()

    const buyerPublicKey = anchor.AnchorProvider.local().wallet.publicKey;
    let account_data = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const initial_funds = account_data.value;
    console.log("Initial Funds from the Buyer", initial_funds)

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
    console.log("Lamports moved into Escrow",escrow_value)
    assert.ok(escrow_value == amount);


    /////////////////////
    // validate escrow //
    /////////////////////
    const state = 1;  // 1 == cancel escrow state
    const percentage_fee = 500; // 5%

    await program.methods
    .validateEscrowSol(
      state,
      percentage_fee
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

    let account_data2 = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const initial_funds2 = account_data2.value;
  
    let business_account0 = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const amount_pre_claim_cancel = business_account0.value;
    console.log("Amount Pre Claim",amount_pre_claim_cancel)


    //////////////////////////
    // claim cancel escrow //
    /////////////////////////
    await program.methods
    .cancelEscrowSol()
    .accounts({
      business: buyerPublicKey,
      escrowAccount: escrowPDA,
    }).rpc(options);



    let business_account1 = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const amount_post_claim_cancel = business_account1.value;     
    console.log("Amount Post Claim",amount_post_claim_cancel)
    assert.ok(amount_post_claim_cancel - amount_pre_claim_cancel >= amount) // at leat the initamount 

  });


  it('Create Escrow for SOL, Validate to Delivered, and Claim By Influencer', async () => {

    const orderCode = 3; // any integer is fine as order code

    const provider = anchor.getProvider()

    const buyerPublicKey = anchor.AnchorProvider.local().wallet.publicKey;
    let account_data = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const initial_funds = account_data.value;
    console.log("Initial Funds",initial_funds)

    //const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    
    const [escrowPDA] = await anchor.web3.PublicKey.findProgramAddress([
      utf8.encode('escrow'),
      buyerPublicKey.toBuffer(), 
      influencerPublicKey.toBuffer(),
      Buffer.from(anchor.utils.bytes.utf8.encode(orderCode.toString()))
    ],
    program.programId
    );

    const amount = 10 ** 9; // 1 SOL

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

    console.log("Amount in escrow after creation",escrow_value)
    assert.ok(escrow_value == amount);

    /////////////////////
    // validate escrow //
    /////////////////////    
    // after validation to delivered stage,  
    const state = 2;  // 2 == delivered state
    const percentage_fee = 500; // 5%

    await program.methods
    .validateEscrowSol(
      state,
      percentage_fee
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

  

    const account_validator = await provider.connection.getBalanceAndContext(validationAuthorityPublicKey);
    const fees_collected = account_validator.value;
    console.log("Fees collected by validation authority", fees_collected)

    const account_escrow = await provider.connection.getBalanceAndContext(escrowPDA);
    const remaining = account_escrow.value;
    console.log("Amount remaining in the escrow", remaining)

    assert.ok(remaining+fees_collected >= amount) // >= is due to rent is also collected
  



    ////////////////////////////////////////////
    // claim a delivered escrow by Influencer //
    ////////////////////////////////////////////
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
        // error due Escrow PDA does not exist
        assert.ok(true);
        return;
      }
      // this case test will fail because Escrow PDA does exists!
      assert.ok(false)

  });

  
  it('Create Escrow for SOL, Validate to Bad State', async () => {

    const orderCode = 4;

    const provider = anchor.getProvider()

    const buyerPublicKey = anchor.AnchorProvider.local().wallet.publicKey;
    let account_data = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const initial_funds = account_data.value;
    console.log("Initial Funds for the Buyer",initial_funds)

    const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    
    const [escrowPDA] = await anchor.web3.PublicKey.findProgramAddress([
      utf8.encode('escrow'),
      buyerPublicKey.toBuffer(), 
      influencerPublicKey.toBuffer(),
      Buffer.from(anchor.utils.bytes.utf8.encode(orderCode.toString()))
    ],
    program.programId
    );

    const amount = 10 ** 9;

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

    console.log("Amount Put into the Escrow", escrow_value)
    assert.ok(escrow_value == amount);

    /////////////////////
    // validate escrow //
    /////////////////////    
    const state = 3;  // 3 is a bad state transiction (only 1 or 2)
    const percentage_fee = 500;

    try {
      await program.methods
        .validateEscrowSol(
          state,
          percentage_fee
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

});
