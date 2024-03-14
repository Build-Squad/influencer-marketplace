use anchor_lang::{
    prelude::*, solana_program::entrypoint::ProgramResult    
};
use spl_token::instruction::AuthorityType;

use anchor_spl::token;

use crate::{Cancel, ClaimEscrowSolana};


pub fn process(ctx: Context<ClaimEscrowSolana>, order_code: u64) -> ProgramResult {

    let business = ctx.accounts.business.key();
    let influencer = ctx.accounts.influencer.key();
    let escrow_pda = ctx.accounts.escrow_account.key();
    let amount = ctx.accounts.escrow_account.get_lamports();
    
    msg!("Business {}", business);
    msg!("Influencer {}", influencer);
    msg!("Order Code {}", order_code);
    msg!("Escrow PDA Address {}", escrow_pda);
    msg!("Lamports to Claim {}", amount);
  
    // move sol from escrow to influencer account
    let from_account = ctx.accounts.escrow_account.to_account_info();
    let to_account = ctx.accounts.influencer.to_account_info();
    
    **from_account.try_borrow_mut_lamports()? -= amount; // if lamports reach zero => account is closed
    **to_account.try_borrow_mut_lamports()? += amount; 

    // log amount of lamports transferred
    let amount = ctx.accounts.escrow_account.get_lamports();
    let amount_influencer = ctx.accounts.influencer.get_lamports();
    msg!("Post Transaction Lamports Escrow {} and Influencer {}",amount,amount_influencer);

    Ok(())
}
