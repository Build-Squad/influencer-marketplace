from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from solders.sysvar import RENT
from spl.token.constants import TOKEN_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class InitializeArgs(typing.TypedDict):
    vault_account_bump: int
    amount: int
    order_code: int


layout = borsh.CStruct(
    "vault_account_bump" / borsh.U8, "amount" / borsh.U64, "order_code" / borsh.U64
)


class InitializeAccounts(typing.TypedDict):
    initializer: Pubkey
    business: Pubkey
    influencer: Pubkey
    validation_authority: Pubkey
    mint: Pubkey
    business_deposit_token_account: Pubkey
    influencer_receive_token_account: Pubkey
    escrow_account: Pubkey
    vault_account: Pubkey


def initialize(
    args: InitializeArgs,
    accounts: InitializeAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(pubkey=accounts["initializer"], is_signer=True, is_writable=True),
        AccountMeta(pubkey=accounts["business"], is_signer=False, is_writable=False),
        AccountMeta(pubkey=accounts["influencer"], is_signer=False, is_writable=False),
        AccountMeta(
            pubkey=accounts["validation_authority"], is_signer=False, is_writable=False
        ),
        AccountMeta(pubkey=accounts["mint"], is_signer=False, is_writable=False),
        AccountMeta(
            pubkey=accounts["business_deposit_token_account"],
            is_signer=False,
            is_writable=True,
        ),
        AccountMeta(
            pubkey=accounts["influencer_receive_token_account"],
            is_signer=False,
            is_writable=False,
        ),
        AccountMeta(
            pubkey=accounts["escrow_account"], is_signer=False, is_writable=True
        ),
        AccountMeta(
            pubkey=accounts["vault_account"], is_signer=False, is_writable=True
        ),
        AccountMeta(pubkey=SYS_PROGRAM_ID, is_signer=False, is_writable=False),
        AccountMeta(pubkey=TOKEN_PROGRAM_ID, is_signer=False, is_writable=False),
        AccountMeta(pubkey=RENT, is_signer=False, is_writable=False),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"\xaf\xafm\x1f\r\x98\x9b\xed"
    encoded_args = layout.build(
        {
            "vault_account_bump": args["vault_account_bump"],
            "amount": args["amount"],
            "order_code": args["order_code"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
