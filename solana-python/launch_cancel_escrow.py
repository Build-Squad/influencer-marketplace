import os

from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts

from pyxfluencer.utils import get_local_keypair_pubkey, select_client
from pyxfluencer.utils import sign_and_send_transaction
from pyxfluencer.program_id import PROGRAM_ID

from config import KeypairPaths, load_configuration

from pyxfluencer.instructions import cancel_escrow_sol

def print_tittle(msg):
    print(len(msg)*"*")
    print(msg)
    print(len(msg)*"*")

async def main():
    
    msg = "Cancel Escrow Amount by Business"
    print_tittle(msg)
    
    configuration = load_configuration()
    network = configuration["network"]
        
    print(f"Network: {network} Program ID: {PROGRAM_ID}")
            
    keypair_paths = KeypairPaths()
            
    #business, business_pk = get_local_keypair_pubkey(path=keypair_paths.bussines_keypair)     
    business, business_pk = get_local_keypair_pubkey(path=keypair_paths.bussines_GQRD)     

    
    _, influencer_pk = get_local_keypair_pubkey(path=keypair_paths.influencer_keypair)
    
    assert str(business_pk) == configuration["business"]["pubkey"]
    assert str(influencer_pk) == configuration["influencer"]["pubkey"]
   
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

    ix = cancel_escrow_sol(accounts)
    opts = TxOpts(skip_confirmation = False,
                  skip_preflight = False)

    signers = [business]    

    await sign_and_send_transaction(ix,  signers, opts, network)


import asyncio
asyncio.run(main())


