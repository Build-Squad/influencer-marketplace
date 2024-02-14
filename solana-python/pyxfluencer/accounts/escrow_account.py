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
    buyer_key: str
    buyer_deposit_token_account: str
    seller_key: str
    seller_receive_token_account: str
    judge_key: str
    amount: int
    order_code: int
    status: int
    delivery_time: int
    trial_day: int


@dataclass
class EscrowAccount:
    discriminator: typing.ClassVar = b"$E0\x12\x80\xe1}\x87"
    layout: typing.ClassVar = borsh.CStruct(
        "buyer_key" / BorshPubkey,
        "buyer_deposit_token_account" / BorshPubkey,
        "seller_key" / BorshPubkey,
        "seller_receive_token_account" / BorshPubkey,
        "judge_key" / BorshPubkey,
        "amount" / borsh.U64,
        "order_code" / borsh.U64,
        "status" / borsh.U8,
        "delivery_time" / borsh.I64,
        "trial_day" / borsh.U16,
    )
    buyer_key: Pubkey
    buyer_deposit_token_account: Pubkey
    seller_key: Pubkey
    seller_receive_token_account: Pubkey
    judge_key: Pubkey
    amount: int
    order_code: int
    status: int
    delivery_time: int
    trial_day: int

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
            buyer_key=dec.buyer_key,
            buyer_deposit_token_account=dec.buyer_deposit_token_account,
            seller_key=dec.seller_key,
            seller_receive_token_account=dec.seller_receive_token_account,
            judge_key=dec.judge_key,
            amount=dec.amount,
            order_code=dec.order_code,
            status=dec.status,
            delivery_time=dec.delivery_time,
            trial_day=dec.trial_day,
        )

    def to_json(self) -> EscrowAccountJSON:
        return {
            "buyer_key": str(self.buyer_key),
            "buyer_deposit_token_account": str(self.buyer_deposit_token_account),
            "seller_key": str(self.seller_key),
            "seller_receive_token_account": str(self.seller_receive_token_account),
            "judge_key": str(self.judge_key),
            "amount": self.amount,
            "order_code": self.order_code,
            "status": self.status,
            "delivery_time": self.delivery_time,
            "trial_day": self.trial_day,
        }

    @classmethod
    def from_json(cls, obj: EscrowAccountJSON) -> "EscrowAccount":
        return cls(
            buyer_key=Pubkey.from_string(obj["buyer_key"]),
            buyer_deposit_token_account=Pubkey.from_string(
                obj["buyer_deposit_token_account"]
            ),
            seller_key=Pubkey.from_string(obj["seller_key"]),
            seller_receive_token_account=Pubkey.from_string(
                obj["seller_receive_token_account"]
            ),
            judge_key=Pubkey.from_string(obj["judge_key"]),
            amount=obj["amount"],
            order_code=obj["order_code"],
            status=obj["status"],
            delivery_time=obj["delivery_time"],
            trial_day=obj["trial_day"],
        )
