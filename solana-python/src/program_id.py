from solders.pubkey import Pubkey

def load_configuration(config_file="config.json"):
    import json
    with open(config_file,"r") as f:
        config_data = json.loads(f.read())
    return config_data

configuration = load_configuration()
program_id = configuration["program_id_testnet"] if configuration["network"] == "testnet" else configuration["program_id_devnet"]

PROGRAM_ID = Pubkey.from_string(program_id)
