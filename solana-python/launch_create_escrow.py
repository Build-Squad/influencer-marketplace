from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts


from utils import get_local_keypair_pubkey
from utils import sign_and_send_transaction
from utils import load_configuration

from pyxfluencer.instructions import create_escrow

def main():
    ## TODO: assert solana config get matches with the one at config.json 
    
    configuration = load_configuration()

    network = configuration["network"]
    program_id = configuration["program_id_testnet"] if configuration["network"] == "testnet" else configuration["program_id_devnet"]
    
    PROGRAM_ID = Pubkey.from_string(program_id)
    print(f"Network: {network} Program ID: {program_id}")
    
    business, business_pk = get_local_keypair_pubkey(path="business.json")
    influencer, influencer_pk = get_local_keypair_pubkey(path="influencer.json")
    _, validation_authority_pk = get_local_keypair_pubkey(path="/home/ruben/.config/solana/id.json")
    
    assert str(business_pk) == configuration["business"]
    assert str(influencer_pk) == configuration["influencer"]

    print("Validation Authority:",validation_authority_pk)

    #assert str(validation_authority_pk) == configuration["validation_authority"]

    
    amount = configuration["lamports"]
    order_code = configuration["order_code"]

    args = {"amount":int(amount),
            "order_code":int(order_code) }
    
    SEEDS = [b"escrow",
            bytes(business_pk),
            bytes(influencer_pk),
            bytes(str(order_code),"UTF-8")
            ]

    escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)
    
    print("escrow pda found",escrow_pda)

    accounts = {"escrow":escrow_pda, 
                "from_":business_pk,
                "to":influencer_pk,
                "validation_authority": validation_authority_pk
                }


    opts = TxOpts(skip_confirmation = True,
                  skip_preflight = True)

    signers = [business]

    ix = create_escrow(args, accounts, program_id=PROGRAM_ID)
    sign_and_send_transaction(ix, signers, opts, network)

if __name__ == "__main__":
    main()
    
