import json
from typing import List
from solders.keypair import Keypair
from solders.pubkey import Pubkey

from solana.rpc.api import Client # type: ignore
from solana.rpc.async_api import AsyncClient # type: ignore
import json

from solana.transaction import Transaction # type: ignore
from solana.rpc.core import RPCException # type: ignore

from solders.compute_budget import set_compute_unit_price, set_compute_unit_limit

import os

from anchorpy import Wallet, Provider
from anchorpy.utils import token
from anchorpy.utils.rpc import AccountInfo

from .errors.custom import from_code
from solana.rpc.api import SimulateTransactionResp
from solders.transaction_status import TransactionErrorInstructionError

def get_local_keypair_pubkey(keypair_file="id.json", path=None):

    home = os.getenv("HOME")
    assert home != None

    # take default_path from .env
    default_path = f"{home}/.config/solana/{keypair_file}"

    path = default_path if path is None else path

    with open(path, 'r') as f:
        secret_data = json.load(f)

    print(f"Loaded keypair secrets from {path}")
    keypair_owner = Keypair.from_bytes(secret_data)
    pubkey_owner = keypair_owner.pubkey()
    return keypair_owner, pubkey_owner


def select_client(network: str = None, async_client: bool = False, default_network: str = "devnet-helius"):

    default_urls = {
        "devnet":   "https://api.devnet.solana.com",
        "dev":      "https://api.devnet.solana.com",
        "testnet":  "https://api.testnet.solana.com",
        "localnet": "http://localhost:8899/",
        "local":    "http://localhost:8899/",
        "mainnet":      "https://api.mainnet-beta.solana.com/",
        "mainnet-beta": "https://api.mainnet-beta.solana.com/",
        "devnet-helius": "https://devnet.helius-rpc.com/?api-key=b57191c8-c14e-4ae2-83b6-1ab88c2f3605",
        "mainnet-helius": "https://mainnet.helius-rpc.com/?api-key=b57191c8-c14e-4ae2-83b6-1ab88c2f3605"
    }

    if network is None:
        print(
            "[WARN] Client network selected is None, set devnet from 'helius' as default")
        network = default_urls[default_network]

    try:
        if async_client:
            return AsyncClient(network)
        return Client(network)

    except Exception as e:
        raise Exception(f"Selecting RPC Solana Client Network {e}")


async def get_token_account_info(ata_address: str, network: str) -> AccountInfo:
    connection = select_client(network=network, async_client=True)
    wallet = Wallet.local()
    provider = Provider(connection, wallet)
    pubkey_token_account = Pubkey.from_string(ata_address)
    try:
        return await token.get_token_account(provider, pubkey_token_account)
    except Exception as e:
        raise Exception(f"Getting Token Account Info {e}")


async def sign_and_send_transaction(ix, signers, network, async_client: bool = True, priority_fees: int = 0, extra_rpcs: List[str] = None):
    client = select_client(network=network, async_client=async_client)

    recent_blockhash_resp = await client.get_latest_blockhash()
    recent_blockhash = recent_blockhash_resp.value.blockhash
    recent_block_height = recent_blockhash_resp.value.last_valid_block_height
    block_height = (await client.get_block_height()).value
    attempts = 0

    print("Recent Block Height", recent_block_height, "Block Heigth",block_height)

    while True and attempts < 10:
        try:
            if block_height >= recent_block_height:
                break
            attempts += 1
            # Obtain a recent blockhash
            print("Attempt", attempts)
            # Create the transaction with the recent blockhash
            tx = Transaction(recent_blockhash=recent_blockhash)
            tx.add(ix)

            try:
                simulated_transaction_resp: SimulateTransactionResp = await client.simulate_transaction(tx)    
                if simulated_transaction_resp.value.err is not None:
                    error_tx: TransactionErrorInstructionError = simulated_transaction_resp.value.err 
                    error_tx_json : str = error_tx.to_json()  
                    error_tx_dict : dict = json.loads(error_tx_json)    
                    error: int = error_tx_dict[1]["Custom"]
                    if error >= 6000:
                        return from_code(error)
                else:
                    print("Simulation Looks OK")
            except (KeyError, Exception) as e:
                print(f"Error simulating transaction: {e}")                
                print("Retrying...")
                block_height = (await client.get_block_height()).value
                continue

            # Set compute unit limit
            cu_budget: int = simulated_transaction_resp.value.units_consumed * \
                15 // 10  # increase 50% of simulated CU's
            max_budget = 200_000 
            cu_set = min(cu_budget, max_budget) 
            modify_compute_units = set_compute_unit_limit(cu_set)
            tx.add(modify_compute_units)

            PRIORITY_FEE_IX = set_compute_unit_price(priority_fees)
            tx.add(PRIORITY_FEE_IX)

            try:
                tx_res = await client.send_transaction(tx, *signers)
                print(tx_res)
            except Exception as e:
                print(f"Error sending transaction: {e}")
                 
                raise

            if tx_res:
                print("Client Response tx signature: ", tx_res)
                print("Waiting for transaction confirmation")

                try:
                    signature_status = await client.confirm_transaction(tx_res.value, last_valid_block_height=recent_block_height)
                except Exception as e:
                    print(f"Error confirming transaction: {e}")
                    print("Retrying...")
                    block_height = (await client.get_block_height()).value
                    continue  # Continue to the next iteration of the loop

                if signature_status:
                    print("Confirm Transaction Status Value:", signature_status)
                    return signature_status.to_json()
        except RPCException as e:
            print(f"RPC exception happened: {e}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
