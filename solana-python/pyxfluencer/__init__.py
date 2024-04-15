from dataclasses import dataclass
from enum import Enum

from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts
from solders.keypair import Keypair

from .instructions import validate_escrow_sol
from .instructions import validate_escrow_spl
from .utils import sign_and_send_transaction
from .program_id import PROGRAM_ID

xfluencer_solana_python_client_version = "1.2.2"

###################
# Version: 1.2.1
# Bump: Patch
# Updated: 04.04.2024
# - use network parameter to specify full URL of a private RPC
# 
###################
# Version: 1.2.0
# Bump: Minor
# Updated: 01.04.2024
# - Add SPL case  
# - Add percentage fee to both cases escrow cases SOL and SPL 
# - Update Test launchers 
# - Update program id DmYaabL1PhacWWsRwyZpBqBP9n7tVq7115zG2tznYLb9
# 
###################
# Version: 1.2.0
# Bump: Minor
# Updated: 01.04.2024
# - Add SPL case  
# - Add percentage fee to both cases escrow cases SOL and SPL 
# - Update Test launchers 
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
        
    async def cancel(self):
        return await validate_escrow(self.validator_authority,
                                     self.business_address, 
                                     self.influencer_address, 
                                     EscrowState.CANCEL, 
                                     self.order_code,
                                     self.network,
                                     self.percentage_fee,
                                     self.processing_spl_escrow)
    async def deliver(self):
        return await validate_escrow(self.validator_authority,
                                     self.business_address, 
                                     self.influencer_address, 
                                     EscrowState.DELIVERED, 
                                     self.order_code, 
                                     self.network,
                                     self.percentage_fee,
                                     self.processing_spl_escrow) 
        
    
# NON SPL escrow
async def validate_escrow_to_cancel(validator_authority: Keypair,
                                    business_address: str,
                                    influencer_address: str,
                                    order_code:int, 
                                    network: str = "https://api.devnet.solana.com", 
                                    percentage_fee: int = 0):
    """

    Args:
        validator_authority (Keypair): 
        business_address (str):
        influencer_address (str):
        order_code (int): 
        network (_type_, optional):  Defaults to "https://api.devnet.solana.com".
        percentage_fee (int, optional): Defaults to 0. Integer from 0 to 500 (0 is 0% and 500 is 5.00%)

    Returns:
    """
        
    return await validate_escrow(validator_authority,
                                business_address, 
                                influencer_address, 
                                EscrowState.CANCEL, 
                                order_code,
                                network, 
                                percentage_fee, 
                                processing_spl_escrow=False)    

# NON SPL escrow
async def validate_escrow_to_delivered(validator_authority: Keypair,
                                       business_address: str,
                                       influencer_address: str,
                                       order_code:int,
                                       network: str = "https://api.devnet.solana.com",
                                       percentage_fee: int = 0): 
    """_summary_

    Args:
        validator_authority (Keypair): 
        business_address (str): 
        influencer_address (str): 
        order_code (int): 
        network (_type_, optional):  Defaults to "https://api.devnet.solana.com".
        percentage_fee (int, optional): Defaults to 0. (0 is 0% and 500 is 5.00%)

    Returns:
    """
    
    return await validate_escrow(validator_authority,
                                 business_address, 
                                 influencer_address, 
                                 EscrowState.DELIVERED, 
                                 order_code, 
                                 network, 
                                 percentage_fee, 
                                 processing_spl_escrow=False)    


async def validate_escrow(validation_authority: Keypair,
                          business_address: str,
                          influencer_address: str,
                          target_escrow_state: EscrowState,
                          order_code: int,
                          network: str = "https://api.devnet.solana.com",
                          percentage_fee: int = 0,
                          processing_spl_escrow: bool = False):

    business_pk = Pubkey.from_string(business_address)
    influencer_pk = Pubkey.from_string(influencer_address)

    args = {"target_state": target_escrow_state.value,
            "percentage_fee": percentage_fee}

    signers = [validation_authority]

    if not processing_spl_escrow:
        print("Processing Escrow SOL case")
        SEEDS = [b"escrow", bytes(business_pk), bytes(influencer_pk),
                 bytes(str(order_code), "UTF-8")]

        escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)

        accounts = {
            "validation_authority": validation_authority.pubkey(),
            "influencer": influencer_pk,
            "business": business_pk,
            "escrow_account": escrow_pda
        }

        ix = validate_escrow_sol(args, accounts, program_id=PROGRAM_ID)

        # return await sign_and_send_transaction(ix, signers, opts, network)

    else:
        print("Processing Escrow SPL case")

        # find vault and escrows pdas
        vault_account_pda, _ = \
            Pubkey.find_program_address([b"token-seed",
                                         bytes(str(order_code), "UTF-8")], PROGRAM_ID)

        escrow_account_pda, _ = \
            Pubkey.find_program_address([b"escrow-data",
                                         bytes(str(order_code), "UTF-8")], PROGRAM_ID)

        accounts = {
            "validation_authority": validation_authority.pubkey(),
            "vault_account": vault_account_pda,
            "influencer": influencer_pk,
            "business": business_pk,
            "escrow_account": escrow_account_pda
        }

        ix = validate_escrow_spl(args, accounts, program_id=PROGRAM_ID)

    try:
        tx_resp = await sign_and_send_transaction(ix, signers, network)
        if tx_resp:
            print(f"Escrow validation status: {tx_resp}")
            return tx_resp
    except Exception as e:
        print(f"Error validating escrow {str(e)}")
        raise Exception(f"Error validating escrow {e}")
