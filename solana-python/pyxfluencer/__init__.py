from enum import Enum

from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts
from solders.keypair import Keypair

from .instructions import validate_escrow_sol
from .utils import sign_and_send_transaction
from .program_id import PROGRAM_ID

xfluencer_solana_python_client_version="1.0.0"

class EscrowState(Enum):
    NEW = 0
    CANCEL = 1
    DELIVERED = 2



async def validate_escrow_to_cancel(validator_authority: Keypair,
                                    business_address: str,
                                    influencer_address: str,
                                    order_code:int, 
                                    network="https://api.devnet.solana.com"):
    
    await validate_escrow(validator_authority,
                          business_address, 
                          influencer_address, 
                          EscrowState.CANCEL, 
                          order_code,
                          network)    


async def validate_escrow_to_delivered(validator_authority: Keypair,
                                       business_address: str,
                                       influencer_address: str,
                                       order_code:int,
                                       network="https://api.devnet.solana.com"):
    
    await validate_escrow(validator_authority,
                          business_address, 
                          influencer_address, 
                          EscrowState.DELIVERED, 
                          order_code, 
                          network)    


async def validate_escrow(validation_authority: Keypair,
                          business_address: str, 
                          influencer_address: str,
                          target_escrow_state: EscrowState,                          
                          order_code:int,
                          network="https://api.devnet.solana.com"):
    
    business_pk = Pubkey.from_string(business_address)
    influencer_pk = Pubkey.from_string(influencer_address)
    
    SEEDS = [b"escrow",
            bytes(business_pk),
            bytes(influencer_pk),
            bytes(str(order_code),"UTF-8")
            ]

    escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)
    
        
    args = {"target_state":target_escrow_state.value}
    
    accounts = {
        "validation_authority": validation_authority.pubkey(), 
        "influencer":influencer_pk,         
        "business":business_pk,
        "escrow_account":escrow_pda
        }
    #print(accounts)
    
    print("business pk", business_pk)

    opts = TxOpts(skip_confirmation = True,
                  skip_preflight = True,
                  preflight_commitment="processed")

    ix = validate_escrow_sol(args, accounts, program_id=PROGRAM_ID)

    signers = [validation_authority]        
    
    await sign_and_send_transaction(ix, signers, opts, network)