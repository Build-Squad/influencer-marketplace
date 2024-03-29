from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from spl.token.constants import TOKEN_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class ValidateEscrowSplArgs(typing.TypedDict):
    target_state: int
    percentage_fee: int


layout = borsh.CStruct("target_state" / borsh.U8, "percentage_fee" / borsh.U16)


class ValidateEscrowSplAccounts(typing.TypedDict):
    validation_authority: Pubkey
    vault_account: Pubkey
    influencer: Pubkey
    business: Pubkey
    escrow_account: Pubkey


def validate_escrow_spl(
    args: ValidateEscrowSplArgs,
    accounts: ValidateEscrowSplAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(
            pubkey=accounts["validation_authority"], is_signer=True, is_writable=True
        ),
        AccountMeta(
            pubkey=accounts["vault_account"], is_signer=False, is_writable=True
        ),
        AccountMeta(pubkey=accounts["influencer"], is_signer=False, is_writable=True),
        AccountMeta(pubkey=accounts["business"], is_signer=False, is_writable=True),
        AccountMeta(
            pubkey=accounts["escrow_account"], is_signer=False, is_writable=True
        ),
        AccountMeta(pubkey=TOKEN_PROGRAM_ID, is_signer=False, is_writable=False),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"\xcf\xd6\xd4\x95G*\x9e\xb6"
    encoded_args = layout.build(
        {
            "target_state": args["target_state"],
            "percentage_fee": args["percentage_fee"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
