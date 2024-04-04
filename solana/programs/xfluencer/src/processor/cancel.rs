use anchor_lang::{
    prelude::*, solana_program::entrypoint::ProgramResult    
};

use anchor_spl::token::{self, Transfer, CloseAccount};

use crate::Cancel;

pub fn process(ctx: Context<Cancel>, order_code: u64,) -> ProgramResult {
 
    // transfer spl tokens out the vault back to business
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault_account.to_account_info().clone(),
                to: ctx.accounts.business_deposit_token_account.to_account_info().clone(),
                authority: ctx.accounts.business.clone(),
            },
        ),
        ctx.accounts.escrow_account.amount,
    )?;

    token::close_account(CpiContext::new(
        ctx.accounts.token_program.to_account_info(), 
        CloseAccount {
            account: ctx.accounts.vault_account.to_account_info().clone(),
            destination: ctx.accounts.business.to_account_info().clone(),
            authority: ctx.accounts.business.to_account_info().clone(),
        },
    ))?;

    Ok(())
}

