#![allow(unused_imports)]

use std::mem::size_of;

use anchor_lang::{prelude::*, solana_program};
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::system_instruction;

use anchor_spl::token::{self, CloseAccount, Mint, SetAuthority, TokenAccount, Transfer};
use spl_token::instruction::AuthorityType;

use ::u128::mul_div_u64;

mod errors;
mod processor;

use crate::errors::CustomError;

declare_id!("7zNs7f6rJyhvu9k4DZwqeqgBa27GqX12mVeQAS528xEq");



#[program]
pub mod xfluencer {
    
    use super::*;

    //// ATA
    pub fn initialize(
        ctx: Context<CreateEscrow>,
        _vault_account_bump: u8,
        amount: u64,
        order_code: u64
    ) -> ProgramResult {
        processor::initialize_escrow::process(ctx,_vault_account_bump, amount, order_code)
    }

    pub fn cancel(ctx: Context<Cancel>, order_code: u64) -> ProgramResult {
               processor::cancel::process(ctx, order_code)
    }

    /////////////////////////////
    //// SOL
    pub fn create_escrow(ctx: Context<CreateEscrowSolana>, amount: u64, order_code: u64) -> ProgramResult {
        processor::create_escrow_solana::process(ctx, amount, order_code)
    }

    pub fn claim_escrow(ctx: Context<ClaimEscrowSolana>, order_code: u64) -> ProgramResult {
        processor::claim_escrow::process(ctx, order_code)
    }
  
    pub fn cancel_escrow_sol(ctx: Context<CancelEscrowSolana>) -> ProgramResult {

        let amount = ctx.accounts.escrow_account.get_lamports();

        let from_account = ctx.accounts.escrow_account.to_account_info();
        let to_account = ctx.accounts.business.to_account_info();

        **from_account.try_borrow_mut_lamports()? -= amount;
        **to_account.try_borrow_mut_lamports()? += amount; 

        Ok(())
    }

 

    pub fn validate_escrow_sol(ctx: Context<ValidateEscrowSolana>, 
                               target_state: u8, 
                               percentage_fee: u16) -> Result<()> {

        let current_state = ctx.accounts.escrow_account.status;
        msg!("Validating Escrow From Current ({}) to Target ({}) state",current_state, target_state);

        // Valid State Transitions
        // 0 -> 1  From New to Cancel
        // 0 -> 2  From New to Delivered

        let cancel_state: u8 = 1;
        let delivered_state: u8 = 2;

        if current_state == cancel_state {
            return err!(CustomError::EscrowAlreadyCancel);
        }

        if current_state == delivered_state {
            return err!(CustomError::EscrowAlreadyReleased);
        }

        if target_state != cancel_state && target_state != delivered_state {
            return err!(CustomError::BadTargetStateForEscrow);
        }

        ctx.accounts.escrow_account.status = target_state;

        // in case of state is delivered, transfer funds to the validation_authority
        if target_state == 2 {
            msg!("Percentage Fee to apply By Xfluencer Platform: {} (2 decimal places)", &percentage_fee.to_string());

            if percentage_fee > 1000 {  // 10 %
                return err!(CustomError::PercentageFeeOutOfrange);
            }

            let escrow_amount: u64 = ctx.accounts.escrow_account.get_lamports();
            
            let fees_amount: u64 = match mul_div_u64(escrow_amount, percentage_fee as u64, 10000 as u64) {
                Some(fees_amount) => {
                    if escrow_amount < fees_amount {
                       return err!(CustomError::NumericalProblemFoundCalculatingFees)
                    }
                    else {
                        fees_amount
                    }
                },
                None => {
                    return err!(CustomError::NumericalProblemFoundCalculatingFees)
                }
            };

            let from_account = ctx.accounts.escrow_account.to_account_info();
            let to_account = ctx.accounts.validation_authority.to_account_info();

            msg!("Trander fees ({} lamports) from escrow to validation authority",&fees_amount.to_string());
            **from_account.try_borrow_mut_lamports()? -= fees_amount;
            **to_account.try_borrow_mut_lamports()? += fees_amount; 
            
            msg!("Lamports Remaining in Escrow {}",from_account.get_lamports().to_string());
            msg!("Lamports Tranferred to Validation Authority {}",to_account.get_lamports().to_string());

        }

        Ok(())

    }


}






#[account]
pub struct EscrowAccount {
    // First 8 Bytes are Discriminator (u64)
    pub business_key: Pubkey, // (32)
    pub business_deposit_token_account: Pubkey, // (32)
    pub influencer_key: Pubkey, // (32)
    pub influencer_receive_token_account: Pubkey, // (32)
    pub judge_key: Pubkey, // (32)
    pub amount: u64, // (8)
    pub order_code: u64, // (8)
    /** status
        0: New
        1: Shipping
        2: Delivered
    */
    pub status: u8, // (1)
    pub delivery_time: i64, // (8)
    pub trial_day: u16, // (2)
}

impl EscrowAccount {
    const INIT_SPACE: usize = 8 + (32 * 5) + (8 * 2) + 1 + 8 + 2;
}


#[account]
pub struct EscrowAccountSolana {
    pub validation_authority: Pubkey, // (32)
    pub from: Pubkey, // (32)
    pub to: Pubkey, // (32)
    pub amount: u64, // (32)
    pub order_code: u64, // (8)
    /** status
        0: New
        1: Cancel
        2: Delivered
    */
    pub status: u8, // (1)
}



#[derive(Accounts)]
#[instruction(vault_account_bump: u8, amount: u64, order_code: u64)]
pub struct CreateEscrow<'info> {
    #[account(mut)]
    /// CHECK: safe
    pub initializer: Signer<'info>,
    /// CHECK: safe
    pub business: AccountInfo<'info>,  // change name to business
    /// CHECK: safe
    pub influencer: AccountInfo<'info>, // change name to influencer
    /// CHECK: safe 
    pub judge: AccountInfo<'info>,  // change name to xfluencer
    pub mint: Account<'info, Mint>,
    
    #[account(
         mut,
         constraint = business_deposit_token_account.amount >= amount @CustomError::BusinessHasInsufficientAmountOfTokens
    )]
    pub business_deposit_token_account: Account<'info, TokenAccount>,
    pub influencer_receive_token_account: Account<'info, TokenAccount>,

    #[account(
        init,         
        space = EscrowAccount::INIT_SPACE, 
        payer = initializer,
        seeds = [b"escrow".as_ref(), 
                 order_code.to_string().as_bytes().as_ref()],   
        bump,     
    )]      
    pub escrow_account: Account<'info, EscrowAccount>,

    #[account(
        init,
        seeds = ["vault".as_bytes(), 
                order_code.to_string().as_bytes().as_ref() ],
        payer = initializer,
	    bump,
        token::mint = mint,
        token::authority = initializer,
        constraint = amount > 0,
    )]
    pub vault_account: Account<'info, TokenAccount>,

    /// CHECK: safe
    pub system_program: AccountInfo<'info>,
    /// CHECK: safe
    pub token_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}


#[derive(Accounts)]
#[instruction(order_code: u64)]
pub struct Cancel<'info> {
    /// CHECK: safe
    #[account(mut, signer)]
    pub business: AccountInfo<'info>,
    #[account(mut)]
    pub business_deposit_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_account: Account<'info, TokenAccount>,
    /// CHECK: safe
    pub vault_authority: AccountInfo<'info>,
    #[account(
        mut,
        constraint = escrow_account.business_key == *business.key,
        constraint = escrow_account.business_deposit_token_account == *business_deposit_token_account.to_account_info().key,
        constraint = escrow_account.order_code == order_code,
        constraint = escrow_account.status == 0,
        close = business
    )]
    pub escrow_account: Account<'info, EscrowAccount>,
    /// CHECK: safe
    pub token_program: AccountInfo<'info>,
}



/// CreateEscrow context
#[derive(Accounts)]
#[instruction(amount: u64, order_code: u64)]
pub struct CreateEscrowSolana<'info> {
    /// CHECK: safe
    #[account(mut)]
    pub validation_authority: AccountInfo<'info>,
    // Escrow Account PDA
    #[account(
        init,
        // State account seed uses the string "state" and the users' key. 
        // Note that we can only have 1 active transaction
        seeds = [b"escrow".as_ref(), 
                 from.key().as_ref(), 
                 to.key().as_ref(),
                 order_code.to_string().as_bytes().as_ref()],
        bump,
        payer = from,
        space = size_of::<EscrowAccountSolana>() + 16
    )]
    pub escrow: Account<'info, EscrowAccountSolana>,

    #[account(mut)]
    pub from: Signer<'info>,
    /// CHECK: safe
    #[account(mut)]
    pub to: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(order_code: u64)]
pub struct ClaimEscrowSolana<'info> {
    /// CHECK: safe
    #[account(mut)]
    pub influencer: Signer<'info>,
    /// CHECK: safe
    #[account(mut)]
    pub business: AccountInfo<'info>,
    #[account(
        mut,
        constraint = escrow_account.from == *business.key @CustomError::MissmatchBusiness,
        constraint = escrow_account.to == *influencer.key @CustomError::MissmatchInfluencer,
        constraint = escrow_account.status == 2 @CustomError::BadEscrowState 
        //close = influencer
    )]
    pub escrow_account: Box<Account<'info, EscrowAccountSolana>>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction()]
pub struct CancelEscrowSolana<'info> {
    /// CHECK: safe
    #[account(mut)]
    pub business: Signer<'info>,
    #[account(
        mut,
        constraint = escrow_account.from == *business.key @CustomError::MissmatchBusiness,
        constraint = escrow_account.status == 1 @CustomError::BadEscrowState,
    )]
    pub escrow_account: Box<Account<'info, EscrowAccountSolana>>,
    pub system_program: Program<'info, System>,
}



#[derive(Accounts)]
#[instruction(state: u8, percentage_fee: u16)]
pub struct ValidateEscrowSolana<'info> {
    #[account(mut)]
    pub validation_authority: Signer<'info>,
    /// CHECK: safe
    #[account(mut)]
    pub influencer: AccountInfo<'info>,
    /// CHECK:
    #[account(mut)]
    pub business: AccountInfo<'info>,
    #[account(
        mut,
        constraint = escrow_account.from == *business.key @CustomError::MissmatchBusiness,
        constraint = escrow_account.to == *influencer.key @CustomError::MissmatchInfluencer,
        constraint = escrow_account.validation_authority == *validation_authority.key @CustomError::MissmatchAuthority
        //close = influencer
    )]
    pub escrow_account: Box<Account<'info, EscrowAccountSolana>>,
}

#[event]
pub struct EscrowAccountSolanaCreated {
    pub business: Pubkey,
    pub influencer: Pubkey,
    pub order_code: String
}




impl<'info> CreateEscrow<'info> {
    fn into_transfer_to_pda_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.business_deposit_token_account.to_account_info().clone(),
            to: self.vault_account.to_account_info().clone(),
            authority: self.business.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }

    fn into_set_authority_context(&self) -> CpiContext<'_, '_, '_, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: self.vault_account.to_account_info().clone(),
            current_authority: self.business.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }
}



impl<'info> Cancel<'info> {
    fn into_transfer_to_business_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.vault_account.to_account_info().clone(),
            to: self.business_deposit_token_account.to_account_info().clone(),
            authority: self.vault_authority.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }

    fn into_close_contest(&self) -> CpiContext<'_, '_, '_, 'info, CloseAccount<'info>> {
        let cpi_accounts = CloseAccount {
            account: self.vault_account.to_account_info().clone(),
            destination: self.business.clone(),
            authority: self.vault_authority.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }
}