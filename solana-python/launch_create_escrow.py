from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts

from pyxfluencer.utils import get_local_keypair_pubkey
from pyxfluencer.utils import sign_and_send_transaction
from pyxfluencer.program_id import PROGRAM_ID

from pyxfluencer.instructions import create_escrow

from config import KeypairPaths, load_configuration

async def main():
    
  
    msg = "Create Escrow for Business and Influencer with an amount and an order code"
    print(len(msg)*"*")
    print(msg)
    print(len(msg)*"*")
    
    configuration = load_configuration()

    network = configuration["network"]
    
    print(f"Network: {network}")
    print(f"Program ID: {PROGRAM_ID}")

    keypair_paths = KeypairPaths()
    
    # @TODO: add to utils a way to get the base58 from keypair
    #validation, validation_authority_pk = get_local_keypair_pubkey(path=keypair_paths.validation_authority)
    #print(validation)  # way to get base58 from keypair seed
        
    _, validation_authority_pk = get_local_keypair_pubkey(path=keypair_paths.validation_authority)
    business, business_pk = get_local_keypair_pubkey(path=keypair_paths.bussines_keypair)
    _, influencer_pk = get_local_keypair_pubkey(path=keypair_paths.influencer_keypair)
    
    assert str(validation_authority_pk) == configuration["platform"]       
    assert str(business_pk) == configuration["business"]["pubkey"]
    assert str(influencer_pk) == configuration["influencer"]["pubkey"]

    amount = configuration["amount"]["lamports"]
    order_code = configuration["order_code"]

    args = {"amount":int(amount), "order_code":int(order_code) }
    
    SEEDS = [b"escrow",
            bytes(business_pk),
            bytes(influencer_pk),
            bytes(str(order_code),"UTF-8")
            ]

    escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)
        
    accounts = {
        "validation_authority": validation_authority_pk,
        "escrow":escrow_pda,         
        "from_":business_pk,
        "to":influencer_pk
        }

    opts = TxOpts(skip_confirmation = True,
                  skip_preflight = True,
                  preflight_commitment="processed")

    ix = create_escrow(args, accounts, program_id=PROGRAM_ID)
           
    signers = [business]    

    sign_status = await sign_and_send_transaction(ix, signers, opts, network)

    print(sign_status)

import asyncio

asyncio.run(main())
    