from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class UpdateFeesArgs(typing.TypedDict):
    percentage_rate: int


layout = borsh.CStruct("percentage_rate" / borsh.I32)


class UpdateFeesAccounts(typing.TypedDict):
    fees_authority: Pubkey
    fees_config: Pubkey


def update_fees(
    args: UpdateFeesArgs,
    accounts: UpdateFeesAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(
            pubkey=accounts["fees_authority"], is_signer=True, is_writable=True
        ),
        AccountMeta(pubkey=accounts["fees_config"], is_signer=False, is_writable=True),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"\xe1\x1b\r\x06ET\xac\xbf"
    encoded_args = layout.build(
        {
            "percentage_rate": args["percentage_rate"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
