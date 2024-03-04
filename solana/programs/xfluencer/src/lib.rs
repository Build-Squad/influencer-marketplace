#![allow(unused_imports)]

use std::mem::size_of;

use anchor_lang::{prelude::*, solana_program};
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::system_instruction;

use anchor_spl::token::{self, CloseAccount, Mint, SetAuthority, TokenAccount, Transfer};
use spl_token::instruction::AuthorityType;

mod errors;
mod processor;

use crate::errors::CustomError;

declare_id!("7zNs7f6rJyhvu9k4DZwqeqgBa27GqX12mVeQAS528xEq");

//fn log_errors(e: DomainOrProgramError) -> ProgramError {
//    msg!("Error: {}", e);
//    e.into()
//}

#[program]
pub mod xfluencer {
    
    use super::*;

    pub fn initialize(
        ctx: Context<CreateEscrow>,
        _vault_account_bump: u8,
        amount: u64,
        order_code: u64
    ) -> ProgramResult {
        processor::instructions_ata_escrow::process(ctx,_vault_account_bump, amount, order_code)
        //processor::instructions_ata_escrow::process(ctx,_vault_account_bump, amount, order_code).map_err(log_errors);
    }

    pub fn cancel(ctx: Context<Cancel>, order_code: u64,) -> ProgramResult {
        // Make Seed
        let escrow_seed: String = format!("{}{}", "escrow".to_string(), order_code.to_string());
        let escrow_pda_seed: &[u8] = escrow_seed.as_bytes();
        let (_vault_authority, vault_authority_bump) = Pubkey::find_program_address(&[escrow_pda_seed], ctx.program_id);
        let authority_seeds = &[&escrow_pda_seed[..], &[vault_authority_bump]];

        // Transfer token to buyer.
        token::transfer(
            ctx.accounts.into_transfer_to_buyer_context().with_signer(&[&authority_seeds[..]]),
            ctx.accounts.escrow_account.amount,
        )?;

        // Close vault account
        token::close_account(
            ctx.accounts.into_close_contest().with_signer(&[&authority_seeds[..]]),
        )?;

        Ok(())
    }

  

    pub fn create_escrow(ctx: Context<CreateEscrowSolana>, amount: u64, order_code: u64) -> ProgramResult {

        let escrow = &mut ctx.accounts.escrow;

        escrow.from = ctx.accounts.from.key();
        escrow.to = ctx.accounts.to.key();
        escrow.validation_authority = ctx.accounts.validation_authority.key();
        escrow.order_code = order_code;
        escrow.amount = amount;
        escrow.status = 0; 

        // **escrow = EscrowAccountSolana {
        //    from: ctx.accounts.from.key(),
        //    to: ctx.accounts.to.key(),
        //    order_code,
        //    amount,
        //    delivered: false
        //};

        let order_code_str = order_code.to_string(); 

        emit!(
            EscrowAccountSolanaCreated {
                business: ctx.accounts.from.key(),
                influencer: ctx.accounts.to.key(),
                order_code: order_code_str
        });


        let escrow_pubkey = escrow.key();

        msg!("Creating Escrow for SOL on business pubkey {} and influencer pubkey {}",escrow.from, escrow.to);
        msg!("Order code {} amount of lamportst to transfer to escrow {}",order_code, amount);
      
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

    pub fn claim_escrow(ctx: Context<ClaimEscrowSolana>, order_code: u64) -> ProgramResult {

        let business = ctx.accounts.business.key();
        let influencer = ctx.accounts.influencer.key();
        let escrow_pda = ctx.accounts.escrow_account.key();
        let amount = ctx.accounts.escrow_account.get_lamports();
     
        
        msg!("Business {}", business);
        msg!("Influencer {}", influencer);
        msg!("Order to claim {}", order_code);
        msg!("Escrow PDA address {}", escrow_pda);
        msg!("Lamports {}", amount);
      
        // move sol from escrow to influencer account
        let from_account = ctx.accounts.escrow_account.to_account_info();
        let to_account = ctx.accounts.influencer.to_account_info();
        
        **from_account.try_borrow_mut_lamports()? -= amount; // if lamports reach zero => account is closed
        **to_account.try_borrow_mut_lamports()? += amount; 

        // log amount of lamports transferred
        let amount = ctx.accounts.escrow_account.get_lamports();
        let amount_influencer = ctx.accounts.influencer.get_lamports();
        msg!("Post transaction lamports escrow {} and influencer {}",amount,amount_influencer);

        Ok(())
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

        msg!("start validation of escrow for target state: {}",target_state);

        let current_state = ctx.accounts.escrow_account.status;
        msg!("current escrow state : {}",current_state);

        // valid transitions
        // 0 -> 1  new to cancel
        // 0 -> 2  new to delivered

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

        // transfer funds to validator

        msg!(&percentage_fee.to_string());


        Ok(())

    }





}






#[account]
pub struct EscrowAccount {
    // First 8 Bytes are Discriminator (u64)
    pub buyer_key: Pubkey, // (32)
    pub buyer_deposit_token_account: Pubkey, // (32)
    pub seller_key: Pubkey, // (32)
    pub seller_receive_token_account: Pubkey, // (32)
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


// TODO: Replace buyer by business and seller by influencer


#[derive(Accounts)]
#[instruction(vault_account_bump: u8, amount: u64, order_code: u64)]
pub struct CreateEscrow<'info> {
    #[account(mut)]
    /// CHECK: safe
    pub initializer: Signer<'info>,
    /// CHECK: safe
    pub buyer: AccountInfo<'info>,  // change name to business
    /// CHECK: safe
    pub seller: AccountInfo<'info>, // change name to influencer
    /// CHECK: safe 
    pub judge: AccountInfo<'info>,  // change name to xfluencer
    pub mint: Account<'info, Mint>,
    
    #[account(
         mut,
         constraint = buyer_deposit_token_account.amount >= amount 
    )]
    pub buyer_deposit_token_account: Account<'info, TokenAccount>,
    pub seller_receive_token_account: Account<'info, TokenAccount>,

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
    pub buyer: AccountInfo<'info>,
    #[account(mut)]
    pub buyer_deposit_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_account: Account<'info, TokenAccount>,
    /// CHECK: safe
    pub vault_authority: AccountInfo<'info>,
    #[account(
        mut,
        constraint = escrow_account.buyer_key == *buyer.key,
        constraint = escrow_account.buyer_deposit_token_account == *buyer_deposit_token_account.to_account_info().key,
        constraint = escrow_account.order_code == order_code,
        constraint = escrow_account.status == 0,
        close = buyer
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
            from: self.buyer_deposit_token_account.to_account_info().clone(),
            to: self.vault_account.to_account_info().clone(),
            authority: self.buyer.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }

    fn into_set_authority_context(&self) -> CpiContext<'_, '_, '_, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: self.vault_account.to_account_info().clone(),
            current_authority: self.buyer.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }
}



impl<'info> Cancel<'info> {
    fn into_transfer_to_buyer_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.vault_account.to_account_info().clone(),
            to: self.buyer_deposit_token_account.to_account_info().clone(),
            authority: self.vault_authority.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }

    fn into_close_contest(&self) -> CpiContext<'_, '_, '_, 'info, CloseAccount<'info>> {
        let cpi_accounts = CloseAccount {
            account: self.vault_account.to_account_info().clone(),
            destination: self.buyer.clone(),
            authority: self.vault_authority.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }
}