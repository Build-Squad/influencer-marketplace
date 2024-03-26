from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts

from pyxfluencer.utils import get_local_keypair_pubkey
from pyxfluencer.utils import sign_and_send_transaction
from pyxfluencer.utils import select_client

from pyxfluencer.program_id import PROGRAM_ID
from pyxfluencer.instructions import initialize

from config import KeypairPaths, load_configuration

from anchorpy import utils, Wallet, Provider
from anchorpy.utils import token
from anchorpy.utils.rpc import AccountInfo

async def get_token_account_info( ata_address: str, network : str) -> AccountInfo:
    connection = select_client(network=network, async_client=True)     
    wallet = Wallet.local()
    provider = Provider(connection, wallet)
    print(ata_address)
    print(wallet)
    pubkey_token_account = Pubkey.from_string(ata_address) 
    
    print("ata",pubkey_token_account)
    account_info = await token.get_token_account(provider, pubkey_token_account)
    return account_info

async def main():
    
    msg = "Create Escrow for Business and Influencer on order code with an amount of SPL tokens"
    print(len(msg)*"*")
    print(msg)
    print(len(msg)*"*")
    
    configuration = load_configuration()

    ### inputs
    network = "devnet" #"localnet" #configuration["network"]
    ata_selector = "usdc_ata"
    mint = "usdc_mint_address"
    type_of_asset = "usdc"
    
    
    ################################################
    
    print(f"Network: {network}")
    print(f"Program ID: {PROGRAM_ID}")

    keypair_paths = KeypairPaths()
     
    ata = configuration["payer"][ata_selector]
    account_info = await get_token_account_info(ata, network)
    print(account_info)    
    #assert account_info.amount >= 1000000 # 1 USDC
    #exit()

    #influencer_ata = "EUzxNecLcmpeMfun8zyTKs372vyy7bREmqzq6QXaZTuB"
    #account_info = await get_token_account_info(influencer_ata)
    #print(account_info)    
    #assert account_info.amount >= 1000000 # 1 USDC

    business, business_pk = get_local_keypair_pubkey(path=keypair_paths.bussines_keypair)
    _, influencer_pk = get_local_keypair_pubkey(path=keypair_paths.influencer_keypair)
    _, validation_authority_pk = get_local_keypair_pubkey(path=keypair_paths.validation_authority)

    
    business_ata = configuration["business"][ata_selector]
    influencer_ata = configuration["influencer"][ata_selector]
    
    
    #assert str(validation_authority_pk) == configuration["platform"]   
    #assert str(business_pk) == configuration["business"]["pubkey"]
    #assert str(business_ata) == configuration["business"]["usdc_ata"]
    #assert str(influencer_pk) == configuration["influencer"]["pubkey"]
    #assert str(influencer_ata) == configuration["influencer"]["usdc_ata"]

    


    #### find pdas
    order_code = configuration["order_code"]
    
    SEEDS = [b"vault", 
             bytes(str(order_code),"UTF-8")]

    vault_pda, vault_account_bump = Pubkey.find_program_address(SEEDS, PROGRAM_ID)

    amount = configuration["amount"][type_of_asset]
    order_code = configuration["order_code"]

    args = {"amount":int(amount), 
            "order_code":int(order_code),
            "vault_account_bump":vault_account_bump}
    
    SEEDS = [b"escrow",
            bytes(str(order_code),"UTF-8")]

    escrow_pda, _ = Pubkey.find_program_address(SEEDS, PROGRAM_ID)
        

    mint_pk = Pubkey.from_string(configuration["spl_tokens"][mint])
    business_deposit_token_account_pk = Pubkey.from_string(business_ata)
    influencer_deposit_token_account_pk = Pubkey.from_string(influencer_ata)

   

    accounts = {
        "initializer": business_pk,
        "business": business_pk,         
        "influencer": influencer_pk,
        "validation_authority": validation_authority_pk,
        "mint": mint_pk,
        "business_deposit_token_account": business_deposit_token_account_pk,
        "influencer_receive_token_account": influencer_deposit_token_account_pk,
        "escrow_account": escrow_pda,
        "vault_account": vault_pda        
    }

    opts = TxOpts(skip_confirmation = True,
                  skip_preflight = True,
                  preflight_commitment="processed")

    ix = initialize(args, accounts, program_id=PROGRAM_ID)
           
    #print(ix)
    signers = [business]    

    sign_status = await sign_and_send_transaction(ix, signers, opts, network)

    print(sign_status)

import asyncio

asyncio.run(main())
    