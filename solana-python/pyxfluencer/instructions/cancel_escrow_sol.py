from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
from ..program_id import PROGRAM_ID


class CancelEscrowSolAccounts(typing.TypedDict):
    business: Pubkey
    escrow_account: Pubkey


def cancel_escrow_sol(
    accounts: CancelEscrowSolAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(pubkey=accounts["business"], is_signer=True, is_writable=True),
        AccountMeta(
            pubkey=accounts["escrow_account"], is_signer=False, is_writable=True
        ),
        AccountMeta(pubkey=SYS_PROGRAM_ID, is_signer=False, is_writable=False),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"|\xb8\xca\xa6\xff\xde\xca\xb1"
    encoded_args = b""
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
