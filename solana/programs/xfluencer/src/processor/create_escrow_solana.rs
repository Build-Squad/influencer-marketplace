use anchor_lang::{
    prelude::*, solana_program::entrypoint::ProgramResult    
};
use spl_token::{instruction::AuthorityType, solana_program::system_instruction};

use anchor_spl::token;

use crate::{CreateEscrowSolana, EscrowAccountSolanaCreated};


pub fn process(ctx: Context<CreateEscrowSolana>, amount: u64, order_code: u64) -> ProgramResult {

    let escrow = &mut ctx.accounts.escrow;

    escrow.from = ctx.accounts.from.key();
    escrow.to = ctx.accounts.to.key();
    escrow.validation_authority = ctx.accounts.validation_authority.key();
    escrow.order_code = order_code;
    escrow.amount = amount;
    escrow.status = 0; 


    let order_code_str = order_code.to_string(); 

    emit!(
        EscrowAccountSolanaCreated {
            business: ctx.accounts.from.key(),
            influencer: ctx.accounts.to.key(),
            order_code: order_code_str
    });


    let escrow_pubkey = escrow.key();

    msg!("Create Escrow on SOL on business {} and influencer {}", escrow.from, escrow.to);
    msg!("Order code {} amount of lamportst to transfer to escrow {}", order_code, amount);
  
    let transfer_instruction = system_instruction::transfer(
            &escrow.from, 
            &escrow_pubkey, 
            amount
    );

     anchor_lang::solana_program::program::invoke_signed(
       &transfer_instruction,
       &[
            ctx.accounts.from.to_account_info(),   // business
            ctx.accounts.escrow.to_account_info(), // escrow SOL
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;

    Ok(())
}