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
}


def from_code(code: int) -> typing.Optional[CustomError]:
    maybe_err = CUSTOM_ERROR_MAP.get(code)
    if maybe_err is None:
        return None
    return maybe_err
