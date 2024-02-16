use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Cannot claim")]
    CannotClaim,
    #[msg("Already claim")]
    AlreadyClaim,  
}