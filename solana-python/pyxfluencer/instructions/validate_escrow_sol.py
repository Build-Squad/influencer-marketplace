from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class ValidateEscrowSolArgs(typing.TypedDict):
    target_state: int
    percentage_fee: int


layout = borsh.CStruct("target_state" / borsh.U8, "percentage_fee" / borsh.U16)


class ValidateEscrowSolAccounts(typing.TypedDict):
    validation_authority: Pubkey
    influencer: Pubkey
    business: Pubkey
    escrow_account: Pubkey


def validate_escrow_sol(
    args: ValidateEscrowSolArgs,
    accounts: ValidateEscrowSolAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(
            pubkey=accounts["validation_authority"], is_signer=True, is_writable=True
        ),
        AccountMeta(pubkey=accounts["influencer"], is_signer=False, is_writable=True),
        AccountMeta(pubkey=accounts["business"], is_signer=False, is_writable=True),
        AccountMeta(
            pubkey=accounts["escrow_account"], is_signer=False, is_writable=True
        ),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"\x9c\x11s\xc5\x1d\xfe[\xef"
    encoded_args = layout.build(
        {
            "target_state": args["target_state"],
            "percentage_fee": args["percentage_fee"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
