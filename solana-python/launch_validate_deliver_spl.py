import asyncio

from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts

from pyxfluencer.instructions import validate_escrow_spl
from pyxfluencer.utils import get_local_keypair_pubkey
from pyxfluencer.utils import sign_and_send_transaction
from pyxfluencer.program_id import PROGRAM_ID

from config import KeypairPaths, load_configuration

async def main():

    msg = "Validate Escrow to Delivery releasing funds to Influencer (SPL tokens)"
    print(len(msg)*"*")
    print(msg)
    print(len(msg)*"*")

    configuration = load_configuration()
    network = configuration["network"]    

    print("nework -->", network)
    
    keypair_paths = KeypairPaths()
    
    validation_authority, validation_authority_pk  \
        = get_local_keypair_pubkey(path=keypair_paths.validation_authority)   
    _, business_pk = get_local_keypair_pubkey(path=keypair_paths.bussines_keypair)
    _, influencer_pk = get_local_keypair_pubkey(path=keypair_paths.influencer_keypair)
        
    # check configuration matches local keypairs
    assert str(validation_authority_pk) == configuration["platform"]   
    assert str(business_pk) == configuration["business"]["pubkey"]
    assert str(influencer_pk) == configuration["influencer"]["pubkey"]
    
    order_code = configuration["order_code"]
    
    
    # find vault and escrows pdas      
    vault_account_pda, _ = \
        Pubkey.find_program_address([b"token-seed", 
                                     bytes(str(order_code),"UTF-8")], PROGRAM_ID)

    escrow_account_pda, _ = \
        Pubkey.find_program_address([b"escrow-data", 
                                     bytes(str(order_code),"UTF-8")], PROGRAM_ID)
    
    accounts = {
        "validation_authority": validation_authority_pk, 
        "vault_account": vault_account_pda,
        "influencer":influencer_pk,         
        "business":business_pk,
        "escrow_account":escrow_account_pda
        }
   
    opts = TxOpts(skip_confirmation = True,
                  skip_preflight = True,
                  preflight_commitment="processed")

    # state 1 = unlock funds to business can re-fund    
    # percentage_fee is passed in by not applied 
    # in case target state is 2 (state to cancel)
    args = {"target_state":2, "percentage_fee": 0} 
    
    ix = validate_escrow_spl(args, accounts, program_id=PROGRAM_ID)
    
    signers = [validation_authority]        
    
    await sign_and_send_transaction(ix, signers, opts, network)



asyncio.run(main())