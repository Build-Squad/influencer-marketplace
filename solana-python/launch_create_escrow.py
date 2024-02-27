from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts


from pyxfluencer.utils import get_local_keypair_pubkey
from pyxfluencer.utils import sign_and_send_transaction
from pyxfluencer.program_id import PROGRAM_ID

from pyxfluencer.instructions import create_escrow

from config import load_configuration
import os

async def main():
    ## TODO: assert solana config get matches with the one at config.json 
    
    configuration = load_configuration()

    network = configuration["network"]
    
    print(f"Network: {network} Program ID: {PROGRAM_ID}")

    home = os.getenv("HOME") + "/influencer-marketplace/solana-python/test_wallets"

    platform = "platform_EsYxpj9ADJyGEjMv3tyDpADv33jDPkv9uLymXWwQCiwH.json"
    path_to_validation_authority = f"{home}/{platform}"

    business = "business_6suvWCcjg5o7xgHrDGc4MXQxraK9PnZyEXzjhhQN6HUK.json"
    path_to_bussines_keypair = f"{home}/{business}"

    influencer = "influencer_94fznXq73oweXLrg2zL75XAMy9xNEbqtb191Xcrq97QA.json"
    path_to_influencer_keypair = f"{home}/{influencer}"
    
    #print(path_to_validation_authority, path_to_bussines_keypair, path_to_influencer_keypair)

    _, validation_authority_pk = get_local_keypair_pubkey(path=path_to_validation_authority)   
    
    business, business_pk = get_local_keypair_pubkey() #path=path_to_bussines_keypair)
        
    _, influencer_pk = get_local_keypair_pubkey(path=path_to_influencer_keypair)
    
    #assert str(business_pk) == configuration["business"]
    assert str(influencer_pk) == configuration["influencer"]

    amount = configuration["lamports"]
    order_code = configuration["order_code"]

    args = {"amount":int(amount), "order_code":int(order_code) }
    
    SEEDS = [b"escrow",
            bytes(business_pk),
            bytes(influencer_pk),
            bytes(str(order_code),"UTF-8")
            ]

    escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)
    
    print("escrow pda found",escrow_pda)
    
    
    accounts = {
        "validation_authority": validation_authority_pk, #business_pk,
        "escrow":escrow_pda,         
        "from_":business_pk,
        "to":influencer_pk
        }


    opts = TxOpts(skip_confirmation = True,
                  skip_preflight = True,
                  preflight_commitment="processed")

    ix = create_escrow(args, accounts, program_id=PROGRAM_ID)
    print(ix)
           
    signers = [business]    
    print(business_pk)
    await sign_and_send_transaction(ix, signers, opts, network)

import asyncio

asyncio.run(main())
    