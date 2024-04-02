from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.sysvar import RENT
from spl.token.constants import TOKEN_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class ClaimEscrowSplArgs(typing.TypedDict):
    order_code: int


layout = borsh.CStruct("order_code" / borsh.U64)


class ClaimEscrowSplAccounts(typing.TypedDict):
    business: Pubkey
    business_deposit_token_account: Pubkey
    influencer: Pubkey
    influencer_receive_token_account: Pubkey
    vault_account: Pubkey
    vault_authority: Pubkey
    escrow_account: Pubkey


def claim_escrow_spl(
    args: ClaimEscrowSplArgs,
    accounts: ClaimEscrowSplAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(pubkey=accounts["business"], is_signer=False, is_writable=True),
        AccountMeta(
            pubkey=accounts["business_deposit_token_account"],
            is_signer=False,
            is_writable=True,
        ),
        AccountMeta(pubkey=accounts["influencer"], is_signer=True, is_writable=True),
        AccountMeta(
            pubkey=accounts["influencer_receive_token_account"],
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
    identifier = b"\xc4\xf1o\x89\xd4A\xb2\x9b"
    encoded_args = layout.build(
        {
            "order_code": args["order_code"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
