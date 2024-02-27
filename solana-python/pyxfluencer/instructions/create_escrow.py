from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class CreateEscrowArgs(typing.TypedDict):
    amount: int
    order_code: int


layout = borsh.CStruct("amount" / borsh.U64, "order_code" / borsh.U64)


class CreateEscrowAccounts(typing.TypedDict):
    escrow: Pubkey
    from_: Pubkey
    to: Pubkey


def create_escrow(
    args: CreateEscrowArgs,
    accounts: CreateEscrowAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(pubkey=accounts["escrow"], is_signer=False, is_writable=True),
        AccountMeta(pubkey=accounts["from_"], is_signer=True, is_writable=True),
        AccountMeta(pubkey=accounts["to"], is_signer=False, is_writable=True),
        AccountMeta(pubkey=SYS_PROGRAM_ID, is_signer=False, is_writable=False),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"\xfd\xd7\xa5t$lDP"
    encoded_args = layout.build(
        {
            "amount": args["amount"],
            "order_code": args["order_code"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
