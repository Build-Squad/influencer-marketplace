import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import { assert } from 'chai';
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import * as utils from "./utils";
import { Xfluencer } from "../target/types/xfluencer";

import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

describe("Testing Escrow for SOL", () => {
    
  const program = anchor.workspace.Xfluencer as Program<Xfluencer>;

  const orderCode = 99;
  
  it('Create Escrow for SOL', async () => {
    const provider = anchor.getProvider()

    const buyerPublicKey = anchor.AnchorProvider.local().wallet.publicKey;
    let account_data = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const initial_funds = account_data.value;
    console.log(initial_funds)

    const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const [escrowPDA] = await anchor.web3.PublicKey.findProgramAddress([
        utf8.encode('escrow'),
        buyerPublicKey.toBuffer(), 
        toWallet.publicKey.toBuffer(),
        Buffer.from(anchor.utils.bytes.utf8.encode(orderCode.toString()))
      ],
      program.programId
    );
    const amount = 10 ** 11

    const options = {
      skipPreflight: true      
    }

    await program.methods
    .createEscrow(
      new anchor.BN(amount),
      new anchor.BN(orderCode))
    .accounts({
      from: buyerPublicKey,
      to: toWallet.publicKey,
      systemProgram:  anchor.web3.SystemProgram.programId,
      escrow: escrowPDA
    }).rpc(options);

    const escrow_value = (await program.account.escrowAccountSolana.fetch(escrowPDA)).amount.toNumber();
    console.log("escrow amount",escrow_value)
    assert.ok(escrow_value == amount);


  });


  it('Create Escrow for SOL and Cancel', async () => {
    const provider = anchor.getProvider()

    const buyerPublicKey = anchor.AnchorProvider.local().wallet.publicKey;
    let account_data = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const initial_funds = account_data.value;
    console.log(initial_funds)

    const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const [escrowPDA] = await anchor.web3.PublicKey.findProgramAddress([
        utf8.encode('escrow'),
        buyerPublicKey.toBuffer(), 
        toWallet.publicKey.toBuffer(),
        Buffer.from(anchor.utils.bytes.utf8.encode(orderCode.toString()))
      ],
      program.programId
    );
    const amount = 123456789

    const options = {
      skipPreflight: true      
    }
    console.log("ok")
    await program.methods
    .createEscrow(
      new anchor.BN(amount),
      new anchor.BN(orderCode))
    .accounts({
      from: buyerPublicKey,
      to: toWallet.publicKey,
      systemProgram:  anchor.web3.SystemProgram.programId,
      escrow: escrowPDA
    }).rpc(options);

    const escrowAccount = await program.account.escrowAccountSolana.fetch(escrowPDA)    
    const escrow_value = escrowAccount.amount.toNumber();
    const account_data2 = await provider.connection.getBalanceAndContext(buyerPublicKey);
    console.log("escrow amount",escrow_value)
    assert.ok(escrow_value == amount);
    
    await program.methods
    .canceEscrowSol()
    .accounts({
      business: buyerPublicKey,
      escrowAccount: escrowPDA,
    }).rpc(options);

    let account_data3 = await provider.connection.getBalanceAndContext(buyerPublicKey);
    const initial_funds2 = account_data3.value;
    console.log(initial_funds2)


  });


  it('Crease Escrow for SOL and Claim', async () => {

    const provider = anchor.getProvider()

    const buyerPublicKey = anchor.AnchorProvider.local().wallet.publicKey;
  
    let account_data = await provider.connection.getBalanceAndContext(buyerPublicKey);

    const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const [escrowPDA] = await anchor.web3.PublicKey.findProgramAddress([
        utf8.encode('escrow'),
        buyerPublicKey.toBuffer(), 
        toWallet.publicKey.toBuffer(),
        Buffer.from(anchor.utils.bytes.utf8.encode(orderCode.toString()))
      ],
      program.programId
    );
    //console.log("escrowPDA", escrowPDA);

    const options = {
      skipPreflight: true      
    }

  
    await program.methods
    .createEscrow(
      new anchor.BN(10**11),
      new anchor.BN(orderCode))
    .accounts({
      from: buyerPublicKey,
      to: toWallet.publicKey,
      systemProgram:  anchor.web3.SystemProgram.programId,
      escrow: escrowPDA
    }).rpc(options);

    const escrowAccount = await program.account.escrowAccountSolana.fetch(escrowPDA)
    //console.log(escrowAccount);
    
    let account_data2 = await provider.connection.getBalanceAndContext(buyerPublicKey);
    //console.log(account_data2);


    ///// claim amount 
    const tx = await program.methods
    .claimEscrow(
      new anchor.BN(orderCode))
    .accounts({
      influencer: toWallet.publicKey,
      business: buyerPublicKey,
      escrowAccount: escrowPDA, 
      systemProgram:  anchor.web3.SystemProgram.programId,
    }
    ).transaction();
  
    tx.feePayer = toWallet.publicKey;
    await utils.airdrop(program, toWallet, 1);
    
    const txID = await provider.connection.sendTransaction(tx,[toWallet]);
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









  
});
