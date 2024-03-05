import asyncio

from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts

from pyxfluencer.instructions import validate_escrow_sol
from pyxfluencer.utils import get_local_keypair_pubkey
from pyxfluencer.utils import sign_and_send_transaction
from pyxfluencer.program_id import PROGRAM_ID

from config import KeypairPaths, load_configuration

async def main():

    msg = "Validate Escrow to Delivered releasing funds to Influencer"
    print(len(msg)*"*")
    print(msg)
    print(len(msg)*"*")

    configuration = load_configuration()
    network = configuration["network"]    

    print("nework -->",network)
    
    keypair_paths = KeypairPaths()
    
    validation_authority, validation_authority_pk  \
        = get_local_keypair_pubkey(path=keypair_paths.validation_authority)   
    _, business_pk = get_local_keypair_pubkey(path=keypair_paths.bussines_keypair)
    _, influencer_pk = get_local_keypair_pubkey(path=keypair_paths.influencer_keypair)
 
    assert str(validation_authority_pk) == configuration["platform"]   
    assert str(business_pk) == configuration["business"]
    assert str(influencer_pk) == configuration["influencer"]
    
    order_code = configuration["order_code"]
    SEEDS = [b"escrow",
            bytes(business_pk),
            bytes(influencer_pk),
            bytes(str(order_code),"UTF-8")
            ]

    escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)
    
    args = {"target_state":2} # state 2 = unlock funds to influencer
    
    accounts = {
        "validation_authority": validation_authority_pk, 
        "influencer":influencer_pk,         
        "business":business_pk,
        "escrow_account":escrow_pda
        }
   
    opts = TxOpts(skip_confirmation = True,
                  skip_preflight = True,
                  preflight_commitment="processed")

    ix = validate_escrow_sol(args, accounts, program_id=PROGRAM_ID)
    
    signers = [validation_authority]        
            
    await sign_and_send_transaction(ix, signers, opts, network)



asyncio.run(main())