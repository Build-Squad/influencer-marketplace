use anchor_lang::{
    prelude::*, solana_program::entrypoint::ProgramResult    
};
use spl_token::instruction::AuthorityType;

use anchor_spl::token::{self, SetAuthority,  Transfer};


use crate::CreateEscrow;


pub fn process(ctx: Context<CreateEscrow>, 
    _vault_account_bump: u8,
    amount: u64,
    order_code: u64) -> ProgramResult {

    ctx.accounts.escrow_account.business_key = *ctx.accounts.business.key;

    ctx.accounts.escrow_account.business_deposit_token_account 
        = *ctx.accounts.business_deposit_token_account.to_account_info().key;

    ctx.accounts.escrow_account.influencer_key = *ctx.accounts.influencer.key;

    ctx.accounts.escrow_account.influencer_receive_token_account 
        = *ctx.accounts.influencer_receive_token_account.to_account_info().key;

    ctx.accounts.escrow_account.validation_authority 
        = *ctx.accounts.validation_authority.key;

    ctx.accounts.escrow_account.amount = amount;
    ctx.accounts.escrow_account.order_code = order_code;
    ctx.accounts.escrow_account.status = 0;
    

    token::set_authority(
        CpiContext::new(
            ctx.accounts.token_program.clone(), 
            SetAuthority {
                account_or_mint: ctx.accounts.vault_account.to_account_info().clone(),
                current_authority: ctx.accounts.business.clone(),
            }
        ),      
        AuthorityType::AccountOwner,
        Some(ctx.accounts.escrow_account.validation_authority),
    )?;

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.business_deposit_token_account.to_account_info().clone(),
                to: ctx.accounts.vault_account.to_account_info().clone(),
                authority: ctx.accounts.business.clone(),
            },
        ),
        ctx.accounts.escrow_account.amount,
    )?;


    Ok(())
}