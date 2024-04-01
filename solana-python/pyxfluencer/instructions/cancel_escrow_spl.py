from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.sysvar import RENT
from spl.token.constants import TOKEN_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class CancelEscrowSplArgs(typing.TypedDict):
    order_code: int


layout = borsh.CStruct("order_code" / borsh.U64)


class CancelEscrowSplAccounts(typing.TypedDict):
    business: Pubkey
    business_deposit_token_account: Pubkey
    vault_account: Pubkey
    vault_authority: Pubkey
    escrow_account: Pubkey


def cancel_escrow_spl(
    args: CancelEscrowSplArgs,
    accounts: CancelEscrowSplAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(pubkey=accounts["business"], is_signer=True, is_writable=True),
        AccountMeta(
            pubkey=accounts["business_deposit_token_account"],
            is_signer=False,
            is_writable=True,
        ),
        AccountMeta(
            pubkey=accounts["vault_account"], is_signer=False, is_writable=True
        ),
        AccountMeta(
            pubkey=accounts["vault_authority"], is_signer=False, is_writable=False
        ),
        AccountMeta(
            pubkey=accounts["escrow_account"], is_signer=False, is_writable=True
        ),
        AccountMeta(pubkey=TOKEN_PROGRAM_ID, is_signer=False, is_writable=False),
        AccountMeta(pubkey=RENT, is_signer=False, is_writable=False),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"\xf5]\xd9\xf20q\xad\x91"
    encoded_args = layout.build(
        {
            "order_code": args["order_code"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
