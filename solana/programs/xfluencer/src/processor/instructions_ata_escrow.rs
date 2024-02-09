// TODO: Bring here all instructions of the escrow using ATA

use anchor_lang::{
    prelude::*, solana_program::entrypoint::ProgramResult    
};
use spl_token::instruction::AuthorityType;

use anchor_spl::token;

use crate::CreateEscrow;


pub fn process(ctx: Context<CreateEscrow>, _vault_account_bump: u8,
    amount: u64,
    order_code: u64) -> ProgramResult {
   

    let clock: Clock = Clock::get().unwrap();
    
    ctx.accounts.escrow_account.buyer_key = *ctx.accounts.buyer.key;
    ctx.accounts.escrow_account.buyer_deposit_token_account = *ctx.accounts.buyer_deposit_token_account.to_account_info().key;
    ctx.accounts.escrow_account.seller_key = *ctx.accounts.seller.key;
    ctx.accounts.escrow_account.seller_receive_token_account = *ctx.accounts.seller_receive_token_account.to_account_info().key;
    ctx.accounts.escrow_account.judge_key = *ctx.accounts.judge.key;
    ctx.accounts.escrow_account.amount = amount;
    ctx.accounts.escrow_account.order_code = order_code;
    ctx.accounts.escrow_account.status = 0;
    ctx.accounts.escrow_account.delivery_time = clock.unix_timestamp;
     
    let escrow_seed: String = format!("{}{}", "escrow".to_string(), order_code.to_string());
    let escrow_pda_seed: &[u8] = escrow_seed.as_bytes();

    // Set the Vault Authority to the Escrow PDA
    let (vault_authority, _vault_authority_bump) 
        = Pubkey::find_program_address(&[escrow_pda_seed], ctx.program_id);

    // Set the Authority of the Vault to the Escrow PDA 
    token::set_authority(
         ctx.accounts.into_set_authority_context(),
         AuthorityType::AccountOwner,
         Some(vault_authority),
    )?;

    // Transfer Tokens to the Vault
    token::transfer(
         ctx.accounts.into_transfer_to_pda_context(),
         ctx.accounts.escrow_account.amount,
    )?;

    Ok(())
}