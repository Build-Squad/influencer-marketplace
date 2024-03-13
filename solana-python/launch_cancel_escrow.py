import os

from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts

from pyxfluencer.utils import get_local_keypair_pubkey, select_client
from pyxfluencer.utils import sign_and_send_transaction
from pyxfluencer.program_id import PROGRAM_ID

from config import KeypairPaths, load_configuration

from pyxfluencer.instructions import cancel_escrow_sol

async def main():
    
    msg = "Cancel Escrow Amount by Business"
    print(len(msg)*"*")
    print(msg)
    print(len(msg)*"*")
    
    configuration = load_configuration()
    network = configuration["network"]
        
    print(f"Network: {network} Program ID: {PROGRAM_ID}")
            
    keypair_paths = KeypairPaths()
            
    business, business_pk = get_local_keypair_pubkey(path=keypair_paths.bussines_keypair)     
    _, influencer_pk = get_local_keypair_pubkey(path=keypair_paths.influencer_keypair)
    
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

    ix = cancel_escrow_sol(accounts)
    opts = TxOpts(skip_confirmation = True,
                  skip_preflight = True)

    signers = [business]    

    await sign_and_send_transaction(ix,  signers, opts, network)


import asyncio
asyncio.run(main())


