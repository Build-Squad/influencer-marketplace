import typing
from dataclasses import dataclass
from solders.pubkey import Pubkey
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Commitment
import borsh_construct as borsh
from anchorpy.coder.accounts import ACCOUNT_DISCRIMINATOR_SIZE
from anchorpy.error import AccountInvalidDiscriminator
from anchorpy.utils.rpc import get_multiple_accounts
from anchorpy.borsh_extension import BorshPubkey
from ..program_id import PROGRAM_ID


class EscrowAccountJSON(typing.TypedDict):
    business_key: str
    business_deposit_token_account: str
    influencer_key: str
    influencer_receive_token_account: str
    validation_authority: str
    amount: int
    order_code: int
    status: int


@dataclass
class EscrowAccount:
    discriminator: typing.ClassVar = b"$E0\x12\x80\xe1}\x87"
    layout: typing.ClassVar = borsh.CStruct(
        "business_key" / BorshPubkey,
        "business_deposit_token_account" / BorshPubkey,
        "influencer_key" / BorshPubkey,
        "influencer_receive_token_account" / BorshPubkey,
        "validation_authority" / BorshPubkey,
        "amount" / borsh.U64,
        "order_code" / borsh.U64,
        "status" / borsh.U8,
    )
    business_key: Pubkey
    business_deposit_token_account: Pubkey
    influencer_key: Pubkey
    influencer_receive_token_account: Pubkey
    validation_authority: Pubkey
    amount: int
    order_code: int
    status: int

    @classmethod
    async def fetch(
        cls,
        conn: AsyncClient,
        address: Pubkey,
        commitment: typing.Optional[Commitment] = None,
        program_id: Pubkey = PROGRAM_ID,
    ) -> typing.Optional["EscrowAccount"]:
        resp = await conn.get_account_info(address, commitment=commitment)
        info = resp.value
        if info is None:
            return None
        if info.owner != program_id:
            raise ValueError("Account does not belong to this program")
        bytes_data = info.data
        return cls.decode(bytes_data)

    @classmethod
    async def fetch_multiple(
        cls,
        conn: AsyncClient,
        addresses: list[Pubkey],
        commitment: typing.Optional[Commitment] = None,
        program_id: Pubkey = PROGRAM_ID,
    ) -> typing.List[typing.Optional["EscrowAccount"]]:
        infos = await get_multiple_accounts(conn, addresses, commitment=commitment)
        res: typing.List[typing.Optional["EscrowAccount"]] = []
        for info in infos:
            if info is None:
                res.append(None)
                continue
            if info.account.owner != program_id:
                raise ValueError("Account does not belong to this program")
            res.append(cls.decode(info.account.data))
        return res

    @classmethod
    def decode(cls, data: bytes) -> "EscrowAccount":
        if data[:ACCOUNT_DISCRIMINATOR_SIZE] != cls.discriminator:
            raise AccountInvalidDiscriminator(
                "The discriminator for this account is invalid"
            )
        dec = EscrowAccount.layout.parse(data[ACCOUNT_DISCRIMINATOR_SIZE:])
        return cls(
            business_key=dec.business_key,
            business_deposit_token_account=dec.business_deposit_token_account,
            influencer_key=dec.influencer_key,
            influencer_receive_token_account=dec.influencer_receive_token_account,
            validation_authority=dec.validation_authority,
            amount=dec.amount,
            order_code=dec.order_code,
            status=dec.status,
        )

    def to_json(self) -> EscrowAccountJSON:
        return {
            "business_key": str(self.business_key),
            "business_deposit_token_account": str(self.business_deposit_token_account),
            "influencer_key": str(self.influencer_key),
            "influencer_receive_token_account": str(
                self.influencer_receive_token_account
            ),
            "validation_authority": str(self.validation_authority),
            "amount": self.amount,
            "order_code": self.order_code,
            "status": self.status,
        }

    @classmethod
    def from_json(cls, obj: EscrowAccountJSON) -> "EscrowAccount":
        return cls(
            business_key=Pubkey.from_string(obj["business_key"]),
            business_deposit_token_account=Pubkey.from_string(
                obj["business_deposit_token_account"]
            ),
            influencer_key=Pubkey.from_string(obj["influencer_key"]),
            influencer_receive_token_account=Pubkey.from_string(
                obj["influencer_receive_token_account"]
            ),
            validation_authority=Pubkey.from_string(obj["validation_authority"]),
            amount=obj["amount"],
            order_code=obj["order_code"],
            status=obj["status"],
        )
