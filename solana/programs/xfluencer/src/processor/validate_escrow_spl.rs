use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};

use spl_token::instruction::AuthorityType;
use anchor_spl::token::{self, SetAuthority,  Transfer};

use ::u128::mul_div_u64;

use crate::CustomError;
use crate::ValidateEscrowSpl;

use strum::FromRepr;

#[derive(FromRepr, Debug, PartialEq)]
#[repr(u8)]
enum EscrowState {
    New = 0, 
    Canceled, 
    Delivered
}

pub fn process(
    ctx: Context<ValidateEscrowSpl>,
    target_state: u8,
    percentage_fee: u16,
) -> ProgramResult {

    let current_state = ctx.accounts.escrow_account.status;

    msg!(
        "Validating Escrow for SPL token From Current ({}) to Target ({}) state",
        current_state,
        target_state
    );

    // @TODO: Use enumerator instead u8
    // Valid State Transitions
    // 0 -> 1  From New to Cancel
    // 0 -> 2  From New to Delivered

    let cancel_state: u8 = 1;
    let delivered_state: u8 = 2;

    if current_state == cancel_state {
        return err!(CustomError::EscrowAlreadyCancel)?;
    }

    if current_state == delivered_state {
        return err!(CustomError::EscrowAlreadyReleased)?;
    }

    if target_state != cancel_state && target_state != delivered_state {
        return err!(CustomError::BadTargetStateForEscrow)?;
    }

    ctx.accounts.escrow_account.status = target_state;

    // in case of state is delivered, transfer funds to the validation_authority
    if target_state == delivered_state {
        msg!(
            "Percentage Fee to apply By Xfluencer Platform: {} (2 decimal places)",
            &percentage_fee.to_string()
        );

        if percentage_fee > 500 {
            // 5 % excess error
            return err!(CustomError::PercentageFeeOutOfrange)?;
        }

        /*let escrow_amount: u64 = ctx.accounts.escrow_account.;

        let fees_amount: u64 = match mul_div_u64(escrow_amount, percentage_fee as u64, 10000 as u64)
        {
            Some(fees_amount) => {
                if escrow_amount < fees_amount {
                    return err!(CustomError::NumericalProblemFoundCalculatingFees)?;
                } else {
                    fees_amount
                }
            }
            None => return err!(CustomError::NumericalProblemFoundCalculatingFees)?,
        };

        let from_account = ctx.accounts.escrow_account.to_account_info();
        let to_account = ctx.accounts.validation_authority.to_account_info();

        let amount = ctx.accounts.escrow_account.

        msg!(
            "Trander fees ({} lamports) from escrow to validation authority",
            &fees_amount.to_string()
        );
        **from_account.try_borrow_mut_lamports()? -= fees_amount;
        **to_account.try_borrow_mut_lamports()? += fees_amount;

        msg!(
            "Lamports Remaining in Escrow {}",
            from_account.get_lamports().to_string()
        );
        msg!(
            "Lamports Tranferred to Validation Authority {}",
            to_account.get_lamports().to_string()
        );*/

        token::set_authority(
            CpiContext::new(
                ctx.accounts.token_program.clone(), 
                SetAuthority {
                    account_or_mint: ctx.accounts.vault_account.to_account_info().clone(),
                    current_authority: ctx.accounts.validation_authority.clone(),
                }
            ),      
            AuthorityType::AccountOwner,
            Some(ctx.accounts.escrow_account.influencer_key),
        )?;
    }
    else {
        token::set_authority(
            CpiContext::new(
                ctx.accounts.token_program.clone(), 
                SetAuthority {
                    account_or_mint: ctx.accounts.vault_account.to_account_info().clone(),
                    current_authority: ctx.accounts.validation_authority.clone(),
                }
            ),      
            AuthorityType::AccountOwner,
            Some(ctx.accounts.escrow_account.business_key),
        )?;
    }

    Ok(())
}
