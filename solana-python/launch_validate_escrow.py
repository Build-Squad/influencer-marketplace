import os
import asyncio

from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts

from pyxfluencer.instructions import validate_escrow_sol
from pyxfluencer.utils import get_local_keypair_pubkey
from pyxfluencer.utils import sign_and_send_transaction
from pyxfluencer.program_id import PROGRAM_ID

from config import load_configuration


async def main():

    configuration = load_configuration()
    network = configuration["network"]
    
    
    home = os.getenv("HOME") + "/influencer-marketplace/solana-python/test_wallets"
    platform = "platform_EsYxpj9ADJyGEjMv3tyDpADv33jDPkv9uLymXWwQCiwH.json"
    path_to_validation_authority = f"{home}/{platform}"
    business = "business_6suvWCcjg5o7xgHrDGc4MXQxraK9PnZyEXzjhhQN6HUK.json"
    path_to_bussines_keypair = f"{home}/{business}"
    influencer = "influencer_94fznXq73oweXLrg2zL75XAMy9xNEbqtb191Xcrq97QA.json"
    path_to_influencer_keypair = f"{home}/{influencer}"
    
    
    validation_authority, validation_authority_pk  \
        = get_local_keypair_pubkey(path=path_to_validation_authority)   
        
    business, business_pk = get_local_keypair_pubkey() #path=path_to_bussines_keypair)

    _, influencer_pk = get_local_keypair_pubkey(path=path_to_influencer_keypair)
    
    order_code = configuration["order_code"]
    SEEDS = [b"escrow",
            bytes(business_pk),
            bytes(influencer_pk),
            bytes(str(order_code),"UTF-8")
            ]

    escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)
    
    print("escrow pda found",escrow_pda)
    
    args = {"target_state":2}
    
    accounts = {
        "validation_authority": validation_authority_pk, #validation_authority_pk,
        "influencer":influencer_pk,         
        "business":business_pk,
        "escrow_account":escrow_pda
        }
   
    opts = TxOpts(skip_confirmation = True,
                  skip_preflight = True,
                  preflight_commitment="processed")

    ix = validate_escrow_sol(args, accounts, program_id=PROGRAM_ID)
    print("keypair",validation_authority)
    
    signers = [validation_authority]        
    
    print("nework -->",network)
    
    print(ix)
    
    await sign_and_send_transaction(ix, signers, opts, network)



asyncio.run(main())