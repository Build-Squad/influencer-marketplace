from dataclasses import dataclass
from enum import Enum

from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts
from solders.keypair import Keypair

from .instructions import validate_escrow_sol
from .instructions import validate_escrow_spl
from .utils import sign_and_send_transaction
from .program_id import PROGRAM_ID

xfluencer_solana_python_client_version="1.2.0"

###################
# Version: 1.2.0
# Bump: Minor
# Updated: 01.04.2024
# - Add SPL case  
# - Add percentage fee to both escrow cases SOLa and SPL 
# - Update Launchers t
# - Update program id DmYaabL1PhacWWsRwyZpBqBP9n7tVq7115zG2tznYLb9
# 
###################
# Version: 1.1.0
# Bump: Minor
# Updated: 25.03.2024
###################
# Issues
# - Support and launcher script to initialize escrow for SPL 
# - Checker configured ATA addresses on initialization and amount 
#
###################
# Version: 1.0.2
# Bump: Patch
# Updated: 06.03.2024
###################
# Issues
# -Return signature status upon validation
# -Fix stand alone test for pyxfluencer python package
#
###################
# Version: 1.0.1 
# Bump: Patch
# Updated: 05.03.2024
###################
# Issues 
# -Fix bug on setup.py about including requirements


class EscrowState(Enum):
    NEW = 0
    CANCEL = 1
    DELIVERED = 2

@dataclass
class EscrowValidator:
    validator_authority: Keypair
    business_address: Pubkey
    influencer_address: Pubkey
    order_code: int
    network: str = "https://api.devnet.solana.com"
    percentage_fee: int = 0
    processing_spl_escrow: bool = False
    mint: str = None
    
    async def cancel(self):
        return await validate_escrow(self.validator_authority,
                                    self.business_address, 
                                    self.influencer_address, 
                                    EscrowState.CANCEL, 
                                    self.order_code,
                                    self.network)
    async def deliver(self):
        return await validate_escrow(self.validator_authority,
                                     self.business_address, 
                                     self.influencer_address, 
                                     EscrowState.DELIVERED, 
                                     self.order_code, 
                                     self.network) 
        
    
# non spl case
async def validate_escrow_to_cancel(validator_authority: Keypair,
                                    business_address: str,
                                    influencer_address: str,
                                    order_code:int, 
                                    network="https://api.devnet.solana.com"):
    
    return await validate_escrow(validator_authority,
                                business_address, 
                                influencer_address, 
                                EscrowState.CANCEL, 
                                order_code,
                                network)    

# non spl case
async def validate_escrow_to_delivered(validator_authority: Keypair,
                                       business_address: str,
                                       influencer_address: str,
                                       order_code:int,
                                       network="https://api.devnet.solana.com"):
    
    return await validate_escrow(validator_authority,
                                 business_address, 
                                 influencer_address, 
                                 EscrowState.DELIVERED, 
                                 order_code, 
                                 network)    


async def validate_escrow(validation_authority: Keypair,
                          business_address: str, 
                          influencer_address: str,
                          target_escrow_state: EscrowState,                          
                          order_code: int,
                          network="https://api.devnet.solana.com",
                          percentage_fee=0,
                          processing_spl_escrow=False):
    
    business_pk = Pubkey.from_string(business_address)
    influencer_pk = Pubkey.from_string(influencer_address)

    opts = TxOpts(skip_confirmation = True,
                  skip_preflight = True,
                  preflight_commitment="processed")
    
    args = {"target_state":target_escrow_state.value, "percentage_fee": percentage_fee}
    
    signers = [validation_authority]   
    
    if not processing_spl_escrow: 
        print("Processing Escrow SOL case")
        SEEDS = [b"escrow", bytes(business_pk), bytes(influencer_pk),
                bytes(str(order_code),"UTF-8")]

        escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)
        
        accounts = {
            "validation_authority": validation_authority.pubkey(), 
            "influencer":influencer_pk,         
            "business":business_pk,
            "escrow_account":escrow_pda
            }
        
        ix = validate_escrow_sol(args, accounts, program_id=PROGRAM_ID)

        #return await sign_and_send_transaction(ix, signers, opts, network)
    
    else:
        print("Processing Escrow SPL case")
        
        # find vault and escrows pdas      
        vault_account_pda, _ = \
            Pubkey.find_program_address([b"token-seed", 
                                         bytes(str(order_code),"UTF-8")], PROGRAM_ID)

        escrow_account_pda, _ = \
            Pubkey.find_program_address([b"escrow-data", 
                                         bytes(str(order_code),"UTF-8")], PROGRAM_ID)
            
        accounts = {
            "validation_authority": validation_authority.pubkey(), 
            "vault_account": vault_account_pda,
            "influencer":influencer_pk,         
            "business":business_pk,
            "escrow_account":escrow_account_pda
            }
        
        ix = validate_escrow_spl(args, accounts, program_id=PROGRAM_ID)
        
    return await sign_and_send_transaction(ix, signers, opts, network)