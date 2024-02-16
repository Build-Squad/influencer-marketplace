from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts

from utils import get_local_keypair_pubkey, select_client
from utils import sign_and_send_transaction
from utils import load_configuration

from pyxfluencer.instructions import claim_escrow

def main():
    # implement caller to claim escrow instruction
    configuration = load_configuration()
    network = configuration["network"]
    program_id = configuration["program_id_testnet"] if configuration["network"] == "testnet" else configuration["program_id_devnet"]
    PROGRAM_ID = Pubkey.from_string(program_id)
    print(f"Network: {network} Program ID: {program_id}")


    path_to_bussines_keypair = "business.json"
    path_to_influencer_keypair = "influencer.json"
    #print(path_to_bussines_keypair, path_to_influencer_keypair)
    
    

    _, business_pk = get_local_keypair_pubkey(path=path_to_bussines_keypair)
    influencer, influencer_pk = get_local_keypair_pubkey(path=path_to_influencer_keypair)
    #print(business_pk,influencer_pk)
    
    assert str(business_pk) == configuration["business"]
    assert str(influencer_pk) == configuration["influencer"]
   
    order_code = configuration["order_code"]
    
    args = {"order_code":int(order_code) }
        
    SEEDS = [b"escrow",
            bytes(business_pk),
            bytes(influencer_pk),
            bytes(str(order_code),"UTF-8")
            ]

    escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)
    
    accounts = {"influencer":influencer_pk, 
                "business":business_pk,
                "escrow_account":escrow_pda}
    print(accounts)

    ix = claim_escrow(args, accounts, program_id=PROGRAM_ID)
    opts = TxOpts(skip_confirmation = True,
                  skip_preflight = True)
    signers = [influencer]    

    sign_and_send_transaction(ix,  signers, opts, network)




if __name__ == "__main__":
    main()