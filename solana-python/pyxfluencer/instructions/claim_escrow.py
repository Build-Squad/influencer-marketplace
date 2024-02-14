from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class ClaimEscrowArgs(typing.TypedDict):
    order_code: int


layout = borsh.CStruct("order_code" / borsh.U64)


class ClaimEscrowAccounts(typing.TypedDict):
    influencer: Pubkey
    business: Pubkey
    escrow_account: Pubkey


def claim_escrow(
    args: ClaimEscrowArgs,
    accounts: ClaimEscrowAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(pubkey=accounts["influencer"], is_signer=True, is_writable=True),
        AccountMeta(pubkey=accounts["business"], is_signer=False, is_writable=True),
        AccountMeta(
            pubkey=accounts["escrow_account"], is_signer=False, is_writable=True
        ),
        AccountMeta(pubkey=SYS_PROGRAM_ID, is_signer=False, is_writable=False),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"\xc8P\xb6\x9f=K\t\xcd"
    encoded_args = layout.build(
        {
            "order_code": args["order_code"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
