use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};

use crate::CustomError;
use crate::ValidateEscrowSolana;

pub fn process(
    ctx: Context<ValidateEscrowSolana>,
    target_state: u8,
    percentage_fee: u16,
) -> Result<()> {
    let current_state = ctx.accounts.escrow_account.status;
    msg!(
        "Validating Escrow From Current ({}) to Target ({}) state",
        current_state,
        target_state
    );

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
        msg!(
            "Percentage Fee to apply By Xfluencer Platform: {} (2 decimal places)",
            &percentage_fee.to_string()
        );

        if percentage_fee > 1000 {
            // 10 %
            return err!(CustomError::PercentageFeeOutOfrange);
        }

        let escrow_amount: u64 = ctx.accounts.escrow_account.get_lamports();

        let fees_amount: u64 = match mul_div_u64(escrow_amount, percentage_fee as u64, 10000 as u64)
        {
            Some(fees_amount) => {
                if escrow_amount < fees_amount {
                    return err!(CustomError::NumericalProblemFoundCalculatingFees);
                } else {
                    fees_amount
                }
            }
            None => return err!(CustomError::NumericalProblemFoundCalculatingFees),
        };

        let from_account = ctx.accounts.escrow_account.to_account_info();
        let to_account = ctx.accounts.validation_authority.to_account_info();

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
        );
    }

    Ok(())
}
