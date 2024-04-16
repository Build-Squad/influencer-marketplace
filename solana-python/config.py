import os
from dataclasses import dataclass
from solders.pubkey import Pubkey

def load_configuration(config_file="config.json"):
    import json
    with open(config_file,"r") as f:
        config_data = json.loads(f.read())
    return config_data


configuration = load_configuration()
program_id = configuration["program_id"]["devnet"]
print("Program Id Selected From Configuration:", program_id)
PROGRAM_ID = Pubkey.from_string(program_id)


@dataclass
class KeypairPaths:
    home: str = os.getenv("HOME") + "/influencer-marketplace/solana-python/test_wallets"
    
    platform: str = "platform_EsYxpj9ADJyGEjMv3tyDpADv33jDPkv9uLymXWwQCiwH.json"
    validation_authority: str = f"{home}/{platform}"
    
    business: str = "business_6suvWCcjg5o7xgHrDGc4MXQxraK9PnZyEXzjhhQN6HUK.json"
    bussines_keypair: str = f"{home}/{business}"
    
    # my local business address for mainnet
    bussines_GQRD = f"{os.getenv('HOME')}/.config/solana/id.json"
    
    influencer: str = "influencer_94fznXq73oweXLrg2zL75XAMy9xNEbqtb191Xcrq97QA.json"
    influencer_keypair: str = f"{home}/{influencer}"

    # My custom private keypair for mainnet
    business_EBBR: str = "business_EBBR.json"
    bussines_EBBR_keypair: str = f"{home}/{business_EBBR}"

    


@dataclass
class SplTokens:
    usdc: str = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
    usdc_alt: str = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
