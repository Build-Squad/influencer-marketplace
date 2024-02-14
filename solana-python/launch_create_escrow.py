from solders.pubkey import Pubkey
from src.program_id import PROGRAM_ID
from solana.rpc.types import TxOpts

from utils import get_local_keypair_pubkey, sign_and_send_transaction
from utils import load_configuration

if __name__ == "__main__":
    configuration = load_configuration()

    amount = configuration["lamports"]
    influencer = configuration["influencer"]

    order_code = 2

    args = {"amount":int(amount), "order_code":order_code }

    business, business_pk = get_local_keypair_pubkey()
    influencer_pk = Pubkey.from_string(influencer)
    
    order_code = str(order_code)

    SEEDS = [b"escrow",
            bytes(business_pk),
            bytes(influencer_pk),
            bytes(order_code,"UTF-8")
            ]

    escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)
    
    accounts = {"escrow":escrow_pda, 
                "from_":business_pk,
                "to":influencer_pk}


    opts = TxOpts(skip_confirmation = True,
                skip_preflight = True)

    signers = [business]

    sign_and_send_transaction(args, accounts, signers, opts)

    