from solders.pubkey import Pubkey
from solana.rpc.types import TxOpts


from utils import get_local_keypair_pubkey
from utils import sign_and_send_transaction
from utils import load_configuration



def main():
    configuration = load_configuration()
    network = configuration["network"]
    program_id = configuration["program_id_testnet"] if configuration["network"] == "testnet" else configuration["program_id_devnet"]
    PROGRAM_ID = Pubkey.from_string(program_id)
    print(f"Network: {network} Program ID: {program_id}")

    path_to_influencer_keypair = "platform.json"
    platform, platform_pk = get_local_keypair_pubkey(path=path_to_bussines_keypair)
    
    # implement caller to validate escrow instruction
    # ....    


if __name__ == "__main__":
    main()