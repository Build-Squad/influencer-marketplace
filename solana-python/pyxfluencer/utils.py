from solders.keypair import Keypair
from solders.pubkey import Pubkey

from solana.rpc.api import Client
from solana.rpc.async_api import AsyncClient
import json

from solana.transaction import Transaction
from solana.rpc.core import RPCException

from solders.compute_budget import set_compute_unit_price, set_compute_unit_limit

import os

from anchorpy import Wallet, Provider
from anchorpy.utils import token
from anchorpy.utils.rpc import AccountInfo

import asyncio

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


async def sign_and_send_transaction(ix, signers, network, async_client: bool = True):
    max_attempts = 3
    wait_time = 2  # seconds

    for attempt in range(1, max_attempts + 1):
        try:
            client = select_client(network=network, async_client=async_client)

            # Obtain a recent blockhash
            recent_blockhash_resp = await client.get_latest_blockhash()
            recent_blockhash = recent_blockhash_resp.value.blockhash

            # Create the transaction with the recent blockhash
            tx = Transaction(recent_blockhash=recent_blockhash)

            PRIORITY_RATE = 500000  # MICRO_LAMPORTS
            PRIORITY_FEE_IX = set_compute_unit_price(PRIORITY_RATE)
            tx.add(PRIORITY_FEE_IX)

            # Set compute unit limit
            cu_set = 200_000
            modify_compute_units = set_compute_unit_limit(cu_set)
            tx.add(modify_compute_units)

            tx.add(ix)

            tx.fee_payer = signers[0].pubkey()

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
                    signature_status = await client.confirm_transaction(tx_res.value)
                except Exception as e:
                    print(f"Error confirming transaction: {e}")
                    raise

                if signature_status:

                    print("Confirm Transaction Status Value:", signature_status)
                    return signature_status.to_json()
        except RPCException as e:
            print(f"RPC exception happened: {e}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            if attempt < max_attempts:
                print(
                    f"Attempt {attempt} failed, retrying in {wait_time} seconds...")
                await asyncio.sleep(wait_time)
            else:
                print("Max attempts reached, giving up.")
                raise
