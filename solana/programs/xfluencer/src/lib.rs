use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

use anchor_spl::token::{self, CloseAccount, Mint, SetAuthority, TokenAccount, Transfer};
use spl_token::instruction::AuthorityType;

declare_id!("7zNs7f6rJyhvu9k4DZwqeqgBa27GqX12mVeQAS528xEq");

#[program]
pub mod xfluencer {
    use super::*;

    pub fn initialize(
        ctx: Context<CreateEscrow>,
        _vault_account_bump: u8,
        amount: u64,
        order_code: u64
    ) -> ProgramResult {

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


#[derive(Accounts)]
#[instruction(vault_account_bump: u8, amount: u64, order_code: u64)]
pub struct CreateEscrow<'info> {
    #[account(mut)]
    /// CHECK: safe
    pub initializer: Signer<'info>,
    /// CHECK: safe
    pub buyer: AccountInfo<'info>,
    /// CHECK: safe
    pub seller: AccountInfo<'info>,
    /// CHECK: safe 
    pub judge: AccountInfo<'info>,
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
    pub escrow_account: Box<Account<'info, EscrowAccount>>,
    /// CHECK: safe
    pub token_program: AccountInfo<'info>,
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