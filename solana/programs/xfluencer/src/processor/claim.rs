use anchor_lang::{
    prelude::*, solana_program::entrypoint::ProgramResult    
};

use anchor_spl::token::{self, Transfer, CloseAccount};

use crate::Claim;

pub fn process(ctx: Context<Claim>, order_code: u64,) -> ProgramResult {
      
    // transfer spl tokens out the vault to influencer
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault_account.to_account_info().clone(),
                to: ctx.accounts.influencer_receive_token_account.to_account_info().clone(),
                authority: ctx.accounts.influencer.clone(),
            },
        ),
        ctx.accounts.escrow_account.amount,
    )?;

    token::close_account(CpiContext::new(
        ctx.accounts.token_program.to_account_info(), 
        CloseAccount {
            account: ctx.accounts.vault_account.to_account_info().clone(),
            destination: ctx.accounts.influencer.to_account_info().clone(),
            authority: ctx.accounts.influencer.to_account_info().clone(),
        },
    ))?;

    Ok(())

}
