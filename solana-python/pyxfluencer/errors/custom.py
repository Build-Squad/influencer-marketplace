import typing
from anchorpy.error import ProgramError


class CannotClaim(ProgramError):
    def __init__(self) -> None:
        super().__init__(6000, "Cannot claim")

    code = 6000
    name = "CannotClaim"
    msg = "Cannot claim"


class AlreadyClaim(ProgramError):
    def __init__(self) -> None:
        super().__init__(6001, "Already claim")

    code = 6001
    name = "AlreadyClaim"
    msg = "Already claim"


class EscrowAlreadyCancel(ProgramError):
    def __init__(self) -> None:
        super().__init__(6002, "Escrow already cancel for business")

    code = 6002
    name = "EscrowAlreadyCancel"
    msg = "Escrow already cancel for business"


class EscrowAlreadyReleased(ProgramError):
    def __init__(self) -> None:
        super().__init__(6003, "Escrow already released for influencer")

    code = 6003
    name = "EscrowAlreadyReleased"
    msg = "Escrow already released for influencer"


class BadTargetStateForEscrow(ProgramError):
    def __init__(self) -> None:
        super().__init__(
            6004, "Bad Target State for Escrow (1) for cancel, (2) for release"
        )

    code = 6004
    name = "BadTargetStateForEscrow"
    msg = "Bad Target State for Escrow (1) for cancel, (2) for release"


class MissmatchBusiness(ProgramError):
    def __init__(self) -> None:
        super().__init__(6005, "Missmatch business public key")

    code = 6005
    name = "MissmatchBusiness"
    msg = "Missmatch business public key"


class MissmatchInfluencer(ProgramError):
    def __init__(self) -> None:
        super().__init__(6006, "Missmatch influencer publick key")

    code = 6006
    name = "MissmatchInfluencer"
    msg = "Missmatch influencer publick key"


class BadEscrowState(ProgramError):
    def __init__(self) -> None:
        super().__init__(6007, "Bad Escrow State")

    code = 6007
    name = "BadEscrowState"
    msg = "Bad Escrow State"


class MissmatchAuthority(ProgramError):
    def __init__(self) -> None:
        super().__init__(6008, "Missmatch Authority")

    code = 6008
    name = "MissmatchAuthority"
    msg = "Missmatch Authority"


class PercentageFeeOutOfrange(ProgramError):
    def __init__(self) -> None:
        super().__init__(6009, "Percengate Fee Out of Range")

    code = 6009
    name = "PercentageFeeOutOfrange"
    msg = "Percengate Fee Out of Range"


class NumericalProblemFoundCalculatingFees(ProgramError):
    def __init__(self) -> None:
        super().__init__(6010, "Numerical Problem Found Calculating Fees")

    code = 6010
    name = "NumericalProblemFoundCalculatingFees"
    msg = "Numerical Problem Found Calculating Fees"


class BusinessHasInsufficientAmountOfTokens(ProgramError):
    def __init__(self) -> None:
        super().__init__(6011, "Busines Has Insufficient Amount Of Tokens")

    code = 6011
    name = "BusinessHasInsufficientAmountOfTokens"
    msg = "Busines Has Insufficient Amount Of Tokens"


class MissmatchBusinessTokenAccount(ProgramError):
    def __init__(self) -> None:
        super().__init__(6012, "Missmatch Business Token Account")

    code = 6012
    name = "MissmatchBusinessTokenAccount"
    msg = "Missmatch Business Token Account"


class MissmatchInfluencerTokenAccount(ProgramError):
    def __init__(self) -> None:
        super().__init__(6013, "Missmatch Influencer Token Account")

    code = 6013
    name = "MissmatchInfluencerTokenAccount"
    msg = "Missmatch Influencer Token Account"


class MissmatchOrderCode(ProgramError):
    def __init__(self) -> None:
        super().__init__(6014, "Missmatch Order Code")

    code = 6014
    name = "MissmatchOrderCode"
    msg = "Missmatch Order Code"


CustomError = typing.Union[
    CannotClaim,
    AlreadyClaim,
    EscrowAlreadyCancel,
    EscrowAlreadyReleased,
    BadTargetStateForEscrow,
    MissmatchBusiness,
    MissmatchInfluencer,
    BadEscrowState,
    MissmatchAuthority,
    PercentageFeeOutOfrange,
    NumericalProblemFoundCalculatingFees,
    BusinessHasInsufficientAmountOfTokens,
    MissmatchBusinessTokenAccount,
    MissmatchInfluencerTokenAccount,
    MissmatchOrderCode,
]
CUSTOM_ERROR_MAP: dict[int, CustomError] = {
    6000: CannotClaim(),
    6001: AlreadyClaim(),
    6002: EscrowAlreadyCancel(),
    6003: EscrowAlreadyReleased(),
    6004: BadTargetStateForEscrow(),
    6005: MissmatchBusiness(),
    6006: MissmatchInfluencer(),
    6007: BadEscrowState(),
    6008: MissmatchAuthority(),
    6009: PercentageFeeOutOfrange(),
    6010: NumericalProblemFoundCalculatingFees(),
    6011: BusinessHasInsufficientAmountOfTokens(),
    6012: MissmatchBusinessTokenAccount(),
    6013: MissmatchInfluencerTokenAccount(),
    6014: MissmatchOrderCode(),
}


def from_code(code: int) -> typing.Optional[CustomError]:
    maybe_err = CUSTOM_ERROR_MAP.get(code)
    if maybe_err is None:
        return None
    return maybe_err
