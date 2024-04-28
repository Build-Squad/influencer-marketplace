import asyncio
import sys
import argparse

from solders.keypair import Keypair
from solders.pubkey import Pubkey

from pyxfluencer.instructions import validate_escrow_sol
from pyxfluencer.utils import get_local_keypair_pubkey
from pyxfluencer.utils import sign_and_send_transaction
from pyxfluencer.program_id import PROGRAM_ID
from pyxfluencer import EscrowValidator

from config import KeypairPaths, load_configuration

from enum import Enum

class TargetState(Enum):
    CANCEL = 1
    DELIVERY = 2

def print_tittle(msg):
    print(len(msg)*"*")
    print(msg)
    print(len(msg)*"*")

def validate_local_keypair_on_config(accounts):    
    configuration = load_configuration()
    # check configuration matches local keypairs
    for role in ["validator","business","influencer"]:    
        assert str(accounts[role]["pubkey"]) == configuration[role]["pubkey"]

def load_keypairs():
    keypair_paths = KeypairPaths()
    
    validation_kp, validation_pk  \
        = get_local_keypair_pubkey(path=keypair_paths.validation_authority)   
    business_kp, business_pk = get_local_keypair_pubkey() # if no params, takes local keypair (id.json)
    influencer_kp, influencer_pk = get_local_keypair_pubkey(path=keypair_paths.influencer_keypair)
    return {"validator":{"keypair":validation_kp, "pubkey":validation_pk},
            "business":{"keypair":business_kp, "pubkey":business_pk},
            "influencer":{"keypair":influencer_kp, "pubkey":influencer_pk}}
         

async def main(target_state):

    if target_state == TargetState.CANCEL:
        msg = "Cancel so Business Can Re-Funding"
    else:
        msg = "Deliver so Influencer Can claim"        
    print_tittle("Validate Escrow to "+msg)

    configuration = load_configuration()
    network = configuration["rpc"]["mainnet"]    
    print("nework -->", network)
    
    accounts = load_keypairs()
    validate_local_keypair_on_config(accounts)
    
    order_code = configuration["order_code"]

    escrow_validator = EscrowValidator(accounts["validator"]["keypair"], 
                                       accounts["business"]["pubkey"], 
                                       accounts["influencer"]["pubkey"], 
                                       order_code, network)
    try:
        if target_state == TargetState.CANCEL:
            res = await escrow_validator.cancel()
        else:
            res = await escrow_validator.deliver()
    except Exception as err:    
        res = err

    print(f"Results from Validator  --> '{res}'")



import sys

class LaunchParser(argparse.ArgumentParser):
    def error(self, message):
        self.print_help()
        sys.exit(2)

parser = LaunchParser(prog='launch_validate.py')
parser.add_argument('--target', choices=['cancel', 'deliver'])
args = parser.parse_args()
if args.target == 'cancel':
    target_state = TargetState.CANCEL
elif args.target == 'deliver':
    target_state = TargetState.DELIVERY
else:
    print("Incorrect Option")
    parser.print_help()
    sys.exit(0)

    

asyncio.run(main(target_state))
    
