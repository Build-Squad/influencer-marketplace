import asyncio

from pyxfluencer.instructions import validate_escrow_sol
from pyxfluencer.utils import get_local_keypair_pubkey
from pyxfluencer.utils import sign_and_send_transaction
from pyxfluencer.program_id import PROGRAM_ID

from config import KeypairPaths, load_configuration

from enum import Enum

class TargetState(Enum):
    CANCEL = 1
    DELIVERY = 2

async def main(target_state):

    if target_state == TargetState.CANCEL:
        msg = "Validate Escrow to Cancel so Business Can Re-Funding"
    else:
        msg = "Validate Escrow to Deliver so Influencer Can claim"
        
    print(len(msg)*"*")
    print(msg)
    print(len(msg)*"*")

    configuration = load_configuration()
    network = configuration["rpc"]["mainnet"]    

    print("nework -->", network)
    
    keypair_paths = KeypairPaths()
    
    validation_authority, validation_authority_pk  \
        = get_local_keypair_pubkey(path=keypair_paths.validation_authority)   
    _, business_pk = get_local_keypair_pubkey() #path=keypair_paths.bussines_keypair)
    _, influencer_pk = get_local_keypair_pubkey(path=keypair_paths.influencer_keypair)
        
    # check configuration matches local keypairs
    assert str(validation_authority_pk) == configuration["platform"]   
    assert str(business_pk) == configuration["business"]["pubkey"]
    assert str(influencer_pk) == configuration["influencer"]["pubkey"]
    
    order_code = configuration["order_code"]

    from pyxfluencer import EscrowValidator
    
    escrow_validator = EscrowValidator(validation_authority, business_pk, influencer_pk, order_code, network)
    if target_state == TargetState.CANCEL:
        res = await escrow_validator.cancel()
    else:
        res = await escrow_validator.deliver()

    print("Results from Validator",res)


import argparse
parser = argparse.ArgumentParser(prog='launch_validate_sol.py')
parser.add_argument('--target', choices=['cancel', 'deliver'])


args = parser.parse_args()
if args.target == 'cancel':
    target_state = TargetState.CANCEL
elif args.target == 'deliver':
    target_state = TargetState.DELIVERY
else:
    exit()
    

asyncio.run(main(target_state))
    