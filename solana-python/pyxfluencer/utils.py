from solders.keypair import Keypair
from solders.pubkey import Pubkey

from solana.rpc.api import Client
from solana.rpc.async_api import AsyncClient
import json

from solana.transaction import Transaction
from solana.rpc.core import RPCException

import os

from anchorpy import Wallet, Provider
from anchorpy.utils import token
from anchorpy.utils.rpc import AccountInfo


def get_local_keypair_pubkey(keypair_file="id.json", path=None):

    home = os.getenv("HOME")
    assert home != None

    ## take default_path from .env
    default_path = f"{home}/.config/solana/{keypair_file}"

    path = default_path if path is None else path

    with open(path,'r') as f:        
        secret_data = json.load(f)
        
    print(f"Loaded keypair secrets from {path}") 
    keypair_owner = Keypair.from_bytes(secret_data)
    pubkey_owner = keypair_owner.pubkey()
    return keypair_owner, pubkey_owner




def select_client(network = None, async_client = False):
    if network is None:
        print("[WARN] Client network selected is None, set 'heliux' as default")
        network="heliux"
        
    urls = {
        "devnet":   "https://api.devnet.solana.com",
        "dev":      "https://api.devnet.solana.com",
        "testnet":  "https://api.testnet.solana.com",
        "localnet": "http://localhost:8899/",
        "local":    "http://localhost:8899/",
        "mainnet":      "https://api.mainnet-beta.solana.com/",
        "mainnet-beta": "https://api.mainnet-beta.solana.com/",
        "heliux":       "https://rpc.helius.xyz/?api-key=f895a64d-ca66-403f-801a-f6196c36b560"
    }

    try:    
        if async_client:
            return AsyncClient(urls[network])
        return Client(urls[network])

    except Exception as e:
        raise Exception(f"Selecting RPC Solana Client Network {e}")


async def get_token_account_info(ata_address: str, network : str) -> AccountInfo:
    connection = select_client(network=network, async_client=True)     
    wallet = Wallet.local()
    provider = Provider(connection, wallet)
    pubkey_token_account = Pubkey.from_string(ata_address) 
    try:
        return await token.get_token_account(provider, pubkey_token_account)
    except Exception as e:
        raise Exception(f"Getting Token Account Info {e}")

async def sign_and_send_transaction(ix,  signers, opts, network, async_client: bool = True):
          
    try:        
        client = select_client(network=network, async_client=async_client)
        tx = Transaction().add(ix)
        
        print("Sending transactions with options", opts)
                        
        tx_res = await client.send_transaction(tx, *signers, opts=opts)
        
        print("Client Response tx signature: ", tx_res)
        print("Waiting for transaction confirmation")
        
        signature_status = await client.confirm_transaction(tx_res.value)
        
        print("Confirm Transaction Status Value:", signature_status)
        return signature_status.to_json()
    except RPCException as e:        
        raise RPCException(f"RPC exception happened: {e}")
    
