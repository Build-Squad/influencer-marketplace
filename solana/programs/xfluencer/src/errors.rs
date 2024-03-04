use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Cannot claim")]
    CannotClaim,
    #[msg("Already claim")]
    AlreadyClaim,  
    #[msg("Escrow already cancel for business")]
    EscrowAlreadyCancel,  
    #[msg("Escrow already released for influencer")]
    EscrowAlreadyReleased,      
    #[msg("Bad Target State for Escrow (1) for cancel, (2) for release")]
    BadTargetStateForEscrow,  
    #[msg("Missmatch business public key")]
    MissmatchBusiness,
    #[msg("Missmatch influencer publick key")]
    MissmatchInfluencer,
    #[msg("Bad Escrow State")]
    BadEscrowState,
    #[msg("Missmatch Authority")]
    MissmatchAuthority,
    #[msg("Percengate Fee Out of Range")]
    PercentageFeeOutOfrange,
    #[msg("Numerical Problem Found Calculating Fees")]
    NumericalProblemFoundCalculatingFees
}