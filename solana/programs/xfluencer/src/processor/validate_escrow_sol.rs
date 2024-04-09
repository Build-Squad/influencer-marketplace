use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};

use ::u128::mul_div_u64;

use crate::CustomError;
use crate::ValidateEscrowSolana;

use strum::FromRepr;

#[derive(FromRepr, Debug, PartialEq)]
#[repr(u8)]
enum EscrowState {
    New = 0, Canceled, Delivered
}

pub fn process(
    ctx: Context<ValidateEscrowSolana>,
    target_state: u8,
    percentage_fee: u16,
) -> ProgramResult {
    let current_state = ctx.accounts.escrow_account.status;
    msg!(
        "Validating Escrow From Current ({}) to Target ({}) state",
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

    if target_state == 1 {
        msg!(
            "Escrow has changed its state to cancel (1)"
        );

    }

    // in case of state is delivered, transfer funds to the validation_authority
    if target_state == 2 {
        msg!(
            "Percentage Fee to apply By Xfluencer Platform: {} (2 decimal places)",
            &percentage_fee.to_string()
        );

        if percentage_fee > 500 {
            // 5 % 
            return err!(CustomError::PercentageFeeOutOfrange)?;
        }

        let escrow_amount: u64 = ctx.accounts.escrow_account.get_lamports();

        /* 

        Assuming the amount passed to the escrow already includes the fees:

        We need to break down this total amount into two parts: the payment amount for service X, 
        
        and the fee (denoted as 'r') set by the platform for service X. 
        
        Therefore, the input amount sent to the escrow (denoted as Y) will be composed as follows:

        Y = X + r * X,

        where:
        - 'r' represents the fee (0 <= r <= 0.05) set by the platform.
        - 'X' is the amount to be given to the influencer.

        Given the total escrow amount (Y) and the fee 'r', how do we determine the fee (denoted as 'F') 
        
        applied to the payment for service X that the contract should send to the authority?

        Let's factor out the common term 'X':

        Y = X + r * X,

        which simplifies to:

        Y = X * (1 + r).

        This implies that the service amount 'X' can be calculated as:

        X = Y / (1 + r).

        Hence, the fee applied to the payment is:

        F = X * r = Y * r / (1 + r).

        The amount 'F' represents what the contract will remit to the authority 
        
        for each successfully validated escrow release.

        It's important to note that in Rust, we will utilize lossless calculations using 'u64' types. 
        
        For this purpose, we'll employ a custom math function, 'mul_div_u64', 
        
        which performs multiplication first and then division using 'u64' types.

        The fee 'r' computed by this instruction should be an integer between 0 and 500,        
        
        corresponding to 0% and 5%, respectively, and not a floating point type.

        Notice that the amount 10000 for 'r' will correspond to 100%.

        */


        let fees_amount: u64 = match mul_div_u64(escrow_amount, percentage_fee as u64, (10000 + percentage_fee) as u64)
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

        msg!(
            "Amount transferred ({} lamports) from escrow to the fees authority due to fees",
            &fees_amount.to_string()
        );

        **from_account.try_borrow_mut_lamports()? -= fees_amount;
        **to_account.try_borrow_mut_lamports()? += fees_amount;

        msg!(
            "Remaining lamports in Escrow {} for the influencer",
            from_account.get_lamports().to_string()
        );

        msg!(
            "Escrow has changed its state to delivered (2)"
        )

    }

    Ok(())
}
