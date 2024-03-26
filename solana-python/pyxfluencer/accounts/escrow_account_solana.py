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


class EscrowAccountSolanaJSON(typing.TypedDict):
    validation_authority: str
    from_: str
    to: str
    amount: int
    order_code: int
    status: int


@dataclass
class EscrowAccountSolana:
    discriminator: typing.ClassVar = b"\x10\x907\x85x\xb0\xebC"
    layout: typing.ClassVar = borsh.CStruct(
        "validation_authority" / BorshPubkey,
        "from_" / BorshPubkey,
        "to" / BorshPubkey,
        "amount" / borsh.U64,
        "order_code" / borsh.U64,
        "status" / borsh.U8,
    )
    validation_authority: Pubkey
    from_: Pubkey
    to: Pubkey
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
    ) -> typing.Optional["EscrowAccountSolana"]:
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
    ) -> typing.List[typing.Optional["EscrowAccountSolana"]]:
        infos = await get_multiple_accounts(conn, addresses, commitment=commitment)
        res: typing.List[typing.Optional["EscrowAccountSolana"]] = []
        for info in infos:
            if info is None:
                res.append(None)
                continue
            if info.account.owner != program_id:
                raise ValueError("Account does not belong to this program")
            res.append(cls.decode(info.account.data))
        return res

    @classmethod
    def decode(cls, data: bytes) -> "EscrowAccountSolana":
        if data[:ACCOUNT_DISCRIMINATOR_SIZE] != cls.discriminator:
            raise AccountInvalidDiscriminator(
                "The discriminator for this account is invalid"
            )
        dec = EscrowAccountSolana.layout.parse(data[ACCOUNT_DISCRIMINATOR_SIZE:])
        return cls(
            validation_authority=dec.validation_authority,
            from_=dec.from_,
            to=dec.to,
            amount=dec.amount,
            order_code=dec.order_code,
            status=dec.status,
        )

    def to_json(self) -> EscrowAccountSolanaJSON:
        return {
            "validation_authority": str(self.validation_authority),
            "from_": str(self.from_),
            "to": str(self.to),
            "amount": self.amount,
            "order_code": self.order_code,
            "status": self.status,
        }

    @classmethod
    def from_json(cls, obj: EscrowAccountSolanaJSON) -> "EscrowAccountSolana":
        return cls(
            validation_authority=Pubkey.from_string(obj["validation_authority"]),
            from_=Pubkey.from_string(obj["from"]),
            to=Pubkey.from_string(obj["to"]),
            amount=obj["amount"],
            order_code=obj["order_code"],
            status=obj["status"],
        )
