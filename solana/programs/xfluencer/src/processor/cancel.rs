
use anchor_lang::{
    prelude::*, solana_program::entrypoint::ProgramResult    
};
use spl_token::instruction::AuthorityType;

use anchor_spl::token;

use crate::Cancel;


pub fn process(ctx: Context<Cancel>, order_code: u64,) -> ProgramResult {
    
    // Make Seed
    let escrow_seed: String = format!("{}{}", "escrow".to_string(), order_code.to_string());
    let escrow_pda_seed: &[u8] = escrow_seed.as_bytes();
    let (_vault_authority, vault_authority_bump) = Pubkey::find_program_address(&[escrow_pda_seed], ctx.program_id);
    let authority_seeds = &[&escrow_pda_seed[..], &[vault_authority_bump]];

    // Transfer token to business.
    token::transfer(
        ctx.accounts.into_transfer_to_business_context().with_signer(&[&authority_seeds[..]]),
        ctx.accounts.escrow_account.amount,
    )?;

    // Close vault account
    token::close_account(
        ctx.accounts.into_close_contest().with_signer(&[&authority_seeds[..]]),
    )?;

    Ok(())
}

