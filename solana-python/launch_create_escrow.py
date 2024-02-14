from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts

from utils import get_local_keypair_pubkey, sign_and_send_transaction
from utils import load_configuration

def main():
    configuration = load_configuration()

    network = configuration["network"]
    program_id = configuration["program_id_testnet"] if configuration["network"] == "testnet" else configuration["program_id_devnet"]
    PROGRAM_ID = Pubkey.from_string(program_id)
    print(f"Network: {network} Program ID: {program_id}")

    amount = configuration["lamports"]
    influencer = configuration["influencer"]
    order_code = configuration["order_code"]

    args = {"amount":int(amount), "order_code":int(order_code) }
    
    business, business_pk = get_local_keypair_pubkey()
    influencer_pk = Pubkey.from_string(influencer)
    
    SEEDS = [b"escrow",
            bytes(business_pk),
            bytes(influencer_pk),
            bytes(str(order_code),"UTF-8")
            ]

    escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)
    
    accounts = {"escrow":escrow_pda, 
                "from_":business_pk,
                "to":influencer_pk}


    opts = TxOpts(skip_confirmation = True,
                skip_preflight = True)

    signers = [business]

    sign_and_send_transaction(args, accounts, signers, opts, network, PROGRAM_ID)

if __name__ == "__main__":
    main()
    